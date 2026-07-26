import { useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import PatientNavbar from '../../../components/PatientNavbar';
import Footer from '../../../components/Footer';
import { useBooking } from '../hooks/useBooking';
import { formatAppointmentDateTime } from '../../../utils/dateFormat';
import { formatDoctorName } from '../../../utils/formatDoctorName';

// Stripe never charged the card here, so there's nothing to reconcile against
// the webhook — this page just shows a friendly summary from already-fetched
// appointment data, unlike PaymentSuccess which has to poll for the real result.
export default function PaymentCancelled() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const { appointments, fetchMyAppointments } = useBooking();

  useEffect(() => {
    fetchMyAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!appointmentId) {
    return <Navigate to="/booking/my-appointments" replace />;
  }

  const appointment = appointments.find((a) => a._id === appointmentId);
  const doctorName = appointment?.doctorId?.name;

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PatientNavbar />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-10">
        <div className="flex w-full max-w-[460px] animate-fade-in-up flex-col items-center gap-[18px] rounded-3xl bg-surface p-8 text-center shadow-[0_24px_60px_oklch(22%_0.05_265_/_0.12),0_4px_12px_oklch(22%_0.05_265_/_0.07)] sm:p-12">
          <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-clinician-subtle text-[2rem]">
            🦷
          </div>

          <div>
            <h1 className="m-0 mb-2.5 text-2xl font-bold leading-[1.3] tracking-tight text-ink">Payment not completed</h1>
            <p className="m-0 max-w-[360px] text-[0.9375rem] leading-relaxed text-ink-secondary">
              No worries — your appointment is still confirmed. You can complete payment anytime before your visit.
            </p>
          </div>

          {appointment && (
            <div className="flex w-full flex-col gap-1.5 rounded-[14px] bg-page px-[18px] py-4 text-left">
              <div className="flex justify-between text-[0.8125rem] font-medium text-ink-secondary">
                <span>Doctor</span>
                <span className="text-[0.8125rem] font-bold text-ink">{doctorName ? formatDoctorName(doctorName) : 'Doctor'}</span>
              </div>
              <div className="flex justify-between text-[0.8125rem] font-medium text-ink-secondary">
                <span>Service</span>
                <span className="text-[0.8125rem] font-bold text-ink">{appointment.serviceId?.name}</span>
              </div>
              <div className="flex justify-between text-[0.8125rem] font-medium text-ink-secondary">
                <span>Time</span>
                <span className="text-[0.8125rem] font-bold text-ink">
                  {formatAppointmentDateTime(appointment.date, appointment.timeSlot)}
                </span>
              </div>
            </div>
          )}

          <div className="flex w-full flex-col gap-3">
            <Link
              to="/booking/my-appointments"
              className="flex w-full items-center justify-center rounded-full bg-accent px-4 py-3.5 text-[0.9375rem] font-bold text-accent-ink no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
            >
              Try again
            </Link>
            <Link
              to="/booking/my-appointments"
              className="text-sm font-semibold text-ink-secondary no-underline hover:text-ink"
            >
              Back to my appointments
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
