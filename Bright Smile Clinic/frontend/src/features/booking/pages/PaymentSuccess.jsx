import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import PatientNavbar from '../../../components/PatientNavbar';
import Footer from '../../../components/Footer';
import { useBooking } from '../hooks/useBooking';
import { formatAppointmentDateTime } from '../../../utils/dateFormat';
import { formatDoctorName } from '../../../utils/formatDoctorName';

// checkout.session.completed webhook (the real source of truth for
// paymentStatus) can land a moment after Stripe redirects the browser back
// here, so this page never trusts the redirect alone: it re-fetches the
// appointment, and if payment hasn't landed yet, waits briefly and polls
// exactly once more before settling on a final state.
const POLL_DELAY_MS = 2500;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const { appointments, isLoadingAppointments, fetchMyAppointments } = useBooking();

  const [hasSettled, setHasSettled] = useState(false);
  const hasPolledRef = useRef(false);

  useEffect(() => {
    fetchMyAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appointment = appointments.find((a) => a._id === appointmentId);

  useEffect(() => {
    if (isLoadingAppointments || !appointment) return;

    if (appointment.paymentStatus === 'paid') {
      setHasSettled(true);
      return;
    }

    if (!hasPolledRef.current) {
      hasPolledRef.current = true;
      const timer = setTimeout(() => fetchMyAppointments(), POLL_DELAY_MS);
      return () => clearTimeout(timer);
    }

    setHasSettled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAppointments, appointment?.paymentStatus]);

  if (!appointmentId) {
    return <Navigate to="/booking/my-appointments" replace />;
  }

  const isConfirming = !hasSettled && (isLoadingAppointments || !appointment || appointment.paymentStatus !== 'paid');

  if (!isConfirming && !appointment) {
    // Settled with no matching appointment at all (bad id / not this patient's) — nothing to show.
    return <Navigate to="/booking/my-appointments" replace />;
  }

  const isPaid = appointment?.paymentStatus === 'paid';
  const doctorName = appointment?.doctorId?.name;
  const dateTimeLabel = appointment ? formatAppointmentDateTime(appointment.date, appointment.timeSlot) : '';
  const amountLabel = `$${Number(appointment?.serviceId?.price || 0).toFixed(2)}`;

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PatientNavbar />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-10">
        <div className="flex w-full max-w-[460px] animate-fade-in-up flex-col items-center gap-[18px] rounded-3xl bg-surface p-8 text-center shadow-[0_24px_60px_oklch(22%_0.05_265_/_0.12),0_4px_12px_oklch(22%_0.05_265_/_0.07)] sm:p-12">
          {isConfirming && (
            <>
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-brand-subtle">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
              </div>
              <div>
                <h1 className="m-0 mb-2.5 text-2xl font-bold leading-[1.3] tracking-tight text-ink">Confirming your payment…</h1>
                <p className="m-0 max-w-[340px] text-[0.9375rem] leading-relaxed text-ink-secondary">
                  Hang tight while we confirm your payment with Stripe. This only takes a moment.
                </p>
              </div>
            </>
          )}

          {!isConfirming && isPaid && (
            <>
              <div className="relative flex h-[84px] w-[84px] items-center justify-center">
                <div className="absolute inset-0 animate-ring-pulse-once rounded-full bg-success-bg" />
                <div className="flex h-[76px] w-[76px] animate-pop-in items-center justify-center rounded-full bg-success-bg">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="var(--color-success-text)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="24"
                      className="animate-check-draw"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="m-0 mb-2.5 text-2xl font-bold leading-[1.3] tracking-tight text-ink">Payment successful!</h1>
                <p className="m-0 max-w-[340px] text-[0.9375rem] leading-relaxed text-ink-secondary">
                  Your payment went through. A receipt has been emailed to you.
                </p>
              </div>
            </>
          )}

          {!isConfirming && !isPaid && (
            <>
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-clinician-subtle text-[2rem]">
                🦷
              </div>
              <div>
                <h1 className="m-0 mb-2.5 text-2xl font-bold leading-[1.3] tracking-tight text-ink">Still confirming…</h1>
                <p className="m-0 max-w-[340px] text-[0.9375rem] leading-relaxed text-ink-secondary">
                  Stripe hasn't confirmed this payment yet. It should update shortly — check My Appointments in a moment.
                </p>
              </div>
            </>
          )}

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
                <span className="text-[0.8125rem] font-bold text-ink">{dateTimeLabel}</span>
              </div>
              {isPaid && (
                <>
                  <div className="my-1 h-px w-full bg-border" />
                  <div className="flex justify-between text-sm font-semibold text-ink">
                    <span>Amount paid</span>
                    <span className="text-[0.9375rem] font-extrabold text-success-text">{amountLabel}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {!isConfirming && (
            <Link
              to="/booking/my-appointments"
              className="flex w-full items-center justify-center rounded-full bg-brand px-4 py-3.5 text-[0.9375rem] font-bold text-white no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md active:scale-[0.98]"
            >
              Back to my appointments
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
