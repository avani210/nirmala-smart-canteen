import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Checkout() {
  const [pickupTime, setPickupTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in first');
      return;
    }

    try {
      const items = cart.map((item) => ({ foodId: item.foodId, quantity: item.quantity }));

      await axios.post(
        'http://localhost:5000/api/orders',
        { items, pickupTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Order placed successfully!');
      localStorage.removeItem('cart');
      setTimeout(() => navigate('/menu'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 60px 80px, white, transparent)',
        backgroundSize: '300px 300px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md w-full shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-8">Checkout</h2>

        {cart.length === 0 ? (
          <p className="text-gray-400 text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-1 mb-4">
              {cart.map((item) => (
                <p key={item.foodId} className="text-gray-300 text-sm">
                  {item.name} × {item.quantity} = ₹{item.price * item.quantity}
                </p>
              ))}
            </div>
            <p className="text-white font-bold text-lg mb-6">Total: ₹{total}</p>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <input
                type="text"
                placeholder="Pickup Time (e.g. 11:30 AM)"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                required
              />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              {success && <p className="text-green-400 text-sm text-center">{success}</p>}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] active:scale-95 transition-transform duration-200"
              >
                Place Order
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Checkout;