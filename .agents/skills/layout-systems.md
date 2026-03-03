# Layout Systems

> Build reliable grids, containers, and spacing systems that scale across breakpoints and break monotony with intentional asymmetry.

## When to apply
- Establishing page structure or grid systems
- Setting up container and spacing rhythm
- Creating responsive layouts
- When every section looks the same — insert a break

## Concrete values

### Container
| Property | Value | CSS | Tailwind |
|---|---|---|---|
| max-width | 1200px (75rem) | `max-width: 75rem` | `max-w-7xl` |
| side padding mobile | 16px | `padding-inline: 1rem` | `px-4` |
| side padding tablet | 24px | `padding-inline: 1.5rem` | `sm:px-6` |
| side padding desktop | 32px | `padding-inline: 2rem` | `lg:px-8` |
| center | auto margins | `margin-inline: auto` | `mx-auto` |

Fluid alternative: `padding-inline: clamp(1rem, 3vw, 2rem)` — eliminates breakpoints for padding.

### Grid System
| Layout | Columns | Gap | Use case |
|---|---|---|---|
| Full grid | 12 columns | `gap-4 sm:gap-6` | Complex page sections |
| Card grid | auto-fill minmax(280px,1fr) | `gap-6` | Card collections |
| Feature grid | 2 columns | `gap-8 lg:gap-12` | Feature sections |
| Asymmetric hero | 7/5 split | `gap-8` | Hero with text + image |
| Article | 1 col centered | — | Blog, docs, prose |
| Bento | 12 col with varied spans | `gap-4` | Mixed-size feature grids |

### Section Spacing
See `skills/tokens-reference.md` for the full spacing scale.
- Between major sections: `clamp(3rem, 8vw, 6rem)` (48px → 96px)
- Section inner padding: `clamp(2rem, 5vw, 4rem)` (32px → 64px)
- Component gaps: `gap-4 sm:gap-6` (16px → 24px)

### Intentional Break Patterns
Use at least one per page to prevent visual monotony:
1. **Full-bleed**: section spans 100vw, content stays in container
2. **Asymmetric split**: 7/5 or 5/7 columns instead of 6/6
3. **Offset overlap**: element bleeds -2rem to -4rem outside its section
4. **Staggered grid**: items at different vertical offsets
5. **Wide/narrow alternation**: full-width section followed by narrow prose

## Decision framework
- **If** content is homogeneous (cards, features) → `auto-fill minmax(280px, 1fr)`
- **If** hero has text + visual → 7/5 split (text-heavy) or 5/7 (visual-heavy)
- **If** article/prose content → `max-w-3xl` centered container, single column
- **If** dashboard/data → 12-column grid with explicit `col-span`
- **If** 3+ sections look identical → insert full-bleed or asymmetric break
- **If** unsure about column count → use `auto-fill minmax()`, let content decide

## Code examples

### CSS — Asymmetric Hero
```css
.hero {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 2rem;
  align-items: center;
  padding-block: clamp(3rem, 8vw, 6rem);
}
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; }
}
```

### CSS — Full-bleed Section
```css
.full-bleed {
  width: 100vw;
  margin-inline: calc(-50vw + 50%);
  padding-inline: clamp(1rem, 3vw, 2rem);
}
```

### Tailwind — Container
```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- content -->
</div>
```

### Tailwind — Asymmetric Hero
```html
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
    <div class="lg:col-span-7"><!-- text --></div>
    <div class="lg:col-span-5"><!-- visual --></div>
  </div>
</section>
```

### Tailwind — Auto-fill Card Grid
```html
<div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
  <!-- cards -->
</div>
```

### Tailwind — Staggered Grid
```html
<div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="lg:mt-0"><!-- item 1 --></div>
  <div class="lg:mt-12"><!-- item 2 — offset down --></div>
  <div class="lg:mt-6"><!-- item 3 — partial offset --></div>
</div>
```

### Tailwind — Bento Grid
```html
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-12 md:col-span-8 row-span-2"><!-- large feature --></div>
  <div class="col-span-12 md:col-span-4"><!-- small 1 --></div>
  <div class="col-span-12 md:col-span-4"><!-- small 2 --></div>
  <div class="col-span-12 md:col-span-6"><!-- medium 1 --></div>
  <div class="col-span-12 md:col-span-6"><!-- medium 2 --></div>
</div>
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| `width: 50%` hardcoded | Breaks on narrow screens | Use `col-span-6` in a 12-col grid |
| Pixel gaps: `gap: 20px` | Outside the spacing scale | Use token-based gaps: `gap-4 sm:gap-6` |
| Every section same layout | Visual monotony | Insert a break pattern every 2-3 sections |
| No max-width on container | Stretches on ultrawide | `max-width: 75rem; margin-inline: auto` |
| Mixing px and rem gutters | Inconsistent scaling | Use rem and the token scale throughout |

## Tool-specific guidance
- **CSS Grid**: prefer for 2D layouts, named grid areas for complex page sections
- **Flexbox**: prefer for 1D alignment (navbars, button groups, card content)
- **Tailwind**: responsive prefixes are additive; use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Container queries** (`@container`): use for component-level responsiveness — same component in sidebar vs main column

## Done checks
- [ ] Container has consistent max-width and side padding across all pages.
- [ ] All gaps use the spacing scale — no magic numbers.
- [ ] No horizontal overflow at 320px viewport.
- [ ] At least one break pattern per page (full-bleed, asymmetric, staggered, or bento).
- [ ] Grid columns collapse gracefully at mobile breakpoints.
- [ ] Section vertical spacing is fluid using `clamp()`.
