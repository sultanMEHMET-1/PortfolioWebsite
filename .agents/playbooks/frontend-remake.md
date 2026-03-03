# Frontend Remake

**Goal**: Rebuild the UI with stronger hierarchy, polish, and validated quality across all viewports.

**Estimated phases**: 7. Complete them in order. Do not skip phases.

---

## Phase 1: Audit and Brief

**Skills to read**: `skills/visual-taste.md`, `skills/visual-references.md`

**Steps:**
1. Detect the project framework (check `AGENTS.md` framework detection table).
2. Capture full-page screenshots of the current UI at 375px, 768px, and 1280px. Save as `screenshots/before/`.
3. Write a short audit identifying:
   - 3 things that are working well (do not break these)
   - 5 specific pain points (what looks "flat," "generic," or "broken")
4. Define a positioning statement: who is this for, what impression should it make?
5. Collect 3-5 references from Awwwards, Godly, or Land-book. Apply the 6-point extraction framework from `skills/visual-references.md`. Document what you are borrowing structurally.
6. Write a one-paragraph design brief: audience, impression target, visual tone (editorial / clean tech / bold / minimal).

**Deliverable**: brief document + screenshot set + reference extraction notes.
**Exit criteria**: clear understanding of what changes and what doesn't.

---

## Phase 2: Token Foundation

**Skills to read**: `skills/tokens-reference.md`, `skills/color-system.md`, `skills/typography.md`

**Steps:**
1. Create or update `src/styles/tokens.css` (or equivalent) with:
   - Full neutral scale in OKLCH (11 steps from `oklch(0.985 0.002 240)` to `oklch(0.13 0.004 240)`)
   - One accent hue at 5 lightness variants (95, 85, 55, 40, 25)
   - Semantic token mapping (surface, text, border, accent)
   - Spacing scale (`--space-1` through `--space-32`)
   - Radius scale (`--radius-sm` through `--radius-full`)
   - Shadow scale (`--shadow-xs` through `--shadow-xl`)
2. Define the type scale: Display, H1-H4, Body, Small, Caption — with exact sizes and fluid `clamp()` formulas for Display through H2. Apply `font-display: swap`.
3. If using Tailwind, extend `tailwind.config.js` to reference CSS variables for colors and radius.
4. Verify: all tokens render correctly in the browser with a test HTML file or Storybook.

**Deliverable**: token file + Tailwind config update.
**Exit criteria**: zero raw hex or arbitrary values needed for any UI element.

---

## Phase 3: Layout Skeleton

**Skills to read**: `skills/layout-systems.md`, `skills/visual-taste.md`, `skills/ux-heuristics.md`

**Steps:**
1. Draft the page structure — list every section in order with its layout type:
   - Hero: 7/5 asymmetric split? Full-width with centered text? Editorial with oversized type?
   - Features: bento grid? alternating image/text? icon grid?
   - Proof/testimonials: card row? single large quote? logo strip?
   - CTA: full-bleed? centered column?
2. Implement the layout skeleton with placeholder content — no real images, no final copy. Focus on:
   - Container with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
   - Grid column assignments using 12-col grid
   - Section vertical spacing with `clamp(3rem, 8vw, 6rem)`
3. Insert at least one intentional break per page (full-bleed, asymmetric, or staggered).
4. Validate skeleton at 375px and 1440px — fix column collapse and overflow issues.

**Deliverable**: page layout skeleton with correct grid structure.
**Exit criteria**: layout holds at 375px and 1440px. Grid breaks are intentional, not accidental.

---

## Phase 4: Core Components

**Skills to read**: `skills/component-system.md`, `skills/design-system-literacy.md`, `skills/micro-interactions.md`

**Steps:**
1. Audit existing components. Remove duplicates and components with hardcoded styles.
2. Set up folder structure: `ui/` (primitives), `components/` (composed), `blocks/` (sections).
3. Build or upgrade core primitives:
   - **Button**: default, outline, ghost, destructive variants; sm/md/lg sizes; all 5 states. Use CVA.
   - **Card**: hover lift (`translateY(-2px)` + `shadow-md`), border, rounded-xl.
   - **Input**: focus ring, error state, label pairing.
   - **Badge/Tag**: color variants.
4. For complex primitives (Dialog, Dropdown, Tooltip) — install or verify Radix-based shadcn/ui components.
5. Implement `group-hover:` patterns for parent-triggered child effects (no React state for hover).

**Deliverable**: upgraded component library with consistent tokens and all states.
**Exit criteria**: all button/card/input variants render correctly. No hardcoded colors.

---

## Phase 5: Motion and Polish

**Skills to read**: `skills/motion-design.md`, `skills/micro-interactions.md`, `skills/scroll-animation.md`, optionally `skills/3d-effects.md`

**Steps:**
1. Define animation purpose for each element — reject any animation without a clear reason.
2. Set up Framer Motion variants for page sections:
   - Stagger children: 70ms interval, max 400ms total
   - Enter: `opacity: 0, y: 20` → rest at `duration: 0.5, ease: [0.16, 1, 0.3, 1]`
3. Set up scroll reveals using GSAP ScrollTrigger or Intersection Observer:
   - Trigger at `"top 85%"`, `once: true`
   - Translate `y: 30px` → 0, opacity 0 → 1
4. Add Lenis smooth scroll (optional but recommended): initialize in root layout, sync with GSAP ticker.
5. If adding 3D effect: use as background element (`-z-10`, `pointer-events-none`), test at 60fps on throttled device.
6. Validate: check `prefers-reduced-motion` disables all non-essential animation.

**Deliverable**: motion layer complete, `prefers-reduced-motion` handled.
**Exit criteria**: no animation exceeds 600ms. All motion has functional purpose. Reduced motion works.

---

## Phase 6: Responsive Pass

**Skills to read**: `skills/responsive.md`, `skills/accessibility.md`

**Steps:**
1. Test every page at 375px, 768px, 1280px, 1440px using Playwright or browser devtools.
2. Fix issues in this order:
   - Horizontal overflow → fix container width or overflow-hidden
   - Touch targets < 44px → increase padding
   - Navigation unusable on mobile → verify hamburger works, drawer opens/closes
   - Images causing CLS → add explicit width/height
3. Add or verify skip link as first body element.
4. Verify heading order is logical (h1 → h2 → h3, no skipping).
5. Run keyboard navigation: tab through every page, verify every interactive element is reachable.
6. Run axe-core on all primary pages. Fix all violations.

**Deliverable**: responsive, accessible UI at all breakpoints.
**Exit criteria**: zero overflow at 375px. Zero axe-core violations. All interactive elements keyboard-reachable.

---

## Phase 7: Validation and Finalize

**Skills to read**: `skills/real-world-validation.md`, `skills/performance.md`, `policies/definition-of-done.md`

**Steps:**
1. Capture final screenshots at 375px, 768px, 1280px, 1440px. Save to `screenshots/after/`.
2. Compare before/after: confirm intended changes and no regressions.
3. Run Playwright E2E test suite — fix any failures.
4. Run Lighthouse: Performance ≥ 85, Accessibility ≥ 95, CLS < 0.1.
5. Optimize any failing metrics:
   - If LCP slow → check hero image optimization and preload
   - If CLS high → add width/height to images, fix dynamic insertions above fold
6. Work through `policies/definition-of-done.md` checklist top to bottom. Every item must be checked.
7. Document: write a brief changelog of what changed and why.

**Deliverable**: screenshot set (before/after), Lighthouse scores, all gates passing.
**Exit criteria**: all items in `policies/definition-of-done.md` are checked. All `policies/quality-gates.md` Gate 2 checks pass.
