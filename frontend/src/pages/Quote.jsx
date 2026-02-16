import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Quote() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate submit (no backend endpoint for email yet)
    setTimeout(() => {
      setLoading(false);
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
      toast.success('Quote request received. We\'ll get back to you within 24 hours.');
    }, 800);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Request a quote</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Describe your project and we’ll send a detailed quote.</p>
      </motion.div>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-800/50 p-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-4 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-4 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-4 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project details</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-4 py-2.5" placeholder="Flow rate, capacity, layout preferences..." />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary-500 text-white py-3 font-semibold hover:bg-primary-600 disabled:opacity-50">
          {loading ? 'Sending...' : 'Submit request'}
        </button>
      </motion.form>
    </div>
  );
}
