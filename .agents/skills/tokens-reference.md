# Tokens Reference

> Central design token tables. Every other skill references this file for spacing, radius, shadow, z-index, breakpoints, and container values.

## Spacing Scale

Base unit: 4px. All spacing must be a multiple of 4.

| Token   | px  | rem    | Tailwind  | Use case                          |
|---------|-----|--------|-----------|-----------------------------------|
| space-1 | 4   | 0.25   | `p-1`     | Icon padding, tight gaps          |
| space-2 | 8   | 0.5    | `p-2`     | Inline element gaps, badge padding|
| space-3 | 12  | 0.75   | `p-3`     | Button padding-y, input padding   |
| space-4 | 16  | 1      | `p-4`     | Card padding, list item spacing   |
| space-5 | 20  | 1.25   | `p-5`     | Small section gaps                |
| space-6 | 24  | 1.5    | `p-6`     | Card padding (comfortable)        |
| space-8 | 32  | 2      | `p-8`     | Section inner padding             |
| space-10| 40  | 2.5    | `p-10`    | Section gaps on mobile            |
| space-12| 48  | 3      | `p-12`    | Section gaps on tablet            |
| space-16| 64  | 4      | `p-16`    | Section gaps on desktop           |
| space-20| 80  | 5      | `p-20`    | Hero vertical padding             |
| space-24| 96  | 6      | `p-24`    | Large section vertical rhythm     |
| space-32| 128 | 8      | `p-32`    | Maximum hero breathing room       |

Fluid section padding: `clamp(2rem, 5vw, 6rem)` — scales from 32px to 96px.

## Border Radius Scale

| Token      | px   | Tailwind       | Use case                    |
|------------|------|----------------|-----------------------------|
| radius-none| 0    | `rounded-none` | Tables, code blocks         |
| radius-sm  | 2    | `rounded-sm`   | Tags, small badges          |
| radius-md  | 4    | `rounded`      | Inputs, small buttons       |
| radius-default | 6 | `rounded-md`  | General purpose             |
| radius-lg  | 8    | `rounded-lg`   | Cards, modals, images       |
| radius-xl  | 12   | `rounded-xl`   | Feature cards, hero elements|
| radius-2xl | 16   | `rounded-2xl`  | Large containers, panels    |
| radius-full| 9999 | `rounded-full` | Avatars, pills, toggles     |

Default for most components: `radius-lg` (8px). Premium sites converge on 8px for cards and interactive elements.

## Shadow Scale

| Token      | Value                                                    | Tailwind      | Use case                |
|------------|----------------------------------------------------------|---------------|-------------------------|
| shadow-xs  | `0 1px 2px rgba(0,0,0,0.05)`                            | `shadow-sm`   | Subtle depth, inputs    |
| shadow-sm  | `0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | `shadow`     | Cards at rest           |
| shadow-md  | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | `shadow-md`  | Cards on hover          |
| shadow-lg  | `0 8px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)` | `shadow-lg`  | Floating elements       |
| shadow-xl  | `0 20px 50px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)` | `shadow-xl` | Modals, popovers        |

Hover pattern: transition from `shadow-sm` to `shadow-md` on hover. Never jump more than 2 levels.

## Backdrop Blur Scale

| Token    | Value | Tailwind          | Use case                     |
|----------|-------|--------------------|------------------------------|
| blur-sm  | 4px   | `backdrop-blur-sm` | Subtle glass on dark surfaces|
| blur-md  | 8px   | `backdrop-blur`    | Navigation bar backdrop      |
| blur-lg  | 12px  | `backdrop-blur-md` | Modal overlay background     |
| blur-xl  | 20px  | `backdrop-blur-lg` | Heavy glassmorphism effect   |

## Z-Index Scale

| Token    | Value | Use case                         |
|----------|-------|----------------------------------|
| z-base   | 0     | Normal flow content              |
| z-raised | 10    | Cards, elevated surfaces         |
| z-dropdown| 20   | Dropdowns, popovers              |
| z-sticky | 30    | Sticky headers, navigation       |
| z-overlay| 40    | Modal overlays, backdrops        |
| z-modal  | 50    | Modal content                    |
| z-toast  | 60    | Toast notifications              |
| z-tooltip| 70    | Tooltips (always on top)         |

## Breakpoints

| Token | px   | Tailwind | Target                           |
|-------|------|----------|----------------------------------|
| sm    | 640  | `sm:`    | Large phones landscape            |
| md    | 768  | `md:`    | Tablets portrait                  |
| lg    | 1024 | `lg:`    | Tablets landscape, small laptops  |
| xl    | 1280 | `xl:`    | Laptops, standard desktops        |
| 2xl   | 1536 | `2xl:`   | Large desktops, wide monitors     |

Testing viewports: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1280px (laptop), 1440px (desktop), 1920px (wide).

## Container

| Property     | Value             | CSS                                           |
|-------------|-------------------|-----------------------------------------------|
| max-width   | 1200px            | `max-width: 75rem;`                           |
| side padding| responsive        | `px-4 sm:px-6 lg:px-8` (16/24/32px)          |
| center      | auto margins      | `mx-auto`                                     |

CSS: `max-width: 75rem; margin-inline: auto; padding-inline: clamp(1rem, 3vw, 2rem);`

## Transition Defaults

| Property       | Value                                    |
|----------------|------------------------------------------|
| duration-micro | 100ms (color changes, opacity)           |
| duration-fast  | 150ms (hover states, focus)              |
| duration-base  | 250ms (general transitions)              |
| duration-slow  | 400ms (layout changes, modals)           |
| duration-xslow | 600ms (page transitions, hero reveals)   |
| ease-default   | `cubic-bezier(0.16, 1, 0.3, 1)` (expo out)|
| ease-hover     | `cubic-bezier(0.33, 1, 0.68, 1)` (cubic out)|
| ease-bounce    | `cubic-bezier(0.34, 1.56, 0.64, 1)`     |

## CSS Custom Properties Template

```css
:root {
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 8px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05);

  /* Z-index */
  --z-sticky: 30;
  --z-overlay: 40;
  --z-modal: 50;
  --z-toast: 60;

  /* Container */
  --container-max: 75rem;
  --container-padding: clamp(1rem, 3vw, 2rem);

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
}
```
