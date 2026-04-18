
export function getNextOccurrence(timestamp: number, frequency: "daily" | "weekly" | "monthly" | "yearly"): number {
    const date = new Date(timestamp);

    switch (frequency) {
        case "daily":
            date.setDate(date.getDate() + 1);
            break;
        case "weekly":
            date.setDate(date.getDate() + 7);
            break;
        case "monthly":
            date.setMonth(date.getMonth() + 1);
            break;
        case "yearly":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date.getTime();
}
