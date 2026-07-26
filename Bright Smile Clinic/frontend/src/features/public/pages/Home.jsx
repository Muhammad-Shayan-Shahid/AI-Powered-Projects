import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Footer';
import PublicNavbar from '../../../components/PublicNavbar';
import DoctorAvatar from '../../../components/DoctorAvatar';
import StarRating from '../../../components/StarRating';
import { useBooking } from '../../booking/hooks/useBooking';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useCountUp } from '../hooks/useCountUp';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { getInitials } from '../../../utils/getInitials';
import { formatDoctorName } from '../../../utils/formatDoctorName';

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

// Same idea as the icon lookup above: the Service model has no photo field,
// so real service names are keyword-matched onto free-license Unsplash photos
// (ids verified by hand — see design-handoff notes). Falls back to a rotating
// default set (keyed by card index) for anything unmatched, so a page full of
// admin-created services never renders visibly blank/duplicate photography.
const SERVICE_IMAGE_KEYWORDS = [
  { match: /whiten/i, id: '1654373535457-383a0a4d00f9' }, // close-up bright smile
  { match: /brace|ortho|align/i, id: '1720685193964-4529228a33c1' }, // braces model
  { match: /implant/i, id: '1593022356769-11f762e25ed9' }, // implant model
  { match: /pediatric|child|kid/i, id: '1565090568947-7293970ba471' }, // child dental exam
  { match: /clean|hygiene/i, id: '1698749778813-ad5f2814e50f' }, // dental mirror tool
  { match: /root canal|endodon|fill/i, id: '1642844744022-d76a9af3711a' }, // dental drill tools
];
const DEFAULT_SERVICE_IMAGE_IDS = [
  '1667133295315-820bb6481730', // dentist examining patient with a scanner
  '1606811971618-4486d14f3f99', // dental exam with mirror and tool
];

function getServiceImageId(name, index) {
  const found = SERVICE_IMAGE_KEYWORDS.find((entry) => entry.match.test(name || ''));
  return found ? found.id : DEFAULT_SERVICE_IMAGE_IDS[index % DEFAULT_SERVICE_IMAGE_IDS.length];
}

