import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-800/50 p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-500 text-white py-3 font-semibold hover:bg-primary-600 disabled:opacity-50 transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center text-slate-600 dark:text-slate-400 text-sm">
          Don't have an account? <Link to="/register" className="text-primary-500 hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
