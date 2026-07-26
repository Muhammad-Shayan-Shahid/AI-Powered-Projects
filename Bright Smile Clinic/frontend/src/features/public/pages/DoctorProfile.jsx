import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicNavbar from '../../../components/PublicNavbar';
import Footer from '../../../components/Footer';
import DoctorAvatar from '../../../components/DoctorAvatar';
import StarRating from '../../../components/StarRating';
import { useBooking } from '../../booking/hooks/useBooking';
import { getInitials } from '../../../utils/getInitials';
import { formatDoctorName } from '../../../utils/formatDoctorName';
import { formatRelativeTime } from '../../../utils/dateFormat';

export default function DoctorProfile() {
  const { id } = useParams();
  const {
    selectedDoctor,
    doctorAverageRating,
    doctorReviewCount,
    doctorReviews,
    isLoadingDoctor,
    doctorError,
    fetchDoctorById,
    clearSelectedDoctor,
  } = useBooking();

  useEffect(() => {
    fetchDoctorById(id);
    return () => clearSelectedDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PublicNavbar active="/doctors" />

      <main className="mx-auto w-full max-w-[860px] flex-1 box-border px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        {isLoadingDoctor && <p className="text-sm text-ink-secondary">Loading doctor…</p>}

        {!isLoadingDoctor && doctorError && (
          <div className="rounded-[20px] border border-border bg-surface px-6 py-14 text-center">
            <p className="m-0 mb-4 text-sm text-danger-text">{doctorError}</p>
            <Link to="/doctors" className="text-sm font-semibold text-brand no-underline hover:text-brand-hover">
              ← Back to all doctors
            </Link>
          </div>
        )}

        {!isLoadingDoctor && !doctorError && selectedDoctor && (
          <div className="animate-fade-in-up rounded-[20px] border border-border bg-surface p-6 sm:p-10">
            <div className="mb-6 flex flex-wrap gap-6">
              {selectedDoctor.photoUrl ? (
                <img
                  src={selectedDoctor.photoUrl}
                  alt={formatDoctorName(selectedDoctor.name)}
                  className="h-24 w-24 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <DoctorAvatar initials={getInitials(selectedDoctor.name)} size={96} />
              )}
              <div className="min-w-[200px] flex-1">
                <h1 className="m-0 mb-1 text-[1.625rem] font-bold leading-[1.3] tracking-tight text-ink">
                  {formatDoctorName(selectedDoctor.name)}
                </h1>
                <div className="mb-2 text-[0.9375rem] font-semibold text-clinician">
                  {selectedDoctor.specialization || 'General dentistry'}
                </div>
                <StarRating rating={doctorAverageRating} reviewCount={doctorReviewCount} size="lg" />
              </div>
              <Link
                to="/booking/book"
                state={{ doctorId: selectedDoctor._id }}
                className="inline-flex flex-shrink-0 items-center self-start rounded-full bg-accent px-6.5 py-3.25 text-sm font-bold text-accent-ink no-underline transition-colors duration-150 ease-in-out hover:bg-accent-hover"
              >
                Book appointment
              </Link>
            </div>

            {selectedDoctor.bio && (
              <div className="mb-6">
                <div className="mb-2 text-base font-bold text-ink">About</div>
                <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-secondary">{selectedDoctor.bio}</p>
              </div>
            )}

            {selectedDoctor.services?.length > 0 && (
              <div className="mb-6">
                <div className="mb-2.5 text-base font-bold text-ink">Services offered</div>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.services.map((svc) => (
                    <span key={svc._id} className="rounded-full bg-brand-subtle px-4 py-2 text-[0.8125rem] font-semibold text-brand">
                      {svc.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3.5 text-base font-bold text-ink">Patient reviews</div>
              {doctorReviews.length > 0 ? (
                <div className="flex flex-col">
                  {doctorReviews.map((rev) => (
                    <div key={rev._id} className="flex animate-fade-in-up gap-3.5 border-b border-border py-4.5 last:border-b-0">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-clinician-subtle text-xs font-bold text-clinician">
                        {getInitials(rev.patientId?.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-sm font-bold text-ink">{rev.patientId?.name || 'Patient'}</span>
                          <span className="text-xs text-ink-tertiary">{formatRelativeTime(rev.createdAt)}</span>
                        </div>
                        <StarRating rating={rev.rating} size="sm" showCount={false} />
                        {rev.comment && (
                          <p className="m-0 mt-2 text-sm leading-relaxed text-ink-secondary">{rev.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5 rounded-2xl bg-page px-6 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-subtle text-xl">💬</div>
                  <div className="text-[0.9375rem] font-bold text-ink">No reviews yet</div>
                  <div className="max-w-[280px] text-[0.8125rem] leading-normal text-ink-secondary">
                    Patient feedback will show up here after visits are completed.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
