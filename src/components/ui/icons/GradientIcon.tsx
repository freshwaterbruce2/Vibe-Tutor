import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

interface GradientIconProps {
  Icon: LucideIcon;
  size?: number;
  className?: string;
  gradientId?: string;
}

// Gradient definitions for the shared Vibe Tutor neon theme
export const GradientDefs: FC = () => (
  <svg width="0" height="0" className="gradient-defs-svg">
    <defs>
      {/* Primary gradient: light pink to neon fuchsia */}
      <linearGradient id="vibe-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--secondary-accent)" />
        <stop offset="52%" stopColor="var(--primary-accent)" />
        <stop offset="100%" stopColor="var(--tertiary-accent)" />
      </linearGradient>

      {/* Secondary gradient: orchid to pink */}
      <linearGradient id="vibe-gradient-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--quaternary-accent)" />
        <stop offset="100%" stopColor="var(--secondary-accent)" />
      </linearGradient>

      {/* Accent gradient: purple to hot pink */}
      <linearGradient id="vibe-gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--tertiary-accent)" />
        <stop offset="100%" stopColor="var(--energy-accent)" />
      </linearGradient>

      {/* Radial glow gradient */}
      <radialGradient id="vibe-gradient-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--secondary-accent)" stopOpacity="0.86" />
        <stop offset="50%" stopColor="var(--primary-accent)" stopOpacity="0.4" />
        <stop offset="100%" stopColor="var(--tertiary-accent)" stopOpacity="0.1" />
      </radialGradient>

      {/* Mobile-optimized gradient with higher contrast */}
      <linearGradient id="vibe-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBCFE8" />
        <stop offset="50%" stopColor="#E879F9" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
    </defs>
  </svg>
);

// Gradient Icon wrapper component
export const GradientIcon: FC<GradientIconProps> = ({
  Icon,
  size = 24,
  className = '',
  gradientId = 'vibe-gradient-primary',
}) => {
  // Ensure minimum touch target size for mobile
  const minSize = size < 44 ? 44 : size;
  const iconSize = size;

  return (
    <div
      className={`inline-flex items-center justify-center gradient-icon-touch-target ${className}`}
      style={{ '--icon-min': `${minSize}px` } as React.CSSProperties}
    >
      <Icon
        size={iconSize}
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        fill="none"
        className="gradient-icon-glow transition-all duration-200 hover:scale-110 active:scale-95"
      />
    </div>
  );
};

// Solid gradient icon variant (filled)
export const GradientIconSolid: FC<GradientIconProps> = ({
  Icon,
  size = 24,
  className = '',
  gradientId = 'vibe-gradient-primary',
}) => {
  const minSize = size < 44 ? 44 : size;
  const iconSize = size;

  return (
    <div
      className={`inline-flex items-center justify-center gradient-icon-touch-target ${className}`}
      style={{ '--icon-min': `${minSize}px` } as React.CSSProperties}
    >
      <Icon
        size={iconSize}
        fill={`url(#${gradientId})`}
        stroke="none"
        className="gradient-icon-glow-solid transition-all duration-200 hover:scale-110 active:scale-95"
      />
    </div>
  );
};

// Mobile-optimized gradient icon with larger touch area
export const MobileGradientIcon: FC<GradientIconProps> = ({
  Icon,
  size = 28,
  className = '',
  gradientId = 'vibe-gradient-mobile',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center p-2 rounded-xl active:bg-white/10 transition-all gradient-icon-touch-target ${className}`}
      style={{ '--icon-min': '48px' } as React.CSSProperties}
    >
      <Icon
        size={size}
        stroke={`url(#${gradientId})`}
        strokeWidth={2.5}
        fill="none"
        className="gradient-icon-glow-mobile transition-transform active:scale-90"
      />
    </div>
  );
};
