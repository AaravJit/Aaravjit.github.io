import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectRow from '../../components/ProjectRow';
import { PageHead } from '../../components/ui';
import { domains, projects, type Domain } from '../../data/projects';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Every project Aarav Jit has built, grouped by domain, with evidence, role, how the code was produced and known limitations.',
  alternates: { canonical: '/work/' },
};

export default function WorkPage() {
  return (
    <>
      <PageHead eyebrow="Work" title="Projects, with the evidence and the gaps.">
        Featured projects have full case studies. Smaller ones are summarized here. Each lists what I did, how the code was produced, and what is still missing.
      </PageHead>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <nav aria-label="Domains" className="filter-bar">
          {(Object.keys(domains) as Domain[]).map((domain) => <a key={domain} className="chip" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} href={`#domain-${domain}`}>{domains[domain].title}</a>)}
        </nav>
        <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
          {(Object.keys(domains) as Domain[]).map((domain) => (
            <section className="domain" key={domain} id={`domain-${domain}`} aria-labelledby={`h-${domain}`}>
              <h2 id={`h-${domain}`} style={{ fontSize: '1.02rem' }}>{domains[domain].title}</h2>
              <p>{domains[domain].summary}</p>
              <ul>{projects.filter((p) => p.domains.includes(domain)).map((p) => <li key={p.slug}><Link href={`#${p.slug}`}>{p.name}</Link></li>)}</ul>
            </section>
          ))}
        </div>
        <div className="project-list">
          {projects.map((project) => <ProjectRow key={project.slug} project={project} headingLevel={2} />)}
        </div>
        <p className="muted small" style={{ marginTop: '2rem' }}>Not shown: private repositories I have not cleared for publication, and solo-app, a two-commit freelancer dashboard scaffold from February 2026 that isn’t substantial enough to feature.</p>
      </div>
    </>
  );
}
