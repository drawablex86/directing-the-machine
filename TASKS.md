# Tasks: Directing the Machine

This file tracks the implementation progress across all tasks. Each task is committed to Git upon completion.

- [x] **Task 0: Initial Repository Baseline**
  - Staged and committed master course materials (`Directing the Machine.md`, `Instructions.md`, `Project 7–12.md`).
  - Commit: `chore: initial repository baseline with course documents and instructions` (`b4f7cc6`)

- [x] **Task 1: Project Scaffolding & Base Tooling**
  - Scaffold SvelteKit 2 + Svelte 5 (Runes) + TypeScript + Tailwind CSS v4.
  - Installed modern `@lucide/svelte` (v1.56.0), `tailwindcss` (v4.3.3), `@tailwindcss/vite`, `zod`, and `canvas-confetti`.
  - Configured Vite with `@tailwindcss/vite` and zero-adjective styles.
  - Commit: `feat(setup): initialize SvelteKit 2 with Svelte 5, Tailwind CSS v4, and @lucide/svelte` (`89dae0f`)

- [x] **Task 2: Core State Engine, Schemas & Scaffolding State Machine**
  - Implemented `src/lib/state/practice.svelte.ts` (Svelte 5 Runes state with localStorage persistence).
  - Implemented `src/lib/schemas/course.schema.ts` (Zod schemas for baseline, problems, briefs, calibrations).
  - Implemented utilities: `adjective-linter.ts`, `calibration-math.ts` (Brier score & Taste-Narrowness detector), and `archive-exporter.ts` (Appendix L folder generator).
  - Commit: `feat(engine): implement practice state engine, scaffolding removal, and log decay detectors` (`7025f00`)

- [x] **Task 3: Studio Shell, Today's Practice Loop & Recovery Systems**
  - Built `TodayLoopHeader.svelte` (with 8-step Weekly Loop and dynamic Mastery Layer 1–3 indicator).
  - Built `TenMinuteLogTimer.svelte` (hard 10-minute countdown preventing logging theatre).
  - Built `ReferenceDrawer.svelte` (Cmd+K just-in-time lookup for Appendices A–O).
  - Built `FailureTriageModal.svelte` (Output, Habit, Motivational, and Log Decay recovery).
  - Built `HemingwayStopModal.svelte` (Stop for the day, declare done, or principled abandonment).
  - Commit: `feat(ui): build studio shell, today's practice loop, reference drawer, and failure recovery` (`647c6e6`)

- [x] **Task 4: Modalities M0, M1, M2 & M3 (Foundation & Formulation)**
  - Built `M0PracticeContractHub.svelte` (12-competency baseline 1–4 radar, Appendix O intensity paths, play & attention timers).
  - Built `M1ProblemPositionLab.svelte` (6-step Problem Funnel, Positionality Compass with standing check, 60m unassigned timer).
  - Built `M2DiagnosticVision.svelte` (Zero-adjective regex linter, 6-question decision audit, top-down diagnostic ladder, HTML5 massing canvas).
  - Built `M3PremiseBriefLab.svelte` (3-premise forge with rejection logic, 7-layer brief builder, 3/6/10 constraint tri-view, provenance stamp).
  - Commit: `feat(modalities): implement M0 Practice Contract, M1 Problem Lab, M2 Diagnostic Vision, and M3 Premise Brief` (`cd65362`)

- [x] **Task 5: Modalities M4, M5, M6 & M7 (Build, Calibrate, Direct & Agency)**
  - Built `M4PipelineCalibration.svelte` (9-layer pipeline mapper, pre-run confidence lock, Brier telemetry, taste-narrowness alert, 45m ergonomic screen HUD).
  - Built `M5TasteCurationArena.svelte` (5-part taste formula, blind provenance ranker with hidden labels, ≥40% human anchor tracker with demotion workflow, reverse challenge).
  - Built `M6DirectionCollab.svelte` (Revision vs re-brief fork, stakeholder critique triage, 5-mode refusal composer, 10s silence tolerance mentorship timer).
  - Built `M7AgencyBlankSheet.svelte` (Written vs inferred position gap analyzer, cross-medium synthesis removal test, 14-step blank-sheet capstone with "How I Decided What to Make" essay).
  - Commit: `feat(modalities): implement M4 Pipeline, M5 Taste Curation, M6 Direction Collab, and M7 Blank-Sheet Capstone` (`da9fc06`)

