import React, { useState, useEffect } from 'react';
import type { SubjectType, SubjectProgress } from '../types';
import { BookOpen, Atom, Clock, Sparkles, Trophy, Zap, Star, PlayCircle, Heart, TrendingUp } from 'lucide-react';
import { getAllProgress } from '../services/progressionService';

interface SubjectCardsProps {
  onStartWorksheet: (subject: SubjectType) => void;
}

const CARD_CONFIG: Record<SubjectType, { icon: typeof Zap; color: string; bgColor: string }> = {
  Math: { icon: Zap, color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-500/10' },
  Science: { icon: Atom, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' },
  History: { icon: Clock, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' },
  Bible: { icon: Heart, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-500/10' },
  'Language Arts': { icon: BookOpen, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' }
};

const SubjectCards: React.FC<SubjectCardsProps> = ({ onStartWorksheet }) => {
  const [allProgress, setAllProgress] = useState<Record<SubjectType, SubjectProgress>>({} as any);
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);

  useEffect(() => {
    const progress = getAllProgress();
    setAllProgress(progress);
  }, []);

  const subjects: SubjectType[] = ['Math', 'Science', 'History', 'Bible', 'Language Arts'];

  return (
    <div className="min-h-screen p-4 md:p-8 pb-36 md:pb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy size={48} className="text-yellow-500" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
            Subject Worksheets
          </h1>
        </div>
        <p className="text-text-secondary text-lg">
          Complete worksheets to earn stars and unlock harder levels!
        </p>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {subjects.map(subject => {
          const progress = allProgress[subject];
          const config = CARD_CONFIG[subject];
          const Icon = config.icon;

          if (!progress) return null;

          const starsToNextLevel = 5 - progress.starsCollected;
          const progressPercentage = (progress.starsCollected / 5) * 100;
          const isMaxLevel = progress.currentDifficulty === 'Master' && progress.starsCollected >= 5;

          return (
            <div
              key={subject}
              className={`relative group glass-card p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedSubject === subject ? 'border-yellow-500 shadow-yellow-500/50 scale-105' : 'border-[var(--glass-border)]'
              } ${config.bgColor}`}
            >
              {/* Subject Icon & Name */}
              <div className="text-center mb-4">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${config.color} mb-3`}>
                  <Icon size={48} className="text-white" />
                </div>
                <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}>
                  {subject}
                </h3>
              </div>

              {/* Difficulty Badge */}
              <div className="text-center mb-4">
                <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${config.color} text-white text-sm font-bold`}>
                  {progress.currentDifficulty} Level
                </div>
              </div>

              {/* Stars Display */}
              <div className="mb-4">
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Star
                      key={num}
                      size={28}
                      className={num <= progress.starsCollected ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-text-secondary">
                  {isMaxLevel ? 'Max Level!' : `${starsToNextLevel} star${starsToNextLevel !== 1 ? 's' : ''} to next level`}
                </p>
              </div>

              {/* Progress Bar */}
              {!isMaxLevel && (
                <div className="mb-4">
                  <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-2 mb-4 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Worksheets Completed:</span>
                  <span className="font-bold text-text-primary">{progress.totalWorksheetsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Score:</span>
                  <span className="font-bold text-text-primary">{Math.round(progress.averageScore)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Best Score:</span>
                  <span className="font-bold text-text-primary">{Math.round(progress.bestScore)}%</span>
                </div>
                {progress.currentStreak > 0 && (
                  <div className="flex justify-between">
                    <span>Current Streak:</span>
                    <span className="font-bold text-orange-400">{progress.currentStreak} 🔥</span>
                  </div>
                )}
              </div>

              {/* Start Worksheet Button */}
              <button
                onClick={() => onStartWorksheet(subject)}
                className={`w-full glass-button px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all bg-gradient-to-r ${config.color}`}
                style={{ touchAction: 'manipulation' }}
              >
                <PlayCircle size={24} />
                <span>Start Worksheet</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12 max-w-4xl mx-auto glass-card p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles size={24} className="text-yellow-500" />
          How It Works
        </h3>
        <ul className="space-y-2 text-text-secondary">
          <li className="flex items-start gap-2">
            <Star className="text-yellow-500 flex-shrink-0 mt-1" size={16} />
            <span>Complete 10-question worksheets to earn 1-5 stars based on your score</span>
          </li>
          <li className="flex items-start gap-2">
            <TrendingUp className="text-green-500 flex-shrink-0 mt-1" size={16} />
            <span>Collect 5 stars to level up and unlock harder questions</span>
          </li>
          <li className="flex items-start gap-2">
            <Trophy className="text-purple-500 flex-shrink-0 mt-1" size={16} />
            <span>Difficulty levels: Beginner → Intermediate → Advanced → Expert → Master</span>
          </li>
          <li className="flex items-start gap-2">
            <PlayCircle className="text-blue-500 flex-shrink-0 mt-1" size={16} />
            <span>Practice makes perfect! Take as many worksheets as you want</span>
          </li>
        </ul>

        {/* Star Rating Guide */}
        <div className="mt-6 pt-6 border-t border-[var(--glass-border)]">
          <h4 className="font-bold mb-3 text-text-primary">Star Rating Guide:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <span className="text-text-secondary">90-100% = 5 stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="text-gray-600" size={16} />
              <span className="text-text-secondary">80-89% = 4 stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="text-gray-600" size={16} />
              <Star className="text-gray-600" size={16} />
              <span className="text-text-secondary">70-79% = 3 stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="text-gray-600" size={16} />
              <Star className="text-gray-600" size={16} />
              <Star className="text-gray-600" size={16} />
              <span className="text-text-secondary">60-69% = 2 stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <Star className="text-gray-600" size={16} />
              <Star className="text-gray-600" size={16} />
              <Star className="text-gray-600" size={16} />
              <Star className="text-gray-600" size={16} />
              <span className="text-text-secondary">50-59% = 1 star</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCards;
