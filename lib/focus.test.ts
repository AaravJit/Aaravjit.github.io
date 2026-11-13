import { describe, expect, it } from 'vitest';
import { resumeProjects, resumeVariants } from '../data/resume';
import { focusHref, focusKeys, focusScript, orderProjects, parseFocus, resumeFileFor, variantForFocus } from './focus';

describe('parseFocus', () => {
  it('accepts the four role keys', () => {
    expect(parseFocus('?focus=it')).toBe('it');
    expect(parseFocus('?focus=systems')).toBe('systems');
    expect(parseFocus('?focus=software')).toBe('software');
    expect(parseFocus('?focus=security')).toBe('security');
  });
  it('falls back to the general view for missing or invalid values', () => {
    for (const search of ['', '?', '?focus=', '?focus=IT', '?focus=it-support', '?focus=%3Cscript%3E', '?focus=__proto__', '?focus=constructor', '?other=1']) {
      expect(parseFocus(search), search).toBeNull();
    }
  });
});

describe('role data', () => {
  it('maps every focus to its own résumé PDF, and no two roles share one', () => {
    expect(resumeFileFor('it')).toBe('/resume/aarav-jit-resume-it-support.pdf');
    expect(resumeFileFor('systems')).toBe('/resume/aarav-jit-resume-systems.pdf');
    expect(resumeFileFor('software')).toBe('/resume/aarav-jit-resume-software.pdf');
    expect(resumeFileFor('security')).toBe('/resume/aarav-jit-resume-security.pdf');
    expect(resumeFileFor(null)).toBe('/resume/aarav-jit-resume.pdf');
    expect(new Set(focusKeys.map(resumeFileFor)).size).toBe(4);
  });
  it('has one variant per focus, each naming projects that exist', () => {
    expect(new Set(resumeVariants.map((v) => v.focus)).size).toBe(resumeVariants.length);
    for (const v of resumeVariants) for (const slug of v.projects) expect(resumeProjects[slug], `${v.id}: ${slug}`).toBeDefined();
    expect(variantForFocus('software').id).toBe('software');
  });
});

describe('orderProjects', () => {
  const general = ['pull-up', 'aarav-hyprland', 'pathway', 'roadping'];
  const available = [...general, 'wrenchai'];
  it('keeps the general order without a focus', () => {
    expect(orderProjects(general, null, available)).toEqual(general);
  });
  it('puts the role’s projects first and keeps the rest', () => {
    expect(orderProjects(general, 'software', available)).toEqual(['pathway', 'pull-up', 'roadping', 'aarav-hyprland']);
    expect(orderProjects(general, 'it', available)).toEqual(['aarav-hyprland', 'wrenchai', 'pathway', 'pull-up', 'roadping']);
  });
  it('never drops a general project', () => {
    for (const f of focusKeys) for (const slug of general) expect(orderProjects(general, f, available)).toContain(slug);
  });
});

describe('focusHref', () => {
  const at = { pathname: '/', search: '?x=1', hash: '#work-title' };
  it('sets, replaces and clears the focus while keeping other state', () => {
    expect(focusHref('it', at)).toBe('/?x=1&focus=it#work-title');
    expect(focusHref('security', { ...at, search: '?focus=it' })).toBe('/?focus=security#work-title');
    expect(focusHref(null, { ...at, search: '?focus=it' })).toBe('/#work-title');
  });
});

describe('focusScript', () => {
  it('sets data-focus only for valid keys', () => {
    const run = (search: string) => {
      const doc = { documentElement: { dataset: {} as Record<string, string> } };
      new Function('location', 'document', focusScript)({ search }, doc);
      return doc.documentElement.dataset.focus;
    };
    expect(run('?focus=software')).toBe('software');
    expect(run('?focus=nope')).toBeUndefined();
    expect(run('?focus=indexOf')).toBeUndefined();
    expect(run('')).toBeUndefined();
  });
});
