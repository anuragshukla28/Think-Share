import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import articleReducer from '../features/article/articleSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    article: articleReducer,
  },
});

export default store;
