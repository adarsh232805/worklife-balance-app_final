import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/lib/models/Task';
import { auth } from '@/auth';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();
        const body = await request.json();

        // Ensure task belongs to user
        const task = await Task.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
        }

        // Award XP if completing
        if (body.completed === true) {
            const { updateUserProgress, XP_VALUES } = await import('@/lib/gamification');
            await updateUserProgress(session.user.id, XP_VALUES.TASK_COMPLETION);
        }

        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        // Ensure task belongs to user
        const task = await Task.findOneAndDelete({ _id: id, userId: session.user.id });

        if (!task) {
            return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
