# Landing Page Build

**Goal**: Create a high-conversion marketing page with clear hierarchy, intentional sections, and validated performance.

**Before starting**: Read `policies/creative-constraints.md`. Every section below must respect those constraints.

---

## Section Order

```
1. Navigation
2. Hero
3. Social Proof (logos / trust)
4. Features / Benefits
5. Proof (testimonials / case study)
6. CTA Section
7. Footer
```

---

## Section 1: Navigation

**Skills**: `skills/component-system.md`, `skills/accessibility.md`

```html
<!-- Sticky nav: blur backdrop, minimal links -->
<nav class="fixed top-0 inset-x-0 z-30 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <!-- Logo: left -->
    <a href="/" class="text-base font-semibold tracking-tight">Brand</a>

    <!-- Links: center or right — max 5-7 items -->
    <div class="hidden md:flex items-center gap-6">
      <a href="#features" class="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Features</a>
      <a href="#pricing" class="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Pricing</a>
    </div>

    <!-- Primary CTA: right -->
    <div class="flex items-center gap-3">
      <a href="/login" class="text-sm text-neutral-600 hover:text-neutral-900">Log in</a>
      <a href="/signup" class="btn-primary text-sm px-4 py-2">Get started</a>
    </div>

    <!-- Mobile hamburger -->
    <button class="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Open menu">
      <!-- HamburgerIcon -->
    </button>
  </div>
</nav>
```

**Rules:**
- Maximum 5-7 navigation items
- Single primary CTA on the right
- `backdrop-blur-md` with 80% opacity background — not solid

---

## Section 2: Hero

**Skills**: `skills/visual-taste.md`, `skills/typography.md`, `skills/motion-design.md`

Layout options (pick one):
- **Option A — Asymmetric (text + visual)**: 7/5 split, text left, product visual right
- **Option B — Centered editorial**: narrow column (max-w-3xl), large oversized type, minimal
- **Option C — Full-width with video/3D**: full-bleed, content overlaid

**Template (Option A — recommended):**
```html
<section class="pt-32 pb-24 lg:pb-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <!-- Text — 7 columns -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Eyebrow label -->
        <div class="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
          New · Version 2.0 released
        </div>

        <!-- Display heading: fluid, tight, max 20 chars -->
        <h1 class="text-[clamp(2.5rem,5vw+1rem,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] max-w-[18ch]">
          The one-line value proposition
        </h1>

        <!-- Supporting text: 1-2 sentences, 50ch max -->
        <p class="text-lg text-neutral-600 leading-relaxed max-w-[50ch]">
          One to two sentences explaining who this is for and what it does.
          Clear, specific, no buzzwords.
        </p>

        <!-- CTAs: ONE primary, ONE secondary ghost -->
        <div class="flex items-center gap-3 flex-wrap">
          <a href="/signup" class="btn-primary">Start free →</a>
          <a href="/demo" class="btn-ghost">Watch demo</a>
        </div>

        <!-- Trust signal under CTA -->
        <p class="text-xs text-neutral-500">No credit card required · 14-day free trial</p>
      </div>

      <!-- Visual — 5 columns with depth -->
      <div class="lg:col-span-5 relative">
        <div class="relative rounded-xl shadow-lg overflow-hidden border border-neutral-200 bg-white">
          <!-- Product screenshot or UI mockup -->
          <img src="/product-preview.webp" alt="Product preview" width="800" height="600"
               class="w-full h-auto" loading="eager" fetchpriority="high" />
        </div>
        <!-- Depth halo behind visual -->
        <div class="absolute -z-10 -inset-4 bg-violet-100/50 rounded-2xl blur-2xl opacity-60"></div>
      </div>
    </div>
  </div>
</section>
```

**Rules:**
- One primary CTA. One secondary (ghost/outline). Never two filled buttons.
- Display heading: `clamp(2.5rem, 5vw + 1rem, 3.5rem)`, `max-w-[18-20ch]`
- Trust signal below CTA (no credit card, trial length, user count)
- Product visual has a depth halo element behind it (`-z-10`, `blur-2xl`)

---

## Section 3: Social Proof — Logo Bar

**Skills**: `skills/visual-taste.md`

```html
<section class="py-12 border-y border-neutral-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="text-center text-sm text-neutral-500 mb-8">Trusted by teams at</p>
    <div class="flex items-center justify-center gap-8 flex-wrap">
      <!-- Logo images: grayscale at rest, full color on hover -->
      <img src="/logos/company-1.svg" alt="Company 1" height="24"
           class="h-6 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200" />
      <!-- repeat for 5-8 logos -->
    </div>
  </div>
</section>
```

