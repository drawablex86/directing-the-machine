// Drill Registry — Directing the Machine
// Each drill maps to one or more daily curriculum tasks and includes a full 1-rep execution protocol.

export interface DrillRep {
  step: number;          // 1, 2, 3, etc.
  label: string;         // short action label
  instruction: string;   // what to actually do
  duration: string;      // e.g. "30 sec", "2–5 min"
}

export interface DrillDifficulty {
  warmup: string;       // easier version for first attempt
  standard: string;     // normal version
  harder: string;       // increase when >80% pass rate
  hardest: string;      // maximum constraint version
}

export interface Drill {
  id: string;                   // e.g. 'zero-adjective-linter'
  title: string;                // display name
  category: 'observation' | 'problem-finding' | 'diagnostic' | 'visual' | 'writing' | 'pipeline' | 'calibration' | 'judgment' | 'collaboration';
  targetSkill: string;          // one-line skill being trained
  modalityId: string;           // which studio tab: 'm0' | 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6' | 'm7'
  moduleRef: string;            // e.g. 'Module 1', 'Module 2'
  repDuration: string;          // how long one rep takes
  repCount: string;             // recommended reps: '5–10'
  successCriterion: string;     // binary pass/fail criterion
  repProtocol: DrillRep[];      // step-by-step 1-rep execution
  difficulty: DrillDifficulty;
  surface: string;              // where to do the drill: 'In-app textarea', 'Sketchbook', etc.
  commonFailures: string[];     // what goes wrong most often
  exampleInput: string;         // concrete example to start from
  examplePass: string;          // what a passing rep looks like
  exampleFail: string;          // what a failing rep looks like and why
  weeks: number[];              // which curriculum weeks this drill is active: [1, 2]
}

