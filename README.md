# Directing the Machine

> *A Deliberate Practice Environment for Creative Authorship, Diagnostic Vision, and Calibrated Direction in an AI-Augmented World.*
>
> **Conceived, written, engineered, and maintained by [Rahul Rajeev](https://github.com/drawablex86).**

An 18-week curriculum, 12 flagship projects, and 8 interactive deliberate practice studios (M0–M7) built with SvelteKit 2, Svelte 5 (Runes), and Tailwind CSS v4.

---

## Quick Start

### Developing Locally
```sh
# Install dependencies
pnpm install # or npm install

# Start Vite dev server
pnpm run dev # or npm run dev
```

### Type Checking & Build
```sh
# Run SvelteKit typecheck
pnpm run check

# Create production build
pnpm run build

# Preview production build locally
pnpm run preview
```

---

## Deploying to Vercel

This repository is pre-configured for zero-friction hosting on [Vercel](https://vercel.com).

### Option 1: Git Integration (Recommended)
1. Push your repository to GitHub (`git push origin master` or `main`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository (`drawablex86/directing-the-machine`).
3. Vercel automatically detects **SvelteKit** and configures the default settings:
   - **Framework Preset**: `SvelteKit`
   - **Build Command**: `pnpm run build` (or `npm run build`)
   - **Output Directory**: Automatically handled by SvelteKit adapter
4. Click **Deploy**.
5. All routes (`/`, `/app`, `/logs`) are statically pre-rendered at build time with `prerender = true` in [`src/routes/+layout.ts`](file:///Users/rahulrajeev/Downloads/directing-the-machine/src/routes/+layout.ts) and served directly from Vercel's Global Edge Network with 0ms serverless cold-start overhead.

### Option 2: Deploying via Vercel CLI
```sh
# Install Vercel CLI globally
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration Highlights
- **`vercel.json`**: Provides standard OWASP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) and immutable 1-year caching for static fonts and SVG brandmarks.
- **Static Pre-rendering**: Powered by `@sveltejs/adapter-auto` and `src/routes/+layout.ts`, generating full static HTML snapshots for ultra-fast First Contentful Paint.
- **Local-First Privacy**: Entire practice engine persists in the browser via `localStorage` with zero server databases or cloud tokens needed.

---

## Documentation & Architecture
- Full Architecture & Curriculum Guide: [`index.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/index.md)
- Master Course Reference: [`Directing the Machine.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/Directing%20the%20Machine.md)
- UI/UX & Studio Specification: [`Instructions.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/Instructions.md)
- Implementation Roadmap: [`TASKS.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/TASKS.md)
