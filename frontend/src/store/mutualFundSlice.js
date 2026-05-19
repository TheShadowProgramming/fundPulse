import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchFunds = createAsyncThunk('funds/fetchFunds', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/mutual-funds');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Failed to fetch funds' });
  }
});

export const addFund = createAsyncThunk('funds/addFund', async (fundData, { rejectWithValue }) => {
  try {
    const response = await api.post('/mutual-funds', fundData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Failed to add fund' });
  }
});

export const updateFund = createAsyncThunk('funds/updateFund', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/mutual-funds/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Failed to update fund' });
  }
});

export const deleteFund = createAsyncThunk('funds/deleteFund', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/mutual-funds/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Failed to delete fund' });
  }
});

const initialState = {
  funds: [],
  loading: false,
  error: null,
  successMessage: null,
};

const mutualFundSlice = createSlice({
  name: 'funds',
  initialState,
  reducers: {
    clearFundsError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = action.payload.funds;
      })
      .addCase(fetchFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch funds';
      });

    builder
      .addCase(addFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFund.fulfilled, (state, action) => {
        state.loading = false;
        state.funds.unshift(action.payload.fund);
        state.successMessage = 'Mutual fund added successfully';
      })
      .addCase(addFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to add fund';
      });

    builder
      .addCase(updateFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFund.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.funds.findIndex((f) => f.id === action.payload.fund.id);
        if (index !== -1) {
          state.funds[index] = action.payload.fund;
        }
        state.successMessage = 'Mutual fund updated successfully';
      })
      .addCase(updateFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update fund';
      });

    builder
      .addCase(deleteFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFund.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = state.funds.filter((f) => f.id !== action.payload);
        state.successMessage = 'Mutual fund deleted successfully';
      })
      .addCase(deleteFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete fund';
      });
  },
});

export const { clearFundsError, clearSuccessMessage } = mutualFundSlice.actions;
export default mutualFundSlice.reducer;
