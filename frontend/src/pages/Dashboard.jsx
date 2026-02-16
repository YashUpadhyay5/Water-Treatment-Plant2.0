import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { wtpApi } from '../lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wtpApi.list()
      .then(setDesigns)
      .catch(() => toast.error('Failed to load designs'))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    wtpApi.delete(id)
      .then(() => {
        setDesigns((d) => d.filter((x) => x._id !== id));
        toast.success('Design deleted');
      })
      .catch(() => toast.error('Delete failed'));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Welcome, {user?.name || 'User'}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Manage your WTP designs and create new ones.</p>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/designer"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-500 text-white px-6 py-3 font-semibold hover:bg-primary-600 transition"
        >
          + New design
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">Saved designs</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        ) : designs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-12 text-center text-slate-500 dark:text-slate-400">
            No designs yet. <Link to="/designer" className="text-primary-500 hover:underline">Create your first design</Link>.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {designs.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800 p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-medium text-slate-900 dark:text-white truncate">{d.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {d.flowRate} m³/h · {d.numberOfTanks} tanks · {d.layoutType}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/designer/${d._id}`} className="rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">
                    Open
                  </Link>
                  <button onClick={() => handleDelete(d._id, d.name)} className="rounded-lg text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5">
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
