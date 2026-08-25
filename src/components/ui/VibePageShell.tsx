import type { HTMLAttributes, ReactNode } from 'react';
import CircuitBackground from './CircuitBackground';

interface VibePageShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Shared Subjects / Shop / realm canvas: microchip backdrop stays behind content. */
const VibePageShell = ({ children, className = '', ...rest }: VibePageShellProps) => {
  return (
    <div className={`vibe-page-shell ${className}`.trim()} {...rest}>
      <CircuitBackground />
      <div className="vibe-page-shell__content">{children}</div>
    </div>
  );
};

export default VibePageShell;
