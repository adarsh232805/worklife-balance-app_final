import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap } from 'lucide-react';
import LevelUpModal from './LevelUpModal';
import ProfileStatsModal from './ProfileStatsModal';


export default function LevelProgress() {
    const [progress, setProgress] = useState({ xp: 0, level: 1, streak: 0, nextLevelXp: 100 });
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const prevLevel = useRef<number>(1);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await api.user.getProgress();

                // Check for level up
                if (data && data.level > prevLevel.current && prevLevel.current > 0) {
                    setShowLevelUp(true);
                }

                if (data) {
                    // Update refs and state
                    prevLevel.current = data.level;
                    setProgress(data);
                }
            } catch (error) {
                // Silent fail on progress update to prevent UI crash
                console.warn('Background sync failed:', error);
            }
        };

        fetchProgress();
        // Refresh every 10s (faster sync for better feedback)
        const interval = setInterval(fetchProgress, 10000);
        return () => clearInterval(interval);
    }, []);

    const progressPercent = Math.min(100, (progress.xp / progress.nextLevelXp) * 100);

    return (
        <>
            <LevelUpModal
                isOpen={showLevelUp}
                newLevel={progress.level}
                onClose={() => setShowLevelUp(false)}
            />

            <ProfileStatsModal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
            />

            <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
            >
                {/* LEVEL BADGE */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white group-hover:scale-110 transition-transform">
                        {progress.level}
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Lvl</span>
                        <span className="text-xs font-bold text-slate-700 leading-none group-hover:text-indigo-600 transition-colors">
                            {progress.level <= 5 ? "Novice" : progress.level <= 10 ? "Pro" : "Master"}
                        </span>
                    </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="hidden md:block w-24 h-2 bg-slate-200 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-primary rounded-full group-hover:bg-indigo-500 transition-colors"
                    />
                </div>

                {/* STREAK */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200" title="Daily Streak">
                    <Flame size={14} className={`${progress.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300 group-hover:text-orange-400'}`} />
                    <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{progress.streak}</span>
                </div>
            </button>
        </>
    );
}
