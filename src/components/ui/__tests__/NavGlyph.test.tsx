import { Store } from 'lucide-react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NavGlyph from '../NavGlyph';

describe('NavGlyph', () => {
  it('renders a decorative icon well', () => {
    const { container } = render(<NavGlyph icon={Store} />);
    const well = container.querySelector('span[aria-hidden="true"]');

    expect(well).not.toBeNull();
    expect(well?.querySelector('svg')).not.toBeNull();
  });

  it('marks the active well without a neon glow class', () => {
    const { container } = render(<NavGlyph icon={Store} active />);

    expect(container.firstElementChild).toHaveClass('bg-white/20');
    expect(container.querySelector('.gradient-icon-glow')).toBeNull();
  });
});
