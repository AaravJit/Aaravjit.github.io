import type { Metadata } from 'next';
import Link from 'next/link';
import SchedulerLab from '../../../components/lab/SchedulerLab';
import { Code, external, PageHead } from '../../../components/ui';

export const metadata: Metadata = {
  title: 'Job queue scheduler simulator',
  description: 'Interactive, deterministic simulation of a job queue with worker concurrency, FIFO, shortest-job-first and priority scheduling, retries with exponential backoff and jitter, and dead-lettering.',
  alternates: { canonical: '/lab/scheduler/' },
};

const src = 'https://github.com/AaravJit/Aaravjit.github.io/blob/main/lib/scheduler';

const tests = [
  'mulberry32 is deterministic per seed and stays in [0, 1)',
  'hash01 is stable and roughly uniform',
  'backoff doubles, caps, and keeps jitter inside its bounds',
  'percentile uses nearest rank',
  'validates configuration',
  'generates arrivals in order with plausible service times',
  'is fully deterministic for a given configuration',
  'never runs two attempts on one worker at the same time',
  'never exceeds the worker limit',
  'never starts a job before it arrives or a retry before its backoff ends',
  'succeeds every job on the first attempt when nothing fails',
  'dead-letters jobs after maxAttempts failures and accounts for every job',
  'with one worker and FIFO, runs jobs in arrival order',
  'keeps failures identical across strategies so comparisons are fair',
  'shortest-job-first lowers mean latency on an overloaded queue',
  'priority scheduling serves high-priority jobs faster than low-priority ones under load',
  'reports utilization between 0 and 1 and consistent counts',
  'jitter spreads retries that would otherwise fire in lockstep',
  'round-trips a configuration through the query string',
  'falls back to defaults for invalid or hostile input',
];

const backoff = `export function backoffDelay(failures: number, baseMs: number, capMs: number, jitter: Jitter, u: number): number {
  const exponential = Math.min(capMs, baseMs * 2 ** (failures - 1));
  if (jitter === 'full') return u * exponential;            // uniform in [0, d]
  if (jitter === 'equal') return exponential / 2 + (u * exponential) / 2;  // [d/2, d]
  return exponential;
}`;

const fairness = `// Whether attempt N of job J fails depends only on (seed, J, N),
// so every strategy sees the same failures.
const fails = hash01(config.seed, job.id, job.attempts, 3) < config.failureRate;`;

