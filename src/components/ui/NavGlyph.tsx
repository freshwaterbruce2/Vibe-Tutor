import type { LucideIcon } from 'lucide-react';

interface NavGlyphProps {
  icon: LucideIcon;
  active?: boolean;
  size?: 'md' | 'sm';
}

/** Rounded icon well for sidebar and mobile nav — no neon wash, no 44px stretch. */
const NavGlyph = ({ icon: Icon, active = false, size = 'md' }: NavGlyphProps) => {
  const box = size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-9 w-9 rounded-xl';
  const iconPx = size === 'sm' ? 16 : 18;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${box} ${
        active
          ? 'bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
          : 'bg-white/8 text-[var(--quaternary-accent)] ring-1 ring-inset ring-white/12'
      }`}
      aria-hidden="true"
    >
      <Icon size={iconPx} strokeWidth={1.75} />
    </span>
  );
};

export default NavGlyph;
