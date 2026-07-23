import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Footer';
import PublicNavbar from '../../../components/PublicNavbar';
import DoctorAvatar from '../../../components/DoctorAvatar';
import { useBooking } from '../../booking/hooks/useBooking';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { getInitials } from '../../../utils/getInitials';

// Presentational only — the Service model has no icon field, so real service
// names are mapped onto this cycling theme rather than a hardcoded catalog.
const SERVICE_THEMES = [
  { bg: 'bg-brand-subtle', icon: '🦷' },
  { bg: 'bg-warning-bg', icon: '✨' },
  { bg: 'bg-success-bg', icon: '🩹' },
  { bg: 'bg-clinician-subtle', icon: '🦴' },
];

const SERVICE_ICON_KEYWORDS = [
  { match: /whiten/i, icon: '✨' },
  { match: /fill/i, icon: '🩹' },
  { match: /implant/i, icon: '🦴' },
  { match: /clean|hygiene/i, icon: '🪥' },
  { match: /root canal|endodon/i, icon: '🩺' },
  { match: /brace|ortho|align/i, icon: '😁' },
];

function getServiceIcon(name) {
  const found = SERVICE_ICON_KEYWORDS.find((entry) => entry.match.test(name || ''));
  return found ? found.icon : '🦷';
}

// Marketing copy, not a live metric — no aggregation endpoint exists yet for
// patients-treated / satisfaction / insurance-plan counts.
const TRUST_STATS = [
  { icon: '🧑‍⚕️', stat: '24', label: 'Certified doctors' },
  { icon: '🙂', stat: '2,400+', label: 'Patients treated' },
  { icon: '⭐', stat: '98%', label: 'Patient satisfaction' },
  { icon: '🛡️', stat: '15+', label: 'Insurance plans accepted' },
];

const SKELETON_CLASS =
  'animate-shimmer rounded-2xl bg-[length:400px_100%] bg-[linear-gradient(90deg,var(--color-shimmer-from)_25%,var(--color-shimmer-via)_37%,var(--color-shimmer-from)_63%)]';

