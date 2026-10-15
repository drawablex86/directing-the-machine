# Directing the Machine

> *A Deliberate Practice Environment for Creative Authorship, Diagnostic Vision, and Calibrated Direction in an AI-Augmented World.*
>
> **Conceived, written, engineered, and maintained by [Rahul Rajeev](https://github.com/drawablex86).**

[![Built with SvelteKit 2](https://img.shields.io/badge/SvelteKit-2.0-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/docs/kit)
[![Svelte 5 Runes](https://img.shields.io/badge/Svelte-5%20Runes-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/docs/svelte)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Hosted on Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?logo=vercel&logoColor=white)](https://directing-the-machine.vercel.app)
[![WCAG 2.2 AAA Contrast](https://img.shields.io/badge/Accessibility-WCAG%20AAA-success)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Local-First Privacy](https://img.shields.io/badge/Storage-Local--First-amber)](https://github.com/drawablex86/directing-the-machine)

---

## Overview & Philosophy

In an era where generative AI collapses the marginal cost of execution to zero, generation itself ceases to be a competitive differentiator. When anyone can summon high-fidelity visuals, code, or prose in seconds, the prevailing failure mode is **amateur prompt slop**: superficial aesthetic polish masking hollow structure, wandering intent, uncalibrated taste, and zero authorial agency.

**Directing the Machine** is not a prompt book or a collection of hacks. It is a university-grade deliberate practice curriculum and a local-first software studio designed to cultivate:
- **Diagnostic Vision**: The ability to perceive structural flaws, compositional breakdowns, and thematic failures without hiding behind vague subjective shortcuts (*"looks cool"*, *"feels off"*).
- **Calibrated Taste**: An explicit, defensible aesthetic standard tested against blind curation and mathematical Brier forecasting error.
- **Direction & Refusal**: Formulating 7-layer creative briefs, managing revision vs. re-brief forks, and knowing when to refuse generation entirely.
- **Blank-Sheet Artistic Agency**: Finding problems in the world, committing to an authorial stance, and creating original work from an unassigned beginning.

---

## Core Features & Capabilities

### 1. Flagship Ogilvy Editorial Experience (`/`)
- **Long-Form Theses**: 5 core mental models confronting the collapse of execution costs in expandable editorial cards.
- **Prompt vs. Direction Matrix**: Clear side-by-side contrast of amateur prompting habits vs. calibrated creative direction.
- **Interactive Sensibility Diagnostic**: A 2-minute diagnostic exercise exposing prompt slop vs. structural specification.
- **Live Zero-Adjective Linter**: Interactive sandbox demonstrating how subjective words (*amazing*, *clean*, *slick*, *boring*) are caught and replaced with structural critiques.
- **Curriculum & Project Explorer**: Interactive roadmap detailing all 19 weeks and 12 capstone project dossiers.

### 2. Deliberate Practice Studio (`/app`)
- **8-Step Daily Practice Loop**: A disciplined daily rhythm (`Read 20m → Practise 60m → Study 60m → Make 2h → Diagnose 30m → Log 10m → Transfer 30m → Play 30m`).
- **Single-Task Horizon (ADHD Focus Mode)**: Isolates the current drill or task, hiding all background navigation and cognitive clutter.
- **The Hemingway Stop**: Enforces deliberate momentum by stopping for the day while the next step is crystal clear.
- **Four-Way Failure Triage**: Prescriptive recovery flows for Output Failure, Habit Failure, Motivational Failure, and Log Decay.

### 3. The 8 Interactive Studio Modalities (`M0`–`M7`)
1. **`M0` Practice Contract Hub**: Baseline 12-competency radar, intensity path configuration (Appendix O), runway calculator, and non-instrumental play timers.
2. **`M1` Problem-Finding & Positionality Lab**: 6-step Problem Funnel (`Notice → Collect → Frame → Test → Select → Justify`) and Positionality Compass (`From | With | For | About | Over`).
3. **`M2` Observation & Diagnostic Vision Studio**: Zero-adjective real-time regex linter, 6-question decision extractor, top-down diagnostic ladder, and HTML5 massing memory canvas.
4. **`M3` Premise Forge & Brief Architect**: 3-premise viability matrix with explicit rejection logic, 7-layer brief builder, and 3/6/10 constraint density tri-view.
5. **`M4` Causal Pipeline & Calibration Lab**: 9-layer pipeline mapper, pre-run confidence slider, mathematical Brier error telemetry, and Taste-Narrowness detector.
6. **`M5` Taste Infrastructure & Blind Curation Arena**: 5-part taste formula, 20-item blind provenance ranker with hidden labels, and $\ge 40\%$ human anchor tracker.
7. **`M6` Direction, Collaboration & Refusal Studio**: Revision vs. re-brief diagnostic fork, stakeholder critique translator, and 5-mode refusal composer (`Ethical | Positional | Technical | Intentional | Slop`).
8. **`M7` Position Gap, Synthesis & Blank-Sheet Capstone**: Written vs. inferred position gap analyzer, cross-medium synthesis test, and 14-step blank-sheet capstone builder.

### 4. Curriculum, Projects & Appendices
- **19-Week Syllabus (`src/lib/data/curriculum.ts`)**: 81 individual modules and **133 daily practice schedules**, each with targeted time allocations and assigned readings.
- **12 Flagship Project Dossiers (`src/lib/data/projects.ts`)**: Full specifications, milestone checklists, and four-level evaluation rubrics (Novice to Mastery) for Projects 1 through 12.
- **Interactive Appendix Reader**: Complete, unabridged text and operational protocols for **Appendices A through O**, featuring tables, callouts, and 1-click clipboard export.

### 5. Client-Side BYOK (Bring Your Own Key) Inference Engine
- **Direct-to-Provider Client Architecture**: Execute LLM inference directly from the browser without intermediary backends.
- **Multi-Provider Support**:
  - **OpenRouter** (`https://openrouter.ai/api/v1`)
  - **OpenAI** (`https://api.openai.com/v1`)
  - **Google Gemini** (`https://generativelanguage.googleapis.com/v1beta`)
  - **Anthropic** (`https://api.anthropic.com/v1` with direct browser headers)
  - **Custom / Local Endpoints** (e.g. `http://localhost:11434/v1` for local Ollama)
- **Live Model Fetching & Latency Ping**: Enumerate available models dynamically and verify connection latency with a 1-token test.

### 6. Unified Studio Logbook (`/logs`)
- **Strict 10-Minute Log Timer**: Auto-saves and locks inputs after 10 minutes (*"The document is not the practice. Go make something."*).
- **Appendix L Archive Exporter**: Generates a complete, downloadable Markdown and JSON archive of all studio logs, briefs, decisions, and calibrations.

### 7. Editorial Field Essays & Discovery Infrastructure
- **Field Essays Engine (`/blog`, `/blog/[slug]`)**: Long-form essays with reading progress bars, sticky table of contents, and studio lab callouts.
- **SEO & Discovery**: Prerendered XML sitemap (`/sitemap.xml`), valid RSS 2.0 feed (`/blog/rss.xml`), Google JSON-LD schema (`Course`, `EducationalOrganization`, `FAQPage`, `BlogPosting`), and OpenGraph cards.

### 8. Kepano Stone & Paper Design System
- **Two Curated Modes**: Stone (volcanic slate with amber glow) and Paper (archival parchment with carbon ink).
- **WCAG 2.1 & 2.2 AAA Accessibility**: Hardened contrast normalization guaranteeing 7:1+ contrast on light paper surfaces.
- **Inclusive Typography**: Support for system sans, serif, monospace, and **OpenDyslexic**.
- **Tactile Sound System**: Synthesized audio cues via Web Audio API oscillators.

---

## Quick Start & Local Development

### Prerequisites
- Node.js $\ge 18$
- `pnpm` (recommended) or `npm`

### Installation
```bash
# Clone the repository
git clone https://github.com/drawablex86/directing-the-machine.git
cd directing-the-machine

# Install dependencies
pnpm install
```

### Development Server
```bash
# Start Vite development server
pnpm run dev
# Studio available at http://localhost:5173
```

### Type Checking & Build Verification
```bash
# Typecheck with SvelteKit and svelte-check
pnpm run check

# Compile production bundle and prerender static routes
pnpm run build

# Preview production build locally
pnpm run preview
```

---

## Deploying to Vercel

The repository is pre-configured for zero-friction hosting on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Vercel automatically detects SvelteKit and configures:
   - **Framework Preset**: `SvelteKit`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: Automatically resolved by `@sveltejs/adapter-auto`
4. Click **Deploy**.
5. All routes (`/`, `/app`, `/logs`, `/blog`, `/blog/[slug]`, `/sitemap.xml`, `/blog/rss.xml`) are statically pre-rendered at build time with `export const prerender = true` in `src/routes/+layout.ts` and served from Vercel's Global Edge CDN with zero cold starts.

---

## Architecture & Documentation Map

| Document | Purpose |
| :--- | :--- |
| **[`AGENT.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/AGENT.md)** | **Operating Directives for AI Agents**: Svelte 5 Runes rules, Tailwind v4 constraints, and mandatory documentation update protocols. |
| **[`docs/ARCHITECTURE.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/docs/ARCHITECTURE.md)** | **Technical Architecture Blueprint**: System topology, reactive state engine, domain math, BYOK pipeline, and directory taxonomy. |
| **[`docs/DESIGN_SYSTEM.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/docs/DESIGN_SYSTEM.md)** | **Kepano Stone & Paper Design System**: Color token dictionary, WCAG AAA contrast normalization, typography, and component patterns. |
| **[`Instructions.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/Instructions.md)** | **Course UI/UX Specification**: Pedagogical guardrails, anti-overbuilding rules, and M0–M7 studio modality mechanics. |
| **[`Directing the Machine.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/Directing%20the%20Machine.md)** | **Master Course Textbook**: Complete 19-module syllabus and unabridged Appendices A through O. |
| **[`SEO_STRATEGY.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/SEO_STRATEGY.md)** | **Search & Discovery Strategy**: Keyword tiers, editorial calendar, and distribution infrastructure. |
| **[`TASKS.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/TASKS.md)** | **Engineering Task Log**: Commit-by-commit record of all features, refactors, and verifications. |

---

## License & Attribution

Directing the Machine is an original pedagogical and technical work.

- **Conception, Writing & Engineering**: [Rahul Rajeev](https://github.com/drawablex86)
- **Year**: 2026
- **Architecture**: Open deliberate practice studio with local-first, zero-telemetry client architecture.
