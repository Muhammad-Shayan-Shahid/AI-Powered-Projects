import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicNavbar from '../../../components/PublicNavbar';
import Footer from '../../../components/Footer';
import DoctorAvatar from '../../../components/DoctorAvatar';
import Input from '../../../components/Input';
import { useBooking } from '../../booking/hooks/useBooking';
import { getInitials } from '../../../utils/getInitials';

export default function BrowseDoctors() {
  const { doctors, isLoadingCatalog, catalogError, fetchDoctors } = useBooking();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const serviceFilter = searchParams.get('service') || 'All';

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serviceOptions = useMemo(
    () => [...new Set(doctors.map((d) => d.specialization).filter(Boolean))],
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return doctors.filter(
      (d) =>
        (serviceFilter === 'All' || d.specialization === serviceFilter) &&
        (!q || d.name.toLowerCase().includes(q) || (d.specialization || '').toLowerCase().includes(q))
    );
  }, [doctors, search, serviceFilter]);

  function handleFilterChange(e) {
    const value = e.target.value;
    if (value === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ service: value });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PublicNavbar active="/doctors" />

      <main className="mx-auto w-full max-w-[1200px] flex-1 box-border px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div className="mb-6">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
            Find your dentist
          </h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
            Browse doctors by name or specialty.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2.5">
          <div className="min-w-[200px] flex-1">
            <Input
              placeholder="Search by name or specialty"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={serviceFilter}
            onChange={handleFilterChange}
            className="rounded-xl border-[1.5px] border-border bg-surface px-4 py-3 text-sm font-semibold text-ink outline-none transition-colors duration-200 ease-in-out focus:border-brand focus:ring-[3px] focus:ring-brand-ring"
          >
            <option value="All">All services</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {catalogError && !isLoadingCatalog && (
          <p className="m-0 mb-4 text-sm text-danger-text">{catalogError}</p>
        )}

        {isLoadingCatalog && doctors.length === 0 && (
          <p className="text-sm text-ink-secondary">Loading doctors…</p>
        )}

        {!isLoadingCatalog && filteredDoctors.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4.5">
            {filteredDoctors.map((doc) => (
              <Link
                key={doc._id}
                to={`/doctors/${doc._id}`}
                className="flex animate-fade-in-up flex-col gap-3 rounded-2xl border border-border bg-surface p-5.5 no-underline transition-all duration-150 ease-in-out hover:border-brand active:scale-[0.98]"
              >
                {doc.photoUrl ? (
                  <img
                    src={doc.photoUrl}
                    alt={doc.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <DoctorAvatar initials={getInitials(doc.name)} size={64} />
                )}
                <div>
                  <div className="text-base font-bold text-ink">{doc.name}</div>
                  <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">
                    {doc.specialization || 'General dentistry'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoadingCatalog && !catalogError && filteredDoctors.length === 0 && (
          <div className="rounded-[20px] border border-border bg-surface px-6 py-14 text-center text-[0.9375rem] font-medium text-ink-tertiary">
            No doctors match your search.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
