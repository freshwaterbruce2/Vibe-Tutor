import { afterEach, describe, expect, it } from 'vitest';
import { applySensoryDom, DEFAULT_SENSORY_PREFERENCES, readSensoryPreferences } from '../sensoryPrefs';
import { appStore } from '../electronStore';

describe('sensoryPrefs', () => {
  afterEach(() => {
    appStore.remove('sensory-prefs');
    document.documentElement.removeAttribute('data-circuit-motion');
    document.documentElement.removeAttribute('data-animation-speed');
  });

  it('defaults circuit motion to on when nothing is saved', () => {
    expect(readSensoryPreferences()).toEqual(DEFAULT_SENSORY_PREFERENCES);
    expect(readSensoryPreferences().circuitMotionEnabled).toBe(true);
  });

  it('keeps circuit motion on for older saved prefs that omit the flag', () => {
    appStore.set('sensory-prefs', {
      animationSpeed: 'reduced',
      soundEnabled: true,
      hapticEnabled: true,
      fontSize: 'large',
      dyslexiaFont: false,
      colorMode: 'cool',
    });

    expect(readSensoryPreferences().circuitMotionEnabled).toBe(true);
    expect(readSensoryPreferences().animationSpeed).toBe('reduced');
  });

  it('applies a still-backdrop flag to the document', () => {
    applySensoryDom({
      ...DEFAULT_SENSORY_PREFERENCES,
      circuitMotionEnabled: false,
    });

    expect(document.documentElement.getAttribute('data-circuit-motion')).toBe('off');
  });
});
