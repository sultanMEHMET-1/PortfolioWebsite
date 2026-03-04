# Scroll Animation

> Use scroll-driven motion to guide attention and reveal content progressively. GSAP ScrollTrigger for complex sequences, Intersection Observer for simple reveals, Lenis for smooth scrolling.

## When to apply
- Elements that animate into view on scroll
- Parallax depth effects on hero sections
- Pinned sections with scroll-driven timelines
- Smooth scroll behavior across the entire site
- Any animation tied to scroll position rather than time

## Concrete values

### GSAP ScrollTrigger Key Parameters
| Parameter | Recommended value | Notes |
|---|---|---|
| `start` | `"top 80%"` | Trigger when element top hits 80% down viewport |
| `end` | `"bottom 20%"` | For scrub animations |
| `scrub` | `1` or `1.5` | Smoothing factor (seconds). `true` = instant scrub |
| `pin` | `true` | Pin element while scrolling through trigger |
| `markers` | `true` in dev only | Remove before shipping |
| `once` | `true` | Fire only once for reveal animations |

### Scroll Reveal Defaults
| Property | Value |
|---|---|
| Enter from | `translateY: 30px, opacity: 0` |
| Duration | `0.7` seconds |
| Ease | `"power3.out"` or `cubic-bezier(0.16, 1, 0.3, 1)` |
| Stagger | `0.08` seconds between sibling items |
| Trigger start | `"top 85%"` (fire early so animation completes before center) |

### Performance Guardrails
| Guardrail | Value | Notes |
|---|---|---|
| Max scroll-linked elements per viewport | 2 | Includes parallax and scrubbed timelines |
| Max pinned sections per page | 1 (2 max) | Keep pin duration under 200% viewport |
| Max reveal items per trigger | 12 | Split long lists into batches |
| Smooth scroll (Lenis) | Off by default | Enable only if required, disable on mobile |
| Parallax distance | `yPercent` ≤ 15 | Larger motion costs more and distracts |

### Lenis Smooth Scroll Config
```js
{
  duration: 1.2,         // scroll duration multiplier
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // expo out
  smoothWheel: true,
  wheelMultiplier: 1,    // increase for faster scroll
  touchMultiplier: 2,
}
```

## Decision framework
- **If** simple fade-in on scroll → Intersection Observer with CSS class toggle (no library needed)
- **If** staggered list reveal → GSAP `gsap.from()` with `stagger` and `scrollTrigger.once: true`
- **If** scroll-linked parallax → GSAP ScrollTrigger with `scrub: 1`
- **If** pinned section with timeline → GSAP ScrollTrigger with `pin: true` and `scrub`
- **If** smooth scroll throughout → add Lenis first, then integrate with GSAP
- **If** more than 2 scroll-linked elements are visible → reduce to 1-2 or use static reveals
- **If** list exceeds 12 items → split into multiple reveal groups or use IO + CSS
- **If** `prefers-reduced-motion` → disable scroll reveals, keep page scrollable, remove parallax

## Code examples

### GSAP — Single Setup File (initialize once)
```js
// src/lib/gsap.js — import this ONCE in root layout
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Call once after all content renders
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
```

### GSAP — Scroll Reveal for a List
```js
import { gsap, ScrollTrigger } from '@/lib/gsap';

// Reveal each card as it enters viewport
gsap.from('.reveal-item', {
  opacity: 0,
  y: 30,
  duration: 0.7,
  ease: 'power3.out',
  stagger: 0.08,
  scrollTrigger: {
    trigger: '.reveal-container',
    start: 'top 85%',
    once: true,          // animate only once
    // markers: true,    // debug only
  },
});
```

### GSAP — Parallax Hero Element
```js
gsap.to('.hero-visual', {
  yPercent: -12,          // move up 12% of its height
  ease: 'none',           // linear for scrub
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,           // smooth 1.5s lag behind scroll
  },
});
```

### GSAP — Pinned Scroll Section
```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.features-section',
    pin: true,
    start: 'top top',
    end: '+=300%',        // scroll through 3x the section height
    scrub: 1,
  },
});
tl.from('.feature-1', { opacity: 0, y: 50 })
  .from('.feature-2', { opacity: 0, y: 50 }, '+=0.5')
  .from('.feature-3', { opacity: 0, y: 50 }, '+=0.5');
```

### Lenis + GSAP Integration
```js
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// Sync Lenis with GSAP ticker
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

### Intersection Observer — Simple Reveal (No Library)
```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
```
```css
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-in.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .fade-in { opacity: 1; transform: none; transition: none; }
}
```

### Next.js — Cleanup on Unmount
```tsx
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function useScrollReveal(ref) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.reveal'), {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      });
    }, ref);
    return () => ctx.revert(); // cleanup on unmount
  }, []);
}
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| Multiple `gsap.registerPlugin(ScrollTrigger)` calls | Breaks scroll positions | Register once in a single setup file |
| Forgetting `ScrollTrigger.refresh()` after dynamic content loads | Trigger positions are wrong | Call `refresh()` after images/content render |
| `markers: true` in production | Shows debug overlay to users | Remove markers before shipping |
| `scrub: true` (boolean) | Zero smoothing, feels jittery | Use `scrub: 1` or `scrub: 1.5` |
| Animating `top`/`left` with scrollTrigger | Triggers layout reflow per frame | Use `y` / `yPercent` (transforms) |
| Scroll reveals with `start: "top 50%"` | Animation fires too late, half-visible | Use `"top 85%"` so animation completes by center |
| Multiple pinned sections or long pin durations | Heavy on low-end devices | Max 1 pin per page, keep under 200% viewport |
| Lenis enabled on every page by default | Adds overhead for little gain | Only enable on pages that need it, disable on mobile |
| No cleanup in React/Next | Memory leaks, stale triggers | Always return `ctx.revert()` from `useEffect` |

## Tool-specific guidance
- **GSAP ScrollTrigger**: always use `gsap.context()` in React for scoped cleanup. One `gsap.js` setup file, imported at root.
- **Lenis**: initialize in root layout, not individual pages. Sync with GSAP ticker for best integration.
- **Next.js App Router**: initialize GSAP in a Client Component marked `"use client"`. Use `useEffect` for trigger setup.
- **`prefers-reduced-motion`**: check with `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before setting up scroll animations.

## Done checks
- [ ] `ScrollTrigger` registered once in a shared setup file.
- [ ] `ScrollTrigger.refresh()` called after dynamic content renders.
- [ ] `markers: true` removed before shipping.
- [ ] Scrub animations use `scrub: 1` or higher — not `true`.
- [ ] Only `transform` properties animated (`y`, `yPercent`, `opacity`).
- [ ] `gsap.context().revert()` called on component unmount in React.
- [ ] Scroll animations disabled or instant when `prefers-reduced-motion` is set.
- [ ] Lenis initialized once in root layout and synced with GSAP ticker.
- [ ] No more than 2 scroll-linked elements are visible at once.
