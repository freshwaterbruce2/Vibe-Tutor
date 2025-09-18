import React, { useState } from 'react';
import type { HomeworkItem } from '../types';
import PinLock from './PinLock';
import ProgressReports from './ProgressReports';
import RewardSettings from './RewardSettings';

interface ParentDashboardProps {
  items: HomeworkItem[];
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ items }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

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
        <RewardSettings />
      </div>
    </div>
  );
};

export default ParentDashboard;
