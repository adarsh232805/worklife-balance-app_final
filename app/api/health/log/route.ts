import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HealthLog from '@/lib/models/HealthLog';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, value, title, metadata } = body;

        // "AI" Logic: If title contains certain keywords, enhance metadata
        // In a real app, this would be an LLM call. Here we do "Local AI"
        let enhancedMetadata = { ...metadata };
        if (type === 'food' && !metadata?.calories) {
            // Mock calorie estimation
            enhancedMetadata.calories = Math.floor(value * 1.5); // dummy calc
        }

        await dbConnect();

        const log = await HealthLog.create({
            userId: session.user.id,
            type,
            value,
            title,
            metadata: enhancedMetadata,
            date: new Date()
        });

        // XP Award for Healthy choices (Gamification integration)
        let xpAward = 0;
        if (type === 'exercise') xpAward = Math.min(50, Math.floor(value / 2));
        if (type === 'water') xpAward = 5;

        if (xpAward > 0) {
            const { updateUserProgress } = await import('@/lib/gamification');
            await updateUserProgress(session.user.id, xpAward);

            // Notification for significant achievements
            const { createNotification } = await import('@/lib/notifications');
            if (type === 'exercise' && value >= 30) {
                await createNotification(
                    session.user.id,
                    "Workout Complete",
                    `Great job moving! You earned ${xpAward} XP.`,
                    "success"
                );
            }
        }

        return NextResponse.json(log);
    } catch (error) {
        console.error("Health Log Error:", error);
        return NextResponse.json({
            error: 'Failed to log health data',
            details: (error as Error).message
        }, { status: 500 });
    }
}
