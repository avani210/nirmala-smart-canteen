const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post('http://localhost:8000/chat', { message });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Chatbot service error', error: err.message });
  }
});

module.exports = router;