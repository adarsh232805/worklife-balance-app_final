import mongoose, { Schema, Document, Model } from 'mongoose';

export interface User extends Document {
    id: string;
    name: string;
    email: string;
    password?: string;
    image?: string;

    // Core Stats
    xp: number;
    level: number;
    streak: number;
    lastActivityDate: Date;

    // Personal Info
    mobile?: string;
    bio?: string;
    dob?: Date;
    gender?: string;
    weight?: number; // kg
    height?: number; // cm

    // Verification
    isEmailVerified?: boolean;
    isMobileVerified?: boolean;

    // App Preferences
    profile: {
        workHours: {
            start: string;
            end: string;
        };
        sleepGoal: number;
        wellnessGoal: number;
        waterGoal: number; // ml
        stepGoal: number;
        caloricGoal: number;
        focusPreference: 'pomodoro' | '90min' | 'flow';
        yogaGoal?: number;
        meditationGoal?: number;
        workoutGoal?: number;
    };
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: { type: String },

        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        streak: { type: Number, default: 0 },
        lastActivityDate: { type: Date, default: Date.now },

        // Personal Info
        mobile: { type: String },
        bio: { type: String },
        dob: { type: Date },
        gender: { type: String },
        weight: { type: Number },
        height: { type: Number },

        // Verification Flags
        isEmailVerified: { type: Boolean, default: false },
        isMobileVerified: { type: Boolean, default: false },

        // App Config
        profile: {
            workHours: {
                start: { type: String, default: "09:00" },
                end: { type: String, default: "17:00" }
            },
            sleepGoal: { type: Number, default: 8 },
            wellnessGoal: { type: Number, default: 30 }, // in minutes
            waterGoal: { type: Number, default: 2500 }, // ml
            stepGoal: { type: Number, default: 10000 },
            caloricGoal: { type: Number, default: 2200 },
            focusPreference: {
                type: String,
                enum: ['pomodoro', '90min', 'flow'],
                default: 'pomodoro'
            },
            yogaGoal: { type: Number, default: 30 },
            meditationGoal: { type: Number, default: 15 },
            workoutGoal: { type: Number, default: 60 }
        }
    },
    {
        timestamps: true,
    }
);

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;
