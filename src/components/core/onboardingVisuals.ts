import { AVATAR_CHARACTERS } from '@vibetech/avatars';

export interface OnboardingAvatarOption {
  id: string;
  imagePath: string;
  fallbackEmoji: string;
  name: string;
  subtitle: string;
  gradientClass: string;
}

export const ONBOARDING_BRAND = {
  title: 'Vibe Tutor',
  subtitle: 'Learning with confidence, one step at a time.',
};

const AVATAR_GRADIENTS = [
  'from-violet-500 to-fuchsia-500',
  'from-fuchsia-500 to-pink-400',
  'from-indigo-500 to-violet-500',
  'from-pink-500 to-fuchsia-500',
  'from-cyan-400 to-violet-500',
  'from-violet-500 to-cyan-400',
] as const;

export const ONBOARDING_AVATARS: OnboardingAvatarOption[] = AVATAR_CHARACTERS.map(
  (character, index) => ({
    id: character.id,
    imagePath: character.imagePath,
    fallbackEmoji: character.fallbackEmoji,
    name: character.name,
    subtitle: character.description,
    gradientClass: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
  }),
);
