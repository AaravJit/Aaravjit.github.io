'use client';

import { useState, type MouseEvent } from 'react';
import type { FocusKey } from '../../data/resume';
import { variantForFocus } from '../../lib/focus';
import { useFocus } from './useFocus';

const options: { key: FocusKey | null; label: string }[] = [
  { key: null, label: 'General' },
  ...(['it', 'systems', 'software', 'security'] as const).map((key) => ({ key, label: shortLabel(key) })),
];

function shortLabel(key: FocusKey) {
  return { it: 'IT support', systems: 'Systems', software: 'Software', security: 'Cybersecurity' }[key];
}

/**
 * Lets a visitor change the home page's emphasis. Each option is a real link (/?focus=…), so it
 * can be opened in a new tab or shared; a plain click updates the page in place.
 */
export default function FocusSelector() {
  const [focus, setFocus] = useFocus();
  const [message, setMessage] = useState('');

  const onClick = (key: FocusKey | null) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setFocus(key);
    setMessage(key ? `Showing the ${variantForFocus(key).label} emphasis.` : 'Showing the general portfolio.');
  };

  return (
    <div className="focus-selector">
      <nav aria-label="Portfolio emphasis by role">
        <span className="focus-label" id="focus-label">View as</span>
        <ul aria-labelledby="focus-label">
          {options.map(({ key, label }) => (
            <li key={key ?? 'general'}>
              <a href={key ? `/?focus=${key}` : '/'} aria-current={focus === key ? 'true' : undefined} onClick={onClick(key)}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="sr-only" role="status" aria-live="polite">{message}</p>
    </div>
  );
}

