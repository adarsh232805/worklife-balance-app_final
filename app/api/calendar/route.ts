import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import CalendarEventModel from '@/lib/models/CalendarEvent';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date"); // YYYY-MM-DD

        await dbConnect();

        let query: any = { userId: session.user.id };

        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        if (dateStr) {
            // Filter by specific day (00:00 to 23:59)
            const start = new Date(dateStr);
            start.setHours(0, 0, 0, 0);

            const end = new Date(dateStr);
            end.setHours(23, 59, 59, 999);

            query.startTime = { $gte: start, $lte: end };
        } else if (startDateParam && endDateParam) {
            const start = new Date(startDateParam);
            const end = new Date(endDateParam);
            end.setHours(23, 59, 59, 999);
            query.startTime = { $gte: start, $lte: end };
        }

        const events = await CalendarEventModel.find(query).sort({ startTime: 1 });
        return NextResponse.json(events);

    } catch (error) {
        console.error('Calendar Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, startTime, endTime, type } = body;

        if (!title || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const newEvent = await CalendarEventModel.create({
            userId: session.user.id,
            title,
            description,
            startTime,
            endTime,
            type: type || 'work',
            color: body.color
        });

        return NextResponse.json(newEvent, { status: 201 });

    } catch (error) {
        console.error('Calendar Create Error:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
