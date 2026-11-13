import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, simulate } from './simulate';

/**
 * The engineering note /notes/retries-and-backoff-in-a-simulator/ quotes these results.
 * If the model changes, this test fails so the note is updated instead of going stale.
 */
describe('numbers quoted in the write-up', () => {
  const overloaded = { ...DEFAULT_CONFIG, workers: 2, arrivalRate: 24, failureRate: 0.05 };

  it('shortest-first: lower median, worse p99 on the Overloaded preset', () => {
    const fifo = simulate({ ...overloaded, strategy: 'fifo' }).metrics;
    const sjf = simulate({ ...overloaded, strategy: 'sjf' }).metrics;
    expect(fifo.latencyP50 / 1000).toBeCloseTo(3.4, 1);
    expect(sjf.latencyP50 / 1000).toBeCloseTo(0.45, 1);
    expect(fifo.latencyP99 / 1000).toBeCloseTo(8.8, 1);
    expect(sjf.latencyP99 / 1000).toBeCloseTo(10.7, 1);
  });

  it('four to eight workers on the default workload', () => {
    const four = simulate(DEFAULT_CONFIG).metrics;
    const eight = simulate({ ...DEFAULT_CONFIG, workers: 8 }).metrics;
    expect(Math.round(four.latencyP50 / 10) * 10).toBe(410);
    expect(Math.round(eight.latencyP50 / 10) * 10).toBe(190);
    expect(Math.round(four.throughput)).toBe(16);
    expect(Math.round(eight.throughput)).toBe(18);
  });

  it('dead letters by attempt limit at 40% failure', () => {
    const dead = [2, 3, 4].map((maxAttempts) => simulate({ ...DEFAULT_CONFIG, failureRate: 0.4, maxAttempts }).metrics.deadLettered);
    expect(dead).toEqual([25, 5, 1]);
  });
});
