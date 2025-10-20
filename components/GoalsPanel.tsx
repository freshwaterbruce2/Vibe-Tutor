import React, { useState, useEffect, useMemo } from 'react';
import { Target, TrendingUp, CheckCircle2, Trophy } from 'lucide-react';
import type { Goal, FocusSession, HomeworkItem } from '../types';

interface GoalsPanelProps {
  homeworkItems: HomeworkItem[];
  points: number;
}

const GoalsPanel: React.FC<GoalsPanelProps> = ({ homeworkItems, points }) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('user-goals');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-create default goals if none exist
  useEffect(() => {
    if (goals.length === 0) {
      const now = Date.now();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfDay = today.getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      const endOfWeek = startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000;

      const defaultGoals: Goal[] = [
        {
          id: 'daily_focus',
          type: 'daily',
          category: 'focus',
          target: 50,
          current: 0,
          startDate: startOfDay,
          endDate: endOfDay,
          completed: false
        },
        {
          id: 'daily_tasks',
          type: 'daily',
          category: 'tasks',
          target: 3,
          current: 0,
          startDate: startOfDay,
          endDate: endOfDay,
          completed: false
        },
        {
          id: 'weekly_focus',
          type: 'weekly',
          category: 'focus',
          target: 300,
          current: 0,
          startDate: startOfWeek.getTime(),
          endDate: endOfWeek,
          completed: false
        },
        {
          id: 'weekly_points',
          type: 'weekly',
          category: 'points',
          target: 500,
          current: 0,
          startDate: startOfWeek.getTime(),
          endDate: endOfWeek,
          completed: false
        }
      ];

      setGoals(defaultGoals);
      localStorage.setItem('user-goals', JSON.stringify(defaultGoals));
    }
  }, []);

  // Update goals progress
  const updatedGoals = useMemo(() => {
    const sessions: FocusSession[] = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    const now = Date.now();

    return goals.map(goal => {
      // Reset if goal period expired
      if (now > goal.endDate) {
        const newGoal = { ...goal };
        if (goal.type === 'daily') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          newGoal.startDate = today.getTime();
          newGoal.endDate = today.getTime() + 24 * 60 * 60 * 1000;
        } else {
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          newGoal.startDate = startOfWeek.getTime();
          newGoal.endDate = startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000;
        }
        newGoal.current = 0;
        newGoal.completed = false;
        return newGoal;
      }

      let current = 0;

      if (goal.category === 'focus') {
        current = sessions
          .filter(s => s.completed && s.startTime >= goal.startDate && s.startTime <= goal.endDate)
          .reduce((sum, s) => sum + s.duration, 0);
      } else if (goal.category === 'tasks') {
        current = homeworkItems.filter(
          item => item.completed && item.completedDate &&
          item.completedDate >= goal.startDate &&
          item.completedDate <= goal.endDate
        ).length;
      } else if (goal.category === 'points') {
        current = points; // Simplified - tracks total points
      }

      return {
        ...goal,
        current,
        completed: current >= goal.target
      };
    });
  }, [goals, homeworkItems, points]);

  // Save updated goals
  useEffect(() => {
    if (updatedGoals.length > 0) {
      localStorage.setItem('user-goals', JSON.stringify(updatedGoals));
    }
  }, [updatedGoals]);

  const getTimeLeft = (endDate: number): string => {
    const diff = endDate - Date.now();
    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;

    const days = Math.floor(hours / 24);
    return `${days}d left`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'focus': return Target;
      case 'tasks': return CheckCircle2;
      case 'points': return Trophy;
      default: return Target;
    }
  };

  const getCategoryLabel = (category: string, type: string) => {
    const prefix = type === 'daily' ? 'Daily' : 'Weekly';
    switch (category) {
      case 'focus': return `${prefix} Focus`;
      case 'tasks': return `${prefix} Tasks`;
      case 'points': return `${prefix} Points`;
      default: return prefix;
    }
  };

  const getCategoryUnit = (category: string) => {
    switch (category) {
      case 'focus': return 'min';
      case 'tasks': return 'tasks';
      case 'points': return 'pts';
      default: return '';
    }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="font-bold text-xl flex items-center gap-2">
        <TrendingUp size={20} />
        Goals
      </h3>

      <div className="grid gap-3">
        {updatedGoals.map(goal => {
          const Icon = getCategoryIcon(goal.category);
          const progress = Math.min((goal.current / goal.target) * 100, 100);

          return (
            <div key={goal.id} className="glass-panel p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    size={18}
                    className={goal.completed ? 'text-green-400' : 'text-[var(--primary-accent)]'}
                  />
                  <span className="font-semibold text-sm">
                    {getCategoryLabel(goal.category, goal.type)}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">{getTimeLeft(goal.endDate)}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  {goal.current}
                  <span className="text-sm text-text-secondary ml-1">
                    / {goal.target} {getCategoryUnit(goal.category)}
                  </span>
                </span>
                {goal.completed && (
                  <CheckCircle2 size={20} className="text-green-400" />
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    goal.completed
                      ? 'bg-green-500'
                      : 'bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)]'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-text-secondary text-center mt-4">
        Goals reset automatically each day/week
      </p>
    </div>
  );
};

export default GoalsPanel;
