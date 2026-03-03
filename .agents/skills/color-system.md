# Color System
> Define neutral-first palettes using OKLCH, with semantic tokens and accessible contrast.

## When to apply
- Starting a new project and defining design tokens from scratch.
- Replacing scattered hex/rgb values with a themeable system.
- Adding dark mode support to an existing light-only design.
- Auditing contrast ratios for WCAG AA or AAA compliance.
- Migrating a Tailwind project from default grays to perceptually uniform OKLCH scales.

## Concrete values

### Neutral Scale (OKLCH)

| Step | OKLCH                    | Hex approx | Use                                 |
|------|--------------------------|------------|-------------------------------------|
| 50   | `oklch(0.985 0.002 240)` | #fafafa    | Page backgrounds                    |
| 100  | `oklch(0.965 0.003 240)` | #f5f5f5    | Subtle backgrounds, striped rows    |
| 200  | `oklch(0.925 0.005 240)` | #e5e5e5    | Borders (light), dividers           |
| 300  | `oklch(0.87 0.006 240)`  | #d4d4d4    | Borders (default), input outlines   |
| 400  | `oklch(0.71 0.007 240)`  | #a3a3a3    | Placeholder text, disabled states   |
| 500  | `oklch(0.55 0.008 240)`  | #737373    | Muted text, icons                   |
| 600  | `oklch(0.45 0.008 240)`  | #525252    | Secondary text, labels              |
| 700  | `oklch(0.37 0.007 240)`  | #404040    | Primary text on light backgrounds   |
| 800  | `oklch(0.27 0.006 240)`  | #262626    | Headings, high-emphasis text        |
| 900  | `oklch(0.2 0.005 240)`   | #171717    | Near-black text                     |
| 950  | `oklch(0.13 0.004 240)`  | #0a0a0a    | Darkest surface (dark mode bg)      |

### Accent Generation

Pick ONE hue angle (e.g., 250 for blue, 145 for green, 25 for orange). Keep chroma between 0.15 and 0.25 for vivid but not neon results. Derive 5 lightness variants:

| Variant    | Lightness | Chroma | Use                                    |
|------------|-----------|--------|----------------------------------------|
| accent-95  | 0.95      | 0.04   | Tinted backgrounds, subtle highlights  |
| accent-85  | 0.85      | 0.08   | Hover backgrounds, selected rows       |
| accent-55  | 0.55      | 0.20   | Default accent (buttons, links)        |
| accent-40  | 0.40      | 0.20   | Hover state on accent elements         |
| accent-25  | 0.25      | 0.15   | Active/pressed state, focus rings      |

Example with blue hue (250):
- `oklch(0.95 0.04 250)` -- light tinted bg
- `oklch(0.85 0.08 250)` -- hover bg
- `oklch(0.55 0.20 250)` -- primary button
- `oklch(0.40 0.20 250)` -- button hover
- `oklch(0.25 0.15 250)` -- button active

### Semantic Token Mapping

| Token                  | Light mode   | Dark mode    |
|------------------------|--------------|--------------|
| --color-bg-primary     | neutral-50   | neutral-950  |
| --color-bg-elevated    | white        | neutral-900  |
| --color-bg-muted       | neutral-100  | neutral-800  |
| --color-text-primary   | neutral-900  | neutral-50   |
| --color-text-secondary | neutral-600  | neutral-400  |
| --color-text-muted     | neutral-500  | neutral-500  |
| --color-border-default | neutral-200  | neutral-800  |
| --color-border-strong  | neutral-300  | neutral-700  |
| --color-accent         | accent-55    | accent-55    |
| --color-accent-hover   | accent-40    | accent-65    |

### The 60/30/10 Rule
- **60% neutral** -- page backgrounds, cards, large surfaces.
- **30% secondary** -- body text, borders, supporting UI elements.
- **10% accent** -- CTAs, active states, links, highlights.

### Dark Mode Strategy
In OKLCH, invert lightness: L becomes roughly `(1 - L)`, keep chroma (C) and hue (H) the same. This produces natural dark themes without hue shifts or muddy midtones. Fine-tune by reducing chroma slightly at very low lightness to avoid oversaturation on dark backgrounds.

## Decision framework
- If starting fresh --> use OKLCH for all color definitions.
- If existing Tailwind project --> extend the theme with OKLCH custom colors mapped to CSS custom properties.
- If need dark mode --> use CSS custom properties toggled with `prefers-color-scheme` or a class strategy.
- If a background needs depth --> use opacity layers (`bg-accent/5`, `bg-accent/10`) before reaching for a new solid color.
- If two elements need visual distinction --> change lightness first before introducing a new hue.
- If choosing an accent hue --> pick one, derive all variants from it. Add a second hue only for semantic meaning (e.g., red for errors, green for success).

## Code examples

### CSS

