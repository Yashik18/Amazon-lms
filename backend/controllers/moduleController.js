const Module = require('../models/Module');
const User = require('../models/User');
const { updateStreak } = require('../utils/streakHelper');
const { checkAchievements } = require('../utils/achievements');

// @desc    List all modules
// @route   GET /api/v1/modules
// @access  Private
exports.getModules = async (req, res) => {
    try {
        const modules = await Module.find({}).sort({ order: 1 });

        // Map to include user progress
        const userModules = modules.map(mod => {
            const isCompleted = req.user.progress.modulesCompleted.includes(mod._id);
            return {
                ...mod.toObject(),
                completed: isCompleted
            };
        });

        res.json({ success: true, count: userModules.length, data: userModules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get module details
// @route   GET /api/v1/modules/:id
// @access  Private
exports.getModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

        const isCompleted = req.user.progress.modulesCompleted.includes(module._id);

        res.json({ success: true, data: { ...module.toObject(), completed: isCompleted } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark module as completed
// @route   POST /api/v1/modules/:id/complete
// @access  Private
exports.completeModule = async (req, res) => {
    try {
        const moduleId = req.params.id;
        const module = await Module.findById(moduleId);

        if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

        if (!req.user.progress.modulesCompleted.includes(moduleId)) {
            // 1. Mark as completed
            req.user.progress.modulesCompleted.push(moduleId);

            // 2. Log Activity
            req.user.progress.activityLog.push({
                type: 'module',
                description: `Completed module: ${module.title}`,
                meta: { moduleId }
            });

            // 3. Update Streak
            updateStreak(req.user);

            // 4. Check Achievements
            const newAchievements = checkAchievements(req.user, 'module', { moduleId });
            if (newAchievements.length > 0) {
                // Add achievement notification to activity log
                newAchievements.forEach(ach => {
                    req.user.progress.activityLog.push({
                        type: 'achievement',
                        description: `Unlocked achievement: ${ach.title}`,
                        meta: { achievementId: ach.id }
                    });
                });
            }

            await req.user.save();
        }

        res.json({ success: true, message: 'Module marked as completed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
