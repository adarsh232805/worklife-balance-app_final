import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder';
    read: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ['info', 'success', 'warning', 'error', 'achievement', 'reminder'],
            default: 'info'
        },
        read: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const NotificationModel: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
