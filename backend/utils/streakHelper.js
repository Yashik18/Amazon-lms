
const updateStreak = (user) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.progress.stats.lastActivityDate ? new Date(user.progress.stats.lastActivityDate) : null;

    // If no last activity, start streak
    if (!lastActivity) {
        user.progress.stats.currentStreak = 1;
        user.progress.stats.lastActivityDate = new Date();
        return;
    }

    // Check if last activity was today (do nothing)
    const lastActivityDay = new Date(lastActivity);
    lastActivityDay.setHours(0, 0, 0, 0);

    if (today.getTime() === lastActivityDay.getTime()) {
        user.progress.stats.lastActivityDate = new Date(); // Update timestamp but don't increment
        return;
    }

    // Check if last activity was yesterday (increment)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (yesterday.getTime() === lastActivityDay.getTime()) {
        user.progress.stats.currentStreak += 1;
    } else {
        // Streak broken
        user.progress.stats.currentStreak = 1;
    }

    user.progress.stats.lastActivityDate = new Date();
};

module.exports = { updateStreak };
