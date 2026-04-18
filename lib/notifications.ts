import dbConnect from "@/lib/db";
import NotificationModel from "@/lib/models/Notification";

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder' = 'info'
) {
    try {
        await dbConnect();
        const notification = await NotificationModel.create({
            userId,
            title,
            message,
            type
        });
        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
        return null;
    }
}
