import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, RotateCcw } from 'lucide-react';
import * as SudokuModule from 'sudoku-umd';

interface SudokuGameProps {
  onComplete: (score: number, stars: number, timeSpent: number) => void;
  onBack: () => void;
}

const SudokuGame: React.FC<SudokuGameProps> = ({ onComplete, onBack }) => {
  const [startTime] = useState(Date.now());
  const [puzzle, setPuzzle] = useState<(number | null)[]>([]);
  const [solution, setSolution] = useState<(number | null)[]>([]);
  const [userGrid, setUserGrid] = useState<(number | null)[]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Access sudoku functions safely
      const makepuzzle = (SudokuModule as any).makepuzzle || (SudokuModule as any).default?.makepuzzle;
      const solvepuzzle = (SudokuModule as any).solvepuzzle || (SudokuModule as any).default?.solvepuzzle;
      
      if (!makepuzzle || !solvepuzzle) {
        console.error('Sudoku functions not available');
        setIsLoading(false);
        return;
      }
      
      const newPuzzle = makepuzzle();
      const newSolution = solvepuzzle(newPuzzle);
      setPuzzle(newPuzzle);
      setSolution(newSolution);
      setUserGrid([...newPuzzle]);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to generate Sudoku:', error);
      setIsLoading(false);
    }
  }, []);

  const handleCellClick = (index: number) => {
    if (puzzle[index] !== null) return; // Can't edit given numbers
    setSelectedCell(index);
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell === null || puzzle[selectedCell] !== null) return;
    const newGrid = [...userGrid];
    newGrid[selectedCell] = num;
    setUserGrid(newGrid);

    // Check if puzzle is complete
    if (checkComplete(newGrid)) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const score = Math.max(50, 100 - Math.floor(timeSpent / 30));
      const stars = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 40 ? 2 : 1;
      setTimeout(() => onComplete(score, stars, timeSpent), 500);
    }
  };

  const handleClear = () => {
    if (selectedCell === null || puzzle[selectedCell] !== null) return;
    const newGrid = [...userGrid];
    newGrid[selectedCell] = null;
    setUserGrid(newGrid);
  };

  const checkComplete = (grid: (number | null)[]) => {
    return grid.every((cell, i) => cell !== null && cell === solution[i]);
  };

  const handleReset = () => {
    setUserGrid([...puzzle]);
    setSelectedCell(null);
  };

  if (isLoading || puzzle.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Generating Sudoku puzzle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6 pb-36 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-4 mb-6 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-4">
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
              <RotateCcw size={20} />
              Reset
            </button>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-cyan-400" />
              <span className="text-white font-medium">{Math.floor((Date.now() - startTime) / 1000)}s</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-3xl font-bold text-center mb-6 neon-text-primary">Sudoku</h2>

          {/* Sudoku Grid */}
          <div className="inline-block mx-auto bg-white p-2 rounded-lg">
            <div className="grid grid-cols-9 gap-0">
              {userGrid.map((cell, index) => {
                const row = Math.floor(index / 9);
                const col = index % 9;
                const isGiven = puzzle[index] !== null;
                const isSelected = selectedCell === index;
                const showThickBorder = {
                  right: col === 2 || col === 5,
                  bottom: row === 2 || row === 5,
                };

                return (
                  <div
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-gray-400 cursor-pointer transition-colors ${
                      showThickBorder.right ? 'border-r-2 border-r-black' : ''
                    } ${showThickBorder.bottom ? 'border-b-2 border-b-black' : ''} ${
                      isGiven ? 'bg-gray-200 font-bold' : 'bg-white hover:bg-blue-50'
                    } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {cell !== null && <span className={isGiven ? 'text-black' : 'text-blue-600'}>{cell + 1}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Number Pad */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num - 1)}
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-white text-xl transition-all transform hover:scale-110"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-white transition-all transform hover:scale-110"
            >
              X
            </button>
          </div>

          <p className="text-center text-white/80 mt-6">Fill the grid so each row, column, and 3x3 box contains 1-9</p>
        </div>
      </div>
    </div>
  );
};

export default SudokuGame;
