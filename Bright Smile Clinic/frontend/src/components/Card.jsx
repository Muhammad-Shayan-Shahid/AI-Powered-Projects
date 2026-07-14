export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl2 border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
