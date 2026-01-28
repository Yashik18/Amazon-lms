const express = require('express');
const router = express.Router();
const { getWorkflows, getWorkflow, updateProgress, getWorkflowHint } = require('../controllers/workflowController');
const { protect } = require('../middleware/auth');

console.log('Registering Workflow Routes');
router.post('/hint', (req, res, next) => {
    console.log('Hit /hint route');
    next();
}, protect, getWorkflowHint);

router.get('/', protect, getWorkflows);
router.get('/:id', protect, getWorkflow);
router.post('/:id/progress', protect, updateProgress);

module.exports = router;
