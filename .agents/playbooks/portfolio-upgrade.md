# Portfolio Upgrade

**Goal**: Turn a generic portfolio into a memorable, high-end personal brand. Not just clean — distinctive.

**The standard to beat**: most developer portfolios feel like the same template. Yours must feel like it was designed with intent, built by someone with taste.

---

## Before Starting

1. Read `policies/creative-constraints.md` entirely.
2. Collect 3 references from Awwwards or Godly — specifically **developer or designer portfolio** winners. Run the 6-point extraction from `skills/visual-references.md`.
3. Write a positioning statement: "I am a [role] who [differentiator 1], [differentiator 2], and [differentiator 3]."
4. Select 2-4 projects. Write one-sentence impact statements for each: "Built [thing] that [measurable result]."

---

## Section Order

```
1. Navigation
2. Hero
3. Featured Work
4. About
5. Experience (optional — can merge with About)
6. Contact
7. Footer
```

---

## Section 1: Navigation

Minimal. Transparent at top, subtle border on scroll.

```html
<nav class="fixed top-0 inset-x-0 z-30">
  <!-- Add border-b + bg-white/80 backdrop-blur-md on scroll via JS class toggle -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <a href="/" class="text-sm font-semibold">Your Name</a>
    <div class="hidden md:flex items-center gap-6">
      <a href="#work" class="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Work</a>
      <a href="#about" class="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">About</a>
      <a href="#contact" class="btn-outline text-sm px-4 py-2">Contact</a>
    </div>
    <button class="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Open menu">
      <!-- hamburger icon -->
    </button>
  </div>
</nav>
```

---

## Section 2: Hero

This is the first impression. It must be distinctive. Pick one approach — do not blend them:

**Option A — Editorial (recommended for developers with visual taste):**
```html
<section class="min-h-[90vh] flex items-center pt-24 pb-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <div class="max-w-4xl space-y-6">
      <!-- Role label -->
      <p class="text-sm font-medium text-neutral-500 tracking-widest uppercase">
        Software Engineer · Available for work
      </p>
      <!-- Oversized display heading — left-aligned, NOT centered -->
      <h1 class="text-[clamp(3rem,7vw+1rem,6rem)] font-bold leading-[1.05] tracking-[-0.03em] max-w-[16ch]">
        Your Name
      </h1>
      <!-- One-liner — specific, not generic -->
      <p class="text-xl text-neutral-600 leading-relaxed max-w-[55ch]">
        I build [specific thing] for [specific audience]. Currently at [Company] working on [what].
      </p>
      <!-- Two actions: primary work, secondary contact -->
      <div class="flex items-center gap-4 flex-wrap">
        <a href="#work" class="btn-primary">See my work</a>
        <a href="https://github.com/yourhandle" class="btn-ghost">GitHub →</a>
      </div>
    </div>
  </div>
</section>
```

**Option B — With visual element (photo or abstract decoration):**
Use 7/5 grid — text left (7 cols), photo or subtle 3D element right (5 cols). See `skills/visual-taste.md` hero template.

**What NOT to do:**
- Centered "Hi, I'm [Name]" with avatar above
- Generic wave emoji or casual greeting
- Listing every skill as a badge row
- "I love building things" — too vague

---

## Section 3: Featured Work

**The single most important section.** Two to four projects. Quality over quantity.

```html
<section id="work" class="py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-end justify-between mb-12">
      <h2 class="text-[clamp(1.75rem,3vw+0.5rem,2.5rem)] font-bold tracking-tight">Selected Work</h2>
      <a href="/projects" class="text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-4">View all →</a>
    </div>

    <div class="space-y-24">
      <!-- Project 1: Large, featured -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-7 relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[16/10]">
          <!-- Project screenshot or mockup -->
          <img src="/projects/project-1.webp" alt="Project 1" fill class="object-cover hover:scale-[1.02] transition-transform duration-700" />
        </div>
        <div class="lg:col-span-5 space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">Web App</span>
            <span class="text-xs text-neutral-400">2024</span>
          </div>
          <h3 class="text-2xl font-bold tracking-tight">Project Name</h3>
          <p class="text-neutral-600 leading-relaxed">
            One to two sentences. What it does. What technology. What the impact was.
            Be specific: "Reduced load time by 40%" beats "improved performance."
          </p>
          <div class="flex flex-wrap gap-2">
            <span class="tag">Next.js</span>
            <span class="tag">TypeScript</span>
            <span class="tag">Postgres</span>
          </div>
          <div class="flex items-center gap-4 pt-2">
            <a href="/projects/project-1" class="text-sm font-medium hover:underline underline-offset-4">Case study →</a>
            <a href="https://github.com/..." class="text-sm text-neutral-500 hover:text-neutral-900">GitHub</a>
          </div>
        </div>
      </div>

      <!-- Project 2: Reverse — visual right, text left -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-5 space-y-4 order-2 lg:order-1">
          <!-- text content -->
        </div>
        <div class="lg:col-span-7 relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[16/10] order-1 lg:order-2">
          <!-- visual -->
        </div>
      </div>
    </div>
  </div>
</section>
```

