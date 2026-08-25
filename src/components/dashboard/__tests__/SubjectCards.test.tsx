import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { SubjectProgress, SubjectType } from '../../../types';

vi.mock('../../../services/progressionService', () => ({
  getAllProgress: vi.fn(() => new Promise(() => {})),
}));

vi.mock('../../../services/tokenService', () => ({
  getTodayEarnings: vi.fn(() => 0),
}));

import SubjectCards from '../SubjectCards';
import { getAllProgress } from '../../../services/progressionService';
import { getTodayEarnings } from '../../../services/tokenService';

const SUBJECTS: SubjectType[] = ['Math', 'Science', 'History', 'Bible', 'Language Arts'];

function makeProgress(
  subject: SubjectType,
  overrides: Partial<SubjectProgress> = {},
): SubjectProgress {
  return {
    subject,
    currentDifficulty: 'Beginner',
    starsCollected: 0,
    totalWorksheetsCompleted: 0,
    averageScore: 0,
    bestScore: 0,
    currentStreak: 0,
    history: [],
    unlockedAt: 0,
    ...overrides,
  };
}

describe('SubjectCards', () => {
  beforeEach(() => {
    vi.mocked(getAllProgress).mockReset();
    vi.mocked(getAllProgress).mockReturnValue(new Promise(() => {}));
    vi.mocked(getTodayEarnings).mockReturnValue(0);
  });

  it('shows every subject before progress finishes loading', () => {
    render(<SubjectCards onStartWorksheet={vi.fn()} userTokens={12} />);

    expect(screen.getByText('Pick a subject')).toBeInTheDocument();
    for (const subject of SUBJECTS) {
      expect(screen.getByRole('button', { name: new RegExp(`Practice ${subject}`) })).toBeInTheDocument();
    }
    expect(screen.queryByText('Enter Realm!')).not.toBeInTheDocument();
    expect(screen.getAllByText('Start here').length).toBe(1);
  });

  it('opens the tapped subject', () => {
    const onStartWorksheet = vi.fn();
    render(<SubjectCards onStartWorksheet={onStartWorksheet} userTokens={0} />);

    fireEvent.click(screen.getByRole('button', { name: /Practice Math/ }));
    expect(onStartWorksheet).toHaveBeenCalledWith('Math');
  });

  it('explains the three steps in plain language', () => {
    render(<SubjectCards onStartWorksheet={vi.fn()} userTokens={0} />);

    expect(
      screen.getByText('Tap a card · Practice or play · Earn stars'),
    ).toBeInTheDocument();
  });

  it('keeps a Start here badge on the first unfinished subject after progress loads', async () => {
    vi.mocked(getAllProgress).mockResolvedValue({
      Math: makeProgress('Math', { totalWorksheetsCompleted: 2, starsCollected: 3 }),
      Science: makeProgress('Science'),
      History: makeProgress('History', { totalWorksheetsCompleted: 1, starsCollected: 1 }),
      Bible: makeProgress('Bible'),
      'Language Arts': makeProgress('Language Arts'),
    });

    render(<SubjectCards onStartWorksheet={vi.fn()} userTokens={4} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Practice Science/ })).toHaveTextContent(
        'Start here',
      );
      expect(screen.getByRole('button', { name: /Practice Math/ })).not.toHaveTextContent(
        'Start here',
      );
    });
  });
});
