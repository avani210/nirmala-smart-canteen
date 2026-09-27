import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Scene3D from '../components/Scene3D';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <Scene3D />
      </div>

      {/* Starfield dots */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 60px 80px, white, transparent), radial-gradient(1px 1px at 120px 40px, white, transparent), radial-gradient(1px 1px at 180px 120px, white, transparent), radial-gradient(1px 1px at 250px 60px, white, transparent)',
        backgroundSize: '300px 300px'
      }} />

      {/* Glowing ring */}
      <motion.div
        className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.4), rgba(120,160,255,0.5), transparent)',
          filter: 'blur(40px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full border-2"
        style={{
          borderImage: 'conic-gradient(from 0deg, rgba(255,255,255,0.7), rgba(120,160,255,0.7), rgba(255,255,255,0.7)) 1',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 tracking-widest text-xs md:text-sm font-medium mb-4 uppercase"
        >
          Nirmala College
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl md:text-6xl font-bold text-white mb-10"
        >
          Smart Canteen
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex gap-4"
        >
          <button
            onClick={() => navigate('/student-login')}
            className="px-8 py-3 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate('/admin-login')}
            className="px-8 py-3 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Staff / Admin Login
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;