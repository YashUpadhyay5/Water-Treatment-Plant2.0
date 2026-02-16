import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WaterScene from '../components/WaterScene';

export default function Landing() {
  return (
    <div className="relative">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <WaterScene />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg"
          >
            Water Treatment Plant
            <span className="block text-primary-300">Design & Engineering</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto"
          >
            Hydromaterials delivers end-to-end engineering solutions — from 3D design to manufacturing. Build your WTP visually and get a quote in minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/quote"
              className="rounded-xl bg-primary-500 text-white px-8 py-4 font-semibold hover:bg-primary-400 transition shadow-lg hover:shadow-primary-500/30"
            >
              Get Quote
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-white/10 text-white border border-white/30 px-8 py-4 font-semibold hover:bg-white/20 transition backdrop-blur"
            >
              Try 3D Designer
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50 dark:bg-surface-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Why Hydromaterials</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: '3D Visual Design', desc: 'Interactive WTP designer with real-time parameters: flow rate, tanks, pipes, layout.' },
              { title: 'Engineering Grade', desc: 'Specifications suitable for real plants. Export models and share with your team.' },
              { title: 'Faster Quotes', desc: 'Submit your design and receive a detailed quote. No endless back-and-forth.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">Testimonials</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">Trusted by utilities and industrial clients worldwide.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { quote: 'The 3D designer cut our approval cycle in half.', name: 'Sarah K.', role: 'Project Manager, AquaTech' },
              { quote: 'Finally a tool that matches how we think about WTP layout.', name: 'James L.', role: 'Lead Engineer' },
              { quote: 'Quick quotes and clear specs. Exactly what we needed.', name: 'Maria R.', role: 'Procurement Director' },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-100 dark:bg-surface-800 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 italic">"{t.quote}"</p>
                <p className="mt-3 font-medium text-slate-900 dark:text-white">{t.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold">Ready to design your plant?</h2>
          <p className="mt-2 text-primary-100">Create an account and start building in the 3D designer.</p>
          <Link to="/register" className="inline-block mt-6 rounded-xl bg-white text-primary-600 px-8 py-3 font-semibold hover:bg-primary-50 transition">
            Sign up free
          </Link>
        </div>
      </section>
    </div>
  );
}
