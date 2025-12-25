/**
 * Site Configuration
 *
 * Toggle MAINTENANCE_MODE to show/hide the maintenance page.
 * When true: visitors see a professional "updating" page with contact links.
 * When false: normal portfolio is displayed.
 */

export const MAINTENANCE_MODE = true;

// Contact & Social Links (used on maintenance page)
export const LINKS = {
  resume: '/resume.pdf',
  github: 'https://github.com/aaravjit',
  linkedin: 'https://www.linkedin.com/in/aarav-jit-499a93293/',
  email: 'aaravjit16@gmail.com',
} as const;
