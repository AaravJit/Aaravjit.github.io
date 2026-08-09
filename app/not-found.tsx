import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: '1rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Page Not Found</h1>
      <p style={{ color: 'var(--secondary)' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="button primary">
        Go Home
      </Link>
    </div>
  );
}
