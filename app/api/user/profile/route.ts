import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import UserModel from '@/lib/models/User';

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        // Destructure all possible fields
        const {
            name,
            mobile,
            bio,
            dob,
            gender,
            weight,
            height,
            workHours,
            sleepGoal,
            wellnessGoal,
            focusPreference
        } = data;

        await dbConnect();

        // Prepare update object
        const updateFields: any = {
            "profile.workHours": workHours,
            "profile.sleepGoal": sleepGoal,
            "profile.wellnessGoal": wellnessGoal,
            "profile.focusPreference": focusPreference
        };

        // Only update if provided (allow partial updates)
        if (name) updateFields.name = name;
        if (mobile !== undefined) updateFields.mobile = mobile;
        if (bio !== undefined) updateFields.bio = bio;
        if (dob !== undefined) updateFields.dob = dob ? new Date(dob) : null;
        if (gender !== undefined) updateFields.gender = gender;
        if (weight !== undefined) updateFields.weight = weight;
        if (height !== undefined) updateFields.height = height;

        const updatedUser = await UserModel.findByIdAndUpdate(
            session.user.id,
            { $set: updateFields },
            { new: true }
        ).select('-password'); // Return everything except password

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await UserModel.findById(session.user.id).select('-password');

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