- [x] **Task 6: Assessment Radar, Logbook, Course Ingestion & Independent Practice**
  - Built `TwoAxisQuadrant.svelte` (Outcome Quality × Decision Quality 2×2 matrix: Mastery, Learning in Progress, Lucky Unstable, Failure).
  - Built `CompetencyRadar16.svelte` (12-competency visual progress radar).
  - Built `/logs` unified studio logbook with 10-minute timer, tabbed history, and 1-click Appendix L JSON/Markdown archive exporter.
  - Connected Phase Progression selector dynamically driving scaffolding removal (`scaffolding.ladder`, `scaffolding.template`, `scaffolding.exercise`).
  - Commit: `feat(assessment): add Two-Axis matrix, competency radar, unified logbook, and curriculum manifest` (`a2fcc44`)

- [x] **Task 7: End-to-End Verification, Walkthrough & Final Polish**
  - Full TypeScript typecheck verified with zero errors (`pnpm exec svelte-check`).
  - Production build bundle built successfully with Vite (`pnpm run build`).
  - Verified local-first storage and Appendix L export capability.
  - Walkthrough artifact documented.

- [x] **Task 8: Course-Level Flow Architecture, Daily Action Pipeline & Projects 1–12 Integration**
  - Built full curriculum and syllabus data layer (`src/lib/data/curriculum.ts`) encoding Weeks 0–12 (Parts I–VI) and Months 4–9 (Independent Practice).
  - Built comprehensive project specifications (`src/lib/data/projects.ts`) for Projects 1 through 12 with deliverables, duration, rubrics, and studio modality links.
  - Enhanced `PracticeEngine` reactive store with task completion tracking, active week/day states, and project evaluation loops.
  - Built `CourseSyllabusView.svelte` and `ProjectBriefModal.svelte` with interactive roadmap, week selector, and project dossiers.
  - Revamped `DailyPracticeView.svelte` with "Day Begins" reading/concept, actionable step-by-step task checklist, mark-complete state transitions, and Hemingway Stop closing hook.
  - Commit: progressive commits (`44ece01`, `c1b92e7`, `a5cf35b`).

- [x] **Task 9: Flagship Ogilvy Homepage, Deep SEO Architecture & Discovery Hub**
  - Relocated deliberate practice studio to `/app` with full preservation of local-first state, modal workflows, daily practice pipeline, and syllabus explorer.
  - Built Ogilvy-styled editorial marketing hero confronting the collapse of execution costs in favor of sensibility, intent, and diagnostic taste.
  - Built `ThesesSection.svelte` with 5 long-form mental models of machine authorship in expandable editorial cards.
  - Built `CurriculumProjectsExplorer.svelte` linking live data from `curriculum.ts` and `projects.ts` (18-week roadmap, 12 project dossiers, concrete mastery gates).
  - Built `SensibilityDiagnostic.svelte` interactive 2-minute diagnostic exercise contrasting amateur prompt slop with structural intent.
  - Built `LabsShowcase.svelte` with deep links to all 8 studio labs (M0–M7).
  - Built `FaqSection.svelte` and `HomeFooter.svelte` with prominent attribution: **"Directing the Machine was conceived, written, engineered, and is built and maintained by Rahul Rajeev"**.
  - Built `SeoHead.svelte` with Google-recognized JSON-LD for `Course`, `EducationalOrganization`, and `FAQPage`, alongside OpenGraph and Twitter cards.
  - Verified 0 TypeScript errors (`pnpm exec svelte-check`) and production build (`pnpm run build`).

- [x] **Task 10: Multi-Modal UX Inclusivity & Diverse Learner Adaptability**
  - Implemented `learnerPreferences` state engine with localStorage persistence for typography, colorways, focus mode, and audio cues.
  - Built accessible `LearnerPreferencesModal.svelte` with 1-click archetypes: ADHD Focus, Dyslexia / Low Glare, High Contrast (WCAG AAA), and Default Studio.
  - Integrated OpenDyslexic / Lexend font options, variable text sizing (Compact to Extra), and line leading (Normal, Relaxed, Loose).
  - Integrated Studio Obsidian (Dark), Warm Paper (Sepia), and High Contrast (AAA) color schemes.
  - Built Single-Task Horizon (ADHD focus mode) in `DailyPracticeView.svelte` to isolate the active rep and eliminate cognitive clutter.
  - Built accessible Web Audio sound cues in `sound-system.ts` for drill completion and timer bell rings.
  - Built `KeyboardShortcutsModal.svelte` and global hotkey listener (`?`, `P`, `F`, `Esc`).
  - Added accessible Skip to Content navigation link.
  - Built local-first JSON backup exporter and restore-from-file utility.

- [x] **Task 11: Author Master Repository & Architecture Guide (`index.md`)**
  - Authored comprehensive root guide `index.md` covering repository overview, philosophy, and attribution to Rahul Rajeev.
  - Documented core pedagogical mechanics: 3 Mastery Layers, Scaffolding Removal Engine, 8-Step Daily Practice Loop, anti-theatre guardrails, 8 studio modalities (M0–M7), and Projects 1–12.
  - Documented how-to instructions for both learners/practitioners and developers/maintainers.
  - Documented full codebase architecture: SvelteKit 2 + Svelte 5 Runes, Tailwind CSS v4, directory taxonomy, state engine, data layer, component hierarchy, and accessibility features.
