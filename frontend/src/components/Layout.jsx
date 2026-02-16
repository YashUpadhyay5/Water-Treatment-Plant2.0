import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-surface-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-display font-semibold text-xl">
              <span className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-sm">H</span>
              Hydromaterials
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition">Home</Link>
              <Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition">Pricing</Link>
              <Link to="/quote" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition">Get Quote</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition">Dashboard</Link>
                  <Link to="/designer" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition">3D Designer</Link>
                  {user.role === 'admin' && <Link to="/admin" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition">Admin</Link>}
                  <button onClick={() => { logout(); navigate('/'); }} className="text-slate-600 dark:text-slate-400 hover:text-red-500 transition">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition">Login</Link>
                  <Link to="/register" className="rounded-lg bg-primary-500 text-white px-4 py-2 hover:bg-primary-600 transition">Sign up</Link>
                </>
              )}
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Toggle theme">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </nav>
            <div className="flex items-center gap-2 md:hidden">
              <button onClick={toggleTheme} className="p-2 rounded-lg"> {theme === 'dark' ? '☀️' : '🌙'} </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">☰</button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-900 px-4 py-3 flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
              <Link to="/quote" onClick={() => setMobileOpen(false)}>Get Quote</Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link to="/designer" onClick={() => setMobileOpen(false)}>3D Designer</Link>
                  {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
                  <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Sign up</Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4">© {new Date().getFullYear()} Hydromaterials. Water Treatment Plant Design & Engineering.</div>
      </footer>
    </div>
  );
}
