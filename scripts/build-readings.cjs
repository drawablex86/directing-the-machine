const fs = require('fs');

const dtm = fs.readFileSync('Directing the Machine.md', 'utf8');

function getSection(titlePrefix) {
  const regex = new RegExp('^# ' + titlePrefix + '.*$', 'm');
  const match = regex.exec(dtm);
  if (!match) return '';
  const start = match.index;
  const nextRegex = /^# [^\n]+$/gm;
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

// Module definitions
const moduleCatalog = [
  {
    code: 'Module 0',
    title: 'How to Practice This Course',
    partNumber: 0,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'The deliberate practice contract, isolated micro-drills in the 70–80% difficulty zone, and immediate feedback loops.',
    keyMentalModel: 'Deliberate Practice vs. Mere Production: Practice isolates a micro-skill where you fail 2–3 reps out of 10. Mere production defaults to what you already know how to do.',
    targetModalityId: 'm0',
    tags: ['deliberate-practice', 'micro-skills', 'baseline', 'habits'],
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
    tags: ['week-0', 'diagnostic-radar', 'contract', 'ethics'],
    theoryExpansion: `
> [!important] Honesty Over Inflation
> Theoretical familiarity is not operational competence. Scoring a 3 or 4 because you *understand the concept intellectually* blinds you to where your reflexes fail under friction.
> A low score (1 or 2) is not a failure; it is your highest-leverage growth target for Part I.
`
  },
  {
    code: 'Part I Intro',
    title: 'Find & Observe Overview',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'Part I trains observation before generation. Distinguish what is actually present from what you hope or assume is present.',
    keyMentalModel: 'Observation Precedes Direction: You cannot direct a machine to generate what you cannot perceive yourself.',
    targetModalityId: 'm2',
    tags: ['part-1', 'observation', 'perception', 'foundations'],
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
    theoryExpansion: `
> [!important] Preserving Serendipity Capital
> If every sensation, walk, and book is immediately drafted into a project pitch, your perception narrows to what is currently useful. 
> Non-instrumental attention exercises the perceptual muscle without instrumental anxiety.
`
  },
  {
    code: 'Module 4',
    title: 'Diagnostic Vision & The 5 Levels',
    partNumber: 1,
    layer: 1,
    layerName: 'Capability & Observation',
    summary: 'The top-down diagnostic ladder. Never optimize a lower level while a higher level remains broken.',
    keyMentalModel: 'Top-Down Causality: Intent -> Structure -> Perceptual Effect -> Construction -> Surface.',
    targetModalityId: 'm2',
    tags: ['diagnostic-vision', 'ladder', 'top-down', 'causality'],
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
    theoryExpansion: `
> [!warning] Scaffolding Removal Warning
> Passing Gate 1 removes the Diagnostic Ladder from standard view in Part II. You must have internalized the hierarchy so you diagnose without needing the checklist in front of you.
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
    targetModalityId: 'logs',
    tags: ['provenance', 'ethics', 'copyright', 'records'],
    theoryExpansion: `
> [!important] Beyond Compliance
> Provenance records don't just satisfy copyright; they document what decisions were authored by human judgment vs generated by algorithms.
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
    theoryExpansion: `
> [!warning] Scaffolding Removal in Part III
> In Part III, standardized brief templates are removed. You will write bespoke specifications directly tailored to your pipeline architecture.
`
  },
  {
    code: 'Module 8',
    title: 'Pipeline Thinking & Systems',
    partNumber: 3,
    layer: 2,
    layerName: 'Independence & Systems',
    summary: 'Mapping variables, failure points, and predictable multi-stage generation pipelines.',
    keyMentalModel: 'The pipeline is the artwork; outputs are instances.',
    targetModalityId: 'm4',
    tags: ['pipelines', 'variables', 'failure-points', 'systems'],
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
    theoryExpansion: `
> [!important] The Calibration Discipline
> Guessing after seeing the result is hindsight bias. You must lock your prediction and percentage confidence *before* clicking generate.
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
    theoryExpansion: `
> [!important] Taste is Trainable
> Moving from "I like this" to "This succeeds because mechanism X satisfies criterion Y for audience Z".
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
    theoryExpansion: `
> [!important] The Revision vs Re-brief Fork
> Revisions fix local execution and surface polish. If structure or premise is broken, stop revising and issue a new brief.
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
    theoryExpansion: `
> [!important] The Final Horizon
> When you enter a studio with no client, no teacher, and no deadline, do you know what is worth making?
`
  },
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
  } else {
    const lookupPrefix = m.code.split(' & ')[0];
    raw = getSection(lookupPrefix);
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

export const CORE_READINGS: CoreReading[] = ` + JSON.stringify(readings, null, 2) + `;

export function getReadingByCode(code: string): CoreReading | undefined {
  if (!code) return undefined;
  const clean = code.trim().toLowerCase();
  return CORE_READINGS.find((r) => {
    const rCode = r.code.toLowerCase();
    return rCode === clean || clean.startsWith(rCode) || rCode.startsWith(clean);
  });
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
console.log('Successfully wrote src/lib/data/core-readings.ts with ' + readings.length + ' rich modules!');
