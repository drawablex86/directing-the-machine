const fs = require('fs');

const dtm = fs.readFileSync('Directing the Machine.md', 'utf8');

function extractHeadingSection(headingPattern) {
  const match = dtm.match(headingPattern);
  if (!match) return '';
  const start = match.index;
  const isH1 = match[0].startsWith('# ');
  // Look for next heading of same or higher level
  const nextRegex = isH1 ? /^# [^\n]+$/gm : /^#{1,2} [^\n]+$/gm;
  nextRegex.lastIndex = start + match[0].length;
  const nextMatch = nextRegex.exec(dtm);
  const end = nextMatch ? nextMatch.index : dtm.length;
  return dtm.slice(start, end).trim();
}

function getProjectSpec(num) {
  const fname = 'Project ' + num + ' — ' + (
    num === 7 ? 'Visual Campaign (Month 4).md' :
    num === 8 ? 'Writing Voice Guide (Month 5).md' :
    num === 9 ? 'Hybrid Visual Essay (Month 6).md' :
    num === 10 ? 'Character Design System (Month 7).md' :
    num === 11 ? 'Editorial Series (Month 8).md' :
    'Capstone (Month 9).md'
  );
  if (fs.existsSync(fname)) {
    return fs.readFileSync(fname, 'utf8').trim();
  }
  return '';
}

