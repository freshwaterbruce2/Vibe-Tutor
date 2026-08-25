import {
  Atom,
  BookOpen,
  Clock,
  Heart,
  PlayCircle,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BLAKE_CONFIG } from '../../config/blakeConfig';
import { getAllProgress } from '../../services/progressionService';
import { getTodayEarnings } from '../../services/tokenService';
import type { SubjectProgress, SubjectType } from '../../types';
import { logger } from '../../utils/logger';

interface SubjectCardsProps {
  onStartWorksheet: (subject: SubjectType) => void;
  userTokens: number;
}

const CARD_CONFIG: Record<SubjectType, { icon: typeof Zap; color: string; bgColor: string }> = {
  Math: { icon: Zap, color: 'from-fuchsia-400 to-pink-400', bgColor: 'bg-fuchsia-500/10' },
  Science: { icon: Atom, color: 'from-violet-400 to-fuchsia-500', bgColor: 'bg-violet-500/10' },
  History: { icon: Clock, color: 'from-purple-400 to-pink-400', bgColor: 'bg-purple-500/10' },
  Bible: { icon: Heart, color: 'from-pink-400 to-violet-500', bgColor: 'bg-pink-500/10' },
  'Language Arts': {
    icon: BookOpen,
    color: 'from-rose-400 to-purple-500',
    bgColor: 'bg-rose-500/10',
  },
};

const SUBJECTS: SubjectType[] = ['Math', 'Science', 'History', 'Bible', 'Language Arts'];

/** Render n stars: filled up to `filledCount`, the rest gray */
function Stars({
  filled,
  total = 5,
  size = 20,
}: {
  filled: number;
  total?: number;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < filled
              ? 'fill-pink-300 text-pink-300 drop-shadow-[0_0_6px_rgba(249,168,212,0.85)]'
              : 'text-purple-800'
          }
        />
      ))}
    </div>
  );
}

