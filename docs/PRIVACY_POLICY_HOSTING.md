# Privacy Policy Hosting

Google Play requires a publicly accessible privacy policy URL.

## URL to paste in Play Console (live now)

`https://vibe-tutor-api-734857480460.us-east4.run.app/privacy`

This is served from the production API (`GET /privacy` in `render-backend/server.mjs`). Confirm it returns 200 before every submission.

## Canonical source files (keep in sync)

- `docs/PRIVACY_POLICY.md`
- `docs/privacy-policy/index.html`
- `public/privacy-policy.html`
- `privacy-policy.html`
- the `/privacy` HTML string in `render-backend/server.mjs`
- in-app copy in `src/components/settings/PrivacyPolicy.tsx`

The in-app settings screen also links to the live URL above.

## Optional GitHub Pages

A workflow at `.github/workflows/privacy-policy-pages.yml` can publish `docs/privacy-policy/index.html` to GitHub Pages if you enable Pages → GitHub Actions on this repo. Until that is live, **do not** use `https://freshwaterbruce2.github.io/vibetech/privacy-policy/` (that URL 404s).

## Change control

- Update the "Last updated" date whenever policy text changes.
- Keep Play Console Data Safety answers aligned with this document.
- Re-verify URL accessibility before every store submission.
