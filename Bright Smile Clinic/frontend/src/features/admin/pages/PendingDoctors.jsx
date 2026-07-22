import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import FormAlert from '../../../components/FormAlert';
import { useAdmin } from '../hooks/useAdmin';
import { getInitials } from '../../../utils/getInitials';

export default function PendingDoctors() {
  const {
    pendingDoctors,
    isLoadingPendingDoctors,
    pendingDoctorsError,
    actioningDoctorIds,
    doctorActionError,
    fetchPendingDoctors,
    approveDoctor,
    rejectDoctor,
  } = useAdmin();

  // Presence of a key = that card is in "reason for rejecting" mode; the
  // value is the draft text, kept local since it's ephemeral per-card UI
  // (mirrors AppointmentRequests' rejectDrafts pattern).
  const [rejectDrafts, setRejectDrafts] = useState({});

  useEffect(() => {
    fetchPendingDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  async function handleConfirmReject(id) {
    await rejectDoctor(id, rejectDrafts[id]);
    cancelReject(id);
  }

  return (
    <div className="flex min-h-screen bg-page-admin max-md:flex-col">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-7">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
            Pending doctors
          </h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
            Review applications before they get dashboard access.
          </p>
        </div>

        {pendingDoctorsError && <FormAlert>{pendingDoctorsError}</FormAlert>}
        {doctorActionError && <FormAlert>{doctorActionError}</FormAlert>}

        {isLoadingPendingDoctors && <p className="text-sm text-ink-secondary">Loading applications…</p>}

        {!isLoadingPendingDoctors && pendingDoctors.length > 0 && (
          <div className="flex max-w-[680px] flex-col gap-3.5">
            {pendingDoctors.map((doc) => {
              const isRejecting = Object.prototype.hasOwnProperty.call(rejectDrafts, doc.id);
              const isActioning = actioningDoctorIds.includes(doc.id);

              return (
                <div key={doc.id} className="animate-fade-in-up rounded-2xl border border-border-admin bg-surface p-5">
                  <div className="mb-3.5 flex flex-wrap items-start gap-3.5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-clinician-subtle text-sm font-bold text-clinician">
                      {getInitials(doc.name)}
                    </div>
                    <div className="min-w-[180px] flex-1">
                      <div className="text-[0.9375rem] font-bold text-ink">{doc.name}</div>
                      <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">
                        {doc.specialization || 'Specialization not set'}
                      </div>
                      {doc.bio && <div className="mt-2 text-[0.8125rem] leading-normal text-ink">{doc.bio}</div>}
                    </div>
                  </div>

                  {isRejecting && (
                    <div className="mb-3">
                      <textarea
                        placeholder="Reason for rejecting (shared with the applicant)"
                        value={rejectDrafts[doc.id]}
                        onChange={(e) => setReasonText(doc.id, e.target.value)}
                        rows={2}
                        className="w-full resize-y rounded-[10px] border-[1.5px] border-border-admin bg-surface px-3.5 py-2.5 font-sans text-sm leading-snug text-ink outline-none transition-colors duration-150 ease-in-out focus:border-danger focus:ring-[3px] focus:ring-danger/10"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2.5">
                    {isRejecting ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleConfirmReject(doc.id)}
                          disabled={isActioning}
                          className="min-w-[120px] flex-1 rounded-full bg-danger px-3 py-2.5 text-[0.8125rem] font-bold text-white transition-all duration-150 ease-in-out hover:bg-[oklch(48%_0.16_25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isActioning ? 'Sending…' : 'Send rejection'}
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelReject(doc.id)}
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
                          onClick={() => approveDoctor(doc.id)}
                          disabled={isActioning}
                          className="min-w-[120px] flex-1 rounded-full bg-success-text px-3 py-2.5 text-[0.8125rem] font-bold text-white transition-all duration-150 ease-in-out hover:bg-[oklch(38%_0.13_145)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isActioning ? 'Approving…' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          onClick={() => startReject(doc.id)}
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

        {!isLoadingPendingDoctors && pendingDoctors.length === 0 && (
          <div className="flex max-w-[480px] flex-col items-center gap-3 rounded-[20px] border border-border-admin bg-surface px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-2xl">✓</div>
            <div className="text-[1.0625rem] font-bold text-ink">No pending doctors right now</div>
            <div className="text-sm leading-normal text-ink-secondary">
              New applications will appear here for review.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
