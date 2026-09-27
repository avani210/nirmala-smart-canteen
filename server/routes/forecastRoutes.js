const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/predict', protect, adminOnly, async (req, res) => {
  try {
    const { day_of_week, is_weekend, weather, item } = req.body;

    const response = await axios.post('http://localhost:8000/predict', {
      day_of_week,
      is_weekend,
      weather,
      item
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Prediction service error', error: err.message });
  }
});

module.exports = router;