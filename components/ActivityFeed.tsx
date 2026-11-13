'use client';

import { useEffect, useState } from 'react';
import { describeFailure, selectRepos, type FeedRepo } from '../lib/github';
import { RelativeTime } from './time/Live';
import { external } from './ui';

type State = { kind: 'loading' } | { kind: 'ready'; repos: FeedRepo[] } | { kind: 'unavailable'; reason: string };

const CACHE_KEY = 'gh-activity-v2';
const CACHE_MS = 15 * 60 * 1000;

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
      const age = cached && typeof cached.at === 'number' ? Date.now() - cached.at : Infinity;
      if (age >= 0 && age < CACHE_MS) {
        const repos = selectRepos(cached.data, user, exclude, limit);
        if (repos.length) {
          finish({ kind: 'ready', repos });
          return () => { cancelled = true; };
        }
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
        if (!response.ok) { finish({ kind: 'unavailable', reason: describeFailure(null, response.status) }); return; }
        const data: unknown = await response.json();
        const repos = selectRepos(data, user, exclude, limit);
        // Cache only the sanitized fields, never the raw response.
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: repos.map((r) => ({ name: r.name, description: r.description, pushed_at: r.pushedAt })) })); } catch { /* storage unavailable */ }
        finish(repos.length ? { kind: 'ready', repos } : { kind: 'unavailable', reason: 'No public repositories were returned.' });
      })
      .catch((error: unknown) => finish({ kind: 'unavailable', reason: describeFailure(error) }))
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
            <a href={repo.href} {...external}>{repo.name}</a>
            <RelativeTime iso={repo.pushedAt} />
            {repo.description && <p>{repo.description}</p>}
          </li>
        ))}
      </ul>
      <p className="activity-note">Last push to each public repository, as reported by the GitHub API. Private repositories are not shown.</p>
    </>
  );
}
