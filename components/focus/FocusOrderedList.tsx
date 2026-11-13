'use client';

import type { ReactNode } from 'react';
import { orderProjects } from '../../lib/focus';
import { useFocus } from './useFocus';

/** Renders server-rendered items in the order the current focus calls for. */
export default function FocusOrderedList({ items, general, className }: { items: Record<string, ReactNode>; general: readonly string[]; className?: string }) {
  const [focus] = useFocus();
  const order = orderProjects(general, focus, Object.keys(items));
  return <div className={className}>{order.map((slug) => <div key={slug} className="contents">{items[slug]}</div>)}</div>;
}
