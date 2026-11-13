/**
 * Deterministic discrete-event simulation of a job queue with a fixed pool of workers.
 *
 * This is an educational model, not a benchmark of any real system. It exists to
 * show, reproducibly, how scheduling order, worker count, failure rate and retry
 * backoff interact. Given the same configuration (including the seed), it always
 * produces exactly the same schedule.
 *
 * Model:
 * - Jobs arrive as a Poisson process (exponential inter-arrival times).
 * - Each job has a fixed service time drawn from a log-normal distribution, so a
 *   few jobs are much longer than the median, as in most real queues.
 * - Each attempt fails with probability `failureRate`. Whether attempt N of job J
 *   fails is a pure function of (seed, J, N), so every strategy sees the same
 *   failures and comparisons between strategies are fair.
 * - A failed attempt occupies its worker for part of the service time, then the
 *   job waits out an exponential backoff (optionally jittered) before it is ready
 *   again. After `maxAttempts` failures the job is dead-lettered.
 * - Workers never preempt. When a worker is free, the strategy picks the next
 *   ready job.
 */

export type Strategy = 'fifo' | 'sjf' | 'priority';
export type Jitter = 'none' | 'full' | 'equal';

export interface SimConfig {
  seed: number;
  jobCount: number;
  /** Mean arrivals per second. */
  arrivalRate: number;
  /** Median service time of one attempt, in milliseconds. */
  medianServiceMs: number;
  workers: number;
  strategy: Strategy;
  /** Probability, 0-1, that any single attempt fails. */
  failureRate: number;
  /** Total attempts allowed per job, including the first. */
  maxAttempts: number;
  backoffBaseMs: number;
  backoffCapMs: number;
  jitter: Jitter;
}

export const DEFAULT_CONFIG: SimConfig = {
  seed: 42,
  jobCount: 120,
  arrivalRate: 18,
  medianServiceMs: 180,
  workers: 4,
  strategy: 'fifo',
  failureRate: 0.12,
  maxAttempts: 4,
  backoffBaseMs: 100,
  backoffCapMs: 2_000,
  jitter: 'full',
};

export interface Attempt {
  job: number;
  attempt: number;
  worker: number;
  readyAt: number;
  start: number;
  end: number;
  ok: boolean;
}

export interface JobRecord {
  id: number;
  arrival: number;
  serviceMs: number;
  /** 1 (low) to 3 (high). Only the priority strategy reads it. */
  priority: number;
  attempts: number;
  status: 'succeeded' | 'dead-lettered';
  finishedAt: number;
}

export interface Metrics {
  makespanMs: number;
  succeeded: number;
  deadLettered: number;
  totalAttempts: number;
  retries: number;
  /** Successful jobs per second of simulated time. */
  throughput: number;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  meanLatency: number;
  meanQueueWait: number;
  /** Busy worker-time divided by available worker-time, 0-1. */
  utilization: number;
  maxQueueDepth: number;
}

export interface SimResult {
  config: SimConfig;
  jobs: JobRecord[];
  attempts: Attempt[];
  queueDepth: { t: number; depth: number }[];
  metrics: Metrics;
}

/** mulberry32: small, fast, well-distributed 32-bit PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** Stateless hash of a few integers to [0, 1). Used for per-attempt outcomes. */
export function hash01(...values: number[]): number {
  let h = 0x811c9dc5;
  for (const value of values) {
    h = Math.imul(h ^ (value >>> 0), 0x01000193);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4_294_967_296;
}

/**
 * Backoff before retry number `failures` (1 after the first failure).
 * Exponential: base * 2^(failures-1), capped. "full" jitter draws uniformly from
 * [0, d]; "equal" jitter draws from [d/2, d]. `u` is a uniform sample in [0, 1).
 */
export function backoffDelay(failures: number, baseMs: number, capMs: number, jitter: Jitter, u: number): number {
  if (failures < 1) throw new Error('backoffDelay: failures starts at 1.');
  const exponential = Math.min(capMs, baseMs * 2 ** (failures - 1));
  if (jitter === 'full') return u * exponential;
  if (jitter === 'equal') return exponential / 2 + (u * exponential) / 2;
  return exponential;
}

/** Nearest-rank percentile of an unsorted list. Returns 0 for an empty list. */
export function percentile(values: readonly number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.min(sorted.length, Math.max(1, rank)) - 1];
}

