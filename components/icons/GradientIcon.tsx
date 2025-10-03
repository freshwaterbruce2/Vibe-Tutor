import React, { FC } from 'react';
import { LucideIcon } from 'lucide-react';

interface GradientIconProps {
  Icon: LucideIcon;
  size?: number;
  className?: string;
  gradientId?: string;
}

// Gradient definitions for Vibe-Tech theme
export const GradientDefs: FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      {/* Primary gradient: Purple to Cyan */}
      <linearGradient id="vibe-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>

      {/* Secondary gradient: Purple to Pink */}
      <linearGradient id="vibe-gradient-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>

      {/* Accent gradient: Cyan to Purple */}
      <linearGradient id="vibe-gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>

      {/* Radial glow gradient */}
      <radialGradient id="vibe-gradient-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
      </radialGradient>

      {/* Mobile-optimized gradient with higher contrast */}
      <linearGradient id="vibe-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="50%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
    </defs>
  </svg>
);

// Gradient Icon wrapper component
export const GradientIcon: FC<GradientIconProps> = ({
  Icon,
  size = 24,
  className = '',
  gradientId = 'vibe-gradient-primary'
}) => {
  // Ensure minimum touch target size for mobile
  const minSize = size < 44 ? 44 : size;
  const iconSize = size;

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        minWidth: `${minSize}px`,
        minHeight: `${minSize}px`,
      }}
    >
      <Icon
        size={iconSize}
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        fill="none"
        className="transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          filter: 'drop-shadow(0 0 3px rgba(139, 92, 246, 0.3))'
        }}
      />
    </div>
  );
};

// Solid gradient icon variant (filled)
export const GradientIconSolid: FC<GradientIconProps> = ({
  Icon,
  size = 24,
  className = '',
  gradientId = 'vibe-gradient-primary'
}) => {
  const minSize = size < 44 ? 44 : size;
  const iconSize = size;

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        minWidth: `${minSize}px`,
        minHeight: `${minSize}px`,
      }}
    >
      <Icon
        size={iconSize}
        fill={`url(#${gradientId})`}
        stroke="none"
        className="transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))'
        }}
      />
    </div>
  );
};

// Mobile-optimized gradient icon with larger touch area
export const MobileGradientIcon: FC<GradientIconProps> = ({
  Icon,
  size = 28,
  className = '',
  gradientId = 'vibe-gradient-mobile'
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center p-2 rounded-xl active:bg-white/10 transition-all ${className}`}
      style={{
        minWidth: '48px',
        minHeight: '48px',
      }}
    >
      <Icon
        size={size}
        stroke={`url(#${gradientId})`}
        strokeWidth={2.5}
        fill="none"
        className="transition-transform active:scale-90"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
        }}
      />
    </button>
  );
};