import { getInitials } from '../../../../utils/getInitials';
import { formatDoctorName } from '../../../../utils/formatDoctorName';

// Imported from the Chat Widget.dc.html design. Renders the real doctor list
// a find_doctors_by_service tool call returned (chatbot.service.js) — never
// placeholder data. Tapping a doctor sends their name back as the next chat
// message, matching the "selection = next message" pattern used by every card.
export default function DoctorPickerCard({ data, onSelect }) {
  const { doctors } = data;

  return (
    <div className="box-border flex max-w-[92%] flex-col gap-[9px] rounded-2xl rounded-bl-[4px] border border-border bg-white p-3">
      <div className="font-semibold text-[0.8125rem] text-ink">A few doctors who can help:</div>
      <div className="flex gap-2.5 overflow-x-auto pb-0.5">
        {doctors.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => onSelect(doc)}
            className="flex w-[116px] shrink-0 flex-col items-center gap-1.5 rounded-[14px] border-[1.5px] border-border bg-[oklch(97.5%_0.006_250)] px-2 py-2.5 transition-colors duration-150 hover:border-[oklch(62%_0.075_195)] hover:bg-[oklch(97.5%_0.015_195)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clinician-subtle text-[0.8125rem] font-bold text-clinician">
              {getInitials(doc.name)}
            </div>
            <div className="text-center text-[0.75rem] font-bold leading-[1.25] text-ink">{formatDoctorName(doc.name)}</div>
            {doc.specialization && (
              <div className="text-center text-[0.6875rem] font-medium leading-[1.25] text-ink-secondary">{doc.specialization}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