export function validateConfig(config: SimConfig): string[] {
  const errors: string[] = [];
  const check = (ok: boolean, message: string) => { if (!ok) errors.push(message); };
  check(Number.isInteger(config.jobCount) && config.jobCount >= 1 && config.jobCount <= 2_000, 'jobCount must be an integer from 1 to 2000.');
  check(config.arrivalRate > 0 && config.arrivalRate <= 1_000, 'arrivalRate must be above 0 and at most 1000.');
  check(config.medianServiceMs >= 1 && config.medianServiceMs <= 60_000, 'medianServiceMs must be from 1 to 60000.');
  check(Number.isInteger(config.workers) && config.workers >= 1 && config.workers <= 64, 'workers must be an integer from 1 to 64.');
  check(config.failureRate >= 0 && config.failureRate <= 0.95, 'failureRate must be from 0 to 0.95.');
  check(Number.isInteger(config.maxAttempts) && config.maxAttempts >= 1 && config.maxAttempts <= 10, 'maxAttempts must be an integer from 1 to 10.');
  check(config.backoffBaseMs >= 0 && config.backoffCapMs >= config.backoffBaseMs, 'backoffCapMs must be at least backoffBaseMs, and both non-negative.');
  return errors;
}

interface Event {
  t: number;
  seq: number;
  kind: 'ready' | 'finish';
  job: number;
  worker: number;
}

/** Binary min-heap ordered by (time, insertion sequence), which keeps ties deterministic. */
class EventQueue {
  private heap: Event[] = [];
  private seq = 0;
  get size() { return this.heap.length; }
  push(event: Omit<Event, 'seq'>) {
    this.heap.push({ ...event, seq: this.seq++ });
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.less(i, parent)) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }
  pop(): Event | undefined {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0 && last) {
      this.heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < this.heap.length && this.less(l, m)) m = l;
        if (r < this.heap.length && this.less(r, m)) m = r;
        if (m === i) break;
        [this.heap[i], this.heap[m]] = [this.heap[m], this.heap[i]];
        i = m;
      }
    }
    return top;
  }
  peekTime(): number | undefined { return this.heap[0]?.t; }
  private less(a: number, b: number) {
    const x = this.heap[a];
    const y = this.heap[b];
    return x.t < y.t || (x.t === y.t && x.seq < y.seq);
  }
}

export function generateJobs(config: SimConfig): JobRecord[] {
  const random = mulberry32(config.seed);
  const jobs: JobRecord[] = [];
  let t = 0;
  for (let id = 0; id < config.jobCount; id++) {
    t += -Math.log(1 - random()) * (1000 / config.arrivalRate);
    // Box-Muller normal sample, then log-normal with sigma 0.6 around the median.
    const z = Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    const serviceMs = Math.max(5, config.medianServiceMs * Math.exp(0.6 * z));
    const priority = 1 + Math.floor(random() * 3);
    jobs.push({ id, arrival: round(t), serviceMs: round(serviceMs), priority, attempts: 0, status: 'succeeded', finishedAt: 0 });
  }
  return jobs;
}

const round = (n: number) => Math.round(n * 100) / 100;

function pickNext(ready: number[], readyAt: Map<number, number>, jobs: JobRecord[], strategy: Strategy): number {
  let best = 0;
  for (let i = 1; i < ready.length; i++) {
    const a = jobs[ready[i]];
    const b = jobs[ready[best]];
    const ra = readyAt.get(a.id)!;
    const rb = readyAt.get(b.id)!;
    let better: boolean;
    if (strategy === 'sjf') better = a.serviceMs < b.serviceMs || (a.serviceMs === b.serviceMs && (ra < rb || (ra === rb && a.id < b.id)));
    else if (strategy === 'priority') better = a.priority > b.priority || (a.priority === b.priority && (ra < rb || (ra === rb && a.id < b.id)));
    else better = ra < rb || (ra === rb && a.id < b.id);
    if (better) best = i;
  }
  return best;
}

