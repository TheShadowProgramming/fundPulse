import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFunds, deleteFund, clearSuccessMessage, clearFundsError } from '../store/mutualFundSlice';
import MFCard from '../components/MFCard';
import ComparisonModal from '../components/ComparisonModal';
import DeleteModal from '../components/DeleteModal';
import Tutorial from '../components/Tutorial';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { FiPlus, FiColumns, FiTrendingUp, FiDollarSign, FiPieChart, FiActivity, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { funds, loading, successMessage, error } = useSelector((state) => state.funds);
  const [showComparison, setShowComparison] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchFunds());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearSuccessMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleEditFund = useCallback((fund) => {
    navigate(`/mutual-funds/edit/${fund.id}`);
  }, [navigate]);

  const handleDeleteFund = useCallback((id) => {
    setDeleteTarget(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      dispatch(deleteFund(deleteTarget));
      setDeleteTarget(null);
    }
  }, [deleteTarget, dispatch]);

  const portfolioSummary = useMemo(() => {
    if (!funds.length) return { totalInvested: 0, totalValue: 0, totalGainLoss: 0, totalGainLossPercent: 0 };
    const totalInvested = funds.reduce((acc, f) => acc + f.investedAmount, 0);
    const totalValue = funds.reduce((acc, f) => acc + f.currentPrice * f.units, 0);
    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
    return { totalInvested, totalValue, totalGainLoss, totalGainLossPercent };
  }, [funds]);

  const showTutorial = user && !user.hasCompletedTutorial;

  return (
    <div className="min-h-screen bg-surface-950 pt-20 pb-12">
      {showTutorial && <Tutorial />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 px-4 py-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-accent-400 shrink-0" />
              {successMessage}
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 px-4 py-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </span>
              <button
                onClick={() => { dispatch(clearFundsError()); dispatch(fetchFunds()); }}
                className="flex items-center gap-1 text-xs underline underline-offset-2 hover:text-danger-300 transition-colors cursor-pointer shrink-0"
              >
                <FiRefreshCw className="w-3 h-3" /> Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              Welcome back, {user?.firstName || 'Investor'} 👋
            </h1>
            <p className="text-sm text-surface-200/70 mt-1">
              Here&apos;s your portfolio at a glance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComparison(true)}
              disabled={funds.length < 2}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-surface-200 glass rounded-lg hover:border-primary-500/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <FiColumns className="w-4 h-4" />
              Compare
            </button>
            <button
              onClick={() => navigate('/mutual-funds/new')}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              Add Fund
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Invested', value: formatCurrency(portfolioSummary.totalInvested), icon: FiDollarSign, color: 'from-primary-500 to-primary-700' },
            { label: 'Current Value', value: formatCurrency(portfolioSummary.totalValue), icon: FiPieChart, color: 'from-violet-500 to-purple-700' },
            { label: 'Total Gain/Loss', value: formatCurrency(portfolioSummary.totalGainLoss), icon: FiTrendingUp, color: portfolioSummary.totalGainLoss >= 0 ? 'from-accent-500 to-emerald-700' : 'from-danger-500 to-rose-700' },
            { label: 'Return %', value: formatPercent(portfolioSummary.totalGainLossPercent), icon: FiActivity, color: portfolioSummary.totalGainLossPercent >= 0 ? 'from-accent-500 to-emerald-700' : 'from-danger-500 to-rose-700' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-light rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${card.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-surface-200 font-medium">{card.label}</span>
                </div>
                <p className="text-xl font-bold text-white">{card.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-white">Your Funds ({funds.length})</h2>
          </div>

          {loading && !funds.length ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : funds.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-light rounded-xl p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                <FiPieChart className="w-8 h-8 text-primary-500/50" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No mutual funds yet</h3>
              <p className="text-sm text-surface-200/60 mb-6">Add your first mutual fund to start tracking your portfolio.</p>
              <button
                onClick={() => navigate('/mutual-funds/new')}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all cursor-pointer"
              >
                <FiPlus className="w-4 h-4" /> Add Your First Fund
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {funds.map((fund, i) => (
                <MFCard
                  key={fund.id}
                  fund={fund}
                  index={i}
                  onEdit={handleEditFund}
                  onDelete={handleDeleteFund}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ComparisonModal isOpen={showComparison} onClose={() => setShowComparison(false)} />
      <DeleteModal
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  );
}

export default memo(Dashboard);
