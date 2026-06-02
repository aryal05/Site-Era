const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middleware/auth');

router.get('/', teamController.getAllMembers);
router.post('/', authMiddleware, teamController.createMember);
router.put('/:id', authMiddleware, teamController.updateMember);
router.delete('/:id', authMiddleware, teamController.deleteMember);

module.exports = router;
