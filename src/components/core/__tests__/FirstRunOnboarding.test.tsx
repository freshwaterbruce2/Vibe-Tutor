import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FirstRunOnboarding from '../FirstRunOnboarding';

function completeAgeGate() {
  fireEvent.click(screen.getByRole('button', { name: /i confirm i am 13 or older/i }));
}

describe('FirstRunOnboarding', () => {
  it('requires a 13+ confirmation before role selection', () => {
    render(<FirstRunOnboarding onComplete={vi.fn()} />);

    expect(screen.getByText(/students aged/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /i'm the student/i })).not.toBeInTheDocument();

    completeAgeGate();

    expect(screen.getByRole('button', { name: /i'm the student/i })).toBeInTheDocument();
  });

  it('lets users go back from avatar selection to role selection', () => {
    render(<FirstRunOnboarding onComplete={vi.fn()} />);

    completeAgeGate();
    fireEvent.click(screen.getByRole('button', { name: /i'm the student/i }));

    expect(screen.getByText('Pick your avatar')).toBeInTheDocument();
    const portraitSrcs = screen
      .getAllByRole('img')
      .map((node) => node.getAttribute('src'))
      .filter((value): value is string => Boolean(value));
    expect(portraitSrcs).toHaveLength(6);
    expect(new Set(portraitSrcs).size).toBe(6);
    expect(portraitSrcs.every((src) => src.startsWith('data:image/png;base64,'))).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByText("Who's using this app?")).toBeInTheDocument();
  });

  it('requires explicit confirmation after selecting an avatar', () => {
    render(<FirstRunOnboarding onComplete={vi.fn()} />);

    completeAgeGate();
    fireEvent.click(screen.getByRole('button', { name: /i'm the student/i }));

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();

    const avatarImage = screen.getByRole('img', { name: /focus gamer/i });
    expect(avatarImage).toHaveAttribute('src', expect.stringMatching(/^data:image\/png;base64,/));

    fireEvent.click(screen.getByRole('button', { name: /choose avatar focus gamer/i }));

    expect(screen.getByText('Pick your avatar')).toBeInTheDocument();
    expect(continueButton).toBeEnabled();
  });

  it('prevents duplicate completion submissions while setup is saving', () => {
    const onComplete = vi.fn(
      async () => new Promise<void>(() => {
        // Intentionally unresolved to keep the component in a submitting state.
      }),
    );

    render(<FirstRunOnboarding onComplete={onComplete} />);

    completeAgeGate();
    fireEvent.click(screen.getByRole('button', { name: /i'm the student/i }));
    fireEvent.click(screen.getByRole('button', { name: /choose avatar focus gamer/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    const startButton = screen.getByRole('button', { name: /start earning/i });

    fireEvent.click(startButton);
    fireEvent.click(startButton);

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith({
      avatar: 'avatar-boy-headphones',
      userType: 'kid',
      name: '',
    });
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('captures a display name entered on the final step', async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);
    render(<FirstRunOnboarding onComplete={onComplete} />);

    completeAgeGate();
    fireEvent.click(screen.getByRole('button', { name: /i'm the student/i }));
    fireEvent.click(screen.getByRole('button', { name: /choose avatar focus gamer/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    fireEvent.change(screen.getByLabelText(/what should we call you/i), {
      target: { value: 'Sam' },
    });
    fireEvent.click(screen.getByRole('button', { name: /start earning/i }));

    expect(onComplete).toHaveBeenCalledWith({
      avatar: 'avatar-boy-headphones',
      userType: 'kid',
      name: 'Sam',
    });
  });
});
