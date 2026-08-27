import {
  ChevronLeft,
  Compass,
  FlaskConical,
  Grid3x3,
  Hourglass,
  PlayCircle,
  Puzzle,
  Sparkles,
  Type,
} from 'lucide-react';
import type { ElementType } from 'react';
import { lazy, Suspense, useState, useCallback, useRef } from 'react';
import {
  calculateStandardGameTokens,
  getGameDisplayName,
  type GameCompletionDetails,
} from '../../services/gameProgression';
import type { SubjectType } from '../../types';
import VibePageShell from '../ui/VibePageShell';
import { SUBJECT_THEME } from './subjectTheme';

const AnagramsGame = lazy(async () => import('../games/AnagramsGame'));
const CrosswordGame = lazy(async () => import('../games/CrosswordGame'));
const MathAdventureGame = lazy(async () => import('../games/MathAdventureGame'));
const WordBuilderGame = lazy(async () => import('../games/WordBuilderGame'));
const MusicNotesGame = lazy(async () => import('../games/MusicNotesGame'));
const BossBattleGame = lazy(async () => import('../games/BossBattleGame'));

interface RealmViewProps {
  subject: SubjectType;
  onStartWorksheet: (subject: SubjectType) => void;
  onBack: () => void;
  onEarnTokens: (amount: number, reason?: string) => void;
  onGameCompleted?: (gameId: string, score: number, details: GameCompletionDetails) => void;
}

const REALM_GAMES: Record<
  SubjectType,
  Array<{ id: string; name: string; desc: string; icon: ElementType }>
> = {
  Math: [
    {
      id: 'math',
      name: 'Math Adventure',
      desc: 'Solve puzzles as you go.',
      icon: Compass,
    },
    {
      id: 'boss-math',
      name: 'The Math Menace',
      desc: 'A tougher boss round.',
      icon: Sparkles,
    },
  ],
  'Language Arts': [
    {
      id: 'anagrams',
      name: 'Anagrams',
      desc: 'Unscramble the letters.',
      icon: Puzzle,
    },
    {
      id: 'crossword',
      name: 'Crossword',
      desc: 'Fill in the clues.',
      icon: Grid3x3,
    },
    {
      id: 'wordbuilder',
      name: 'Word Builder',
      desc: 'Build words letter by letter.',
      icon: Type,
    },
  ],
  Science: [
    {
      id: 'boss-science',
      name: 'The Mad Scientist',
      desc: 'Answer science questions.',
      icon: FlaskConical,
    },
  ],
  History: [
    {
      id: 'boss-history',
      name: 'The Time Bandit',
      desc: 'A history showdown.',
      icon: Hourglass,
    },
  ],
  Bible: [],
};

