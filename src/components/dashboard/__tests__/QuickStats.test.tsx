import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import QuickStats from '../QuickStats';

describe('QuickStats', () => {
  it('renders all four stats as two-column tiles, not squeezed glass cards', () => {
    const { container } = render(<QuickStats items={[]} />);

    expect(screen.getByRole('region', { name: 'Quick stats' })).toHaveClass('grid-cols-2');
    expect(screen.getByText('Completed Today')).toBeInTheDocument();
    expect(screen.getByText('Due Today')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(container.querySelector('.glass-card')).toBeNull();
    expect(container.querySelector('.lg\\:grid-cols-4')).toBeNull();
  });

  it('does not clip labels with overflow-hidden or a four-column split-pane grid', () => {
    const source = readFileSync(resolve(__dirname, '../QuickStats.tsx'), 'utf8');
    expect(source).not.toContain('lg:grid-cols-4');
    expect(source).not.toContain('overflow-hidden');
    expect(source).not.toContain('hover:scale-105');
    expect(source).not.toContain('glass-card');
    expect(source).toContain('grid-cols-2');
    expect(source).toContain('pr-8');
  });
});
