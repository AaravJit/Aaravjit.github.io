/**
 * Calendar-aware date utilities for the portfolio.
 *
 * Every dated fact on the site is stored as a partial date string with an
 * explicit precision ("2024", "2024-06" or "2024-06-15"). Nothing here ever
 * invents a more precise date than the record holds: a month-precision start
 * date is never turned into a specific day, and a year-precision date never
 * produces a month count.
 *
 * All arithmetic works on civil (wall-calendar) dates, never on millisecond
 * differences divided by an average month length. "Today" is resolved in a
 * named IANA time zone so the result does not depend on the visitor's or the
 * build machine's local zone.
 */

export const SITE_TIME_ZONE = 'America/Los_Angeles';

export type Precision = 'year' | 'month' | 'day';

/** A date known to year, month, or day precision. Months are 1-12. */
export interface PartialDate {
  year: number;
  month?: number;
  day?: number;
}

/** A full calendar date with no time or zone. Months are 1-12. */
export interface CivilDate {
  year: number;
  month: number;
  day: number;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

/** Parses "YYYY", "YYYY-MM" or "YYYY-MM-DD". Throws on anything else or on an impossible date. */
export function parsePartialDate(value: string): PartialDate {
  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value);
  if (!match) throw new Error(`Invalid partial date "${value}". Use YYYY, YYYY-MM or YYYY-MM-DD.`);
  const year = Number(match[1]);
  const month = match[2] === undefined ? undefined : Number(match[2]);
  const day = match[3] === undefined ? undefined : Number(match[3]);
  if (month !== undefined && (month < 1 || month > 12)) throw new Error(`Invalid month in "${value}".`);
  if (day !== undefined && month !== undefined && (day < 1 || day > daysInMonth(year, month))) {
    throw new Error(`Invalid day in "${value}".`);
  }
  return { year, month, day };
}

export function precisionOf(date: PartialDate): Precision {
  if (date.day !== undefined) return 'day';
  if (date.month !== undefined) return 'month';
  return 'year';
}

/** The ISO-style string a <time dateTime> attribute accepts, at the date's own precision. */
export function toDateTimeAttribute(date: PartialDate): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  if (date.month === undefined) return String(date.year);
  if (date.day === undefined) return `${date.year}-${pad(date.month)}`;
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

export function formatPartialDate(date: PartialDate, style: 'long' | 'short' = 'long'): string {
  if (date.month === undefined) return String(date.year);
  const name = style === 'long' ? MONTHS[date.month - 1] : MONTHS[date.month - 1].slice(0, 3);
  if (date.day === undefined) return `${name} ${date.year}`;
  return `${name} ${date.day}, ${date.year}`;
}

