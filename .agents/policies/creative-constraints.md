# Creative Constraints

These are **hard limits**. They exist because agents (and developers) default to the same patterns when unconstrained: symmetric layouts, Tailwind default colors, generic gradients, decorative animations. Constraints force intentionality.

---

## Color

**60/30/10 rule — enforce strictly:**
- **60%** neutral surfaces (backgrounds, large areas)
- **30%** secondary (text, borders, muted surfaces)
- **10%** accent (CTAs, active states, key highlights only)

**Hard limits:**
- Maximum **2 accent hues** per page. One preferred.
- No **saturated Tailwind defaults** as primary palette (blue-500, purple-500, green-500 as background colors).
- No **large hero gradients** (`bg-gradient-to-*` covering > 50% of viewport height). Gradients are allowed as subtle overlays, decorative elements, or text effects.
- Depth via **opacity layering before saturation**: use `bg-white/10`, `bg-neutral-900/5` before adding a new color.
- Type scale ratio between **1.2 and 1.333** (minor third to perfect fourth). Not smaller (no hierarchy), not larger (too extreme).

---

## Typography

- Maximum **2 font families** per project. One preferred.
- Maximum **5 font weight** variations (300 / 400 / 500 / 600 / 700).
- All text sizes must come from the **defined type scale** — no arbitrary pixel values.
- Body line-height: **1.5–1.7**. Never below 1.4 or above 1.9.
- Heading tracking: **-0.01em to -0.02em** for headings (tight). Body tracking: **0** (default).

---

## Spacing

- Base unit: **8px**. All spacing values are multiples of 4px (half-base acceptable for tight UI).
- No arbitrary spacing values outside the token scale from `skills/tokens-reference.md`.
- Section vertical gaps: fluid via `clamp()` — never a fixed pixel value.
- Hero section: minimum **40% whitespace** (breathing room around content).

---

## Layout

- At least **one asymmetric layout break** per page (7/5 grid, full-bleed section, staggered grid, or bento).
- No more than **3 consecutive symmetric sections** (e.g., 3 full-width stacked sections) without a break.
- Cards in a grid must not all be **identical size** — use at least one featured/prominent variation if presenting curated content.
- Avoid **centered-everything** on the entire page — mix center-aligned with left-aligned sections.

---

## Animation

- Maximum animation duration: **600ms** for any single element.
- Stagger chains: total stagger must complete within **400ms**.
- Every animation must have a **functional purpose** — it communicates state, guides attention, or confirms an action.
- No **looping decorative animations** (rotating shapes, pulsing blobs) unless they serve a purpose (loading state, status indicator).
- No animation in the **critical content rendering path** — don't animate anything that blocks reading.
- `prefers-reduced-motion`: all non-essential animation **must be disabled** when set.

---

## Imagery

- No **generic stock photography** (Unsplash/Pexels lifestyle photos) as hero visuals unless directly product-relevant.
- Use **SVG for icons** — never PNG or JPG icons.
- Use **WebP or AVIF** for photos — never PNG for photographs.
- Avoid **images purely as background decoration** — prefer CSS gradients, shadows, or 3D if the image has no information value.

---

## Depth and Polish

- Achieve depth via **shadow → blur → transparency → color** (in that order). Add the next technique only if the previous isn't sufficient.
- No **aggressive drop shadows** (large blur radius with high opacity on bright elements): use `shadow-lg` maximum for most components.
- Glassmorphism: `backdrop-blur` and transparent backgrounds are allowed but must have **sufficient contrast** against the blurred content.

---

**These constraints are not negotiable per task. They can be updated here if the project's design language genuinely requires a different standard — but they cannot be silently ignored.**
