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
    expect(theme).toContain('--primary-accent: #ec4899');
    expect(theme).toContain('--secondary-accent: #f9a8d4');
    expect(theme).toContain('--background-main: #0c0618');
    expect(theme).toContain('.circuit-bg');
    expect(theme).toContain('.vibe-page-shell__content');
    expect(theme).toContain('.subject-card');
    expect(theme).toContain('.quick-stat-card');
    expect(theme).toContain('overflow-wrap: anywhere');
  });

  it('keeps Learning Realms on the shared shell instead of navy/gold', () => {
    const realms = read('../../components/dashboard/SubjectCards.tsx');
    expect(realms).toContain('VibePageShell');
    expect(realms).toContain('vibe-hero-title');
    expect(realms).toContain('Pick a subject');
    expect(realms).not.toContain('Enter Realm!');
    expect(realms).not.toContain('#0a0f1c');
    expect(realms).not.toContain('from-yellow-400 via-orange-500 to-red-500');
    expect(realms).not.toContain('bg-[var(--background-main)]');
  });

  it('keeps the Reward Shop on the same shell instead of gray/sky', () => {
    const shop = read('../../components/features/VibebuxRewardShop.tsx');
    expect(shop).toContain('VibePageShell');
    expect(shop).toContain('vibe-hero-title');
    expect(shop).not.toContain('bg-gray-800/50');
    expect(shop).not.toContain('from-purple-500 to-sky-500');
    expect(shop).not.toContain('bg-[var(--background-main)]');
  });

  it('keeps onboarding on the night-sky canvas without the microchip shell', () => {
    const onboarding = read('../../components/core/FirstRunOnboarding.tsx');
    expect(onboarding).toContain('glass-panel');
    expect(onboarding).not.toContain('VibePageShell');
    expect(onboarding).not.toContain('CircuitBackground');
    expect(onboarding).not.toContain('vibe-page-shell');
  });
});
