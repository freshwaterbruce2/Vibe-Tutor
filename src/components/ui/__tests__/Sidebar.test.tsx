import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Sidebar from '../Sidebar';

const defaultProps = {
  currentView: 'dashboard' as const,
  onNavigate: vi.fn(),
};

describe('Sidebar', () => {
  it('greets the user by name when userName is provided', () => {
    render(<Sidebar {...defaultProps} userName="Blake" />);

    const subtitles = screen.getAllByText((_, element) =>
      Boolean(element?.textContent?.includes('Blake')),
    );
    expect(subtitles.length).toBeGreaterThan(0);
  });

  it('falls back to the default greeting name when userName is not provided', () => {
    render(<Sidebar {...defaultProps} />);

    const subtitles = screen.getAllByText((_, element) =>
      Boolean(element?.textContent?.includes('Friend')),
    );
    expect(subtitles.length).toBeGreaterThan(0);
  });

  it('falls back to the default greeting name when userName is blank', () => {
    render(<Sidebar {...defaultProps} userName="   " />);

    const subtitles = screen.getAllByText((_, element) =>
      Boolean(element?.textContent?.includes('Friend')),
    );
    expect(subtitles.length).toBeGreaterThan(0);
  });

  it('shows the Vibe Tutor app name in the header', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Vibe Tutor' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Vibe Tutor' })).toBeInTheDocument();
    expect(screen.queryByText('Vibe-Tech')).not.toBeInTheDocument();
  });

  it('uses plain labels and distinct nav glyphs instead of emoji or neon strokes', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Reward Shop' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subjects' })).toBeInTheDocument();
    expect(screen.queryByText('🛒 Reward Shop')).not.toBeInTheDocument();
    expect(screen.queryByText('Learning Realms')).not.toBeInTheDocument();
    expect(document.querySelector('.gradient-icon-glow')).toBeNull();
  });
});
