# Tasks: Directing the Machine

This file tracks the implementation progress across all tasks. Each task is committed to Git upon completion.

- [x] **Task 0: Initial Repository Baseline**
  - Staged and committed master course materials (`Directing the Machine.md`, `Instructions.md`, `Project 7–12.md`).
  - Commit: `chore: initial repository baseline with course documents and instructions` (`b4f7cc6`)

- [/] **Task 1: Project Scaffolding & Base Tooling**
  - [x] Scaffold SvelteKit 2 + Svelte 5 (Runes) + TypeScript.
  - [/] Install dependencies (`tailwindcss`, `@tailwindcss/vite`, `lucide-svelte`, `zod`, `canvas-confetti`).
  - [ ] Configure Vite with Tailwind CSS v4 & verify `npm run check`.
  - [ ] Commit: `feat(setup): initialize SvelteKit 2 with Svelte 5 and Tailwind CSS`

- [ ] **Task 2: Core State Engine, Schemas & Scaffolding State Machine**
  - [ ] Implement `src/lib/state/practice.svelte.ts` (Svelte 5 Runes state).
  - [ ] Implement `src/lib/schemas/course.schema.ts` (Zod schemas).
  - [ ] Implement utilities: `adjective-linter.ts`, `calibration-math.ts`, `archive-exporter.ts`.
  - [ ] Commit: `feat(engine): implement practice state engine, scaffolding removal, and log decay detectors`

- [ ] **Task 3: Studio Shell, Today's Practice Loop & Recovery Systems**
  - [ ] Build `TodayLoopHeader.svelte` & `TenMinuteLogTimer.svelte`.
  - [ ] Build `ReferenceDrawer.svelte` (Cmd+K lookup for Appendices A–O).
  - [ ] Build `FailureTriageModal.svelte` & `HemingwayStopModal.svelte`.
  - [ ] Build root layout (`+layout.svelte`) and dashboard home (`+page.svelte`).
  - [ ] Commit: `feat(ui): build studio shell, today's practice loop, reference drawer, and failure recovery`

- [ ] **Task 4: Modalities M0, M1, M2 & M3 (Foundation & Formulation)**
  - [ ] Build `M0PracticeContractHub.svelte` (Baseline 1–4 radar, runway calculator, play timer).
  - [ ] Build `M1ProblemPositionLab.svelte` (Problem funnel, positionality compass, unassigned timer).
  - [ ] Build `M2DiagnosticVision.svelte` (Zero-adjective linter, 6-question audit, diagnostic ladder, canvas massing overlay).
  - [ ] Build `M3PremiseBriefLab.svelte` (Premise forge, 3/6/10 constraint tri-view, provenance stamp).
  - [ ] Commit: `feat(modalities): implement M0 Practice Contract, M1 Problem Lab, M2 Diagnostic Vision, and M3 Premise Brief`

- [ ] **Task 5: Modalities M4, M5, M6 & M7 (Build, Calibrate, Direct & Agency)**
  - [ ] Build `M4PipelineCalibration.svelte` (Pipeline mapper, pre-run confidence %, ergonomic HUD).
  - [ ] Build `M5TasteCurationArena.svelte` (5-part taste, blind 20 ranker, reverse-direction challenge).
  - [ ] Build `M6DirectionCollab.svelte` (Revision vs re-brief fork, stakeholder critique translator, refusal composer, transmission trainer).
  - [ ] Build `M7AgencyBlankSheet.svelte` (Position gap analyzer, synthesis removal test, 14-step blank-sheet capstone).
  - [ ] Commit: `feat(modalities): implement M4 Pipeline, M5 Taste Curation, M6 Direction Collab, and M7 Blank-Sheet Capstone`

- [ ] **Task 6: Assessment Radar, Logbook, Course Ingestion & Independent Practice**
  - [ ] Build `TwoAxisQuadrant.svelte` (Outcome Quality × Decision Quality matrix).
  - [ ] Build `CompetencyRadar16.svelte` (16-competency visual radar).
  - [ ] Build `/logs` page with 10-minute timer and live log-decay telemetry.
  - [ ] Ingest curriculum data from `Directing the Machine.md` into structured lesson manifest.
  - [ ] Commit: `feat(assessment): add Two-Axis matrix, competency radar, unified logbook, and curriculum manifest`

- [ ] **Task 7: End-to-End Verification, Walkthrough & Final Polish**
  - [ ] Verify `npm run check` and `npm run build`.
  - [ ] Verify offline persistence in `localStorage`.
  - [ ] Generate comprehensive walkthrough documentation.
  - [ ] Commit: `chore: final build verification and project polish`
