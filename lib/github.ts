/** A public repository as shown in the activity feed. Only these fields reach the page. */
export interface FeedRepo {
  name: string;
  href: string;
  description: string | null;
  pushedAt: string;
}

const REPO_NAME = /^[A-Za-z0-9._-]{1,100}$/;

/**
 * Turns an untrusted GitHub API response (or a cached copy of one) into feed entries.
 * Keeps public, non-fork, non-archived repositories with a valid push time, newest first.
 * Links are rebuilt from the user and repository name instead of trusting `html_url`, so a
 * malformed or hostile response can't inject a javascript: or off-site link.
 */
export function selectRepos(data: unknown, user: string, exclude: readonly string[], limit: number): FeedRepo[] {
  if (!Array.isArray(data)) return [];
  const repos: FeedRepo[] = [];
  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Record<string, unknown>;
    if (typeof r.name !== 'string' || !REPO_NAME.test(r.name)) continue;
    if (typeof r.pushed_at !== 'string' || Number.isNaN(Date.parse(r.pushed_at))) continue;
    if (r.fork === true || r.private === true || r.archived === true || exclude.includes(r.name)) continue;
    repos.push({
      name: r.name,
      href: `https://github.com/${encodeURIComponent(user)}/${encodeURIComponent(r.name)}`,
      description: typeof r.description === 'string' ? r.description.slice(0, 200) : null,
      pushedAt: new Date(r.pushed_at).toISOString(),
    });
  }
  return repos.sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt)).slice(0, limit);
}

/** A short, user-facing reason for a failed request. Never echoes response bodies. */
export function describeFailure(error: unknown, status?: number): string {
  if (status === 403 || status === 429) return 'GitHub’s rate limit for this network was reached.';
  if (typeof status === 'number') return `GitHub returned ${status}.`;
  if (error instanceof Error && error.name === 'AbortError') return 'GitHub did not respond in time.';
  return 'GitHub could not be reached.';
}
