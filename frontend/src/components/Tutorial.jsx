import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { completeTutorial } from '../store/authSlice'
import { FiArrowRight, FiCheck, FiGrid, FiPlusCircle, FiColumns } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  {
    icon: FiGrid,
    title: 'Welcome to Your Dashboard',
    description: "This is your central hub for tracking all your mutual fund investments. You'll see an overview of your portfolio performance, total invested value, and gain/loss at a glance.",
    color: 'from-primary-500 to-primary-700',
  },
  {
    icon: FiPlusCircle,
    title: 'Add Your Mutual Funds',
    description: 'Click "Add Fund" to add your mutual fund holdings. Enter the fund name, entry price, current NAV, number of units, and monthly price history.',
    color: 'from-accent-500 to-emerald-700',
  },
  {
    icon: FiColumns,
    title: 'Compare Funds',
    description: 'Use the comparison tool to compare any two mutual funds side-by-side with a normalized performance chart. Helps you see which fund has grown more relative to its starting price.',
    color: 'from-amber-500 to-orange-700',
  },
]

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0)
  const dispatch = useDispatch()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      dispatch(completeTutorial())
    }
  }

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl max-w-lg w-full p-8 relative overflow-hidden"
      >
        <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-linear-to-br ${step.color} opacity-10 blur-3xl`} />

        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-8 bg-primary-500'
                  : i < currentStep
                  ? 'w-4 bg-primary-500/40'
                  : 'w-4 bg-surface-700'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">{step.title}</h2>
            <p className="text-surface-200 leading-relaxed mb-8">{step.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <button
            onClick={() => dispatch(completeTutorial())}
            className="text-sm text-surface-200 hover:text-white transition-colors cursor-pointer"
          >
            Skip tutorial
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 cursor-pointer"
          >
            {currentStep < steps.length - 1 ? (
              <>Next <FiArrowRight className="w-4 h-4" /></>
            ) : (
              <>Get Started <FiCheck className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
