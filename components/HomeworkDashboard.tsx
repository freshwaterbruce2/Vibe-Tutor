import React, { useState, useMemo } from 'react';
import type { HomeworkItem, ParsedHomework } from '../types';
import HomeworkItemComponent from './HomeworkItem';
import AddHomeworkModal from './AddHomeworkModal';
import NotificationPanel from './NotificationPanel';
import BreakdownModal from './BreakdownModal';
import { PlusIcon } from './icons/PlusIcon';
import { BellIcon } from './icons/BellIcon';

interface HomeworkDashboardProps {
  items: HomeworkItem[];
  onAdd: (item: ParsedHomework) => void;
  onToggleComplete: (id: string) => void;
}

const HomeworkDashboard: React.FC<HomeworkDashboardProps> = ({ items, onAdd, onToggleComplete }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const [breakdownItem, setBreakdownItem] = useState<HomeworkItem | null>(null);

  const upcomingItems = useMemo(() => {
    // FIX: Use UTC dates for comparison to avoid timezone issues.
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    return items.filter(item => {
      if (item.completed) return false;
      const itemDate = new Date(item.dueDate); // 'YYYY-MM-DD' is parsed as UTC
      return itemDate.getTime() === today.getTime() || itemDate.getTime() === tomorrow.getTime();
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [items]);

  const activeItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  const handleAdd = (item: ParsedHomework) => {
    onAdd(item);
    setIsAddModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary">Homework Dashboard</h1>
          <p className="text-text-secondary mt-1">Stay on top of your tasks and deadlines.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative">
                <button onClick={() => setIsNotifPanelOpen(prev => !prev)} className="relative p-2 rounded-full hover:bg-slate-700/50 transition-colors">
                    <BellIcon className="w-6 h-6 text-slate-400" />
                    {upcomingItems.length > 0 && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background-main" />
                    )}
                </button>
                {isNotifPanelOpen && <NotificationPanel items={upcomingItems} onClose={() => setIsNotifPanelOpen(false)} />}
            </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 font-semibold text-background-main bg-[var(--primary-accent)] rounded-lg hover:opacity-80 transition-opacity"
          >
            <PlusIcon className="w-5 h-5" />
            Add Assignment
          </button>
        </div>
      </header>

      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">To Do ({activeItems.length})</h2>
        {activeItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.map(item => (
              <HomeworkItemComponent key={item.id} item={item} onToggleComplete={onToggleComplete} onBreakdownClick={setBreakdownItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl">
            <p className="text-slate-400">No active assignments. Great job!</p>
          </div>
        )}

        {completedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">Completed ({completedItems.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedItems.map(item => (
                <HomeworkItemComponent key={item.id} item={item} onToggleComplete={onToggleComplete} onBreakdownClick={setBreakdownItem}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAddModalOpen && <AddHomeworkModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAdd} />}
      {breakdownItem && <BreakdownModal item={breakdownItem} onClose={() => setBreakdownItem(null)} />}
    </div>
  );
};

export default HomeworkDashboard;