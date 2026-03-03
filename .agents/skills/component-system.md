# Component System

> Build consistent, reusable UI components with predictable variants, a shared token system, and a clear folder hierarchy.

## When to apply
- Creating or refactoring UI components
- Building a new feature that needs new components
- Reviewing components that have inconsistent spacing or visual drift
- Setting up a project's component architecture

## Concrete values

### Folder Structure
```
src/
├── ui/              ← Raw primitives (safe to upgrade from shadcn/ui)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   └── ...
├── components/      ← Composed components (use ui/ primitives)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProjectCard.tsx
│   └── ...
└── blocks/          ← Full page sections (use components/ and ui/)
    ├── HeroBlock.tsx
    ├── FeaturesBlock.tsx
    └── ...
```

### Variant API Convention
Standard props for all interactive components:
```
size: 'sm' | 'md' | 'lg'          (default: 'md')
variant: 'default' | 'outline' | 'ghost' | 'destructive'
```
Additional props by component type:
- Button: `loading?: boolean`, `icon?: ReactNode`
- Input: `error?: string`, `label?: string`
- Badge: `dot?: boolean`

### Token Consumption Rules
1. All colors → semantic CSS variables (never hardcode hex or Tailwind color classes directly in components)
2. All spacing → spacing scale tokens
3. All radius → radius scale tokens
4. All shadows → shadow scale tokens
See `skills/tokens-reference.md` for values.

## Decision framework
- **If** building a dialog, dropdown, tooltip, popover → use Radix primitive (see `skills/design-system-literacy.md`)
- **If** purely visual with no keyboard/focus complexity → build with Tailwind + CVA
- **If** component exists in shadcn/ui → prefer installing and customizing over building from scratch
- **If** same component used in sidebar AND main content → use `@container` for responsiveness
- **If** you find yourself copy-pasting a pattern 3+ times → extract a component

## Code examples

### CVA — Button Component
```tsx
// ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-[transform,box-shadow,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',
  {
    variants: {
      variant: {
        default:     'bg-neutral-900 text-white shadow-sm hover:-translate-y-px hover:shadow-md active:translate-y-0 focus-visible:ring-neutral-900',
        outline:     'border border-neutral-300 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-neutral-900',
        ghost:       'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-900',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:-translate-y-px hover:shadow-md focus-visible:ring-red-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5',
        lg: 'h-12 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ className, variant, size, loading, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
```

### CVA — Badge Component
```tsx
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default:  'bg-neutral-100 text-neutral-700',
        accent:   'bg-violet-100 text-violet-700',
        success:  'bg-green-100 text-green-700',
        warning:  'bg-amber-100 text-amber-700',
        error:    'bg-red-100 text-red-700',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);
```

### Compound Component — Tabs
```tsx
// Compound pattern: each sub-component is exported from the parent
const TabsContext = createContext({ value: '', onChange: (_: string) => {} });

function Tabs({ value, onChange, children }) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}
function TabsList({ children }) { return <div role="tablist" className="flex border-b">{children}</div>; }
function TabsTrigger({ value, children }) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;
  return (
    <button role="tab" aria-selected={isActive} onClick={() => ctx.onChange(value)}
      className={cn('px-4 py-2 text-sm border-b-2 -mb-px transition-colors', isActive ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700')}>
      {children}
    </button>
  );
}
function TabsContent({ value, children }) {
  const ctx = useContext(TabsContext);
  return ctx.value === value ? <div role="tabpanel">{children}</div> : null;
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
```

### cn() Utility (required by CVA)
```ts
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| Hardcoded hex in component: `className="bg-[#6366f1]"` | Can't theme, no dark mode | Use semantic token: `className="bg-accent"` |
| Separate component per color variant | Explosion of files | Use CVA variants |
| Inconsistent radius: some `rounded`, some `rounded-md`, some `rounded-xl` | Visual drift | Standardize on one radius from tokens-reference |
| Props without TypeScript types | Breaks refactoring | Always type component props with interfaces |
| Giant component file > 200 lines | Hard to maintain | Extract sub-components |

## Tool-specific guidance
- **CVA**: `cva()` defines the base + variants. `cn()` merges with `className` overrides. Install: `npm i class-variance-authority clsx tailwind-merge`
- **shadcn/ui**: `npx shadcn-ui@latest add [component]` adds files to `ui/`. Customize in that file. Don't edit node_modules.
- **Radix**: for Dialog, DropdownMenu, Tabs, Tooltip — always prefer over custom implementations. See `skills/design-system-literacy.md`.

## Done checks
- [ ] `ui/`, `components/`, `blocks/` folder hierarchy exists and is respected.
- [ ] All color references use semantic tokens — no raw hex or direct Tailwind color utilities.
- [ ] All variants defined via CVA — no conditional `className` strings.
- [ ] `size` and `variant` props are consistent across interactive components.
- [ ] All interactive components have default, hover, active, focus, and disabled states.
- [ ] `cn()` utility used for `className` merging.
- [ ] Complex interactive primitives (dialog, dropdown) use Radix or shadcn/ui.
