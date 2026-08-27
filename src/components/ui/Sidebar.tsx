import {
  Award,
  Brain,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Headphones,
  HeartPulse,
  LayoutGrid,
  Library,
  Menu,
  MessageCircle,
  Shield,
  Sparkles,
  Store,
  Target,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getWelcomeMessage } from '../../config';
import type { View } from '../../types';
import { GradientDefs } from './icons/GradientIcon';
import { VibeTechLogo } from './icons/VibeTechLogo';
import NavGlyph from './NavGlyph';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  userName?: string;
}

/** All navigation items — desktop sidebar shows all, mobile shows primary 5 + "More" */
const navItems = [
  { view: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { view: 'tutor', icon: GraduationCap, label: 'Vibe Tutor' },
  { view: 'friend', icon: MessageCircle, label: 'Vibe Buddy' },
  { view: 'cards', icon: Library, label: 'Subjects' },
  { view: 'shop', icon: Store, label: 'Reward Shop' },
  { view: 'games', icon: Brain, label: 'Brain Gym' },
  { view: 'schedules', icon: CalendarDays, label: 'Schedules' },
  { view: 'tokens', icon: Wallet, label: 'Tokens' },
  { view: 'achievements', icon: Award, label: 'Achievements' },
  { view: 'music', icon: Headphones, label: 'Music' },
  { view: 'sensory', icon: Sparkles, label: 'Sensory' },
  { view: 'focus', icon: Target, label: 'Focus' },
  { view: 'wellness', icon: HeartPulse, label: 'Wellness' },
] as const;

/** The 5 primary tabs shown in the mobile bottom nav */
const MOBILE_PRIMARY: View[] = ['dashboard', 'tutor', 'friend', 'music', 'sensory'];

const primaryNavItems = navItems.filter((item) => MOBILE_PRIMARY.includes(item.view as View));
const secondaryNavItems = navItems.filter((item) => !MOBILE_PRIMARY.includes(item.view as View));

function navLabelClass(isActive: boolean): string {
  return `nav-label transition-all duration-300 ${isActive ? 'nav-label--active' : 'nav-label--idle'}`;
function navRowClass(active: boolean): string {
  return `w-full flex items-center gap-3 px-2.5 py-2 rounded-2xl text-left transition-colors duration-200 ${
    active
      ? 'bg-[var(--primary-accent)]/22 text-white font-semibold ring-1 ring-inset ring-white/15'
      : 'text-[var(--text-secondary)] hover:bg-white/8 hover:text-[var(--text-primary)]'
  }`;
}

const Sidebar = ({
  currentView,
  onNavigate,
  isCollapsed = false,
  onToggle,
  userName,
}: SidebarProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const shouldHideMobileNav = currentView === 'onboarding';
  const welcomeMessage = getWelcomeMessage(userName?.trim() || undefined);

  useEffect(() => {
    if (shouldHideMobileNav && moreOpen) {
      setMoreOpen(false);
    }
  }, [moreOpen, shouldHideMobileNav]);

  const handleMoreNavigate = (view: View) => {
    onNavigate(view);
    setMoreOpen(false);
  };

  return (
    <>
      <GradientDefs />

      <div
        className={`hidden md:flex ${isCollapsed ? 'w-[72px]' : 'w-64'} glass-panel border-r border-[var(--glass-border)] flex-col shrink-0 relative overflow-hidden transition-[width] duration-300`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--glass-surface)] to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <div
            className={`p-5 flex items-center gap-3 border-b border-[var(--glass-border)] shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
              <VibeTechLogo className="w-11 h-11 shrink-0" />
              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-lg font-semibold text-[var(--text-primary)] leading-tight tracking-tight">
                    Vibe Tutor
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{welcomeMessage}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onToggle}
              className={`rounded-lg w-9 h-9 shrink-0 flex items-center justify-center hover:bg-white/10 transition-colors focus-glow ${isCollapsed ? 'absolute top-4 right-3' : ''}`}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-[var(--text-primary)]" />
              ) : (
                <ChevronUp className="w-4 h-4 text-[var(--text-primary)]" />
              )}
            </button>
          </div>
          <nav
            role="navigation"
            aria-label="Desktop navigation"
            className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1"
          >
            {navItems.map(({ view, icon, label }) => (
              <button
                key={view}
                type="button"
                onClick={() => onNavigate(view as View)}
                className={navRowClass(currentView === view)}
                title={isCollapsed ? label : undefined}
                aria-label={label}
                aria-current={currentView === view ? 'page' : undefined}
              >
                <GradientIcon
                  Icon={Icon}
                  size={24}
                  gradientId={currentView === view ? 'vibe-gradient-mobile' : gradient}
                  className="transition-all duration-300"
                />
                {!isCollapsed && <span className={navLabelClass(currentView === view)}>{label}</span>}
                {currentView === view && (
                  <div className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                )}
                <NavGlyph icon={icon} active={currentView === view} />
                {!isCollapsed && <span className="truncate text-sm tracking-tight">{label}</span>}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-[var(--glass-border)] shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('parent')}
              className={navRowClass(currentView === 'parent')}
              title={isCollapsed ? 'Parent Zone' : undefined}
              aria-label="Parent Zone"
              aria-current={currentView === 'parent' ? 'page' : undefined}
            >
              <GradientIcon
                Icon={Lock}
                size={24}
                gradientId={
                  currentView === 'parent' ? 'vibe-gradient-mobile' : 'vibe-gradient-secondary'
                }
                className="transition-all duration-300"
              />
              {!isCollapsed && (
                <span className={navLabelClass(currentView === 'parent')}>Parent Zone</span>
              )}
              {currentView === 'parent' && (
                <div className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
              )}
              <NavGlyph icon={Shield} active={currentView === 'parent'} />
              {!isCollapsed && <span className="truncate text-sm tracking-tight">Parent Zone</span>}
            </button>
          </div>
        </div>
      </div>

      {!shouldHideMobileNav && moreOpen && (
        <div className="md:hidden fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 glass-card border-t border-[var(--glass-border)] rounded-t-2xl p-4 animate-[slideUp_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">More</h2>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="min-h-[44px] min-w-[44px] p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close menu"
                title="Close menu"
              >
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {secondaryNavItems.map(({ view, icon, label }) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => handleMoreNavigate(view as View)}
                  className={`flex flex-col items-center justify-center min-h-[64px] p-3 rounded-xl transition-colors duration-200 touch-manipulation ${
                    currentView === view
                      ? 'bg-[var(--primary-accent)]/20 text-white'
                      : 'text-[var(--text-secondary)] hover:bg-white/5'
                  }`}
                >
                  <GradientIcon
                    Icon={Icon}
                    size={24}
                    gradientId={currentView === view ? 'vibe-gradient-mobile' : gradient}
                    className="mb-1"
                  />
                  <span className={`${navLabelClass(currentView === view)} text-[10px] leading-tight text-center break-words w-full truncate text-wrap`}>
                  <NavGlyph icon={icon} active={currentView === view} size="sm" />
                  <span className="mt-1.5 text-[10px] font-medium leading-tight text-center break-words w-full">
                    {label}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleMoreNavigate('parent')}
                className={`flex flex-col items-center justify-center min-h-[64px] p-3 rounded-xl transition-colors duration-200 touch-manipulation ${
                  currentView === 'parent'
                    ? 'bg-[var(--secondary-accent)]/20 text-white'
                    : 'text-[var(--text-secondary)] hover:bg-white/5'
                }`}
              >
                <GradientIcon
                  Icon={Lock}
                  size={24}
                  gradientId={
                    currentView === 'parent' ? 'vibe-gradient-mobile' : 'vibe-gradient-secondary'
                  }
                  className="mb-1"
                />
                <span className={`${navLabelClass(currentView === 'parent')} text-[10px] leading-tight text-center break-words w-full truncate text-wrap`}>
                <NavGlyph icon={Shield} active={currentView === 'parent'} size="sm" />
                <span className="mt-1.5 text-[10px] font-medium leading-tight text-center break-words w-full">
                  Parent
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!shouldHideMobileNav && (
        <nav
          role="navigation"
          aria-label="Mobile navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-[var(--glass-border)] z-50 sidebar-safe-bottom"
        >
          <div className="max-w-lg mx-auto grid grid-cols-6 gap-0.5 px-2 pt-2 pb-1">
            {primaryNavItems.map(({ view, icon, label }) => (
              <button
                key={view}
                type="button"
                onClick={() => onNavigate(view as View)}
                className={`flex flex-col items-center justify-center min-h-[52px] px-1 py-1.5 rounded-lg transition-colors duration-200 touch-manipulation ${
                  currentView === view
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                <GradientIcon
                  Icon={Icon}
                  size={22}
                  gradientId={currentView === view ? 'vibe-gradient-mobile' : gradient}
                  className="mb-0.5"
                />
                <span className={`${navLabelClass(currentView === view)} text-[10px] leading-tight text-center break-words w-full truncate text-wrap`}>
                <NavGlyph icon={icon} active={currentView === view} size="sm" />
                <span className="mt-0.5 text-[10px] font-medium leading-tight text-center break-words w-full truncate">
                  {label}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={`flex flex-col items-center justify-center min-h-[52px] px-1 py-1.5 rounded-lg transition-colors duration-200 touch-manipulation ${
                moreOpen || (!MOBILE_PRIMARY.includes(currentView) && currentView !== 'parent')
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)]'
              }`}
              aria-label="More navigation options"
              title="More"
            >
              <Menu className="w-[22px] h-[22px] mb-0.5" />
              <span className={`${navLabelClass(moreOpen)} text-[10px] leading-tight text-center break-words w-full truncate text-wrap`}>
              <NavGlyph icon={Menu} active={moreOpen} size="sm" />
              <span className="mt-0.5 text-[10px] font-medium leading-tight text-center break-words w-full truncate">
                More
              </span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
};

export default Sidebar;
