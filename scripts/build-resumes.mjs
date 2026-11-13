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
 * private copies with that contact line. The directory must be outside this repository, so a
 * private copy can't be committed or deployed by accident.
 *
 * The build serves out/ from a loopback-only server (scripts/static-server.mjs) and always closes
 * both the server and Chromium, including when a step fails.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { isInside, startStaticServer } from './static-server.mjs';

const repo = new URL('..', import.meta.url).pathname;
const out = join(repo, 'out');
if (!existsSync(join(out, 'resume'))) { console.error('Build first: npm run build'); process.exit(1); }

export const SOURCES = ['data/resume.ts', 'data/timeline.ts', 'data/profile.ts', 'app/resume/[id]/page.tsx', 'app/resume/[id]/resume.module.css'];
export const sourceHash = () => createHash('sha256').update(SOURCES.map((f) => readFileSync(join(repo, f), 'utf8')).join('\0')).digest('hex');

const resumeSource = readFileSync(join(repo, 'data/resume.ts'), 'utf8');
const variants = [...resumeSource.matchAll(/id: '([a-z-]+)',[\s\S]*?file: '([^']+)'/g)].map((m) => ({ id: m[1], file: m[2] }));
const defaultId = /defaultResume: ResumeId = '([a-z-]+)'/.exec(resumeSource)[1];
for (const { id, file } of variants) {
  if (!/^[a-z-]+$/.test(id) || !/^[a-z0-9-]+\.pdf$/.test(file)) throw new Error(`Unexpected résumé id or file name: ${id} ${file}`);
}

/**
 * Chromium stamps the print time into each PDF, so identical data would give different files.
 * Use SOURCE_DATE_EPOCH if set, else the last commit that touched the résumé sources, so the
 * same sources always produce byte-identical PDFs.
 */
const sourceEpoch = (() => {
  if (/^\d+$/.test(process.env.SOURCE_DATE_EPOCH ?? '')) return Number(process.env.SOURCE_DATE_EPOCH);
  try {
    const t = execFileSync('git', ['log', '-1', '--format=%ct', '--', ...SOURCES], { cwd: repo, encoding: 'utf8' }).trim();
    if (/^\d+$/.test(t)) return Number(t);
  } catch { /* not a git checkout */ }
  return 0;
})();
const pdfDate = (() => {
  const d = new Date(sourceEpoch * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `D:${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}+00'00'`;
})();
/** Replaces the timestamps in place. Same length, so the PDF's byte offsets stay valid. */
const stampDates = (pdf) => {
  const text = pdf.toString('latin1').replace(/\/(CreationDate|ModDate) \(D:\d{14}[+-]\d{2}'\d{2}'\)/g, (m, key) => {
    const next = `/${key} (${pdfDate})`;
    return next.length === m.length ? next : m;
  });
  return Buffer.from(text, 'latin1');
};

const privateContact = process.env.RESUME_PRIVATE_CONTACT;
const privateDir = process.env.RESUME_PRIVATE_DIR ? resolve(process.env.RESUME_PRIVATE_DIR) : null;
if (privateContact && privateDir) {
  mkdirSync(privateDir, { recursive: true });
  if (isInside(realpathSync(repo), realpathSync(privateDir))) {
    console.error('RESUME_PRIVATE_DIR must be outside the repository, so private résumés are never committed or deployed.');
    process.exit(1);
  }
}

const { origin, close } = await startStaticServer(out);
let browser;
try {
  browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const page = await browser.newPage();
  mkdirSync(join(repo, 'public/resume'), { recursive: true });
  mkdirSync(join(out, 'resume'), { recursive: true });

  const print = async (id, contact) => {
    const response = await page.goto(`${origin}/resume/${id}/`, { waitUntil: 'networkidle' });
    if (!response || response.status() !== 200) throw new Error(`/resume/${id}/ returned ${response?.status()}`);
    await page.emulateMedia({ media: 'print', colorScheme: 'light' });
    if (contact) await page.evaluate((c) => { document.querySelector('[class*="contact"]').textContent = c; }, contact);
    await page.evaluate(() => document.fonts.ready);
    return stampDates(await page.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: false, tagged: true, outline: true }));
  };

  for (const { id, file } of variants) {
    const pdf = await print(id);
    writeFileSync(join(repo, 'public/resume', file), pdf);
    writeFileSync(join(out, 'resume', file), pdf);
    if (id === defaultId) {
      for (const target of [join(repo, 'public/resume/aarav-jit-resume.pdf'), join(out, 'resume/aarav-jit-resume.pdf'), join(repo, 'public/resume.pdf'), join(out, 'resume.pdf')]) writeFileSync(target, pdf);
    }
    console.log(`resume: ${file} (${(pdf.length / 1024).toFixed(0)} KB)`);
    if (privateContact && privateDir) {
      writeFileSync(join(privateDir, file.replace('.pdf', '-private.pdf')), await print(id, privateContact));
    }
  }
  const manifest = { sourceHash: sourceHash(), sources: SOURCES, variants: variants.map((v) => v.file), default: defaultId };
  writeFileSync(join(repo, 'public/resume/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  copyFileSync(join(repo, 'public/resume/manifest.json'), join(out, 'resume/manifest.json'));
} finally {
  await browser?.close().catch(() => {});
  await close();
}
