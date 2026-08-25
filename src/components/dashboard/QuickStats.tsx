import { AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import type { HomeworkItem } from '../../types';

interface QuickStatsProps {
  items: HomeworkItem[];
}

const QuickStats = ({ items }: QuickStatsProps) => {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const completedToday = items.filter((i) => {
    if (!i.completed || !i.completedDate) return false;
    const completedDate = new Date(i.completedDate);
    return completedDate.toDateString() === now.toDateString();
  }).length;

  const overdue = items.filter((i) => {
    if (i.completed) return false;
    const dueDate = new Date(i.dueDate);
    return dueDate.getTime() < today.getTime();
  }).length;

  const dueToday = items.filter((i) => {
    if (i.completed) return false;
    const dueDate = new Date(i.dueDate);
    return dueDate.toDateString() === today.toDateString();
  }).length;

  const completionRate =
    items.length > 0
      ? Math.round((items.filter((i) => i.completed).length / items.length) * 100)
      : 0;

  const stats = [
    {
      icon: CheckCircle2,
      label: 'Completed Today',
      value: completedToday,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
    },
    {
      icon: Clock,
      label: 'Due Today',
      value: dueToday,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      icon: AlertCircle,
      label: 'Overdue',
      value: overdue,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/30',
    },
  ];

  return (
    <section aria-label="Quick stats" className="grid w-full grid-cols-2 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article
            key={stat.label}
            className={`relative min-w-0 rounded-2xl border p-4 ${stat.borderColor} ${stat.bgColor}`}
          >
            <Icon
              className={`pointer-events-none absolute right-3 top-3 h-4 w-4 ${stat.color}`}
              aria-hidden="true"
            />
            <p className="pr-8 text-xs font-medium leading-4 text-[var(--text-secondary)]">
              {stat.label}
            </p>
            <p className={`mt-2 text-2xl font-bold tabular-nums leading-none ${stat.color}`}>
              {stat.value}
            </p>
          </article>
        );
      })}
    </section>
  );
};

export default QuickStats;
