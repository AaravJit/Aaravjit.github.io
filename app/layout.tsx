import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aarav Jit | Software, Linux & Systems',
  description:
    'Portfolio of Aarav Jit, a cybersecurity student with prior computer science coursework building software, Linux environments, and hands-on systems projects.',
  metadataBase: new URL('https://aaravjit.github.io'),
  openGraph: {
    title: 'Aarav Jit | Software, Linux & Systems',
    description:
      'Cybersecurity student with a computer science foundation building software, Linux environments, and hands-on systems projects.',
    url: 'https://aaravjit.github.io',
    siteName: 'Aarav Jit Portfolio',
    type: 'website',
    images: [{ url: '/social-preview.svg', width: 1200, height: 630, alt: 'Aarav Jit — Software, Linux and Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aarav Jit | Software, Linux & Systems',
    description:
      'Cybersecurity student with a computer science foundation building software, Linux environments, and hands-on systems projects.',
    images: ['/social-preview.svg'],
  },
  alternates: { canonical: 'https://aaravjit.github.io/' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
