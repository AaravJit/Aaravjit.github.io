import { MAINTENANCE_MODE, LINKS } from './config';

function MaintenancePage({ currentYear }: { currentYear: number }) {
  return (
    <>
      <header className="header header--maintenance">
        <div className="container header-inner">
          <span className="logo">Aarav Jit</span>
        </div>
      </header>

      <main className="maintenance">
        <span className="maintenance-status">Updating</span>
        <h1 className="maintenance-title">Portfolio is being updated</h1>
        <p className="maintenance-subtitle">
          I&apos;m shipping some improvements. In the meantime, feel free to check out my resume or connect with me directly.
        </p>
        <div className="maintenance-cta">
          <a href={LINKS.resume} target="_blank" rel="noreferrer" className="btn btn-primary">
            View Resume
          </a>
          <a href={LINKS.github} target="_blank" rel="noreferrer" className="btn">
            GitHub
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="btn">
            LinkedIn
          </a>
          <a href={`mailto:${LINKS.email}`} className="btn">
            Email Me
          </a>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <span>&copy; {currentYear} Aarav Jit</span>
        </div>
      </footer>
    </>
  );
}

function PortfolioPage({ currentYear }: { currentYear: number }) {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="logo">Aarav Jit</a>
          <nav className="nav">
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#education" className="nav-link">Education</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#resume" className="nav-link">Resume</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Aarav Jit</h1>
            <p className="hero-tagline">Software Engineer</p>
            <p className="hero-summary">
              I build web applications, automation tools, and AI-powered utilities.
              Currently pursuing a CS degree while shipping production-quality side projects.
            </p>
            <p className="hero-status">Open to full-time software engineering roles.</p>
          </div>
        </section>

        <section id="experience" className="section">
          <div className="container">
            <h2 className="section-title">Experience</h2>
            <div className="experience-entry">
              <div className="experience-header">
                <h3 className="experience-company">Walmart</h3>
                <span className="experience-meta">Part-time · Present</span>
              </div>
              <ul className="experience-list">
                <li>Execute inventory and fulfillment workflows with high accuracy under time pressure</li>
                <li>Coordinate with team members across departments to meet daily operational targets</li>
                <li>Maintain consistent attendance and reliability in a fast-paced retail environment</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <h2 className="section-title">Projects</h2>

            <article className="project-entry">
              <div className="project-header">
                <h3 className="project-name">Deal AI</h3>
                <span className="project-status">In progress</span>
              </div>
              <p className="project-description">AI agent that crawls marketplaces, scores listings for quality and fraud risk, and ranks the best deals.</p>
              <p className="project-impact">Reduces hours of manual comparison shopping to seconds by combining vision models, pricing heuristics, and trust signals.</p>
              <p className="project-tech">Next.js, OpenAI Vision, Playwright, Vector Search</p>
            </article>

            <article className="project-entry">
              <div className="project-header">
                <h3 className="project-name">Automation Toolkit</h3>
                <a href="https://github.com/aaravjit" target="_blank" rel="noreferrer" className="project-link">GitHub →</a>
              </div>
              <p className="project-description">Collection of scripts for dev environment setup, repository health checks, and workflow automation.</p>
              <p className="project-impact">Eliminates repetitive setup tasks and enforces consistency across projects through codified processes.</p>
              <p className="project-tech">Python, Bash, Playwright, GitHub Actions</p>
            </article>

            <article className="project-entry">
              <div className="project-header">
                <h3 className="project-name">This Portfolio</h3>
                <a href="https://aaravjit.github.io" target="_blank" rel="noreferrer" className="project-link">Live →</a>
              </div>
              <p className="project-description">Minimal, single-page portfolio designed for clarity and fast scanning.</p>
              <p className="project-impact">Demonstrates frontend fundamentals: semantic HTML, responsive CSS, accessible markup, and clean typography.</p>
              <p className="project-tech">Next.js, TypeScript, CSS</p>
            </article>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container">
            <h2 className="section-title">Education</h2>
            <div className="education-entry">
              <h3 className="education-school">California State University, Sacramento</h3>
              <p className="education-degree">Bachelor of Science in Computer Science</p>
              <p className="education-date">Expected Graduation: 2026</p>
              <p className="education-coursework">Data Structures, Algorithms, Operating Systems, Database Systems, Software Engineering</p>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              <div className="skill-group">
                <h4 className="skill-label">Languages</h4>
                <p className="skill-items">JavaScript, TypeScript, Python, Java, SQL</p>
              </div>
              <div className="skill-group">
                <h4 className="skill-label">Frontend</h4>
                <p className="skill-items">React, Next.js, HTML, CSS, Tailwind</p>
              </div>
              <div className="skill-group">
                <h4 className="skill-label">Backend</h4>
                <p className="skill-items">Node.js, Express, PostgreSQL, REST APIs</p>
              </div>
              <div className="skill-group">
                <h4 className="skill-label">Tooling</h4>
                <p className="skill-items">Git, GitHub Actions, Docker, VS Code</p>
              </div>
              <div className="skill-group">
                <h4 className="skill-label">Systems</h4>
                <p className="skill-items">Linux, Bash, Playwright, Browser Automation</p>
              </div>
            </div>
          </div>
        </section>

        <section id="resume" className="section">
          <div className="container">
            <h2 className="section-title">Resume</h2>
            <p>
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn">Download Resume (PDF)</a>
            </p>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <h2 className="section-title">Contact</h2>
            <ul className="contact-list">
              <li><a href="mailto:aaravjit16@gmail.com">aaravjit16@gmail.com</a></li>
              <li><a href="https://github.com/aaravjit" target="_blank" rel="noreferrer">github.com/aaravjit</a></li>
              <li><a href="https://www.linkedin.com/in/aarav-jit-499a93293/" target="_blank" rel="noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <span>&copy; {currentYear} Aarav Jit</span>
        </div>
      </footer>
    </>
  );
}

export default function Home() {
  const currentYear = new Date().getFullYear();

  if (MAINTENANCE_MODE) {
    return <MaintenancePage currentYear={currentYear} />;
  }

  return <PortfolioPage currentYear={currentYear} />;
}
