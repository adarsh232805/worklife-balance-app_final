import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/lib/models/Task';
import Activity from '@/lib/models/Activity';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get today's focus sessions for THIS user
        const focusSessions = await Activity.find({
            type: 'Focus',
            startTime: { $gte: today },
            userId: session.user.id,
        });

        const focusMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);

        // Get task stats for THIS user
        const completedTasks = await Task.countDocuments({
            completed: true,
            updatedAt: { $gte: today },
            userId: session.user.id,
        });

        const pendingTasks = await Task.countDocuments({
            completed: false,
            userId: session.user.id,
        });

        return NextResponse.json({
            focusMinutes,
            completedTasks,
            pendingTasks,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
