import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    trustHost: true,
    pages: {
        signIn: '/login',
    },
    providers: [
        // Added later in auth.ts
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            
            // Helpful server-side logging for Vercel diagnostic
            if (!isLoggedIn && nextUrl.pathname.startsWith('/dashboard')) {
                console.log(`[Auth] Unauthorized access attempt to ${nextUrl.pathname}`);
            }

            // Explicitly allow landing page
            if (nextUrl.pathname === '/' || nextUrl.pathname === '/login') return true;

            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        session({ session, token }: any) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
