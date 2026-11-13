'use client';

import { describeRange, parsePartialDate, relativeDays, toDateTimeAttribute, type DatedRange } from '../../lib/time/dates';
import { useCivilToday } from './useCivilToday';

/**
 * Duration of a dated record, e.g. "2 years, 5 months". The static HTML carries a
 * date-independent fallback ("Since Jun 2024") so it is never stale, then the live value
 * replaces it after hydration.
 */
export function LiveDuration({ record, prefix = '' }: { record: DatedRange; prefix?: string }) {
  const today = useCivilToday();
  const start = record.start ? toDateTimeAttribute(parsePartialDate(record.start)) : undefined;
  if (!today) {
    // Date-independent text. A far-future placeholder only stops the stable text from saying "Starts".
    return <time dateTime={start}>{describeRange(record, { year: 9999, month: 12, day: 31 }).stable}</time>;
  }
  const described = describeRange(record, today);
  return <time dateTime={start} title={described.range}>{described.live ? `${prefix}${described.live}` : described.stable}</time>;
}

/** The current year in the site time zone; falls back to the build year in static HTML. */
export function LiveYear({ buildYear }: { buildYear: number }) {
  const today = useCivilToday();
  return <>{today ? today.year : buildYear}</>;
}

/** "3 days ago" for a real timestamp, with the exact date always available. */
export function RelativeTime({ iso }: { iso: string }) {
  const today = useCivilToday();
  const date = new Date(iso);
  const exact = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  return <time dateTime={iso} title={exact}>{today ? `${relativeDays(date)} · ${exact}` : exact}</time>;
}

/** "Jun 2024 – Present · 2 years, 5 months". The range alone is static; the duration is added live. */
export function LiveRange({ record }: { record: DatedRange }) {
  const today = useCivilToday();
  const start = record.start ? toDateTimeAttribute(parsePartialDate(record.start)) : undefined;
  const fixed = describeRange(record, { year: 9999, month: 12, day: 31 });
  const live = today ? describeRange(record, today).live : null;
  return <><time dateTime={start}>{fixed.range}</time>{live && <span className="live"> · {live}</span>}</>;
}
