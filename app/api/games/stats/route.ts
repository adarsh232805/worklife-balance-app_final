import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import GameSession from '@/lib/models/GameSession';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Ensure accurate ID casting for aggregation
        const userId = new mongoose.Types.ObjectId(session.user.id);

        // 1. Recent Sessions (Last 10)
        const recent = await GameSession.find({ userId })
            .sort({ playedAt: -1 })
            .limit(10)
            .lean();

        // 2. High Scores & Totals per Game
        const stats = await GameSession.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$gameId",
                    bestScore: { $max: "$score" },
                    totalPlayed: { $sum: 1 },
                    totalDuration: { $sum: "$duration" },
                    lastPlayed: { $max: "$playedAt" }
                }
            }
        ]);

        return NextResponse.json({ recent, stats });
    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
