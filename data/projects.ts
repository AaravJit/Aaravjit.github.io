import type { DatedRange } from '../lib/time/dates';

export type Domain = 'systems' | 'product' | 'ai' | 'security';
export type Stage = 'live' | 'development' | 'prototype' | 'complete';

export const domains: Record<Domain, { title: string; summary: string }> = {
  systems: {
    title: 'Systems and Linux',
    summary: 'Operating-system configuration, hardware detection, services, installers and the failure handling around them.',
  },
  product: {
    title: 'Software and product engineering',
    summary: 'Full applications: authentication, data models, payments, background work and deployment.',
  },
  ai: {
    title: 'AI integration and developer tools',
    summary: 'Model calls with validated, structured output, provider abstraction, and agent-driven development workflows.',
  },
  security: {
    title: 'Security and infrastructure',
    summary: 'Authorization in the database, privacy by design, signed webhooks, rate limits and tested security findings.',
  },
};

export const stageLabels: Record<Stage, string> = {
  live: 'Live',
  development: 'In development',
  prototype: 'Prototype',
  complete: 'Complete',
};

export interface Project {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  stage: Stage;
  domains: readonly Domain[];
  period: DatedRange;
  stack: readonly string[];
  /** What I personally did, in one line. */
  role: string;
  /** How the code was produced. Required so no project implies hand-written code it lacks. */
  authorship: string;
  /** Verifiable facts an interviewer can check. */
  evidence: readonly string[];
  /** The honest current gap. */
  limitation: string;
  repository?: string;
  repositoryVisibility: 'public' | 'private' | 'none';
  live?: string;
  caseStudy?: string;
  image?: { src: string; width: number; height: number; alt: string };
  featured: boolean;
}

