import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorSidebar from '../../../components/DoctorSidebar';
import Badge from '../../../components/Badge';
import FormAlert from '../../../components/FormAlert';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDoctor } from '../hooks/useDoctor';
import { getInitials } from '../../../utils/getInitials';
import { formatTimeLabel } from '../../../utils/dateFormat';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function isToday(dateISOString) {
  const d = new Date(dateISOString);
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate()
  );
}

const STAT_ICONS = [
  { icon: '🕐', bgClass: 'bg-warning-bg' },
  { icon: '📅', bgClass: 'bg-clinician-subtle' },
  { icon: '🧑‍⚕️', bgClass: 'bg-brand-subtle' },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const {
    stats,
    isLoadingStats,
    statsError,
    appointments,
    isLoadingAppointments,
    appointmentsError,
    fetchDoctorStats,
    fetchDoctorAppointments,
  } = useDoctor();

  useEffect(() => {
    fetchDoctorStats();
    fetchDoctorAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todaysSchedule = appointments
    .filter((appt) => isToday(appt.date) && ['pending', 'confirmed'].includes(appt.status))
    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  const statCards = stats
    ? [
        { ...STAT_ICONS[0], value: stats.pendingCount, label: 'Pending requests' },
        { ...STAT_ICONS[1], value: stats.todaysConfirmedCount, label: "Today's confirmed appointments" },
        { ...STAT_ICONS[2], value: stats.totalPatientsSeen, label: 'Total patients seen' },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-page max-md:flex-col">
      <DoctorSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-7">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
            {greeting()}, Dr. {user?.name}.
          </h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">Here's what's happening today.</p>
        </div>

        {statsError && <FormAlert>{statsError}</FormAlert>}

        <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {isLoadingStats && !stats && (
            <p className="text-sm text-ink-secondary">Loading stats…</p>
          )}
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="flex animate-fade-in-up flex-col gap-2 rounded-2xl border border-border bg-surface p-[22px]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-[1.125rem] ${stat.bgClass}`}>
                {stat.icon}
              </div>
              <div className="text-[1.875rem] font-extrabold tracking-tight text-ink">{stat.value}</div>
              <div className="text-[0.8125rem] font-medium text-ink-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-[18px] flex flex-wrap items-center justify-between gap-2">
            <div className="text-[1.0625rem] font-bold text-ink">Today's schedule</div>
            <Link to="/doctor/patient-history" className="text-[0.8125rem] font-semibold text-clinician no-underline hover:text-clinician-hover">
              View all
            </Link>
          </div>

          {appointmentsError && <FormAlert>{appointmentsError}</FormAlert>}

          {isLoadingAppointments && <p className="text-sm text-ink-secondary">Loading schedule…</p>}

          {!isLoadingAppointments && todaysSchedule.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {todaysSchedule.map((appt) => (
                <div key={appt._id} className="flex flex-wrap items-center gap-3.5 rounded-xl bg-page p-3.5">
                  <div className="w-[76px] flex-shrink-0 text-[0.8125rem] font-bold text-clinician">
                    {formatTimeLabel(appt.timeSlot)}
                  </div>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-subtle text-xs font-bold text-brand">
                    {getInitials(appt.patientId?.name)}
                  </div>
                  <div className="min-w-[120px] flex-1">
                    <div className="text-sm font-bold text-ink">{appt.patientId?.name}</div>
                    <div className="text-[0.8125rem] text-ink-secondary">{appt.serviceId?.name}</div>
                  </div>
                  <Badge status={appt.status} />
                </div>
              ))}
            </div>
          )}

          {!isLoadingAppointments && todaysSchedule.length === 0 && (
            <div className="py-8 text-center text-[0.9375rem] font-medium text-ink-tertiary">
              No appointments scheduled for today.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
