import { getInitials } from '../../../../utils/getInitials';
import { formatDoctorName } from '../../../../utils/formatDoctorName';
import { formatDateLabel, formatTimeLabel } from '../../../../utils/dateFormat';

// Imported from the Chat Widget.dc.html design — one card, two variants
// (matches the design's single "booking" message that flips a `success` flag):
// - variant="confirm": the required pre-booking confirmation step (doctor,
//   service, date, time) with Change/Confirm Booking buttons.
// - variant="success": shown after create_booking actually succeeds — no
//   buttons, just the real saved appointment's details.
export default function ConfirmationCard({ data, variant, onConfirm, onChange }) {
  const { doctorName, serviceName, date, timeSlot } = data;

  return (
    <div className="box-border flex w-[260px] max-w-[92%] flex-col gap-3 rounded-2xl rounded-bl-[4px] border border-border bg-white p-3.5">
      {variant === 'success' ? (
        <div className="flex flex-col items-center gap-2 px-0 py-1 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-success-bg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" className="text-success-text" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-[0.9375rem] font-bold text-ink">Booked!</div>
          <div className="text-[0.75rem] font-medium text-ink-secondary">
            {formatDoctorName(doctorName)} &middot; {serviceName}
            <br />
            {formatDateLabel(date)} at {formatTimeLabel(timeSlot)}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2.5">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-clinician-subtle text-[0.75rem] font-bold text-clinician">
              {getInitials(doctorName)}
            </div>
            <div className="text-[0.8125rem] font-bold text-ink">{formatDoctorName(doctorName)}</div>
          </div>
          <div className="flex flex-col gap-[5px] rounded-xl bg-page px-3.5 py-3">
            <div className="flex justify-between text-[0.75rem] font-medium text-ink-secondary">
              <span>Service</span>
              <span className="font-bold text-ink">{serviceName}</span>
            </div>
            <div className="flex justify-between text-[0.75rem] font-medium text-ink-secondary">
              <span>Date</span>
              <span className="font-bold text-ink">{formatDateLabel(date)}</span>
            </div>
            <div className="flex justify-between text-[0.75rem] font-medium text-ink-secondary">
              <span>Time</span>
              <span className="font-bold text-ink">{formatTimeLabel(timeSlot)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onChange}
              className="flex-1 rounded-full border-[1.5px] border-border bg-white px-2.5 py-2.5 text-[0.8125rem] font-semibold text-ink transition-colors duration-150 hover:bg-page"
            >
              Change
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-full border-none bg-accent px-2.5 py-2.5 text-[0.8125rem] font-bold text-accent-ink transition-colors duration-150 hover:bg-accent-hover"
            >
              Confirm Booking
            </button>
          </div>
        </>
      )}
    </div>
  );
}
