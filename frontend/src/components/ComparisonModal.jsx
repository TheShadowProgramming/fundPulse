import { memo, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { FiColumns, FiX } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

function ComparisonModal({ isOpen, onClose }) {
  const { funds } = useSelector((state) => state.funds);
  const [fund1Id, setFund1Id] = useState('');
  const [fund2Id, setFund2Id] = useState('');

  const fund1 = funds.find((f) => f.id === fund1Id);
  const fund2 = funds.find((f) => f.id === fund2Id);

  const handleClose = () => {
    setFund1Id('');
    setFund2Id('');
    onClose();
  };

  const chartData = useMemo(() => {
    if (!fund1?.prices?.length || !fund2?.prices?.length) return [];
    const p1 = [...fund1.prices].sort((a, b) => new Date(a.month) - new Date(b.month));
    const p2 = [...fund2.prices].sort((a, b) => new Date(a.month) - new Date(b.month));
    const maxLen = Math.max(p1.length, p2.length);
    const base1 = p1[0]?.price || 1;
    const base2 = p2[0]?.price || 1;

    const data = [];
    for (let i = 0; i < maxLen; i++) {
      const entry = {};
      if (p1[i]) {
        entry.month = new Date(p1[i].month).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
        entry[fund1.name] = parseFloat(((p1[i].price / base1) * 100).toFixed(2));
      }
      if (p2[i]) {
        if (!entry.month) entry.month = new Date(p2[i].month).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
        entry[fund2.name] = parseFloat(((p2[i].price / base2) * 100).toFixed(2));
      }
      data.push(entry);
    }
    return data;
  }, [fund1, fund2]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass rounded-2xl max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-violet-700 flex items-center justify-center">
                <FiColumns className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">Compare Funds</h2>
                <p className="text-xs text-surface-200">Side-by-side performance of two mutual funds</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-lg text-surface-200 hover:text-white hover:bg-white/5 cursor-pointer">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-surface-200 mb-1.5 font-medium">Fund 1</label>
              <select
                value={fund1Id}
                onChange={(e) => setFund1Id(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value="">Select a fund...</option>
                {funds.map((f) => (
                  <option key={f.id} value={f.id} disabled={f.id === fund2Id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-surface-200 mb-1.5 font-medium">Fund 2</label>
              <select
                value={fund2Id}
                onChange={(e) => setFund2Id(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value="">Select a fund...</option>
                {funds.map((f) => (
                  <option key={f.id} value={f.id} disabled={f.id === fund1Id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {fund1 && fund2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[fund1, fund2].map((f, i) => (
                  <div key={f.id} className={`glass-light rounded-xl p-4 ${i === 0 ? 'border-l-2 border-primary-500' : 'border-l-2 border-accent-500'}`}>
                    <h4 className="text-sm font-semibold text-white truncate">{f.name}</h4>
                    <p className="text-xs text-surface-200 mt-1">{f.category}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-lg font-bold text-white">{formatCurrency(f.currentPrice * f.units)}</p>
                      <p className={`text-xs font-medium ${f.gainLossPercent >= 0 ? 'text-accent-400' : 'text-danger-400'}`}>
                        {formatPercent(f.gainLossPercent)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {chartData.length > 0 && (
                <div className="glass-light rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Normalized Performance (Base = 100)</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', fontSize: '12px' }}
                          labelStyle={{ color: '#94a3b8' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey={fund1.name} stroke="#6366f1" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey={fund2.name} stroke="#34d399" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(ComparisonModal);
