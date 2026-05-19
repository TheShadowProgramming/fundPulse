import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import { FiMail, FiLock, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white">Fund<span className="text-primary-400">Pulse</span></span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-surface-200/70">Sign in to access your portfolio analytics</p>
        </div>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-surface-200 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/50" />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-danger-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-200 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/50" />
              <input
                {...register('password')}
                type="password"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-danger-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Sign In <FiArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-surface-200/70 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login
