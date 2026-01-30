# Aaravjit.github.io

A GitHub Pages-ready portfolio site built with Next.js.

## Update profile content
Edit `data/profile.json` to update the portfolio content. This file is the single source of truth for:
- Name, headline, and summaries
- Skills
- Work experience
- Projects / work samples
- Contact links

## Add a new job entry
1. Open `data/profile.json`.
2. Add a new object to the `experience` array with:
   - `company`, `title`, `dates`
   - `bullets` (impact statements)
   - `keywords` (short tags)

## Add a new project / work sample
1. Open `data/profile.json`.
2. Add a new object to the `projects` array with:
   - `name`, `type`
   - `problem`, `actions`, `results`
   - `links` (label + url)
   - `tools` (optional)
