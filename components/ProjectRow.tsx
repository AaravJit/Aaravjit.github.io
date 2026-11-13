import Image from 'next/image';
import Link from 'next/link';
import { domains, type Project } from '../data/projects';
import { Arrow, external, Status, Tags } from './ui';
import { LiveRange } from './time/Live';

export default function ProjectRow({ project, headingLevel = 3, priority = false }: { project: Project; headingLevel?: 2 | 3; priority?: boolean }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="project" id={project.slug} aria-labelledby={`${project.slug}-title`}>
      <div>
        <div className="card-top">
          <span className="kicker">{project.kicker}</span>
          <Status stage={project.stage} />
        </div>
        <Heading id={`${project.slug}-title`}>{project.name}</Heading>
        <p className="summary">{project.summary}</p>
        <ul className="project-evidence" style={{ marginTop: '1.2rem' }} aria-label="Evidence">
          {project.evidence.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="actions" style={{ marginTop: '1.4rem' }}>
          {project.caseStudy && <Link className="btn btn-primary" href={project.caseStudy}>Read case study <Arrow /></Link>}
          {project.repository && <a className="btn" href={project.repository} {...external}>Source ↗</a>}
          {project.live && <a className="btn" href={project.live} {...external}>Live site ↗</a>}
        </div>
      </div>
      <div>
      <dl className="project-meta">
        <div><dt>My role</dt><dd>{project.role}</dd></div>
        <div><dt>How it was built</dt><dd>{project.authorship}</dd></div>
        <div><dt>Known limitation</dt><dd>{project.limitation}</dd></div>
        <div><dt>Timeline</dt><dd><LiveRange record={project.period} /></dd></div>
        <div><dt>Domains</dt><dd>{project.domains.map((d) => domains[d].title).join(' · ')}</dd></div>
        <div><dt>Stack</dt><dd><Tags items={project.stack} /></dd></div>
        {project.repositoryVisibility === 'private' && <div><dt>Source</dt><dd>Private repository; I can walk through it in an interview.</dd></div>}
      </dl>
        {project.image && (
          <div className="project-image">
            <Image src={project.image.src} width={project.image.width} height={project.image.height} alt={project.image.alt} sizes="(max-width: 860px) calc(100vw - 64px), 480px" priority={priority} />
          </div>
        )}
      </div>
    </article>
  );
}
