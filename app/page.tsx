const targetRoles = [
  "Technical Specialist",
  "Apple Retail",
  "Customer Technical Support",
  "Product Specialist",
  "Retail Technology Support",
];

const technicalStrengths = [
  "Comfortable troubleshooting Windows, Arch Linux, dual-boot setups, hardware issues, drivers, and device configuration.",
  "Experience building and configuring PCs, installing components, and diagnosing common hardware and software problems.",
  "Able to explain technical issues in simple language for non-technical users.",
  "Familiar with GitHub, command-line tools, Python, JavaScript/TypeScript, and web deployment.",
  "Strong interest in consumer technology, Apple products, customer support, and repair/service workflows.",
];

const workExperience = [
  {
    company: "Walmart",
    title: "Online Grocery Pickup Associate",
    locationDates: "Citrus Heights, CA · June 2024 – Present",
    bullets: [
      "Pick and prepare online grocery orders accurately in a fast-paced, time-sensitive environment.",
      "Communicate with team members and customers to keep order flow smooth during peak demand.",
      "Handle substitutions, item availability issues, and customer-facing service situations with attention to detail.",
      "Trusted across departments because of reliability, adaptability, and ability to learn systems quickly.",
      "Maintain accuracy while using handheld devices, inventory tools, and fulfillment workflows.",
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
    type: "Personal Project",
    description:
      "Prototype tool for analyzing online marketplace listings using listing details, pricing signals, and AI-assisted review.",
    bullets: [
      "Designed the concept for a tool that helps users compare marketplace listings faster.",
      "Built a searchable interface for reviewing potential deals in one place.",
      "Experimented with AI-based listing analysis using product images and listing text.",
      "Explored automation workflows for collecting and refreshing listing data.",
    ],
    shows: "Product thinking · AI tool integration · Web development · Real-world problem solving",
    tech: "Next.js · TypeScript · OpenAI Vision API · Playwright",
    links: [],
  },
  {
    name: "Portfolio Website",
    type: "Personal Website",
    description: "Personal site used to present resume details, project samples, and contact information clearly.",
    bullets: [
      "Designed and deployed a personal portfolio to organize my resume, projects, and contact links.",
      "Built a responsive layout for desktop and mobile viewing.",
      "Hosted the site through GitHub Pages for easy access by employers.",
      "Used the project to practice clean structure, deployment, and technical presentation.",
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
            <a href="#resume" className="nav-link">
              Resume
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
        <section id="about" className="hero">
          <div className="container">
            <p className="target-label">Role Focus</p>
            <div className="chip-group">
              {targetRoles.map((role) => (
                <span key={role} className="chip">
                  {role}
                </span>
              ))}
            </div>
            <h1 className="hero-title">Customer-Focused Technical Support Candidate</h1>
            <p className="hero-tagline">
              Hands-on with consumer technology, troubleshooting, Linux/Windows systems, and customer-facing retail
              operations.
            </p>
            <p className="hero-summary">
              I&apos;m a Sacramento-based customer-facing team member with hands-on experience in fast-paced retail
              fulfillment and a strong personal background in technology. I&apos;ve worked in online order fulfillment at
              Walmart and Target, where accuracy, speed, communication, and reliability mattered every shift. Outside
              of work, I build web projects, troubleshoot Linux and Windows systems, and create tools that solve real
              problems.
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

        <section id="resume" className="section">
          <div className="container">
            <h2 className="section-title">Apple-Focused Resume</h2>
            <div className="resume-panel">
              <p className="resume-summary">
                Focused on Apple Retail and customer-facing technical support roles where reliability, communication,
                and practical troubleshooting matter every day.
              </p>
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">
                Download Resume
              </a>
            </div>
          </div>
        </section>

        <section id="technical-strengths" className="section">
          <div className="container">
            <h2 className="section-title">Technical Strengths</h2>
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
                  {project.shows ? <p className="project-meta"><strong>What it shows:</strong> {project.shows}</p> : null}
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
            <h2 className="section-title">Education</h2>
            <div className="experience-list">
              {education.map((item) => (
                <article key={item.school} className="experience-card">
                  <h3 className="education-school">{item.school}</h3>
                  <p className="education-degree">{item.program}</p>
                  <p className="education-coursework">{item.details}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <h2 className="section-title">Contact</h2>
            <p className="contact-intro">
              I&apos;m looking for Apple Retail and customer-facing technical support opportunities in the Sacramento area.
            </p>
            <div className="contact-actions">
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">
                Download Resume
              </a>
              <a href="mailto:aaravjit16@gmail.com" className="btn">
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

      <a href="/resume.pdf" className="sticky-resume" aria-label="Download Apple-focused resume">
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
