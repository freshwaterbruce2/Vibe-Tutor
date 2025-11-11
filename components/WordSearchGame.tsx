import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { getRandomWords } from '../services/wordBanks';
import { generateWordSearch, calculateWordSearchScore } from '../services/puzzleGenerator';
import type { WordSearchGrid } from '../services/puzzleGenerator';

interface WordSearchGameProps {
  subject: string;
  onComplete: (score: number, stars: number, timeSpent: number) => void;
  onBack: () => void;
}

const WordSearchGame: React.FC<WordSearchGameProps> = ({ subject, onComplete, onBack }) => {
  const [startTime] = useState(Date.now());
  const [puzzle, setPuzzle] = useState<WordSearchGrid | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<{row: number, col: number} | null>(null);

  useEffect(() => {
    const words = getRandomWords(subject, 8, 'easy');
    const wordSearch = generateWordSearch(words, 12);
    setPuzzle(wordSearch);
  }, [subject]);

  const handleFinish = () => {
    if (!puzzle) return;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const result = calculateWordSearchScore(foundWords.size, puzzle.words.length, timeSpent);
    onComplete(result.score, result.stars, timeSpent);
  };

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setStartCell({ row, col });
    setSelectedCells(new Set([getCellKey(row, col)]));
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (selecting && startCell) {
      // Simple selection - just add to set
      const newSelected = new Set(selectedCells);
      newSelected.add(getCellKey(row, col));
      setSelectedCells(newSelected);
    }
  };

  const handleCellMouseUp = () => {
    setSelecting(false);
    // Check if selection forms a word
    // (Simplified - in production would validate direction and word)
    setSelectedCells(new Set());
    setStartCell(null);
  };

  const toggleWordFound = (word: string) => {
    const newFound = new Set(foundWords);
    if (newFound.has(word)) {
      newFound.delete(word);
    } else {
      newFound.add(word);
    }
    setFoundWords(newFound);
  };

  if (!puzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Generating puzzle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card p-4 mb-6 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-white font-medium">{foundWords.size}/{puzzle.words.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-cyan-400" />
              <span className="text-white font-medium">{Math.floor((Date.now() - startTime) / 1000)}s</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Word Grid */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-2xl font-bold text-center mb-4 neon-text-primary">{subject} Word Search</h2>

            <div className="inline-block mx-auto" onMouseLeave={() => setSelecting(false)}>
              {puzzle.grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((letter, colIndex) => {
                    const cellKey = getCellKey(rowIndex, colIndex);
                    const isSelected = selectedCells.has(cellKey);
                    return (
                      <div
                        key={cellKey}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-purple-500/30 font-mono font-bold cursor-pointer select-none transition-colors ${
                          isSelected ? 'bg-cyan-500 text-white' : 'bg-purple-900/30 text-white hover:bg-purple-700/50'
                        }`}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Word List */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Find These Words:</h3>
            <div className="space-y-2">
              {puzzle.words.map(w => (
                <div
                  key={w.word}
                  onClick={() => toggleWordFound(w.word)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    foundWords.has(w.word)
                      ? 'bg-green-600 text-white line-through'
                      : 'bg-purple-800/50 text-white hover:bg-purple-700/70'
                  }`}
                >
                  <div className="font-bold">{w.word}</div>
                  <div className="text-sm opacity-80">{w.clue}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleFinish}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold text-white transition-all transform hover:scale-105"
            >
              Finish Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearchGame;
