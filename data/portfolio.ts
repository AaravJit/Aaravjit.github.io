export const site = {
  name: 'Aarav Jit',
  headline: 'Cybersecurity Student · Software, Linux & Systems Builder',
  location: 'Sacramento, California',
  email: 'aaravjit16@gmail.com',
  github: 'https://github.com/AaravJit',
  linkedin: 'https://www.linkedin.com/in/aarav-jit-499a93293/',
  url: 'https://aaravjit.github.io',
} as const;

export const projects = {
  hyprland: {
    name: 'Aarav Hyprland',
    category: 'Featured Linux project',
    subtitle: 'Portable Arch Linux & Hyprland Environment',
    status: undefined,
    tags: ['Arch Linux', 'Hyprland', 'Bash', 'Git', 'systemd'],
    caseStudy: '/projects/aarav-hyprland/',
    repository: 'https://github.com/AaravJit/aarav-hyprland',
  },
  pathway: {
    name: 'Pathway',
    category: 'AI-assisted career platform',
    status: 'development' as const,
    tags: ['Next.js', 'TypeScript', 'OpenAI', 'Supabase', 'Stripe'],
    caseStudy: '/projects/pathway/',
    description:
      'A guided application workflow that moves from an existing resume and job posting to fit analysis, targeted tailoring, preview, and downloadable material. The core workflow exists while production-readiness work continues.',
  },
  wrenchAI: {
    name: 'WrenchAI',
    category: 'Aviation maintenance study platform',
    status: 'live' as const,
    tags: ['Base44', 'AI-assisted', 'Study platform', 'Account-based'],
    caseStudy: '/projects/wrenchai/',
    liveSite: 'https://wrenchai.base44.app/',
    description:
      'A live aviation-maintenance study platform with account-based learning, verbal-exam practice, written test preparation, practical prep, progress tracking, and structured study workflows.',
  },
} as const;

export const education = [
  {
    school: 'American River College',
    location: 'Sacramento, CA',
    dates: 'Beginning Fall 2026',
    program: 'Cybersecurity and Information Assurance — Associate Degree Program',
  },
  {
    school: 'California State University, Sacramento',
    dates: 'Prior coursework',
    program: 'Computer Science coursework in programming fundamentals and data structures; no degree claimed.',
  },
] as const;

export const experience = [
  { company: 'Walmart', location: 'Citrus Heights, CA', title: 'Online Grocery Pickup / Digital Fulfillment Associate', dates: 'June 2024–Present' },
  { company: 'Target', location: 'Sacramento, CA', title: 'Seasonal Fulfillment Expert', dates: 'November 2023–January 2024' },
] as const;

export type ProjectStage = 'live' | 'development' | 'prototype';

export const moreProjects: readonly {
  name: string;
  category: string;
  status: ProjectStage;
  problem: string;
  decisions: readonly string[];
  outcome: string;
  tags: readonly string[];
  repository: string;
  caseStudy?: string;
}[] = [
  {
    name: 'RoadPing',
    category: 'iOS app · live voice for drivers',
    status: 'development',
    problem: 'Drivers near each other have no quick, hands-light way to talk. RoadPing puts live drivers on a map and lets them hold a button to talk to nearby drivers or a private Drive Room.',
    decisions: [
      'Location lives in a table no client can read; a SECURITY DEFINER query returns only distance rounded to 50 m.',
      'Private zones (home, work, custom) are checked with PostGIS on start and on every location update, and blocking is mutual.',
      'Agora only carries audio; a Supabase Edge Function mints short-lived tokens after checking membership.',
    ],
    outcome: '15 Edge Functions, 9 SQL migrations with row-level security, and App Store review and privacy docs. Preparing for TestFlight.',
    tags: ['Expo', 'React Native', 'Supabase', 'PostGIS', 'Agora'],
    repository: 'https://github.com/AaravJit/RoadPing',
    caseStudy: '/projects/roadping/',
  },
  {
    name: 'HireStudio',
    category: 'SaaS · tailored resumes',
    status: 'prototype',
    problem: 'Tailoring a resume for each job is slow. HireStudio keeps one Master Profile and generates a tailored, ATS-checked resume per job description, in batches.',
    decisions: [
      'Generation runs as queued jobs processed by a worker (Vercel Cron in production), so batches never block a request.',
      'The AI provider sits behind a small interface in src/lib/ai so it can be swapped.',
      'Free and Pro limits are enforced on the server before generation and export.',
    ],
    outcome: 'Full app: Auth.js, Prisma/Postgres schema, PDF/DOCX/ZIP export, Stripe Checkout and webhooks, and Vitest tests for the ATS scoring.',
    tags: ['Next.js', 'Prisma', 'Postgres', 'OpenAI', 'Stripe'],
    repository: 'https://github.com/AaravJit/HireStudio',
  },
  {
    name: 'Deal AI',
    category: 'Web app · marketplace assistant',
    status: 'prototype',
    problem: 'Buyers on Facebook Marketplace or Craigslist guess at fair prices. Deal AI takes a listing screenshot and returns a deal score, scam flags, and a counter-offer to send.',
    decisions: [
      'A server route sends the screenshot to an OpenAI vision model so the API key never reaches the browser.',
      'Daily upload quotas are enforced in a Firestore transaction so parallel requests cannot overspend.',
    ],
    outcome: 'Working upload, analysis, deal history, and Stripe checkout. A second version is in progress.',
    tags: ['Next.js', 'OpenAI', 'Firebase', 'Stripe'],
    repository: 'https://github.com/AaravJit/dealai-web',
  },
  {
    name: 'pull-up',
    category: 'Mobile app · car community',
    status: 'prototype',
    problem: 'Car and motorcycle meets are organized across group chats. pull-up is a social map and garage for seeing who is out driving, sharing builds, and finding meets.',
    decisions: [
      'Map markers stay on fixed design-canvas coordinates and are scaled to the device, to match the design exactly.',
      'App state is one small Zustand store instead of a larger state library.',
    ],
    outcome: 'Five tab screens (Map, Garage, Meets, Activity, You) with custom tab bar, bottom sheets and blurred chrome, running on mock data.',
    tags: ['Expo', 'React Native', 'TypeScript', 'Zustand'],
    repository: 'https://github.com/AaravJit/pull-up',
  },
  {
    name: 'solo-app',
    category: 'Web app · freelancer CRM',
    status: 'prototype',
    problem: 'Solo freelancers track clients and invoices in spreadsheets. solo-app is a small dashboard for clients, invoices, and payment status.',
    decisions: [
      'Supabase handles auth and data, with routes guarded by a ProtectedRoute wrapper.',
      'Typed client and invoice models keep status values (paid, pending, overdue) consistent across pages.',
    ],
    outcome: 'Landing page, sign-up and login, and dashboard pages for overview, clients, invoices, and settings.',
    tags: ['React', 'Vite', 'TypeScript', 'Supabase', 'Tailwind'],
    repository: 'https://github.com/AaravJit/solo-app',
  },
];
