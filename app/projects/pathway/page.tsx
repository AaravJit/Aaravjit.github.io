import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArchitectureDiagram from '../../../components/ArchitectureDiagram';
import CaseStudy from '../../../components/CaseStudy';
import { Code, Story } from '../../../components/ui';
import { projectBySlug } from '../../../data/projects';

const project = projectBySlug('pathway');

export const metadata: Metadata = {
  title: 'Pathway case study',
  description: 'How Pathway compares a resume with a job posting, tailors it without inventing anything, and renders a PDF, on Next.js, OpenAI, Supabase and Stripe.',
  alternates: { canonical: '/projects/pathway/' },
  openGraph: { type: 'article', title: 'Pathway case study', url: '/projects/pathway/', images: [{ url: '/pathway-landing.jpg', width: 2160, height: 1350, alt: 'Pathway landing page' }] },
};

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
  return (
    <CaseStudy
      project={project}
      lede="Upload a resume, paste a job posting, and Pathway says whether the role is worth applying to, shows the evidence, tailors the resume for that job without inventing anything, and hands back a PDF."
      sections={[
        {
          id: 'problem', label: 'Problem', title: 'Too many tabs between a job post and an application',
          body: <>
            <p>Tailoring a resume usually means copying between the posting, the old resume, a chat tool, a document editor and a PDF exporter. Chat tools also happily add skills the candidate doesn’t have, which is the fastest way to fail an interview.</p>
            <p><strong>Why it matters:</strong> an AI feature is only useful if its output can be trusted. Pathway is built around one rule: every claim in the output has to trace back to the candidate’s own resume.</p>
            <figure className="shot"><Image src="/pathway-landing.jpg" width={2160} height={1350} sizes="(max-width: 920px) calc(100vw - 32px), 860px" alt="Pathway landing page with the headline 'A better resume without the homework' and a sample job fit card scoring 82" priority /></figure>
            <figcaption>Landing page. The job card on the right is the page’s built-in example.</figcaption>
          </>,
        },
        {
          id: 'role', label: 'My role', title: 'What I did',
          body: <>
            <ul>
              <li>Planned the product and split it into 18 pull requests, from the first mock-backend MVP to the job-fit flow (57 commits since January 2026).</li>
              <li>Wrote the job-fit prompt and the server-side validation every model response passes through.</li>
              <li>Designed the Supabase schema and its row-level security policies.</li>
              <li>Deployed to Vercel and fixed the build failures that came up there, such as moving pdf-parse to a dynamic import on the Node runtime.</li>
            </ul>
            <p>The code was written by AI coding agents from specs I wrote. I reviewed and merged every pull request and debugged what broke when it ran for real.</p>
          </>,
        },
        {
          id: 'architecture', label: 'Architecture', title: 'How it fits together',
          body: <>
            <ArchitectureDiagram
              title="Pathway architecture"
              width={900}
              height={330}
              zones={[{ label: 'Vercel (server)', x: 230, y: 10, w: 430, h: 310 }]}
              nodes={[
                { id: 'client', label: 'Browser', sub: 'Next.js App Router', x: 20, y: 130, w: 180, detail: 'React UI for upload, job-fit results, tailoring, preview and download. Holds only the user’s Supabase session.' },
                { id: 'api', label: 'Route handlers', sub: '19 API routes', x: 250, y: 50, w: 190, detail: 'Parsing, job fit, generation, rendering, history, usage and billing. Every model response is validated here before it reaches the client.' },
                { id: 'parse', label: 'Document intake', sub: 'pdf-parse · mammoth', x: 250, y: 150, w: 190, detail: 'Accepts PDF, DOCX and TXT resumes and extracts text on the server.' },
                { id: 'render', label: 'PDF renderer', sub: 'pdf-lib', x: 250, y: 250, w: 190, detail: 'Lays out the tailored resume directly with pdf-lib: measured word wrap, page breaks at the margin, no browser.' },
                { id: 'validate', label: 'Sanitizer', sub: 'type checks · clamps', x: 460, y: 50, w: 180, detail: 'Type-checks every field of the model’s JSON, clamps the score to 0–100, restricts the verdict to four values and caps lists at six items.' },
                { id: 'openai', label: 'OpenAI', sub: 'Responses API, JSON', x: 700, y: 50, w: 180, detail: 'Asked for strict JSON with a prompt that forbids inventing experience. Treated as untrusted input.' },
                { id: 'db', label: 'Supabase', sub: 'Auth · Postgres + RLS', x: 700, y: 150, w: 180, detail: 'Auth and Postgres. Row-level security on all four tables; each policy compares auth.uid() with the row owner.' },
                { id: 'stripe', label: 'Stripe', sub: 'Checkout · webhook', x: 700, y: 250, w: 180, detail: 'Checkout and billing portal. The webhook rejects any event whose signature fails stripe.webhooks.constructEvent.' },
              ]}
              edges={[
                { from: 'client', to: 'api', label: 'HTTPS' },
                { from: 'client', to: 'parse' },
                { from: 'api', to: 'validate' },
                { from: 'validate', to: 'openai' },
                { from: 'api', to: 'db' },
                { from: 'api', to: 'render' },
                { from: 'stripe', to: 'api', label: 'signed' },
              ]}
            />
            <figure className="shot"><Image src="/pathway-job-fit.jpg" width={2160} height={1350} sizes="(max-width: 920px) calc(100vw - 32px), 860px" alt="Pathway job fit page with a resume upload area and a job posting text box" /></figure>
            <figcaption>The job-fit flow: add a PDF, DOCX or TXT resume once, then paste any job post.</figcaption>
          </>,
        },
        {
          id: 'decisions', label: 'Decisions', title: 'Treating model output as untrusted input',
          body: <>
            <p>The job-fit route asks the OpenAI Responses API for strict JSON, but the app never trusts the shape it gets back. Every field is type-checked, the score is clamped, the verdict must be one of four values, and each list is capped at six well-formed items. A malformed response degrades to a safe default instead of crashing the page.</p>
            <Code file="app/api/job-fit/route.ts (private repository)" code={sanitize} />
            <p>The prompt carries the same rule as the product. These lines are copied from it:</p>
            <Code file="job-fit system prompt (excerpt)" code={promptRules} />
            <p>Longer write-up: <Link href="/notes/model-output-is-untrusted-input/">Model output is untrusted input</Link>.</p>
          </>,
        },
        {
          id: 'challenge', label: 'Challenge', title: 'Dropping a headless browser to make PDFs',
          body: <Story steps={[
            ['Before', 'The first renderer built an HTML resume and printed it to PDF with Playwright, running a bundled Chromium (@sparticuz/chromium) inside a Vercel serverless function.'],
            ['Problem', 'That meant bundling and starting a whole browser to lay out one page of text, by far the heaviest dependency in the app.'],
            ['Change', 'Rewrote the render route on pdf-lib: embed Helvetica, measure each word with widthOfTextAtSize to wrap lines, and add pages when the cursor reaches the bottom margin.'],
            ['Result', 'Two dependencies removed, 450 lines deleted for 275 added, and the output is identical wherever the function runs.'],
          ]} />,
        },
        {
          id: 'security', label: 'Security', title: 'Users only ever see their own data',
          body: <>
            <p>Resumes are personal data, so access control lives in the database rather than only in the API. Row-level security is enabled on all four tables, and each policy checks <code>auth.uid()</code> against the row’s owner. The Stripe webhook rejects any event whose signature doesn’t verify.</p>
            <Code file="supabase/migrations/…_pathway_schema.sql (private repository)" code={rls} />
          </>,
        },
        {
          id: 'status', label: 'Status', title: 'Working end to end, not launched',
          body: <>
            <ul className="checklist"><li>Upload, job fit, tailoring, preview and PDF download work end to end.</li></ul>
            <ul className="checklist todo">
              <li>Move the free-tier usage counter from a cookie into Supabase. Clearing cookies currently resets it.</li>
              <li>Test Stripe checkout, portal and webhook flows end to end against live test-mode events.</li>
              <li>Add monitoring and error reporting on the API routes.</li>
            </ul>
          </>,
        },
      ]}
    />
  );
}
