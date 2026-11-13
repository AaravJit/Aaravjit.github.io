# Aarav Jit: engineering portfolio

Source for [aaravjit.github.io](https://aaravjit.github.io/): projects, case studies, architecture decision records, engineering notes, an interactive Engineering Lab and role-specific résumés, all generated from one set of typed data files.

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · CSS · Vitest · Playwright (résumé PDFs) · GitHub Actions · GitHub Pages

## Layout

```text
app/            Pages (one folder per route), global styles, sitemap and robots
components/     UI pieces: header, command palette, case-study layout, diagrams, lab
data/           The single source of truth: profile, timeline, projects, decisions,
                skills, notes, routes and résumé variants
lib/time/       Calendar-aware date system (+ tests)
lib/scheduler/  Job-queue simulator used by the Lab (+ tests)
scripts/        Post-build site checks, résumé PDF generation and freshness check
docs/           How the date system works
public/resume/  Generated résumé PDFs and their manifest
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (dates, scheduler, syntax highlighter: 50 tests) |
| `npm run build` | Static export to `out/` |
| `npm run check:site` | After a build: internal links, fragments, metadata, alt text, one h1 per page, secret and personal-data patterns |
| `npm run resume:pdf` | After a build: prints the four résumé PDFs into `public/resume/` (needs Playwright's Chromium; set `PW_CHROMIUM` to use a specific binary) |
| `npm run resume:check` | Fails if the PDFs are older than `data/` |
| `npm run verify` | Everything above except PDF generation, in order |

## Updating content

- **A date** (job, school, milestone): edit `data/timeline.ts`. Durations and "Present" are computed; never write them into copy. See [docs/date-system.md](docs/date-system.md).
- **A project**: edit `data/projects.ts`; the case study lives in `app/projects/<slug>/page.tsx`.
- **The résumé**: edit `data/resume.ts` (bullets and variants) or `data/timeline.ts`, then `npm run build && npm run resume:pdf` and commit the regenerated PDFs. CI fails until you do.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which runs `npm run verify` and publishes `out/` to GitHub Pages. Pull requests run the same checks in `.github/workflows/ci.yml`.

## Integrity rules

Every claim on the site must be backed by a repository, a live product or a record. AI-assisted work is labelled as such, simulations are labelled as simulations, and no metric is published that hasn't been measured.
