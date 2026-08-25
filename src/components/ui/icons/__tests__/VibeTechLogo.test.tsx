import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VibeTechLogo } from '../VibeTechLogo';

describe('VibeTechLogo', () => {
  it('labels the mark as the Vibe-Tech company, not the Vibe Tutor app', () => {
    render(<VibeTechLogo />);

    expect(screen.getByRole('img', { name: 'Vibe-Tech' })).toHaveAttribute('src', '/icon-512.png');
  });
});
