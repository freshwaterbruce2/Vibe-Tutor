import { PlayCircle, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SUBJECTS, SUBJECT_THEME } from '../realms/subjectTheme';
import { getAllProgress } from '../../services/progressionService';
import { getTodayEarnings } from '../../services/tokenService';
import type { SubjectProgress, SubjectType } from '../../types';
import { logger } from '../../utils/logger';

interface SubjectCardsProps {
  onStartWorksheet: (subject: SubjectType) => void;
  userTokens: number;
}

const HOW_IT_WORKS = [
  { step: '1', title: 'Tap a card', detail: 'Any subject works.' },
  { step: '2', title: 'Practice or play', detail: '10 questions, or a game.' },
  { step: '3', title: 'Earn stars', detail: '5 stars unlocks the next level.' },
] as const;

function fallbackProgress(subject: SubjectType): SubjectProgress {
  return {
    subject,
    currentDifficulty: 'Beginner',
    starsCollected: 0,
    totalWorksheetsCompleted: 0,
    averageScore: 0,
    bestScore: 0,
    currentStreak: 0,
    history: [],
    unlockedAt: 0,
  };
}

function Stars({
  filled,
  filledClass,
  total = 5,
  size = 20,
}: {
  filled: number;
  filledClass: string;
  total?: number;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < filled ? filledClass : 'text-white/20'}
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

  const recommendedSubject = useMemo(() => {
    const unstarted = SUBJECTS.find((subject) => {
      const progress = allProgress[subject];
      return !progress || progress.totalWorksheetsCompleted === 0;
    });
    if (unstarted) return unstarted;

    return SUBJECTS.reduce((lowest, subject) => {
      const lowestStars = allProgress[lowest]?.starsCollected ?? 0;
      const subjectStars = allProgress[subject]?.starsCollected ?? 0;
      return subjectStars < lowestStars ? subject : lowest;
    }, SUBJECTS[0]!);
  }, [allProgress]);

  return (
    <div className="vibe-page-shell min-h-screen p-4 md:p-8 pb-36 md:pb-8 bg-[var(--background-main)]">
      <div className="text-center mb-8 md:mb-10">
        <h1 className="vibe-hero-title text-4xl md:text-5xl lg:text-6xl font-black tracking-wide">
          Pick a subject
        </h1>
        <p className="text-[var(--text-secondary)] font-medium text-base md:text-lg px-4 mt-3">
          Tap a card to practice questions or play a game.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <div className="vibe-chip glass-card px-5 py-2.5 rounded-full flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              🪙
            </span>
            <span className="font-black text-xl text-[var(--token-color)] tracking-wider">
              {userTokens}
            </span>
            <span className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)]">
              Tokens
            </span>
          </div>
          {todayEarnings > 0 && (
            <div className="vibe-chip glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs">
              <TrendingUp size={14} className="text-[var(--secondary-accent)]" />
              <span className="text-[var(--secondary-accent)] font-medium">
                +{todayEarnings} today
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto mb-8">
        {HOW_IT_WORKS.map((item) => (
          <div
            key={item.step}
            className="glass-card rounded-2xl px-4 py-3 text-left flex items-start gap-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-sm font-black text-white">
              {item.step}
            </span>
            <div>
              <p className="font-bold text-white text-sm">{item.title}</p>
              <p className="text-xs text-[var(--text-secondary)]">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {SUBJECTS.map((subject) => {
          const progress = allProgress[subject] ?? fallbackProgress(subject);
          const theme = SUBJECT_THEME[subject];
          const Icon = theme.icon;
          const starsToNextLevel = 5 - progress.starsCollected;
          const progressPct = (progress.starsCollected / 5) * 100;
          const isMaxLevel =
            progress.currentDifficulty === 'Master' && progress.starsCollected >= 5;
          const isRecommended = subject === recommendedSubject;

          return (
            <button
              key={subject}
              type="button"
              onClick={() => onStartWorksheet(subject)}
              aria-label={`Practice ${subject}. ${progress.currentDifficulty}. ${progress.starsCollected} of 5 stars.`}
              className={`relative group glass-card p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 text-left ${theme.wash} ${theme.restBorder} ${theme.hoverBorder} ${
                isRecommended ? `ring-2 ${theme.ring}` : ''
              }`}
            >
              {isRecommended && (
                <span
                  className={`absolute top-4 right-4 vibe-chip px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.accentText}`}
                >
                  Start here
                </span>
              )}

              <div className="text-center mb-5">
                <div
                  className={`inline-flex p-5 rounded-3xl bg-gradient-to-br ${theme.gradient} mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3`}
                >
                  <Icon size={48} className="text-white drop-shadow-md" aria-hidden="true" />
                </div>
                <h3
                  className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}
                >
                  {subject}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{theme.prompt}</p>
              </div>

              <div className="text-center mb-4">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${theme.gradient} text-white text-sm font-bold shadow-sm`}
                >
                  {progress.currentDifficulty}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-center mb-2">
                  <Stars filled={progress.starsCollected} filledClass={theme.starFilled} size={24} />
                </div>
                <p className="text-center text-sm text-[var(--text-secondary)]">
                  {isMaxLevel
                    ? 'Max level — keep practicing!'
                    : progress.starsCollected === 0
                      ? 'No stars yet — tap to start'
                      : `${starsToNextLevel} star${starsToNextLevel !== 1 ? 's' : ''} to the next level`}
                </p>
              </div>

              {!isMaxLevel && (
                <div className="mb-5">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 progress-bar-fill`}
                      style={{ '--bar-width': `${progressPct}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              )}

              <span
                className={`w-full px-6 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 bg-gradient-to-r ${theme.gradient} text-white shadow-lg`}
              >
                <PlayCircle size={26} className="drop-shadow-sm" />
                Practice {subject}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 max-w-4xl mx-auto glass-card p-5 rounded-2xl flex items-start gap-3">
        <Sparkles size={20} className="text-[var(--secondary-accent)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--text-secondary)]">
          Score 90% or higher on a practice set to earn 5 stars. Collect 5 stars to move up a
          level.
        </p>
      </div>
    </div>
  );
};

export default SubjectCards;
