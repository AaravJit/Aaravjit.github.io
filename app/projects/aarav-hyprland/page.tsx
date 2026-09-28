import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import { CaseStudyHeader, CodeSample, EngineeringStory, ExploreProject, RoleBlock } from '../../../components/ProjectUI';
import { projects, site } from '../../../data/portfolio';

const project = projects.hyprland;
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const file = (path: string) => `${project.repository}/blob/main/${path}`;

export const metadata: Metadata = {
  title: 'Aarav Hyprland Case Study | Aarav Jit',
  description: 'How I turned my Arch Linux and Hyprland desktop into a portable installer with hardware detection, validated dry runs, checksummed backups, and automatic rollback.',
  alternates: { canonical: `${site.url}/projects/aarav-hyprland/` },
  openGraph: {
    title: 'Aarav Hyprland Case Study | Aarav Jit',
    description: 'A portable Arch Linux and Hyprland installer with hardware detection, dry runs, backups, and rollback.',
    url: `${site.url}/projects/aarav-hyprland/`,
    type: 'article',
    images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit — Software, Linux and Systems' }],
  },
  twitter: { card: 'summary_large_image', title: 'Aarav Hyprland Case Study | Aarav Jit', description: 'A portable Arch Linux and Hyprland installer with dry runs, backups, and rollback.', images: ['/social-preview.png'] },
};

