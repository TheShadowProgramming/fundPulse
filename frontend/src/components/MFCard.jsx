import { memo, useMemo, useState, useEffect, useRef } from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { FiTrendingUp, FiTrendingDown, FiMoreVertical, FiTrash2, FiEdit3 } from 'react-icons/fi';
import { motion } from 'framer-motion';

function MFCard({ fund, onEdit, onDelete, index = 0 }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const gainLossPercent = useMemo(() => {
    return ((fund.currentPrice - fund.entryPrice) / fund.entryPrice) * 100;
  }, [fund.currentPrice, fund.entryPrice]);

  const currentValue = useMemo(() => {
    return fund.currentPrice * fund.units;
  }, [fund.currentPrice, fund.units]);

  const isPositive = gainLossPercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-light rounded-xl p-5 hover:border-primary-500/30 transition-all duration-300 group relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate pr-2">{fund.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20">
              {fund.category}
            </span>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-lg text-surface-200 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <FiMoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 glass rounded-lg py-1 w-36 z-10 shadow-xl border border-surface-700/50">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(fund); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-surface-200 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <FiEdit3 className="w-3.5 h-3.5" /> Edit Fund
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(fund.id); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger-400 hover:bg-danger-400/10 cursor-pointer"
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-surface-200 mb-0.5">Current Value</p>
            <p className="text-lg font-bold text-white">{formatCurrency(currentValue)}</p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
            isPositive ? 'bg-accent-500/10 text-accent-400' : 'bg-danger-500/10 text-danger-400'
          }`}>
            {isPositive ? <FiTrendingUp className="w-3.5 h-3.5" /> : <FiTrendingDown className="w-3.5 h-3.5" />}
            {formatPercent(gainLossPercent)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-700/30">
          <div>
            <p className="text-xs text-surface-200">Invested</p>
            <p className="text-sm font-medium text-white">{formatCurrency(fund.investedAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-surface-200">Units</p>
            <p className="text-sm font-medium text-white">{fund.units.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs text-surface-200">Entry NAV</p>
            <p className="text-sm font-medium text-white">₹{fund.entryPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-surface-200">Current NAV</p>
            <p className="text-sm font-medium text-white">₹{fund.currentPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(MFCard);