/** The calendar date it currently is in `timeZone` at instant `now`. */
export function civilToday(timeZone: string = SITE_TIME_ZONE, now: Date = new Date()): CivilDate {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

export function compareCivil(a: CivilDate, b: CivilDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

function dayNumber(date: CivilDate): number {
  return Date.UTC(date.year, date.month - 1, date.day) / 86_400_000;
}

/** Adds whole months, clamping to the end of the target month (Jan 31 + 1 month = Feb 28 or 29). */
export function addMonthsClamped(date: CivilDate, months: number): CivilDate {
  const index = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

export interface CalendarDiff {
  years: number;
  months: number;
  days: number;
}

/**
 * Calendar difference from `start` to `end` (end >= start).
 * Whole months are counted with month-end clamping, so Feb 29, 2024 to
 * Feb 28, 2025 is exactly one year and Jan 31 to Feb 28 is one month.
 */
export function diffCalendar(start: CivilDate, end: CivilDate): CalendarDiff {
  if (compareCivil(end, start) < 0) throw new Error('diffCalendar: end is before start.');
  let months = (end.year - start.year) * 12 + (end.month - start.month);
  if (compareCivil(addMonthsClamped(start, months), end) > 0) months -= 1;
  const anchor = addMonthsClamped(start, months);
  return { years: Math.floor(months / 12), months: months % 12, days: dayNumber(end) - dayNumber(anchor) };
}

export type DurationStatus = 'ended' | 'ongoing' | 'upcoming' | 'unknown';

export interface Duration {
  status: DurationStatus;
  /** Null when the precision of the record cannot support a count (for example, a year-only start). */
  years: number | null;
  months: number | null;
  /** Only populated when both ends are known to the day. */
  days: number | null;
  /** The coarser precision of the two ends. */
  precision: Precision | null;
}

const rank: Record<Precision, number> = { year: 0, month: 1, day: 2 };

function coarser(a: Precision, b: Precision): Precision {
  return rank[a] <= rank[b] ? a : b;
}

function truncate(date: CivilDate | PartialDate, precision: Precision): PartialDate {
  if (precision === 'year') return { year: date.year };
  if (precision === 'month') return { year: date.year, month: date.month };
  return { year: date.year, month: date.month, day: date.day };
}

function comparePartial(a: PartialDate, b: PartialDate): number {
  return a.year - b.year || (a.month ?? 0) - (b.month ?? 0) || (a.day ?? 0) - (b.day ?? 0);
}

/**
 * Elapsed time for a dated record.
 *
 * Rules (documented in docs/date-system.md):
 * - Day precision: exact calendar difference; an ended range counts its end day.
 * - Month precision, ended: both months count in full (Nov 2023 – Jan 2024 = 3 months),
 *   matching how employment ranges are usually read.
 * - Month precision, ongoing: whole months from the start month to the current month;
 *   the current, incomplete month is not counted (Jun 2024 → mid Nov 2026 = 2 years, 5 months).
 * - Year precision: whole years only, and nothing under a year is claimed.
 * - A start after today is "upcoming" and has no duration.
 */
export function measureDuration(start: PartialDate | null, end: PartialDate | null, today: CivilDate): Duration {
  const none = (status: DurationStatus, precision: Precision | null = null): Duration => ({ status, years: null, months: null, days: null, precision });
  if (!start) return none('unknown');

  const ongoing = end === null;
  const precision = ongoing ? precisionOf(start) : coarser(precisionOf(start), precisionOf(end));
  if (comparePartial(truncate(start, precisionOf(start)), truncate(today, precisionOf(start))) > 0) return none('upcoming', precision);
  const status: DurationStatus = ongoing ? 'ongoing' : 'ended';
  const endpoint: PartialDate = ongoing ? today : end;
  if (!ongoing && comparePartial(truncate(endpoint, precision), truncate(start, precision)) < 0) {
    throw new Error('measureDuration: end is before start.');
  }

  if (precision === 'year') {
    const years = endpoint.year - start.year + (ongoing ? 0 : 1);
    return { status, years: years >= 1 ? years : null, months: null, days: null, precision };
  }

  if (precision === 'month') {
    const total = (endpoint.year - start.year) * 12 + ((endpoint.month ?? 1) - (start.month ?? 1)) + (ongoing ? 0 : 1);
    return { status, years: Math.floor(total / 12), months: total % 12, days: null, precision };
  }

  const startDay = start as CivilDate;
  let endDay = endpoint as CivilDate;
  if (!ongoing) {
    // An ended range includes its last day.
    const next = new Date(Date.UTC(endDay.year, endDay.month - 1, endDay.day + 1));
    endDay = { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: next.getUTCDate() };
  }
  const diff = diffCalendar(startDay, endDay);
  return { status, years: diff.years, months: diff.months, days: diff.days, precision };
}

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

/** "2 years, 5 months", "1 year", "3 months", "12 days", or null when nothing can be claimed. */
export function formatDuration(duration: Duration): string | null {
  if (duration.status === 'unknown' || duration.status === 'upcoming' || duration.years === null) return null;
  const parts: string[] = [];
  if (duration.years) parts.push(plural(duration.years, 'year'));
  if (duration.months) parts.push(plural(duration.months, 'month'));
  if (parts.length === 0) {
    if (duration.precision === 'day' && duration.days !== null) return duration.days === 0 ? 'Started today' : plural(duration.days, 'day');
    return 'Less than a month';
  }
  return parts.join(', ');
}

export interface DatedRange {
  start: string | null;
  end: string | null;
  /** Human label for an imprecise start, such as "Fall 2026". Shown instead of the formatted start. */
  startLabel?: string;
  endLabel?: string;
}

export interface DescribedRange {
  range: string;
  /** Text that does not depend on today's date. Safe to render at build time. */
  stable: string;
  /** Text that depends on today's date, or null when no honest duration exists. */
  live: string | null;
  status: DurationStatus;
}

export function describeRange(record: DatedRange, today: CivilDate): DescribedRange {
  const start = record.start ? parsePartialDate(record.start) : null;
  const end = record.end ? parsePartialDate(record.end) : null;
  const startText = record.startLabel ?? (start ? formatPartialDate(start, 'short') : 'Date not verified');
  const endText = record.endLabel ?? (end ? formatPartialDate(end, 'short') : 'Present');
  const duration = measureDuration(start, end, today);
  const range = start && end && toDateTimeAttribute(start) === toDateTimeAttribute(end) ? startText : `${startText} – ${endText}`;

  if (duration.status === 'upcoming') return { range, stable: `Starts ${startText}`, live: `Starts ${startText}`, status: duration.status };
  if (duration.status === 'unknown') return { range, stable: 'Date not verified', live: null, status: duration.status };
  const stable = duration.status === 'ongoing' ? `Since ${startText}` : range;
  return { range, stable, live: formatDuration(duration), status: duration.status };
}

/** Milliseconds until the next calendar day starts in `timeZone`, capped at one hour so DST shifts self-correct. */
export function msUntilNextCheck(timeZone: string = SITE_TIME_ZONE, now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(now);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const elapsed = ((get('hour') * 60 + get('minute')) * 60 + get('second')) * 1000 + now.getMilliseconds();
  const untilMidnight = 86_400_000 - elapsed + 1_000;
  return Math.max(1_000, Math.min(untilMidnight, 3_600_000));
}

/** Relative wording for a past instant, e.g. "3 days ago". Calendar-day based in the site zone. */
export function relativeDays(then: Date, now: Date = new Date(), timeZone: string = SITE_TIME_ZONE): string {
  const a = civilToday(timeZone, then);
  const b = civilToday(timeZone, now);
  const days = dayNumber(b) - dayNumber(a);
  if (days < 0) return 'in the future';
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 31) return `${days} days ago`;
  const diff = diffCalendar(a, b);
  const months = diff.years * 12 + diff.months;
  if (months < 12) return `${plural(months, 'month')} ago`;
  return `${plural(diff.years, 'year')} ago`;
}
