const { handleChatMessage, ChatbotUnavailableError } = require('../services/chatbot.service');

// Public, read-only patient FAQ/intake bot — no auth, no booking actions (Phase 9a).
// See CLAUDE.md Chatbot/RAG rules: document-grounded + live lookups only, never
// medical advice, never writes anything (chat never touches DocumentChunk).
async function sendMessage(req, res, next) {
  try {
    const { message, sessionId } = req.body;
    const { reply, sessionId: resolvedSessionId } = await handleChatMessage(message, sessionId);

    return res.status(200).json({
      success: true,
      data: { reply, sessionId: resolvedSessionId },
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
