'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import dbConnect from '@/lib/db';
import UserModel from '@/lib/models/User';
import bcrypt from 'bcryptjs';

// Helper to check if an error is a Next.js redirect
function isRedirectError(error: any): boolean {
    return error?.digest?.startsWith('NEXT_REDIRECT') || error?.message === 'NEXT_REDIRECT';
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        console.log('[Auth Action] Attempting authentication...');
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/dashboard',
        });
        console.log('[Auth Action] Sign-in call completed (redirect expected).');
    } catch (error) {
        // IMPORTANT: Must re-throw redirect errors so Next.js can handle them
        if (isRedirectError(error)) {
            console.log('[Auth Action] Success: Redirecting user...');
            throw error;
        }

        if (error instanceof AuthError) {
            console.warn('[Auth Action] AuthError:', error.type);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }

        console.error('[Auth Action] Unexpected Error:', error);
        return 'The server encountered an unexpected error. Please try again.';
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
        console.log('[Register Action] Connecting to DB...');
        await dbConnect();

        console.log('[Register Action] Checking for existing user:', email);
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            console.warn('[Register Action] User already exists:', email);
            return 'User already exists.';
        }

        console.log('[Register Action] Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('[Register Action] Creating user...');
        await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        console.log('[Register Action] User created! Signing in...');
        
        // Auto-login after successful registration
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/dashboard',
        });

        return 'success';
    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.error('[Register Action] Unexpected Error:', error);
        return 'Failed to create user. Please try again later.';
    }
}

export async function logOut() {
    try {
        await signOut();
    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.error('[Auth Action] Sign out error:', error);
    }
}
