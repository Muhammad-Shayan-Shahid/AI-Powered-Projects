import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  registerPatient,
  loginPatient,
  registerDoctor,
  loginDoctor,
  loginAdmin,
  logout,
  getMe,
  clearAuthError,
  clearPending,
} from '../state/auth.slice';

// Wraps the auth slice so pages never touch dispatch/thunks directly.
export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isPending: auth.isPending,
    isLoading: auth.isLoading,
    isInitializing: auth.isInitializing,
    error: auth.error,
    fieldErrors: auth.fieldErrors,

    registerPatient: useCallback((payload) => dispatch(registerPatient(payload)), [dispatch]),
    loginPatient: useCallback((payload) => dispatch(loginPatient(payload)), [dispatch]),
    registerDoctor: useCallback((payload) => dispatch(registerDoctor(payload)), [dispatch]),
    loginDoctor: useCallback((payload) => dispatch(loginDoctor(payload)), [dispatch]),
    loginAdmin: useCallback((payload) => dispatch(loginAdmin(payload)), [dispatch]),
    logout: useCallback(() => dispatch(logout()), [dispatch]),
    getMe: useCallback(() => dispatch(getMe()), [dispatch]),
    clearAuthError: useCallback(() => dispatch(clearAuthError()), [dispatch]),
    clearPending: useCallback(() => dispatch(clearPending()), [dispatch]),
  };
}
