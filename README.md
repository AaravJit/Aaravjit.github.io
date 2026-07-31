# Aarav Jit — Technical Portfolio

A responsive technical portfolio built with Next.js and TypeScript, focused on entry-level IT support, desktop support, systems troubleshooting, networking fundamentals, Linux, and cybersecurity education.

The site highlights hands-on technical projects, professional experience, current coursework, and ongoing lab development.

## Live Site

[aaravjit.github.io](https://aaravjit.github.io/)

## Featured Content

* **Aarav Hyprland** — A reusable Arch Linux and Hyprland environment with a Bash-based installation workflow and separate configuration paths for Intel, AMD, and NVIDIA graphics.
* **Hyprland Case Study** — A detailed overview of the project’s purpose, environment, deployment process, technical challenges, screenshots, and planned improvements.
* **Technical Skills** — Windows, Linux, troubleshooting, networking fundamentals, Bash, Git, system services, logs, and hardware configuration.
* **Career Portfolio** — Experience, education, resume, current learning roadmap, and contact information for entry-level IT opportunities.

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
    └── aarav-hyprland/
        └── page.tsx

components/
└── Navigation.tsx

data/
└── profile.json

public/
├── resume.pdf
├── hyprlandproof.png
└── hyprlandproofterminal.png
```

### Key Files

* `app/page.tsx` — Main portfolio page and content structure
* `app/projects/aarav-hyprland/page.tsx` — Aarav Hyprland case study
* `components/Navigation.tsx` — Responsive navigation and active-section tracking
* `app/globals.css` — Dark visual system, responsive layouts, and accessibility styles
* `data/profile.json` — Supporting profile and portfolio information
* `public/resume.pdf` — Downloadable IT-support resume

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

## Current Development

The portfolio will continue to expand with documented hands-on labs covering:

* Windows and Linux troubleshooting
* DNS and network diagnostics
* Windows Server administration
* PowerShell and Bash support scripts
* Common help-desk scenarios and resolutions

These labs will be added as they are completed and verified.

## Social Preview

The site currently uses text-based Open Graph and Twitter metadata.

A purpose-built social preview image should be created before image metadata is added. The existing Hyprland screenshots use an ultrawide aspect ratio and should not be cropped into a standard social card.

## Contact

* Portfolio: [aaravjit.github.io](https://aaravjit.github.io/)
* GitHub: [github.com/AaravJit](https://github.com/AaravJit)
* LinkedIn: [Aarav Jit](https://www.linkedin.com/in/aarav-jit-499a93293/)
* Email: [aaravjit16@gmail.com](mailto:aaravjit16@gmail.com)

## License

This repository contains Aarav Jit’s personal portfolio content and design. The source may be reviewed for educational purposes, but personal information, written content, branding, and project assets should not be reused as another person’s portfolio.
