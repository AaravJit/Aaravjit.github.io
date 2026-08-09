import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import { CaseStudyHeader, ExploreProject } from '../../../components/ProjectUI';
import { projects, site } from '../../../data/portfolio';

const project = projects.hyprland;
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
export const metadata: Metadata = {
  title: 'Aarav Hyprland Case Study | Aarav Jit',
  description: 'A case study of a reusable, hardware-aware Arch Linux and Hyprland configuration and Bash installation workflow.',
  alternates: { canonical: `${site.url}/projects/aarav-hyprland/` },
  openGraph: { title: 'Aarav Hyprland Case Study | Aarav Jit', description: 'Reusable Arch Linux and Hyprland configuration across verified desktop and laptop deployments.', url: `${site.url}/projects/aarav-hyprland/`, type: 'article' },
};

export default function HyprlandCaseStudy() {
  return <><Navigation /><main className="case-study"><CaseStudyHeader label="System configuration case study" title={project.name} description="A reusable Arch Linux and Hyprland configuration and installation repository built around documented, hardware-aware setup paths." tags={project.tags} />
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">01 — Overview</p><h2>A repeatable desktop environment</h2></div><div className="case-prose"><p>The project packages a personally configured Hyprland environment into reusable configuration files and a Bash-based installation workflow. It includes separate Intel, AMD, and NVIDIA paths and has been deployed on desktop hardware and an HP OmniBook laptop.</p><h3>The practical problem</h3><ul><li>Reproducing the same environment across systems</li><li>Managing hardware-specific configuration paths</li><li>Avoiding repetitive manual setup</li><li>Documenting a repeatable installation workflow</li></ul></div></div></section>
    <section className="case-section dark"><div className="container"><p className="case-label">02 — Screenshots</p><h2>Desktop and terminal views</h2><figure><Image src="/hyprlandproof.png" width={3440} height={1440} sizes="100vw" alt="Configured Hyprland desktop with application launcher and system panels on Arch Linux" priority /><figcaption>Configured Hyprland desktop environment on Arch Linux.</figcaption></figure><figure><Image src="/hyprlandproofterminal.png" width={3440} height={1440} sizes="100vw" alt="Terminal windows open in the Aarav Hyprland Arch Linux environment" /><figcaption>Terminal view of the working environment.</figcaption></figure></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">03 — Technical details</p><h2>Configuration, deployment, troubleshooting</h2></div><div className="case-prose"><h3>Environment</h3><p>Arch Linux · Hyprland · Bash · Git and GitHub · Intel, AMD, and NVIDIA configuration paths</p><h3>Technical highlights</h3><ul><li>Bash-based installation workflow and Git-tracked configuration</li><li>Arch package management and Hyprland configuration</li><li>systemd and journalctl setup and troubleshooting</li><li>Documented desktop and laptop deployments</li></ul><h3>Scope</h3><p>Hardware differences are handled as explicit configuration concerns. The verified deployments demonstrate reusable work across those systems—not universal compatibility.</p></div></div></section>
    <section className="case-section tint"><div className="container case-two-col"><div><p className="case-label">04 — Installation flow</p><h2>Documented, hardware-aware setup</h2></div><div className="case-prose"><ol><li>Obtain the configuration repository.</li><li>Review its documentation and select the relevant hardware path.</li><li>Follow the Bash-based installation workflow.</li><li>Validate the environment and troubleshoot device-specific differences.</li></ol><p>This overview intentionally omits unverified shell commands. The repository README remains the source for current instructions.</p><a className="button primary" href={`${project.repository}#readme`} {...external}>Read installation documentation ↗</a></div></div></section>
    <section className="case-section"><div className="container case-two-col"><div><p className="case-label">05 — Lessons</p><h2>Improving a reusable system</h2></div><div className="case-prose"><p>The work builds practical experience in Linux configuration, Bash scripting, troubleshooting, Git workflows, cross-device deployment, and documentation. Future work focuses on stronger validation, error handling, broader device testing, and expanded troubleshooting guidance.</p><a className="text-link" href={project.repository} {...external}>View repository ↗</a></div></div></section>
    <ExploreProject href={projects.pathway.caseStudy} name="Pathway" detail="Software product case study" />
  </main><footer><div className="container"><b>AJ<span>.</span></b><p>Aarav Hyprland case study</p><Link href="/">Home</Link></div></footer></>;
}
