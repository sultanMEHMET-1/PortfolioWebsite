# UX Heuristics

> Apply cognitive science principles to reduce user effort, create clear hierarchy, and guide attention — before adding visual polish.

## When to apply
- Designing navigation structures and information architecture
- Reviewing a page that feels overwhelming or hard to scan
- Deciding how many options to show at once
- Evaluating whether a layout pattern serves users

## Concrete values

### Miller's Law — Chunking
- **Rule**: working memory holds 7 ±2 items at once
- **Application**: limit navigation links to 5-7 items. Group content into sections of 3-7 items.
- **In practice**: if you have 12 navigation links → group into categories (Products, Company, Resources)

### Hick's Law — Decision Time
- **Rule**: decision time grows logarithmically with the number of options
- **Application**: fewer choices = faster decisions. 3 pricing tiers > 8. 4 nav items > 12.
- **In practice**: hero sections should have ONE primary CTA. Landing pages: one conversion action.

### Fitts's Law — Target Sizing
- **Rule**: time to hit a target depends on size and distance
- **Application**: primary actions should be large (min 44×44px) and centrally positioned. Related actions should be close together.
- **Values**: see `skills/tokens-reference.md` for touch target minimums

### Visual Hierarchy Scoring
Objects compete for attention in this priority order:
1. **Size** — largest element wins first
2. **Color/Contrast** — highest contrast wins
3. **Position** — top-left wins in F-pattern, top overall in Z-pattern
4. **Shape** — unusual shapes win over familiar shapes
5. **Motion** — any motion wins (use sparingly)

Every page section should have one clear winner across these five dimensions.

### Progressive Disclosure
- Show only what is needed for the current task
- Reveal details on demand (expand, hover, click-to-see-more)
- Error messages: show after interaction, not before
- Form validation: validate on blur, not keystroke

### Gestalt Grouping Rules
| Principle | Rule | Application |
|---|---|---|
| Proximity | Close elements are perceived as related | Cards in a group need tighter internal padding than gap between groups |
| Similarity | Similar elements are perceived as related | Use consistent card styles for same-type content |
| Continuity | Eyes follow established directions | Align elements on a consistent axis |
| Closure | Incomplete shapes are perceived as complete | Use implied containers (background shift) instead of explicit borders |
| Common fate | Elements moving together are perceived as related | Stagger children in the same container |

### F-Pattern vs Z-Pattern
| Pattern | Layout | Use for |
|---|---|---|
| F-pattern | Strong left edge, horizontal scanning for headings | Text-heavy content, documentation, blog |
| Z-pattern | Top-left → top-right → diagonal → bottom-right | Marketing, landing pages, conversion-focused |
| Gutenberg | Bottom-right is the "terminal area" | Print-like layouts, long-form content |

## Decision framework
- **If** navigation has > 7 items → group into categories, hide secondary under dropdown
- **If** hero has 2+ CTAs → make one primary (filled), one secondary (outline or ghost)
- **If** content has > 5 related items → paginate or use progressive disclosure (show 3, "load more")
- **If** form has > 4 fields → break into steps (wizard pattern) or group with visual sections
- **If** a section feels overwhelming → count elements, aim for 3-5 focal points max
- **If** the page is marketing/conversion → use Z-pattern: logo top-left, CTA top-right, key proof mid-center, conversion bottom-right
- **If** the page is content/information → use F-pattern: left-aligned headings, body text ragged-right

## Code examples

### Progressive Disclosure — Show More Pattern
```tsx
function ContentWithReveal({ items, visibleCount = 4 }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, visibleCount);

  return (
    <div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
      {items.length > visibleCount && (
        <button onClick={() => setShowAll(!showAll)}
          className="mt-6 text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-4">
          {showAll ? 'Show less' : `Show ${items.length - visibleCount} more`}
        </button>
      )}
    </div>
  );
}
```

### Navigation with Grouping (Hick's Law)
```html
<!-- ✅ Good: grouped, maximum 5-7 visible items -->
<nav class="flex items-center gap-6">
  <a href="/product">Product</a>
  <a href="/pricing">Pricing</a>
  <!-- Group secondary links under dropdown -->
  <DropdownMenu>
    <DropdownMenu.Trigger>Resources</DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item href="/docs">Docs</DropdownMenu.Item>
      <DropdownMenu.Item href="/blog">Blog</DropdownMenu.Item>
      <DropdownMenu.Item href="/changelog">Changelog</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
  <a href="/about">About</a>
</nav>
```

### Single Focal Point — Hero CTA
```html
<!-- ✅ Good: one primary CTA, one supporting secondary -->
<div class="flex items-center gap-3">
  <a href="/start" class="btn-primary">Get started</a>
  <a href="/demo" class="btn-ghost">Watch demo →</a>
</div>

<!-- ❌ Bad: three competing primary CTAs -->
<div class="flex gap-3">
  <a href="/start" class="btn-primary">Start free</a>
  <a href="/pricing" class="btn-primary">See pricing</a>
  <a href="/contact" class="btn-primary">Talk to sales</a>
</div>
```

### Gestalt Proximity — Grouping with Spacing
```css
/* Tight spacing within group, generous between groups */
.feature-group {
  display: grid;
  gap: 1rem;           /* tight — items in same group */
}
.features-section > * + * {
  margin-top: 3rem;    /* generous — between groups */
}
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| 12 navigation links visible | Cognitive overload, Hick's law | Group into 5-7 with dropdown for secondary |
| 3 equal-weight CTAs on hero | No clear primary action | One filled primary, one ghost/outline secondary max |
| Form validation on every keystroke | Frustrating for users mid-type | Validate on blur, show errors after first attempt |
| 20 items visible at once in list | Overwhelming, no hierarchy | Show 4-6, "load more" for rest |
| Equal size for all content | No visual hierarchy | Size primary content 2-3× larger than secondary |
| Cards with equal content density | No visual priority | Use featured/regular pattern for curated content |

## Done checks
- [ ] Navigation has 5-7 visible items max at the primary level.
- [ ] Every hero/section has exactly one primary CTA.
- [ ] No form validates on every keystroke — validate on blur.
- [ ] Lists > 6 items use progressive disclosure (pagination or "show more").
- [ ] Each section has one clear focal point that wins on size, contrast, or position.
- [ ] Content groups use proximity — tight inside, generous between.
- [ ] Page layout matches content type: F-pattern for content, Z-pattern for marketing.
