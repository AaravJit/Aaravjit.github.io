import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aarav Jit — Reliable Team Member & Software Problem Solver',
  description:
    'Reliable team member focused on accuracy, customer service, and on-time results. Open to operations, service, logistics, and tech roles.',
  metadataBase: new URL('https://aaravjit.github.io'),
  openGraph: {
    title: 'Aarav Jit — Reliable Team Member & Software Problem Solver',
    description:
      'Reliable team member focused on accuracy, customer service, and on-time results. Open to operations, service, logistics, and tech roles.',
    url: 'https://aaravjit.github.io',
    siteName: 'Aarav Jit Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Aarav Jit — Reliable Team Member & Software Problem Solver',
    description:
      'Reliable team member focused on accuracy, customer service, and on-time results. Open to operations, service, logistics, and tech roles.',
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
