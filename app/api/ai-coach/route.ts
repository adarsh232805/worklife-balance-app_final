import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from '@/auth';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, context } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API Key is missing' }, { status: 500 });
        }

        // Construct the System Prompt with Real-time Context
        const systemPrompt = `
      You are "Genius", an elite high-performance productivity coach and wellness expert.
      Your goal is to help the user achieve flow state, balance, and high output.
      
      USER CONTEXT (Real-time Data):
      - Name: ${session.user.name}
      - Focus Time Today: ${context?.today?.focusMinutes || 0} minutes
      - Tasks Completed: ${context?.today?.tasksCompleted || 0}
      - Tasks Pending: ${context?.today?.tasksPending || 0}
      - Sleep (Avg): ${Number(context?.wellness?.avgSleep) > 0 ? context.wellness.avgSleep + " hours" : "Data Not Logged"}
      - Current Streak: ${context?.user?.streak || 0} days
      
      INSTRUCTIONS:
      1. **Structure**: Start with a "Insight" (detailed explanation), followed by "Key Points" (bullet list), and end with a "🇮🇳 Hindi Summary" (concise translation).
      2. **Tone**: Be a high-performance coach—direct, motivating, and informative.
      3. **Context**: Use the real-time data to personalize every advice.
      4. **Formatting**: Use Markdown headers (###), bolding (**), and lists (-) for clear readability.
      5. **Safety**: If sleep is low (<6h) AND logged, prioritize rest. If not logged, assume normal.
      
      Example Format:
      ### 🧠 Insight
      [Detailed explanation...]
      
      ### 🚀 Key Points
      - [Actionable step 1]
      - [Actionable step 2]
      
      ### 🇮🇳 Hindi Summary (सार)
      [Short summary in Hindi...]
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Combine system prompt and user message
        const fullPrompt = `${systemPrompt}\n\nUSER MESSAGE: ${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("AI Coach Error Detailed:", error);
        return NextResponse.json({
            error: 'Failed to generate response',
            details: error.message || "Unknown error"
        }, { status: 500 });
    }
}
