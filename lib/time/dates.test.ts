import { describe, expect, it } from 'vitest';
import {
  addMonthsClamped,
  civilToday,
  describeRange,
  diffCalendar,
  formatDuration,
  formatPartialDate,
  measureDuration,
  msUntilNextCheck,
  parsePartialDate,
  precisionOf,
  relativeDays,
  toDateTimeAttribute,
} from './dates';

const d = (year: number, month: number, day: number) => ({ year, month, day });

describe('parsePartialDate', () => {
  it('parses each precision', () => {
    expect(parsePartialDate('2024')).toEqual({ year: 2024, month: undefined, day: undefined });
    expect(precisionOf(parsePartialDate('2024-06'))).toBe('month');
    expect(precisionOf(parsePartialDate('2024-02-29'))).toBe('day');
  });

  it('rejects impossible or malformed dates', () => {
    expect(() => parsePartialDate('2023-02-29')).toThrow();
    expect(() => parsePartialDate('2024-13')).toThrow();
    expect(() => parsePartialDate('June 2024')).toThrow();
    expect(() => parsePartialDate('2024-6')).toThrow();
  });

  it('round-trips to a <time> attribute without adding precision', () => {
    expect(toDateTimeAttribute(parsePartialDate('2024-06'))).toBe('2024-06');
    expect(toDateTimeAttribute(parsePartialDate('2026'))).toBe('2026');
  });

  it('formats without inventing a day', () => {
    expect(formatPartialDate(parsePartialDate('2024-06'))).toBe('June 2024');
    expect(formatPartialDate(parsePartialDate('2024-06'), 'short')).toBe('Jun 2024');
    expect(formatPartialDate(parsePartialDate('2024-06-03'))).toBe('June 3, 2024');
  });
});

