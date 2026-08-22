# Vendored VibeTech packages

These packages originally lived in `freshwaterbruce2/vibe-tech-monorepo/packages`.
They are copied here so Vibe Tutor can build as a standalone repo.

- `avatars` — shared avatar types and preview components
- `games` — Brain Gym / tutor minigames used by the app via `@vibetech/games/tutor`

Vite, Vitest, and TypeScript resolve `@vibetech/*` to these folders. Do not add `workspace:*` dependencies.
