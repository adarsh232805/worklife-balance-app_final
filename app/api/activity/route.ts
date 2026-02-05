import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Activity from '@/lib/models/Activity';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const activity = await Activity.create({
            ...body,
            userId: session.user.id,
        });

        // Award XP for Focus
        if (body.type === 'Focus' && body.duration > 0) {
            const { updateUserProgress, XP_VALUES } = await import('@/lib/gamification');
            // XP = Duration (mins) * XP_PER_MIN
            const xpEarned = Math.floor(body.duration * XP_VALUES.FOCUS_MINUTE);
            await updateUserProgress(session.user.id, xpEarned);
        }

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const type = searchParams.get('type');

        const query: any = { userId: session.user.id };

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.startTime = { $gte: startDate, $lte: endDate };
        }

        if (type) {
            query.type = type;
        }

        const activities = await Activity.find(query).sort({ startTime: -1 }).limit(20);
        return NextResponse.json(activities);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}
