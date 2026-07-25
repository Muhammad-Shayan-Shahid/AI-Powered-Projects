const { handleChatMessage, ChatbotUnavailableError } = require('../services/chatbot.service');

// Public — optionalAuth (see chatbot.routes.js) attaches req.user when a valid
// session cookie is present, but never blocks the request. Only a logged-in
// patient is ever passed through as `patient`, so an anonymous visitor or a
// doctor/admin session can use the FAQ/live-lookup side but never the booking
// tools (Phase 9b) — see chatbot.service.js for the actual tool gating.
async function sendMessage(req, res, next) {
  try {
    const { message, sessionId } = req.body;
    const patient = req.user && req.user.role === 'patient' && req.user.status === 'active' ? req.user : null;
    const { reply, sessionId: resolvedSessionId, card } = await handleChatMessage({ message, sessionId, patient });

    return res.status(200).json({
      success: true,
      data: { reply, sessionId: resolvedSessionId, card },
      message: 'OK',
    });
  } catch (error) {
    // Gemini being down/rate-limited/slow is expected, external, and must
    // never look like our own server breaking — respond gracefully instead
    // of falling through to the generic 500 handler.
    if (error instanceof ChatbotUnavailableError) {
      return res.status(error.status).json({ success: false, data: null, message: error.message });
    }
    next(error);
  }
}

module.exports = { sendMessage };
