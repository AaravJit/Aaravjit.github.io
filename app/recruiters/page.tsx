import type { Metadata } from 'next';
import Link from 'next/link';
import PrintButton from '../../components/PrintButton';
import { LiveRange } from '../../components/time/Live';
import { external, PageHead } from '../../components/ui';
import { decisions } from '../../data/decisions';
import { buildDisclosure, profile } from '../../data/profile';
import { featuredProjects, projects } from '../../data/projects';
import { defaultResume, recruiterRoleOrder, resumeProjects, resumeVariants } from '../../data/resume';
import { education, employment } from '../../data/timeline';

export const metadata: Metadata = {
  title: 'Recruiter summary',
  description: 'One-page summary of Aarav Jit for recruiters: verified experience and education, engineering specialties, evidence, and role-specific résumés.',
  alternates: { canonical: '/recruiters/' },
};

const roles = recruiterRoleOrder.map((id) => resumeVariants.find((v) => v.id === id)!);
const projectLink = (slug: string) => {
  const project = projects.find((p) => p.slug === slug);
  return project?.caseStudy ?? `/work/#${slug}`;
};

export default function RecruitersPage() {
  return (
    <>
      <PageHead eyebrow="For recruiters and hiring managers" title="Aarav Jit, on one page.">
        Early-career engineer in Sacramento, studying cybersecurity, with shipped projects across Linux systems, cloud backends and application security. {profile.availability}
      </PageHead>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <div className="actions no-print" style={{ marginBottom: '2.5rem' }}>
          <a className="btn btn-primary" href="/resume/aarav-jit-resume.pdf" download>Download résumé (PDF)</a>
          <a className="btn" href={profile.linkedin} {...external}>Contact on LinkedIn ↗</a>
          <a className="btn" href={profile.github} {...external}>GitHub ↗</a>
          <PrintButton />
        </div>
        <nav className="role-jump no-print" aria-label="Qualifications by role">
          <span className="small muted">Qualifications by role:</span>
          {roles.map((v) => <a key={v.id} href={`#role-${v.id}`}>{v.label}</a>)}
        </nav>
        <div className="recruiter-grid">
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Summary</h2>
            <dl className="kv">
              <div><dt>Looking for</dt><dd>{profile.seeking.join(', ')}</dd></div>
              <div><dt>Location</dt><dd>{profile.location}. Open to hybrid and remote.</dd></div>
              <div><dt>Strongest in</dt><dd>Linux configuration and troubleshooting; Postgres row-level security and privacy design; full-stack TypeScript apps; explaining technical decisions in writing.</dd></div>
              <div><dt>Building toward</dt><dd>Networking and security depth through coursework; C and systems programming; containers. <Link href="/skills/#roadmap">Roadmap</Link></dd></div>
              <div><dt>How I build</dt><dd>{buildDisclosure.short}</dd></div>
            </dl>

            <h2 style={{ fontSize: '1.3rem', margin: '2.5rem 0 1rem' }}>Experience</h2>
            <dl className="kv">
              {employment.map((job) => (
                <div key={job.id}>
                  <dt><LiveRange record={job} /></dt>
                  <dd>{job.title}<span className="sub">{job.organization}, {job.location}</span></dd>
                </div>
              ))}
            </dl>
            <p className="small muted" style={{ marginTop: '0.6rem' }}>Retail operations roles. No software engineering employment yet; projects are independent work.</p>

            <h2 style={{ fontSize: '1.3rem', margin: '2.5rem 0 1rem' }}>Education</h2>
            <dl className="kv">
              {education.map((item) => (
                <div key={item.id}>
                  <dt>{item.start ? <LiveRange record={item} /> : item.startLabel}</dt>
                  <dd>{item.organization}<span className="sub">{item.program}{item.id === 'csus' ? '; no degree' : ''}</span></dd>
                </div>
              ))}
            </dl>

            <h2 style={{ fontSize: '1.3rem', margin: '2.5rem 0 1rem' }}>Evidence to look at first</h2>
            <dl className="kv">
              {featuredProjects.map((p) => (
                <div key={p.slug}>
                  <dt><Link href={p.caseStudy!}>{p.name}</Link></dt>
                  <dd>{p.evidence[0]}<span className="sub">{p.kicker}</span></dd>
                </div>
              ))}
              <div><dt><Link href="/lab/scheduler/">Engineering Lab</Link></dt><dd>A deterministic job-queue simulator with tests, built for this site.<span className="sub">TypeScript · simulation</span></dd></div>
              <div><dt><Link href="/decisions/">Decisions</Link></dt><dd>{decisions.length} architecture decision records with context, options and tradeoffs.<span className="sub">Engineering judgment</span></dd></div>
            </dl>
          </div>

          <aside>
            <h2 id="resumes" style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Résumé versions</h2>
            <p className="small muted" style={{ marginBottom: '1rem' }}>Same verified history, different emphasis. Generated from the same data as this site.</p>
            <ul className="resume-list">
              {roles.map((v) => (
                <li key={v.id}>
                  <div><b>{v.label}{v.id === defaultResume ? ' (default)' : ''}</b><span>{v.headline}</span></div>
                  <div className="links"><a href={`/resume/${v.file}`} download>PDF</a><Link href={`/resume/${v.id}/`}>View</Link><a href={`#role-${v.id}`}>Qualifications</a></div>
                </li>
              ))}
            </ul>
            <h2 style={{ fontSize: '1.3rem', margin: '2.5rem 0 1rem' }}>Contact</h2>
            <p className="small">The quickest way to reach me is a LinkedIn message. My GitHub shows the public source for most projects; Pathway’s is private and I’m glad to walk through it in an interview.</p>
          </aside>
        </div>
        <section className="section-tight" aria-labelledby="by-role" style={{ borderTop: '1px solid var(--line)', marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <h2 id="by-role" style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>Qualifications by role</h2>
          <p className="muted" style={{ marginBottom: '1.6rem', maxWidth: 720 }}>Each role below stands on its own: the skills that apply, the projects that show them, and the matching résumé. The history is the same in all four; only the emphasis changes.</p>
          <div className="role-grid">
            {roles.map((v) => (
              <article key={v.id} id={`role-${v.id}`} className="card role-card" aria-labelledby={`role-${v.id}-title`}>
                <p className="kicker">{v.headline}</p>
                <h3 id={`role-${v.id}-title`}>{v.label}</h3>
                <p>{v.summary}</p>
                <dl className="kv">
                  {v.skills.map((skill) => <div key={skill.label}><dt>{skill.label}</dt><dd>{skill.items}</dd></div>)}
                </dl>
                <h4>Projects that show it</h4>
                <ul className="role-projects">
                  {v.projects.map((slug) => {
                    const rp = resumeProjects[slug];
                    return <li key={slug}><Link href={projectLink(slug)}>{rp.name.split(':')[0]}</Link>: {rp.bullets[0]}</li>;
                  })}
                </ul>
                <div className="links">
                  <a href={`/resume/${v.file}`} download>{v.label} résumé (PDF)</a>
                  <Link href={`/resume/${v.id}/`}>View in browser</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
