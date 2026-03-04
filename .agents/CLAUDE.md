# Frontend Skill Pack

This `.agents/` folder contains a complete frontend skill system. Read this file first, then follow the instructions below.

## What This Is

A set of skills, policies, and playbooks that produce polished, intentional frontends. Skills provide concrete values and code examples. Policies enforce quality standards. Playbooks give step-by-step workflows for common tasks.

## How to Use

1. Read `skill-pack.json` for the manifest and read order.
2. Always read **all three policies** before starting any UI work.
3. Read `skills/tokens-reference.md` — this is the foundation every other skill references.
4. Read skills relevant to your current task (not all 17 at once).
5. Follow the appropriate playbook if one matches your task.
6. Run quality gates before considering work done.

## When to Read Which Skills

| Task | Required Skills |
|------|----------------|
| New page layout | tokens-reference, layout-systems, visual-taste, responsive |
| Typography setup | tokens-reference, typography |
| Color palette | tokens-reference, color-system |
| Adding animation | motion-design, micro-interactions, scroll-animation |
| Building components | component-system, design-system-literacy |
| Accessibility pass | accessibility, responsive |
| Performance audit | performance, real-world-validation |
| Full redesign | Follow `playbooks/frontend-remake.md` (loads skills per phase) |
| Landing page | Follow `playbooks/landing-page.md` |
| Portfolio | Follow `playbooks/portfolio-upgrade.md` |

## Framework Detection

Before writing code, detect the project's stack:

| Config file | Framework | Adapt |
|-------------|-----------|-------|
| `next.config.*` | Next.js | Use `<Image>`, App Router, server components |
| `vite.config.*` | Vite | Check `package.json` for React/Vue/Svelte |
| `astro.config.*` | Astro | Use `.astro` components, islands architecture |
| `index.html` at root, no config | Plain HTML | Use vanilla CSS/JS only |
| `remix.config.*` or `app/root.tsx` with remix deps | Remix | Use loaders/actions, nested routes |

Also check `package.json` for available tools:
- `tailwindcss` → use Tailwind utilities (preferred if present)
- `framer-motion` or `motion` → use Framer Motion for component animation
- `gsap` → use GSAP for scroll-driven and timeline animation
- `@radix-ui/*` → use Radix primitives for accessible components
- None of the above → use plain CSS and vanilla JS

## Required Workflow

For every UI change:

1. Implement the change following relevant skills.
2. Run linting and type-checking.
3. Run UI tests (if configured): `npm run ui:test` or `pnpm ui:test`
4. Capture screenshots at 375px, 768px, and 1440px.
5. Run accessibility checks.
6. Run performance audit on changed pages.
7. Verify all quality gate checks pass.
8. Only then consider the task done.

## File Structure

```
.agents/
├── AGENTS.md              ← You are here
├── skill-pack.json        ← Manifest with read order
├── skills/
│   ├── tokens-reference.md   ← Foundation: spacing, radius, shadow, z-index
│   ├── visual-taste.md       ← Hierarchy, rhythm, composition
│   ├── layout-systems.md     ← Grids, containers, responsive spacing
│   ├── typography.md         ← Type scale, fluid sizing, font stacks
│   ├── color-system.md       ← OKLCH palettes, semantic tokens
│   ├── motion-design.md      ← Animation principles, easing, durations
│   ├── micro-interactions.md ← Hover, focus, press states
│   ├── scroll-animation.md   ← GSAP ScrollTrigger, Lenis, parallax
│   ├── 3d-effects.md         ← Three.js / R3F for subtle WebGL
│   ├── component-system.md   ← Variants, folder structure, composition
│   ├── design-system-literacy.md ← Radix, shadcn/ui, Tailwind patterns
│   ├── ux-heuristics.md      ← Cognitive load, progressive disclosure
│   ├── responsive.md         ← Breakpoints, touch targets, fluid spacing
│   ├── accessibility.md      ← Semantic HTML, ARIA, focus, contrast
│   ├── performance.md        ← Core Web Vitals, budgets, optimization
│   ├── real-world-validation.md  ← Playwright, screenshots, audits
│   └── visual-references.md  ← Reference extraction, adaptation rules
├── policies/
│   ├── definition-of-done.md    ← Checklist for every UI change
│   ├── creative-constraints.md  ← Hard limits that prevent generic output
│   └── quality-gates.md         ← Automated gates that must pass
└── playbooks/
    ├── frontend-remake.md    ← Full redesign workflow
    ├── landing-page.md       ← Marketing page blueprint
    └── portfolio-upgrade.md  ← Portfolio-specific guide
```
