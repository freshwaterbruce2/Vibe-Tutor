import { describe, expect, it } from 'vitest';
import { AVATAR_CHARACTERS } from './characters';

describe('AVATAR_CHARACTERS', () => {
  it('ships six unique portraits and unique fallbacks', () => {
    expect(AVATAR_CHARACTERS).toHaveLength(6);

    const imagePaths = AVATAR_CHARACTERS.map((character) => character.imagePath);
    const fallbacks = AVATAR_CHARACTERS.map((character) => character.fallbackEmoji);

    expect(new Set(imagePaths).size).toBe(6);
    expect(new Set(fallbacks).size).toBe(6);
    expect(imagePaths.every((path) => path.includes('avatar-'))).toBe(true);
    expect(fallbacks).not.toContain('🎭');
  });
});
