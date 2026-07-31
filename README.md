# Aarav Jit Portfolio

A statically exported Next.js portfolio focused on entry-level IT support, desktop support, networking, Linux, and future cybersecurity opportunities.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` to create the production export in `out/`.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/deploy.yml`. A push to `main` runs `npm ci` and `npm run build`, uploads the generated `out/` directory as a Pages artifact, and deploys it with the official GitHub Pages action. The site is not deployed directly from a committed `out` branch.

## Content and assets

- Homepage presentation is in `app/page.tsx`.
- The Aarav Hyprland case study is in `app/projects/aarav-hyprland/page.tsx`.
- Shared navigation is in `components/Navigation.tsx`.
- Global presentation and responsive behavior are in `app/globals.css`.
- Supporting profile facts are recorded in `data/profile.json`.
- The downloadable resume is `public/resume.pdf`.

## Social preview recommendation

The site currently uses text-only Open Graph and Twitter metadata. Create a purpose-designed social preview image before adding an image to the metadata; the wide Hyprland screenshots should not be forced into a social-card crop.
