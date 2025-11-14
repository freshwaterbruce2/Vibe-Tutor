import React, { useState, useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import type { HomeworkItem, Reward, ClaimedReward, View } from '../types';
import SecurePinLock from './SecurePinLock';
import ProgressReports from './ProgressReports';
import RewardSettings from './RewardSettings';
import ScreenTimeSettings from './ScreenTimeSettings';
import DataManagement from './DataManagement';

interface ParentDashboardProps {
  items: HomeworkItem[];
  rewards: Reward[];
  claimedRewards: ClaimedReward[];
  onUpdateRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
  onApproval: (claimedRewardId: string, isApproved: boolean) => void;
  onNavigate?: (view: View) => void;
}

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const ParentDashboard: React.FC<ParentDashboardProps> = ({ items, rewards, claimedRewards, onUpdateRewards, onApproval, onNavigate }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetInactivityTimer = () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      activityTimeoutRef.current = setTimeout(() => {
        setIsUnlocked(false);
      }, INACTIVITY_TIMEOUT);
    };

    if (isUnlocked) {
      const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
      events.forEach(event => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer();

      return () => {
        events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        if (activityTimeoutRef.current) {
          clearTimeout(activityTimeoutRef.current);
        }
      };
    }
  }, [isUnlocked]);

  if (!isUnlocked) {
    return <SecurePinLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] neon-text-primary glow-on-hover">Parent Dashboard</h1>
          <p className="text-text-secondary mt-1">An overview of your child's progress.</p>
        </div>
        <div className="flex gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('parent-rules')}
              className="glass-button px-5 py-3 font-semibold flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              <span>Manage Rules</span>
            </button>
          )}
          <button onClick={() => setIsUnlocked(false)} className="px-5 py-3 font-semibold text-background-main bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
            Lock
          </button>
        </div>
      </header>

      <div className="space-y-8">
        <ProgressReports items={items} />
        <ScreenTimeSettings />
        <RewardSettings rewards={rewards} onUpdateRewards={onUpdateRewards} claimedRewards={claimedRewards} onApproval={onApproval} />
        <DataManagement />
      </div>
    </div>
  );
};

export default ParentDashboard;