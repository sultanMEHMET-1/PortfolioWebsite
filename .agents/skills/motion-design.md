# Motion Design

> Create motion that reinforces hierarchy, communicates state changes, and guides spatial understanding. Every animation must earn its place.

## When to apply
- Adding animations, transitions, or scroll effects
- Building page transitions or component reveals
- Implementing loading states and skeleton screens
- Any element that appears, disappears, or changes state

## Concrete values

### Duration Scale
| Type | Duration | Use case |
|---|---|---|
| Micro | 100-150ms | Color changes, opacity, button press |
| Fast | 200-250ms | Hover states, focus transitions, tooltips |
| Base | 300-350ms | Most UI transitions, drawers sliding |
| Slow | 400-500ms | Modal open/close, page section reveals |
| X-Slow | 500-600ms | Hero entrance, page transitions |
| **Max** | **600ms** | No single element should animate longer |

Stagger: 50-80ms between siblings. Total stagger chain max: 400ms.

### GPU Guardrails
| Guardrail | Value | Notes |
|---|---|---|
| Max simultaneous animated elements | 12 (prefer 6) | Batch or reduce long lists |
| Max items per stagger group | 12 | Split large groups into batches |
| Continuous loops | 1 per page | Only for loading/ambient state |
| Paint-heavy effects | 0 animated `filter` / `blur` / `backdrop-filter` | Use static layers + opacity |
| Full-bleed surfaces | Avoid animating full-screen layers | Animate a child layer instead |

### Easing Curves
| Name | Curve | Use case |
|---|---|---|
| Ease-out expo | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances — fast start, gentle land |
| Ease-out cubic | `cubic-bezier(0.33, 1, 0.68, 1)` | Hovers, focus transitions |
| Ease-in expo | `cubic-bezier(0.7, 0, 0.84, 0)` | Exits — accelerate out |
| Bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful elements only — use sparingly |
| Linear | `linear` | Avoid for UI — only for continuous rotation |
| Ease-in-out | `ease-in-out` | Acceptable fallback, less precise |

### Spring Configs (Framer Motion)
| Feel | Stiffness | Damping | Mass | Use |
|---|---|---|---|---|
| Snappy | 400 | 30 | 1 | Button press, toggle |
| Default | 300 | 25 | 1 | Card hover, panel open |
| Gentle | 200 | 20 | 1 | Page transition, hero reveal |
| Bouncy | 300 | 10 | 1 | Notification badge (use sparingly) |

### Enter / Exit Patterns
| Element | Enter | Exit |
|---|---|---|
| Card / item | `translateY(20px) opacity(0)` → rest | `translateY(-10px) opacity(0)` |
| Modal | `scale(0.95) opacity(0)` → rest | `scale(0.95) opacity(0)` |
| Drawer (right) | `translateX(100%)` → `translateX(0)` | reverse |
| Toast | `translateY(-100%) opacity(0)` → rest | `translateX(100%) opacity(0)` |
| Hero heading | `translateY(30px) opacity(0)` → rest | — |

## Decision framework
- **If** Framer Motion is available → use for component-level animation (variants, gestures, layout)
- **If** GSAP is available → use for scroll-driven, timeline, and complex sequences (see `skills/scroll-animation.md`)
- **If** neither → use CSS transitions and `@keyframes`
- **If** element enters the viewport → use `opacity` + `translateY(20px)`, never `scale` alone
- **If** element exits → always animate out, don't just remove
- **If** animation involves position changes → use `transform`, never `top/left/width/height` (causes reflow)
- **If** a list exceeds 12 items → animate the first batch, keep the rest static or reveal in chunks
- **If** effect requires blur/glow/backdrop → use a static layer and animate opacity only
- **If** `prefers-reduced-motion` is set → remove all non-essential animation, keep instant state changes

## Code examples

### CSS — Base Transition
```css
.card {
  transition:
    box-shadow 200ms cubic-bezier(0.33, 1, 0.68, 1),
    transform 200ms cubic-bezier(0.33, 1, 0.68, 1);
}
/* Never: transition: all 0.3s ease — too broad, causes performance issues */
```

### CSS — Fade Up Entrance
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.reveal {
  animation: fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; }
}
```

### Framer Motion — Variants with Stagger
```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>{item.name}</motion.li>
  ))}
</motion.ul>
```

### Framer Motion — Reduced Motion Hook
```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedCard({ children }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

### Framer Motion — Modal with Scale
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| `transition: all 0.3s ease` | Animates every property, causes reflow | List specific properties: `opacity, transform` |
| Linear easing on UI | Feels mechanical, robotic | Use ease-out curves for all entrances |
| Duration > 600ms | Feels sluggish, blocks user | Cap at 600ms, most should be 200-350ms |
| Looping animation without reason | Distracting, wastes battery | Only loop on intentional loading/progress states |
| Animating `top`, `left`, `width`, `height` | Triggers layout reflow, jank | Use `transform: translate/scale` instead |
| Animating `filter`, `blur`, or `backdrop-filter` | Forces expensive paint each frame | Use static layer + opacity |
| No exit animation | Element disappears abruptly | Always define exit variants with `AnimatePresence` |
| Ignoring `prefers-reduced-motion` | Accessibility failure | Wrap or disable non-essential animation |

## Tool-specific guidance
- **Framer Motion**: use `variants` + `staggerChildren` for orchestrated sequences. Use `AnimatePresence` for exit animations. Use `useReducedMotion()` hook.
- **GSAP**: better for scroll-driven and complex timeline animations. See `skills/scroll-animation.md`.
- **CSS**: use `@keyframes` + `animation-fill-mode: forwards` for one-shot reveals. Prefer over JS for simple hover transitions.
- **Tailwind**: `transition-[property]` for specific transitions, `duration-200`, `ease-out` for quick utility animations.

## Done checks
- [ ] Every animation has a clear functional purpose — it's not decorative.
- [ ] No single animation exceeds 600ms.
- [ ] All easing curves are non-linear (ease-out or spring for entrances).
- [ ] Stagger chains complete in under 400ms total.
- [ ] No more than 12 elements animate simultaneously (prefer 6).
- [ ] `prefers-reduced-motion` removes all non-essential animation.
- [ ] Only `transform` and `opacity` are animated — no layout properties.
- [ ] No animated `filter` / `backdrop-filter` / large `box-shadow` on big surfaces.
- [ ] Exit animations exist for every element that enters dynamically.
