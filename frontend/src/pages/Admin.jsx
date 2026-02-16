import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { adminApi } from '../lib/api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    Promise.all([adminApi.users(), adminApi.designs(), adminApi.analytics()])
      .then(([u, d, a]) => {
        setUsers(u);
        setDesigns(d);
        setAnalytics(a);
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    adminApi.deleteUser(id).then(() => {
      setUsers((list) => list.filter((x) => x._id !== id));
      toast.success('User deleted');
    }).catch((e) => toast.error(e.message));
  };

  const deleteDesign = (id) => {
    if (!window.confirm('Delete this design?')) return;
    adminApi.deleteDesign(id).then(() => {
      setDesigns((list) => list.filter((x) => x._id !== id));
      toast.success('Design deleted');
    }).catch((e) => toast.error(e.message));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="skeleton h-10 w-48 rounded mb-6" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Admin panel</h1>
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        {['overview', 'users', 'designs'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`capitalize px-4 py-2 rounded-t-lg font-medium ${tab === t ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && analytics && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800 p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.userCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800 p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total designs</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.designCount}</p>
            </div>
            {analytics.designsByLayout?.map((x) => (
              <div key={x._id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Layout: {x._id}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{x.count}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800 p-4">
            <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-3">Recent designs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Flow</th>
                    <th className="pb-2">Tanks</th>
                  </tr>
                </thead>
                <tbody>
                  {(analytics.recentDesigns || []).slice(0, 10).map((d) => (
                    <tr key={d._id} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-2 text-slate-900 dark:text-white">{d.name}</td>
                      <td className="py-2 text-slate-600 dark:text-slate-400">{d.userId?.email}</td>
                      <td className="py-2">{d.flowRate} m³/h</td>
                      <td className="py-2">{d.numberOfTanks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="p-3 text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="p-3">{u.companyName || '—'}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400' : 'bg-slate-200 dark:bg-slate-600'}`}>{u.role}</span></td>
                    <td className="p-3">
                      <button onClick={() => deleteUser(u._id, u.name)} className="text-red-600 dark:text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {tab === 'designs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Name</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Flow / Tanks / Layout</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {designs.map((d) => (
                  <tr key={d._id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="p-3 text-slate-900 dark:text-white">{d.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{d.userId?.email || d.userId}</td>
                    <td className="p-3">{d.flowRate} m³/h · {d.numberOfTanks} tanks · {d.layoutType}</td>
                    <td className="p-3">
                      <button onClick={() => deleteDesign(d._id)} className="text-red-600 dark:text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