export const DRILLS: Drill[] = [
  {
    id: 'zero-adjective-linter',
    title: 'Zero-Adjective Observation',
    category: 'observation',
    targetSkill: 'Describe structural properties without evaluative shortcuts',
    modalityId: 'm2',
    moduleRef: 'Module 1',
    repDuration: '5–8 min',
    repCount: '5–10',
    successCriterion: 'Written description passes the adjective linter with zero flagged words',
    repProtocol: [
      { step: 1, label: 'Choose subject', instruction: 'Select one image, paragraph of text, or physical object to describe. Do not choose something familiar — unfamiliarity forces structural looking.', duration: '30 sec' },
      { step: 2, label: 'Write description', instruction: 'Write 3–5 sentences describing only what is structurally present: masses, proportions, edges, rhythms, spatial relationships, word counts, sentence lengths. No opinions. No comparisons. No adjectives that evaluate rather than describe.', duration: '3–5 min' },
      { step: 3, label: 'Lint check', instruction: 'Paste your description into the Adjective Linter tool in M2 Studio. Check for flagged words. Common flags: beautiful, striking, powerful, weak, good, bad, interesting, boring, elegant, harsh.', duration: '30 sec' },
      { step: 4, label: 'Compare result', instruction: 'PASS = zero flags. FAIL = any flag remains. If FAIL: rewrite only the flagged sentence — do not rewrite everything. Replace the evaluative word with a structural descriptor.', duration: '1 min' },
      { step: 5, label: 'Adjust & log', instruction: 'Log: PASS or FAIL. If FAIL, note the specific word that broke the rule and what structural replacement you found. Move to next rep with a new subject.', duration: '30 sec' }
    ],
    difficulty: {
      warmup: 'Describe a simple geometric object (a mug, a chair, a cube) — minimal visual complexity, no people or narrative.',
      standard: 'Describe an AI-generated image or a photograph of a scene. The scene should have human presence or emotional content.',
      harder: 'Describe a complex emotional scene (protest, grief, celebration) using only structural terms. The test is whether a structural description still communicates the scene\'s tension without adjectives.',
      hardest: 'Describe a piece of AI-generated prose (a paragraph of text). Isolate its structural moves — sentence length distribution, claim/evidence ratio, hedge word count — without any evaluative vocabulary.'
    },
    surface: 'In-app M2 Studio → Adjective Linter tab. Or: write in any text editor and manually check.',
    commonFailures: [
      'Writing "powerful composition" — replace with "two large masses of equal visual weight dominate the left half of the frame"',
      'Writing "the voice feels confident" — replace with "declarative sentences average 12 words; zero hedging verbs in 8 consecutive sentences"',
      'Rewriting the entire description when only one word was flagged — isolate and fix only the flagged sentence',
      'Confusing structural adjectives ("vertical", "diagonal", "narrow") with evaluative adjectives — structural descriptors are allowed'
    ],
    exampleInput: 'An AI-generated image of a lone figure standing at the edge of a cliff at sunset.',
    examplePass: 'A single vertical mass occupies the right third of the frame. The figure\'s outline terminates where the cliff edge begins, creating a hard diagonal boundary. The lower two-thirds of the image contain progressively darker values. The sky mass is three times the height of the figure mass. No horizontal forces compete with the dominant vertical-to-diagonal movement.',
    exampleFail: 'The figure looks lonely and powerful against the beautiful dramatic sunset. The composition is striking with the strong contrast between the tiny person and the vast dramatic sky.',
    weeks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'five-in-thirty',
    title: '5-in-30 Problem Funnel',
    category: 'problem-finding',
    targetSkill: 'Locate 5 candidate problems from one context within 30 minutes',
    modalityId: 'm1',
    moduleRef: 'Module 2',
    repDuration: '6 min',
    repCount: '5 (across one 30-minute session)',
    successCriterion: 'Framed problem states a specific tension (not a topic) with identifiable stakes',
    repProtocol: [
      { step: 1, label: 'Enter context', instruction: 'Choose your input context: a walk, a conversation you overheard, a document, a dataset, a physical space, or a website. You have 3 minutes to observe before writing anything.', duration: '3 min' },
      { step: 2, label: 'Notice', instruction: 'Write one thing that drew your attention. Be specific: not "the crowd" but "the specific way a person positioned their phone to avoid glare."', duration: '1 min' },
      { step: 3, label: 'Frame as tension', instruction: 'Convert the observation into a problem statement using this structure: "The tension between [X] and [Y] creates a condition worth investigating because [stakes]." X and Y must be in genuine opposition.', duration: '1 min' },
      { step: 4, label: 'Check: topic or problem?', instruction: 'Test: Is this a topic ("loneliness") or a problem ("the gap between physical proximity and psychological accessibility in public transit spaces")? A problem has two forces in tension. A topic is just a subject. If it\'s a topic, reframe.', duration: '30 sec' },
      { step: 5, label: 'Mark & move', instruction: 'PASS = genuine tension + identifiable stakes. FAIL = topic disguised as a problem. Log the result and move immediately to the next observation. Do not refine — keep moving.', duration: '30 sec' }
    ],
    difficulty: {
      warmup: 'Frame one problem from your own work process or daily routine. You know the domain well — this reduces the friction of finding the tension.',
      standard: 'Frame 5 problems from one 30-minute walk or observation session in an unfamiliar area.',
      harder: 'Frame problems from a domain you know nothing about: read one 800-word article and find 3 tensions within the material itself.',
      hardest: 'Frame 3 structurally distinct problems in 10 minutes from a single source. Distinct means: different modes (Solve vs. Reveal vs. Explore), different stakeholders, different levels of abstraction.'
    },
    surface: 'Physical notebook or text editor. Use M1 Studio to log and save each problem with full metadata after the session.',
    commonFailures: [
      'Writing topics instead of tensions: "climate anxiety" is a topic; "the gap between scientific urgency and individual behavioral agency" is a tension',
      'Making stakes too vague: "it matters to people" does not pass; "it determines whether individuals experience agency or paralysis in high-stakes decisions" does',
      'Stopping at the first good problem and refining it instead of moving to the next rep',
      'Choosing problems that are too large to begin today — scale the problem until it has a specific starting action'
    ],
    exampleInput: '30-minute walk through a commercial district at morning rush hour.',
    examplePass: 'The tension between the city\'s investment in public seating infrastructure and the social norms that prevent individuals from using it during peak hours creates a condition worth investigating because it reveals how designed space and behavioral convention can operate in direct opposition.',
    exampleFail: 'Urban loneliness and how the city affects people\'s mental health.',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'diagnostic-ladder-sequencer',
    title: 'Diagnostic Ladder Sequencer',
    category: 'diagnostic',
    targetSkill: 'Identify the highest unresolved level in a piece of work before touching lower levels',
    modalityId: 'm2',
    moduleRef: 'Module 4',
    repDuration: '7–10 min',
    repCount: '5–7',
    successCriterion: 'Diagnosis names a specific level, a specific decision, a testable intervention, and a binary acceptance condition',
    repProtocol: [
      { step: 1, label: 'First encounter', instruction: 'View or read the work once without stopping. Do not diagnose yet. Write one sentence describing your immediate response — what you felt or noticed first.', duration: '1 min' },
      { step: 2, label: 'State likely intention', instruction: 'Write one sentence: "This work appears to be trying to [X]." This prevents you from diagnosing against your own preferences rather than the work\'s stated goals.', duration: '1 min' },
      { step: 3, label: 'Audit from the top', instruction: 'Start at Level 1 (Purpose/Intent). Ask: Is this level resolved? If YES, move to Level 2. If NO, stop here. Work downward until you find the first unresolved level. Do not skip levels.', duration: '3 min' },
      { step: 4, label: 'Name the decision', instruction: 'Name the specific decision that created the problem. Not "the composition is wrong" but "the focal point is placed at dead center, creating visual stasis rather than directional movement."', duration: '1 min' },
      { step: 5, label: 'Write canonical sentence', instruction: 'Write the diagnosis in this exact format: "The highest unresolved level is [Level]. The decision causing the problem is [Decision]. I would test [specific change] next. I would accept the result if [binary criterion]."', duration: '2 min' }
    ],
    difficulty: {
      warmup: 'Diagnose a piece of your own recent work — you already know the intention, which removes one variable.',
      standard: 'Diagnose an AI-generated image or paragraph you have not seen before. Run the full 5-step protocol.',
      harder: 'Diagnose a peer\'s work without knowing their intention. You must infer the intention from the work itself before applying the ladder.',
      hardest: 'Diagnose 3 works in 20 minutes — one visual, one written, one from an unfamiliar medium (audio, spatial, code architecture). Use the same 5-step protocol for all three.'
    },
    surface: 'Use M2 Studio → Diagnostic Ladder tab to build the canonical sentence. Run the first encounter with any reference image or text.',
    commonFailures: [
      'Starting at Level 5 or 6 (surface polish, clarity) when the problem is at Level 1 or 2 (purpose, premise)',
      'Diagnosing against personal preference: "I don\'t like this style" is not a diagnostic statement',
      'Naming the symptom instead of the decision: "the image lacks depth" vs "the value structure uses three competing focal points of equal weight, preventing hierarchy"',
      'Proposing a vague intervention: "fix the composition" vs "move the primary mass to occupy the upper-left quadrant and reduce the competing right-side mass by 40%"'
    ],
    exampleInput: 'An AI-generated short story opening: three paragraphs of weather and furniture description before any human action appears.',
    examplePass: 'The highest unresolved level is Structure. The decision causing the problem is opening with environmental description before establishing human stakes, which makes the reader wait for the tension without knowing what to wait for. I would test moving the paragraph that contains the first human action (the wife\'s silence at breakfast) to the opening sentence. I would accept the result if a reader can identify the central tension within the first two sentences.',
    exampleFail: 'The writing is boring and slow. The story doesn\'t grab you. It needs to be more exciting from the start.',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'massing-sprint',
    title: 'Visual Massing Sprint',
    category: 'visual',
    targetSkill: 'See 3–5 large shapes before detail — reduce any image to its major mass structure',
    modalityId: 'm2',
    moduleRef: 'Module V1',
    repDuration: '4–6 min',
    repCount: '8–12',
    successCriterion: 'Massing sketch reads clearly at thumbnail size and preserves the focal hierarchy of the source',
    repProtocol: [
      { step: 1, label: 'View reference', instruction: 'Look at the reference image at full size for exactly 5 seconds. Then remove it from view (minimize window, turn away, or use a blank screen timer).', duration: '5 sec' },
      { step: 2, label: 'Sketch from memory', instruction: 'In the Massing Canvas (M2 Studio) or a physical sketchbook: draw only large shapes. 3–5 masses maximum. No detail, no contour, no rendering. Use solid shapes only. You have 90 seconds.', duration: '90 sec' },
      { step: 3, label: 'Compare', instruction: 'Reveal the original. Compare your sketch\'s mass arrangement to the source. Ask: (1) Did the focal hierarchy survive? (2) Did the dominant directional axis survive? (3) Are the relative proportions of masses approximately correct?', duration: '1 min' },
      { step: 4, label: 'Mark result', instruction: 'PASS = focal hierarchy and dominant axis are preserved. FAIL = you drew details instead of masses, OR the focal point is in a different location. Note what your memory dropped.', duration: '30 sec' },
      { step: 5, label: 'New subject', instruction: 'Move to a new reference image immediately. Do not refine your sketch — the point is volume, not quality. Consecutive reps with different images build the perceptual library.', duration: '30 sec' }
    ],
    difficulty: {
      warmup: 'Use a simple still-life photograph — clear subject, clean background, obvious focal point.',
      standard: 'Use an AI-generated image or complex photograph with multiple subjects and spatial depth.',
      harder: 'Flash the image for only 2 seconds (instead of 5) before sketching from memory.',
      hardest: 'Flash for 1 second, then sketch masses AND write a one-sentence description of the dominant directional axis from memory.'
    },
    surface: 'Sketchbook (preferred for physical habit-building) or M2 Studio → Massing Canvas tab. Any drawing surface works — the point is the perceptual exercise, not the artifact.',
    commonFailures: [
      'Drawing contours and details instead of filled masses — force yourself to draw closed shapes only',
      'Starting the sketch before removing the reference from view',
      'Spending more than 90 seconds on the sketch — the time constraint is the constraint',
      'Discarding reps that feel "wrong" — the wrong sketch that shows what you missed is more valuable than a careful correct one'
    ],
    exampleInput: 'A photograph of a crowded market scene with a central awning, a table, scattered figures, and a bright sky opening.',
    examplePass: 'A sketch with 5 shapes: a diagonal dark mass (awning), a horizontal light mass (table), a vertical dense mass (crowd), a small dark accent (shadow under table), and a large light mass (sky). The eye naturally goes to the sky opening first, then down the diagonal.',
    exampleFail: 'A sketch showing facial features on the figures, individual items on the table, and the text on a sign — all detail, no mass structure.',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'sentence-surgery',
    title: 'Sentence Surgery',
    category: 'writing',
    targetSkill: 'Rewrite one sentence five ways, each producing a measurably different reader effect',
    modalityId: 'm3',
    moduleRef: 'Module W1',
    repDuration: '8–12 min',
    repCount: '5',
    successCriterion: 'All 5 rewrites are structurally distinct and each achieves a different reader stance or temporal effect',
    repProtocol: [
      { step: 1, label: 'Select sentence', instruction: 'Choose one sentence from AI-generated text, your own draft, or a published source. It should be 15–40 words. Paste it as your starting point.', duration: '1 min' },
      { step: 2, label: 'Rewrite ×5', instruction: 'Produce 5 rewrites of the same sentence. Each must achieve a different effect: (1) Compressed — under 8 words, same claim. (2) Fragmented — split into 3 short sentences. (3) Question — shift to interrogative. (4) Inverted — flip subject and object. (5) Subordinated — bury the main claim in a dependent clause.', duration: '6–8 min' },
      { step: 3, label: 'Test each', instruction: 'For each version, ask: Does this version advance the argument OR change what the reader feels? If a version does neither, it fails. Cross it out and try again.', duration: '2 min' },
      { step: 4, label: 'Name the mechanism', instruction: 'For each passing version, write one word naming what changed: rhythm, pace, emphasis, stance, suspense, weight, intimacy, distance.', duration: '1 min' },
      { step: 5, label: 'Mark & log', instruction: 'PASS = 4+ of 5 versions are structurally distinct and each achieves a named effect. FAIL = versions sound different but produce the same reader experience. Log: how many versions passed and what the dominant mechanism was.', duration: '30 sec' }
    ],
    difficulty: {
      warmup: 'Rewrite a sentence from your own writing — you know the intention, so the test is purely structural.',
      standard: 'Rewrite a sentence from AI-generated text — test whether the rewrite recovers human directional intent.',
      harder: 'Rewrite a sentence from a domain you don\'t normally write in (legal, technical, scientific) while preserving its informational claim.',
      hardest: 'Rewrite a sentence 7 ways (not 5). Versions 6 and 7 must violate a convention (e.g., sentence starts with "And" or uses a colon to create a list where prose was before). State what the violation achieves.'
    },
    surface: 'Any text editor. In-app: use the Write step textarea in M3 studio. Or use a physical notebook — handwriting the rewrites forces slower deliberate engagement.',
    commonFailures: [
      'Producing versions that sound different but carry the same rhythm and reader stance',
      'Using synonyms instead of structural changes — replacing "said" with "stated" is not a structural rewrite',
      'Fragmented version that loses the original claim instead of compressing it',
      'Not testing whether the question version actually shifts reader stance — some questions are rhetorical and preserve the declarative stance unchanged'
    ],
    exampleInput: 'The design of public spaces shapes how individuals perceive their relationship to the collective.',
    examplePass: '(1) Compressed: "Public space designs the self." (2) Fragmented: "Public spaces have designs. Those designs shape people. People then feel their place in crowds differently." (3) Question: "Does the design of public spaces decide how isolated or connected we feel?" (4) Inverted: "How individuals perceive their relationship to the collective is shaped by the design of public spaces." (5) Subordinated: "While many factors influence social belonging, it is the design of public spaces that most directly shapes individual perception of collective identity."',
    exampleFail: 'Five versions that all say the same thing in slightly different words with no structural change in rhythm, emphasis, or reader stance.',
    weeks: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'predict-then-run',
    title: 'Predict-Then-Run',
    category: 'calibration',
    targetSkill: 'Record a prediction with stated confidence before running a model, then compare against actual output',
    modalityId: 'm4',
    moduleRef: 'Module 9',
    repDuration: '10–15 min',
    repCount: '5',
    successCriterion: 'Prediction is specific enough to be falsifiable; confidence is calibrated (not always 50% or 95%)',
    repProtocol: [
      { step: 1, label: 'Choose variable', instruction: 'Identify one specific variable you are about to change in a prompt, pipeline, or workflow: a temperature setting, a keyword, a constraint, a style reference, a negative prompt, a seed.', duration: '1 min' },
      { step: 2, label: 'Write prediction', instruction: 'Before running anything, write: "I predict that changing [variable] will result in [specific observable change] because [causal mechanism]." The prediction must be specific enough that you can call it TRUE or FALSE after seeing the output.', duration: '2 min' },
      { step: 3, label: 'State confidence', instruction: 'Write a confidence percentage (0–100%). Rules: 50% means you genuinely have no idea. 90%+ means you would bet on it. 70% is a reasonable informed guess. Do not default to round numbers unless you genuinely mean them.', duration: '30 sec' },
      { step: 4, label: 'Run and compare', instruction: 'Run the generation or operation. Compare the actual output against your prediction. Was your prediction TRUE or FALSE? Was your confidence appropriate?', duration: '3–8 min' },
      { step: 5, label: 'Log the error', instruction: 'PASS = prediction was specific (not "it will look different") and the post-result confidence assessment was honest. FAIL = prediction was too vague to evaluate, OR you didn\'t update your mental model. Log: what surprised you and what mechanism you misunderstood.', duration: '1 min' }
    ],
    difficulty: {
      warmup: 'Predict the output of a simple prompt change you have made before. Use a system you know well.',
      standard: 'Predict the output of a prompt variable change in a system you have used but don\'t deeply understand.',
      harder: 'Predict the output of a change in an unfamiliar system or model. State your reasoning explicitly.',
      hardest: 'Make 5 predictions about a model you have never used before its first run. Compare all 5 after a single session.'
    },
    surface: 'Any AI generation tool, prompting interface, or workflow system. Use the Calibration Log in M4 Studio to record predictions and outcomes.',
    commonFailures: [
      'Predictions that are too vague to evaluate: "it will look more interesting" vs "the figure will move to the background plane and lose the cinematic depth-of-field blur"',
      'Defaulting to 50% confidence for every prediction — 50% means genuine ignorance, not epistemic humility',
      'Not running the comparison — the comparison is the entire point of the drill',
      'Writing the prediction after seeing the output (confirmation bias trap)'
    ],
    exampleInput: 'A prompt for an image generation model: "portrait of a woman reading in a library." You are about to add "low-angle shot" as a camera instruction.',
    examplePass: 'Prediction: "Adding low-angle shot will shift the camera below the figure, making the bookshelves appear to tower above her and creating a more claustrophobic feeling. Confidence: 75%." Actual: Camera shifted down, shelves now dominant, figure appears smaller — the towering effect is present but the feeling is more awe than claustrophobia. Update: low-angle in interior spaces reads as grandeur, not claustrophobia, unless the ceiling is visible.',
    exampleFail: 'Prediction: "It will look different." Confidence: 50%.',
    weeks: [5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'compression',
    title: 'Writing Compression',
    category: 'writing',
    targetSkill: 'Identify what matters by compressing text progressively without losing the premise',
    modalityId: 'm3',
    moduleRef: 'Module W2',
    repDuration: '15 min',
    repCount: '3–5',
    successCriterion: 'Each compression stage loses words but retains the core claim; the 30-word version still contains the premise',
    repProtocol: [
      { step: 1, label: 'Select passage', instruction: 'Choose a 400–600 word passage: your own writing, AI-generated text, or a published piece. Count the words. This is your starting point.', duration: '1 min' },
      { step: 2, label: 'Compress to 50%', instruction: 'Reduce to approximately 200–300 words. Rules: the core claim must survive. Every removed sentence must be genuinely redundant, not just shortcuttable. Do not rewrite — cut only.', duration: '4 min' },
      { step: 3, label: 'Compress to 20%', instruction: 'Reduce to approximately 80–120 words. The premise and primary supporting logic must be visible. If the compression fails the premise, you have identified what the piece actually relies on.', duration: '3 min' },
      { step: 4, label: 'Compress to 5%', instruction: 'Reduce to 20–30 words. This is the premise sentence. If you cannot state it in 30 words, the piece may not have a clear premise. Write the failure as a finding.', duration: '2 min' },
      { step: 5, label: 'Audit what disappeared', instruction: 'PASS = premise survives compression through all 3 stages. FAIL = compression at any stage destroys the claim, revealing the piece was held together by prose style rather than argument. Log what you lost and whether it was structural or decorative.', duration: '2 min' }
    ],
    difficulty: {
      warmup: 'Compress a piece you wrote yourself — you know the intention, so you can protect what matters.',
      standard: 'Compress a piece of AI-generated text. Identify whether the piece has a genuine premise under the generated fluency.',
      harder: 'Compress a piece from an unfamiliar domain (medical, legal, scientific) — you cannot rely on domain familiarity.',
      hardest: 'Compress and then expand: after the 30-word version, expand back to 300 words using only new specificity — no padding, no repetition.'
    },
    surface: 'Text editor. Word count tool required. The drill is manual — do not use AI to compress, as that defeats the diagnostic purpose.',
    commonFailures: [
      'Rewriting instead of cutting — compression is not editing, it is surgical removal',
      'Protecting stylistic phrases at the cost of the premise',
      'Treating a 50% cut as "done" when the 5% version reveals the premise was never stated',
      'Using the AI to compress the text — this collapses the feedback loop that the drill is designed to create'
    ],
    exampleInput: 'A 500-word AI-generated essay on the importance of creative constraints.',
    examplePass: 'The 30-word version reads: "Constraints reduce the decision space, forcing choices that distinguish the author\'s intent from the available defaults. Without constraints, generation defaults to median consensus." This premise survives all three compression stages.',
    exampleFail: 'The 30-word version loses the premise entirely — the piece had no central claim, only loosely organized observations.',
    weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'positionality-check',
    title: 'Positionality Check',
    category: 'problem-finding',
    targetSkill: 'Honestly evaluate your standing to pursue a candidate problem before committing to it',
    modalityId: 'm1',
    moduleRef: 'Module 2',
    repDuration: '5–8 min',
    repCount: '5',
    successCriterion: 'Either: standing is named with specific justification, OR the problem is refused with a principled reason',
    repProtocol: [
      { step: 1, label: 'State the problem', instruction: 'Write the candidate problem as a tension statement. Use the format: "The tension between [X] and [Y] creates a condition worth investigating because [stakes]."', duration: '1 min' },
      { step: 2, label: 'Identify whose territory', instruction: 'Ask: Whose story, domain, or lived experience does this problem live inside? Name the specific community, institution, or field. Be honest about whether you are inside it, adjacent to it, or outside it.', duration: '1 min' },
      { step: 3, label: 'Name your mode', instruction: 'Select one: From (inside the experience), With (in dialogue, with consent), For (in service of an identified community), About (observing from outside), Over (speaking as if inside — always refuse this). Write one sentence justifying your mode selection.', duration: '1 min' },
      { step: 4, label: 'Run the hard test', instruction: 'Ask: "What would the people inside this problem say about my pursuing it?" Write the honest answer — not the flattering one. If you cannot answer this question, that is itself diagnostic.', duration: '2 min' },
      { step: 5, label: 'Decide and log', instruction: 'PASS = you have named your standing with specific justification, OR you have refused the problem with a principled reason (not avoidance). FAIL = you claimed standing without justification, OR you refused without a principled reason. Log the decision.', duration: '1 min' }
    ],
    difficulty: {
      warmup: 'Run the check on a problem clearly inside your own experience — this establishes the pattern before applying it to harder cases.',
      standard: 'Run the check on a problem adjacent to your experience — you are not inside it but have some relationship to it.',
      harder: 'Run the check on a problem from an entirely different cultural, socioeconomic, or geographic context than your own.',
      hardest: 'Run the check on a problem where the most commercially attractive interpretation requires speaking Over rather than With or From. Defend your refusal or justify your access.'
    },
    surface: 'Physical notebook or M1 Studio → Problem-Finding flow. The drill is reflective — you are auditing your relationship to a problem, not generating new ones.',
    commonFailures: [
      'Claiming standing because you are "interested in" the topic — interest is not standing',
      'Refusing every problem from outside your immediate experience — positionality is not a prohibition on cross-cultural work; it is a discipline of honesty about the relationship',
      'Skipping the "hard test" question because it is uncomfortable — the discomfort is the information',
      'Conflating "About" and "From" — if you are studying a community from outside it, you are About, not From'
    ],
    exampleInput: 'Candidate problem: "The way indigenous plant knowledge is documented versus how it is actually transmitted within communities."',
    examplePass: 'Whose territory: Indigenous communities holding this knowledge. My position: Outside — I am a researcher with access to published documentation but not to the transmission practices themselves. Mode: About. Hard test answer: Community members would likely say I should not create an artifact claiming to represent the transmission practice; I could document the gap between official documentation and community knowledge without speaking for the practice itself. Decision: Proceed as About, with explicit acknowledgment of the observational distance.',
    exampleFail: 'I\'m interested in this topic and think I could do it justice. I\'ll proceed.',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'blind-ranking',
    title: 'Blind Ranking',
    category: 'judgment',
    targetSkill: 'Rank a set of works by explicit criteria without knowing their source, then compare to your source-informed ranking',
    modalityId: 'm5',
    moduleRef: 'Module 10',
    repDuration: '20–30 min',
    repCount: '2–3 per session',
    successCriterion: 'Ranking is justified by criteria (not provenance); any shift in ranking after source reveal is explained by a named mechanism',
    repProtocol: [
      { step: 1, label: 'Assemble without labels', instruction: 'Collect 4–6 works in the same category (e.g., 4 AI-generated images + 2 human-made, or 3 AI paragraphs + 3 human). Remove all labels indicating source. Print, or use separate browser tabs with titles hidden.', duration: '3 min' },
      { step: 2, label: 'Write criteria first', instruction: 'Before ranking anything, write 3 explicit criteria you will use to evaluate. Criteria must be structural and checkable: not "feels authentic" but "the premise tension is specific to this subject and could not have come from a different subject."', duration: '3 min' },
      { step: 3, label: 'Rank blindly', instruction: 'Rank all 4–6 works using only your stated criteria. Write one sentence per work explaining the ranking. Do not look up sources or context.', duration: '8–12 min' },
      { step: 4, label: 'Reveal sources', instruction: 'Reveal which works were human-made and which were AI-generated. Does your ranking change? If yes: name the mechanism that changed — what did provenance-knowledge add that criteria alone could not detect?', duration: '3 min' },
      { step: 5, label: 'Log the gap', instruction: 'PASS = you can articulate why the ranking held OR changed with a named mechanism. FAIL = ranking changed but you cannot explain why, OR you cannot articulate what your criteria actually measured. Log the gap between criteria and intuition.', duration: '2 min' }
    ],
    difficulty: {
      warmup: 'Rank 4 works you know well, with labels visible. Practice the criteria-writing step without the blind condition.',
      standard: 'Rank 4 works (2 human, 2 AI) with labels hidden. Standard blind condition.',
      harder: 'Rank 6 works with 3 rounds: blind ranking, source reveal, then re-ranking with sources visible. Compare all three orderings.',
      hardest: 'Rank 6 works blind. Then have a peer rank the same works blind. Compare your rankings — where they diverge, identify whether the divergence is criteria disagreement or taste divergence.'
    },
    surface: 'Any reference management tool or simply printed pages / separate browser tabs. Use M5 Studio to log criteria and rankings.',
    commonFailures: [
      'Writing criteria after ranking (rationalizing intuition rather than applying criteria)',
      'Using provenance as a criterion: "this one feels more authentic" is using source knowledge, not a structural criterion',
      'Changing rankings after source reveal without being able to explain what knowledge the reveal added',
      'Criteria that are too vague to apply: "quality" or "effectiveness" are not criteria'
    ],
    exampleInput: 'Four paragraphs of descriptive prose: two written by published authors, two by an AI. Source labels removed.',
    examplePass: 'Criteria: (1) The claim survives compression to 15 words. (2) The metaphor is specific to the subject, not interchangeable. (3) At least one sentence reverses or complicates the preceding one. Ranking: #1 (most criteria met), #2, #3, #4 (fewest). After reveal: ranking held — human authorship does not predict which criteria are met.',
    exampleFail: 'Ranking that changes after source reveal, with explanation: "oh, I can tell this one is human now — it just feels more real." No criterion was applied.',
    weeks: [7, 8, 9, 10, 11, 12]
  },
  {
    id: 'frame-shift',
    title: 'Frame Shift',
    category: 'problem-finding',
    targetSkill: 'Reframe a topic or subject as a genuine problem by adding tension and stakes',
    modalityId: 'm1',
    moduleRef: 'Module 2',
    repDuration: '10 min',
    repCount: '5',
    successCriterion: 'Reframed version has explicit tension between two forces and named stakes; topic version is clearly distinguished from problem version',
    repProtocol: [
      { step: 1, label: 'Receive topic', instruction: 'Take one topic word or phrase: "urban density", "AI art", "burnout", "biodiversity", "remote work". Write it at the top of the page. This is not a problem — it is a subject.', duration: '30 sec' },
      { step: 2, label: 'Find the tension', instruction: 'Ask: What forces are in genuine opposition inside this topic? Look for: a design vs. a use pattern, an ideal vs. a reality, a short-term gain vs. a long-term cost, an institutional logic vs. an individual experience. Write at least 2 candidate tensions.', duration: '3 min' },
      { step: 3, label: 'Select strongest tension', instruction: 'Choose the tension that has: (a) two specific, named opposing forces — not "people vs. systems" but "residents\' need for social continuity vs. developers\' incentive to maximize turnover"; (b) a domain where it actually produces consequences.', duration: '2 min' },
      { step: 4, label: 'Name the stakes', instruction: 'Write: "This tension matters because if it remains unresolved, [specific consequence] occurs for [specific group]." Vague stakes ("it affects people") fail. Specific stakes ("it determines whether long-term residents can remain in neighborhoods they built") pass.', duration: '2 min' },
      { step: 5, label: 'Write the problem statement', instruction: 'Combine into one sentence: "The tension between [Force A] and [Force B] creates a condition in [domain] worth [mode]ing because [stakes]." PASS = problem statement would survive a 30-second scrutiny from a critical peer. FAIL = sounds like a topic in problem-statement clothing.', duration: '2 min' }
    ],
    difficulty: {
      warmup: 'Frame shift a topic from your own professional field — you already know the tensions.',
      standard: 'Frame shift a topic given at random from a domain you know moderately well.',
      harder: 'Frame shift a topic from a domain you know nothing about. You must find the tension from first principles rather than domain knowledge.',
      hardest: 'Take a topic and produce 5 structurally distinct problem statements from it — each using a different mode (Solve, Investigate, Reveal, Reframe, Explore). All 5 must have different stakes.'
    },
    surface: 'Physical notebook or text editor. No AI assistance — the exercise trains your tension-finding reflex, which is defeated if the AI finds the tensions for you.',
    commonFailures: [
      'Producing a problem statement that is still a topic: "AI art and authenticity" is a topic; "the tension between automated generation and the institutional definition of artistic authorship" is a tension',
      'Stakes that are too abstract: "it matters philosophically" fails; "it determines whether artists can legally claim copyright over works produced with AI assistance" passes',
      'Identifying only one side of the tension: a problem requires two specific forces pulling in opposite directions',
      'Conflating the problem with the solution approach'
    ],
    exampleInput: 'Topic: "remote work"',
    examplePass: 'The tension between organizations\' need for synchronous coordination and individuals\' preference for autonomous schedule management creates a condition in distributed knowledge work worth investigating because it determines whether organizations will mandate return-to-office at the cost of distributed talent retention, or develop new coordination protocols that sacrifice neither.',
    exampleFail: 'Remote work and how it affects employees\' mental health and work-life balance.',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'm0-attention-sprint',
    title: 'Non-Instrumental Attention Sprint',
    category: 'observation',
    targetSkill: 'Observe and notice structural phenomena without seeking project utility or prompt material',
    modalityId: 'm0',
    moduleRef: 'Module 0 / Module 3',
    repDuration: '15 min',
    repCount: '1',
    successCriterion: '1-sentence note records something genuinely encountered without pre-existing intent or analytical classification',
    repProtocol: [
      { step: 1, label: 'Unplug & step outside', instruction: 'Put phone on airplane mode. Walk or sit in an unfamiliar spot with zero goals or prompts.', duration: '1 min' },
      { step: 2, label: 'Non-instrumental look', instruction: 'Observe without trying to "use" what you see for a project, blog post, or image generation. Watch spatial shifts, light bounce, or mundane human rhythms.', duration: '12 min' },
      { step: 3, label: 'Single-sentence record', instruction: 'Write one plain sentence answering: "What did I encounter that I was not looking for?" Forbid analytical tags, hashtags, or project ideas.', duration: '2 min' }
    ],
    difficulty: {
      warmup: 'Observe physical objects on your desk for 5 minutes without touching them.',
      standard: '15-minute walk in an ordinary commercial or transit area without looking at screens.',
      harder: 'Sit in an uncomfortable, chaotic public place for 20 minutes maintaining receptive attention.',
      hardest: 'Notice structural omissions (what is absent) rather than what is visually prominent.'
    },
    surface: 'Physical pocket notebook or M0 Protected Attention input',
    commonFailures: [
      'Turning the observation into a prompt idea immediately ("Ooh, I could render that in Midjourney")',
      'Using evaluative adjectives instead of reporting what was encountered',
      'Writing multi-paragraph analytical essays instead of a single quiet sentence'
    ],
    exampleInput: '15-minute walk near rail station',
    examplePass: 'The shadow of the overpass cuts the pedestrian queue in half diagonally every time the signal turns green.',
    exampleFail: 'I saw great potential for a moody cyberpunk film scene with gritty urban lighting.',
    weeks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'm0-play-rep',
    title: 'Unstructured Play Rep',
    category: 'observation',
    targetSkill: 'Engage in unstructured creative making with zero brief, no audience, and zero evaluative criteria',
    modalityId: 'm0',
    moduleRef: 'Module 0',
    repDuration: '20–30 min',
    repCount: '1',
    successCriterion: 'Made something with zero intention of sharing, judging, or monetizing; logged only "What did I enjoy?"',
    repProtocol: [
      { step: 1, label: 'Disable all rubrics', instruction: 'Lock all diagnostic ladders and briefs. Pick an absurd, silly, or purposeless material or tool.', duration: '1 min' },
      { step: 2, label: 'Unstructured play', instruction: 'Draw badly on purpose, write nonsense dialogue, or combine incompatible systems until the timer rings. Do not self-correct.', duration: '20–25 min' },
      { step: 3, label: 'Single-line joy log', instruction: 'Record exactly one line: "What did I enjoy?" Do not analyze it or convert it into a task.', duration: '2 min' }
    ],
    difficulty: {
      warmup: 'Doodle on scrap paper with a pen without lifting it from the page.',
      standard: 'Combine two contradictory generative tools or media to produce something deliberately useless.',
      harder: 'Write dialogue between two inanimate objects without trying to make it clever or funny.',
      hardest: 'Spend 30 minutes following a completely unviable idea without rescuing it.'
    },
    surface: 'Physical sketchbook, scrap paper, or M0 Play timer',
    commonFailures: [
      'Secretly hoping the play will turn into a flagship project deliverable',
      'Judging the output as "good" or "bad"',
      'Skipping play because it feels unproductive'
    ],
    exampleInput: 'Free play session with drawing tool',
    examplePass: 'Enjoyed scribbling heavy black grease-pencil diagonals across yesterday\'s receipts without looking at the page.',
    exampleFail: 'Created 4 concept art thumbnails that I can repurpose for Project 3.',
    weeks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'm4-causal-ablation',
    title: 'Causal Variable Sensitivity Ablation',
    category: 'pipeline',
    targetSkill: 'Isolate single pipeline variables and calibrate causal sensitivity thresholds',
    modalityId: 'm4',
    moduleRef: 'Module 8',
    repDuration: '10 min',
    repCount: '5',
    successCriterion: 'Identifies the precise inflection point where a single variable change causes structural output failure',
    repProtocol: [
      { step: 1, label: 'Choose one variable', instruction: 'Select exactly one pipeline parameter (e.g. CFG scale, denoise strength, temperature, sentence length constraint). Hold all other variables constant.', duration: '1 min' },
      { step: 2, label: 'Predict inflection point', instruction: 'Predict at what exact numerical value the output will collapse or cross a phase transition. Record confidence %.', duration: '2 min' },
      { step: 3, label: 'Run 5-step sweep', instruction: 'Generate 5 iterations stepping across the variable range (e.g. temp: 0.2, 0.5, 0.7, 0.9, 1.2).', duration: '4 min' },
      { step: 4, label: 'Locate boundary failure', instruction: 'Identify the exact step where the model output degraded or lost intent.', duration: '2 min' },
      { step: 5, label: 'Update mental model', instruction: 'Write 1 sentence: "Above [value], the variable causes [failure mode] because [mechanism]."', duration: '1 min' }
    ],
    difficulty: {
      warmup: 'Test temperature sweeps on a simple summarization prompt.',
      standard: 'Test ControlNet weight or Denoise strength thresholds in an image pipeline.',
      harder: 'Test negative prompt token weights to find where negative weighting inverts intent.',
      hardest: 'Test multi-stage chain-of-thought prompt dependencies where upstream drift causes downstream collapse.'
    },
    surface: 'Local pipeline workbench, ComfyUI, API playground, or M4 Pipeline Lab',
    commonFailures: [
      'Changing two variables at once, destroying causal attribution',
      'Failing to log the pre-run prediction before seeing the output',
      'Ignoring subtle structural degradation in favor of obvious artifacting'
    ],
    exampleInput: 'Denoising strength in img2img pass (0.35 to 0.75)',
    examplePass: 'Above 0.55 denoise, figure proportions drift into generic mannequin symmetry because the latent noise overcomes initial structural massing.',
    exampleFail: '0.7 looked cool and dreamlike.',
    weeks: [5, 6, 7, 8]
  },
  {
    id: 'm5-taste-builder',
    title: '5-Part Taste Formula Composition',
    category: 'judgment',
    targetSkill: 'Express aesthetic judgment using complete causal mechanics rather than isolated preference',
    modalityId: 'm5',
    moduleRef: 'Module 10',
    repDuration: '8 min',
    repCount: '5',
    successCriterion: 'Completes all 5 parts: Preference + Explicit Criteria + Reference Class + Concrete Mechanism + Stated Purpose',
    repProtocol: [
      { step: 1, label: 'Select candidate artifact', instruction: 'Choose an image, prose excerpt, or layout.', duration: '30 sec' },
      { step: 2, label: 'State gut preference', instruction: 'Write your immediate instinctive preference (Like or Dislike).', duration: '30 sec' },
      { step: 3, label: 'State reference class & purpose', instruction: 'Define: what class of work is this, and what is its human/artistic purpose?', duration: '2 min' },
      { step: 4, label: 'Name criteria & mechanism', instruction: 'What observable structural mechanism causes the work to succeed or fail against its purpose?', duration: '3 min' },
      { step: 5, label: 'Synthesize formula', instruction: 'Combine: "In [Reference Class], I judge this [Pass/Fail] for [Purpose] because [Mechanism] satisfies/violates [Criteria]."', duration: '2 min' }
    ],
    difficulty: {
      warmup: 'Evaluate an artifact from your most familiar genre.',
      standard: 'Evaluate an artifact in a genre you personally dislike, finding whether it succeeds at its stated purpose.',
      harder: 'Evaluate a work that you love aesthetically but that fails its functional purpose.',
      hardest: 'Evaluate two superficially similar AI images and state the exact mechanical difference that separates the master from the slop.'
    },
    surface: 'M5 Taste Curation Arena or physical notebook',
    commonFailures: [
      'Judging "Is this good?" in isolation from purpose',
      'Stopping at preference without identifying the physical mechanism',
      'Confusing high polish with structural fitness'
    ],
    exampleInput: 'Minimalist editorial portrait',
    examplePass: 'In contemporary editorial portraiture, I judge this passing for conveying emotional isolation because the low-key value cluster in the bottom-left third leaves 70% negative darkness, which forces the viewer\'s eye to search without relief.',
    exampleFail: 'I like it because it looks moody and beautiful.',
    weeks: [7, 8, 9, 10]
  },
  {
    id: 'm5-reverse-brief',
    title: 'Reverse-Direction Challenge',
    category: 'judgment',
    targetSkill: 'Transform an artifact\'s observed flaw into an authored strength by rewriting the brief around it',
    modalityId: 'm5',
    moduleRef: 'Module 10',
    repDuration: '10 min',
    repCount: '3',
    successCriterion: 'Authors a brief where the specific rejected flaw becomes the essential causal driver of the new work',
    repProtocol: [
      { step: 1, label: 'Take rejected output', instruction: 'Select an image or paragraph you discarded because of an obvious "error" (e.g. flat lighting, awkward rhythm, harsh banding).', duration: '1 min' },
      { step: 2, label: 'Isolate exact flaw', instruction: 'Describe the structural defect with zero adjectives: "Sentence lengths do not vary; 6 consecutive 4-word clauses."', duration: '2 min' },
      { step: 3, label: 'Formulate new premise', instruction: 'Ask: In what situation would this exact property be the most powerful aesthetic choice possible?', duration: '3 min' },
      { step: 4, label: 'Write reverse brief', instruction: 'Draft a 1-paragraph brief where this specific quality is a mandatory negative constraint for achieving a new purpose.', duration: '4 min' }
    ],
    difficulty: {
      warmup: 'Reverse an oversaturated, neon AI color mistake into an arcade dystopia brief.',
      standard: 'Reverse an awkward, stiff prose rhythm into an interrogation or bureaucratic log brief.',
      harder: 'Reverse a distorted anatomical artifact into a psychological horror or bodily alienation brief.',
      hardest: 'Reverse a complete pipeline collapse into an experimental structural asset.'
    },
    surface: 'M5 Taste Arena (Reverse Tab) or text scratchpad',
    commonFailures: [
      'Excusing the flaw in the original work rather than building a genuinely new brief',
      'Choosing generic premises that don\'t rely directly on the isolated defect'
    ],
    exampleInput: 'Rejected text with monotonous 4-word repetitive sentences',
    examplePass: 'Flaw: Rigid 4-word staccato sentences. New Brief: An automated air traffic controller voice recording during cabin decompression; monotonic 4-word cadence enforces administrative calm while disaster unfolds.',
    exampleFail: 'New Brief: A story about a robot.',
    weeks: [7, 8, 9, 10]
  },
  {
    id: 'm6-refusal-pressure',
    title: '5-Mode Refusal Under Pressure',
    category: 'collaboration',
    targetSkill: 'Deliver a principled, structured refusal to an unviable or unethical creative directive',
    modalityId: 'm6',
    moduleRef: 'Module 13 / Appendix F',
    repDuration: '8 min',
    repCount: '5',
    successCriterion: 'Categorizes refusal under one of 5 modes (Ethical, Positional, Technical, Intentional, Slop) with non-defensive rationale',
    repProtocol: [
      { step: 1, label: 'Receive client pressure', instruction: 'Take a toxic or unviable prompt (e.g. "Clone this living artist\'s style", "Make it look like Apple but in 2 hours", "Just use AI to write 50 articles today").', duration: '30 sec' },
      { step: 2, label: 'Select refusal mode', instruction: 'Choose: Ethical | Positional | Technical | Intentional | Slop.', duration: '30 sec' },
      { step: 3, label: 'Identify core violation', instruction: 'State what foundational principle or boundary the request breaches.', duration: '2 min' },
      { step: 4, label: 'Draft clean refusal', instruction: 'Write a calm, authoritative 2-sentence response refusing the request without apology or moralizing, and proposing a viable alternative.', duration: '4 min' },
      { step: 5, label: 'Check defensiveness', instruction: 'PASS = response is professional, firm, and preserves working relationship. FAIL = passive aggressive, apologetic, or preachy.', duration: '1 min' }
    ],
    difficulty: {
      warmup: 'Refuse an explicit copyright violation request.',
      standard: 'Refuse a "make it pop" aesthetic demand that destroys focal hierarchy.',
      harder: 'Refuse a high-paying client requesting deepfake likeness generation.',
      hardest: 'Refuse an internal collaborator when you have lower institutional authority.'
    },
    surface: 'M6 Direction Studio or text editor',
    commonFailures: [
      'Apologizing ("I\'m really sorry but I can\'t...") which invites negotiation',
      'Sounding morally superior instead of stating professional standards',
      'Refusing without offering a constructive alternative'
    ],
    exampleInput: 'Client: "Can you generate a model holding our product that looks exactly like this famous influencer?"',
    examplePass: 'Mode: Ethical Refusal. Response: "We do not generate identifiable likenesses of individuals without direct consent and commercial rights. Instead, we can build a custom, proprietary character model calibrated specifically for your brand identity."',
    exampleFail: 'Sorry, that is illegal and AI ethics guidelines forbid me from doing that.',
    weeks: [9, 10, 11, 12]
  },
  {
    id: 'm6-feedback-translation',
    title: 'Stakeholder Surface-to-Root Feedback Translation',
    category: 'collaboration',
    targetSkill: 'Translate surface symptom feedback into underlying creative needs and select correct directorial actions',
    modalityId: 'm6',
    moduleRef: 'Module 12',
    repDuration: '6 min',
    repCount: '5',
    successCriterion: 'Correctly maps surface demand to root anxiety, and selects one of 5 actions: Apply, Adapt, Alternative, Push Back, Re-Brief',
    repProtocol: [
      { step: 1, label: 'Read surface request', instruction: 'Take a common client symptom: "Make the logo bigger", "Can it be more exciting?", "Change the blue to orange".', duration: '30 sec' },
      { step: 2, label: 'Diagnose underlying anxiety', instruction: 'Ask: What is the stakeholder genuinely feeling or fearing that caused them to say this? (e.g. fear of illegibility, fear of being ignored).', duration: '2 min' },
      { step: 3, label: 'Select directorial action', instruction: 'Choose: Apply | Adapt | Propose Alternative | Push Back | Re-Brief.', duration: '1 min' },
      { step: 4, label: 'Write directorial response', instruction: 'Formulate your answer addressing the root need rather than arguing about the surface symptom.', duration: '2.5 min' }
    ],
    difficulty: {
      warmup: 'Translate "Make the font bigger".',
      standard: 'Translate "It feels a bit cold / corporate".',
      harder: 'Translate "I showed this to my partner and they didn\'t get it".',
      hardest: 'Translate contradictory feedback from two executive stakeholders.'
    },
    surface: 'M6 Direction Studio or notebook',
    commonFailures: [
      'Taking surface feedback literally and ruining the composition',
      'Arguing with the client\'s taste instead of addressing their commercial anxiety',
      'Applying a surface patch instead of triggering a Re-Brief when the premise is broken'
    ],
    exampleInput: 'Stakeholder: "Make the headline bigger and put exclamation points."',
    examplePass: 'Root Anxiety: Stakeholder fears the offer is not urgent enough to drive conversion. Action: Propose Alternative. Response: "Increasing headline size crowds the primary CTA button. Instead, let\'s increase contrast between the offer banner and background, and lead with the numerical value prop."',
    exampleFail: 'I made the font 20pt larger and added two exclamation marks.',
    weeks: [9, 10, 11, 12]
  },
  {
    id: 'm7-position-gap',
    title: '10-Piece Untitled Position Gap Deduction',
    category: 'judgment',
    targetSkill: 'Detect the gap between your stated artistic intentions and the actual commitments revealed by your work',
    modalityId: 'm7',
    moduleRef: 'Module 15',
    repDuration: '15 min',
    repCount: '1',
    successCriterion: 'Identifies at least one concrete divergence between written position and inferred position from untitled artifacts',
    repProtocol: [
      { step: 1, label: 'Review 10 untitled works', instruction: 'Gather 10 recent artifacts you produced. Strip all prompts, titles, and explanations.', duration: '2 min' },
      { step: 2, label: 'Infer position blind', instruction: 'Look at them as if created by a stranger. What commitments repeatedly appear? What is repeatedly refused?', duration: '5 min' },
      { step: 3, label: 'Compare to written position', instruction: 'Place your written artist statement side-by-side with the inferred position.', duration: '3 min' },
      { step: 4, label: 'Isolate the gap', instruction: 'Write: "My written position claims [X], but my artifacts actually commit to [Y]. This gap reveals [borrowed ambition / craft avoidance / authentic reflex]."', duration: '5 min' }
    ],
    difficulty: {
      warmup: 'Compare 5 short paragraphs you wrote against your stated writing goal.',
      standard: 'Review 10 image generations across 3 weeks without looking at prompts.',
      harder: 'Have a peer perform the blind deduction on your 10 works and compare their inference with your statement.',
      hardest: 'Perform this on works produced under tight client deadlines to see what compromises your reflexes made.'
    },
    surface: 'M7 Blank Sheet Studio or physical desk display',
    commonFailures: [
      'Projecting your original intention onto the works instead of looking at what is physically there',
      'Defending the gap rather than treating it as diagnostic information'
    ],
    exampleInput: '10 recent architectural renders',
    examplePass: 'Written position claims to investigate human vulnerability in urban spaces. Inferred position reveals zero humans, sterile symmetrical glass facades, and dramatic dusk skies. Gap: Borrowed ambition from corporate architectural rendering; avoided the difficulty of rendering human messiness.',
    exampleFail: 'The works match my intention perfectly.',
    weeks: [11, 12, 13, 14, 15, 16, 17, 18]
  },
  {
    id: 'm7-removal-test',
    title: 'Cross-Medium Synthesis Subtraction Rep',
    category: 'judgment',
    targetSkill: 'Test whether a multi-modal work achieves true synthesis or is merely an image with decorative text',
    modalityId: 'm7',
    moduleRef: 'Module 17',
    repDuration: '10 min',
    repCount: '3',
    successCriterion: 'Removal of either medium collapses the core argument, proving the presence of a "Third Thing"',
    repProtocol: [
      { step: 1, label: 'Select hybrid work', instruction: 'Take a paired image and text artifact (visual essay, comic panel, editorial layout).', duration: '1 min' },
      { step: 2, label: 'Subtract the image', instruction: 'Read the text alone. Does the argument or narrative stand completely on its own? If yes: the image is merely decorative.', duration: '3 min' },
      { step: 3, label: 'Subtract the text', instruction: 'View the image alone. Is the meaning fully resolved? If yes: the text was merely redundant captioning.', duration: '3 min' },
      { step: 4, label: 'Evaluate the third thing', instruction: 'PASS = neither medium alone delivers the meaning; the friction between them creates the third thing. FAIL = one medium is superfluous.', duration: '3 min' }
    ],
    difficulty: {
      warmup: 'Test a simple meme or photo caption.',
      standard: 'Test an editorial layout or hybrid visual essay spread.',
      harder: 'Test a complex narrative video or interactive multimedia document.',
      hardest: 'Redesign a failed hybrid work so that text and image are in necessary tension.'
    },
    surface: 'M7 Studio (Synthesis Tab) or printed spreads',
    commonFailures: [
      'Writing text that describes what the image already shows',
      'Using an image that merely illustrates the literal words of the text',
      'Accepting redundant pairing because both elements look polished individually'
    ],
    exampleInput: 'Photograph of empty boardroom + text: "Meeting held at 2 PM."',
    examplePass: 'Photograph of abandoned boardroom with scattered papers + text: "The vote was unanimous." Neither alone conveys the corporate collapse; the tension between the pristine empty room and the finality of the vote creates the Third Thing.',
    exampleFail: 'Photo of a sunset + text: "The sun set over the ocean." (Total redundancy).',
    weeks: [11, 12, 13, 14, 15, 16, 17, 18]
  }
];

export function getDrillById(id: string): Drill | undefined {
  return DRILLS.find(d => d.id === id);
}

export function getDrillsByCategory(category: Drill['category']): Drill[] {
  return DRILLS.filter(d => d.category === category);
}

export function getDrillsByWeek(weekNum: number): Drill[] {
  return DRILLS.filter(d => d.weeks.includes(weekNum));
}

export function getDrillsByModality(modalityId: string): Drill[] {
  return DRILLS.filter(d => d.modalityId === modalityId);
}
