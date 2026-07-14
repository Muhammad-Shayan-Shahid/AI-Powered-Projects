import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { bookAppointment } from "../services/appointmentService";
import { setSubmitting, setSuccess, setError } from "../state/appointment.slice";

export function useAppointment() {
  const dispatch = useDispatch();
  const { isSubmitting, isSuccess, error } = useSelector((state) => state.appointment);

  async function handleBookAppointment(formData, { onSuccess } = {}) {
    dispatch(setSubmitting(true));
    dispatch(setError(null));
    try {
      await bookAppointment(formData);
      dispatch(setSuccess(true));
      toast.success("Appointment request sent — we'll confirm shortly.");
      onSuccess?.();
    } catch (err) {
      dispatch(setError(err.message));
      toast.error(err.message || "Could not book appointment. Please try again.");
    } finally {
      dispatch(setSubmitting(false));
    }
  }

  return { isSubmitting, isSuccess, error, handleBookAppointment };
}
