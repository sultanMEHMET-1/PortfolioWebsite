# Visual Taste

> Build intentional visual hierarchy, rhythm, and composition. Premium sites use asymmetry, generous whitespace, and depth layering — not gradients — to create focus.

## When to apply
- Designing any page or section needing strong visual impact
- Reviewing a layout that feels "generic," "flat," or "AI-generated"
- Starting a new layout from scratch
- When every section looks symmetric or identical

## Concrete values

### Whitespace Ratios
| Context | Whitespace target | Spacing |
|---|---|---|
| Hero section | 40-50% of viewport is breathing room | `py-24 lg:py-32` |
| Between major sections | Fluid vertical gap | `clamp(3rem, 8vw, 6rem)` |
| Card internal padding | Comfortable | `p-6` to `p-8` (24-32px) |
| Text block margins | Between paragraphs | `1.5em` or `mb-6` |
| Under headings | Before body text | `mt-4 mb-6` |

### Focal Point Hierarchy
- **Primary element** (hero heading, key visual): 3-4× the size of body text
- **One dominant element per viewport** — competing focal points cause confusion
- **Size hierarchy**: Primary (3-4× body) > Secondary (1.5-2× body) > Tertiary (body size)
- **Color hierarchy**: accent on primary actions only, neutral on everything else

### Depth Layering (use in this order — shadow before color)
| Technique | Values | When to use |
|---|---|---|
| Subtle border | `border border-neutral-200` | Minimal card definition |
| Shadow at rest | `shadow-sm` from tokens | Cards, inputs at default state |
| Shadow elevated | `shadow-md` from tokens | Hover states, active sections |
| Background shift | `bg-neutral-50` behind `bg-white` | Section differentiation |
| Glassmorphism | `backdrop-blur-md bg-white/70` | Navigation bars, overlays |
| Blur halo | `blur-xl bg-accent/20 -z-10` | Decorative depth behind focal elements |

See `skills/tokens-reference.md` for exact shadow values.

### Asymmetry Patterns
- 7/5 column split for hero (text-heavy) or 5/7 (image-heavy)
- Offset elements by `-2rem` to `-4rem` from their container edge
- Stagger card grid rows at different vertical offsets (`mt-0`, `mt-8`, `mt-4`)
- One section per page breaks the container — full-bleed background or image

## Decision framework
- **If** marketing/landing page → **Z-pattern**: logo top-left, CTA top-right, content flows diagonally, conversion bottom-right
- **If** content-heavy (blog, docs) → **F-pattern**: strong left alignment, horizontal heading scans
- **If** portfolio/creative → **Editorial**: asymmetric splits, oversized type, generous whitespace, deliberate emptiness
- **If** SaaS dashboard → **Dense grid**: clear card elevation hierarchy, color-coded status, compact spacing
- **If** design feels flat → add depth before color: shadow → backdrop-blur → subtle background shift → accent
- **If** design feels cluttered → remove elements first, then add whitespace, then restructure
- **If** every section looks identical → break the rhythm: full-bleed, background change, or asymmetric layout

## Code examples

### Tailwind — Hero with Asymmetry and Depth
```html
<section class="relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <!-- Text — 7 columns -->
      <div class="lg:col-span-7 space-y-6">
        <h1 class="text-[clamp(2.5rem,5vw+1rem,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
          Headline that creates focus
        </h1>
        <p class="text-lg text-neutral-600 max-w-[50ch] leading-relaxed">
          Supporting text with enough room to breathe.
        </p>
        <a href="#" class="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:-translate-y-0.5 transition-transform duration-150">
          Primary CTA
        </a>
      </div>
      <!-- Visual — 5 columns with depth -->
      <div class="lg:col-span-5 relative">
        <div class="rounded-xl shadow-lg overflow-hidden">
          <!-- image or UI preview -->
        </div>
        <!-- Depth halo -->
        <div class="absolute -z-10 -inset-4 bg-violet-200/40 rounded-2xl blur-2xl"></div>
      </div>
    </div>
  </div>
</section>
```

### CSS — Depth Layering on Card
```css
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Tailwind — Full-bleed Background Break
```html
<section class="relative">
  <!-- Full-bleed background -->
  <div class="absolute inset-0 bg-neutral-900"></div>
  <!-- Contained content -->
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <h2 class="text-white ...">Section heading</h2>
  </div>
</section>
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| Everything centered on every section | Predictable, no visual flow | Alternate left-aligned, right-aligned, asymmetric |
| Equal-sized card grids only | Default AI output, no rhythm | Vary sizes: featured large + supporting small |
| Large hero gradient as main visual | Lazy depth, screams "template" | Use shadow layers, subtle bg shifts, or real imagery |
| Same vertical spacing between all sections | No rhythm, feels flat | Vary: large gaps between major sections, tighter inside |
| Decorative elements with no structural purpose | Visual noise | Every visual element must reinforce hierarchy or provide depth |
| 6/6 split (50/50) for everything | Symmetric monotony | Use 7/5, 5/7, 8/4, or 4/8 splits |

## Tool-specific guidance
- **Playwright MCP**: capture full-page screenshots to evaluate whitespace ratios and focal point clarity
- **Framer Motion**: animate primary focal point first, support content second (stagger with 50-80ms delay)
- **Tailwind**: use arbitrary values for precise offsets: `mt-[-2rem]`, negative margins for overlap

## Done checks
- [ ] Every page has one clear focal point per viewport — the eye lands within 2 seconds.
- [ ] At least one asymmetry move per major section (not every section is centered 6/6).
- [ ] Hero section has 40%+ breathing room around content.
- [ ] Depth achieved via shadow/blur before adding saturated color.
- [ ] No section relies on a large gradient as its primary visual device.
- [ ] Spacing varies between sections to create rhythm — not uniform throughout.
- [ ] Layout validated in a real browser (not just reasoned about).
