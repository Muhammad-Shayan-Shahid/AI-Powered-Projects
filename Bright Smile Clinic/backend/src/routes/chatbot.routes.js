const express = require('express');
const chatbotController = require('../controllers/chatbot.controller');
const { validate } = require('../validator/common');
const { sendMessageSchema } = require('../validator/chatbot.validator');

const router = express.Router();

// Public — patients chat without logging in. No write access to any model.
router.post('/message', validate(sendMessageSchema), chatbotController.sendMessage);

module.exports = router;
