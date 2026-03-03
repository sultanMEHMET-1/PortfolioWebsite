# Typography
> Build a typographic system with clear hierarchy, fluid scaling, and strong rhythm.

## When to apply
- Starting a new project and defining design tokens.
- Refactoring inconsistent font sizes scattered across components.
- Adding responsive text that scales smoothly between mobile and desktop.
- Setting up a Tailwind or CSS custom property theme.
- Auditing an existing UI for readability and visual hierarchy issues.

## Concrete values

### Type Scale

| Token   | Size       | Fluid formula                              | Line-height | Letter-spacing | Use                          |
|---------|------------|--------------------------------------------|-------------|----------------|------------------------------|
| Display | 3.5rem     | `clamp(2.5rem, 5vw + 1rem, 3.5rem)`       | 1.1         | -0.02em        | Hero sections, landing pages |
| H1      | 2.5rem     | `clamp(2rem, 3vw + 1rem, 2.5rem)`         | 1.15        | -0.015em       | Page titles                  |
| H2      | 2rem       | `clamp(1.5rem, 2vw + 0.75rem, 2rem)`      | 1.2         | -0.01em        | Section headings             |
| H3      | 1.5rem     | `clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)`  | 1.3         | -0.005em       | Subsection headings          |
| H4      | 1.25rem    | 1.25rem (no clamp needed)                  | 1.4         | 0              | Card titles, labels          |
| Body    | 1rem (16px)| 1rem                                       | 1.6         | 0              | Paragraphs, default text     |
| Small   | 0.875rem   | 0.875rem                                   | 1.5         | 0.01em         | Helper text, metadata        |
| Caption | 0.75rem    | 0.75rem                                    | 1.5         | 0.02em         | Timestamps, fine print       |

### Font Weight Scale

| Weight   | Value | Use                                      |
|----------|-------|------------------------------------------|
| Regular  | 400   | Body text, descriptions, long-form prose |
| Medium   | 500   | UI labels, nav links, emphasized body    |
| Semibold | 600   | Subheadings, card titles, buttons        |
| Bold     | 700   | Page titles, hero headings, key stats    |

### Measure (Line Length)
- Body text: `max-w-[65ch]` -- optimal reading comfort at 45-75 characters.
- Display/headings: `max-w-[20ch]` -- keeps headlines punchy and scannable.
- Captions and metadata: `max-w-[45ch]` -- shorter lines for small text.

### Recommended Font Stacks
- **Primary sans-serif:** Inter, Geist, Satoshi, General Sans, Space Grotesk.
- **System fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- **Monospace:** `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`.

## Decision framework
- If hero/display text --> use `clamp()` with a `vw` unit for fluid scaling.
- If body text --> use a fixed `rem` value only; fluid body text causes readability issues.
- If UI labels/buttons --> use fixed `rem` with tight line-height (1.2-1.3).
- If one font family covers Regular through Bold --> use that single family only.
- If you need visual contrast between heading and body --> use a second family for headings only.
- Never use more than 2 font families on one site.

## Code examples

### CSS

```css
:root {
  /* --- Type Scale --- */
  --font-size-display: clamp(2.5rem, 5vw + 1rem, 3.5rem);
  --font-size-h1:      clamp(2rem, 3vw + 1rem, 2.5rem);
  --font-size-h2:      clamp(1.5rem, 2vw + 0.75rem, 2rem);
  --font-size-h3:      clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem);
  --font-size-h4:      1.25rem;
  --font-size-body:    1rem;
  --font-size-small:   0.875rem;
  --font-size-caption: 0.75rem;

  /* --- Line Heights --- */
  --leading-display: 1.1;
  --leading-h1:      1.15;
  --leading-h2:      1.2;
  --leading-h3:      1.3;
  --leading-h4:      1.4;
  --leading-body:    1.6;
  --leading-small:   1.5;
  --leading-caption: 1.5;

  /* --- Letter Spacing --- */
  --tracking-display: -0.02em;
  --tracking-h1:      -0.015em;
  --tracking-h2:      -0.01em;
  --tracking-h3:      -0.005em;
  --tracking-body:    0;
  --tracking-small:   0.01em;
  --tracking-caption: 0.02em;

  /* --- Font Families --- */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

  /* --- Font Weights --- */
  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
}

/* Utility classes */
.text-display {
  font-size: var(--font-size-display);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
  font-weight: var(--font-bold);
  max-width: 20ch;
}

.text-h1 {
  font-size: var(--font-size-h1);
  line-height: var(--leading-h1);
  letter-spacing: var(--tracking-h1);
  font-weight: var(--font-bold);
}

.text-h2 {
  font-size: var(--font-size-h2);
  line-height: var(--leading-h2);
  letter-spacing: var(--tracking-h2);
  font-weight: var(--font-semibold);
}

.text-body {
  font-size: var(--font-size-body);
  line-height: var(--leading-body);
  letter-spacing: var(--tracking-body);
  font-weight: var(--font-regular);
  max-width: 65ch;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/InterVariable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

### Tailwind

```html
<!-- Display heading -->
<h1 class="text-[clamp(2.5rem,5vw+1rem,3.5rem)] leading-[1.1] tracking-[-0.02em] font-bold max-w-[20ch]">
  Ship faster with great type
