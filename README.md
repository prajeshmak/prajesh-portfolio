# Prajesh Makootan — Portfolio

A modern, responsive portfolio for Prajesh Makootan, Data Analyst. The site presents experience, skills, a case-study project, education, certification, and contact details in a minimalist data-inspired interface.

## Tech stack

- React 19 and TypeScript
- Vinext / Vite
- Tailwind CSS (build-time CSS pipeline)
- OpenAI Sites-compatible Cloudflare Worker output
- Accessible semantic HTML, reduced-motion support, and a persistent dark/light theme

## Local setup

Requirements: Node.js 22.13+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Production build

```bash
pnpm build
```

The production output is written to `dist/`.

## Content updates

Portfolio copy lives in `app/page.tsx`; visual styles live in `app/globals.css`. Replace the “coming soon” project note when a GitHub repository or live dashboard URL is available.
