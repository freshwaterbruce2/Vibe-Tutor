import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VibePageShell from '../VibePageShell';

describe('VibePageShell', () => {
  it('puts the microchip backdrop behind page content', () => {
    const { container } = render(
      <VibePageShell className="min-h-screen">
        <h1>Pick a subject</h1>
      </VibePageShell>,
    );

    expect(container.querySelector('.vibe-page-shell')).not.toBeNull();
    expect(container.querySelector('.circuit-bg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('heading', { name: 'Pick a subject' })).toBeInTheDocument();
  });
});
