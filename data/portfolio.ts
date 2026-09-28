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
  {
    company: 'Walmart',
    location: 'Citrus Heights, CA',
    title: 'Online Grocery Pickup / Digital Fulfillment Associate',
    dates: 'June 2024–Present',
    summary:
      'Use inventory and order-management systems, communicate with customers, and coordinate accurate handoffs while priorities shift in a high-volume environment.',
  },
  {
    company: 'Target',
    location: 'Sacramento, CA',
    title: 'Seasonal Fulfillment Expert',
    dates: 'November 2023–January 2024',
    summary: 'Used handheld fulfillment systems to locate, verify, stage, and prepare accurate orders under peak seasonal deadlines.',
  },
] as const;

export const skills = [
  {
    symbol: '$_',
    title: 'Linux / administration',
    items: ['systemd', 'journalctl', 'NetworkManager', 'Package management', 'Processes', 'Services', 'Accounts and permissions'],
    usedIn: 'Set up services and traced setup problems through systemd and journalctl while building the Hyprland environment.',
    evidence: [
      { label: 'Hyprland case study', href: projects.hyprland.caseStudy },
      { label: 'Repository', href: projects.hyprland.repository },
    ],
  },
  {
    symbol: 'FIX',
    title: 'Troubleshooting',
    items: ['Software installation', 'PC hardware', 'Storage diagnostics', 'Memory diagnostics', 'Network connectivity', 'Windows/Linux troubleshooting'],
    usedIn: 'Wrote separate Intel, AMD, and NVIDIA configuration paths and got the same environment working on a desktop and an HP OmniBook laptop.',
    evidence: [{ label: 'Hyprland case study', href: projects.hyprland.caseStudy }],
  },
  {
    symbol: '</>',
    title: 'Development',
    items: ['Bash', 'Python', 'TypeScript', 'JavaScript', 'Next.js', 'Git', 'GitHub'],
    usedIn: 'Bash for the Hyprland installer; Next.js and TypeScript for Pathway and for this site, which deploys through GitHub Actions.',
    evidence: [
      { label: 'Pathway case study', href: projects.pathway.caseStudy },
      { label: 'This site’s source', href: 'https://github.com/AaravJit/Aaravjit.github.io' },
    ],
  },
  {
    symbol: 'OS',
    title: 'Operating systems / systems',
    items: ['Windows 10/11', 'Arch Linux', 'Linux command line', 'Desktop environments', 'PowerShell fundamentals'],
    usedIn: 'Installed and configured Arch Linux with a Hyprland desktop from the command line on two different machines.',
    evidence: [{ label: 'Hyprland case study', href: projects.hyprland.caseStudy }],
  },
  {
    symbol: 'NET',
    title: 'Networking',
    items: ['TCP/IP', 'IPv4', 'DNS', 'DHCP', 'ICMP', 'Ethernet', 'Wi-Fi', 'Common ports and protocols'],
    usedIn: 'Studying through American River College’s Cybersecurity program, starting with Introduction to Networks and Network Security Fundamentals.',
    evidence: [{ label: 'Education', href: '#education' }],
  },
] as const;