</h1>

<!-- H1 -->
<h1 class="text-[clamp(2rem,3vw+1rem,2.5rem)] leading-[1.15] tracking-[-0.015em] font-bold">
  Page Title
</h1>

<!-- H2 -->
<h2 class="text-[clamp(1.5rem,2vw+0.75rem,2rem)] leading-[1.2] tracking-[-0.01em] font-semibold">
  Section Heading
</h2>

<!-- H3 -->
<h3 class="text-[clamp(1.25rem,1.5vw+0.5rem,1.5rem)] leading-[1.3] tracking-[-0.005em] font-semibold">
  Subsection
</h3>

<!-- H4 -->
<h4 class="text-xl leading-[1.4] font-semibold">
  Card Title
</h4>

<!-- Body -->
<p class="text-base leading-[1.6] max-w-[65ch]">
  Body text with comfortable reading measure.
</p>

<!-- Small -->
<span class="text-sm leading-[1.5] tracking-[0.01em]">
  Helper text
</span>

<!-- Caption -->
<span class="text-xs leading-[1.5] tracking-[0.02em] max-w-[45ch]">
  Caption or timestamp
</span>
```

## Anti-patterns

| Bad                                    | Why                                          | Fix                                              |
|----------------------------------------|----------------------------------------------|--------------------------------------------------|
| 6 heading sizes with 2px gaps          | No visual distinction between levels         | Use a scale with 1.25+ ratio jumps               |
| `font-display: auto` or missing        | Flash of invisible text (FOIT)               | Always set `font-display: swap`                  |
| `line-height: 1.5` on everything       | Headings look loose, small text may be tight  | Set line-height per size class as defined above   |
| `max-width` on body > 80ch             | Lines too long, reading fatigue              | Use `max-w-[65ch]` for body text                 |
| Mixing 3+ font families                | Visual chaos, extra network requests         | Max 2 families; prefer 1 with weight variation   |
| Using px for font sizes                | Breaks user zoom and accessibility settings  | Use `rem`; `clamp()` for fluid sizes             |
| Arbitrary sizes outside the scale      | Inconsistent hierarchy, harder to maintain   | Only use values defined in the type scale tokens |

## Tool-specific guidance
- **next/font:** Auto-optimizes font loading and prevents layout shift. Prefer `next/font/google` or `next/font/local` over manual `@font-face` or `<link>` tags.
- **Google Fonts:** Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` and use the `display=swap` URL parameter.
- **Variable fonts:** A single file covers all weights (e.g., Inter Variable). Better performance than loading multiple static weight files. Prefer variable fonts where available.
- **Tailwind v4:** Use `@theme` to define font size tokens that map to the custom properties above.

## Done checks
- [ ] Body text line length is 45-75 characters at default viewport width.
- [ ] Display heading is at least 2.5x body text size.
- [ ] All text sizes exist in the defined scale -- no arbitrary sizes outside the tokens.
- [ ] `font-display: swap` is set on all custom font declarations.
- [ ] Line-height varies by size class, not a single global value.
- [ ] Text zoomed to 200% in the browser is still readable with no overflow or clipping.
- [ ] Max 2 font families loaded, each with a full fallback stack.
