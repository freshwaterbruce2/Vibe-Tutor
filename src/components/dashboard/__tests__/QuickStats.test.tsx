import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import QuickStats from '../QuickStats';

describe('QuickStats', () => {
  it('keeps every stat label inside an overflow-safe stacked card', () => {
    const { container } = render(<QuickStats items={[]} />);

    expect(container.querySelector('.quick-stats-grid')).not.toBeNull();
    expect(screen.getByText('Completed Today')).toBeInTheDocument();
    expect(screen.getByText('Due Today')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toHaveClass('quick-stat-label');

    const cards = container.querySelectorAll('.quick-stat-card');
    expect(cards).toHaveLength(4);
    expect(container.querySelector('.lg\\:grid-cols-4')).toBeNull();
    expect(container.querySelector('.hover\\:scale-105')).toBeNull();
  });

  it('does not use a four-column grid that squeezes split-pane cards', () => {
    const source = readFileSync(resolve(__dirname, '../QuickStats.tsx'), 'utf8');
    expect(source).not.toContain('lg:grid-cols-4');
    expect(source).not.toContain('hover:scale-105');
    expect(source).toContain('quick-stat-card');
    expect(source).toContain('quick-stat-label');
  });
});
