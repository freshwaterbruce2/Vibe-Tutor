import React, { useState, useEffect, useRef } from 'react';
import type { HomeworkItem, Reward, ClaimedReward } from '../types';
import PinLock from './PinLock';
import ProgressReports from './ProgressReports';
import RewardSettings from './RewardSettings';
import DataManagement from './DataManagement';

interface ParentDashboardProps {
  items: HomeworkItem[];
  rewards: Reward[];
  claimedRewards: ClaimedReward[];
  onUpdateRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
  onApproval: (claimedRewardId: string, isApproved: boolean) => void;
}

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const ParentDashboard: React.FC<ParentDashboardProps> = ({ items, rewards, claimedRewards, onUpdateRewards, onApproval }) => {
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
    return <PinLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary">Parent Dashboard</h1>
          <p className="text-text-secondary mt-1">An overview of your child's progress.</p>
        </div>
        <button onClick={() => setIsUnlocked(false)} className="px-5 py-3 font-semibold text-background-main bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
            Lock
        </button>
      </header>

      <div className="space-y-8">
        <ProgressReports items={items} />
        <RewardSettings rewards={rewards} onUpdateRewards={onUpdateRewards} claimedRewards={claimedRewards} onApproval={onApproval} />
        <DataManagement />
      </div>
    </div>
  );
};

export default ParentDashboard;