// Master Catalog of all 50+ Curriculum Modules, Foundational Essays, and Project Specs
const moduleCatalog = [
  // --- ORIENTATION & FOUNDATIONS ---
  {
    code: 'Module 0',
    title: 'How to Practice This Course',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'The deliberate practice contract, isolated micro-drills in the 70–80% difficulty zone, and immediate feedback loops.',
    keyMentalModel: 'Deliberate Practice vs. Mere Production: Practice isolates a micro-skill where you fail 2–3 reps out of 10. Mere production defaults to what you already know how to do.',
    targetModalityId: 'm0',
    tags: ['deliberate-practice', 'micro-skills', 'baseline', 'habits', 'scaffolding'],
    lookupPattern: /^# Module 0 — How to Practice This Course/m,
    theoryExpansion: `
> [!important] The Core Discipline: Deliberate Practice vs. Mere Production
> Most creative work is unreflective production: you open a tool, start creating, solve problems as they arise, and finish when time runs out or it looks acceptable. 
> 
> **Deliberate practice is structurally different:**
> 1. It isolates an explicit micro-skill (e.g., seeing major value masses in 5 seconds; writing a claim without adjectives).
> 2. It sets an explicit criterion for success *before* starting.
> 3. It operates in the **70–80% success zone** — if you succeed 10 out of 10 times, the drill is too easy; if you fail more than 3 times out of 10, the difficulty is overwhelming your feedback channel.
> 4. It provides immediate, verifiable diagnostic feedback.
>
> If you only make full projects, you never isolate your bottlenecks. You merely practice your existing habits.

### The 3 Cardinal Rules of Directorial Practice:
1. **Never practice at 100% pass rate**: If you are not failing 2–3 reps out of 10, you are merely confirming competence, not expanding it. Tighten constraints immediately.
2. **Never evaluate while executing**: Separate the generation rep from the diagnostic audit by a timed hard stop.
3. **Hard-cap the reflection log at 10 minutes**: A log that takes 30 minutes becomes an essay contest. A 10-minute log forces diagnostic honesty.

### Benchmark: What Passes vs What Fails
- **PASS**: "Attempted 10 value-mass sketches under 5s timer. Passed 7. Failed 3 because high-contrast focal mass fell on the frame edge instead of the rule-of-thirds intersection. Adjustment for next session: Pre-sketch three tick marks on paper before starting timer."
- **FAIL**: "Spent 2 hours browsing art station and Midjourney prompts. Found some cool cinematic lighting styles. Feeling much more inspired today." *(Mere consumption / zero isolated rep).*
`
  },
  {
    code: 'Module 0B',
    title: 'How to Execute a Drill & Deliberate Practice',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Step-by-step mechanics of running isolated reps, difficulty calibration, and binary self-grading.',
    keyMentalModel: 'The Isolated Rep: A drill tests one variable in isolation with a binary pass/fail criterion before moving to full synthesis.',
    targetModalityId: 'm0',
    tags: ['drill-execution', 'reps', 'difficulty-calibration', 'binary-pass-fail'],
    lookupPattern: /^# Module 0 — How to Practice This Course/m,
    theoryExpansion: `
> [!important] Anatomy of a 1-Rep Micro-Drill
> Every rep must follow this exact 4-phase sequence:
> 1. **Setup (30s)**: State the isolated variable and write the binary success criterion.
> 2. **Execution (2–5 min)**: Execute under severe constraint without pausing or polishing.
> 3. **Diagnostic Audit (30s)**: Score strictly PASS or FAIL against the pre-stated criterion.
> 4. **Difficulty Regulation (15s)**: If passed 3 in a row, tighten constraint; if failed 3 in a row, lower difficulty to warmup level.
`
  },
  {
    code: 'Week 0',
    title: 'Baseline & Practice Contract',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'The 12-competency diagnostic mirror, honesty self-audit, and ethics and runway agreements.',
    keyMentalModel: 'The Baseline Mirror: A diagnostic benchmark to identify reflexive defaults before training, not a test or a grade.',
    targetModalityId: 'm0',
    tags: ['week-0', 'diagnostic-radar', 'contract', 'ethics', 'runway'],
    lookupPattern: /^# Week 0 — Baseline & Practice Contract/m,
    theoryExpansion: `
> [!important] Honesty Over Inflation
> Theoretical familiarity is not operational competence. Scoring a 3 or 4 because you *understand the concept intellectually* blinds you to where your reflexes fail under friction.
> A low score (1 or 2) is not a failure; it is your highest-leverage growth target for Part I.
`
  },
  {
    code: 'The Frame Question',
    title: 'The Frame Question: Why Creative Direction Matters',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'What changes when execution is cheap, fast, and abundant? The value shifts entirely upstream to judgment.',
    keyMentalModel: 'When generation is commoditized, value migrates entirely to problem-finding, diagnosis, and authorial refusal.',
    targetModalityId: 'm0',
    tags: ['frame-question', 'macro-shift', 'philosophy', 'judgment'],
    lookupPattern: /^# The Frame Question/m,
    theoryExpansion: `
> [!important] The Upstream Migration of Creative Value
> In manual craft, execution was the bottleneck: drawing the perspective lines, mixing the paints, coding the syntax. 
> When neural models execute in seconds, **execution is no longer scarce**.
>
> What remains scarce is:
> 1. Knowing what is worth solving before writing a prompt.
> 2. Diagnosing exactly why an output is flawed without evaluative cliches.
> 3. Refusing the median statistical consensus of the machine to maintain authentic human positionality.
`
  },
  {
    code: 'The Course Goal',
    title: 'The Course Goal & Three Layers of Mastery',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'From guided deliberate practice to independent studio systems to total blank-sheet autonomous agency.',
    keyMentalModel: 'The Progression of Authorship: Capability (Parts I–III) → Independence (Parts IV–VI) → Agency (Months 4–9).',
    targetModalityId: 'm0',
    tags: ['course-goal', 'pedagogy', 'mastery-layers'],
    lookupPattern: /^# The Course Goal/m,
    theoryExpansion: `
> [!important] The Three Stages of Scaffolding Removal
> 1. **Layer 1: Capability (Weeks 0–6)**: Establishes 12 deliberate micro-competencies. The Diagnostic Ladder and Brief Templates are actively provided.
> 2. **Layer 2: Independence (Weeks 7–12)**: Scaffolding is stripped away. You build bespoke pipelines, calibrate taste, and enforce authorial refusal.
> 3. **Layer 3: Agency (Months 4–9)**: External assignments are eliminated. You operate from a completely blank sheet, self-generating problems and defending your public work.
`
  },
  {
    code: 'Execution vs Creative Knowledge',
    title: 'Execution vs. Creative Knowledge',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Distinguishing tool fluency from creative judgment. Why prompt engineers hit a ceiling.',
    keyMentalModel: 'Tool Fluency is ephemeral; Creative Knowledge is portable across every technology and medium.',
    targetModalityId: 'm0',
    tags: ['execution', 'creative-knowledge', 'transfer', 'fundamentals'],
    lookupPattern: /^# The Core Distinction — Execution vs Creative Knowledge/m,
    theoryExpansion: `
> [!important] The Trap of Tool Fluency
> Memorizing Midjourney parameters, ComfyUI nodes, or LLM prompting syntax feels like skill acquisition. But when the next model version drops, that fluency vanishes.
>
> **Creative Knowledge is invariant across media:**
> - Seeing value hierarchy in an image operates on the exact same perceptual principles whether drawn in charcoal, painted in oils, or rendered with flux diffusion.
> - Structural voice in an essay is about omission and rhythmic distribution whether typed in Markdown or generated by Claude.
`
  },
  {
    code: 'Scaffolding Removal',
    title: 'Scaffolding Removal as Pedagogical Principle',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Why training wheels must be systematically dismantled to prevent dependent habits.',
    keyMentalModel: 'Scaffolding is a temporary scaffold to build internal reflexes; if never removed, it becomes a permanent crutch.',
    targetModalityId: 'm0',
    tags: ['scaffolding', 'pedagogy', 'mastery-gates', 'independence'],
    lookupPattern: /^# Scaffolding Removal as Pedagogical Principle/m,
    theoryExpansion: `
> [!warning] Scaffolding Removal Schedule
> - **End of Part I (Gate 1)**: Diagnostic Ladder is removed. You must perceive structural hierarchy without a checklist.
> - **End of Part II (Gate 2)**: 7-Layer Brief Template is removed. You must author bespoke specifications.
> - **End of Part III (Gate 3)**: Pipeline exercises are removed. You author your own generative system.
> - **Part VI & Beyond**: Prompts and assignments are removed. You begin from the Blank Sheet.
`
  },
  {
    code: 'Outcome Quality vs Decision Quality',
    title: 'Outcome Quality vs. Decision Quality: The 2-Axis Matrix',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Separating lucky outputs from repeatable authorial control using the 4-quadrant evaluation matrix.',
    keyMentalModel: 'Outcome Quality reflects the instance; Decision Quality reflects the director.',
    targetModalityId: 'm0',
    tags: ['two-axis', 'decision-quality', 'outcome-quality', 'quadrants'],
    lookupPattern: /^# Outcome Quality vs Decision Quality/m,
    theoryExpansion: `
> [!important] The Four Quadrants
> | | **Weak Outcome** | **Strong Outcome** |
> |---|---|---|
> | **Weak Decision** | **Failure**: Low craft, no intent. | **Lucky / Unstable**: Beautiful output caused by random diffusion seed; cannot be steered or revised. |
> | **Strong Decision** | **Learning in Progress**: Rigorous intent, sound rationale; local execution lagged. High leverage! | **Mastery**: Defensible choices producing intended perceptual effect repeatably. |
`
  },

  // --- PART I: FIND & OBSERVE ---
  {
    code: 'Part I Intro',
    title: 'Part I Overview — Find & Observe',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Part I trains observation before generation. Distinguish what is actually present from what you hope or assume is present.',
    keyMentalModel: 'Observation Precedes Direction: You cannot direct a machine to generate what you cannot perceive yourself.',
    targetModalityId: 'm2',
    tags: ['part-1', 'observation', 'perception', 'foundations'],
    lookupPattern: /^# Part I — FIND & OBSERVE/m,
    theoryExpansion: `
> [!important] The First Pillar: See What Is Actually There
> When looking at AI outputs, the untrained eye is immediately seduced by surface polish — resolution, glossy lighting, articulate tone. 
> Part I strips away evaluative shortcuts so you can audit intent, structure, value massing, and logical coherence.
`
  },
  {
    code: 'Module 1',
    title: 'The Judgment Gap & Reciprocal Principle',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Understand what changes when generation becomes cheap, and distinguish production capability from judgment capability.',
    keyMentalModel: 'A question is not exploration until it changes what you do.',
    targetModalityId: 'm2',
    tags: ['judgment-gap', 'reciprocal-principle', 'decision-audit', 'observation'],
    lookupPattern: /^# Module 1 — The Judgment Gap/m,
    theoryExpansion: `
> [!important] The Statistical Gravity Well of AI
> AI models are probability engines trained to predict the median consensus. When you prompt with adjectives like "cinematic", "dramatic", or "thoughtful", you surrender directional control and summon the median statistical average of the training data.
> 
> True creative direction does not ask the model to "make it good". It provides **geometric constraints, directional lighting angles, premise tensions, and negative refusals**.

### The 6-Question Provenance Audit:
Whenever you evaluate a machine-generated output:
1. **What is it apparently trying to do?** (Identify intended function).
2. **Which decisions are explicit?** (What did you deliberately specify?).
3. **Which decisions appear to be defaults?** (What did the model fill in from training bias?).
4. **Which decision most determines whether it succeeds?** (Locate the critical lever).
5. **Who or what made that decision?** (Human vs Model vs Random Seed).
6. **What would a human director need to decide next?** (Your actionable intervention).
`
  },
  {
    code: 'Module 2',
    title: 'Problem-Finding & Positionality Compass',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Train the faculty that sits before the brief: finding problems worth pursuing and evaluating your standing.',
    keyMentalModel: 'Problem-solving works on given problems; problem-finding decides what warrants attention.',
    targetModalityId: 'm1',
    tags: ['problem-finding', 'positionality', 'standing', 'refusal'],
    lookupPattern: /^# Module 2 — Problem-Finding/m,
    theoryExpansion: `
> [!important] The Missing Upstream Faculty
> Conventional design education gives you a brief. In an era of unlimited generation, having answers is cheap; finding problems that actually matter is rare.
> 
> A real creative problem is not a broad topic ("loneliness") or an informational question ("how do bees navigate?"). It is an **unresolved friction with human or formal stakes** where multiple valid forces pull in opposite directions.

### The Positionality Compass:
Before adopting a problem, state your standing:
- **From**: You speak from lived experience and internal necessity.
- **With**: You collaborate with equal agency and shared economics.
- **For**: You execute as a servant of an identified stakeholder community.
- **About**: You observe as an analyst or researcher, acknowledging distance.
- **Over**: You extract material without accountability. *(Must be refused!)*
`
  },
  {
    code: 'Module 3',
    title: 'Non-Instrumental Attention',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Sustained observation without output requirement. Protects serendipity from premature monetization.',
    keyMentalModel: 'Perceptions not immediately monetized or converted to output preserve serendipity.',
    targetModalityId: 'm0',
    tags: ['attention', 'serendipity', 'observation', 'unassigned'],
    lookupPattern: /^# Module 3 — Non-Instrumental Attention/m,
    theoryExpansion: `
> [!important] Preserving Serendipity Capital
> If every sensation, walk, and book is immediately drafted into a project pitch, your perception narrows to what is currently useful. 
> Non-instrumental attention exercises the perceptual muscle without instrumental anxiety.
`
  },
  {
    code: 'Module 4',
    title: 'Diagnostic Vision & The Universal Sequence',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'The top-down diagnostic ladder. Never optimize a lower level while a higher level remains broken.',
    keyMentalModel: 'Top-Down Causality: Intent -> Structure -> Perceptual Effect -> Construction -> Surface Execution.',
    targetModalityId: 'm2',
    tags: ['diagnostic-vision', 'ladder', 'top-down', 'causality'],
    lookupPattern: /^# Module 4 — Diagnostic Vision/m,
    theoryExpansion: `
> [!important] The Cardinal Diagnostic Rule
> **Do not optimize a lower level while a higher level remains unresolved.**
> Polishing lighting or fixing phrasing when the core composition or thesis is broken produces glossy slop. Always name the highest unresolved rung first.

### The Canonical Diagnostic Formula:
Every diagnosis must be written in this exact format:
> **"The highest unresolved level is [Level]. The decision causing the problem is [Decision]. I would test [Test] next. I would accept the result if [Criterion]."**
`
  },
  {
    code: 'Module V1',
    title: 'Visual Observation & Diagnosis',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Seeing massing, value structures, and directional flow rather than surface detail.',
    keyMentalModel: 'Visual Hierarchy: Major Masses -> Focal Path -> Value Structure -> Directional Axes.',
    targetModalityId: 'm2',
    tags: ['visual', 'massing', 'values', 'observation'],
    lookupPattern: /^# Module V1 — Visual Observation & Diagnosis/m,
    theoryExpansion: `
> [!important] The 5-Second Flash Rule
> Human vision reads large silhouette masses in 100–200ms. If the 3 major masses fail to establish a focal hierarchy, no amount of 8K detail will save the image.
`
  },
  {
    code: 'Module W1',
    title: 'Writing Observation & Diagnosis',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Close-reading, voice as omission, and rhythm distribution without adjectives.',
    keyMentalModel: 'Voice is not surface adjectives; voice is structural tension and omission.',
    targetModalityId: 'm2',
    tags: ['writing', 'close-reading', 'rhythm', 'omission'],
    lookupPattern: /^# Module W1 — Writing Observation & Diagnosis/m,
    theoryExpansion: `
> [!important] The Neutral-Prose Subtraction Diff
> If you strip out rhetorical flourish and adjectives from an essay and nothing of substance remains, the piece has no positionality. Voice is created by what you refuse to say and the rhythm of your claims.
`
  },
  {
    code: 'Part I Deliverables',
    title: 'Part I Deliverables & Verification',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Checklist and standards for completing Project 1: Problem-Finding, Observation & Diagnosis Portfolio.',
    keyMentalModel: 'Quality over quantity. 15 well-diagnosed items beats 30 perfunctory ones.',
    targetModalityId: 'm2',
    tags: ['deliverables', 'project-1', 'portfolio'],
    lookupPattern: /^# Part I — Deliverables/m,
    theoryExpansion: `
> [!important] Part I Completion Criteria
> 15 Written Diagnoses with zero evaluative adjectives, 6 Visual Perception Massing studies, 3 Close-Reading Analyses, and 1 defended problem carried into Part II.
`
  },
  {
    code: 'Part I Mastery Gate',
    title: 'Part I Mastery Gate Review',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'The self-audit gate before the Diagnostic Ladder is removed in Part II.',
    keyMentalModel: 'Demonstrating capability so scaffolding can be removed.',
    targetModalityId: 'm2',
    tags: ['mastery-gate', 'gate-1', 'scaffolding'],
    lookupPattern: /^## Part I Mastery Gate/m,
    theoryExpansion: `
> [!warning] Scaffolding Removal Warning
> Passing Gate 1 removes the Diagnostic Ladder from standard view in Part II. You must have internalized the hierarchy so you diagnose without needing the checklist in front of you.
`
  },

  // --- PART II: FORMULATE ---
  {
    code: 'Part II Intro',
    title: 'Part II Overview — Formulate',
    partNumber: 2,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'From observation to actionable specification. Authoring checkable 7-layer briefs and tracking provenance.',
    keyMentalModel: 'A brief is a checkable specification, not a mood description.',
    targetModalityId: 'm3',
    tags: ['part-2', 'specification', 'brief', 'provenance'],
    lookupPattern: /^# Part II — FORMULATE/m,
    theoryExpansion: `
> [!important] Intent Operationalized
> A prompt is a wish; a brief is an engineering contract. In Part II, you learn to translate vague artistic desire into falsifiable constraints.
`
  },
  {
    code: 'Module 5',
    title: 'Premise & Intent',
    partNumber: 2,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Generating premises with structural tension and passing the 4 viability tests.',
    keyMentalModel: 'Premise with Tension: A premise must contain two valid, opposing forces.',
    targetModalityId: 'm3',
    tags: ['premise', 'intent', 'tension', 'formulate'],
    lookupPattern: /^# Module 5 — Premise & Intent/m,
    theoryExpansion: `
> [!important] The 4 Viability Tests of a Premise
> 1. **Falsifiability**: Can it be proven wrong or fail?
> 2. **Tension**: Are two desirable values in conflict?
> 3. **Generativity**: Does it suggest multiple concrete variations?
> 4. **Specificity**: Does it eliminate at least 80% of possible outputs?
`
  },
  {
    code: 'Module 6',
    title: 'Brief Architecture & 7 Layers',
    partNumber: 2,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Writing checkable 7-layer briefs that make intent operational without overdetermining.',
    keyMentalModel: 'A brief is a checkable specification, not a mood description.',
    targetModalityId: 'm3',
    tags: ['brief', 'specification', 'acceptance-criteria', 'constraints'],
    lookupPattern: /^# Module 6 — Brief Architecture/m,
    theoryExpansion: `
> [!important] The 7 Layers of a Real Brief
> Premise -> Intention -> Constraints -> Reference Anchors -> Acceptance Criteria -> Rejection Conditions -> Unknowns.
`
  },
  {
    code: 'Module V2',
    title: 'Visual Specification & Constraints',
    partNumber: 2,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Specifying visual intent with focal geometry, lighting elevation in degrees, and negative constraints.',
    keyMentalModel: 'Directing focal paths and tonal contrast rather than asking for "mood".',
    targetModalityId: 'm3',
    tags: ['visual-spec', 'lighting', 'geometry', 'constraints'],
    lookupPattern: /^# Module V2 — Visual Specification/m,
    theoryExpansion: `
> [!important] Operational Visual Constraints
> Specify camera lens focal length, lighting elevation angle, major value groupings, and explicit negative constraints.
`
  },
  {
    code: 'Module W2',
    title: 'Writing Specification & Skeletons',
    partNumber: 2,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Structural skeletons, sentence rhythm distributions, and argument maps before drafting.',
    keyMentalModel: 'Construct the architectural skeleton before generating prose.',
    targetModalityId: 'm3',
    tags: ['writing-spec', 'argument-map', 'skeletons', 'structure'],
    lookupPattern: /^# Module W2 — Writing Specification/m,
    theoryExpansion: `
> [!important] The Skeleton Gate
> Never let an LLM draft prose without an approved structural skeleton specifying the claim, counter-argument, and evidence for each paragraph.
`
  },
  {
    code: 'Module 7',
    title: 'Provenance & Provenance Records',
    partNumber: 2,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Tracking origin, transformation, license, and human decision contribution.',
    keyMentalModel: 'Human Contribution is the core field of provenance.',
    targetModalityId: 'm3',
    tags: ['provenance', 'ethics', 'copyright', 'records'],
    lookupPattern: /^# Module 7 — Provenance Begins/m,
    theoryExpansion: `
> [!important] Beyond Compliance
> Provenance records don't just satisfy copyright; they document what decisions were authored by human judgment vs generated by algorithms.
`
  },
  {
    code: 'Part II Deliverables',
    title: 'Part II Deliverables & Verification',
    partNumber: 2,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Standards and quota for completing Project 2: Premise & Brief Lab.',
    keyMentalModel: '6 complete brief dossiers with thumbnail skeletons and rejected alternative premises.',
    targetModalityId: 'm3',
    tags: ['deliverables', 'project-2', 'briefs'],
    lookupPattern: /^# Part II — Deliverables/m,
    theoryExpansion: `
> [!important] Part II Verification
> Every brief dossier must show explicit rejection logic for at least 2 alternate premises.
`
  },
  {
    code: 'Part II Mastery Gate',
    title: 'Part II Mastery Gate Review',
    partNumber: 2,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Audit of Project 2 briefs and preparation for building pipeline systems in Part III.',
    keyMentalModel: 'Scaffolding check: Brief templates will be removed in Part III.',
    targetModalityId: 'm3',
    tags: ['mastery-gate', 'gate-2', 'transition'],
    lookupPattern: /^## Part II Mastery Gate/m,
    theoryExpansion: `
> [!warning] Scaffolding Removal in Part III
> In Part III, standardized brief templates are removed. You will write bespoke specifications directly tailored to your pipeline architecture.
`
  },

  // --- PART III: BUILD ---
  {
    code: 'Part III Intro',
    title: 'Part III Overview — Build',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Transitioning from one-off generation to repeatable pipeline systems and causal calibration.',
    keyMentalModel: 'The pipeline is the artwork; outputs are instances.',
    targetModalityId: 'm4',
    tags: ['part-3', 'systems', 'pipelines', 'calibration'],
    lookupPattern: /^# Part III — BUILD/m,
    theoryExpansion: `
> [!important] Layer 2 Begins
> In Layer 1 you learned to see and specify. In Layer 2 you build deterministic systems that reliably separate variables.
`
  },
  {
    code: 'Module 8',
    title: 'Pipeline Thinking & Multi-Stage Systems',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Mapping variables, failure points, and predictable multi-stage generation pipelines.',
    keyMentalModel: 'The pipeline is the artwork; outputs are instances.',
    targetModalityId: 'm4',
    tags: ['pipelines', 'variables', 'failure-points', 'systems'],
    lookupPattern: /^# Module 8 — Pipeline Thinking/m,
    theoryExpansion: `
> [!important] Multi-Stage Separation of Concerns
> Single prompt-to-image/text generation conflates all variables. A mature pipeline separates composition, lighting, detail, and tone into independent control stages.
`
  },
  {
    code: 'Module 9',
    title: 'Prediction & Calibration',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Predicting variable changes with stated confidence percentages before running tests. Brier scoring.',
    keyMentalModel: 'Prediction before generation reveals causal understanding.',
    targetModalityId: 'm4',
    tags: ['calibration', 'prediction', 'brier-score', 'telemetry'],
    lookupPattern: /^# Module 9 — Prediction & Calibration/m,
    theoryExpansion: `
> [!important] The Calibration Discipline
> Guessing after seeing the result is hindsight bias. You must lock your prediction and percentage confidence *before* clicking generate.
`
  },
  {
    code: 'Module V3',
    title: 'Visual Pipeline Systems',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Node-based generation pipelines, identity preservation, and structural conditioning.',
    keyMentalModel: 'Separating identity conditioning from lighting conditioning.',
    targetModalityId: 'm4',
    tags: ['visual-pipelines', 'nodes', 'conditioning', 'identity'],
    lookupPattern: /^# Module V3 — Visual Pipeline Systems/m,
    theoryExpansion: `
> [!important] Systematic Variation
> A true visual pipeline can change lighting angle or camera lens without altering character identity or spatial massing.
`
  },
  {
    code: 'Module W3',
    title: 'Writing Pipeline Systems',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Multi-stage writing workflows: research synthesis, outline mapping, drafting, subtraction pass, rhythm pass.',
    keyMentalModel: 'Decomposing writing into distinct passes prevents generative blandness.',
    targetModalityId: 'm4',
    tags: ['writing-pipelines', 'subtraction-pass', 'rhythm-pass', 'multi-stage'],
    lookupPattern: /^# Module W3 — Writing Pipeline Systems/m,
    theoryExpansion: `
> [!important] The 4-Stage Writing Pipeline
> 1. Source extraction & fact map.
> 2. Structural tension skeleton.
> 3. Unconstrained drafting pass.
> 4. Subtraction diff (strip adjectives, tighten cadence).
`
  },
  {
    code: 'Craft Knowledge Requirement',
    title: 'Craft Knowledge Requirement',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Maintaining unassisted physical craft practice alongside AI pipeline direction.',
    keyMentalModel: 'Human craft intuition is the sensor that calibrates machine direction.',
    targetModalityId: 'm4',
    tags: ['craft', 'manual-practice', 'drawing', 'intuition'],
    lookupPattern: /^# Craft Knowledge Requirement/m,
    theoryExpansion: `
> [!important] Why Manual Practice Remains Vital
> If you cannot draw a perspective box with pencil and paper, you cannot diagnose a perspective flaw in a 3D diffusion render. Physical craft keeps your perceptual sensor grounded.
`
  },
  {
    code: 'Part III Deliverables',
    title: 'Part III Deliverables & Verification',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Requirements for Project 3: Build a Working System.',
    keyMentalModel: 'Documented pipelines with variable maps and 20 controlled variations.',
    targetModalityId: 'm4',
    tags: ['deliverables', 'project-3', 'systems'],
    lookupPattern: /^# Part III — Deliverables/m,
    theoryExpansion: `
> [!important] Deliverable Standard
> 1 visual pipeline, 1 writing pipeline, failure maps, and 12 controlled variations.
`
  },
  {
    code: 'Part III Mastery Gate',
    title: 'Part III Mastery Gate Review',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Gate audit verifying causal pipeline predictability before entering Curation in Part IV.',
    keyMentalModel: 'Proving that changes in output are caused by your decisions, not algorithmic luck.',
    targetModalityId: 'm4',
    tags: ['mastery-gate', 'gate-3'],
    lookupPattern: /^## Part III Mastery Gate/m,
    theoryExpansion: `
> [!warning] Scaffolding Removal in Part IV
> In Part IV, external exercise prompts are removed. You curate your own reference classes.
`
  },

  // --- PART IV: CALIBRATE ---
  {
    code: 'Part IV Intro',
    title: 'Part IV Overview — Calibrate',
    partNumber: 4,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Developing taste as infrastructure: anchor libraries, blind ranking, and comparative judgment.',
    keyMentalModel: 'Taste is criteria, reference class, mechanism, and purpose — not personal preference.',
    targetModalityId: 'm5',
    tags: ['part-4', 'taste', 'curation', 'anchors'],
    lookupPattern: /^# Part IV — CALIBRATE/m,
    theoryExpansion: `
> [!important] Moving Past Subjectivity
> "I like this" is subjective sentiment. Taste as infrastructure is the ability to state *why* mechanism X accomplishes purpose Y better than alternative Z.
`
  },
  {
    code: 'Module 10',
    title: 'Taste as Infrastructure & Curation',
    partNumber: 4,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'The 5-part taste formula, blind provenance ranking, and building anchor libraries.',
    keyMentalModel: 'Taste is criteria, reference class, mechanism, and purpose — not personal preference.',
    targetModalityId: 'm5',
    tags: ['taste', 'curation', 'anchor-library', 'blind-ranking'],
    lookupPattern: /^# Module 10 — Taste as Infrastructure/m,
    theoryExpansion: `
> [!important] The 5-Part Taste Formula
> **Preference + Criteria + Reference Class + Mechanism + Purpose**.
> You cannot judge an artifact in a vacuum; you judge it in relation to its intended functional purpose.
`
  },
  {
    code: 'Module V4',
    title: 'Visual Curation',
    partNumber: 4,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Building visual anchor libraries, demoting corrupted anchors, and tracking human baseline ratio.',
    keyMentalModel: 'Maintain >=40% human anchors to prevent model collapse in your taste set.',
    targetModalityId: 'm5',
    tags: ['visual-curation', 'anchors', 'slop-detector'],
    lookupPattern: /^# Module V4 — Visual Curation/m,
    theoryExpansion: `
> [!important] Avoiding Anchor Inbreeding
> If your visual reference library consists solely of Midjourney renders, your taste collapses into statistical average cliches. Anchor libraries must be grounded in masterworks of painting, cinema, and print.
`
  },
  {
    code: 'Module W4',
    title: 'Writing Curation',
    partNumber: 4,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Curating prose anchor texts, defining anti-anchors (slop), and auditing synthetic cadence.',
    keyMentalModel: 'Define your writing voice by what you explicitly refuse to publish.',
    targetModalityId: 'm5',
    tags: ['writing-curation', 'slop-criteria', 'anti-anchors'],
    lookupPattern: /^# Module W4 — Writing Curation/m,
    theoryExpansion: `
> [!important] The Slop Audit
> Catalog 10 phrases that immediately signal uncurated LLM prose ("delve into", "tapestry of", "testament to", "nestled in"). Forbid them across all studio briefs.
`
  },
  {
    code: 'Module 11',
    title: 'Comparative Judgment & Transfer',
    partNumber: 4,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Deploying taste across unfamiliar media and running blind comparative ranking tests.',
    keyMentalModel: 'Comparative judgment forces criteria to become explicit.',
    targetModalityId: 'm5',
    tags: ['comparative-judgment', 'blind-ranking', 'transfer'],
    lookupPattern: /^# Module 11 — Comparative Judgment & Transfer/m,
    theoryExpansion: `
> [!important] Blind Ranking Protocol
> Strip provenance labels before ranking 5 candidate artifacts. Write your ranking criteria first, then reveal labels to audit bias.
`
  },
  {
    code: 'Part IV Deliverables',
    title: 'Part IV Deliverables & Verification',
    partNumber: 4,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Deliverables for Project 4: Calibrate Taste.',
    keyMentalModel: 'Two verified anchor libraries with explicit inclusion and demotion criteria.',
    targetModalityId: 'm5',
    tags: ['deliverables', 'project-4', 'taste'],
    lookupPattern: /^# Part IV — Deliverables/m,
    theoryExpansion: `
> [!important] Deliverable Standard
> 2 anchor libraries (15+ anchors each), 20 comparative judgments, 2 slop criteria, 3 demotions.
`
  },
  {
    code: 'Part IV Mastery Gate',
    title: 'Part IV Mastery Gate Review',
    partNumber: 4,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Verification of taste calibration before entering Production Direction in Part V.',
    keyMentalModel: 'Demonstrating that criteria hold up under blind ranking.',
    targetModalityId: 'm5',
    tags: ['mastery-gate', 'gate-4'],
    lookupPattern: /^## Part IV Mastery Gate/m,
    theoryExpansion: `
> [!warning] Scaffolding Removal in Part V
> Category scaffolding is removed in Part V. You operate directly on messy production demands.
`
  },

  // --- PART V: DIRECT ---
  {
    code: 'Part V Intro',
    title: 'Part V Overview — Direct',
    partNumber: 5,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Directing collaborators, managing scope, and mastering the revision vs re-brief fork.',
    keyMentalModel: 'Layer 3 Begins: Agency, professional practice, and public authorship.',
    targetModalityId: 'm6',
    tags: ['part-5', 'direction', 'collaboration', 'agency'],
    lookupPattern: /^# Part V — DIRECT/m,
    theoryExpansion: `
> [!important] Entering Layer 3
> Direction is not solo prompting; it is leading a production system with real-world stakes, clients, and collaborators.
`
  },
  {
    code: 'Module 12',
    title: 'Production Direction & Revision Discipline',
    partNumber: 5,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Directing collaborators and AI, managing scope, and mastering the revision vs re-brief fork.',
    keyMentalModel: 'When a premise fails, revision is procrastination. Re-brief immediately.',
    targetModalityId: 'm6',
    tags: ['direction', 're-brief', 'scope', 'revision'],
    lookupPattern: /^# Module 12 — Production Direction/m,
    theoryExpansion: `
> [!important] The Revision vs Re-brief Fork
> Revisions fix local execution and surface polish. If structure or premise is broken, stop revising and issue a new brief.
`
  },
  {
    code: 'Module 13',
    title: 'Professional Practice Begins',
    partNumber: 5,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Contracts, scope boundaries, pricing creative direction vs execution, and ethics disclosure.',
    keyMentalModel: 'Pricing judgment: You charge for knowing which decision to make, not hours of generation.',
    targetModalityId: 'm6',
    tags: ['professional-practice', 'contracts', 'scope', 'pricing'],
    lookupPattern: /^# Module 13 — Professional Practice Begins/m,
    theoryExpansion: `
> [!important] Value-Based Direction Pricing
> If you bill by the hour, AI efficiency reduces your income. Bill for decision risk, strategic positioning, and authorial guarantee.
`
  },
  {
    code: 'Module 14',
    title: 'Collaborative Direction',
    partNumber: 5,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Leading human collaborators and machine agents without deference or micromanagement.',
    keyMentalModel: 'Shared authorship requires explicit boundary agreements and clear division of decisions.',
    targetModalityId: 'm6',
    tags: ['collaboration', 'leadership', 'economics', 'agreements'],
    lookupPattern: /^# Module 14 — Collaborative Direction/m,
    theoryExpansion: `
> [!important] Boundary Protocols
> Never give a collaborator or model ambiguous feedback like "make it punchier". State the highest unresolved level and the test criterion.
`
  },
  {
    code: 'Module V5',
    title: 'Visual Direction',
    partNumber: 5,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Directing comprehensive visual campaigns, defending choices to clients, and principled refusal.',
    keyMentalModel: 'Defend visual choices using perceptual mechanics, not personal preference.',
    targetModalityId: 'm6',
    tags: ['visual-direction', 'campaigns', 'defensibility'],
    lookupPattern: /^# Module V5 — Visual Direction/m,
    theoryExpansion: `
> [!important] The Client Defense Heuristic
> Explain why a visual decision was made in terms of audience eye-movement and compositional balance, not "I felt it looked cool".
`
  },
  {
    code: 'Module W5',
    title: 'Writing Direction',
    partNumber: 5,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Editorial direction, publication triage, reader calibration, and pacing revision.',
    keyMentalModel: 'Directing the reader\'s cognitive pace through rhythmic sentence architecture.',
    targetModalityId: 'm6',
    tags: ['writing-direction', 'editorial', 'triage'],
    lookupPattern: /^# Module W5 — Writing Direction/m,
    theoryExpansion: `
> [!important] Editorial Direction vs Copyediting
> Copyediting fixes spelling and grammar. Direction audits whether the argument holds tension across all sections.
`
  },
  {
    code: 'Part V Deliverables',
    title: 'Part V Deliverables & Verification',
    partNumber: 5,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Requirements for Project 5: Directed Production.',
    keyMentalModel: 'Complete directed production with stakeholder communication log and refusal records.',
    targetModalityId: 'm6',
    tags: ['deliverables', 'project-5', 'production'],
    lookupPattern: /^# Part V — Deliverables/m,
    theoryExpansion: `
> [!important] Deliverable Standard
> 1 major visual project, 1 major writing project, stakeholder critique log, revision/re-brief records, and refusals.
`
  },
  {
    code: 'Part V Mastery Gate',
    title: 'Part V Mastery Gate Review',
    partNumber: 5,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Reviewing directorial authority before entering the final Authorship & Capstone phase.',
    keyMentalModel: 'Demonstrating that you can direct through others while maintaining creative vision.',
    targetModalityId: 'm6',
    tags: ['mastery-gate', 'gate-5'],
    lookupPattern: /^## Part V Mastery Gate/m,
    theoryExpansion: `
> [!warning] Scaffolding Removal in Part VI
> All external scaffolding is removed in Part VI. You are alone with the Blank Sheet.
`
  },

  // --- PART VI: AUTHOR & TRANSFER ---
  {
    code: 'Part VI Intro',
    title: 'Part VI Overview — Author & Transfer',
    partNumber: 6,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'The capstone phase: establishing authorial position, public process, and the 14-Step Blank Sheet Test.',
    keyMentalModel: 'Authorship is what remains constant across different subjects and tools.',
    targetModalityId: 'm7',
    tags: ['part-6', 'authorship', 'blank-sheet', 'capstone'],
    lookupPattern: /^# Part VI — AUTHOR & TRANSFER/m,
    theoryExpansion: `
> [!important] The Final Intensive Horizon
> In Part VI you prove that your creative voice is not dependent on prompts, teachers, or client briefs.
`
  },
  {
    code: 'Module 15',
    title: 'Authorship as Repeated Position',
    partNumber: 6,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'What you repeatedly pursue, what you repeatedly refuse, and defending your creative signature.',
    keyMentalModel: 'Authorship is what remains constant across different subjects and tools.',
    targetModalityId: 'm7',
    tags: ['authorship', 'positionality', 'signature', 'refusal'],
    lookupPattern: /^# Module 15 — Authorship as Position/m,
    theoryExpansion: `
> [!important] Authorship is Defined by Refusal
> Anyone can generate anything. Your creative signature is determined by what you refuse to permit, even when the model generates it effortlessly.
`
  },
  {
    code: 'Module 16',
    title: 'Self-Directed Practice & Blank Sheet',
    partNumber: 6,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Sustaining practice when all external scaffolds, prompts, and rubrics are removed.',
    keyMentalModel: 'The practice begins when nobody gives you an assignment.',
    targetModalityId: 'm7',
    tags: ['blank-sheet', 'self-direction', 'independence'],
    lookupPattern: /^# Module 16 — Self-Directed Practice/m,
    theoryExpansion: `
> [!important] The Final Horizon
> When you enter a studio with no client, no teacher, and no deadline, do you know what is worth making?
`
  },
  {
    code: 'Module 17',
    title: 'Cross-Medium Synthesis',
    partNumber: 6,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Synthesizing visual and textual modes where neither can carry the argument alone.',
    keyMentalModel: 'Cross-medium synthesis creates emergent third meaning through juxtaposition.',
    targetModalityId: 'm7',
    tags: ['synthesis', 'cross-medium', 'hybrid'],
    lookupPattern: /^# Module 17 — Cross-Medium Synthesis/m,
    theoryExpansion: `
> [!important] The Third Meaning
> In true synthesis, text does not merely caption the image, and the image does not merely decorate the text.
`
  },
  {
    code: 'Module 18',
    title: 'Public Process & Transmission',
    partNumber: 6,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Publishing internal studio artifacts and teaching the framework to others.',
    keyMentalModel: 'Sharing provenance and decisions demystifies creative authorship.',
    targetModalityId: 'm7',
    tags: ['public-process', 'transmission', 'publishing'],
    lookupPattern: /^# Module 18 — Public Process/m,
    theoryExpansion: `
> [!important] Public Transparency
> Release your decision logs and rejected alternatives alongside the finished work. Show the director at work.
`
  },
  {
    code: 'The Blank-Sheet Test',
    title: 'The 14-Step Blank-Sheet Test',
    partNumber: 6,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'The ultimate protocol for launching a project with zero external brief or prompting.',
    keyMentalModel: '14 disciplined steps from observation to finished defense without external reassurance.',
    targetModalityId: 'm7',
    tags: ['blank-sheet-protocol', '14-steps', 'autonomy'],
    lookupPattern: /^# The Blank-Sheet Test/m,
    theoryExpansion: `
> [!important] The 14-Step Sequence
> 1. Unassigned beginning -> 2. Position check -> 3. Premise with tension -> 4. 7-Layer brief -> 5. Anchor selection -> 6. Pipeline construction -> 7. Prediction -> 8. Generation -> 9. Diagnostic audit -> 10. Refusal check -> 11. Revision/Re-brief fork -> 12. Final polish -> 13. Provenance record -> 14. Public defense.
`
  },
  {
    code: 'Part VI Deliverables',
    title: 'Part VI Deliverables & Verification',
    partNumber: 6,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Requirements for Project 6: Authorship, Synthesis & Blank Sheet.',
    keyMentalModel: 'Authorial position statement, complete portfolio, and blank-sheet capstone.',
    targetModalityId: 'm7',
    tags: ['deliverables', 'project-6', 'capstone'],
    lookupPattern: /^# Part VI — Deliverables/m,
    theoryExpansion: `
> [!important] Deliverable Standard
> Visual portfolio (5–8 case studies), writing portfolio (5–8 case studies), author statement, and defended capstone.
`
  },
  {
    code: 'Part VI Mastery Gate',
    title: 'Part VI Mastery Gate: Exit Criteria',
    partNumber: 6,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Final graduation standard for completing the 12-week intensive and entering independent practice.',
    keyMentalModel: 'Complete autonomous creative agency: you can begin, direct, diagnose, and defend any project.',
    targetModalityId: 'm7',
    tags: ['mastery-gate', 'gate-6', 'graduation', 'exit-criteria'],
    lookupPattern: /^## Part VI Mastery Gate/m,
    theoryExpansion: `
> [!important] Exit Criteria
> You have passed when you can be dropped into an unfamiliar medium or domain and immediately structure the problem, build the pipeline, and defend the work.
`
  },

  // --- INDEPENDENT PRACTICE & MONTHS 4–9 ---
  {
    code: 'Independent Practice Overview',
    title: 'Independent Practice (Months 4–9) Overview',
    partNumber: 7,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Sustaining professional creative direction across 6 months of independent projects (Projects 7–12).',
    keyMentalModel: 'From guided course to lifelong creative practice.',
    targetModalityId: 'm7',
    tags: ['independent-practice', 'months-4-9', 'agency'],
    lookupPattern: /^# Independent Practice \(Months 4–9\)/m,
    theoryExpansion: `
> [!important] The Long Runway
> The 12-week intensive builds your reflexes; the 6-month independent practice turns those reflexes into a body of work.
`
  },
  {
    code: 'The Monthly Problem-Finding Session',
    title: 'The Monthly Problem-Finding Session',
    partNumber: 7,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'The dedicated 3-hour monthly protocol to discover and frame upcoming independent projects.',
    keyMentalModel: 'Never start a month without a defended problem-finding audit.',
    targetModalityId: 'm1',
    tags: ['monthly-problem-finding', 'inquiry', 'session-protocol'],
    lookupPattern: /^# The Monthly Problem-Finding Session/m,
    theoryExpansion: `
> [!important] Monthly Studio Ritual
> Block the first Saturday of each month. No tools open. Only notebook, observations, and positionality checks.
`
  },
  {
    code: 'The Unassigned Beginning',
    title: 'The Unassigned Beginning Protocol',
    partNumber: 7,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Starting from scratch without client prompts or external assignments.',
    keyMentalModel: 'Noticing what warrants creation before anyone requests it.',
    targetModalityId: 'm1',
    tags: ['unassigned-beginning', 'initiation', 'autonomy'],
    lookupPattern: /^# The Unassigned Beginning/m,
    theoryExpansion: `
> [!important] The Hardest Skill in Art
> Sitting in a quiet room with total generative freedom and finding something truly necessary to make.
`
  },
  {
    code: 'Failure Protocols',
    title: 'The 6 Failure Traps & Remediation Protocols',
    partNumber: 7,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Diagnostic triage for when practice stalls: taste narrowness, prompt addiction, feedback blindness.',
    keyMentalModel: 'Diagnose the failure trap early and apply the specific structural protocol.',
    targetModalityId: 'm0',
    tags: ['failure-protocols', 'triage', 'troubleshooting', 'stalls'],
    lookupPattern: /^# Failure Protocols/m,
    theoryExpansion: `
> [!warning] The 6 Failure Traps
> 1. **Prompt Seduction**: Believing you created something because the model rendered high polish.
> 2. **Taste Narrowness**: Only generating safe, familiar genres.
> 3. **Log Decay**: Mindless perfunctory logging.
> 4. **Revision Loops**: Tweaking local details while premise is broken.
> 5. **Feedback Isolation**: Never exposing work to external critique.
> 6. **Burnout**: Neglecting physical breaks and protected non-instrumental play.
`
  },

  // --- FLAGSHIP INDEPENDENT PROJECT SPECS (PROJECTS 7–12) ---
  {
    code: 'Project 7 Spec',
    title: 'Project 7 — Visual Campaign Specification',
    partNumber: 7,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Month 4 Independent Project: Directing a complete visual campaign using node-based pipeline systems and refusal records.',
    keyMentalModel: 'Demonstrate that the creative direction framework survives contact with a real client brief.',
    targetModalityId: 'm7',
    tags: ['project-7', 'independent', 'campaign', 'visual'],
    theoryExpansion: `
> [!important] Independent Month 4 Milestone
> A 4-week deep visual campaign produced through an authored pipeline with 20 decision log entries, 1 visual refusal, and external critique.
`
  },
  {
    code: 'Project 8 Spec',
    title: 'Project 8 — Writing Voice Guide Specification',
    partNumber: 8,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Month 5 Independent Project: Engineering an authorial writing voice guide with syntactic skeletons and subtraction diffs.',
    keyMentalModel: 'Voice defined as structural tension and rhythm rather than adjective prompts.',
    targetModalityId: 'm7',
    tags: ['project-8', 'independent', 'voice-guide', 'writing'],
    theoryExpansion: `
> [!important] Independent Month 5 Milestone
> Developing a defensible writing style manual and verified publication that enforces authentic voice without generative cliches.
`
  },
  {
    code: 'Project 9 Spec',
    title: 'Project 9 — Hybrid Visual Essay Specification',
    partNumber: 9,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Month 6 Independent Project: Multi-modal synthesis where neither images nor text can carry the argument alone.',
    keyMentalModel: 'Cross-medium synthesis: Image and text create third meaning through juxtaposition.',
    targetModalityId: 'm7',
    tags: ['project-9', 'independent', 'synthesis', 'essay'],
    theoryExpansion: `
> [!important] Independent Month 6 Milestone
> A long-form hybrid visual essay where text does not describe the image, and the image does not merely illustrate the text.
`
  },
  {
    code: 'Project 10 Spec',
    title: 'Project 10 — Character Design System Specification',
    partNumber: 10,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Month 7 Independent Project: Comprehensive visual identity and character consistency pipeline under extreme variation.',
    keyMentalModel: 'Preserving identity across pose, lighting, age, and perspective.',
    targetModalityId: 'm7',
    tags: ['project-10', 'independent', 'character-system'],
    theoryExpansion: `
> [!important] Independent Month 7 Milestone
> A systematic character design bible testing consistency through multi-stage LoRA and conditioning pipelines.
`
  },
  {
    code: 'Project 11 Spec',
    title: 'Project 11 — Editorial Series Specification',
    partNumber: 11,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Month 8 Independent Project: A 5-part serialized editorial production with stakeholder feedback triage.',
    keyMentalModel: 'Sustained narrative arc and revision discipline across multi-week publishing.',
    targetModalityId: 'm7',
    tags: ['project-11', 'independent', 'editorial-series'],
    theoryExpansion: `
> [!important] Independent Month 8 Milestone
> Managing multi-part publication, reader response calibration, and maintaining authorial stance over time.
`
  },
  {
    code: 'Project 12 Spec',
    title: 'Project 12 — Capstone Specification',
    partNumber: 12,
    layer: 3,
    layerName: 'Agency & Authorship',
    summary: 'Month 9 Independent Project: The definitive Blank-Sheet Capstone with problem-finding, defense, and public outreach.',
    keyMentalModel: 'Full autonomous creative authorship with zero external prompting.',
    targetModalityId: 'm7',
    tags: ['project-12', 'capstone', 'blank-sheet', 'mastery'],
    theoryExpansion: `
> [!important] The Final Capstone
> The ultimate test of your creative independence: 100% self-found problem, complete provenance, public release, and professional defense.
`
  }
];

// Build reading records with full markdown content
const readings = moduleCatalog.map(m => {
  let raw = '';
  if (m.code.startsWith('Project') && m.code.includes('Spec')) {
    const pNum = parseInt(m.code.replace('Project ', '').replace(' Spec', ''));
    raw = getProjectSpec(pNum);
  } else if (m.lookupPattern) {
    raw = extractHeadingSection(m.lookupPattern);
  }

  const fullContent = (m.theoryExpansion + '\n\n---\n\n' + raw).trim();

  return {
    code: m.code,
    title: m.title,
    partNumber: m.partNumber,
    layer: m.layer,
    layerName: m.layerName,
    summary: m.summary,
    keyMentalModel: m.keyMentalModel,
    targetModalityId: m.targetModalityId,
    tags: m.tags,
    content: fullContent
  };
});

// Appendices A-O as first-class readings
const appendicesRaw = fs.readFileSync('src/lib/data/appendices.ts', 'utf8');
const eqIdx = appendicesRaw.indexOf('=', appendicesRaw.indexOf('export const appendicesData'));
const arrayStart = appendicesRaw.indexOf('[', eqIdx);
const arrayEnd = appendicesRaw.indexOf('];', arrayStart);
const appendicesList = JSON.parse(appendicesRaw.slice(arrayStart, arrayEnd + 1));

