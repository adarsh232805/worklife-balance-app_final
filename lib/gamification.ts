import UserModel from '@/lib/models/User';

export const XP_VALUES = {
    TASK_COMPLETION: 50,
    FOCUS_MINUTE: 5,
};

export const calculateLevel = (xp: number) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const updateUserProgress = async (userId: string, xpGain: number) => {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    // Update XP
    user.xp += xpGain;

    // Check Level Up
    const newLevel = calculateLevel(user.xp);
    if (newLevel > user.level) {
        user.level = newLevel;
        // We could add a notification/event here later
    }

    // Update Streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = new Date(user.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        user.streak += 1;
    } else if (diffDays > 1) {
        user.streak = 1; // Reset streak if missed a day
    }
    // If diffDays === 0 (same day), keep streak as is

    user.lastActivityDate = new Date();
    await user.save();

    return user;
};
