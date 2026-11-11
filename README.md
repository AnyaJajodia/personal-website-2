# Anya Jajodia — Personal Portfolio

**Software, research, and a little curiosity.**

A personal website exploring the work I've done across software engineering, applied AI, and natural-history research.

**[Visit the website](https://anya.jajodia.org/)**

## About the project

Designed and built with **Next.js, TypeScript, and React**, this portfolio is both a home for my work and a small design experiment in its own right.

The experience combines an illustrated visual language with responsive layouts, an interactive background, and a scroll-linked line that guides the reader through the site. Project pages highlight selected engineering and research experiences.

## Technology

- Next.js 16 (App Router) and React
- TypeScript
- Custom interactive UI components and scroll-linked graphics
- Vercel for deployment

## Running locally

Requires Node.js 22 (see `.nvmrc`).

```bash
npm install
npm run dev
```

Visit `http://localhost:3100`.

Additional commands:

```bash
npm run check   # typecheck, lint, and build
npm run start   # production preview on port 3100
```

## Where things live

- `src/content/site.ts` and `src/content/work.ts` — site copy and project information
- `src/components/` — interactive sections and visual components
- `src/lib/home-route.ts` and `src/lib/line-geometry.ts` — geometry and scroll-linked line logic
- `src/content/avatars.ts` — illustrated avatar configurations
- `public/` — public image and logo assets

This repository also includes development notes and implementation references. The [live site](https://anya.jajodia.org/) is the best place to experience the design.

---

Made by [Anya Jajodia](https://github.com/AnyaJajodia).
