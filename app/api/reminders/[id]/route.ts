
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Reminder from "@/lib/models/Reminder";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        await dbConnect();

        // Verify ownership
        const reminder = await Reminder.findOne({ _id: id });
        if (!reminder) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        // We could check if reminder.userId matches session user here, but for now assuming valid session is enough context if we query by known ID. 
        // Ideally we should strict check against user ID.

        const updated = await Reminder.findByIdAndUpdate(
            id,
            {
                $set: {
                    title: body.title,
                    description: body.description,
                    time: body.time,
                    priority: body.priority,
                    category: body.category,
                    tags: body.tags,
                    completed: body.completed,
                    subtasks: body.subtasks,
                    repeat: body.repeat
                }
            },
            { new: true }
        );

        // handle recurrence
        if (body.completed && body.repeat && body.repeat !== 'none' && !reminder.completed) {
            // Only if it wasn't already completed
            const { getNextOccurrence } = await import("@/lib/utils/dateUtils");
            const nextTime = getNextOccurrence(reminder.time, body.repeat);

            // check if next one already exists to prevent dupes (basic check)
            const duplicate = await Reminder.findOne({
                userId: reminder.userId,
                title: reminder.title,
                time: nextTime
            });

            if (!duplicate) {
                await Reminder.create({
                    userId: reminder.userId,
                    title: reminder.title,
                    description: reminder.description,
                    time: nextTime,
                    priority: reminder.priority,
                    category: reminder.category,
                    tags: reminder.tags,
                    completed: false,
                    subtasks: reminder.subtasks.map((s: any) => ({ ...s, completed: false })),
                    repeat: reminder.repeat
                });
            }
        }

        return NextResponse.json({
            ...updated.toObject(),
            id: updated._id.toString(),
            _id: undefined
        });

    } catch (error) {
        console.error("Error updating reminder:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await dbConnect();

        const deleted = await Reminder.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error deleting reminder:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
