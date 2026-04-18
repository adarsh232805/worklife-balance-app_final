import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/lib/models/User';
import dbConnect from '@/lib/db';
import UserModel from '@/lib/models/User';
import bcrypt from 'bcryptjs';

if (!process.env.AUTH_SECRET) {
    console.warn("\x1b[31m[Auth Error] AUTH_SECRET is missing! Please add it to your Vercel environment variables.\x1b[0m");
}

async function getUser(email: string): Promise<User | undefined> {
    try {
        await dbConnect();
        const user = await UserModel.findOne({ email }).lean();
        if (user) {
            return {
                ...user,
                id: (user._id as any).toString(),
            } as unknown as User;
        }
        return undefined;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log("[Auth] Raw credentials:", credentials);
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log("[Auth] Looking up email:", email);
                    const user = await getUser(email);
                    if (!user) {
                        console.log("[Auth] User not found in DB.");
                        return null;
                    }

                    console.log("[Auth] User found! Comparing hashes...");
                    const passwordsMatch = await bcrypt.compare(password, user.password as string);
                    if (passwordsMatch) {
                        console.log("[Auth] Passwords match! Returning user.");
                        return { id: user.id, name: user.name, email: user.email };
                    } else {
                        console.log("[Auth] Passwords did not match.");
                    }
                } else {
                    console.log("[Auth] Zod parse failed:", parsedCredentials.error);
                }

                console.log('[Auth] Invalid credentials catch-all reached.');
                return null;
            },
        }),
    ],
});
