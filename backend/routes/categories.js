const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Prompt = require('../models/Prompt');
const { protect } = require('../middleware/auth');

// GET all active categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    
    // Get prompt count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const promptCount = await Prompt.countDocuments({ category: cat._id, isActive: true });
        return {
          ...cat.toObject(),
          promptCount
        };
      })
    );
    
    res.json({ categories: categoriesWithCounts });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single category by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    // Get prompt count for this category
    const promptCount = await Prompt.countDocuments({ category: category._id, isActive: true });
    
    res.json({ category: { ...category.toObject(), promptCount } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create category (admin)
router.post('/', protect, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Category already exists' });
    res.status(400).json({ error: err.message });
  }
});

// PUT update category (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE category (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
