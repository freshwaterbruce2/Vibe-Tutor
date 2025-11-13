import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, TrendingDown, Award, Calendar, X } from 'lucide-react';
import {
  getTokenBalance,
  getTokenStats,
  getRecentTransactions,
  getTodayEarnings,
  getTodaySpending,
  type TokenBalance,
  type TokenTransaction,
} from '../services/tokenService';

interface TokenWalletProps {
  onClose?: () => void;
  compact?: boolean; // Show minimal view
}

const TokenWallet: React.FC<TokenWalletProps> = ({ onClose, compact = false }) => {
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState<TokenBalance | null>(null);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todaySpending, setTodaySpending] = useState(0);
  const [filter, setFilter] = useState<'all' | 'earn' | 'spend'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBalance(getTokenBalance());
    setStats(getTokenStats());
    setTransactions(getRecentTransactions(20));
    setTodayEarnings(getTodayEarnings());
    setTodaySpending(getTodaySpending());
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
        <Coins className="w-5 h-5 text-white" />
        <span className="font-bold text-white text-lg">{balance.toLocaleString()}</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-pink-900/95 backdrop-blur-sm p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Token Wallet</h2>
              <p className="text-sm text-white/70">Your reward balance</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Balance Card */}
          <div className="glass-card p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30">
            <div className="text-center">
              <p className="text-sm text-white/70 mb-2">Current Balance</p>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4">
                {balance.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-1 text-yellow-400">
                <Coins className="w-5 h-5" />
                <span className="text-sm font-semibold">Tokens</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Today's Earnings */}
            <div className="glass-card p-4 bg-green-600/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white/70">Today Earned</span>
              </div>
              <div className="text-2xl font-bold text-green-400">+{todayEarnings}</div>
            </div>

            {/* Today's Spending */}
            <div className="glass-card p-4 bg-red-600/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <span className="text-sm text-white/70">Today Spent</span>
              </div>
              <div className="text-2xl font-bold text-red-400">-{todaySpending}</div>
            </div>

            {/* Total Earned */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-white/70">Total Earned</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats?.totalEarned.toLocaleString() || 0}</div>
            </div>

            {/* Total Spent */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-white/70">Total Spent</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats?.totalSpent.toLocaleString() || 0}</div>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    filter === 'all'
                      ? 'bg-purple-600'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('earn')}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    filter === 'earn'
                      ? 'bg-green-600'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Earned
                </button>
                <button
                  onClick={() => setFilter('spend')}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    filter === 'spend'
                      ? 'bg-red-600'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Spent
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  No transactions yet. Complete tasks to earn tokens!
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`glass-card p-4 flex items-start justify-between ${
                      transaction.type === 'earn'
                        ? 'bg-green-600/5 border border-green-500/10'
                        : 'bg-red-600/5 border border-red-500/10'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {transaction.type === 'earn' ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className="font-semibold text-white">{transaction.reason}</span>
                      </div>
                      <div className="text-xs text-white/60">
                        {formatDate(transaction.timestamp)} at {formatTime(transaction.timestamp)}
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        transaction.type === 'earn' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenWallet;

