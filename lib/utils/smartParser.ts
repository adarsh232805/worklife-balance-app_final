
import { Priority, Category } from "@/components/reminders/types";

export interface ParsedReminder {
    title: string;
    time?: number;
    priority?: Priority;
    category?: Category;
    tags?: string[];
}

export function parseSmartInput(input: string): ParsedReminder {
    let title = input;
    let time = Date.now();
    let priority: Priority | undefined;
    let category: Category | undefined;
    const tags: string[] = [];

    const lower = input.toLowerCase();
    const now = new Date();

    // 1. Extract Priority (!high, !medium, !low)
    if (lower.includes("!high")) {
        priority = "high";
        title = title.replace(/!high/i, "");
    } else if (lower.includes("!medium")) {
        priority = "medium";
        title = title.replace(/!medium/i, "");
    } else if (lower.includes("!low")) {
        priority = "low";
        title = title.replace(/!low/i, "");
    }

    // 2. Extract Tags (#tag)
    const tagMatch = title.match(/#(\w+)/g);
    if (tagMatch) {
        tagMatch.forEach(t => {
            tags.push(t.substring(1));
            title = title.replace(t, "");
        });
    }

    // 3. Extract Time (at 5pm, at 10:30, 14:00)
    // Simple regex for "at HH:MM" or "at HHam/pm"
    const timeMatch = title.match(/(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
        const [full, h, m, mer] = timeMatch;
        let hour = parseInt(h);
        let minute = m ? parseInt(m) : 0;

        if (mer) {
            if (mer.toLowerCase() === 'pm' && hour < 12) hour += 12;
            if (mer.toLowerCase() === 'am' && hour === 12) hour = 0;
        }

        const targetTime = new Date(time);
        targetTime.setHours(hour, minute, 0, 0);

        // If time has passed today, assume tomorrow
        if (targetTime.getTime() < now.getTime()) {
            targetTime.setDate(targetTime.getDate() + 1);
        }

        time = targetTime.getTime();

        // Remove strictly the match if it starts with "at", otherwise complex
        // For simplicity, we won't strip complex time strings perfectly to avoid destroying title
        if (full.startsWith("at ")) {
            title = title.replace(full, "");
        }
    }

    // 4. Extract Date Keywords (tomorrow, next week)
    if (lower.includes("tomorrow")) {
        const d = new Date(time);
        d.setDate(d.getDate() + 1);
        time = d.getTime();
        title = title.replace(/tomorrow/i, "");
    } else if (lower.includes("next week")) {
        const d = new Date(time);
        d.setDate(d.getDate() + 7);
        time = d.getTime();
        title = title.replace(/next week/i, "");
    }

    // 5. Cleanup Title
    title = title.replace(/\s+/g, " ").trim();

    return {
        title,
        time: time !== Date.now() ? time : undefined, // Only return time if modified
        priority,
        category,
        tags
    };
}
