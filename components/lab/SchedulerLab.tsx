'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_CONFIG, simulate, type Jitter, type SimConfig, type SimResult, type Strategy } from '../../lib/scheduler/simulate';
import { controlRanges as r, presets } from '../../lib/scheduler/presets';
import { configFromSearch, configToSearch } from '../../lib/scheduler/url';

const strategies: { value: Strategy; label: string }[] = [
  { value: 'fifo', label: 'FIFO' },
  { value: 'sjf', label: 'Shortest first' },
  { value: 'priority', label: 'Priority' },
];
const jitters: { value: Jitter; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'equal', label: 'Equal' },
  { value: 'full', label: 'Full' },
];


const ms = (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`);

function Range({ label, value, min, max, step, format, onChange }: { label: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void }) {
  const id = `ctl-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="control">
      <label htmlFor={id}>{label}<output htmlFor={id}>{format(value)}</output></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

function Segmented<T extends string>({ legend, name, options, value, onChange }: { legend: string; name: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="control">
      <legend>{legend}</legend>
      <div className="segmented">
        {options.map((option) => (
          <label key={option.value}>
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Gantt({ result, selected, onSelect }: { result: SimResult; selected: number | null; onSelect: (job: number | null) => void }) {
  const width = 900;
  const left = 34;
  const laneH = Math.max(10, Math.min(22, 200 / result.config.workers));
  const top = 8;
  const height = top + laneH * result.config.workers + 26;
  const end = Math.max(1, result.metrics.makespanMs);
  const x = (t: number) => left + (t / end) * (width - left - 8);
  const ticks = Array.from({ length: 6 }, (_, i) => (end / 5) * i);
  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Worker timeline: ${result.attempts.length} attempts across ${result.config.workers} workers over ${ms(end)}. Failed attempts are shown in red.`}>
      {ticks.map((t) => <g key={t}><line className="grid-line" x1={x(t)} x2={x(t)} y1={top} y2={height - 20} /><text x={x(t)} y={height - 6} textAnchor="middle">{ms(t)}</text></g>)}
      {Array.from({ length: result.config.workers }, (_, w) => (
        <g key={w}>
          <rect className="lane" x={left} y={top + w * laneH + 1} width={width - left - 8} height={laneH - 2} rx="2" />
          <text x={left - 6} y={top + w * laneH + laneH / 2 + 3} textAnchor="end">W{w + 1}</text>
        </g>
      ))}
      {result.attempts.map((a) => {
        const cls = `${a.ok ? 'ok' : 'fail'}${selected === null ? '' : a.job === selected ? ' hl' : ' dim'}`;
        return (
          <rect key={`${a.job}-${a.attempt}`} className={cls} x={x(a.start)} y={top + a.worker * laneH + 2} width={Math.max(1, x(a.end) - x(a.start) - 0.6)} height={laneH - 4} rx="1.5" onMouseEnter={() => onSelect(a.job)} onMouseLeave={() => onSelect(null)} onClick={() => onSelect(selected === a.job ? null : a.job)}>
            <title>{`Job ${a.job + 1}, attempt ${a.attempt}: ${a.ok ? 'succeeded' : 'failed'} on worker ${a.worker + 1}, ${ms(a.start)} to ${ms(a.end)} (waited ${ms(a.start - a.readyAt)})`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

function DepthChart({ result }: { result: SimResult }) {
  const width = 900;
  const height = 120;
  const left = 34;
  const end = Math.max(1, result.metrics.makespanMs);
  const max = Math.max(1, result.metrics.maxQueueDepth);
  const x = (t: number) => left + (t / end) * (width - left - 8);
  const y = (d: number) => height - 20 - (d / max) * (height - 30);
  let path = `M ${x(0)} ${y(0)}`;
  let lastY = y(0);
  for (const point of result.queueDepth) {
    path += ` L ${x(point.t)} ${lastY} L ${x(point.t)} ${y(point.depth)}`;
    lastY = y(point.depth);
  }
  path += ` L ${x(end)} ${lastY} L ${x(end)} ${y(0)} Z`;
  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Queue depth over time, peaking at ${result.metrics.maxQueueDepth} waiting jobs.`}>
      <line className="axis" x1={left} x2={width - 8} y1={y(0)} y2={y(0)} />
      <line className="grid-line" x1={left} x2={width - 8} y1={y(max)} y2={y(max)} />
      <text x={left - 6} y={y(max) + 3} textAnchor="end">{max}</text>
      <text x={left - 6} y={y(0) + 3} textAnchor="end">0</text>
      <path className="depth" d={path} />
    </svg>
  );
}

export default function SchedulerLab() {
  const [config, setConfig] = useState<SimConfig>(DEFAULT_CONFIG);
  const [selected, setSelected] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [presetNote, setPresetNote] = useState<string | null>(null);

  useEffect(() => {
    // Restore a shared experiment from the URL once, after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfig(configFromSearch(window.location.search));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const url = `${window.location.pathname}${configToSearch(config)}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }, [config, hydrated]);

  const set = <K extends keyof SimConfig>(key: K, value: SimConfig[K]) => {
    setSelected(null);
    setConfig((current) => {
      const next = { ...current, [key]: value };
      if (key === 'backoffBaseMs' && next.backoffCapMs < next.backoffBaseMs) next.backoffCapMs = next.backoffBaseMs;
      if (key === 'backoffCapMs' && next.backoffBaseMs > next.backoffCapMs) next.backoffBaseMs = next.backoffCapMs;
      return next;
    });
  };

  const result = useMemo(() => simulate(config), [config]);
  const comparison = useMemo(() => strategies.map((s) => ({ ...s, metrics: simulate({ ...config, strategy: s.value }).metrics })), [config]);
  const job = selected === null ? null : result.jobs[selected];
  const m = result.metrics;

  return (
    <div className="lab">
      <div className="panel">
        <h2>Parameters</h2>
        <div className="controls">
          <div className="control">
            <label htmlFor="preset">Preset</label>
            <select id="preset" defaultValue="" onChange={(event) => { const preset = presets.find((p) => p.name === event.target.value); if (preset) { setSelected(null); setPresetNote(preset.description); setConfig({ ...DEFAULT_CONFIG, ...preset.config, seed: config.seed }); } }}>
              <option value="" disabled>Choose a scenario…</option>
              {presets.map((preset) => <option key={preset.name} value={preset.name}>{preset.name}</option>)}
            </select>
            {presetNote && <p className="small muted" aria-live="polite">{presetNote}</p>}
          </div>
          <Segmented legend="Scheduling strategy" name="strategy" options={strategies} value={config.strategy} onChange={(v) => set('strategy', v)} />
          <Range label="Workers" value={config.workers} min={r.workers.min} max={r.workers.max} step={r.workers.step} format={String} onChange={(v) => set('workers', v)} />
          <Range label="Arrival rate" value={config.arrivalRate} min={r.arrivalRate.min} max={r.arrivalRate.max} step={r.arrivalRate.step} format={(v) => `${v} jobs/s`} onChange={(v) => set('arrivalRate', v)} />
          <Range label="Median job time" value={config.medianServiceMs} min={r.medianServiceMs.min} max={r.medianServiceMs.max} step={r.medianServiceMs.step} format={ms} onChange={(v) => set('medianServiceMs', v)} />
          <Range label="Jobs" value={config.jobCount} min={r.jobCount.min} max={r.jobCount.max} step={r.jobCount.step} format={String} onChange={(v) => set('jobCount', v)} />
          <Range label="Attempt failure rate" value={config.failureRate} min={r.failureRate.min} max={r.failureRate.max} step={r.failureRate.step} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => set('failureRate', v)} />
          <Range label="Max attempts per job" value={config.maxAttempts} min={r.maxAttempts.min} max={r.maxAttempts.max} step={r.maxAttempts.step} format={String} onChange={(v) => set('maxAttempts', v)} />
          <Range label="Backoff base" value={config.backoffBaseMs} min={r.backoffBaseMs.min} max={r.backoffBaseMs.max} step={r.backoffBaseMs.step} format={ms} onChange={(v) => set('backoffBaseMs', v)} />
          <Range label="Backoff cap" value={config.backoffCapMs} min={r.backoffCapMs.min} max={r.backoffCapMs.max} step={r.backoffCapMs.step} format={ms} onChange={(v) => set('backoffCapMs', v)} />
          <Segmented legend="Backoff jitter" name="jitter" options={jitters} value={config.jitter} onChange={(v) => set('jitter', v)} />
          <div className="control">
            <label htmlFor="seed">Random seed</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input id="seed" type="number" min={0} max={4294967295} value={config.seed} onChange={(event) => { const v = Number(event.target.value); if (Number.isInteger(v) && v >= 0) set('seed', v); }} />
              <button type="button" className="btn" style={{ height: 36 }} onClick={() => set('seed', (config.seed * 1103515245 + 12345) % 2147483647)}>New</button>
            </div>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => { setSelected(null); setConfig(DEFAULT_CONFIG); }}>Reset to defaults</button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem', minWidth: 0 }}>
        <p className="sim-banner"><span className="badge badge-sim">Simulation</span> Deterministic model running in your browser. No real jobs, servers or telemetry; times are simulated milliseconds. The URL updates so an experiment can be shared.</p>
        <dl className="metrics" aria-live="polite">
          <div className="metric"><dt>Throughput</dt><dd>{m.throughput.toFixed(1)}/s</dd></div>
          <div className="metric"><dt>Latency p50</dt><dd>{ms(m.latencyP50)}</dd></div>
          <div className="metric"><dt>Latency p95</dt><dd>{ms(m.latencyP95)}</dd></div>
          <div className="metric"><dt>Latency p99</dt><dd>{ms(m.latencyP99)}</dd></div>
          <div className="metric"><dt>Succeeded</dt><dd>{m.succeeded}/{config.jobCount}</dd></div>
          <div className="metric"><dt>Dead-lettered</dt><dd>{m.deadLettered}</dd></div>
          <div className="metric"><dt>Retries</dt><dd>{m.retries}</dd></div>
          <div className="metric"><dt>Utilization</dt><dd>{Math.round(m.utilization * 100)}%</dd></div>
        </dl>

        <div className="panel">
          <h3>Worker timeline</h3>
          <Gantt result={result} selected={selected} onSelect={setSelected} />
          <div className="chart-legend"><span><i style={{ background: 'color-mix(in srgb, var(--accent) 70%, transparent)' }} />Successful attempt</span><span><i style={{ background: 'var(--danger)' }} />Failed attempt</span><span>Makespan {ms(m.makespanMs)}</span></div>
          <p className="small muted" style={{ marginTop: '0.6rem', minHeight: '1.5em' }} aria-live="polite">
            {job ? `Job ${job.id + 1}: arrived at ${ms(job.arrival)}, priority ${job.priority}, ${job.attempts} attempt${job.attempts === 1 ? '' : 's'}, ${job.status === 'succeeded' ? `finished ${ms(job.finishedAt - job.arrival)} after arriving` : 'dead-lettered after exhausting its attempts'}.` : 'Hover or tap a bar to follow one job through its attempts.'}
          </p>
        </div>

        <div className="panel">
          <h3>Queue depth</h3>
          <DepthChart result={result} />
          <p className="small muted" style={{ marginTop: '0.4rem' }}>Jobs waiting for a worker, including jobs whose backoff has ended. Peak {m.maxQueueDepth}; mean wait per attempt {ms(m.meanQueueWait)}.</p>
        </div>

        <div className="panel">
          <h3>Same workload, every strategy</h3>
          <div className="table-scroll">
            <table className="compare">
              <caption className="sr-only">Metrics for each scheduling strategy on the current workload</caption>
              <thead><tr><th scope="col">Strategy</th><th scope="col">Mean latency</th><th scope="col">p50</th><th scope="col">p99</th><th scope="col">Throughput</th><th scope="col">Makespan</th></tr></thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.value} className={row.value === config.strategy ? 'current' : undefined}>
                    <td>{row.label}{row.value === config.strategy ? ' (selected)' : ''}</td>
                    <td>{ms(row.metrics.meanLatency)}</td>
                    <td>{ms(row.metrics.latencyP50)}</td>
                    <td>{ms(row.metrics.latencyP99)}</td>
                    <td>{row.metrics.throughput.toFixed(1)}/s</td>
                    <td>{ms(row.metrics.makespanMs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: '0.6rem' }}>Every strategy sees identical arrivals, job sizes and per-attempt failures, so differences come only from ordering.</p>
        </div>
      </div>
    </div>
  );
}
