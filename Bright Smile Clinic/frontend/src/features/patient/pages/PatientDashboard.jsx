import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PatientNavbar from '../../../components/PatientNavbar';
import Footer from '../../../components/Footer';
import Badge from '../../../components/Badge';
import DoctorAvatar from '../../../components/DoctorAvatar';
import FormAlert from '../../../components/FormAlert';
import { useAuth } from '../../auth/hooks/useAuth';
import { useBooking } from '../../booking/hooks/useBooking';
import { getInitials } from '../../../utils/getInitials';
import { formatAppointmentDateTime, formatRelativeTime, isFutureAppointment } from '../../../utils/dateFormat';

// Dot color for the recent-activity feed — mirrors Badge's status tones.
const ACTIVITY_DOT_CLASS = {
  pending: 'bg-warning-text',
  confirmed: 'bg-success-text',
  rejected: 'bg-danger-text',
  completed: 'bg-neutral-badge-text',
  cancelled: 'bg-neutral-badge-text',
};

function doctorLabel(name) {
  return name ? `Dr. ${name}` : 'your doctor';
}

function activityText(appt) {
  const doctor = doctorLabel(appt.doctorId?.name);
  const service = appt.serviceId?.name || 'appointment';
  switch (appt.status) {
    case 'pending':
      return `You booked a ${service} appointment with ${doctor}.`;
    case 'confirmed':
      return `Your appointment with ${doctor} was confirmed.`;
    case 'rejected':
      return `Your appointment request with ${doctor} was declined.`;
    case 'completed':
      return `Your ${service} with ${doctor} was completed.`;
    case 'cancelled':
      return `Your appointment with ${doctor} was cancelled.`;
    default:
      return `Your appointment with ${doctor} was updated.`;
  }
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { appointments, isLoadingAppointments, appointmentsError, fetchMyAppointments } = useBooking();

  useEffect(() => {
    fetchMyAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const upcoming = appointments
    .filter((appt) => ['pending', 'confirmed'].includes(appt.status) && isFutureAppointment(appt.date, appt.timeSlot))
    .sort((a, b) => (a.date === b.date ? a.timeSlot.localeCompare(b.timeSlot) : new Date(a.date) - new Date(b.date)));

  const hasUpcoming = upcoming.length > 0;
  const nextAppt = upcoming[0];

  // Recent activity is derived from real appointment records (no separate
  // notifications backend exists yet) — most recently updated first.
  const recentActivity = [...appointments]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PatientNavbar />

      <main className="mx-auto w-full max-w-[900px] flex-1 box-border px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
              Welcome back, {firstName}.
            </h1>
            <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">Here's what's happening with your care.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="rounded-full border-[1.5px] border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink-secondary transition-all duration-200 ease-in-out enabled:hover:border-brand enabled:hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Logging out…' : 'Log out'}
          </button>
        </div>

        {appointmentsError && <FormAlert>{appointmentsError}</FormAlert>}

        {isLoadingAppointments && <p className="mb-4 text-sm text-ink-secondary">Loading your appointments…</p>}

        {!isLoadingAppointments && hasUpcoming && (
          <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <div className="flex animate-fade-in-up flex-col gap-2 rounded-2xl border border-border bg-surface p-[22px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-subtle text-[1.125rem]">📅</div>
              <div className="text-[1.875rem] font-extrabold tracking-tight text-ink">{upcoming.length}</div>
              <div className="text-[0.8125rem] font-medium text-ink-secondary">Upcoming appointments</div>
            </div>

            <div className="flex animate-fade-in-up flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-[22px] sm:col-span-2">
              <DoctorAvatar initials={getInitials(nextAppt.doctorId?.name)} size={52} />
              <div className="min-w-[160px] flex-1">
                <div className="mb-0.5 text-xs font-medium uppercase tracking-wide text-ink-tertiary">Your next visit</div>
                <div className="text-base font-bold text-ink">{doctorLabel(nextAppt.doctorId?.name)}</div>
                <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">
                  {nextAppt.serviceId?.name} · {formatAppointmentDateTime(nextAppt.date, nextAppt.timeSlot)}
                </div>
              </div>
              <Badge status={nextAppt.status} />
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Link
            to="/booking/book"
            className="flex items-center gap-3.5 rounded-2xl bg-accent p-[22px] text-accent-ink no-underline transition-all duration-200 ease-in-out hover:bg-accent-hover active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent-ink/10 text-xl">➕</span>
            <div>
              <div className="text-[1.0625rem] font-bold">Book an appointment</div>
              <div className="text-[0.8125rem] opacity-85">Find a time that works for you</div>
            </div>
          </Link>
          <Link
            to="/booking/my-appointments"
            className="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-border bg-surface p-[22px] text-ink no-underline transition-all duration-200 ease-in-out hover:border-brand active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-xl">📋</span>
            <div>
              <div className="text-[1.0625rem] font-bold">View all appointments</div>
              <div className="text-[0.8125rem] text-ink-secondary">Track status and history</div>
            </div>
          </Link>
        </div>

        {!isLoadingAppointments && !hasUpcoming && (
          <div className="mb-8 flex flex-col items-center gap-4 rounded-[20px] border border-border bg-surface px-6 py-16 text-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-subtle text-[1.75rem]" aria-hidden="true">
              🦷
            </div>
            <div>
              <div className="mb-1.5 text-lg font-bold text-ink">Let's get your first visit booked</div>
              <div className="max-w-[320px] text-[0.9375rem] leading-normal text-ink-secondary">
                You don't have any upcoming appointments — booking takes less than a minute.
              </div>
            </div>
            <Link
              to="/booking/book"
              className="inline-flex items-center rounded-full bg-accent px-[26px] py-3.5 text-sm font-bold text-accent-ink no-underline transition-all duration-200 ease-in-out hover:bg-accent-hover active:scale-[0.98]"
            >
              Book your first visit
            </Link>
          </div>
        )}

        <section>
          <div className="mb-3.5 text-[1.0625rem] font-bold text-ink">Recent activity</div>
          {recentActivity.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {recentActivity.map((appt) => (
                <div
                  key={appt._id}
                  className="flex animate-fade-in-up items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5"
                >
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${ACTIVITY_DOT_CLASS[appt.status] || ACTIVITY_DOT_CLASS.completed}`} />
                  <span className="flex-1 text-sm leading-normal text-ink">{activityText(appt)}</span>
                  <span className="whitespace-nowrap text-xs text-ink-tertiary">{formatRelativeTime(appt.updatedAt)}</span>
                </div>
              ))}
            </div>
          )}
          {!isLoadingAppointments && recentActivity.length === 0 && (
            <p className="py-4 text-[0.9375rem] text-ink-tertiary">No recent activity yet.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
