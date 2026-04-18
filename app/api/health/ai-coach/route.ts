import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { stats, userGoals } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            console.warn("Missing GEMINI_API_KEY");
            return NextResponse.json({
                content: "Great job tracking today! Remember to stay hydrated and keep moving towards your goals. (API Key missing)"
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are an encouraging and knowledgeable Wellness Coach. 
        Analyze the user's daily stats against their goals and provide a short, motivating specific insight (max 2 sentences). 
        Be friendly and modern. Do not use markdown bolding too much.

        User Stats Today:
        - Calories: ${stats.calories} / ${userGoals?.caloricGoal || 2200}
        - Water: ${stats.water}ml / ${userGoals?.waterGoal || 2500}ml
        - Steps/Exercise: ${stats.exercise}min (Goal: ${userGoals?.wellnessGoal || 60} min approx)
        
        Give me a specific tip or encouragement.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });

    } catch (error) {
        console.error("AI Coach Error:", error);
        return NextResponse.json({
            content: "You're doing great! Consistency is key. Keep logging your progress."
        });
    }
}
