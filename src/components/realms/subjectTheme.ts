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
}

/** One hue family per subject so the hub scans as five different places. */
export const SUBJECT_THEME: Record<SubjectType, SubjectTheme> = {
  Math: {
    icon: Calculator,
    prompt: 'Numbers, puzzles, and games',
    gradient: 'from-cyan-400 to-sky-500',
    wash: 'bg-cyan-400/15',
    restBorder: 'border-cyan-400/50',
    hoverBorder: 'hover:border-cyan-300',
    ring: 'ring-cyan-300/80',
    starFilled: 'fill-cyan-300 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]',
    overlay: 'from-cyan-400/25 to-sky-500/10',
    accentText: 'text-cyan-300',
    well: 'bg-cyan-500/20',
  },
  Science: {
    icon: FlaskConical,
    prompt: 'How the world works',
    gradient: 'from-emerald-400 to-teal-500',
    wash: 'bg-emerald-400/15',
    restBorder: 'border-emerald-400/50',
    hoverBorder: 'hover:border-emerald-300',
    ring: 'ring-emerald-300/80',
    starFilled: 'fill-emerald-300 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.85)]',
    overlay: 'from-emerald-400/25 to-teal-500/10',
    accentText: 'text-emerald-300',
    well: 'bg-emerald-500/20',
  },
  History: {
    icon: Landmark,
    prompt: 'People, places, and the past',
    gradient: 'from-amber-400 to-orange-500',
    wash: 'bg-amber-400/15',
    restBorder: 'border-amber-400/50',
    hoverBorder: 'hover:border-amber-300',
    ring: 'ring-amber-300/80',
    starFilled: 'fill-amber-300 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.85)]',
    overlay: 'from-amber-400/25 to-orange-500/10',
    accentText: 'text-amber-300',
    well: 'bg-amber-500/20',
  },
  Bible: {
    icon: BookMarked,
    prompt: 'Stories and questions',
    gradient: 'from-violet-400 to-indigo-500',
    wash: 'bg-violet-400/15',
    restBorder: 'border-violet-400/50',
    hoverBorder: 'hover:border-violet-300',
    ring: 'ring-violet-300/80',
    starFilled: 'fill-violet-300 text-violet-300 drop-shadow-[0_0_6px_rgba(167,139,250,0.85)]',
    overlay: 'from-violet-400/25 to-indigo-500/10',
    accentText: 'text-violet-300',
    well: 'bg-violet-500/20',
  },
  'Language Arts': {
    icon: PenLine,
    prompt: 'Words, reading, and writing',
    gradient: 'from-fuchsia-400 to-pink-500',
    wash: 'bg-fuchsia-400/15',
    restBorder: 'border-fuchsia-400/50',
    hoverBorder: 'hover:border-pink-300',
    ring: 'ring-pink-300/80',
    starFilled: 'fill-pink-300 text-pink-300 drop-shadow-[0_0_6px_rgba(249,168,212,0.85)]',
    overlay: 'from-fuchsia-400/25 to-pink-500/10',
    accentText: 'text-pink-300',
    well: 'bg-fuchsia-500/20',
  },
};
