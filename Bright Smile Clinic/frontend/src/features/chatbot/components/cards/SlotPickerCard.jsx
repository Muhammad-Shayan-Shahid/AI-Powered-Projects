import { formatDateLabel, formatTimeLabel } from '../../../../utils/dateFormat';
import { formatDoctorName } from '../../../../utils/formatDoctorName';

// Imported from the Chat Widget.dc.html design. Renders the real slots a
// get_available_slots (or a refreshed post-conflict) tool call returned —
// tapping a slot sends its time back as the next chat message.
export default function SlotPickerCard({ data, onSelect }) {
  const { doctorName, date, slots } = data;

  return (
    <div className="box-border flex max-w-[92%] flex-col gap-2.5 rounded-2xl rounded-bl-[4px] border border-border bg-white p-3">
      <div className="text-[0.8125rem] font-bold text-ink">
        {formatDoctorName(doctorName)}&rsquo;s availability — {formatDateLabel(date)}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onSelect(slot)}
            className="rounded-full border-[1.5px] border-border bg-[oklch(97.5%_0.006_250)] px-1.5 py-2.5 text-[0.75rem] font-semibold text-ink transition-colors duration-150 hover:border-accent hover:bg-[oklch(96.5%_0.02_35)] hover:text-[oklch(46%_0.14_35)]"
          >
            {formatTimeLabel(slot)}
          </button>
        ))}
        {slots.length === 0 && <div className="col-span-full text-[0.8125rem] text-ink-secondary">No slots left that day.</div>}
      </div>
    </div>
  );
}
