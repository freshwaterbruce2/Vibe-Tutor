import React from 'react';

const RewardSettings: React.FC = () => {
  return (
    <div className="p-6 bg-background-surface border border-[var(--border-color)] rounded-2xl">
      <h3 className="text-2xl font-bold text-text-primary mb-4">Reward System</h3>
      <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl">
        <p className="text-slate-400">The reward settings feature is coming soon!</p>
        <p className="text-slate-500 text-sm mt-2">You'll be able to set up custom rewards for achievements.</p>
      </div>
    </div>
  );
};

export default RewardSettings;
