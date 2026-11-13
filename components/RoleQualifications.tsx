import Link from 'next/link';
import { projects } from '../data/projects';
import { resumeProjects, type ResumeVariant } from '../data/resume';

const projectLink = (slug: string) => projects.find((p) => p.slug === slug)?.caseStudy ?? `/work/#${slug}`;

/**
 * One role's qualifications, built only from the résumé data: the skills that apply, the
 * projects that show them and the matching PDF. Used on the recruiter page and the home page.
 */
export default function RoleQualifications({ variant, headingId, headingLevel = 3, links = 'recruiter' }: { variant: ResumeVariant; headingId: string; headingLevel?: 2 | 3; links?: 'recruiter' | 'home' }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const Sub = headingLevel === 2 ? 'h3' : 'h4';
  return (
    <>
      <p className="kicker">{variant.headline}</p>
      <Heading id={headingId}>{variant.label}</Heading>
      <p>{variant.summary}</p>
      <dl className="kv">
        {variant.skills.map((skill) => <div key={skill.label}><dt>{skill.label}</dt><dd>{skill.items}</dd></div>)}
      </dl>
      <Sub>Projects that show it</Sub>
      <ul className="role-projects">
        {variant.projects.map((slug) => {
          const rp = resumeProjects[slug];
          return <li key={slug}><Link href={projectLink(slug)}>{rp.name.split(':')[0]}</Link>: {rp.bullets[0]}</li>;
        })}
      </ul>
      <div className="links">
        <a href={`/resume/${variant.file}`} download>{variant.label} résumé (PDF)</a>
        {links === 'recruiter'
          ? <Link href={`/resume/${variant.id}/`}>View in browser</Link>
          : <Link href={`/recruiters/#role-${variant.id}`}>Recruiter summary</Link>}
      </div>
    </>
  );
}
