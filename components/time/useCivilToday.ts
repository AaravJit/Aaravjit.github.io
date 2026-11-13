'use client';

import { useEffect, useState } from 'react';
import { civilToday, msUntilNextCheck, SITE_TIME_ZONE, type CivilDate } from '../../lib/time/dates';

/**
 * The current calendar date in the site time zone, or null during server rendering and the
 * first client render. Returning null first keeps the static HTML and the hydrated HTML
 * identical, so there is no hydration mismatch; date-dependent text appears right after.
 *
 * Re-checks at the next local midnight (in chunks of at most an hour, so DST changes and
 * sleeping laptops self-correct) and whenever the tab becomes visible again.
 */
export function useCivilToday(timeZone: string = SITE_TIME_ZONE): CivilDate | null {
  const [today, setToday] = useState<CivilDate | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const next = civilToday(timeZone);
      setToday((current) => (current && current.year === next.year && current.month === next.month && current.day === next.day ? current : next));
    };
    const schedule = () => {
      timer = setTimeout(() => {
        update();
        schedule();
      }, msUntilNextCheck(timeZone));
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') update();
    };
    update();
    schedule();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', update);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', update);
    };
  }, [timeZone]);

  return today;
}
