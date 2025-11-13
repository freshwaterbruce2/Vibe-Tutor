import { ArrowLeft, CheckCircle, Clock, Lightbulb, Pause, Play, Sparkles } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { updateGameStats } from '../services/gameAchievements';
import { initializeAudio, playSound } from '../services/gameSounds';
import type { WordSearchGrid } from '../services/puzzleGenerator';
import { calculateWordSearchScore, generateWordSearch } from '../services/puzzleGenerator';
import { awardGameComplete } from '../services/tokenService';
import { endSession, startSession } from '../services/usageTracker';
import { getRandomWords } from '../services/wordBanks';
import CelebrationEffect from './CelebrationEffect';
import GameSettings, { getSavedGameConfig, saveGameConfig, type GameConfig } from './GameSettings';

interface WordSearchGameProps {
  subject: string;
  onComplete: (score: number, stars: number, timeSpent: number) => void;
  onBack: () => void;
}

const WordSearchGame: React.FC<WordSearchGameProps> = ({ subject, onComplete, onBack }) => {
  // Game configuration
  const [config, setConfig] = useState<GameConfig>(() => getSavedGameConfig('wordsearch'));
  const [showSettings, setShowSettings] = useState(true); // Show settings first
  const [gameStarted, setGameStarted] = useState(false);

  // Game state
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [puzzle, setPuzzle] = useState<WordSearchGrid | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<{ row: number, col: number } | null>(null);
  const [usageSessionId, setUsageSessionId] = useState<string | null>(null);

  // Enhancement state
  const [celebrate, setCelebrate] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('wordsearch-tutorial-seen');
  });

  // Generate puzzle based on config
  useEffect(() => {
    if (!gameStarted) return;

    const words = getRandomWords(subject, config.wordCount || 8, 'easy');
    const wordSearch = generateWordSearch(words, config.gridSize || 12);
    setPuzzle(wordSearch);
    setStartTime(Date.now());

    // Start usage tracking session
    const sessionId = startSession('game', {
      gameType: 'wordsearch',
      subject,
      difficulty: config.difficulty,
    });
    setUsageSessionId(sessionId);

    // Initialize audio on first interaction
    initializeAudio();
  }, [subject, config.gridSize, config.wordCount, gameStarted]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || isPaused || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);

      // Check time limit in timed mode
      if (config.timerMode === 'timed' && config.timeLimit && elapsed >= config.timeLimit) {
        handleFinish();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, isPaused, startTime, config.timerMode, config.timeLimit]);

  const handleFinish = () => {
    if (!puzzle) return;
    const timeSpent = elapsedTime;

    // Deduct hint penalty from score
    const baseResult = calculateWordSearchScore(foundWords.size, puzzle.words.length, timeSpent);
    const hintPenalty = hintsUsed * 50; // 50 points per hint
    const finalScore = Math.max(0, baseResult.score - hintPenalty);

    // Save config for next time
    saveGameConfig('wordsearch', config);

    // Play completion sound
    if (config.soundEnabled) {
      playSound('game-complete');
    }

    // End usage tracking session
    if (usageSessionId) {
      endSession(usageSessionId, {
        score: finalScore,
        wordsFound: foundWords.size,
        totalWords: puzzle.words.length,
        hintsUsed,
        timeSpent,
      });
    }

    // Award tokens for game completion
    const allWordsFound = foundWords.size === puzzle.words.length;
    const noHints = hintsUsed === 0;
    awardGameComplete('Word Hunt', finalScore, allWordsFound, noHints, usageSessionId || 'unknown');

    // Update game achievements (Roblox-style badges)
    const gameData = {
      wordsFound: foundWords.size,
      timeSpent,
      hintsUsed,
      difficulty: config.difficulty || 'medium',
      subject,
      allWordsFound,
    };
    updateGameStats(
      foundWords.size,
      puzzle.words.length,
      timeSpent,
      finalScore,
      config.difficulty || 'medium',
      subject,
      hintsUsed
    );

    onComplete(finalScore, baseResult.stars, timeSpent);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleUseHint = useCallback(() => {
    if (!puzzle || !config.hintsEnabled) return;

    // Find unfound words
    const unfoundWords = puzzle.words.filter(w => !foundWords.has(w.word));
    if (unfoundWords.length === 0) return;

    // Pick random unfound word
    const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];

    // Reveal first letter
    const firstCellKey = `${randomWord.startRow}-${randomWord.startCol}`;
    const newRevealed = new Set(revealedCells);
    newRevealed.add(firstCellKey);
    setRevealedCells(newRevealed);
    setHintsUsed(h => h + 1);

    // Play hint sound
    if (config.soundEnabled) {
      playSound('hint-used');
    }
  }, [puzzle, foundWords, config.hintsEnabled, config.soundEnabled, revealedCells]);

  const startGame = () => {
    setShowSettings(false);
    setGameStarted(true);
    if (showTutorial) {
      // Tutorial will show, then game starts
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('wordsearch-tutorial-seen', 'true');
  };

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setStartCell({ row, col });
    setSelectedCells(new Set([getCellKey(row, col)]));
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (selecting && startCell && puzzle) {
      // Build selection from start to current cell
      const newSelected = new Set<string>();

      // Determine direction
      const rowDiff = row - startCell.row;
      const colDiff = col - startCell.col;

      // Straight line selection (horizontal, vertical, or diagonal)
      if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
        const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
        const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

        for (let i = 0; i <= steps; i++) {
          const r = startCell.row + (i * rowStep);
          const c = startCell.col + (i * colStep);
          newSelected.add(getCellKey(r, c));
        }
      }

      setSelectedCells(newSelected);
    }
  };

  const handleCellMouseUp = () => {
    try {
      if (!puzzle || !startCell || selectedCells.size === 0) {
        setSelecting(false);
        setSelectedCells(new Set());
        setStartCell(null);
        return;
      }

      // Build selected word from cells (preserve selection order)
      const cellsArray = Array.from(selectedCells);

      // Sort by position relative to start cell
      cellsArray.sort((a, b) => {
        const [r1, c1] = a.split('-').map(Number);
        const [r2, c2] = b.split('-').map(Number);
        const dist1 = Math.abs(r1 - startCell.row) + Math.abs(c1 - startCell.col);
        const dist2 = Math.abs(r2 - startCell.row) + Math.abs(c2 - startCell.col);
        return dist1 - dist2;
      });

      let selectedWord = '';
      cellsArray.forEach(cellKey => {
        const [r, c] = cellKey.split('-').map(Number);
        if (puzzle.grid && puzzle.grid[r] && puzzle.grid[r][c]) {
          selectedWord += puzzle.grid[r][c];
        }
      });

      // Check if it matches any word in the list
      if (selectedWord && puzzle.words) {
        const matchedWord = puzzle.words.find(w =>
          w.word.toUpperCase() === selectedWord.toUpperCase() ||
          w.word.toUpperCase() === selectedWord.split('').reverse().join('').toUpperCase()
        );

        if (matchedWord && !foundWords.has(matchedWord.word)) {
          // Found a word!
          console.log('Word found:', matchedWord.word, 'Position:', matchedWord.startRow, matchedWord.startCol, matchedWord.endRow, matchedWord.endCol);

          try {
            const newFound = new Set(foundWords);
            newFound.add(matchedWord.word);
            setFoundWords(newFound);

            console.log('Updated foundWords, total:', newFound.size);

            // CELEBRATION TIME!
            setCelebrate(true);
            setTimeout(() => setCelebrate(false), 1000);

            // Play success sound
            if (config.soundEnabled) {
              playSound('word-found');
            }

            // Haptic feedback
            try {
              const sensoryPrefs = JSON.parse(localStorage.getItem('sensory-prefs') || '{}');
              if (sensoryPrefs.hapticEnabled !== false && navigator.vibrate) {
                navigator.vibrate([50, 30, 50]); // Double pulse for success
              }
            } catch (e) {
              console.log('Vibration not supported:', e);
            }
          } catch (error) {
            console.error('Error updating foundWords:', error);
            // Don't throw - just skip this word
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error in handleCellMouseUp:', error);
    } finally {
      setSelecting(false);
      setSelectedCells(new Set());
      setStartCell(null);
    }
  };

  // Touch event handlers for mobile (A54 optimization)
  const handleTouchStart = (row: number, col: number) => {
    try {
      handleCellMouseDown(row, col);
    } catch (error) {
      console.error('Touch start error:', error);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!selecting || !puzzle) return;

    try {
      e.preventDefault(); // Prevent scrolling during selection
      const touch = e.touches[0];
      if (!touch) return;

      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.hasAttribute('data-row') && element.hasAttribute('data-col')) {
        const row = parseInt(element.getAttribute('data-row')!, 10);
        const col = parseInt(element.getAttribute('data-col')!, 10);

        // Add bounds checking
        if (!isNaN(row) && !isNaN(col) &&
          row >= 0 && row < puzzle.grid.length &&
          col >= 0 && col < puzzle.grid[0].length) {
          handleCellMouseEnter(row, col);
        }
      }
    } catch (error) {
      console.error('Touch move error:', error);
      // Don't crash - just stop selecting
      setSelecting(false);
    }
  };

  const handleTouchEnd = () => {
    try {
      handleCellMouseUp();
    } catch (error) {
      console.error('Touch end error:', error);
      setSelecting(false);
      setSelectedCells(new Set());
      setStartCell(null);
    }
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

  // Safety check: Validate puzzle structure
  if (!puzzle.grid || !Array.isArray(puzzle.grid) || puzzle.grid.length === 0) {
    console.error('Invalid puzzle grid:', puzzle);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Error loading puzzle</div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-bold"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  // Safety check: Validate all words have required properties
  const invalidWords = puzzle.words.filter(w =>
    w.startRow === undefined || w.startCol === undefined ||
    w.endRow === undefined || w.endCol === undefined
  );

  if (invalidWords.length > 0) {
    console.error('Invalid word positions:', invalidWords);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Error: Some words have invalid positions</div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-bold"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  // Show settings screen first
  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="glass-card p-8 border border-purple-500/50">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 neon-text-primary">Word Hunt Settings</h2>
              <p className="text-gray-300">Configure your game before starting</p>
            </div>

            <GameSettings
              config={config}
              onChange={(newConfig) => {
                setConfig(newConfig);
                saveGameConfig('wordsearch', newConfig);
              }}
              gameType="wordsearch"
            />

            <div className="mt-8 flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={startGame}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold text-white transition-all transform hover:scale-105"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show tutorial for first-time players
  if (showTutorial && gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="glass-card p-8 border border-cyan-500/50">
            <div className="text-center mb-6">
              <Sparkles size={48} className="mx-auto mb-4 text-yellow-400 animate-bounce" />
              <h2 className="text-3xl font-bold mb-2 text-white">How to Play Word Hunt</h2>
              <p className="text-gray-300">Quick tutorial for first-timers</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <span className="text-3xl">👆</span>
                <div>
                  <div className="font-bold text-cyan-400 mb-1">Swipe to Select</div>
                  <div className="text-sm text-gray-300">Touch the first letter and drag to the last letter of the word</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <span className="text-3xl">✨</span>
                <div>
                  <div className="font-bold text-green-400 mb-1">Words Highlight Green</div>
                  <div className="text-sm text-gray-300">When you find a word, it turns green and you get points!</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <span className="text-3xl">💡</span>
                <div>
                  <div className="font-bold text-yellow-400 mb-1">Need Help?</div>
                  <div className="text-sm text-gray-300">Use the hint button to reveal the first letter of a word (costs 10 points)</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <span className="text-3xl">🎯</span>
                <div>
                  <div className="font-bold text-purple-400 mb-1">Words Go Any Direction</div>
                  <div className="text-sm text-gray-300">Horizontal, vertical, or diagonal - forwards or backwards!</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      localStorage.setItem('wordsearch-tutorial-seen', 'true');
                    }
                  }}
                  className="rounded"
                />
                Don't show this again
              </label>
              <button
                onClick={closeTutorial}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-bold text-white transition-all"
              >
                Got it! Let's Play
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const wordsRemaining = puzzle.words.length - foundWords.size;
  const progressPercent = (foundWords.size / puzzle.words.length) * 100;
  const timeRemaining = config.timerMode === 'timed' && config.timeLimit
    ? config.timeLimit - elapsedTime
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6 pb-36 md:pb-8">
      <CelebrationEffect trigger={celebrate} type="confetti" duration={1000} />

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <ArrowLeft size={20} />
              Back
            </button>

            <div className="flex items-center gap-3">
              {/* Pause/Resume */}
              <button
                onClick={handlePauseToggle}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>

              {/* Hint Button */}
              {config.hintsEnabled && (
                <button
                  onClick={handleUseHint}
                  disabled={wordsRemaining === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="Reveal first letter (10 points)"
                >
                  <Lightbulb size={20} />
                  <span className="hidden sm:inline">Hint</span>
                  {hintsUsed > 0 && <span className="text-xs">({hintsUsed})</span>}
                </button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-white font-medium">{foundWords.size}/{puzzle.words.length} words</span>
              {wordsRemaining > 0 && (
                <span className="text-sm text-gray-400">({wordsRemaining} left)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock size={20} className={timeRemaining && timeRemaining < 60 ? 'text-red-400 animate-pulse' : 'text-cyan-400'} />
              <span className="text-white font-medium">
                {config.timerMode === 'timed' && timeRemaining !== null
                  ? `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
                  : `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`
                }
              </span>
            </div>

            {hintsUsed > 0 && (
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-400" />
                <span className="text-sm text-gray-400">-{hintsUsed * 10} pts (hints)</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Word Grid */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-2xl font-bold text-center mb-4 neon-text-primary">{subject} Word Search</h2>

            <div className="flex justify-center overflow-hidden relative">
              {/* Pause Overlay */}
              {isPaused && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center">
                    <Pause size={64} className="mx-auto mb-4 text-yellow-400 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2">Game Paused</h3>
                    <p className="text-gray-300 mb-4">Grid hidden to prevent cheating</p>
                    <button
                      onClick={handlePauseToggle}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-white"
                    >
                      Resume Game
                    </button>
                  </div>
                </div>
              )}

              <div
                className={`inline-grid gap-0 transition-all ${isPaused ? 'blur-xl' : ''}`}
                style={{
                  gridTemplateColumns: `repeat(${puzzle.grid[0].length}, minmax(0, 1fr))`,
                  maxWidth: '100%',
                  aspectRatio: '1/1',
                  width: 'min(100%, 600px)',
                  touchAction: 'none'
                }}
                onMouseLeave={() => setSelecting(false)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {puzzle.grid.map((row, rowIndex) => (
                  row.map((letter, colIndex) => {
                    const cellKey = getCellKey(rowIndex, colIndex);
                    const isSelected = selectedCells.has(cellKey);
                    const isRevealed = revealedCells.has(cellKey);

                    // Check if this cell is part of a found word
                    const isFound = puzzle.words.some(w => {
                      try {
                        if (!foundWords.has(w.word)) return false;
                        const { startRow, startCol, endRow, endCol } = w;

                        // Validate all coordinates exist and are numbers
                        if (startRow === undefined || startCol === undefined ||
                          endRow === undefined || endCol === undefined) {
                          return false;
                        }

                        // Calculate direction from start to end
                        const rowDiff = endRow - startRow;
                        const colDiff = endCol - startCol;

                        const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
                        const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
                        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

                        // Check if current cell is on the word path
                        for (let i = 0; i <= steps; i++) {
                          const r = startRow + (i * rowStep);
                          const c = startCol + (i * colStep);

                          // Round to avoid floating point issues
                          if (Math.round(r) === rowIndex && Math.round(c) === colIndex) {
                            return true;
                          }
                        }
                        return false;
                      } catch (error) {
                        console.error('Error checking if cell is found:', error, w);
                        return false;
                      }
                    });

                    return (
                      <div
                        key={cellKey}
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={`flex items-center justify-center font-mono cursor-pointer select-none transition-all ${config.highContrast
                          ? `border-2 font-extrabold text-lg sm:text-xl ${isFound
                            ? 'bg-green-600 text-white border-green-400 animate-pulse-once'
                            : isRevealed
                              ? 'bg-yellow-600 text-black border-yellow-400 animate-bounce'
                              : isSelected
                                ? 'bg-cyan-600 text-white border-cyan-400 scale-110 shadow-2xl'
                                : 'bg-gray-900 text-white border-gray-600 hover:bg-gray-800'
                          }`
                          : `border border-purple-500/30 font-bold text-base sm:text-lg ${isFound
                            ? 'bg-green-500/30 text-green-300 border-green-500/50 animate-pulse-once'
                            : isRevealed
                              ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50 animate-bounce'
                              : isSelected
                                ? 'bg-cyan-500 text-white scale-110 shadow-lg'
                                : 'bg-purple-900/30 text-white hover:bg-purple-700/50 active:scale-95'
                          }`
                          }`}
                        style={{
                          aspectRatio: '1/1',
                          touchAction: 'none'
                        }}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          handleTouchStart(rowIndex, colIndex);
                        }}
                      >
                        {letter}
                      </div>
                    );
                  })
                ))}
              </div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              💡 Swipe from first to last letter to find words!
            </p>
          </div>

          {/* Word List */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Find These Words:</h3>
            <div className="space-y-2">
              {puzzle.words.map(w => (
                <div
                  key={w.word}
                  className={`p-3 rounded-lg transition-all ${foundWords.has(w.word)
                    ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300'
                    : 'bg-purple-800/50 text-white border border-purple-500/30'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`font-bold text-lg ${foundWords.has(w.word) ? 'line-through' : ''}`}>
                      {w.word}
                    </div>
                    {foundWords.has(w.word) && (
                      <CheckCircle className="w-5 h-5 text-green-400 animate-bounce" />
                    )}
                  </div>
                  <div className="text-sm opacity-80 mt-1">{w.clue}</div>
                </div>
              ))}
            </div>

            {foundWords.size === puzzle.words.length && (
              <div className="mt-4 p-4 bg-green-500/20 border-2 border-green-500/50 rounded-xl text-center animate-bounce">
                <p className="text-green-400 font-bold text-lg">🎉 All words found!</p>
                <p className="text-sm text-gray-300 mt-1">Tap Finish to see your score!</p>
              </div>
            )}

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
