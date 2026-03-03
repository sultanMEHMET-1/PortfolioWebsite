# Responsive Design

> Create layouts that adapt gracefully across screens using mobile-first, fluid units, and intentional density changes — not just column stacking.

## When to apply

- Defining breakpoints and container behavior
- Building mobile layouts
- Adapting components across screen sizes
- Setting touch target sizes

## Concrete values

### Breakpoints

| Token | px     | Tailwind | Target                          |
| ----- | ------ | -------- | ------------------------------- |
| sm    | 640px  | `sm:`    | Large phones landscape          |
| md    | 768px  | `md:`    | Tablets portrait                |
| lg    | 1024px | `lg:`    | Tablets landscape / small laptops |
| xl    | 1280px | `xl:`    | Laptops / standard desktops     |
| 2xl   | 1536px | `2xl:`   | Large desktops / wide monitors  |

### Testing Viewports

| Device     | Width  | Tailwind prefix |
| ---------- | ------ | --------------- |
| iPhone SE  | 375px  | (base)          |
| iPhone 14  | 390px  | (base)          |
| iPad       | 768px  | `md:`           |
| Laptop     | 1280px | `xl:`           |
| Desktop    | 1440px | `xl:` or `2xl:` |
| Wide       | 1920px | `2xl:`          |

### Touch Targets

- Minimum: 44x44px (WCAG 2.1 AA)
- Preferred: 48x48px
- Minimum gap between targets: 8px
- Tailwind: `min-h-[44px] min-w-[44px]` or `min-h-11 min-w-11`

### Fluid Spacing

| Use                    | Formula                        | Range        |
| ---------------------- | ------------------------------ | ------------ |
| Section padding        | `clamp(2rem, 5vw, 4rem)`      | 32px - 64px  |
| Container side padding | `clamp(1rem, 3vw, 2rem)`      | 16px - 32px  |
| Component gaps         | `clamp(0.75rem, 2vw, 1.5rem)` | 12px - 24px  |

### Navigation Patterns

| Breakpoint    | Pattern                                                        |
| ------------- | -------------------------------------------------------------- |
| Base (mobile) | Hamburger menu with slide-out drawer or bottom sheet           |
| md (tablet)   | Condensed horizontal nav, may still use hamburger              |
| lg+ (desktop) | Full horizontal nav with all items visible                     |

Never hide primary navigation entirely — always accessible via hamburger at minimum.

### Image Responsiveness

- Use `srcset` with 640w, 1024w, 1536w breakpoints
- Use `sizes` attribute to tell the browser which size to load
- Always set `width` and `height` attributes to prevent CLS
- Use `object-fit: cover` for hero/background images
- `loading="lazy"` for below-fold images, `loading="eager"` for hero

## Decision framework

- Always start mobile-first — scale UP, never desktop-first scaling down.
- If a component renders in different contexts — use container queries (`@container`).
- If content wraps awkwardly at a breakpoint — adjust layout density, don't just change font size.
- If a touch target is too small on mobile — increase padding, not just font size.
- If an image is decorative — hide on mobile with `hidden md:block` for performance.
- If navigation has >5 items — hamburger at base, horizontal at `lg+`.
- If grid cards — use `auto-fill` with `minmax()` instead of manual column counts.

## Code examples

### Tailwind — Mobile-First Responsive Grid

```html
<!-- 1 col mobile, 2 col tablet, 3 col desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  <div class="...">Card 1</div>
  <div class="...">Card 2</div>
  <div class="...">Card 3</div>
</div>
```

### Tailwind — Responsive Navigation

```html
<nav class="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
  <a href="/" class="text-lg font-semibold">Logo</a>
  <!-- Desktop nav -->
  <div class="hidden lg:flex items-center gap-6">
    <a href="/about" class="text-sm text-neutral-600 hover:text-neutral-900">About</a>
    <!-- more links -->
  </div>
  <!-- Mobile hamburger -->
  <button
    class="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
    aria-label="Open menu"
  >
    <svg>...</svg>
  </button>
</nav>
```

### CSS — Fluid Section with Container Query

```css
.section {
  padding-block: clamp(2rem, 5vw, 4rem);
  padding-inline: clamp(1rem, 3vw, 2rem);
}

.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### Tailwind — Responsive Image

```html
<img
  src="/hero.webp"
  srcset="/hero-640.webp 640w, /hero-1024.webp 1024w, /hero-1536.webp 1536w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  width="1536"
  height="864"
  alt="Description"
  class="w-full h-auto object-cover rounded-lg"
  loading="lazy"
/>
```

## Anti-patterns

| Bad                                      | Why                            | Fix                                                      |
| ---------------------------------------- | ------------------------------ | -------------------------------------------------------- |
| `@media (max-width: 768px)`              | Desktop-first causes overrides | Use `@media (min-width: 768px)` mobile-first             |
| Breakpoints that only change font size   | Doesn't address layout         | Change grid columns, spacing, component density          |
| Hiding critical content on mobile        | Users lose information         | Restructure, don't hide. Use progressive disclosure      |
| Fixed px widths on containers            | Breaks on narrow/wide screens  | Use `max-width` + percentage/vw + `clamp()`              |
| Touch targets under 44px                 | Fails accessibility            | Increase padding to meet 44x44px minimum                 |
| Manual column counts (`grid-cols-3`)     | Doesn't adapt to content       | Prefer `auto-fill` `minmax()` for card grids             |

## Tool-specific guidance

- **Playwright MCP**: test at exact viewport widths (375, 768, 1280, 1440) to catch breakpoint issues.
- **Tailwind**: responsive prefixes are mobile-first — unprefixed = all screens, `sm:` = 640px+, `md:` = 768px+.
- **Next.js Image**: automatically handles srcset and sizes, use `fill` prop with `sizes` attribute.
- **Container queries**: supported in all modern browsers, use for component-level responsive logic.

## Done checks

- [ ] Layout reads well at 375px, 768px, 1280px, and 1440px.
- [ ] All touch targets are 44x44px minimum with 8px gaps.
- [ ] No horizontal scroll at any standard viewport.
- [ ] Navigation is usable without hover (mobile/touch).
- [ ] Images have srcset or use framework image optimization.
- [ ] Fluid spacing used for section padding and component gaps.
- [ ] No critical content is hidden on mobile — only decorative elements.
