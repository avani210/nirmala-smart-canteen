const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all food items (students browsing menu — public, no login needed)
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single food item by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add new food item (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stockQuantity } = req.body;

    const newFood = new Food({
      name,
      description,
      price,
      category,
      imageUrl,
      stockQuantity
    });

    await newFood.save();
    res.status(201).json({ message: 'Food item added successfully', food: newFood });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update food item (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ message: 'Food item updated successfully', food: updatedFood });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete food item (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;