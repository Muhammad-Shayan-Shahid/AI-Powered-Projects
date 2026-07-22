import { useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { useAdmin } from '../hooks/useAdmin';

// "Appointments today" compares against the appointment's stored UTC-midnight
// date (see appointment.model.js) so it never drifts a day off from the
// server's notion of "today" (matches the doctor dashboard's stats convention).
function isToday(dateISOString) {
  const d = new Date(dateISOString);
  const today = new Date();
  return (
    d.getUTCFullYear() === today.getUTCFullYear() &&
    d.getUTCMonth() === today.getUTCMonth() &&
    d.getUTCDate() === today.getUTCDate()
  );
}

export default function AdminDashboard() {
  const {
    pendingDoctors,
    activeDoctors,
    services,
    allAppointments,
    fetchPendingDoctors,
    fetchActiveDoctors,
    fetchServices,
    fetchAllAppointments,
  } = useAdmin();

  useEffect(() => {
    fetchPendingDoctors();
    fetchActiveDoctors();
    fetchServices();
    fetchAllAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appointmentsToday = allAppointments.filter((a) => isToday(a.date)).length;

  const stats = [
    { icon: '🕐', iconBg: 'bg-warning-bg', value: pendingDoctors.length, label: 'Pending doctor approvals' },
    { icon: '🧑‍⚕️', iconBg: 'bg-clinician-subtle', value: activeDoctors.length, label: 'Total active doctors' },
    { icon: '🦷', iconBg: 'bg-brand-subtle', value: services.length, label: 'Total services' },
    { icon: '📅', iconBg: 'bg-success-bg', value: appointmentsToday, label: 'Appointments today' },
  ];

  return (
    <div className="flex min-h-screen bg-page-admin max-md:flex-col">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-7">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
            Clinic overview
          </h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
            Everything across Bright Smile at a glance.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{ animationDelay: `${i * 60}ms` }}
              className="flex animate-fade-in-up flex-col gap-2 rounded-2xl border border-border-admin bg-surface p-[22px]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${stat.iconBg}`}>
                {stat.icon}
              </div>
              <div className="text-[1.875rem] font-extrabold tracking-tight text-ink">{stat.value}</div>
              <div className="text-[0.8125rem] font-medium text-ink-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
