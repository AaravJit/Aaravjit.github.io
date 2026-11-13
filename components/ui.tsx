import Link from 'next/link';
import type { ReactNode } from 'react';
import { highlight } from '../lib/highlight';
import { stageLabels, type Stage } from '../data/projects';

export const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function Status({ stage }: { stage: Stage }) {
  return <span className={`status status-${stage}`}>{stageLabels[stage]}</span>;
}

export function Tags({ items, label = 'Technologies' }: { items: readonly string[]; label?: string }) {
  return <ul className="tags" aria-label={label}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function SectionHead({ eyebrow, title, children, id }: { eyebrow: string; title: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <div className="section-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export function PageHead({ eyebrow, title, children, back }: { eyebrow: string; title: ReactNode; children?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <header className="page-head wrap">
      {back && <Link className="back-link" href={back.href}>← {back.label}</Link>}
      <p className="eyebrow" style={{ marginTop: back ? '1.6rem' : 0 }}>{eyebrow}</p>
      <h1>{title}</h1>
      {children && <div className="lede">{children}</div>}
    </header>
  );
}

export function Code({ code, file, href }: { code: string; file?: string; href?: string }) {
  return (
    <figure className="code">
      {(file || href) && (
        <figcaption className="code-bar" style={{ marginTop: 0 }}>
          <span>{file}</span>
          {href && <a href={href} {...external}>View source ↗</a>}
        </figcaption>
      )}
      <pre tabIndex={0}><code>{highlight(code).map((token, index) => token.kind ? <span key={index} className={`tok-${token.kind}`}>{token.text}</span> : token.text)}</code></pre>
    </figure>
  );
}

export function Story({ steps }: { steps: readonly (readonly [string, ReactNode])[] }) {
  return <dl className="story">{steps.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}</dl>;
}

export function Arrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
}

export function ExternalIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3h7v7M13 3 4 12" /></svg>;
}
