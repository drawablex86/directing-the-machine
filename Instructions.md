# Directing the Machine: UI/UX Paradigm & Anti-Overbuilding Specification
*A Learning Environment for Creative Authorship in an AI-Augmented World (Visual, Writing, & Cross-Medium)*

---

## 1. Core UX Philosophy: Solving the "Overbuilt Course" Paradox
Your latest course document opens with an extraordinary and rare piece of self-awareness: **it diagnoses its own failure modes**. It notes that while its pedagogical spine is strong, a hundreds-of-pages reference manual can easily overwhelm a solo practitioner, invert the ratio of *logging-to-making*, privilege verbal bureaucracy over tacit/visual craft, and collapse without honest external calibration.

Therefore, the primary job of the **SvelteKit 2 web application** is **not** to dump all 19 modules and 15 appendices onto the screen at once. Instead, the UI acts as a **Progressive-Disclosure Studio & Scaffolding-Removal Engine** governed by five architectural rules:

### Rule 1: "Today's Practice Loop" First — Reference Manual Hidden Until Needed
* **Solving Pitfall #1 ("Massively overbuilt / reading instead of making"):**
  * When a learner opens the app, they do **not** land on a 200-page table of contents. They land on **"Today's Studio Loop"**—a calm, single-focus workspace showing only the current step of the weekly rhythm (`Read 20m → Practise 60m → Study 60m → Make 2h → Diagnose 30m → Log 10m → Transfer 30m → Play 30m`).
  * Appendices (`A–O`) and future parts remain tucked inside a contextual **"Just-in-Time Reference Drawer" (`Cmd+K`)** that surfaces the exact protocol only when triggered (e.g., surfacing *Failure Protocols* only when a learner clicks *"I'm Stuck"*, or surfacing *Appendix M* only during Part V client scope exercises).

### Rule 2: The 10-Minute Log Cap & Anti-Productivity-Theatre Guardrails
* **Solving Pitfall #4 ("Logging can become productivity theatre / Log Decay"):**
  * Every logging view features a hard **10-Minute Countdown Timer**. When the timer hits 00:00, the log auto-saves and gently locks with the banner: *"The document is not the practice. Go make something."*
  * Only **three core logs** are active by default: **Problem-Finding Log**, **Practice Log**, and **Decision Log** (plus **Calibration Log** when testing system variables).
  * **Protected One-Line Logs:** For **Non-Instrumental Attention** (*"What did I encounter that I was not looking for?"*) and **Play Practice** (*"What did I enjoy?"*), the UI physically restricts input to a single 140-character line and forbids analytical tags.
  * **Automated Log Decay Detector (Failure Type 4):** The app quietly audits log entries in the background. If a user enters `"70%"` confidence five times in a row, repeats the same `"stakes"` phrase, or always chooses `"Apply"` on critique records, the UI flags **Log Decay** and triggers a **Monthly Field Rotation** prompt.

### Rule 3: Multi-Modal & Tacit-Friendly Capture (Anti-Verbal Bias)
* **Solving Pitfall #7 ("Privileges verbal, analytical modes"):**
  * Any observation, thumbnail, decision, or diagnosis field accepts **voice notes (auto-transcribed or kept as raw audio), quick canvas sketches, phone camera snapshots, or visual markups** alongside or instead of typed prose.

### Rule 4: Intensity Path & Core-vs-Deepening Adaptive Pacing
* **Solving Pitfall #3 ("Unrealistic workload causing misdiagnosed habit failure"):**
  * During **Week 0 Onboarding**, the learner selects their honest **Intensity Path (Appendix O)**:
    1. **Full-Time Intensive:** `18–25 hrs/wk Core` (`25–35 hrs/wk with Deepening`) across **12 Weeks**.
    2. **Extended Intensive:** `12–18 hrs/wk` across **24 Weeks**.
    3. **Distributed Practice:** `6–10 hrs/wk` across **48 Weeks**.
    4. **Maintenance Mode:** `~4 hrs/wk` (explicitly labeled as *Practice Maintenance*, pausing gate progression so the learner never feels like they are "failing" the course).
  * A persistent **Tier Filter (`CORE ONLY` vs. `CORE + DEEPENING`)** hides all optional deepening exercises (`Cross-medium synthesis`, `Public process`, `Third-mode time/spatial study`) unless explicitly toggled on.

### Rule 5: The Scaffolding Removal Engine (`Layer 1 → Layer 2 → Layer 3`)
* The UI dynamically reconfigures its interface chrome across the 12 weeks and 6 months of Independent Practice:

| Stage | Supplied by the App UI | Removed from the App UI | Target Mastery Layer |
| :--- | :--- | :--- | :--- |
| **Part I (Wks 1–2)** | Exercise, visible Diagnostic Ladder, templates, references | — | **Layer 1: Capability** |
| **Part II (Wks 3–4)** | Exercise, 7-Layer Brief template | **Diagnostic Ladder hidden by default** | **Layer 1: Capability** |
| **Part III (Wks 5–6)** | Exercise, Variable & Calibration predictor | **Brief template removed** (blank brief composer) | **Layer 1: Capability** |
| **Part IV (Wks 7–8)** | Broad Category, Blind Curation & Range Audit | **Pre-written Exercise removed** | **Layer 1 → Layer 2** |
| **Part V (Wks 9–10)** | Stakeholder Situation & Scope/Conflict tools | **Category removed** | **Layer 2: Independence** |
| **Part VI (Wks 11–12)** | Practical Conditions only (Time, resources, medium) | **Situation, Ladders, & Templates all removed** | **Layer 2: Independence** |
| **Months 4–7** | Progressive reduction (`Brief → Category → Theme → Real-world problem`) | External mentor scaffolding | **Layer 2 → Layer 3** |
| **Months 8–9** | **Nothing** (Only the Unassigned Beginning & Blank-Sheet Canvas) | **Even the problem itself** | **Layer 3: Agency** |

---

## 2. The 8 Interactive UX Studio Modalities
Every module in the course maps to one of **8 purpose-built interactive studio views**:

| Modality ID | Studio Name | Modules Hosted | Core Interactive Mechanics |
| :--- | :--- | :--- | :--- |
| **`M0: practice-contract-hub`** | **Deliberate Practice, Play & Contract Studio** | `Module 0`, `Week 0`, `Appendix I`, `Appendix O` | • **Week 0 Contract & Baseline Radar:** Interactive 12-competency baseline self-test, Income/Runway calculator, Intensity Path selector, and Ethics/Disclosure signer.<br>• **70–80% Deliberate Practice Rep Tracker:** Adjusts drill difficulty automatically if rep success is $\ge 9/10$ (too easy) or $\le 4/10$ (too hard).<br>• **Protected Play & Non-Instrumental Timer:** Distraction-free timer that hides all rubrics and accepts only a single unanalyzed sentence at the end. |
| **`M1: problem-position-lab`** | **Problem-Finding & Positionality Studio** | `Module 2`, `Monthly Problem-Finding`, `Unassigned Beginning` | • **The 6-Step Problem Funnel:** Interactive flow (`Notice → Collect → Frame → Test → Select → Justify`) with mode tags (`Solve | Investigate | Reveal | Reframe | Explore | Construct`).<br>• **Positionality Compass:** Interactive standing check (`From | With | For | About | Over`) that prompts ethical reflection or positional refusal without turning into a paralyzing purity test.<br>• **60-Minute Unassigned Beginning Mode:** A monthly 60-minute timer that forces the student to stop *after* finding a beginning, training the upstream faculty of noticing projects. |
| **`M2: diagnostic-vision-studio`** | **Observation & Diagnostic Vision Studio** | `Module 1`, `Module 4`, `Module V1`, `Module W1` | • **Zero-Adjective Observation Linter:** Real-time regex highlighter that flags evaluative shortcuts (*good, bad, beautiful, ugly, strong, weak, polished, boring*) before allowing diagnosis.<br>• **6-Question Human-Decision Extractor:** Separates explicit human choices from model/dataset defaults.<br>• **5-Second Thumbnail Flash & Massing Canvas (V1):** Flashes a visual reference for 5,000ms, blanks the screen for memory reconstruction, then provides a translucent comparison slider.<br>• **Close-Reading Turn/Omission Diff (W1):** Tag `[TURN]`, `[OMISSION]`, `[RHYTHM]`, and compare against a neutral-prose rewrite. |
| **`M3: premise-brief-provenance`** | **Premise Forge, Brief Architect & Provenance Ledger** | `Module 5`, `Module 6`, `Module V2`, `Module W2`, `Module 7` | • **Premise Viability & Rejection Matrix:** Requires 3 candidate premises and explicit 1-sentence rejection logic for the 2 unselected premises.<br>• **Constraint Density Tri-View:** Side-by-side comparison of *Open (3)*, *Directed (6)*, and *Severe (10)* constraint sets.<br>• **Craft-First Gate:** Requires <2-minute thumbnail scribbles (`V2`) or an unassisted structural skeleton (`W2`) before unlocking generation.<br>• **Lightweight Provenance Stamp (Module 7):** Logs `Premise Origin`, `Human Contribution`, and `Tool Contribution` at birth. |
| **`M4: pipeline-calibration-lab`** | **Causal Pipeline & Calibration-vs-Range Lab** | `Module 8`, `Module 9`, `Module V3`, `Module W3`, `Craft Requirement` | • **Pre-Run Confidence Predictor:** Before running a pipeline ablation or revision, the user locks in a prediction and confidence slider ($0\% - 100\%$), then logs `Actual`, `Direction of Error`, and `Model Revision`.<br>• **Calibration-vs-Range Narrowness Detector:** Plots Brier calibration accuracy against input diversity. Alerts the user if high calibration is caused by **Taste Narrowness** (repeating safe outputs).<br>• **Ergonomic & Physical Sustainability HUD:** 30–45m drawing break & 20-20-20 screen reminders. |
| **`M5: taste-curation-arena`** | **Taste Infrastructure & Blind Curation Arena** | `Module 10`, `Module V4`, `Module W4`, `Module 11` | • **5-Part Taste Builder:** Enforces `Preference + Criteria + Reference Class + Mechanism + Purpose` (never judging "Is this good?" in isolation from purpose).<br>• **20-Item Blind Provenance Ranker:** Strips human/AI labels from 20 works until after the student ranks them and commits written criteria.<br>• **Reverse-Direction Challenge:** Select a rejected artifact and author a brief where its specific "flaws" become purposeful strengths.<br>• **Anchor Demotion & $\ge 40\%$ Human-Anchor Tracker.** |
| **`M6: direction-collab-studio`** | **Production Direction, Collaboration & Refusal Studio** | `Module 12`, `Module 13`, `Module 14`, `Module V5`, `Module W5`, `Module 19` | • **Revision vs. Re-Brief Diagnostic Fork:** Enforces max 3 named revision cycles (e.g., *"Cycle 1: Fix focal hierarchy"*) or triggers a formal **Re-Brief** when solving the wrong problem.<br>• **Stakeholder Critique Translator:** Maps surface requests (*"Make the logo bigger"*) to inferred underlying outcomes and 5 actions (`Apply | Adapt | Propose Alternative | Push Back | Re-Brief`).<br>• **Collaborative Decision Rights & Economics Builder (Module 14).**<br>• **5-Type Refusal Composer (`Ethical | Positional | Technical | Intentional | Slop`).**<br>• **Transmission & Silence-Tolerance Trainer (Module 19).** |
| **`M7: agency-blank-sheet`** | **Position Gap, Synthesis & Blank-Sheet Capstone** | `Module 15`, `Module 16`, `Module 17`, `Module 18`, `V6/W6`, `Blank-Sheet Test` | • **10-Piece Blind Position Gap Analyzer:** Compares inferred commitments from 10 untitled works against the student's written Private & Public Positions.<br>• **Cross-Medium Synthesis Removal Tester (Module 17):** Tests whether removing the image or text collapses the argument.<br>• **14-Step Blank-Sheet Test & "How I Decided What to Make" Capstone.** |

---

## 3. Gamification & Assessment Architecture: Honesty Over Hype

### A. The Two-Axis Assessment Matrix (`Outcome Quality × Decision Quality`)
To prevent the two classic failure modes identified in your course—**Rationalisation** (writing brilliant excuses for weak work) and **Anti-Intellectualism** (producing a lucky hit with an irreproducible process)—every major project is plotted on a **2×2 Quadrant Matrix**:

```
                     OUTCOME QUALITY (Artifact Fitness)
                        Weak                    Strong
               +-----------------------+-----------------------+
        Strong | LEARNING IN PROGRESS  |        MASTERY        |
DECISION       | Process is sound;     | Sound process +       |
QUALITY        | craft/execution lags. | strong artifact.      |
(Reasoning)    +-----------------------+-----------------------+
        Weak   |        FAILURE        | LUCKY / UNSTABLE HIT  |
               | Neither process nor   | Cannot be reproduced  |
               | artifact works.       | under new conditions. |
               +-----------------------+-----------------------+
```

### B. Blind Self-Assessment & Calibration Network Sync (Solving Pitfall #2)
* **7-Day Blind Self-Assessment Time-Lock:** When a project is completed, the app saves a snapshot and hides the student's original rationale for 7 days. One week later, it prompts a **Blind Re-Score** as if grading a stranger's work, highlighting the delta between in-the-moment pride and delayed perception.
* **Shareable 9-Question Critique Link:** Generates a clean, zero-login URL for a peer or external critic in the user's **Calibration Network** (`Audience`, `Craft Expert`, `Domain Expert`, `Ordinary Perception`, `Co-Creator`). The link forbids the question *"Is this good?"* and guides the critic through the exact 9 diagnostic questions from your course.

