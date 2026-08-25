import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RealmView from '../RealmView';

vi.mock('../../games/AnagramsGame', () => ({ default: () => <div>Anagrams</div> }));
vi.mock('../../games/CrosswordGame', () => ({ default: () => <div>Crossword</div> }));
vi.mock('../../games/MathAdventureGame', () => ({ default: () => <div>Math Adventure Game</div> }));
vi.mock('../../games/WordBuilderGame', () => ({ default: () => <div>Word Builder</div> }));
vi.mock('../../games/MusicNotesGame', () => ({ default: () => <div>Music Notes</div> }));
vi.mock('../../games/BossBattleGame', () => ({ default: () => <div>Boss Battle</div> }));

const noopEarn = vi.fn();

describe('RealmView', () => {
  it('offers practice questions and games in plain language', () => {
    const onStartWorksheet = vi.fn();
    render(
      <RealmView
        subject="Math"
        onStartWorksheet={onStartWorksheet}
        onBack={vi.fn()}
        onEarnTokens={noopEarn}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Math' })).toBeInTheDocument();
    expect(screen.getByText(/Practice 10 questions to earn stars/)).toBeInTheDocument();
    expect(screen.queryByText(/Embark on Quest/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Side Quests/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Practice 10 questions/ }));
    expect(onStartWorksheet).toHaveBeenCalledWith('Math');

    expect(screen.getByRole('heading', { name: 'Or play a game' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Math Adventure/ })).toBeInTheDocument();
  });

  it('hides the game list when a subject has no games', () => {
    render(
      <RealmView
        subject="Bible"
        onStartWorksheet={vi.fn()}
        onBack={vi.fn()}
        onEarnTokens={noopEarn}
      />,
    );

    expect(screen.getByRole('button', { name: /Practice 10 questions/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Or play a game' })).not.toBeInTheDocument();
  });

  it('returns to the subject list', () => {
    const onBack = vi.fn();
    render(
      <RealmView subject="Science" onStartWorksheet={vi.fn()} onBack={onBack} onEarnTokens={noopEarn} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /All subjects/ }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
