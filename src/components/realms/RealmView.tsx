import { ChevronLeft, Flame, PlayCircle, Puzzle, Sparkles, Trophy } from 'lucide-react';
import type { ElementType } from 'react';
import { lazy, Suspense, useState, useCallback, useRef } from 'react';
import {
  calculateStandardGameTokens,
  getGameDisplayName,
  type GameCompletionDetails,
} from '../../services/gameProgression';
import type { SubjectType } from '../../types';

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
  Array<{ id: string; name: string; desc: string; icon: ElementType; bgClass: string; iconClass: string }>
> = {
  Math: [
    {
      id: 'math',
      name: 'Math Adventure',
      desc: 'Solve puzzles as you go.',
      icon: Sparkles,
      bgClass: 'bg-fuchsia-500/20',
      iconClass: 'text-fuchsia-300',
    },
    {
      id: 'boss-math',
      name: 'The Math Menace',
      desc: 'A tougher boss round.',
      icon: Flame,
      bgClass: 'bg-pink-500/20',
      iconClass: 'text-pink-300',
    },
  ],
  'Language Arts': [
    {
      id: 'anagrams',
      name: 'Anagrams',
      desc: 'Unscramble the letters.',
      icon: Puzzle,
      bgClass: 'bg-violet-500/20',
      iconClass: 'text-violet-300',
    },
    {
      id: 'crossword',
      name: 'Crossword',
      desc: 'Fill in the clues.',
      icon: Sparkles,
      bgClass: 'bg-rose-500/20',
      iconClass: 'text-rose-300',
    },
    {
      id: 'wordbuilder',
      name: 'Word Builder',
      desc: 'Build words letter by letter.',
      icon: Sparkles,
      bgClass: 'bg-purple-500/20',
      iconClass: 'text-purple-300',
    },
  ],
  Science: [
    {
      id: 'boss-science',
      name: 'The Mad Scientist',
      desc: 'Answer science questions.',
      icon: Flame,
      bgClass: 'bg-fuchsia-500/20',
      iconClass: 'text-fuchsia-300',
    },
  ],
  History: [
    {
      id: 'boss-history',
      name: 'The Time Bandit',
      desc: 'A history showdown.',
      icon: Flame,
      bgClass: 'bg-pink-500/20',
      iconClass: 'text-pink-300',
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
    <div className="vibe-page-shell min-h-screen p-4 md:p-8 pb-36 font-sans bg-[var(--background-main)]">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <ChevronLeft size={20} /> All subjects
        </button>

        <div className="glass-card p-8 rounded-3xl mb-8 border-[1px] border-[var(--glass-border)] text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/15 to-fuchsia-500/10 pointer-events-none"></div>
          <Trophy
            size={48}
            className="mx-auto text-[var(--secondary-accent)] mb-4 relative z-10"
          />
          <h1 className="vibe-hero-title text-4xl md:text-5xl font-black mb-3 relative z-10">
            {subject}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8 relative z-10">
            Practice 10 questions to earn stars
            {games.length > 0 ? ', or play a game below.' : '.'}
          </p>

          <button
            type="button"
            onClick={() => onStartWorksheet(subject)}
            className="relative z-10 vibe-cta w-full md:w-auto md:px-12 px-6 py-4 rounded-2xl font-black text-xl inline-flex items-center justify-center gap-3 active:scale-95 transition-all text-white group"
          >
            <PlayCircle size={28} className="group-hover:animate-pulse" /> Practice 10 questions
          </button>
        </div>

        {games.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="text-[var(--primary-accent)]" /> Or play a game
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => {
                const Icon = game.icon;
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => setActiveGame(game.id)}
                    className="glass-card p-6 rounded-2xl border-[1px] border-[var(--glass-border)] hover:border-[var(--secondary-accent)]/60 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(244,114,182,0.28)] group flex flex-col h-full bg-[var(--glass-surface)] backdrop-blur-md"
                  >
                    <div className={`inline-flex p-4 rounded-xl mb-4 shadow-inner ${game.bgClass}`}>
                      <Icon
                        size={28}
                        className={`group-hover:scale-110 transition-transform duration-300 ${game.iconClass}`}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-[var(--text-secondary)] text-sm flex-grow leading-relaxed">
                      {game.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
