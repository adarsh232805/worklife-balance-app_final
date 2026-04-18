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
            console.log('Middleware checking path:', nextUrl.pathname, 'User logged in:', isLoggedIn);

            // Explicitly allow landing page
            if (nextUrl.pathname === '/') return true;

            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Redirect authenticated users to dashboard if they visit login page
                if (nextUrl.pathname.startsWith('/login')) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
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
