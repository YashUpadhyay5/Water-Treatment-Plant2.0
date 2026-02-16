import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { wtpApi } from '../lib/api';
import WtpScene from '../components/WtpScene';

const defaultParams = { name: 'Untitled design', flowRate: 100, numberOfTanks: 4, pipeDiameter: 50, layoutType: 'compact' };

export default function Designer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useState(defaultParams);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    wtpApi.get(id)
      .then((d) => setParams({ name: d.name, flowRate: d.flowRate, numberOfTanks: d.numberOfTanks, pipeDiameter: d.pipeDiameter, layoutType: d.layoutType || 'compact' }))
      .catch(() => toast.error('Failed to load design'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = useCallback(() => {
    setSaving(true);
    const body = { name: params.name, flowRate: Number(params.flowRate), numberOfTanks: Number(params.numberOfTanks), pipeDiameter: Number(params.pipeDiameter), layoutType: params.layoutType };
    (id ? wtpApi.update(id, body) : wtpApi.create(body))
      .then((design) => {
        toast.success(id ? 'Design updated' : 'Design saved');
        if (!id) navigate(`/designer/${design._id}`, { replace: true });
      })
      .catch((e) => toast.error(e.message || 'Save failed'))
      .finally(() => setSaving(false));
  }, [id, params, navigate]);

  const handleScreenshot = useCallback(() => {
    const container = canvasRef.current;
    if (!container) return;
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `wtp-${params.name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Screenshot saved');
  }, [params.name]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="skeleton w-16 h-16 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] min-h-[500px]">
        <div className="lg:w-2/3 h-[400px] lg:h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
          <WtpScene
            flowRate={Number(params.flowRate) || 100}
            numberOfTanks={Number(params.numberOfTanks) || 4}
            pipeDiameter={Number(params.pipeDiameter) || 50}
            layoutType={params.layoutType || 'compact'}
            canvasRef={canvasRef}
          />
        </div>
        <div className="lg:w-1/3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-800 p-4 overflow-y-auto">
          <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-4">Design parameters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project name</label>
              <input
                type="text"
                value={params.name}
                onChange={(e) => setParams((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="My WTP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Flow rate (m³/h)</label>
              <input
                type="number"
                min={1}
                step={10}
                value={params.flowRate}
                onChange={(e) => setParams((p) => ({ ...p, flowRate: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of tanks</label>
              <input
                type="number"
                min={1}
                max={20}
                value={params.numberOfTanks}
                onChange={(e) => setParams((p) => ({ ...p, numberOfTanks: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pipe diameter (mm)</label>
              <input
                type="number"
                min={10}
                step={5}
                value={params.pipeDiameter}
                onChange={(e) => setParams((p) => ({ ...p, pipeDiameter: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Layout</label>
              <select
                value={params.layoutType}
                onChange={(e) => setParams((p) => ({ ...p, layoutType: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-900 px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="compact">Compact</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button onClick={handleSave} disabled={saving} className="w-full rounded-lg bg-primary-500 text-white py-2.5 font-semibold hover:bg-primary-600 disabled:opacity-50">
              {saving ? 'Saving...' : id ? 'Update design' : 'Save design'}
            </button>
            <button onClick={handleScreenshot} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 py-2.5 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              Screenshot
            </button>
            <button onClick={() => navigate('/dashboard')} className="w-full rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 py-2.5">
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
