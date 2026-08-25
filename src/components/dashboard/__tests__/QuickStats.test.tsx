import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import QuickStats from '../QuickStats';

describe('QuickStats', () => {
  it('keeps every stat label inside an overflow-safe card', () => {
    const { container } = render(<QuickStats items={[]} />);

    expect(screen.getByText('Completed Today')).toBeInTheDocument();
    expect(screen.getByText('Due Today')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();

    const cards = container.querySelectorAll('.glass-card');
    expect(cards).toHaveLength(4);
    for (const card of cards) {
      expect(card).toHaveClass('min-w-0');
      expect(card).toHaveClass('overflow-hidden');
    }
  });
});
