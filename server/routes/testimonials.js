const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const authMiddleware = require('../middleware/auth');

router.get('/', testimonialsController.getAllTestimonials);
router.post('/', authMiddleware, testimonialsController.createTestimonial);
router.put('/:id', authMiddleware, testimonialsController.updateTestimonial);
router.delete('/:id', authMiddleware, testimonialsController.deleteTestimonial);

module.exports = router;
