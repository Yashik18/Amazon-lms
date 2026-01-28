const express = require('express');
const router = express.Router();
const { uploadDataset, createWorkflow, createScenario, getSystemStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.post('/datasets', protect, authorize('admin'), uploadDataset);
router.post('/workflows', protect, authorize('admin'), createWorkflow);
router.post('/scenarios', protect, authorize('admin'), createScenario);
router.get('/stats', protect, authorize('admin'), getSystemStats);

module.exports = router;
