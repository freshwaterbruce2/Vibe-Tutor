import React from 'react';
import { Trophy, Star, Sparkles, Crown, Zap } from 'lucide-react';

interface SubjectRewardsProps {
  subject: string;
  starsCollected: number;
  worksheetsCompleted: number;
  currentDifficulty: string;
}

const REWARDS_BY_STARS = [
  { stars: 5, reward: '🎁 Subject Badge Unlocked!', icon: Trophy },
  { stars: 10, reward: '⭐ Star Student Status!', icon: Star },
  { stars: 15, reward: '✨ Master Learner Award!', icon: Sparkles },
  { stars: 20, reward: '👑 Subject Champion!', icon: Crown },
  { stars: 30, reward: '⚡ Ultimate Scholar!', icon: Zap }
];

const SubjectRewards: React.FC<SubjectRewardsProps> = ({ 
  subject, 
  starsCollected, 
  worksheetsCompleted,
  currentDifficulty 
}) => {
  const nextReward = REWARDS_BY_STARS.find(r => r.stars > starsCollected);
  const unlockedRewards = REWARDS_BY_STARS.filter(r => r.stars <= starsCollected);

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{subject} Achievements</h3>
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-3xl font-bold text-yellow-400">{starsCollected}</span>
          <span className="text-gray-400">stars earned</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">{worksheetsCompleted} worksheets completed</p>
      </div>

      {/* Unlocked Rewards */}
      {unlockedRewards.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-purple-400 mb-3">🏆 Unlocked Rewards:</h4>
          <div className="space-y-2">
            {unlockedRewards.map(reward => {
              const Icon = reward.icon;
              return (
                <div
                  key={reward.stars}
                  className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <Icon className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-300">{reward.reward}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Reward */}
      {nextReward && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-2">🎯 Next Reward:</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <nextReward.icon className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-white">{nextReward.reward}</span>
            </div>
            <span className="text-xs text-gray-400">
              {nextReward.stars - starsCollected} more stars
            </span>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(starsCollected / nextReward.stars) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {starsCollected >= 30 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-xl text-center animate-pulse">
          <p className="text-lg font-bold text-yellow-400">🌟 {subject} MASTER! 🌟</p>
          <p className="text-sm text-gray-300 mt-1">You've unlocked all rewards!</p>
        </div>
      )}
    </div>
  );
};

export default SubjectRewards;

