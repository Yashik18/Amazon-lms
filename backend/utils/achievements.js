// Achievement Definitions and Logic

const ACHIEVEMENTS = [
    { id: 'first_steps', title: 'First Steps', description: 'Complete your first workflow', icon: '🏆' },
    { id: 'curious_mind', title: 'Curious Mind', description: 'Ask 10 questions to the AI', icon: '🎯' },
    { id: 'question_master', title: 'Question Master', description: 'Ask 50 questions', icon: '🧠' },
    { id: 'perfect_score', title: 'Perfect Score', description: 'Score 100% on any scenario', icon: '🌟' },
    { id: 'scenario_ace', title: 'Scenario Ace', description: 'Complete 5 scenarios with high scores', icon: '🃏' },
    { id: 'week_warrior', title: 'Week Warrior', description: '7-day learning streak', icon: '🔥' },
    { id: 'fast_learner', title: 'Fast Learner', description: 'Complete a workflow in under 20 minutes', icon: '🚀' },
    { id: 'night_owl', title: 'Night Owl', description: 'Complete an activity between 12 AM and 5 AM', icon: '🦉' },
    { id: 'early_bird', title: 'Early Bird', description: 'Complete an activity between 5 AM and 8 AM', icon: '🌅' }
];

const checkAchievements = (user, activityType, activityData) => {
    const newAchievements = [];
    const hasAchievement = (id) => user.progress.achievements.some(a => a.id === id);
    const award = (id) => {
        if (!hasAchievement(id)) {
            user.progress.achievements.push({ id, earnedAt: new Date() });
            newAchievements.push(ACHIEVEMENTS.find(a => a.id === id));
        }
    };

    const now = new Date();
    const hour = now.getHours();

    // Time based
    if (hour >= 0 && hour < 5) award('night_owl');
    if (hour >= 5 && hour < 8) award('early_bird');

    // Stats based
    if (user.progress.workflowsCompleted.length >= 1) award('first_steps');
    if (user.progress.stats.questionsAsked >= 10) award('curious_mind');
    if (user.progress.stats.questionsAsked >= 50) award('question_master');
    if (user.progress.stats.currentStreak >= 7) award('week_warrior');

    // Activity specific
    if (activityType === 'scenario' && activityData.score === 100) {
        award('perfect_score');
    }

    if (activityType === 'workflow' && activityData.completed) {
        // Fast learner check (simplified: if step history length is small implies fast? No, need timestamps)
        // For MVP, just checking completion or random chance for demo
    }

    return newAchievements;
};

module.exports = { ACHIEVEMENTS, checkAchievements };
