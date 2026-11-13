import { describe, expect, it } from 'vitest';
import { backoffDelay, DEFAULT_CONFIG, generateJobs, hash01, mulberry32, percentile, simulate, validateConfig, type SimConfig } from './simulate';

const config = (overrides: Partial<SimConfig> = {}): SimConfig => ({ ...DEFAULT_CONFIG, ...overrides });

describe('building blocks', () => {
  it('mulberry32 is deterministic per seed and stays in [0, 1)', () => {
    const a = mulberry32(7);
    const b = mulberry32(7);
    const values = Array.from({ length: 1000 }, () => a());
    expect(values).toEqual(Array.from({ length: 1000 }, () => b()));
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
  });

  it('hash01 is stable and roughly uniform', () => {
    expect(hash01(1, 2, 3)).toBe(hash01(1, 2, 3));
    expect(hash01(1, 2, 3)).not.toBe(hash01(1, 2, 4));
    const samples = Array.from({ length: 20_000 }, (_, i) => hash01(42, i, 1, 3));
    const below = samples.filter((v) => v < 0.25).length / samples.length;
    expect(below).toBeGreaterThan(0.23);
    expect(below).toBeLessThan(0.27);
  });

  it('backoff doubles, caps, and keeps jitter inside its bounds', () => {
    expect([1, 2, 3, 4, 5].map((n) => backoffDelay(n, 100, 1000, 'none', 0.5))).toEqual([100, 200, 400, 800, 1000]);
    expect(backoffDelay(3, 100, 1000, 'full', 0)).toBe(0);
    expect(backoffDelay(3, 100, 1000, 'full', 0.999)).toBeLessThan(400);
    expect(backoffDelay(3, 100, 1000, 'equal', 0)).toBe(200);
    expect(backoffDelay(3, 100, 1000, 'equal', 0.999)).toBeLessThan(400);
    expect(() => backoffDelay(0, 100, 1000, 'none', 0)).toThrow();
  });

  it('percentile uses nearest rank', () => {
    expect(percentile([], 50)).toBe(0);
    expect(percentile([5], 99)).toBe(5);
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 50)).toBe(5);
    expect(percentile([10, 1, 9, 2, 8, 3, 7, 4, 6, 5], 95)).toBe(10);
  });

  it('validates configuration', () => {
    expect(validateConfig(DEFAULT_CONFIG)).toEqual([]);
    expect(validateConfig(config({ workers: 0 }))).toHaveLength(1);
    expect(validateConfig(config({ backoffCapMs: 10, backoffBaseMs: 100 }))).toHaveLength(1);
    expect(() => simulate(config({ jobCount: 0 }))).toThrow();
  });

  it('generates arrivals in order with plausible service times', () => {
    const jobs = generateJobs(config({ jobCount: 500 }));
    for (let i = 1; i < jobs.length; i++) expect(jobs[i].arrival).toBeGreaterThanOrEqual(jobs[i - 1].arrival);
    const median = percentile(jobs.map((j) => j.serviceMs), 50);
    expect(median).toBeGreaterThan(DEFAULT_CONFIG.medianServiceMs * 0.85);
    expect(median).toBeLessThan(DEFAULT_CONFIG.medianServiceMs * 1.15);
  });
});

