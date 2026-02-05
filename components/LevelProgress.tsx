'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap } from 'lucide-react';

export default function LevelProgress() {
    const [progress, setProgress] = useState({ xp: 0, level: 1, streak: 0, nextLevelXp: 100 });

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await api.user.getProgress();
                setProgress(data);
            } catch (error) {
                console.error('Failed to fetch progress', error);
            }
        };

        fetchProgress();
        // Refresh every 30s to stay synced
        const interval = setInterval(fetchProgress, 30000);
        return () => clearInterval(interval);
    }, []);

    const progressPercent = Math.min(100, (progress.xp / progress.nextLevelXp) * 100);

    return (
        <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            {/* LEVEL BADGE */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {progress.level}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Lvl</span>
                    <span className="text-xs font-bold text-slate-700 leading-none">Novice</span>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="hidden md:block w-24 h-2 bg-slate-200 rounded-full overflow-hidden relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-primary rounded-full"
                />
            </div>

            {/* STREAK */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <Flame size={14} className={`${progress.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300'}`} />
                <span className="text-xs font-bold text-slate-700">{progress.streak}</span>
            </div>
        </div>
    );
}
