import { useId } from 'react';

const TONE_CLASSES = {
  brand: 'hover:border-brand/40 focus:border-brand focus:ring-brand-ring',
  clinician: 'hover:border-clinician/40 focus:border-clinician focus:ring-clinician-ring',
  admin: 'hover:border-admin/40 focus:border-admin focus:ring-admin-ring',
};

export default function Input({
  label,
  error,
  success,
  tone = 'brand',
  rightElement,
  className = '',
  id,
  ...props
}) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[0.8125rem] font-semibold text-ink-secondary">{label}</span>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          className={[
            'w-full rounded-xl border-[1.5px] bg-surface px-4 py-3 font-sans text-[0.9375rem] text-ink',
            'outline-none transition-all duration-200 ease-in-out placeholder:text-ink-tertiary',
            'focus:ring-[3px]',
            error ? 'border-danger' : 'border-border',
            TONE_CLASSES[tone] || TONE_CLASSES.brand,
            rightElement ? 'pr-12' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {rightElement && <div className="absolute right-3">{rightElement}</div>}
      </div>
      {error && <span className="text-xs font-medium text-danger-text">{error}</span>}
      {!error && success && <span className="text-xs font-medium text-success-text">{success}</span>}
    </label>
  );
}
