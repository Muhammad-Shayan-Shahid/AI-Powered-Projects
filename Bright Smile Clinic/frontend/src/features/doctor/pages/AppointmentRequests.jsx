import { useEffect, useState } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar';
import Badge from '../../../components/Badge';
import FormAlert from '../../../components/FormAlert';
import { useDoctor } from '../hooks/useDoctor';
import { getInitials } from '../../../utils/getInitials';
import { formatAppointmentDateTime } from '../../../utils/dateFormat';

export default function AppointmentRequests() {
  const {
    appointments,
    isLoadingAppointments,
    appointmentsError,
    actioningIds,
    actionError,
    fetchDoctorAppointments,
    confirmAppointment,
    rejectAppointment,
  } = useDoctor();

  // Presence of a key = that card is in "reason for rejecting" mode; the
  // value is the draft text, kept local since it's ephemeral per-card UI.
  const [rejectDrafts, setRejectDrafts] = useState({});

  useEffect(() => {
    fetchDoctorAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Confirmed/rejected appointments are patched in place by the slice, so a
  // card naturally drops out of this "pending" filter as soon as the action
  // resolves — no manual list-splicing needed.
  const pendingRequests = appointments
    .filter((appt) => appt.status === 'pending')
    .sort((a, b) => new Date(a.date) - new Date(b.date) || a.timeSlot.localeCompare(b.timeSlot));

  function startReject(id) {
    setRejectDrafts((prev) => ({ ...prev, [id]: '' }));
  }
  function cancelReject(id) {
    setRejectDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }
  function setReasonText(id, value) {
    setRejectDrafts((prev) => ({ ...prev, [id]: value }));
  }
  async function handleSendRejection(id) {
    await rejectAppointment(id, rejectDrafts[id]);
    cancelReject(id);
  }

  return (
    <div className="flex min-h-screen bg-page max-md:flex-col">
      <DoctorSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-7">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
            Appointment requests
          </h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
            Review and respond to new booking requests.
          </p>
        </div>

        {appointmentsError && <FormAlert>{appointmentsError}</FormAlert>}
        {actionError && <FormAlert>{actionError}</FormAlert>}

        {isLoadingAppointments && <p className="text-sm text-ink-secondary">Loading requests…</p>}

        {!isLoadingAppointments && pendingRequests.length > 0 && (
          <div className="flex max-w-[640px] flex-col gap-3.5">
            {pendingRequests.map((req) => {
              const isRejecting = Object.prototype.hasOwnProperty.call(rejectDrafts, req._id);
              const isActioning = actioningIds.includes(req._id);

              return (
                <div key={req._id} className="animate-fade-in-up rounded-2xl border border-border bg-surface p-5">
                  <div className="mb-3.5 flex flex-wrap items-center gap-3.5">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-subtle text-[0.8125rem] font-bold text-brand">
                      {getInitials(req.patientId?.name)}
                    </div>
                    <div className="min-w-[150px] flex-1">
                      <div className="text-[0.9375rem] font-bold text-ink">{req.patientId?.name}</div>
                      <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">
                        {req.serviceId?.name} · {formatAppointmentDateTime(req.date, req.timeSlot)}
                      </div>
                    </div>
                    <Badge status="pending" />
                  </div>

                  {isRejecting && (
                    <div className="mb-3">
                      <textarea
                        placeholder="Reason for rejecting (shared with the patient)"
                        value={rejectDrafts[req._id]}
                        onChange={(e) => setReasonText(req._id, e.target.value)}
                        rows={2}
                        className="w-full resize-y rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-2.5 font-sans text-sm leading-snug text-ink outline-none transition-colors duration-150 ease-in-out focus:border-danger focus:ring-[3px] focus:ring-danger/10"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2.5">
                    {isRejecting ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSendRejection(req._id)}
                          disabled={isActioning}
                          className="min-w-[120px] flex-1 rounded-full bg-danger px-3 py-2.5 text-[0.8125rem] font-bold text-white transition-all duration-150 ease-in-out hover:bg-[oklch(48%_0.16_25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isActioning ? 'Sending…' : 'Send rejection'}
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelReject(req._id)}
                          disabled={isActioning}
                          className="min-w-[100px] flex-1 rounded-full border-[1.5px] border-[oklch(85%_0.01_250)] bg-transparent px-3 py-2.5 text-[0.8125rem] font-bold text-[oklch(45%_0.01_260)] transition-colors duration-150 ease-in-out hover:bg-[oklch(94%_0.007_90)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => confirmAppointment(req._id)}
                          disabled={isActioning}
                          className="min-w-[120px] flex-1 rounded-full bg-success-text px-3 py-2.5 text-[0.8125rem] font-bold text-white transition-all duration-150 ease-in-out hover:bg-[oklch(38%_0.13_145)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isActioning ? 'Confirming…' : 'Confirm'}
                        </button>
                        <button
                          type="button"
                          onClick={() => startReject(req._id)}
                          disabled={isActioning}
                          className="min-w-[100px] flex-1 rounded-full border-[1.5px] border-[oklch(85%_0.01_250)] bg-transparent px-3 py-2.5 text-[0.8125rem] font-bold text-[oklch(45%_0.01_260)] transition-all duration-150 ease-in-out hover:border-danger-border hover:bg-danger-bg hover:text-danger-text disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoadingAppointments && pendingRequests.length === 0 && (
          <div className="flex max-w-[480px] flex-col items-center gap-3 rounded-[20px] border border-border bg-surface px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-2xl">✓</div>
            <div className="text-[1.0625rem] font-bold text-ink">No pending requests right now</div>
            <div className="text-sm leading-normal text-ink-secondary">
              New booking requests will appear here as they come in.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
