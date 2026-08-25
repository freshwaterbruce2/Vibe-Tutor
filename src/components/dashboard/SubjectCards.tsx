import { PlayCircle, Star, TrendingUp } from 'lucide-react';
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

  const orderedSubjects = useMemo(
    () =>
      [...SUBJECTS].sort((a, b) => {
        if (a === recommendedSubject) return -1;
        if (b === recommendedSubject) return 1;
        return 0;
      }),
    [recommendedSubject],
  );

  return (
    <div className="vibe-page-shell min-h-screen p-4 md:p-8 pb-36 md:pb-8 bg-[var(--background-main)]">
      <div className="text-center mb-8 md:mb-10">
        <h1 className="vibe-hero-title text-4xl md:text-5xl lg:text-6xl font-black tracking-wide">
          Pick a subject
        </h1>
        <p className="text-[var(--text-secondary)] font-medium text-base md:text-lg px-4 mt-3">
          Tap a card to practice questions or play a game.
        </p>
        <p className="text-[var(--text-muted)] text-sm px-4 mt-2">
          Tap a card · Practice or play · Earn stars
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {orderedSubjects.map((subject) => {
          const progress = allProgress[subject] ?? fallbackProgress(subject);
          const theme = SUBJECT_THEME[subject];
          const Icon = theme.icon;
          const starsToNextLevel = 5 - progress.starsCollected;
          const progressPct = (progress.starsCollected / 5) * 100;
          const isMaxLevel =
            progress.currentDifficulty === 'Master' && progress.starsCollected >= 5;
          const isRecommended = subject === recommendedSubject;
          const starMessage = isMaxLevel
            ? 'Max level — keep practicing!'
            : progress.starsCollected === 0
              ? 'No stars yet — tap to start'
              : `${starsToNextLevel} star${starsToNextLevel !== 1 ? 's' : ''} to the next level`;

          return (
            <button
              key={subject}
              type="button"
              onClick={() => onStartWorksheet(subject)}
              aria-label={`Practice ${subject}. ${progress.currentDifficulty}. ${progress.starsCollected} of 5 stars.`}
              className={`subject-card relative group glass-card p-6 rounded-3xl border-2 transition-all duration-300 text-left ${theme.wash} ${theme.restBorder} ${theme.hoverBorder} ${theme.glow} ${
                isRecommended ? `md:col-span-2 md:p-8 ring-2 ${theme.ring}` : ''
              }`}
            >
              <div
                className={`pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full blur-3xl opacity-50 ${theme.orb}`}
              />

              {isRecommended && (
                <span
                  className={`absolute top-4 right-4 z-10 vibe-chip px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.accentText}`}
                >
                  Start here
                </span>
              )}

              <div
                className={`relative z-10 ${
                  isRecommended
                    ? 'flex flex-col md:flex-row md:items-center md:gap-8 md:text-left'
                    : 'text-center'
                }`}
              >
                <div className={isRecommended ? 'text-center md:text-left shrink-0' : ''}>
                  <div className="relative inline-flex mb-4 md:mb-0">
                    <div
                      className={`absolute inset-0 rounded-full blur-xl opacity-80 bg-gradient-to-br ${theme.gradient}`}
                    />
                    <div
                      className={`relative inline-flex p-5 rounded-full bg-gradient-to-br ${theme.gradient} shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        size={isRecommended ? 56 : 44}
                        className="text-white drop-shadow-md"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                <div className={`min-w-0 ${isRecommended ? 'md:flex-1' : ''}`}>
                  <div
                    className={`flex flex-wrap items-center gap-2 mb-1 ${
                      isRecommended ? 'justify-center md:justify-start' : 'justify-center'
                    }`}
                  >
                    <h3
                      className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}
                    >
                      {subject}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${theme.accentText} ${theme.well}`}
                    >
                      {progress.currentDifficulty}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{theme.prompt}</p>

                  <div
                    className={`mt-3 ${isRecommended ? 'flex justify-center md:justify-start' : 'flex justify-center'}`}
                  >
                    <Stars
                      filled={progress.starsCollected}
                      filledClass={theme.starFilled}
                      size={isRecommended ? 26 : 22}
                    />
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{starMessage}</p>

                  {!isMaxLevel && (
                    <div className="mt-3 mb-4">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 progress-bar-fill`}
                          style={{ '--bar-width': `${progressPct}%` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  )}

                  <span
                    className={`px-6 py-4 rounded-2xl font-black text-lg inline-flex items-center justify-center gap-3 bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${
                      isRecommended ? 'w-full md:w-auto md:min-w-[240px]' : 'w-full'
                    }`}
                  >
                    <PlayCircle size={26} className="drop-shadow-sm" />
                    Practice {subject}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectCards;
