import React from 'react';
import type { Achievement } from '../types';

interface AchievementCenterProps {
  achievements: Achievement[];
}

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const { icon: Icon, name, description, unlocked, progress, goal } = achievement;
    const progressPercentage = goal && progress ? (progress / goal) * 100 : 0;
  
    return (
      <div className={`border rounded-xl p-5 flex flex-col transition-all duration-300 ${unlocked ? 'bg-background-surface border-yellow-400/50 shadow-lg shadow-yellow-900/50' : 'bg-slate-800/50 border-[var(--border-color)] opacity-70'}`}>
        <div className="flex items-center mb-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${unlocked ? 'bg-yellow-400/20' : 'bg-slate-700'}`}>
            <Icon className={`w-7 h-7 ${unlocked ? 'text-yellow-400' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${unlocked ? 'text-yellow-300' : 'text-text-primary'}`}>{name}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
        {!unlocked && goal && progress !== undefined && (
          <div className="mt-auto pt-3">
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-right text-xs text-slate-400 mt-1">{progress} / {goal}</p>
          </div>
        )}
      </div>
    );
  };
  
const AchievementCenter: React.FC<AchievementCenterProps> = ({ achievements }) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary">Achievement Center</h1>
        <p className="text-text-secondary mt-1">Track your progress and celebrate your victories.</p>
      </header>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Unlocked ({unlockedAchievements.length})</h2>
        {unlockedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedAchievements.map(ach => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl">
            <p className="text-slate-400">No achievements unlocked yet. Keep working hard!</p>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">Locked ({lockedAchievements.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedAchievements.map(ach => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCenter;