**Rules:**
- Grayscale logos, opacity 40-60%. Full color on hover.
- Maximum 8 logos. Fewer is stronger.
- Short label: "Trusted by teams at" or "Used by engineers at"

---

## Section 4: Features / Benefits

**Skills**: `skills/layout-systems.md`, `skills/visual-taste.md`, `skills/ux-heuristics.md`

Layout options:
- **Bento grid**: 12-col grid with varied card sizes for visual interest
- **Alternating**: image/mockup on left, text on right, then reversed
- **Icon grid**: 2-col or 3-col with icon + headline + 1-line description

**Bento template (most distinctive):**
```html
<section class="py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
      <h2 class="text-[clamp(1.75rem,3vw+0.5rem,2.5rem)] font-bold tracking-tight">
        Section heading
      </h2>
      <p class="text-neutral-600">One sentence description.</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Large feature card: 8 cols -->
      <div class="col-span-12 md:col-span-8 bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
        <h3 class="text-xl font-semibold mb-2">Primary feature headline</h3>
        <p class="text-neutral-600 mb-6">One to two sentences.</p>
        <!-- Product screenshot or illustration -->
      </div>
      <!-- Small feature: 4 cols -->
      <div class="col-span-12 md:col-span-4 bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
        <h3 class="text-lg font-semibold mb-2">Secondary feature</h3>
        <p class="text-neutral-600">One sentence.</p>
      </div>
      <!-- Two medium cards: 6 cols each -->
      <div class="col-span-12 md:col-span-6 bg-neutral-50 rounded-2xl p-8 border border-neutral-200">...</div>
      <div class="col-span-12 md:col-span-6 bg-neutral-50 rounded-2xl p-8 border border-neutral-200">...</div>
    </div>
  </div>
</section>
```

**Rules:**
- Section heading ≤ 8 words. Subheading ≤ 15 words.
- Maximum 6 features. If more, use progressive disclosure (tabs or accordion).
- Varied card sizes in bento — do not make all cards equal.

---

## Section 5: Testimonials / Proof

```html
<section class="py-24 bg-neutral-950 text-white">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
    <!-- Single featured quote — more impactful than a carousel -->
    <blockquote class="text-[clamp(1.25rem,2vw+0.5rem,1.75rem)] font-medium leading-relaxed">
      "The most impactful quote from a real customer. Specific, not generic."
    </blockquote>
    <div class="flex items-center justify-center gap-3">
      <img src="/avatars/user.webp" alt="Name" width="40" height="40" class="rounded-full size-10 object-cover" />
      <div class="text-left">
        <p class="text-sm font-medium">Full Name</p>
        <p class="text-sm text-neutral-400">Title, Company</p>
      </div>
    </div>
  </div>
</section>
```

**Rules:**
- One strong quote > three weak ones. Curate, don't aggregate.
- Dark section creates contrast rhythm against white feature sections.
- Quote must be specific and verifiable — not "it changed our lives."

---

## Section 6: CTA Section

```html
<section class="py-24">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
    <h2 class="text-[clamp(2rem,4vw+0.5rem,3rem)] font-bold tracking-tight">
      Final CTA headline — repeat the primary value
    </h2>
    <p class="text-lg text-neutral-600">One-sentence urgency or benefit reminder.</p>
    <div class="flex items-center justify-center gap-3">
      <a href="/signup" class="btn-primary text-base px-8 py-4">Get started free →</a>
    </div>
    <p class="text-sm text-neutral-500">No credit card required</p>
  </div>
</section>
```

---

## Section 7: Footer

```html
<footer class="border-t border-neutral-200 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <!-- Link columns: Product, Company, Resources, Legal -->
    </div>
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500 border-t border-neutral-100 pt-8">
      <p>© 2025 Company Name</p>
      <div class="flex gap-4"><!-- Social links --></div>
    </div>
  </div>
</footer>
```

---

## Animation for Landing Page

Apply after structure is complete:
1. Hero text: stagger reveal (eyebrow → heading → body → CTA), delay 0.1s between, each 0.5s duration
2. Logo bar: fade in as group at 0.3s delay
3. Feature cards: scroll reveal with GSAP, `start: "top 85%"`, `once: true`, stagger 0.08s
4. CTA section: simple fade up on scroll

---

## Validation

Run all Gate 2 checks from `policies/quality-gates.md`.

Final screenshot set: nav (hover state), hero (full viewport), features, proof, CTA, footer — at 375px, 768px, 1440px.
