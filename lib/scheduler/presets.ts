import type { SimConfig } from './simulate';

/** Slider bounds in the Lab. Every preset must fit inside them (see presets.test.ts). */
export const controlRanges = {
  workers: { min: 1, max: 32, step: 1 },
  arrivalRate: { min: 2, max: 400, step: 1 },
  medianServiceMs: { min: 20, max: 800, step: 10 },
  jobCount: { min: 20, max: 400, step: 10 },
  failureRate: { min: 0, max: 0.6, step: 0.01 },
  maxAttempts: { min: 1, max: 6, step: 1 },
  backoffBaseMs: { min: 0, max: 1000, step: 10 },
  backoffCapMs: { min: 0, max: 5000, step: 50 },
} as const satisfies Partial<Record<keyof SimConfig, { min: number; max: number; step: number }>>;

export const presets: { name: string; description: string; config: Partial<SimConfig> }[] = [
  { name: 'Balanced', description: 'Default: four workers keep up with arrivals; some attempts fail and retry.', config: {} },
  { name: 'Overloaded', description: 'Arrivals outpace two workers, so a queue builds. Compare FIFO with shortest-first.', config: { workers: 2, arrivalRate: 24, failureRate: 0.05 } },
  { name: 'Flaky dependency', description: 'Forty percent of attempts fail. Watch retries consume capacity and some jobs dead-letter.', config: { failureRate: 0.4, maxAttempts: 3 } },
  { name: 'Retry storm', description: 'A burst of jobs fails together and retries with no jitter, so the retries line up in the worker timeline. Switch jitter to Full to spread them out.', config: { jobCount: 150, arrivalRate: 400, workers: 24, failureRate: 0.5, maxAttempts: 4, backoffBaseMs: 500, backoffCapMs: 4000, jitter: 'none' } },
];
