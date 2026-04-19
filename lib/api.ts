import type { ITask } from './models/Task';

export const api = {
    tasks: {
        getAll: async (date?: string, startDate?: string, endDate?: string) => {
            let query = '';
            if (date) query = `?date=${date}`;
            else if (startDate && endDate) query = `?startDate=${startDate}&endDate=${endDate}`;

            const res = await fetch(`/api/tasks${query}`);
            if (!res.ok) throw new Error('Failed to fetch tasks');
            return res.json();
        },
        create: async (data: Partial<ITask>) => {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create task');
            return res.json();
        },
        update: async (id: string, data: Partial<ITask>) => {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update task');
            return res.json();
        },
        delete: async (id: string) => {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete task');
            return res.json();
        },
    },
    analytics: {
        get: async () => {
            const res = await fetch('/api/analytics');
            if (!res.ok) throw new Error('Failed to fetch analytics');
            return res.json();
        },
        getWeekly: async (date?: string) => {
            const query = date ? `?date=${date}` : '';
            const res = await fetch(`/api/analytics/weekly${query}`);
            if (!res.ok) throw new Error('Failed to fetch weekly analytics');
            return res.json();
        },
    },
    activity: {
        create: async (data: { type: string, duration: number, startTime: string }) => {
            const res = await fetch('/api/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to save activity');
            return res.json();
        },
        getHistory: async (date?: string, startDate?: string, endDate?: string) => {
            let query = '';
            if (date) query = `?date=${date}`;
            else if (startDate && endDate) query = `?startDate=${startDate}&endDate=${endDate}`;

            const res = await fetch(`/api/activity${query}`);
            if (!res.ok) throw new Error('Failed to fetch activity history');
            return res.json();
        }
    },
    user: {
        getProgress: async () => {
            try {
                const res = await fetch('/api/user/progress');
                if (res.status === 401 || res.status === 404) return null; // Handle expected auth states gracefully

                if (!res.ok) {
                    const errorText = await res.text();
                    console.warn(`Progress fetch warning: ${res.status} - ${errorText}`);
                    return null;
                }
                return res.json();
            } catch (e) {
                // Silently return null for network errors during background updates
                return null;
            }
        }
    },
    calendar: {
        getEvents: async (date?: string, startDate?: string, endDate?: string) => {
            let query = '';
            if (date) query = `?date=${date}`;
            else if (startDate && endDate) query = `?startDate=${startDate}&endDate=${endDate}`;

            const res = await fetch(`/api/calendar${query}`);
            if (res.status === 401) return [];
            if (!res.ok) throw new Error('Failed to fetch events');
            return res.json();
        },
        createEvent: async (data: any) => {
            const res = await fetch('/api/calendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create event');
            return res.json();
        }
    },
    health: {
        getDaily: async (date?: string, startDate?: string, endDate?: string) => {
            let query = '';
            if (date) query = `?date=${date}`;
            else if (startDate && endDate) query = `?startDate=${startDate}&endDate=${endDate}`;

            const res = await fetch(`/api/health${query}`);
            if (!res.ok) {
                const text = await res.text();
                // console.error("Health API Error:", res.status, text); // Suppress error log for clean console if 404
                throw new Error(`Failed to fetch health data: ${res.status} ${text}`);
            }
            return res.json();
        },
        getWeekly: async () => {
            const res = await fetch('/api/health?period=weekly');
            if (!res.ok) throw new Error('Failed to fetch weekly health data');
            return res.json();
        },
        log: async (data: any) => {
            const res = await fetch('/api/health/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const text = await res.text();
                console.error("Health Log API Error:", res.status, text);
                throw new Error(`Failed to log health data: ${res.status} ${text}`);
            }
            return res.json();
        },
        updateUserStats: async (data: any) => {
            const res = await fetch('/api/health/user-stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update stats');
            return res.json();
        }
    },
    reminders: {
        getAll: async (startDate?: string, endDate?: string) => {
            let query = '';
            if (startDate && endDate) query = `?startDate=${startDate}&endDate=${endDate}`;
            const res = await fetch(`/api/reminders${query}`);
            if (res.status === 401) return [];
            if (!res.ok) throw new Error('Failed to fetch reminders');
            return res.json();
        },
        create: async (data: any) => {
            const res = await fetch('/api/reminders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create reminder');
            return res.json();
        },
        update: async (id: string, data: any) => {
            const res = await fetch(`/api/reminders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update reminder');
            return res.json();
        },
        delete: async (id: string) => {
            const res = await fetch(`/api/reminders/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete reminder');
            return res.json();
        }
    },
    notifications: {
        getAll: async () => {
            const res = await fetch('/api/notifications');
            if (res.status === 401) return [];
            if (!res.ok) throw new Error('Failed to fetch notifications');
            return res.json();
        },
        markRead: async (id: string) => {
            const res = await fetch(`/api/notifications/${id}`, {
                method: 'PUT',
            });
            if (!res.ok) throw new Error('Failed to update notification');
            return res.json();
        },
        create: async (data: { title: string, message: string, type: string }) => {
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create notification');
            return res.json();
        }
    },
    ai: {
        getTip: async () => {
            const res = await fetch('/api/ai/daily-tip');
            if (!res.ok) throw new Error('Failed to fetch daily tip');
            return res.json();
        }
    },
    leaderboard: {
        getTop: async () => {
            // Mock for now until endpoint created
            return [
                { id: 1, name: "Adarsh S.", xp: 12500, rank: 1, avatar: "👨‍💻" },
                { id: 2, name: "Sarah J.", xp: 11200, rank: 2, avatar: "👩‍🚀" },
                { id: 3, name: "Mike R.", xp: 10800, rank: 3, avatar: "🦸" },
                { id: 4, name: "You", xp: 9500, rank: 4, avatar: "😎" },
                { id: 5, name: "Emma W.", xp: 9200, rank: 5, avatar: "🧝‍♀️" }
            ];
            // const res = await fetch('/api/leaderboard');
            // if (!res.ok) throw new Error('Failed to fetch leaderboard');
            // return res.json();
        }
    }
};
