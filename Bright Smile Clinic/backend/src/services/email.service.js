const { Resend } = require('resend');
const { RESEND_API_KEY, EMAIL_FROM } = require('../config/config');

const resend = new Resend(RESEND_API_KEY);

// resend.emails.send() resolves to { data, error } rather than throwing — it only
// console.errors the failure itself outside production, so we must check `error`
// and throw ourselves or a failed send would otherwise go completely unnoticed.
async function sendEmail({ to, subject, text }) {
  const { error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, text });
  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }
}

function sendAppointmentCreatedEmail({ to, doctorName, patientName, serviceName, dateLabel, timeSlot }) {
  return sendEmail({
    to,
    subject: `New appointment request from ${patientName}`,
    text: `Hi Dr. ${doctorName},\n\n${patientName} has requested a ${serviceName} appointment on ${dateLabel} at ${timeSlot}.\n\nLog in to your dashboard to confirm or reject this request.`,
  });
}

function sendAppointmentConfirmedEmail({ to, patientName, doctorName, serviceName, dateLabel, timeSlot }) {
  return sendEmail({
    to,
    subject: 'Your appointment is confirmed',
    text: `Hi ${patientName},\n\nDr. ${doctorName} has confirmed your ${serviceName} appointment on ${dateLabel} at ${timeSlot}.\n\nWe look forward to seeing you.`,
  });
}

function sendAppointmentRejectedEmail({ to, patientName, doctorName, serviceName, dateLabel, timeSlot, rejectionReason }) {
  const reasonLine = rejectionReason ? `\n\nReason: ${rejectionReason}` : '';
  return sendEmail({
    to,
    subject: 'Update on your appointment request',
    text: `Hi ${patientName},\n\nDr. ${doctorName} was unable to accept your ${serviceName} appointment request for ${dateLabel} at ${timeSlot}.${reasonLine}\n\nPlease log in to book another time.`,
  });
}

function sendDoctorApprovedEmail({ to, doctorName }) {
  return sendEmail({
    to,
    subject: 'Your Bright Smile Clinic account is approved',
    text: `Hi Dr. ${doctorName},\n\nYour doctor account has been approved. You can now log in and access your dashboard.`,
  });
}

function sendDoctorRejectedEmail({ to, doctorName, reason }) {
  const reasonLine = reason ? `\n\nReason: ${reason}` : '';
  return sendEmail({
    to,
    subject: 'Update on your Bright Smile Clinic application',
    text: `Hi Dr. ${doctorName},\n\nWe were unable to approve your doctor account application.${reasonLine}\n\nPlease contact the clinic if you have questions.`,
  });
}

module.exports = {
  sendAppointmentCreatedEmail,
  sendAppointmentConfirmedEmail,
  sendAppointmentRejectedEmail,
  sendDoctorApprovedEmail,
  sendDoctorRejectedEmail,
};
