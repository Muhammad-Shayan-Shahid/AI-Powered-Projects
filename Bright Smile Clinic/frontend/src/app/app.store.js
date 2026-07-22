import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.slice';
import bookingReducer from '../features/booking/state/booking.slice';
import doctorReducer from '../features/doctor/state/doctor.slice';
import adminReducer from '../features/admin/state/admin.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    doctor: doctorReducer,
    admin: adminReducer,
  },
});
