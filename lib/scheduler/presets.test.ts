import { describe, expect, it } from 'vitest';
import { controlRanges, presets } from './presets';
import { DEFAULT_CONFIG, validateConfig } from './simulate';

describe('Lab presets', () => {
  it('fit inside every slider so the controls show the running values', () => {
    for (const preset of presets) {
      const config = { ...DEFAULT_CONFIG, ...preset.config };
      for (const [key, range] of Object.entries(controlRanges)) {
        const value = config[key as keyof typeof controlRanges];
        expect(value, `${preset.name}: ${key}`).toBeGreaterThanOrEqual(range.min);
        expect(value, `${preset.name}: ${key}`).toBeLessThanOrEqual(range.max);
      }
    }
  });
  it('are valid simulation configs', () => {
    for (const preset of presets) expect(validateConfig({ ...DEFAULT_CONFIG, ...preset.config }), preset.name).toEqual([]);
  });
});
