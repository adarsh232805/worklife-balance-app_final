import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICalendarEvent extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    color?: string;
    type: 'work' | 'meeting' | 'break' | 'personal' | 'health' | 'travel' | 'finance' | 'social';
    createdAt: Date;
}

const CalendarEventSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        color: { type: String, default: '#4F46E5' }, // Default Indigo
        type: {
            type: String,
            enum: ['work', 'meeting', 'break', 'personal', 'health', 'travel', 'finance', 'social'],
            default: 'work'
        }
    },
    {
        timestamps: true,
    }
);

// Prevent over-fetching: Index by userId and startTime for quick calendar lookups
CalendarEventSchema.index({ userId: 1, startTime: 1 });

const CalendarEventModel: Model<ICalendarEvent> =
    mongoose.models.CalendarEvent || mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);

export default CalendarEventModel;
