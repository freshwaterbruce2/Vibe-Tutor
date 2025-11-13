import React, { useState } from 'react';
import type { Achievement, Reward, ClaimedReward } from '../types';

interface AchievementCenterProps {
  achievements: Achievement[];
  points: number;
  rewards: Reward[];
  claimedRewards: ClaimedReward[];
  onClaimReward: (rewardId: string) => boolean;
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

const RewardCard: React.FC<{ reward: Reward, points: number, onClaim: (id: string) => boolean }> = ({ reward, points, onClaim }) => {
    const canClaim = points >= reward.cost;
    const [justClaimed, setJustClaimed] = useState(false);

    const handleClaim = () => {
        if (onClaim(reward.id)) {
            setJustClaimed(true);
        }
    }

    return (
        <div className="border border-[var(--border-color)] bg-background-surface rounded-xl p-5 flex items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold text-text-primary">{reward.name}</h3>
                <p className="text-md text-[var(--primary-accent)] font-bold">{reward.cost} Points</p>
            </div>
            {justClaimed ? (
                 <div className="text-green-400 font-semibold">Claimed!</div>
            ) : (
                <button
                    onClick={handleClaim}
                    disabled={!canClaim}
                    className="px-5 py-2 font-semibold text-background-main bg-[var(--primary-accent)] rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                    Claim
                </button>
            )}
        </div>
    )
}

const AchievementCenter: React.FC<AchievementCenterProps> = ({ achievements, points, rewards, onClaimReward, claimedRewards }) => {
  const [activeTab, setActiveTab] = useState('achievements');
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const availableRewards = rewards.filter(r => !claimedRewards.some(cr => cr.id === r.id));

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="animate-bounce">
            <span className="text-6xl">🏆</span>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse">
            Achievements & Rewards
          </h1>
          <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
            <span className="text-6xl">⭐</span>
          </div>
        </div>
        <p className="text-text-secondary text-lg">🎉 Celebrate your victories and claim awesome rewards! 🎉</p>
      </header>

      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl mb-8 border-2 border-purple-500/50 shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-purple-300 mb-1">Your Points</h2>
          <p className="text-xs text-gray-400">Earn more by completing tasks and worksheets!</p>
        </div>
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse">
          {points}
        </div>
      </div>

      <div className="flex border-b border-[var(--border-color)] mb-6">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-6 py-3 text-lg font-semibold transition-colors ${activeTab === 'achievements' ? 'text-[var(--primary-accent)] border-b-2 border-[var(--primary-accent)]' : 'text-text-secondary'}`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-6 py-3 text-lg font-semibold transition-colors ${activeTab === 'rewards' ? 'text-[var(--primary-accent)] border-b-2 border-[var(--primary-accent)]' : 'text-text-secondary'}`}
        >
          Rewards
        </button>
      </div>

      {activeTab === 'achievements' && (
        <div className="animate-fade-in">
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
      )}

      {activeTab === 'rewards' && (
          <div className="animate-fade-in">
             <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-500">Available Rewards</h2>
             {availableRewards.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {availableRewards.map(reward => <RewardCard key={reward.id} reward={reward} points={points} onClaim={onClaimReward} />)}
                 </div>
             ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl">
                    <p className="text-slate-400">No rewards available right now. Check back later!</p>
                </div>
             )}
            {claimedRewards.length > 0 && (
                 <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">Pending Approval</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {claimedRewards.map(reward => (
                            <div key={reward.id} className="border border-dashed border-slate-600 bg-slate-800/50 rounded-xl p-5 flex items-center justify-between opacity-70">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-400">{reward.name}</h3>
                                    <p className="text-md text-slate-500">{reward.cost} Points</p>
                                </div>
                                <div className="text-slate-400 font-semibold">Pending...</div>
                            </div>
                        ))}
                     </div>
                 </div>
            )}
          </div>
      )}
       <style>{`
          @keyframes fade-in {
              0% { opacity: 0; }
              100% { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default AchievementCenter;
