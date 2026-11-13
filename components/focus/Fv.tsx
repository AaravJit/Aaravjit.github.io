import type { ReactNode } from 'react';
import type { FocusKey } from '../../data/resume';

/**
 * Content for one view of the home page. CSS shows only the block that matches <html data-focus>
 * (set from the URL before first paint), so every view is in the static HTML and switching views
 * never re-renders or flashes. Hidden blocks are display:none, so assistive tech skips them too.
 */
export default function Fv({ view, as: Tag = 'div', className, children }: { view: FocusKey | 'general'; as?: 'div' | 'span' | 'p'; className?: string; children: ReactNode }) {
  return <Tag className={`fv fv-${view}${className ? ` ${className}` : ''}`}>{children}</Tag>;
}
