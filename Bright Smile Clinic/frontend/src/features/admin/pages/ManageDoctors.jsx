import { useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import FormAlert from '../../../components/FormAlert';
import DoctorAvatar from '../../../components/DoctorAvatar';
import { useAdmin } from '../hooks/useAdmin';
import { getInitials } from '../../../utils/getInitials';

export default function ManageDoctors() {
  const {
    activeDoctors,
    isLoadingActiveDoctors,
    togglingDoctorIds,
    doctorActionError,
    fetchActiveDoctors,
    featureDoctor,
    deactivateDoctor,
    clearDoctorActionError,
  } = useAdmin();

  useEffect(() => {
    fetchActiveDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => clearDoctorActionError, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen bg-page-admin max-md:flex-col">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-6 sm:p-8 md:p-10">
        <div className="mb-6">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
            Manage doctors
          </h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">Active doctors on the platform.</p>
        </div>

        {doctorActionError && <FormAlert>{doctorActionError}</FormAlert>}

        {isLoadingActiveDoctors && <p className="text-sm text-ink-secondary">Loading doctors…</p>}

        {!isLoadingActiveDoctors && activeDoctors.length > 0 && (
          <div className="flex max-w-[840px] flex-col gap-2.5">
            {activeDoctors.map((doc) => {
              const isActive = doc.status !== 'deactivated';
              const isToggling = togglingDoctorIds.includes(doc._id);

              return (
                <div
                  key={doc._id}
                  className={`grid animate-fade-in-up grid-cols-[2fr_1fr_auto_auto] items-center gap-4 rounded-[14px] border border-border-admin bg-surface px-5 py-4 transition-opacity duration-150 ease-in-out max-md:grid-cols-1 ${
                    isActive ? 'opacity-100' : 'opacity-55'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DoctorAvatar initials={getInitials(doc.name)} size={44} />
                    <div className="text-[0.9375rem] font-bold text-ink">{doc.name}</div>
                  </div>

                  <div className="text-[0.8125rem] font-medium text-ink-secondary">
                    {doc.specialization || 'General dentistry'}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => featureDoctor(doc._id)}
                      disabled={isToggling}
                      aria-pressed={doc.featured}
                      aria-label={doc.featured ? 'Remove from featured' : 'Mark as featured'}
                      className={`relative h-6 w-10 flex-shrink-0 rounded-full border-none transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-60 ${
                        doc.featured ? 'bg-brand' : 'bg-[oklch(88%_0.008_250)]'
                      }`}
                    >
                      <div
                        className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_oklch(22%_0.05_265/0.25)] transition-[left] duration-150 ease-in-out ${
                          doc.featured ? 'left-[19px]' : 'left-[3px]'
                        }`}
                      />
                    </button>
                    <span className="whitespace-nowrap text-xs font-semibold text-ink-secondary">Featured</span>
                  </div>

                  <div className="justify-self-end max-md:justify-self-start">
                    <button
                      type="button"
                      onClick={() => deactivateDoctor(doc._id)}
                      disabled={isToggling}
                      className={`whitespace-nowrap rounded-full border-[1.5px] bg-transparent px-4 py-2 text-xs font-semibold transition-all duration-150 ease-in-out hover:border-danger-border hover:bg-danger-bg hover:text-danger-text disabled:cursor-not-allowed disabled:opacity-60 ${
                        isActive ? 'border-border-admin text-[oklch(45%_0.01_260)]' : 'border-success-text text-success-text'
                      }`}
                    >
                      {isToggling ? '…' : isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoadingActiveDoctors && activeDoctors.length === 0 && (
          <div className="max-w-[480px] rounded-[20px] border border-border-admin bg-surface px-6 py-14 text-center text-[0.9375rem] font-medium text-ink-tertiary">
            No active doctors right now.
          </div>
        )}
      </main>
    </div>
  );
}
