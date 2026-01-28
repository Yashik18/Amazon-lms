const express = require('express');
const router = express.Router();
const { getProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProgress);
router.get('/user/:userId', protect, getProgress);

module.exports = router;
