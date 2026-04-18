import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/lib/models/User';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            console.error('Check progress failed: Unauthorized (No session or user ID)');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        // Try lookup by ID first, then fallback to email
        let user = await UserModel.findById(session.user.id).select('xp level streak');

        if (!user && session.user.email) {
            console.log(`User not found by ID ${session.user.id}, trying email ${session.user.email}`);
            user = await UserModel.findOne({ email: session.user.email }).select('xp level streak');
        }

        if (!user) {
            console.error(`Check progress failed: User not found for ID ${session.user.id}`);
            return NextResponse.json({ error: 'User not found', searchedId: session.user.id }, { status: 404 });
        }

        // Calculate next level XP requirement
        const nextLevelXp = Math.pow(user.level, 2) * 100;

        return NextResponse.json({
            xp: user.xp,
            level: user.level,
            streak: user.streak,
            nextLevelXp
        });
    } catch (error) {
        console.error('Check progress API error:', error);
        return NextResponse.json({ error: 'Failed to fetch progress', details: (error as Error).message }, { status: 500 });
    }
}
