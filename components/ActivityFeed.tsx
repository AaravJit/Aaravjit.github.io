'use client';

import { useEffect, useState } from 'react';
import { RelativeTime } from './time/Live';
import { external } from './ui';

interface Repo {
  name: string;
  html_url: string;
  description: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
}

type State = { kind: 'loading' } | { kind: 'ready'; repos: Repo[]; fetchedAt: string } | { kind: 'unavailable'; reason: string };

const CACHE_KEY = 'gh-activity-v1';
const CACHE_MS = 15 * 60 * 1000;

/** Keeps only public, non-fork repositories with a valid push timestamp, newest first. */
export function selectRepos(data: unknown, exclude: readonly string[], limit: number): Repo[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((r): r is Repo => !!r && typeof r === 'object' && typeof (r as Repo).name === 'string' && typeof (r as Repo).pushed_at === 'string' && !Number.isNaN(Date.parse((r as Repo).pushed_at)))
    .filter((r) => !r.fork && !r.private && !r.archived && !exclude.includes(r.name))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, limit);
}

/**
 * Recent public repository activity from the GitHub REST API, fetched in the browser without a
 * token (60 requests an hour per visitor IP). Timestamps are GitHub's own `pushed_at` values;
 * the current date is never substituted. On any error or rate limit the feed says so and shows nothing.
 */
export default function ActivityFeed({ user, exclude = [], limit = 5 }: { user: string; exclude?: readonly string[]; limit?: number }) {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const finish = (next: State) => { if (!cancelled) setState(next); };
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');
      if (cached && Date.now() - cached.at < CACHE_MS) {
        finish({ kind: 'ready', repos: selectRepos(cached.data, exclude, limit), fetchedAt: new Date(cached.at).toISOString() });
        return () => { cancelled = true; };
      }
    } catch {
      // Ignore unreadable cache.
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?type=owner&sort=pushed&per_page=30`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 403 || response.status === 429) throw new Error('GitHub’s rate limit for this network was reached.');
        if (!response.ok) throw new Error(`GitHub returned ${response.status}.`);
        const data = await response.json();
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch { /* storage unavailable */ }
        const repos = selectRepos(data, exclude, limit);
        finish(repos.length ? { kind: 'ready', repos, fetchedAt: new Date().toISOString() } : { kind: 'unavailable', reason: 'No public repositories were returned.' });
      })
      .catch((error: Error) => finish({ kind: 'unavailable', reason: error.name === 'AbortError' ? 'GitHub did not respond in time.' : error.message }))
      .finally(() => clearTimeout(timeout));
    return () => { cancelled = true; controller.abort(); clearTimeout(timeout); };
    // exclude and limit are static props on this site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (state.kind === 'unavailable') {
    return <p className="activity-note" role="status">Live GitHub activity is unavailable right now ({state.reason}) Browse <a href={`https://github.com/${user}?tab=repositories`} {...external}>repositories on GitHub</a> instead.</p>;
  }
  if (state.kind === 'loading') {
    return <div className="activity" aria-busy="true" aria-label="Loading GitHub activity"><div className="skeleton" /><div className="skeleton" /><div className="skeleton" /></div>;
  }
  return (
    <>
      <ul className="activity" aria-label="Recently pushed public repositories">
        {state.repos.map((repo) => (
          <li key={repo.name}>
            <a href={repo.html_url} {...external}>{repo.name}</a>
            <RelativeTime iso={repo.pushed_at} />
            {repo.description && <p>{repo.description}</p>}
          </li>
        ))}
      </ul>
      <p className="activity-note">Last push to each public repository, as reported by the GitHub API. Private repositories are not shown.</p>
    </>
  );
}
