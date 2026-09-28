import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import { CaseStudyHeader, ExploreProject, ProjectStatus, RoleBlock } from '../../../components/ProjectUI';
import { projects, site } from '../../../data/portfolio';

const project = projects.wrenchAI;
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export const metadata: Metadata = {
  title: 'WrenchAI Case Study | Aarav Jit',
  description:
    'A case study of WrenchAI, a live aviation-maintenance study platform with verbal-exam practice, written test preparation, practical prep, and progress tracking.',
  alternates: { canonical: `${site.url}/projects/wrenchai/` },
  openGraph: {
    title: 'WrenchAI Case Study | Aarav Jit',
    description:
      'A live aviation-maintenance study platform connecting verbal practice, written test preparation, practical prep, and progress interfaces.',
    url: `${site.url}/projects/wrenchai/`,
    type: 'article',
    images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit — Software, Linux and Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WrenchAI Case Study | Aarav Jit',
    description: 'A case study of a live aviation-maintenance study platform.',
    images: ['/social-preview.png'],
  },
};

const role = [
  'Picked the problem and organized the whole product around the three A&P knowledge areas: General, Airframe, and Powerplant.',
  'Specified each study mode (verbal practice, written tests, weak-spot drill, practical prep) and how they share one dashboard and navigation.',
  'Defined the account, session, and progress data the dashboard reads from.',
  'Tested each flow end to end on the live app.',
] as const;

const productPrinciples = [
  ['Unified product shell', 'Dashboard, practice, written test, weak-spot, practical, reference, and career areas share one navigation system.'],
  ['Consistent study structure', 'General, Airframe, and Powerplant remain recognizable across dashboard and preparation modes.'],
  ['Multiple preparation modes', 'Verbal practice, written sessions, weak-spot drilling, and practical checklists support different study tasks.'],
  ['Visible progression', 'Performance, recent sessions, topic progress, and readiness states give each activity a place in the larger workflow.'],
  ['Account-based continuity', 'The authenticated dashboard connects a learner identity to sections, sessions, and progress-oriented interfaces.'],
  ['Live product delivery', 'The public landing page and authenticated application form a deployed, user-facing product rather than a static concept.'],
] as const;

export default function WrenchAICaseStudy() {
  return <><Navigation /><main className="case-study wrenchai-case"><CaseStudyHeader label="Deployed product case study" title={project.name} status="live" description="A live aviation-maintenance study platform combining verbal-exam practice, written test preparation, practical prep, progress tracking, and structured learning workflows." tags={project.tags} action={{ href: project.liveSite, label: 'View Live Site ↗' }} />
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">01 — Product</p><h2>One study product across three subject areas</h2></div><div className="case-prose"><p>WrenchAI supports aviation-maintenance students preparing across General, Airframe, and Powerplant material. Its public product experience centers on AI-assisted verbal practice, while the authenticated application connects written test preparation, weak-spot drilling, practical prep, references, career tools, and progress-oriented views.</p></div></div><figure className="container product-evidence evidence-wide"><Image src="/wrenchai-landing.webp" width={1600} height={1071} sizes="(max-width: 850px) calc(100vw - 48px), 1180px" alt="WrenchAI landing page showing a simulated verbal-exam question, answer feedback, and study product introduction" priority /><figcaption>Public landing page showing WrenchAI’s simulated verbal-practice interface and product positioning.</figcaption></figure></section>
    <section className="case-section tint"><div className="container case-two-col"><div><p className="case-label">02 — My role</p><h2>What I built</h2></div><div className="case-prose">
      <RoleBlock summary="Solo project, built and hosted on Base44, an AI app builder that generates the code and database from natural-language specs." items={role} />
      <p style={{ marginTop: '1.3rem' }}>Base44 writes and hosts the code, so my work is at the product level: deciding what to build, specifying it precisely enough that the generated app behaves correctly, and testing it as a student would use it.</p>
    </div></div></section>
    <section className="case-section dark"><div className="container"><div className="case-two-col case-intro"><div><p className="case-label">03 — Dashboard</p><h2>A connected study workspace</h2></div><div className="case-prose"><p>The authenticated dashboard puts the product’s study modes in one visible system. Learners can move among Practice, Written Test, Weak Spot Drill, Practical Prep, Reference Library, and Career Tools while keeping General, Airframe, and Powerplant sections in view.</p><p>Performance, Recent Sessions, and Topic Progress fill in as a learner completes sessions. The screenshot is a fresh account, so it shows the empty states a new user sees first.</p></div></div><figure className="product-evidence evidence-wide"><Image src="/wrenchai-dashboard.webp" width={1600} height={1071} sizes="(max-width: 850px) calc(100vw - 48px), 1180px" alt="WrenchAI dashboard showing study navigation, performance tabs, and General, Airframe, and Powerplant practice sections" /><figcaption>Authenticated dashboard connecting navigation, study-area selection, performance, recent sessions, and topic progress.</figcaption></figure></div></section>
    <section className="case-section"><div className="container case-product-grid"><div><p className="case-label">04 — Written test prep</p><h2>Section-based written practice</h2><div className="case-prose"><p>Written Test Prep presents separate General, Airframe, and Powerplant session cards with visible topic labels, question counts, estimated time, and session controls.</p></div></div><figure className="product-evidence"><Image src="/wrenchai-written-test-prep.webp" width={1600} height={1071} sizes="(max-width: 850px) calc(100vw - 48px), 62vw" alt="WrenchAI Written Test Prep page with General, Airframe, and Powerplant quiz cards" /><figcaption>Written practice organized by the three major subject sections.</figcaption></figure></div></section>
    <section className="case-section tint"><div className="container case-product-grid reverse"><div><p className="case-label">05 — Practical prep</p><h2>Readiness organized as a checklist</h2><div className="case-prose"><p>Practical Prep breaks General, Airframe, and Powerplant preparation into trackable project areas. The visible General checklist includes mechanic fundamentals, privileges and limitations, ground operations, corrosion control, inspection, weight and balance, and fluid lines and fittings.</p></div></div><figure className="product-evidence"><Image src="/wrenchai-practical-prep.webp" width={1600} height={1071} sizes="(max-width: 850px) calc(100vw - 48px), 62vw" alt="WrenchAI Practical Prep interface showing General practical-project readiness and checklist items" /><figcaption>Practical-project readiness, section filters, and checklist entries in one view.</figcaption></figure></div></section>
    <section className="case-section"><div className="container"><p className="case-label">06 — Product decisions</p><h2>Product decisions</h2><div className="architecture-grid wrench-principles">{productPrinciples.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="case-section dark"><div className="container case-two-col"><div><p className="case-label">07 — Live product</p><h2>Deployed and available to explore</h2><ProjectStatus status="live" /></div><div className="case-prose"><p>WrenchAI is live with a public landing page and sign-in. It&apos;s an independent study tool and isn&apos;t affiliated with the FAA.</p><a className="button primary" href={project.liveSite} {...external}>Open WrenchAI ↗</a></div></div></section>
    <ExploreProject href={projects.hyprland.caseStudy} name="Aarav Hyprland" detail="Linux systems case study" />
  </main><footer><div className="container"><b>AJ<span>.</span></b><p>WrenchAI case study · Live product</p><Link href="/">Home</Link></div></footer></>;
}
