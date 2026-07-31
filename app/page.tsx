const skillGroups = [
  {
    title: "Operating Systems",
    note: "Hands-on personal experience and current learning",
    items: ["Windows 10/11", "Arch Linux", "Linux desktop environments", "Linux command line", "Windows PowerShell fundamentals"],
  },
  {
    title: "Troubleshooting",
    note: "Hands-on personal experience",
    items: [
      "Software installation and configuration", "PC hardware troubleshooting", "Storage and memory diagnostics",
      "User accounts and permissions", "Processes and services", "Log inspection", "Network connectivity troubleshooting",
      "Documentation and escalation",
    ],
  },
  {
    title: "Networking Fundamentals",
    note: "Foundational knowledge and upcoming coursework",
    items: ["TCP/IP", "IPv4 addressing", "DNS", "DHCP", "ICMP", "Ethernet", "Wi-Fi", "Common ports and protocols"],
  },
  {
    title: "Tools & Technologies",
    note: "Hands-on use and fundamentals",
    items: [
      "Bash", "Git", "GitHub", "PowerShell", "systemd", "journalctl", "NetworkManager", "Windows Task Manager",
      "Device Manager", "Event Viewer", "HTML", "CSS", "JavaScript", "React", "Next.js", "Python",
    ],
  },
];

const hyprlandHighlights = [
  "Bash-based installation workflow",
  "Intel, AMD, and NVIDIA configuration paths",
  "Deployment on desktop and HP OmniBook laptop hardware",
  "Arch Linux package management and Hyprland configuration",
  "Git-based version control and reusable configuration files",
  "Hardware-specific troubleshooting and installation documentation",
];

const currentLabs = [
  "Windows and Linux troubleshooting lab",
  "Networking and DNS troubleshooting exercises",
  "Windows Server administration practice",
  "PowerShell and Bash support scripts",
  "Documentation of common help-desk scenarios",
];

const walmartBullets = [
  "Communicate directly with customers to resolve order issues, explain substitutions, and coordinate timely order handoffs.",
  "Use internal inventory and order-management systems while maintaining accuracy during high-volume periods.",
  "Identify routine operational problems, follow documented procedures, and escalate issues that require management support.",
  "Coordinate with multiple team members when missing items, delayed orders, or staging issues affect customer service.",
  "Prioritize urgent tasks while maintaining accuracy and clear communication.",
];

const coursework = [
  "CISN 340 — Introduction to Networks",
  "CISN 341 — Switching, Routing, and Wireless Essentials",
  "CISN 300 — Network Systems Administration",
  "CISS 310 — Network Security Fundamentals",
];

