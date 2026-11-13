import Link from 'next/link';
import type { ReactNode } from 'react';
import { notes } from '../data/notes';
import { RelativeTime } from './time/Live';
import { external } from './ui';

export default function Article({ slug, children }: { slug: string; children: ReactNode }) {
  const note = notes.find((n) => n.slug === slug)!;
  return (
    <article>
      <header className="page-head wrap wrap-narrow">
        <Link className="back-link" href="/notes/">← Engineering notes</Link>
        <p className="eyebrow" style={{ marginTop: '1.6rem' }}>{note.topics.join(' · ')}</p>
        <h1 style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)' }}>{note.title}</h1>
        <p className="lede">{note.summary}</p>
        <p className="article-meta" style={{ marginTop: '1.2rem' }}>
          <span>By Aarav Jit</span>
          <span>Published <RelativeTime iso={`${note.published}T12:00:00-08:00`} /></span>
        </p>
      </header>
      <div className="wrap wrap-narrow" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <div className="prose">{children}</div>
        <aside className="callout" style={{ marginTop: '3rem' }} aria-label="Sources">
          <strong>Sources.</strong>{' '}
          {note.sources.map((source, i) => (
            <span key={source.label}>{i > 0 && '; '}{source.href ? <a href={source.href} {...external}>{source.label}</a> : source.label}</span>
          ))}
          . Prose drafted with an AI assistant from these sources and reviewed by me.
        </aside>
      </div>
    </article>
  );
}
