import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Zap } from 'lucide-react';
import { getRandomWords } from '../services/wordBanks';
import { generateMemoryCards, calculateMemoryScore } from '../services/puzzleGenerator';
import type { MemoryCard } from '../services/puzzleGenerator';

interface MemoryMatchGameProps {
  subject: string;
  onComplete: (score: number, stars: number, timeSpent: number) => void;
  onBack: () => void;
}

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ subject, onComplete, onBack }) => {
  const [startTime] = useState(Date.now());
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [canFlip, setCanFlip] = useState(true);

  useEffect(() => {
    const words = getRandomWords(subject, 6);
    const memoryCards = generateMemoryCards(words);
    setCards(memoryCards);
  }, [subject]);

  const handleCardClick = (cardId: string) => {
    if (!canFlip || flipped.includes(cardId) || matched.has(cardId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setCanFlip(false);

      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        // Match!
        setTimeout(() => {
          setMatched(prev => new Set([...prev, card1.id, card2.id]));
          setFlipped([]);
          setCanFlip(true);

          // Check if game complete
          if (matched.size + 2 === cards.length) {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            const result = calculateMemoryScore(cards.length / 2, moves + 1, timeSpent);
            setTimeout(() => onComplete(result.score, result.stars, timeSpent), 500);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card p-4 mb-6 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-yellow-400" />
              <span className="text-white font-medium">{moves} moves</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-cyan-400" />
              <span className="text-white font-medium">{Math.floor((Date.now() - startTime) / 1000)}s</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-3xl font-bold text-center mb-6 neon-text-primary">{subject} Memory Match</h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {cards.map(card => {
              const isFlipped = flipped.includes(card.id) || matched.has(card.id);
              const isMatched = matched.has(card.id);

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square cursor-pointer transition-all duration-300 transform ${
                    isFlipped ? 'rotate-y-180' : ''
                  } ${!canFlip && !isFlipped ? 'opacity-50' : ''}`}
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className={`relative w-full h-full rounded-lg ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s',
                    }}
                  >
                    {/* Back of card */}
                    <div
                      className={`absolute w-full h-full rounded-lg flex items-center justify-center ${
                        isMatched ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'
                      } ${isFlipped ? 'hidden' : 'block'}`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="text-4xl">?</div>
                    </div>

                    {/* Front of card */}
                    <div
                      className={`absolute w-full h-full rounded-lg flex items-center justify-center p-2 ${
                        isMatched ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-white'
                      } ${isFlipped ? 'block' : 'hidden'}`}
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className={`text-center text-xs sm:text-sm font-bold ${isMatched ? 'text-white' : 'text-gray-800'}`}>
                        {card.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-white/80 mt-6">Match words with their definitions!</p>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchGame;
