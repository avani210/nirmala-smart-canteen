import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        identifier,
        password
      });

      if (res.data.user.role !== 'admin') {
        setError('This login is for staff only');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 60px 80px, white, transparent), radial-gradient(1px 1px at 120px 40px, white, transparent)',
        backgroundSize: '300px 300px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-sm w-full shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-1">Staff Login</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Nirmala Smart Canteen</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Staff Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            required
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] active:scale-95 transition-transform duration-200"
          >
            Staff Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminLogin;