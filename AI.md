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

## Cursor Cloud specific instructions

Environment config lives in `.cursor/environment.json` (`install: pnpm install`, `start: pnpm run dev:full`, ports 5173/3001). Standard dev/test/build commands are in the `## Commands` section above and `package.json` — use those.

Non-obvious caveats:

- **Two services.** `pnpm run dev:full` runs the Vite frontend (`http://localhost:5173`) and the Express AI-proxy backend (`http://localhost:3001`) together; Vite proxies `/api` to the backend. Backend health: `GET /api/health`.
- **AI keys are optional.** `GEMINI_API_KEY` / `OPENROUTER_API_KEY` are backend-only secrets. Without them the backend still runs and `/api/health` is healthy, but the in-app AI Tutor/Buddy chat shows "offline" (providers report `false`). The rest of the app (homework, games, dashboards) works fully offline. Add the keys as environment secrets to enable AI chat.
- **`pnpm-lock.yaml` is broken** (duplicate mapping key), so pnpm ignores it and resolves fresh on every install. `pnpm install` still succeeds — do NOT switch to `--frozen-lockfile`, it will fail until the lockfile is regenerated.
- **`pnpm run lint` does not work as-is:** the `lint` script calls `eslint`, but `eslint` is not declared in `package.json` dependencies. Use `pnpm run typecheck` and `pnpm run test:unit` for validation.
