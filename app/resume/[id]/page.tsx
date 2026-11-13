import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { profile } from '../../../data/profile';
import { projectsNote, resumeProjects, resumeVariants } from '../../../data/resume';
import { education, employment } from '../../../data/timeline';
import { describeRange } from '../../../lib/time/dates';
import styles from './resume.module.css';

export const dynamicParams = false;
export function generateStaticParams() {
  return resumeVariants.map((variant) => ({ id: variant.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const variant = resumeVariants.find((v) => v.id === id);
  return {
    title: `Résumé: ${variant?.label ?? 'Aarav Jit'}`,
    description: `Printable résumé for Aarav Jit, ${variant?.label.toLowerCase()} emphasis.`,
    alternates: { canonical: `/resume/${id}/` },
    robots: { index: false, follow: true },
  };
}

// Ranges only (no durations) so the printed page never states a value that goes stale.
const range = (record: Parameters<typeof describeRange>[0]) => describeRange(record, { year: 9999, month: 12, day: 31 }).range;

export default async function ResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const variant = resumeVariants.find((v) => v.id === id);
  if (!variant) notFound();
  const [arc, csus] = education;
  return (
    <div className={styles.page} data-resume={variant.id}>
      <p className={`${styles.screenNote} no-print`}>
        Printable résumé, {variant.label.toLowerCase()} emphasis. <a href={`/resume/${variant.file}`} download>Download PDF</a> · <a href="/recruiters/#resumes">Other versions</a>
      </p>
      <article className={styles.sheet} aria-label={`Résumé of ${profile.name}`}>
        <header className={styles.head}>
          <h1>{profile.name}</h1>
          <p className={styles.headline}>{variant.headline}</p>
          <p className={styles.contact}>{profile.locationShort} | <a href={`mailto:${profile.resumeEmail}`}>{profile.resumeEmail}</a> | aaravjit.github.io | github.com/AaravJit | linkedin.com/in/aarav-jit-499a93293</p>
        </header>

        <section aria-labelledby="r-summary"><h2 id="r-summary">Summary</h2><p>{variant.summary}</p></section>

        <section aria-labelledby="r-skills">
          <h2 id="r-skills">Technical Skills</h2>
          <ul className={styles.skills}>{variant.skills.map((s) => <li key={s.label}><b>{s.label}:</b> {s.items}</li>)}</ul>
        </section>

        <section aria-labelledby="r-projects">
          <h2 id="r-projects">Projects</h2>
          <p className={styles.note}>{projectsNote}</p>
          {variant.projects.map((slug, index) => {
            const project = resumeProjects[slug];
            return (
              <div className={styles.entry} key={slug}>
                <p className={styles.row}><b>{project.name}</b><span>{project.dates}</span></p>
                <p className={styles.sub}>{project.link}</p>
                <ul>{project.bullets.slice(0, index === 0 ? 3 : 2).map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            );
          })}
        </section>

        <section aria-labelledby="r-experience">
          <h2 id="r-experience">Experience</h2>
          {employment.map((job) => (
            <div className={styles.entry} key={job.id}>
              <p className={styles.row}><b>{job.organization}, {job.title}</b><span>{range(job)}</span></p>
              <p className={styles.sub}>{job.location}</p>
              <ul>{job.highlights?.map((h) => <li key={h}>{h}</li>)}</ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="r-education">
          <h2 id="r-education">Education</h2>
          <div className={styles.entry}>
            <p className={styles.row}><b>{arc.organization}, {arc.location}</b><span>{range(arc)}</span></p>
            <p>{arc.program}</p>
            {arc.coursework && <p className={styles.sub}>Coursework: {arc.coursework.join('; ')}</p>}
          </div>
          <div className={styles.entry}>
            <p className={styles.row}><b>{csus.organization}</b><span>Prior coursework</span></p>
            <p>{csus.program}; no degree.</p>
          </div>
        </section>
      </article>
    </div>
  );
}
