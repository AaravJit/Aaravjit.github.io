/**
 * Résumé variants. These are different emphases of the same verified record, never different
 * histories: every variant draws employment and education from data/timeline.ts and project
 * facts from data/projects.ts. The generated PDFs (npm run resume:pdf) are printed from the
 * /resume/<id>/ pages built from this file.
 */
export type ResumeId = 'systems' | 'software' | 'it-support' | 'security';

export interface ResumeProject {
  slug: string;
  name: string;
  link: string;
  dates: string;
  bullets: readonly string[];
}

export interface ResumeVariant {
  id: ResumeId;
  label: string;
  headline: string;
  summary: string;
  skills: readonly { label: string; items: string }[];
  projects: readonly string[];
  file: string;
}

/** Project bullets, keyed by slug. Written so that no bullet implies hand-written code it lacks. */
export const resumeProjects: Record<string, ResumeProject> = {
  'aarav-hyprland': {
    slug: 'aarav-hyprland',
    name: 'Aarav Hyprland: portable Arch Linux desktop installer',
    link: 'github.com/AaravJit/aarav-hyprland',
    dates: '2026',
    bullets: [
      'Designed an installer that detects hardware (lspci, /sys), renders a per-machine configuration, validates every Lua, JSON and TOML file in a dry run, and only then installs.',
      'Made installs fail closed: set -Eeuo pipefail, SHA-256 checksummed backups, and an EXIT trap that restores the prior state of files and systemd units on any failure.',
      'Fixed a GPU detection bug (substring “ati” matched “Corporation”) by keying on PCI vendor IDs; scoped systemd user services to Hyprland sessions with ExecCondition drop-ins.',
    ],
  },
  'pull-up': {
    slug: 'pull-up',
    name: 'Pull Up: native iOS app on Supabase',
    link: 'github.com/AaravJit/pull-up',
    dates: '2026–present',
    bullets: [
      'Led a native Swift rebuild with privacy rules enforced in Postgres row-level security; 30 pgTAP test files, 262 of 262 checks passing on the hosted staging project.',
      'Drove a written security assessment with 19 fixed findings (route leakage, location metadata in uploads, keychain backup class), each Phase 3 fix covered by a regression test.',
      'Uploaded a CI-signed build to App Store Connect (Oct 2026); device testing has not started yet.',
    ],
  },
  roadping: {
    slug: 'roadping',
    name: 'RoadPing: push-to-talk app for nearby drivers',
    link: 'github.com/AaravJit/RoadPing',
    dates: '2026–present',
    bullets: [
      'Designed a location-privacy model where no client can read coordinates: nearby drivers return as one of four distance bands from grid-snapped positions, held 30 s per viewer.',
      'Specified a pgTAP test that replays 2,300 session restarts to prove range changes reveal nothing finer than a band; 15 Edge Functions and 13 SQL migrations.',
    ],
  },
  pathway: {
    slug: 'pathway',
    name: 'Pathway: AI-assisted resume tailoring app',
    link: 'aaravjit.github.io/projects/pathway',
    dates: '2026–present',
    bullets: [
      'Planned and shipped the product across 18 pull requests on Next.js, OpenAI, Supabase and Stripe; resume upload to PDF download works end to end.',
      'Validated every model response on the server (type checks, clamped score, allow-listed verdict) and enforced per-user access with Postgres row-level security on all tables.',
      'Replaced headless Chromium PDF rendering with pdf-lib, removing two dependencies and 175 net lines of code.',
    ],
  },
  wrenchai: {
    slug: 'wrenchai',
    name: 'WrenchAI: aviation-maintenance study platform',
    link: 'wrenchai.base44.app',
    dates: '2025–present',
    bullets: [
      'Specified and tested a live, account-based study platform on Base44 (no-code) with verbal-exam practice, written-test prep, practical checklists and progress tracking.',
    ],
  },
  portfolio: {
    slug: 'portfolio',
    name: 'Portfolio and Engineering Lab',
    link: 'aaravjit.github.io',
    dates: '2025–present',
    bullets: [
      'Static Next.js site on GitHub Pages with CI for types, lint, unit tests, links and metadata; includes a deterministic job-queue simulator with retries, backoff and dead-lettering.',
    ],
  },
};