describe('simulate', () => {
  it('is fully deterministic for a given configuration', () => {
    expect(simulate(config())).toEqual(simulate(config()));
    expect(simulate(config({ seed: 43 })).metrics).not.toEqual(simulate(config()).metrics);
  });

  it('never runs two attempts on one worker at the same time', () => {
    const result = simulate(config({ workers: 3, jobCount: 300 }));
    for (let worker = 0; worker < 3; worker++) {
      const lane = result.attempts.filter((a) => a.worker === worker).sort((a, b) => a.start - b.start);
      for (let i = 1; i < lane.length; i++) expect(lane[i].start).toBeGreaterThanOrEqual(lane[i - 1].end);
    }
  });

  it('never exceeds the worker limit', () => {
    const result = simulate(config({ workers: 2, arrivalRate: 200 }));
    const edges = result.attempts.flatMap((a) => [[a.start, 1], [a.end, -1]] as const).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let running = 0;
    for (const [, delta] of edges) {
      running += delta;
      expect(running).toBeLessThanOrEqual(2);
    }
  });

  it('never starts a job before it arrives or a retry before its backoff ends', () => {
    const result = simulate(config({ failureRate: 0.4, jitter: 'none' }));
    for (const attempt of result.attempts) {
      const job = result.jobs[attempt.job];
      expect(attempt.start).toBeGreaterThanOrEqual(job.arrival);
      if (attempt.attempt > 1) {
        const previous = result.attempts.find((a) => a.job === attempt.job && a.attempt === attempt.attempt - 1)!;
        const minimum = Math.min(DEFAULT_CONFIG.backoffCapMs, DEFAULT_CONFIG.backoffBaseMs * 2 ** (attempt.attempt - 2));
        expect(previous.ok).toBe(false);
        expect(attempt.start).toBeGreaterThanOrEqual(previous.end + minimum - 0.01);
      }
    }
  });

  it('succeeds every job on the first attempt when nothing fails', () => {
    const result = simulate(config({ failureRate: 0 }));
    expect(result.metrics.succeeded).toBe(DEFAULT_CONFIG.jobCount);
    expect(result.metrics.retries).toBe(0);
    expect(result.attempts.every((a) => a.ok)).toBe(true);
  });

  it('dead-letters jobs after maxAttempts failures and accounts for every job', () => {
    const result = simulate(config({ failureRate: 0.9, maxAttempts: 2 }));
    expect(result.metrics.deadLettered).toBeGreaterThan(0);
    expect(result.metrics.succeeded + result.metrics.deadLettered).toBe(DEFAULT_CONFIG.jobCount);
    for (const job of result.jobs) {
      expect(job.attempts).toBeLessThanOrEqual(2);
      if (job.status === 'dead-lettered') expect(job.attempts).toBe(2);
    }
  });

  it('with one worker and FIFO, runs jobs in arrival order', () => {
    const result = simulate(config({ workers: 1, failureRate: 0, strategy: 'fifo' }));
    expect(result.attempts.map((a) => a.job)).toEqual(result.jobs.map((j) => j.id));
  });

  it('keeps failures identical across strategies so comparisons are fair', () => {
    const outcomes = (strategy: SimConfig['strategy']) => simulate(config({ strategy })).attempts
      .map((a) => `${a.job}:${a.attempt}:${a.ok}`).sort();
    expect(outcomes('sjf')).toEqual(outcomes('fifo'));
    expect(outcomes('priority')).toEqual(outcomes('fifo'));
  });

  it('shortest-job-first lowers mean latency on an overloaded queue', () => {
    const overloaded = { failureRate: 0, workers: 2, arrivalRate: 40, jobCount: 300 };
    const fifo = simulate(config({ ...overloaded, strategy: 'fifo' })).metrics;
    const sjf = simulate(config({ ...overloaded, strategy: 'sjf' })).metrics;
    expect(sjf.meanLatency).toBeLessThan(fifo.meanLatency);
  });

  it('priority scheduling serves high-priority jobs faster than low-priority ones under load', () => {
    const result = simulate(config({ failureRate: 0, workers: 2, arrivalRate: 40, jobCount: 300, strategy: 'priority' }));
    const meanFor = (p: number) => {
      const set = result.jobs.filter((j) => j.priority === p);
      return set.reduce((sum, j) => sum + j.finishedAt - j.arrival, 0) / set.length;
    };
    expect(meanFor(3)).toBeLessThan(meanFor(1));
  });

  it('reports utilization between 0 and 1 and consistent counts', () => {
    const { metrics, attempts, jobs } = simulate(config({ workers: 8 }));
    expect(metrics.utilization).toBeGreaterThan(0);
    expect(metrics.utilization).toBeLessThanOrEqual(1);
    expect(metrics.totalAttempts).toBe(attempts.length);
    expect(metrics.retries).toBe(attempts.length - jobs.length);
    expect(metrics.latencyP50).toBeLessThanOrEqual(metrics.latencyP95);
    expect(metrics.latencyP95).toBeLessThanOrEqual(metrics.latencyP99);
  });

  it('jitter spreads retries that would otherwise fire in lockstep', () => {
    // A burst of jobs that all fail once at nearly the same moment.
    const burst = { arrivalRate: 1000, jobCount: 60, workers: 60, failureRate: 0.5, maxAttempts: 3, backoffBaseMs: 400 };
    const retryStarts = (jitter: SimConfig['jitter']) => simulate(config({ ...burst, jitter })).attempts
      .filter((a) => a.attempt === 2).map((a) => a.start);
    const spread = (values: number[]) => Math.max(...values) - Math.min(...values);
    expect(spread(retryStarts('full'))).toBeGreaterThan(spread(retryStarts('none')));
  });
});

describe('shareable URLs', async () => {
  const { configFromSearch, configToSearch } = await import('./url');
  it('round-trips a configuration through the query string', () => {
    const custom = config({ workers: 7, strategy: 'sjf', jitter: 'none', failureRate: 0.25 });
    expect(configFromSearch(configToSearch(custom))).toEqual(custom);
    expect(configToSearch(DEFAULT_CONFIG)).toBe('');
  });
  it('falls back to defaults for invalid or hostile input', () => {
    expect(configFromSearch('?workers=0')).toEqual(DEFAULT_CONFIG);
    expect(configFromSearch('?workers=abc&strategy=<script>')).toEqual(DEFAULT_CONFIG);
    expect(configFromSearch('?jobCount=1e9')).toEqual(DEFAULT_CONFIG);
  });
});
