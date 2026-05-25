const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

// Verify Google token and create/update user
router.post('/verify-google-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Verify token with Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );

    const { email, name, picture } = response.data;

    if (!email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google' });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with free tier
      user = new User({
        name: name || email.split('@')[0],
        email: email,
        password: Math.random().toString(36).slice(-12), // Random password for OAuth users
        subscription: {
          plan: 'free',
          status: 'active',
          promptsLimit: 5
        },
        promptsUsed: 0,
        copiedPrompts: []
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        promptsUsed: user.promptsUsed,
        copiedPrompts: user.copiedPrompts || []
      }
    });
  } catch (error) {
    console.error('Google token verification error:', error.message);
    res.status(400).json({ 
      error: 'Invalid Google token',
      details: error.message 
    });
  }
});

module.exports = router;
