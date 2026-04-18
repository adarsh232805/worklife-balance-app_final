import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGameSession extends Document {
    userId: mongoose.Types.ObjectId;
    gameId: string;
    score: number;
    duration?: number; // in seconds
    playedAt: Date;
}

const GameSessionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gameId: { type: String, required: true },
    score: { type: Number, required: true },
    duration: { type: Number, default: 0 },
    playedAt: { type: Date, default: Date.now }
});

const GameSession: Model<IGameSession> = mongoose.models.GameSession || mongoose.model<IGameSession>('GameSession', GameSessionSchema);

export default GameSession;
