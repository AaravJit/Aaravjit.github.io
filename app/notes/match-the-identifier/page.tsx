import type { Metadata } from 'next';
import Link from 'next/link';
import Article from '../../../components/Article';
import { Code } from '../../../components/ui';

export const metadata: Metadata = {
  title: 'Match the identifier, not the name',
  description: 'A GPU detector that found AMD on every machine because “Corporation” contains “ati”, and the general rule for parsing command-line tool output.',
  alternates: { canonical: '/notes/match-the-identifier/' },
  openGraph: { type: 'article', title: 'Match the identifier, not the name', url: '/notes/match-the-identifier/', images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit' }] },
};

const before = `if (
    "amd" in lowered
    or "advanced micro devices" in lowered
    or "ati" in lowered
    or "[1002:" in lowered
) and "amd" not in vendors:
    vendors.append("amd")`;

const after = `PCI_VENDOR_MAP = {"10de": "nvidia", "1002": "amd", "8086": "intel"}

for vendor_id, _device_id in re.findall(
    r"\\[([0-9a-fA-F]{4}):([0-9a-fA-F]{4})\\]", line,
):
    vendor = PCI_VENDOR_MAP.get(vendor_id.lower())
    if vendor:
        return vendor`;

export default function Note() {
  return (
    <Article slug="match-the-identifier">
      <p>Aarav Hyprland, my Arch Linux desktop installer, picks a GPU configuration path (NVIDIA, AMD, Intel or generic) by reading <code>lspci</code>. On a machine with two GPU vendors it stops and asks which one to configure, and in unattended <code>--yes</code> mode it exits rather than guess.</p>

      <h2>The symptom</h2>
      <p>On machines with no AMD hardware at all, the detector reported two vendors. Interactive installs showed a “Multiple GPU vendors detected” prompt that made no sense, and unattended installs quit.</p>

      <h2>The cause</h2>
      <p>The first detector lower-cased each display-controller line and searched it for vendor names. The AMD branch included <code>{'"ati"'}</code>, for ATI Technologies, whose graphics business AMD bought. But lspci writes vendors as “NVIDIA Corporation” and “Intel Corporation”, and corpor<strong>ati</strong>on contains <code>ati</code>. Every NVIDIA and Intel line also matched AMD.</p>
      <Code file="tools/detect-hardware.py (before)" code={before} />

      <h2>The fix</h2>
      <p><code>lspci -nn</code> prints a numeric PCI vendor and device ID in brackets on every line, for example <code>[10de:2882]</code>. Vendor IDs are assigned by the PCI-SIG and don’t change with marketing names, translations or formatting. The detector now reads the ID first and only falls back to word-boundary regular expressions when no ID is present.</p>
      <Code file="tools/detect-hardware.py (after)" href="https://github.com/AaravJit/aarav-hyprland/blob/main/tools/detect-hardware.py" code={after} />

      <h2>The general rule</h2>
      <p>When a tool prints both a human-readable name and a stable machine identifier, match on the identifier. The name is for people and can contain anything; the identifier exists so that programs don’t have to guess. The same rule applies well beyond lspci: match USB devices on vendor and product IDs, disks on UUIDs rather than <code>/dev/sdX</code>, network interfaces on MAC address or a stable name rather than probe order, and services on unit names rather than log text.</p>
      <p>A second, smaller lesson: substring checks on short tokens are almost always a bug waiting for the right input. Three letters will appear inside some ordinary word.</p>
      <p>The rest of the installer, including its dry run and automatic rollback, is in the <Link href="/projects/aarav-hyprland/">Aarav Hyprland case study</Link>.</p>
    </Article>
  );
}
