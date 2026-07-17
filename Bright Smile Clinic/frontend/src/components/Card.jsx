export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface shadow-[0_8px_24px_oklch(22%_0.01_260_/_0.06)] ${className}`}
    >
      {children}
    </div>
  );
}
