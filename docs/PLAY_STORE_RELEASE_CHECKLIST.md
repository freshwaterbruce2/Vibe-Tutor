# Play Store Release Checklist (Android)

## 1) One-time setup

- Confirm `applicationId` is final: `android/app/build.gradle` -> `com.vibetech.tutor`
- Create signing key + config (LOCAL ONLY)
  - `android/generate-keystore.ps1`
  - Set env vars or `~/.gradle/gradle.properties` (see `android/keystore.properties.template`)
  - Gradle does **not** read `keystore.properties`
  - Verify:
    - `VIBE_TUTOR_KEYSTORE_PATH` / `VIBE_TUTOR_RELEASE_STORE_FILE` points to a keystore **outside** the git tree
    - store password, alias, and key password match

## 2) Backend (required for AI + analytics)

- Ensure your production backend is deployed (Cloud Run / Render)
- Set secrets in the host dashboard (never commit):
  - `GEMINI_API_KEY` (primary provider)
  - `OPENROUTER_API_KEY` (fallback provider)

## 3) Point the app at production

- `src/config.ts` -> `PRODUCTION_BACKEND_URL` (already `https://vibe-tutor-api-734857480460.us-east4.run.app`)
- For local Android debugging, keep the `adb reverse tcp:3001 tcp:3001` flow

## 4) Build release bundle (AAB)

From repo root:

- `pnpm install`
- `pnpm run build`
- `pnpm exec cap sync android`
- `pnpm run android:bundle:release:clean`

If `:app:signReleaseBundle` fails, the `VIBE_TUTOR_*` signing values are missing or wrong.

Output:

- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

`targetSdk` / `compileSdk` must be **36** (Play requirement from 31 Aug 2026).

## 5) Play Console

- Upload `app-release.aab`
- Store listing graphics: `store-assets/` (512 icon, 1024×500 feature graphic, 3 phone screenshots)
- Privacy policy URL (live): `https://vibe-tutor-api-734857480460.us-east4.run.app/privacy`
- Data Safety + permissions: `docs/PLAY_CONSOLE_ANSWER_SHEET.md`
- Microphone: optional voice **homework** entry only (`src/components/dashboard/AddHomeworkModal.tsx`)
- Declare generative AI chat (Tutor + Buddy) and that in-app reporting exists
- Target audience: 13–15 and 16–17 only (not under 13)

## 6) Quick sanity checks

- Release build uses HTTPS-only (debug allows localhost via debug manifest)
- App launches offline without crashing (AI features will show fallback messaging)
- First-run 13+ confirmation is shown before role selection
