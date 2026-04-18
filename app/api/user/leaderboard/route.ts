import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import UserModel from '@/lib/models/User';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Get top 10 users by XP, descending
        const users = await UserModel.find({}, 'name xp image')
            .sort({ xp: -1 })
            .limit(10)
            .lean();

        // Map to simplified format and determine current user rank
        const leaderboard = users.map((user, index) => ({
            id: (user as any)._id.toString(),
            name: user.name,
            xp: user.xp,
            rank: index + 1,
            image: user.image,
            isCurrentUser: (user as any)._id.toString() === session.user.id
        }));

        // If current user is not in top 10, fetch their rank (optional, for "You" row)
        // For now, we'll just return the top 10

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
