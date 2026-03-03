# Content Intake — How to Add Your LinkedIn Data

Since LinkedIn blocks automated access, you'll need to provide your profile data manually.

## Option 1: LinkedIn PDF Export (Recommended)

1. Go to your LinkedIn profile page
2. Click the **More** button (three dots) below your profile header
3. Select **Save to PDF**
4. Save the downloaded PDF to this folder as `linkedin.pdf`
5. Run `npm run ingest:linkedin` (coming soon) or manually copy data into `/src/content/` files

## Option 2: Plain Text Copy-Paste

1. Go to your LinkedIn profile
2. Copy each section's text (Experience, Education, Skills, etc.)
3. Paste into `linkedin.txt` in this folder, using the following format:

```
=== HEADLINE ===
Your Professional Headline

=== SUMMARY ===
Your LinkedIn summary or about section text.

=== EXPERIENCE ===
Company Name | Job Title | Start Date – End Date | Location
- Key achievement or responsibility
- Another highlight

Company Name | Job Title | Start Date – End Date | Location
- Highlight

=== EDUCATION ===
University Name | Degree | Start – End
- Relevant coursework or honors

=== SKILLS ===
Group: Languages
TypeScript, JavaScript, Python

Group: Frontend
React, Next.js, Tailwind CSS

=== PROJECTS ===
Project Name | Description
Tech: TypeScript, React
- Key highlight
Link: https://github.com/you/project

=== AWARDS ===
Award Title | Issuer | Date
Description of the award
```

## Option 3: JSON Format

Create a `linkedin.json` file in this folder following the TypeScript interfaces
defined in `/src/content/types.ts`. This is the most precise option.

## After Providing Data

Edit the files in `/src/content/` directly:
- `profile.ts` — name, headline, summary, contact links
- `experience.ts` — work experience timeline
- `projects.ts` — project cards
- `education.ts` — education items
- `skills.ts` — skill groups
- `posts.ts` — articles or blog posts (optional)
- `awards.ts` — awards and leadership (optional)

Replace all `TODO:` placeholders with your actual data.
