import React, { useState, useEffect } from 'react';
import type { HomeworkItem } from '../types';
import { generateProgressReport } from '../services/analyticsService';

interface ProgressReportsProps {
  items: HomeworkItem[];
}

const ProgressReports: React.FC<ProgressReportsProps> = ({ items }) => {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const focusStats = JSON.parse(localStorage.getItem('focusStats') || '{}');
    const sessionsCompleted = focusStats.sessionsCompleted || 0;

    generateProgressReport(items, sessionsCompleted)
      .then(setReport)
      .finally(() => setIsLoading(false));
  }, [items]);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="p-6 bg-background-surface border border-[var(--border-color)] rounded-2xl mb-8">
      <h3 className="text-2xl font-bold text-text-primary mb-4">Progress Report</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Assignments Completed</p>
            <p className="text-3xl font-bold text-[var(--primary-accent)]">{completedCount} / {totalCount}</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Focus Sessions</p>
            <p className="text-3xl font-bold text-[var(--secondary-accent)]">{JSON.parse(localStorage.getItem('focusStats') || '{}').sessionsCompleted || 0}</p>
        </div>
      </div>

      <h4 className="text-lg font-semibold text-text-primary mb-2">AI-Generated Summary</h4>
      {isLoading ? (
        <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
        </div>
      ) : (
        <p className="text-text-secondary whitespace-pre-wrap">{report}</p>
      )}
    </div>
  );
};

export default ProgressReports;
