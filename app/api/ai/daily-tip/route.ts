const { GoogleGenerativeAI } = require("@google/generative-ai");
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import HealthLog from '@/lib/models/HealthLog';
import Activity from '@/lib/models/Activity';

// Use the key found in test-gemini.js or environment variable
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDY6h15hSp8N6zINY6lDKhzahmwHF2i8k8";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Get yesterday's data for context
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch logs
        const healthLogPromise = HealthLog.findOne({
            userId: session.user.id,
            date: { $gte: yesterday, $lt: today }
        });

        const focusSessionsPromise = Activity.find({
            userId: session.user.id,
            type: 'Focus',
            startTime: { $gte: yesterday, $lt: today }
        });

        const [healthLog, focusSessions] = await Promise.all([healthLogPromise, focusSessionsPromise]);

        // Calculate stats
        const sleepHours = healthLog?.sleepHours || 0;
        const waterIntake = healthLog?.waterIntake || 0;
        const mood = healthLog?.mood || 'neutral';
        const focusMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);

        // Prepare context for AI
        const context = `
            Yesterday's Stats:
            - Sleep: ${sleepHours} hours (Target: 7-8h)
            - Water: ${waterIntake}ml (Target: 2500ml)
            - Focus Work: ${focusMinutes} minutes (Target: 120m)
            - Mood: ${mood}
        `;

        let tip = "";
        let type = "general";

        try {
            // Try Gemini API
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

            const prompt = `
                Act as a compassionate, motivational productivity coach. 
                Based on the user's stats from yesterday, give ONE short, actionable tip (max 20 words) for today.
                If sleep was low, prioritize rest. If focus was low, suggest a small start.
                
                ${context}

                Format: Just the tip text. No quotes.
            `;

            const result = await model.generateContent(prompt);
            tip = result.response.text().trim();
            type = "ai-coach";
        } catch (aiError) {
            console.error("Gemini API Error:", aiError);
            // Fallback Heuristics
            if (sleepHours > 0 && sleepHours < 6) {
                tip = "Rest is productive. Try a 20-min power nap today to recharge.";
                type = "sleep";
            } else if (focusMinutes < 30) {
                tip = "Start small today. Do just one 25-minute focus session.";
                type = "focus";
            } else if (waterIntake < 1500) {
                tip = "Your brain needs water! Keep a bottle at your desk.";
                type = "hydration";
            } else {
                tip = "Consistency is key. You're doing great, keep moving forward!";
                type = "general";
            }
        }

        return NextResponse.json({ tip, type, stats: { sleepHours, focusMinutes } });
    } catch (error) {
        console.error('Error generating tip:', error);
        return NextResponse.json({
            tip: "Stay consistent! Small daily habits lead to big changes.",
            type: "general"
        });
    }
}
