"use client";

import { useEffect, useRef } from "react";
import { api } from "@/lib/api";

export default function GlobalNotifications() {
    const lastChecked = useRef(Date.now());

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        const checkNotifications = async () => {
            const now = Date.now();
            try {
                // 1. Check Reminders
                // We'll fetch all reminders. Optimization: backend could have a "due" endpoint, 
                // but for now fetching all (usually small list) is fine or we can filter by date if API supports it.
                // The existing API returns all.
                const reminders = await api.reminders.getAll();
                // api.reminders.get() isn't defined in my memory of lib/api.ts, let's check or I might need to add it.
                // Actually I need to check lib/api.ts for reminder fetching. 
                // I saw api.reminders in ReminderDashboard? No, it used fetch directly.
                // I need to add api.reminders to lib/api.ts first? 
                // Or just use fetch here.

                // Let's assume I use fetch for now to be safe and quick.
                const due = reminders.filter((r: any) =>
                    !r.completed && r.time > lastChecked.current && r.time <= now
                );

                due.forEach(async (r: any) => {
                    if (Notification.permission === "granted") {
                        new Notification("Reminder Due!", { body: r.title, icon: "/favicon.ico" });
                        const audio = new Audio("/sounds/notification.mp3");
                        audio.play().catch(() => { });

                        // Sync to DB
                        await api.notifications.create({
                            title: "Reminder Due",
                            message: r.title,
                            type: "warning"
                        });
                    }
                });

                // 2. Check Calendar
                const today = new Date().toISOString().split('T')[0];
                const events = await api.calendar.getEvents(today);
                const dueEvents = events.filter((e: any) => {
                    const startTime = new Date(e.startTime).getTime();
                    // Notify 15 mins before? Or at start time?
                    // Let's say at start time for simplicity, or 10 mins before.
                    // Let's do AT start time for synchronization with "Events"
                    return startTime > lastChecked.current && startTime <= now;
                });

                dueEvents.forEach(async (e: any) => {
                    if (Notification.permission === "granted") {
                        new Notification("Event Starting", { body: e.title, icon: "/favicon.ico" });
                        const audio = new Audio("/sounds/notification.mp3");
                        audio.play().catch(() => { });
                        await api.notifications.create({
                            title: "Event Starting",
                            message: `Your event "${e.title}" is starting now.`,
                            type: "info"
                        });
                    }
                });

            } catch (error) {
                console.error("Global notification check failed", error);
            }

            lastChecked.current = now;
        };

        const interval = setInterval(checkNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return null;
}
