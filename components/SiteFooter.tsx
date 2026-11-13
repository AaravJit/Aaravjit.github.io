import Link from 'next/link';
import { profile } from '../data/profile';
import { external } from './ui';
import { LiveYear } from './time/Live';

const buildYear = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <p>© <LiveYear buildYear={buildYear} /> Aarav Jit. Static site built with Next.js, deployed to GitHub Pages. <a href={profile.portfolioRepo} {...external}>Source</a>.</p>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/skills/">Skills</Link>
          <Link href="/recruiters/">Recruiters</Link>
          <a href={profile.github} {...external}>GitHub</a>
          <a href={profile.linkedin} {...external}>LinkedIn</a>
        </nav>
      </div>
    </footer>
  );
}
