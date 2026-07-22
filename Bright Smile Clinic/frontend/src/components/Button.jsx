const TONE_CLASSES = {
  brand: 'bg-brand text-white hover:bg-brand-hover focus-visible:ring-brand-ring',
  clinician: 'bg-clinician text-white hover:bg-clinician-hover focus-visible:ring-clinician-ring',
  admin: 'bg-admin text-white hover:bg-admin-hover focus-visible:ring-admin-ring',
};

export default function Button({
  as: Component = 'button',
  children,
  type = 'button',
  tone = 'brand',
  pill = true,
  loading = false,
  disabled = false,
  fullWidth = true,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;
  const isButtonEl = Component === 'button';

  return (
    <Component
      {...(isButtonEl ? { type, disabled: isDisabled } : {})}
      className={[
        'inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-bold text-[0.9375rem]',
        'transition-all duration-200 ease-in-out enabled:hover:-translate-y-0.5 enabled:hover:shadow-md active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-75',
        'focus-visible:outline-none focus-visible:ring-[3px]',
        pill ? 'rounded-full px-7 py-3.5' : 'rounded-[10px] px-5 py-3',
        fullWidth ? 'w-full' : '',
        TONE_CLASSES[tone] || TONE_CLASSES.brand,
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white" />
      )}
      {children}
    </Component>
  );
}