### C. The Four-Way Failure Recovery Wizard ("I'm Stuck / Something Broke")
A persistent header button lets the practitioner diagnose *what kind of failure* they are experiencing and prescribes the exact course intervention:
1. **Output Failure (The work doesn't work):** Opens the Top-Down Diagnostic Ladder + Smallest Meaningful Experiment builder.
2. **Habit Failure (Skipped sessions for 2+ weeks):** Does *not* scold the user. Automatically shrinks session targets to **15-minute micro-reps** or offers a seamless transition to the **Extended (24w)** or **Distributed (48w)** intensity path.
3. **Motivational Failure (Going through the motions / borrowed ambition):** Activates a **7-Day Production Pause**—locking generation tools, keeping only *Non-Instrumental Attention* active, and surfacing past *Standing Inquiry* entries to locate where borrowed ambition replaced genuine care.
4. **Log Decay (Hollow / repetitive checkbox logging):** Highlights repetitive fields across the last 4 weeks and rotates one log prompt to restore substance.

### D. The "When to Stop" Hemingway Brake
To prevent endless, anxious patching, the studio workspace includes a **"Stop / Finish / Abandon" Decision Gate**:
* **Stop for the Day (The Hemingway Rule):** Prompts the user to stop *while they still know the next step*, logging a single line: *"Tomorrow's first 5-minute action is: ___"*.
* **Declare Work Done:** Verifies acceptance criteria and locks the version as `final`.
* **Principled Abandonment:** Records why a project is being abandoned early (e.g., *"Re-briefed twice; premise no longer holds attention"*) and credits the diagnostic lesson learned as a positive milestone rather than a failed project.
```

```markdown:Expanded Course Curriculum & Modality Mapping:02-course-curriculum-expanded.md
# Directing the Machine: Complete Curriculum & Modality Blueprint
*Mapped from the Latest Master Course (Module 0, Week 0, Parts I–VI, Modules 1–19, V1–V6, W1–W6, & Independent Practice Months 4–9)*

---

## 1. Universal Lesson Frontmatter Schema (`src/content/lessons/*.md`)
Every module is stored as a modular Markdown file with strict YAML frontmatter validated by Zod at build time. This allows the SvelteKit 2 router to render the right interactive tools, enforce scaffolding removal, and adapt deliverable quotas to the learner's chosen **Intensity Path**:

```yaml
---
id: "part1-m02-problem-finding"
part: 1
partTitle: "FIND & OBSERVE"
weeks: "1–2"
moduleCode: "Module 2"
track: "core" # "onboarding" | "core" | "visual" | "writing" | "contextual" | "independent"
tier: "core" # "core" | "deepening"
title: "Problem-Finding & Positionality"
frameQuestion: "Can you locate a problem worth pursuing before anyone tells you what the problem is — and determine whether you have standing to pursue it?"
masteryLayer: 1 # 1: Capability, 2: Independence, 3: Agency
scaffoldingState:
  supplied: ["exercise", "ladder", "template", "references"]
  removed: []
primaryModality: "problem-position-lab"
competenciesTrained: ["problem-finding", "positionality", "observation", "transfer"]
logTimeCapMinutes: 10
deliverableQuotas:
  fullTime: 4
  extended: 2
  distributed: 1
masteryGateCriteria:
  - "Distinguishes a genuine problem (with tension and stakes) from a mere topic, mood, or aesthetic"
  - "Executes the 6-step sequence: Notice -> Collect -> Frame -> Test -> Select -> Justify"
  - "Runs an honest Positionality Check (From / With / For / About / Over) and refuses problems without standing"
---
```

---

## 2. Front Matter & Onboarding Sequence (Start Here — Do Not Read Ahead)

### Module 0 — How to Practice This Course (`modality: M0: practice-contract-hub`)
* **Core Pedagogical Copy:** Production aims at a deliverable; **practice** aims at changing your reliable capacity. A practice session may produce nothing worth keeping—that is the point. Every 60–90 minute practice block isolates a single micro-skill in the **70–80% success zone** (failing 2–4 reps out of 10). To prevent structural rigidity, every week also protects **Play Practice** (unstructured making with zero evaluation) and **Interleaving** (mixing visual, writing, and pipeline problems).
* **Interactive UX Mechanics:**
  1. **60-Minute Deliberate Practice Timer:** Guides the user through `Intention (5m) → Model (10m) → Drill Reps (20–40m) → Feedback (10m) → Correction (10m) → 1-Line Log (5m)`.
  2. **Automatic Difficulty Regulator:** If the user logs $\ge 9/10$ successful reps, the UI prompts: *"Success rate >80%. Increase constraint difficulty or remove a scaffold next session."* If $\le 4/10$, it prompts: *"Isolate a smaller sub-skill."*
  3. **Play Session Mode:** Locks all rubrics and evaluation fields. Displays a warm canvas/timer and asks only one question at completion: *"What did I enjoy?"*

### Week 0 — Baseline & Practice Contract (`modality: M0: practice-contract-hub`)
* **Core Pedagogical Copy:** Without a baseline, you cannot measure change. Without an honest sustainability plan and intensity path, you will misdiagnose workload mismatch as personal discipline failure.
* **Interactive UX Mechanics:**
  1. **12-Competency Baseline Diagnostic Radar:** Interactive micro-exercises across `Problem-Finding`, `Positionality`, `Observation`, `Premise`, `Specification`, `Diagnosis`, `Curation`, `Systems`, `Prediction`, `Direction`, `Authorship`, and `Transfer` scored on the 1–4 scale.
  2. **Intensity Path & Runway Configurator (Appendix O):** Calculates weekly hours against work commitments and configures the entire app for **Full-Time (12w)**, **Extended (24w)**, **Distributed (48w)**, or **Maintenance (~4h/wk)**.
  3. **Ethics & Contextual Disclosure Signer:** Interactive contract generator for consent, likeness, copyright, and context-dependent AI disclosure.
  4. **Calibration Network Roster:** 5-slot address book mapping real people (or communities/coaches) to `Audience`, `Craft Expert`, `Domain Knowledge`, `Ordinary Perception`, and `Peer / Co-Creator`.

---

## 3. Part-by-Part Curriculum & UX Modality Mapping

### PART I — FIND & OBSERVE (Weeks 1–2)
* **Governing Question:** *What is actually happening here, and what among it deserves attention?*
* **Scaffolding State:** `Supplied: Exercise, Ladder, Template, References | Removed: None`

#### Module 1 — The Judgment Gap (`track: core` | `modality: M2: diagnostic-vision-studio`)
* **Core Ideas & The Reciprocal Principle:** Automation of production is not automation of purpose. Variation is not exploration unless it has a question behind it—and **a question is not exploration until it changes what you do**.
* **Interactive Studio Exercises:**
  1. **The 6-Question Human-Decision Audit:** Inspect a generated image or text and separate *Explicit Human Decisions* from *Model/Dataset Defaults* (e.g., recognizing that a centered figure in neon rain is a model default, not an authored choice), then name the **Next Human Directorial Decision**.
  2. **Zero-Adjective Observation Linter:** Live editor that blocks submission if evaluative adjectives (*good, bad, beautiful, ugly, impressive, weak, strong, polished, boring*) appear in the Observation step.
  3. **Unfamiliar-Medium Transfer Test:** Diagnose intention, highest unresolved problem, and next decision in an unfamiliar medium with **all ladders hidden**.

#### Module 2 — Problem-Finding & Positionality (`track: core` | `modality: M1: problem-position-lab`)
* **Core Ideas:** Problem-solving works within a supplied problem; **problem-finding** decides which unresolved condition warrants sustained attention (`Solve | Investigate | Reveal | Reframe | Explore | Construct`). A problem worth pursuing is not automatically *yours* to pursue—**Positionality** asks where you stand (`From | With | For | About | Over`) as an honest compass rather than a paralyzing purity test.
* **Interactive Studio Exercises:**
  1. **5-in-30 Problem-Finding Funnel:** 30-minute timer to log 5 noticed conditions from a walk, document, or dataset, frame each with tension and stakes, run the Positionality Compass, and select 1 while logging explicit rejection reasons for the other 4.
  2. **45-Minute Unfamiliar Situation Transfer Test:** Identify 3 candidate problems, run positionality checks, and defend 1 without worked examples.

#### Module 3 — Non-Instrumental Attention (`track: core` | `modality: M0: practice-contract-hub`)
* **Core Ideas:** If every perception is immediately converted into a brief, you lose access to serendipity—the material you could not search for.
* **Interactive Studio Exercises:**
  1. **Protected Non-Instrumental Session:** 30–60 minute offline timer (walk, reading, looking, listening). Notes and project linking are disabled. Upon return, records a single unanalyzed sentence: *"What did I encounter that I was not looking for?"* (Held in a time-capsule buffer before it can be imported into Problem-Finding).

#### Module 4 — Diagnostic Vision (`track: core` | `modality: M2: diagnostic-vision-studio`)
* **Core Ideas:** Diagnosis is not criticism. It proceeds strictly from the **highest unresolved level downward**: `Intent → Structure → Perceptual/Rhetorical Effect → Construction/Logic → Surface Execution`. Never optimize a lower level while a higher level remains broken.
* **Interactive Studio Exercises:**
  1. **7-Step Diagnostic Sequencer:** Separates *Immediate Effect* from *Diagnosis*, locks lower rungs until higher rungs are cleared, and outputs the canonical diagnostic sentence: *"The highest unresolved level is [X]. The decision causing the problem is [Y]. I would test [Z] next. I would accept/reject if [W]."*

#### Module V1 — Visual Observation & Diagnosis (`track: visual` | `modality: M2: diagnostic-vision-studio`)
* **Interactive Studio Exercises:**
  1. **9-Rung Visual Ladder & 7-Step Perception Protocol:** Interactive canvas overlay over reference and generated images to trace **3–5 major masses**, **focal path**, **directional axis**, and **3D construction**.
  2. **Memory Reconstruction Slider:** Hides the reference while the student sketches from memory, then overlays both to log *"What I failed to perceive"* (e.g., missing a sky opening acting as a spatial recession device).
  3. **5-Second Thumbnail Flash Transfer Test:** Flashes a random image for 5,000ms, blanks the screen, and tests mass/value/flow reconstruction.

#### Module W1 — Writing Observation & Diagnosis (`track: writing` | `modality: M2: diagnostic-vision-studio`)
* **Interactive Studio Exercises:**
  1. **9-Rung Writing Ladder & Close-Reading Annotator:** Tag `[TURN]`, `[OMISSION]`, `[RHYTHM SHIFT]`, and `[ANTICIPATION]` on human anchors (e.g., Joan Didion).
  2. **Neutral-Prose Subtraction Diff:** Paraphrase the claim, rewrite in flat neutral prose, and highlight what vanished to prove that voice is structural tension, not surface decoration.

* **Part I Humane Deliverables (Core):** Personal visual & writing ladders; **15 diagnoses** (8 visual, 7 textual); **6 visual perception studies**; **3 close readings**; 1 subject-position statement; first anchor set; 1 transfer test; 2 standing inquiries; 6 practice log entries; 4 problem-finding entries (with positionality); 2 non-instrumental entries; 2 play entries.

---

### PART II — FORMULATE (Weeks 3–4)
* **Governing Question:** *What is worth making, and what would make it succeed?*
* **Scaffolding State:** `Supplied: Exercise, Template | Removed: Diagnostic Ladder`

#### Module 5 — Premise & Intent (`track: core` | `modality: M3: premise-brief-provenance`)
* **Core Ideas:** `Observation / Problem → Question → Tension → Premise → Intention`. A topic (*"Loneliness in cities"*) is not a premise (*"Physical proximity and psychological isolation increase together"*). Rejection logic is more important than the selected premise.
* **Interactive Studio Exercises:**
  1. **The Premise Forge & 4-Way Viability Gate:** Generates 5 questions, 3 tensions, 3 premises, and 2 intentions from a Module 2 problem. Enforces the 4 tests (*Specificity, Tension, Generativity, Commitment*) and requires 1-sentence rejection rationales for the unchosen premises.

#### Module 6 — Brief Architecture (`track: core` | `modality: M3: premise-brief-provenance`)
* **Core Ideas:** Brief first, generation second. Uses the **7-Layer Brief Stack** (`Premise, Intention, Constraints, References, Acceptance Criteria, Rejection Conditions, Risks/Unknowns`).
* **Interactive Studio Exercises:**
  1. **Constraint Density Tri-View (`3 vs 6 vs 10`):** Side-by-side workspace comparing *Open (3)*, *Directed (6)*, and *Severe (10)* constraints to feel the boundary between default drift and overdetermination.
  2. **Vague vs. Checkable Acceptance Experiment:** Replaces mood wishes (*"Make it feel lonely"*) with checkable structural criteria (*"Figure occupies <15% of frame; brightest area is further from figure than frame edge"*).

#### Module V2 — Visual Specification (`track: visual` | `modality: M3: premise-brief-provenance`)
* **Interactive Studio Exercises:**
  1. **2-Minute Thumbnail Gate:** Locks AI image generation until **6–12 rapid thumbnails** (with a 2-minute timer per thumbnail so they remain mass/value decisions rather than slow drawings), 3 value schemes, and 1 manual reference study are logged.
  2. **Reference Principle Extractor:** Logs *What is borrowed*, *At what scale*, *What breaks if removed*, and *What must NOT be copied*.

#### Module W2 — Writing Specification (`track: writing` | `modality: M3: premise-brief-provenance`)
* **Interactive Studio Exercises:**
  1. **9-Mechanism Voice Analyzer:** Replaces mood adjectives (*"warm but authoritative"*) with 9 observable dials (*Sentence length, Directness, Abstraction level, Vocabulary, Metaphor sustainability, Paragraph rhythm, Certainty/qualification, Reader relationship, Tone mechanism*).
  2. **Unassisted Structural Skeleton Gate:** Requires writing at least one crude structural outline without AI before unlocking model drafting.

#### Module 7 — Provenance Begins (`track: core` | `modality: M3: premise-brief-provenance`)
* **Interactive Studio Exercises:**
  1. **Birth-of-Project Provenance Stamp:** Lightweight 3-minute card attached to every Part II brief recording `Premise Origin`, `Human Decisions & Rejections`, `Tool Contributions`, and `Reference Licenses`.

* **Part II Humane Deliverables (Core):** 6 premise records with rejection logic; 6 briefs; **12–18 visual thumbnails/value studies**; **4 writing structural outlines**; 2 iterations per brief; 6 provenance records; 2 transfer tests.

---

### PART III — BUILD (Weeks 5–6)
* **Governing Question:** *How do I turn that intention into a controllable process?*
* **Scaffolding State:** `Supplied: Exercise | Removed: Brief Template & Ladder`

#### Module 8 — Pipeline Thinking (`track: core` | `modality: M4: pipeline-calibration-lab`)
* **Core Ideas:** A pipeline is a hypothesis about causality across 9 layers (`Brief → Input Prep → Generation → Structural Control → Identity/Voice Control → Selection → Revision → Verification → Final Production`). Includes status-aware versioning (`project_v01_YYYY-MM-DD_status_purpose`) and tool data-policy audits.

#### Module 9 — Prediction & Calibration (`track: core` | `modality: M4: pipeline-calibration-lab`)
* **Core Ideas:** The question is not *"Was I right?"* but *"Was I as right as I expected to be?"* Tracks pre-run predictions with `% confidence` against actual outcomes. Crucially pairs calibration with the **Quarterly Calibration Range Check** so high accuracy does not mask **Taste Narrowness**.
* **Interactive Studio Exercises:**
  1. **Pre-Run Ablation & Confidence Lock:** Student selects a variable to change or break, commits a written prediction + confidence slider ($0\%–100\%$), runs the test, and logs `Direction of Error`, `Magnitude`, and `Revised Mental Model`.
  2. **Calibration-vs-Range Scatterplot:** Visualizes whether predictions are clustering only in safe, narrow territory.

#### Module V3 & Module W3 — Visual & Writing Pipeline Systems (`modality: M4: pipeline-calibration-lab`)
* **Interactive Studio Exercises:**
  1. **Controlled Variation Matrix:** **12 visual variations** (preserving identity while changing context/action) and **8 writing variations** (preserving voice across subjects + 1 deliberate out-of-voice test).
  2. **Human Intervention Proof:** Side-by-side comparison showing where manual human intervention (e.g., hand-drawing a cast shadow that knows the window shape, or restoring halting human vulnerability over smooth AI prose) achieved what automation did not know was missing.

#### Craft Knowledge & Physical Sustainability (`modality: M4: pipeline-calibration-lab`)
* **Interactive Studio Exercises:**
  1. **Deviation-as-Craft Drill:** Name a convention (e.g., the establishing shot or paragraph closure), state what it accomplishes, and create 3 studies that violate it for a deliberate purpose.
  2. **Ergonomic & Screen-Fatigue Guardian:** Non-intrusive 30–45m wrist/posture break and 20-20-20 eye-reset tracker with physical warning sign checklist.

---

### PART IV — CALIBRATE (Weeks 7–8)
* **Governing Question:** *How do I know what is good, distinctive, and appropriate?*
* **Scaffolding State:** `Supplied: Broad Category | Removed: Pre-written Exercise, Template, Ladder`

#### Module 10, V4, W4 & Module 11 — Taste as Infrastructure & Comparative Judgment (`modality: M5: taste-curation-arena`)
* **Core Ideas:** Usable taste = `Preference + Criteria + Reference Class + Mechanism + Purpose`. Aesthetic attraction is not project fitness.
* **Interactive Studio Exercises:**
  1. **4-Group Anchor Library (15–20 High-Signal Anchors per Track):** Tracks *Human References ($\ge 40\%$ enforced)*, *AI Successes*, *AI Failures*, and *Own Work*. Includes the **Anchor Demotion Workflow** (demoting 3 early anchors as criteria mature).
  2. **Slop & AI-Default Detector:** Named slop criteria builder (e.g., *"Faux-profundity"*, symmetrical hedging, unearned urgency).
  3. **20-Output Blind Curation Arena:** Ranks 20 outputs with provenance hidden, locks written criteria, and then reveals which were human, AI, or hybrid.
  4. **Reverse-Direction Challenge:** Constructs a new brief and purpose under which a previously rejected output becomes the right choice.
  5. **Taste-Range Audit:** 5-question check ensuring the anchor library is still surprising the practitioner rather than homogenizing.

---

### PART V — DIRECT (Weeks 9–10)
* **Governing Question:** *Can I make and defend decisions under real constraints — including with collaborators?*
* **Scaffolding State:** `Supplied: Situation | Removed: Category, Exercise, Template, Ladder`

#### Module 12, 13, V5, W5 — Production Direction, Professional Scope & Refusal (`modality: M6: direction-collab-studio`)
* **Interactive Studio Exercises:**
  1. **1-Page Scope & Revision Gate (Module 13):** Must be completed before project start—defining stated vs. actual problem, in/out of scope, max revision cycles (default 3 named cycles), re-brief triggers, IP/pipeline ownership, and contextual AI disclosure.
  2. **Stakeholder Critique Triage & Re-Brief Fork (Module 12):** Diagnoses raw feedback (*intent, structure, execution, or preference*) and commits to `Apply | Adapt | Propose Alternative | Push Back | Re-Brief`.
  3. **5-Mode Refusal Composer (Appendix F):** Structured defense builder for **Ethical**, **Positional**, **Technical**, **Intentional**, and **Slop** refusals.

#### Module 14 — Collaborative Direction (`track: contextual` | `modality: M6: direction-collab-studio`)
* **Interactive Studio Exercises:**
  1. **Decision Rights Matrix & Economics Builder:** Pre-project agreement defining domain ownership (`Premise, Visual, Voice, Pipeline, Revisions, Delivery, Credit`), revenue split model (`Equal, Weighted, Role, Milestone, Royalty`), process-IP ownership, and dissolution clauses.
  2. **Taste Conflict & "Both Positions Are Right" Resolver:** Logs legitimate aesthetic disagreements, names the mechanism of each position, resolves via domain ownership/alternation/concession, and explicitly records **what was lost** by the unchosen path.

---

### PART VI — AUTHOR & TRANSFER (Weeks 11–12)
* **Governing Question:** *What do I consistently stand for, and can I act without scaffolding?*
* **Scaffolding State:** `Supplied: Practical Conditions Only | Removed: Situation, Category, Exercise, Template, Ladder`

#### Modules 15, 16, 17, 18, V6, W6 & The Blank-Sheet Test (`modality: M7: agency-blank-sheet`)
* **Interactive Studio Exercises:**
  1. **Blind 10-Piece Position Gap Analyzer (Module 15):** Displays 10 finished works without titles or rationales so the user (or a peer) infers the underlying commitments, then diffs the inferred position against the written *Private* and *Public Positions*.
  2. **Cross-Medium Synthesis & Removal Test (Module 17):** Defines *What the image does*, *What the text does*, and *The Third Thing neither can do alone*, then tests whether removing either medium collapses the argument.
  3. **Public Process Transformer (Module 18):** Converts an internal Decision Log, Reverse-Direction Test, or Calibration Log into a public essay or case study.
  4. **The 14-Step Blank-Sheet Test Capstone:** Zero scaffolding. Given only practical conditions (e.g., 4 hours, a space, a tool), the practitioner constructs the entire chain from *Observation → 3 Candidate Problems → Positionality Check → Selected Problem → 3 Premises → Self-Authored Brief → Pipeline → Drafts → Diagnosis → Revision/Re-Brief → Final Work → Live Defense → Transfer Reflection*.

---

### INDEPENDENT PRACTICE (Months 4–9) & CONTINUING AGENCY
* **Monthly Scaffolding Decay:**
  * **Month 4:** External Brief supplied → Execute, diagnose, defend.
  * **Month 5:** Broad Category supplied → Author the brief.
  * **Month 6:** Theme/Constraint supplied → Author premise + medium.
  * **Month 7:** Real-World Stakeholder Situation → Diagnose the *actual* problem and re-brief before building.
  * **Month 8:** Self-Originated Practice → Zero external input.
  * **Month 9:** Blank-Sheet Capstone + **"How I Decided What to Make"** reconstruction essay.
* **Monthly Maintenance Rituals Built into the App:**
  * **The Monthly Problem-Finding Session (60–90m):** Keeps the upstream problem-locating faculty alive.
  * **The Monthly Unassigned Beginning (60m + Mandatory Stop):** Spend 60 minutes finding and beginning something worth pursuing without a brief or medium, **then stop**—training the act of beginning without external permission.
  * **Module 19 — Teaching the Framework (Contextual):** 6-stage Transmission Ladder, Diagnostic Question prompts, 10-second Silence Tolerance timer, and 3-Source Teaching Feedback Record (Learner + Observer + Self-Recording).
```

```markdown:SvelteKit 2 & Svelte 5 Technical Architecture:03-sveltekit2-architecture.md
# Technical Architecture Specification: SvelteKit 2 + Svelte 5 (Runes)
*Engineered for "Directing the Machine" — Local-First, Anti-Overbuilding, & Progressive Scaffolding Removal*

---

## 1. Recommended Core Stack
To ensure the web app honours the course's core warning (*"If you spend more time managing the course than making things, you have already lost the thread"*), the technical stack prioritizes **instant zero-latency local-first execution**, **Progressive Disclosure**, and **Svelte 5 Runes reactivity**:

* **Framework:** `SvelteKit 2.x` + `Svelte 5.x` (strictly using Runes: `$state`, `$derived`, `$effect`, `$props`, `$bindable`)
* **Type Safety & Schema Validation:** `TypeScript 5.x` + `Zod` (validates lesson frontmatter, 10-minute log caps, and Two-Axis assessment records)
* **Styling & Studio UI:** `Tailwind CSS v4` + `Bits UI` / `shadcn-svelte` + `Lucide Svelte`
* **Multi-Modal Capture (Anti-Verbal Bias):**
  * **Quick Sketch & Visual Massing Overlay:** HTML5 `<canvas>` component for <2-minute thumbnails, 5-second memory reconstructions, and 3–5 value mass overlays.
  * **Voice-to-Log Capture:** Native Web Speech API / `MediaRecorder` so visual/embodied practitioners can speak their 1-line logs or self-defense recordings instead of typing walls of text.
* **Persistence Architecture:**
  * **Primary (Zero-Setup Local-First):** `IndexedDB` (for image studies, audio defenses, and portfolios) + `localStorage` (for reactive Runes state) + **1-Click Project Archive Exporter** (exports the exact `00-problem/` through `09-reflection/` Markdown folder structure defined in Appendix L!).
  * **Optional Cloud & Calibration Sync:** Lightweight SvelteKit Server Routes (`/api/critique-share`) backed by SQLite/Turso or Supabase so learners can send a **9-Question Critique Link** to their Calibration Network without forcing critics to create an account.

---

## 2. Project Directory Structure

```text
directing-the-machine/
├── src/
│   ├── content/
│   │   ├── course-manifest.json          # Master sequence: Module 0, Week 0, Parts I-VI, Months 4-9
│   │   ├── lessons/                      # Modular Markdown files parsed from master course
│   │   ├── drills/                       # Appendix I Deliberate Practice Drills JSON/MD
│   │   └── appendices/                   # Appendices A-O (loaded just-in-time via Cmd+K drawer)
│   ├── lib/
│   │   ├── components/
│   │   │   ├── shell/
│   │   │   │   ├── TodayLoopHeader.svelte        # Shows current Weekly Loop step & Intensity Path
│   │   │   │   ├── TenMinuteLogTimer.svelte      # Hard 10m cap timer to prevent logging theatre
│   │   │   │   ├── FailureTriageModal.svelte     # 4-way wizard: Output, Habit, Motivation, Log Decay
│   │   │   │   ├── HemingwayStopModal.svelte     # "When to Stop / Abandon / Finish" gate
│   │   │   │   └── ReferenceDrawer.svelte        # Just-in-time Appendix & Ladder lookup
│   │   │   ├── modalities/                       # The 8 specialized studio modalities (M0-M7)
│   │   │   │   ├── M0PracticeContractHub.svelte  # Week 0 Baseline, Intensity Path, Play & Non-Instrumental
│   │   │   │   ├── M1ProblemPositionLab.svelte   # 5-in-30 Funnel, Positionality Compass, Unassigned Beginning
│   │   │   │   ├── M2DiagnosticVision.svelte     # Zero-Adjective Linter, 5s Flash, Massing & Close-Reading
│   │   │   │   ├── M3PremiseBriefLab.svelte      # Premise Rejection Matrix, 3/6/10 Constraints, Provenance
│   │   │   │   ├── M4PipelineCalibration.svelte  # Pre-run Confidence %, Range vs Calibration, Ergonomics
│   │   │   │   ├── M5TasteCurationArena.svelte   # 5-Part Taste, Blind 20 Ranker, Demotions, Reverse-Brief
│   │   │   │   ├── M6DirectionCollab.svelte      # Revision vs Re-Brief, Stakeholder Triage, Decision Rights, Refusal
│   │   │   │   └── M7AgencyBlankSheet.svelte     # 10-Piece Position Gap, Cross-Medium Removal Test, Blank-Sheet
│   │   │   └── assessment/
│   │   │       ├── TwoAxisQuadrant.svelte        # Outcome Quality x Decision Quality 2x2 Matrix
│   │   │       ├── CompetencyRadar16.svelte      # 11 Core + 4 Contextual + 1 Meta-Competency Radar
│   │   │       └── BlindSelfAssessment.svelte    # 7-day delayed blind re-scoring workflow
│   │   ├── state/
│   │   │   ├── practice.svelte.ts                # Svelte 5 Runes global store (Intensity, Scaffolding, Logs)
│   │   │   └── log-integrity.svelte.ts           # Detects Log Decay (repetitive confidence/stakes/apply)
│   │   ├── engine/
│   │   │   ├── adjective-linter.ts               # Real-time evaluative adjective detector
│   │   │   ├── calibration-math.ts               # Brier score + Taste-Narrowness Range index
│   │   │   └── archive-exporter.ts               # Exports Appendix L folder tree (.zip / .json)
│   │   └── schemas/
│   │       └── course.schema.ts                  # Zod schemas for all templates in Appendix L
│   └── routes/
│       ├── +layout.svelte                        # Progressive-disclosure shell
│       ├── +page.svelte                          # "Today's Practice Loop" & Scaffolding Progression Map
│       ├── studio/[moduleId]/+page.svelte        # Dynamic Modality Router (respects Scaffolding Removal)
│       ├── logs/+page.svelte                     # Unified 10-Minute Capped Logbook (with Decay Audit)
│       ├── critique/[shareId]/+page.svelte       # Zero-login 9-Question External Critique View
│       └── api/evaluate/+server.ts               # Optional AI Diagnostic & Log-Integrity Coach endpoint
├── scripts/
│   └── ingest-master-course.ts                   # Parses your raw course markdown into structured routes
└── svelte.config.js
```

---

## 3. Svelte 5 Runes State Engine (`src/lib/state/practice.svelte.ts`)
This state engine implements **Intensity Paths (Appendix O)**, **Scaffolding Removal Stages**, **Two-Axis Quadrant Assessment**, and **Automated Log Decay Detection**:

```typescript
// src/lib/state/practice.svelte.ts
import { browser } from '$app/environment';

export type IntensityPath = 'full-time-12w' | 'extended-24w' | 'distributed-48w' | 'maintenance-4h';
export type MasteryLayer = 1 | 2 | 3; // 1: Capability, 2: Independence, 3: Agency
export type Quadrant = 'mastery' | 'learning-in-progress' | 'lucky-unstable' | 'failure';

export interface CalibrationEntry {
  id: string;
  date: string;
  domain: 'pipeline' | 'curation' | 'writing' | 'visual' | 'audience' | 'direction' | 'problem';
  variableChanged: string;
  prediction: string;
  confidencePct: number; // 0 - 100
  actualOutcome: string;
  matchedExpectation: boolean;
  wasSurprising: boolean; // Used for the Taste-Narrowness / Range check
  modelRevision: string;
}

export interface ProblemEntry {
  id: string;
  date: string;
  source: string;
  noticed: string;
  framedProblem: string;
  mode: 'Solve' | 'Investigate' | 'Reveal' | 'Reframe' | 'Explore' | 'Construct';
  stakes: string;
  positionality: 'From' | 'With' | 'For' | 'About' | 'Over';
  hasStanding: boolean;
  standingJustification: string;
  selected: boolean;
  rejectionReason?: string;
}

class PracticeEngine {
  // Onboarding & Pacing State (Appendix O)
  intensityPath = $state<IntensityPath>('full-time-12w');
  showDeepening = $state<boolean>(false);
  activePart = $state<number>(1); // 0 = Week 0, 1..6 = Parts I-VI, 7..12 = Months 4-9
  contextualCompetencies = $state({
    collaboration: false,
    transmission: false,
    publicProcess: false,
    professionalPractice: true
  });

  // Progressive Scaffolding Removal Derived State
  scaffolding = $derived.by(() => {
    if (this.activePart <= 1) return { exercise: true, ladder: true, template: true, category: true, situation: true };
    if (this.activePart === 2) return { exercise: true, ladder: false, template: true, category: true, situation: true };
    if (this.activePart === 3) return { exercise: true, ladder: false, template: false, category: true, situation: true };
    if (this.activePart === 4) return { exercise: false, ladder: false, template: false, category: true, situation: true };
    if (this.activePart === 5) return { exercise: false, ladder: false, template: false, category: false, situation: true };
    return { exercise: false, ladder: false, template: false, category: false, situation: false }; // Part VI & Months 8-9 Blank Sheet
  });

  // Core Logs
  problems = $state<ProblemEntry[]>([]);
  calibrations = $state<CalibrationEntry[]>([]);
  nonInstrumentalLines = $state<{ date: string; line: string }[]>([]);
  playLines = $state<{ date: string; line: string }[]>([]);

  // Calibration vs. Range Telemetry (Module 9)
  calibrationStats = $derived.by(() => {
    if (this.calibrations.length === 0) return { avgConfidence: 0, hitRate: 0, surpriseRate: 100, narrownessWarning: false };
    const hits = this.calibrations.filter((c) => c.matchedExpectation).length;
    const surprises = this.calibrations.filter((c) => c.wasSurprising).length;
    const hitRate = Math.round((hits / this.calibrations.length) * 100);
    const surpriseRate = Math.round((surprises / this.calibrations.length) * 100);
    const domainsUsed = new Set(this.calibrations.slice(-6).map((c) => c.domain)).size;

    // High accuracy + low surprise/domain diversity = The Narrowing Trap
    const narrownessWarning = this.calibrations.length >= 4 && hitRate >= 80 && (surpriseRate < 20 || domainsUsed <= 1);
    return { hitRate, surpriseRate, narrownessWarning };
  });

  // Automated Log Decay Detector (Failure Type 4)
  logDecayAlerts = $derived.by(() => {
    const alerts: string[] = [];
    const recentCal = this.calibrations.slice(-4);
    if (recentCal.length === 4 && new Set(recentCal.map((c) => c.confidencePct)).size === 1) {
      alerts.push('Calibration Decay: Your last 4 predictions used the exact same confidence percentage. Avoid default numbers.');
    }
    const recentProbs = this.problems.slice(-4);
    if (recentProbs.length === 4 && new Set(recentProbs.map((p) => p.stakes.trim().toLowerCase())).size === 1) {
      alerts.push('Problem-Finding Decay: Your "Stakes" field is repeating across entries. Rotate one field or push for concrete specificity.');
    }
    return alerts;
  });

  // Two-Axis Assessment Classifier (Outcome Quality x Decision Quality)
  classifyQuadrant(outcomeScore: number, decisionScore: number): Quadrant {
    const strongOutcome = outcomeScore >= 3;
    const strongDecision = decisionScore >= 3;
    if (strongOutcome && strongDecision) return 'mastery';
    if (!strongOutcome && strongDecision) return 'learning-in-progress';
    if (strongOutcome && !strongDecision) return 'lucky-unstable';
    return 'failure';
  }
}

export const practiceStore = new PracticeEngine();
```
```

```markdown:Agentic Workflow Master Instructions (CLAUDE.md / .cursorrules):04-agent-instructions.md
# Agentic Workflow Master Specification (`CLAUDE.md` / `.cursorrules`)

> **How to use this file:** Place this file in the root of your repository as `CLAUDE.md` (for Claude Code) or `.cursorrules` (for Cursor / Windsurf) alongside `01-ui-ux-paradigm.md`, `02-course-curriculum-expanded.md`, `03-sveltekit2-architecture.md`, and `05-appendices-and-data-schemas.md`.

---

## 1. Role & Pedagogical Mandate
You are an elite Principal SvelteKit 2 Architect and Instructional Experience Designer building **"Directing the Machine: A Course in Creative Authorship for the AI-Augmented World"**.

### The Golden Rule of This Application
The course explicitly warns against its own potential failure mode:
> *"The document is not the practice. The practice is the practice. If you spend more time managing the course than making things, you have already lost the thread."*

Therefore, **never build bureaucratic forms that trap the user in endless typing**. Every screen must enforce:
1. **Progressive Disclosure:** Default to **"Today's Weekly Loop"** (`Read → Practise → Study → Make → Diagnose → Log → Transfer → Play`). Keep Appendices (`A–O`) hidden in a `Cmd+K` Reference Drawer until needed.
2. **The 10-Minute Log Cap:** Every log view must include `TenMinuteLogTimer.svelte`. One line per field is enough.
3. **Scaffolding Removal:** The UI must dynamically hide ladders, templates, categories, and exercise prompts according to `practiceStore.scaffolding` as the learner advances from `Part I` to `Part VI` and `Months 4–9`.
4. **Core vs. Deepening & Intensity Paths:** Respect the user's selected Intensity Path (`Full-Time 12w`, `Extended 24w`, `Distributed 48w`, `Maintenance 4h`) and hide `Deepening` modules unless toggled on.

---

## 2. Strict SvelteKit 2 & Svelte 5 Guardrails
1. **Svelte 5 Runes Only:**
   * Use `$state`, `$derived`, `$derived.by`, `$effect`, `$props`, and `$bindable`.
   * **FORBIDDEN:** Legacy Svelte 3/4 syntax (`export let`, `$:`, `writable` stores, `createEventDispatcher`, `<slot>`). Use `{#snippet}` and `{@render}` instead of slots.
2. **SvelteKit 2 Conventions:**
   * Import routing state from `$app/state` (`import { page } from '$app/state'`), never `$app/stores`.
3. **Offline-First & Zero-Friction:**
   * The app must work 100% offline/locally out of the box using `localStorage` and `IndexedDB`, with a 1-click **Appendix L Project Folder Exporter** (`.zip` / `.md` bundle).

---

## 3. Phased Autonomous Build Plan

Execute the implementation in 5 sequential phases. Run `npm run check` at the end of every phase.

### Phase 1: Studio Shell, Onboarding (Module 0 / Week 0) & Intensity Engine
1. Scaffold SvelteKit 2 + Tailwind CSS + TypeScript.
2. Implement `src/lib/state/practice.svelte.ts` (Intensity Path, Core/Deepening toggle, Scaffolding Removal state machine, Log Decay detector).
3. Build `M0PracticeContractHub.svelte`:
   * **Week 0 Baseline Diagnostic:** 12-competency interactive 1–4 self-assessment + Radar chart.
   * **Intensity Path & Runway Selector (Appendix O):** Switches deliverable quotas and weekly rhythm between 12-week, 24-week, 48-week, and 4h/wk Maintenance modes.
   * **70–80% Deliberate Practice Timer:** Tracks micro-skill reps and auto-recommends difficulty adjustments.
   * **Protected Non-Instrumental Attention & Play Timers:** Distraction-free timers that allow only a single 1-line entry (*"What did I encounter that I was not looking for?"* / *"What did I enjoy?"*).

### Phase 2: Part I & Part II Studios (Find, Observe, Formulate & Provenance)
1. Build `M1ProblemPositionLab.svelte` (Module 2 + Monthly Problem-Finding + Unassigned Beginning):
   * 6-step Problem Funnel (`Notice → Collect → Frame → Test → Select → Justify`).
   * **Positionality Compass (`From | With | For | About | Over`)** with Standing check and Positional Refusal option.
   * **60-Minute Unassigned Beginning Timer** that enforces stopping after finding a problem.
2. Build `M2DiagnosticVision.svelte` (Modules 1, 4, V1, W1):
   * **Zero-Adjective Observation Linter** (`adjective-linter.ts`) blocking evaluative words (*good, bad, beautiful, ugly, strong, weak, polished, boring*) during observation.
   * **6-Question Human-Decision Extractor** (Explicit decisions vs. Model defaults).
   * **Top-Down Diagnostic Ladder** (locks lower rungs until higher rungs are resolved; automatically hides in Part II+).
   * **5-Second Thumbnail Flash & HTML5 Massing Canvas (V1)** + **Close-Reading Turn/Omission Diff (W1)**.
3. Build `M3PremiseBriefLab.svelte` (Modules 5, 6, V2, W2, 7):
   * Premise Viability Check + Rejection Logic recorder.
   * 7-Layer Brief Architect + `Open (3) / Directed (6) / Severe (10)` Constraint Experiment tabs.
   * Craft-First Gate (requires <2m thumbnail scribbles or unassisted prose outline before unlocking generation).
   * Module 7 Provenance Stamp (`Human Contribution` vs. `Tool Contribution`).

### Phase 3: Part III & Part IV Studios (Build, Predict, Calibrate & Curation)
1. Build `M4PipelineCalibration.svelte` (Modules 8, 9, V3, W3, Craft Sustainability):
   * 9-Layer Pipeline Mapper + Status-Aware Version Namer (`project_v01_YYYY-MM-DD_status_purpose`).
   * **Pre-Run Confidence Predictor:** Locks prediction + `% confidence` before testing, then calculates calibration accuracy and plots the **Taste-Narrowness Range Warning**.
   * **Ergonomic & Physical Sustainability HUD:** 30–45m drawing break & 20-20-20 screen timer.
2. Build `M5TasteCurationArena.svelte` (Modules 10, V4, W4, 11):
   * 5-Part Taste Builder (`Preference + Criteria + Reference Class + Mechanism + Purpose`).
   * Anchor Library enforcing the **$\ge 40\%$ Human-Anchor Rule** and **Anchor Demotion Workflow**.
   * **20-Output Blind Provenance Ranker** + **Reverse-Direction Challenge** (writing a brief where a rejected output succeeds).

### Phase 4: Part V & Part VI Studios (Direct, Collaborate, Synthesize & Blank Sheet)
1. Build `M6DirectionCollab.svelte` (Modules 12, 13, 14, V5, W5, 19):
   * 1-Page Scope & Revision Gate + **Revision (max 3 named cycles) vs. Re-Brief Fork**.
   * Stakeholder Critique Translator (`Apply | Adapt | Propose Alternative | Push Back | Re-Brief`).
   * **Module 14 Collaborative Direction Suite:** Decision Rights Map, Taste Conflict Resolver (recording what is lost), and Economics/Dissolution Builder.
   * **5-Mode Refusal Composer** (`Ethical | Positional | Technical | Intentional | Slop`).
   * **Module 19 Transmission Trainer:** 6-Stage Scaffolding Removal for mentees + 10-second Silence Tolerance timer.
2. Build `M7AgencyBlankSheet.svelte` (Modules 15, 16, 17, 18, V6, W6, Blank-Sheet Test):
   * 10-Piece Blind Position Gap Analyzer (Written vs. Inferred Position).
   * Cross-Medium Synthesis Removal Tester (Module 17) + Public Process Transformer (Module 18).
   * **14-Step Blank-Sheet Capstone Workspace** (zero scaffolding) + *"How I Decided What to Make"* builder.

### Phase 5: Two-Axis Assessment, 4-Way Failure Triage & Hemingway Stop Gate
1. Build `TwoAxisQuadrant.svelte` plotting **Outcome Quality × Decision Quality** (`Mastery`, `Learning in Progress`, `Lucky / Unstable Hit`, `Failure`).
2. Build `FailureTriageModal.svelte` implementing the 4 differentiated protocols:
   * *Output Failure*, *Habit Failure*, *Motivational Failure*, and *Log Decay*.
3. Build `HemingwayStopModal.svelte` implementing the *"When to Stop for the Day / When a Work is Done / When to Abandon a Project"* protocols.
```

```markdown:Appendices, Operational Templates & Zod Schemas:05-appendices-and-data-schemas.md
# Appendices (A–O), Operational Templates & Zod Data Schemas
*Drop-in TypeScript & Zod definitions (`src/lib/schemas/course.schema.ts`) encoding all Rubrics, Diagnostic Ladders, Logs, Transfer Tests, and Deliberate Practice Drills from Appendices A–O.*

---

## 1. Complete Zod Data Schemas (`src/lib/schemas/course.schema.ts`)

```typescript
import { z } from 'zod';

// --- APPENDIX B: DIAGNOSTIC LADDERS ---
export const UniversalLadderRung = z.enum([
  '1_purpose',
  '2_premise_claim',
  '3_structure',
  '4_audience_effect',
  '5_internal_logic_construction',
  '6_local_execution',
  '7_surface_polish'
]);

export const VisualLadderRung = z.enum([
  '1_intent',
  '2_composition',
  '3_value_major_shape',
  '4_gesture_action',
  '5_construction',
  '6_proportion',
  '7_subject_specific_structure',
  '8_material',
  '9_rendering'
]);

export const WritingLadderRung = z.enum([
  '1_intent',
  '2_claim_premise',
  '3_argument_structure',
  '4_voice_stance',
  '5_rhythm',
  '6_sentence_paragraph_logic',
  '7_clarity',
  '8_mechanics',
  '9_polish'
]);

export const TimeSpatialLadderRung = z.enum([
  '1_intent',
  '2_structure_over_time_space',
  '3_rhythm_pacing_duration',
  '4_sequence_adjacency',
  '5_relationship_to_body_viewer',
  '6_material_and_site',
  '7_technical_execution'
]);

// --- APPENDIX C: 16 COMPETENCIES + RUBRIC SCALE (1-4) ---
export const MasteryScoreSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

export const UniversalRubricSchema = z.object({
  problemFinding: MasteryScoreSchema,
  positionality: MasteryScoreSchema,
  nonInstrumentalAttention: MasteryScoreSchema,
  observation: MasteryScoreSchema,
  premise: MasteryScoreSchema,
  specification: MasteryScoreSchema,
  diagnosis: MasteryScoreSchema,
  curation: MasteryScoreSchema,
  systems: MasteryScoreSchema,
  calibration: MasteryScoreSchema,
  direction: MasteryScoreSchema,
  authorship: MasteryScoreSchema,
  transfer: MasteryScoreSchema,
  practice: MasteryScoreSchema,
  logIntegrity: MasteryScoreSchema,
  play: MasteryScoreSchema
});

export const ContextualRubricSchema = z.object({
  collaboration: MasteryScoreSchema.optional(),
  transmission: MasteryScoreSchema.optional(),
  publicProcess: MasteryScoreSchema.optional(),
  professionalPractice: MasteryScoreSchema.optional()
});

export const TwoAxisAssessmentSchema = z.object({
  outcomeQuality: MasteryScoreSchema,
  decisionQuality: MasteryScoreSchema,
  quadrant: z.enum(['mastery', 'learning-in-progress', 'lucky-unstable', 'failure']),
  blindDelayedOutcomeScore: MasteryScoreSchema.optional(),
  blindDelayedDecisionScore: MasteryScoreSchema.optional()
});

// --- APPENDIX L: OPERATIONAL LOG TEMPLATES ---
export const ProblemFindingLogSchema = z.object({
  id: z.string(),
  date: z.string(),
  source: z.string(),
  observation: z.string(),
  question: z.string(),
  tension: z.string(),
  mode: z.enum(['Solve', 'Investigate', 'Reveal', 'Reframe', 'Explore', 'Construct']),
  positionality: z.enum(['From', 'With', 'For', 'About', 'Over']),
  standingBasis: z.string(),
  possiblePremise: z.string(),
  stakes: z.string(),
  wouldPursue: z.enum(['Yes', 'No', 'Maybe']),
  rejectionReason: z.string().optional(),
  followUp: z.string().optional(),
  isUnassignedBeginning: z.boolean().default(false),
  stoppedAfter60Min: z.boolean().optional()
});

export const PracticeLogSchema = z.object({
  id: z.string(),
  date: z.string(),
  microSkill: z.string(),
  successCriterion: z.string(),
  repsCompleted: z.number().int().min(1),
  repsSucceeded: z.number().int().min(0),
  difficulty: z.number().int().min(1).max(5),
  errorsObserved: z.string(),
  correctionApplied: z.string(),
  resultAfterCorrection: z.string(),
  nextSessionFocus: z.string()
});

export const CalibrationLogSchema = z.object({
  id: z.string(),
  date: z.string(),
  systemTested: z.string(),
  variableChanged: z.string(),
  prediction: z.string(),
  confidencePct: z.number().min(0).max(100),
  actual: z.string(),
  directionOfError: z.enum(['Over-estimated', 'Under-estimated', 'Calibrated']),
  magnitudeOfError: z.enum(['Low', 'Moderate', 'High']),
  explanation: z.string(),
  revisionToMentalModel: z.string()
});

export const DecisionLogSchema = z.object({
  id: z.string(),
  date: z.string(),
  context: z.string(),
  decision: z.string(),
  rejectedAlternative: z.string(),
  reason: z.string(),
  evidence: z.string(),
  riskAndUncertainty: z.string(), // Must explicitly record uncertainty
  result: z.string(),
  revisionToUnderstanding: z.string()
});

export const ProvenanceRecordSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  premiseOrigin: z.string(),
  humanContribution: z.string(), // Most important field
  toolContribution: z.string(),
  referenceSources: z.array(z.string()),
  licenseAndConsentVerified: z.boolean(),
  toolVersionAndDataPolicy: z.string(),
  contextualDisclosurePlan: z.string()
});

export const RefusalRecordSchema = z.object({
  id: z.string(),
  date: z.string(),
  refusalType: z.enum(['Ethical', 'Positional', 'Technical', 'Intentional', 'Slop']),
  statedRequest: z.string(),
  inferredUnderlyingOutcome: z.string(),
  diagnosedConflict: z.string(),
  principleNamed: z.string(),
  alternativeOffered: z.string(),
  result: z.string()
});
```

---

## 2. The 17 Transfer Tests Catalog (`src/content/transfer-tests.json`)
From **Appendix G**, the application schedules and tracks all 17 Transfer Tests separately from rehearsed module exercises:

| Test ID | Name | Scaffolding Removed / Challenge | Target Layer |
| :--- | :--- | :--- | :--- |
| **`TT-01`** | **New Medium** | Apply top-down diagnosis to an unfamiliar medium with ladders hidden. | Layer 1 → 2 |
| **`TT-02`** | **New Premise** | Originate and specify a premise from an ordinary object/situation in 30m without worked examples. | Layer 2 |
| **`TT-03`** | **New Tool / Manual Fallback** | Move a workflow to a different tool category or execute the underlying operation manually. | Layer 1 → 2 |
| **`TT-04`** | **New Audience** | Re-specify the same premise for an audience with radically different needs. | Layer 2 |
| **`TT-05`** | **Adversarial Critique** | Defend a decision when a critic proposes a plausible but premise-destroying alternative. | Layer 2 |
| **`TT-06`** | **Reversal (Reverse-Direction)** | Construct a brief and context in which a previously rejected output becomes the right solution. | Layer 2 |
| **`TT-07`** | **Blank Sheet** | Start from an unfamiliar situation with zero templates/ladders and construct the 14-step chain. | Layer 2 → 3 |
| **`TT-08`** | **No Assignment** | With no brief, deadline, or audience, locate a problem worth pursuing within 90m and begin. | **Layer 3: Agency** |
| **`TT-09`** | **Responsibility Defense** | Articulate and defend full responsibility for selection, framing, effects, and disclosure under questioning. | **Layer 3: Agency** |
| **`TT-10`** | **System Calibration** | Given an unfamiliar workflow, lock in pre-run predictions with `% confidence` before running. | Layer 2 |
| **`TT-11`** | **Cross-Medium Synthesis** | Given a premise neither image nor text can carry alone, construct a unified third-thing object. | Layer 2 |
| **`TT-12`** | **Collaborative Direction** | Resolve a legitimate aesthetic conflict with a co-creator, naming mechanisms and what is lost. | Contextual |
| **`TT-13`** | **Collaborative Economics** | Propose a fair revenue split, credit order, pipeline-IP ownership, and dissolution clause for unequal inputs. | Contextual |
| **`TT-14`** | **Transmission Scaffolding** | Diagnose a stuck learner's bottleneck and ask a question that opens the next step without solving it. | Contextual |
| **`TT-15`** | **Teaching Feedback Audit** | From a session recording, locate where you filled silence or supplied an answer vs. the learner's memory. | Contextual |
| **`TT-16`** | **Positionality Gate** | Evaluate a high-tension problem via the Positionality Check and either justify standing or refuse it. | Layer 2 → 3 |
| **`TT-17`** | **Log Integrity Audit** | Inspect 4 weeks of your own logs, flag hollow/repetitive entries, and rotate one field to restore substance. | Meta |
```

```html:Interactive UI/UX Prototype - Directing the Machine:index.html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Directing the Machine — Creative Authorship Studio Prototype</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            serif: ['"Instrument Serif"', 'Georgia', 'serif'],
            sans: ['Inter', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            studio: {
              bg: '#0C0D10',
              panel: '#13151A',
              card: '#1A1D24',
              border: '#2A2E39',
              ivory: '#F3F4F6',
              amber: '#F59E0B',
              cyan: '#06B6D4',
              emerald: '#10B981',
              rose: '#F43F5E'
            }
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #0C0D10;
      color: #F3F4F6;
      overflow-x: hidden;
    }
    .custom-scroll::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: #0C0D10;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #2A2E39;
      border-radius: 9999px;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">

  <!-- TOP TELEMETRY & ANTI-OVERBUILDING BAR -->
  <header class="border-b border-studio-border bg-studio-bg/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
    <!-- Brand + Three Layers Indicator -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif text-xl">
        D
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-serif text-lg tracking-wide text-white">Directing the Machine</span>
          <span id="header-scaffolding-badge" class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Part I • Full Scaffolding
          </span>
        </div>
        <p class="text-[11px] text-slate-400 hidden sm:block">
          The document is not the practice. Start with Today's Loop; consult reference only when needed.
        </p>
      </div>
    </div>

    <!-- Primary Workspace Switcher -->
    <nav class="flex items-center bg-studio-panel p-1 rounded-xl border border-studio-border text-xs">
      <button onclick="switchMainTab('loop')" id="tab-loop" class="px-3 py-1.5 rounded-lg font-medium transition bg-amber-500/20 text-amber-300 border border-amber-500/30">
        1. Today's Loop & Map
      </button>
      <button onclick="switchMainTab('studios')" id="tab-studios" class="px-3 py-1.5 rounded-lg font-medium transition text-slate-400 hover:text-white">
        2. Interactive Studios (M0–M7)
      </button>
      <button onclick="switchMainTab('assessment')" id="tab-assessment" class="px-3 py-1.5 rounded-lg font-medium transition text-slate-400 hover:text-white">
        3. Two-Axis & Logs
      </button>
    </nav>

    <!-- Right Controls: Intensity Path + 10m Log Cap Timer + Stuck/Stop Protocols -->
    <div class="flex items-center gap-2">
      <!-- Appendix O Intensity Selector -->
      <select id="intensity-selector" onchange="changeIntensity(this.value)" class="bg-studio-panel border border-studio-border rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-amber-500">
        <option value="full">Intensity: Full-Time (12w • 18-25h)</option>
        <option value="extended">Intensity: Extended (24w • 12-18h)</option>
        <option value="distributed">Intensity: Distributed (48w • 6-10h)</option>
        <option value="maintenance">Intensity: Maintenance (~4h/wk)</option>
      </select>

      <!-- 10-Minute Anti-Productivity-Theatre Log Timer -->
      <button onclick="toggleLogTimer()" id="log-timer-btn" class="px-2.5 py-1.5 rounded-lg bg-studio-panel border border-studio-border hover:border-emerald-500/40 text-[11px] font-mono flex items-center gap-1.5 text-emerald-300" title="Hard 10-minute logging cap so logs never replace making">
        <span>⏱️ Log Cap:</span>
        <span id="log-timer-display" class="font-bold">10:00</span>
      </button>

      <!-- Failure Protocols & When to Stop Triggers -->
      <button onclick="openModal('failure-modal')" class="px-2.5 py-1.5 rounded-lg bg-rose-950/50 border border-rose-500/40 hover:bg-rose-900/50 text-[11px] font-mono text-rose-300">
        ⚠️ I'm Stuck
      </button>
      <button onclick="openModal('stop-modal')" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-300" title="Hemingway Stop / Finish / Abandon Protocol">
        ✋ Stop Gate
      </button>
    </div>
  </header>

  <!-- MAIN CONTENT AREA -->
  <main class="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

    <!-- ================================================================= -->
    <!-- VIEW 1: TODAY'S PRACTICE LOOP, SCAFFOLDING SIMULATOR & COURSE MAP -->
    <!-- ================================================================= -->
    <section id="view-loop" class="space-y-6">
      <!-- Top Guardrail Banner + Core vs Deepening Toggle -->
      <div class="bg-gradient-to-r from-amber-950/30 via-studio-panel to-studio-panel border border-amber-500/30 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-mono uppercase tracking-widest text-amber-400">Governing Goal • Layer 3 Agency</span>
            <span class="text-xs text-slate-500">|</span>
            <span id="intensity-summary-pill" class="text-[11px] font-mono text-cyan-300">Active Path: 12-Week Intensive (Core Spine)</span>
          </div>
          <h1 class="font-serif text-2xl sm:text-3xl text-white">
            "When nobody asks you to make anything at all, can you find a problem worth pursuing — and take responsibility for pursuing it?"
          </h1>
        </div>
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button onclick="toggleDeepening()" id="deepening-toggle-btn" class="px-3 py-2 rounded-xl bg-studio-card border border-studio-border text-xs font-mono text-slate-300 hover:text-white transition">
            Tier: CORE ONLY (Click to +Deepening)
          </button>
          <button onclick="switchMainTab('studios'); selectStudio('m0')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs font-mono transition">
            Start Week 0 Baseline →
          </button>
        </div>
      </div>

      <!-- THE WEEKLY PRACTICE LOOP BAR (Interactive 8-Step Spine) -->
      <div class="bg-studio-panel border border-studio-border rounded-2xl p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="text-[11px] font-mono uppercase text-slate-400">Anti-Overwhelm Navigation • Do Not Read Ahead</span>
            <h2 class="text-base font-bold text-white">This Week's Practice Loop (Click any phase to launch its Studio)</h2>
          </div>
          <span class="text-xs font-mono text-emerald-400">Hard Rule: Max 10 min logging per session</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5" id="weekly-loop-cards">
          <!-- Populated dynamically via JS -->
        </div>
      </div>

      <!-- INTERACTIVE SCAFFOLDING REMOVAL SIMULATOR (Parts I–VI to Month 9) -->
      <div class="bg-studio-panel border border-studio-border rounded-2xl p-5 space-y-5">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span class="text-[11px] font-mono uppercase text-cyan-400">Pedagogical Spine • External → Internalised → Self-Authored Structure</span>
            <h2 class="text-lg font-bold text-white">Progressive Scaffolding Removal Simulator</h2>
            <p class="text-xs text-slate-400">Slide across the 12-Week Intensive and Months 4–9 to see what the UI supplies and what it deliberately removes.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-slate-400">Stage:</span>
            <span id="scaffold-stage-label" class="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold">
              Part I (Weeks 1–2): FIND & OBSERVE
            </span>
          </div>
        </div>

        <input id="scaffold-slider" type="range" min="1" max="9" value="1" oninput="updateScaffoldingStage(this.value)" class="w-full accent-amber-400 cursor-pointer" />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-studio-card border border-studio-border space-y-2">
            <div class="text-[11px] font-mono uppercase text-emerald-400">✓ Supplied by App at This Stage</div>
            <div id="scaffold-supplied" class="flex flex-wrap gap-1.5 text-xs font-mono"></div>
          </div>
          <div class="p-4 rounded-xl bg-studio-card border border-studio-border space-y-2">
            <div class="text-[11px] font-mono uppercase text-rose-400">✗ Removed from UI (You Must Supply)</div>
            <div id="scaffold-removed" class="flex flex-wrap gap-1.5 text-xs font-mono"></div>
          </div>
          <div class="p-4 rounded-xl bg-studio-card border border-studio-border space-y-1.5">
            <div class="text-[11px] font-mono uppercase text-amber-400">Target Mastery Layer & Focus</div>
            <div id="scaffold-layer" class="text-sm font-bold text-white"></div>
            <p id="scaffold-desc" class="text-xs text-slate-400 leading-relaxed"></p>
          </div>
        </div>
      </div>

      <!-- COMPLETE COURSE ARCHITECTURE GRID (Module 0, Parts I–VI, Months 4–9) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">Curriculum Architecture (Parts I–VI & Independent Practice)</h2>
          <span class="text-xs font-mono text-slate-400">Click any card to open its interactive Studio Modality</span>
        </div>
        <div id="curriculum-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Populated via JS -->
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- VIEW 2: THE 8 INTERACTIVE STUDIO MODALITIES (M0–M7)               -->
    <!-- ================================================================= -->
    <section id="view-studios" class="hidden space-y-5">
      <!-- Studio Switcher Bar -->
      <div class="bg-studio-panel border border-studio-border rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-1.5">
          <button onclick="selectStudio('m0')" id="btn-studio-m0" class="px-2.5 py-1.5 rounded-lg text-xs font-mono transition">M0: Practice, Play & Week 0</button>
          <button onclick="selectStudio('m1')" id="btn-studio-m1" class="px-2.5 py-1.5 rounded-lg text-xs font-mono transition">M1: Problem & Positionality</button>
          <button onclick="selectStudio('m2')" id="btn-studio-m2" class="px-2.5 py-1.5 rounded-lg text-xs font-mono transition">M2: Observation & Diagnosis</button>
          <button onclick="selectStudio('m3')" id="btn-studio-m3" class="px-2.5 py-1.5 rounded-lg text-xs font-mono transition">M3: Premise, Brief & Provenance</button>
          <button onclick="selectStudio('m4')" id="btn-studio-m4" class="px-2.5 py-1.5 rounded-lg text-xs font-mono transition">M4: Pipeline & Calibration Range</button>
          <button onclick="selectStudio('m5')" id="btn-studio-m5" class="px-2.5 py-1.5 rounded-lg text-xs font-mono transition">M5: Taste & Blind Curation</button>
          <button onclick="selectStudio('m6')" id="btn-studio-m6" class="px-2.5 py-1.5 rounded-lg text-xs font-mono transition">M6: Direction, Collab & Refusal</button>
          <button onclick="selectStudio('m7')" id="btn-studio-m7" class="px-2.5 py-1.5 rounded-lg text-xs font-mono transition">M7: Position, Synthesis & Blank Sheet</button>
        </div>
      </div>

      <!-- STUDIO M0: MODULE 0 (DELIBERATE PRACTICE, NON-INSTRUMENTAL & PLAY) + WEEK 0 -->
      <div id="studio-m0" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-5">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">Module 0 • Deliberate Practice Cycle</span>
            <span class="text-xs font-mono text-emerald-400">Target Zone: 70–80% Success (Fail 2–4 of 10 reps)</span>
          </div>
          <h2 class="text-xl font-bold text-white">Micro-Skill Isolation & Difficulty Regulator</h2>
          <p class="text-xs text-slate-300 leading-relaxed">
            Production aims at a deliverable; <strong>practice</strong> aims at changing your reliable capacity. Isolate one micro-skill, run 10 focused reps, and let the 70–80% rule calibrate your difficulty.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-[11px] font-mono uppercase text-slate-400">Micro-Skill (Specific, not general)</label>
              <input id="m0-skill" type="text" value="Place focal point so the eye enters at upper-left third within 2s" class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2.5 text-xs text-white font-mono" />
            </div>
            <div>
              <label class="text-[11px] font-mono uppercase text-slate-400">Observable Success Criterion</label>
              <input id="m0-criterion" type="text" value="Reads clearly at 120px thumbnail size without contour lines" class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2.5 text-xs text-white font-mono" />
            </div>
          </div>

          <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono text-slate-300">Successful Reps out of 10: <strong id="m0-rep-val" class="text-amber-400">7 / 10 (70%)</strong></span>
              <span id="m0-zone-badge" class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ Productive Learning Zone</span>
            </div>
            <input type="range" min="0" max="10" value="7" oninput="evaluatePracticeReps(this.value)" class="w-full accent-emerald-400 cursor-pointer" />
            <p id="m0-rep-advice" class="text-xs font-mono text-slate-400">
              7/10 succeeded: Enough failure to expose errors, enough success to reinforce mechanism. Keep this difficulty level.
            </p>
          </div>
        </div>

        <!-- Right: Protected Non-Instrumental Attention & Play One-Line Loggers -->
        <div class="lg:col-span-5 bg-studio-panel border border-studio-border rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div class="space-y-4">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">Module 0 & Module 3 • Anti-Rigidity Counter-Practices</span>
            <h3 class="text-lg font-bold text-white">Protected Non-Instrumental & Play Capsule</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              No brief, no evaluation, no converting into productivity. Write <strong>strictly one sentence</strong> after your session. Do not analyze it.
            </p>

            <div class="p-3.5 rounded-xl bg-studio-bg border border-studio-border space-y-2">
              <div class="text-[11px] font-mono text-cyan-300">1. Non-Instrumental Attention ("What did I encounter that I was not looking for?")</div>
              <input id="non-inst-input" maxlength="140" type="text" placeholder="e.g., The way the light hit the bus stop bench made it look like it was floating." class="w-full bg-studio-panel border border-studio-border rounded-lg p-2 text-xs text-white" />
              <button onclick="saveOneLiner('non-inst')" class="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono">Record 1 Line Only</button>
            </div>

            <div class="p-3.5 rounded-xl bg-studio-bg border border-studio-border space-y-2">
              <div class="text-[11px] font-mono text-amber-300">2. Play Practice ("What did I enjoy?")</div>
              <input id="play-input" maxlength="140" type="text" placeholder="e.g., Drawing a terribly proportioned horse with my non-dominant hand." class="w-full bg-studio-panel border border-studio-border rounded-lg p-2 text-xs text-white" />
              <button onclick="saveOneLiner('play')" class="px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono">Record 1 Line Only</button>
            </div>
          </div>

          <div id="one-liner-feed" class="p-3 rounded-xl bg-studio-card border border-studio-border text-xs font-mono text-slate-300 space-y-1.5">
            <div class="text-[10px] uppercase text-slate-500">Recent Unanalyzed Capsule Entries:</div>
            <div>• [Attention] "The sound of the city changes when the wind picks up — wider, not louder."</div>
            <div>• [Play] "Combining brutalist concrete textures with absurd medieval marginalia."</div>
          </div>
        </div>
      </div>

      <!-- STUDIO M1: PROBLEM-FINDING, POSITIONALITY & UNASSIGNED BEGINNING -->
      <div id="studio-m1" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">Module 2 • Problem-Finding Sequence</span>
            <span class="text-xs font-mono text-slate-400">Notice → Collect → Frame → Test → Select → Justify</span>
          </div>
          <h2 class="text-xl font-bold text-white">Locate a Problem Before Any Brief Exists</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-[11px] font-mono text-slate-400">1. Noticed (Raw observation from walk/source)</label>
              <textarea id="pf-noticed" rows="2" class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2.5 text-xs text-white">Every storefront on 4th Ave has a 'We're Hiring' sign, each hand-lettered or printed differently—desperate, formal, cheerful.</textarea>
            </div>
            <div>
              <label class="text-[11px] font-mono text-slate-400">2. Framed as Problem (With tension, not just a topic)</label>
              <textarea id="pf-framed" rows="2" class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2.5 text-xs text-white">What if a street's economic precarity is revealed not by its architecture, but by the vernacular of its labor-shortage signage?</textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="text-[11px] font-mono text-slate-400">3. Pursuit Mode</label>
              <select id="pf-mode" class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2 text-xs font-mono text-cyan-300">
                <option value="Reveal">Reveal (Exposing / witnessing)</option>
                <option value="Investigate">Investigate (Studying / researching)</option>
                <option value="Reframe">Reframe (Recontextualising)</option>
                <option value="Explore">Explore (Following / opening)</option>
                <option value="Construct">Construct (Building a new question)</option>
                <option value="Solve">Solve (Fixing / resolving)</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="text-[11px] font-mono text-slate-400">4. Stakes & Reciprocal Action ("Changes what I do")</label>
              <input id="pf-stakes" type="text" value="Reveals how communities display and hide precarity; I will photograph 10 signs today." class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2 text-xs text-white" />
            </div>
          </div>

          <div>
            <label class="text-[11px] font-mono text-slate-400">5. Explicit Rejection of Weaker Candidate Problems</label>
            <input id="pf-rejected" type="text" value="Rejected 'Aesthetics of late capitalism' (too broad/topic-like) and 'Death of retail' (overused cliché)." class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2 text-xs text-slate-300 font-mono" />
          </div>
        </div>

        <!-- Right: Positionality Compass + Unassigned Beginning Timer -->
        <div class="lg:col-span-5 bg-studio-panel border border-studio-border rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div class="space-y-4">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Positionality Check • Compass, Not Purity Gate</span>
            <h3 class="text-lg font-bold text-white">"Worth Pursuing" vs. "Mine to Pursue"</h3>
            <p class="text-xs text-slate-400">
              Select your relationship to this problem. No one has full standing; the test is honesty about the relationship and refusing extractive defaults.
            </p>

            <div class="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
              <button onclick="setPositionality('From')" id="pos-From" class="p-2 rounded-lg bg-studio-bg border border-studio-border hover:border-emerald-400">From</button>
              <button onclick="setPositionality('With')" id="pos-With" class="p-2 rounded-lg bg-studio-bg border border-studio-border hover:border-emerald-400">With</button>
              <button onclick="setPositionality('For')" id="pos-For" class="p-2 rounded-lg bg-studio-bg border border-studio-border hover:border-emerald-400">For</button>
              <button onclick="setPositionality('About')" id="pos-About" class="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">About</button>
              <button onclick="setPositionality('Over')" id="pos-Over" class="p-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/30">Over</button>
            </div>

            <div id="positionality-feedback" class="p-3.5 rounded-xl bg-studio-bg border border-studio-border text-xs text-slate-300 leading-relaxed">
              <strong>Mode: ABOUT (Observing from outside).</strong> Appropriate for research, criticism, and documentary observation—provided you acknowledge distance and do not claim to speak <em>for</em> or <em>over</em> the business owners or workers.
            </div>
          </div>

          <div class="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-amber-300">⚡ The Monthly Unassigned Beginning</span>
              <span class="text-[11px] font-mono text-amber-400">60m Timer → Mandatory Stop</span>
            </div>
            <p class="text-xs text-slate-300">
              Start with no brief and no predetermined medium. Spend 60 minutes finding something worth pursuing—<strong>then stop</strong>. Trains the capacity to notice and begin projects without permission.
            </p>
            <button onclick="showToast('Problem & Positionality Record logged to 00-problem/problem-finding-log.md')" class="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition">
              Commit Problem & Standing Check
            </button>
          </div>
        </div>
      </div>

      <!-- STUDIO M2: OBSERVATION & DIAGNOSTIC VISION (ZERO-ADJECTIVE LINTER + LADDERS + 5S FLASH) -->
      <div id="studio-m2" class="bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">Modules 1, 4, V1 & W1 • Observation Before Evaluation</span>
            <h2 class="text-xl font-bold text-white mt-1">Zero-Adjective Observation Linter & Top-Down Diagnostic Ladder</h2>
          </div>
          <button onclick="runFiveSecondFlash()" class="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-mono">
            👁️ Run 5-Second Thumbnail Flash Test (V1)
          </button>
        </div>

        <!-- 5-Second Flash Modal / Banner -->
        <div id="flash-test-box" class="hidden p-5 rounded-xl bg-studio-bg border border-purple-500/40 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-purple-300 uppercase">V1 Perceptual Calibration • 5-Second Flash</span>
            <span id="flash-timer-label" class="text-xs font-mono font-bold text-amber-400">Showing Reference: 5.0s</span>
          </div>
          <div id="flash-visual-stage" class="h-36 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-4">
            <!-- Simulated strong value mass composition -->
            <div class="w-64 h-28 bg-slate-950 relative overflow-hidden border border-slate-700 flex">
              <div class="w-1/3 h-full bg-slate-800"></div>
              <div class="w-2/3 h-full bg-slate-900 relative">
                <div class="w-10 h-10 bg-amber-100 rounded-sm absolute top-3 left-4 shadow-lg" title="Sky opening / high-contrast mass"></div>
                <div class="w-32 h-4 bg-slate-600 rotate-12 absolute top-12 left-6"></div>
                <div class="w-20 h-8 bg-slate-950 absolute bottom-2 right-4"></div>
              </div>
            </div>
          </div>
          <p id="flash-prompt-text" class="text-xs font-mono text-slate-300">
            Observe the 3–5 major value masses, focal entry point, and directional axis before the image disappears...
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Step 1: Zero-Adjective Linter -->
          <div class="lg:col-span-6 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-mono uppercase text-slate-300">Step 1: Pure Perceptual / Rhetorical Observation</label>
              <span id="linter-badge" class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">0 Banned Adjectives</span>
            </div>
            <p class="text-xs text-slate-400">
              Describe what is physically/structurally present. Evaluative words (<em>good, bad, beautiful, ugly, strong, weak, boring, polished, impressive, nice</em>) are blocked.
            </p>
            <textarea
              id="obs-textarea"
              oninput="lintObservation()"
              rows="5"
              class="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 text-xs font-mono text-white leading-relaxed"
            >The story opens with three paragraphs describing weather and mahogany furniture before any human action or spoken line occurs. The first hint of tension (the wife's silence at breakfast) appears at paragraph four.</textarea>
            <div id="linter-feedback" class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              ✓ Clean observation. Zero evaluative shortcuts detected.
            </div>
          </div>

          <!-- Step 2: Top-Down Diagnostic Ladder -->
          <div class="lg:col-span-6 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase text-slate-300">Step 2: Locate Highest Unresolved Level (Top-Down Rule)</span>
              <span class="text-[11px] font-mono text-amber-400">Do not fix surface if structure fails</span>
            </div>
            <div class="space-y-1.5 font-mono text-xs">
              <button onclick="selectLadderRung(1, 'Intent — Establish quiet domestic dread')" class="w-full text-left p-2 rounded-lg bg-studio-bg border border-studio-border text-slate-400 hover:text-white">
                1. Intent (Resolved: Establish quiet domestic dread)
              </button>
              <button onclick="selectLadderRung(2, 'Structure — Opening delays human stakes behind 3 paragraphs of weather/furniture')" class="w-full text-left p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-200 font-bold">
                2. Structure / Argument ← [HIGHEST UNRESOLVED LEVEL]
              </button>
              <button onclick="selectLadderRung(6, 'Surface Polish / Word Choice')" class="w-full text-left p-2 rounded-lg bg-studio-bg border border-studio-border text-slate-500">
                6. Surface Execution / Polish (Locked while Rung 2 is unresolved)
              </button>
            </div>
            <div id="ladder-diagnosis-output" class="p-3.5 rounded-xl bg-studio-bg border border-studio-border font-mono text-xs text-cyan-200 leading-relaxed">
              "The highest unresolved level is <strong>Structure</strong>. The decision causing the problem is <strong>placing setting exposition before human stakes</strong>. I would test <strong>moving paragraph 4 (the breakfast silence) to sentence 1</strong> next. I would accept the result if <strong>the reader feels tension before explanation</strong>."
            </div>
          </div>
        </div>
      </div>

      <!-- STUDIO M3: PREMISE, 7-LAYER BRIEF, CONSTRAINT DENSITY & PROVENANCE -->
      <div id="studio-m3" class="hidden bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">Part II (Modules 5, 6, V2, W2, 7) • Brief First, Generation Second</span>
            <h2 class="text-xl font-bold text-white mt-1">Constraint Density Experiment (3 vs 6 vs 10) & Provenance Record</h2>
          </div>
          <div class="flex items-center gap-1.5 font-mono text-xs">
            <button onclick="switchConstraintDensity('open')" id="cd-open" class="px-3 py-1 rounded-lg bg-studio-bg border border-studio-border text-slate-300">Open (3)</button>
            <button onclick="switchConstraintDensity('directed')" id="cd-directed" class="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">Directed (6)</button>
            <button onclick="switchConstraintDensity('severe')" id="cd-severe" class="px-3 py-1 rounded-lg bg-studio-bg border border-studio-border text-slate-300">Severe (10)</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 space-y-4">
            <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-2">
              <div class="text-[11px] font-mono uppercase text-amber-400">Premise (Passed Specificity, Tension, Generativity, Commitment)</div>
              <p class="text-sm text-white font-serif italic">"A portrait of a person who is physically present in an intimate interior but psychologically unavailable."</p>
            </div>
            <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-2">
              <div class="text-[11px] font-mono uppercase text-cyan-400" id="cd-title">Directed Brief (6 Checkable Constraints — The Sweet Spot)</div>
              <p id="cd-constraints-text" class="text-xs font-mono text-slate-200 leading-relaxed">
                1. One figure. 2. Interior. 3. Natural light. 4. Figure is engaged in an activity that has been interrupted. 5. Zero eye contact with viewer. 6. Frame is cropped slightly too tight.
              </p>
              <p id="cd-analysis-text" class="text-xs text-emerald-300 pt-1">
                Analysis: Forces compositional and narrative decisions that the 3-constraint Open Brief leaves to model defaults, without turning the image into an overdetermined puzzle.
              </p>
            </div>
          </div>

          <!-- Module 7: Lightweight Provenance Stamp -->
          <div class="lg:col-span-5 p-5 rounded-xl bg-studio-bg border border-studio-border space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase text-emerald-400">Module 7 • Birth-of-Brief Provenance Record</span>
              <span class="text-[10px] font-mono text-slate-400">Keep It Light</span>
            </div>
            <div class="space-y-2 text-xs font-mono">
              <div class="p-2.5 rounded bg-studio-panel border border-studio-border">
                <span class="text-slate-400">Premise Origin:</span> Commute observation of passengers hiding phone screens at steep angles.
              </div>
              <div class="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                <span class="text-emerald-400 font-bold">Human Contribution:</span> Chose the visibility/concealment tension; rejected 3 topic-level ideas; drew 6 two-minute value thumbnails before generation.
              </div>
              <div class="p-2.5 rounded bg-studio-panel border border-studio-border">
                <span class="text-slate-400">Tool Contribution:</span> Used edge-conditioned generator for lighting/material variations only after composition was locked.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STUDIO M4: PIPELINE CAUSALITY, CONFIDENCE CALIBRATION & TASTE-NARROWNESS DETECTOR -->
      <div id="studio-m4" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">Modules 8 & 9 • Prediction & Calibration Loop</span>
            <span class="text-xs font-mono text-amber-400">"Was I as right as I expected to be?"</span>
          </div>
          <h2 class="text-xl font-bold text-white">Pre-Run Variable Ablation & Confidence Predictor</h2>

          <div class="space-y-3 text-xs font-mono">
            <div>
              <label class="text-slate-400">1. Variable Changed / Broken Deliberately:</label>
              <input id="cal-var" type="text" value="Removed edge-conditioning node from character portrait pipeline" class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="text-slate-400">2. Pre-Run Prediction (Commit BEFORE running test):</label>
              <input id="cal-pred" type="text" value="The overall pose and silhouette will drift dramatically." class="mt-1 w-full bg-studio-bg border border-studio-border rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <div class="flex justify-between">
                <label class="text-slate-400">3. Stated Confidence Level:</label>
                <span id="cal-conf-label" class="text-cyan-300 font-bold">85% Confidence</span>
              </div>
              <input id="cal-conf" type="range" min="10" max="99" value="85" oninput="document.getElementById('cal-conf-label').textContent = this.value + '% Confidence'" class="w-full accent-cyan-400 mt-1" />
            </div>
            <button onclick="runCalibrationSimulation()" class="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition">
              Lock Prediction & Run Ablation Test
            </button>
            <div id="cal-result-box" class="p-3.5 rounded-xl bg-studio-bg border border-studio-border text-slate-300 leading-relaxed">
              <strong>Actual Outcome & Model Revision:</strong> Pose held surprisingly well, but <em>costume consistency</em> broke completely. Edge conditioning was doing more work for costume detail than silhouette. Mental model updated!
            </div>
          </div>
        </div>

        <!-- Right: The Taste-Narrowness Range Check + Physical Sustainability -->
        <div class="lg:col-span-5 bg-studio-panel border border-studio-border rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30">Module 9 • The Narrowing Trap Detector</span>
            <h3 class="text-lg font-bold text-white">Calibration vs. Range Telemetry</h3>
            <p class="text-xs text-slate-400">
              High calibration can mean your internal model improved—or it can mean you stopped trying anything that could surprise you.
            </p>
            <div class="p-4 rounded-xl bg-studio-bg border border-amber-500/40 space-y-2 text-xs font-mono">
              <div class="flex justify-between"><span>Recent Prediction Accuracy:</span><span class="text-emerald-400 font-bold">86% (High)</span></div>
              <div class="flex justify-between"><span>Recent Surprise / Novel Input Rate:</span><span class="text-rose-400 font-bold">14% (Low Range!)</span></div>
              <p class="text-amber-300 pt-1">
                ⚠️ <strong>Range Contraction Alert:</strong> Your accuracy is high because your inputs have narrowed to one essay form. Deliberately attempt a form you do not know how to predict this week.
              </p>
            </div>
          </div>

          <!-- Craft Physical Sustainability Check -->
          <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 text-xs">
            <div class="font-mono text-emerald-300 font-bold">🧘 Physical Sustainability Protocol Active</div>
            <p class="text-slate-300">• 30–45 min tablet/drawing wrist break timer enabled.</p>
            <p class="text-slate-300">• 20-20-20 screen eye-reset active. Remember: pain or numbness is a capacity signal, not weakness.</p>
          </div>
        </div>
      </div>

      <!-- STUDIO M5: TASTE INFRASTRUCTURE, DEMOTIONS & REVERSE-DIRECTION -->
      <div id="studio-m5" class="hidden bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Part IV (Modules 10, V4, W4, 11) • Taste = Preference + Criteria + Reference Class + Mechanism + Purpose</span>
            <h2 class="text-xl font-bold text-white mt-1">Anchor Demotion & Reverse-Direction Lab</h2>
          </div>
          <span class="px-3 py-1 rounded-lg bg-studio-bg border border-studio-border text-xs font-mono text-cyan-300">Human Anchors: 48% (≥40% Required)</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-xl bg-studio-bg border border-studio-border space-y-3">
            <div class="text-xs font-mono uppercase text-amber-400">Reverse-Direction Test (Anti-Dogma Exercise)</div>
            <p class="text-xs text-slate-300">
              <strong>Originally Rejected Output:</strong> A generated portrait that was rejected for being too symmetrical, sterile, and uniform.
            </p>
            <div class="p-3 rounded-lg bg-studio-panel border border-studio-border text-xs font-mono text-emerald-300">
              <strong>New Brief Where It Succeeds:</strong> "Depict a public spokesperson attempting to project total institutional calm while internally fracturing. Symmetry must feel oppressive and airless." → <em>The defect becomes the exact mechanism of purpose!</em>
            </div>
          </div>

          <div class="p-5 rounded-xl bg-studio-bg border border-studio-border space-y-3">
            <div class="text-xs font-mono uppercase text-rose-400">Anchor Demotion Log ("Demotion Is Progress")</div>
            <p class="text-xs text-slate-300">
              <strong>Week 7 Anchor Reconsidered in Week 9:</strong> Off-center street portrait initially admired as "dynamic."
            </p>
            <div class="p-3 rounded-lg bg-studio-panel border border-studio-border text-xs font-mono text-amber-200">
              <strong>Demotion Reason:</strong> Confused "unusual placement" with "meaningful mechanism." The subject could sit anywhere in the frame without changing the reading. Demoted from Accepted to Study Archive.
            </div>
          </div>
        </div>
      </div>

      <!-- STUDIO M6: PRODUCTION DIRECTION, STAKEHOLDER TRIAGE, COLLABORATION & REFUSAL -->
      <div id="studio-m6" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-6 bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-4">
          <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">Modules 12 & 13 • Revision vs. Re-Brief Diagnostic</span>
          <h2 class="text-xl font-bold text-white">Stakeholder Feedback Translator</h2>
          <div class="p-3.5 rounded-xl bg-studio-bg border border-studio-border text-xs font-mono space-y-1.5">
            <div class="text-slate-400">Raw Client Feedback:</div>
            <div class="text-white">"Our new coffee shop identity feels too corporate. Soften the edges and make the logo bigger."</div>
          </div>
          <div class="space-y-2 text-xs">
            <div class="font-mono text-slate-400">Choose Directorial Response:</div>
            <button onclick="selectDirectionResponse('patch')" class="w-full text-left p-3 rounded-xl bg-studio-bg hover:bg-studio-card border border-studio-border font-mono">
              A) Patch Execution: Soften the edges and enlarge logo by 25%.
            </button>
            <button onclick="selectDirectionResponse('rebrief')" class="w-full text-left p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 font-mono">
              B) Re-Brief (Strong Director): Diagnose that "warm, inviting, artisanal" describes all 6 rival shops on the block. Re-brief around differentiation rather than endless surface patching.
            </button>
          </div>
          <div id="direction-feedback-box" class="p-3 rounded-lg bg-studio-bg border border-studio-border text-xs font-mono text-cyan-300">
            A weak director patches a broken premise indefinitely. A strong director names when the brief is solving the wrong problem.
          </div>
        </div>

        <!-- Right: Module 14 Collaborative Decision Rights + Appendix F Refusal -->
        <div class="lg:col-span-6 bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-4">
          <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">Module 14 & Appendix F • Collaboration & Refusal</span>
          <h3 class="text-lg font-bold text-white">Decision Rights, Economics & Refusal Protocol</h3>
          <div class="p-3.5 rounded-xl bg-studio-bg border border-studio-border text-xs font-mono space-y-2">
            <div class="text-amber-300 font-bold">Collaborative Decision Rights & Economics Pre-Check:</div>
            <div>• <strong>Visual Direction:</strong> Partner A owns decision; Partner B consults (veto on ethics only).</div>
            <div>• <strong>Writing Voice:</strong> Partner B owns decision; Partner A consults (veto on factual accuracy).</div>
            <div>• <strong>Pipeline IP & Dissolution:</strong> Shared workflow remains usable by both upon exit; 50/50 net revenue split agreed in writing before Deliverable 1.</div>
          </div>
          <div class="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs font-mono space-y-1.5">
            <div class="text-rose-300 font-bold">5-Mode Refusal Active (Ethical | Positional | Technical | Intentional | Slop):</div>
            <p class="text-slate-300">"I will not mimic [Living Artist]'s signature surface style (Intentional & Ethical Refusal). I will instead extract the underlying lighting principle (high-contrast isolation) and build an authored solution."</p>
          </div>
        </div>
      </div>

      <!-- STUDIO M7: AUTHORSHIP POSITION GAP, CROSS-MEDIUM SYNTHESIS & BLANK-SHEET TEST -->
      <div id="studio-m7" class="hidden bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">Part VI & Month 9 Capstone • Zero Scaffolding</span>
            <h2 class="text-xl font-bold text-white mt-1">Position Gap Analyzer, Cross-Medium Synthesis & The Blank-Sheet Test</h2>
          </div>
          <span class="text-xs font-mono text-rose-300">Ladders: HIDDEN • Templates: HIDDEN • Problem: SELF-ORIGINATED</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-2">
            <div class="text-xs font-mono uppercase text-cyan-400">Module 15 • 10-Piece Blind Position Gap</div>
            <p class="text-xs text-slate-300"><strong>Written Position:</strong> "The gap between public expertise and private doubt."</p>
            <p class="text-xs text-emerald-300"><strong>Inferred from 10 Untitled Works:</strong> "Thresholds—the second before an event starts or after it ends." → <em>The gap reveals your true recurring commitment!</em></p>
          </div>
          <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-2">
            <div class="text-xs font-mono uppercase text-purple-400">Module 17 • Cross-Medium Removal Test</div>
            <p class="text-xs text-slate-300"><strong>Image Role:</strong> Warm, cluttered room full of belonging.</p>
            <p class="text-xs text-slate-300"><strong>Text Role:</strong> Interior voice feeling nothing.</p>
            <p class="text-xs text-amber-300"><strong>Synthesis Proof:</strong> Removing either destroys the argument. Neither is a caption or illustration.</p>
          </div>
          <div class="p-4 rounded-xl bg-studio-bg border border-amber-500/40 space-y-2">
            <div class="text-xs font-mono uppercase text-amber-400">The 14-Step Blank-Sheet Capstone</div>
            <p class="text-xs text-slate-300">Includes the final section: <strong>"How I Decided What to Make"</strong>—reconstructing the project from unprompted observation and positionality check through delivery.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- VIEW 3: TWO-AXIS ASSESSMENT MATRIX & ANTI-DECAY LOGBOOK           -->
    <!-- ================================================================= -->
    <section id="view-assessment" class="hidden space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Outcome Quality vs Decision Quality 2x2 Quadrant Simulator (7 cols) -->
        <div class="lg:col-span-7 bg-studio-panel border border-studio-border rounded-2xl p-6 space-y-5">
          <div>
            <span class="text-[11px] font-mono uppercase text-amber-400">Assessment Framework • Prevents Rationalisation & Anti-Intellectualism</span>
            <h2 class="text-xl font-bold text-white mt-1">Two-Axis Assessment: Outcome Quality × Decision Quality</h2>
            <p class="text-xs text-slate-400 mt-1">
              "A correct decision process does not excuse a consistently ineffective result. An excellent result does not prove an excellent process."
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-3.5 rounded-xl bg-studio-bg border border-studio-border">
              <div class="flex justify-between text-xs font-mono">
                <span>Outcome Quality (Artifact Fitness):</span>
                <strong id="outcome-score-label" class="text-cyan-300">3 (Functional)</strong>
              </div>
              <input id="outcome-slider" type="range" min="1" max="4" value="3" oninput="updateQuadrant()" class="w-full accent-cyan-400 mt-2" />
            </div>
            <div class="p-3.5 rounded-xl bg-studio-bg border border-studio-border">
              <div class="flex justify-between text-xs font-mono">
                <span>Decision Quality (Reasoning Loop):</span>
                <strong id="decision-score-label" class="text-emerald-300">4 (Transferable)</strong>
              </div>
              <input id="decision-slider" type="range" min="1" max="4" value="4" oninput="updateQuadrant()" class="w-full accent-emerald-400 mt-2" />
            </div>
          </div>

          <!-- 2x2 Quadrant Grid -->
          <div class="grid grid-cols-2 gap-3 font-mono text-xs">
            <div id="quad-learning" class="p-4 rounded-xl border border-studio-border bg-studio-bg space-y-1">
              <div class="font-bold text-cyan-300">Strong Reasoning + Weak Outcome</div>
              <div class="text-white font-sans font-semibold">LEARNING IN PROGRESS</div>
              <p class="text-[11px] text-slate-400 font-sans">Process is sound, but craft or execution lags. Normal in early parts.</p>
            </div>
            <div id="quad-mastery" class="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-950/30 space-y-1">
              <div class="font-bold text-emerald-300">Strong Reasoning + Strong Outcome</div>
              <div class="text-white font-sans font-semibold">★ MASTERY (Target State)</div>
              <p class="text-[11px] text-slate-300 font-sans">Sound, reproducible process paired with an effective artifact.</p>
            </div>
            <div id="quad-failure" class="p-4 rounded-xl border border-studio-border bg-studio-bg space-y-1">
              <div class="font-bold text-rose-400">Weak Reasoning + Weak Outcome</div>
              <div class="text-white font-sans font-semibold">FAILURE</div>
              <p class="text-[11px] text-slate-400 font-sans">Upstream problem-finding, premise, or specification needs change.</p>
            </div>
            <div id="quad-lucky" class="p-4 rounded-xl border border-studio-border bg-studio-bg space-y-1">
              <div class="font-bold text-amber-300">Weak Reasoning + Strong Outcome</div>
              <div class="text-white font-sans font-semibold">LUCKY / UNSTABLE SUCCESS</div>
              <p class="text-[11px] text-slate-400 font-sans">Treat with suspicion. Cannot be reliably reproduced when context changes.</p>
            </div>
          </div>
        </div>

        <!-- Right: Log Integrity Auditor & Standing Inquiry (5 cols) -->
        <div class="lg:col-span-5 bg-studio-panel border border-studio-border rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase text-rose-400">Failure Type 4 • Log Decay Auditor</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">3 Core Logs Active</span>
            </div>
            <h3 class="text-lg font-bold text-white">Anti-Ritualisation & Log Integrity Check</h3>
            <p class="text-xs text-slate-400">
              Automatically scans your last 4 weeks of logs for hollow defaults (e.g., typing "70% confidence" every time or omitting rejected alternatives).
            </p>
            <div class="p-3.5 rounded-xl bg-studio-bg border border-studio-border space-y-2 text-xs font-mono">
              <div class="text-emerald-300">✓ Decision Log: Recording genuine uncertainties & rejected alternatives.</div>
              <div class="text-amber-300">⚠️ Calibration Log Notice: Last 3 entries used "75%" confidence. Rotate field next session!</div>
            </div>

            <!-- The Standing Inquiry -->
            <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-2">
              <div class="text-[11px] font-mono uppercase text-amber-400">Weekly Standing Inquiry (1 Sentence Each)</div>
              <p class="text-xs text-slate-300">1. <em>What did I choose this week that I would choose again if nobody required me to choose it?</em></p>
              <p class="text-xs text-slate-300">2. <em>What skill did I deliberately train this week, and what evidence shows it changed?</em></p>
              <p class="text-xs text-slate-300">3. <em>What problem did I notice this week that nobody asked me to pursue?</em></p>
            </div>
          </div>

          <button onclick="showToast('Exported 00-problem/ through 09-reflection/ Markdown Archive!')" class="w-full py-2.5 rounded-xl bg-studio-card hover:bg-slate-800 border border-studio-border text-xs font-mono text-amber-300 transition">
            ↓ Export Appendix L Project Archive (00-problem to 09-reflection)
          </button>
        </div>
      </div>
    </section>

  </main>

  <!-- MODAL 1: THE 4 DIFFERENTIATED FAILURE PROTOCOLS -->
  <div id="failure-modal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-studio-panel border border-studio-border rounded-2xl max-w-2xl w-full p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-mono uppercase text-rose-400">Differentiated Failure Protocols</span>
          <h3 class="text-xl font-bold text-white">Diagnose What Kind of Failure Is Happening</h3>
        </div>
        <button onclick="closeModal('failure-modal')" class="text-slate-400 hover:text-white text-sm font-mono">✕ Close</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-1.5">
          <div class="font-mono font-bold text-cyan-300">1. Output Failure (The work fails)</div>
          <p class="text-slate-300">Locate highest unresolved level on the ladder, identify the decision that caused it, and run the smallest meaningful experiment.</p>
        </div>
        <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-1.5">
          <div class="font-mono font-bold text-amber-300">2. Habit Failure (Skipped sessions)</div>
          <p class="text-slate-300">Not a moral failing—an environment or intensity mismatch. Shrink commitment to <strong>one 15-minute session</strong> or switch to Distributed Path (Appendix O).</p>
        </div>
        <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-1.5">
          <div class="font-mono font-bold text-purple-300">3. Motivational Failure (No longer care)</div>
          <p class="text-slate-300">Signal of borrowed ambition. <strong>Stop producing for 1 week.</strong> Do Non-Instrumental Attention only and review your Standing Inquiry for drift.</p>
        </div>
        <div class="p-4 rounded-xl bg-studio-bg border border-studio-border space-y-1.5">
          <div class="font-mono font-bold text-rose-300">4. Log Decay (Hollow checkbox logs)</div>
          <p class="text-slate-300">The interior of the practice is hollowing out. Audit the last 4 weeks, rotate 1 field to force specificity, or retire an outgrown log.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL 2: "WHEN TO STOP" HEMINGWAY GATE -->
  <div id="stop-modal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-studio-panel border border-studio-border rounded-2xl max-w-xl w-full p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-mono uppercase text-amber-400">Stopping, Finishing & Abandoning Protocol</span>
          <h3 class="text-xl font-bold text-white">Know When to Stop</h3>
        </div>
        <button onclick="closeModal('stop-modal')" class="text-slate-400 hover:text-white text-sm font-mono">✕ Close</button>
      </div>
      <div class="space-y-3 text-xs">
        <div class="p-3.5 rounded-xl bg-studio-bg border border-emerald-500/30 space-y-1">
          <div class="font-mono font-bold text-emerald-300">1. Stop for the Day (The Hemingway Rule)</div>
          <p class="text-slate-300">Stop while you still know what happens next—never when you are lost, tired, or making changes without knowing why.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-studio-bg border border-cyan-500/30 space-y-1">
          <div class="font-mono font-bold text-cyan-300">2. When a Work Is Done</div>
          <p class="text-slate-300">Satisfies acceptance criteria, further revision won't meaningfully improve it, and you can defend it without explaining what it is trying to do.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-studio-bg border border-amber-500/30 space-y-1">
          <div class="font-mono font-bold text-amber-300">3. Principled Abandonment (Not a Failure)</div>
          <p class="text-slate-300">Abandon when you have re-briefed more than twice and it still isn't right, or the problem wasn't worth pursuing. Record the lesson and move on.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="fixed bottom-5 right-5 z-50 hidden px-4 py-3 rounded-xl bg-studio-panel border border-amber-500/50 text-xs font-mono text-amber-300 shadow-2xl">
    <span id="toast-text">Saved!</span>
  </div>

  <script>
    // --- COURSE DATA & STATE ---
    const weeklyLoopSteps = [
      { step: '1. Read', time: '20–30m', desc: 'One core concept only', target: 'm2' },
      { step: '2. Practise', time: '60–90m', desc: 'Isolated micro-skill (70-80%)', target: 'm0' },
      { step: '3. Study', time: '60m', desc: 'Non-AI visual/writing craft', target: 'm2' },
      { step: '4. Make', time: '2–3 hrs', desc: 'Project & pipeline build', target: 'm4' },
      { step: '5. Diagnose', time: '30m', desc: 'Top-down against brief', target: 'm2' },
      { step: '6. Log', time: '≤10m Cap', desc: 'Practice + Problem + Decision', target: 'm1' },
      { step: '7. Transfer', time: '30–60m', desc: 'One scaffold removed', target: 'm7' },
      { step: '8. Play', time: '30–60m', desc: 'Unstructured • Zero eval', target: 'm0' }
    ];

    const scaffoldingStages = {
      1: {
        label: 'Part I (Wks 1–2): FIND & OBSERVE',
        supplied: ['Exercise', 'Diagnostic Ladder', 'Template', 'References'],
        removed: ['None (Full Training Wheels)'],
        layer: 'Layer 1 — Capability ("Can I do the work?")',
        desc: 'Learn Problem-Finding, Positionality, Non-Instrumental Attention, and Top-Down Diagnosis with visible ladders.'
      },
      2: {
        label: 'Part II (Wks 3–4): FORMULATE',
        supplied: ['Exercise', '7-Layer Brief Template'],
        removed: ['Diagnostic Ladder'],
        layer: 'Layer 1 — Capability',
        desc: 'Move from found problem to Premise, 7-Layer Brief, 2-min Thumbnails, Voice Mechanisms, and Provenance.'
      },
      3: {
        label: 'Part III (Wks 5–6): BUILD',
        supplied: ['Exercise'],
        removed: ['Diagnostic Ladder', 'Brief Template'],
        layer: 'Layer 1 — Capability',
        desc: 'Causal pipelines, Pre-run Confidence Calibration, Range vs. Narrowness checks, and Manual Craft Interventions.'
      },
      4: {
        label: 'Part IV (Wks 7–8): CALIBRATE',
        supplied: ['Broad Category'],
        removed: ['Exercise', 'Template', 'Ladder'],
        layer: 'Layer 1 → Layer 2 Transition',
        desc: 'Taste as Infrastructure (Preference + Criteria + Reference Class + Mechanism + Purpose), Blind Curation, Demotions.'
      },
      5: {
        label: 'Part V (Wks 9–10): DIRECT',
        supplied: ['Stakeholder Situation'],
        removed: ['Category', 'Exercise', 'Template', 'Ladder'],
        layer: 'Layer 2 — Independence ("Can I determine what work needs to be done?")',
        desc: 'Revision vs. Re-Brief, Scope protection, Collaborative Decision Rights & Economics, and 5-Mode Refusal.'
      },
      6: {
        label: 'Part VI (Wks 11–12): AUTHOR & TRANSFER',
        supplied: ['Practical Conditions Only (Time, Resources)'],
        removed: ['Situation', 'Category', 'Exercise', 'Template', 'Ladder'],
        layer: 'Layer 2 — Independence (The Blank-Sheet Test)',
        desc: '10-Piece Blind Position Gap, Cross-Medium Synthesis Removal Test, Public Process, and 14-Step Blank-Sheet Capstone.'
      },
      7: {
        label: 'Months 4–6: Independent Practice (Brief & Premise Ownership)',
        supplied: ['External Brief (M4) → Category (M5) → Theme (M6)'],
        removed: ['Instructor / Course Schedule'],
        layer: 'Layer 2 → Layer 3 Transition',
        desc: 'Monthly Problem-Finding Sessions and Monthly 60-minute Unassigned Beginnings keep the upstream faculty alive.'
      },
      8: {
        label: 'Month 7: Real-World Problem Discovery',
        supplied: ['Ambiguous Stakeholder Environment'],
        removed: ['Theme', 'Stated Brief Accuracy'],
        layer: 'Layer 3 — Agency',
        desc: 'The stated problem is not the actual problem. Diagnose the situation and re-brief before building.'
      },
      9: {
        label: 'Months 8–9: Self-Originated & Blank-Sheet Capstone',
        supplied: ['Nothing (Real-World Conditions Only)'],
        removed: ['All External Input — Even the Problem Itself'],
        layer: 'Layer 3 — Agency ("Can I decide what is worth doing, and take responsibility for it?")',
        desc: 'Culminates in "How I Decided What to Make"—proving you authored the problem, not only the solution.'
      }
    };

    const curriculumCards = [
      { code: 'MODULE 0 + WK 0', title: 'Deliberate Practice, Play & Baseline Contract', part: 'Onboarding', studio: 'm0', desc: '70–80% rep zone, Non-instrumental attention, Play, 12-competency baseline, Intensity Path (12w/24w/48w), Calibration Network.' },
      { code: 'PART I (WKS 1–2)', title: 'FIND & OBSERVE (Modules 1–4, V1, W1)', part: 'Layer 1', studio: 'm1', desc: 'The Judgment Gap, Problem-Finding + Positionality Compass, Non-Instrumental Attention, Zero-Adjective Linter & Ladders.' },
      { code: 'PART II (WKS 3–4)', title: 'FORMULATE (Modules 5–7, V2, W2)', part: 'Layer 1', studio: 'm3', desc: 'Premise & Rejection Logic, 7-Layer Brief, 3/6/10 Constraint Density, 2-min Thumbnails, Voice Mechanisms, Provenance.' },
      { code: 'PART III (WKS 5–6)', title: 'BUILD (Modules 8–9, V3, W3 + Craft)', part: 'Layer 1', studio: 'm4', desc: '9-Layer Causal Pipelines, Pre-run Confidence Calibration, Range vs. Narrowness Trap, Deviation as Craft, Ergonomics.' },
      { code: 'PART IV (WKS 7–8)', title: 'CALIBRATE (Modules 10–11, V4, W4)', part: 'Layer 1→2', studio: 'm5', desc: '5-Part Taste Model, ≥40% Human Anchors, Anchor Demotions, Slop Detection, 20-Item Blind Ranking, Reverse-Direction.' },
      { code: 'PART V (WKS 9–10)', title: 'DIRECT (Modules 12–14, V5, W5)', part: 'Layer 2', studio: 'm6', desc: 'Revision vs. Re-Brief Fork, 1-Page Scope, Stakeholder Triage, Collaborative Decision Rights & Economics, 5 Refusal Modes.' },
      { code: 'PART VI (WKS 11–12)', title: 'AUTHOR & TRANSFER (Modules 15–18, V6, W6)', part: 'Layer 2', studio: 'm7', desc: 'Private vs. Public Position, 10-Piece Blind Gap Test, Cross-Medium Synthesis Removal Test, Blank-Sheet Capstone.' },
      { code: 'MONTHS 4–9', title: 'INDEPENDENT PRACTICE & MODULE 19', part: 'Layer 3 Agency', studio: 'm7', desc: 'Monthly Problem-Finding, 60m Unassigned Beginning, Teaching the Framework (Silence Tolerance), "How I Decided What to Make".' }
    ];

    let showDeepening = false;
    let timerInterval = null;
    let remainingSeconds = 600;

    function renderWeeklyLoop() {
      const container = document.getElementById('weekly-loop-cards');
      container.innerHTML = weeklyLoopSteps.map(s => `
        <button onclick="switchMainTab('studios'); selectStudio('${s.target}')" class="p-3 rounded-xl bg-studio-card hover:bg-slate-800 border border-studio-border hover:border-amber-500/40 text-left transition flex flex-col justify-between space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-white">${s.step}</span>
            <span class="text-[10px] font-mono text-amber-400">${s.time}</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-snug">${s.desc}</p>
        </button>
      `).join('');
    }

    function renderCurriculumGrid() {
      const grid = document.getElementById('curriculum-grid');
      grid.innerHTML = curriculumCards.map(c => `
        <div class="bg-studio-panel border border-studio-border hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-mono text-amber-400">${c.code}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-studio-card text-cyan-300 border border-studio-border">${c.part}</span>
            </div>
            <h3 class="text-base font-bold text-white leading-snug">${c.title}</h3>
            <p class="text-xs text-slate-400 leading-relaxed">${c.desc}</p>
          </div>
          <button onclick="switchMainTab('studios'); selectStudio('${c.studio}')" class="w-full py-2 rounded-xl bg-studio-card hover:bg-amber-500/20 border border-studio-border hover:border-amber-500/40 text-xs font-mono text-amber-300 transition">
            Open Studio →
          </button>
        </div>
      `).join('');
    }

    function updateScaffoldingStage(val) {
      const stage = scaffoldingStages[val];
      document.getElementById('scaffold-stage-label').textContent = stage.label;
      document.getElementById('header-scaffolding-badge').textContent = stage.label.split(':')[0];
      document.getElementById('scaffold-supplied').innerHTML = stage.supplied.map(item =>
        `<span class="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">${item}</span>`
      ).join('');
      document.getElementById('scaffold-removed').innerHTML = stage.removed.map(item =>
        `<span class="px-2 py-1 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">${item}</span>`
      ).join('');
      document.getElementById('scaffold-layer').textContent = stage.layer;
      document.getElementById('scaffold-desc').textContent = stage.desc;
    }

    function switchMainTab(tab) {
      ['loop', 'studios', 'assessment'].forEach(t => {
        document.getElementById(`view-${t}`).classList.add('hidden');
        document.getElementById(`tab-${t}`).className = 'px-3 py-1.5 rounded-lg font-medium transition text-slate-400 hover:text-white';
      });
      document.getElementById(`view-${tab}`).classList.remove('hidden');
      document.getElementById(`tab-${tab}`).className = 'px-3 py-1.5 rounded-lg font-medium transition bg-amber-500/20 text-amber-300 border border-amber-500/30';
    }

    function selectStudio(id) {
      ['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'].forEach(s => {
        document.getElementById(`studio-${s}`).classList.add('hidden');
        document.getElementById(`btn-studio-${s}`).className = 'px-2.5 py-1.5 rounded-lg text-xs font-mono transition bg-studio-bg text-slate-400 hover:text-white';
      });
      document.getElementById(`studio-${id}`).classList.remove('hidden');
      document.getElementById(`btn-studio-${id}`).className = 'px-2.5 py-1.5 rounded-lg text-xs font-mono transition bg-amber-500/20 text-amber-300 border border-amber-500/40';
    }

    // --- STUDIO INTERACTIONS ---
    function evaluatePracticeReps(val) {
      const label = document.getElementById('m0-rep-val');
      const badge = document.getElementById('m0-zone-badge');
      const advice = document.getElementById('m0-rep-advice');
      label.textContent = `${val} / 10 (${val * 10}%)`;
      if (val >= 9) {
        badge.textContent = '⚠️ Too Easy (>80%)';
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30';
        advice.textContent = 'You succeeded 9–10/10 reps. Increase difficulty or remove a scaffold next session.';
      } else if (val <= 4) {
        badge.textContent = '⚠️ Too Hard (<50%)';
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30';
        advice.textContent = 'Failing 6+ reps out of 10. Reduce difficulty or isolate a smaller sub-skill.';
      } else {
        badge.textContent = '✓ Productive 70–80% Zone';
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
        advice.textContent = 'Optimal zone: enough failure to expose errors, enough success to reinforce mechanism.';
      }
    }

    function saveOneLiner(type) {
      const input = document.getElementById(type === 'non-inst' ? 'non-inst-input' : 'play-input');
      if (!input.value.trim()) return;
      const feed = document.getElementById('one-liner-feed');
      const tag = type === 'non-inst' ? '[Attention]' : '[Play]';
      const div = document.createElement('div');
      div.textContent = `• ${tag} "${input.value.trim()}"`;
      feed.appendChild(div);
      input.value = '';
      showToast('1-Line entry saved without analysis.');
    }

    function setPositionality(mode) {
      ['From', 'With', 'For', 'About', 'Over'].forEach(m => {
        document.getElementById(`pos-${m}`).className = 'p-2 rounded-lg bg-studio-bg border border-studio-border hover:border-emerald-400';
      });
      document.getElementById(`pos-${mode}`).className = 'p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold';
      const descriptions = {
        From: '<strong>Mode: FROM (Inside the lived experience).</strong> High standing. Own your perspective directly.',
        With: '<strong>Mode: WITH (In dialogue with those inside).</strong> Requires explicit co-authorship, collaboration, and consent.',
        For: '<strong>Mode: FOR (Acting in service).</strong> Appropriate for commissions, advocacy, or explicit requests.',
        About: '<strong>Mode: ABOUT (Observing from outside).</strong> Appropriate for research and criticism—requires care and acknowledging distance.',
        Over: '<strong>Mode: OVER (Speaking as if inside when you are not).</strong> ⚠️ Never appropriate as a default. Trigger Positional Refusal or reframe.'
      };
      document.getElementById('positionality-feedback').innerHTML = descriptions[mode];
    }

    function lintObservation() {
      const text = document.getElementById('obs-textarea').value;
      const banned = /\b(good|bad|beautiful|ugly|impressive|weak|strong|polished|boring|nice|cool|awesome|terrible)\b/gi;
      const matches = text.match(banned) || [];
      const badge = document.getElementById('linter-badge');
      const feedback = document.getElementById('linter-feedback');

      if (matches.length > 0) {
        badge.textContent = `${matches.length} Banned Adjective(s)`;
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300';
        feedback.className = 'p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-200';
        feedback.innerHTML = `✗ Evaluative shortcut detected: <strong>"${matches.join(', ')}"</strong>. Replace judgment adjectives with observable structural facts before diagnosing.`;
      } else {
        badge.textContent = '0 Banned Adjectives';
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300';
        feedback.className = 'p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300';
        feedback.innerHTML = '✓ Clean observation. Zero evaluative shortcuts detected.';
      }
    }

    function selectLadderRung(num, desc) {
      const out = document.getElementById('ladder-diagnosis-output');
      if (num === 6) {
        out.innerHTML = `<span class="text-rose-300">⚠️ Diagnostic Rule Violation: Do not optimise Rung 6 (Surface Polish) while Rung 2 (Structure) remains unresolved!</span>`;
      } else {
        out.innerHTML = `Selected Rung ${num}: <strong>${desc}</strong>. Propose the smallest high-level experiment that tests this level first.`;
      }
    }

    function runFiveSecondFlash() {
      const box = document.getElementById('flash-test-box');
      const stage = document.getElementById('flash-visual-stage');
      const timerLabel = document.getElementById('flash-timer-label');
      const promptText = document.getElementById('flash-prompt-text');
      box.classList.remove('hidden');
      stage.classList.remove('opacity-0');
      timerLabel.textContent = 'Showing Reference: 5.0s';
      promptText.textContent = 'Memorize the 3–5 major value masses, focal entry point (bright sky opening), and diagonal axis...';

      setTimeout(() => {
        stage.classList.add('opacity-0');
        timerLabel.textContent = 'Reference Hidden — Reconstruct from Memory!';
        promptText.textContent = 'Now sketch or state the dominant mass arrangement, focal point, and where your memory compressed the space.';
      }, 5000);
    }

    function switchConstraintDensity(mode) {
      ['open', 'directed', 'severe'].forEach(m => {
        document.getElementById(`cd-${m}`).className = 'px-3 py-1 rounded-lg bg-studio-bg border border-studio-border text-slate-300';
      });
      document.getElementById(`cd-${mode}`).className = 'px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300';

      const data = {
        open: {
          title: 'Open Brief (3 Constraints — High Default Drift)',
          constraints: '1. One figure. 2. Interior. 3. Natural light.',
          analysis: 'Analysis: Leaves almost every compositional and psychological decision to the model\'s dataset defaults.'
        },
        directed: {
          title: 'Directed Brief (6 Checkable Constraints — The Sweet Spot)',
          constraints: '1. One figure. 2. Interior. 3. Natural light. 4. Activity interrupted. 5. No eye contact. 6. Frame slightly too tight.',
          analysis: 'Analysis: Forces meaningful formal decisions while leaving room for discovery.'
        },
        severe: {
          title: 'Severe Brief (10 Constraints — Risk of Overdetermination)',
          constraints: '1. One figure. 2. Interior. 3. Natural light. 4. Interrupted activity. 5. No eye contact. 6. Tight frame. 7. Hands visible. 8. Implied 2nd presence. 9. Two hues max. 10. Brightest area is NOT the figure.',
          analysis: 'Analysis: Produces striking formal tension, but risks turning the image into a visual puzzle if not carefully judged.'
        }
      };
      document.getElementById('cd-title').textContent = data[mode].title;
      document.getElementById('cd-constraints-text').textContent = data[mode].constraints;
      document.getElementById('cd-analysis-text').textContent = data[mode].analysis;
    }

    function runCalibrationSimulation() {
      const conf = document.getElementById('cal-conf').value;
      showToast(`Prediction locked at ${conf}% confidence! Compare against actual outcome.`);
    }

    function selectDirectionResponse(choice) {
      const box = document.getElementById('direction-feedback-box');
      if (choice === 'rebrief') {
        box.className = 'p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono text-emerald-200';
        box.textContent = '✓ Correct: "Warm, inviting, artisanal" is an insufficient brief when 6 competitors share it. Re-briefing around differentiation solves the actual problem.';
      } else {
        box.className = 'p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs font-mono text-rose-200';
        box.textContent = '✗ Weak Direction: Enlarging the logo or softening edges patches execution while the underlying brief remains generic.';
      }
    }

    function updateQuadrant() {
      const o = parseInt(document.getElementById('outcome-slider').value, 10);
      const d = parseInt(document.getElementById('decision-slider').value, 10);
      const labels = { 1: '1 (Not Yet)', 2: '2 (Emerging)', 3: '3 (Functional)', 4: '4 (Transferable)' };
      document.getElementById('outcome-score-label').textContent = labels[o];
      document.getElementById('decision-score-label').textContent = labels[d];

      ['learning', 'mastery', 'failure', 'lucky'].forEach(q => {
        document.getElementById(`quad-${q}`).className = 'p-4 rounded-xl border border-studio-border bg-studio-bg space-y-1 opacity-50';
      });

      const active = o >= 3 && d >= 3 ? 'mastery' : o < 3 && d >= 3 ? 'learning' : o >= 3 && d < 3 ? 'lucky' : 'failure';
      document.getElementById(`quad-${active}`).className = 'p-4 rounded-xl border-2 border-amber-400 bg-studio-card space-y-1';
    }

    function changeIntensity(mode) {
      const map = {
        full: 'Active Path: 12-Week Intensive (18–25 hrs/wk Core)',
        extended: 'Active Path: 24-Week Extended Intensive (12–18 hrs/wk)',
        distributed: 'Active Path: 48-Week Distributed Practice (6–10 hrs/wk)',
        maintenance: 'Active Path: Maintenance Mode (~4 hrs/wk • Progression Paused)'
      };
      document.getElementById('intensity-summary-pill').textContent = map[mode];
      showToast(map[mode]);
    }

    function toggleDeepening() {
      showDeepening = !showDeepening;
      const btn = document.getElementById('deepening-toggle-btn');
      btn.textContent = showDeepening ? 'Tier: CORE + DEEPENING ACTIVE' : 'Tier: CORE ONLY (Click to +Deepening)';
      btn.className = showDeepening
        ? 'px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-mono text-amber-300 transition'
        : 'px-3 py-2 rounded-xl bg-studio-card border border-studio-border text-xs font-mono text-slate-300 hover:text-white transition';
    }

    function toggleLogTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        showToast('10-Minute Log Timer paused.');
        return;
      }
      showToast('10-Minute Log Cap Timer started! Keep logs light.');
      timerInterval = setInterval(() => {
        remainingSeconds = Math.max(0, remainingSeconds - 1);
        const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
        const secs = String(remainingSeconds % 60).padStart(2, '0');
        document.getElementById('log-timer-display').textContent = `${mins}:${secs}`;
        if (remainingSeconds === 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          showToast('⏰ 10 Minutes Up! The document is not the practice—go make something.');
        }
      }, 1000);
    }

    function openModal(id) {
      document.getElementById(id).classList.remove('hidden');
    }

    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-text').textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 3200);
    }

    window.onload = function () {
      renderWeeklyLoop();
      renderCurriculumGrid();
      updateScaffoldingStage(1);
      selectStudio('m2');
      updateQuadrant();
    };
  </script>
</body>
</html>