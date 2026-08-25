import type { SensoryPreferences } from '../types';
import { appStore } from './electronStore';

export const DEFAULT_SENSORY_PREFERENCES: SensoryPreferences = {
  animationSpeed: 'normal',
  soundEnabled: true,
  hapticEnabled: true,
  fontSize: 'medium',
  dyslexiaFont: false,
  colorMode: 'default',
  circuitMotionEnabled: true,
};

export function readSensoryPreferences(): SensoryPreferences {
  const saved = appStore.get<Partial<SensoryPreferences>>('sensory-prefs');
  if (!saved || typeof saved !== 'object') {
    return { ...DEFAULT_SENSORY_PREFERENCES };
  }
  return { ...DEFAULT_SENSORY_PREFERENCES, ...saved };
}

export function applySensoryDom(prefs: SensoryPreferences): void {
  const root = document.documentElement;
  root.setAttribute('data-animation-speed', prefs.animationSpeed);
  root.setAttribute('data-font-size', prefs.fontSize);
  root.setAttribute('data-color-mode', prefs.colorMode);
  root.setAttribute('data-circuit-motion', prefs.circuitMotionEnabled ? 'on' : 'off');
  document.body.classList.toggle('dyslexia-font', prefs.dyslexiaFont);
}
