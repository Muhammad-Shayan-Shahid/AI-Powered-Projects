import { useEffect, useState } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar';
import Badge from '../../../components/Badge';
import FormAlert from '../../../components/FormAlert';
import { useDoctor } from '../hooks/useDoctor';
import { getInitials } from '../../../utils/getInitials';
import { formatAppointmentDateTime } from '../../../utils/dateFormat';

const FILTERS = ['All', 'Pending', 'Confirmed', 'Rejected', 'Completed'];

export default function PatientHistory() {
  const { appointments, isLoadingAppointments, appointmentsError, fetchDoctorAppointments } = useDoctor();
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchDoctorAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Backend already returns these sorted newest-first (see listDoctorAppointments).
  const visits = appointments.filter(
    (appt) => activeFilter === 'All' || appt.status === activeFilter.toLowerCase()
  );

  return (
    <div className="flex min-h-screen bg-page max-md:flex-col">
      <DoctorSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-6">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">Patient history</h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">A read-only record of every visit.</p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {FILTERS.map((label) => {
            const active = activeFilter === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveFilter(label)}
                className={[
                  'rounded-full border-[1.5px] px-4 py-2 text-[0.8125rem] font-semibold transition-all duration-150 ease-in-out',
                  active
                    ? 'border-clinician bg-clinician text-white'
                    : 'border-border bg-surface text-ink hover:border-clinician',
                ].join(' ')}
              >
                {label}
              </button>
            );
          })}
        </div>

        {appointmentsError && <FormAlert>{appointmentsError}</FormAlert>}

        {isLoadingAppointments && <p className="text-sm text-ink-secondary">Loading history…</p>}

        {!isLoadingAppointments && visits.length > 0 && (
          <div className="flex max-w-[680px] flex-col gap-3">
            {visits.map((visit) => (
              <div
                key={visit._id}
                className="flex animate-fade-in-up flex-wrap items-center gap-3.5 rounded-2xl border border-border bg-surface p-[18px_20px]"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-subtle text-[0.8125rem] font-bold text-brand">
                  {getInitials(visit.patientId?.name)}
                </div>
                <div className="min-w-[160px] flex-1">
                  <div className="text-[0.9375rem] font-bold text-ink">{visit.patientId?.name}</div>
                  <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">
                    {visit.serviceId?.name} · {formatAppointmentDateTime(visit.date, visit.timeSlot)}
                  </div>
                </div>
                <Badge status={visit.status} />
              </div>
            ))}
          </div>
        )}

        {!isLoadingAppointments && visits.length === 0 && (
          <div className="max-w-[480px] rounded-[20px] border border-border bg-surface px-6 py-14 text-center text-[0.9375rem] font-medium text-ink-tertiary">
            No visits match this filter.
          </div>
        )}
      </main>
    </div>
  );
}
