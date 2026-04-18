import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import GameSession from '@/lib/models/GameSession';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { gameId, score, duration } = await req.json();

        if (!gameId || typeof score !== 'number') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await dbConnect();

        const gameSession = await GameSession.create({
            userId: session.user.id,
            gameId,
            score,
            duration: duration || 0
        });

        // Award XP for Playing Games (e.g., 5 XP per minute played, capped at 50 per session)
        if (duration > 0) {
            const { updateUserProgress } = await import('@/lib/gamification');
            // Cap at 50 XP per session to prevent abuse
            const xpEarned = Math.min(50, Math.floor(duration * 5));
            if (xpEarned > 0) {
                await updateUserProgress(session.user.id, xpEarned);
            }
        }

        return NextResponse.json({ success: true, id: gameSession._id });
    } catch (error) {
        console.error('Failed to save game session:', error);
        return NextResponse.json({ error: 'Failed to save game session' }, { status: 500 });
    }
}
