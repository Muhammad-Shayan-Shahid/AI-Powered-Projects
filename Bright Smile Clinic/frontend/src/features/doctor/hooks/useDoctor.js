import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoctorStats,
  fetchDoctorAppointments,
  confirmAppointment,
  rejectAppointment,
  fetchAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  clearActionError,
  clearAvailabilityError,
  clearProfileError,
  profileUploadStarted,
  profileUploadProgressed,
  profileUploadSucceeded,
  profileUploadFailed,
} from '../state/doctor.slice';
import { doctorService } from '../services/doctorService';

// Wraps the doctor slice so pages never touch dispatch/thunks directly.
export function useDoctor() {
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctor);

  return {
    stats: doctor.stats,
    isLoadingStats: doctor.isLoadingStats,
    statsError: doctor.statsError,

    appointments: doctor.appointments,
    isLoadingAppointments: doctor.isLoadingAppointments,
    appointmentsError: doctor.appointmentsError,

    actioningIds: doctor.actioningIds,
    actionError: doctor.actionError,

    availability: doctor.availability,
    isLoadingAvailability: doctor.isLoadingAvailability,
    availabilityError: doctor.availabilityError,
    savingAvailabilityIds: doctor.savingAvailabilityIds,

    isSavingProfile: doctor.isSavingProfile,
    profileError: doctor.profileError,
    profileUploadProgress: doctor.profileUploadProgress,

    fetchDoctorStats: useCallback(() => dispatch(fetchDoctorStats()), [dispatch]),
    fetchDoctorAppointments: useCallback(() => dispatch(fetchDoctorAppointments()), [dispatch]),
    confirmAppointment: useCallback((id) => dispatch(confirmAppointment(id)), [dispatch]),
    rejectAppointment: useCallback((id, reason) => dispatch(rejectAppointment({ id, reason })), [dispatch]),

    fetchAvailability: useCallback(() => dispatch(fetchAvailability()), [dispatch]),
    createAvailability: useCallback((payload) => dispatch(createAvailability(payload)), [dispatch]),
    updateAvailability: useCallback((id, payload) => dispatch(updateAvailability({ id, payload })), [dispatch]),
    deleteAvailability: useCallback((id) => dispatch(deleteAvailability(id)), [dispatch]),

    // Bypasses the usual thunk pattern: uploadProfile needs a live onProgress
    // callback tied to this specific XHR, and a function can't safely travel
    // through a createAsyncThunk arg (Redux Toolkit's serializableCheck flags
    // it). Progress instead flows through plain profileUpload* actions.
    uploadProfile: useCallback(
      async (formData) => {
        dispatch(profileUploadStarted());
        try {
          const data = await doctorService.uploadProfile(formData, (percent) => dispatch(profileUploadProgressed(percent)));
          dispatch(profileUploadSucceeded());
          return data;
        } catch (error) {
          dispatch(profileUploadFailed(error.message));
          throw error;
        }
      },
      [dispatch]
    ),

    clearActionError: useCallback(() => dispatch(clearActionError()), [dispatch]),
    clearAvailabilityError: useCallback(() => dispatch(clearAvailabilityError()), [dispatch]),
    clearProfileError: useCallback(() => dispatch(clearProfileError()), [dispatch]),
  };
}