**Rules:**
- 2-4 projects. Not 12. Curate.
- Alternate layout direction between projects (text-left then text-right).
- Every project needs an impact statement — not just a technology list.
- Show visuals. A screenshot of your actual work is better than a generic gradient card.

---

## Section 4: About

Not a biography. A positioning document.

```html
<section id="about" class="py-24 bg-neutral-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <!-- Photo — 4 cols, offset top -->
      <div class="lg:col-span-4 lg:sticky lg:top-24">
        <div class="relative">
          <img src="/photo.webp" alt="Your Name" width="400" height="480"
               class="rounded-2xl object-cover w-full aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
      <!-- Text — 7 cols, offset -->
      <div class="lg:col-span-7 lg:col-start-6 space-y-6">
        <h2 class="text-[clamp(1.75rem,3vw+0.5rem,2.5rem)] font-bold tracking-tight">About</h2>
        <!-- 2-3 short paragraphs -->
        <p class="text-lg text-neutral-700 leading-relaxed">
          Paragraph 1: Your background and what drives you. Specific, not "passionate developer."
        </p>
        <p class="text-neutral-600 leading-relaxed">
          Paragraph 2: What you're working on or learning now. Shows momentum.
        </p>
        <p class="text-neutral-600 leading-relaxed">
          Paragraph 3 (optional): Outside of work — specific interests, not generic hobbies.
        </p>
        <!-- Skills: minimal, grouped -->
        <div class="space-y-2 pt-4">
          <p class="text-sm font-medium text-neutral-500 uppercase tracking-wider">Currently working with</p>
          <p class="text-neutral-700">TypeScript, React, Next.js, Go, PostgreSQL, Tailwind CSS</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Section 5: Contact

Minimal. Lower barrier — direct links over forms.

```html
<section id="contact" class="py-24">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
    <h2 class="text-[clamp(2rem,4vw+0.5rem,3rem)] font-bold tracking-tight">
      Let's work together
    </h2>
    <p class="text-lg text-neutral-600">
      Open to full-time roles and interesting freelance projects.
    </p>
    <a href="mailto:you@domain.com" class="btn-primary text-base px-8 py-4">
      Send an email →
    </a>
    <!-- Secondary: social links -->
    <div class="flex items-center justify-center gap-6 text-sm text-neutral-500">
      <a href="https://github.com/..." class="hover:text-neutral-900 transition-colors">GitHub</a>
      <a href="https://linkedin.com/..." class="hover:text-neutral-900 transition-colors">LinkedIn</a>
      <a href="https://x.com/..." class="hover:text-neutral-900 transition-colors">X / Twitter</a>
    </div>
  </div>
</section>
```

---

## The Signature Move

Every great portfolio has one interaction that makes it stick in memory. Pick exactly one:

| Signature | What it is | Complexity |
|---|---|---|
| **Cursor follower** | Custom cursor dot that follows mouse with spring lag | Medium |
| **Magnetic hover** | Buttons attract the cursor on hover | Medium |
| **Page transition** | Smooth route change with slide/fade | Low-Medium |
| **Scroll-reveal hero name** | Hero heading animates letter by letter on load | Low |
| **Project image hover preview** | Project card shows full screenshot on hover | Medium |
| **Subtle 3D background** | Floating geometry in hero, barely visible | High |

Implement one. Do it well. Do not implement multiple — they cancel each other out.

---

## Animation for Portfolio

1. **Hero**: stagger: role label → name → bio → CTAs. Delays: 0, 0.1, 0.2, 0.3s. Duration 0.7s each.
2. **Project cards**: scroll reveal with `translateY(30px)` → 0, `opacity: 0` → 1. Stagger 0.1s between projects.
3. **About photo**: fade in + subtle scale from 0.98 → 1 on scroll.
4. **Navigation border**: add on scroll using `IntersectionObserver` on a sentinel element.

---

## Validation

Run all Gate 2 checks. Then:
- Read the full page as if you are a hiring manager or client seeing it for the first time.
- Does the first sentence tell them who you are and what you do?
- Is there one project that would make them say "impressive"?
- Is there a way to contact you within 2 clicks from the hero?

If all three are yes: ship it.
