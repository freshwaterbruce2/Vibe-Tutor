import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { animated, useSpring } from '@react-spring/web';
import { playSoundEffect } from '../services/soundEffects';

interface CelebrationProps {
  type: 'taskComplete' | 'pointGain' | 'levelUp' | 'badgeUnlock' | 'streakMilestone';
  points?: number;
  message?: string;
  onComplete?: () => void;
}

/**
 * Celebration Component - ABCya-style interactive animations
 * Provides positive reinforcement for ADHD/autism users
 * Respects sensory settings for animation control
 */
export const Celebration: React.FC<CelebrationProps> = ({ type, points, message, onComplete }) => {
  const [animationEnabled, setAnimationEnabled] = React.useState(true);

  // Check sensory preferences
  useEffect(() => {
    try {
      const prefs = localStorage.getItem('sensory-prefs');
      if (prefs) {
        const { animationSpeed } = JSON.parse(prefs);
        setAnimationEnabled(animationSpeed !== 'none');
      }
    } catch (error) {
      console.warn('Could not load animation preferences:', error);
    }
  }, []);

  // Trigger celebration effects
  useEffect(() => {
    if (!animationEnabled) {
      onComplete?.();
      return;
    }

    // Play sound effect
    playSoundEffect(type);

    // Trigger confetti based on type
    switch (type) {
      case 'taskComplete':
        fireConfetti({ particleCount: 50, spread: 60 });
        break;
      case 'pointGain':
        fireConfetti({ particleCount: 30, spread: 40, colors: ['#8B5CF6', '#06B6D4'] });
        break;
      case 'levelUp':
        fireLevelUpAnimation();
        break;
      case 'badgeUnlock':
        fireBadgeAnimation();
        break;
      case 'streakMilestone':
        fireStreakAnimation();
        break;
    }

    // Auto-complete after animation
    const timeout = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [type, animationEnabled, onComplete]);

  // Spring animation for popup
  const popupAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.5) translateY(50px)' },
    to: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    config: { tension: 300, friction: 20 },
  });

  if (!animationEnabled) return null;

  return (
    <animated.div
      style={popupAnimation}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="glass-card p-8 max-w-md mx-4 pointer-events-auto">
        {type === 'taskComplete' && (
          <div className="text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold neon-text-primary">Task Complete!</h2>
            {points && <p className="text-lg mt-2">+{points} points</p>}
          </div>
        )}

        {type === 'pointGain' && points && (
          <div className="text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-3xl font-bold neon-text-primary">+{points}</h2>
            <p className="text-lg mt-2">Points Earned!</p>
          </div>
        )}

        {type === 'levelUp' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold neon-text-primary">Level Up!</h2>
            <p className="text-lg mt-2">{message || 'You\'re on fire!'}</p>
          </div>
        )}

        {type === 'badgeUnlock' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold neon-text-primary">Badge Unlocked!</h2>
            <p className="text-lg mt-2">{message}</p>
          </div>
        )}

        {type === 'streakMilestone' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-bold neon-text-primary">Streak Milestone!</h2>
            <p className="text-lg mt-2">{message}</p>
          </div>
        )}
      </div>
    </animated.div>
  );
};

// Confetti helper functions
function fireConfetti(options: confetti.Options = {}) {
  const defaults: confetti.Options = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#8B5CF6', '#06B6D4', '#EC4899'],
  };

  confetti({
    ...defaults,
    ...options,
  });
}

function fireLevelUpAnimation() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8B5CF6', '#06B6D4', '#EC4899'],
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#8B5CF6', '#06B6D4', '#EC4899'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

function fireBadgeAnimation() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#FFD700', '#FFA500', '#FF4500'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function fireStreakAnimation() {
  const duration = 1500;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 90,
      spread: 45,
      origin: { x: Math.random(), y: 0 },
      colors: ['#FF6B6B', '#FFD93D', '#6BCB77'],
      ticks: 200,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

// Point Popup Component - Animated points that float up
interface PointPopupProps {
  points: number;
  x: number;
  y: number;
}

export const PointPopup: React.FC<PointPopupProps> = ({ points, x, y }) => {
  const animation = useSpring({
    from: { opacity: 1, transform: `translate(${x}px, ${y}px)` },
    to: { opacity: 0, transform: `translate(${x}px, ${y - 50}px)` },
    config: { duration: 1000 },
  });

  return (
    <animated.div
      style={animation}
      className="fixed pointer-events-none z-50 text-2xl font-bold neon-text-primary"
    >
      +{points}
    </animated.div>
  );
};
