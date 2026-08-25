import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (relativePath: string) => readFileSync(resolve(__dirname, relativePath), 'utf8');

describe('shared neon glass page chrome', () => {
  it('defines one page shell and hero title for Realms and Shop', () => {
    const theme = read('../theme.css');
    expect(theme).toContain('.vibe-page-shell');
    expect(theme).toContain('.vibe-hero-title');
    expect(theme).toContain('.vibe-cta');
    expect(theme).toContain('--primary-accent: #e879f9');
    expect(theme).toContain('--secondary-accent: #f9a8d4');
  });

  it('keeps Learning Realms on the shared shell instead of navy/gold', () => {
    const realms = read('../../components/dashboard/SubjectCards.tsx');
    expect(realms).toContain('vibe-page-shell');
    expect(realms).toContain('vibe-hero-title');
    expect(realms).not.toContain('#0a0f1c');
    expect(realms).not.toContain('from-yellow-400 via-orange-500 to-red-500');
  });

  it('keeps the Reward Shop on the same shell instead of gray/sky', () => {
    const shop = read('../../components/features/VibebuxRewardShop.tsx');
    expect(shop).toContain('vibe-page-shell');
    expect(shop).toContain('vibe-hero-title');
    expect(shop).not.toContain('bg-gray-800/50');
    expect(shop).not.toContain('from-purple-500 to-sky-500');
  });
});
