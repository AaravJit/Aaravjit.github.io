const technicalStrengths = [
  "Retail fulfillment and customer-facing operations.",
  "Online order picking, accuracy, speed, and inventory workflows.",
  "Windows and Arch Linux troubleshooting.",
  "PC building, component installation, and hardware/software setup.",
  "Command line basics, GitHub, Python, JavaScript/TypeScript, and web deployment.",
  "Practical mechanical interest through motorcycles, cars, and aviation maintenance.",
  "Clear communication, reliability, adaptability, and learning by doing.",
];

const workExperience = [
  {
    company: "Walmart",
    title: "Online Grocery Pickup Associate",
    locationDates: "Citrus Heights, CA · June 2024 – Present",
    bullets: [
      "Pick and prepare online grocery orders accurately in a fast-paced, time-sensitive environment.",
      "Use handheld systems and inventory workflows to locate items, track orders, and maintain accuracy.",
      "Communicate with team members and customers to keep order flow smooth during peak demand.",
      "Handle substitutions, item availability issues, and customer-facing service situations with attention to detail.",
      "Trusted across departments because of reliability, adaptability, and ability to learn systems quickly.",
    ],
  },
  {
    company: "Target",
    title: "Fulfillment Expert",
    locationDates: "Sacramento, CA · November 2023 – January 2024",
    bullets: [
      "Picked and packed online and in-store fulfillment orders during high-volume seasonal demand.",
      "Used handheld fulfillment systems to locate products, confirm accuracy, and meet order deadlines.",
      "Supported team workflow by moving quickly while maintaining product and order accuracy.",
      "Helped maintain a clean, organized, and customer-ready retail environment.",
    ],
  },
];

const projects = [
  {
    name: "Deal AI — Marketplace Listing Analysis Tool",
    type: "Personal Project / Prototype",
    description:
      "A prototype concept for helping users review online marketplace listings faster using listing details, pricing signals, and AI-assisted analysis.",
    bullets: [
      "Designed the idea around a real problem: comparing marketplace listings quickly and spotting better deals.",
      "Built or planned a searchable interface for reviewing listings in one place.",
      "Experimented with AI-assisted review using listing text, images, and pricing context.",
      "Used the project to practice product thinking, automation, and web development.",
    ],
    tech: "Next.js · TypeScript · OpenAI Vision API · Playwright",
    links: [],
  },
  {
    name: "Portfolio Website",
    type: "Personal Website",
    description: "A personal website used to organize my resume, project work samples, and contact information.",
    bullets: [
      "Designed and deployed a personal website to organize my resume, projects, and contact links.",
      "Built a clean layout for desktop and mobile viewing.",
      "Hosted the site through GitHub Pages for easy access from my resume.",
      "Used the project to practice web deployment, layout, and technical presentation.",
    ],
    tech: "Next.js · TypeScript · CSS · GitHub Pages",
    links: [
      { label: "Live Site", href: "https://aaravjit.github.io/" },
      { label: "GitHub Repo", href: "https://github.com/AaravJit/Aaravjit.github.io" },
    ],
  },
];

