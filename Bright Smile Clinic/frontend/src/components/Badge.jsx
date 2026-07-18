const STATUS_TONES = {
  pending: 'bg-warning-bg text-warning-text',
  confirmed: 'bg-success-bg text-success-text',
  rejected: 'bg-rejected-bg text-danger-text',
  completed: 'bg-neutral-badge-bg text-neutral-badge-text',
  cancelled: 'bg-neutral-badge-bg text-neutral-badge-text',
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/** Appointment status pill — tone/label driven by the backend's `status` enum. */
export default function Badge({ status }) {
  const toneClass = STATUS_TONES[status] || STATUS_TONES.completed;
  const label = STATUS_LABELS[status] || status;

  return (
    <div
      className={`inline-flex animate-badge-fade-in items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold text-xs ${toneClass}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </div>
  );
}
