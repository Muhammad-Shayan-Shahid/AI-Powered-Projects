const { getIO } = require('./socket.service');
const {
  sendAppointmentCreatedEmail,
  sendAppointmentConfirmedEmail,
  sendAppointmentRejectedEmail,
  sendDoctorApprovedEmail,
  sendDoctorRejectedEmail,
} = require('./email.service');

// Socket emit and email send are independent channels — one failing must
// never prevent the other from running, so each gets its own try/catch
// instead of sharing one around both calls.
function emitToUser(event, userId, message, data) {
  try {
    getIO().to(String(userId)).emit(event, { message, data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.warn(`Failed to emit socket event "${event}" to user ${userId}:`, error);
  }
}

async function sendEmailSafe(label, sendFn) {
  try {
    await sendFn();
  } catch (error) {
    console.warn(`Failed to send "${label}" email:`, error);
  }
}

// appointment.date is stored as a UTC-midnight Date (see appointment.model.js);
// formatting from the UTC fields keeps the label from drifting a day off.
function formatDateLabel(date) {
  return date.toISOString().slice(0, 10);
}

// Callers fire these without awaiting (see appointment.controller.js) so a slow
// or failing socket/email never delays or breaks the booking response itself.
async function notifyAppointmentCreated({ appointment, doctor, patient, service }) {
  const dateLabel = formatDateLabel(appointment.date);
  const message = `${patient.name} requested a ${service.name} appointment on ${dateLabel} at ${appointment.timeSlot}.`;

  emitToUser('appointment:created', doctor._id, message, { appointmentId: appointment._id });

  await sendEmailSafe('appointment:created', () =>
    sendAppointmentCreatedEmail({
      to: doctor.email,
      doctorName: doctor.name,
      patientName: patient.name,
      serviceName: service.name,
      dateLabel,
      timeSlot: appointment.timeSlot,
    })
  );
}

async function notifyAppointmentConfirmed({ appointment, doctor }) {
  const patient = appointment.patientId;
  const service = appointment.serviceId;
  const dateLabel = formatDateLabel(appointment.date);
  const message = `Dr. ${doctor.name} confirmed your ${service.name} appointment on ${dateLabel} at ${appointment.timeSlot}.`;

  emitToUser('appointment:confirmed', patient._id, message, { appointmentId: appointment._id });

  await sendEmailSafe('appointment:confirmed', () =>
    sendAppointmentConfirmedEmail({
      to: patient.email,
      patientName: patient.name,
      doctorName: doctor.name,
      serviceName: service.name,
      dateLabel,
      timeSlot: appointment.timeSlot,
    })
  );
}

async function notifyAppointmentRejected({ appointment, doctor }) {
  const patient = appointment.patientId;
  const service = appointment.serviceId;
  const dateLabel = formatDateLabel(appointment.date);
  const reasonSuffix = appointment.rejectionReason ? ` Reason: ${appointment.rejectionReason}` : '';
  const message = `Dr. ${doctor.name} could not accept your ${service.name} appointment on ${dateLabel} at ${appointment.timeSlot}.${reasonSuffix}`;

  emitToUser('appointment:rejected', patient._id, message, {
    appointmentId: appointment._id,
    rejectionReason: appointment.rejectionReason || null,
  });

  await sendEmailSafe('appointment:rejected', () =>
    sendAppointmentRejectedEmail({
      to: patient.email,
      patientName: patient.name,
      doctorName: doctor.name,
      serviceName: service.name,
      dateLabel,
      timeSlot: appointment.timeSlot,
      rejectionReason: appointment.rejectionReason,
    })
  );
}

// Callers fire these without awaiting (see admin.controller.js) so a slow or
// failing socket/email never delays or breaks the approve/reject response.
async function notifyDoctorApproved({ doctor }) {
  const message = 'Your doctor account has been approved. You can now log in and access your dashboard.';

  emitToUser('doctor:approved', doctor._id, message, { doctorId: doctor._id });

  await sendEmailSafe('doctor:approved', () => sendDoctorApprovedEmail({ to: doctor.email, doctorName: doctor.name }));
}

async function notifyDoctorRejected({ doctor, reason }) {
  const reasonSuffix = reason ? ` Reason: ${reason}` : '';
  const message = `Your doctor account application was not approved.${reasonSuffix}`;

  emitToUser('doctor:rejected', doctor._id, message, { doctorId: doctor._id, reason: reason || null });

  await sendEmailSafe('doctor:rejected', () =>
    sendDoctorRejectedEmail({ to: doctor.email, doctorName: doctor.name, reason })
  );
}

module.exports = {
  notifyAppointmentCreated,
  notifyAppointmentConfirmed,
  notifyAppointmentRejected,
  notifyDoctorApproved,
  notifyDoctorRejected,
};
