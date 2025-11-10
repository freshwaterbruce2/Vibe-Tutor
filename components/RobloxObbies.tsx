import React, { useState, useEffect } from 'react';
import type { ObbyType, ObbyChallenge, ObbySession } from '../types';
import { Zap, Atom, Book, Clock, CheckCircle, XCircle, Trophy, Play, RotateCcw } from 'lucide-react';

interface RobloxObbiesProps {
  onObbyComplete?: (type: ObbyType, points: number) => void;
}

const OBBY_CONFIG = {
  math: {
    name: 'Math Parkour',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    description: 'Jump through number challenges!'
  },
  science: {
    name: 'Science Lab Escape',
    icon: Atom,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    description: 'Unlock doors with science facts!'
  },
  word: {
    name: 'Word Tower',
    icon: Book,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    description: 'Climb higher with vocabulary!'
  },
  history: {
    name: 'History Timeline Run',
    icon: Clock,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    description: 'Race through time!'
  }
};

// Generate daily challenges (same each day using date as seed)
const generateDailyChallenges = (type: ObbyType): ObbyChallenge[] => {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);

  const mathChallenges: ObbyChallenge[] = [
    { id: '1', type: 'math', question: 'What is 15 + 27?', options: ['40', '42', '45', '48'], correctAnswer: 1, difficulty: 'easy', pointsReward: 3 },
    { id: '2', type: 'math', question: 'What is 8 × 7?', options: ['54', '56', '64', '72'], correctAnswer: 1, difficulty: 'easy', pointsReward: 3 },
    { id: '3', type: 'math', question: 'What is 144 ÷ 12?', options: ['10', '11', '12', '14'], correctAnswer: 2, difficulty: 'medium', pointsReward: 4 },
    { id: '4', type: 'math', question: 'What is 25% of 80?', options: ['15', '20', '25', '30'], correctAnswer: 1, difficulty: 'medium', pointsReward: 4 },
    { id: '5', type: 'math', question: 'If x + 5 = 12, what is x?', options: ['5', '6', '7', '8'], correctAnswer: 2, difficulty: 'hard', pointsReward: 5 }
  ];

  const scienceChallenges: ObbyChallenge[] = [
    { id: '1', type: 'science', question: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'HO'], correctAnswer: 1, difficulty: 'easy', pointsReward: 3 },
    { id: '2', type: 'science', question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 1, difficulty: 'easy', pointsReward: 3 },
    { id: '3', type: 'science', question: 'What is the center of an atom called?', options: ['Electron', 'Proton', 'Nucleus', 'Neutron'], correctAnswer: 2, difficulty: 'medium', pointsReward: 4 },
    { id: '4', type: 'science', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], correctAnswer: 1, difficulty: 'medium', pointsReward: 4 },
    { id: '5', type: 'science', question: 'What gas do plants produce during photosynthesis?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correctAnswer: 2, difficulty: 'easy', pointsReward: 3 }
  ];

  const wordChallenges: ObbyChallenge[] = [
    { id: '1', type: 'word', question: 'Which word means "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 1, difficulty: 'easy', pointsReward: 3 },
    { id: '2', type: 'word', question: 'What is the opposite of "light"?', options: ['Bright', 'Heavy', 'Dark', 'Soft'], correctAnswer: 2, difficulty: 'easy', pointsReward: 3 },
    { id: '3', type: 'word', question: 'Which word is a noun?', options: ['Run', 'Quickly', 'Beautiful', 'Dog'], correctAnswer: 3, difficulty: 'medium', pointsReward: 4 },
    { id: '4', type: 'word', question: 'What does "benevolent" mean?', options: ['Mean', 'Kind', 'Lazy', 'Smart'], correctAnswer: 1, difficulty: 'hard', pointsReward: 5 },
    { id: '5', type: 'word', question: 'Which is spelled correctly?', options: ['Recieve', 'Receive', 'Receeve', 'Receve'], correctAnswer: 1, difficulty: 'medium', pointsReward: 4 }
  ];

  const historyChallenges: ObbyChallenge[] = [
    { id: '1', type: 'history', question: 'When did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, difficulty: 'easy', pointsReward: 3 },
    { id: '2', type: 'history', question: 'Who was the first U.S. President?', options: ['Lincoln', 'Jefferson', 'Washington', 'Adams'], correctAnswer: 2, difficulty: 'easy', pointsReward: 3 },
    { id: '3', type: 'history', question: 'When was the Declaration of Independence signed?', options: ['1774', '1775', '1776', '1777'], correctAnswer: 2, difficulty: 'medium', pointsReward: 4 },
    { id: '4', type: 'history', question: 'What year did the Titanic sink?', options: ['1910', '1911', '1912', '1913'], correctAnswer: 2, difficulty: 'medium', pointsReward: 4 },
    { id: '5', type: 'history', question: 'Who invented the light bulb?', options: ['Tesla', 'Edison', 'Bell', 'Franklin'], correctAnswer: 1, difficulty: 'easy', pointsReward: 3 }
  ];

  const allChallenges = {
    math: mathChallenges,
    science: scienceChallenges,
    word: wordChallenges,
    history: historyChallenges
  };

  // Rotate questions based on day seed
  const challenges = allChallenges[type];
  const rotated = [...challenges.slice(seed % challenges.length), ...challenges.slice(0, seed % challenges.length)];
  return rotated.slice(0, 5);
};

const RobloxObbies: React.FC<RobloxObbiesProps> = ({ onObbyComplete }) => {
  const [sessions, setSessions] = useState<Record<ObbyType, ObbySession>>(() => {
    const saved = localStorage.getItem('obby-sessions');
    const today = new Date().toISOString().split('T')[0];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset completedToday if it's a new day
        const savedDate = localStorage.getItem('obby-last-date');
        if (savedDate !== today) {
          Object.keys(parsed).forEach((key) => {
            parsed[key].completedToday = false;
          });
          localStorage.setItem('obby-last-date', today);
        }
        return parsed;
      } catch {
        // Fall through to create new sessions
      }
    }

    // Create fresh sessions
    const types: ObbyType[] = ['math', 'science', 'word', 'history'];
    const newSessions: Record<ObbyType, ObbySession> = {} as any;

    types.forEach(type => {
      newSessions[type] = {
        id: `obby_${type}_${Date.now()}`,
        type,
        challenges: generateDailyChallenges(type),
        currentIndex: 0,
        score: 0,
        timeStarted: 0,
        completed: false,
        completedToday: false
      };
    });

    localStorage.setItem('obby-last-date', today);
    return newSessions;
  });

  const [activeObby, setActiveObby] = useState<ObbyType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    localStorage.setItem('obby-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const startObby = (type: ObbyType) => {
    setSessions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        currentIndex: 0,
        score: 0,
        timeStarted: Date.now(),
        completed: false
      }
    }));
    setActiveObby(type);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !activeObby) return;

    const session = sessions[activeObby];
    const currentChallenge = session.challenges[session.currentIndex];
    const correct = selectedAnswer === currentChallenge.correctAnswer;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setSessions(prev => ({
        ...prev,
        [activeObby]: {
          ...prev[activeObby],
          score: prev[activeObby].score + currentChallenge.pointsReward
        }
      }));
    }
  };

  const nextChallenge = () => {
    if (!activeObby) return;

    const session = sessions[activeObby];
    const nextIndex = session.currentIndex + 1;

    if (nextIndex >= session.challenges.length) {
      // Obby completed!
      setSessions(prev => ({
        ...prev,
        [activeObby]: {
          ...prev[activeObby],
          completed: true,
          completedToday: true
        }
      }));
      onObbyComplete?.(activeObby, session.score);
      setActiveObby(null);
    } else {
      setSessions(prev => ({
        ...prev,
        [activeObby]: {
          ...prev[activeObby],
          currentIndex: nextIndex
        }
      }));
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetObby = (type: ObbyType) => {
    setSessions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        challenges: generateDailyChallenges(type),
        currentIndex: 0,
        score: 0,
        completed: false,
        completedToday: false
      }
    }));
  };

  // Obby Selection Screen
  if (!activeObby) {
    return (
      <div className="min-h-screen p-4 md:p-8 pb-36 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy size={48} className="text-cyan-500" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
              Daily Obbies
            </h1>
          </div>
          <p className="text-text-secondary text-lg">
            Complete all 4 challenges to earn bonus points!
          </p>
        </div>

        {/* Obby Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {(Object.keys(OBBY_CONFIG) as ObbyType[]).map(type => {
            const config = OBBY_CONFIG[type];
            const Icon = config.icon;
            const session = sessions[type];
            const completed = session.completedToday;

            return (
              <button
                key={type}
                onClick={() => completed ? null : startObby(type)}
                disabled={completed}
                className={`relative glass-card p-6 rounded-2xl border-2 transition-all duration-300 ${
                  completed
                    ? 'border-green-500 opacity-75 cursor-not-allowed'
                    : 'border-[var(--glass-border)] hover:scale-105 hover:shadow-2xl'
                } ${config.bgColor}`}
              >
                {/* Completion Check */}
                {completed && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${config.color}`}>
                    <Icon size={48} className="text-white" />
                  </div>
                </div>

                {/* Name */}
                <h3 className={`text-2xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}>
                  {config.name}
                </h3>

                {/* Description */}
                <p className="text-center text-sm text-text-secondary mb-4">
                  {config.description}
                </p>

                {/* Status */}
                {completed ? (
                  <div className="text-center">
                    <p className="text-green-500 font-bold text-lg">{session.score} Points</p>
                    <p className="text-xs text-text-muted mt-1">Completed!</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetObby(type);
                      }}
                      className="mt-3 px-4 py-2 text-sm bg-surface-lighter hover:bg-surface-light rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw size={16} />
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-text-secondary">
                    <Play size={20} />
                    <span>Start Challenge</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Obby Screen
  const session = sessions[activeObby];
  const currentChallenge = session.challenges[session.currentIndex];
  const config = OBBY_CONFIG[activeObby];
  const Icon = config.icon;
  const progress = ((session.currentIndex + 1) / session.challenges.length) * 100;

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 rounded-full bg-gradient-to-br ${config.color}`}>
              <Icon size={40} className="text-white" />
            </div>
            <h2 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}>
              {config.name}
            </h2>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>Question {session.currentIndex + 1} of {session.challenges.length}</span>
            <span>Score: {session.score} points</span>
          </div>
          <div className="h-3 bg-surface-lighter rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card p-8 rounded-2xl border-2 border-[var(--glass-border)] mb-6">
          <h3 className="text-2xl font-bold text-center mb-8 text-text-primary">
            {currentChallenge.question}
          </h3>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentChallenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(index)}
                disabled={showResult}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-lg font-medium ${
                  showResult
                    ? index === currentChallenge.correctAnswer
                      ? 'border-green-500 bg-green-500/20 text-green-500'
                      : index === selectedAnswer
                      ? 'border-red-500 bg-red-500/20 text-red-500'
                      : 'border-[var(--glass-border)] bg-[var(--glass-surface)] opacity-50'
                    : selectedAnswer === index
                    ? `border-[var(--primary-accent)] bg-[var(--primary-accent)]/20 text-[var(--primary-accent)]`
                    : 'border-[var(--glass-border)] bg-[var(--glass-surface)] hover:border-[var(--border-hover)] hover:scale-105'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Result */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-xl border-2 flex items-center gap-3 ${
              isCorrect
                ? 'border-green-500 bg-green-500/20'
                : 'border-red-500 bg-red-500/20'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle size={32} className="text-green-500" />
                  <div>
                    <p className="text-green-500 font-bold text-lg">Correct!</p>
                    <p className="text-sm text-text-secondary">+{currentChallenge.pointsReward} points</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={32} className="text-red-500" />
                  <div>
                    <p className="text-red-500 font-bold text-lg">Not quite!</p>
                    <p className="text-sm text-text-secondary">The correct answer was: {currentChallenge.options[currentChallenge.correctAnswer]}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setActiveObby(null)}
            className="px-6 py-3 bg-surface-lighter hover:bg-surface-light rounded-xl transition-colors text-text-primary"
          >
            Exit Obby
          </button>
          {!showResult ? (
            <button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${
                selectedAnswer !== null
                  ? `bg-gradient-to-r ${config.color} hover:scale-105`
                  : 'bg-surface-lighter text-text-muted cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={nextChallenge}
              className={`px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${config.color} hover:scale-105 transition-all`}
            >
              {session.currentIndex + 1 >= session.challenges.length ? 'Finish Obby' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RobloxObbies;
