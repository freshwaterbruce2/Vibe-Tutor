# Source of truth

This repo is the **complete standalone Vibe Tutor project**. Use this tree for Play Store work, local development, and backend deploys.

## What is in this repo

| Path | Role |
|------|------|
| `src/` | React app (homework, tutor, games, parent controls) |
| `android/` | Capacitor Android project (`com.vibetech.tutor`) |
| `electron/` | Windows desktop wrapper |
| `render-backend/` | Production AI proxy (`server.mjs`) |
| `packages/avatars` | Vendored avatar package (was monorepo `@vibetech/avatars`) |
| `packages/games` | Vendored Brain Gym / tutor games (was monorepo `@vibetech/games`) |

App version: **1.5.12**

Production API used by the client:

`https://vibe-tutor-api-734857480460.us-east4.run.app`

That Cloud Run service was healthy when this snapshot was taken. The same server code lives in `render-backend/`.

## Other repos (do not treat as the Play Store app)

| Repo | What it is | Use it? |
|------|------------|---------|
| [freshwaterbruce2/Vibe-Tutor](https://github.com/freshwaterbruce2/Vibe-Tutor) | Older standalone extract (v1.5.9), empty `render-backend/` | Replaced by this snapshot |
| [freshwaterbruce2/vibe-tech-monorepo](https://github.com/freshwaterbruce2/vibe-tech-monorepo) `apps/vibe-tutor` | Newer copy of this app (v1.5.12) | Upstream we synced from |
| [freshwaterbruce2/vibe-tech-monorepo](https://github.com/freshwaterbruce2/vibe-tech-monorepo) `apps/vibe-tutor-mobile` | Experimental Expo/React Native shell (v1.6.0, 8 source files) | Not the working Play Store app |
| [freshwaterbruce2/vibe-tutor-api](https://github.com/freshwaterbruce2/vibe-tutor-api) | Older extracted backend | Superseded by `render-backend/` here |
| [freshwaterbruce2/vibe-tutor-backend](https://github.com/freshwaterbruce2/vibe-tutor-backend) | Even older backend + leftover Vite app deps | Ignore |
| [freshwaterbruce2/vibetech](https://github.com/freshwaterbruce2/vibetech) | Archived monorepo | Ignore |

`vibe-tutor` and `Vibe-Tutor` on GitHub are the same repository (case-insensitive).

## Local commands

```bash
pnpm install
pnpm run dev:full          # web app + local API
pnpm run test:unit
pnpm run build
pnpm run android:full-release   # after keystore.properties exists
```
