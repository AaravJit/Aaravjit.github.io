import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Project } from '../data/projects';
import { projects } from '../data/projects';
import { LiveRange } from './time/Live';
import { external, Status, Tags } from './ui';

export interface CaseSection { id: string; label: string; title: string; body: ReactNode }

/** Shared case-study layout: a facts sidebar with table of contents, then numbered sections. */
export default function CaseStudy({ project, lede, sections }: { project: Project; lede: ReactNode; sections: readonly CaseSection[] }) {
  const others = projects.filter((p) => p.caseStudy && p.slug !== project.slug);
  const next = others[(others.findIndex((p) => p.slug > project.slug) + others.length) % others.length] ?? others[0];
  return (
    <article>
      <header className="page-head wrap">
        <Link className="back-link" href="/work/">← All work</Link>
        <div className="card-top" style={{ marginTop: '1.6rem', justifyContent: 'flex-start' }}>
          <span className="eyebrow">{project.kicker}</span>
          <Status stage={project.stage} />
        </div>
        <h1>{project.name}</h1>
        <div className="lede">{lede}</div>
        <div className="actions" style={{ marginTop: '1.6rem' }}>
          {project.repository && <a className="btn btn-primary" href={project.repository} {...external}>View source ↗</a>}
          {project.live && <a className="btn btn-primary" href={project.live} {...external}>Open live app ↗</a>}
          {project.repositoryVisibility === 'private' && <span className="muted small" style={{ alignSelf: 'center' }}>Source is in a private repository. Happy to walk through it in an interview.</span>}
        </div>
      </header>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <div className="case-layout">
          <aside className="case-aside" aria-label="Project facts">
            <dl style={{ display: 'grid', gap: '1.1rem' }}>
              <div><dt>Status</dt><dd><Status stage={project.stage} /></dd></div>
              <div><dt>Timeline</dt><dd><LiveRange record={project.period} /></dd></div>
              <div><dt>Role</dt><dd>{project.role}</dd></div>
              <div><dt>How it was built</dt><dd>{project.authorship}</dd></div>
              <div><dt>Stack</dt><dd><Tags items={project.stack} /></dd></div>
            </dl>
            <nav className="toc-block" aria-label="On this page">
              <p className="eyebrow" style={{ marginBottom: '0.6rem' }}>On this page</p>
              <ol className="toc">{sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>)}</ol>
            </nav>
          </aside>
          <div>
            {sections.map((section, index) => (
              <section className="case-section" key={section.id} id={section.id} aria-labelledby={`${section.id}-h`}>
                <p className="eyebrow">{String(index + 1).padStart(2, '0')} · {section.label}</p>
                <h2 id={`${section.id}-h`}>{section.title}</h2>
                <div className="prose">{section.body}</div>
              </section>
            ))}
            {next && (
              <nav className="callout" style={{ marginTop: '3.5rem' }} aria-label="Next case study">
                Next case study: <Link href={next.caseStudy!}>{next.name}</Link>, {next.kicker.toLowerCase()}.
              </nav>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
