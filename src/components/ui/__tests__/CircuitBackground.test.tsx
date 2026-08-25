import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CircuitBackground from '../CircuitBackground';

describe('CircuitBackground', () => {
  it('renders a decorative processor backdrop hidden from assistive tech', () => {
    const { container } = render(<CircuitBackground />);
    const backdrop = container.firstElementChild;

    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveClass('circuit-bg');
    expect(container.querySelector('.circuit-bg__grid')).not.toBeNull();
    expect(container.querySelectorAll('.circuit-bg__die').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.circuit-bg__trace').length).toBeGreaterThan(0);
  });
});
