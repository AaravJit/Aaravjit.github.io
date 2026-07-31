import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aarav Jit | IT Support & Cybersecurity Student',
  description:
    'Portfolio of Aarav Jit, an entry-level IT support and cybersecurity student with hands-on experience in Linux, Windows, troubleshooting, networking fundamentals, Bash, Git, and system configuration.',
  metadataBase: new URL('https://aaravjit.github.io'),
  openGraph: {
    title: 'Aarav Jit | IT Support & Cybersecurity Student',
    description:
      'Portfolio of Aarav Jit, an entry-level IT support and cybersecurity student with hands-on experience in Linux, Windows, troubleshooting, networking fundamentals, Bash, Git, and system configuration.',
    url: 'https://aaravjit.github.io',
    siteName: 'Aarav Jit Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Aarav Jit | IT Support & Cybersecurity Student',
    description:
      'Portfolio of Aarav Jit, an entry-level IT support and cybersecurity student with hands-on experience in Linux, Windows, troubleshooting, networking fundamentals, Bash, Git, and system configuration.',
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
