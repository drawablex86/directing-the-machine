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

- [x] **Task 16: BYOK Inference Setup Under Settings Tab**
  - Implemented type system `src/lib/types/inference.ts` for providers (`openrouter`, `openai`, `google`, `anthropic`, `custom`), credentials, model options, requests, and responses.
  - Built unified client inference engine `src/lib/engine/inference.ts` with direct browser fetch, dynamic model retrieval (`fetchAvailableModels`), connection & latency tester (`testInferenceConnection`), and unified completion runner (`runInference`) across OpenRouter, OpenAI, Google Gemini, Anthropic, and custom OpenAI-compatible endpoints.
  - Enhanced `PracticeEngine` reactive store (`src/lib/state/practice.svelte.ts`) with `byokSettings`, provider switching, key masking, and local-first persistence via `localStorage`.
  - Built interactive `ByokSettingsTab.svelte` component featuring provider cards, password-masked API key inputs, custom base URL configuration, live "Fetch Models" button, model search filter combobox with context window and pricing badges, manual model ID override, and 1-click latency tester.
  - Upgraded `LearnerPreferencesModal.svelte` to "Studio Settings & Preferences" modal, introducing the "AI Inference (BYOK)" tab as the primary tab.
  - Added "Settings" tab with status dot in Studio navigation bar (`src/routes/app/+page.svelte`) and deep-link query parameter support (`?tab=settings`).
  - Added status dot and updated tooltip in `TodayLoopHeader.svelte` and keyboard shortcut (`P` / `S`) in `KeyboardShortcutsModal.svelte`.
  - Verified 0 TypeScript errors with `pnpm run check` and successful static prerender build with `pnpm run build`.

