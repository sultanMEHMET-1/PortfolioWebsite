# Visual References

> Study high-quality references to calibrate layout rhythm, typography scale, and depth — then translate structural patterns into your own work. Borrow rhythm, never identity.

## When to apply
- Starting any new layout, page, or section
- When a design feels generic, flat, or defaulted
- When reviewing existing work that lacks a distinctive quality
- Before establishing the visual language of a new project

## The 6-Point Extraction Framework

For every reference site, extract exactly these 6 things:

| Point | What to observe | What to document |
|---|---|---|
| 1. Grid structure | How content is divided across the horizontal axis | Column count, split ratios (7/5, 8/4), container max-width |
| 2. Spacing rhythm | Vertical gaps between sections and elements | Is it tight (dense SaaS) or generous (editorial/portfolio)? |
| 3. Type scale ratio | Ratio between heading and body sizes | Approx multiplier: 2×, 3×, 4×+ |
| 4. Color count | How many distinct hues appear | Usually 1-3. Note if monochromatic or accent-on-neutral |
| 5. Animation style | What moves, how, and why | Scroll reveals, hover lifts, cursor-following, none |
| 6. Depth technique | How does the site create layering | Shadow only, glassmorphism, 3D, overlapping elements, none |

## Reference Sources by Project Type

| Project type | Reference galleries |
|---|---|
| Portfolio / creative | Awwwards, Godly, Layers, Lapa Ninja |
| SaaS / product | Mobbin, Land-book (SaaS section), Saaspo |
| E-commerce | Mobbin (iOS/Android), Dribbble (e-commerce tag) |
| Marketing / landing | Land-book, SaasLand, Httpster |
| Design system / docs | Linear, Stripe, Vercel, Resend |

## Awwwards Pattern Catalog

Patterns observed from award-winning sites:

| Pattern | Description | Translate to |
|---|---|---|
| Editorial asymmetry | Text left/large image right, or inverse | 7/5 grid split |
| Oversized type | Display heading at 80-120px, often cropped | clamp(4rem, 10vw, 8rem) |
| Monochromatic palette | 1 hue at 8-10 lightness steps | OKLCH single-hue neutral + one accent |
| Generous whitespace | 50-60% of viewport empty in hero | py-32 lg:py-48 with sparse content |
| Scroll-revealed sections | Content fades/slides in as user scrolls | GSAP ScrollTrigger + translateY(30px) |
| Glassmorphism navigation | Sticky nav with blur backdrop | backdrop-blur-md bg-white/80 |
| Offset decorative shapes | Geometric shapes behind content, partially cropped | absolute positioned, -z-10, rounded |
| Variable font weight animation | Heading weight animates on scroll/hover | CSS font-variation-settings + transition |

## Adaptation Rules

1. **Extract structure, not style** — if you like the asymmetric split, borrow the 7/5 ratio. Don't borrow the color, font, or imagery.
2. **Extract proportion, not decoration** — if you like the whitespace, borrow the py-32 rhythm. Don't copy the geometric shapes.
3. **Extract timing, not content** — if you like the scroll animation, borrow the 0.7s ease-out reveal. Don't copy the animation trigger conditions.
4. **Document what you borrowed** — write a one-line note: "7/5 grid split inspired by [site]" to avoid accidental copying later.

## Reference Documentation Format

When studying a reference, record:

```
Site: [name + URL]
Type: portfolio / SaaS / marketing / e-commerce
Grid: [columns and split ratios observed]
Spacing: [tight / comfortable / generous — describe section gaps]
Type scale: [approx ratio, note if oversized display type]
Color: [hue count, dominant color role, accent color]
Animation: [describe — or "none"]
Depth: [describe technique]
Borrow: [3 specific structural decisions to translate into your work]
Avoid: [anything too branded or unique to copy]
```

## Decision Framework by Project Type

| Project | Reference approach |
|---|---|
| SaaS landing | Study Linear, Stripe, Resend for: editorial layout, muted color, purposeful animation |
| Portfolio (developer) | Study Awwwards winners for: asymmetric editorial, oversized type, scroll reveals |
| Portfolio (design) | Study Godly.website for: bento grids, layered depth, cursor interactions |
| E-commerce | Study Mobbin for: card hierarchy, product imagery use, sticky CTAs |
| Agency / studio | Study Awwwards (Agency category) for: full-bleed imagery, text on image, scroll-pinned sections |
| Blog / content | Study Medium, Linear blog for: narrow column, generous line-height, minimal chrome |

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| Copying a specific color palette | Too recognizable, looks derivative | Extract lightness ratios only, pick your own hue |
| Copying unique visual motifs (mascots, shapes) | Legal/ethical risk, still looks derivative | Document that you liked the *asymmetry*, not the specific decoration |
| Referencing only 1 site | Overfitting to a single aesthetic | Collect 3-5 references, find the common structural patterns |
| Referencing without extracting | No structural takeaway | Always complete the 6-point extraction before starting work |
| Using competitor references for a client project | Could embarrass the client | Use references from adjacent but different industries |

## Done checks
- [ ] 3-5 references collected before starting any new layout.
- [ ] 6-point extraction completed for each reference (documented in brief notes).
- [ ] Structural patterns borrowed (grid, spacing, rhythm) — not visual identity (color, type, decoration).
- [ ] Reference notes recorded with what was borrowed.
- [ ] Final layout has its own character — not recognizable as a copy of any one reference.
