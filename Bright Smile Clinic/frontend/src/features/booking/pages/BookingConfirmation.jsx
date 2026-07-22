import { Navigate, Link, useLocation } from 'react-router-dom';
import PatientNavbar from '../../../components/PatientNavbar';
import Footer from '../../../components/Footer';
import { formatDateKeyShort, formatTimeLabel } from '../../../utils/dateFormat';

/** Reads the just-booked appointment's details from router state (set by BookAppointment on success). */
export default function BookingConfirmation() {
  const location = useLocation();
  const details = location.state;

  // Direct nav / page refresh with no booking in flight — nothing to confirm,
  // so send them somewhere useful instead of rendering a blank summary.
  if (!details) {
    return <Navigate to="/booking/my-appointments" replace />;
  }

  const { doctorName, serviceName, dateKey, timeSlot } = details;
  const dateTimeLabel = `${formatDateKeyShort(dateKey)}, ${formatTimeLabel(timeSlot)}`;

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PatientNavbar />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-10">
        <div className="flex w-full max-w-[460px] animate-fade-in-up flex-col items-center gap-[18px] rounded-3xl bg-surface p-8 text-center shadow-[0_24px_60px_oklch(22%_0.05_265_/_0.12),0_4px_12px_oklch(22%_0.05_265_/_0.07)] sm:p-12">
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
            <h1 className="m-0 mb-2.5 text-2xl font-bold leading-[1.3] tracking-tight text-ink">Booking request sent</h1>
            <p className="m-0 max-w-[340px] text-[0.9375rem] leading-relaxed text-ink-secondary">
              Your request is awaiting confirmation from the doctor. We'll notify you as soon as it's confirmed.
            </p>
          </div>

          <div className="flex w-full flex-col gap-1.5 rounded-[14px] bg-page px-[18px] py-4 text-left">
            <div className="flex justify-between text-[0.8125rem] font-medium text-ink-secondary">
              <span>Doctor</span>
              <span className="text-[0.8125rem] font-bold text-ink">{doctorName}</span>
            </div>
            <div className="flex justify-between text-[0.8125rem] font-medium text-ink-secondary">
              <span>Service</span>
              <span className="text-[0.8125rem] font-bold text-ink">{serviceName}</span>
            </div>
            <div className="flex justify-between text-[0.8125rem] font-medium text-ink-secondary">
              <span>Time</span>
              <span className="text-[0.8125rem] font-bold text-ink">{dateTimeLabel}</span>
            </div>
          </div>

          <Link
            to="/booking/my-appointments"
            className="flex w-full items-center justify-center rounded-full bg-brand px-4 py-3.5 text-[0.9375rem] font-bold text-white no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md active:scale-[0.98]"
          >
            View my appointments
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
