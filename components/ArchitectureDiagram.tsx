'use client';

import { useState } from 'react';

export interface DiagramNode { id: string; label: string; sub?: string; x: number; y: number; w?: number; detail: string }
export interface DiagramEdge { from: string; to: string; label?: string }
export interface DiagramZone { label: string; x: number; y: number; w: number; h: number }

const H = 52;

/**
 * Interactive architecture diagram. Select a component (click, tap, or Tab + Enter) to
 * highlight its connections and read what it does. Every label comes from the project's
 * own documentation or source.
 */
export default function ArchitectureDiagram({ title, nodes, edges, zones = [], width = 900, height = 420 }: { title: string; nodes: readonly DiagramNode[]; edges: readonly DiagramEdge[]; zones?: readonly DiagramZone[]; width?: number; height?: number }) {
  const [active, setActive] = useState<string>(nodes[0]?.id ?? '');
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const current = byId.get(active);
  const center = (node: DiagramNode) => ({ x: node.x + (node.w ?? 150) / 2, y: node.y + H / 2 });

  const edgePath = (edge: DiagramEdge) => {
    const a = byId.get(edge.from)!;
    const b = byId.get(edge.to)!;
    const ca = center(a);
    const cb = center(b);
    // Leave from the side facing the target.
    const horizontal = Math.abs(cb.x - ca.x) > Math.abs(cb.y - ca.y);
    const start = horizontal ? { x: ca.x + Math.sign(cb.x - ca.x) * (a.w ?? 150) / 2, y: ca.y } : { x: ca.x, y: ca.y + Math.sign(cb.y - ca.y) * H / 2 };
    const end = horizontal ? { x: cb.x - Math.sign(cb.x - ca.x) * (b.w ?? 150) / 2, y: cb.y } : { x: cb.x, y: cb.y - Math.sign(cb.y - ca.y) * H / 2 };
    const mid = horizontal ? `C ${(start.x + end.x) / 2} ${start.y}, ${(start.x + end.x) / 2} ${end.y},` : `C ${start.x} ${(start.y + end.y) / 2}, ${end.x} ${(start.y + end.y) / 2},`;
    return { d: `M ${start.x} ${start.y} ${mid} ${end.x} ${end.y}`, lx: (start.x + end.x) / 2, ly: (start.y + end.y) / 2 - 6 };
  };

  return (
    <figure className="diagram">
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={title} style={{ minWidth: 640 }}>
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 8 4 0 8z" fill="currentColor" style={{ color: 'var(--ink-3)' }} />
            </marker>
          </defs>
          {zones.map((zone) => (
            <g key={zone.label} aria-hidden="true">
              <rect className="zone" x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="12" />
              <text className="zone-label" x={zone.x + 12} y={zone.y + 18}>{zone.label}</text>
            </g>
          ))}
          {edges.map((edge) => {
            const { d, lx, ly } = edgePath(edge);
            const on = edge.from === active || edge.to === active;
            return (
              <g key={`${edge.from}-${edge.to}`} aria-hidden="true">
                <path className={`edge${on ? ' active' : ''}`} d={d} markerEnd="url(#arrow)" />
                {edge.label && <text className="edge-label" x={lx} y={ly} textAnchor="middle">{edge.label}</text>}
              </g>
            );
          })}
          {nodes.map((node) => (
            <g
              key={node.id}
              className={`node${node.id === active ? ' active' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={node.id === active}
              aria-label={`${node.label}${node.sub ? `, ${node.sub}` : ''}`}
              onClick={() => setActive(node.id)}
              onFocus={() => setActive(node.id)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActive(node.id); } }}
            >
              <rect x={node.x} y={node.y} width={node.w ?? 150} height={H} rx="9" />
              <text x={node.x + 12} y={node.y + (node.sub ? 22 : 31)}>{node.label}</text>
              {node.sub && <text className="sub" x={node.x + 12} y={node.y + 39}>{node.sub}</text>}
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="diagram-detail" aria-live="polite">
        {current ? <><b>{current.label}.</b> {current.detail}</> : 'Select a component to see what it does.'}
      </figcaption>
    </figure>
  );
}
