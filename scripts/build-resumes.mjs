#!/usr/bin/env node
/**
 * Prints each /resume/<id>/ page of the static export to a PDF with Chromium.
 *
 *   npm run build && npm run resume:pdf
 *
 * Writes PDFs to public/resume/ (committed, so the site never links to a missing file) and to
 * out/resume/ (so a deploy ships the freshly generated copies), plus public/resume/manifest.json
 * with a hash of the source data. `npm run resume:check` fails when the data changed but the
 * PDFs were not regenerated. Set PW_CHROMIUM to use a specific Chromium binary.
 *
 * Optional: RESUME_PRIVATE_CONTACT="City | phone | email" and RESUME_PRIVATE_DIR=<dir> also write
 * private copies with that contact line to the given directory. Those never go to public/.
 */
import { createHash } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const repo = new URL('..', import.meta.url).pathname;
const out = join(repo, 'out');
if (!existsSync(join(out, 'resume'))) { console.error('Build first: npm run build'); process.exit(1); }

export const SOURCES = ['data/resume.ts', 'data/timeline.ts', 'data/profile.ts', 'app/resume/[id]/page.tsx', 'app/resume/[id]/resume.module.css'];
export const sourceHash = () => createHash('sha256').update(SOURCES.map((f) => readFileSync(join(repo, f), 'utf8')).join('\0')).digest('hex');

const variants = [...readFileSync(join(repo, 'data/resume.ts'), 'utf8').matchAll(/id: '([a-z-]+)',[\s\S]*?file: '([^']+)'/g)].map((m) => ({ id: m[1], file: m[2] }));
const defaultId = /defaultResume: ResumeId = '([a-z-]+)'/.exec(readFileSync(join(repo, 'data/resume.ts'), 'utf8'))[1];

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  let path = join(out, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage();
mkdirSync(join(repo, 'public/resume'), { recursive: true });
mkdirSync(join(out, 'resume'), { recursive: true });

const print = async (id, contact) => {
  await page.goto(`http://localhost:${port}/resume/${id}/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  if (contact) await page.evaluate((c) => { document.querySelector('[class*="contact"]').textContent = c; }, contact);
  await page.evaluate(() => document.fonts.ready);
  return page.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: false, tagged: true, outline: true });
};

for (const { id, file } of variants) {
  const pdf = await print(id);
  writeFileSync(join(repo, 'public/resume', file), pdf);
  writeFileSync(join(out, 'resume', file), pdf);
  if (id === defaultId) {
    for (const target of [join(repo, 'public/resume/aarav-jit-resume.pdf'), join(out, 'resume/aarav-jit-resume.pdf'), join(repo, 'public/resume.pdf'), join(out, 'resume.pdf')]) writeFileSync(target, pdf);
  }
  console.log(`resume: ${file} (${(pdf.length / 1024).toFixed(0)} KB)`);
  if (process.env.RESUME_PRIVATE_CONTACT && process.env.RESUME_PRIVATE_DIR) {
    mkdirSync(process.env.RESUME_PRIVATE_DIR, { recursive: true });
    writeFileSync(join(process.env.RESUME_PRIVATE_DIR, file.replace('.pdf', '-private.pdf')), await print(id, process.env.RESUME_PRIVATE_CONTACT));
  }
}
const manifest = { sourceHash: sourceHash(), sources: SOURCES, variants: variants.map((v) => v.file), default: defaultId };
writeFileSync(join(repo, 'public/resume/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
copyFileSync(join(repo, 'public/resume/manifest.json'), join(out, 'resume/manifest.json'));
await browser.close();
server.close();
