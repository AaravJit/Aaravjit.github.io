import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

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
    images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit — Software, Linux and Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aarav Jit | Software, Linux & Systems',
    description:
      'Cybersecurity student with a computer science foundation building software, Linux environments, and hands-on systems projects.',
    images: ['/social-preview.png'],
  },
  alternates: { canonical: 'https://aaravjit.github.io/' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
