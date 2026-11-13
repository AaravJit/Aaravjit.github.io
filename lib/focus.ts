import { resumeVariants, type FocusKey, type ResumeVariant } from '../data/resume';

export const FOCUS_PARAM = 'focus';
export const focusKeys: readonly FocusKey[] = resumeVariants.map((v) => v.focus);

/** The focus named by a query string, or null for the general view (missing or invalid). */
export function parseFocus(search: string): FocusKey | null {
  let value: string | null;
  try {
    value = new URLSearchParams(search).get(FOCUS_PARAM);
  } catch {
    return null;
  }
  return value !== null && (focusKeys as readonly string[]).includes(value) ? (value as FocusKey) : null;
}

export function variantForFocus(focus: FocusKey): ResumeVariant {
  return resumeVariants.find((v) => v.focus === focus)!;
}

/** The URL for a focus, keeping any other query parameters and the hash. */
export function focusHref(focus: FocusKey | null, current: { pathname: string; search: string; hash: string }): string {
  const params = new URLSearchParams(current.search);
  if (focus) params.set(FOCUS_PARAM, focus);
  else params.delete(FOCUS_PARAM);
  const query = params.toString();
  return `${current.pathname}${query ? `?${query}` : ''}${current.hash}`;
}

/** The PDF a visitor gets from the main download button. */
export function resumeFileFor(focus: FocusKey | null): string {
  return focus ? `/resume/${variantForFocus(focus).file}` : '/resume/aarav-jit-resume.pdf';
}

/**
 * Project order for a focus: the variant's résumé projects first, in résumé order, then the rest
 * of the general list. Nothing is added or removed, only reordered.
 */
export function orderProjects(general: readonly string[], focus: FocusKey | null, available: readonly string[]): string[] {
  if (!focus) return [...general];
  const first = variantForFocus(focus).projects.filter((slug) => available.includes(slug));
  return [...first, ...general.filter((slug) => !first.includes(slug))];
}

/**
 * Inline script for <head>: sets <html data-focus> before first paint so the server-rendered
 * focus blocks show without a flash. Mirrors parseFocus.
 */
export const focusScript = `try{var f=new URLSearchParams(location.search).get(${JSON.stringify(FOCUS_PARAM)});if(${JSON.stringify(focusKeys)}.indexOf(f)>-1)document.documentElement.dataset.focus=f}catch(e){}`;
