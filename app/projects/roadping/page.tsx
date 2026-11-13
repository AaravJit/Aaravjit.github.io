import type { Metadata } from 'next';
import Link from 'next/link';
import ArchitectureDiagram from '../../../components/ArchitectureDiagram';
import CaseStudy from '../../../components/CaseStudy';
import { Code, external } from '../../../components/ui';
import { projectBySlug } from '../../../data/projects';

const project = projectBySlug('roadping');
const repo = project.repository!;
const file = (path: string) => `${repo}/blob/main/${path}`;

export const metadata: Metadata = {
  title: 'RoadPing case study',
  description: 'How RoadPing shows nearby drivers and carries push-to-talk voice without exposing anyone’s location: no client access to coordinates, distance bands, private zones and expiring presence.',
  alternates: { canonical: '/projects/roadping/' },
  openGraph: { type: 'article', title: 'RoadPing case study', url: '/projects/roadping/', images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit' }] },
};

const band = `CREATE OR REPLACE FUNCTION private.distance_band_for(p_distance_m double precision)
RETURNS public.distance_band
…
    WHEN p_distance_m <= 800  THEN 'within_800m'::public.distance_band
    WHEN p_distance_m <= 1600 THEN '800m_to_1600m'::public.distance_band
    WHEN p_distance_m <= 3200 THEN '1600m_to_3200m'::public.distance_band
    ELSE                           'beyond_3200m'::public.distance_band`;

const holds = `CREATE TABLE IF NOT EXISTS private.proximity_band_holds (
  caller_id         uuid                 NOT NULL REFERENCES public.profiles(id)      ON DELETE CASCADE,
  target_session_id uuid                 NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  band              public.distance_band NOT NULL,
  held_until        timestamptz          NOT NULL,
  PRIMARY KEY (caller_id, target_session_id)
);

ALTER TABLE private.proximity_band_holds ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.proximity_band_holds FROM PUBLIC, anon, authenticated, service_role;`;

export default function RoadPingCaseStudy() {
  return (
    <CaseStudy
      project={project}
      lede="A live, map-first voice app for drivers. Tap Start, become visible to drivers within your chosen range, and hold a button to talk to them or to a private Drive Room, without anyone learning where you are."
      sections={[
        {
          id: 'problem', label: 'Problem', title: 'Talk to the drivers around you without telling them where you live',
          body: <>
            <p>Drivers on the same road, at the same meet or in the same convoy have no quick way to talk. Group chats need typing, and sharing a live location with strangers is a real safety risk.</p>
            <p><strong>Why it matters:</strong> the product is about proximity, so the location data is the product’s most dangerous asset. RoadPing had to make nearby drivers visible and reachable while making sure nobody could learn another user’s position, find their home, or keep tracking them after they stop.</p>
          </>,
        },
        {
          id: 'requirements', label: 'Constraints', title: 'Rules the server enforces, not the UI',
          body: <ul>
            <li>No client role can read raw coordinates, ever.</li>
            <li>Nobody is visible near a place they marked private (home, work, custom zones).</li>
            <li>Presence expires on its own; no location history is kept.</li>
            <li>Blocking is mutual, and blocked or banned users are filtered inside the query.</li>
            <li>The voice provider never sees identity rules; the server decides who may join which channel.</li>
          </ul>,
        },
        {
          id: 'architecture', label: 'Architecture', title: 'How the pieces fit',
          body: <>
            <ArchitectureDiagram
              title="RoadPing architecture"
              width={900}
              height={330}
              zones={[{ label: 'Supabase', x: 230, y: 10, w: 450, h: 310 }]}
              nodes={[
                { id: 'app', label: 'iOS app', sub: 'Expo · React Native', x: 20, y: 130, w: 180, detail: 'Sends a heartbeat every 12 seconds while live and ends the session as soon as the app goes to the background. Never receives another user’s coordinates.' },
                { id: 'fn', label: 'Edge Functions', sub: '15 Deno functions', x: 250, y: 40, w: 190, detail: 'Sessions, location updates, nearby drivers, rooms, voice tokens, blocking, reports and account deletion. The nearby function copies only whitelisted fields into its response.' },
                { id: 'definer', label: 'Definer functions', sub: 'SECURITY DEFINER', x: 250, y: 150, w: 190, detail: 'The only path to location data. get_nearby_drivers_v3 takes no range or coordinates from the request and returns a distance band, never a number.' },
                { id: 'presence', label: 'location_presence', sub: 'no client SELECT', x: 470, y: 150, w: 190, detail: 'Live positions. No SELECT policy exists for any client role, so even a modified app cannot read it.' },
                { id: 'holds', label: 'proximity_band_holds', sub: 'private schema', x: 470, y: 40, w: 190, detail: 'Holds the band each viewer sees for each target session for 30 seconds, so polling can’t sample fresh values faster than that.' },
                { id: 'cron', label: 'pg_cron sweep', sub: 'every minute', x: 470, y: 255, w: 190, detail: 'Presence expires after 25 seconds; the sweep removes anything left over and purges expired holds.' },
                { id: 'agora', label: 'Agora RTC', sub: 'audio transport only', x: 710, y: 40, w: 170, detail: 'Carries Drive Room audio. The client never holds the Agora certificate; create-agora-token checks membership and mints a short-lived token.' },
              ]}
              edges={[
                { from: 'app', to: 'fn', label: 'JWT' },
                { from: 'fn', to: 'definer' },
                { from: 'definer', to: 'presence' },
                { from: 'definer', to: 'holds' },
                { from: 'cron', to: 'presence' },
                { from: 'fn', to: 'agora', label: 'token' },
              ]}
            />
          </>,
        },
        {
          id: 'decision', label: 'Key decision', title: 'From a rounded distance to a held distance band',
          body: <>
            <p>The first version returned each nearby driver’s distance rounded to 50 m and ordered the list by exact distance. That looks harmless, but an attacker with a GPS spoofer and patience can poll it from several positions and trilaterate a person. The repository’s threat model lists every channel that leaked precision: repeated polling, a client-chosen range parameter, session restarts at different ranges, ordering, and even a map pin drawn along an invented bearing.</p>
            <p>The redesign (migration <a href={file('supabase/migrations/20260930000012_privacy_safe_proximity.sql')} {...external}>012</a>, with a <a href={file('docs/PHASE2_PROXIMITY_PRIVACY.md')} {...external}>written design and threat model</a>):</p>
            <ul>
              <li>Clients get one of four bands: within 800 m, 0.8–1.6 km, 1.6–3.2 km, or beyond. Both positions are snapped to a ~250 m grid before any distance is computed.</li>
              <li>Each band is held for 30 seconds per viewer and target session, so refetching returns the same value.</li>
              <li>Selectable ranges were reduced to the band edges, so restarting a session at different ranges reveals nothing finer than the band.</li>
              <li>The list is ordered by band, then name, and strangers are no longer drawn on the map.</li>
            </ul>
            <Code file="supabase/migrations/20260930000012_privacy_safe_proximity.sql" href={file('supabase/migrations/20260930000012_privacy_safe_proximity.sql')} code={band} />
            <Code file="supabase/migrations/20260930000012_privacy_safe_proximity.sql" href={file('supabase/migrations/20260930000012_privacy_safe_proximity.sql')} code={holds} />
            <p>The design document is explicit that coarse proximity can’t make inference impossible; the goal is to remove precision the product doesn’t need and make probing slow and coarse. Longer write-up: <Link href="/notes/location-privacy-distance-bands/">Why RoadPing stopped returning distances</Link>.</p>
          </>,
        },
        {
          id: 'security', label: 'Security', title: 'The rest of the privacy model',
          body: <>
            <h3>Private zones and mutual blocking</h3>
            <p>Users save home, work or custom zones. A PostGIS <code>ST_DWithin</code> check runs when a session starts and on every location update, so nobody goes live near a place they marked private. Blocking works in both directions.</p>
            <h3>Presence that disappears on its own</h3>
            <p>A 12-second heartbeat, a 25-second expiry and a one-minute pg_cron sweep. No location history is stored.</p>
            <h3>Locked-down functions</h3>
            <p>A September 2026 hardening pass revoked client EXECUTE on platform helper functions, pinned function <code>search_path</code>s, and made proximity use the caller’s stored, trusted presence instead of coordinates in the request (<a href={file('docs/SECURITY_LOCKDOWN.md')} {...external}>SECURITY_LOCKDOWN.md</a>).</p>
          </>,
        },
        {
          id: 'testing', label: 'Validation', title: 'How it is tested',
          body: <ul className="checklist">
            <li>pgTAP suites for the security lockdown, function hardening, production parity and Phase 2 proximity privacy.</li>
            <li>The proximity suite restarts an attacker’s session at 100 ranges against a target at 23 distances (2,300 restarts) and checks the observations split into exactly five classes: the four bands and out of range.</li>
            <li>Deno tests for the nearby-drivers handler and request validation; Node tests for client band handling; a concurrency script for simultaneous requests.</li>
          </ul>,
        },
        {
          id: 'status', label: 'Status', title: 'Built, not yet on TestFlight',
          body: <>
            <p>Sign-in, vehicles, live sessions, the nearby list, Drive Rooms with live audio, private zones, blocking, reporting, account deletion and RoadPing Plus subscriptions are implemented, with App Store privacy labels, review notes and a real-device QA plan in the repository.</p>
            <ul className="checklist todo">
              <li>Deploy every function and migration to production and work through the TestFlight readiness checklist.</li>
              <li>Test on real iPhones.</li>
              <li>Open nearby audio is held back until channels can be assigned by area on the server.</li>
            </ul>
            <p>The code was produced with AI coding agents on reviewed branches; the privacy requirements and the review of each change were mine.</p>
          </>,
        },
      ]}
    />
  );
}
