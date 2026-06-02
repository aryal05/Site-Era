const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const authMiddleware = require('../middleware/auth');

router.get('/', servicesController.getAllServices);
router.get('/:slug', servicesController.getServiceBySlug);
router.post('/', authMiddleware, servicesController.createService);
router.put('/:id', authMiddleware, servicesController.updateService);
router.delete('/:id', authMiddleware, servicesController.deleteService);

module.exports = router;
