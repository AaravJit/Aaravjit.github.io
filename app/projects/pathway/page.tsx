import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import { CaseStudyHeader, ExploreProject, ProjectStatus } from '../../../components/ProjectUI';
import { projects, site } from '../../../data/portfolio';

const project = projects.pathway;
export const metadata: Metadata = {
  title: 'Pathway Case Study | Aarav Jit',
  description: 'A grounded case study of an AI-assisted workflow for job fit analysis, resume tailoring, preview, and document output.',
  alternates: { canonical: `${site.url}/projects/pathway/` },
  openGraph: { title: 'Pathway Case Study | Aarav Jit', description: 'An AI-assisted application workflow from resume and job posting through analysis, tailoring, preview, and download.', url: `${site.url}/projects/pathway/`, type: 'article' },
};

const steps = ['Resume', 'Job Posting', 'Fit Analysis', 'Tailoring', 'Preview', 'Download'];
const layers = [
  ['Frontend', 'Next.js · React · TypeScript · Tailwind CSS'],
  ['Application logic', 'Resume intake · job analysis · tailoring workflow · rendering'],
  ['AI integration', 'OpenAI-backed analysis and generation'],
  ['Data & identity', 'Supabase data and authentication infrastructure'],
  ['Documents', 'Resume parsing, preview, PDF and document output'],
  ['Payments', 'Stripe billing infrastructure'],
] as const;

export default function PathwayCaseStudy() {
  return <><Navigation /><main className="case-study pathway-case"><CaseStudyHeader label="Software product case study" title={project.name} status="development" description="An AI-assisted application workflow designed to move from an existing resume and job posting to fit analysis, targeted improvements, preview, and downloadable application material." tags={project.tags} />
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">01 — The problem</p><h2>One guided path through a fragmented task</h2></div><div className="case-prose"><p>Preparing a targeted application often means moving manually among job postings, an existing resume, chat tools, document editors, PDF exporters, and application notes. Each handoff adds repeated copying and makes it harder to keep the result grounded in the candidate’s actual experience.</p><p>Pathway brings those steps into a single guided process. Its goal is narrower than automating hiring: reduce the work between finding a relevant role and producing reviewable, tailored application material.</p></div></div></section>
    <section className="case-section dark"><div className="container"><p className="case-label">02 — The workflow</p><h2>From source material to downloadable output</h2><ol className="workflow" aria-label="Pathway product workflow">{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><b>{step}</b>{index < steps.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol><p className="diagram-note">Explanatory workflow diagram—not a product screenshot.</p></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">03 — Product capabilities</p><h2>A connected application workflow</h2></div><div className="case-prose"><ul><li>Accepting and parsing an existing resume as source material</li><li>Analyzing pasted job content and inferring role and company context</li><li>Evaluating fit across early-career software, AI, data, QA, DevOps, cloud, networking, and cybersecurity roles</li><li>Presenting fit evidence and targeted recommendations</li><li>Generating grounded resume changes for review</li><li>Previewing and downloading rendered application documents</li><li>Supporting account authentication, application history, and billing-related infrastructure</li></ul><p>These are implemented areas in the evolving repository; their presence does not imply that every subsystem has completed production validation.</p></div></div></section>
    <section className="case-section tint"><div className="container"><p className="case-label">04 — Technical architecture</p><h2>Product layers and responsibilities</h2><div className="architecture-grid">{layers.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="diagram-note">A recruiter-level architecture overview; credentials and environment configuration are intentionally excluded.</p></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">05 — Engineering challenges</p><h2>Turning unstructured inputs into reviewable output</h2></div><div className="case-prose"><h3>Grounded document generation</h3><p>Resume uploads and arbitrary job descriptions must be transformed into structured, usable context while generated changes remain tied to information the candidate supplied.</p><h3>Rendering as product behavior</h3><p>Tailored content is only useful when a person can inspect it. Preview and downloadable document generation therefore sit inside the core workflow rather than as a separate afterthought.</p><h3>Stateful product infrastructure</h3><p>Authentication, application history, usage controls, persistent data, and billing infrastructure introduce lifecycle and access-control concerns beyond the visible analysis interface.</p></div></div></section>
    <section className="case-section dark"><div className="container case-two-col"><div><p className="case-label">06 — Current status</p><h2>The core workflow exists. Release readiness continues.</h2><ProjectStatus status="development" /></div><div className="case-prose"><p>Pathway is in development and is not presented as production-complete. The current application connects resume intake, job analysis, tailored output, preview, and download, with authentication, history, data, and billing infrastructure represented in the codebase.</p><p>Before a production release, the remaining work must be validated end to end: persistence and access controls, durable server-side usage limits, Stripe checkout/portal/webhook flows, reliable application-history storage, dependency maintenance, monitoring, and operating documentation.</p><blockquote>“The interface works” is not the same thing as “the product is production-ready.”</blockquote><p>Keeping that distinction explicit makes release-readiness work part of the engineering scope rather than an afterthought.</p></div></div></section>
    <ExploreProject href={projects.wrenchAI.caseStudy} name="WrenchAI" detail="Live product case study" />
  </main><footer><div className="container"><b>AJ<span>.</span></b><p>Pathway case study · In development</p><Link href="/">Home</Link></div></footer></>;
}