export default function SchedulerPage() {
  return (
    <>
      <PageHead eyebrow="Engineering Lab · Simulation" title="Job queue scheduler" back={{ href: '/lab/', label: 'Engineering Lab' }}>
        Jobs arrive, wait in a queue, and run on a fixed pool of workers. Some attempts fail and retry after a backoff. Change the parameters and see what happens to latency, throughput and dead letters.
      </PageHead>
      <div className="wrap" style={{ paddingBottom: 'clamp(2rem, 5vw, 3rem)' }}>
        <SchedulerLab />
      </div>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <div className="case-layout">
          <aside className="case-aside" aria-label="About this experiment">
            <dl style={{ display: 'grid', gap: '1.1rem' }}>
              <div><dt>Built</dt><dd>November 2026, as part of the portfolio rebuild (AI-agent implementation to my spec, reviewed by me)</dd></div>
              <div><dt>Source</dt><dd><a href={`${src}/simulate.ts`} {...external}>simulate.ts ↗</a><br /><a href={`${src}/simulate.test.ts`} {...external}>simulate.test.ts ↗</a></dd></div>
              <div><dt>Tests</dt><dd>{tests.length} unit tests, run in CI</dd></div>
            </dl>
          </aside>
          <div>
            <section className="case-section" aria-labelledby="why">
              <p className="eyebrow">01 · Why</p>
              <h2 id="why">The bug I wanted to understand</h2>
              <div className="prose">
                <p>HireStudio, a resume-tailoring prototype of mine, processes generation as queued jobs: a cron-triggered worker reads queued jobs, then each job checks its status and marks itself running. Two problems: two overlapping workers can both pass the check, and a failed job stays failed forever. The <Link href="/decisions/#job-claims">decision record</Link> covers the fix. This simulator is how I reasoned about the retry half of it before writing any production code.</p>
              </div>
            </section>
            <section className="case-section" aria-labelledby="model">
              <p className="eyebrow">02 · Model</p>
              <h2 id="model">What is simulated, and what isn’t</h2>
              <div className="prose">
                <ul>
                  <li><strong>Arrivals</strong> are a Poisson process at the chosen rate. <strong>Job sizes</strong> are log-normal around the median (σ = 0.6), so a few jobs are several times longer than typical.</li>
                  <li><strong>Workers</strong> take the next ready job by strategy and never preempt. FIFO orders by ready time; shortest-first by job size; priority by a 1–3 priority, then ready time.</li>
                  <li><strong>Failures</strong> happen per attempt with the chosen probability and are detected partway through the work, so failed attempts still cost worker time.</li>
                  <li><strong>Retries</strong> wait a capped exponential backoff, optionally jittered, then rejoin the queue. After the attempt limit a job is dead-lettered.</li>
                  <li><strong>Not modeled:</strong> timeouts, preemption, multiple queues, correlated failures (a whole dependency going down), cost of retries on the dependency, or network delay. Real systems have all of these.</li>
                </ul>
              </div>
            </section>
            <section className="case-section" aria-labelledby="decisions">
              <p className="eyebrow">03 · Technical decisions</p>
              <h2 id="decisions">Deterministic, fair, and fast enough to rerun on every change</h2>
              <div className="prose">
                <p><strong>Deterministic by seed.</strong> Arrivals and sizes come from a seeded mulberry32 generator, and the event queue is a binary heap ordered by time and then insertion sequence, so ties always resolve the same way. The same URL always shows the same result, which makes an experiment shareable and the tests exact.</p>
                <p><strong>Fair comparisons.</strong> If failures were drawn from the same random stream as everything else, changing the strategy would change which attempts fail, and the comparison table would mix two effects. Instead each attempt’s outcome is a hash of the seed, job and attempt number.</p>
                <Code file="lib/scheduler/simulate.ts" href={`${src}/simulate.ts`} code={fairness} />
                <p><strong>Jitter as a parameter.</strong> Without jitter, jobs that fail together retry together. The “Retry storm” preset shows the lockstep; switching jitter to Full spreads it.</p>
                <Code file="lib/scheduler/simulate.ts" href={`${src}/simulate.ts`} code={backoff} />
                <p><strong>Nearest-rank percentiles</strong> on completed jobs only, so p99 is always a latency that actually happened.</p>
              </div>
            </section>
            <section className="case-section" aria-labelledby="try">
              <p className="eyebrow">04 · Things to try</p>
              <h2 id="try">Questions the simulator answers</h2>
              <div className="prose">
                <ul>
                  <li>Choose <em>Overloaded</em>. Shortest-first cuts the median latency sharply, and the comparison table shows the price: its p99 is worse than FIFO’s, because long jobs keep getting passed over.</li>
                  <li>With the default workload, raise workers from 4 to 8. Latency falls a lot, throughput barely moves (it is capped by the arrival rate), and utilization drops toward half.</li>
                  <li>Choose <em>Flaky dependency</em> and raise max attempts. Fewer jobs dead-letter, but retries take a growing share of worker time.</li>
                </ul>
                <p className="callout">These observations are about this model on its default seeds, not measurements of a production system.</p>
              </div>
            </section>
            <section className="case-section" id="tests" aria-labelledby="tests-title">
              <p className="eyebrow">05 · Validation</p>
              <h2 id="tests-title">Automated tests</h2>
              <div className="prose">
                <p>The tests check invariants that must hold for any configuration (no worker runs two attempts at once, the worker limit is never exceeded, no retry starts before its backoff ends) and behaviors expected from queueing theory on fixed workloads.</p>
                <ul className="checklist">{tests.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
