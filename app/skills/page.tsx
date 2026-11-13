import type { Metadata } from 'next';
import SkillsExplorer from '../../components/SkillsExplorer';
import { PageHead } from '../../components/ui';
import { levelLabels, roadmap, type Level } from '../../data/skills';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Aarav Jit’s technical skills, each linked to the project, file or coursework that shows it, with a separate learning roadmap.',
  alternates: { canonical: '/skills/' },
};

export default function SkillsPage() {
  return (
    <>
      <PageHead eyebrow="Skills" title="Skills, with the evidence attached.">
        No percentages. Each skill says how it is known and links to where you can check it. Things I haven’t done yet are on the roadmap at the bottom, not in the list.
      </PageHead>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <dl className="kv" style={{ marginBottom: '2.5rem' }}>
          {(Object.keys(levelLabels) as Level[]).map((level) => <div key={level}><dt className={`lvl-${level}`}>{levelLabels[level].label}</dt><dd>{levelLabels[level].description}</dd></div>)}
        </dl>
        <SkillsExplorer />
        <section className="section" id="roadmap" aria-labelledby="roadmap-title" style={{ marginTop: '3rem' }}>
          <h2 id="roadmap-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.8rem' }}>Learning roadmap</h2>
          <p className="lede" style={{ marginBottom: '1.8rem' }}>Skills that roles I want ask for and that nothing on this site demonstrates yet.</p>
          <div className="grid grid-3">
            {roadmap.map((item) => <div className="card" key={item.name}><h3>{item.name}</h3><p>{item.why}</p></div>)}
          </div>
        </section>
      </div>
    </>
  );
}
