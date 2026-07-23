import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../../components/PublicNavbar';
import Footer from '../../../components/Footer';
import Input from '../../../components/Input';
import { useBooking } from '../../booking/hooks/useBooking';

export default function BrowseServices() {
  const { services, isLoadingCatalog, catalogError, fetchServices } = useBooking();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => s.name.toLowerCase().includes(q));
  }, [services, search]);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <PublicNavbar active="/services" />

      <main className="mx-auto w-full max-w-[1000px] flex-1 box-border px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div className="mb-6">
          <h1 className="m-0 mb-1.5 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ink">
            Our services
          </h1>
          <p className="m-0 text-[0.9375rem] leading-normal text-ink-secondary">
            Everything your smile needs, all in one place.
          </p>
        </div>

        <div className="mb-6 max-w-[360px]">
          <Input placeholder="Search services" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {catalogError && !isLoadingCatalog && (
          <p className="m-0 mb-4 text-sm text-danger-text">{catalogError}</p>
        )}

        {isLoadingCatalog && services.length === 0 && (
          <p className="text-sm text-ink-secondary">Loading services…</p>
        )}

        {!isLoadingCatalog && filteredServices.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {filteredServices.map((svc) => (
              <div
                key={svc._id}
                className="flex animate-fade-in-up flex-col gap-3 rounded-2xl border border-border bg-surface p-5.5"
              >
                <div>
                  <div className="text-[1.0625rem] font-bold text-ink">{svc.name}</div>
                  {svc.description && (
                    <div className="mt-1 text-[0.8125rem] leading-relaxed text-ink-secondary">
                      {svc.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[1.125rem] font-bold text-ink">${svc.price}</div>
                    <div className="text-xs font-medium text-ink-tertiary">{svc.durationMinutes} min</div>
                  </div>
                  <Link
                    to="/booking/book"
                    className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-[0.8125rem] font-bold text-accent-ink no-underline transition-colors duration-150 ease-in-out hover:bg-accent-hover"
                  >
                    Book now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoadingCatalog && !catalogError && filteredServices.length === 0 && (
          <div className="rounded-[20px] border border-border bg-surface px-6 py-14 text-center text-[0.9375rem] font-medium text-ink-tertiary">
            No services match your search.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
