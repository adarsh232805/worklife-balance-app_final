import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import UserModel from '@/lib/models/User';

// In a real app, use Redis/Database for OTP storage.
// For simulation, we'll return the success but only verify if code is "1234"
// OR, we can just say "If code length is 4, it's valid" for easier demo.
// Let's make it semi-real: use a static code "1234" for simplicity in demo.

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, type, code } = await req.json();
        // action: 'send' | 'verify'
        // type: 'email' | 'mobile'

        if (action === 'send') {
            // SIMULATION: Log OTP to console
            const mockOtp = "1234";
            console.log("\n==============================");
            console.log(`🔐 SIMULATION OTP for ${type}: ${mockOtp}`);
            console.log("==============================\n");

            return NextResponse.json({ message: "OTP sent successfully", success: true });
        }

        if (action === 'verify') {
            if (code !== "1234") {
                return NextResponse.json({ error: "Invalid OTP Code" }, { status: 400 });
            }

            // Code is valid -> Update Database
            await dbConnect();
            const fieldToUpdate = type === 'email' ? 'isEmailVerified' : 'isMobileVerified';

            await UserModel.findByIdAndUpdate(session.user.id, {
                $set: { [fieldToUpdate]: true }
            });

            return NextResponse.json({ message: "Verified successfully!", success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error('OTP error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
