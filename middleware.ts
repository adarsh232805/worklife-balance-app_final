import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    
    // Allow API routes to pass through without middleware interference
    if (nextUrl.pathname.startsWith('/api')) {
        return;
    }

    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    const isOnLogin = nextUrl.pathname.startsWith('/login');

    if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
    }

    if (isLoggedIn && (isOnLogin || nextUrl.pathname === '/')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
    }
});

export const config = {
    matcher: ['/dashboard/:path*', '/settings/:path*', '/login', '/'],
};
