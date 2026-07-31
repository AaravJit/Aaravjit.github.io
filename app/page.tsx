import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const skills = [
  { symbol: 'OS', title: 'Systems', note: 'Hands-on personal experience and current learning', items: ['Windows 10/11', 'Arch Linux', 'Linux command line', 'Linux desktop environments', 'PowerShell fundamentals'] },
  { symbol: 'FX', title: 'Troubleshooting', note: 'Hands-on personal experience', items: ['Software installation and configuration', 'PC hardware troubleshooting', 'Storage and memory diagnostics', 'User accounts and permissions', 'Processes and services', 'Log inspection', 'Network connectivity troubleshooting', 'Documentation and escalation'] },
  { symbol: 'NET', title: 'Networking Fundamentals', note: 'Foundational knowledge and upcoming coursework', items: ['TCP/IP', 'IPv4 addressing', 'DNS', 'DHCP', 'ICMP', 'Ethernet', 'Wi-Fi', 'Common ports and protocols'] },
  { symbol: '$_', title: 'Tools', note: 'Hands-on use and fundamentals', items: ['Bash', 'Git', 'GitHub', 'systemd', 'journalctl', 'NetworkManager', 'Windows Task Manager', 'Device Manager', 'Event Viewer'] },
];
const roadmap = [
  ['Windows and Linux troubleshooting lab', 'In Progress'],
  ['Networking and DNS troubleshooting exercises', 'Planned'],
  ['Windows Server administration practice', 'Planned'],
  ['PowerShell and Bash support scripts', 'Planned'],
  ['Documentation of common help-desk scenarios', 'Planned'],
] as const;

function Heading({ number, children, intro }: { number: string; children: React.ReactNode; intro?: string }) {
  return <div className="section-heading"><p>{number}</p><h2>{children}</h2>{intro && <span>{intro}</span>}</div>;
}