const education = [
  {
    school: "California State University, Sacramento",
    program: "Computer Science Coursework",
    details:
      "Completed coursework in programming fundamentals and data structures. Continued building technical skills through personal projects, Linux system use, and web development.",
  },
  {
    school: "Sacramento City College",
    program: "Aviation Maintenance Technology Program",
    details: "Enrolled / pursuing FAA A&P pathway",
  },
];

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="#top" className="logo">
            Aarav Jit
          </a>
          <nav className="nav">
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#technical-strengths" className="nav-link">
              Strengths
            </a>
            <a href="#work-experience" className="nav-link">
              Experience
            </a>
            <a href="#projects" className="nav-link">
              Projects
            </a>
            <a href="#education" className="nav-link">
              Education
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="main">
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Student, Builder, and Hands-On Problem Solver</h1>
            <p className="hero-tagline">
              Retail fulfillment experience, technical projects, troubleshooting skills, and a growing path toward
              aviation maintenance and technology.
            </p>
            <div className="hero-actions">
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">
                Download Resume
              </a>
            </div>
            <ul className="top-links">
              <li>
                <span>Email:</span> <a href="mailto:aaravjit16@gmail.com">aaravjit16@gmail.com</a>
              </li>
              <li>
                <span>LinkedIn:</span>{" "}
                <a href="https://www.linkedin.com/in/aarav-jit-499a93293/" target="_blank" rel="noreferrer">
                  linkedin.com/in/aarav-jit-499a93293
                </a>
              </li>
              <li>
                <span>GitHub:</span>{" "}
                <a href="https://github.com/aaravjit" target="_blank" rel="noreferrer">
                  github.com/aaravjit
                </a>
              </li>
              <li>
                <span>Portfolio:</span>{" "}
                <a href="https://aaravjit.github.io/" target="_blank" rel="noreferrer">
                  aaravjit.github.io
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title">About Me</h2>
            <div className="experience-card about-content">
              <p className="about-paragraph">
                I&apos;m based in Sacramento and I&apos;m currently building experience across work, school, and personal
                projects. I&apos;ve worked in fast-paced online order fulfillment at Walmart and Target, where accuracy,
                speed, reliability, and communication mattered every shift. Outside of work, I&apos;m hands-on with
                technology, Linux/Windows systems, PC building, web projects, motorcycles, cars, and aviation
                maintenance. I learn best by doing, troubleshooting, and figuring things out directly.
              </p>
            </div>
          </div>
        </section>

        <section id="technical-strengths" className="section">
          <div className="container">
            <h2 className="section-title">Technical &amp; Practical Strengths</h2>
            <div className="experience-card">
              <ul className="experience-bullets">
                {technicalStrengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="work-experience" className="section">
          <div className="container">
            <h2 className="section-title">Work Experience</h2>
            <div className="experience-list">
              {workExperience.map((role) => (
                <article key={`${role.company}-${role.title}`} className="experience-card">
                  <div className="experience-header">
                    <div>
                      <p className="experience-company">{role.company}</p>
                      <h3 className="experience-title">{role.title}</h3>
                    </div>
                    <span className="experience-dates">{role.locationDates}</span>
                  </div>
                  <ul className="experience-bullets">
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <h2 className="section-title">Projects / Work Samples</h2>
            <div className="experience-list">
              {projects.map((project) => (
                <article key={project.name} className="experience-card">
                  <div className="project-header">
                    <h3 className="project-name">{project.name}</h3>
                    <span className="project-status">{project.type}</span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <ul className="project-list">
                    {project.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <p className="project-meta">
                    <strong>Tech:</strong> {project.tech}
                  </p>
                  {project.links.length > 0 ? (
                    <div className="project-links">
                      {project.links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="project-link">
                          {link.label} →
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container">
            <h2 className="section-title">Education &amp; Career Direction</h2>
            <div className="experience-list">
              {education.map((item) => (
                <article key={item.school} className="experience-card">
                  <h3 className="education-school">{item.school}</h3>
                  <p className="education-degree">{item.program}</p>
                  <p className="education-coursework">{item.details}</p>
                </article>
              ))}
              <article className="experience-card">
                <h3 className="education-school">Career Direction</h3>
                <p className="education-coursework">
                  I&apos;m interested in work that combines technical problem solving, hands-on learning, customer
                  service, and real-world systems. My current direction includes aviation maintenance, technology
                  support, and practical projects that let me keep building useful skills.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <h2 className="section-title">Contact</h2>
            <div className="contact-actions">
              <a href="mailto:aaravjit16@gmail.com" className="btn btn-primary">
                Email Me
              </a>
            </div>
            <ul className="contact-list">
              <li>
                <span className="contact-label">Email</span>
                <a href="mailto:aaravjit16@gmail.com">aaravjit16@gmail.com</a>
              </li>
              <li>
                <span className="contact-label">LinkedIn</span>
                <a href="https://www.linkedin.com/in/aarav-jit-499a93293/" target="_blank" rel="noreferrer">
                  https://www.linkedin.com/in/aarav-jit-499a93293/
                </a>
              </li>
              <li>
                <span className="contact-label">GitHub</span>
                <a href="https://github.com/aaravjit" target="_blank" rel="noreferrer">
                  https://github.com/aaravjit
                </a>
              </li>
              <li>
                <span className="contact-label">Portfolio</span>
                <a href="https://aaravjit.github.io/" target="_blank" rel="noreferrer">
                  https://aaravjit.github.io/
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <a href="/resume.pdf" className="sticky-resume" aria-label="Download resume PDF">
        Resume PDF
      </a>

      <footer className="footer">
        <div className="container">
          <span>&copy; {currentYear} Aarav Jit. Built with Next.js and deployed on GitHub Pages.</span>
        </div>
      </footer>
    </>
  );
}
