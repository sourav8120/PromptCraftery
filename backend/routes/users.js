const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = await User.create({ name, email, password });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        promptsUsed: user.promptsUsed,
        promptsLimit: user.subscription.promptsLimit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        promptsUsed: user.promptsUsed,
        promptsLimit: user.subscription.promptsLimit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        promptsUsed: user.promptsUsed,
        promptsLimit: user.subscription.promptsLimit
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Increment prompt usage
router.post('/increment-usage', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { promptId } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!promptId) {
      return res.status(400).json({ error: 'Prompt ID is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const limit = user.subscription?.promptsLimit || 5;
    if (!user.subscription) {
      user.subscription = { plan: 'free', status: 'active', promptsLimit: limit };
    }

    console.log(`\n📋 [USAGE CHECK] User: ${user.email}`);
    console.log(`   Limit: ${limit} | Used: ${user.promptsUsed} | Remaining: ${limit - user.promptsUsed}`);
    console.log(`   Copied Count: ${user.copiedPrompts?.length || 0}`);
    console.log(`   PromptID: ${promptId}`);

    if (!user.canAccessMorePrompts(promptId)) {
      console.log(`   ❌ BLOCKED: Cannot access more prompts`);
      return res.status(403).json({ 
        error: `You have used all ${limit} prompts! Please upgrade to continue.`,
        canAccess: false,
        promptsUsed: user.promptsUsed,
        promptsLimit: limit,
        remainingPrompts: 0
      });
    }

    const alreadyCopied = user.hasCopiedPrompt(promptId);
    console.log(`   Already copied: ${alreadyCopied}`);
    // If already copied, allow without counting
    if (alreadyCopied) {
      console.log(`   ✓ ALLOWED: Recopying (no count)`);
      return res.json({
        canAccess: true,
        promptsUsed: user.promptsUsed,
        promptsLimit: limit,
        remainingPrompts: limit - user.promptsUsed,
        alreadyCopied: true,
        countIncremented: false
      });
    }

    // Check if limit reached before recording new copy
    if (user.promptsUsed >= limit) {
      console.log(`   ❌ BLOCKED: Limit reached (${user.promptsUsed} >= ${limit})`);
      return res.status(403).json({ 
        error: `You have used all ${limit} prompts! Please upgrade to continue.`,
        canAccess: false,
        promptsUsed: user.promptsUsed,
        promptsLimit: limit,
        remainingPrompts: 0
      });
    }

    let countIncremented = false;
    if (!alreadyCopied) {
      console.log(`   📝 Recording copy...`);
      await user.recordPromptCopy(promptId);
      console.log(`   ✓ ALLOWED: New copy recorded (${user.promptsUsed}/${limit})`);
      countIncremented = true;
    }

    res.json({
      canAccess: true,
      promptsUsed: user.promptsUsed,
      promptsLimit: limit,
      remainingPrompts: limit - user.promptsUsed,
      alreadyCopied,
      countIncremented
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
