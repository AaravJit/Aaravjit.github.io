import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArchitectureDiagram from '../../../components/ArchitectureDiagram';
import CaseStudy from '../../../components/CaseStudy';
import { Code, external, Story } from '../../../components/ui';
import { projectBySlug } from '../../../data/projects';

const project = projectBySlug('aarav-hyprland');
const file = (path: string) => `${project.repository}/blob/main/${path}`;

export const metadata: Metadata = {
  title: 'Aarav Hyprland case study',
  description: 'A portable Arch Linux and Hyprland installer with hardware detection, validated dry runs, checksummed backups and automatic rollback.',
  alternates: { canonical: '/projects/aarav-hyprland/' },
  openGraph: { type: 'article', title: 'Aarav Hyprland case study', url: '/projects/aarav-hyprland/', images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit' }] },
};

const oldDetector = `# Before: substring matching
if (
    "amd" in lowered
    or "advanced micro devices" in lowered
    or "ati" in lowered        # also true for "Corpor-ati-on"
    or "[1002:" in lowered
) and "amd" not in vendors:
    vendors.append("amd")`;

const newDetector = `PCI_VENDOR_MAP = {"10de": "nvidia", "1002": "amd", "8086": "intel"}

def detect_vendor(line: str) -> str | None:
    """Detect a display controller vendor without substring false positives."""
    # Prefer the actual PCI vendor ID, for example [10de:2882].
    for vendor_id, _device_id in re.findall(
        r"\\[([0-9a-fA-F]{4}):([0-9a-fA-F]{4})\\]", line,
    ):
        vendor = PCI_VENDOR_MAP.get(vendor_id.lower())
        if vendor:
            return vendor

    # Conservative fallback for unusual lspci output, on word boundaries.
    lowered = line.lower()
    if re.search(r"\\bnvidia\\b", lowered):
        return "nvidia"
    if re.search(r"\\badvanced micro devices\\b|\\bamd/ati\\b|\\bati technologies\\b", lowered):
        return "amd"
    if re.search(r"\\bintel\\b", lowered):
        return "intel"
    return None`;

const dropIn = `# systemd/user/waybar.service.d/10-aarav-hyprland-session.conf
[Unit]
After=graphical-session.target
PartOf=graphical-session.target

[Service]
ExecCondition=/usr/bin/sh -c 'case ":\${XDG_CURRENT_DESKTOP:-}:" in *:Hyprland:*) exit 0 ;; *) exit 1 ;; esac'`;

const rollback = `rollback() {
    if ! $backup_created || [[ -z "$backup_dir" ]]; then
        return
    fi
    echo "Installation failed after backup creation; restoring prior state..."
    python "$repo/tools/state-manager.py" restore \\
        --home "$HOME" --backup "$backup_dir" >/dev/null 2>&1 || true
    command -v hyprctl >/dev/null 2>&1 && hyprctl reload >/dev/null 2>&1 || true
}

on_exit() {
    status=$?
    trap - EXIT
    ((status == 0)) || rollback
    cleanup
    exit "$status"
}
trap on_exit EXIT`;

export default function HyprlandCaseStudy() {
  return (
    <CaseStudy
      project={project}
      lede="The Arch Linux and Hyprland desktop I used daily, rebuilt as an installer that detects the hardware, renders the right configuration, validates it before touching anything, and rolls itself back if something fails."
      sections={[
        {
          id: 'problem', label: 'Problem', title: 'One desktop, two very different machines',
          body: <>
            <p>I ran Hyprland on an NVIDIA desktop and an HP OmniBook laptop. Monitor names, GPU environment variables, battery and brightness widgets, and absolute paths all differ between them, so a configuration copied from one machine breaks on the other. Hand-editing after every change didn’t scale, and a bad edit to a compositor config can leave you at a black screen.</p>
            <p><strong>Why it matters:</strong> this is a small version of a real infrastructure problem: one source of truth, many hosts with different hardware, and changes that must be safe to apply to a machine you depend on.</p>
          </>,
        },
        {
          id: 'requirements', label: 'Requirements', title: 'Constraints I set',
          body: <ul>
            <li>One command, no hand-editing per machine. Machine-specific values (<code>__HOME__</code>, <code>__MONITOR__</code>) are tokens rendered at install time.</li>
            <li>A dry run that changes nothing and shows the plan.</li>
            <li>Never leave the machine worse than it started: back up first and restore automatically on any failure.</li>
            <li>Don’t touch KDE Plasma or SDDM, which are installed on the same machines.</li>
          </ul>,
        },
        {
          id: 'architecture', label: 'Architecture', title: 'Detect, render, validate, install',
          body: <>
            <ArchitectureDiagram
              title="Aarav Hyprland installer pipeline"
              width={900}
              height={250}
              nodes={[
                { id: 'detect', label: 'detect-hardware.py', sub: 'lspci · hyprctl · /sys', x: 10, y: 30, w: 190, detail: 'Chooses a desktop or laptop profile and an NVIDIA, AMD, Intel or generic GPU path. Overridable with --profile and --gpu, or fed a JSON fixture with --hardware-json.' },
                { id: 'render', label: 'render-profile.py', sub: 'tokens → staging dir', x: 240, y: 30, w: 190, detail: 'Fills machine-specific tokens and writes a complete configuration into a staging directory, never directly into $HOME.' },
                { id: 'validate', label: 'validate-render.py', sub: 'Lua · JSON · TOML', x: 470, y: 30, w: 190, detail: 'Parses every rendered Lua, JSON and TOML file. A dry run stops here and prints the installation plan.' },
                { id: 'install', label: 'install.sh', sub: 'set -Eeuo pipefail', x: 700, y: 30, w: 190, detail: 'Takes a SHA-256 checksummed backup and the state of each systemd unit, installs, reloads, and checks hyprctl configerrors and doctor.sh.' },
                { id: 'backup', label: 'state-manager.py', sub: 'backup · restore', x: 470, y: 160, w: 190, detail: 'Captures and restores backups. Called by install.sh’s EXIT trap on any failure, and by restore.sh by hand.' },
                { id: 'doctor', label: 'doctor.sh', sub: 'post-install checks', x: 700, y: 160, w: 190, detail: 'Re-checks the installed environment at any time; a failing check during install triggers rollback.' },
              ]}
              edges={[
                { from: 'detect', to: 'render', label: 'profile' },
                { from: 'render', to: 'validate' },
                { from: 'validate', to: 'install', label: 'plan' },
                { from: 'install', to: 'backup', label: 'on failure' },
                { from: 'install', to: 'doctor' },
              ]}
            />
            <p>Select a component to see what it does. Every script named here is in the <a href={project.repository} {...external}>repository</a>.</p>
          </>,
        },
        {
          id: 'debugging', label: 'Debugging', title: 'The detector that found AMD everywhere',
          body: <>
            <p>The first version of <a href={file('tools/detect-hardware.py')} {...external}><code>detect-hardware.py</code></a> identified GPU vendors by searching each <code>lspci</code> display-controller line for vendor names.</p>
            <Story steps={[
              ['Symptom', 'On a machine with no AMD hardware, the detector reported two GPU vendors. That sends the installer into its “Multiple GPU vendors detected” prompt, and unattended --yes runs exit instead of installing.'],
              ['Cause', 'The AMD check included the substring “ati”. lspci names vendors as “NVIDIA Corporation” and “Intel Corporation”, and “Corporation” contains “ati”, so every NVIDIA or Intel line also matched AMD.'],
              ['Fix', 'Identify the vendor from the PCI vendor ID that lspci -nn prints ([10de:…] NVIDIA, [1002:…] AMD, [8086:…] Intel), and fall back to word-boundary regexes only when no ID is present.'],
              ['Result', 'Each controller line maps to exactly one vendor, and the multi-GPU prompt only appears on machines that really have two.'],
            ]} />
            <Code file="tools/detect-hardware.py (before)" code={oldDetector} />
            <Code file="tools/detect-hardware.py (after)" href={file('tools/detect-hardware.py')} code={newDetector} />
            <p>I wrote this up as a note: <Link href="/notes/match-the-identifier/">Match the identifier, not the name</Link>.</p>
          </>,
        },
        {
          id: 'reliability', label: 'Reliability', title: 'Safe to run on a machine I care about',
          body: <>
            <h3>Fail closed, then roll back</h3>
            <p>The installer runs with <code>set -Eeuo pipefail</code>. Before writing anything it captures a backup with SHA-256 checksums and the previous state of each systemd unit. An <code>EXIT</code> trap restores that backup on any non-zero exit, including a failed <code>hyprctl configerrors</code> check or a failing <code>doctor.sh</code> at the end.</p>
            <Code file="install.sh" href={file('install.sh')} code={rollback} />
            <h3>Never touch the other desktop</h3>
            <p>Enabling Waybar or SwayNC as normal user services would start them inside Plasma too. Each service gets a drop-in with an <code>ExecCondition</code>, so systemd skips it unless the session is Hyprland.</p>
            <Code file="systemd drop-in" href={file('systemd/user/waybar.service.d/10-aarav-hyprland-session.conf')} code={dropIn} />
            <h3>Reloads that can’t lock me out</h3>
            <p><a href={file('scripts/hypr-safe-reload')} {...external}><code>hypr-safe-reload</code></a> copies the current config, checks every Lua file with <code>luac -p</code>, reloads, and reads <code>hyprctl configerrors</code>. If Hyprland rejects the config it restores the copy, keeps the broken files for inspection, and shows a notification. A systemd timer also snapshots the config daily.</p>
          </>,
        },
        {
          id: 'testing', label: 'Validation', title: 'How it was tested',
          body: <>
            <ul className="checklist">
              <li>Installed and used daily on my NVIDIA desktop and HP OmniBook while Linux was my main OS.</li>
              <li>Every install renders and validates in a dry run before anything is written.</li>
              <li>Two JSON hardware fixtures (<a href={file('tests/fixtures/intel-laptop.json')} {...external}>Intel laptop</a>, <a href={file('tests/fixtures/amd-laptop.json')} {...external}>AMD laptop</a>) render and validate profiles for hardware I don’t own.</li>
            </ul>
            <ul className="checklist todo">
              <li>No automated test suite runs in CI yet; validation is the dry run plus manual installs.</li>
              <li>The AMD and generic GPU paths have not been installed on real AMD hardware.</li>
            </ul>
          </>,
        },
        {
          id: 'outcome', label: 'Outcome', title: 'Screenshots and status',
          body: <>
            <figure className="shot"><Image src="/hyprlandproof.webp" width={1920} height={804} sizes="(max-width: 920px) calc(100vw - 32px), 860px" alt="Configured Hyprland desktop with application launcher and system panels on Arch Linux" /></figure>
            <figcaption>The installed environment on my ultrawide desktop.</figcaption>
            <figure className="shot" style={{ marginTop: '1.4rem' }}><Image src="/hyprlandproofterminal.webp" width={1920} height={804} sizes="(max-width: 920px) calc(100vw - 32px), 860px" alt="Terminal windows open in the Aarav Hyprland Arch Linux environment" /></figure>
            <figcaption>Kitty terminals themed from the wallpaper by Matugen.</figcaption>
            <p>I used this setup as my daily environment while Linux was my main OS. I’ve since moved my daily machine back to Windows 11; the repository remains the reference for how I structure safe, repeatable system changes.</p>
          </>,
        },
        {
          id: 'next', label: 'Next', title: 'Limitations and next steps',
          body: <ul>
            <li>Install on real AMD hardware to confirm that path.</li>
            <li>Run the dry run against both fixtures in GitHub Actions on every push.</li>
            <li>Cut a first tagged release.</li>
          </ul>,
        },
      ]}
    />
  );
}
