import { decisions } from './decisions';
import { notes } from './notes';
import { profile } from './profile';
import { projects } from './projects';

/** Primary navigation. */
export const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/lab/', label: 'Lab' },
  { href: '/decisions/', label: 'Decisions' },
  { href: '/notes/', label: 'Notes' },
  { href: '/timeline/', label: 'Timeline' },
  { href: '/about/', label: 'About' },
] as const;

/** Every static page, used by the sitemap and the command palette. */
export const pages: readonly { href: string; title: string; group: string }[] = [
  { href: '/', title: 'Home', group: 'Pages' },
  { href: '/work/', title: 'Work: all projects by domain', group: 'Pages' },
  { href: '/lab/', title: 'Engineering Lab', group: 'Pages' },
  { href: '/lab/scheduler/', title: 'Job queue scheduler simulator', group: 'Lab' },
  { href: '/decisions/', title: 'Architecture decisions', group: 'Pages' },
  { href: '/skills/', title: 'Skills with evidence', group: 'Pages' },
  { href: '/notes/', title: 'Engineering notes', group: 'Pages' },
  { href: '/timeline/', title: 'Experience timeline', group: 'Pages' },
  { href: '/about/', title: 'About and how I build', group: 'Pages' },
  { href: '/recruiters/', title: 'Recruiter summary and résumés', group: 'Pages' },
  ...projects.filter((p) => p.caseStudy).map((p) => ({ href: p.caseStudy!, title: `${p.name} case study`, group: 'Case studies' })),
  ...notes.map((n) => ({ href: `/notes/${n.slug}/`, title: n.title, group: 'Notes' })),
];

export const paletteExtras: readonly { href: string; title: string; group: string; external?: boolean }[] = [
  ...decisions.map((d) => ({ href: `/decisions/#${d.id}`, title: `Decision: ${d.title}`, group: 'Decisions' })),
  { href: '/resume/aarav-jit-resume.pdf', title: 'Download résumé (PDF)', group: 'Résumé', external: true },
  { href: '/recruiters/#resumes', title: 'Résumé versions by role', group: 'Résumé' },
  { href: '/timeline/#work', title: 'Work experience', group: 'Résumé' },
  { href: '/timeline/#education', title: 'Education', group: 'Résumé' },
  { href: profile.github, title: 'GitHub profile', group: 'Contact', external: true },
  { href: profile.linkedin, title: 'LinkedIn (contact me)', group: 'Contact', external: true },
];
