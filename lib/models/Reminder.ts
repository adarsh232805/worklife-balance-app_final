
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReminder extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    time: number; // Timestamp
    priority: "high" | "medium" | "low";
    category: string;
    tags: string[];
    completed: boolean;
    subtasks: { id: string; title: string; completed: boolean }[];
    repeat?: "daily" | "weekly" | "monthly" | "yearly" | "none";
    createdAt: number;
}

const ReminderSchema = new Schema<IReminder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        description: { type: String },
        time: { type: Number, required: true },
        priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
        category: { type: String, default: "personal" },
        tags: [{ type: String }],
        completed: { type: Boolean, default: false },
        subtasks: [
            {
                id: { type: String, required: true },
                title: { type: String, required: true },
                completed: { type: Boolean, default: false },
            },
        ],
        repeat: { type: String, enum: ["daily", "weekly", "monthly", "yearly", "none"], default: "none" },
        createdAt: { type: Number, default: () => Date.now() },
    },
    { timestamps: true }
);

// Prevent overwrite
const Reminder: Model<IReminder> = mongoose.models.Reminder || mongoose.model<IReminder>("Reminder", ReminderSchema);

export default Reminder;