const role = [
  'Split my working desktop into renderable source: machine-specific values such as __HOME__ and __MONITOR__ are tokens filled in at install time.',
  'Wrote the hardware detector that picks a desktop or laptop profile and an NVIDIA, AMD, Intel, or generic GPU path from lspci, hyprctl, and /sys.',
  'Built the installer: a validated dry run, SHA-256 checksummed backups, automatic rollback on any failure, plus doctor.sh and restore.sh.',
  'Scoped every systemd user service to Hyprland sessions so KDE Plasma and SDDM on the same machine are left untouched.',
  'Installed and debugged it on my NVIDIA desktop and my HP OmniBook laptop.',
] as const;

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
  return <><Navigation /><main className="case-study"><CaseStudyHeader label="Linux systems case study" title={project.name} description="My daily Arch Linux and Hyprland desktop, rebuilt as an installer that detects the hardware, renders the right configuration, validates it before touching anything, and rolls itself back if something fails." tags={project.tags} action={{ href: project.repository, label: 'View Repository ↗' }} />
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">01 — Overview</p><h2>One desktop, any of my machines</h2></div><div className="case-prose">
      <p>I run Hyprland on an NVIDIA desktop and an HP OmniBook laptop. Monitor names, GPU environment variables, battery and brightness widgets, and absolute paths all differ between the two, so a config copied from one machine breaks on the other.</p>
      <p>This repository replaces the hand-editing. One command detects the machine, renders a complete configuration for it into a staging directory, validates every Lua, JSON, and TOML file, prints an installation plan, and only then installs, with a backup it can restore from.</p>
    </div></div></section>
    <section className="case-section tint"><div className="container case-two-col"><div><p className="case-label">02 — My role</p><h2>What I built</h2></div><div className="case-prose">
      <RoleBlock summary="Solo project. I designed it, own every file in the repository, and did all of the testing." items={role} />
      <p style={{ marginTop: '1.3rem' }}>I use AI coding assistants for parts of the implementation; the later theme and settings-panel work landed through reviewed agent branches. Every change was run and debugged on my own hardware before it merged.</p>
    </div></div></section>
    <section className="case-section dark"><div className="container"><p className="case-label">03 — Screenshots</p><h2>The installed desktop</h2><figure><Image src="/hyprlandproof.png" width={3440} height={1440} sizes="100vw" alt="Configured Hyprland desktop with application launcher and system panels on Arch Linux" priority /><figcaption>The installed environment on my ultrawide desktop.</figcaption></figure><figure><Image src="/hyprlandproofterminal.png" width={3440} height={1440} sizes="100vw" alt="Terminal windows open in the Aarav Hyprland Arch Linux environment" /><figcaption>Kitty terminals themed from the wallpaper by Matugen.</figcaption></figure></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">04 — Engineering story</p><h2>The detector that found AMD everywhere</h2></div><div className="case-prose">
      <p>The first version of <a href={file('tools/detect-hardware.py')} {...external}><code>detect-hardware.py</code></a> identified GPU vendors by searching each <code>lspci</code> display-controller line for vendor names.</p>
      <EngineeringStory steps={[
        ['Symptom', 'Machines with no AMD hardware were reported as having more than one GPU vendor, so the installer stopped and asked which GPU drives Hyprland, and --yes runs failed outright.'],
        ['Cause', 'The AMD check included the substring "ati". lspci names vendors as "NVIDIA Corporation" and "Intel Corporation", and "Corporation" contains "ati", so every NVIDIA or Intel line also matched AMD.'],
        ['Fix', 'Identify the vendor from the PCI vendor ID lspci -nn prints ([10de:…] NVIDIA, [1002:…] AMD, [8086:…] Intel), and fall back to word-boundary regexes only when no ID is present.'],
        ['Result', 'Each controller line maps to exactly one vendor, and the multi-GPU prompt only appears on machines that really have two vendors.'],
      ]} />
      <CodeSample file="tools/detect-hardware.py (before)" code={oldDetector} />
      <CodeSample file="tools/detect-hardware.py (after)" href={file('tools/detect-hardware.py')} code={newDetector} />
      <p>The lesson I took from it: when a tool emits a stable machine identifier, match on that, not on the human-readable name next to it.</p>
    </div></div></section>
    <section className="case-section tint"><div className="container case-two-col"><div><p className="case-label">05 — Design decisions</p><h2>Safe to run on a machine I care about</h2></div><div className="case-prose">
      <h3>Never touch the other desktop</h3>
      <p>My machines also have KDE Plasma installed. Enabling Waybar or SwayNC as normal user services would start them inside Plasma too. Each service gets a drop-in with an <code>ExecCondition</code>, so systemd skips it unless the session is Hyprland.</p>
      <CodeSample file="systemd drop-in" href={file('systemd/user/waybar.service.d/10-aarav-hyprland-session.conf')} code={dropIn} />
      <h3>Fail closed, then roll back</h3>
      <p>The installer runs with <code>set -Eeuo pipefail</code>. Before writing anything it captures a backup with SHA-256 checksums and the previous state of each systemd unit. An <code>EXIT</code> trap restores that backup on any non-zero exit, including a failed <code>hyprctl configerrors</code> check or a failing <code>doctor.sh</code> at the end.</p>
      <CodeSample file="install.sh" href={file('install.sh')} code={rollback} />
      <h3>Reloads that can&apos;t lock me out</h3>
      <p><a href={file('scripts/hypr-safe-reload')} {...external}><code>hypr-safe-reload</code></a> copies the current config, checks every Lua file with <code>luac -p</code>, reloads, and reads <code>hyprctl configerrors</code>. If Hyprland rejects the config, it restores the copy, keeps the broken files for inspection, and shows a notification. A systemd timer also snapshots the config daily.</p>
    </div></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">06 — Installation</p><h2>Dry run first, then install</h2></div><div className="case-prose">
      <CodeSample file="shell" code={`git clone https://github.com/AaravJit/aarav-hyprland.git
cd aarav-hyprland
./install.sh --dry-run      # detect, render, validate; changes nothing
./install.sh                # review the plan, then confirm
./doctor.sh                 # re-check the install at any time
./restore.sh latest         # roll back to the pre-install backup`} />
      <p>Detection can be overridden with flags such as <code>--profile laptop</code> or <code>--gpu nvidia</code>. Two JSON hardware fixtures (<a href={file('tests/fixtures/intel-laptop.json')} {...external}>Intel laptop</a> and <a href={file('tests/fixtures/amd-laptop.json')} {...external}>AMD laptop</a>) let me render and validate profiles for hardware I don&apos;t own through <code>--hardware-json</code>.</p>
      <a className="button primary" href={`${project.repository}#readme`} {...external}>Read the full install guide ↗</a>
    </div></div></section>
    <section className="case-section dark"><div className="container case-two-col"><div><p className="case-label">07 — Status</p><h2>What&apos;s next</h2></div><div className="case-prose">
      <p>Installed and in daily use on my NVIDIA desktop and HP OmniBook. The AMD and generic paths render and pass validation from fixtures but haven&apos;t been installed on real AMD hardware yet. Next on the roadmap is a first tagged release.</p>
      <a className="text-link" href={project.repository} {...external}>View repository ↗</a>
    </div></div></section>
    <ExploreProject href={projects.pathway.caseStudy} name="Pathway" detail="Software product case study" />
  </main><footer><div className="container"><b>AJ<span>.</span></b><p>Aarav Hyprland case study</p><Link href="/">Home</Link></div></footer></>;
}
