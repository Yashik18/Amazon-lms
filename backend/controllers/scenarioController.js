const Scenario = require('../models/Scenario');
const User = require('../models/User');
const aiService = require('../services/aiService');
const { updateStreak } = require('../utils/streakHelper');
const { checkAchievements } = require('../utils/achievements');

// @desc    List all scenarios
// @route   GET /api/v1/scenarios
// @access  Private
exports.getScenarios = async (req, res) => {
    try {
        const scenarios = await Scenario.find({});
        res.json({ success: true, count: scenarios.length, data: scenarios });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get scenario details
// @route   GET /api/v1/scenarios/:id
// @access  Private
exports.getScenario = async (req, res) => {
    try {
        const scenario = await Scenario.findById(req.params.id);

        if (!scenario) {
            return res.status(404).json({ success: false, message: 'Scenario not found' });
        }

        res.json({ success: true, data: scenario });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Submit answer
// @route   POST /api/v1/scenarios/:id/submit
// @access  Private
exports.submitAnswer = async (req, res) => {
    try {
        const scenario = await Scenario.findById(req.params.id);
        const { answer } = req.body; // option ID or text

        // AI Evaluation
        const evaluation = await aiService.evaluateScenarioAnswer(scenario, answer);

        const score = evaluation.score;
        const isCorrect = evaluation.isCorrect;
        const feedback = evaluation.feedback;

        // Update User Progress
        const attempt = {
            scenarioId: scenario._id,
            score,
            completedAt: Date.now()
        };
        req.user.progress.scenariosAttempted.push(attempt);

        // 1. Update Streak
        updateStreak(req.user);

        // 2. Log Activity
        req.user.progress.activityLog.push({
            type: 'scenario',
            description: `Completed scenario: ${scenario.title}`,
            meta: { scenarioId: scenario._id, score }
        });

        // 3. Check Achievements
        const earned = checkAchievements(req.user, 'scenario', { score, completed: true });

        await req.user.save();

        res.json({
            success: true,
            data: {
                isCorrect,
                score,
                feedback
            }
        });
    } catch (error) {
        console.error("Submit Answer Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
