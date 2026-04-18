import mongoose from 'mongoose';

const HealthLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['food', 'water', 'exercise', 'sleep', 'walk', 'run', 'yoga', 'meditation', 'workout'],
        required: true,
    },
    value: {
        type: Number, // calories, ml, minutes, hours
        required: true,
    },
    title: {
        type: String, // e.g., "Chicken Salad", "Morning Run"
        default: '',
    },
    metadata: {
        type: Object, // Flexible field for macros {protein: 20}, distance {km: 5}, etc.
        default: {},
    },
    sentiment: {
        type: String, // 'positive', 'neutral', 'negative' (AI derived)
        default: 'neutral',
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Force recompilation in dev to catch enum changes
if (process.env.NODE_ENV === 'development' && mongoose.models.HealthLog) {
    delete mongoose.models.HealthLog;
}

const HealthLog = mongoose.models.HealthLog || mongoose.model('HealthLog', HealthLogSchema);

console.log("HealthLog Model Loaded. Enum:", HealthLog.schema.path('type').enumValues);

export default HealthLog;
