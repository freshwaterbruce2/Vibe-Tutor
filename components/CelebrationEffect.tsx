/**
 * Celebration Effect Component
 *
 * Modular particle effects for game celebrations.
 * Respects sensory preferences for animations.
 */

import React, { useEffect, useState } from 'react';

interface CelebrationEffectProps {
    trigger: boolean;
    type?: 'confetti' | 'sparkle' | 'bounce' | 'pulse';
    duration?: number;
    onComplete?: () => void;
}

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
    trigger,
    type = 'confetti',
    duration = 1000,
    onComplete
}) => {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string }>>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (trigger && !isAnimating) {
            // Check sensory preferences
            const sensoryPrefs = JSON.parse(localStorage.getItem('sensory-prefs') || '{}');
            if (sensoryPrefs.animationEnabled === false) {
                onComplete?.();
                return;
            }

            setIsAnimating(true);

            // Generate particles
            const particleCount = type === 'confetti' ? 20 : 10;
            const newParticles = Array.from({ length: particleCount }, (_, i) => ({
                id: i,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                rotation: Math.random() * 360,
                color: ['#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
            }));

            setParticles(newParticles);

            // Clear after duration
            setTimeout(() => {
                setParticles([]);
                setIsAnimating(false);
                onComplete?.();
            }, duration);
        }
    }, [trigger, type, duration, isAnimating, onComplete]);

    if (particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {type === 'confetti' && particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute w-3 h-3 rounded-full animate-confetti"
                    style={{
                        backgroundColor: particle.color,
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`,
                        animation: `confetti-fall ${duration}ms ease-out forwards`,
                    }}
                />
            ))}

            {type === 'sparkle' && (
                <div className="text-6xl animate-bounce">
                    ✨
                </div>
            )}

            {type === 'pulse' && (
                <div className="absolute inset-0 bg-green-500/20 animate-ping rounded-full" />
            )}
        </div>
    );
};

export default CelebrationEffect;