export default function Home() {
  return <>
    <Navigation />
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true" /> Sacramento, California · Open to opportunities</p>
            <h1 id="hero-title">Aarav Jit</h1>
            <p className="hero-role">Entry-Level IT Support &amp; Cybersecurity Student</p>
            <p className="hero-summary">Cybersecurity and networking student building hands-on experience with Windows, Linux, troubleshooting, system configuration, Bash automation, Git, and computer hardware. Seeking an entry-level help desk, IT support, desktop support, or technical support opportunity.</p>
            <div className="hero-actions"><a className="button primary" href="#projects">View Projects</a><a className="button secondary" href="/resume.pdf" download>Download Resume</a></div>
            <div className="social-links" aria-label="Contact links"><a href="https://github.com/AaravJit" {...external}>GitHub ↗</a><a href="https://www.linkedin.com/in/aarav-jit-499a93293/" {...external}>LinkedIn ↗</a><a href="mailto:aaravjit16@gmail.com">Email</a></div>
          </div>
          <div className="terminal" aria-label="A summary presented as terminal commands">
            <div className="terminal-bar"><span /><span /><span /><code>portfolio — bash</code></div>
            <div className="terminal-body"><p><b>aarav@portfolio</b>:~$ whoami</p><output>Entry-Level IT Support &amp; Cybersecurity Student</output><p><b>aarav@portfolio</b>:~$ focus</p><output>Linux · Windows · Networking · Troubleshooting</output><p><b>aarav@portfolio</b>:~$ status</p><output>Seeking Entry-Level IT Support Opportunities</output><i className="cursor" aria-hidden="true" /></div>
          </div>
        </div>
      </section>

      <section id="about" className="section about"><div className="container about-grid">
        <Heading number="01 — About">Building practical systems knowledge.</Heading>
        <div className="about-copy"><p>I am a cybersecurity and networking student at American River College with hands-on experience configuring Linux systems, troubleshooting software and hardware issues, writing Bash scripts, and deploying reusable desktop environments across different hardware configurations.</p><p>My high-volume customer service experience has strengthened how I communicate, prioritize urgent issues, follow procedures, and stay accurate under pressure. I am applying those skills toward entry-level IT support while continuing to learn networking, Windows administration, Linux, and cybersecurity fundamentals.</p>
          <dl className="quick-facts"><div><dt>Location</dt><dd>Sacramento, California</dd></div><div><dt>Education</dt><dd>ARC Cybersecurity &amp; Information Assurance</dd></div><div><dt>Systems</dt><dd>Windows and Linux</dd></div><div><dt>Focus</dt><dd>Entry-level IT opportunities</dd></div></dl>
        </div>
      </div></section>

      <section id="skills" className="section skills-section"><div className="container"><Heading number="02 — Skills" intro="Practical foundations developed through personal projects and current learning.">Technical toolkit</Heading><div className="skills-grid">{skills.map((group) => <article className="skill-group" key={group.title}><div className="skill-top"><span aria-hidden="true">{group.symbol}</span><div><h3>{group.title}</h3><p>{group.note}</p></div></div><ul>{group.items.map(x => <li key={x}>{x}</li>)}</ul>{group.title === 'Tools' && <div className="dev-tools"><b>Additional Development Tools</b><p>HTML · CSS · JavaScript · React · Next.js · Python</p></div>}</article>)}</div></div></section>

      <section id="projects" className="section project-section"><div className="container"><Heading number="03 — Projects" intro="Systems work, deployment, and supporting web projects.">Selected work</Heading>
        <article className="featured-project">
          <div className="featured-copy"><p className="project-kicker">Featured system configuration project</p><h3>Aarav Hyprland</h3><h4>Portable Arch Linux and Hyprland Environment</h4><p>Developed a reusable Hyprland environment for Arch Linux with an installable GitHub repository and hardware-specific configuration paths. The setup has been deployed and tested on desktop and HP OmniBook laptop hardware.</p><ul className="proof-list"><li><b>01</b><span>Intel, AMD, and NVIDIA configuration paths</span></li><li><b>02</b><span>Tested on desktop and HP OmniBook hardware</span></li><li><b>03</b><span>Bash-based installation workflow</span></li></ul><div className="project-actions"><Link className="button light" href="/projects/aarav-hyprland/">View Case Study</Link><a href="https://github.com/AaravJit/aarav-hyprland" {...external}>Repository ↗</a><a href="https://github.com/AaravJit/aarav-hyprland#readme" {...external}>Documentation ↗</a></div></div>
          <div className="project-visual"><Image src="/hyprlandproof.png" width={3440} height={1440} sizes="(max-width: 800px) 100vw, 55vw" alt="Aarav Hyprland desktop environment running on Arch Linux" priority /><Image className="terminal-shot" src="/hyprlandproofterminal.png" width={3440} height={1440} sizes="(max-width: 800px) 90vw, 30vw" alt="Terminal view of the Aarav Hyprland Arch Linux environment" /></div>
        </article>
        <div className="additional-heading"><h3>Additional Projects</h3><span>02 supporting builds</span></div><div className="project-cards"><article><p>Study platform · Deployed</p><h3>WrenchAI</h3><p>A deployed aviation-maintenance study platform featuring practice questions, mock exams, flashcards, progress tracking, and account-based access.</p><a href="https://wrenchai.app/" {...external}>View live site <span>↗</span></a></article><article><p>Web development · This site</p><h3>Portfolio Website</h3><p>A responsive personal portfolio developed with Next.js and deployed through GitHub Pages.</p><a href="https://github.com/AaravJit/Aaravjit.github.io" {...external}>View repository <span>↗</span></a></article></div>
      </div></section>

      <section id="building" className="section roadmap-section"><div className="container roadmap-grid"><Heading number="04 — Roadmap">Currently building</Heading><div><ol className="roadmap">{roadmap.map(([item,status],i) => <li key={item}><span className="roadmap-num">0{i+1}</span><b>{item}</b><span className={`status ${status === 'In Progress' ? 'progress' : ''}`}><i aria-hidden="true" />{status}</span></li>)}</ol><p className="honesty-note">Personal learning projects and practice environments—not completed professional client work.</p></div></div></section>

      <section id="experience" className="section"><div className="container split-section"><Heading number="05 — Experience">Transferable experience</Heading><article className="timeline"><div className="timeline-marker" aria-hidden="true" /><div className="timeline-head"><div><p>Walmart</p><h3>Online Grocery Pickup Associate</h3></div><time>June 2024–Present</time></div><ul><li>Resolve customer order issues and communicate options clearly.</li><li>Prioritize tasks and maintain accuracy during high-volume periods.</li><li>Follow documented procedures and escalate operational issues when needed.</li></ul><p className="strengths"><b>Transferable strengths:</b> Issue triage · Customer communication · Accuracy · Escalation</p></article></div></section>

      <section id="education" className="section education-section"><div className="container split-section"><Heading number="06 — Education">Learning path</Heading><div className="education-list"><article><span>Current program</span><h3>American River College</h3><p>Cybersecurity and Information Assurance, Associate Degree Program</p><time>Beginning Fall 2026</time><h4>Upcoming coursework</h4><ul><li>CISN 340 — Introduction to Networks</li><li>CISN 341 — Switching, Routing, and Wireless Essentials</li><li>CISN 300 — Network Systems Administration</li><li>CISS 310 — Network Security Fundamentals</li></ul></article><article className="prior"><span>Prior education</span><h3>California State University, Sacramento</h3><p>Prior coursework in Computer Science</p></article></div></div></section>

      <section id="contact" className="contact-section"><div className="container contact-grid"><div><p className="eyebrow">Sacramento, California · Available for entry-level roles</p><h2>Let’s solve the next issue.</h2><p>I’m interested in help desk, IT support, desktop support, and technical support opportunities where I can contribute, learn, and keep building practical systems experience.</p></div><div className="contact-links"><a href="mailto:aaravjit16@gmail.com"><span>Email</span><b>Start a conversation →</b></a><a href="https://www.linkedin.com/in/aarav-jit-499a93293/" {...external}><span>LinkedIn</span><b>Connect ↗</b></a><a href="https://github.com/AaravJit" {...external}><span>GitHub</span><b>View profile ↗</b></a><a href="/resume.pdf" target="_blank" rel="noopener noreferrer"><span>Resume</span><b>Open PDF ↗</b></a></div></div></section>
    </main>
    <footer><div className="container"><b>AJ<span>.</span></b><p>© {new Date().getFullYear()} Aarav Jit. Built with Next.js and deployed on GitHub Pages.</p><a href="#top">Back to top ↑</a></div></footer>
  </>;
}
