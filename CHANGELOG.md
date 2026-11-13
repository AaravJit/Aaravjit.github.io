# Changelog

Notable changes to the portfolio. Dates are in America/Los_Angeles.

## Unreleased: portfolio rebuild (November 2026)

Prepared on branch `claude/project-thread-phnjy9`; not yet deployed.

### Platform and security
- Upgraded Next.js 14.2 → 16.4 and React 18 → 19 to clear a critical Next.js advisory. Production dependencies report 0 known vulnerabilities (`npm audit --omit=dev`).
- Moved linting to ESLint 9 flat config; added Vitest; Node 20.9+ required.
- `sitemap.xml` and `robots.txt` are now generated from the route list instead of hand-edited.
- New CI workflow runs type check, lint, unit tests, build, post-build site checks and the résumé freshness check on every pull request. The deploy workflow runs the same checks before publishing and rebuilds monthly.

### Design
- New dark-first design system with a light theme, theme toggle without a flash on load, and print styles.
- Command palette (Ctrl/Cmd + K or `/`) for jumping to any page, project, decision or note.

### Content
- Home page rebuilt around evidence: what each area of work is, which project backs it, and each project's biggest limitation.
- New pages: Work, About (including how I build with AI coding agents), Timeline, Skills (with evidence levels and a learning roadmap), Decisions (10 architecture decision records), Notes (4 engineering write-ups), Recruiters (one-page summary with role-specific résumés).
- New case study: Pull Up. Existing case studies (Aarav Hyprland, Pathway, RoadPing, WrenchAI) restructured as problem, role, architecture, decision, validation, limits and next steps.
- Interactive architecture diagrams on case studies.
- GitHub activity feed fetched live from the public API.

### Engineering Lab
- Job-queue scheduler simulator: deterministic, seeded discrete-event simulation with FIFO / shortest-first / priority scheduling, retries with capped exponential backoff and jitter, and dead-lettering. Shareable URLs. Labelled as a simulation. 20 unit tests.

### Dates
- Every date is computed from canonical records with explicit precision, in Pacific time, and updates in the browser without a hydration mismatch. See [docs/date-system.md](docs/date-system.md). 24 unit tests.

### Résumé
- Four résumé versions (systems, software, IT support, security) generated from the same data as the site and printed to one-page, tagged PDFs. A check fails the build if the PDFs are older than their data.

### Corrections
- RoadPing: nearby drivers are returned as distance bands, not coordinates rounded to 50 m; migration count updated to 13.
- Pull Up: described as the native Swift app it now is, with its security assessment, test counts and App Store Connect upload, and its limits (no device testing yet, no production backend).
- Education dates and wording aligned with the timeline data; removed a structured-data claim of alumni status.
- Claims that couldn't be verified from a repository were removed or softened.
