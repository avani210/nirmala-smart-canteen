const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Food = require('../models/Food');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Place a new order (student only — must be logged in)
router.post('/', protect, async (req, res) => {
  try {
    const { items, pickupTime } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ message: `Food item not found: ${item.foodId}` });
      }
      const itemTotal = food.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        food: food._id,
        quantity: item.quantity,
        priceAtOrder: food.price
      });
    }

    const newOrder = new Order({
      student: req.user.id,
      items: orderItems,
      totalAmount,
      pickupTime
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get logged-in student's own orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user.id })
      .populate('items.food', 'name price category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all orders (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('student', 'name email')
      .populate('items.food', 'name price category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;