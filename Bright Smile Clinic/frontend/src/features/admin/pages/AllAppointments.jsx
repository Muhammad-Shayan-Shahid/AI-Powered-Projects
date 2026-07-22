import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import FormAlert from '../../../components/FormAlert';
import Badge from '../../../components/Badge';
import { useAdmin } from '../hooks/useAdmin';
import { formatAppointmentDateTime } from '../../../utils/dateFormat';

const STATUS_OPTIONS = ['All', 'pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
const STATUS_LABELS = {
  All: 'All statuses',
  pending: 'Pending',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function AllAppointments() {
  const { allAppointments, isLoadingAllAppointments, allAppointmentsError, fetchAllAppointments } = useAdmin();

  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  // Populated once from an unfiltered fetch so every doctor stays selectable
  // even after a status/doctor filter narrows the visible rows.
  const [doctorOptions, setDoctorOptions] = useState([]);

  useEffect(() => {
    fetchAllAppointments({})
      .unwrap()
      .then((data) => {
        const unique = new Map();
        data.appointments.forEach((a) => {
          if (a.doctorId?._id) unique.set(a.doctorId._id, a.doctorId);
        });
        setDoctorOptions([...unique.values()]);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-queries the server with the active filters — exercises the real
  // GET /api/admin/appointments?status=&doctorId= filtering, not a client-side filter.
  useEffect(() => {
    fetchAllAppointments({
      status: statusFilter !== 'All' ? statusFilter : undefined,
      doctorId: doctorFilter !== 'All' ? doctorFilter : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, doctorFilter]);

  return (
    <div className="flex min-h-screen bg-page-admin max-md:flex-col">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-5">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
            All appointments
          </h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
            Every booking across every doctor.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 text-[0.8125rem] font-semibold text-ink outline-none"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 text-[0.8125rem] font-semibold text-ink outline-none"
          >
            <option value="All">All doctors</option>
            {doctorOptions.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        {allAppointmentsError && <FormAlert>{allAppointmentsError}</FormAlert>}

        {isLoadingAllAppointments && <p className="text-sm text-ink-secondary">Loading appointments…</p>}

        {!isLoadingAllAppointments && allAppointments.length > 0 && (
          <div className="flex max-w-[920px] flex-col gap-2.5">
            {allAppointments.map((appt) => (
              <div
                key={appt._id}
                className="grid animate-fade-in-up grid-cols-[1.1fr_1.1fr_1fr_1fr_auto] items-center gap-3.5 rounded-[14px] border border-border-admin bg-surface px-[18px] py-3.5 max-md:grid-cols-2 max-md:gap-y-1.5"
              >
                <div className="text-[0.8125rem] font-bold text-ink">{appt.patientId?.name}</div>
                <div className="text-[0.8125rem] font-medium text-ink">{appt.doctorId?.name}</div>
                <div className="text-[0.8125rem] text-ink-secondary">{appt.serviceId?.name}</div>
                <div className="text-[0.8125rem] text-ink-secondary">
                  {formatAppointmentDateTime(appt.date, appt.timeSlot)}
                </div>
                <div className="justify-self-start">
                  <Badge status={appt.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoadingAllAppointments && allAppointments.length === 0 && (
          <div className="max-w-[480px] rounded-[20px] border border-border-admin bg-surface px-6 py-14 text-center text-[0.9375rem] font-medium text-ink-tertiary">
            No appointments match these filters.
          </div>
        )}
      </main>
    </div>
  );
}
