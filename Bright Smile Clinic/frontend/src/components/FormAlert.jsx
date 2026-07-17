export default function FormAlert({ children }) {
  if (!children) return null;

  return (
    <div className="flex animate-shake items-start gap-2.5 rounded-xl border border-danger-border bg-danger-bg px-3.5 py-3">
      <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-danger text-xs font-bold text-white">
        !
      </span>
      <span className="text-sm font-medium text-danger-text">{children}</span>
    </div>
  );
}
