# vibe-tutor AI Notes

## What this project is

Standalone PWA + Capacitor Android + Electron desktop app for homework/tutoring, with the AI proxy in `render-backend/`.

This repo is the complete project. Do not look for a parent Nx monorepo.

## Commands

- Web: `pnpm run dev`
- Web + local API: `pnpm run dev:full`
- Backend only: `pnpm run start`
- Typecheck: `pnpm run typecheck`
- Unit tests: `pnpm run test:unit`
- Production web build: `pnpm run build`
- Android:
  - `pnpm run android:sync`
  - `pnpm run android:build`
  - `pnpm run android:full-release` (needs `android/keystore.properties`)

## Shared packages

`@vibetech/avatars` and `@vibetech/games/tutor` resolve to `packages/` via Vite/TS path aliases.

## Storage

Keep generated logs and databases out of git. On the original Windows machine they lived on `D:\` per workspace policy.
