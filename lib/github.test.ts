import { describe, expect, it } from 'vitest';
import { describeFailure, selectRepos } from './github';

const repo = (over: Record<string, unknown> = {}) => ({ name: 'pull-up', html_url: 'https://github.com/AaravJit/pull-up', description: 'A map', pushed_at: '2026-10-28T18:20:31Z', fork: false, archived: false, private: false, ...over });

describe('selectRepos', () => {
  it('keeps public, non-fork repositories, newest first, up to the limit', () => {
    const data = [repo({ name: 'old', pushed_at: '2025-01-01T00:00:00Z' }), repo(), repo({ name: 'forked', fork: true }), repo({ name: 'hidden', private: true }), repo({ name: 'gone', archived: true })];
    expect(selectRepos(data, 'AaravJit', [], 5).map((r) => r.name)).toEqual(['pull-up', 'old']);
    expect(selectRepos(data, 'AaravJit', ['pull-up'], 5).map((r) => r.name)).toEqual(['old']);
    expect(selectRepos(data, 'AaravJit', [], 1)).toHaveLength(1);
  });
  it('never trusts html_url', () => {
    const [entry] = selectRepos([repo({ html_url: 'javascript:alert(1)' })], 'AaravJit', [], 5);
    expect(entry.href).toBe('https://github.com/AaravJit/pull-up');
  });
  it('drops entries with unsafe names or bad dates', () => {
    expect(selectRepos([repo({ name: '../x' }), repo({ name: '<img>' }), repo({ pushed_at: 'soon' }), repo({ name: 42 })], 'AaravJit', [], 5)).toEqual([]);
  });
  it('returns nothing for non-array or error payloads', () => {
    expect(selectRepos({ message: 'API rate limit exceeded' }, 'AaravJit', [], 5)).toEqual([]);
    expect(selectRepos(null, 'AaravJit', [], 5)).toEqual([]);
    expect(selectRepos([null, 1, 'x'], 'AaravJit', [], 5)).toEqual([]);
  });
  it('caps description length', () => {
    expect(selectRepos([repo({ description: 'x'.repeat(500) })], 'AaravJit', [], 5)[0].description).toHaveLength(200);
  });
});

describe('describeFailure', () => {
  it('explains rate limits, HTTP errors, timeouts and network failures without echoing bodies', () => {
    expect(describeFailure(null, 403)).toMatch(/rate limit/);
    expect(describeFailure(null, 429)).toMatch(/rate limit/);
    expect(describeFailure(null, 500)).toBe('GitHub returned 500.');
    expect(describeFailure(Object.assign(new Error('x'), { name: 'AbortError' }))).toMatch(/in time/);
    expect(describeFailure(new TypeError('Failed to fetch <secret>'))).toBe('GitHub could not be reached.');
  });
});
