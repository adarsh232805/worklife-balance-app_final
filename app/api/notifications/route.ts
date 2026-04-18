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
        const notifications = await NotificationModel.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { title, message, type } = await req.json();

        const notification = await NotificationModel.create({
            userId: session.user.id,
            title,
            message,
            type,
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }
}