export const resumeVariants: readonly ResumeVariant[] = [
  {
    id: 'systems',
    label: 'Systems and infrastructure',
    headline: 'Linux, Systems and Infrastructure · Cybersecurity Student',
    summary: 'Cybersecurity and Information Assurance student who builds the systems side of software: a Linux installer with hardware detection and automatic rollback, and cloud backends whose access rules are enforced and tested in Postgres. Two-plus years in high-volume retail fulfillment.',
    skills: [
      { label: 'Linux and OS', items: 'Arch Linux, systemd, journalctl, pacman, Bash; Windows 10/11, PowerShell (basic)' },
      { label: 'Backend and data', items: 'PostgreSQL, row-level security, Supabase (Auth, Edge Functions, Storage), PostGIS, Stripe webhooks' },
      { label: 'Languages', items: 'Bash, Python, TypeScript, SQL' },
      { label: 'Tooling', items: 'Git, GitHub Actions, Vitest, pgTAP, Vercel, AI coding agents (Claude Code, Codex)' },
      { label: 'Networking', items: 'TCP/IP, IPv4 addressing, DNS, DHCP, ICMP, switching and routing (coursework)' },
    ],
    projects: ['aarav-hyprland', 'pull-up', 'roadping'],
    file: 'aarav-jit-resume-systems.pdf',
  },
  {
    id: 'software',
    label: 'Software and product engineering',
    headline: 'Software and Product Engineering · Cybersecurity Student',
    summary: 'Builder of full applications from spec to deployment: authentication, data models with database-enforced access control, payments, background jobs and validated AI features. I work with AI coding agents and own the architecture, review and testing. Cybersecurity and Information Assurance student.',
    skills: [
      { label: 'Languages', items: 'TypeScript, SQL, Python, Bash; Swift (agent-implemented, reviewed)' },
      { label: 'Web and backend', items: 'React, Next.js, Supabase, PostgreSQL, Prisma, Stripe, OpenAI Responses API' },
      { label: 'Practices', items: 'Row-level security, server-side validation of model output, queued jobs, unit testing (Vitest), pgTAP' },
      { label: 'Tooling', items: 'Git, GitHub Actions, Vercel, Netlify, AI coding agents (Claude Code, Codex)' },
    ],
    projects: ['pathway', 'pull-up', 'roadping'],
    file: 'aarav-jit-resume-software.pdf',
  },
  {
    id: 'it-support',
    label: 'IT and technical support',
    headline: 'IT Support · Cybersecurity and Networking Student',
    summary: 'Cybersecurity and Information Assurance student with hands-on Windows and Linux troubleshooting, PC building and hardware configuration, and a Linux installer I built with backups and automatic rollback. Two-plus years of customer-facing, high-volume operations work with clear communication and disciplined escalation.',
    skills: [
      { label: 'Operating systems', items: 'Windows 10/11, Arch Linux, Linux command line, PowerShell (foundational)' },
      { label: 'Troubleshooting', items: 'Software installation, PC hardware, GPU drivers, storage and memory diagnostics, accounts and permissions, services and logs (systemd, journalctl, Event Viewer)' },
      { label: 'Networking', items: 'TCP/IP, IPv4 addressing, DNS, DHCP, ICMP, Ethernet, Wi-Fi (coursework)' },
      { label: 'Tools', items: 'Bash, Python, Git, GitHub, Device Manager, Task Manager' },
    ],
    projects: ['aarav-hyprland', 'wrenchai', 'pathway'],
    file: 'aarav-jit-resume-it-support.pdf',
  },
  {
    id: 'security',
    label: 'Cybersecurity',
    headline: 'Cybersecurity · Application and Data Security',
    summary: 'Cybersecurity and Information Assurance student whose projects center on access control and privacy: Postgres row-level security, location-privacy threat modeling, signed webhooks, and security findings fixed with regression tests. Early in formal security training; no certifications yet.',
    skills: [
      { label: 'Security', items: 'Row-level security, SECURITY DEFINER function hardening, threat modeling, webhook signature verification, rate limiting, secrets handling' },
      { label: 'Data and backend', items: 'PostgreSQL, Supabase, PostGIS, pgTAP' },
      { label: 'Systems', items: 'Linux (Arch, systemd, journalctl), Windows 10/11, Bash, Python' },
      { label: 'Networking', items: 'TCP/IP, DNS, DHCP, ICMP, network security fundamentals (coursework)' },
    ],
    projects: ['roadping', 'pull-up', 'pathway'],
    file: 'aarav-jit-resume-security.pdf',
  },
];

/** Order the recruiter page lists the roles in, each with its own anchor (#role-<id>). */
export const recruiterRoleOrder: readonly ResumeId[] = ['it-support', 'systems', 'software', 'security'];

/** The variant served at /resume/aarav-jit-resume.pdf and /resume.pdf. */
export const defaultResume: ResumeId = 'systems';
export const projectsNote = 'Built with AI coding agents under my direction: I wrote the specs, set the architecture and security requirements, reviewed every change and tested it. Case studies at aaravjit.github.io.';