const SubjectCards = ({ onStartWorksheet, userTokens }: SubjectCardsProps) => {
  const [allProgress, setAllProgress] = useState<Partial<Record<SubjectType, SubjectProgress>>>({});
  const todayEarnings = getTodayEarnings();

  useEffect(() => {
    const load = async () => {
      try {
        const progress = await getAllProgress();
        setAllProgress(progress);
      } catch (error) {
        logger.error('[SubjectCards] Failed to load progress:', error);
      }
    };
    void load();
  }, []);

  // Pick today's daily challenge from blakeConfig (rotate by day-of-year, stable per mount)
  const [dailyChallenge] = useState(() => {
    const challenges = BLAKE_CONFIG.dailyChallenges;
    if (!challenges || challenges.length === 0) {
      return { task: 'Complete any quest today!', reward: 10 };
    }
    const dayIndex = Math.floor(Date.now() / 86_400_000) % challenges.length;
    return challenges[dayIndex]!;
  });

  // Count today's total worksheets completed across all subjects
  const todayWorksheets = useMemo(() => {
    return Object.values(allProgress).reduce(
      (sum, p) => sum + (p?.totalWorksheetsCompleted ?? 0),
      0,
    );
  }, [allProgress]);

  return (
    <div className="vibe-page-shell min-h-screen p-4 md:p-8 pb-36 md:pb-8 bg-[var(--background-main)]">
      {/* Header — Gaming Style */}
      <div className="text-center mb-8 md:mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          <Trophy size={40} className="text-[var(--secondary-accent)] animate-bounce" />
          <h1 className="vibe-hero-title text-4xl md:text-5xl lg:text-6xl font-black tracking-wide">
            Learning Realms
          </h1>
          <Sparkles size={32} className="text-[var(--primary-accent)] animate-pulse" />
        </div>
        <p className="text-[var(--text-secondary)] font-medium text-base md:text-lg px-4">
          Embark on epic quests to earn stars, collect tokens, and level up! 🚀
        </p>

        {/* Token Balance HUD */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <div className="vibe-chip glass-card px-5 py-2.5 rounded-full flex items-center gap-2">
            <span className="text-2xl animate-pulse">🪙</span>
            <span className="font-black text-xl text-[var(--token-color)] tracking-wider">{userTokens}</span>
            <span className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)]">Tokens</span>
          </div>
          {todayEarnings > 0 && (
            <div className="vibe-chip glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs">
              <TrendingUp size={14} className="text-[var(--secondary-accent)]" />
              <span className="text-[var(--secondary-accent)] font-medium">+{todayEarnings} today</span>
            </div>
          )}
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {SUBJECTS.map((subject) => {
          const progress = allProgress[subject];
          const config = CARD_CONFIG[subject];
          const Icon = config.icon;

          if (!progress) return null;

          const starsToNextLevel = 5 - progress.starsCollected;
          const progressPct = (progress.starsCollected / 5) * 100;
          const isMaxLevel =
            progress.currentDifficulty === 'Master' && progress.starsCollected >= 5;

          return (
            <div
              key={subject}
              className={`relative group glass-card p-6 md:p-8 rounded-3xl border-2 border-[var(--glass-border)] hover:border-[var(--secondary-accent)]/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(244,114,182,0.35)] ${config.bgColor}`}
            >
              {/* Subject Icon & Name */}
              <div className="text-center mb-5">
                <div
                  className={`inline-flex p-5 rounded-3xl bg-gradient-to-br ${config.color} mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3`}
                >
                  <Icon size={48} className="text-white drop-shadow-md" />
                </div>
                <h3
                  className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}
                >
                  {subject}
                </h3>
              </div>

              {/* Difficulty Badge */}
              <div className="text-center mb-4">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${config.color} text-white text-sm font-bold shadow-sm`}
                >
                  {progress.currentDifficulty} Level
                </span>
              </div>

              {/* Stars Display */}
              <div className="mb-4">
                <div className="flex justify-center mb-2">
                  <Stars filled={progress.starsCollected} size={24} />
                </div>
                <p className="text-center text-sm text-[var(--text-secondary)]">
                  {isMaxLevel
                    ? '🌟 Max Level!'
                    : `${starsToNextLevel} star${starsToNextLevel !== 1 ? 's' : ''} to next level`}
                </p>
              </div>

              {/* Progress Bar */}
              {!isMaxLevel && (
                <div className="mb-4">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500 progress-bar-fill`}
                      style={{ '--bar-width': `${progressPct}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-1.5 mb-4 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Quests</span>
                  <span className="font-bold text-white">{progress.totalWorksheetsCompleted}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Avg Score</span>
                  <span className="font-bold text-white">
                    {globalThis.Math.round(progress.averageScore)}%
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Best</span>
                  <span className="font-bold text-white">
                    {globalThis.Math.round(progress.bestScore)}%
                  </span>
                </div>
                {progress.currentStreak > 0 && (
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Streak</span>
                    <span className="font-bold text-[var(--energy-accent)]">{progress.currentStreak} 🔥</span>
                  </div>
                )}
              </div>

              {/* Motivational Message */}
              <div className="mb-4 p-2.5 bg-white/5 rounded-lg border border-[var(--glass-border)]">
                <p className="text-xs text-center text-[var(--text-secondary)]">
                  {isMaxLevel
                    ? "🌟 You're a master! Try another subject!"
                    : progress.starsCollected === 0
                      ? '🚀 Start your journey!'
                      : starsToNextLevel === 1
                        ? '🎯 One more star to level up!'
                        : '💪 Keep practicing!'}
                </p>
              </div>

              {/* Start Worksheet Button */}
              <button
                onClick={() => onStartWorksheet(subject)}
                className={`w-full px-6 py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 active:scale-95 transition-all vibe-cta bg-gradient-to-r ${config.color} text-white touch-manipulation group-hover:animate-pulse`}
              >
                <PlayCircle size={28} className="drop-shadow-sm" />
                <span className="tracking-wide text-shadow-sm">Enter Realm!</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Real Daily Challenge Banner */}
      <div className="mt-10 max-w-4xl mx-auto px-2 md:px-0">
        <div className="glass-card p-4 md:p-6 rounded-2xl border-2 border-[var(--glass-border)] bg-gradient-to-br from-pink-400/15 to-fuchsia-500/10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-4xl md:text-5xl shrink-0">🎯</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-[var(--secondary-accent)] mb-1 truncate">Daily Challenge</h3>
              <p className="text-white text-xs md:text-base mb-3 break-words">{dailyChallenge.task}</p>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-fuchsia-500 rounded-full transition-all duration-500 progress-bar-fill"
                    style={
                      {
                        '--bar-width': `${Math.min((todayWorksheets / 3) * 100, 100)}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {Math.min(todayWorksheets, 3)}/3
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--token-color)]">+{dailyChallenge.reward}</div>
              <div className="text-xs text-[var(--text-secondary)]">tokens</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-10 max-w-4xl mx-auto glass-card p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-[var(--secondary-accent)]" />
          How It Works
        </h3>
        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
          <li className="flex items-start gap-2">
            <Star className="text-[var(--secondary-accent)] flex-shrink-0 mt-0.5" size={16} />
            <span>Complete 10-question quests to earn 1–5 stars based on your score</span>
          </li>
          <li className="flex items-start gap-2">
            <TrendingUp className="text-[var(--primary-accent)] flex-shrink-0 mt-0.5" size={16} />
            <span>Collect 5 stars to explore new zones and unlock harder challenges</span>
          </li>
          <li className="flex items-start gap-2">
            <Trophy className="text-[var(--tertiary-accent)] flex-shrink-0 mt-0.5" size={16} />
            <span>Difficulty tiers: Beginner → Intermediate → Advanced → Expert → Master</span>
          </li>
          <li className="flex items-start gap-2">
            <PlayCircle className="text-[var(--quaternary-accent)] flex-shrink-0 mt-0.5" size={16} />
            <span>Practice makes perfect! Embark on as many quests as you want</span>
          </li>
        </ul>

        {/* Star Rating Guide — collapsed with loop */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <h4 className="font-bold mb-3 text-white text-sm">Star Rating Guide</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              { filled: 5, label: '90–100%' },
              { filled: 4, label: '80–89%' },
              { filled: 3, label: '70–79%' },
              { filled: 2, label: '60–69%' },
              { filled: 1, label: '50–59%' },
            ].map(({ filled, label }) => (
              <div key={filled} className="flex items-center gap-2">
                <Stars filled={filled} size={14} />
                <span className="text-[var(--text-secondary)]">
                  {label} = {filled} star{filled !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCards;
