import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatWidget from './ChatWidget';

function Menu() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useState(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/food');
        setFoods(res.data);
      } catch {
        setError('Failed to load menu');
      }
    };
    fetchFoods();
  }, []);

  const addToCart = (food) => {
    const existing = cart.find((item) => item.foodId === food._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.foodId === food._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { foodId: food._id, name: food.name, price: food.price, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const goToCheckout = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/checkout');
  };

  const categoryEmoji = {
    tea: '🍵', coffee: '☕', snacks: '🥐', juice: '🥤', meals: '🍛'
  };

  return (
    <div className="min-h-screen bg-black px-4 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-1"
        >
          Menu
        </motion.h1>
        <p className="text-gray-400 mb-8">Nirmala Smart Canteen</p>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {foods.map((food, i) => (
            <motion.div
              key={food._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/25 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-3xl">{categoryEmoji[food.category] || '🍽️'}</span>
                <span className="text-white font-semibold">₹{food.price}</span>
              </div>
              <h3 className="text-white font-semibold text-lg">{food.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{food.description}</p>
              <button
                onClick={() => addToCart(food)}
                className="w-full py-2 rounded-xl bg-white text-black text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-transform duration-200"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>

        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky bottom-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">Cart ({cart.length} items)</h3>
              <span className="text-white font-bold text-lg">₹{cartTotal}</span>
            </div>
            {cart.map((item) => (
              <p key={item.foodId} className="text-gray-400 text-sm">
                {item.name} × {item.quantity} = ₹{item.price * item.quantity}
              </p>
            ))}
            <button
              onClick={goToCheckout}
              className="w-full mt-4 py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.01] active:scale-95 transition-transform duration-200"
            >
              Proceed to Checkout
            </button>
          </motion.div>
        )}
      </div>

      <ChatWidget />
    </div>
  );
}

export default Menu;