import React from 'react';
import type { View } from '../types';
import { VibeTechLogo } from './icons/VibeTechLogo';
import { DashboardIcon } from './icons/DashboardIcon';
import { TutorIcon } from './icons/TutorIcon';
import { FriendIcon } from './icons/FriendIcon';
import { FocusIcon } from './icons/FocusIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { LockIcon } from './icons/LockIcon';


interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  { view: 'dashboard', icon: DashboardIcon, label: 'Dashboard' },
  { view: 'tutor', icon: TutorIcon, label: 'AI Tutor' },
  { view: 'friend', icon: FriendIcon, label: 'AI Buddy' },
  { view: 'focus', icon: FocusIcon, label: 'Focus Timer' },
  { view: 'achievements', icon: TrophyIcon, label: 'Achievements' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="w-64 bg-background-surface border-r border-[var(--border-color)] flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-[var(--border-color)]">
        <VibeTechLogo className="w-10 h-10" />
        <h1 className="text-xl font-bold text-text-primary">Vibe-Tech AI</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            onClick={() => onNavigate(view as View)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors ${
              currentView === view
                ? 'bg-[var(--primary-accent)] text-background-main font-semibold shadow-lg shadow-black/30'
                : 'text-text-secondary hover:bg-slate-700/50'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-[var(--border-color)]">
        <button
            onClick={() => onNavigate('parent')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors ${
              currentView === 'parent'
                ? 'bg-slate-600 text-text-primary font-semibold'
                : 'text-text-secondary hover:bg-slate-700/50'
            }`}
          >
            <LockIcon className="w-6 h-6" />
            <span>Parent Zone</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
