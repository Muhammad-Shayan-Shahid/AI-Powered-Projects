import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  fetchDoctors,
  fetchAvailableSlots,
  createAppointment,
  fetchMyAppointments,
  cancelAppointment,
  clearSlots,
  clearBookingConflict,
} from '../state/booking.slice';

// Wraps the booking slice so pages never touch dispatch/thunks directly.
export function useBooking() {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);

  return {
    services: booking.services,
    doctors: booking.doctors,
    isLoadingCatalog: booking.isLoadingCatalog,
    catalogError: booking.catalogError,

    slots: booking.slots,
    isLoadingSlots: booking.isLoadingSlots,
    slotsError: booking.slotsError,

    isBooking: booking.isBooking,
    bookingError: booking.bookingError,
    bookingConflict: booking.bookingConflict,

    appointments: booking.appointments,
    isLoadingAppointments: booking.isLoadingAppointments,
    appointmentsError: booking.appointmentsError,

    cancelingId: booking.cancelingId,
    cancelError: booking.cancelError,

    fetchServices: useCallback(() => dispatch(fetchServices()), [dispatch]),
    fetchDoctors: useCallback(() => dispatch(fetchDoctors()), [dispatch]),
    fetchAvailableSlots: useCallback((params) => dispatch(fetchAvailableSlots(params)), [dispatch]),
    createAppointment: useCallback((payload) => dispatch(createAppointment(payload)), [dispatch]),
    fetchMyAppointments: useCallback(() => dispatch(fetchMyAppointments()), [dispatch]),
    cancelAppointment: useCallback((id) => dispatch(cancelAppointment(id)), [dispatch]),
    clearSlots: useCallback(() => dispatch(clearSlots()), [dispatch]),
    clearBookingConflict: useCallback(() => dispatch(clearBookingConflict()), [dispatch]),
  };
}
