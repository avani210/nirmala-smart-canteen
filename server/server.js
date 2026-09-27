const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const { protect, adminOnly } = require('./middleware/authMiddleware');
const foodRoutes = require('./routes/foodRoutes');
const app = express();
const orderRoutes = require('./routes/orderRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Nirmala Smart Canteen API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));