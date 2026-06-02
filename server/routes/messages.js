const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const authMiddleware = require('../middleware/auth');

router.post('/', messagesController.createMessage);
router.get('/', authMiddleware, messagesController.getAllMessages);
router.patch('/:id/status', authMiddleware, messagesController.updateMessageStatus);
router.delete('/:id', authMiddleware, messagesController.deleteMessage);

module.exports = router;
