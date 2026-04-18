"use client";

import { useEffect, useRef } from "react";

interface CalendarNotificationManagerProps {
    events: any[];
}

export default function CalendarNotificationManager({ events }: CalendarNotificationManagerProps) {
    const notifiedEvents = useRef<Set<string>>(new Set());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Request permission
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const checkNotifications = () => {
            const now = new Date();
            const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);

            events.forEach((event) => {
                const eventStart = new Date(event.start);
                const eventId = event.id || event._id;

                // Skip if already notified or if event is in the past
                if (notifiedEvents.current.has(eventId) || eventStart < now) return;

                // Check if event is within the next 15 minutes
                if (eventStart <= fifteenMinutesFromNow) {
                    // Trigger Notification
                    if (Notification.permission === "granted") {
                        new Notification(`Upcoming Event: ${event.title}`, {
                            body: `Starting at ${eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                            icon: "/icons/calendar-icon.png", // Fallback or generic icon
                        });

                        // Play a sound
                        const audio = new Audio("/sounds/notification.mp3");
                        audio.play().catch((e) => console.log("Audio play failed", e));
                    }

                    // Mark as notified
                    notifiedEvents.current.add(eventId);
                }
            });
        };

        // Check immediately and then every minute
        checkNotifications();
        intervalRef.current = setInterval(checkNotifications, 60000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [events]);

    return null;
}
