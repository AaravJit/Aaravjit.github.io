import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '../../components/ui';
import { notes } from '../../data/notes';
import { formatPartialDate, parsePartialDate } from '../../lib/time/dates';

export const metadata: Metadata = {
  title: 'Engineering notes',
  description: 'Technical write-ups by Aarav Jit built from his own projects: location privacy, validating model output, parsing tool output, and retry behavior.',
  alternates: { canonical: '/notes/' },
};

export default function NotesPage() {
  return (
    <>
      <PageHead eyebrow="Engineering notes" title="Write-ups from real projects.">
        Each note is built on code or documentation you can check, linked at the bottom. Nothing here describes an incident or experiment that didn’t happen.
      </PageHead>
      <div className="wrap wrap-narrow" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)', marginInline: 'auto' }}>
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link href={`/notes/${note.slug}/`}>
                <time className="when" dateTime={note.published ?? note.written}>{formatPartialDate(parsePartialDate(note.published ?? note.written), 'short')}</time>
                <div>
                  <h2>{note.title}</h2>
                  <p>{note.summary}</p>
                  <p className="small muted" style={{ marginTop: '0.5rem' }}>{note.topics.join(' · ')}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
