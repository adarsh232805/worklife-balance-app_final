'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import dbConnect from '@/lib/db';
import UserModel from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function register(
    prevState: string | undefined,
    formData: FormData,
) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return 'Please fill in all fields.';
    }

    try {
        await dbConnect();

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return 'User already exists.';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // After registration, try to sign in immediately or redirect to login
        // For simplicity, we'll return success and let the UI redirect or ask to login
        return 'success';
    } catch (error) {
        console.error('Registration error:', error);
        return 'Failed to create user.';
    }
}

export async function logOut() {
    await signOut();
}