const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="#top" className="logo">Aarav Jit</a>
          <nav className="nav" aria-label="Primary navigation">
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#education" className="nav-link">Education</a>
            <a href="/resume.pdf" className="nav-link" {...externalProps}>Resume</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top" className="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <h1 id="hero-title" className="hero-title">Aarav Jit</h1>
            <p className="hero-tagline">Entry-Level IT Support &amp; Cybersecurity Student</p>
            <p className="hero-summary">
              Cybersecurity and networking student building hands-on experience with Windows, Linux, troubleshooting,
              system configuration, Bash automation, Git, and computer hardware. Currently seeking an entry-level help
              desk, IT support, desktop support, or technical support opportunity.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href="/resume.pdf" className="btn" {...externalProps}>View Resume</a>
              <a href="https://github.com/AaravJit" className="btn" {...externalProps}>GitHub</a>
              <a href="#contact" className="btn">Contact Me</a>
            </div>
            {/* TODO: Replace public/resume.pdf after its education, projects, and career positioning are verified. */}
            <p className="resume-notice"><strong>Resume update:</strong> The downloadable PDF is being revised to match this portfolio.</p>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title">About</h2>
            <div className="experience-card about-content">
              <p className="about-paragraph">
                I am a cybersecurity and networking student at American River College with hands-on experience configuring
                Linux systems, troubleshooting software and hardware issues, writing Bash scripts, and deploying reusable
                desktop environments across different hardware configurations.
              </p>
              <p className="about-paragraph">
                My professional experience in high-volume customer service has taught me how to communicate clearly,
                prioritize urgent issues, follow established procedures, and stay accurate under pressure. I am now applying
                those skills toward an entry-level IT support role while continuing to build practical experience in
                networking, Windows administration, Linux, and cybersecurity fundamentals.
              </p>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container">
            <h2 className="section-title">Technical Skills</h2>
            <div className="skills-grid">
              {skillGroups.map((group) => (
                <article className="experience-card skill-card" key={group.title}>
                  <h3 className="skill-label">{group.title}</h3>
                  <p className="skill-note">{group.note}</p>
                  <ul className="pill-list">
                    {group.items.map((item) => <li className="pill" key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <h2 className="section-title">Featured Project</h2>
            <article className="experience-card featured-project">
              <p className="project-status">Portable Arch Linux and Hyprland Environment</p>
              <h3 className="project-name featured-project-name">Aarav Hyprland</h3>
              <p className="project-description">
                Developed a reusable Hyprland environment for Arch Linux with an installable GitHub repository and
                configuration paths for Intel, AMD, and NVIDIA graphics. Successfully deployed and tested the setup on
                both desktop and HP OmniBook laptop hardware.
              </p>
              <ul className="project-list">
                {hyprlandHighlights.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="project-links">
                <a className="btn btn-primary" href="https://github.com/AaravJit/aarav-hyprland" {...externalProps}>View Repository</a>
                <a className="btn" href="https://github.com/AaravJit/aarav-hyprland#readme" {...externalProps}>View Documentation</a>
              </div>
            </article>

            <h2 className="section-title additional-title">Additional Projects</h2>
            <div className="additional-projects">
              <article className="experience-card">
                <h3 className="project-name">WrenchAI</h3>
                <p className="project-description">
                  A deployed aviation-maintenance study platform featuring practice questions, mock exams, flashcards,
                  progress tracking, and account-based access.
                </p>
                <div className="project-links">
                  <a className="project-link" href="https://wrenchai.app/" {...externalProps}>View Live Site →</a>
                </div>
              </article>
              <article className="experience-card compact-project">
                <h3 className="project-name">Portfolio Website</h3>
                <p className="project-description">A responsive personal portfolio developed with Next.js and deployed through GitHub Pages.</p>
                <div className="project-links">
                  <a className="project-link" href="https://github.com/AaravJit/Aaravjit.github.io" {...externalProps}>View Repository →</a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="building" className="section">
          <div className="container">
            <h2 className="section-title">Currently Building</h2>
            <div className="experience-card">
              <p className="section-intro">Planned and in-progress practice—not completed professional projects.</p>
              <ul className="experience-bullets">
                {currentLabs.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section id="experience" className="section">
          <div className="container">
            <h2 className="section-title">Experience</h2>
            <article className="experience-card">
              <div className="experience-header">
                <div>
                  <p className="experience-company">Walmart</p>
                  <h3 className="experience-title">Online Grocery Pickup Associate</h3>
                </div>
                <span className="experience-dates">June 2024–Present</span>
              </div>
              <ul className="experience-bullets">
                {walmartBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </article>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container">
            <h2 className="section-title">Education</h2>
            <div className="experience-list">
              <article className="experience-card">
                <h3 className="education-school">American River College</h3>
                <p className="education-degree">Cybersecurity and Information Assurance, Associate Degree Program</p>
                <p className="education-date">Beginning Fall 2026</p>
                <h4 className="coursework-title">Upcoming coursework</h4>
                <ul className="experience-bullets coursework-list">
                  {coursework.map((course) => <li key={course}>{course}</li>)}
                </ul>
              </article>
              <article className="experience-card prior-education">
                <h3 className="education-school">California State University, Sacramento</h3>
                <p className="education-degree">Prior Computer Science coursework</p>
                <p className="education-coursework">Coursework only; no degree claimed.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <h2 className="section-title">Contact</h2>
            <p className="contact-intro">Interested in discussing an entry-level help desk, IT support, desktop support, or technical support opportunity?</p>
            <div className="contact-actions">
              <a href="mailto:aaravjit16@gmail.com" className="btn btn-primary">Email Me</a>
              <a href="https://www.linkedin.com/in/aarav-jit-499a93293/" className="btn" {...externalProps}>LinkedIn</a>
              <a href="https://github.com/AaravJit" className="btn" {...externalProps}>GitHub</a>
            </div>
            <ul className="contact-list">
              <li><span className="contact-label">Email</span><a href="mailto:aaravjit16@gmail.com">aaravjit16@gmail.com</a></li>
              <li><span className="contact-label">Location</span><span>Sacramento, California</span></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container"><span>&copy; {currentYear} Aarav Jit. Built with Next.js and deployed on GitHub Pages.</span></div>
      </footer>
    </>
  );
}