export default function Home() {
  const { services, doctors, isLoadingCatalog, catalogError, fetchServices, fetchDoctors } = useBooking();

  const servicesReveal = useRevealOnScroll();
  const doctorsReveal = useRevealOnScroll();
  const trustReveal = useRevealOnScroll();

  useEffect(() => {
    fetchServices();
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featuredServices = services.slice(0, 4);
  const featuredDoctors = doctors.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page">
      <PublicNavbar />

      <main className="flex-1">
        <section className="relative mx-auto max-w-[1280px] overflow-hidden px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
          <div className="pointer-events-none absolute -right-16 -top-20 h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,oklch(93%_0.04_195_/_0.7),transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,oklch(94%_0.02_265_/_0.7),transparent_70%)]" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 text-center md:grid-cols-2 md:gap-14 md:text-left">
            <div className="order-1 animate-fade-in-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-clinician-subtle px-4 py-[7px] text-xs font-bold text-clinician">
                <span>✨</span> Trusted by 2,400+ patients
              </div>
              <h1 className="m-0 mb-4.5 text-[clamp(2.25rem,5vw,3rem)] font-extrabold leading-[1.15] tracking-tight text-ink text-pretty">
                Dental care that fits your life.
              </h1>
              <p className="mx-auto mb-8 max-w-[440px] text-[1.0625rem] leading-relaxed text-ink-secondary md:mx-0">
                Book real appointments with real dentists in under a minute — no phone calls, no waiting rooms.
              </p>
              <div className="flex flex-wrap justify-center gap-3.5 md:justify-start">
                <Link
                  to="/booking/book"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-[34px] py-4 text-base font-bold text-accent-ink no-underline shadow-[0_10px_24px_oklch(70%_0.16_35_/_0.32)] transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.98]"
                >
                  Book now →
                </Link>
                <a
                  href="#doctors"
                  className="inline-flex items-center rounded-full border-[1.5px] border-border bg-transparent px-7 py-4 text-[0.9375rem] font-semibold text-ink no-underline transition-colors duration-200 ease-in-out hover:bg-neutral-hover"
                >
                  Meet our doctors
                </a>
              </div>
            </div>

            <div className="order-2 h-[clamp(240px,40vw,420px)] overflow-hidden rounded-3xl bg-[linear-gradient(150deg,var(--color-clinician),var(--color-clinician-end))] shadow-[0_20px_44px_oklch(22%_0.05_265_/_0.18)]">
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/85">
                <svg viewBox="0 0 24 24" fill="none" className="h-16 w-16 text-white/60">
                  <path
                    d="M12 3c-2.5 0-4.5 1.6-4.5 4.2 0 1.9.7 3.1 1 5.2.2 1.6.3 4.1 1.3 6.1.3.6.9 1 1.6 1s1.3-.5 1.5-1.2c.5-1.7.5-3.2.7-4.3.1-.6.4-.9.9-.9s.8.3.9.9c.2 1.1.2 2.6.7 4.3.2.7.8 1.2 1.5 1.2s1.3-.4 1.6-1c1-2 1.1-4.5 1.3-6.1.3-2.1 1-3.3 1-5.2C18.5 4.6 16.5 3 14 3c-.8 0-1.5.2-2 .6-.5-.4-1.2-.6-2-.6Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="px-6 text-center text-xs font-semibold">Photo placeholder — real clinic photography goes here</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          ref={servicesReveal.ref}
          className={servicesReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'}
        >
          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
            <div className="mb-6 text-center text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-ink">Our services</div>

            {catalogError && !isLoadingCatalog && (
              <p className="m-0 text-center text-sm text-danger-text">{catalogError}</p>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {isLoadingCatalog && services.length === 0
                ? Array.from({ length: 4 }).map((_, i) => <div key={i} className={`h-[132px] ${SKELETON_CLASS}`} />)
                : featuredServices.map((svc, i) => {
                    const theme = SERVICE_THEMES[i % SERVICE_THEMES.length];
                    return (
                      <div
                        key={svc._id}
                        className="rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_26px_oklch(22%_0.05_265_/_0.1)]"
                      >
                        <div
                          className={`mx-auto mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-2xl ${theme.bg}`}
                        >
                          {getServiceIcon(svc.name)}
                        </div>
                        <div className="text-[0.9375rem] font-bold text-ink">{svc.name}</div>
                      </div>
                    );
                  })}
            </div>

            {!isLoadingCatalog && !catalogError && featuredServices.length === 0 && (
              <p className="m-0 text-center text-sm text-ink-secondary">Our service list is being updated — check back soon.</p>
            )}
          </div>
        </section>

        <section
          id="doctors"
          ref={doctorsReveal.ref}
          className={doctorsReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'}
        >
          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-ink">Recommended doctors</div>
              <Link to="/booking/book" className="text-sm font-semibold text-ink no-underline hover:text-brand">
                See all
              </Link>
            </div>

            {catalogError && !isLoadingCatalog && (
              <p className="m-0 text-center text-sm text-danger-text">{catalogError}</p>
            )}

            <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingCatalog && doctors.length === 0
                ? Array.from({ length: 3 }).map((_, i) => <div key={i} className={`h-[168px] ${SKELETON_CLASS}`} />)
                : featuredDoctors.map((doc) => (
                    <Link
                      key={doc._id}
                      to="/booking/book"
                      className="flex flex-col gap-3 rounded-[18px] border border-border bg-surface p-6 no-underline shadow-[0_2px_8px_oklch(22%_0.05_265_/_0.05)] transition-all duration-200 ease-in-out hover:-translate-y-1.5 hover:border-brand hover:shadow-[0_16px_32px_oklch(22%_0.05_265_/_0.14)]"
                    >
                      {doc.photoUrl ? (
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="h-16 w-16 rounded-full object-cover shadow-[0_2px_6px_oklch(22%_0.05_265_/_0.1)]"
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

            {!isLoadingCatalog && !catalogError && featuredDoctors.length === 0 && (
              <p className="m-0 text-center text-sm text-ink-secondary">New doctors are joining soon — check back shortly.</p>
            )}
          </div>
        </section>

        <section
          ref={trustReveal.ref}
          className={trustReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'}
        >
          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
            <div className="rounded-[28px] bg-brand-ink p-8 text-white sm:p-14">
              <div className="mb-8 text-center text-[clamp(1.125rem,2.5vw,1.375rem)] font-bold">Why patients choose us</div>
              <div className="grid grid-cols-2 gap-7 text-center sm:grid-cols-4">
                {TRUST_STATS.map((t) => (
                  <div key={t.label}>
                    <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/12 text-[1.375rem]">
                      {t.icon}
                    </div>
                    <div className="text-[1.75rem] font-extrabold tracking-tight">{t.stat}</div>
                    <div className="mt-1.5 text-[0.8125rem] font-medium opacity-80">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <button
        type="button"
        disabled
        title="Chat support is coming soon"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 cursor-not-allowed items-center justify-center rounded-full bg-accent text-xl text-accent-ink opacity-70 shadow-[0_8px_20px_oklch(70%_0.16_35_/_0.35)]"
      >
        💬
      </button>

      <Footer />
    </div>
  );
}
