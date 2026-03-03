# Performance

> Keep UI fast, smooth, and stable. Beautiful interfaces that drop frames or load slowly fail the user. Performance is a design requirement.

## When to apply
- Adding new pages, images, or media
- Adding animation libraries or 3D effects
- Before shipping any UI change
- When Core Web Vitals drop below thresholds

## Concrete values

### Core Web Vitals Targets
| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5-4s | > 4s |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |
| INP (Interaction to Next Paint) | < 200ms | 200-500ms | > 500ms |
| FCP (First Contentful Paint) | < 1.8s | 1.8-3s | > 3s |
| TTFB (Time to First Byte) | < 800ms | 800-1800ms | > 1800ms |

### Lighthouse Score Thresholds (minimum to ship)
| Category | Minimum | Target |
|---|---|---|
| Performance | 85 | 95 |
| Accessibility | 95 | 100 |
| Best Practices | 90 | 95 |
| SEO | 90 | 95 |

### Image Budgets
| Image type | Max file size | Format | Notes |
|---|---|---|---|
| Hero image | 200KB | WebP or AVIF | Provide 640w, 1024w, 1536w variants |
| Card thumbnail | 50KB | WebP | Lazy load below fold |
| Avatar / icon | 10KB | WebP or SVG | SVG preferred for icons |
| Background image | 100KB | WebP | Consider CSS gradient instead |
| OG/social image | 100KB | JPG | 1200×630px |

Always: set explicit `width` and `height` to prevent CLS.

### Font Loading Budget
| Property | Limit |
|---|---|
| Font files loaded | Max 2 (same family is 1 file if variable font) |
| Font file size | Max 50KB per file (subset to used characters) |
| `font-display` | Always `swap` |
| Preload | Only the critical weight (typically Regular 400) |

### Bundle Budget
| Asset | Max size (gzipped) |
|---|---|
| Initial JS bundle | 150KB |
| Any single chunk | 80KB |
| CSS total | 50KB |
| Third-party scripts | 50KB |

### Animation Performance
- Only animate `transform` and `opacity` — these are GPU-composited
- Use `will-change: transform` only on elements **about to animate** — remove after
- `contain: layout style paint` on isolated animated components
- Target 60fps — if below, profile with Chrome Devtools Performance panel

## Decision framework
- **If** image is below the fold → `loading="lazy"`
- **If** image is in the hero (above fold) → `loading="eager"`, add `fetchpriority="high"`, preload `<link rel="preload">`
- **If** using Next.js → always use `<Image>` component instead of `<img>`
- **If** animation library > 30KB → dynamic import it: `const { gsap } = await import('gsap')`
- **If** route has no animations → don't import animation library on that route
- **If** LCP is slow → inspect the LCP element, check image size and preload
- **If** CLS is high → add `width`/`height` to all images, avoid inserting content above existing content
- **If** INP is high → move heavy work off the main thread (`setTimeout(0)` or `requestIdleCallback`)

## Code examples

### Next.js — Optimized Hero Image
```tsx
import Image from 'next/image';

export function HeroImage() {
  return (
    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden">
      <Image
        src="/hero.webp"
        alt="Product preview"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        priority           // eager load — above fold
        className="object-cover"
      />
    </div>
  );
}
```

### Plain HTML — Responsive Image
```html
<img
  src="/hero.webp"
  srcset="/hero-640.webp 640w, /hero-1024.webp 1024w, /hero-1536.webp 1536w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  width="1536" height="864"
  alt="Description"
  loading="lazy"
  decoding="async"
/>
```

### Dynamic Import for Heavy Libraries
```tsx
// Don't import GSAP at module level — dynamic import on use
async function animateHero() {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  // setup animations
}

// Or React lazy for component-level splitting
const ThreeScene = lazy(() => import('@/components/ThreeScene'));
```

### Font Preload
```html
<!-- In <head> — preload only the primary weight -->
<link
  rel="preload"
  href="/fonts/Inter-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

### CSS — Performance-Safe Animation
```css
/* Only these properties — they don't trigger layout or paint */
.animate {
  will-change: transform;  /* hint only — add before animation */
  transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.animate.done {
  will-change: auto;       /* remove hint after animation completes */
}

/* NEVER animate these — they trigger layout reflow */
/* top, left, right, bottom, width, height, padding, margin */
```

### Lighthouse CI Config
```yaml
# lighthouserc.yml
ci:
  collect:
    url: ['http://localhost:3000', 'http://localhost:3000/projects']
  assert:
    assertions:
      'categories:performance': ['warn', { minScore: 0.85 }]
      'categories:accessibility': ['error', { minScore: 0.95 }]
      'categories:best-practices': ['warn', { minScore: 0.9 }]
      'first-contentful-paint': ['warn', { maxNumericValue: 2000 }]
      'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| `<img src="photo.png">` without width/height | Causes CLS — page jumps as image loads | Add `width` and `height` attributes |
| Unoptimized PNG hero (1MB+) | Massive LCP penalty | Convert to WebP, compress to < 200KB |
| `will-change: transform` on 20+ elements | Consumes GPU memory for every element | Only add right before animation, remove after |
| Animating `top`/`left`/`width` | Triggers layout reflow every frame | Use `transform: translate/scale` |
| Importing GSAP on every page | Adds 60KB+ to every route | Dynamic import only on pages that animate |
| `font-display: block` | Invisible text for up to 3 seconds | Use `font-display: swap` |
| Autoplay video on first load | Blocks main thread, drains battery | Load on user interaction or use poster image |

## Done checks
- [ ] LCP < 2.5s on a throttled 3G connection in Lighthouse.
- [ ] CLS < 0.1 — no layout shifts during load or on interaction.
- [ ] INP < 200ms — interactions respond quickly.
- [ ] All images have `width` and `height` set (or `fill` in Next.js).
- [ ] Hero image is `loading="eager"` with `fetchpriority="high"` or Next.js `priority`.
- [ ] Below-fold images have `loading="lazy"`.
- [ ] Only `transform` and `opacity` animated — never layout properties.
- [ ] Lighthouse Performance ≥ 85, Accessibility ≥ 95 on key pages.
- [ ] No single JS chunk > 80KB gzipped.
