import type { Metadata } from 'next';
import Link from 'next/link';
import Article from '../../../components/Article';
import { Code } from '../../../components/ui';

export const metadata: Metadata = {
  title: 'What a deterministic simulator shows about retries',
  description: 'Design notes on the Engineering Lab’s job-queue simulator: determinism, fair failure injection, jitter, and the latency tail that shortest-job-first creates.',
  alternates: { canonical: '/notes/retries-and-backoff-in-a-simulator/' },
  openGraph: { type: 'article', title: 'What a deterministic simulator shows about retries', url: '/notes/retries-and-backoff-in-a-simulator/', images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit' }] },
};

const claim = `// A safer claim: only one worker can move a job from queued to running.
UPDATE generation_job
   SET status = 'running', attempts = attempts + 1
 WHERE id = $1 AND status = 'queued'
RETURNING id;   -- zero rows means another worker got it first`;

export default function Note() {
  return (
    <Article slug="retries-and-backoff-in-a-simulator">
      <p className="callout"><strong>Scope.</strong> Everything below is about a simulation I built for this site. The numbers are outputs of that model on its default seed, not measurements of a production system.</p>

      <h2>Where this started</h2>
      <p>HireStudio, one of my prototypes, generates tailored resumes as queued jobs. A cron-triggered worker reads up to five queued jobs; each job then checks that it is still queued and marks itself running in a separate query. If two worker invocations overlap, both can pass the check. And when generation throws, the job is marked failed and never looked at again.</p>
      <p>The first problem has a well-known fix: make the claim a single conditional write, so the database decides who wins.</p>
      <Code file="Proposed fix (not yet applied to HireStudio)" code={claim} />
      <p>The second problem, retries, raises questions that are harder to reason about in your head. How many attempts? How long to wait? What happens to everyone else in the queue while failing jobs retry? I built the <Link href="/lab/scheduler/">scheduler simulator</Link> to look at those questions with the knobs in front of me.</p>

      <h2>Decision 1: deterministic, always</h2>
      <p>The simulator is a discrete-event simulation: a priority queue of timestamped events (a job becomes ready, an attempt finishes) processed in order. Randomness comes from a seeded generator, and ties in time are broken by insertion order. Given the same parameters, it produces exactly the same schedule every time. That makes the tests exact, makes a URL a reproducible experiment, and means a surprising result can be re-examined rather than re-rolled.</p>

      <h2>Decision 2: identical failures across strategies</h2>
      <p>The comparison table runs FIFO, shortest-first and priority scheduling on the same workload. If failures were drawn from the shared random stream, a different scheduling order would consume random numbers in a different order and change which attempts fail, mixing two effects in one comparison. So whether attempt <em>N</em> of job <em>J</em> fails is a hash of the seed, <em>J</em> and <em>N</em>, independent of when it runs. A unit test checks that every strategy sees the same set of failed attempts.</p>

      <h2>What the model shows</h2>
      <h3>Shortest-first trades the tail for the median</h3>
      <p>On the Overloaded preset (two workers, arrivals faster than they can serve), shortest-job-first cuts median latency from about 3.4 s to about 0.45 s compared with FIFO, and mean latency nearly in half. Its p99 is worse, about 10.7 s against 8.8 s, because the longest jobs keep getting passed over while shorter ones arrive. Whether that trade is good depends entirely on who is waiting for the long jobs.</p>
      <h3>More workers buy latency, not throughput, once you keep up</h3>
      <p>On the default workload, going from four to eight workers drops median latency from about 410 ms to about 190 ms, while throughput rises only from about 16 to 18 jobs per second, because throughput is bounded by how fast jobs arrive. Utilization falls toward half: the extra capacity mostly waits.</p>
      <h3>Retry limits move failures, they don’t remove them</h3>
      <p>With 40% of attempts failing, allowing two attempts dead-letters 25 of 120 jobs; three attempts, 5; four, 1. Each extra attempt rescues fewer jobs and costs more worker time, which is why “retry forever” is not a policy.</p>
      <h3>Jitter breaks lockstep</h3>
      <p>Jobs that fail together and retry after the same fixed backoff come back together. The Retry storm preset makes that visible as aligned bars in the worker timeline; full jitter spreads them across the backoff window. A test asserts the spread increases. In this model full jitter also shortens the average wait, since it draws from zero up to the backoff, so it shouldn’t be read as a pure de-synchronization effect.</p>

      <h2>What the model leaves out</h2>
      <p>Real failures are correlated (a dependency goes down for everyone at once), retries add load to the thing that is failing, and real workers have timeouts and can crash mid-job. None of that is modeled. The next version I’d build adds correlated outage windows, which is where backoff caps and circuit breakers start to matter.</p>
      <p>Source and tests: <a href="https://github.com/AaravJit/Aaravjit.github.io/blob/main/lib/scheduler/simulate.ts">simulate.ts</a> and <a href="https://github.com/AaravJit/Aaravjit.github.io/blob/main/lib/scheduler/simulate.test.ts">simulate.test.ts</a>.</p>
    </Article>
  );
}
