import React, { useState } from 'react';
import { Grid3x3, Search, Brain, Shuffle, Sparkles } from 'lucide-react';
import type { BrainGameType } from '../types';
import CrosswordGame from './CrosswordGame';
import WordSearchGame from './WordSearchGame';
import SudokuGame from './SudokuGame';
import MemoryMatchGame from './MemoryMatchGame';
import AnagramsGame from './AnagramsGame';

interface BrainGamesProps {
  onGameComplete?: (gameType: BrainGameType, score: number, stars: number) => void;
}

const GAME_INFO = {
  crossword: {
    icon: Grid3x3,
    name: 'Crossword',
    description: 'Fill in the puzzle with educational vocabulary',
    color: 'from-blue-600 to-cyan-600',
    needsSubject: true,
  },
  wordsearch: {
    icon: Search,
    name: 'Word Search',
    description: 'Find hidden words in the grid',
    color: 'from-green-600 to-emerald-600',
    needsSubject: true,
  },
  sudoku: {
    icon: Grid3x3,
    name: 'Sudoku',
    description: 'Classic number puzzle game',
    color: 'from-purple-600 to-pink-600',
    needsSubject: false,
  },
  memory: {
    icon: Brain,
    name: 'Memory Match',
    description: 'Match words with their definitions',
    color: 'from-orange-600 to-red-600',
    needsSubject: true,
  },
  anagrams: {
    icon: Shuffle,
    name: 'Anagrams',
    description: 'Unscramble educational vocabulary',
    color: 'from-pink-600 to-rose-600',
    needsSubject: true,
  },
};

const SUBJECTS = [
  { id: 'math', name: 'Math', emoji: '🔢' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'history', name: 'History', emoji: '📜' },
  { id: 'language', name: 'Language Arts', emoji: '📚' },
  { id: 'bible', name: 'Bible', emoji: '✝️' },
  { id: 'all', name: 'Mixed', emoji: '🎯' },
];

const BrainGames: React.FC<BrainGamesProps> = ({ onGameComplete }) => {
  const [selectedGame, setSelectedGame] = useState<BrainGameType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const handleGameComplete = (score: number, stars: number, timeSpent: number) => {
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
      // Stay on subject selection
    } else {
      setSelectedGame(gameType);
      setSelectedSubject('none'); // Sudoku doesn't need subject
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

  // Subject selection screen
  if (selectedGame && !selectedSubject) {
    const game = GAME_INFO[selectedGame];
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 mb-6">
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              ← Back to Games
            </button>

            <h2 className="text-3xl font-bold text-center mb-4 neon-text-primary">{game.name}</h2>
            <p className="text-center text-white/80 mb-8">{game.description}</p>

            <h3 className="text-2xl font-bold text-center mb-6 text-white">Choose a Subject:</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SUBJECTS.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`glass-button p-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl`}
                >
                  <div className="text-4xl mb-2">{subject.emoji}</div>
                  <div className="font-bold text-white">{subject.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game selection menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles size={32} className="text-yellow-400" />
            <h1 className="text-4xl font-bold neon-text-primary">Brain Games</h1>
            <Sparkles size={32} className="text-yellow-400" />
          </div>
          <p className="text-white/80 text-lg">Challenge yourself with fun educational puzzles!</p>
        </div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(GAME_INFO) as BrainGameType[]).map(gameType => {
            const game = GAME_INFO[gameType];
            const Icon = game.icon;

            return (
              <button
                key={gameType}
                onClick={() => handleGameSelect(gameType)}
                className="glass-card p-6 hover:scale-105 transition-all transform hover:shadow-2xl group"
              >
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${game.color} flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                  <Icon size={40} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2 text-white">{game.name}</h3>
                <p className="text-white/70">{game.description}</p>

                <div className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Play Now
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="glass-card p-6 mt-8">
          <h3 className="text-xl font-bold text-center mb-4 text-white">Why Brain Games?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">🧠</div>
              <div className="font-bold text-white">Boost Memory</div>
              <div className="text-sm text-white/70">Improve recall and retention</div>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-white">Think Faster</div>
              <div className="text-sm text-white/70">Enhance problem-solving speed</div>
            </div>
            <div>
              <div className="text-3xl mb-2">📚</div>
              <div className="font-bold text-white">Learn Vocabulary</div>
              <div className="text-sm text-white/70">Expand your word knowledge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainGames;
