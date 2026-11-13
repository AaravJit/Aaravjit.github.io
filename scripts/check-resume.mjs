#!/usr/bin/env node
/** Fails when résumé source data changed without regenerating the committed PDFs (npm run resume:pdf). */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repo = new URL('..', import.meta.url).pathname;
const manifestPath = join(repo, 'public/resume/manifest.json');
if (!existsSync(manifestPath)) { console.error('check-resume: public/resume/manifest.json missing. Run npm run build && npm run resume:pdf.'); process.exit(1); }
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const hash = createHash('sha256').update(manifest.sources.map((f) => readFileSync(join(repo, f), 'utf8')).join('\0')).digest('hex');
const missing = manifest.variants.filter((file) => !existsSync(join(repo, 'public/resume', file)));
if (missing.length) { console.error(`check-resume: missing ${missing.join(', ')}`); process.exit(1); }
if (hash !== manifest.sourceHash) { console.error('check-resume: résumé data changed since the PDFs were generated. Run npm run build && npm run resume:pdf and commit public/resume/.'); process.exit(1); }
console.log(`check-resume: ${manifest.variants.length} PDFs match the current data`);
