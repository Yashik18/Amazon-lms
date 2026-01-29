const Module = require('../models/Module'); // Import Module model
const User = require('../models/User'); // Import User model
const { ACHIEVEMENTS } = require('../utils/achievements');

// @desc    Get user progress
// @route   GET /api/v1/progress/user/:userId
// @access  Private
exports.getProgress = async (req, res) => {
    try {
        const targetUserId = req.params.userId || req.user.id;

        if (targetUserId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Fetch all available module categories to ensure the breakdown is complete
        const allModuleCategories = await Module.distinct('category');

        const user = await User.findById(targetUserId)
            .populate('progress.workflowsCompleted', 'title estimatedTime category')
            .populate('progress.scenariosAttempted.scenarioId', 'title difficulty category')
            .populate('progress.modulesCompleted', 'category'); // Populate modules for category stats

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // --- 1. Unique Calculation for Scenarios ---
        // We only count specific scenarios once (taking the BEST score)
        const scenarioBestScores = {}; // { scenarioId: { score: 90, category: 'PPC' } }

        user.progress.scenariosAttempted.forEach(attempt => {
            if (!attempt.scenarioId) return; // Skip if scenario deleted

            const sId = attempt.scenarioId._id.toString();
            // If new or better score, update
            if (!scenarioBestScores[sId] || attempt.score > scenarioBestScores[sId].score) {
                scenarioBestScores[sId] = {
                    score: attempt.score,
                    category: attempt.scenarioId.category || 'General',
                    title: attempt.scenarioId.title
                };
            }
        });

        const uniqueScenariosSolved = Object.keys(scenarioBestScores).length;
        const totalBestScore = Object.values(scenarioBestScores).reduce((acc, item) => acc + item.score, 0);
        const averageScore = uniqueScenariosSolved > 0
            ? Math.round(totalBestScore / uniqueScenariosSolved)
            : 0;

        // --- 2. Real Category Tracking ---
        const categoryStats = {}; // { "PPC": { total: 0, count: 0 } }

        // Initialize with ALL available categories from Modules (so they show up even if 0%)
        if (allModuleCategories && allModuleCategories.length > 0) {
            allModuleCategories.forEach(cat => {
                categoryStats[cat] = { total: 0, count: 0 };
            });
        }

        // Process Scenarios
        Object.values(scenarioBestScores).forEach(item => {
            const cat = item.category;
            if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0 };

            // Normalize score to percentage (assuming scenario score is 0-100)
            categoryStats[cat].total += item.score;
            categoryStats[cat].count += 1;
        });

        // Process Workflows (Assume completion = 100%)
        user.progress.workflowsCompleted.forEach(wf => {
            if (!wf) return;
            const cat = wf.category || 'Workflows';
            if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0 };

            categoryStats[cat].total += 100;
            categoryStats[cat].count += 1;
        });

        // Process Modules (Assume completion = 100%)
        // Note: user.progress.modulesCompleted is now populated with objects { _id, category }
        user.progress.modulesCompleted.forEach(mod => {
            if (!mod) return; // Skip if module was deleted
            const cat = mod.category || 'General';
            if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0 };

            categoryStats[cat].total += 100;
            categoryStats[cat].count += 1;
        });

        const categoryBreakdown = {};
        Object.keys(categoryStats).forEach(cat => {
            const { total, count } = categoryStats[cat];
            categoryBreakdown[cat] = Math.round(total / count);
        });

        // --- 3. Lower Learning Time Estimates (50% reduction) ---
        const completedModules = user.progress.modulesCompleted.length;
        const totalWorkflows = user.progress.workflowsCompleted.length;

        // Revised Formula: Workflow=15m (was 30), Scenario=8m (was 15), Module=5m (was 10)
        let totalMinutes = 0;
        user.progress.workflowsCompleted.forEach(wf => {
            // Use specific estimated time if available, else default significantly reduced
            totalMinutes += (wf.estimatedTime ? Math.round(wf.estimatedTime * 0.5) : 15);
        });
        totalMinutes += (uniqueScenariosSolved * 8);
        totalMinutes += (completedModules * 5);


        // Detailed Stats Object
        const fullStats = {
            overview: {
                totalMinutes,
                modulesCompleted: completedModules,
                workflowsMastered: totalWorkflows,
                scenariosSolved: uniqueScenariosSolved, // Count unique only
                averageScore,
                currentStreak: user.progress.stats.currentStreak
            },
            activityFeed: user.progress.activityLog.slice().reverse().slice(0, 10),
            achievements: {
                earned: user.progress.achievements.map(a => {
                    const def = ACHIEVEMENTS.find(def => def.id === a.id);
                    return { ...def, earnedAt: a.earnedAt };
                }),
                all: ACHIEVEMENTS
            },
            categoryBreakdown: Object.keys(categoryBreakdown).length > 0 ? categoryBreakdown : { "General": 0 }
        };

        res.json({
            success: true,
            data: fullStats
        });
    } catch (error) {
        console.error("Progress Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
