#!/usr/bin/env node
/**
 * Post-build checks on the static export in out/:
 * - every internal link and asset reference resolves to a built file (and #fragments exist)
 * - every page has <html lang>, one <h1>, a <title>, a meta description and a canonical URL
 * - every <img> has an alt attribute
 * - no obvious secrets or private contact details ship in the output
 * Exits non-zero with a list of problems. No dependencies.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../out/', import.meta.url).pathname;
if (!existsSync(root)) { console.error('out/ not found. Run npm run build first.'); process.exit(1); }

const files = [];
const walk = (dir) => { for (const name of readdirSync(dir)) { const p = join(dir, name); if (statSync(p).isDirectory()) walk(p); else files.push(p); } };
walk(root);
const html = files.filter((f) => f.endsWith('.html'));
const problems = [];
const ids = new Map();
for (const file of html) {
  const text = readFileSync(file, 'utf8');
  ids.set(file, new Set([...text.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const resolve = (href) => {
  const [pathPart] = href.split(/[?#]/);
  const clean = decodeURIComponent(pathPart);
  const candidates = clean.endsWith('/') ? [join(root, clean, 'index.html')] : [join(root, clean), join(root, clean, 'index.html'), join(root, `${clean}.html`)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};

const secretPatterns = [
  [/sk_(live|test)_[0-9a-zA-Z]{16,}/, 'Stripe secret key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/ghp_[0-9A-Za-z]{30,}|github_pat_[0-9A-Za-z_]{30,}/, 'GitHub token'],
  [/eyJhbGciOi[0-9A-Za-z_-]{20,}\.[0-9A-Za-z_-]{20,}\.[0-9A-Za-z_-]{10,}/, 'JWT'],
  [/sb_secret_[0-9A-Za-z]{10,}/, 'Supabase secret key'],
  // The public site uses LinkedIn for contact; no email address or phone number should ship.
  [/\b[A-Za-z0-9._%+-]+@(?!example\.)[A-Za-z0-9-]+\.(?:com|net|org|edu|io|dev|app)\b/, 'email address (public site uses LinkedIn only)'],
  [/\(\d{3}\)\s?\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b/, 'phone number (public site uses LinkedIn only)'],
];

for (const file of html) {
  const page = '/' + relative(root, file).replace(/index\.html$/, '');
  const text = readFileSync(file, 'utf8');
  const is404 = /404|_not-found/.test(file);
  if (!/<html[^>]*\slang="en"/.test(text)) problems.push(`${page}: missing <html lang>`);
  if (!/<title>[^<]{3,}<\/title>/.test(text)) problems.push(`${page}: missing <title>`);
  if (!/<meta name="description" content="[^"]{20,}"/.test(text)) problems.push(`${page}: missing meta description`);
  if (!is404 && !/<link rel="canonical" href="https:\/\/aaravjit\.github\.io\//.test(text)) problems.push(`${page}: missing canonical URL`);
  const h1 = (text.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problems.push(`${page}: expected one <h1>, found ${h1}`);
  for (const m of text.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) problems.push(`${page}: <img> without alt`);
  for (const m of text.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|data:|#$|javascript:)/.test(href) || href.startsWith('//')) continue;
    if (href.startsWith('#')) { if (!ids.get(file).has(href.slice(1))) problems.push(`${page}: broken fragment ${href}`); continue; }
    if (!href.startsWith('/')) continue;
    const target = resolve(href);
    if (!target) { problems.push(`${page}: broken link ${href}`); continue; }
    const fragment = href.split('#')[1];
    if (fragment && target.endsWith('.html') && !ids.get(target)?.has(decodeURIComponent(fragment))) problems.push(`${page}: broken fragment ${href}`);
  }
}
for (const file of files.filter((f) => /\.(html|js|txt|json|xml)$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  for (const [pattern, label] of secretPatterns) if (pattern.test(text)) problems.push(`${relative(root, file)}: possible ${label}`);
}

if (problems.length) {
  console.error(`check-site: ${problems.length} problem(s)\n` + [...new Set(problems)].map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log(`check-site: ${html.length} pages, links, fragments, metadata, alt text and secret patterns OK`);
