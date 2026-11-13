import Link from 'next/link';
import { PageHead } from '../components/ui';

export default function NotFound() {
  return (
    <>
      <PageHead eyebrow="404" title="That page doesn’t exist.">
        It may have moved in the November 2026 redesign. Try the <Link href="/work/">work index</Link>, or press <kbd>Ctrl</kbd> <kbd>K</kbd> to search.
      </PageHead>
      <div className="wrap" style={{ paddingBottom: '5rem' }}><Link className="btn btn-primary" href="/">Go home</Link></div>
    </>
  );
}
