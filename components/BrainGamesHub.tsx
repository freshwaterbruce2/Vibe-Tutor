import React, { useState, useEffect } from 'react';
import { Grid3x3, Search, Brain, Shuffle, Sparkles, Trophy, Flame, TrendingUp, Gift, Zap, Target, Crown } from 'lucide-react';
import type { BrainGameType } from '../types';
import CrosswordGame from './CrosswordGame';
import WordSearchGame from './WordSearchGame';
import SudokuGame from './SudokuGame';
import MemoryMatchGame from './MemoryMatchGame';
import AnagramsGame from './AnagramsGame';

interface BrainGamesHubProps {
  onGameComplete?: (gameType: BrainGameType, score: number, stars: number) => void;
}

interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  highestScore: number;
  currentStreak: number;
  chestsUnlocked: number;
  lastPlayedDate: string;
}

const GAME_INFO = {
  crossword: {
    icon: Grid3x3,
    name: 'Crossword',
    description: 'Fill puzzles with vocabulary',
    color: 'from-blue-600 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    needsSubject: true,
    difficulty: 'Medium',
    xpReward: 50
  },
  wordsearch: {
    icon: Search,
    name: 'Word Hunt',
    description: 'Find hidden words fast!',
    color: 'from-green-600 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    needsSubject: true,
    difficulty: 'Easy',
    xpReward: 30
  },
  sudoku: {
    icon: Grid3x3,
    name: 'Sudoku',
    description: 'Logic number puzzle',
    color: 'from-purple-600 to-pink-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    needsSubject: false,
    difficulty: 'Hard',
    xpReward: 75
  },
  memory: {
    icon: Brain,
    name: 'Memory Match',
    description: 'Match cards like a pro!',
    color: 'from-orange-600 to-red-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    needsSubject: true,
    difficulty: 'Easy',
    xpReward: 40
  },
  anagrams: {
    icon: Shuffle,
    name: 'Anagrams',
    description: 'Unscramble words',
    color: 'from-pink-600 to-rose-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    needsSubject: true,
    difficulty: 'Medium',
    xpReward: 45
  },
};

const SUBJECTS = [
  { id: 'math', name: 'Math', emoji: '🔢', color: 'text-yellow-400' },
  { id: 'science', name: 'Science', emoji: '🔬', color: 'text-green-400' },
  { id: 'history', name: 'History', emoji: '📜', color: 'text-orange-400' },
  { id: 'language', name: 'Language Arts', emoji: '📚', color: 'text-blue-400' },
  { id: 'bible', name: 'Bible', emoji: '✝️', color: 'text-yellow-300' },
  { id: 'all', name: 'Mixed Challenge', emoji: '🎯', color: 'text-purple-400' },
];

