const GRADIENT_CLASSES = {
  brand: 'bg-[linear-gradient(150deg,var(--color-brand-ink),var(--color-brand-end))]',
  clinician: 'bg-[linear-gradient(150deg,var(--color-clinician),var(--color-clinician-end))]',
};

/** Two-column split card (branded hero panel + form panel) shared by the patient/doctor auth screens. */
export default function AuthCard({ tone = 'brand', hero, children }) {
  return (
    <div className="grid w-full max-w-[1040px] grid-cols-1 overflow-hidden rounded-[24px] bg-surface shadow-[0_24px_60px_oklch(22%_0.05_265_/_0.14),0_4px_12px_oklch(22%_0.05_265_/_0.08)] md:grid-cols-2">
      <div
        className={`flex min-h-[420px] flex-col justify-between gap-8 p-8 text-white sm:p-12 lg:p-14 ${
          GRADIENT_CLASSES[tone] || GRADIENT_CLASSES.brand
        }`}
      >
        {hero}
      </div>
      <div className="flex animate-fade-in-up flex-col gap-6 p-7 sm:p-12 lg:p-14">{children}</div>
    </div>
  );
}
