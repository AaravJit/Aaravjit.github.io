import type { Metadata } from 'next';
import Link from 'next/link';
import { Code, PageHead } from '../../components/ui';
import { decisions } from '../../data/decisions';

export const metadata: Metadata = {
  title: 'Architecture decisions',
  description: 'Architecture decision records from Aarav Jit’s projects: context, options, decision, tradeoffs and result, with source excerpts.',
  alternates: { canonical: '/decisions/' },
};

export default function DecisionsPage() {
  return (
    <>
      <PageHead eyebrow="Architecture decisions" title="Context, options, decision, tradeoffs, result.">
        Decisions from real repositories, written as short decision records. Excerpts are copied from the linked source. No benchmarks or scale claims; where a decision was wrong, the record says so.
      </PageHead>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <nav aria-label="Decisions on this page" style={{ marginBottom: '2rem' }}>
          <ol className="toc" style={{ columns: '2 300px' }}>
            {decisions.map((d) => <li key={d.id}><a href={`#${d.id}`}>{d.title}</a></li>)}
          </ol>
        </nav>
        {decisions.map((d, index) => (
          <article className="adr" id={d.id} key={d.id} aria-labelledby={`${d.id}-title`}>
            <div className="adr-head">
              <span className="kicker">ADR {String(index + 1).padStart(2, '0')} · <Link href={d.projectHref}>{d.project}</Link></span>
              {d.newWork && <span className="badge badge-new">Part of this rebuild</span>}
            </div>
            <h2 id={`${d.id}-title`}>{d.title}</h2>
            <div className="adr-flow">
              <div><h3><span>1</span>Context</h3><p>{d.context}</p></div>
              <div><h3><span>2</span>Options</h3><ul>{d.options.map((o) => <li key={o}>{o}</li>)}</ul></div>
              <div><h3><span>3</span>Decision</h3><p>{d.decision}</p></div>
              <div><h3><span>4</span>Tradeoffs</h3><p>{d.tradeoffs}</p></div>
              <div><h3><span>5</span>Result</h3><p>{d.result}</p></div>
            </div>
            {d.revisit && <p className="callout callout-warn" style={{ marginTop: '1rem' }}><strong>Would revisit:</strong> {d.revisit}</p>}
            {d.excerpt && <Code code={d.excerpt.code} file={d.excerpt.file} href={d.excerpt.href} />}
          </article>
        ))}
      </div>
    </>
  );
}
