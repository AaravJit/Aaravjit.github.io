'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { paletteExtras, pages } from '../data/routes';

type Item = { href: string; title: string; group: string; external?: boolean };
const items: Item[] = [...pages, ...paletteExtras];

/** Subsequence match scored by contiguity and word starts. Returns -1 for no match. */
export function score(query: string, text: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const t = text.toLowerCase();
  if (t.includes(q)) return 100 - t.indexOf(q);
  let ti = 0;
  let total = 0;
  let streak = 0;
  for (const char of q) {
    if (char === ' ') continue;
    const found = t.indexOf(char, ti);
    if (found === -1) return -1;
    streak = found === ti ? streak + 1 : 0;
    total += 1 + streak + (found === 0 || t[found - 1] === ' ' ? 2 : 0);
    ti = found + 1;
  }
  return total;
}

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((item) => ({ item, s: Math.max(score(query, item.title), score(query, item.group) - 20) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.item);
  }, [query]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => input.current?.focus());
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  const go = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    if (item.external) window.open(item.href, '_blank', 'noopener,noreferrer');
    else router.push(item.href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(results.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(results[active]);
    }
  };

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, listId]);

  return (
    <dialog ref={dialog} className="palette" aria-label="Search pages and jump" onClose={onClose} onClick={(event) => { if (event.target === dialog.current) onClose(); }}>
      <div className="palette-input">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
        <input
          ref={input}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActive(0); }}
          onKeyDown={onKeyDown}
          placeholder="Jump to a project, note, decision or résumé…"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
          aria-autocomplete="list"
          aria-label="Search"
        />
      </div>
      <ul id={listId} role="listbox" aria-label="Results">
        {results.length === 0 && <li className="empty">No matches.</li>}
        {results.map((item, index) => (
          <li key={`${item.group}-${item.href}`} id={`${listId}-${index}`} role="option" aria-selected={index === active} onMouseMove={() => setActive(index)} onClick={() => go(item)}>
            <span>{item.title}{item.external ? ' ↗' : ''}</span>
            <span className="group">{item.group}</span>
          </li>
        ))}
      </ul>
      <div className="palette-foot" aria-hidden="true"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
    </dialog>
  );
}
