const express = require('express');
const router = express.Router();
const { sendMessage, getHistory, getAllConversations, deleteConversation } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

const validateMessage = [
    body('message').notEmpty().withMessage('Message is required').trim(),
];

router.post('/message', protect, validateMessage, sendMessage);
router.get('/', protect, getAllConversations);
router.get('/history/:conversationId', protect, getHistory);
router.delete('/:conversationId', protect, deleteConversation);

module.exports = router;
