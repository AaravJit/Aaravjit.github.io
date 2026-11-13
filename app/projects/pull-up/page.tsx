import type { Metadata } from 'next';
import ArchitectureDiagram from '../../../components/ArchitectureDiagram';
import CaseStudy from '../../../components/CaseStudy';
import { Code, external } from '../../../components/ui';
import { projectBySlug } from '../../../data/projects';

const project = projectBySlug('pull-up');
const repo = project.repository!;
const file = (path: string) => `${repo}/blob/main/${path}`;

export const metadata: Metadata = {
  title: 'Pull Up case study',
  description: 'A native Swift iOS app on Supabase whose privacy rules are enforced in Postgres and covered by pgTAP tests, with a written security assessment and a CI-signed build accepted by App Store Connect.',
  alternates: { canonical: '/projects/pull-up/' },
  openGraph: { type: 'article', title: 'Pull Up case study', url: '/projects/pull-up/', images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit' }] },
};

const filter = `/// Stateless gatekeeper for raw fixes. Thresholds are deliberately
/// conservative: a dropped good fix costs a second of resolution, an accepted
/// bad fix can add a phantom 140 mph top speed.
public struct SampleFilter: Sendable {
    public struct Configuration: Sendable {
        /// Fixes with worse horizontal accuracy are discarded outright.
        /// Cell/Wi-Fi fixes (≥ 65 m) never pass.
        public var maxHorizontalAccuracy: Double = 35
        /// No production road vehicle sustains this; anything faster between
        /// two fixes is a position jump.
        public var maxPlausibleSpeed: Double = 120 // m/s ≈ 268 mph
        /// Peak sustained longitudinal acceleration of very fast road cars is
        /// ~1.3 g. Above 1.6 g between Doppler readings is a sensor glitch.
        public var maxPlausibleAcceleration: Double = 16 // m/s²`;

const findings = [
  ['G1', 'Medium', 'Anyone allowed to see a drive could read the ~1 km grid cells it passed through, which traced the route even when it was never shared.', 'Cells moved to a private table read only by the leaderboard.'],
  ['G2', 'Medium', 'Shared routes were trimmed by a random 0–250 m, re-drawn on every rebuild; comparing rebuilds narrowed down the real start and end.', 'The trim is drawn once per drive and stored privately.'],
  ['G3', 'Medium', 'Videos were uploaded as picked, so a clip’s GPS location went to everyone who could see the post.', 'Rewrapped with AVMetadataItemFilter.forSharing() before upload.'],
  ['G10', 'Low', 'The session refresh token used a keychain class that moves to a new phone in an encrypted backup.', 'Stored as AfterFirstUnlockThisDeviceOnly; existing sessions migrated on first read.'],
] as const;

export default function PullUpCaseStudy() {
  return (
    <CaseStudy
      project={project}
      lede="A social map and garage for car and motorcycle enthusiasts. Rebuilt from an Expo prototype into a native Swift app on Supabase, where the privacy rules live in Postgres and every security fix comes with a test that fails without it."
      sections={[
        {
          id: 'problem', label: 'Problem', title: 'A social app built on the most sensitive data a phone has',
          body: <>
            <p>Car and motorcycle meets are organized across scattered group chats. Pull Up lets people record drives, share builds in a garage, message each other and find meets. Almost every feature touches location: where a drive started, which roads it took, who was nearby.</p>
            <p><strong>Why it matters:</strong> a route that starts and ends at the same place every night reveals where someone lives. The engineering problem is to make sharing useful while making sure the server, not the app, decides what anyone else can see.</p>
          </>,
        },
        {
          id: 'role', label: 'My role', title: 'Product owner and engineering lead, with an agent writing the code',
          body: <>
            <p>Most commits in the repository are by an AI coding agent (Claude Code) working on branches I reviewed and merged; the commit history shows this. My part:</p>
            <ul>
              <li>Defined the product and its phases, and the privacy and security requirements each phase had to meet.</li>
              <li>Reviewed and merged every pull request.</li>
              <li>Did the account and dashboard work an agent can’t: Apple Developer and App Store Connect setup, and enabling the sign-up hook and the Apple provider on the staging project.</li>
            </ul>
          </>,
        },
        {
          id: 'architecture', label: 'Architecture', title: 'Layered Swift packages on a tested Postgres contract',
          body: <>
            <ArchitectureDiagram
              title="Pull Up architecture"
              width={900}
              height={340}
              zones={[{ label: 'iOS app · PullUpKit Swift package', x: 10, y: 10, w: 430, h: 320 }, { label: 'Supabase', x: 470, y: 10, w: 420, h: 320 }]}
              nodes={[
                { id: 'features', label: 'PullUpFeatures', sub: 'screens · view models', x: 30, y: 40, w: 180, detail: 'SwiftUI screens and view models, the single AppModel, DriveRecorder and GarageStore.' },
                { id: 'data', label: 'PullUpData', sub: 'BackendService', x: 240, y: 40, w: 180, detail: 'The BackendService protocol with SupabaseBackend, a labeled DemoBackend for CI screenshots, and an offline LocalDriveStore that retries uploads.' },
                { id: 'telemetry', label: 'PullUpTelemetry', sub: 'pure Swift', x: 30, y: 150, w: 180, detail: 'GPS sample filter, drive statistics, 0–60 detection and route simplification and redaction. No Apple UI frameworks, so the rules can be ported to Android line for line.' },
                { id: 'domain', label: 'PullUpDomain', sub: 'wire models', x: 240, y: 150, w: 180, detail: 'Wire models whose snake_case keys mirror the Postgres schema. Lower layers never import higher ones.' },
                { id: 'location', label: 'PullUpLocation', sub: 'CoreLocation · replay', x: 30, y: 260, w: 180, detail: 'A LocationProvider protocol with a CoreLocation implementation and a replay provider used in tests.' },
                { id: 'pg', label: 'Postgres + RLS', sub: '36 migrations', x: 490, y: 60, w: 180, detail: 'The wire contract. Forward migrations with matching rollbacks; row-level security and definer-function audits covered by 30 pgTAP files.' },
                { id: 'edge', label: 'Edge Functions', sub: 'Deno', x: 700, y: 60, w: 170, detail: 'Account deletion, APNs push, DM retention, media cleanup, subscription verification and signed App Store notifications.' },
                { id: 'storage', label: 'Storage', sub: 'per-account quotas', x: 490, y: 200, w: 180, detail: 'Media buckets with per-file limits and a 2 GB / 5,000-file per-account quota enforced in the database.' },
                { id: 'apple', label: 'Apple', sub: 'Sign in · StoreKit · APNs', x: 700, y: 200, w: 170, detail: 'Apple-only sign-up enforced by an auth hook; Pro state comes only from the server’s verified entitlement, never from local StoreKit state.' },
              ]}
              edges={[
                { from: 'features', to: 'data' },
                { from: 'features', to: 'telemetry' },
                { from: 'data', to: 'domain' },
                { from: 'features', to: 'location' },
                { from: 'data', to: 'pg', label: 'PostgREST' },
                { from: 'pg', to: 'edge' },
                { from: 'pg', to: 'storage' },
                { from: 'edge', to: 'apple', label: 'JWS verified' },
              ]}
            />
            <p>Source: <a href={file('docs/ARCHITECTURE.md')} {...external}>docs/ARCHITECTURE.md</a>.</p>
          </>,
        },
        {
          id: 'decision', label: 'Decision', title: 'Drop doubtful GPS fixes rather than keep them',
          body: <>
            <p>Drive statistics such as top speed and 0–60 times are the feature people share, and one bad GPS fix can produce a phantom 140 mph. The filter rejects fixes on accuracy, ordering, duplication and physical plausibility, and counts each rejection reason per drive so the summary can say how clean the data was.</p>
            <Code file="native/ios/Packages/PullUpKit/Sources/PullUpTelemetry/SampleFilter.swift" href={file('native/ios/Packages/PullUpKit/Sources/PullUpTelemetry/SampleFilter.swift')} code={filter} />
          </>,
        },
        {
          id: 'security', label: 'Security', title: 'A security assessment with regression tests',
          body: <>
            <p>The repository’s <a href={file('docs/SECURITY_REPORT.md')} {...external}>security report</a> records two passes: an assessment on 2026-10-17 (SEC-01 to SEC-07, including a high-severity issue where internal helper functions were callable by any signed-in user) and a Phase 3 re-check on 2026-10-18 (G1 to G13, with G12 withdrawn). The report opens with the right caveat: passing tests don’t make the app secure; they show that these specific weaknesses are closed. A sample of the Phase 3 findings:</p>
            <div className="table-scroll">
              <table className="compare" style={{ whiteSpace: 'normal' }}>
                <caption className="sr-only">Selected security findings and fixes</caption>
                <thead><tr><th scope="col">ID</th><th scope="col">Severity</th><th scope="col" style={{ textAlign: 'left' }}>Finding</th><th scope="col" style={{ textAlign: 'left' }}>Fix</th></tr></thead>
                <tbody>{findings.map(([id, sev, finding, fix]) => <tr key={id}><td>{id}</td><td>{sev}</td><td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{finding}</td><td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{fix}</td></tr>)}</tbody>
              </table>
            </div>
          </>,
        },
        {
          id: 'testing', label: 'Validation', title: 'What has and hasn’t been verified',
          body: <>
            <ul className="checklist">
              <li>30 pgTAP files covering row-level security, privacy, messaging, rate limits, moderation and storage; files 001–014 passed 262 of 262 checks on the hosted staging project on 2026-10-20.</li>
              <li>Two-account API tests over the full local stack (auth, REST, realtime, storage, Edge Functions) run in CI; 133 of 133 passed against staging on 2026-10-18.</li>
              <li>Swift package unit tests and simulator UI journeys run in GitHub Actions and regenerate screenshots of every major screen.</li>
              <li>Signed build 0.1.0 (233) archived with Apple cloud signing in CI and accepted by App Store Connect on 2026-10-24.</li>
            </ul>
            <ul className="checklist todo">
              <li>No test has run on a physical iPhone yet; the device test plan is written but empty.</li>
              <li>No production Supabase project exists; the staging deploy workflow has not completed a run.</li>
              <li>Pro subscriptions are deferred; no products exist in App Store Connect.</li>
            </ul>
          </>,
        },
        {
          id: 'next', label: 'Next', title: 'Next steps',
          body: <ul>
            <li>Confirm App Store Connect processing and install the build through TestFlight.</li>
            <li>Work through the device test plan on a real iPhone and record each result.</li>
            <li>Run the staging deploy workflow end to end, then create production.</li>
          </ul>,
        },
      ]}
    />
  );
}
