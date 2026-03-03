# Definition of Done

Every UI change must pass **all** items in this checklist before the task is considered complete. No exceptions.

---

## Visual

- [ ] **Focal point**: every page section has one dominant visual element — the eye lands within 2 seconds.
- [ ] **Type scale**: all text sizes come from the defined scale in `skills/typography.md`. No arbitrary pixel sizes.
- [ ] **Spacing**: all gaps and padding use tokens from `skills/tokens-reference.md`. No magic numbers.
- [ ] **Colors**: every color in every component maps to a semantic token. Zero raw hex, rgb, or hsl in component files.
- [ ] **Depth**: cards and elevated elements use shadow before color. At least one section uses shadow or backdrop-blur for depth.
- [ ] **Asymmetry**: at least one section per page breaks the symmetric grid pattern (asymmetric split, full-bleed, stagger, or bento).
- [ ] **No large hero gradient**: primary visual is not a `bg-gradient-to-*` covering 80%+ of the viewport.

---

## Interaction

- [ ] **No layout shift**: no element changes layout dimensions on hover or focus — only `transform` and `opacity` change.
- [ ] **Hover states**: all interactive elements respond visually on hover (color, shadow, or transform change).
- [ ] **Focus states**: visible focus ring on all interactive elements — on all background colors without relying on color alone.
- [ ] **Active states**: buttons and links have a pressed/active state.
- [ ] **Disabled states**: disabled elements have `opacity-50` and `cursor-not-allowed`.
- [ ] **Touch targets**: all interactive elements are at minimum 44×44px.

---

## Accessibility

- [ ] **Keyboard navigation**: all actions reachable and operable via keyboard (Tab, Enter, Space, Escape, arrow keys).
- [ ] **Focus order**: tab order follows visual reading order.
- [ ] **Contrast**: body text on primary background ≥ 4.5:1. Large text ≥ 3:1. UI components ≥ 3:1.
- [ ] **Semantics**: buttons use `<button>`, navigation uses `<nav>`, headings use `<h1>`-`<h6>` in logical order.
- [ ] **Labels**: all icon buttons have `aria-label`. All form inputs have `<label htmlFor>`.
- [ ] **Reduced motion**: all non-essential animation is disabled when `prefers-reduced-motion: reduce` is set.
- [ ] **Axe-core**: zero violations on primary pages.

---

## Screenshots & Testing

- [ ] **Screenshots captured**: full-page screenshots at 375px, 768px, 1280px, and 1440px for all changed pages.
- [ ] **No visual regression**: before/after comparison shows only intended changes (diff < 0.5% of pixels).
- [ ] **Interaction tests pass**: Playwright tests for key user flows (navigation, clicks, form submission) all pass.
- [ ] **Mobile tested**: no horizontal overflow at 375px, touch targets meet minimums.

---

## Performance

- [ ] **Lighthouse Performance ≥ 85** on changed pages.
- [ ] **Lighthouse Accessibility ≥ 95** on changed pages.
- [ ] **CLS < 0.1**: no layout shift during page load or on interaction.
- [ ] **Images optimized**: hero images ≤ 200KB, thumbnails ≤ 50KB, all have `width` and `height`.
- [ ] **Animation properties**: only `transform` and `opacity` animated — never `top`, `left`, `width`, `height`.

---

## Documentation

- [ ] **Component variants**: any new component has variants documented (in code via CVA or in a story).
- [ ] **Token usage**: no inline styles or hard-coded values introduced.
- [ ] **Breaking changes noted**: if a component API changed, that is noted in the PR or commit.

---

**Failing any item means the task is not done. Fix first, then close.**
