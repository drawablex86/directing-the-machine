# Systematic Task Tracker: Human-Centric UI/UX Revamp
**Directing the Machine — Interaction Design, Handholding & Progressive Mastery**

---

## Phase 1: Foundational Framework & Master Document
- [x] **Task 1.1: Master Architecture & Philosophy Formulation**
  - Synthesize Don Norman's *The Design of Everyday Things*, Institute of Interaction Design principles, and Khan Academy Mastery Gating into `master_ux_framework.md`.
  - Map complete human user journey (First Visit $\to$ Handholding $\to$ Baseline $\to$ Focused Studio).

- [x] **Task 1.2: Systematic Task Tracking Setup**
  - Establish `UX_REVAMP_TASKS.md` in workspace root to maintain granular progress, verification steps, and status.

---

## Phase 2: State Engine & Progressive Mastery Gating
- [x] **Task 2.1: Orientation & Gating State Persistence**
  - File: `src/lib/state/practice.svelte.ts`
  - Added state flags:
    - `hasCompletedOrientation: boolean` (persisted in localStorage)
    - `pacingMode: 'session' | 'calendar'` (persisted in localStorage, defaults to `'session'` to eliminate day-of-week guilt)
    - `unlockedModalities: string[]` (starts with `['m0']`)
    - `unlockedWeeks: number[]` (starts with `[0, 1]`)
    - `bypassMasteryLocks: boolean` (educator/expert bypass toggle)
  - Helper methods: `completeOrientation()`, `resetOrientation()`, `setPacingMode()`, `unlockModality()`, `isModalityUnlocked()`, `getModalityUnlockRequirement()`, `toggleBypassMasteryLocks()`, `isWeekUnlocked()`.

- [x] **Task 2.2: Mastery Release Mechanism Schema**
  - Implemented progressive release logic:
    - M0 (Practice Contract & Baseline Hub) is unlocked by default.
    - M1 (Problem & Position) & M2 (Diagnostic Vision) unlock as soon as M0 Baseline is diagnosed or activePart >= 1.
    - M3 (Premise & Brief) unlocks upon entering Part I.
    - M4 (Pipeline & Calibration) unlocks at Part II.
    - M5 (Taste & Curation) unlocks at Part III.
    - M6 (Direction & Collab) unlocks at Part IV.
    - M7 (Blank Sheet Capstone) unlocks at Part V.
    - Clear unlock requirement strings generated via `getModalityUnlockRequirement()`.

---

## Phase 3: Handholding & Orientation Hub ("First-Run Experience")
- [x] **Task 3.1: Design & Build `OrientationGuideView.svelte`**
  - Component: `src/lib/components/shell/OrientationGuideView.svelte`
  - Multi-step interactive handholding guide:
    - **Step 1: The Conceptual Model**: Clear, jargon-free explanation of Creative Authorship vs. Gambler Prompting, with side-by-side contrast cards.
    - **Step 2: Studio Anatomy**: 4 simple pillars (Read concept $\to$ Perform micro-drill $\to$ Apply in active project $\to$ 10m reflective log) with Khan Academy locked release notes.
    - **Step 3: Demystifying Jargon**: Plain translations for terms like *M0 Baseline*, *Zero-Adjective Linter*, *Brier Score*, *Hemingway Stop Gate*.
    - **Step 4: Your First Mission**: Action card briefing the user for *Milestone 1: Baseline Diagnostic (M0)* with clear time expectations (~5-10 mins) and explicit unlock benefits.
  - Interactive "Skip to Studio if returning expert" button.

- [x] **Task 3.2: Router Integration & Seamless First-Time Detection**
  - File: `src/routes/app/+page.svelte`
  - Rendered `OrientationGuideView` as the primary view whenever `!practiceStore.hasCompletedOrientation`.
  - Added a "Rewatch Orientation" button in the top breadcrumb bar for learners to revisit orientation at any time.

---

## Phase 4: Studio Header & Clutter Reduction
- [ ] **Task 4.1: Redesign `TodayLoopHeader.svelte` for Human Readability**
  - File: `src/lib/components/shell/TodayLoopHeader.svelte`
  - Declutter top bar:
    - Hide secondary modal buttons (`Stop Gate`, `I'm Stuck`, `Ref ⌘K`, `Focus Horizon`) behind an elegant, organized `Tools & Assistance` dropdown or quick-action bar.
    - Replace rigid `Step 2/8 (Practise · 60m)` with a human milestone tracker: *"Milestone 1: Establish Your Baseline"*.
    - Provide unambiguous signifiers: plain icons and readable labels with tooltip descriptions.

- [ ] **Task 4.2: Replace Dismissible Weak Banner with Structured Focus Card**
  - File: `src/lib/components/shell/WelcomeBanner.svelte`
  - Transform from a cluttered wall of text to an uncluttered, purposeful milestone card.
  - Clearly display:
    - **Current Objective**
    - **Estimated Effort** (e.g., *"10-15 mins • No rush"*)
    - **Primary Action** (high-contrast button)

---

## Phase 5: Progressive Disclosure & Locked Release in Daily Practice
- [ ] **Task 5.1: Locked Release on `DailyPracticeView.svelte`**
  - File: `src/lib/components/shell/DailyPracticeView.svelte`
  - Hide or gracefully lock advanced exercises until earlier steps are validated.
  - Provide Khan Academy style progress cards with lock icons and unlock prerequisites.
  - Replace rigid `Mon, Tue, Wed, Thu, Fri, Sat, Sun` tabs with flexible session numbers: `Session 1`, `Session 2`, etc.

- [ ] **Task 5.2: Plain-Language Signifiers Across Labs & Modalities**
  - File: `src/lib/components/shell/LabDirectory.svelte`
  - Ensure lab cards show clear human explanations instead of internal code names (e.g., *"M2: Zero-Adjective Observation — Train your eyes to spot exact visual traits without vague buzzwords"*).

---

## Phase 6: Verification & Polish
- [ ] **Task 6.1: End-to-End User Flow Testing**
  - Test new visitor flow: Homepage $\to$ "Enter Practice Studio" $\to$ Orientation Guide $\to$ Baseline Diagnostic.
  - Test return visitor flow: Direct launch into their saved session without repeating onboarding.
  - Test locking/unlocking transitions.
- [ ] **Task 6.2: Build & Automated Test Suite Execution**
  - Run `pnpm run check` and `pnpm run test` to verify zero type regressions or runtime breaks.
