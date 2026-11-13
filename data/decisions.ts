/**
 * Architecture decision records drawn from real repositories. Each one names its source so the
 * claim can be checked. Excerpts are copied from the linked files (lightly trimmed, marked "…").
 */
export interface Decision {
  id: string;
  title: string;
  project: string;
  projectHref: string;
  context: string;
  options: readonly string[];
  decision: string;
  tradeoffs: string;
  result: string;
  /** What I would change with more time, when there is an honest answer. */
  revisit?: string;
  excerpt?: { file: string; href?: string; code: string };
  /** True for work produced during the November 2026 portfolio rebuild, so it is not mistaken for older history. */
  newWork?: boolean;
}

export const decisions: readonly Decision[] = [
  {
    id: 'location-bands',
    title: 'Return a distance band, never a distance',
    project: 'RoadPing',
    projectHref: '/projects/roadping/',
    context: 'RoadPing shows drivers who are near you. The first version returned each driver’s distance rounded to 50 m. A patient user with a GPS spoofer could poll that number from several positions and trilaterate someone’s location, which matters most when the someone is near their home.',
    options: [
      'Keep the rounded distance and rate-limit requests.',
      'Add random noise to each distance.',
      'Return only a coarse band, computed from grid-snapped positions, and hold it per viewer.',
    ],
    decision: 'Clients receive one of four fixed bands (within 800 m, 0.8–1.6 km, 1.6–3.2 km, beyond). Both positions are snapped to a ~250 m grid before any distance is computed, each band is held for 30 seconds per viewer and target session, and the request body no longer carries a range to probe with.',
    tradeoffs: 'Less precision in the UI, and strangers are no longer drawn as pins on the map. Fresh noise would have averaged out over repeated requests; a held, quantized band does not.',
    result: 'The design, threat model and rollout are written up in the repository, with pgTAP, Deno and Node tests and a concurrency script. Repeated polling now returns the held value.',
    revisit: 'Range-edge visibility (whether someone appears at all) is still evaluated fresh each request; the threat-model document lists it as residual observability.',
    excerpt: {
      file: 'supabase/migrations/20260930000012_privacy_safe_proximity.sql',
      href: 'https://github.com/AaravJit/RoadPing/blob/main/supabase/migrations/20260930000012_privacy_safe_proximity.sql',
      code: `CREATE OR REPLACE FUNCTION private.distance_band_for(p_distance_m double precision)
RETURNS public.distance_band
…
    WHEN p_distance_m <= 800  THEN 'within_800m'::public.distance_band
    WHEN p_distance_m <= 1600 THEN '800m_to_1600m'::public.distance_band
    WHEN p_distance_m <= 3200 THEN '1600m_to_3200m'::public.distance_band
    ELSE                           'beyond_3200m'::public.distance_band`,
    },
  },
  {
    id: 'rls-in-database',
    title: 'Put authorization in the database, not only the API',
    project: 'Pathway',
    projectHref: '/projects/pathway/',
    context: 'Pathway stores resumes, which are personal data. The Next.js API routes check the session, but any route added later could forget to.',
    options: ['Check ownership in each API route.', 'Enable Postgres row-level security and let the database enforce ownership for every query.'],
    decision: 'Row-level security is enabled on all four tables, and every policy compares auth.uid() with the row owner.',
    tradeoffs: 'Policies are another thing to test, and a service-role key bypasses them, so it must never reach the client.',
    result: 'A query from the browser can only ever return the signed-in user’s rows, whatever route issued it.',
    excerpt: {
      file: 'supabase/migrations/…_pathway_schema.sql (private repository)',
      code: `alter table resume_versions enable row level security;

create policy "resume_versions_select_own" on resume_versions
  for select using (auth.uid() = user_id);`,
    },
  },
  {
    id: 'untrusted-model-output',
    title: 'Treat model output as untrusted input',
    project: 'Pathway',
    projectHref: '/projects/pathway/',
    context: 'The job-fit route asks the OpenAI Responses API for strict JSON. A schema request is not a guarantee: fields can be missing, mistyped or out of range, and an unvalidated score of 140 or a made-up verdict would reach the UI.',
    options: ['Trust the requested schema.', 'Parse and validate every field on the server and fall back to safe defaults.'],
    decision: 'A sanitizer type-checks every field, clamps the score to 0–100, restricts the verdict to four values and caps each list at six well-formed items. The prompt itself forbids inventing experience.',
    tradeoffs: 'More code per model call, and a malformed response shows a conservative result instead of an error.',
    result: 'Malformed output degrades to a safe default instead of crashing the page or showing an impossible score.',
    excerpt: {
      file: 'app/api/job-fit/route.ts (private repository)',
      code: `const allowedVerdicts = new Set(["ready", "competitive", "stretch", "gap"]);
const verdict = allowedVerdicts.has(String(source.verdict))
  ? (source.verdict as JobFitResult["verdict"])
  : "gap";
…
overallScore: Math.max(0, Math.min(100, Math.round(rawScore))),`,
    },
  },
  {
    id: 'pdf-lib',
    title: 'Draw PDFs directly instead of running a browser',
    project: 'Pathway',
    projectHref: '/projects/pathway/',
    context: 'The first renderer printed an HTML resume to PDF with Playwright and a bundled Chromium inside a Vercel serverless function.',
    options: ['Keep headless Chromium.', 'Use a hosted PDF service.', 'Lay out the page with pdf-lib.'],
    decision: 'Rewrote the render route on pdf-lib: embed Helvetica, measure each word with widthOfTextAtSize to wrap lines, and add pages at the bottom margin.',
    tradeoffs: 'No CSS layout, so typography is simpler and multi-column designs would be manual work.',
    result: 'Two dependencies removed, 450 lines deleted for 275 added, and identical output wherever the function runs.',
  },
  {
    id: 'pci-ids',
    title: 'Match the machine identifier, not the human-readable name',
    project: 'Aarav Hyprland',
    projectHref: '/projects/aarav-hyprland/',
    context: 'The installer picks a GPU configuration from lspci output. The first detector searched each line for vendor names, including the substring “ati”.',
    options: ['Add more exclusions to the substring check.', 'Read the PCI vendor ID that lspci -nn prints and fall back to word-boundary matches.'],
    decision: 'Map vendor IDs 10de, 1002 and 8086 to NVIDIA, AMD and Intel; use word-boundary regexes only when no ID is present.',
    tradeoffs: 'Depends on lspci -nn output format; the fallback still exists for unusual output.',
    result: '“NVIDIA Corporation” no longer matches AMD, so the multi-GPU prompt only appears on machines that really have two vendors, and unattended installs no longer exit.',
    excerpt: {
      file: 'tools/detect-hardware.py',
      href: 'https://github.com/AaravJit/aarav-hyprland/blob/main/tools/detect-hardware.py',
      code: `PCI_VENDOR_MAP = {"10de": "nvidia", "1002": "amd", "8086": "intel"}

for vendor_id, _device_id in re.findall(
    r"\\[([0-9a-fA-F]{4}):([0-9a-fA-F]{4})\\]", line,
):
    vendor = PCI_VENDOR_MAP.get(vendor_id.lower())
    if vendor:
        return vendor`,
    },
  },
  {
    id: 'fail-closed',
    title: 'Fail closed, then roll back automatically',
    project: 'Aarav Hyprland',
    projectHref: '/projects/aarav-hyprland/',
    context: 'An installer that rewrites a working desktop can leave a machine unusable halfway through.',
    options: ['Print manual recovery steps.', 'Back up first and restore from an EXIT trap on any failure.'],
    decision: 'install.sh runs under set -Eeuo pipefail, takes a SHA-256 checksummed backup and the prior state of each systemd unit, and restores it if the script exits non-zero, including a failed hyprctl configerrors check.',
    tradeoffs: 'Install takes longer and uses disk for backups; a bug in the restore path itself would be serious, so restore.sh can also be run by hand.',
    result: 'A failed install returns the machine to its previous configuration without manual steps.',
    excerpt: {
      file: 'install.sh',
      href: 'https://github.com/AaravJit/aarav-hyprland/blob/main/install.sh',
      code: `on_exit() {
    status=$?
    trap - EXIT
    ((status == 0)) || rollback
    cleanup
    exit "$status"
}
trap on_exit EXIT`,
    },
  },
  {
    id: 'race-safe-unlock',
    title: 'Spend credits inside one locked database function',
    project: 'Deal AI v2',
    projectHref: '/work/#deal-ai',
    context: 'Free users get a limited number of listing unlocks. Two quick clicks, or two tabs, could both read “1 unlock left” and both succeed.',
    options: ['Check and decrement in application code.', 'Do the check and the decrement in one Postgres function that locks the user’s row.'],
    decision: 'Unlocks go through a single function that takes a row lock on the user before checking and spending.',
    tradeoffs: 'Concurrent unlocks by the same user are serialized, which is harmless at this scale.',
    result: 'Two concurrent requests cannot spend the same unlock twice.',
  },
  {
    id: 'job-claims',
    title: 'Claim queued jobs atomically, and retry with backoff',
    project: 'HireStudio',
    projectHref: '/work/#hirestudio',
    context: 'HireStudio generates tailored resumes as queued jobs. A cron-triggered worker reads up to five queued jobs, then each job checks its status and updates it to running in a separate query.',
    options: ['Keep read-then-update and hope cron runs never overlap.', 'Claim with a conditional update (UPDATE … WHERE status = \'queued\') or SELECT … FOR UPDATE SKIP LOCKED.', 'Move to a managed queue.'],
    decision: 'This is a retrospective: the prototype shipped with read-then-update and no retries. The fix I would make is an atomic claim plus a bounded retry count with exponential backoff and jitter, and a dead-letter state.',
    tradeoffs: 'Retries can amplify load during an outage, which is why the backoff needs a cap and jitter, and why permanent errors (a missing profile) should not be retried at all.',
    result: 'The Engineering Lab’s scheduler simulator models exactly this: bounded attempts, capped exponential backoff, jitter and dead-lettering, with tests.',
    revisit: 'Implement the atomic claim in HireStudio and add a test that runs two workers against one queue.',
    excerpt: {
      file: 'src/lib/generation.ts',
      href: 'https://github.com/AaravJit/HireStudio/blob/main/src/lib/generation.ts',
      code: `if (!job) return;
if (job.status !== 'queued') return;   // read…

await prisma.generationJob.update({   // …then write: another worker can pass the check in between
  where: { id: jobId },
  data: { status: 'running', progress: 10 }
});`,
    },
  },
  {
    id: 'gps-filter',
    title: 'Drop doubtful GPS fixes rather than keep them',
    project: 'Pull Up',
    projectHref: '/projects/pull-up/',
    context: 'Pull Up records drives and reports statistics such as top speed and 0–60 times. One bad GPS fix can produce a phantom 140 mph top speed.',
    options: ['Smooth every fix.', 'Reject fixes that fail accuracy, ordering and physical-plausibility checks, and count why.'],
    decision: 'A stateless SampleFilter rejects fixes worse than 35 m accuracy, out-of-order or duplicate fixes, jumps faster than 120 m/s and accelerations above 16 m/s², and counts each rejection reason per drive.',
    tradeoffs: 'A dropped good fix costs a second of resolution; that is cheaper than a wrong headline number.',
    result: 'The filter lives in a pure-Swift module with unit tests, so its thresholds can be ported line for line to an Android client.',
    excerpt: {
      file: 'native/ios/Packages/PullUpKit/Sources/PullUpTelemetry/SampleFilter.swift',
      href: 'https://github.com/AaravJit/pull-up/blob/main/native/ios/Packages/PullUpKit/Sources/PullUpTelemetry/SampleFilter.swift',
      code: `/// Thresholds are deliberately conservative: a dropped good fix costs a second
/// of resolution, an accepted bad fix can add a phantom 140 mph top speed.
public var maxHorizontalAccuracy: Double = 35
public var maxPlausibleSpeed: Double = 120 // m/s ≈ 268 mph
public var maxPlausibleAcceleration: Double = 16 // m/s²`,
    },
  },
  {
    id: 'static-export',
    title: 'Keep the portfolio a static export, and upgrade the framework',
    project: 'This portfolio',
    projectHref: '/work/#portfolio',
    context: 'The site ran Next.js 14.2.35, the last 14.x release. npm audit reported a critical Next.js advisory whose fixed versions start in the 16.x line, plus high-severity transitive issues.',
    options: ['Stay on 14 and accept the advisory because a static export runs no Next.js server.', 'Upgrade to Next.js 16 and React 19 and keep static export.', 'Move to a different static-site generator.'],
    decision: 'Upgraded to Next.js 16 and React 19 and kept output: export for GitHub Pages. Durations and GitHub activity are computed in the browser, so the static HTML never claims a date-dependent value it cannot keep current.',
    tradeoffs: 'A framework major upgrade in the same change as a redesign; mitigated by type checks, unit tests, a link and metadata checker on the built output, and Lighthouse runs.',
    result: 'npm audit reports no production vulnerabilities after the upgrade. Remaining dev-only advisories are listed in the changelog.',
    newWork: true,
  },
];
