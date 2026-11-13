'use client';

import { useState } from 'react';
import { levelLabels, skillGroups, type Level } from '../data/skills';

const filters: (Level | 'all')[] = ['all', 'built', 'directed', 'foundational'];

export default function SkillsExplorer() {
  const [filter, setFilter] = useState<Level | 'all'>('all');
  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filter by how the skill is evidenced">
        {filters.map((f) => (
          <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : levelLabels[f].label}
          </button>
        ))}
      </div>
      {skillGroups.map((group) => {
        const skills = group.skills.filter((s) => filter === 'all' || s.level === filter);
        if (!skills.length) return null;
        return (
          <section className="skill-group" key={group.id} id={group.id} aria-labelledby={`sg-${group.id}`}>
            <h2 id={`sg-${group.id}`} style={{ fontSize: '1.05rem' }}>{group.title}</h2>
            <ul className="skill-rows">
              {skills.map((skill) => (
                <li key={skill.name}>
                  <span>{skill.name}</span>
                  <span className={`lvl lvl-${skill.level}`}>{levelLabels[skill.level].label}</span>
                  <span>{skill.evidence ? <a href={skill.evidence.href} {...(skill.evidence.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{skill.evidence.label}{skill.evidence.href.startsWith('http') ? ' ↗' : ''}</a> : <span className="muted small">No public artifact yet</span>}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