- [x] **Task 12: Vercel Hosting Preparation & Production Deployment Readiness**
  - Configured static pre-rendering in `src/routes/+layout.ts` (`export const prerender = true`) for zero-cold-start Edge CDN delivery.
  - Added accessibility target anchors (`id="main-content"`) in `/`, `/app`, and `/logs` satisfying crawler prerender integrity.
  - Extended SvelteKit built-in tsconfig in `tsconfig.json` (`"extends": "$app/tsconfig"`).
  - Created `vercel.json` with framework definition, OWASP security headers, and static asset caching policies.
  - Updated GitHub handle in `index.md` to `drawablex86`.
  - Revamped `README.md` with complete Vercel 1-click and CLI deployment guides.
  - Verified 0 TypeScript errors with `npm run check` and successful build with `npm run build`.
- [x] **Task 13: Interactive Appendix Reader & Field Manual Direct Linking**
  - Extracted and bundled full unabridged text and operational protocols for Appendices A through O from `Directing the Machine.md` into type-safe module `src/lib/data/appendices.ts`.
  - Created `AppendixModal.svelte` featuring clean markdown rendering (tables, callout alerts, code blocks, lists), quick cycle navigation (`←`/`→`), jump strip (A–O), and one-click template/protocol copy to clipboard.
  - Upgraded `FieldManualView.svelte` with interactive "Read" action cards and support for URL query params (`?tab=manual&appendix=app-x`) and hash anchors.
  - Enhanced `ReferenceDrawer.svelte` (`⌘K`) with clickable appendix cards that directly open the modal reader.
  - Linked assigned readings in `DailyPracticeView.svelte` and `CourseSyllabusView.svelte` directly to their respective Appendix protocols.
  - Verified 0 TypeScript errors with `npm run check` and successful static pre-rendering build with `npm run build`.

- [x] **Task 14: SEO Strategy Document, Editorial Blog Engine & Technical Discovery Infrastructure**
  - Authored comprehensive root document `SEO_STRATEGY.md` analyzing prompt fatigue, low-hanging keyword opportunities across 3 tiers, 4 audience personas, 4 topical pillars, 12 flagship article briefs, and GEO optimization.
  - Built typed blog data layer `src/lib/data/blog/posts.ts` with 3 fully-developed flagship essays: *"Prompt Engineering is Dead. Long Live Creative Direction"*, *"Why All AI Art Looks the Same (And the 40% Human Anchor Rule)"*, and *"The 7-Layer Creative Brief: Stop Prompting, Start Specifying"*.
  - Built editorial components: `BlogCard.svelte`, `BlogHeader.svelte` (with reading progress bar and theme cycler), and `BlogStudioCallout.svelte` (converting readers to Studio Labs M2, M3, M5, and curriculum).
  - Built SvelteKit routes: `/blog` (filterable index with search) and `/blog/[slug]` (long-form reader with sticky TOC, copy buttons, author colophon, and JSON-LD `BlogPosting` + `BreadcrumbList` structured data).
  - Built dynamic prerendered endpoints: `/sitemap.xml` (full XML sitemap for Google/Bing) and `/blog/rss.xml` (valid RSS 2.0 feed for readers and crawlers).
  - Integrated `static/robots.txt` referencing the canonical sitemap.
  - Added "Field Essays" links to `HomeNavbar.svelte` (desktop and mobile drawer with root-relative anchors) and `HomeFooter.svelte`.
  - Integrated `FieldEssaysSection.svelte` on the homepage presenting the essays to visitors.
  - Verified 0 TypeScript errors (`pnpm run check`) and verified successful static pre-rendering of all 9 routes with `pnpm run build`.

- [x] **Task 15: Canonical Domain Correction & Centralized Configuration Architecture**
  - Created single source of truth `src/lib/config/site.ts` defining `SITE_CONFIG` with canonical domain `https://directing-the-machine.vercel.app`.
  - Replaced all hardcoded placeholder domain references (`directingthemachine.com`) across `SeoHead.svelte`, `posts.ts`, `blog/+page.svelte`, `blog/[slug]/+page.svelte`, `sitemap.xml/+server.ts`, and `rss.xml/+server.ts`.
  - Updated `static/robots.txt` and `SEO_STRATEGY.md` with the verified production Vercel URL.
  - Verified 0 occurrences of placeholder domain with `git grep -i "directingthemachine.com"`.
  - Verified 0 TypeScript errors with `npm run check` and successful static pre-rendering build with `npm run build`.

