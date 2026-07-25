const express = require('express');
const chatbotController = require('../controllers/chatbot.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { sendMessageSchema } = require('../validator/chatbot.validator');

const router = express.Router();

// Public — patients chat without logging in. optionalAuth attaches req.user
// when a valid session cookie is present (so the booking tools can act as the
// logged-in patient) but never blocks the request when it's absent/invalid —
// an anonymous visitor can still use the FAQ/live-lookup side of the bot.
router.post('/message', optionalAuth, validate(sendMessageSchema), chatbotController.sendMessage);

module.exports = router;
