import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { weight, height, waterGoal, stepGoal, caloricGoal, yogaGoal, meditationGoal, workoutGoal } = body;

        await dbConnect();

        const updateData: any = {};
        if (weight) updateData['weight'] = weight;
        if (height) updateData['height'] = height;
        if (waterGoal) updateData['profile.waterGoal'] = waterGoal;
        if (stepGoal) updateData['profile.stepGoal'] = stepGoal;
        if (caloricGoal) updateData['profile.caloricGoal'] = caloricGoal;
        if (yogaGoal) updateData['profile.yogaGoal'] = yogaGoal;
        if (meditationGoal) updateData['profile.meditationGoal'] = meditationGoal;
        if (workoutGoal) updateData['profile.workoutGoal'] = workoutGoal;

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updateData },
            { new: true }
        );

        return NextResponse.json(user);
    } catch (error) {
        console.error("Update User Stats Error:", error);
        return NextResponse.json({ error: 'Failed to update user stats' }, { status: 500 });
    }
}
