import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFund, updateFund } from '../store/mutualFundSlice';
import { FiSave, FiPlus, FiTrash2, FiArrowLeft, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const categories = [
  'Equity',
  'Debt',
  'Hybrid',
  'Solution Oriented',
  'Index Fund',
  'ELSS',
  'Liquid',
  'Other',
];

const fundSchema = z.object({
  name: z.string().min(1, 'Fund name is required').max(200),
  category: z.enum(categories),
  entryPrice: z.coerce.number().positive('Must be positive'),
  currentPrice: z.coerce.number().positive('Must be positive'),
  units: z.coerce.number().positive('Must be positive'),
  investedAmount: z.coerce.number().positive('Must be positive'),
  prices: z
    .array(
      z.object({
        month: z.string().min(1, 'Month is required'),
        price: z.coerce.number().positive('Price must be positive'),
      })
    )
    .min(2, 'At least 2 monthly prices are required'),
});

function MutualFundEditor() {
  const { id } = useParams();
  const isEditing = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { funds } = useSelector((state) => state.funds);
  const [submitting, setSubmitting] = useState(false);

  const existingFund = isEditing ? funds.find((f) => f.id === id) : null;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fundSchema),
    defaultValues: {
      name: '',
      category: 'Equity',
      entryPrice: '',
      currentPrice: '',
      units: '',
      investedAmount: '',
      prices: [
        { month: '', price: '' },
        { month: '', price: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'prices' });

  useEffect(() => {
    if (existingFund) {
      setValue('name', existingFund.name);
      setValue('category', existingFund.category);
      setValue('entryPrice', existingFund.entryPrice);
      setValue('currentPrice', existingFund.currentPrice);
      setValue('units', existingFund.units);
      setValue('investedAmount', existingFund.investedAmount);
      if (existingFund.prices?.length) {
        const formattedPrices = existingFund.prices.map((p) => ({
          month: new Date(p.month).toISOString().slice(0, 7),
          price: p.price,
        }));
        setValue('prices', formattedPrices);
      }
    }
  }, [existingFund, setValue]);

  // auto calculate invested amount when entry price or units changes
  const entryPrice = watch('entryPrice');
  const units = watch('units');
  useEffect(() => {
    const ep = parseFloat(entryPrice);
    const u = parseFloat(units);
    if (ep > 0 && u > 0) {
      setValue('investedAmount', parseFloat((ep * u).toFixed(2)));
    }
  }, [entryPrice, units, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const formattedData = {
      ...data,
      prices: data.prices.map((p) => ({
        month: `${p.month}-01`,
        price: p.price,
      })),
    };

    let result;
    if (isEditing) {
      result = await dispatch(updateFund({ id, data: formattedData }));
    } else {
      result = await dispatch(addFund(formattedData));
    }

    if (!result.error) {
      setTimeout(() => navigate('/dashboard'), 500);
    } else {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-surface-200 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            {isEditing ? 'Edit Mutual Fund' : 'Add Mutual Fund'}
          </h1>
          <p className="text-sm text-surface-200/70 mb-8">
            {isEditing
              ? 'Update your mutual fund details and price history'
              : 'Enter your mutual fund details and monthly NAV history'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Fund Details</h2>

              <div>
                <label className="block text-xs font-medium text-surface-200 mb-1.5">Fund Name</label>
                <input
                  {...register('name')}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="e.g. Axis Bluechip Fund - Growth"
                />
                {errors.name && <p className="text-xs text-danger-400 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-200 mb-1.5">Category</label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-danger-400 mt-1">{errors.category.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-200 mb-1.5">Entry NAV (₹)</label>
                  <input
                    {...register('entryPrice')}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="45.50"
                  />
                  {errors.entryPrice && <p className="text-xs text-danger-400 mt-1">{errors.entryPrice.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-200 mb-1.5">Current NAV (₹)</label>
                  <input
                    {...register('currentPrice')}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="62.30"
                  />
                  {errors.currentPrice && <p className="text-xs text-danger-400 mt-1">{errors.currentPrice.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-200 mb-1.5">Units Held</label>
                  <input
                    {...register('units')}
                    type="number"
                    step="0.001"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="100.000"
                  />
                  {errors.units && <p className="text-xs text-danger-400 mt-1">{errors.units.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-200 mb-1.5">Total Invested (₹) <span className="text-surface-200/40">auto</span></label>
                  <input
                    {...register('investedAmount')}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-800/30 border border-surface-700/50 text-surface-200 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Auto-calculated"
                  />
                  {errors.investedAmount && <p className="text-xs text-danger-400 mt-1">{errors.investedAmount.message}</p>}
                </div>
              </div>
            </div>
            <div className="border-t border-surface-700/30" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Monthly NAV History</h2>
                  <p className="text-xs text-surface-200/50 mt-0.5">Add at least 2 months for comparison</p>
                </div>
                <button
                  type="button"
                  onClick={() => append({ month: '', price: '' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-400 hover:text-primary-300 glass rounded-lg hover:border-primary-500/30 transition-all cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" /> Add Month
                </button>
              </div>

              {errors.prices?.root && (
                <p className="text-xs text-danger-400 mb-3">{errors.prices.root.message}</p>
              )}
              {errors.prices?.message && (
                <p className="text-xs text-danger-400 mb-3">{errors.prices.message}</p>
              )}

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 glass-light rounded-lg p-3"
                  >
                    <div className="flex-1">
                      <label className="block text-xs text-surface-200/60 mb-1">
                        <FiCalendar className="inline w-3 h-3 mr-1" />
                        Month
                      </label>
                      <input
                        {...register(`prices.${index}.month`)}
                        type="month"
                        className="w-full px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                      />
                      {errors.prices?.[index]?.month && (
                        <p className="text-xs text-danger-400 mt-0.5">{errors.prices[index].month.message}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-surface-200/60 mb-1">NAV (₹)</label>
                      <input
                        {...register(`prices.${index}.price`)}
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm placeholder:text-surface-200/30 focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="50.00"
                      />
                      {errors.prices?.[index]?.price && (
                        <p className="text-xs text-danger-400 mt-0.5">{errors.prices[index].price.message}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fields.length > 2 && remove(index)}
                      disabled={fields.length <= 2}
                      className="mt-6 p-2 rounded-lg text-surface-200 hover:text-danger-400 hover:bg-danger-400/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 text-sm font-medium text-surface-200 glass rounded-lg hover:text-white hover:border-surface-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-primary-600 to-primary-500 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    {isEditing ? 'Update Fund' : 'Add Fund'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default MutualFundEditor