```css
:root {
  /* --- Neutral Scale --- */
  --neutral-50:  oklch(0.985 0.002 240);
  --neutral-100: oklch(0.965 0.003 240);
  --neutral-200: oklch(0.925 0.005 240);
  --neutral-300: oklch(0.87 0.006 240);
  --neutral-400: oklch(0.71 0.007 240);
  --neutral-500: oklch(0.55 0.008 240);
  --neutral-600: oklch(0.45 0.008 240);
  --neutral-700: oklch(0.37 0.007 240);
  --neutral-800: oklch(0.27 0.006 240);
  --neutral-900: oklch(0.2 0.005 240);
  --neutral-950: oklch(0.13 0.004 240);

  /* --- Accent (blue, hue 250) --- */
  --accent-95: oklch(0.95 0.04 250);
  --accent-85: oklch(0.85 0.08 250);
  --accent-55: oklch(0.55 0.20 250);
  --accent-40: oklch(0.40 0.20 250);
  --accent-25: oklch(0.25 0.15 250);

  /* --- Semantic Tokens (Light Mode) --- */
  --color-bg-primary:     var(--neutral-50);
  --color-bg-elevated:    oklch(1 0 0);
  --color-bg-muted:       var(--neutral-100);
  --color-text-primary:   var(--neutral-900);
  --color-text-secondary: var(--neutral-600);
  --color-text-muted:     var(--neutral-500);
  --color-border-default: var(--neutral-200);
  --color-border-strong:  var(--neutral-300);
  --color-accent:         var(--accent-55);
  --color-accent-hover:   var(--accent-40);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary:     var(--neutral-950);
    --color-bg-elevated:    var(--neutral-900);
    --color-bg-muted:       var(--neutral-800);
    --color-text-primary:   var(--neutral-50);
    --color-text-secondary: var(--neutral-400);
    --color-text-muted:     var(--neutral-500);
    --color-border-default: var(--neutral-800);
    --color-border-strong:  var(--neutral-700);
    --color-accent:         var(--accent-55);
    --color-accent-hover:   oklch(0.65 0.18 250);
  }
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

a {
  color: var(--color-accent);
}
a:hover {
  color: var(--color-accent-hover);
}

.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
}
```

### Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          primary:  'var(--color-bg-primary)',
          elevated: 'var(--color-bg-elevated)',
          muted:    'var(--color-bg-muted)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted:     'var(--color-text-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border-default)',
          strong:  'var(--color-border-strong)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover:   'var(--color-accent-hover)',
          light:   'var(--accent-95)',
          muted:   'var(--accent-85)',
        },
      },
    },
  },
};
```

```html
<!-- Usage in components -->
<div class="bg-bg-primary text-text-primary">
  <div class="bg-bg-elevated border border-border rounded-lg p-6">
    <h2 class="text-text-primary">Card Title</h2>
    <p class="text-text-secondary">Description text here.</p>
    <button class="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded">
      Action
    </button>
  </div>
</div>
```

## Anti-patterns

| Bad                                              | Why                                              | Fix                                                 |
|--------------------------------------------------|--------------------------------------------------|-----------------------------------------------------|
| Raw hex values in components (`bg-[#3b82f6]`)    | Cannot theme, impossible to maintain at scale     | Use semantic tokens via CSS custom properties        |
| 5+ saturated accent colors on one page           | Rainbow UI syndrome, no clear visual hierarchy    | Max 2 accent hues; prefer 1 primary accent          |
| Color as the only state indicator                | Fails for colorblind users (accessibility)        | Combine color with icon, text label, or shape change |
| Tailwind `gray-100` through `gray-900` as-is     | Not perceptually uniform, some steps feel uneven  | Replace with OKLCH-based neutral scale               |
| `bg-gradient-to-r` with saturated endpoints      | Muddy, desaturated midpoints in sRGB interpolation| Use OKLCH interpolation or hand-pick midpoints       |
| Hardcoded light/dark values in components        | Duplicated logic, error-prone theme switching     | Single set of semantic tokens toggled at `:root`     |

## Tool-specific guidance
- **Tailwind v4:** Define all colors as CSS custom properties in your `@theme` block, then reference them in utilities. Tailwind v4 natively supports `oklch()`.
- **Tailwind v3:** Define colors in `tailwind.config.js` referencing `var(--token-name)`. Requires the CSS custom properties to be defined in a global stylesheet.
- **OKLCH browser support:** Supported in Chrome 111+, Edge 111+, Firefox 113+, Safari 15.4+. Covers 95%+ of users as of 2025.
- **Fallbacks:** Use `@supports (color: oklch(0 0 0)) { }` for progressive enhancement, or a PostCSS OKLCH plugin for full backward compatibility.
- **Contrast checking:** Use APCA (Accessible Perceptual Contrast Algorithm) for OKLCH-based designs. Tools: oddcontrast.com, oklch.com.

## Done checks
- [ ] All colors in components use semantic tokens -- zero raw hex, rgb, or oklch values in component files.
- [ ] Body text on primary background has 4.5:1+ contrast ratio (WCAG AA for normal text).
- [ ] Large text (18px+ or 14px+ bold) has 3:1+ contrast ratio.
- [ ] No more than 2 accent hues appear on any single page.
- [ ] Dark mode inverts cleanly with no unreadable or low-contrast text.
- [ ] 60/30/10 ratio visually holds across all major pages.
- [ ] Accent colors appear only in action or emphasis roles (buttons, links, badges), never as large surface fills.
