import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSubmitting: false,
  isSuccess: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setSubmitting(state, action) {
      state.isSubmitting = action.payload;
    },
    setSuccess(state, action) {
      state.isSuccess = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetAppointmentState(state) {
      state.isSubmitting = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
});

export const { setSubmitting, setSuccess, setError, resetAppointmentState } =
  appointmentSlice.actions;
export default appointmentSlice.reducer;
