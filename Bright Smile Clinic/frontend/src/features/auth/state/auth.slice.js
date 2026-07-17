import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// Normalizes whatever authService throws into the { message, fieldErrors }
// shape the slice stores, so components can read state.auth.error /
// state.auth.fieldErrors regardless of which thunk failed.
function rejectWithAuthError(error, thunkAPI) {
  return thunkAPI.rejectWithValue({ message: error.message, fieldErrors: error.fieldErrors || null });
}

export const registerPatient = createAsyncThunk('auth/registerPatient', async (payload, thunkAPI) => {
  try {
    return await authService.registerPatient(payload);
  } catch (error) {
    return rejectWithAuthError(error, thunkAPI);
  }
});

export const loginPatient = createAsyncThunk('auth/loginPatient', async (payload, thunkAPI) => {
  try {
    return await authService.loginPatient(payload);
  } catch (error) {
    return rejectWithAuthError(error, thunkAPI);
  }
});

export const registerDoctor = createAsyncThunk('auth/registerDoctor', async (payload, thunkAPI) => {
  try {
    return await authService.registerDoctor(payload);
  } catch (error) {
    return rejectWithAuthError(error, thunkAPI);
  }
});

export const loginDoctor = createAsyncThunk('auth/loginDoctor', async (payload, thunkAPI) => {
  try {
    return await authService.loginDoctor(payload);
  } catch (error) {
    return rejectWithAuthError(error, thunkAPI);
  }
});

export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (payload, thunkAPI) => {
  try {
    return await authService.loginAdmin(payload);
  } catch (error) {
    return rejectWithAuthError(error, thunkAPI);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    return rejectWithAuthError(error, thunkAPI);
  }
});

// Silent check on app load to restore the session from the httpOnly cookie.
// Failure just means "not logged in" — never surfaced as a form error.
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    return await authService.getMe();
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.message, fieldErrors: null });
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  isPending: false, // true when a doctor login returned "awaiting approval"
  isLoading: false,
  isInitializing: true, // true until the initial getMe() on app load resolves
  error: null,
  fieldErrors: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      state.fieldErrors = null;
    },
    clearPending(state) {
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isInitializing = false;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });

    // Shared pending/fulfilled/rejected handling for the register/login thunks —
    // they all touch the same loading/error/user fields.
    const authThunks = [registerPatient, loginPatient, registerDoctor, loginDoctor, loginAdmin];
    for (const thunk of authThunks) {
      builder
        .addCase(thunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
          state.fieldErrors = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.isLoading = false;
          if (action.payload.pending) {
            // Doctor login while status is still "pending" — not a real session.
            state.isPending = true;
            return;
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload?.message || 'Something went wrong. Please try again.';
          state.fieldErrors = action.payload?.fieldErrors || null;
        });
    }
  },
});

export const { clearAuthError, clearPending } = authSlice.actions;
export default authSlice.reducer;
