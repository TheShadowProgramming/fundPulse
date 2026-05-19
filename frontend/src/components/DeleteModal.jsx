import { memo } from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function DeleteModal({ isOpen, onCancel, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass rounded-2xl max-w-sm w-full p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
              <FiTrash2 className="w-5 h-5 text-danger-400" />
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg text-surface-200 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-lg font-display font-bold text-white mb-2">Delete Mutual Fund</h3>
          <p className="text-sm text-surface-200/70 mb-6">
            This will permanently delete the fund and all its price history. This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-surface-200 glass rounded-lg hover:text-white hover:border-surface-600 disabled:opacity-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-danger-600 hover:bg-danger-500 rounded-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><FiTrash2 className="w-4 h-4" /> Delete</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(DeleteModal);
