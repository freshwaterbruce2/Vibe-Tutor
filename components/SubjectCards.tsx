import React, { useState, useEffect } from 'react';
import type { SubjectCard, SubjectType, CardLevel } from '../types';
import { BookOpen, Atom, FileText, Clock, Sparkles, Trophy, Zap } from 'lucide-react';

interface SubjectCardsProps {
  onCardLevelUp?: (subject: SubjectType, newLevel: CardLevel) => void;
}

const CARD_CONFIG = {
  Math: { icon: Zap, color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-500/10' },
  Science: { icon: Atom, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' },
  English: { icon: BookOpen, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' },
  History: { icon: Clock, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' }
};

const XP_TO_LEVEL_UP = {
  Basic: 30,    // Complete 3 homework (10 XP each)
  Advanced: 100  // Complete 10 more homework
};

const LEVEL_DISPLAY = {
  Basic: '⭐',
  Advanced: '⭐⭐',
  Master: '⭐⭐⭐'
};

const initializeCards = (): SubjectCard[] => {
  const saved = localStorage.getItem('subject-cards');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return createDefaultCards();
    }
  }
  return createDefaultCards();
};

const createDefaultCards = (): SubjectCard[] => {
  const subjects: SubjectType[] = ['Math', 'Science', 'English', 'History'];
  return subjects.map(subject => ({
    id: `card_${subject.toLowerCase()}`,
    subject,
    level: 'Basic',
    xp: 0,
    xpToNextLevel: XP_TO_LEVEL_UP.Basic,
    homeworkCompleted: 0,
    shiny: false,
    unlockedAt: Date.now()
  }));
};

const SubjectCards: React.FC<SubjectCardsProps> = ({ onCardLevelUp }) => {
  const [cards, setCards] = useState<SubjectCard[]>(initializeCards);
  const [selectedCard, setSelectedCard] = useState<SubjectCard | null>(null);
  const [showEvolution, setShowEvolution] = useState(false);

  useEffect(() => {
    localStorage.setItem('subject-cards', JSON.stringify(cards));
  }, [cards]);

  const getNextLevel = (currentLevel: CardLevel): CardLevel | null => {
    if (currentLevel === 'Basic') return 'Advanced';
    if (currentLevel === 'Advanced') return 'Master';
    return null;
  };

  const addXP = (subject: SubjectType, xpAmount: number, isShiny: boolean = false) => {
    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.subject !== subject) return card;

        let newXP = card.xp + xpAmount;
        let newLevel = card.level;
        let evolved = false;

        // Check if level up
        if (newXP >= card.xpToNextLevel) {
          const nextLevel = getNextLevel(card.level);
          if (nextLevel) {
            newLevel = nextLevel;
            newXP = newXP - card.xpToNextLevel;
            evolved = true;
          } else {
            newXP = card.xpToNextLevel; // Max level
          }
        }

        const updatedCard: SubjectCard = {
          ...card,
          xp: newXP,
          level: newLevel,
          xpToNextLevel: newLevel === 'Basic' ? XP_TO_LEVEL_UP.Basic :
                         newLevel === 'Advanced' ? XP_TO_LEVEL_UP.Advanced : 0,
          homeworkCompleted: card.homeworkCompleted + 1,
          shiny: isShiny ? true : card.shiny,
          lastEvolved: evolved ? Date.now() : card.lastEvolved
        };

        if (evolved) {
          setShowEvolution(true);
          setSelectedCard(updatedCard);
          onCardLevelUp?.(subject, newLevel);
          setTimeout(() => setShowEvolution(false), 3000);
        }

        return updatedCard;
      });
    });
  };

  // Expose addXP function globally for homework integration
  useEffect(() => {
    (window as any).addSubjectCardXP = addXP;
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 pb-36 md:pb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy size={48} className="text-yellow-500" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
            Subject Cards
          </h1>
        </div>
        <p className="text-text-secondary text-lg">
          Complete homework to level up your cards!
        </p>
      </div>

      {/* Evolution Animation */}
      {showEvolution && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="text-center space-y-6 animate-[scaleIn_0.5s_ease-out]">
            <Sparkles size={64} className="mx-auto text-yellow-500 animate-pulse" />
            <h2 className="text-5xl font-bold text-white">
              Evolution!
            </h2>
            <p className="text-2xl text-yellow-400">
              {selectedCard.subject} evolved to {selectedCard.level}!
            </p>
            <div className="text-6xl">
              {LEVEL_DISPLAY[selectedCard.level]}
            </div>
          </div>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {cards.map(card => {
          const config = CARD_CONFIG[card.subject];
          const Icon = config.icon;
          const progressPercentage = (card.xp / card.xpToNextLevel) * 100;
          const isMaxLevel = card.level === 'Master';

          return (
            <button
              key={card.id}
              onClick={() => setSelectedCard(selectedCard?.id === card.id ? null : card)}
              className={`relative group glass-card p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedCard?.id === card.id ? 'border-yellow-500 shadow-yellow-500/50' : 'border-[var(--glass-border)]'
              } ${card.shiny ? 'animate-pulse bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : config.bgColor}`}
            >
              {/* Shiny Indicator */}
              {card.shiny && (
                <div className="absolute top-2 right-2">
                  <Sparkles size={24} className="text-yellow-500 animate-spin" />
                </div>
              )}

              {/* Card Level */}
              <div className="text-2xl mb-2 text-center">
                {LEVEL_DISPLAY[card.level]}
              </div>

              {/* Subject Icon */}
              <div className={`flex justify-center mb-4`}>
                <div className={`p-4 rounded-full bg-gradient-to-br ${config.color}`}>
                  <Icon size={48} className="text-white" />
                </div>
              </div>

              {/* Subject Name */}
              <h3 className={`text-2xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}>
                {card.subject}
              </h3>

              {/* Level Name */}
              <p className="text-center text-sm text-text-secondary mb-4">
                {card.level} Level
              </p>

              {/* XP Progress */}
              {!isMaxLevel && (
                <>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-text-secondary mb-1">
                      <span>XP</span>
                      <span>{card.xp} / {card.xpToNextLevel}</span>
                    </div>
                    <div className="h-3 bg-surface-lighter rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Max Level Indicator */}
              {isMaxLevel && (
                <div className="text-center py-2">
                  <p className="text-yellow-500 font-bold">MAX LEVEL</p>
                </div>
              )}

              {/* Homework Completed */}
              <div className="text-center text-sm text-text-muted mt-4">
                {card.homeworkCompleted} homework completed
              </div>

              {/* Next Evolution Preview */}
              {!isMaxLevel && selectedCard?.id === card.id && (
                <div className="mt-4 p-3 glass-card rounded-lg border border-[var(--glass-border)]">
                  <p className="text-xs text-text-secondary mb-1">Next Evolution:</p>
                  <p className="text-sm font-bold">
                    {getNextLevel(card.level)} {card.subject}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {card.xpToNextLevel - card.xp} XP needed
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12 max-w-4xl mx-auto glass-card p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap size={24} className="text-yellow-500" />
          How to Level Up Your Cards
        </h3>
        <ul className="space-y-2 text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Complete homework to earn XP for that subject</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Basic → Advanced: Complete 3 homework assignments</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Advanced → Master: Complete 10 more assignments</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Get a perfect score to unlock a Shiny card!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Higher level cards earn bonus points on homework</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SubjectCards;
