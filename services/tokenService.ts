/**
 * Token Service
 * Manages Roblox-style token economy (earn/spend system)
 */

const TOKENS_KEY = 'vibetutor_tokens';
const TRANSACTIONS_KEY = 'vibetutor_transactions';
const USER_ID = 'default_user'; // For single-user app

export interface TokenBalance {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  updatedAt: number;
}

export interface TokenTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  relatedId?: string; // e.g., game session ID, schedule ID
  timestamp: number;
}

// LocalStorage helpers
function getBalance(): TokenBalance {
  try {
    const stored = localStorage.getItem(TOKENS_KEY);
    return stored ? JSON.parse(stored) : {
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error('Failed to load token balance:', error);
    return {
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      updatedAt: Date.now(),
    };
  }
}

function saveBalance(balance: TokenBalance): void {
  try {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(balance));
  } catch (error) {
    console.error('Failed to save token balance:', error);
  }
}

function getTransactions(): TokenTransaction[] {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
}

function saveTransactions(transactions: TokenTransaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions:', error);
  }
}

// Public API
export function getTokenBalance(): number {
  return getBalance().balance;
}

export function getTokenStats(): TokenBalance {
  return getBalance();
}

export function earnTokens(amount: number, reason: string, relatedId?: string): TokenTransaction {
  const balance = getBalance();
  const transactions = getTransactions();

  const transaction: TokenTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'earn',
    amount,
    reason,
    relatedId,
    timestamp: Date.now(),
  };

  balance.balance += amount;
  balance.totalEarned += amount;
  balance.updatedAt = Date.now();

  transactions.push(transaction);
  saveBalance(balance);
  saveTransactions(transactions);

  return transaction;
}

export function spendTokens(amount: number, reason: string, relatedId?: string): TokenTransaction | null {
  const balance = getBalance();

  if (balance.balance < amount) {
    console.warn('Insufficient tokens:', balance.balance, '<', amount);
    return null;
  }

  const transactions = getTransactions();

  const transaction: TokenTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'spend',
    amount,
    reason,
    relatedId,
    timestamp: Date.now(),
  };

  balance.balance -= amount;
  balance.totalSpent += amount;
  balance.updatedAt = Date.now();

  transactions.push(transaction);
  saveBalance(balance);
  saveTransactions(transactions);

  return transaction;
}

export function getRecentTransactions(limit = 10): TokenTransaction[] {
  const transactions = getTransactions();
  return transactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export function getTransactionsByType(type: 'earn' | 'spend', limit = 20): TokenTransaction[] {
  const transactions = getTransactions();
  return transactions
    .filter(t => t.type === type)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export function getTodayEarnings(): number {
  const transactions = getTransactions();
  const today = new Date().toDateString();

  return transactions
    .filter(t => {
      const txDate = new Date(t.timestamp).toDateString();
      return txDate === today && t.type === 'earn';
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTodaySpending(): number {
  const transactions = getTransactions();
  const today = new Date().toDateString();

  return transactions
    .filter(t => {
      const txDate = new Date(t.timestamp).toDateString();
      return txDate === today && t.type === 'spend';
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

// Predefined token rewards
export const TOKEN_REWARDS = {
  // Schedule completion
  MORNING_ROUTINE_STEP: 5,
  EVENING_ROUTINE_STEP: 5,
  MORNING_ROUTINE_COMPLETE: 20,
  EVENING_ROUTINE_COMPLETE: 20,

  // Brain games
  GAME_COMPLETE: 10,
  GAME_PERFECT: 25, // All words/puzzles solved
  GAME_SPEED_BONUS: 15, // Completed under time limit
  GAME_NO_HINTS: 20, // Completed without hints

  // Homework
  HOMEWORK_COMPLETE: 15,
  HOMEWORK_EARLY: 10, // Completed before due date

  // Streaks
  THREE_DAY_STREAK: 30,
  SEVEN_DAY_STREAK: 75,
  THIRTY_DAY_STREAK: 200,

  // Focus
  FOCUS_SESSION_25MIN: 15,
  FOCUS_SESSION_50MIN: 35,

  // Milestones
  FIRST_DAY_COMPLETE: 50,
  LEVEL_UP: 100,
} as const;

// Helper functions for common rewards
export function awardScheduleStep(stepName: string, scheduleId: string): TokenTransaction {
  return earnTokens(
    TOKEN_REWARDS.MORNING_ROUTINE_STEP,
    `Completed routine step: ${stepName}`,
    scheduleId
  );
}

export function awardScheduleComplete(type: 'morning' | 'evening', scheduleId: string): TokenTransaction {
  const amount = type === 'morning'
    ? TOKEN_REWARDS.MORNING_ROUTINE_COMPLETE
    : TOKEN_REWARDS.EVENING_ROUTINE_COMPLETE;

  return earnTokens(
    amount,
    `Completed ${type} routine!`,
    scheduleId
  );
}

export function awardGameComplete(
  gameType: string,
  score: number,
  perfect: boolean,
  noHints: boolean,
  gameId: string
): TokenTransaction {
  let amount = TOKEN_REWARDS.GAME_COMPLETE;
  const bonuses: string[] = [];

  if (perfect) {
    amount += TOKEN_REWARDS.GAME_PERFECT;
    bonuses.push('perfect score');
  }

  if (noHints) {
    amount += TOKEN_REWARDS.GAME_NO_HINTS;
    bonuses.push('no hints');
  }

  const bonusText = bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '';
  return earnTokens(
    amount,
    `Completed ${gameType}${bonusText}`,
    gameId
  );
}

export function awardFocusSession(minutes: number, sessionId: string): TokenTransaction {
  const amount = minutes >= 50
    ? TOKEN_REWARDS.FOCUS_SESSION_50MIN
    : TOKEN_REWARDS.FOCUS_SESSION_25MIN;

  return earnTokens(
    amount,
    `Completed ${minutes}-minute focus session`,
    sessionId
  );
}

// Cleanup old transactions
export function cleanupOldTransactions(daysToKeep = 90): void {
  const transactions = getTransactions();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const cutoffTime = cutoffDate.getTime();

  const filtered = transactions.filter(t => t.timestamp >= cutoffTime);
  saveTransactions(filtered);
}

// Auto-cleanup on init
cleanupOldTransactions(90);

