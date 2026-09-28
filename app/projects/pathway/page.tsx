import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import { CaseStudyHeader, CodeSample, EngineeringStory, ExploreProject, ProjectStatus, RoleBlock } from '../../../components/ProjectUI';
import { projects, site } from '../../../data/portfolio';

const project = projects.pathway;
export const metadata: Metadata = {
  title: 'Pathway Case Study | Aarav Jit',
  description: 'How I built Pathway, a Next.js, OpenAI, Supabase, and Stripe app that compares a resume to a job posting, tailors the resume, and renders a PDF.',
  alternates: { canonical: `${site.url}/projects/pathway/` },
  openGraph: {
    title: 'Pathway Case Study | Aarav Jit',
    description: 'An AI-assisted job fit and resume tailoring app built with Next.js, OpenAI, Supabase, and Stripe.',
    url: `${site.url}/projects/pathway/`,
    type: 'article',
    images: [{ url: '/pathway-landing.jpg', width: 2160, height: 1350, alt: 'Pathway landing page' }],
  },
  twitter: { card: 'summary_large_image', title: 'Pathway Case Study | Aarav Jit', description: 'An AI-assisted job fit and resume tailoring app.', images: ['/pathway-landing.jpg'] },
};

const steps = ['Resume', 'Job Posting', 'Fit Analysis', 'Tailoring', 'Preview', 'Download'];
const layers = [
  ['Frontend', 'Next.js 14 App Router · React · TypeScript · Tailwind CSS'],
  ['API', '19 route handlers for parsing, job fit, generation, rendering, history, usage, and billing'],
  ['AI', 'OpenAI Responses API returning JSON, validated and sanitized on the server'],
  ['Data & identity', 'Supabase Auth and Postgres with row-level security on every table'],
  ['Documents', 'PDF, DOCX, and TXT intake (pdf-parse, mammoth); PDF output drawn with pdf-lib'],
  ['Payments', 'Stripe Checkout, billing portal, and a signature-verified webhook'],
] as const;

const role = [
  'Planned the product and split it into 18 pull requests, from the first mock-backend MVP to the job-fit flow.',
  'Wrote the job-fit prompt and the server-side validation that every model response passes through.',
  'Designed the Supabase schema and its row-level security policies.',
  'Deployed it to Vercel and fixed the build failures that came up there, such as moving pdf-parse to a dynamic import on the Node runtime.',
] as const;

const sanitize = `function sanitizeResult(value: unknown): JobFitResult {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const rawScore = typeof source.overallScore === "number" ? source.overallScore : 0;
  const allowedVerdicts = new Set(["ready", "competitive", "stretch", "gap"]);
  const verdict = allowedVerdicts.has(String(source.verdict))
    ? (source.verdict as JobFitResult["verdict"])
    : "gap";

  return {
    roleTitle: typeof source.roleTitle === "string" ? source.roleTitle.trim().slice(0, 120) : "",
    overallScore: Math.max(0, Math.min(100, Math.round(rawScore))),
    verdict,
    evidenceMatched: cleanEvidenceMatches(source.evidenceMatched),  // drops malformed items, max 6
    actualGaps: cleanStringArray(source.actualGaps),
    // ...every other field is checked the same way
  };
}`;

const promptRules = `Rules:
- Never invent experience, credentials, tools, metrics, or education.
- Separate missing resume language from genuinely missing qualifications.
- Do not treat every preferred qualification as mandatory.
- Explain blockers plainly. Do not flatter the candidate.
- The score is decision support, not an ATS prediction.`;

const rls = `alter table resume_versions enable row level security;

create policy "resume_versions_select_own" on resume_versions
  for select using (auth.uid() = user_id);

create policy "resume_versions_insert_own" on resume_versions
  for insert with check (auth.uid() = user_id);`;

