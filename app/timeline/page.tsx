import type { Metadata } from 'next';
import Link from 'next/link';
import { LiveRange } from '../../components/time/Live';
import { PageHead } from '../../components/ui';
import { parsePartialDate } from '../../lib/time/dates';
import { education, employment, milestones, type TimelineRecord } from '../../data/timeline';

export const metadata: Metadata = {
  title: 'Timeline',
  description: 'A dated chronology of Aarav Jit’s employment, education and verified project milestones. Durations are calculated from canonical dates.',
  alternates: { canonical: '/timeline/' },
};

const sortKey = (record: TimelineRecord) => {
  if (!record.start) return -Infinity;
  const d = parsePartialDate(record.start);
  return d.year * 10000 + (d.month ?? 1) * 100 + (d.day ?? 1);
};

const kindLabel = { work: 'Work', education: 'Education', project: 'Project', milestone: 'Milestone' } as const;

function Item({ record }: { record: TimelineRecord }) {
  return (
    <li className="tl-item" data-kind={record.kind}>
      <p className="tl-when"><LiveRange record={record} /></p>
      <div className="tl-body">
        <span className="kind">{kindLabel[record.kind]}</span>
        <h3>{record.href ? <Link href={record.href}>{record.title}</Link> : record.title}</h3>
        <p className="org">{record.organization}{record.location ? ` · ${record.location}` : ''}</p>
        <p>{record.summary}</p>
        {record.highlights && <ul>{record.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
      </div>
    </li>
  );
}

export default function TimelinePage() {
  const all = [...employment, ...education.filter((e) => e.start), ...milestones].sort((a, b) => sortKey(b) - sortKey(a));
  return (
    <>
      <PageHead eyebrow="Timeline" title="Work, education and projects, by date.">
        Every date comes from a recorded source and is shown only to the precision that source supports. Durations are calculated in your browser from those dates, in Pacific time.
      </PageHead>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <div className="legend" aria-hidden="true">
          <span><i style={{ borderColor: 'var(--accent)' }} />Work</span>
          <span><i style={{ borderColor: 'var(--ok)' }} />Education</span>
          <span><i />Project</span>
          <span><i style={{ background: 'var(--warn)', borderColor: 'var(--warn)' }} />Release milestone</span>
        </div>
        <h2 className="sr-only" id="chronology">Chronology, newest first</h2>
        <ol className="timeline" aria-labelledby="chronology">{all.map((record) => <Item key={record.id} record={record} />)}</ol>

        <section className="section-tight" style={{ borderTop: '1px solid var(--line)' }} aria-labelledby="work">
          <h2 id="work" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Work experience</h2>
          <ol className="timeline">{employment.map((record) => <Item key={record.id} record={record} />)}</ol>
        </section>
        <section className="section-tight" style={{ borderTop: '1px solid var(--line)' }} aria-labelledby="education">
          <h2 id="education" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Education</h2>
          <ol className="timeline">
            {education.map((record) => (
              <li className="tl-item" data-kind="education" key={record.id}>
                <p className="tl-when">{record.start ? <LiveRange record={record} /> : record.startLabel}</p>
                <div className="tl-body">
                  <h3>{record.organization}</h3>
                  <p className="org">{record.program}</p>
                  <p>{record.summary}</p>
                  {record.coursework && <><p><strong>Program coursework:</strong></p><ul>{record.coursework.map((c) => <li key={c}>{c}</li>)}</ul></>}
                  {record.note && <p className="small muted">{record.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
        <p className="small muted">Durations count whole months for month-precision dates: an ongoing role counts completed months, an ended one counts both its first and last month. How it works: <a href="https://github.com/AaravJit/Aaravjit.github.io/blob/main/docs/date-system.md">docs/date-system.md</a>.</p>
      </div>
    </>
  );
}
