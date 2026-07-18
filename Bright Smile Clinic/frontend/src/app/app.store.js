import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.slice';
import bookingReducer from '../features/booking/state/booking.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
  },
});
