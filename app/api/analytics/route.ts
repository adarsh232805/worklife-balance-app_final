import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/lib/models/Task';
import Activity from '@/lib/models/Activity';
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

        // Parse Query Params
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'week'; // 'day' | 'week' | 'month'

        const now = new Date();
        const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);

        let startDate = new Date(now);
        let dateFormat = "%Y-%m-%d"; // default for week/month

        if (range === 'day') {
            startDate.setHours(0, 0, 0, 0);
            dateFormat = "%H:00"; // hourly grouped
        } else if (range === 'month') {
            startDate.setDate(now.getDate() - 30);
            startDate.setHours(0, 0, 0, 0);
        } else {
            // default week
            startDate.setDate(now.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
        }

        const userId = session.user.id;

        // PARALLEL QUERIES
        const [
            user,
            focusSessions,
            tasks,
            healthLogs,
            activityData
        ] = await Promise.all([
            User.findById(userId).select('xp level streak profile'),
            Activity.find({
                userId,
                type: 'Focus',
                startTime: { $gte: startOfDay }
            }),
            Task.find({ userId }),
            HealthLog.find({ userId, date: { $gte: startDate } }),
            Activity.aggregate([
                { $match: { userId, type: 'Focus', startTime: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: dateFormat, date: "$startTime" } },
                        minutes: { $sum: "$duration" }
                    }
                }
            ])
        ]);

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // --- 1. CORE STATS ---
        const focusMinutesToday = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);
        const tasksCompletedToday = tasks.filter(t => t.completed && new Date(t.updatedAt) >= startOfDay).length;
        const tasksPending = tasks.filter(t => !t.completed).length;

        // --- 2. CHART DATA (Dynamic based on range) ---
        const chartData = [];

        if (range === 'day') {
            // Hourly 0-23
            for (let i = 0; i < 24; i++) {
                const hourStr = `${String(i).padStart(2, '0')}:00`;
                const found = activityData.find((item: any) => item._id === hourStr);
                chartData.push({
                    day: hourStr,
                    minutes: found ? found.minutes : 0
                });
            }
        } else {
            // Daily (Week or Month)
            const days = range === 'month' ? 30 : 7;
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const dateKey = d.toISOString().split('T')[0];
                const found = activityData.find((item: any) => item._id === dateKey);
                chartData.push({
                    day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    minutes: found ? found.minutes : 0
                });
            }
        }

        // --- 3. TASK CATEGORIES ---
        const taskCategories = tasks.reduce((acc: any, curr) => {
            const cat = curr.category || 'Other';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        const taskPieData = Object.keys(taskCategories).map(key => ({
            name: key,
            value: taskCategories[key]
        }));

        // --- 4. WELLNESS SUMMARY ---
        const sleepLogs = healthLogs.filter(h => h.type === 'sleep');
        const avgSleep = sleepLogs.length > 0
            ? (sleepLogs.reduce((acc, curr) => acc + curr.value, 0) / sleepLogs.length).toFixed(1)
            : 0;

        const workouts = healthLogs.filter(h => ['exercise', 'run', 'yoga', 'workout'].includes(h.type)).length;
        const hydration = healthLogs.filter(h => h.type === 'water').reduce((acc, curr) => acc + curr.value, 0);

        // --- 5. REAL AI INFERENCE ENGINE ---
        let reportStatus = "Balanced";
        let reportText = "You are maintaining a steady rhythm. Keep tracking your progress.";
        let recommendation = "Stay consistent with your current routine.";

        // Logic Rules
        const isSleepDeprived = Number(avgSleep) > 0 && Number(avgSleep) < 6;
        const isOverworking = focusMinutesToday > 240; // 4 hours
        const isProductive = focusMinutesToday > 120 && tasksCompletedToday > 3;
        const isSlacking = focusMinutesToday < 30 && tasksPending > 5;
        const isDehydrated = hydration > 0 && hydration < 1000;

        if (isSleepDeprived && isOverworking) {
            reportStatus = "Burnout Warning";
            reportText = `You've focused for ${Math.round(focusMinutesToday / 60)}h today but averaged only ${avgSleep}h sleep.`;
            recommendation = "Stop working now. Optimization requires recovery. Sleep at least 7h tonight.";
        }
        else if (isProductive) {
            reportStatus = "Peak Performance";
            reportText = "Excellent output! You are hitting high focus metrics while clearing tasks.";
            recommendation = "You're in flow. Tackle your hardest task for tomorrow while momentum is high.";
        }
        else if (isSlacking) {
            reportStatus = "Distracted";
            reportText = `You have ${tasksPending} pending tasks but only ${focusMinutesToday}m focus time.`;
            recommendation = "Try a '90-min Deep Work' session to clear the backlog.";
        }
        else if (isDehydrated) {
            reportStatus = "Low Energy Risk";
            reportText = "Your hydration levels are tracking low, which impacts cognitive function.";
            recommendation = "Drink a large glass of water right now.";
        }

        return NextResponse.json({
            range,
            user: {
                xp: user.xp,
                level: user.level,
                streak: user.streak,
                profile: user.profile
            },
            today: {
                focusMinutes: focusMinutesToday,
                tasksCompleted: tasksCompletedToday,
                tasksPending
            },
            charts: {
                focusTrend: chartData,
                taskPieData,
            },
            wellness: {
                avgSleep,
                workouts,
                waterIntake: hydration
            },
            report: {
                status: reportStatus,
                text: reportText,
                recommendation
            }
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
