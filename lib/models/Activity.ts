import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
    type: 'Focus' | 'Break' | 'Meeting' | 'Other';
    duration: number; // in minutes
    startTime: Date;
    userId: string;
}

const ActivitySchema: Schema = new Schema(
    {
        type: {
            type: String,
            enum: ['Focus', 'Break', 'Meeting', 'Other'],
            required: true,
        },
        duration: { type: Number, required: true },
        startTime: { type: Date, required: true },
        userId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
