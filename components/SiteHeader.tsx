'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav } from '../data/routes';
import CommandPalette from './CommandPalette';
import ThemeToggle from './ThemeToggle';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      } else if (event.key === '/' && !paletteOpen && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement)) {
        event.preventDefault();
        setPaletteOpen(true);
      } else if (event.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, paletteOpen]);

  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href.replace(/\/$/, '')));

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" href="/" aria-label="Aarav Jit, home">
          <span className="brand-mark" aria-hidden="true">AJ</span>
          <span>Aarav Jit</span>
        </Link>
        <nav aria-label="Primary">
          <div id="primary-nav" className={`nav-links${open ? ' open' : ''}`}>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>
            ))}
            <Link href="/recruiters/" aria-current={isCurrent('/recruiters/') ? 'page' : undefined} onClick={() => setOpen(false)}>Résumé</Link>
          </div>
        </nav>
        <div className="nav-tools">
          <button type="button" className="icon-btn search-btn" onClick={() => setPaletteOpen(true)} aria-haspopup="dialog" aria-label="Search and jump (Control K)">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
            <span className="label">Jump to</span>
            <kbd>Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <button ref={menuButton} type="button" className="icon-btn menu-btn" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((value) => !value)}>
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{open ? <path d="m4 4 8 8M12 4l-8 8" /> : <path d="M2.5 5h11M2.5 11h11" />}</svg>
          </button>
        </div>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
