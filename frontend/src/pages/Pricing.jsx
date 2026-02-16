import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const plans = [
  { name: 'Starter', price: 'Free', desc: 'Try the 3D designer and save up to 3 designs.', features: ['3 saved designs', '3D designer access', 'Basic export'], cta: 'Get started', href: '/register', primary: false },
  { name: 'Professional', price: '$99', period: '/month', desc: 'For teams and frequent projects.', features: ['Unlimited designs', 'GLB export', 'Priority quote', 'Email support'], cta: 'Start trial', href: '/register', primary: true },
  { name: 'Enterprise', price: 'Custom', desc: 'Dedicated engineering and SLA.', features: ['Everything in Pro', 'Dedicated CSM', 'On-prem option', 'SLA'], cta: 'Contact sales', href: '/quote', primary: false },
];

export default function Pricing() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Pricing plans</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Choose the right plan for your team.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-6 ${plan.primary ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800'}`}
          >
            <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white">{plan.name}</h2>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{plan.price}{plan.period}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{plan.desc}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">✓ {f}</li>
              ))}
            </ul>
            <Link
              to={plan.href}
              className={`mt-6 block text-center rounded-lg py-3 font-semibold transition ${plan.primary ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'}`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
