'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { focusHref, parseFocus } from '../../lib/focus';
import type { FocusKey } from '../../data/resume';

const EVENT = 'focuschange';

const subscribe = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(EVENT, onChange);
  };
};

/** Keeps <html data-focus> (read by CSS) in step with the URL. */
export function applyFocusAttribute(focus: FocusKey | null) {
  if (focus) document.documentElement.dataset.focus = focus;
  else delete document.documentElement.dataset.focus;
}

/**
 * The current role focus from the URL. The server snapshot is null (the general view), so the
 * first client render matches the static HTML; the real value arrives right after hydration.
 */
export function useFocus(): [FocusKey | null, (next: FocusKey | null) => void] {
  const focus = useSyncExternalStore(subscribe, () => parseFocus(window.location.search), () => null);

  useEffect(() => {
    // Covers back/forward and arriving here through client-side navigation.
    applyFocusAttribute(focus);
  }, [focus]);

  const setFocus = useCallback((next: FocusKey | null) => {
    const url = focusHref(next, window.location);
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.pushState(window.history.state, '', url);
    }
    applyFocusAttribute(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [focus, setFocus];
}
