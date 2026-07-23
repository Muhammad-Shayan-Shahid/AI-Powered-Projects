import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../services/bookingService';

// Normalizes whatever bookingService throws into the { message, fieldErrors,
// status } shape the slice stores, so components can read the failure
// details regardless of which thunk failed.
function rejectWithBookingError(error, thunkAPI) {
  return thunkAPI.rejectWithValue({ message: error.message, fieldErrors: error.fieldErrors || null, status: error.status });
}

export const fetchServices = createAsyncThunk('booking/fetchServices', async (_, thunkAPI) => {
  try {
    return await bookingService.listServices();
  } catch (error) {
    return rejectWithBookingError(error, thunkAPI);
  }
});

// `service` is optional — omitted, this returns every active doctor (used by
// Home/BookAppointment); passed, the backend filters by specialization.
export const fetchDoctors = createAsyncThunk('booking/fetchDoctors', async (service, thunkAPI) => {
  try {
    return await bookingService.listDoctors(service);
  } catch (error) {
    return rejectWithBookingError(error, thunkAPI);
  }
});

export const fetchDoctorById = createAsyncThunk('booking/fetchDoctorById', async (id, thunkAPI) => {
  try {
    return await bookingService.getDoctor(id);
  } catch (error) {
    return rejectWithBookingError(error, thunkAPI);
  }
});

export const fetchAvailableSlots = createAsyncThunk('booking/fetchAvailableSlots', async (params, thunkAPI) => {
  try {
    return await bookingService.getAvailableSlots(params);
  } catch (error) {
    return rejectWithBookingError(error, thunkAPI);
  }
});

// 409 (slot conflict) is a normal, expected outcome here — not a crash — so
// the thunk still resolves via rejectWithValue and the slice flags
// `bookingConflict` instead of leaving a raw error for the UI to interpret.
export const createAppointment = createAsyncThunk('booking/createAppointment', async (payload, thunkAPI) => {
  try {
    return await bookingService.createAppointment(payload);
  } catch (error) {
    return rejectWithBookingError(error, thunkAPI);
  }
});

export const fetchMyAppointments = createAsyncThunk('booking/fetchMyAppointments', async (_, thunkAPI) => {
  try {
    return await bookingService.listMyAppointments();
  } catch (error) {
    return rejectWithBookingError(error, thunkAPI);
  }
});

export const cancelAppointment = createAsyncThunk('booking/cancelAppointment', async (id, thunkAPI) => {
  try {
    const data = await bookingService.cancelAppointment(id);
    return { id, appointment: data.appointment };
  } catch (error) {
    return rejectWithBookingError(error, thunkAPI);
  }
});

const initialState = {
  services: [],
  doctors: [],
  isLoadingCatalog: false,
  catalogError: null,

  selectedDoctor: null,
  isLoadingDoctor: false,
  doctorError: null,

  slots: [],
  isLoadingSlots: false,
  slotsError: null,

  isBooking: false,
  bookingError: null,
  bookingConflict: false,

  appointments: [],
  isLoadingAppointments: false,
  appointmentsError: null,

  cancelingId: null,
  cancelError: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearSlots(state) {
      state.slots = [];
      state.slotsError = null;
    },
    clearBookingConflict(state) {
      state.bookingConflict = false;
      state.bookingError = null;
    },
    clearSelectedDoctor(state) {
      state.selectedDoctor = null;
      state.doctorError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoadingCatalog = true;
        state.catalogError = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoadingCatalog = false;
        state.services = action.payload.services;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoadingCatalog = false;
        state.catalogError = action.payload?.message || 'Could not load services.';
      })

      .addCase(fetchDoctors.pending, (state) => {
        state.isLoadingCatalog = true;
        state.catalogError = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoadingCatalog = false;
        state.doctors = action.payload.doctors;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoadingCatalog = false;
        state.catalogError = action.payload?.message || 'Could not load doctors.';
      })

      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoadingDoctor = true;
        state.doctorError = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.isLoadingDoctor = false;
        state.selectedDoctor = action.payload.doctor;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoadingDoctor = false;
        state.selectedDoctor = null;
        state.doctorError = action.payload?.message || 'Could not load this doctor.';
      })

      .addCase(fetchAvailableSlots.pending, (state) => {
        state.isLoadingSlots = true;
        state.slotsError = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.isLoadingSlots = false;
        state.slots = action.payload.slots;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.isLoadingSlots = false;
        state.slots = [];
        state.slotsError = action.payload?.message || 'Could not load available times.';
      })

      .addCase(createAppointment.pending, (state) => {
        state.isBooking = true;
        state.bookingError = null;
        state.bookingConflict = false;
      })
      .addCase(createAppointment.fulfilled, (state) => {
        state.isBooking = false;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isBooking = false;
        state.bookingError = action.payload?.message || 'Something went wrong. Please try again.';
        state.bookingConflict = action.payload?.status === 409;
      })

      .addCase(fetchMyAppointments.pending, (state) => {
        state.isLoadingAppointments = true;
        state.appointmentsError = null;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.isLoadingAppointments = false;
        state.appointments = action.payload.appointments;
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.isLoadingAppointments = false;
        state.appointmentsError = action.payload?.message || 'Could not load your appointments.';
      })

      .addCase(cancelAppointment.pending, (state, action) => {
        state.cancelingId = action.meta.arg;
        state.cancelError = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.cancelingId = null;
        const idx = state.appointments.findIndex((a) => a._id === action.payload.id);
        if (idx !== -1) state.appointments[idx] = action.payload.appointment;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.cancelingId = null;
        state.cancelError = action.payload?.message || 'Could not cancel this appointment.';
      });
  },
});

export const { clearSlots, clearBookingConflict, clearSelectedDoctor } = bookingSlice.actions;
export default bookingSlice.reducer;
