# Design System Literacy

> Leverage proven UI primitives and patterns instead of reinventing foundations. Know which tool does what, and when to build vs. use.

## When to apply
- Choosing how to implement a dialog, dropdown, tooltip, or popover
- Setting up component architecture for a new project
- Reviewing components that have accessibility or focus-trap issues
- Deciding between custom vs. library components

## Radix UI Primitive Catalog

| Primitive | Use when | Never build custom because |
|---|---|---|
| `Dialog` | Modal with backdrop + focus trap | Focus trap is complex to implement correctly |
| `DropdownMenu` | Triggered dropdown with keyboard nav | Arrow-key navigation is non-trivial |
| `Select` | Custom styled select / combobox | Browser select is unspekitable, custom needs ARIA |
| `Tabs` | Tab group with keyboard support | Arrow-key activation, ARIA roles required |
| `Tooltip` | Hover-triggered info popup | Delay, positioning, keyboard triggering required |
| `Popover` | Click-triggered floating panel | Positioning + outside-click dismissal complex |
| `Accordion` | Expand/collapse sections | ARIA expanded state + keyboard nav |
| `Checkbox` | Styled checkbox with indeterminate | Indeterminate state, ARIA, form integration |
| `Toggle` | Binary on/off control | ARIA pressed state |
| `Slider` | Range input | Drag + keyboard step + ARIA valuetext |

Install individual: `npm i @radix-ui/react-dialog` etc., or use shadcn/ui which wraps them.

## shadcn/ui Workflow

```bash
# Initialize (once per project)
npx shadcn@latest init

# Add a component
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu

# Components are added to src/components/ui/ — customize there
```

Customization layers:
1. **Theme tokens** — edit CSS variables in `globals.css` (colors, radius)
2. **Component file** — edit `ui/button.tsx` (variants, sizes)
3. **Override at callsite** — pass `className` with `cn()` for one-off styles

Never edit: `node_modules` or regenerate via shadcn after customizing — your changes will be lost.

## Tailwind Token Strategy

```js
// tailwind.config.js — extend, don't replace
module.exports = {
  theme: {
    extend: {
      colors: {
        // Reference CSS variables set in globals.css
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
    },
  },
};
```

This allows shadcn/ui components to use Tailwind classes while pulling from your token system.

## CSS Group Utilities (vs. React state for hover)

```tsx
// ❌ Bad: React state for hover (unnecessary re-render)
const [hovered, setHovered] = useState(false);
<div
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  className={hovered ? 'text-neutral-900' : 'text-neutral-600'}
>

// ✅ Good: CSS group utilities (zero JS, zero re-render)
<div className="group">
  <p className="text-neutral-600 group-hover:text-neutral-900 transition-colors">
    Text changes color when parent is hovered
  </p>
  <svg className="opacity-0 group-hover:opacity-100 transition-opacity">
    arrow icon that appears on hover
  </svg>
</div>
```

## Decision Framework

| Scenario | Decision |
|---|---|
| Need dialog with focus trap | Use Radix `Dialog` (or shadcn `Dialog`) |
| Need dropdown with keyboard nav | Use Radix `DropdownMenu` |
| Need custom select | Use Radix `Select` |
| Need accessible tabs | Use Radix `Tabs` |
| Purely visual with no focus complexity | Build with Tailwind + CVA |
| Need animation on Radix component | Add Framer Motion to Radix — they compose |
| Need hover-driven child effect | Use Tailwind `group` + `group-hover:` |
| Need form validation UI | Use React Hook Form + Zod with Radix inputs |
| Component in both contexts (sidebar + main) | Use `@container` for layout adaptation |

## Composing Radix + Framer Motion

```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedDialog({ open, onOpenChange, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-xl w-full max-w-lg"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| Custom modal without focus trap | Tab key escapes modal, inaccessible | Use Radix Dialog |
| Rebuilding `<select>` from scratch | Complex ARIA, keyboard, positioning | Use Radix Select |
| `onMouseEnter`/`onMouseLeave` state for hover | Re-renders on every hover | Use Tailwind `group-hover:` |
| Styling Radix by targeting internal DOM | Breaks on Radix updates | Use `asChild` prop + your own element |
| Mixing Radix and non-Radix tab implementations | Inconsistent keyboard behavior | Pick one system |

## Done checks
- [ ] All dialogs and modals use Radix or shadcn Dialog — no custom focus traps.
- [ ] Dropdowns and select menus use Radix primitives.
- [ ] Hover-driven child effects use Tailwind `group` utilities, not React state.
- [ ] shadcn/ui customization done via token layer and component files — not node_modules.
- [ ] Framer Motion added via `asChild` pattern on Radix primitives for animation.
- [ ] No two separate systems for the same primitive type (e.g., two different tab implementations).
