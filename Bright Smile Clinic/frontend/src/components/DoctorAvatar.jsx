/** Teal initials circle used for doctors across booking screens. */
export default function DoctorAvatar({ initials, size = 44 }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-clinician-subtle font-bold text-clinician"
      style={{ width: size, height: size, fontSize: size >= 48 ? '0.875rem' : '0.8125rem' }}
    >
      {initials}
    </div>
  );
}
