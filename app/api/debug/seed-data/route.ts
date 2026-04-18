import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import HealthLog from '@/lib/models/HealthLog';
import Activity from '@/lib/models/Activity';
import { createNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Mock user ID for testing if no session
        // const userId = "user_2sOxh7X9..."; // Placeholder or fetch a real user if needed. 
        // Actually, let's just fetch the first user from DB to make it work.

        await dbConnect();
        // const User = require('@/lib/models/User').default;
        // const user = await User.findOne({});
        // if (!user) return NextResponse.json({ error: 'No users found' }, { status: 404 });

        // const session = { user: { id: user._id } }; // Mock session

        // 1. Create specific data for "Yesterday" to trigger AI Coach
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(12, 0, 0, 0);

        // Clear existing for clean test
        const dayStart = new Date(yesterday); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(yesterday); dayEnd.setHours(23, 59, 59, 999);

        await HealthLog.deleteMany({ userId: session.user.id, date: { $gte: dayStart, $lt: dayEnd } });

        // Insert Low Sleep to test "Sleep" tip
        await HealthLog.create({
            userId: session.user.id,
            type: 'sleep',
            value: 5, // 5 hours
            sleepHours: 5, // Custom field often used
            waterIntake: 1200,
            mood: 'tired',
            date: yesterday
        });

        // 2. Create a Test Notification
        await createNotification(
            session.user.id,
            "System Upgrade",
            "The AI Coach has been upgraded with Gemini 1.5 Flash!",
            "achievement"
        );

        return NextResponse.json({ message: "Seed data created. Refresh the page to see changes." });
    } catch (error) {
        console.error("Seed Error", error);
        return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
    }
}
