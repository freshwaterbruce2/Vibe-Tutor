import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SensorySettings from '../SensorySettings';
import { appStore } from '../../../utils/electronStore';

describe('SensorySettings', () => {
  afterEach(() => {
    appStore.remove('sensory-prefs');
    document.documentElement.removeAttribute('data-circuit-motion');
  });

  it('lets the user freeze processor backdrop motion without turning off all animation', () => {
    render(<SensorySettings />);

    const toggle = screen.getByRole('switch', { name: 'Moving background' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement.getAttribute('data-circuit-motion')).toBe('off');
    expect(document.documentElement.getAttribute('data-animation-speed')).toBe('normal');
  });
});
