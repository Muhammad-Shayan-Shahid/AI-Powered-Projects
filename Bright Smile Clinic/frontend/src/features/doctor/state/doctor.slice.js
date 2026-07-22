import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorService } from '../services/doctorService';

// Normalizes whatever doctorService throws into the { message, fieldErrors }
// shape the slice stores, so components can read the failure details
// regardless of which thunk failed.
function rejectWithDoctorError(error, thunkAPI) {
  return thunkAPI.rejectWithValue({ message: error.message, fieldErrors: error.fieldErrors || null });
}

export const fetchDoctorStats = createAsyncThunk('doctor/fetchStats', async (_, thunkAPI) => {
  try {
    return await doctorService.getStats();
  } catch (error) {
    return rejectWithDoctorError(error, thunkAPI);
  }
});

export const fetchDoctorAppointments = createAsyncThunk('doctor/fetchAppointments', async (_, thunkAPI) => {
  try {
    return await doctorService.listAppointments();
  } catch (error) {
    return rejectWithDoctorError(error, thunkAPI);
  }
});

export const confirmAppointment = createAsyncThunk('doctor/confirmAppointment', async (id, thunkAPI) => {
  try {
    const data = await doctorService.confirmAppointment(id);
    return { id, appointment: data.appointment };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const rejectAppointment = createAsyncThunk('doctor/rejectAppointment', async ({ id, reason }, thunkAPI) => {
  try {
    const data = await doctorService.rejectAppointment(id, reason);
    return { id, appointment: data.appointment };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const fetchAvailability = createAsyncThunk('doctor/fetchAvailability', async (_, thunkAPI) => {
  try {
    return await doctorService.listAvailability();
  } catch (error) {
    return rejectWithDoctorError(error, thunkAPI);
  }
});

export const createAvailability = createAsyncThunk('doctor/createAvailability', async (payload, thunkAPI) => {
  try {
    return await doctorService.createAvailability(payload);
  } catch (error) {
    return rejectWithDoctorError(error, thunkAPI);
  }
});

export const updateAvailability = createAsyncThunk('doctor/updateAvailability', async ({ id, payload }, thunkAPI) => {
  try {
    const data = await doctorService.updateAvailability(id, payload);
    return { id, availability: data.availability };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

export const deleteAvailability = createAsyncThunk('doctor/deleteAvailability', async (id, thunkAPI) => {
  try {
    await doctorService.deleteAvailability(id);
    return { id };
  } catch (error) {
    return thunkAPI.rejectWithValue({ id, message: error.message });
  }
});

const initialState = {
  stats: null,
  isLoadingStats: false,
  statsError: null,

  appointments: [],
  isLoadingAppointments: false,
  appointmentsError: null,

  actioningIds: [], // appointment ids currently being confirmed/rejected
  actionError: null,

  availability: [],
  isLoadingAvailability: false,
  availabilityError: null,
  savingAvailabilityIds: [],

  isSavingProfile: false,
  profileError: null,
  // Real upload percentage (0-100), driven by uploadRequest's XHR progress
  // event — see doctorService.uploadProfile and ProfileEdit.jsx. Not a thunk
  // lifecycle field: profile upload is dispatched as plain actions instead of
  // a createAsyncThunk so the onProgress callback (a function) never has to
  // travel through a thunk arg, which Redux Toolkit's serializableCheck flags.
  profileUploadProgress: 0,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearActionError(state) {
      state.actionError = null;
    },
    clearAvailabilityError(state) {
      state.availabilityError = null;
    },
    clearProfileError(state) {
      state.profileError = null;
    },
    profileUploadStarted(state) {
      state.isSavingProfile = true;
      state.profileError = null;
      state.profileUploadProgress = 0;
    },
    profileUploadProgressed(state, action) {
      state.profileUploadProgress = action.payload;
    },
    profileUploadSucceeded(state) {
      state.isSavingProfile = false;
      state.profileUploadProgress = 100;
    },
    profileUploadFailed(state, action) {
      state.isSavingProfile = false;
      state.profileError = action.payload || 'Could not update profile.';
      state.profileUploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorStats.pending, (state) => {
        state.isLoadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchDoctorStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDoctorStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.statsError = action.payload?.message || 'Could not load stats.';
      })

      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.isLoadingAppointments = true;
        state.appointmentsError = null;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.isLoadingAppointments = false;
        state.appointments = action.payload.appointments;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.isLoadingAppointments = false;
        state.appointmentsError = action.payload?.message || 'Could not load appointments.';
      })

      // Confirm/reject don't refetch the list — they patch the matching
      // appointment's status in place, so pages that filter by status (e.g.
      // Appointment Requests filtering for "pending") see the card disappear
      // as soon as the request resolves, without a round trip.
      .addCase(confirmAppointment.pending, (state, action) => {
        state.actioningIds.push(action.meta.arg);
        state.actionError = null;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        state.actioningIds = state.actioningIds.filter((id) => id !== action.payload.id);
        const idx = state.appointments.findIndex((a) => a._id === action.payload.id);
        if (idx !== -1) state.appointments[idx] = action.payload.appointment;
      })
      .addCase(confirmAppointment.rejected, (state, action) => {
        state.actioningIds = state.actioningIds.filter((id) => id !== action.payload?.id);
        state.actionError = action.payload?.message || 'Could not confirm this appointment.';
      })

      .addCase(rejectAppointment.pending, (state, action) => {
        state.actioningIds.push(action.meta.arg.id);
        state.actionError = null;
      })
      .addCase(rejectAppointment.fulfilled, (state, action) => {
        state.actioningIds = state.actioningIds.filter((id) => id !== action.payload.id);
        const idx = state.appointments.findIndex((a) => a._id === action.payload.id);
        if (idx !== -1) state.appointments[idx] = action.payload.appointment;
      })
      .addCase(rejectAppointment.rejected, (state, action) => {
        state.actioningIds = state.actioningIds.filter((id) => id !== action.payload?.id);
        state.actionError = action.payload?.message || 'Could not reject this appointment.';
      })

      .addCase(fetchAvailability.pending, (state) => {
        state.isLoadingAvailability = true;
        state.availabilityError = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.isLoadingAvailability = false;
        state.availability = action.payload.availability;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.isLoadingAvailability = false;
        state.availabilityError = action.payload?.message || 'Could not load availability.';
      })

      .addCase(createAvailability.fulfilled, (state, action) => {
        state.availability.push(action.payload.availability);
      })
      .addCase(createAvailability.rejected, (state, action) => {
        state.availabilityError = action.payload?.message || 'Could not save availability.';
      })

      .addCase(updateAvailability.pending, (state, action) => {
        state.savingAvailabilityIds.push(action.meta.arg.id);
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.savingAvailabilityIds = state.savingAvailabilityIds.filter((id) => id !== action.payload.id);
        const idx = state.availability.findIndex((a) => a._id === action.payload.id);
        if (idx !== -1) state.availability[idx] = action.payload.availability;
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.savingAvailabilityIds = state.savingAvailabilityIds.filter((id) => id !== action.payload?.id);
        state.availabilityError = action.payload?.message || 'Could not save availability.';
      })

      .addCase(deleteAvailability.fulfilled, (state, action) => {
        state.availability = state.availability.filter((a) => a._id !== action.payload.id);
      })
      .addCase(deleteAvailability.rejected, (state, action) => {
        state.availabilityError = action.payload?.message || 'Could not save availability.';
      });
  },
});

export const {
  clearActionError,
  clearAvailabilityError,
  clearProfileError,
  profileUploadStarted,
  profileUploadProgressed,
  profileUploadSucceeded,
  profileUploadFailed,
} = doctorSlice.actions;
export default doctorSlice.reducer;