describe('calendar arithmetic', () => {
  it('clamps month addition to the end of the month', () => {
    expect(addMonthsClamped(d(2026, 1, 31), 1)).toEqual(d(2026, 2, 28));
    expect(addMonthsClamped(d(2024, 1, 31), 1)).toEqual(d(2024, 2, 29));
    expect(addMonthsClamped(d(2025, 11, 30), 3)).toEqual(d(2026, 2, 28));
    expect(addMonthsClamped(d(2026, 3, 15), -3)).toEqual(d(2025, 12, 15));
  });

  it('handles leap-day anniversaries', () => {
    expect(diffCalendar(d(2024, 2, 29), d(2025, 2, 28))).toEqual({ years: 1, months: 0, days: 0 });
    expect(diffCalendar(d(2024, 2, 29), d(2025, 2, 27))).toEqual({ years: 0, months: 11, days: 29 });
    expect(diffCalendar(d(2024, 2, 29), d(2028, 2, 29))).toEqual({ years: 4, months: 0, days: 0 });
  });

  it('handles month boundaries', () => {
    expect(diffCalendar(d(2026, 1, 31), d(2026, 2, 28))).toEqual({ years: 0, months: 1, days: 0 });
    expect(diffCalendar(d(2026, 1, 31), d(2026, 3, 1))).toEqual({ years: 0, months: 1, days: 1 });
    expect(diffCalendar(d(2025, 12, 31), d(2026, 1, 1))).toEqual({ years: 0, months: 0, days: 1 });
    expect(diffCalendar(d(2026, 5, 10), d(2026, 5, 10))).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('refuses a reversed range', () => {
    expect(() => diffCalendar(d(2026, 2, 1), d(2026, 1, 1))).toThrow();
  });
});

describe('civilToday and time zones', () => {
  it('resolves the date in Los Angeles, not UTC', () => {
    // 03:00 UTC on Nov 14 is still 7 PM on Nov 13 in Pacific Standard Time.
    expect(civilToday('America/Los_Angeles', new Date('2026-11-14T03:00:00Z'))).toEqual(d(2026, 11, 13));
    expect(civilToday('UTC', new Date('2026-11-14T03:00:00Z'))).toEqual(d(2026, 11, 14));
  });

  it('rolls over exactly at local midnight across a DST change', () => {
    // US DST began 2026-03-08 at 2 AM PST (10:00 UTC). Local midnight Mar 9 PDT is 07:00 UTC.
    expect(civilToday('America/Los_Angeles', new Date('2026-03-09T06:59:59Z'))).toEqual(d(2026, 3, 8));
    expect(civilToday('America/Los_Angeles', new Date('2026-03-09T07:00:00Z'))).toEqual(d(2026, 3, 9));
  });

  it('schedules the next check no later than an hour away', () => {
    const at2359 = new Date('2026-11-14T07:59:00Z'); // 11:59 PM PST Nov 13
    expect(msUntilNextCheck('America/Los_Angeles', at2359)).toBe(61_000);
    expect(msUntilNextCheck('America/Los_Angeles', new Date('2026-11-13T20:00:00Z'))).toBe(3_600_000);
  });
});

describe('measureDuration', () => {
  const today = d(2026, 11, 13);

  it('counts an ongoing month-precision role in completed months', () => {
    const duration = measureDuration(parsePartialDate('2024-06'), null, today);
    expect(duration).toMatchObject({ status: 'ongoing', years: 2, months: 5, days: null, precision: 'month' });
    expect(formatDuration(duration)).toBe('2 years, 5 months');
  });

  it('counts both months of an ended month-precision range', () => {
    const duration = measureDuration(parsePartialDate('2023-11'), parsePartialDate('2024-01'), today);
    expect(formatDuration(duration)).toBe('3 months');
  });

  it('never reports days when only a month is known', () => {
    const duration = measureDuration(parsePartialDate('2026-11'), null, today);
    expect(duration.days).toBeNull();
    expect(formatDuration(duration)).toBe('Less than a month');
  });

  it('reports days only for day-precision records', () => {
    const duration = measureDuration(parsePartialDate('2026-11-01'), null, today);
    expect(formatDuration(duration)).toBe('12 days');
    expect(formatDuration(measureDuration(parsePartialDate('2026-11-13'), null, today))).toBe('Started today');
  });

  it('includes the last day of an ended day-precision range', () => {
    expect(formatDuration(measureDuration(parsePartialDate('2026-07-29'), parsePartialDate('2026-07-31'), today))).toBe('3 days');
  });

  it('claims nothing below a year for year-precision records', () => {
    expect(formatDuration(measureDuration(parsePartialDate('2026'), null, today))).toBeNull();
    expect(formatDuration(measureDuration(parsePartialDate('2024'), null, today))).toBe('2 years');
  });

  it('treats a future start as upcoming', () => {
    const duration = measureDuration(parsePartialDate('2027-01'), null, today);
    expect(duration.status).toBe('upcoming');
    expect(formatDuration(duration)).toBeNull();
  });

  it('treats a missing start as unknown', () => {
    expect(measureDuration(null, null, today).status).toBe('unknown');
  });

  it('changes value when the calendar month changes', () => {
    const start = parsePartialDate('2024-06');
    expect(formatDuration(measureDuration(start, null, d(2026, 11, 30)))).toBe('2 years, 5 months');
    expect(formatDuration(measureDuration(start, null, d(2026, 12, 1)))).toBe('2 years, 6 months');
    expect(formatDuration(measureDuration(start, null, d(2027, 6, 1)))).toBe('3 years');
  });
});

describe('describeRange', () => {
  const today = d(2026, 11, 13);

  it('gives a stable fallback that does not depend on today', () => {
    expect(describeRange({ start: '2024-06', end: null }, today)).toEqual({
      range: 'Jun 2024 – Present', stable: 'Since Jun 2024', live: '2 years, 5 months', status: 'ongoing',
    });
  });

  it('uses a label instead of a fabricated month', () => {
    const result = describeRange({ start: '2026', startLabel: 'Fall 2026', end: null }, today);
    expect(result.range).toBe('Fall 2026 – Present');
    expect(result.live).toBeNull();
  });

  it('labels unknown and upcoming records honestly', () => {
    expect(describeRange({ start: null, end: null }, today).stable).toBe('Date not verified');
    expect(describeRange({ start: '2027-01', end: null }, today).live).toBe('Starts Jan 2027');
  });
});

describe('relativeDays', () => {
  const now = new Date('2026-11-13T20:00:00Z');
  it('uses calendar days in the site time zone', () => {
    expect(relativeDays(new Date('2026-11-13T09:00:00Z'), now)).toBe('today');
    expect(relativeDays(new Date('2026-11-13T07:30:00Z'), now)).toBe('yesterday'); // 11:30 PM Nov 12 PST
    expect(relativeDays(new Date('2026-10-28T18:00:00Z'), now)).toBe('16 days ago');
    expect(relativeDays(new Date('2026-07-31T18:00:00Z'), now)).toBe('3 months ago');
    expect(relativeDays(new Date('2025-01-02T18:00:00Z'), now)).toBe('1 year ago');
  });
});
