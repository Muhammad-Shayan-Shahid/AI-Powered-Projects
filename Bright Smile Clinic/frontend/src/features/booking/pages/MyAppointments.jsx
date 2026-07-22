import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PatientNavbar from '../../../components/PatientNavbar';
import Footer from '../../../components/Footer';
import Badge from '../../../components/Badge';
import DoctorAvatar from '../../../components/DoctorAvatar';
import FormAlert from '../../../components/FormAlert';
import { useBooking } from '../hooks/useBooking';
import { getInitials } from '../../../utils/getInitials';
import { formatAppointmentDateTime, isFutureAppointment } from '../../../utils/dateFormat';

export default function MyAppointments() {
  const {
    appointments,
    isLoadingAppointments,
    appointmentsError,
    cancelingId,
    cancelError,
    fetchMyAppointments,
    cancelAppointment,
  } = useBooking();

  useEffect(() => {
    fetchMyAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasAppointments = appointments.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PatientNavbar />

      <main className="mx-auto w-full max-w-[760px] flex-1 box-border px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">My appointments</h1>
            <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">Track and manage your upcoming visits.</p>
          </div>
          <Link
            to="/booking/book"
            className="inline-flex items-center rounded-full bg-accent px-[22px] py-3 text-sm font-bold text-accent-ink no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
          >
            Book new
          </Link>
        </div>

        {appointmentsError && <FormAlert>{appointmentsError}</FormAlert>}
        {cancelError && <FormAlert>{cancelError}</FormAlert>}

        {isLoadingAppointments && (
          <p className="text-sm text-ink-secondary">Loading your appointments…</p>
        )}

        {!isLoadingAppointments && hasAppointments && (
          <div className="flex flex-col gap-3.5">
            {appointments.map((appt) => {
              const cancelable = ['pending', 'confirmed'].includes(appt.status) && isFutureAppointment(appt.date, appt.timeSlot);
              const doctorName = appt.doctorId?.name || 'Doctor';
              return (
                <div
                  key={appt._id}
                  className="flex animate-fade-in-up flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
                >
                  <DoctorAvatar initials={getInitials(doctorName)} size={48} />
                  <div className="min-w-[180px] flex-1">
                    <div className="text-[0.9375rem] font-bold text-ink">{doctorName}</div>
                    <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">
                      {appt.serviceId?.name} · {formatAppointmentDateTime(appt.date, appt.timeSlot)}
                    </div>
                  </div>
                  <Badge status={appt.status} />
                  {cancelable && (
                    <button
                      type="button"
                      onClick={() => cancelAppointment(appt._id)}
                      disabled={cancelingId === appt._id}
                      className="rounded-full border-[1.5px] border-[oklch(85%_0.01_250)] bg-transparent px-4.5 py-2.5 text-[0.8125rem] font-semibold text-ink-secondary transition-all duration-200 ease-in-out enabled:hover:-translate-y-0.5 enabled:hover:border-danger-border enabled:hover:bg-danger-bg enabled:hover:text-danger-text enabled:hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancelingId === appt._id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isLoadingAppointments && !hasAppointments && (
          <div className="flex flex-col items-center gap-4 rounded-[20px] border border-border bg-surface px-6 py-16 text-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-subtle text-[1.75rem]" aria-hidden="true">
              🦷
            </div>
            <div>
              <div className="mb-1.5 text-lg font-bold text-ink">No appointments yet</div>
              <div className="max-w-[320px] text-[0.9375rem] leading-normal text-ink-secondary">
                When you book a visit, it'll show up here so you can track it.
              </div>
            </div>
            <Link
              to="/booking/book"
              className="inline-flex items-center rounded-full bg-brand px-[26px] py-3.5 text-sm font-bold text-white no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md active:scale-[0.98]"
            >
              Book your first visit
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
