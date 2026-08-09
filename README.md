# Aarav Jit — Technical Portfolio

A responsive technical portfolio built with Next.js and TypeScript, focused on software, Linux, systems, networking, and current cybersecurity education.

The site highlights three primary projects—Aarav Hyprland, Pathway, and WrenchAI—alongside professional experience, current coursework, and hands-on technical work.

## Live Site

[aaravjit.github.io](https://aaravjit.github.io/)

## Featured Content

* **Aarav Hyprland** — A reusable Arch Linux and Hyprland environment with a Bash-based installation workflow and separate configuration paths for Intel, AMD, and NVIDIA graphics.
* **Hyprland Case Study** — A detailed overview of the project’s purpose, environment, deployment process, technical challenges, screenshots, and planned improvements.
* **Pathway** — An in-development AI-assisted career platform presented through an internal product case study.
* **WrenchAI** — A live, account-based aviation maintenance study platform presented with real product screenshots and a deployed-product case study.
* **Technical Skills** — Windows, Linux, troubleshooting, networking fundamentals, Bash, Git, system services, logs, and hardware configuration.
* **Career Portfolio** — Software and systems projects, technical skills, experience, education, resume, and contact information for early-career technology opportunities.

## Technology Stack

* Next.js
* React
* TypeScript
* CSS
* GitHub Pages
* GitHub Actions

The site uses a static export for fast, reliable deployment through GitHub Pages.

## Project Structure

```text
app/
├── page.tsx
├── layout.tsx
├── globals.css
└── projects/
    ├── aarav-hyprland/page.tsx
    ├── pathway/page.tsx
    └── wrenchai/page.tsx

components/
├── Navigation.tsx
└── ProjectUI.tsx

data/
└── portfolio.ts

public/
├── resume.pdf
├── hyprlandproof.png
├── hyprlandproofterminal.png
├── social-preview.svg
├── social-preview.png
├── wrenchai-landing.png
├── wrenchai-dashboard.png
├── wrenchai-written-test-prep.png
└── wrenchai-practical-prep.png
```

### Key Files

* `app/page.tsx` — Main portfolio page and content structure
* `app/projects/aarav-hyprland/page.tsx` — Aarav Hyprland case study
* `app/projects/pathway/page.tsx` — Pathway software product case study
* `app/projects/wrenchai/page.tsx` — WrenchAI deployed product case study
* `components/Navigation.tsx` — Responsive navigation and active-section tracking
* `app/globals.css` — Dark visual system, responsive layouts, and accessibility styles
* `data/portfolio.ts` — Typed source of truth for shared profile, project, education, and experience facts
* `public/resume.pdf` — Downloadable current resume

## Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/AaravJit/Aaravjit.github.io.git
cd Aaravjit.github.io
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The Aarav Hyprland case study is available at:

```text
http://localhost:3000/projects/aarav-hyprland/
```

The Pathway case study is available at:

```text
http://localhost:3000/projects/pathway/
```

The WrenchAI case study is available at:

```text
http://localhost:3000/projects/wrenchai/
```

## Production Build

Create the static production export:

```bash
npm run build
```

The generated site is written to:

```text
out/
```

Run the following validation commands before publishing changes:

```bash
npx tsc --noEmit
npm run lint
npm run build
git diff --check
```

## Deployment

Deployment is handled automatically through GitHub Actions using:

```text
.github/workflows/deploy.yml
```

Every push or merge to `main`:

1. Installs dependencies with `npm ci`
2. Builds the static Next.js site
3. Uploads the generated `out/` directory
4. Deploys the artifact to GitHub Pages

The generated `out/` directory does not need to be committed manually.

## Design and Accessibility

The portfolio includes:

* Responsive desktop and mobile layouts
* Accessible navigation and keyboard focus states
* Reduced-motion support
* WCAG-conscious color contrast
* Descriptive image alternative text
* Static, performance-focused deployment
* No unnecessary UI frameworks or large client-side dependencies

## Social Preview

The site uses a 1200 × 630 PNG social card for broad Open Graph and social-platform compatibility. The matching SVG remains in `public/` as the editable source.

## Contact

* Portfolio: [aaravjit.github.io](https://aaravjit.github.io/)
* GitHub: [github.com/AaravJit](https://github.com/AaravJit)
* LinkedIn: [Aarav Jit](https://www.linkedin.com/in/aarav-jit-499a93293/)
* Email: [aaravjit16@gmail.com](mailto:aaravjit16@gmail.com)

## License

This repository contains Aarav Jit’s personal portfolio content and design. The source may be reviewed for educational purposes, but personal information, written content, branding, and project assets should not be reused as another person’s portfolio.
