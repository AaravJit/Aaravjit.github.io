import Link from 'next/link';

export function ProjectStatus({ status }: { status: 'live' | 'development' }) {
  const label = status === 'live' ? 'Live' : 'In development';
  return <span className={`project-status ${status}`} aria-label={`Project status: ${label}`}><i aria-hidden="true" />{label}</span>;
}

export function TechnologyTags({ tags }: { tags: readonly string[] }) {
  return <ul className="tag-list" aria-label="Project tags">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}

export function CaseStudyHeader({ label, title, description, tags, status, action }: {
  label: string;
  title: string;
  description: string;
  tags: readonly string[];
  status?: 'live' | 'development';
  action?: { href: string; label: string };
}) {
  return <header className="case-hero"><div className="container">
    <Link href="/#projects" className="back-link">← Back to projects</Link>
    <div className="case-title-row"><p className="project-kicker">{label}</p>{status && <ProjectStatus status={status} />}</div>
    <h1>{title}</h1><p>{description}</p><TechnologyTags tags={tags} />
    {action && <a className="button primary case-hero-action" href={action.href} target="_blank" rel="noopener noreferrer">{action.label}</a>}
  </div></header>;
}

export function ExploreProject({ href, name, detail }: { href: string; name: string; detail: string }) {
  return <section className="explore-project" aria-labelledby="explore-title"><div className="container">
    <p id="explore-title">Explore another project</p><Link href={href}><span>{detail}</span><b>{name} →</b></Link>
  </div></section>;
}