export function simulate(config: SimConfig): SimResult {
  const errors = validateConfig(config);
  if (errors.length) throw new Error(errors.join(' '));

  const jobs = generateJobs(config);
  const events = new EventQueue();
  const attempts: Attempt[] = [];
  const queueDepth: { t: number; depth: number }[] = [{ t: 0, depth: 0 }];
  const ready: number[] = [];
  const readyAt = new Map<number, number>();
  const idle: boolean[] = Array.from({ length: config.workers }, () => true);
  const running = new Map<number, Attempt>();

  for (const job of jobs) events.push({ t: job.arrival, kind: 'ready', job: job.id, worker: -1 });

  let now = 0;
  const recordDepth = () => {
    const last = queueDepth[queueDepth.length - 1];
    if (last.t === now) last.depth = ready.length;
    else if (last.depth !== ready.length) queueDepth.push({ t: now, depth: ready.length });
  };

  while (events.size > 0) {
    now = events.peekTime()!;
    // Apply every event at this instant before dispatching, so simultaneous
    // arrivals are all visible to the strategy.
    while (events.size > 0 && events.peekTime() === now) {
      const event = events.pop()!;
      const job = jobs[event.job];
      if (event.kind === 'ready') {
        ready.push(job.id);
        readyAt.set(job.id, now);
        continue;
      }
      const attempt = running.get(event.worker)!;
      running.delete(event.worker);
      idle[event.worker] = true;
      if (attempt.ok) {
        job.status = 'succeeded';
        job.finishedAt = now;
      } else if (job.attempts >= config.maxAttempts) {
        job.status = 'dead-lettered';
        job.finishedAt = now;
      } else {
        const delay = backoffDelay(job.attempts, config.backoffBaseMs, config.backoffCapMs, config.jitter, hash01(config.seed, job.id, job.attempts, 7));
        events.push({ t: round(now + delay), kind: 'ready', job: job.id, worker: -1 });
      }
    }

    for (let worker = 0; worker < config.workers && ready.length > 0; worker++) {
      if (!idle[worker]) continue;
      const index = pickNext(ready, readyAt, jobs, config.strategy);
      const job = jobs[ready[index]];
      ready.splice(index, 1);
      job.attempts += 1;
      const fails = hash01(config.seed, job.id, job.attempts, 3) < config.failureRate;
      // A failing attempt is detected partway through the work.
      const duration = fails ? round(job.serviceMs * (0.2 + 0.6 * hash01(config.seed, job.id, job.attempts, 5))) : job.serviceMs;
      const attempt: Attempt = { job: job.id, attempt: job.attempts, worker, readyAt: readyAt.get(job.id)!, start: now, end: round(now + duration), ok: !fails };
      attempts.push(attempt);
      running.set(worker, attempt);
      idle[worker] = false;
      events.push({ t: attempt.end, kind: 'finish', job: job.id, worker });
    }
    recordDepth();
  }

  const succeeded = jobs.filter((job) => job.status === 'succeeded');
  const latencies = succeeded.map((job) => job.finishedAt - job.arrival);
  const makespanMs = Math.max(0, ...jobs.map((job) => job.finishedAt));
  const busy = attempts.reduce((sum, a) => sum + (a.end - a.start), 0);
  const metrics: Metrics = {
    makespanMs,
    succeeded: succeeded.length,
    deadLettered: jobs.length - succeeded.length,
    totalAttempts: attempts.length,
    retries: attempts.length - jobs.length,
    throughput: makespanMs > 0 ? succeeded.length / (makespanMs / 1000) : 0,
    latencyP50: percentile(latencies, 50),
    latencyP95: percentile(latencies, 95),
    latencyP99: percentile(latencies, 99),
    meanLatency: latencies.length ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0,
    meanQueueWait: attempts.length ? attempts.reduce((sum, a) => sum + (a.start - a.readyAt), 0) / attempts.length : 0,
    utilization: makespanMs > 0 ? busy / (config.workers * makespanMs) : 0,
    maxQueueDepth: Math.max(...queueDepth.map((point) => point.depth)),
  };
  return { config, jobs, attempts, queueDepth, metrics };
}
