"use client";

import { useMemo, useState } from "react";
import profile from "../data/profile.json";

type ResumeView = "general" | "tech";

type Project = (typeof profile.projects)[number];

type ExperienceEntry = (typeof profile.experience)[number];

type EducationEntry = (typeof profile.education)[number];

const projectOrderMap: Record<ResumeView, string[]> = {
  general: ["Work Sample", "Project"],
  tech: ["Project", "Work Sample"],
};

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [view, setView] = useState<ResumeView>("general");

  const orderedProjects = useMemo(() => {
    const order = projectOrderMap[view];

    return [...profile.projects].sort((a, b) => {
      const aIndex = order.indexOf(a.type);
      const bIndex = order.indexOf(b.type);
      return aIndex - bIndex;
    });
  }, [view]);

  const summary = view === "general" ? profile.universal_summary : profile.tech_summary;
  const isGeneral = view === "general";

  const experienceSection = (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section-title">Work Experience</h2>
        <div className="experience-list">
          {profile.experience.map((item: ExperienceEntry) => (
            <article key={`${item.company}-${item.title}`} className="experience-card">
              <div className="experience-header">
                <div>
                  <h3 className="experience-title">{item.title}</h3>
                  <p className="experience-company">{item.company}</p>
                </div>
                <span className="experience-dates">{item.dates}</span>
              </div>
              <ul className="experience-bullets">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="experience-keywords">
                {item.keywords.map((keyword) => (
                  <span key={keyword} className="badge">
                    {keyword}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const projectsSection = (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">Work Samples / Projects</h2>
        <div className="project-grid">
          {orderedProjects.map((project: Project) => (
            <article key={project.name} className="project-card">
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                <span className="project-status">{project.type}</span>
              </div>
              <div className="project-block">
                <p className="project-label">Problem</p>
                <p className="project-description">{project.problem}</p>
              </div>
              <div className="project-block">
                <p className="project-label">Actions</p>
                <ul className="project-list">
                  {project.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
              <div className="project-block">
                <p className="project-label">Results</p>
                <ul className="project-list">
                  {project.results.map((result) => (
                    <li key={result}>{result}</li>
                  ))}
                </ul>
              </div>
              {project.tools ? <p className="project-tech">{project.tools}</p> : null}
              <div className="project-links">
                {project.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="project-link">
                    {link.label} →
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="#top" className="logo">{profile.name}</a>
          <nav className="nav">
            <a href="#resume" className="nav-link">Resume</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#projects" className="nav-link">Work Samples</a>
            <a href="#education" className="nav-link">Education</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top" className="main">
        <section className="hero">
          <div className="container">
            <div className="hero-badges">
              <span className="badge">Open to multiple role types</span>
              <span className="badge">Based in {profile.location}</span>
            </div>
            <h1 className="hero-title">{profile.name}</h1>
            <p className="hero-tagline">{profile.headline}</p>
            <p className="hero-summary">{summary}</p>
            <div className="hero-actions">
              <button
                type="button"
                className={`btn ${isGeneral ? "btn-primary" : ""}`}
                onClick={() => setView("general")}
                aria-pressed={isGeneral}
              >
                General Resume
              </button>
              <button
                type="button"
                className={`btn ${!isGeneral ? "btn-primary" : ""}`}
                onClick={() => setView("tech")}
                aria-pressed={!isGeneral}
              >
                Tech Resume
              </button>
              <a href={profile.contact.resumePdf} target="_blank" rel="noreferrer" className="btn">
                Download Resume (PDF)
              </a>
            </div>
            {isGeneral ? (
              <div className="target-roles">
                <p className="target-label">Target roles</p>
                <div className="chip-group">
                  {profile.target_roles.map((role) => (
                    <span key={role} className="chip">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section id="resume" className="section">
          <div className="container">
            <h2 className="section-title">Resume Overview</h2>
            <div className="resume-tabs" role="tablist" aria-label="Resume view">
              <button
                type="button"
                role="tab"
                aria-selected={isGeneral}
                className={`tab ${isGeneral ? "tab-active" : ""}`}
                onClick={() => setView("general")}
              >
                General Resume
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isGeneral}
                className={`tab ${!isGeneral ? "tab-active" : ""}`}
                onClick={() => setView("tech")}
              >
                Tech Resume
              </button>
            </div>
            <div className="resume-panel">
              <h3 className="resume-title">{isGeneral ? "General Summary" : "Tech Summary"}</h3>
              <p className="resume-summary">{summary}</p>
              {isGeneral ? (
                <div className="resume-highlight">
                  <h4 className="resume-subtitle">What I bring</h4>
                  <ul>
                    <li>Reliable attendance and steady performance in busy shifts.</li>
                    <li>Customer-first communication with a focus on accuracy.</li>
                    <li>Safety-minded handling of people, products, and equipment.</li>
                  </ul>
                </div>
              ) : (
                <div className="resume-highlight">
                  <h4 className="resume-subtitle">What I bring</h4>
                  <ul>
                    <li>Front-end development with accessible, mobile-first UI.</li>
                    <li>Automation mindset for repeatable workflows.</li>
                    <li>Clear documentation and collaboration in Git-based teams.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              <div className="skill-group">
                <h4 className="skill-label">Universal strengths</h4>
                <ul className="pill-list">
                  {profile.skills_universal.map((skill) => (
                    <li key={skill} className="pill">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="skill-group">
                <h4 className="skill-label">Tools & tech</h4>
                <ul className="pill-list">
                  {profile.skills_tools.map((skill) => (
                    <li key={skill} className="pill">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {isGeneral ? (
          <>
            {experienceSection}
            {projectsSection}
          </>
        ) : (
          <>
            {projectsSection}
            {experienceSection}
          </>
        )}

        <section id="education" className="section">
          <div className="container">
            <h2 className="section-title">Education</h2>
            <div className="education-list">
              {profile.education.map((item: EducationEntry) => (
                <article key={item.school} className="education-entry">
                  <h3 className="education-school">{item.school}</h3>
                  <p className="education-degree">{item.degree}</p>
                  <p className="education-date">{item.dates}</p>
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
              Open to opportunities across operations, customer service, logistics, and tech roles. Reach out for
              availability or a tailored resume.
            </p>
            <div className="contact-actions">
              <a href={profile.contact.resumePdf} target="_blank" rel="noreferrer" className="btn btn-primary">
                Download Resume (PDF)
              </a>
              <a href={`mailto:${profile.contact.email}`} className="btn">
                Email
              </a>
            </div>
            <ul className="contact-list">
              <li>
                <span className="contact-label">Email:</span>
                <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
              </li>
              <li>
                <span className="contact-label">GitHub:</span>
                <a href={profile.contact.github} target="_blank" rel="noreferrer">
                  {profile.contact.github.replace("https://", "")}
                </a>
              </li>
              <li>
                <span className="contact-label">LinkedIn:</span>
                <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
                  {profile.contact.linkedin.replace("https://", "")}
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <a href={profile.contact.resumePdf} className="sticky-resume" aria-label="Download resume">
        Resume PDF
      </a>

      <footer className="footer">
        <div className="container">
          <span>&copy; {currentYear} {profile.name}. Built with Next.js and deployed on GitHub Pages.</span>
        </div>
      </footer>
    </>
  );
}
