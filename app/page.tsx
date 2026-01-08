export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="logo">Aarav Jit</a>
          <nav className="nav">
            <a href="#about" className="nav-link">About</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#education" className="nav-link">Education</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Aarav Jit</h1>
            <p className="hero-tagline">Computer Science Student & Software Developer</p>
            <p className="hero-summary">
              Building modern web applications and automation tools while pursuing a Computer Science degree.
              Passionate about solving real-world problems through clean, efficient code.
            </p>
            <div className="hero-actions">
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">
                View Resume
              </a>
              <a href="https://github.com/aaravjit" target="_blank" rel="noreferrer" className="btn">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/aarav-jit-499a93293/" target="_blank" rel="noreferrer" className="btn">
                LinkedIn
              </a>
              <a href="mailto:aaravjit16@gmail.com" className="btn">
                Email
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title">About Me</h2>
            <div className="about-content">
              <p className="about-paragraph">
                I'm a Computer Science student at California State University, Sacramento, with a strong interest in
                software engineering, systems programming, and web development. I enjoy building practical tools
                that solve real problems and make workflows more efficient.
              </p>
              <p className="about-paragraph">
                My experience spans full-stack web development, browser automation, and AI integration. I'm
                comfortable working with modern frameworks like Next.js and React, and I have a solid foundation
                in data structures, algorithms, and system design principles.
              </p>
              <p className="about-paragraph">
                I'm familiar with Linux environments and open-source workflows, and I believe in writing clean,
                maintainable code. Currently, I'm looking for opportunities to contribute to meaningful projects
                and continue growing as a software developer.
              </p>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <h2 className="section-title">Projects</h2>

            <article className="project-card">
              <div className="project-header">
                <h3 className="project-name">Deal AI</h3>
                <span className="project-status">In Development</span>
              </div>
              <p className="project-description">
                AI-powered marketplace crawler that analyzes listings, scores them for quality and fraud risk,
                and ranks the best deals using computer vision and pricing algorithms.
              </p>
              <p className="project-tech">Next.js · OpenAI Vision API · Playwright · TypeScript</p>
              <div className="project-links">
                <a href="https://github.com/aaravjit" target="_blank" rel="noreferrer" className="project-link">
                  View on GitHub →
                </a>
              </div>
            </article>

            <article className="project-card">
              <div className="project-header">
                <h3 className="project-name">Automation Toolkit</h3>
              </div>
              <p className="project-description">
                Collection of Python and Bash scripts for development environment setup, repository health
                checks, and workflow automation. Eliminates repetitive setup tasks across projects.
              </p>
              <p className="project-tech">Python · Bash · Playwright · GitHub Actions</p>
              <div className="project-links">
                <a href="https://github.com/aaravjit" target="_blank" rel="noreferrer" className="project-link">
                  View on GitHub →
                </a>
              </div>
            </article>

            <article className="project-card">
              <div className="project-header">
                <h3 className="project-name">Developer Portfolio</h3>
              </div>
              <p className="project-description">
                Modern, responsive portfolio website built with Next.js and TypeScript. Features clean
                design, semantic HTML, and optimized static site generation for GitHub Pages deployment.
              </p>
              <p className="project-tech">Next.js · TypeScript · CSS · GitHub Pages</p>
              <div className="project-links">
                <a href="https://aaravjit.github.io" target="_blank" rel="noreferrer" className="project-link">
                  Live Site →
                </a>
                <a href="https://github.com/AaravJit/Aaravjit.github.io" target="_blank" rel="noreferrer" className="project-link">
                  View on GitHub →
                </a>
              </div>
            </article>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              <div className="skill-group">
                <h4 className="skill-label">Languages</h4>
                <p className="skill-items">JavaScript, TypeScript, Python, Java, SQL, Bash</p>
              </div>
              <div className="skill-group">
                <h4 className="skill-label">Frameworks & Libraries</h4>
                <p className="skill-items">React, Next.js, Node.js, Express</p>
              </div>
              <div className="skill-group">
                <h4 className="skill-label">Tools & Technologies</h4>
                <p className="skill-items">Git, GitHub, GitHub Actions, Docker, VS Code</p>
              </div>
              <div className="skill-group">
                <h4 className="skill-label">Systems & Platforms</h4>
                <p className="skill-items">Linux, Bash, Browser Automation, PostgreSQL</p>
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container">
            <h2 className="section-title">Education</h2>
            <div className="education-entry">
              <h3 className="education-school">California State University, Sacramento</h3>
              <p className="education-degree">Bachelor of Science in Computer Science</p>
              <p className="education-date">Expected Graduation: May 2026</p>
              <p className="education-coursework">
                Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Systems,
                Software Engineering, Object-Oriented Programming
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <h2 className="section-title">Contact</h2>
            <p className="contact-intro">
              I'm always interested in new opportunities and collaborations. Feel free to reach out!
            </p>
            <ul className="contact-list">
              <li>
                <span className="contact-label">Email:</span>
                <a href="mailto:aaravjit16@gmail.com">aaravjit16@gmail.com</a>
              </li>
              <li>
                <span className="contact-label">GitHub:</span>
                <a href="https://github.com/aaravjit" target="_blank" rel="noreferrer">github.com/aaravjit</a>
              </li>
              <li>
                <span className="contact-label">LinkedIn:</span>
                <a href="https://www.linkedin.com/in/aarav-jit-499a93293/" target="_blank" rel="noreferrer">linkedin.com/in/aarav-jit-499a93293</a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <span>&copy; {currentYear} Aarav Jit. Built with Next.js and deployed on GitHub Pages.</span>
        </div>
      </footer>
    </>
  );
}
