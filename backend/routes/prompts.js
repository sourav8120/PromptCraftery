const express = require('express');
const router = express.Router();
const Prompt = require('../models/Prompt');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET all prompts (public) with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, tags, difficulty, aiModel, featured, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    if (tags) {
      query.tags = { $in: tags.split(',').map(t => t.trim().toLowerCase()) };
    }
    if (difficulty) query.difficulty = difficulty;
    if (aiModel) query.aiModel = aiModel;
    if (featured === 'true') query.isFeatured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Prompt.countDocuments(query);

    const prompts = await Prompt.find(query)
      .populate('category', 'name slug icon color')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      prompts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single prompt by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const prompt = await Prompt.findOneAndUpdate(
      { slug: req.params.slug, isActive: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('category', 'name slug icon color');

    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });
    res.json({ prompt });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST increment copy count (public)
router.post('/:id/copy', async (req, res) => {
  try {
    await Prompt.findByIdAndUpdate(req.params.id, { $inc: { copies: 1 } });
    res.json({ message: 'Copy count updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST like (authenticated)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    // Check if user has already liked
    const hasLiked = prompt.likedBy.includes(userId);
    
    if (hasLiked) {
      // Unlike
      await Prompt.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: -1 }, $pull: { likedBy: userId } },
        { new: true }
      );
      res.json({ likes: prompt.likes - 1, liked: false, message: 'Unliked' });
    } else {
      // Like
      await Prompt.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 }, $push: { likedBy: userId } },
        { new: true }
      );
      res.json({ likes: prompt.likes + 1, liked: true, message: 'Liked' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST upload prompt result image (admin)
router.post('/:id/upload-image', protect, upload.single('resultImage'), async (req, res) => {
  try {
    console.log('Upload request received for prompt:', req.params.id);
    console.log('File received:', req.file);
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const imageUrl = `${backendUrl}/uploads/prompts/${req.file.filename}`;
    
    console.log('Saving image URL:', imageUrl);
    
    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { resultImage: imageUrl },
      { new: true }
    ).populate('category', 'name slug icon color');

    if (!prompt) {
      console.error('Prompt not found:', req.params.id);
      return res.status(404).json({ error: 'Prompt not found' });
    }

    console.log('Image uploaded successfully for prompt:', prompt.title);

    res.json({ 
      message: 'Image uploaded successfully',
      prompt,
      imageUrl
    });
  } catch (err) {
    console.error('Upload error:', err);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      const fs = require('fs');
      fs.unlink(req.file.path, (e) => {
        if (e) console.error('Error deleting file:', e);
      });
    }
    
    res.status(400).json({ error: err.message || 'Image upload failed' });
  }
});

// POST create prompt (admin)
router.post('/', protect, async (req, res) => {
  try {
    const prompt = await Prompt.create(req.body);
    // Update category prompt count
    await Category.findByIdAndUpdate(req.body.category, { $inc: { promptCount: 1 } });
    const populated = await prompt.populate('category', 'name slug icon color');
    res.status(201).json({ prompt: populated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update prompt (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name slug icon color');
    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });
    res.json({ prompt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE prompt (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndDelete(req.params.id);
    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });
    await Category.findByIdAndUpdate(prompt.category, { $inc: { promptCount: -1 } });
    res.json({ message: 'Prompt deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
