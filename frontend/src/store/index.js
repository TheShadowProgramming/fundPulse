import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mutualFundReducer from './mutualFundSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    funds: mutualFundReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
