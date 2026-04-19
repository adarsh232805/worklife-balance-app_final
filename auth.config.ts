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
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnLogin = nextUrl.pathname === '/login';
            const isOnRoot = nextUrl.pathname === '/';
            
            console.log(`[Middleware] Path: ${nextUrl.pathname} | LoggedIn: ${isLoggedIn}`);

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                console.log('[Middleware] Redirecting unauthenticated user to /login');
                return false; // Redirect unauthenticated users to login page
            }

            if (isLoggedIn && (isOnLogin || isOnRoot)) {
                console.log('[Middleware] Redirecting authenticated user to /dashboard');
                return Response.redirect(new URL('/dashboard', nextUrl));
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
