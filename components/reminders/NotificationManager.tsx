"use client";

import { useEffect, useRef } from "react";
import { Reminder } from "./types";
import { api } from "@/lib/api";

interface NotificationManagerProps {
    reminders: Reminder[];
}

export default function NotificationManager({ reminders }: NotificationManagerProps) {
    const lastChecked = useRef(Date.now());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Request permission on mount
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        // Poll every minute
        intervalRef.current = setInterval(() => {
            const now = Date.now();

            const dueReminders = reminders.filter(r =>
                !r.completed &&
                r.time > lastChecked.current &&
                r.time <= now
            );

            dueReminders.forEach(async (r) => {
                if (Notification.permission === "granted") {
                    new Notification("Reminder Due!", {
                        body: r.title,
                        icon: "/favicon.ico",
                    });

                    // Sync with In-App Notifications
                    try {
                        await api.notifications.create({
                            title: "Reminder Due",
                            message: r.title,
                            type: "warning"
                        });
                    } catch (e) {
                        console.error("Failed to sync notification", e);
                    }

                    // Play sound
                    const audio = new Audio("/sounds/notification.mp3");
                    audio.play().catch(e => console.log("Audio play failed", e));
                }
            });

            lastChecked.current = now;
        }, 10000); // Check every 10 seconds for better responsiveness

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [reminders]);

    return null; // This component renders nothing
}
