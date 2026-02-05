import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
    title: string;
    completed: boolean;
    priority: 'High' | 'Medium' | 'Low';
    time: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium',
        },
        time: { type: Date, required: true },
        userId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

// Check if model serves already to prevent OverwriteModelError
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
