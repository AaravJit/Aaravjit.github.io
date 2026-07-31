'use client';

import { useEffect, useState } from 'react';

const links = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['building', 'Roadmap'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['contact', 'Contact'],
] as const;

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = links.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <a href="/#top" className="logo" aria-label="Aarav Jit home">AJ<span>.</span></a>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
          <span className="sr-only">{open ? 'Close' : 'Open'} navigation menu</span>
          <span aria-hidden="true">{open ? '×' : 'Menu'}</span>
        </button>
        <nav id="primary-nav" className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
          {links.map(([id, label]) => (
            <a key={id} href={`/#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a className="nav-resume" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
        </nav>
      </div>
    </header>
  );
}
