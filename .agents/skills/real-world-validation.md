# Real-World Validation

> Verify UI in a real browser — not by reasoning about it. Screenshots, interactions, and audits reveal what static analysis cannot. An agent that skips validation is guessing.

## When to apply
- Completing any UI change, however small
- After a full redesign or layout rebuild
- Before considering a task done
- Any time a new viewport or device is targeted

## Concrete values

### Viewport Matrix (test all of these)
| Viewport | Width | Device | Test priority |
|---|---|---|---|
| Mobile S | 375px | iPhone SE | Critical |
| Mobile M | 390px | iPhone 14 | Critical |
| Tablet | 768px | iPad | Critical |
| Laptop | 1280px | MacBook | Critical |
| Desktop | 1440px | Standard monitor | Critical |
| Wide | 1920px | Large monitor | Recommended |

### Screenshot File Naming Convention
```
screenshots/
├── [page]-375.png
├── [page]-768.png
├── [page]-1280.png
├── [page]-1440.png
└── baseline/          ← golden files for diff comparison
    ├── [page]-375.png
    └── ...
```

### Lighthouse Thresholds
| Category | Minimum to ship | Hard stop (block ship) |
|---|---|---|
| Performance | 85 | < 70 |
| Accessibility | 95 | < 90 |
| Best Practices | 90 | < 80 |
| SEO | 90 | < 80 |

### Visual Regression Tolerance
- Acceptable pixel diff: < 0.5% of total pixels
- Any diff > 0.5% requires review before merging

## Decision framework
- **If** Playwright MCP is available → use it to automate all screenshot capture and interaction testing
- **If** no MCP → run `npx playwright test` manually for each change
- **If** screenshot shows layout shift → investigate, fix root cause (never adjust threshold to hide it)
- **If** Lighthouse Performance < 85 → fix before shipping, do not lower threshold
- **If** axe-core violations exist → fix all of them — zero is the only acceptable count
- **If** visual diff > 0.5% → inspect diff image, understand the change before approving

## Code examples

### Playwright — Multi-Viewport Screenshot Test
```ts
// e2e/screenshots.spec.ts
import { test } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('Screenshots', () => {
  for (const vp of viewports) {
    test(`homepage at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `screenshots/homepage-${vp.width}.png`,
        fullPage: true,
      });
    });
  }
});
```

### Playwright — Interaction Test (Click Flow)
```ts
test('project card opens detail modal', async ({ page }) => {
  await page.goto('/projects');
  // Click first project card
  await page.click('[data-testid="project-card"]:first-child');
  // Modal should appear
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  // Close with Escape
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});
```

### Playwright — Keyboard Navigation Test
```ts
test('can navigate the page with keyboard only', async ({ page }) => {
  await page.goto('/');
  // Skip link should appear on first Tab
  await page.keyboard.press('Tab');
  await expect(page.locator('a[href="#main-content"]')).toBeFocused();
  // Tab through navigation
  await page.keyboard.press('Enter'); // activate skip link
  const mainContent = page.locator('#main-content');
  await expect(mainContent).toBeFocused();
});
```

### Playwright — Accessibility Audit
```ts
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/projects', '/about', '/contact'];

for (const path of pages) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

### Playwright — Reduced Motion Test
```ts
test('animations are disabled with prefers-reduced-motion', async ({ browser }) => {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/');
  // Check that animation CSS is not present/instant
  const animation = await page.$eval('.reveal', el =>
    getComputedStyle(el).animationDuration
  );
  expect(parseFloat(animation)).toBeLessThan(0.1);
});
```

### Lighthouse CLI Command
```bash
# Single run
npx lhci autorun --collect.url=http://localhost:3000 --assert.preset=lighthouse:recommended

# With config file (see performance.md for lighthouserc.yml)
npx lhci autorun
```

### Playwright Config for Screenshot Testing
```ts
// playwright.config.ts
export default {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
};
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| Skipping validation for "small changes" | Small changes cause CLS and layout regressions | Run screenshots on every change |
| Testing only at 1440px | Misses mobile layout bugs | Test all 5 viewports in the matrix |
| Reasoning about what the UI looks like | Layout is only real in a browser | Capture screenshots, inspect real output |
| Lowering Lighthouse thresholds when score drops | Hides performance regressions | Fix the underlying issue |
| Accepting axe-core violations as "not critical" | Inaccessible for real users | Zero violations is the standard |
| Screenshot without `waitForLoadState('networkidle')` | Captures loading state, not final UI | Always wait for network idle |

## Done checks
- [ ] Screenshots captured at 375px, 768px, 1280px, and 1440px for changed pages.
- [ ] No unexpected layout shift visible between before and after screenshots.
- [ ] Interaction test passes for key user flows (navigation, clicks, forms).
- [ ] Keyboard navigation tested (Tab through all interactive elements).
- [ ] Axe-core returns zero violations on all primary pages.
- [ ] Lighthouse Performance ≥ 85 and Accessibility ≥ 95 on changed pages.
- [ ] Reduced-motion test passes — animations disabled when preference is set.
- [ ] All tests pass on `chromium` and `mobile` viewport configurations.
