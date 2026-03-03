# Accessibility

> Build UI that works for keyboard users, screen reader users, and users with motion sensitivity. Polished design includes accessibility — it's not an afterthought.

## When to apply
- Building or changing any interactive UI element
- Implementing navigation, forms, dialogs, or custom controls
- Adding animations or motion effects
- Any time you use a non-semantic element for an interactive role

## Concrete values

### Contrast Requirements (WCAG AA)
| Text type | Minimum ratio | Target |
|---|---|---|
| Normal text (< 18px or < 14px bold) | 4.5:1 | 7:1 (AAA) |
| Large text (≥ 18px or ≥ 14px bold) | 3:1 | 4.5:1 |
| UI components (borders, icons) | 3:1 | 4.5:1 |
| Disabled elements | exempt | — |

Check with: `npx @a11y/contrast-checker` or browser DevTools → Accessibility panel.

### Touch / Click Target Sizes
- Minimum: 44×44px (WCAG 2.1 AA)
- Preferred: 48×48px
- Gap between targets: 8px minimum
- Apply `min-h-[44px] min-w-[44px]` on all interactive elements

### Semantic HTML Reference
| Need | Element | Not |
|---|---|---|
| Primary page landmark | `<main>` | `<div id="main">` |
| Navigation group | `<nav aria-label="Primary">` | `<div class="nav">` |
| Independent content | `<article>` | `<div class="post">` |
| Grouped related content | `<section aria-labelledby="...">` | `<div class="section">` |
| Supporting content | `<aside>` | `<div class="sidebar">` |
| Page banner | `<header>` | `<div class="header">` |
| Page footer | `<footer>` | `<div class="footer">` |
| Clickable action | `<button>` | `<div onClick>` |
| Navigation target | `<a href="...">` | `<div onClick="navigate">` |

### ARIA Rules
| Situation | ARIA attribute | Example |
|---|---|---|
| Icon button (no text) | `aria-label` | `<button aria-label="Close menu">` |
| Toggle button | `aria-expanded` | `<button aria-expanded={isOpen}>` |
| Custom control | `role` + `aria-` | `<div role="checkbox" aria-checked={checked}>` |
| Live region (updates) | `aria-live="polite"` | Status messages, cart count |
| Loading state | `aria-busy="true"` | While fetching |
| Error message | `aria-describedby` | Links input to error text |
| Required field | `aria-required="true"` | Form fields |
| Hidden from AT | `aria-hidden="true"` | Decorative icons |

**Rule**: use native HTML first. Add ARIA only when native semantics are insufficient.

## Decision framework
- **If** element is clickable → use `<button>` (not div). Full stop.
- **If** element navigates → use `<a href>`. Full stop.
- **If** custom control needed → use Radix primitive before rolling custom ARIA
- **If** animation → check `prefers-reduced-motion` and disable non-essential motion
- **If** icon button → add `aria-label`. If icon + text → `aria-hidden="true"` on icon
- **If** modal/dialog → use Radix Dialog (handles focus trap and aria automatically)
- **If** form field → always pair with `<label htmlFor="...">`, never `placeholder` only

## Code examples

### Skip Link (Required)
```html
<!-- First element inside <body> -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-neutral-900 focus:rounded-lg focus:shadow-lg"
>
  Skip to main content
</a>
```

### Focus Ring (Custom, Accessible)
```css
/* Replace browser default, don't remove it */
:focus-visible {
  outline: 2px solid var(--color-neutral-900);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
/* Remove for mouse users only */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Accessible Form Field
```tsx
function FormField({ id, label, error, required, ...inputProps }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={cn('input', error && 'border-red-500')}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Reduced Motion
```tsx
// React hook
import { useEffect, useState } from 'react';
export function useReducedMotion() {
  const [shouldReduce, setShouldReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduce(mq.matches);
    mq.addEventListener('change', e => setShouldReduce(e.matches));
  }, []);
  return shouldReduce;
}
```
```css
/* CSS approach — always include this */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Icon Button (Accessible)
```tsx
// Icon only → aria-label required
<button aria-label="Close dialog" className="min-h-[44px] min-w-[44px] flex items-center justify-center">
  <XIcon className="size-5" aria-hidden="true" />
</button>

// Icon + text → hide icon from AT
<button>
  <SearchIcon className="size-4" aria-hidden="true" />
  Search
</button>
```

### Axe-Core Test (Playwright)
```ts
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| `<div onClick={fn}>` | No keyboard access, no role for AT | Use `<button>` |
| `outline: none` | Removes focus indicator for keyboard users | Use `focus-visible` ring |
| `placeholder` as only label | Disappears on type, fails contrast | Use `<label>` + optional placeholder |
| Color as only error indicator | Fails for color-blind users | Add icon + text to error state |
| `aria-label` duplicating visible text | Redundant, adds noise for AT | Use `aria-label` only when text is absent |
| Positive `tabindex` values | Breaks natural tab order | Only `tabindex="0"` (or -1 to remove from tab order) |

## Done checks
- [ ] All actions reachable via keyboard (Tab, Enter, Space, Escape, arrow keys where applicable).
- [ ] Skip link is first element in body, visible on focus.
- [ ] Focus rings visible on all interactive elements on all backgrounds.
- [ ] Body text on default background ≥ 4.5:1 contrast.
- [ ] All icon buttons have `aria-label`.
- [ ] All form fields have `<label>` with `htmlFor` — no placeholder-only fields.
- [ ] Reduced-motion preference removes non-essential animation.
- [ ] Axe-core scan returns zero violations on primary pages.
- [ ] Modal/dialog uses focus trap (Radix Dialog or equivalent).
