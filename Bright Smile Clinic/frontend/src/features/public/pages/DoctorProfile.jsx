import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicNavbar from '../../../components/PublicNavbar';
import Footer from '../../../components/Footer';
import DoctorAvatar from '../../../components/DoctorAvatar';
import { useBooking } from '../../booking/hooks/useBooking';
import { getInitials } from '../../../utils/getInitials';

export default function DoctorProfile() {
  const { id } = useParams();
  const { selectedDoctor, isLoadingDoctor, doctorError, fetchDoctorById, clearSelectedDoctor } = useBooking();

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
                  alt={selectedDoctor.name}
                  className="h-24 w-24 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <DoctorAvatar initials={getInitials(selectedDoctor.name)} size={96} />
              )}
              <div className="min-w-[200px] flex-1">
                <h1 className="m-0 mb-1 text-[1.625rem] font-bold leading-[1.3] tracking-tight text-ink">
                  {selectedDoctor.name}
                </h1>
                <div className="text-[0.9375rem] font-semibold text-clinician">
                  {selectedDoctor.specialization || 'General dentistry'}
                </div>
              </div>
              <Link
                to="/booking/book"
                className="inline-flex flex-shrink-0 items-center self-start rounded-full bg-accent px-6.5 py-3.25 text-sm font-bold text-accent-ink no-underline transition-colors duration-150 ease-in-out hover:bg-accent-hover"
              >
                Book appointment
              </Link>
            </div>

            {selectedDoctor.bio && (
              <div>
                <div className="mb-2 text-base font-bold text-ink">About</div>
                <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-secondary">{selectedDoctor.bio}</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
