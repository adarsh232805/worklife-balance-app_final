'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import GlobalNotifications from './GlobalNotifications';

function NotificationWrapper() {
    const { status } = useSession();
    if (status !== 'authenticated') return null;
    return <GlobalNotifications />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NotificationWrapper />
            {children}
        </SessionProvider>
    );
}
