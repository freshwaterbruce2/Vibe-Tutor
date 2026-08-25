import { describe, expect, it } from 'vitest';
import { SUBJECTS, SUBJECT_THEME } from '../subjectTheme';

describe('subject theme', () => {
  it('gives every subject its own color family and icon', () => {
    const gradients = SUBJECTS.map((subject) => SUBJECT_THEME[subject].gradient);
    const icons = SUBJECTS.map((subject) => SUBJECT_THEME[subject].icon.displayName);

    expect(new Set(gradients).size).toBe(SUBJECTS.length);
    expect(new Set(icons).size).toBe(SUBJECTS.length);
    expect(new Set(SUBJECTS.map((subject) => SUBJECT_THEME[subject].glow)).size).toBe(
      SUBJECTS.length,
    );
    expect(SUBJECT_THEME.Math.gradient).toContain('cyan');
    expect(SUBJECT_THEME.Science.gradient).toContain('emerald');
    expect(SUBJECT_THEME.History.gradient).toContain('amber');
    expect(SUBJECT_THEME.Bible.gradient).toContain('violet');
    expect(SUBJECT_THEME['Language Arts'].gradient).toContain('fuchsia');
    expect(icons).toEqual(['Calculator', 'FlaskConical', 'Landmark', 'BookMarked', 'PenLine']);
    expect(SUBJECT_THEME.Math.wash).toContain('0.94');
    expect(SUBJECT_THEME.Science.wash).toContain('0.94');
  });
});
