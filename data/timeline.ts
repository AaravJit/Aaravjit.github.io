import type { DatedRange } from '../lib/time/dates';

/**
 * Canonical dated records. Durations on the site are computed from these at view time
 * (lib/time/dates.ts); no page stores a hand-written "2 years" anywhere.
 *
 * `source` records where each date was verified, so it can be re-checked.
 */
export type RecordKind = 'work' | 'education' | 'project' | 'milestone';

export interface TimelineRecord extends DatedRange {
  id: string;
  kind: RecordKind;
  title: string;
  organization: string;
  location?: string;
  summary: string;
  highlights?: readonly string[];
  href?: string;
  source: string;
}

export const employment: readonly TimelineRecord[] = [
  {
    id: 'walmart',
    kind: 'work',
    title: 'Digital Personal Shopper (Online Grocery Pickup)',
    organization: 'Walmart',
    location: 'Citrus Heights, CA',
    start: '2024-06',
    end: null,
    summary: 'Order fulfillment and customer handoff in a high-volume store operation.',
    highlights: [
      'Work in Walmart’s inventory and order-management systems to pick, stage and hand off online orders accurately while priorities change through each shift.',
      'Resolve order issues and substitutions directly with customers, and escalate problems that need a manager.',
      'Follow documented procedures and coordinate across teams so handoffs stay on time.',
    ],
    source: 'Title confirmed by Aarav (2026-11-13). Start month June 2024 in every record found (Dec 2025 site, earlier résumé); exact day not recorded, so month precision.',
  },
  {
    id: 'target',
    kind: 'work',
    title: 'Seasonal Fulfillment Expert',
    organization: 'Target',
    location: 'Sacramento, CA',
    start: '2023-11',
    end: '2024-01',
    summary: 'Seasonal order fulfillment through the peak holiday period.',
    highlights: [
      'Used handheld fulfillment and inventory systems to locate, verify, stage and prepare orders under seasonal deadlines.',
      'Kept order accuracy up while supporting the team’s workflow during peak demand.',
    ],
    source: 'Résumé (public/resume.pdf, Nov 2026): "Nov 2023–Jan 2024".',
  },
];

export const education: readonly (TimelineRecord & { program: string; coursework?: readonly string[]; note?: string })[] = [
  {
    id: 'arc',
    kind: 'education',
    title: 'Cybersecurity and Information Assurance, Associate Degree Program',
    program: 'Cybersecurity and Information Assurance (A.S. program, in progress)',
    organization: 'American River College',
    location: 'Sacramento, CA',
    start: '2026',
    startLabel: 'Fall 2026',
    end: null,
    summary: 'Associate degree program in progress. No degree has been conferred.',
    coursework: ['Introduction to Networks', 'Switching, Routing, and Wireless Essentials', 'Network Systems Administration', 'Network Security Fundamentals'],
    source: 'Enrollment for Fall 2026 confirmed by Aarav (2026-11-13). Only the term is recorded, so no month is claimed.',
  },
  {
    id: 'csus',
    kind: 'education',
    title: 'Computer Science coursework',
    program: 'Computer Science coursework in programming fundamentals and data structures',
    organization: 'California State University, Sacramento',
    location: 'Sacramento, CA',
    start: null,
    startLabel: 'Prior coursework',
    endLabel: 'no degree',
    end: null,
    summary: 'Completed lower-division computer science coursework. No degree was completed or is claimed.',
    note: 'Attendance dates are not recorded in any source available to this site, so none are shown.',
    source: 'Résumé: "Prior coursework". Dates intentionally omitted.',
  },
];

/** Project and release milestones, each dated from repository history or project documentation. */
export const milestones: readonly TimelineRecord[] = [
  { id: 'dealai', kind: 'project', title: 'Deal AI v1', organization: 'Independent project', start: '2025-12', end: '2025-12', summary: 'Next.js and OpenAI app that scores a vehicle listing screenshot, with deal history and Stripe checkout.', href: '/work/#deal-ai', source: 'AaravJit/dealai-web commit history: Dec 15–20, 2025.' },
  { id: 'hirestudio', kind: 'project', title: 'HireStudio prototype', organization: 'Independent project', start: '2025-12', end: '2026-01', summary: 'Resume-tailoring SaaS prototype with queued generation jobs, Prisma, Auth.js and Stripe.', href: '/work/#hirestudio', source: 'AaravJit/HireStudio commit history: Dec 31, 2025 – Jan 2, 2026.' },
  { id: 'wrenchai', kind: 'project', title: 'WrenchAI launched', organization: 'Independent project', start: '2025', end: null, startLabel: '2025', summary: 'Aviation-maintenance study platform built and hosted on Base44, live with accounts.', href: '/projects/wrenchai/', source: 'Résumé: "2025–2026". Live at wrenchai.base44.app.' },
  { id: 'pathway', kind: 'project', title: 'Pathway', organization: 'Independent project', start: '2026-01', end: null, summary: 'AI-assisted job-fit and resume-tailoring app on Next.js, OpenAI, Supabase and Stripe. In development.', href: '/projects/pathway/', source: 'Private repository AaravJit/Pathway created Jan 12, 2026.' },
  { id: 'roadping', kind: 'project', title: 'RoadPing', organization: 'Independent project', start: '2026-06', end: null, summary: 'Push-to-talk app for nearby drivers with location privacy enforced in Postgres. In development.', href: '/projects/roadping/', source: 'AaravJit/RoadPing first commit Jun 3, 2026.' },
  { id: 'hyprland', kind: 'project', title: 'Aarav Hyprland published', organization: 'Independent project', start: '2026-07', end: '2026-07', summary: 'Portable Arch Linux desktop installer with hardware detection, dry runs and automatic rollback.', href: '/projects/aarav-hyprland/', source: 'AaravJit/aarav-hyprland commits Jul 29–31, 2026.' },
  { id: 'pull-up', kind: 'project', title: 'Pull Up', organization: 'Independent project', start: '2026-08', end: null, summary: 'Native iOS app on a Supabase backend with a tested privacy and security model. In development.', href: '/projects/pull-up/', source: 'AaravJit/pull-up first commit Aug 18, 2026.' },
  { id: 'pull-up-upload', kind: 'milestone', title: 'Pull Up 0.1.0 uploaded to App Store Connect', organization: 'Pull Up', start: '2026-10-24', end: '2026-10-24', summary: 'First signed build archived in CI and uploaded to App Store Connect. Not yet installed on a device through TestFlight.', href: '/projects/pull-up/', source: 'pull-up docs/PROGRESS.md, TestFlight table, 2026-10-24.' },
];
