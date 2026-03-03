# Mehmet Mercan — Portfolio Website

A premium, animated personal portfolio built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Your Content

LinkedIn blocks automated access, so content must be added manually.

1. Open the files in `src/content/` and replace all `TODO:` placeholders with your real data
2. See `content-intake/README.md` for detailed instructions on exporting your LinkedIn profile

### Content Files

| File | What to edit |
|---|---|
| `src/content/profile.ts` | Name, headline, summary, contact links |
| `src/content/experience.ts` | Work history timeline |
| `src/content/projects.ts` | Project cards with tech tags |
| `src/content/education.ts` | Education entries |
| `src/content/skills.ts` | Skill groups |
| `src/content/posts.ts` | Articles/blog posts (optional) |
| `src/content/awards.ts` | Awards/leadership (optional) |

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Framer Motion** (motion system with tokens, reduced-motion support)
- **Vitest** + **Testing Library** (unit & component tests)
- **Playwright** (E2E tests)

## Running Tests

```bash
# Unit + component tests
npm run test

# E2E tests (starts dev server automatically)
npm run test:e2e

# Build (production)
npm run build
```

## Project Structure

```
src/
├── app/              # Pages (layout, home, about, experience, projects, contact)
├── components/
│   ├── layout/       # Header, Footer, MobileNav
│   ├── motion/       # MotionProvider, tokens, ScrollReveal, StaggerChildren
│   ├── sections/     # Hero, ExperienceTimeline, ProjectGrid, SkillsMatrix, etc.
│   └── ui/           # Button, Card, Container, Section, Tag
├── content/          # Typed data files (profile, experience, projects, etc.)
├── lib/              # Utils, filters, SEO helpers
└── styles/           # globals.css with design tokens
tests/                # Vitest unit + component tests
e2e/                  # Playwright E2E tests
content-intake/       # Instructions for LinkedIn data import
```

## Motion System

Animations are controlled by centralized tokens in `src/components/motion/tokens.ts`:
- **Durations**: fast (0.15s), base (0.3s), slow (0.6s)
- **Easing**: standard, emphasized, bounce
- **Stagger**: configurable delay between children

All motion respects `prefers-reduced-motion`. When enabled, animations are disabled and all content is shown immediately.

## Design System

- **Palette**: Warm neutrals (stone) + muted indigo accent (`#6366f1`)
- **Font**: Inter via `next/font/google`
- **Spacing**: Consistent scale via Tailwind tokens
- **Layout**: Mobile-first, tested at 375px and 1440px

## Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Deploy — no config needed
4. To add a custom `.tech` domain:
   - Go to **Project Settings → Domains**
   - Add your domain (e.g., `mehmetmercan.tech`)
   - Update DNS records as instructed by Vercel

## Manual UI Testing Checklist

- [x] Desktop: nav links work, scroll through all sections
- [x] Desktop: hover on project cards, open detail modal
- [x] Desktop: project search and tag filtering
- [x] Mobile (375px): hamburger menu opens and closes
- [x] Mobile: navigate via mobile drawer
- [x] Mobile: no horizontal scrollbar
- [x] Mobile: touch targets ≥ 40px
- [x] Reduced motion: animations disabled, content still visible
- [x] No console errors in application code
- [x] Build compiles without errors
