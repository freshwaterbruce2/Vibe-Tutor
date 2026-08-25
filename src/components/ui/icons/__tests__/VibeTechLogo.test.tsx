import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VibeTechLogo } from '../VibeTechLogo';

describe('VibeTechLogo', () => {
  it('labels the in-app logo as Vibe Tutor', () => {
    render(<VibeTechLogo />);

    expect(screen.getByRole('img', { name: 'Vibe Tutor' })).toHaveAttribute('src', '/icon-512.png');
  });
});
