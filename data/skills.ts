/**
 * Evidence-backed skills. No percentages. Each entry says how it is known:
 *
 * - built: used in a project I own, with the evidence linked. (AI agents may have typed
 *   some of the code; see the site-wide build disclosure.)
 * - directed: implemented in my project by an AI agent to my spec and reviewed by me. I can
 *   explain the design and tradeoffs; I would not claim fluency writing it unaided.
 * - foundational: coursework, daily use, or troubleshooting experience without a public artifact.
 */
export type Level = 'built' | 'directed' | 'foundational';

export const levelLabels: Record<Level, { label: string; description: string }> = {
  built: { label: 'Built', description: 'Used in a project I own; evidence linked.' },
  directed: { label: 'Directed', description: 'Agent-implemented to my spec and reviewed by me. I can explain the design; not claimed as unaided fluency.' },
  foundational: { label: 'Foundational', description: 'Coursework, daily use or hands-on troubleshooting, without a public artifact yet.' },
};

export interface Skill {
  name: string;
  level: Level;
  evidence?: { label: string; href: string };
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: readonly Skill[];
}

const hypr = (label: string, path = '') => ({ label, href: `https://github.com/AaravJit/aarav-hyprland${path}` });

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'software',
    title: 'Programming and software engineering',
    skills: [
      { name: 'TypeScript', level: 'built', evidence: { label: 'Pathway, HireStudio, this site', href: '/projects/pathway/' } },
      { name: 'React and Next.js', level: 'built', evidence: { label: 'Pathway and this site', href: '/projects/pathway/' } },
      { name: 'Bash', level: 'built', evidence: hypr('install.sh with rollback', '/blob/main/install.sh') },
      { name: 'Python', level: 'built', evidence: hypr('detect-hardware.py, render-profile.py', '/tree/main/tools') },
      { name: 'SQL and PostgreSQL', level: 'built', evidence: { label: 'RLS policies and functions', href: '/decisions/#location-bands' } },
      { name: 'Unit testing (Vitest)', level: 'built', evidence: { label: 'Date and scheduler tests', href: '/lab/scheduler/#tests' } },
      { name: 'Swift and SwiftUI', level: 'directed', evidence: { label: 'Pull Up native app', href: '/projects/pull-up/' } },
      { name: 'React Native and Expo', level: 'directed', evidence: { label: 'RoadPing', href: '/projects/roadping/' } },
    ],
  },
  {
    id: 'linux',
    title: 'Linux and operating systems',
    skills: [
      { name: 'Arch Linux', level: 'built', evidence: { label: 'Former daily driver on two machines', href: '/projects/aarav-hyprland/' } },
      { name: 'systemd user units and drop-ins', level: 'built', evidence: hypr('Session-scoped ExecCondition drop-ins', '/tree/main/systemd/user') },
      { name: 'journalctl and service debugging', level: 'built', evidence: { label: 'Hyprland case study', href: '/projects/aarav-hyprland/' } },
      { name: 'Package management (pacman)', level: 'built', evidence: hypr('Package manifests', '/tree/main/packages') },
      { name: 'Windows 10 and 11', level: 'foundational' },
      { name: 'PowerShell', level: 'foundational' },
    ],
  },
  {
    id: 'backend',
    title: 'Cloud and backend systems',
    skills: [
      { name: 'Supabase Auth, Postgres and Storage', level: 'built', evidence: { label: 'Pathway and RoadPing', href: '/projects/roadping/' } },
      { name: 'Edge Functions (Deno)', level: 'directed', evidence: { label: 'RoadPing: 15 functions', href: '/projects/roadping/' } },
      { name: 'PostGIS', level: 'directed', evidence: { label: 'RoadPing proximity', href: '/decisions/#location-bands' } },
      { name: 'Stripe Checkout and webhooks', level: 'built', evidence: { label: 'Pathway signature-verified webhook', href: '/projects/pathway/' } },
      { name: 'Prisma', level: 'directed', evidence: { label: 'HireStudio', href: '/work/#hirestudio' } },
      { name: 'Background jobs and cron workers', level: 'built', evidence: { label: 'HireStudio, Deal AI v2', href: '/decisions/#job-claims' } },
      { name: 'Vercel and Netlify deploys', level: 'built', evidence: { label: 'Pathway deployment fixes', href: '/projects/pathway/' } },
    ],
  },
  {
    id: 'networking',
    title: 'Networking',
    skills: [
      { name: 'TCP/IP and IPv4 addressing', level: 'foundational' },
      { name: 'DNS, DHCP and ICMP', level: 'foundational' },
      { name: 'Ethernet and Wi-Fi troubleshooting', level: 'foundational' },
      { name: 'Switching and routing', level: 'foundational' },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    skills: [
      { name: 'Row-level security design', level: 'built', evidence: { label: 'Pathway, RoadPing', href: '/decisions/#rls-in-database' } },
      { name: 'Location-privacy threat modeling', level: 'built', evidence: { label: 'RoadPing distance bands', href: '/notes/location-privacy-distance-bands/' } },
      { name: 'Webhook signature verification', level: 'built', evidence: { label: 'Pathway Stripe webhook', href: '/projects/pathway/' } },
      { name: 'Security review with regression tests (pgTAP)', level: 'directed', evidence: { label: 'Pull Up security report', href: '/projects/pull-up/' } },
      { name: 'Network security fundamentals', level: 'foundational' },
    ],
  },
  {
    id: 'ai',
    title: 'AI integration and automation',
    skills: [
      { name: 'OpenAI Responses API with structured output', level: 'built', evidence: { label: 'Pathway job fit', href: '/decisions/#untrusted-model-output' } },
      { name: 'Output validation and prompt constraints', level: 'built', evidence: { label: 'Model output note', href: '/notes/model-output-is-untrusted-input/' } },
      { name: 'Provider abstraction', level: 'directed', evidence: { label: 'HireStudio src/lib/ai', href: 'https://github.com/AaravJit/HireStudio/tree/main/src/lib/ai' } },
      { name: 'Agent-driven development (Claude Code, Codex)', level: 'built', evidence: { label: 'How I build', href: '/about/#how-i-build' } },
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware and troubleshooting',
    skills: [
      { name: 'PC building', level: 'foundational' },
      { name: 'GPU driver configuration (NVIDIA, AMD, Intel)', level: 'built', evidence: { label: 'Hyprland GPU paths', href: '/projects/aarav-hyprland/' } },
      { name: 'Laptop power and display configuration', level: 'built', evidence: { label: 'HP OmniBook profile', href: '/projects/aarav-hyprland/' } },
      { name: 'Storage and memory diagnostics', level: 'foundational' },
    ],
  },
  {
    id: 'workflow',
    title: 'Developer workflow and tooling',
    skills: [
      { name: 'Git and pull-request review', level: 'built', evidence: { label: 'GitHub profile', href: 'https://github.com/AaravJit' } },
      { name: 'GitHub Actions', level: 'built', evidence: { label: 'This site’s CI and deploy', href: 'https://github.com/AaravJit/Aaravjit.github.io/tree/main/.github/workflows' } },
      { name: 'iOS CI with signed archives', level: 'directed', evidence: { label: 'Pull Up TestFlight workflow', href: 'https://github.com/AaravJit/pull-up/tree/main/.github/workflows' } },
      { name: 'Technical writing', level: 'built', evidence: { label: 'Engineering notes', href: '/notes/' } },
    ],
  },
];

/** Things worth learning next. Deliberately kept out of the skills above. */
export const roadmap: readonly { name: string; why: string }[] = [
  { name: 'C and systems programming', why: 'Most systems and infrastructure roles expect C or C++ fundamentals; no project here shows them yet.' },
  { name: 'Linux internals and kernel interfaces', why: 'Processes, memory, file systems and networking from the kernel side, beyond configuration.' },
  { name: 'Containers and Kubernetes', why: 'Standard deployment substrate for infrastructure roles; not used in any project yet.' },
  { name: 'Windows hardening and PowerShell automation', why: 'A planned read-only audit script for Windows 11, mapped to CIS benchmark items.' },
  { name: 'Performance measurement', why: 'Profiling and benchmarking real code paths, not just simulations.' },
  { name: 'CompTIA Security+ or Network+', why: 'Common requirement for IT and security roles. Not started; not claimed.' },
];