const appendixReadings = appendicesList.map(a => ({
  code: 'Appendix ' + a.letter,
  title: a.title,
  partNumber: 0,
  layer: 1,
  layerName: 'Field Manual Protocol',
  summary: a.summary,
  keyMentalModel: 'Field Manual Protocol: Operational rules, diagnostic ladders, and studio templates.',
  targetModalityId: a.id === 'app-i' ? 'm0' : a.id === 'app-b' ? 'm2' : a.id === 'app-e' ? 'm5' : 'm2',
  tags: a.tags,
  content: a.content
}));

const allReadings = [...readings, ...appendixReadings];

const tsFileContent = `// Auto-generated enriched core readings database for Directing the Machine
export interface CoreReading {
  code: string;
  title: string;
  partNumber: number;
  layer: 1 | 2 | 3;
  layerName: string;
  summary: string;
  keyMentalModel: string;
  targetModalityId: string;
  tags: string[];
  content: string;
}

export const CORE_READINGS: CoreReading[] = ` + JSON.stringify(allReadings, null, 2) + `;

export function getReadingByCode(code: string): CoreReading | undefined {
  if (!code) return undefined;
  const clean = code.trim().toLowerCase();

  // 1. Direct match in CORE_READINGS
  const directMatch = CORE_READINGS.find((r) => {
    const rCode = r.code.toLowerCase();
    return rCode === clean || clean === rCode || clean.startsWith(rCode) || rCode.startsWith(clean);
  });
  if (directMatch) return directMatch;

  // 2. Check compound codes like 'Week 0 & App J' -> match 'Week 0'
  if (clean.includes('&')) {
    const firstPart = clean.split('&')[0].trim();
    const compoundMatch = CORE_READINGS.find((r) => r.code.toLowerCase().includes(firstPart));
    if (compoundMatch) return compoundMatch;
  }

  // 3. Fallback for 'app-b' or 'appendix b'
  const normalized = clean.replace('app-', 'appendix ').replace('appendix-', 'appendix ');
  const appMatch = CORE_READINGS.find((r) => r.code.toLowerCase() === normalized || r.code.toLowerCase().startsWith(normalized));
  if (appMatch) return appMatch;

  return undefined;
}

export function searchReadings(query: string): CoreReading[] {
  const q = query.trim().toLowerCase();
  if (!q) return CORE_READINGS;
  return CORE_READINGS.filter((r) =>
    r.title.toLowerCase().includes(q) ||
    r.code.toLowerCase().includes(q) ||
    r.summary.toLowerCase().includes(q) ||
    r.keyMentalModel.toLowerCase().includes(q) ||
    r.tags.some((t) => t.toLowerCase().includes(q))
  );
}
`;

fs.writeFileSync('src/lib/data/core-readings.ts', tsFileContent);
console.log('Successfully wrote src/lib/data/core-readings.ts with ' + allReadings.length + ' rich modules (including 15 appendices)!');

