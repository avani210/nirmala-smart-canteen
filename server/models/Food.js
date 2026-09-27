const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['tea', 'coffee', 'snacks', 'juice', 'meals'],
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);