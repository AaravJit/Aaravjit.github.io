/**
 * Engineering notes.
 * - `written` is when the note was drafted (month precision).
 * - `published` is the day the note first went live on aaravjit.github.io. It stays null until the
 *   deploy that publishes it has happened; then set it to that day. Never set it in advance.
 */
export interface Note {
  slug: string;
  title: string;
  summary: string;
  written: string;
  published: string | null;
  /** Evidence the note is built on. */
  sources: readonly { label: string; href?: string }[];
  topics: readonly string[];
}

export const notes: readonly Note[] = [
  {
    slug: 'location-privacy-distance-bands',
    title: 'Why RoadPing stopped returning distances',
    summary: 'A rounded distance looks harmless until someone polls it from three places. How a location feature moved from 50 m rounding to held, grid-snapped distance bands.',
    written: '2026-11',
    published: null,
    sources: [
      { label: 'RoadPing docs/PHASE2_PROXIMITY_PRIVACY.md', href: 'https://github.com/AaravJit/RoadPing/blob/main/docs/PHASE2_PROXIMITY_PRIVACY.md' },
      { label: 'Migration 20260930000012_privacy_safe_proximity.sql', href: 'https://github.com/AaravJit/RoadPing/blob/main/supabase/migrations/20260930000012_privacy_safe_proximity.sql' },
    ],
    topics: ['Security', 'PostgreSQL', 'Privacy'],
  },
  {
    slug: 'model-output-is-untrusted-input',
    title: 'Model output is untrusted input',
    summary: 'Asking a model for JSON is a request, not a contract. The validation layer that sits between Pathway’s job-fit prompt and its UI, and the prompt rules that back it up.',
    written: '2026-11',
    published: null,
    sources: [{ label: 'Pathway app/api/job-fit/route.ts (private repository)' }],
    topics: ['AI integration', 'TypeScript', 'Validation'],
  },
  {
    slug: 'match-the-identifier',
    title: 'Match the identifier, not the name',
    summary: 'A GPU detector that found AMD on every machine, because “Corporation” contains “ati”. A small bug with a general lesson about parsing tool output.',
    written: '2026-11',
    published: null,
    sources: [{ label: 'aarav-hyprland tools/detect-hardware.py', href: 'https://github.com/AaravJit/aarav-hyprland/blob/main/tools/detect-hardware.py' }],
    topics: ['Linux', 'Python', 'Debugging'],
  },
  {
    slug: 'retries-and-backoff-in-a-simulator',
    title: 'What a deterministic simulator shows about retries',
    summary: 'Building the Engineering Lab’s job-queue simulator: why it is deterministic, how failures are kept identical across strategies, and what shortest-job-first does to the tail.',
    written: '2026-11',
    published: null,
    sources: [
      { label: 'lib/scheduler/simulate.ts', href: 'https://github.com/AaravJit/Aaravjit.github.io/blob/main/lib/scheduler/simulate.ts' },
      { label: 'lib/scheduler/simulate.test.ts', href: 'https://github.com/AaravJit/Aaravjit.github.io/blob/main/lib/scheduler/simulate.test.ts' },
    ],
    topics: ['Distributed systems', 'Testing', 'Simulation'],
  },
];
