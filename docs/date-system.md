# How dates work on this site

Every date on the site (employment, education, project milestones, "Present") is computed from one set of canonical records, not typed into page text. This page explains how, and why the site can't drift out of date between deploys.

## Canonical records

Dated facts live in `data/timeline.ts`. Each one stores a **partial date** string at the precision its source supports:

| Stored value | Precision | Meaning |
| --- | --- | --- |
| `"2026"` | year | Some time in 2026 |
| `"2024-06"` | month | Some day in June 2024 |
| `"2026-10-24"` | day | That exact day |
| `null` | unknown | No reliable date; shown with a label instead |

Nothing in the code invents more precision than the record holds. A month-precision start is never turned into the 1st of the month, and a year-precision date never yields a month count. `parsePartialDate` rejects malformed or impossible dates (for example `2025-02-29`), so a typo fails the test suite and the build.

## "Today"

`civilToday(timeZone, now)` resolves the current wall-calendar date in **America/Los_Angeles** using `Intl.DateTimeFormat`, so the answer doesn't depend on the visitor's zone or the build server's zone. At 11 p.m. in Sacramento on the last day of a month, every visitor sees that month as current, even if it is already the next day in UTC.

## Durations

`measureDuration(start, end, today)` works on civil dates with calendar arithmetic (no dividing milliseconds by an average month length):

- **Month precision, ongoing** (e.g. Walmart, started June 2024): counts *completed* months. The role doesn't count a month until that month has fully passed.
- **Month precision, ended** (e.g. Target, Nov 2023 – Jan 2024): inclusive of both months, so it reads "3 months".
- **Year precision**: whole years only.
- **Day precision**: exact years, months and days, with month-end clamping (Jan 31 + 1 month = Feb 28 or 29).
- **Start in the future**: status `upcoming`, shown as "Starts …" rather than a negative duration.
- **No start**: status `unknown`; the label from the record is shown.

`formatDuration` turns the result into text such as "2 years, 5 months" or "Less than a month".

## Static HTML and the browser

The site is a static export, so the HTML is fixed at build time. To avoid stale text and React hydration mismatches:

1. At build time each date renders a **stable** form that doesn't depend on today (e.g. "Jun 2024 – Present"). The server and the first client render produce identical markup.
2. After hydration, `useCivilToday` (in `components/time/useCivilToday.ts`) supplies today's date and the component switches to the **live** form, adding the computed duration.
3. The hook re-checks when the tab becomes visible, when the window regains focus, and at most hourly while the page stays open (`msUntilNextCheck`), so a page left open across midnight or a month boundary updates itself.
4. Every value renders inside a `<time>` element with a machine-readable `dateTime` attribute at the record's own precision.

The deploy workflow also rebuilds monthly, which refreshes the static text for visitors with JavaScript disabled.

## Tests

`lib/time/dates.test.ts` covers leap years, month-end clamping, month and year boundaries, the Los Angeles zone around midnight UTC, a daylight-saving changeover, future and unknown starts, and the month-change behaviour of ongoing roles. They run in CI with `npm test`.

## Changing a date

Edit the record in `data/timeline.ts` and run `npm run verify`. Don't write a duration or "X years" into page copy; use `<LiveDuration>` or `<LiveRange>` so it stays correct.
