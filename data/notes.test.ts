import { describe, expect, it } from 'vitest';
import { civilToday, compareCivil, parsePartialDate } from '../lib/time/dates';
import { notes } from './notes';

describe('engineering notes', () => {
  const today = civilToday();
  it('never carries a publication date in the future', () => {
    for (const note of notes) {
      if (note.published === null) continue;
      const d = parsePartialDate(note.published);
      expect(d.day, `${note.slug} published needs a full date`).toBeDefined();
      expect(compareCivil({ year: d.year, month: d.month!, day: d.day! }, today), note.slug).toBeLessThanOrEqual(0);
    }
  });
  it('records when each note was written', () => {
    for (const note of notes) expect(() => parsePartialDate(note.written)).not.toThrow();
  });
});
