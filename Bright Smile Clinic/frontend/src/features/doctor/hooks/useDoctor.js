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
  updateDoctorProfile,
  clearActionError,
  clearAvailabilityError,
  clearProfileError,
} from '../state/doctor.slice';

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

    fetchDoctorStats: useCallback(() => dispatch(fetchDoctorStats()), [dispatch]),
    fetchDoctorAppointments: useCallback(() => dispatch(fetchDoctorAppointments()), [dispatch]),
    confirmAppointment: useCallback((id) => dispatch(confirmAppointment(id)), [dispatch]),
    rejectAppointment: useCallback((id, reason) => dispatch(rejectAppointment({ id, reason })), [dispatch]),

    fetchAvailability: useCallback(() => dispatch(fetchAvailability()), [dispatch]),
    createAvailability: useCallback((payload) => dispatch(createAvailability(payload)), [dispatch]),
    updateAvailability: useCallback((id, payload) => dispatch(updateAvailability({ id, payload })), [dispatch]),
    deleteAvailability: useCallback((id) => dispatch(deleteAvailability(id)), [dispatch]),

    updateDoctorProfile: useCallback((payload) => dispatch(updateDoctorProfile(payload)), [dispatch]),

    clearActionError: useCallback(() => dispatch(clearActionError()), [dispatch]),
    clearAvailabilityError: useCallback(() => dispatch(clearAvailabilityError()), [dispatch]),
    clearProfileError: useCallback(() => dispatch(clearProfileError()), [dispatch]),
  };
}
