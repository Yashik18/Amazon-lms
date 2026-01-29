const express = require('express');
const router = express.Router();
const { getScenarios, getScenario, submitAnswer, deleteScenario } = require('../controllers/scenarioController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getScenarios);
router.get('/:id', protect, getScenario);
router.post('/:id/submit', protect, submitAnswer);
router.delete('/:id', protect, deleteScenario);

module.exports = router;
