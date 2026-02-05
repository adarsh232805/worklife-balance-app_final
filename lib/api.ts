import { ITask } from './models/Task';

export const api = {
    tasks: {
        getAll: async (date?: string) => {
            const query = date ? `?date=${date}` : '';
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
        getHistory: async (date?: string) => {
            const query = date ? `?date=${date}` : '';
            const res = await fetch(`/api/activity${query}`);
            if (!res.ok) throw new Error('Failed to fetch activity history');
            return res.json();
        }
    },
    user: {
        getProgress: async () => {
            const res = await fetch('/api/user/progress');
            if (!res.ok) throw new Error('Failed to fetch user progress');
            return res.json();
        }
    }
};
