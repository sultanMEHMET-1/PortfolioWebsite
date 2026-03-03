# Quality Gates

Three gate levels that UI work must pass before moving to the next stage. Gates are sequential — you cannot pass Gate 2 without Gate 1, and Gate 3 without Gate 2.

**If a gate is missing (scripts not configured), create or wire the script before continuing UI work.**

---

## Gate 1 — Pre-Commit (before every commit)

These checks must pass before any UI code is committed.

| Check | Command | Pass condition |
|---|---|---|
| Type checking | `npx tsc --noEmit` | Zero errors |
| Lint | `npx eslint src/` | Zero errors (warnings allowed) |
| Unit tests | `npm run test` or `npx vitest` | All tests pass |
| No console.log in components | `grep -r "console.log" src/components` | Zero results |
| Tokens only | Inspect changed files | No raw hex/rgb values in component files |

**If any Gate 1 check fails:** fix immediately before committing. Do not use `--no-verify`.

---

## Gate 2 — Pre-Merge (before merging a branch or completing a task)

These checks must pass before considering a feature or task complete.

| Check | Command | Pass condition |
|---|---|---|
| E2E tests | `npx playwright test` | All tests pass |
| Screenshots captured | `npm run ui:shots` | Files exist at 375, 768, 1280, 1440px for all changed pages |
| Accessibility scan | `npm run ui:a11y` or `npx axe-core-cli http://localhost:3000` | Zero violations |
| Lighthouse — Performance | `npx lhci autorun` | Score ≥ 85 |
| Lighthouse — Accessibility | `npx lhci autorun` | Score ≥ 95 |
| Visual diff | `npm run ui:diff` | Pixel diff < 0.5% for unchanged pages |
| Mobile check | Playwright mobile viewport | No overflow at 375px |

**Definition of ready to merge**: all Gate 2 checks pass AND all items in `policies/definition-of-done.md` are checked.

**If a Gate 2 check fails:** fix the issue. Do not lower thresholds. Do not merge with failing gates.

---

## Gate 3 — Pre-Deploy (before deploying to production)

These checks must pass before deploying to a live environment.

| Check | Method | Pass condition |
|---|---|---|
| Real device test | Physical device or BrowserStack | Renders correctly on iOS Safari + Chrome Android |
| Load time (throttled) | Lighthouse with throttling | LCP < 2.5s on Slow 3G |
| No layout shift | Lighthouse CLS audit | CLS < 0.1 |
| All pages accessible | Axe-core on all primary pages | Zero violations |
| Fonts load correctly | Browser Network tab | `font-display: swap`, no invisible text |
| No broken links | `npx linkinator http://localhost:3000` | Zero 404s |
| Environment variables | Check `.env.example` | All required vars are documented |

**Gate 3 is the release gate.** If any check fails, do not deploy. Fix, rerun Gate 2 checks on changed code, then rerun Gate 3.

---

## Setting Up Gates (if not configured)

### Playwright
```bash
npm i -D @playwright/test @axe-core/playwright
npx playwright install
```

Add to `package.json`:
```json
{
  "scripts": {
    "ui:test": "playwright test",
    "ui:shots": "playwright test e2e/screenshots.spec.ts",
    "ui:a11y": "playwright test e2e/accessibility.spec.ts"
  }
}
```

### Lighthouse CI
```bash
npm i -D @lhci/cli
```

Add `lighthouserc.yml`:
```yaml
ci:
  collect:
    url: ['http://localhost:3000']
    startServerCommand: 'npm run start'
  assert:
    assertions:
      'categories:performance': ['warn', { minScore: 0.85 }]
      'categories:accessibility': ['error', { minScore: 0.95 }]
      'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
```

Add to `package.json`:
```json
{
  "scripts": {
    "ui:lighthouse": "lhci autorun"
  }
}
```

---

## Gate Failure Protocol

1. **Identify** which specific check failed and why.
2. **Fix** the root cause — do not adjust thresholds to hide failures.
3. **Rerun** only the failing checks to confirm the fix.
4. **Rerun** the full gate to confirm nothing regressed.
5. **Document** in the commit message if the failure revealed a systemic issue that needs a follow-up task.

**Never**: comment out tests, skip gates with flags, merge with known failures, or accept "we'll fix it in the next PR."
