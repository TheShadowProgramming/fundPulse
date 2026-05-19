import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import { FiTrendingUp, FiLogOut, FiGrid, FiUser } from 'react-icons/fi'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
              <FiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white tracking-tight">
              Fund<span className="text-primary-400">Pulse</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-200 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <FiGrid className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/mutual-funds/new"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-200 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  Add Fund
                </Link>
                <div className="w-px h-6 bg-surface-700 mx-1" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                    <FiUser className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-surface-200">
                    {user?.firstName || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger-400 hover:bg-danger-400/10 rounded-lg transition-colors cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-surface-200 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-lg transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-surface-200 hover:text-white hover:bg-white/5 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-surface-700/50 mt-2 pt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-surface-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/mutual-funds/new"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-surface-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Add Fund
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-danger-400 hover:bg-danger-400/10 rounded-lg transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-surface-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 rounded-lg text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