- [x] **Task 17: Documentation, Architecture & Design System Refresh and Agent Operating Manual**
  - Created root `AGENT.md` establishing operating guidelines for AI coding agents, non-negotiable Svelte 5 Runes standards, pure CSS Tailwind v4 rules, and the mandatory Documentation Synchronization Protocol.
  - Created standalone `docs/ARCHITECTURE.md` documenting high-level topology, local-first reactive persistence, Svelte 5 Runes state model, domain engines (Brier score math, zero-adjective linter, sound system, BYOK inference), directory taxonomy, and extension guides.
  - Created standalone `docs/DESIGN_SYSTEM.md` detailing the Kepano Stone & Paper aesthetic, color token dictionary for Stone (Dark) and Paper (Light) modes, WCAG AAA contrast normalization rules, typography hierarchy, and UI component primitives.
  - Overhauled root `README.md` to comprehensively showcase the state of the repository: philosophy, Ogilvy homepage, 8 studio modalities (M0–M7), 19-week curriculum, 12 project dossiers, BYOK client inference, blog engine, quickstart commands, and Vercel hosting instructions.
  - Updated `index.md` with links to `AGENT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, and an updated directory tree.
  - Verified 0 TypeScript errors with `pnpm run check` and successful static pre-rendering of all 9 routes with `pnpm run build`.

- [x] **Task 18: LLM Interaction Primitives & Prompt Registry Architecture**
  - Implemented type system `src/lib/types/llm-prompts.ts` defining `PromptTemplateId`, `PromptRole`, `PromptConfig`, `CritiqueResult`, and `LlmAction`.
  - Built central prompt engine `src/lib/engine/prompt-registry.ts` housing system prompts, formatters, and parameters for all 23 course touchpoints governed by the strict anti-slop, zero-adjective directive.
  - Built unified execution function `executePrompt` executing inference through `runInference` and returning structured critique records with latency, token usage, and model metadata.
  - Built accessible UI primitive `LlmTriggerButton.svelte` with loading state, automatic BYOK key status detection, model pill, and popover shortcut to Settings (`?tab=settings`) when keys are missing.
  - Built accessible UI primitive `LlmCritiqueCard.svelte` featuring Markdown rendering, metadata bar, copy-to-clipboard, custom action buttons ("Apply to Field"), and error recovery.
  - Enhanced `PracticeEngine` reactive store with `isByokConfigured` and `activeModelName` status getters.
  - Verified 0 TypeScript errors with `pnpm run check` and verified static pre-rendering build with `pnpm run build`.

- [x] **Task 19: M2 Studio — Semantic Zero-Adjective Linter & Diagnostic Ladder Auditor**
  - Architected the **Surgical Diff Protocol & Large-Context Architecture** for long essays and documents: prompt instructs model to emit targeted `[PATCHES]` pairs instead of rewriting clean text, making token consumption proportional to defects rather than essay size.
  - Implemented `parseSurgicalPatches` and `applySurgicalPatches` performing client-side string replacements in-place on flagged sentences, leaving clean paragraphs, formatting, and authorial voice 100% intact.
  - Implemented `sanitizeInferenceResponse` in `src/lib/engine/inference.ts` to automatically strip `<think>...</think>` and `<thought>...</thought>` tags from reasoning models (e.g. `nvidia/llama-3.1-nemotron-70b-instruct:free`, DeepSeek R1, o1) and route internal reasoning monologue into `result.thought`.
  - Added collapsible Reasoning Monologue Drawer (`<details>`) and truncation warning banners in `LlmCritiqueCard.svelte`.
  - Added automatic OpenRouter `:free` model detection with green badges and 1-click `onlyFreeModels` filter toggle in BYOK Settings.
  - Raised default max completion tokens from 1024 to `8192` across all providers to provide ample headroom for reasoning models and long-text audits.
  - Integrated Semantic Zero-Adjective Linter in `M2DiagnosticVision.svelte` with `LlmTriggerButton` and dynamic action button `Apply Structural Replacements (N)`.
  - Integrated Diagnostic Ladder Auditor in `M2DiagnosticVision.svelte` with machine-readable `[LADDER_VERDICT]` parsing and dynamic action button `Promote to Level X`.
  - Verified 0 TypeScript errors with `pnpm run check`, verified production prerender build with `pnpm run build`, and passed all unit test assertions.

- [x] **Task 20: M1 Studio — Problem Funnel Interrogator & Positionality Compass Auditor**
  - Integrated Socratic Dialectician (`m1-problem-stress-test`) into `M1ProblemPositionLab.svelte` Stage 2 (Frame & Mode) with 8,192 token headroom and `<think>` reasoning tag isolation.
  - Implemented `parseTensionReframe` helper in `prompt-registry.ts` parsing machine-readable `[TENSION_REFRAME]` blocks (`IS_GENUINE_TENSION`, `PROPOSED_TENSION_FRAME`, `SHARPENED_STAKES`, `FRICTION_QUESTION`).
  - Added 1-click **"Apply Sharpened Tension Frame"** in-place action updating `framedProblem` and `stakes`.
  - Integrated Positionality Ethics Examiner (`m1-positionality-audit`) into Stage 3 (Positionality & Standing) auditing claimed standing across the 5 positions (*From, With, For, About, Over*) without moral paralysis.
  - Implemented `parsePositionVerdict` helper in `prompt-registry.ts` parsing machine-readable `[POSITION_VERDICT]` blocks (`VERDICT`, `RECOMMENDED_POSITION`, `RECOMMENDED_STANDING`, `PRIMARY_RISK`).
  - Added 1-click **"Shift to Position '[X]'"**, **"Switch to Positional Refusal"**, and **"Confirm Standing"** in-place actions.
  - Verified 0 TypeScript errors with `pnpm run check`, verified production build with `pnpm run build`, and passed all unit test assertions.

- [x] **Task 21: M3 Studio — Premise Matrix Triangulator & 7-Layer Brief Reviewer**
  - Integrated Dialectical Dramaturg & Premise Architect (`m3-premise-triangulation`) into `M3PremiseBriefLab.svelte` Tab 1 (Premise Forge) evaluating 3 rival premises for dialectical divergence, anti-parallelism, and rejection soundness.
  - Implemented `parsePremiseTriangulation` helper in `prompt-registry.ts` parsing machine-readable `[PREMISE_TRIANGULATION]` blocks (`RECOMMENDED_PREMISE`, `DIVERGENCE_RATING`, `REJECTION_SOUNDNESS`, `SHARPENED_PREMISE_1/2/3`, `RISK_ANALYSIS`).
  - Added 1-click **"Adopt Recommended Premise (Candidate X)"** and **"Apply Sharpened Premise Trio"** in-place actions in Premise Forge.
  - Integrated Chief Specification Inquisitor (`m3-brief-redline`) into Tab 2 (7-Layer Brief) auditing all 7 layers (Intention, Directorial Position, Aesthetic Lineage, Hard Constraints, Negative Space, Rejection Conditions, Acceptance Threshold).
  - Implemented `parseBriefRedline` helper in `prompt-registry.ts` parsing machine-readable `[BRIEF_REDLINE]` blocks (`VERDICT`, `HARDENED_INTENTION`, `SUGGESTED_CONSTRAINTS`, `SUGGESTED_NEGATIVE_REJECTIONS`, `FLAGGED_WEAKNESSES`).
  - Added 1-click **"Inject Hardened Constraints & Rejections"** and **"Adopt Hardened Intention"** in-place actions in 7-Layer Brief.
  - Completed missing UI state rendering for Candidate Premise 3 and Layer 6 Negative Rejection Conditions list.
  - Verified 0 TypeScript errors with `pnpm run check`, verified production build with `pnpm run build`, and passed all unit test assertions.

- [x] **Task 22: M4 Studio — Causal Calibration Coach & Taste-Narrowness Detector**
  - Integrated Superforecaster & Calibration Master (`m4-pre-run-reality-check`) into `M4PipelineCalibration.svelte` Tab 2 evaluating causal hypotheses and stated confidence percentages prior to execution.
  - Implemented `parseCalibrationCheck` in `prompt-registry.ts` parsing machine-readable `[CALIBRATION_CHECK]` blocks (`VERDICT`, `RECOMMENDED_CONFIDENCE`, `LATENT_RISK`, `FALSIFICATION_CRITERION`, `SHARPENED_PREDICTION`).
  - Added 1-click **"Adopt Calibrated Confidence (X%)"** and **"Adopt Sharpened Falsifiable Prediction"** in-place actions in Pre-Run form.
  - Integrated Post-Mortem Causal Diagnostician (`m4-post-run-divergence`) diagnosing why predictions diverged from actual outcomes and enforcing rigorous mental model updates.
  - Implemented `parsePostRunDivergence` in `prompt-registry.ts` parsing machine-readable `[POST_RUN_DIVERGENCE]` blocks (`ANALYSIS_VERDICT`, `DIAGNOSED_CAUSAL_MECHANISM`, `SHARPENED_MODEL_REVISION`, `NEXT_PROBE`).
  - Added 1-click **"Adopt Sharpened Mental Model Revision"** in-place action in Post-Run actuals.
  - Integrated Bayesian Epistemologist (`m4-narrowness-audit`) evaluating telemetry (Brier score, hit rate, surprise rate, domain distribution) to expose safe-zone camping.
  - Implemented `parseNarrownessAudit` in `prompt-registry.ts` parsing machine-readable `[NARROWNESS_AUDIT]` blocks (`DIVERSITY_RATING`, `COMFORT_ZONE_OBSERVATION`, `PRESCRIBED_DOMAIN`, `PRESCRIBED_VARIABLE`, `PRESCRIBED_HYPOTHESIS`, `PRESCRIBED_CONFIDENCE`).
  - Added 1-click **"Load Prescribed Boundary-Pushing Experiment"** populating pre-run fields with a high-variance frontier perturbation.
  - Added interactive Recent Calibration Records history table with entry inspection and deletion capabilities.
  - Verified 0 TypeScript errors with `pnpm run check`, verified production build with `pnpm run build`, and passed all unit test assertions.

- [ ] **Task 23: M5 Studio — Taste Formula Interrogator & Reverse Direction Coach**
  - Integrate 5-part Taste Formula interrogation (`Preference + Criteria + Ref Class + Mechanism + Purpose`) in `M5TasteCurationArena.svelte`.
  - Implement Reverse Direction Challenge coach transforming machine flaws into deliberate structural necessities.
  - Implement 40% human anchor verification for collections.

- [x] **Task 24: M6 Studio — Stakeholder Critique Simulator & 5-Mode Refusal Coach**
  - Integrated Executive Producer & Re-Brief Arbiter (`m6-rebrief-arbiter`) in `M6DirectionCollab.svelte` Tab 1 (Revision Fork) enforcing the 3-cycle limit and evaluating persistent defects.
  - Implemented `parseRebriefArbitration` in `prompt-registry.ts` parsing machine-readable `[REBRIEF_ARBITRATION]` blocks (`RULING`, `CYCLE_CEILING_STATUS`, `ROOT_FAILURE_LEVEL`, `RATIONALE`, `NEXT_DIRECTORIAL_ACTION`).
  - Added 1-click **"Adopt Re-Brief Ruling (Reset Brief)"**, **"Continue on Revision Cycle"**, and **"Adopt Next Directorial Action"** in-place actions in Revision Fork.
  - Integrated dual-mode Stakeholder Critique Simulator & Triage Auditor (`m6-stakeholder-simulator`) in Tab 2 (Feedback Triage):
    - *Scenario Simulation*: Generates uncalibrated client demands with hidden commercial anxiety and emits `[SIMULATED_STAKEHOLDER]` blocks with 1-click form loading.
    - *Triage Evaluation*: Audits whether the director correctly diagnosed underlying needs or fell into dangerous compliance / premature defensiveness, emitting `[TRIAGE_EVALUATION]` blocks for 1-click recommended action adoption (*Apply, Adapt, Alternative, Push Back, Re-Brief*) and root need hardening.
  - Integrated Senior Directorial Counsel (`m6-refusal-soundness`) in Tab 3 (5-Mode Refusal) auditing refusal letters against Appendix F standards across Ethical, Positional, Technical, Intentional, and Slop modes.
  - Implemented `parseRefusalAudit` in `prompt-registry.ts` parsing machine-readable `[REFUSAL_AUDIT]` blocks (`VERDICT`, `RECOMMENDED_MODE`, `TONE_RATING`, `SHARPENED_RATIONALE`, `BOUNDARY_PRINCIPLE`).
  - Added 1-click **"Adopt Sharpened Refusal Letter"** and **"Switch to Recommended Mode"** in-place actions in Refusal Composer.
  - Added interactive Recent Decision Log history tables to Tab 1 (Revision choices), Tab 2 (Triage choices), and Tab 3 (Refusal letters) with in-place inspection and entry deletion.
  - Verified 0 TypeScript errors with `pnpm run check`, verified production build with `pnpm run build`, and passed all unit test assertions.

- [ ] **Task 25: M7 Studio & Capstone — Position Gap Mirror & Cross-Medium Removal Tester**
  - Integrate Position Gap Mirror in `M7AgencyBlankSheet.svelte` diagnosing deltas between claimed artistic statements and visible artifact traits.
  - Implement Dual-Removal Test report verifying cross-medium non-redundancy (text vs image).
  - Implement 14-step unassisted blank-sheet capstone milestone reviewer.

- [x] **Task 26: Daily Practice Loop Guidance & Deliberate Practice Drill Coach**
  - Integrated Socratic Reading Comprehension Check (`daily-reading-friction`) in `DailyPracticeView.svelte` (Step 1: Read) with `[READING_FRICTION]` parsing, edge-case probing questions, diagnostic traps, and directorial rules of thumb. Added 1-click **"Mark Step 1 (Read) Completed"** and **"Mark Core Reading Completed"** in-place actions.
  - Integrated Master Drill Coach (`drill-rep-diagnostic`) in `DrillRunner.svelte` Phase 2 (Rep Card / Running) with `[DRILL_DIAGNOSTIC]` parsing, failure type classification, root mechanism diagnosis, 1-click **"Append Adjustment to Discovery Note"**, and dynamic difficulty zone adaptation targeting the 70–80% deliberate practice pocket.
  - Integrated Hemingway Stop Validation (`hemingway-action-check`) across both `DailyPracticeView.svelte` (Day Ends card) and `HemingwayStopModal.svelte` (Tab "Stop for the Day") with `[HEMINGWAY_AUDIT]` parsing, duration estimation, obstacle detection, and 1-click **"Adopt Decomposed 5-Min Action"** replacement.
  - Integrated Attention Sentinel (`daily-attention-purity`) in `DailyPracticeView.svelte` (Day Ends card) auditing protected daily logs with `[ATTENTION_PURITY]` parsing, detecting covert instrumental utility contamination, and offering 1-click **"Adopt Purified Observation"**.
  - Built comprehensive unit testing script verifying all 4 prompt parsers with 100% test assertions passing.
  - Verified 0 TypeScript errors (`pnpm run check`) and verified successful static pre-rendering of all 9 routes with `pnpm run build`.

- [ ] **Task 27: Flagship Projects 1–12 & Two-Axis Assessment Cross-Examiner**
  - Integrate project deliverable rubric auditing across Projects 1–12 in `ProjectWorkspace.svelte`.
  - Implement Socratic Two-Axis matrix cross-examination in `TwoAxisQuadrant.svelte` to detect Rationalisation (excusing poor work) and Lucky Hits (unrepeatable accidents).

- [ ] **Task 28: Studio Logbook Sentinel & Anti-Decay Intelligence**
  - Integrate automated Log Decay scanning in `/logs` detecting rote phrase repetition and hollow logging compliance.
  - Implement intelligent retrospective narrative generator for Appendix L portfolio archive export.

- [x] **Task 29: Comprehensive Studio & Course Knowledge Base Help Modal**
  - Designed and authored comprehensive, type-safe knowledge base `src/lib/data/help-knowledge-base.ts` encompassing 66+ detailed terms across 7 categories: Diagnostic Ladders & Hierarchies, Lint Checks & Observation, Studio UI & Daily Routine, Core Concepts & Theses, Studio Modalities (M0–M7), Protocols & Refusals, and BYOK Inference.
  - Formulated 3-part plain-English breakdowns for every entry: "What is it?" (plain definition), "What does it do?" (operational mechanics), and "How does it help?" (directorial value), complete with practical before/after examples, studio touchpoints, and related concept cross-links.
  - Implemented loose, case-insensitive, multi-token fuzzy search engine `src/lib/engine/help-search.ts` with weighted relevance scoring (exact/prefix/alias/tag/definition matches) and category filtering.
  - Built accessible, responsive `HelpModal.svelte` featuring live query input with instant clear, category filter pills, split-pane master-detail inspector, 1-click deep-link copier, keyboard navigation (`↑`/`↓`/`Esc`), and Stone & Paper contrast compliance.
  - Integrated universal global accessibility: mounted `<HelpModal />` in `+layout.svelte`, wired hotkey listeners (`?` / `H`), added desktop/mobile triggers in `HomeNavbar.svelte`, quick action button in `TodayLoopHeader.svelte`, footer link in `HomeFooter.svelte`, and shortcut entry in `KeyboardShortcutsModal.svelte`.
  - Added URL query parameter support (`?help=<term-id>`) enabling direct 1-click external linking and bookmarking.
  - Verified 0 TypeScript errors (`pnpm run check`) and verified successful static pre-rendering of all 9 routes with `pnpm run build`.
  - Commit: `feat(help): add comprehensive course & studio help modal with loose search (Task 29)` (`afb7849`)



