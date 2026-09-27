import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('tea');
  const [stockQuantity, setStockQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [forecastDay, setForecastDay] = useState('Monday');
  const [forecastWeekend, setForecastWeekend] = useState(0);
  const [forecastWeather, setForecastWeather] = useState('sunny');
  const [forecastItem, setForecastItem] = useState('Masala Tea');
  const [forecastResult, setForecastResult] = useState(null);
  const [forecastError, setForecastError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const token = localStorage.getItem('token');

  const fetchFoods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/food');
      setFoods(res.data);
    } catch {
      setError('Failed to load food items');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch {
      setError('Failed to load orders');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFoods();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFood = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(
        'http://localhost:5000/api/food',
        { name, description, price: Number(price), category, stockQuantity: Number(stockQuantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Food item added');
      setName('');
      setDescription('');
      setPrice('');
      setStockQuantity('');
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add food item');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:5000/api/food/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Food item deleted');
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete food item');
    }
  };

  const toggleAvailability = async (food) => {
    setError('');
    try {
      await axios.put(
        `http://localhost:5000/api/food/${food._id}`,
        { isAvailable: !food.isAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFoods();
    } catch {
      setError('Failed to update item');
    }
  };

  const handleForecast = async (e) => {
    e.preventDefault();
    setForecastError('');
    setForecastResult(null);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/forecast/predict',
        {
          day_of_week: forecastDay,
          is_weekend: forecastWeekend,
          weather: forecastWeather,
          item: forecastItem
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForecastResult(res.data);
    } catch (err) {
      setForecastError(err.response?.data?.message || 'Failed to get prediction');
    }
  };

  const startEdit = (food) => {
    setEditingId(food._id);
    setEditName(food.name);
    setEditPrice(food.price);
  };

  const saveEdit = async (id) => {
    setError('');
    try {
      await axios.put(
        `http://localhost:5000/api/food/${id}`,
        { name: editName, price: Number(editPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchFoods();
    } catch {
      setError('Failed to update item');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setError('');
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch {
      setError('Failed to update order status');
    }
  };

  const statusFlow = {
    pending: 'accepted',
    accepted: 'preparing',
    preparing: 'ready',
    ready: 'completed'
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors";
  const cardStyle = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6";

  return (
    <div className="min-h-screen bg-black px-4 py-10 md:px-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Nirmala Smart Canteen</p>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {success && <p className="text-green-400 mb-4">{success}</p>}

        {/* Forecast panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardStyle} mb-8`}
        >
          <h2 className="text-white font-semibold text-lg mb-4">AI Demand Forecast</h2>
          <form onSubmit={handleForecast} className="flex flex-wrap gap-3 items-center">
            <select value={forecastDay} onChange={(e) => setForecastDay(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d) => (
                <option key={d} value={d} className="bg-black">{d}</option>
              ))}
            </select>
            <select value={forecastWeekend} onChange={(e) => setForecastWeekend(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
              <option value={0} className="bg-black">Weekday</option>
              <option value={1} className="bg-black">Weekend</option>
            </select>
            <select value={forecastWeather} onChange={(e) => setForecastWeather(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
              <option value="sunny" className="bg-black">Sunny</option>
              <option value="rainy" className="bg-black">Rainy</option>
              <option value="cloudy" className="bg-black">Cloudy</option>
              <option value="cold" className="bg-black">Cold</option>
            </select>
            <select value={forecastItem} onChange={(e) => setForecastItem(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
              <option value="Masala Tea" className="bg-black">Masala Tea</option>
              <option value="Filter Coffee" className="bg-black">Filter Coffee</option>
              <option value="Veg Puff" className="bg-black">Veg Puff</option>
              <option value="Mango Juice" className="bg-black">Mango Juice</option>
            </select>
            <button type="submit" className="px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:scale-105 active:scale-95 transition-transform">
              Predict
            </button>
          </form>
          {forecastError && <p className="text-red-400 text-sm mt-3">{forecastError}</p>}
          {forecastResult && (
            <p className="text-white mt-4">
              Predicted demand for <strong>{forecastResult.item}</strong>: <strong>{forecastResult.predicted_quantity} units</strong>
            </p>
          )}
        </motion.div>

        {/* Orders */}
        <h2 className="text-white font-semibold text-lg mb-4">Orders</h2>
        {orders.length === 0 && <p className="text-gray-500 mb-8">No orders yet.</p>}
        <div className="space-y-3 mb-10">
          {orders.map((order) => (
            <div key={order._id} className={cardStyle}>
              <p className="text-white text-sm"><span className="text-gray-400">Student:</span> {order.student?.name} ({order.student?.email})</p>
              <p className="text-white text-sm mb-2"><span className="text-gray-400">Pickup:</span> {order.pickupTime} · <span className="text-gray-400">Total:</span> ₹{order.totalAmount}</p>
              <ul className="text-gray-400 text-sm mb-3">
                {order.items.map((item) => (
                  <li key={item._id}>{item.food?.name} × {item.quantity}</li>
                ))}
              </ul>
              <p className="text-sm mb-3">
                <span className="text-gray-400">Status: </span>
                <span className="text-white font-semibold uppercase">{order.status}</span>
              </p>
              <div className="flex gap-2">
                {statusFlow[order.status] && (
                  <button onClick={() => updateOrderStatus(order._id, statusFlow[order.status])}
                    className="px-4 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:scale-105 transition-transform">
                    Mark as {statusFlow[order.status]}
                  </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'completed' && (
                  <button onClick={() => updateOrderStatus(order._id, 'cancelled')}
                    className="px-4 py-1.5 rounded-lg border border-red-500/50 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Food management */}
        <h2 className="text-white font-semibold text-lg mb-4">Food Management</h2>
        <form onSubmit={handleAddFood} className={`${cardStyle} mb-6 space-y-3`}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} required />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className={inputStyle} />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className={inputStyle} required />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputStyle}>
            <option value="tea" className="bg-black">Tea</option>
            <option value="coffee" className="bg-black">Coffee</option>
            <option value="snacks" className="bg-black">Snacks</option>
            <option value="juice" className="bg-black">Juice</option>
            <option value="meals" className="bg-black">Meals</option>
          </select>
          <input type="number" placeholder="Stock Quantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className={inputStyle} required />
          <button type="submit" className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.01] active:scale-95 transition-transform">
            Add Item
          </button>
        </form>

        <div className="space-y-2">
          {foods.map((food) => (
            <div key={food._id} className={`${cardStyle} ${!food.isAvailable ? 'opacity-40' : ''}`}>
              {editingId === food._id ? (
                <div className="flex flex-wrap gap-2 items-center">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`${inputStyle} flex-1`} />
                  <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className={`${inputStyle} w-24`} />
                  <button onClick={() => saveEdit(food._id)} className="px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl border border-white/20 text-white text-sm">Cancel</button>
                </div>
              ) : (
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="text-white text-sm">
                    <strong>{food.name}</strong> ({food.category}) — ₹{food.price} — Stock: {food.stockQuantity}
                    {!food.isAvailable && <span className="text-red-400"> (Hidden)</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(food)} className="px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs hover:bg-white/10">Edit</button>
                    <button onClick={() => toggleAvailability(food)} className="px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs hover:bg-white/10">
                      {food.isAvailable ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handleDelete(food._id)} className="px-3 py-1.5 rounded-lg border border-red-500/50 text-red-400 text-xs hover:bg-red-500/10">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;