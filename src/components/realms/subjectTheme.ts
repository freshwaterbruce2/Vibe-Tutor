import {
  BookMarked,
  Calculator,
  FlaskConical,
  Landmark,
  PenLine,
  type LucideIcon,
} from 'lucide-react';
import type { SubjectType } from '../../types';

export const SUBJECTS: SubjectType[] = ['Math', 'Science', 'History', 'Bible', 'Language Arts'];

export interface SubjectTheme {
  icon: LucideIcon;
  prompt: string;
  /** Icon well, title, badge, bar, and practice button */
  gradient: string;
  wash: string;
  restBorder: string;
  hoverBorder: string;
  ring: string;
  starFilled: string;
  overlay: string;
  accentText: string;
  well: string;
  glow: string;
  orb: string;
}

/** One hue family per subject so the hub scans as five different places. */
export const SUBJECT_THEME: Record<SubjectType, SubjectTheme> = {
  Math: {
    icon: Calculator,
    prompt: 'Numbers, puzzles, and games',
    gradient: 'from-cyan-400 to-sky-500',
    wash: 'bg-[rgba(6,28,40,0.94)]',
    restBorder: 'border-cyan-300/75',
    hoverBorder: 'hover:border-cyan-200',
    ring: 'ring-cyan-300/80',
    starFilled: 'fill-cyan-300 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.95)]',
    overlay: 'from-cyan-400/20 to-sky-500/8',
    accentText: 'text-cyan-200',
    well: 'bg-cyan-500/25',
    glow: 'shadow-[0_24px_64px_-10px_rgba(34,211,238,0.62),0_0_0_1px_rgba(34,211,238,0.28)]',
    orb: 'bg-cyan-400',
  },
  Science: {
    icon: FlaskConical,
    prompt: 'How the world works',
    gradient: 'from-emerald-400 to-teal-500',
    wash: 'bg-[rgba(6,32,24,0.94)]',
    restBorder: 'border-emerald-300/75',
    hoverBorder: 'hover:border-emerald-200',
    ring: 'ring-emerald-300/80',
    starFilled: 'fill-emerald-300 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.95)]',
    overlay: 'from-emerald-400/20 to-teal-500/8',
    accentText: 'text-emerald-200',
    well: 'bg-emerald-500/25',
    glow: 'shadow-[0_24px_64px_-10px_rgba(52,211,153,0.62),0_0_0_1px_rgba(52,211,153,0.28)]',
    orb: 'bg-emerald-400',
  },
  History: {
    icon: Landmark,
    prompt: 'People, places, and the past',
    gradient: 'from-amber-400 to-orange-500',
    wash: 'bg-[rgba(36,22,8,0.94)]',
    restBorder: 'border-amber-300/75',
    hoverBorder: 'hover:border-amber-200',
    ring: 'ring-amber-300/80',
    starFilled: 'fill-amber-300 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.95)]',
    overlay: 'from-amber-400/20 to-orange-500/8',
    accentText: 'text-amber-200',
    well: 'bg-amber-500/25',
    glow: 'shadow-[0_24px_64px_-10px_rgba(251,191,36,0.62),0_0_0_1px_rgba(251,191,36,0.28)]',
    orb: 'bg-amber-400',
  },
  Bible: {
    icon: BookMarked,
    prompt: 'Stories and questions',
    gradient: 'from-violet-400 to-indigo-500',
    wash: 'bg-[rgba(22,12,40,0.94)]',
    restBorder: 'border-violet-300/75',
    hoverBorder: 'hover:border-violet-200',
    ring: 'ring-violet-300/80',
    starFilled: 'fill-violet-300 text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.95)]',
    overlay: 'from-violet-400/20 to-indigo-500/8',
    accentText: 'text-violet-200',
    well: 'bg-violet-500/25',
    glow: 'shadow-[0_24px_64px_-10px_rgba(167,139,250,0.62),0_0_0_1px_rgba(167,139,250,0.28)]',
    orb: 'bg-violet-400',
  },
  'Language Arts': {
    icon: PenLine,
    prompt: 'Words, reading, and writing',
    gradient: 'from-fuchsia-400 to-pink-500',
    wash: 'bg-[rgba(36,10,28,0.94)]',
    restBorder: 'border-pink-300/75',
    hoverBorder: 'hover:border-pink-200',
    ring: 'ring-pink-300/80',
    starFilled: 'fill-pink-300 text-pink-300 drop-shadow-[0_0_8px_rgba(249,168,212,0.95)]',
    overlay: 'from-fuchsia-400/20 to-pink-500/8',
    accentText: 'text-pink-200',
    well: 'bg-fuchsia-500/25',
    glow: 'shadow-[0_24px_64px_-10px_rgba(244,114,182,0.65),0_0_0_1px_rgba(244,114,182,0.3)]',
    orb: 'bg-fuchsia-400',
  },
};
