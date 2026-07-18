function pad2(n) {
  return String(n).padStart(2, '0');
}

// Builds a "YYYY-MM-DD" key straight from calendar parts — never round-trips
// through Date/toISOString, which shifts the day near midnight in timezones
// behind UTC.
export function formatDateKey(year, monthIndex, day) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

export function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return { year, monthIndex: month - 1, day };
}

// Renders a "YYYY-MM-DD" key as "Fri, Jul 24" without ever constructing a
// local-timezone Date from the string (which can render the wrong day).
export function formatDateLabel(key) {
  const { year, monthIndex, day } = parseDateKey(key);
  const date = new Date(Date.UTC(year, monthIndex, day));
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

// "YYYY-MM-DD" -> "Jul 24" (no weekday — used on the booking confirmation summary)
export function formatDateKeyShort(key) {
  const { year, monthIndex, day } = parseDateKey(key);
  const date = new Date(Date.UTC(year, monthIndex, day));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

// "09:00" (backend 24h format) -> "9:00 AM"
export function formatTimeLabel(time) {
  const [hoursStr, minutes] = time.split(':');
  const hours = Number(hoursStr);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

// appointment.date comes back as a UTC-midnight ISO string — read it with the
// UTC getters (not local ones) so the calendar day never shifts.
export function formatAppointmentDateTime(dateISOString, timeSlot) {
  const d = new Date(dateISOString);
  const dateLabel = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return `${dateLabel}, ${formatTimeLabel(timeSlot)}`;
}

export function isFutureAppointment(dateISOString, timeSlot) {
  const d = new Date(dateISOString);
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const appointmentMs = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hours, minutes);
  return appointmentMs > Date.now();
}
