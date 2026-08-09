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
    tags: ['Web application', 'Account-based'],
    liveSite: 'https://wrenchai.app/',
    description:
      'An account-based study experience with practice questions, mock exams, flashcards, progress tracking, and structured aviation-maintenance learning workflows.',
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
