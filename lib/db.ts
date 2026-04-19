import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        console.log('[DB] Using cached connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log('[DB] Creating new connection promise...');
        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log('[DB] Connection established');
            return mongoose.connection;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        console.error('[DB] Connection error:', e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
