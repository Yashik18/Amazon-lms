
const express = require('express');
const router = express.Router();
const { getModules, getModule, completeModule, createModule, deleteModule } = require('../controllers/moduleController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getModules);
router.get('/:id', protect, getModule);
router.post('/:id/complete', protect, completeModule);
router.post('/', protect, createModule);
router.delete('/:id', protect, deleteModule);

module.exports = router;
