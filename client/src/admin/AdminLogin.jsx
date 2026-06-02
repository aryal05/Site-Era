import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
      // Shake animation on error
      const form = document.getElementById('login-form');
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-royal-500 rounded-full blur-[150px] opacity-10 animate-float" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold-500 rounded-full blur-[150px] opacity-10 animate-float-slow" />

      <motion.div
        id="login-form"
        className="card-luxury p-10 rounded-2xl w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-royal">SITE</span>
            <span className="text-white"> ERA</span>
          </h1>
          <p className="text-platinum-400">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-display text-sm">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-platinum-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-luxury-100 border border-royal-500/20 rounded-lg pl-12 pr-4 py-3 text-white focus:border-royal-500 focus:outline-none transition-colors"
                placeholder="admin@siteera.com.np"
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 font-display text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-platinum-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-luxury-100 border border-royal-500/20 rounded-lg pl-12 pr-4 py-3 text-white focus:border-royal-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-400 p-4 rounded-lg text-center border border-red-500/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-luxury text-white py-4 rounded-full font-display font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-platinum-400 text-sm mt-6">
          Default: admin@siteera.com.np / SiteEra@Admin2024
        </p>
        
        <div className="text-center mt-4">
          <a href="/" className="text-platinum-400 hover:text-royal-400 transition-colors text-sm">
            ← Back to Site
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
