const { z } = require('zod');

// sessionId is client-generated/echoed (see chatbot.service.js) to keep short
// in-memory context within one chat session — not an auth token, so it's just
// validated as a non-empty string rather than an objectId.
const sendMessageSchema = z.object({
  message: z.string().trim().min(1, 'message is required.').max(2000, 'message is too long.'),
  sessionId: z.string().trim().min(1).optional(),
});

module.exports = { sendMessageSchema };