export default function PathwayCaseStudy() {
  return <><Navigation /><main className="case-study pathway-case"><CaseStudyHeader label="Software product case study" title={project.name} status="development" description="Upload a resume, paste a job posting, and Pathway says whether the role is worth applying to, shows the evidence, tailors the resume for that job without inventing anything, and hands back a PDF." tags={project.tags} />
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">01 — The problem</p><h2>Too many tabs between a job post and an application</h2></div><div className="case-prose">
      <p>Tailoring a resume usually means copying between the posting, the old resume, a chat tool, a document editor, and a PDF exporter. Chat tools also happily add skills the candidate doesn&apos;t have.</p>
      <p>Pathway does the whole path in one flow, and its prompt and validation are built around one rule: every claim in the output has to trace back to something in the candidate&apos;s own resume.</p>
    </div></div></section>
    <section className="case-section dark"><div className="container"><p className="case-label">02 — The product</p><h2>From resume to downloadable PDF</h2><ol className="workflow" aria-label="Pathway product workflow">{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><b>{step}</b>{index < steps.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol>
      <figure className="product-evidence evidence-wide"><Image src="/pathway-landing.jpg" width={2160} height={1350} sizes="(max-width: 850px) calc(100vw - 48px), 1180px" alt="Pathway landing page with the headline 'A better resume without the homework' and a sample job fit card scoring 82" /><figcaption>Landing page. The job card on the right is the page&apos;s built-in example.</figcaption></figure>
      <figure className="product-evidence evidence-wide"><Image src="/pathway-job-fit.jpg" width={2160} height={1350} sizes="(max-width: 850px) calc(100vw - 48px), 1180px" alt="Pathway job fit page with a resume upload area and a job posting text box" /><figcaption>The job fit flow: add a PDF, DOCX, or TXT resume once, then paste any job post.</figcaption></figure>
    </div></section>
    <section className="case-section tint"><div className="container case-two-col"><div><p className="case-label">03 — My role</p><h2>What I built</h2></div><div className="case-prose">
      <RoleBlock summary="Solo project since January 2026: 57 commits across 18 merged pull requests." items={role} />
      <p style={{ marginTop: '1.3rem' }}>I built Pathway with AI coding agents. I wrote the spec for each change, reviewed and merged every pull request, and debugged what broke when it ran for real.</p>
    </div></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">04 — Engineering story</p><h2>Dropping a headless browser to make PDFs</h2></div><div className="case-prose">
      <EngineeringStory steps={[
        ['Before', 'The first renderer built an HTML resume and printed it to PDF with Playwright, running a bundled Chromium (@sparticuz/chromium) inside a Vercel serverless function.'],
        ['Problem', 'That meant shipping and cold-starting a whole browser just to lay out one page of text, and it was the heaviest, most fragile dependency in the app.'],
        ['Change', 'I rewrote the render route on pdf-lib: it embeds Helvetica, measures each word with widthOfTextAtSize to wrap lines, and adds pages when the cursor reaches the bottom margin.'],
        ['Result', 'Two dependencies removed, 450 lines deleted for 275 added, and the output is identical wherever the function runs, because there is no browser involved.'],
      ]} />
      <h3>Treating model output as untrusted input</h3>
      <p>The job-fit route asks the OpenAI Responses API for strict JSON, but the app never trusts the shape it gets back. Every field is type-checked, the score is clamped to 0–100, the verdict must be one of four values, and each list is capped at six well-formed items. A malformed response degrades to a safe default instead of crashing the page.</p>
      <CodeSample file="app/api/job-fit/route.ts" code={sanitize} />
      <p>The prompt carries the same rule as the product. These lines are copied from it:</p>
      <CodeSample file="job-fit system prompt (excerpt)" code={promptRules} />
    </div></div></section>
    <section className="case-section tint"><div className="container"><p className="case-label">05 — Architecture</p><h2>How it fits together</h2><div className="architecture-grid">{layers.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">06 — Security</p><h2>Users only ever see their own data</h2></div><div className="case-prose">
      <p>Resumes are personal data, so access control lives in the database rather than only in the API. Row-level security is enabled on all four tables, and each policy checks <code>auth.uid()</code> against the row&apos;s owner. The Stripe webhook rejects any event whose signature doesn&apos;t verify with <code>stripe.webhooks.constructEvent</code>.</p>
      <CodeSample file="supabase/migrations/…_pathway_schema.sql" code={rls} />
    </div></div></section>
    <section className="case-section dark"><div className="container case-two-col"><div><p className="case-label">07 — Status</p><h2>Working end to end, not launched yet</h2><ProjectStatus status="development" /></div><div className="case-prose">
      <p>Upload, job fit, tailoring, preview, and PDF download work end to end. Before launch, I need to:</p>
      <ul><li>Move the free-tier usage counter from a cookie into Supabase. Right now clearing cookies resets it.</li><li>Test Stripe checkout, portal, and webhook flows end to end against live test-mode events.</li><li>Add monitoring and error reporting on the API routes.</li></ul>
      <p>The repository is private while it&apos;s in development. I&apos;m happy to walk through the code in an interview.</p>
    </div></div></section>
    <ExploreProject href={projects.wrenchAI.caseStudy} name="WrenchAI" detail="Live product case study" />
  </main><footer><div className="container"><b>AJ<span>.</span></b><p>Pathway case study · In development</p><Link href="/">Home</Link></div></footer></>;
}