export default function RealmView({
  subject,
  onStartWorksheet,
  onBack,
  onEarnTokens,
  onGameCompleted,
}: RealmViewProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const continuousGameTokensRef = useRef(0);
  const theme = SUBJECT_THEME[subject];
  const SubjectIcon = theme.icon;

  const handleGameComplete = useCallback(
    (
      gameId: string,
      score: number,
      stars: number,
      timeSpent?: number,
      options?: { awardHubTokens?: boolean; autoCloseDelayMs?: number },
    ) => {
      const awardHubTokens = options?.awardHubTokens ?? true;
      const earnedTokens = awardHubTokens
        ? calculateStandardGameTokens(gameId, stars)
        : continuousGameTokensRef.current;
      if (awardHubTokens) {
        onEarnTokens(earnedTokens, `Played ${getGameDisplayName(gameId)}`);
      }
      onGameCompleted?.(gameId, score, {
        source: 'learning-realm',
        stars,
        timeSpent,
        subject,
        tokensEarned: earnedTokens,
      });
      setTimeout(() => setActiveGame(null), options?.autoCloseDelayMs ?? 1500);
    },
    [onEarnTokens, onGameCompleted, subject],
  );

  const closeActiveGame = useCallback(() => {
    if (
      activeGame &&
      ['math', 'wordbuilder', 'musicnotes'].includes(activeGame) &&
      continuousGameTokensRef.current > 0
    ) {
      const earned = continuousGameTokensRef.current;
      handleGameComplete(activeGame, earned * 10, earned >= 20 ? 3 : 1, undefined, {
        awardHubTokens: false,
        autoCloseDelayMs: 0,
      });
    }
    continuousGameTokensRef.current = 0;
    setActiveGame(null);
  }, [activeGame, handleGameComplete]);

  if (activeGame) {
    const groupAProps = {
      subject,
      onComplete: (score: number, stars: number, timeSpent: number) =>
        handleGameComplete(activeGame, score, stars, timeSpent),
      onBack: closeActiveGame,
    };
    const groupBProps = {
      onEarnTokens: (amount: number) => {
        if (amount <= 0) return;
        continuousGameTokensRef.current += amount;
        onEarnTokens(amount, `Played ${getGameDisplayName(activeGame ?? 'game')}`);
      },
      onClose: closeActiveGame,
    };

    return (
      <Suspense fallback={<div className="p-8 text-center text-white">Loading...</div>}>
        <div
          className="fixed inset-0 z-[80] overflow-y-auto bg-[var(--background-main)]"
          style={{
            overscrollBehavior: 'contain',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingTop: 'max(env(safe-area-inset-top), 0.5rem)',
          }}
        >
          {activeGame === 'anagrams' && <AnagramsGame {...groupAProps} />}
          {activeGame === 'crossword' && <CrosswordGame {...groupAProps} />}
          {activeGame.startsWith('boss-') && (
            <BossBattleGame
              subject={subject}
              onComplete={groupAProps.onComplete}
              onBack={groupAProps.onBack}
            />
          )}
          {activeGame === 'math' && <MathAdventureGame {...groupBProps} />}
          {activeGame === 'wordbuilder' && <WordBuilderGame {...groupBProps} />}
          {activeGame === 'musicnotes' && <MusicNotesGame {...groupBProps} />}
        </div>
      </Suspense>
    );
  }

  const games = REALM_GAMES[subject] || [];

  return (
    <div className="vibe-page-shell min-h-screen p-4 md:p-8 pb-36 font-sans">
    <VibePageShell className="min-h-screen p-4 md:p-8 pb-36 font-sans">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <ChevronLeft size={20} /> All subjects
        </button>

        <div
          className={`subject-card glass-card p-8 rounded-3xl mb-8 border-2 ${theme.restBorder} text-center relative overflow-hidden ${theme.wash} ${theme.glow}`}
        >
          <div
            className={`pointer-events-none absolute -top-16 -right-10 h-52 w-52 rounded-full blur-3xl opacity-45 ${theme.orb}`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${theme.overlay} pointer-events-none`}
          ></div>
          <div className="relative z-10 inline-flex mb-4">
            <div
              className={`absolute inset-0 rounded-full blur-xl opacity-80 bg-gradient-to-br ${theme.gradient}`}
            />
            <div
              className={`relative inline-flex p-5 rounded-full bg-gradient-to-br ${theme.gradient} shadow-xl`}
            >
              <SubjectIcon size={44} className="text-white" aria-hidden="true" />
            </div>
          </div>
          <h1
            className={`relative z-10 text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}
          >
            {subject}
          </h1>
          <p className="text-[var(--text-primary)]/90 text-lg mb-8 relative z-10">
            Practice 10 questions to earn stars
            {games.length > 0 ? ', or play a game below.' : '.'}
          </p>

          <button
            type="button"
            onClick={() => onStartWorksheet(subject)}
            className={`relative z-10 w-full md:w-auto md:px-12 px-6 py-4 rounded-2xl font-black text-xl inline-flex items-center justify-center gap-3 active:scale-95 transition-all text-white group bg-gradient-to-r ${theme.gradient} shadow-[0_12px_28px_-8px_rgba(0,0,0,0.65)] ring-1 ring-white/25`}
          >
            <PlayCircle size={28} className="group-hover:animate-pulse" /> Practice 10 questions
          </button>
        </div>

        {games.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className={theme.accentText} /> Or play a game
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => {
                const Icon = game.icon;
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => setActiveGame(game.id)}
                    className={`subject-card glass-card p-6 rounded-2xl border-2 ${theme.restBorder} ${theme.hoverBorder} text-left group flex flex-col h-full ${theme.wash} ${theme.glow}`}
                  >
                    <div className={`inline-flex p-4 rounded-xl mb-4 shadow-inner ${theme.well}`}>
                      <Icon
                        size={28}
                        className={`group-hover:scale-110 transition-transform duration-300 ${theme.accentText}`}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-[var(--text-primary)]/85 text-sm flex-grow leading-relaxed">
                      {game.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </VibePageShell>
  );
}
