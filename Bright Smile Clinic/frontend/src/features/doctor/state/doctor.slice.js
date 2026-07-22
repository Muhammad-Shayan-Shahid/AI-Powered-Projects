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

export const updateDoctorProfile = createAsyncThunk('doctor/updateProfile', async (payload, thunkAPI) => {
  try {
    return await doctorService.updateProfile(payload);
  } catch (error) {
    return rejectWithDoctorError(error, thunkAPI);
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
      })

      .addCase(updateDoctorProfile.pending, (state) => {
        state.isSavingProfile = true;
        state.profileError = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state) => {
        state.isSavingProfile = false;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.isSavingProfile = false;
        state.profileError = action.payload?.message || 'Could not update profile.';
      });
  },
});

export const { clearActionError, clearAvailabilityError, clearProfileError } = doctorSlice.actions;
export default doctorSlice.reducer;
