import type { Metadata } from 'next';
import Link from 'next/link';
import { external, PageHead } from '../../components/ui';
import { buildDisclosure, profile } from '../../data/profile';

export const metadata: Metadata = {
  title: 'About',
  description: 'Who Aarav Jit is, what he is looking for, and exactly how his projects are built, including where AI coding agents are involved.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <>
      <PageHead eyebrow="About" title="I want to know how it works underneath.">
        {profile.why}
      </PageHead>
      <div className="wrap" style={{ paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <div className="case-layout">
          <aside className="case-aside" aria-label="Quick facts">
            <dl style={{ display: 'grid', gap: '1.1rem' }}>
              <div><dt>Based in</dt><dd>{profile.location}</dd></div>
              <div><dt>Studying</dt><dd>Cybersecurity and Information Assurance, American River College</dd></div>
              <div><dt>Working</dt><dd>Walmart, online grocery pickup and digital fulfillment</dd></div>
              <div><dt>Contact</dt><dd><a href={profile.linkedin} {...external}>LinkedIn ↗</a></dd></div>
            </dl>
          </aside>
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Where I am now</h2>
            <p>I’m studying Cybersecurity and Information Assurance at American River College after earlier computer science coursework at Sacramento State, and I work in Walmart’s online grocery pickup operation. Outside of both, I build: a Linux desktop installer I ran daily on two machines, a resume-tailoring app, and two location-aware mobile apps with their privacy rules enforced in Postgres.</p>
            <p>I’m early in my career and I don’t pretend otherwise. What I can show is that I pick hard problems, ship working versions, write down what I decided and why, and say plainly where each project falls short.</p>

            <h2 id="how-i-build">How I build</h2>
            {buildDisclosure.long.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p>That workflow is a skill in itself, and it has real limits. Agents are fast at producing plausible code and bad at noticing when a requirement is wrong, so most of my time goes into the parts they can’t do: deciding the boundaries, reading what changed, testing it against real hardware and services, and rejecting work that doesn’t hold up. Commit history in each public repository shows who wrote what.</p>

            <h2>What I’m looking for</h2>
            <p>{profile.availability}</p>
            <ul>{profile.seeking.map((item) => <li key={item}>{item}</li>)}</ul>
            <p>I’m strongest where software meets the system under it: Linux configuration and troubleshooting, database-level security, and the reliability work around an application. I’m actively building depth in networking and security through coursework, and the <Link href="/skills/#roadmap">learning roadmap</Link> lists what I haven’t done yet.</p>

            <h2>What retail operations taught me</h2>
            <p>Fulfillment work is a reliability job with real customers waiting. Orders have deadlines, substitutions need a clear explanation, inventory systems disagree with the shelf, and problems that need a manager should reach one early. Accuracy under time pressure, clear handoffs and escalating instead of guessing are the same habits that make debugging and on-call work go well.</p>
          </div>
        </div>
      </div>
    </>
  );
}
