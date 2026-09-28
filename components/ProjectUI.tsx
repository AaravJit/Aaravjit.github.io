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

export function RoleBlock({ summary, items }: { summary: string; items: readonly string[] }) {
  return <div className="role-block"><p className="role-summary">{summary}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

export function CodeSample({ file, href, code, caption }: { file: string; href?: string; code: string; caption?: string }) {
  return <figure className="code-sample">
    <div className="code-sample-bar"><code>{file}</code>{href && <a href={href} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>}</div>
    <pre tabIndex={0}><code>{code}</code></pre>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}

export function EngineeringStory({ steps }: { steps: readonly (readonly [string, string])[] }) {
  return <dl className="story-steps">{steps.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}</dl>;
}