function unsplashUrl(id, width) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${width}&auto=format&fit=crop`;
}

// Marketing copy, not a live metric — no aggregation endpoint exists yet for
// patients-treated / satisfaction / insurance-plan counts. `value` is the raw
// number the count-up animates to; `suffix` is appended after animating.
const TRUST_STATS = [
  { icon: '🧑‍⚕️', value: 24, suffix: '', label: 'Certified doctors' },
  { icon: '🙂', value: 2400, suffix: '+', label: 'Patients treated' },
  { icon: '⭐', value: 98, suffix: '%', label: 'Patient satisfaction' },
  { icon: '🛡️', value: 15, suffix: '+', label: 'Insurance plans accepted' },
];

// Placeholder-but-realistic clinic details — swap these for the real client's
// info before launch. Kept as one small config object so that's a one-spot edit.
const CLINIC_INFO = {
  phoneDisplay: '+1 (800) 555-1234',
  phoneHref: 'tel:+18005551234',
  email: 'hello@brightsmile.example',
  addressLine1: '128 Maple Street, Suite 4',
  addressLine2: 'Portland, OR 97205',
  hours: [
    { days: 'Mon–Fri', time: '9am–6pm' },
    { days: 'Sat', time: '9am–2pm' },
    { days: 'Sun', time: 'Closed' },
  ],
};
const CLINIC_MAP_QUERY = encodeURIComponent(
  `${CLINIC_INFO.addressLine1}, ${CLINIC_INFO.addressLine2}`
);

const SKELETON_CLASS =
  'animate-shimmer rounded-2xl bg-[length:400px_100%] bg-[linear-gradient(90deg,var(--color-shimmer-from)_25%,var(--color-shimmer-via)_37%,var(--color-shimmer-from)_63%)]';

function StatCounter({ value, suffix, start, prefersReducedMotion }) {
  const displayed = useCountUp(value, { start, prefersReducedMotion });
  return (
    <div className="text-[1.75rem] font-extrabold tracking-tight">
      {displayed.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function Home() {
  const { services, doctors, isLoadingCatalog, catalogError, fetchServices, fetchDoctors } = useBooking();

  const servicesReveal = useRevealOnScroll();
  const doctorsReveal = useRevealOnScroll();
  const trustReveal = useRevealOnScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

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

            <div className="relative order-2 h-[clamp(280px,40vw,420px)] overflow-hidden rounded-3xl shadow-[0_20px_44px_oklch(22%_0.05_265_/_0.18)]">
              <img
                src={unsplashUrl('1606811841689-23dfddce3e95', 1200)}
                srcSet={`${unsplashUrl('1606811841689-23dfddce3e95', 640)} 640w, ${unsplashUrl('1606811841689-23dfddce3e95', 960)} 960w, ${unsplashUrl('1606811841689-23dfddce3e95', 1400)} 1400w`}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt="Dentist smiling with a patient in a modern clinic"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="1200"
                height="800"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,oklch(22%_0.05_265_/_0.45),transparent_45%)]" />
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
                ? Array.from({ length: 4 }).map((_, i) => <div key={i} className={`h-[172px] ${SKELETON_CLASS}`} />)
                : featuredServices.map((svc, i) => {
                    const theme = SERVICE_THEMES[i % SERVICE_THEMES.length];
                    const imageId = getServiceImageId(svc.name, i);
                    return (
                      <div
                        key={svc._id}
                        className="overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_26px_oklch(22%_0.05_265_/_0.1)]"
                      >
                        <div className="relative h-[130px]">
                          <img
                            src={unsplashUrl(imageId, 480)}
                            srcSet={`${unsplashUrl(imageId, 320)} 320w, ${unsplashUrl(imageId, 480)} 480w, ${unsplashUrl(imageId, 640)} 640w`}
                            sizes="(min-width: 768px) 22vw, 45vw"
                            alt={svc.name}
                            loading="lazy"
                            decoding="async"
                            width="480"
                            height="130"
                            className="h-full w-full object-cover"
                          />
                          <div
                            className={`absolute -bottom-[18px] left-4 flex h-11 w-11 items-center justify-center rounded-xl text-2xl shadow-[0_4px_10px_oklch(22%_0.05_265_/_0.14)] ${theme.bg}`}
                          >
                            {getServiceIcon(svc.name)}
                          </div>
                        </div>
                        <div className="px-4.5 pb-5 pt-[26px] text-center">
                          <div className="text-[0.9375rem] font-bold text-ink">{svc.name}</div>
                        </div>
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
                          alt={formatDoctorName(doc.name)}
                          className="h-16 w-16 rounded-full object-cover shadow-[0_2px_6px_oklch(22%_0.05_265_/_0.1)]"
                        />
                      ) : (
                        <DoctorAvatar initials={getInitials(doc.name)} size={64} />
                      )}
                      <div>
                        <div className="text-base font-bold text-ink">{formatDoctorName(doc.name)}</div>
                        <div className="mt-0.5 text-[0.8125rem] text-ink-secondary">
                          {doc.specialization || 'General dentistry'}
                        </div>
                        <div className="mt-2">
                          <StarRating rating={doc.averageRating || 0} showCount={false} />
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
                    <StatCounter
                      value={t.value}
                      suffix={t.suffix}
                      start={trustReveal.isVisible}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                    <div className="mt-1.5 text-[0.8125rem] font-medium opacity-80">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <section>
        <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 items-stretch gap-10 rounded-3xl border border-border bg-surface p-[clamp(28px,5vw,48px)] shadow-[0_2px_8px_oklch(22%_0.05_265_/_0.05)] md:grid-cols-2">
            <div className="flex flex-col justify-center gap-5.5">
              <div>
                <div className="mb-2 text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-ink">Visit or reach us</div>
                <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-secondary">
                  We're happy to answer questions or help you book.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <a href={CLINIC_INFO.phoneHref} className="flex items-center gap-3 no-underline">
                  <span className="flex h-9.5 w-9.5 flex-shrink-0 items-center justify-center rounded-[11px] bg-clinician-subtle text-clinician">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .7 2.9a2 2 0 01-.5 2.1L8 10a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.4 1.9.6 2.9.7a2 2 0 011.7 2z" />
                    </svg>
                  </span>
                  <span className="text-[0.9375rem] font-semibold text-ink">{CLINIC_INFO.phoneDisplay}</span>
                </a>
                <a href={`mailto:${CLINIC_INFO.email}`} className="flex items-center gap-3 no-underline">
                  <span className="flex h-9.5 w-9.5 flex-shrink-0 items-center justify-center rounded-[11px] bg-brand-subtle text-brand">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </span>
                  <span className="text-[0.9375rem] font-semibold text-ink">{CLINIC_INFO.email}</span>
                </a>
                <div className="flex items-start gap-3">
                  <span className="flex h-9.5 w-9.5 flex-shrink-0 items-center justify-center rounded-[11px] bg-warning-bg text-warning-text">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1118 0z" />
                      <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </span>
                  <span className="text-[0.9375rem] font-medium leading-relaxed text-ink">
                    {CLINIC_INFO.addressLine1}
                    <br />
                    {CLINIC_INFO.addressLine2}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9.5 w-9.5 flex-shrink-0 items-center justify-center rounded-[11px] bg-success-bg text-success-text">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3.5 2" />
                    </svg>
                  </span>
                  <span className="text-[0.9375rem] font-medium leading-relaxed text-ink">
                    {CLINIC_INFO.hours.map((h) => (
                      <span key={h.days} className="block">
                        {h.days}: {h.time}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
            <div className="min-h-[220px] overflow-hidden rounded-2xl">
              <iframe
                title="Bright Smile clinic location"
                src={`https://maps.google.com/maps?q=${CLINIC_MAP_QUERY}&output=embed`}
                className="h-full min-h-[220px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

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
