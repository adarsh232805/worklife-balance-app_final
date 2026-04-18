import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import NotificationModel from '@/lib/models/Notification';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = params;
        console.log(`[Notification PUT] Marking ${id} as read for user ${session.user.id}`);

        const notification = await NotificationModel.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }

        return NextResponse.json(notification);
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}
