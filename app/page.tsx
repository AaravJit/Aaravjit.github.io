import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

const skills = [
  { symbol: 'OS', title: 'Operating systems / systems', items: ['Windows 10/11', 'Arch Linux', 'Linux command line', 'Desktop environments', 'PowerShell fundamentals'] },
  { symbol: '</>', title: 'Development', items: ['Bash', 'Python', 'TypeScript', 'JavaScript', 'Next.js', 'Git', 'GitHub'] },
  { symbol: '$_', title: 'Linux / administration', items: ['systemd', 'journalctl', 'NetworkManager', 'Package management', 'Processes', 'Services', 'Accounts and permissions'] },
  { symbol: 'NET', title: 'Networking', items: ['TCP/IP', 'IPv4', 'DNS', 'DHCP', 'ICMP', 'Ethernet', 'Wi-Fi', 'Common ports and protocols'] },
  { symbol: 'FIX', title: 'Troubleshooting', items: ['Software installation', 'PC hardware', 'Storage diagnostics', 'Memory diagnostics', 'Network connectivity', 'Windows/Linux troubleshooting'] },
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
            <p className="eyebrow"><span aria-hidden="true" /> Sacramento, California · Open to technical opportunities</p>
            <h1 id="hero-title">Aarav Jit</h1>
            <p className="hero-role">Computer Science Student · Linux &amp; Software Builder</p>
            <p className="hero-summary">Computer science and cybersecurity student building software, Linux environments, automation workflows, and hands-on technical projects. Interested in understanding systems from the software layer down to the hardware they run on.</p>
            <div className="hero-actions"><a className="button primary" href="#projects">View Projects</a><a className="button secondary" href="#about">About Me</a></div>
            <div className="social-links" aria-label="Professional links"><a href="https://github.com/AaravJit" {...external}>GitHub ↗</a><a href="https://www.linkedin.com/in/aarav-jit-499a93293/" {...external}>LinkedIn ↗</a><a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↗</a></div>
          </div>
          <div className="terminal" aria-label="Technical focus presented as terminal output">
            <div className="terminal-bar"><span /><span /><span /><code>aarav@portfolio:~</code></div>
            <div className="terminal-body"><p><b>aarav@portfolio</b>:~$ whoami</p><output>computer-science student</output><p><b>aarav@portfolio</b>:~$ cat focus.txt</p><output>Linux · Software · Systems · Cybersecurity</output><p><b>aarav@portfolio</b>:~$ git status --short</p><output><em>M</em> building, learning, troubleshooting</output><i className="cursor" aria-hidden="true" /></div>
          </div>
        </div>
      </section>

      <section id="about" className="section about"><div className="container about-grid">
        <Heading number="01 — About">I like figuring out how things actually work.</Heading>
        <div className="about-copy"><p>I am a computer science and cybersecurity student with hands-on Windows and Linux experience—from the command line and Arch Linux desktop configuration to building PCs, diagnosing storage and memory issues, and troubleshooting software and hardware.</p><p>I enjoy following a problem through the layers of a system: processes, services, logs, accounts and permissions, networking, and the hardware underneath. I use Bash, Git and GitHub, Python, Next.js, and foundational PowerShell to turn that curiosity into practical projects and repeatable workflows.</p>
          <dl className="quick-facts"><div><dt>Based in</dt><dd>Sacramento, California</dd></div><div><dt>Current path</dt><dd>CS → systems &amp; cybersecurity</dd></div><div><dt>Daily systems</dt><dd>Windows &amp; Arch Linux</dd></div><div><dt>Interested in</dt><dd>Software, Linux &amp; infrastructure</dd></div></dl>
        </div>
      </div></section>

      <section id="projects" className="section project-section"><div className="container"><Heading number="02 — Projects" intro="Practical work across Linux environments, software, and deployed applications.">Selected work</Heading>
        <article className="featured-project">
          <div className="featured-copy"><p className="project-kicker">Featured Linux project</p><h3>Aarav Hyprland</h3><h4>Portable Arch Linux &amp; Hyprland Environment</h4><p>A reusable, Bash-based installation workflow for deploying a personalized Hyprland environment on Arch Linux. It includes Intel, AMD, and NVIDIA configuration paths and has been deployed on desktop hardware and an HP OmniBook laptop.</p><ul className="proof-list"><li><b>01</b><span>Hardware-aware configuration and package management</span></li><li><b>02</b><span>systemd and journalctl setup and troubleshooting</span></li><li><b>03</b><span>Git-tracked configuration, setup guidance, and documentation</span></li></ul><div className="tag-list" aria-label="Technologies"><span>Arch Linux</span><span>Hyprland</span><span>Bash</span><span>Git</span><span>systemd</span></div><div className="project-actions"><Link className="button light" href="/projects/aarav-hyprland/">View Case Study</Link><a href="https://github.com/AaravJit/aarav-hyprland" {...external}>Repository ↗</a></div></div>
          <div className="project-visual"><Image src="/hyprlandproof.png" width={3440} height={1440} sizes="(max-width: 850px) calc(100vw - 80px), 52vw" alt="Aarav Hyprland desktop environment running on Arch Linux" priority /><Image className="terminal-shot" src="/hyprlandproofterminal.png" width={3440} height={1440} sizes="(max-width: 850px) calc(100vw - 80px), 30vw" alt="Terminal in the Aarav Hyprland Arch Linux environment" /></div>
        </article>
        <div className="additional-heading"><h3>More software projects</h3><span>Deployed applications</span></div>
        <div className="project-cards">
          <article><p>Study platform · 2025–2026</p><h3>WrenchAI</h3><p>An account-based aviation maintenance study platform with practice questions, mock exams, flashcards, progress tracking, and structured learning workflows.</p><div className="tag-list"><span>Web application</span><span>Account-based</span></div><a href="https://wrenchai.app/" {...external}>View live site <span>↗</span></a></article>
          <article><p>Web development · This site</p><h3>Portfolio Website</h3><p>A responsive Next.js portfolio deployed through GitHub Pages to present technical projects, skills, work experience, education, and contact information.</p><div className="tag-list"><span>Next.js</span><span>TypeScript</span><span>GitHub Pages</span></div><a href="https://github.com/AaravJit/Aaravjit.github.io" {...external}>View repository <span>↗</span></a></article>
        </div>
      </div></section>

      <section id="skills" className="section skills-section"><div className="container"><Heading number="03 — Skills" intro="A practical toolkit built through projects, system use, and continued study.">Technical toolkit</Heading><div className="skills-grid">{skills.map((group) => <article className="skill-group" key={group.title}><div className="skill-top"><span aria-hidden="true">{group.symbol}</span><h3>{group.title}</h3></div><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div></div></section>

      <section id="experience" className="section"><div className="container split-section"><Heading number="04 — Experience">Reliability in structured, high-volume work.</Heading><div className="experience-list">
        <article className="timeline"><div className="timeline-marker" aria-hidden="true" /><div className="timeline-head"><div><p>Walmart · Citrus Heights, CA</p><h3>Online Grocery Pickup / Digital Fulfillment Associate</h3></div><time>June 2024–Present</time></div><ul><li>Communicate directly with customers to resolve order issues, explain substitutions, and coordinate accurate, timely handoffs in a high-volume environment.</li><li>Use internal inventory and order-management systems while following documented procedures and maintaining accuracy as priorities change.</li><li>Identify routine operational problems, coordinate across teams, and escalate issues requiring management support.</li></ul></article>
        <article className="timeline"><div className="timeline-marker" aria-hidden="true" /><div className="timeline-head"><div><p>Target · Sacramento, CA</p><h3>Seasonal Fulfillment Expert</h3></div><time>November 2023–January 2024</time></div><ul><li>Used handheld fulfillment and inventory systems to locate, verify, stage, and prepare orders under tight seasonal deadlines.</li><li>Maintained order accuracy and supported team workflow during peak demand.</li></ul></article>
      </div></div></section>

      <section id="education" className="section education-section"><div className="container split-section"><Heading number="05 — Education">A path from computer science into systems and security.</Heading><div className="education-list"><article><span>Beginning Fall 2026 · Sacramento, CA</span><h3>American River College</h3><p>Cybersecurity and Information Assurance — Associate Degree Program</p><h4>Upcoming coursework</h4><ul><li>Introduction to Networks</li><li>Switching, Routing, and Wireless Essentials</li><li>Network Systems Administration</li><li>Network Security Fundamentals</li></ul></article><article className="prior"><span>Prior coursework</span><h3>California State University, Sacramento</h3><p>Computer Science coursework in programming fundamentals and data structures; no degree claimed.</p></article></div></div></section>

      <section id="contact" className="contact-section"><div className="container contact-grid"><div><p className="eyebrow">Sacramento, California · Let’s connect</p><h2>Interested in building and learning with a technical team.</h2><p>I’m open to software, IT and systems, cybersecurity, Linux and infrastructure, technical support, and other early-career technology opportunities.</p></div><div className="contact-links"><a href="mailto:aaravjit16@gmail.com"><span>Email</span><b>Start a conversation →</b></a><a href="https://www.linkedin.com/in/aarav-jit-499a93293/" {...external}><span>LinkedIn</span><b>Connect ↗</b></a><a href="https://github.com/AaravJit" {...external}><span>GitHub</span><b>View projects ↗</b></a><a href="/resume.pdf" target="_blank" rel="noopener noreferrer"><span>Resume</span><b>Open PDF ↗</b></a></div></div></section>
    </main>
    <footer><div className="container"><b>AJ<span>.</span></b><p>© {new Date().getFullYear()} Aarav Jit. Built with Next.js and deployed on GitHub Pages.</p><a href="#top">Back to top ↑</a></div></footer>
  </>;
}
