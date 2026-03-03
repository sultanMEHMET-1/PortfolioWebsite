# Micro-Interactions

> Add subtle, purposeful feedback that makes UI feel alive and responsive. Every interactive element must communicate its state.

## When to apply
- Implementing hover, focus, active, or drag states
- Building buttons, inputs, cards, links, and toggles
- Any element a user touches, clicks, or focuses

## Concrete values

### Timing for Micro-Interactions
| State | Duration | Why |
|---|---|---|
| Hover enter | 150ms | Fast enough to feel instant |
| Hover exit | 200ms | Slightly slower — natural feel |
| Button press | 100ms | Must feel immediate |
| Focus ring appear | 150ms | Should be snappy |
| Input focus | 200ms | Smooth, not jarring |

All micro-interaction easing: `cubic-bezier(0.33, 1, 0.68, 1)` (ease-out cubic).

### Button States
| State | Transform | Shadow | Color |
|---|---|---|---|
| Default | none | `shadow-sm` | bg-neutral-900 text-white |
| Hover | `translateY(-1px)` | `shadow-md` | slightly lighter |
| Active/Press | `translateY(0)` | `shadow-sm` | slightly darker |
| Focus | none | + `ring-2 ring-offset-2 ring-neutral-900` | unchanged |
| Disabled | none | none | `opacity-50 cursor-not-allowed` |

**Scale rule**: hover scale on buttons is `1.00` — use `translateY(-1px)` instead. Scale above `1.03` feels amateurish on primary buttons.

### Card Hover
| Property | Value |
|---|---|
| Transform | `translateY(-2px)` |
| Shadow | `shadow-sm` → `shadow-md` |
| Duration | 200ms |
| Cursor | `pointer` |

### Link Hover
| Property | Value |
|---|---|
| Underline offset | animate from `offset: 0` to `offset: 4px` |
| Color | shift from `text-neutral-600` to `text-neutral-900` |
| Duration | 150ms |

### Input Focus
| Property | Default | Focused |
|---|---|---|
| Border | `border-neutral-300` | `border-neutral-900` |
| Ring | none | `ring-2 ring-neutral-900/20` |
| Label | static (if floating) | float up + shrink |
| Duration | — | 200ms |

### Toggle / Switch
| Property | Value |
|---|---|
| Width | 44px |
| Height | 24px |
| Thumb | 18px circle |
| Thumb travel | 20px |
| Duration | 200ms spring |
| Off color | `bg-neutral-300` |
| On color | `bg-neutral-900` or accent |

## Decision framework
- **If** interactive element → define all 5 states: default, hover, active, focus, disabled
- **If** hover effect → use `translateY(-1px)` + shadow lift for cards and buttons
- **If** primary button hover → no scale, use translateY only
- **If** icon button (no text) → must have `aria-label` and visible focus ring
- **If** link in body text → underline offset animation, no scale
- **If** drag interaction → show cursor change + subtle scale on drag start (1.02)
- **If** loading state → skeleton screen or spinner in place, never block user

## Code examples

### CSS — Complete Button System
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-neutral-900);
  color: white;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  transition:
    transform 150ms cubic-bezier(0.33, 1, 0.68, 1),
    box-shadow 150ms cubic-bezier(0.33, 1, 0.68, 1),
    background-color 150ms;
  cursor: pointer;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--shadow-sm), 0 0 0 3px white, 0 0 0 5px var(--color-neutral-900);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

### Tailwind — Button with Group State
```html
<button class="
  group inline-flex items-center gap-2 px-6 py-3
  bg-neutral-900 text-white text-sm font-medium rounded-lg shadow-sm
  hover:-translate-y-px hover:shadow-md
  active:translate-y-0 active:shadow-sm
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900
  disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
  transition-[transform,box-shadow] duration-150 ease-out
">
  <span>Button text</span>
  <svg class="group-hover:translate-x-0.5 transition-transform duration-150">...</svg>
</button>
```

### Tailwind — Card with Hover Lift
```html
<div class="
  group bg-white border border-neutral-200 rounded-xl p-6 shadow-sm cursor-pointer
  hover:-translate-y-0.5 hover:shadow-md
  transition-[transform,box-shadow] duration-200 ease-out
">
  <!-- content -->
</div>
```

### CSS — Input with Focus Transition
```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: white;
  transition:
    border-color 200ms cubic-bezier(0.33, 1, 0.68, 1),
    box-shadow 200ms cubic-bezier(0.33, 1, 0.68, 1);
}
.input:focus {
  outline: none;
  border-color: var(--color-neutral-900);
  box-shadow: 0 0 0 3px rgba(9, 9, 11, 0.1);
}
```

### Tailwind — Subtle Link Hover
```html
<a class="
  text-neutral-600 hover:text-neutral-900
  underline-offset-0 hover:underline-offset-4
  underline decoration-transparent hover:decoration-current
  transition-all duration-150
" href="#">
  Link text
</a>
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| `transform: scale(1.1)` on button hover | Too aggressive, feels broken | Use `translateY(-1px)` + shadow |
| `transition: all` | Catches unintended properties | List specific: `transform, box-shadow` |
| Missing focus styles | Inaccessible for keyboard users | Always define `focus-visible` ring |
| Hover glow with large `box-shadow` blur | Distracting, reduces readability | Use `shadow-md` max (8-25px offset) |
| Layout shift on hover | Jarring, pushes content | Use `transform` which doesn't affect layout |
| Same hover effect on everything | Undifferentiated feedback | Cards lift, links underline, buttons press |

## Tool-specific guidance
- **Tailwind**: `hover:` and `focus-visible:` prefixes for state utilities. Use `group` + `group-hover:` for parent-triggered child effects.
- **Framer Motion**: use `whileHover` and `whileTap` for spring-based gesture animations instead of CSS for complex effects.
- **CSS**: prefer `transition` over JS for simple hover states — lower overhead, no JS event needed.

## Done checks
- [ ] All interactive elements have default, hover, active, focus, and disabled styles.
- [ ] Focus indicators are visible on all background colors without relying on color alone.
- [ ] No layout shift occurs on hover — only `transform` and `opacity`.
- [ ] Hover scale never exceeds 1.03 on buttons and interactive elements.
- [ ] All transitions under 200ms for hover states.
- [ ] Cards lift with `translateY(-2px)` + shadow, not scale.
- [ ] `cursor: pointer` on all clickable non-button elements.