const BrainGamesHub: React.FC<BrainGamesHubProps> = ({ onGameComplete }) => {
  const [selectedGame, setSelectedGame] = useState<BrainGameType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('brainGamesStats');
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      totalScore: 0,
      highestScore: 0,
      currentStreak: 0,
      chestsUnlocked: 0,
      lastPlayedDate: ''
    };
  });
  const [showChestAnimation, setShowChestAnimation] = useState(false);

  useEffect(() => {
    localStorage.setItem('brainGamesStats', JSON.stringify(stats));
  }, [stats]);

  const handleGameComplete = (score: number, stars: number, timeSpent: number) => {
    // Update stats
    const today = new Date().toDateString();
    const newStreak = stats.lastPlayedDate === today ? stats.currentStreak : stats.currentStreak + 1;

    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      totalScore: stats.totalScore + score,
      highestScore: Math.max(stats.highestScore, score),
      currentStreak: newStreak,
      lastPlayedDate: today
    };

    // Check for chest unlock (every 5 games)
    if (newStats.gamesPlayed % 5 === 0) {
      newStats.chestsUnlocked = newStats.chestsUnlocked + 1;
      setShowChestAnimation(true);
      setTimeout(() => setShowChestAnimation(false), 3000);
    }

    setStats(newStats);

    if (selectedGame && onGameComplete) {
      onGameComplete(selectedGame, score, stars);
    }

    setSelectedGame(null);
    setSelectedSubject(null);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
    setSelectedSubject(null);
  };

  const handleGameSelect = (gameType: BrainGameType) => {
    const game = GAME_INFO[gameType];
    if (game.needsSubject) {
      setSelectedGame(gameType);
    } else {
      setSelectedGame(gameType);
      setSelectedSubject('none');
    }
  };

  // Render active game
  if (selectedGame && selectedSubject) {
    switch (selectedGame) {
      case 'crossword':
        return <CrosswordGame subject={selectedSubject} onComplete={handleGameComplete} onBack={handleBackToMenu} />;
      case 'wordsearch':
        return <WordSearchGame subject={selectedSubject} onComplete={handleGameComplete} onBack={handleBackToMenu} />;
      case 'sudoku':
        return <SudokuGame onComplete={handleGameComplete} onBack={handleBackToMenu} />;
      case 'memory':
        return <MemoryMatchGame subject={selectedSubject} onComplete={handleGameComplete} onBack={handleBackToMenu} />;
      case 'anagrams':
        return <AnagramsGame subject={selectedSubject} onComplete={handleGameComplete} onBack={handleBackToMenu} />;
      default:
        return null;
    }
  }

  // Subject selection
  if (selectedGame && !selectedSubject) {
    const game = GAME_INFO[selectedGame];
    return (
      <div className="min-h-screen p-4 md:p-8 pb-36 md:pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 mb-6 border border-white/10">
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-6 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-white font-semibold"
            >
              ← Back to Games
            </button>

            <div className="text-center mb-8">
              <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${game.color} mb-4`}>
                <game.icon size={48} className="text-white" />
              </div>
              <h2 className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${game.color} mb-2`}>
                {game.name}
              </h2>
              <p className="text-gray-300">{game.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold">+{game.xpReward} XP</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-center mb-6 text-white">Choose Your Subject:</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SUBJECTS.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`glass-card p-6 rounded-xl border border-white/10 transition-all transform hover:scale-105 hover:shadow-2xl hover:border-purple-500/50`}
                >
                  <div className="text-5xl mb-3">{subject.emoji}</div>
                  <div className={`font-bold ${subject.color} text-lg`}>{subject.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main hub
  const todayStr = new Date().toDateString();
  const playedToday = stats.lastPlayedDate === todayStr;
  const gamesUntilChest = 5 - (stats.gamesPlayed % 5);
  const dailyQuestComplete = playedToday;

  return (
    <div className="min-h-screen p-4 md:p-8 pb-36 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Animated Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-bounce">
              <Brain size={56} className="text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
              Brain Games Arena
            </h1>
            <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              <Sparkles size={56} className="text-yellow-500" />
            </div>
          </div>
          <p className="text-lg text-gray-300">🎮 Level up your brain while having a blast! 🧠</p>
        </div>

        {/* Chest Animation Overlay */}
        {showChestAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center animate-bounce">
              <div className="text-9xl mb-4">🎁</div>
              <h2 className="text-4xl font-bold text-yellow-400 mb-2">CHEST UNLOCKED!</h2>
              <p className="text-xl text-white">+100 Bonus Points!</p>
            </div>
          </div>
        )}

        {/* Stats Dashboard (Gamer-Style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 border border-purple-500/30 bg-purple-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-gray-400">Games Played</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.gamesPlayed}</div>
          </div>

          <div className="glass-card p-4 border border-orange-500/30 bg-orange-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-gray-400">Daily Streak</span>
            </div>
            <div className="text-3xl font-bold text-orange-400">{stats.currentStreak}</div>
          </div>

          <div className="glass-card p-4 border border-green-500/30 bg-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-xs text-gray-400">High Score</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.highestScore}</div>
          </div>

          <div className="glass-card p-4 border border-pink-500/30 bg-pink-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-pink-400" />
              <span className="text-xs text-gray-400">Chests</span>
            </div>
            <div className="text-3xl font-bold text-pink-400">{stats.chestsUnlocked}</div>
          </div>
        </div>

        {/* Daily Quest Banner */}
        <div className={`glass-card p-6 rounded-2xl border-2 ${
          dailyQuestComplete
            ? 'border-green-500/50 bg-green-500/10'
            : 'border-yellow-500/50 bg-yellow-500/10'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`text-6xl ${dailyQuestComplete ? '' : 'animate-bounce'}`}>
              {dailyQuestComplete ? '✅' : '🎯'}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                {dailyQuestComplete ? 'Daily Quest Complete!' : 'Daily Quest'}
              </h3>
              <p className="text-white mb-3">
                {dailyQuestComplete
                  ? 'Come back tomorrow for a new quest! 🎉'
                  : 'Play ANY game today to earn +25 bonus points!'}
              </p>
              {!dailyQuestComplete && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Tap any game below to start</span>
                  <Target className="w-4 h-4 text-yellow-400 animate-ping" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chest Progress Tracker */}
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-pink-400" />
              <h3 className="text-xl font-bold text-white">Next Chest Unlock</h3>
            </div>
            <div className="text-2xl">
              {gamesUntilChest === 5 ? '🎁' : gamesUntilChest === 1 ? '🎁✨' : '🔒'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{5 - gamesUntilChest} / 5 games played</span>
              <span className="text-pink-400 font-bold">{gamesUntilChest} more to go!</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                style={{ width: `${((5 - gamesUntilChest) / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              Each chest contains +100 bonus points!
            </p>
          </div>
        </div>

        {/* Game Grid */}
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          Choose Your Game
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(GAME_INFO) as BrainGameType[]).map((gameType, index) => {
            const game = GAME_INFO[gameType];
            const Icon = game.icon;

            return (
              <button
                key={gameType}
                onClick={() => handleGameSelect(gameType)}
                className={`glass-card p-6 border-2 ${game.borderColor} ${game.bgColor} rounded-2xl transition-all transform hover:scale-105 hover:shadow-2xl group`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* XP Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs font-bold text-yellow-400">
                    +{game.xpReward} XP
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {game.difficulty}
                  </div>
                </div>

                {/* Icon */}
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${game.color} flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all`}>
                  <Icon size={48} className="text-white" />
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${game.color}`}>
                  {game.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{game.description}</p>

                {/* Play Button */}
                <div className={`px-4 py-3 bg-gradient-to-r ${game.color} rounded-xl font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2`}>
                  <Zap className="w-5 h-5" />
                  PLAY NOW
                </div>
              </button>
            );
          })}
        </div>

        {/* Why Brain Games (Gamer-Friendly Messaging) */}
        <div className="glass-card p-8 mt-8 border border-white/10">
          <h3 className="text-2xl font-bold text-center mb-6 text-white flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Power Up Your Brain
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <div className="text-5xl mb-3">🧠</div>
              <div className="font-bold text-purple-300 text-lg mb-2">Memory +</div>
              <div className="text-sm text-gray-400">Level up recall speed like loading assets faster in games</div>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="text-5xl mb-3">⚡</div>
              <div className="font-bold text-green-300 text-lg mb-2">Reaction Time</div>
              <div className="text-sm text-gray-400">Train your APM (actions per minute) for better gameplay</div>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="text-5xl mb-3">🎯</div>
              <div className="font-bold text-blue-300 text-lg mb-2">Problem Solving</div>
              <div className="text-sm text-gray-400">Master strategy like pro gamers analyze opponents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainGamesHub;
