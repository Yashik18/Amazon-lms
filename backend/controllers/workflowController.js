const Workflow = require('../models/Workflow');
const User = require('../models/User');
const aiService = require('../services/aiService');
const { checkAchievements } = require('../utils/achievements');
const { updateStreak } = require('../utils/streakHelper');

// @desc    List all workflows with user progress
// @route   GET /api/v1/workflows
// @access  Private
exports.getWorkflows = async (req, res) => {
    try {
        const workflows = await Workflow.find({}).sort({ order: 1 });

        // Map workflows to include user-specific status
        const workflowsWithProgress = workflows.map(wf => {
            const userProgress = req.user.progress.activeWorkflows.find(
                aw => aw.workflowId.toString() === wf._id.toString()
            );

            const isCompleted = req.user.progress.workflowsCompleted.some(
                id => id.toString() === wf._id.toString()
            );

            return {
                ...wf.toObject(),
                completed: isCompleted,
                currentStep: userProgress ? userProgress.currentStep : 0,
                totalSteps: wf.steps.length,
                progressPercent: isCompleted ? 100 : (userProgress ? Math.round((userProgress.currentStep / wf.steps.length) * 100) : 0)
            };
        });

        res.json({ success: true, count: workflowsWithProgress.length, data: workflowsWithProgress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get workflow details
// @route   GET /api/v1/workflows/:id
// @access  Private
exports.getWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            return res.status(404).json({ success: false, message: 'Workflow not found' });
        }

        const userProgress = req.user.progress.activeWorkflows.find(
            aw => aw.workflowId.toString() === workflow._id.toString()
        );

        res.json({
            success: true,
            data: {
                ...workflow.toObject(),
                userProgress: userProgress || { currentStep: 0, completed: false, stepHistory: [] }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update progress
// @route   POST /api/v1/workflows/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
    try {
        const workflowId = req.params.id;
        const { completed, stepIndex, userInput } = req.body;

        const workflow = await Workflow.findById(workflowId);
        if (!workflow) return res.status(404).json({ success: false, message: 'Workflow not found' });

        // Find or create active workflow progress
        let activeWfIndex = req.user.progress.activeWorkflows.findIndex(
            aw => aw.workflowId.toString() === workflowId
        );

        if (activeWfIndex === -1) {
            req.user.progress.activeWorkflows.push({
                workflowId,
                currentStep: 0,
                completed: false,
                stepHistory: []
            });
            activeWfIndex = req.user.progress.activeWorkflows.length - 1;
        }

        const activeWf = req.user.progress.activeWorkflows[activeWfIndex];

        // Validating Input (AI Check)
        let aiFeedback = null;
        if (userInput && workflow.steps[stepIndex]) {
            // Check if step requires validation?
            // For MVP, just log it. In future, call aiService.validateStep(workflow.steps[stepIndex], userInput)
        }

        // Update Step
        if (typeof stepIndex === 'number') {
            activeWf.currentStep = stepIndex + 1; // Move to next
            activeWf.stepHistory.push({
                step: stepIndex,
                input: userInput || '',
                feedback: aiFeedback || 'Step completed'
            });
        }


        // Update Streak
        updateStreak(req.user);

        // Mark Completed
        let achievementsEarned = [];
        if (completed || activeWf.currentStep >= workflow.steps.length) {
            activeWf.completed = true;
            activeWf.currentStep = workflow.steps.length; // Max out

            if (!req.user.progress.workflowsCompleted.includes(workflowId)) {
                req.user.progress.workflowsCompleted.push(workflowId);

                // Log Activity
                req.user.progress.activityLog.push({
                    type: 'workflow',
                    description: `Completed workflow: ${workflow.title}`,
                    meta: { workflowId }
                });

                // Check Achievements
                achievementsEarned = checkAchievements(req.user, 'workflow', { completed: true });
            }
        }

        await req.user.save();

        res.json({
            success: true,
            message: 'Progress updated',
            nextStep: activeWf.currentStep,
            achievements: achievementsEarned
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get AI hint for a step
// @route   POST /api/v1/workflows/hint
// @access  Private
exports.getWorkflowHint = async (req, res) => {
    try {
        const { stepTitle, stepInstruction } = req.body;

        const prompt = `I am stuck on this step: "${stepTitle}".
        Instruction: "${stepInstruction}".
        Please give me a short, helpful hint or tip to get started. Do not do the work for me, just guide me. Keep it concise.`;

        // Get context
        const context = await aiService.getRelevantContext(stepTitle + " " + stepInstruction);

        const hint = await aiService.chatWithAI(prompt, [], context);

        res.json({ success: true, hint });
    } catch (error) {
        console.error("Hint Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a workflow
// @route   DELETE /api/v1/workflows/:id
// @access  Private/Admin
exports.deleteWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            return res.status(404).json({ success: false, message: 'Workflow not found' });
        }

        await workflow.deleteOne();

        res.json({ success: true, message: 'Workflow removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
