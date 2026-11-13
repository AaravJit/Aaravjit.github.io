import type { Metadata } from 'next';
import Link from 'next/link';
import { Arrow, PageHead } from '../../components/ui';

export const metadata: Metadata = {
  title: 'Engineering Lab',
  description: 'Working, tested technical experiments by Aarav Jit, starting with a deterministic job-queue scheduler simulator.',
  alternates: { canonical: '/lab/' },
};

export default function LabPage() {
  return (
    <>
      <PageHead eyebrow="Engineering Lab" title="Experiments that run, with tests behind them.">
        Each experiment is a small, real program with its own documentation and automated tests. Anything simulated is labeled as a simulation.
      </PageHead>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <div className="grid grid-2">
          <Link className="card card-link" href="/lab/scheduler/">
            <div className="card-top"><span className="kicker">Distributed systems · simulation</span><span className="badge badge-new">New, Nov 2026</span></div>
            <h2 style={{ fontSize: '1.5rem' }}>Job queue scheduler</h2>
            <p>A deterministic discrete-event simulation of workers pulling from a queue. Change concurrency, strategy (FIFO, shortest-first, priority), failure rate, retry limits and backoff jitter, and compare latency percentiles, throughput and dead letters on identical workloads.</p>
            <p className="small muted">TypeScript · 20 unit tests · runs entirely in the browser</p>
            <span className="text-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>Open the simulator <Arrow /></span>
          </Link>
          <div className="card">
            <span className="kicker">Next experiment · proposed, not built</span>
            <h2 style={{ fontSize: '1.5rem' }}>Row-level security explorer</h2>
            <p>An interactive walk through the access rules used in Pathway and RoadPing: which role can read which row, what a SECURITY DEFINER function changes, and how a request is refused. It will be built against a real, local Postgres test suite before it appears here as working.</p>
          </div>
        </div>
      </div>
    </>
  );
}
