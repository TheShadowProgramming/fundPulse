import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Landing() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center animated-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl float" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary-600/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent-400 pulse-dot" />
              Smart Portfolio Analytics Platform
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-tight mb-6"
            >
              <span className="text-white">Know the</span>{' '}
              <span className="gradient-text">True Strength</span>
              <br />
              <span className="text-white">of Your Mutual Funds</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-surface-200/80 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Track your mutual fund portfolio and get a single normalized score
              that tells you how strong each fund really is.

              Simple attempt to make a full stack app in the domain of company so showcase my skills, I hope I get selected 🤞
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 rounded-xl shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] transition-all duration-300"
                >
                  Check Dashboard
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 rounded-xl shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] transition-all duration-300"
                  >
                    Get Started
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-8 py-4 text-base font-medium text-surface-200 hover:text-white glass rounded-xl hover:border-primary-500/30 transition-all duration-300"
                  >
                    Log In
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      <footer className="border-t border-surface-700/30 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-display font-bold text-white">Fund<span className="text-primary-400">Pulse</span></span>
          </div>
          <p className="text-xs text-surface-200/50">© {new Date().getFullYear()} FundPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing
