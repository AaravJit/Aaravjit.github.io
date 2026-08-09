import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aarav Jit | Computer Science, Linux & Software',
  description:
    'Portfolio of Aarav Jit, a computer science and cybersecurity student building software, Linux environments, automation workflows, and hands-on systems projects.',
  metadataBase: new URL('https://aaravjit.github.io'),
  openGraph: {
    title: 'Aarav Jit | Computer Science, Linux & Software',
    description:
      'Computer science and cybersecurity student building software, Linux environments, automation workflows, and hands-on systems projects.',
    url: 'https://aaravjit.github.io',
    siteName: 'Aarav Jit Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Aarav Jit | Computer Science, Linux & Software',
    description:
      'Computer science and cybersecurity student building software, Linux environments, automation workflows, and hands-on systems projects.',
  },
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