export const projects: readonly Project[] = [
  {
    slug: 'pull-up',
    name: 'Pull Up',
    kicker: 'Native iOS app · Supabase backend',
    summary: 'A social map and garage for car and motorcycle enthusiasts: record drives, share builds, find meets. Rebuilt from an Expo prototype into a native Swift app whose privacy rules are enforced and tested in Postgres.',
    stage: 'development',
    domains: ['product', 'security'],
    period: { start: '2026-08', end: null },
    stack: ['Swift 6', 'SwiftUI', 'Supabase', 'PostgreSQL', 'pgTAP', 'Deno', 'GitHub Actions'],
    role: 'Product owner and engineering lead: defined each phase and its security requirements, reviewed and merged every pull request, and did the Apple and Supabase account and dashboard setup an agent can’t.',
    authorship: 'Most commits are by an AI coding agent (Claude Code) on reviewed branches. The original Expo prototype is also agent-built.',
    evidence: [
      '30 pgTAP test files cover row-level security, privacy, messaging, rate limits and moderation; 262 of 262 checks passed on the hosted staging project (2026-10-20).',
      'A written security assessment with 19 fixed findings (SEC-01 to SEC-07 and G1 to G13, G12 withdrawn); the Phase 3 fixes each have a test that fails without the fix.',
      'Signed build 0.1.0 (233) archived in CI and accepted by App Store Connect on 2026-10-24.',
    ],
    limitation: 'Nothing has run on a physical iPhone yet, no production Supabase project exists, and Pro subscriptions are not configured in App Store Connect.',
    repository: 'https://github.com/AaravJit/pull-up',
    repositoryVisibility: 'public',
    caseStudy: '/projects/pull-up/',
    featured: true,
  },
  {
    slug: 'aarav-hyprland',
    name: 'Aarav Hyprland',
    kicker: 'Linux desktop installer',
    summary: 'My Arch Linux and Hyprland desktop turned into an installer that detects the hardware, renders the right configuration, validates it in a dry run and rolls itself back if anything fails.',
    stage: 'complete',
    domains: ['systems'],
    period: { start: '2026-07', end: '2026-07' },
    stack: ['Bash', 'Python', 'Arch Linux', 'Hyprland', 'systemd', 'Lua'],
    role: 'Sole owner: designed the installer, the hardware detection and the rollback model, and installed and debugged it on an NVIDIA desktop and an HP OmniBook laptop.',
    authorship: 'AI coding assistants wrote parts of the implementation; later theme work landed through reviewed agent branches. All testing was on my own hardware.',
    evidence: [
      'install.sh runs under set -Eeuo pipefail with SHA-256 checksummed backups and an EXIT trap that restores them on any failure.',
      'GPU vendor detection keyed on PCI vendor IDs after a substring bug matched “ati” inside “Corporation”.',
      'Hardware fixtures let AMD and Intel laptop profiles render and validate without owning that hardware.',
    ],
    limitation: 'The AMD and generic GPU paths are validated from fixtures only, not installed on real AMD hardware. No tagged release yet.',
    repository: 'https://github.com/AaravJit/aarav-hyprland',
    repositoryVisibility: 'public',
    caseStudy: '/projects/aarav-hyprland/',
    image: { src: '/hyprlandproof.webp', width: 1920, height: 804, alt: 'Configured Hyprland desktop with an application launcher and system panels on Arch Linux' },
    featured: true,
  },
  {
    slug: 'pathway',
    name: 'Pathway',
    kicker: 'AI-assisted career app',
    summary: 'Upload a resume and paste a job post. Pathway scores the fit with evidence, tailors the resume without inventing anything, and renders a PDF.',
    stage: 'development',
    domains: ['product', 'ai', 'security'],
    period: { start: '2026-01', end: null },
    stack: ['Next.js', 'TypeScript', 'OpenAI', 'Supabase', 'Stripe', 'pdf-lib'],
    role: 'Planned the product as 18 pull requests, wrote the job-fit prompt and its server-side validation, designed the schema and row-level security, and fixed the Vercel deployment failures.',
    authorship: 'Built with AI coding agents from specs I wrote; I reviewed and merged every pull request.',
    evidence: [
      'Every model response passes a sanitizer that type-checks each field, clamps the score and caps list lengths.',
      'Row-level security on all four tables, each policy checking auth.uid() against the row owner.',
      'PDF rendering moved from headless Chromium to pdf-lib: two dependencies removed, 450 lines deleted for 275 added.',
    ],
    limitation: 'Free-tier usage is tracked in a cookie, so clearing cookies resets it. Stripe flows are not yet tested end to end. The repository is private.',
    repositoryVisibility: 'private',
    caseStudy: '/projects/pathway/',
    image: { src: '/pathway-landing.jpg', width: 2160, height: 1350, alt: 'Pathway landing page with a sample job-fit card' },
    featured: true,
  },
  {
    slug: 'roadping',
    name: 'RoadPing',
    kicker: 'Mobile app · live voice for drivers',
    summary: 'Hold a button to talk to drivers near you or to a private Drive Room, without anyone learning your exact position.',
    stage: 'development',
    domains: ['product', 'security'],
    period: { start: '2026-06', end: null },
    stack: ['Expo', 'React Native', 'Supabase', 'PostGIS', 'Agora', 'Deno'],
    role: 'Designed the privacy model (no client read access to coordinates, private zones, mutual blocking, expiring presence) and directed the implementation.',
    authorship: 'Recent hardening and redesign work was done by an AI coding agent on reviewed branches.',
    evidence: [
      'location_presence has no SELECT policy for any client role. Nearby drivers come back as one of four distance bands from grid-snapped positions, held for 30 seconds per viewer.',
      'A pgTAP test restarts an attacker’s session at 100 ranges against 23 target distances and checks nothing finer than the band leaks.',
      '15 Edge Functions and 13 SQL migrations, including server-minted, short-lived Agora tokens.',
    ],
    limitation: 'Not yet through TestFlight; production deployment and real-device testing are the next steps.',
    repository: 'https://github.com/AaravJit/RoadPing',
    repositoryVisibility: 'public',
    caseStudy: '/projects/roadping/',
    featured: true,
  },
  {
    slug: 'wrenchai',
    name: 'WrenchAI',
    kicker: 'Live study platform · built on Base44',
    summary: 'An aviation-maintenance study platform with verbal-exam practice, written-test prep, practical checklists and progress tracking across General, Airframe and Powerplant.',
    stage: 'live',
    domains: ['product', 'ai'],
    period: { start: '2025', end: null },
    stack: ['Base44', 'AI app builder', 'Product design'],
    role: 'Chose the problem, specified every study mode and how they share one dashboard, defined the account and progress data, and tested each flow on the live app.',
    authorship: 'Base44 generates and hosts the code and database from natural-language specs. My work is product specification and testing, not code.',
    evidence: [
      'Live with public sign-up at wrenchai.base44.app.',
      'Four study modes organized around the three A&P knowledge areas.',
    ],
    limitation: 'No source repository exists because the platform owns the code. There are no published usage numbers.',
    repositoryVisibility: 'none',
    live: 'https://wrenchai.base44.app/',
    caseStudy: '/projects/wrenchai/',
    image: { src: '/wrenchai-dashboard.webp', width: 1600, height: 1071, alt: 'WrenchAI dashboard with study navigation and General, Airframe and Powerplant sections' },
    featured: false,
  },
  {
    slug: 'hirestudio',
    name: 'HireStudio',
    kicker: 'SaaS prototype · tailored resumes',
    summary: 'One master profile, many tailored resumes: generation runs as queued jobs processed by a cron-triggered worker, with ATS checks and PDF, DOCX and ZIP export.',
    stage: 'prototype',
    domains: ['product', 'ai'],
    period: { start: '2025-12', end: '2026-01' },
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Auth.js', 'OpenAI', 'Stripe', 'Vitest'],
    role: 'Specified the job model and plan limits and reviewed the generated implementation.',
    authorship: 'Implemented through AI coding agent branches.',
    evidence: [
      'The AI provider sits behind a small interface in src/lib/ai so it can be swapped.',
      'Free and Pro limits are enforced on the server before generation and export.',
    ],
    limitation: 'The worker claims jobs with a read-then-update that two workers could race, and failed jobs are never retried. The Engineering Lab and decision record below explore the fix.',
    repository: 'https://github.com/AaravJit/HireStudio',
    repositoryVisibility: 'public',
    featured: false,
  },
  {
    slug: 'deal-ai',
    name: 'Deal AI',
    kicker: 'Web app · vehicle deal finder',
    summary: 'Version 1 scores a single vehicle-listing screenshot. Version 2 turns marketplace listings into a ranked feed with deal and risk scores.',
    stage: 'prototype',
    domains: ['product', 'ai', 'security'],
    period: { start: '2025-12', end: '2025-12' },
    stack: ['Next.js', 'Supabase', 'OpenAI', 'Stripe', 'Netlify'],
    role: 'Designed both versions and the v2 data model, including the race-safe unlock function.',
    authorship: 'Implemented through AI coding agent branches.',
    evidence: [
      'Every v2 source plugs into one adapter base class that upserts on (source, listing id), so re-imports never duplicate.',
      'Free-tier unlocks go through one Postgres function that locks the user’s row, so two clicks cannot spend the same unlock.',
    ],
    limitation: 'v2’s live marketplace adapters are stubs. v2 is in a private repository; v1 is public.',
    repository: 'https://github.com/AaravJit/dealai-web',
    repositoryVisibility: 'public',
    featured: false,
  },
  {
    slug: 'portfolio',
    name: 'This portfolio',
    kicker: 'Static site · Next.js',
    summary: 'A statically exported Next.js site with a tested date system, a deterministic queue simulator, generated résumés and CI checks for links, metadata and data integrity.',
    stage: 'live',
    domains: ['product', 'systems'],
    period: { start: '2025-12', end: null },
    stack: ['Next.js 16', 'TypeScript', 'Vitest', 'Playwright', 'GitHub Actions'],
    role: 'Owner. The November 2026 rebuild was implemented by an AI coding agent to my written brief and reviewed by me.',
    authorship: 'AI-agent implementation, reviewed and merged by me.',
    evidence: [
      'Unit tests for calendar arithmetic, time zones and the scheduler simulation run in CI on every pull request.',
      'A post-build check fails on broken internal links, missing metadata or images without alt text.',
    ],
    limitation: 'GitHub activity is fetched from the public API in the browser, so it is hidden when the API rate-limits the visitor.',
    repository: 'https://github.com/AaravJit/Aaravjit.github.io',
    repositoryVisibility: 'public',
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const projectBySlug = (slug: string) => {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Unknown project "${slug}"`);
  return project;
};
