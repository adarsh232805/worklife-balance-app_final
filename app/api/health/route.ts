import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HealthLog from '@/lib/models/HealthLog';
import User from '@/lib/models/User';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period');

        if (period === 'weekly') {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);

            const logs = await HealthLog.find({
                userId: session.user.id,
                date: { $gte: startDate, $lte: endDate }
            }).sort({ date: 1 });

            // Aggregate by day
            const dailyStats = new Map();
            // Initialize last 7 days
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                dailyStats.set(dayName, { name: dayName, calories: 0, water: 0, exercise: 0 });
            }

            logs.forEach(log => {
                const dayName = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
                const stat = dailyStats.get(dayName);
                if (stat) {
                    if (log.type === 'food') stat.calories += (log.value || 0);
                    if (log.type === 'water') stat.water += (log.value || 0);
                    if (['exercise', 'walk', 'run'].includes(log.type)) stat.exercise += (log.value || 0);
                }
            });

            return NextResponse.json({ trends: Array.from(dailyStats.values()) });
        }

        const dateStr = searchParams.get('date');
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        let startFilter = new Date();
        let endFilter = new Date();

        if (dateStr) {
            startFilter = new Date(dateStr); startFilter.setHours(0, 0, 0, 0);
            endFilter = new Date(dateStr); endFilter.setHours(23, 59, 59, 999);
        } else if (startDateParam && endDateParam) {
            startFilter = new Date(startDateParam);
            endFilter = new Date(endDateParam);
            endFilter.setHours(23, 59, 59, 999);
        } else {
            // Fallback to today if no params
            startFilter.setHours(0, 0, 0, 0);
            endFilter.setHours(23, 59, 59, 999);
        }

        const logs = await HealthLog.find({
            userId: session.user.id,
            date: { $gte: startFilter, $lte: endFilter }
        }).sort({ date: -1 });

        // Calculate Totals
        const totals = {
            calories: logs.filter(l => l.type === 'food').reduce((acc, curr) => acc + (curr.value || 0), 0),
            water: logs.filter(l => l.type === 'water').reduce((acc, curr) => acc + (curr.value || 0), 0),
            exercise: logs.filter(l => l.type === 'exercise' || l.type === 'walk' || l.type === 'run').reduce((acc, curr) => acc + (curr.value || 0), 0),
            yoga: logs.filter(l => l.type === 'yoga').reduce((acc, curr) => acc + (curr.value || 0), 0),
            meditation: logs.filter(l => l.type === 'meditation').reduce((acc, curr) => acc + (curr.value || 0), 0),
            workout: logs.filter(l => l.type === 'workout').reduce((acc, curr) => acc + (curr.value || 0), 0),
        };

        const user = await User.findById(session.user.id);

        return NextResponse.json({
            logs,
            totals,
            userProfile: {
                weight: user?.weight || 70,
                height: user?.height || 170,
                goals: user?.profile || {}
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch health data' }, { status: 500 });
    }
}
