import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import { themeScript } from '../components/ThemeToggle';
import { profile } from '../data/profile';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono', weight: ['400', '500'] });

const description = 'Aarav Jit builds software and the systems underneath it: Linux installers with rollback, cloud-backed apps with database-enforced security, and tested engineering experiments. Cybersecurity student at American River College.';

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: { default: 'Aarav Jit | Software, Systems, Infrastructure', template: '%s | Aarav Jit' },
  description,
  applicationName: 'Aarav Jit Portfolio',
  authors: [{ name: profile.name, url: profile.url }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: profile.url,
    siteName: 'Aarav Jit',
    title: 'Aarav Jit | Software, Systems, Infrastructure',
    description,
    images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit: Software, Systems, Infrastructure' }],
  },
  twitter: { card: 'summary_large_image', title: 'Aarav Jit | Software, Systems, Infrastructure', description, images: ['/social-preview.png'] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0e' },
    { media: '(prefers-color-scheme: light)', color: '#fafaf8' },
  ],
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: profile.url,
  sameAs: [profile.github, profile.linkedin],
  address: { '@type': 'PostalAddress', addressLocality: 'Sacramento', addressRegion: 'CA', addressCountry: 'US' },
  knowsAbout: ['Linux', 'TypeScript', 'PostgreSQL', 'Row-level security', 'Next.js', 'Bash', 'Python', 'Networking', 'Cybersecurity'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
