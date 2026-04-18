import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import NotificationModel from '@/lib/models/Notification';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const notifications = await NotificationModel.find({ userId: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json({
            count: notifications.length,
            recent: notifications
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
