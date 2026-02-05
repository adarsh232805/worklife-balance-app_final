import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/lib/models/User';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await UserModel.findById(session.user.id).select('xp level streak');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            xp: user.xp,
            level: user.level,
            streak: user.streak,
            nextLevelXp: Math.pow(user.level, 2) * 100 // Inverse of level = sqrt(xp/100) -> xp = level^2 * 100
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }
}
