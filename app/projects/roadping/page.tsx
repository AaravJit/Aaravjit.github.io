import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import { CaseStudyHeader, ExploreProject, ProjectStatus } from '../../../components/ProjectUI';
import { moreProjects, projects, site } from '../../../data/portfolio';

const project = moreProjects.find((item) => item.name === 'RoadPing')!;
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const repo = project.repository;

export const metadata: Metadata = {
  title: 'RoadPing Case Study | Aarav Jit',
  description: 'How RoadPing shows nearby drivers on a live map and carries push-to-talk voice without ever exposing anyone’s exact location.',
  alternates: { canonical: `${site.url}/projects/roadping/` },
  openGraph: { title: 'RoadPing Case Study | Aarav Jit', description: 'A live, map-first voice app for nearby drivers, built on Supabase, PostGIS, and Agora with privacy enforced on the server.', url: `${site.url}/projects/roadping/`, type: 'article', images: ['/social-preview.png'] },
};

const flow = ['Sign in', 'Add vehicle', 'Start RoadPing', 'Heartbeat', 'Nearby query', 'Hold to talk'];
const layers = [
  ['Mobile app', 'Expo Router · React Native · TypeScript · react-native-maps'],
  ['Edge Functions', '15 Deno functions for sessions, location, rooms, voice tokens, blocking, reports, and account deletion'],
  ['Database', 'Postgres with PostGIS, row-level security, and SECURITY DEFINER queries across 9 migrations'],
  ['Presence', '12 s client heartbeat, 25 s presence expiry, pg_cron sweep every minute'],
  ['Voice', 'Agora RTC as transport only, joined with short-lived server-minted tokens'],
  ['Release', 'App Store privacy labels, review notes, IAP setup, and real-device QA checklists'],
] as const;

export default function RoadPingCaseStudy() {
  return <><Navigation /><main className="case-study"><CaseStudyHeader label="Mobile app case study" title="RoadPing" status={project.status} description="A live, map-first voice app for drivers. Tap Start, appear to drivers within your chosen range, and hold a button to talk to them or to a private Drive Room." tags={project.tags} action={{ href: repo, label: 'View Repository ↗' }} />
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">01 — The problem</p><h2>Talk to the drivers around you without telling them where you live</h2></div><div className="case-prose"><p>Drivers on the same road, at the same meet, or in the same convoy have no quick way to talk. Group chats need typing, and sharing a live location with strangers is a real safety risk.</p><p>RoadPing had to make nearby drivers visible and reachable while making sure nobody could learn another user’s exact position, find their home, or keep tracking them after they stop.</p></div></div></section>
    <section className="case-section dark"><div className="container"><p className="case-label">02 — The core flow</p><h2>Invisible until you tap Start</h2><ol className="workflow" aria-label="RoadPing core flow">{flow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><b>{step}</b>{index < flow.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">03 — Key decisions</p><h2>Privacy enforced by the server, not the UI</h2></div><div className="case-prose">
      <h3>Coordinates never leave the database</h3><p>Live positions sit in a <code>location_presence</code> table that has no SELECT policy for any client role. The only way to query it is a SECURITY DEFINER function behind the <a href={`${repo}/blob/main/supabase/functions/get-nearby-drivers/index.ts`} {...external}>get-nearby-drivers</a> Edge Function, which returns driver cards with distance rounded to the nearest 50 m. It also requires the caller to be live and caps the range to what they chose when they started.</p>
      <h3>Private zones and mutual blocking</h3><p>Users save home, work, or custom zones. A PostGIS <code>ST_DWithin</code> check runs when a session starts and on every location update, so nobody goes live near a place they marked private. Blocking works in both directions, and banned or blocked users are filtered out inside the query itself.</p>
      <h3>Presence that disappears on its own</h3><p>The app sends a heartbeat every 12 seconds and each presence row expires after 25 seconds. When the app goes to the background it ends the session right away, and a pg_cron job clears anything left over every minute. No location history is stored.</p>
      <h3>Agora carries audio, Supabase owns identity</h3><p>Drive Rooms use real group audio over Agora. The client never holds the Agora certificate: the <code>create-agora-token</code> function checks room membership or an active session, then mints a short-lived token. Open nearby audio is held back until channels can be assigned by area on the server, so no one ends up on a channel with the whole world.</p>
    </div></div></section>
    <section className="case-section tint"><div className="container"><p className="case-label">04 — Architecture</p><h2>How the pieces fit</h2><div className="architecture-grid">{layers.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="case-section dark"><div className="container case-two-col"><div><p className="case-label">05 — Where it stands</p><h2>Backend and app built, TestFlight next</h2><ProjectStatus status={project.status} /></div><div className="case-prose"><p>Sign-in, vehicles, live sessions, the nearby map, Drive Rooms with live audio, private zones, blocking, reporting, account deletion, and RoadPing Plus subscriptions are implemented. The repository also has the App Store privacy labels, review notes, and a real-device QA plan.</p><p>Next is working through the TestFlight readiness checklist: deploying every function and migration to production, filling in store configuration, and testing on real iPhones.</p><p><a href={repo} {...external}>Browse the source on GitHub ↗</a></p></div></div></section>
    <ExploreProject href={projects.pathway.caseStudy} name="Pathway" detail="Software product case study" />
  </main><footer><div className="container"><b>AJ<span>.</span></b><p>RoadPing case study · In development</p><Link href="/">Home</Link></div></footer></>;
}
