import Link from 'next/link';
import ActivityFeed from '../components/ActivityFeed';
import FocusOrderedList from '../components/focus/FocusOrderedList';
import FocusSelector from '../components/focus/FocusSelector';
import Fv from '../components/focus/Fv';
import RoleQualifications from '../components/RoleQualifications';
import ProjectRow from '../components/ProjectRow';
import { LiveDuration, LiveRange } from '../components/time/Live';
import { Arrow, external, SectionHead } from '../components/ui';
import { decisions } from '../data/decisions';
import { buildDisclosure, profile } from '../data/profile';
import { domains, featuredProjects, projects, type Domain } from '../data/projects';
import { resumeVariants } from '../data/resume';
import { education, employment } from '../data/timeline';

const walmart = employment[0];
const arc = education[0];

export default function Home() {
  const byDomain = (domain: Domain) => projects.filter((p) => p.domains.includes(domain) && p.slug !== 'portfolio');
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap">
          <p className="eyebrow rise">{profile.location} · Open to early-career roles</p>
          <h1 id="hero-title" className="rise rise-2" style={{ marginTop: '1.2rem' }}>{profile.name}</h1>
          <p className="tagline rise rise-2">
            <Fv view="general" as="span">Software. <b>Systems.</b> Infrastructure.</Fv>
            {resumeVariants.map((v) => <Fv key={v.id} view={v.focus} as="span">{v.tagline[0]} <b>{v.tagline[1]}</b> {v.tagline[2]}</Fv>)}
          </p>
          <Fv view="general" as="p" className="lede rise rise-3">{profile.intro} {profile.why}</Fv>
          {resumeVariants.map((v) => <Fv key={v.id} view={v.focus} as="p" className="lede">{v.summary}</Fv>)}
          <div className="actions rise rise-4">
            <Link className="btn btn-primary" href="/work/">Explore engineering work <Arrow /></Link>
            <Fv view="general" as="span"><a className="btn" href="/resume/aarav-jit-resume.pdf" download>Download résumé</a></Fv>
            {resumeVariants.map((v) => <Fv key={v.id} view={v.focus} as="span"><a className="btn" href={`/resume/${v.file}`} download>Download {v.label} résumé</a></Fv>)}
            <a className="btn" href={profile.github} {...external}>GitHub ↗</a>
            <a className="btn btn-ghost" href={profile.linkedin} {...external}>Contact on LinkedIn ↗</a>
          </div>
          <FocusSelector />
        </div>
      </section>

      {resumeVariants.map((v) => (
        <Fv key={v.id} view={v.focus}>
          <section className="wrap" aria-labelledby={`focus-${v.focus}-title`} style={{ paddingBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
            <div className="focus-panel">
              <RoleQualifications variant={v} headingId={`focus-${v.focus}-title`} headingLevel={2} links="home" />
              <p className="small muted">Same verified history in every view; only the emphasis changes. <Link href="/">Show the general portfolio</Link>.</p>
            </div>
          </section>
        </Fv>
      ))}

      <section className="wrap" aria-label="At a glance" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <dl className="facts">
          <div className="fact"><dt>{arc.organization} · <LiveRange record={arc} /></dt><dd>Cybersecurity &amp; Information Assurance student</dd></div>
          <div className="fact"><dt>{walmart.organization} · <LiveDuration record={walmart} /> · high-volume online order fulfillment</dt><dd>Working while I study and build</dd></div>
          <div className="fact"><dt>Pathway, RoadPing and Pull Up keep access rules in Postgres, not just the API</dt><dd>Row-level security in three apps</dd></div>
          <div className="fact"><dt>Aarav Hyprland backs up, validates, and rolls back on any failure</dt><dd>A Linux installer that can’t strand a machine</dd></div>
        </dl>
      </section>

      <section className="section" aria-labelledby="domains-title">
        <div className="wrap">
          <SectionHead eyebrow="What I work on" title="Four areas, each backed by a project you can open." id="domains-title">
            I’m looking for roles in software, systems and Linux, infrastructure, IT support and security. Here is the evidence for each.
          </SectionHead>
          <div className="grid grid-4">
            {(Object.keys(domains) as Domain[]).map((domain) => (
              <div className="domain" key={domain}>
                <h3>{domains[domain].title}</h3>
                <p>{domains[domain].summary}</p>
                <ul>{byDomain(domain).map((p) => <li key={p.slug}><Link href={p.caseStudy ?? `/work/#${p.slug}`}>{p.name}</Link></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="work-title">
        <div className="wrap">
          <div className="section-head section-head-row">
            <div style={{ display: 'grid', gap: '0.9rem', maxWidth: 720 }}>
              <p className="eyebrow">Selected work</p>
              <h2 id="work-title">What I’ve built, how, and where it falls short.</h2>
              <p>Every project lists its evidence, my role, how the code was produced, and its biggest current limitation.</p>
            </div>
            <Link className="text-link" href="/work/">All {projects.length} projects →</Link>
          </div>
          <FocusOrderedList
            className="project-list"
            general={featuredProjects.map((p) => p.slug)}
            items={Object.fromEntries(projects.filter((p) => p.featured || resumeVariants.some((v) => v.projects.includes(p.slug))).filter((p) => p.slug !== 'portfolio').map((p) => [p.slug, <ProjectRow key={p.slug} project={p} />]))}
          />
          <p className="callout" style={{ marginTop: '1.5rem' }}><strong>How I build.</strong> {buildDisclosure.short} <Link href="/about/#how-i-build">More on how I work →</Link></p>
        </div>
      </section>

      <section className="section" aria-labelledby="lab-title">
        <div className="wrap grid grid-2" style={{ alignItems: 'center', gap: 'clamp(2rem, 5vw, 4rem)' }}>
          <div>
            <p className="eyebrow">Engineering Lab <span className="badge badge-new" style={{ marginLeft: '0.5rem' }}>New</span></p>
            <h2 id="lab-title" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', margin: '0.9rem 0 1rem' }}>A job-queue simulator you can break.</h2>
            <p className="lede">Change worker count, scheduling strategy, failure rate and retry backoff, and watch latency, throughput and dead letters respond. Deterministic, seeded, tested, and labeled as a simulation.</p>
            <div className="actions" style={{ marginTop: '1.6rem' }}>
              <Link className="btn btn-primary" href="/lab/scheduler/">Open the simulator <Arrow /></Link>
              <Link className="btn" href="/notes/retries-and-backoff-in-a-simulator/">Read the write-up</Link>
            </div>
          </div>
          <div className="card">
            <p className="kicker">Why this lab</p>
            <p>HireStudio’s worker claims jobs with a read-then-update and never retries a failure. The simulator models the design I would replace it with: bounded attempts, capped exponential backoff, jitter and a dead-letter state.</p>
            <Link className="text-link" href="/decisions/#job-claims">Read the decision record →</Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="decisions-title">
        <div className="wrap">
          <div className="section-head section-head-row">
            <div style={{ display: 'grid', gap: '0.9rem', maxWidth: 720 }}>
              <p className="eyebrow">Engineering decisions</p>
              <h2 id="decisions-title">How I reason about tradeoffs.</h2>
              <p>Short decision records from real repositories: context, options, decision, tradeoffs and result.</p>
            </div>
            <Link className="text-link" href="/decisions/">All {decisions.length} decisions →</Link>
          </div>
          <div className="grid grid-3">
            {decisions.slice(0, 3).map((decision) => (
              <Link key={decision.id} className="card card-link" href={`/decisions/#${decision.id}`}>
                <span className="kicker">{decision.project}</span>
                <h3>{decision.title}</h3>
                <p>{decision.context.split('. ')[0]}.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="timeline-title">
        <div className="wrap grid grid-2" style={{ gap: 'clamp(2rem, 5vw, 4rem)' }}>
          <div>
            <SectionHead eyebrow="Experience and education" title="Work, school and building, in parallel." id="timeline-title">
              Retail operations taught me to work accurately under time pressure and to escalate early. Those habits carry straight into how I debug and ship.
            </SectionHead>
            <Link className="text-link" href="/timeline/">Full timeline with projects →</Link>
          </div>
          <ol className="timeline">
            {[...employment, ...education].map((record) => (
              <li className="tl-item" key={record.id} data-kind={record.kind} style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
                <div className="tl-body">
                  <span className="kind">{record.kind === 'work' ? 'Work' : 'Education'}</span>
                  <h3>{record.kind === 'work' ? record.title : record.organization}</h3>
                  <p className="org">{record.kind === 'work' ? `${record.organization} · ${record.location}` : record.title}</p>
                  <p className="tl-when" style={{ marginTop: '0.35rem' }}><LiveRange record={record} /></p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="activity-title">
        <div className="wrap grid grid-2" style={{ gap: 'clamp(2rem, 5vw, 4rem)' }}>
          <SectionHead eyebrow="Recent activity" title="What I pushed recently." id="activity-title">
            Fetched live from GitHub’s public API when you load the page. Dates are GitHub’s, not the page’s.
          </SectionHead>
          <ActivityFeed user={profile.githubUser} />
        </div>
      </section>

      <section className="section" aria-labelledby="contact-title">
        <div className="wrap">
          <SectionHead eyebrow="Contact" title="Hiring for software, systems, IT or security?" id="contact-title">
            {profile.availability} The recruiter page has a one-screen summary and role-specific résumés.
          </SectionHead>
          <div className="actions">
            <a className="btn btn-primary" href={profile.linkedin} {...external}>Message me on LinkedIn ↗</a>
            <Link className="btn" href="/recruiters/">Recruiter summary</Link>
            <Fv view="general" as="span"><a className="btn" href="/resume/aarav-jit-resume.pdf" download>Download résumé</a></Fv>
            {resumeVariants.map((v) => <Fv key={v.id} view={v.focus} as="span"><a className="btn" href={`/resume/${v.file}`} download>Download {v.label} résumé</a></Fv>)}
          </div>
        </div>
      </section>
    </>
  );
}
