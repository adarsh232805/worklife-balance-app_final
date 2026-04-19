
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Reminder from "@/lib/models/Reminder";
import User from "@/lib/models/User";

// GET: Fetch all reminders for auth user
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        const query: any = { userId: session.user.id };

        if (startDateParam && endDateParam) {
            const start = new Date(startDateParam).getTime();
            const end = new Date(endDateParam);
            end.setHours(23, 59, 59, 999);
            const endTime = end.getTime();

            // Filter by time range
            query.time = { $gte: start, $lte: endTime };
        }

        const reminders = await Reminder.find(query).sort({ time: 1 });

        // Transform _id to string id for frontend compatibility
        const formatted = reminders.map(r => ({
            ...r.toObject(),
            id: r._id.toString(),
            _id: r._id.toString() // Ensure both formats are available
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Create new reminder
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, time, priority, category, tags, description } = body;

        if (!title || !time) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const newReminder = await Reminder.create({
            userId: session.user.id,
            title,
            description,
            time,
            priority,
            category,
            tags: tags || [],
            completed: false,
            createdAt: Date.now()
        });

        return NextResponse.json({
            ...newReminder.toObject(),
            id: newReminder._id.toString(),
            _id: undefined
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating reminder:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
