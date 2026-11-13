/**
 * Canonical identity and contact facts. Every page and the generated résumés read from here.
 * Email and phone are deliberately absent: the public site uses LinkedIn for contact
 * (commit f13c5c2, "Use LinkedIn for public portfolio contact").
 */
export const profile = {
  name: 'Aarav Jit',
  shortName: 'AJ',
  tagline: 'Software. Systems. Infrastructure.',
  location: 'Sacramento, California',
  locationShort: 'Sacramento, CA',
  url: 'https://aaravjit.github.io',
  github: 'https://github.com/AaravJit',
  githubUser: 'AaravJit',
  linkedin: 'https://www.linkedin.com/in/aarav-jit-499a93293/',
  /** Professional email. Shown on the résumés only (Aarav's decision, 2026-11-13); the phone number stays private. */
  resumeEmail: 'aaravjit16@gmail.com',
  portfolioRepo: 'https://github.com/AaravJit/Aaravjit.github.io',
  intro:
    'I build practical software and the systems underneath it: Linux environments that install and roll back safely, cloud-backed apps whose security lives in the database, and automation that makes the work repeatable.',
  why:
    'I like knowing what happens below the interface. When something breaks I follow it down through the logs, the services, the permissions, the network and the hardware until the cause is plain, and then I write it down so it stays fixed.',
  seeking: [
    'Software engineering',
    'Systems and Linux administration',
    'Infrastructure and DevOps',
    'IT and technical support',
    'Security operations and engineering',
    'Developer tooling and AI-enabled products',
  ],
  availability: 'Open to early-career roles and internships in the Sacramento area, hybrid, or remote.',
} as const;

/**
 * How code on this site's projects was produced. Shown on the home page, the recruiter
 * page and every case study, so no project implies hand-written code it does not have.
 */
export const buildDisclosure = {
  short: 'I build with AI coding agents. I own the problem, the spec, the architecture, the review and the testing; each case study says what was generated.',
  long: [
    'Most of the code in my recent repositories was written by AI coding agents (Claude Code and OpenAI Codex) working on branches that I reviewed and merged. Commit authorship in each repository shows this.',
    'My part is the engineering around the code: choosing the problem, writing the specification for each change, deciding the architecture and security boundaries, reviewing every pull request, running it on real hardware and real services, and debugging what breaks.',
    'Where a project was built on a no-code platform (WrenchAI on Base44), the case study says so and describes my work at the product level.',
  ],
} as const;
