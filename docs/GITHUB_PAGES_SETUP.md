# GitHub Pages Setup for Vibe Tutor Privacy Policy

This repo includes a workflow that can publish the privacy policy to GitHub Pages.

**Play Console should use the live Cloud Run URL until Pages is confirmed 200 OK:**

`https://vibe-tutor-api-734857480460.us-east4.run.app/privacy`

Expected Pages URL after this repo enables Pages:

`https://freshwaterbruce2.github.io/Vibe-Tutor/privacy-policy/`

(The old `vibetech` Pages URL 404s and must not be submitted.)

## What the workflow publishes

Source file:

- `docs/privacy-policy/index.html`

Published path:

- `/privacy-policy/`

Workflow file:

- `.github/workflows/privacy-policy-pages.yml`

## One-time GitHub setup

1. Open this repository (`freshwaterbruce2/Vibe-Tutor`).
2. Go to `Settings -> Pages`.
3. Under `Build and deployment`, set `Source -> GitHub Actions`.
4. Save.
5. Run the `Privacy Policy Pages` workflow from the Actions tab.

## How deployment works

The workflow runs when:

- code is pushed to `main` and `docs/privacy-policy/**` or the workflow file changes
- or when you run it manually from the Actions tab

## Troubleshooting

### 404 after deploy

Check:

- `Settings -> Pages` is set to `GitHub Actions`
- the workflow ran on `main`
- the deploy job succeeded

Until Pages is live, keep Play Console on the Cloud Run `/privacy` URL.
