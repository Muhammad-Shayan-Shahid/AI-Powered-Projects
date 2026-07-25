// Some doctor records already have "Dr." typed into their name field, so a
// naive `Dr. ${name}` prepend anywhere doubles up to "Dr. Dr. X". This is the
// single place that decides whether a prefix is needed, so every display
// spot (emails, in-app notifications, chatbot data) stays correct regardless
// of how the name was originally entered.
function formatDoctorName(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return '';
  return /^dr\.?(\s|$)/i.test(trimmed) ? trimmed : `Dr. ${trimmed}`;
}

module.exports = { formatDoctorName };
