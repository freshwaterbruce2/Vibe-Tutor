import React from 'react';
import type { View } from '../types';
import { VibeTechLogo } from './icons/VibeTechLogo';
import { GradientIcon, GradientDefs } from './icons/GradientIcon';
import {
  LayoutDashboard,
  GraduationCap,
  Heart,
  Trophy,
  Lock,
  Sparkles,
  Bot,
  Users,
  Music2,
  Eye,
  Timer
} from 'lucide-react';


interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  { view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'vibe-gradient-primary' },
  { view: 'tutor', icon: GraduationCap, label: 'AI Tutor', gradient: 'vibe-gradient-secondary' },
  { view: 'friend', icon: Heart, label: 'AI Buddy', gradient: 'vibe-gradient-accent' },
  { view: 'achievements', icon: Trophy, label: 'Achievements', gradient: 'vibe-gradient-secondary' },
  { view: 'music', icon: Music2, label: 'Music', gradient: 'vibe-gradient-accent' },
  { view: 'sensory', icon: Eye, label: 'Sensory', gradient: 'vibe-gradient-primary' },
  { view: 'focus', icon: Timer, label: 'Focus', gradient: 'vibe-gradient-secondary' },
] as const;

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <>
      <GradientDefs />

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:flex w-64 glass-card border-r border-[var(--glass-border)] flex-col shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--glass-surface)] to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="p-6 flex items-center gap-3 border-b border-[var(--glass-border)] backdrop-blur-sm">
            <VibeTechLogo className="w-12 h-12 float-animation" />
            <div>
              <h1 className="text-xl font-bold neon-text-primary">Vibe-Tech</h1>
              <p className="text-sm text-[var(--text-secondary)] opacity-80">AI Tutor</p>
            </div>
          </div>
          <nav role="navigation" aria-label="Desktop navigation" className="flex-1 p-4 space-y-3">
            {navItems.map(({ view, icon: Icon, label, gradient }) => (
              <button
                key={view}
                onClick={() => onNavigate(view as View)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                  currentView === view
                    ? 'glass-button text-white font-semibold shadow-[var(--neon-glow-primary)] border-[var(--primary-accent)]'
                    : 'glass-card hover:glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 focus-glow'
                }`}
              >
                <GradientIcon
                  Icon={Icon}
                  size={24}
                  gradientId={currentView === view ? 'vibe-gradient-mobile' : gradient}
                  className="transition-all duration-300"
                />
                <span className="transition-all duration-300">{label}</span>
                {currentView === view && (
                  <div className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-[var(--glass-border)]">
            <button
                onClick={() => onNavigate('parent')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                  currentView === 'parent'
                    ? 'glass-button text-white font-semibold shadow-[var(--neon-glow-secondary)] border-[var(--secondary-accent)]'
                    : 'glass-card hover:glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 focus-glow'
                }`}
            >
              <GradientIcon
                Icon={Lock}
                size={24}
                gradientId={currentView === 'parent' ? 'vibe-gradient-mobile' : 'vibe-gradient-secondary'}
                className="transition-all duration-300"
              />
              <span className="transition-all duration-300">Parent Zone</span>
              {currentView === 'parent' && (
                <div className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Fixed for Galaxy A54 safe area */}
      <nav role="navigation" aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-[var(--glass-border)] z-50" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)' }}>
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map(({ view, icon: Icon, label, gradient }) => (
            <button
              key={view}
              onClick={() => onNavigate(view as View)}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[56px] px-2 py-1.5 rounded-lg transition-all duration-200 ${
                currentView === view
                  ? 'text-[var(--primary-accent)]'
                  : 'text-[var(--text-secondary)]'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <GradientIcon
                Icon={Icon}
                size={24}
                gradientId={currentView === view ? 'vibe-gradient-mobile' : gradient}
                className="mb-1"
              />
              <span className="text-[11px] font-medium leading-tight">{label}</span>
            </button>
          ))}
          <button
            onClick={() => onNavigate('parent')}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[56px] px-2 py-1.5 rounded-lg transition-all duration-200 ${
              currentView === 'parent'
                ? 'text-[var(--secondary-accent)]'
                : 'text-[var(--text-secondary)]'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <GradientIcon
              Icon={Lock}
              size={24}
              gradientId={currentView === 'parent' ? 'vibe-gradient-mobile' : 'vibe-gradient-secondary'}
              className="mb-1"
            />
            <span className="text-[11px] font-medium leading-tight">Parent</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
