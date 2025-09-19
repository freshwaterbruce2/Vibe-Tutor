import React, { useState, useEffect, useMemo } from 'react';
import type { HomeworkItem } from '../types';
import { generateProgressReport } from '../services/analyticsService';

interface ProgressReportsProps {
  items: HomeworkItem[];
}

const ProgressReports: React.FC<ProgressReportsProps> = ({ items }) => {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const stats = useMemo(() => {
    const completedCount = items.filter(item => item.completed).length;
    const totalCount = items.length;
    const points = Number(localStorage.getItem('studentPoints') || '0');
    const focusSessions = JSON.parse(localStorage.getItem('focusStats') || '{}').sessionsCompleted || 0;

    const subjectStats = items.reduce((acc, item) => {
        if (!acc[item.subject]) {
            acc[item.subject] = { total: 0, completed: 0 };
        }
        acc[item.subject].total++;
        if (item.completed) {
            acc[item.subject].completed++;
        }
        return acc;
    }, {} as Record<string, { total: number, completed: number }>);

    return { completedCount, totalCount, points, focusSessions, subjectStats };
  }, [items]);

  useEffect(() => {
    setIsLoading(true);
    generateProgressReport(items, stats.focusSessions, stats.points, stats.subjectStats)
      .then(setReport)
      .finally(() => setIsLoading(false));
  }, [items, stats]);

  return (
    <div className="p-6 bg-background-surface border border-[var(--border-color)] rounded-2xl">
      <h3 className="text-2xl font-bold text-text-primary mb-4">Progress Report</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Assignments Completed</p>
            <p className="text-3xl font-bold text-[var(--primary-accent)]">{stats.completedCount} / {stats.totalCount}</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Focus Sessions</p>
            <p className="text-3xl font-bold text-[var(--secondary-accent)]">{stats.focusSessions}</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Total Points Earned</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.points}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <h4 className="text-lg font-semibold text-text-primary mb-2">Subject Breakdown</h4>
            <div className="space-y-3">
                {Object.entries(stats.subjectStats).map(([subject, data]) => (
                    <div key={subject}>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-slate-300">{subject}</span>
                            <span className="text-sm font-medium text-slate-400">{data.completed} / {data.total}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                            <div className="bg-[var(--primary-accent)] h-2.5 rounded-full" style={{width: `${(data.completed / data.total) * 100}%`}}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h4 className="text-lg font-semibold text-text-primary mb-2">AI-Generated Summary</h4>
            {isLoading ? (
                <div className="space-y-2 pt-2">
                    <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                </div>
            ) : (
                <p className="text-text-secondary whitespace-pre-wrap">{report}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProgressReports;