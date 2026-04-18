export type Priority = "high" | "medium" | "low";

export type Category =
    | "work"
    | "study"
    | "family"
    | "meeting"
    | "personal"
    | "health"
    | "finance"
    | "travel";

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Reminder {
    id: string;
    title: string;
    description?: string;
    time: number; // TImestamp
    priority: Priority;
    category: Category;
    tags: string[];
    completed: boolean;
    subtasks: Subtask[];
    repeat?: "daily" | "weekly" | "monthly" | "yearly" | "none";
    createdAt: number;
}
