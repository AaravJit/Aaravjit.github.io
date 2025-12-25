import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aarav Jit — Software Engineer',
  description: 'Software engineer building web applications, automation tools, and AI utilities.',
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
