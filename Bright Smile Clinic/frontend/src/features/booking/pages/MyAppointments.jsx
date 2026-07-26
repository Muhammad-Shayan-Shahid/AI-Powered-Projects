import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PatientNavbar from '../../../components/PatientNavbar';
import Footer from '../../../components/Footer';
import Badge from '../../../components/Badge';
import DoctorAvatar from '../../../components/DoctorAvatar';
import FormAlert from '../../../components/FormAlert';
import { useBooking } from '../hooks/useBooking';
import { getInitials } from '../../../utils/getInitials';
import { formatDoctorName } from '../../../utils/formatDoctorName';
import { formatAppointmentDateTime, isFutureAppointment } from '../../../utils/dateFormat';

export default function MyAppointments() {
  const {
    appointments,
    isLoadingAppointments,
    appointmentsError,
    cancelingId,
    cancelError,
    reviewingId,
    reviewError,
    payingId,
    payError,
    fetchMyAppointments,
    cancelAppointment,
    createReview,
    payForAppointment,
  } = useBooking();

  // Draft rating/comment kept per-appointment while the patient is composing
  // a review — cleared once submitted, since hasReview then flips permanently.
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    fetchMyAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setDraftRating(id, rating) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], rating } }));
  }
  function setDraftComment(id, comment) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], comment } }));
  }
  async function handleSubmitReview(id) {
    const draft = drafts[id];
    if (!draft?.rating) return;
    const result = await createReview({ appointmentId: id, rating: draft.rating, comment: draft.comment });
    if (result.meta.requestStatus === 'fulfilled') {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  // Stripe redirects the whole browser to a hosted checkout page — on success
  // this tab never comes back here (the checkout success_url takes over).
  async function handlePayNow(id) {
    const result = await payForAppointment(id);
    if (result.meta.requestStatus === 'fulfilled') {
      window.location.href = result.payload.checkoutUrl;
    }
  }

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
        {reviewError && <FormAlert>{reviewError}</FormAlert>}
        {payError && <FormAlert>{payError}</FormAlert>}

        {isLoadingAppointments && (
          <p className="text-sm text-ink-secondary">Loading your appointments…</p>
        )}

        {!isLoadingAppointments && hasAppointments && (
          <div className="flex flex-col gap-3.5">
            {appointments.map((appt) => {
              const cancelable = ['pending', 'confirmed'].includes(appt.status) && isFutureAppointment(appt.date, appt.timeSlot);
              const doctorName = appt.doctorId?.name;
              const showRate = appt.status === 'completed';
              const draft = drafts[appt._id] || {};
              const isSubmitting = reviewingId === appt._id;
              // 'not_required' covers appointments created before Phase 10 —
              // never show a payment badge/button for those.
              const showPaymentBadge = appt.status === 'confirmed' && appt.paymentStatus !== 'not_required';
              const isPaid = appt.paymentStatus === 'paid';
              const showPayNow = appt.status === 'confirmed' && appt.paymentStatus === 'pending';
              const isPaying = payingId === appt._id;
              return (
                <div
                  key={appt._id}
                  className="flex animate-fade-in-up flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <DoctorAvatar initials={getInitials(doctorName || 'Doctor')} size={48} />
                    <div className="min-w-[180px] flex-1">
                      <div className="text-[0.9375rem] font-bold text-ink">{doctorName ? formatDoctorName(doctorName) : 'Doctor'}</div>
                      <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">
                        {appt.serviceId?.name} · {formatAppointmentDateTime(appt.date, appt.timeSlot)}
                      </div>
                    </div>
                    <Badge status={appt.status} />
                    {showPaymentBadge && (
                      <div
                        className={`inline-flex animate-badge-fade-in items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${
                          isPaid ? 'bg-success-bg text-success-text' : 'bg-warning-bg text-warning-text'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {isPaid ? 'Paid' : 'Payment due'}
                      </div>
                    )}
                    {showPayNow && (
                      <button
                        type="button"
                        onClick={() => handlePayNow(appt._id)}
                        disabled={isPaying}
                        className="inline-flex items-center rounded-full bg-accent px-5 py-2.25 text-[0.8125rem] font-bold text-accent-ink transition-all duration-200 ease-in-out enabled:hover:-translate-y-0.5 enabled:hover:bg-accent-hover enabled:hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPaying ? 'Redirecting…' : 'Pay now'}
                      </button>
                    )}
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

                  {showRate && (
                    <div className="mt-4 border-t border-border pt-4">
                      {appt.hasReview ? (
                        <div className="flex animate-fade-in-up items-center gap-2.5">
                          <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-success-bg text-sm text-success-text">
                            ✓
                          </div>
                          <span className="text-sm font-semibold text-ink">Thanks for your feedback!</span>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-3 text-sm font-semibold text-ink">
                            How was your visit with {doctorName ? formatDoctorName(doctorName) : 'the doctor'}?
                          </div>
                          <div className="mb-3.5 flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setDraftRating(appt._id, n)}
                                className={`bg-transparent p-0 text-[1.625rem] leading-none transition-transform duration-100 ease-in-out active:scale-90 ${
                                  n <= (draft.rating || 0) ? 'text-warning-text' : 'text-[oklch(88%_0.008_90)]'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <textarea
                            placeholder="Add a comment (optional)"
                            value={draft.comment || ''}
                            onChange={(e) => setDraftComment(appt._id, e.target.value)}
                            rows={2}
                            className="mb-3 w-full resize-y rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-2.5 font-sans text-sm leading-snug text-ink outline-none transition-colors duration-150 ease-in-out focus:border-accent focus:ring-[3px] focus:ring-accent/15"
                          />
                          <button
                            type="button"
                            onClick={() => handleSubmitReview(appt._id)}
                            disabled={!draft.rating || isSubmitting}
                            className="rounded-full bg-accent px-6 py-2.5 text-[0.8125rem] font-bold text-accent-ink transition-all duration-150 ease-in-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSubmitting ? 'Submitting…' : 'Submit'}
                          </button>
                        </div>
                      )}
                    </div>
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
