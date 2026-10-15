export type HelpCategory =
	| 'ladders'
	| 'lint'
	| 'studio-ux'
	| 'concepts'
	| 'modalities'
	| 'protocols'
	| 'byok-llm';

export interface HelpCategoryMeta {
	id: HelpCategory;
	name: string;
	shortName: string;
	description: string;
	color: string;
}

export const HELP_CATEGORIES: HelpCategoryMeta[] = [
	{
		id: 'ladders',
		name: 'Diagnostic Ladders & Hierarchies',
		shortName: 'Ladders',
		description: 'Top-down diagnostic structures enforcing intent over superficial polish.',
		color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
	},
	{
		id: 'lint',
		name: 'Lint Checks & Observation',
		shortName: 'Lint Checks',
		description: 'Anti-adjective linters, structural observation, and decision audits.',
		color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
	},
	{
		id: 'studio-ux',
		name: 'Studio UI & Daily Routine',
		shortName: 'Studio UI',
		description: 'The deliberate practice loop, timers, ADHD focus horizons, and stop gates.',
		color: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
	},
	{
		id: 'concepts',
		name: 'Core Concepts & Theses',
		shortName: 'Concepts',
		description: 'Theoretical foundations: judgment gaps, taste infrastructure, and standing.',
		color: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
	},
	{
		id: 'modalities',
		name: 'Studio Modalities (M0–M7)',
		shortName: 'Modalities',
		description: 'The 8 dedicated training environments from Baseline to Blank Sheet.',
		color: 'text-orange-400 border-orange-500/30 bg-orange-500/10'
	},
	{
		id: 'protocols',
		name: 'Protocols, Rubrics & Refusal',
		shortName: 'Protocols',
		description: 'Directorial refusal modes, stakeholder triage, and transfer tests.',
		color: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
	},
	{
		id: 'byok-llm',
		name: 'BYOK & Client Inference',
		shortName: 'BYOK & AI',
		description: 'Client-side inference, prompt registry, model parameters, and keys.',
		color: 'text-teal-400 border-teal-500/30 bg-teal-500/10'
	}
];

export interface HelpEntry {
	id: string; // URL-safe slug e.g. 'diagnostic-ladder'
	term: string; // Display title
	category: HelpCategory;
	aliases: string[]; // Synonyms for loose search
	summary: string; // 1-sentence synopsis for list cards
	plainDefinition: string; // "What is it?"
	whatItDoes: string; // "What does it do?"
	howItHelps: string; // "How does it help?"
	studioTouchpoint: string; // Where in the studio you find/use it
	example?: {
		context: string;
		beforeOrWrong?: string;
		afterOrRight?: string;
		explanation: string;
	};
	relatedTermIds: string[];
	tags: string[];
	externalDocLink?: {
		label: string;
		url: string;
	};
}

export const HELP_KNOWLEDGE_BASE: HelpEntry[] = [
	// ==========================================
	// 1. DIAGNOSTIC LADDERS & HIERARCHIES
	// ==========================================
	{
		id: 'diagnostic-ladder',
		term: 'Top-Down Diagnostic Ladder',
		category: 'ladders',
		aliases: ['ladder', 'ladders', 'diagnostic ladder', 'universal ladder', 'hierarchy', 'rung', 'levels'],
		summary: 'A 7-level structural hierarchy used to identify the root cause of creative failure before adjusting surface polish.',
		plainDefinition:
			'A top-down ranking of creative decisions from foundational premise down to surface finish. It organizes any creative piece into levels: Purpose (1), Premise/Claim (2), Structure (3), Audience Effect (4), Internal Logic (5), Local Execution (6), and Surface Polish (7).',
		whatItDoes:
			'Forces you to audit a flawed piece of work from Level 1 downward. You locate the highest level where a defect exists and stop there, diagnosing that causal decision before touching anything below it.',
		howItHelps:
			'Prevents "polishing a corpse"—spending hours adjusting lighting, adjectives, button colors, or prose cadence on a work whose underlying concept or structure is fundamentally broken.',
		studioTouchpoint: 'M2 Diagnostic Vision Lab (Diagnostic Ladder tab) & Daily Practice Step 5 (Diagnose).',
		example: {
			context: 'An AI image looks muddy and unengaging.',
			beforeOrWrong: 'Adding prompt tags like "8k, ray tracing, unreal engine, volumetric fog" (Level 7: Polish).',
			afterOrRight:
				'Diagnosing Level 2 (Premise) or Level 3 (Structure/Composition): the focal point is dead-center with competing silhouettes. Shifting masses and clearing negative space.',
			explanation: 'Fixing the structural massing creates instant clarity; adding render polish only made the clutter brighter.'
		},
		relatedTermIds: ['highest-unresolved-level', 'canonical-diagnostic-sentence', 'ladder-inversion-test', 'visual-ladder', 'writing-ladder'],
		tags: ['ladder', 'hierarchy', 'diagnosis', 'top-down', 'structure', 'triage'],
		externalDocLink: { label: 'Appendix B: Diagnostic Ladders', url: '/app?tab=manual&appendix=app-b' }
	},
	{
		id: 'highest-unresolved-level',
		term: 'Highest Unresolved Level Rule',
		category: 'ladders',
		aliases: ['highest unresolved', 'cardinal rule', 'ladder rule', 'stop at defect'],
		summary: 'The iron rule of direction: never optimize a lower rung while a higher rung remains defective.',
		plainDefinition:
			'The fundamental operating rule of the Diagnostic Ladder: if Level 2 (Premise) is unconvincing, tweaking Level 6 (Phrasing) or Level 7 (Texture) is wasted labor.',
		whatItDoes:
			'Halts execution at the first broken level of the hierarchy and mandates that interventions occur strictly at or above that level.',
		howItHelps:
			'Saves massive amounts of creative energy. It prevents the common trap of infinite prompt re-rolls or micro-edits when the fundamental premise is missing tension or standing.',
		studioTouchpoint: 'Enforced automatically by the M2 Diagnostic Ladder Auditor and the M2 Studio interface.',
		example: {
			context: 'Evaluating a 500-word essay that feels boring despite clever vocabulary.',
			beforeOrWrong: 'Swapping nouns and editing sentence rhythms in paragraph 3.',
			afterOrRight:
				'Identifying that the core claim (Level 2) has no opposing counter-force or real stakes. Rewriting the premise statement.',
			explanation: 'Once the premise had genuine tension, the paragraphs practically wrote themselves.'
		},
		relatedTermIds: ['diagnostic-ladder', 'canonical-diagnostic-sentence', 'm2-diagnostic-vision'],
		tags: ['rule', 'ladder', 'triage', 'cardinal rule', 'efficiency'],
		externalDocLink: { label: 'Appendix B: Diagnostic Ladders', url: '/app?tab=manual&appendix=app-b' }
	},
	{
		id: 'canonical-diagnostic-sentence',
		term: 'Canonical Diagnostic Sentence',
		category: 'ladders',
		aliases: ['diagnostic sentence', 'canonical sentence', 'diagnosis format', 'highest unresolved is'],
		summary: 'A standardized 4-part formula that translates vague aesthetic discomfort into actionable, checkable engineering hypotheses.',
		plainDefinition:
			'A rigid 4-clause sentence template: "The highest unresolved level is [X]. The decision causing the problem is [Y]. I would test [Z] next. I would accept the result if [W]."',
		whatItDoes:
			'Forces you to explicitly name: (1) the ladder level, (2) the specific causal decision, (3) the smallest testable intervention, and (4) the concrete falsification/acceptance criterion.',
		howItHelps:
			'Eliminates hand-waving and subjective vibes. You stop saying "this doesn\'t feel right" and start making precise causal interventions that can be proven right or wrong.',
		studioTouchpoint: 'M2 Studio Diagnosis formulation and Drill Step 5 in the Daily Practice Loop.',
		example: {
			context: 'A portfolio case study header feels flat.',
			beforeOrWrong: '"The hero section feels kind of weak and doesn\'t pop."',
			afterOrRight:
				'"The highest unresolved level is Structure (3). The decision causing the problem is stacking 4 headline lines without a dominant visual focal point. I would test reducing the headline to 12 words and boosting contrast by 2 stops. I would accept the result if the reader eye fixation pauses on the value metric first."',
			explanation: 'The canonical sentence produces an immediate, testable experiment.'
		},
		relatedTermIds: ['diagnostic-ladder', 'highest-unresolved-level', 'm2-diagnostic-vision'],
		tags: ['sentence', 'formula', 'diagnosis', 'precision', 'hypothesis'],
		externalDocLink: { label: 'Appendix B: Diagnostic Ladders', url: '/app?tab=manual&appendix=app-b' }
	},
	{
		id: 'visual-ladder',
		term: 'Visual Diagnostic Ladder',
		category: 'ladders',
		aliases: ['visual ladder', 'image ladder', 'visual hierarchy', 'composition ladder'],
		summary: 'The 9-level top-down hierarchy specific to images, layouts, typography, and visual systems.',
		plainDefinition:
			'A specialized diagnostic ladder tailored for visual craft: 1. Intent $\\rightarrow$ 2. Composition $\\rightarrow$ 3. Value/Major Shape Massing $\\rightarrow$ 4. Gesture/Action $\\rightarrow$ 5. Construction $\\rightarrow$ 6. Proportion $\\rightarrow$ 7. Subject Structure $\\rightarrow$ 8. Material $\\rightarrow$ 9. Rendering/Surface.',
		whatItDoes:
			'Directs your eye to examine composition and black-and-white tonal massing long before looking at colors, details, skin textures, or render styles.',
		howItHelps:
			'Guarantees that images read strongly at thumbnail scale and command viewer attention across physical or digital space before any decorative styling is applied.',
		studioTouchpoint: 'M2 Diagnostic Vision (Canvas & Visual Mode) and Project 1 / Project 7.',
		relatedTermIds: ['diagnostic-ladder', 'writing-ladder', 'massing-canvas'],
		tags: ['visual', 'composition', 'massing', 'value', 'rendering']
	},
	{
		id: 'writing-ladder',
		term: 'Writing Diagnostic Ladder',
		category: 'ladders',
		aliases: ['writing ladder', 'text ladder', 'prose ladder', 'editorial hierarchy'],
		summary: 'The 9-level top-down hierarchy specific to essays, briefs, scripts, and arguments.',
		plainDefinition:
			'A specialized diagnostic ladder for written thought: 1. Intent $\\rightarrow$ 2. Claim/Premise $\\rightarrow$ 3. Argument/Structure $\\rightarrow$ 4. Voice/Stance $\\rightarrow$ 5. Rhythm $\\rightarrow$ 6. Sentence/Paragraph Logic $\\rightarrow$ 7. Clarity $\\rightarrow$ 8. Mechanics $\\rightarrow$ 9. Polish.',
		whatItDoes:
			'Ensures you test whether your claim actually has opposing stakes and logical continuity before fiddling with thesaurus synonyms or fixing passive voice.',
		howItHelps:
			'Prevents eloquent slop—well-written, articulate prose that says absolutely nothing of substance.',
		studioTouchpoint: 'M2 Studio Writing audits, M3 7-Layer Brief Lab, and Blog Essay evaluations.',
		relatedTermIds: ['diagnostic-ladder', 'visual-ladder', 'sentence-surgery'],
		tags: ['writing', 'prose', 'argument', 'claim', 'editorial']
	},
	{
		id: 'ladder-inversion-test',
		term: 'Ladder Inversion Test',
		category: 'ladders',
		aliases: ['inversion test', 'ladder inversion', 'reverse ladder audit', 'lipstick on a pig'],
		summary: 'An adversarial test checking whether you or an AI model applied cosmetic polish to conceal an unresolved high-level defect.',
		plainDefinition:
			'A diagnostic stress-test where you deliberately strip away rendering, ornamentation, colors, or fancy phrasing to see if the underlying structure can stand on its own.',
		whatItDoes:
			'Converts the image to 2-tone silhouettes or summarizes an essay into pure syllogism logic. If the piece collapses without its decoration, it fails the test.',
		howItHelps:
			'Protects you from being fooled by high-fidelity generative AI outputs that look visually stunning on first glance but are conceptually hollow or physically impossible.',
		studioTouchpoint: 'M2 Diagnostic Vision & Part I Transfer Test 5.',
		relatedTermIds: ['diagnostic-ladder', 'massing-canvas', 'highest-unresolved-level'],
		tags: ['inversion', 'stress-test', 'structure', 'anti-slop']
	},

	// ==========================================
	// 2. LINT CHECKS & OBSERVATION TOOLS
	// ==========================================
	{
		id: 'lint-check',
		term: 'Lint Check',
		category: 'lint',
		aliases: ['lint', 'linting', 'linter check', 'observation lint', 'scan text'],
		summary: 'The rapid 30-second inspection step in deliberate practice drills where descriptions are vetted for subjective adjectives.',
		plainDefinition:
			'A rapid automated or manual inspection pass that scans your written observations, briefs, or diagnoses for forbidden evaluative words (e.g. "nice", "powerful", "beautiful", "messy", "clean", "compelling").',
		whatItDoes:
			'Flags every subjective adjective and calculates an objective adherence score. A rep only passes if the text achieves zero forbidden flags.',
		howItHelps:
			'Builds perceptual discipline. It forces your brain to replace vague value judgments with verifiable physical, geometric, or syntactic metrics.',
		studioTouchpoint: 'M2 Diagnostic Vision (Adjective Linter tab) & Drill Runner Step 3.',
		example: {
			context: 'A student is describing a portrait photo.',
			beforeOrWrong: '"The portrait has an amazing, moody vibe with a striking emotional intensity."',
			afterOrRight:
				'"The key light is positioned 60 degrees above camera left, casting a triangle of light over the right cheekbone while leaving the eye sockets in 3 stops of shadow."',
			explanation: 'The "after" version tells a lighting technician or AI diffusion model exactly what to construct.'
		},
		relatedTermIds: ['zero-adjective-linter', 'semantic-linter', 'surgical-patches'],
		tags: ['lint', 'check', 'adjective', 'observation', 'drill', 'anti-slop'],
		externalDocLink: { label: 'Interactive Live Linter Demo', url: '/#linter' }
	},
	{
		id: 'zero-adjective-linter',
		term: 'Zero-Adjective Observation Linter',
		category: 'lint',
		aliases: ['zero adjective', 'adjective linter', 'adjective-linter', 'regex linter', 'anti-adjective'],
		summary: 'The algorithmic tool that detects evaluative buzzwords and highlights structural replacements.',
		plainDefinition:
			'An in-studio tool containing a comprehensive dictionary of evaluative words across categories: aesthetic praise ("stunning"), vague approval ("good"), emotional shortcuts ("poetic"), and corporate fluff ("innovative").',
		whatItDoes:
			'Instantly underlines violating words with amber badges and offers concrete structural alternatives (e.g., replace "dramatic lighting" with "10:1 contrast ratio" or "hard directional shadow").',
		howItHelps:
			'Transforms subjective taste into directorial language that can be communicated to human collaborators, software engineers, and generative conditioning pipelines.',
		studioTouchpoint: 'Studio M2 Lab (first tab), Homepage Live Linter showcase, and Daily Practice Step 2.',
		relatedTermIds: ['lint-check', 'semantic-linter', 'surgical-patches'],
		tags: ['linter', 'tool', 'regex', 'vocabulary', 'structural']
	},
	{
		id: 'semantic-linter',
		term: 'Semantic Zero-Adjective Linter',
		category: 'lint',
		aliases: ['semantic linter', 'llm linter', 'ai linter', 'contextual linter'],
		summary: 'An advanced AI-powered audit engine that catches subtle, sneaky, or context-dependent evaluative phrasing.',
		plainDefinition:
			'An inference-backed linter that understands linguistic nuances beyond static regex wordlists. It catches hidden subjective assumptions, euphemisms, and passive praise embedded in complex sentences.',
		whatItDoes:
			'Analyzes entire paragraphs, identifies evaluative claims, and emits targeted surgical patch pairs to replace them with concrete formal descriptions.',
		howItHelps:
			'Prevents false confidence when a student manages to avoid obvious words like "beautiful" but still writes vague prose like "the composition breathes with effortless organic vitality".',
		studioTouchpoint: 'M2 Studio → "AI Semantic Audit" button (powered by client-side BYOK).',
		relatedTermIds: ['zero-adjective-linter', 'surgical-patches', 'byok-inference'],
		tags: ['semantic', 'llm', 'byok', 'deep-linter', 'ai']
	},
	{
		id: 'surgical-patches',
		term: 'Surgical Patches Protocol',
		category: 'lint',
		aliases: ['surgical patch', 'patches', 'diff protocol', 'search replace blocks', 'apply replacements'],
		summary: 'A client-side protocol where the LLM emits precise [SEARCH]/[REPLACE] chunks to fix flaws without rewriting your entire text.',
		plainDefinition:
			'A precision prompting and parsing protocol. Instead of asking an AI to "rewrite this entire 1,500-word essay", the model is instructed to emit only surgical string replacement pairs (`[SEARCH]` ... `[REPLACE]`).',
		whatItDoes:
			'Applies localized edits in-place inside your text editor. Your authorial voice, formatting, paragraph breaks, and clean sentences stay 100% untouched.',
		howItHelps:
			'Solves the token-waste and voice-destruction problem of modern AI writing assistants. Token consumption scales with the number of defects rather than document length.',
		studioTouchpoint: 'M2 Semantic Linter → "Apply Structural Replacements (N)" button.',
		example: {
			context: 'A paragraph has 1 evaluative sentence.',
			beforeOrWrong: 'AI generates a generic, smoothed-over 400-word essay destroying the user\'s cadence.',
			afterOrRight:
				'[SEARCH] The layout features an elegant and harmonious typographic hierarchy. [/SEARCH]\n[REPLACE] The layout uses a 3:1 typographic scale with 48pt display headings and 16pt body copy. [/REPLACE]',
			explanation: 'Only the flawed sentence is repaired; the rest of the author\'s original draft is preserved.'
		},
		relatedTermIds: ['semantic-linter', 'm2-diagnostic-vision', 'byok-inference'],
		tags: ['diff', 'patches', 'protocol', 'token-efficient', 'voice-preservation']
	},
	{
		id: 'massing-canvas',
		term: 'Visual Massing Canvas',
		category: 'lint',
		aliases: ['massing canvas', 'massing', 'massing sprint', 'shape canvas', 'silhouette'],
		summary: 'An HTML5 canvas tool where you sketch images reduced to 3–5 solid monochrome shapes within 90 seconds.',
		plainDefinition:
			'A deliberate practice drawing tool with a timed reference flash (5 seconds) and a canvas for blocking in large masses of value (light, midtone, dark) with zero contour outlines.',
		whatItDoes:
			'Hides detail and forces you to perceive only major silhouettes, contrast groupings, and directional vectors.',
		howItHelps:
			'Cures "detail obsession"—the beginner habit of zooming in on eyes, lace, rendering reflections, or button borders before the macro composition is established.',
		studioTouchpoint: 'M2 Diagnostic Vision Lab (Massing Canvas tab) & Visual Drill 1.',
		relatedTermIds: ['visual-ladder', 'lint-check', '1-rep-standard'],
		tags: ['canvas', 'massing', 'drawing', 'silhouette', 'perception']
	},
	{
		id: 'decision-audit',
		term: '6-Question Decision Audit',
		category: 'lint',
		aliases: ['decision audit', 'audit questions', '6 questions', 'directorial audit'],
		summary: 'A diagnostic audit interrogating the causal gap between intent and visible reality.',
		plainDefinition:
			'A battery of 6 diagnostic questions: 1. What was the exact intention? 2. What is physically present? 3. What is the delta? 4. What causal decision created the delta? 5. What single intervention will you test? 6. How will you verify success?',
		whatItDoes:
			'Forces you to systematically account for every divergence between what you wanted and what the machine produced.',
		howItHelps:
			'Transforms passive frustration into rigorous scientific inquiry. You stop blaming the tool and identify the exact parameter or prompt loophole that failed.',
		studioTouchpoint: 'M2 Studio (Decision Audit tab) and Decision Logging workflow.',
		relatedTermIds: ['canonical-diagnostic-sentence', 'hemingway-stop'],
		tags: ['audit', 'questions', 'causality', 'decisions']
	},

	// ==========================================
	// 3. STUDIO UI & DAILY ROUTINE
	// ==========================================
	{
		id: 'todays-practice-loop',
		term: "Today's Practice Loop",
		category: 'studio-ux',
		aliases: ['practice loop', 'daily loop', 'today loop', '8 steps', '8-step loop', 'daily routine'],
		summary: 'The 8-step daily deliberate practice sequence: Read, Practise, Study, Make, Diagnose, Log, Transfer, and Play.',
		plainDefinition:
			'The core daily engine of Directing the Machine. It partitions your creative workday into 8 distinct phases with recommended time allocations, moving from theory into reps, production, diagnosis, and non-instrumental play.',
		whatItDoes:
			'Guides you through the day step-by-step with clear completion checkboxes, active week/day tracking, and atomic focus.',
		howItHelps:
			'Eliminates decision fatigue. You never sit down at your desk wondering what to do next; the pipeline tells you exactly what to read, what drill to run, and when to close your laptop.',
		studioTouchpoint: 'Studio Header (`TodayLoopHeader.svelte`) and `/app?tab=today`.',
		relatedTermIds: ['single-task-horizon', 'ten-minute-log-cap', 'hemingway-stop'],
		tags: ['loop', 'daily', 'routine', '8-step', 'schedule']
	},
	{
		id: 'single-task-horizon',
		term: 'Single-Task Horizon (ADHD Focus Mode)',
		category: 'studio-ux',
		aliases: ['single task', 'horizon', 'focus mode', 'adhd mode', 'adhd focus', 'one task'],
		summary: 'A visual isolation mode that hides future steps and background noise to preserve executive function.',
		plainDefinition:
			'An accessibility-first UI mode designed for neurodivergent practitioners, learners with ADHD, or anyone facing cognitive overload.',
		whatItDoes:
			'Collapses the full 8-step agenda, sidebar references, and upcoming requirements, displaying strictly the single active rep or reading with a prominent completion button.',
		howItHelps:
			'Prevents task paralysis and overwhelming anxiety caused by seeing a mountain of work ahead. You only see what must be done in the next 15–30 minutes.',
		studioTouchpoint: 'Top bar "Focus Horizon" button, or press the "F" key anywhere in the Studio.',
		relatedTermIds: ['todays-practice-loop', 'hemingway-stop', 'learner-preferences'],
		tags: ['adhd', 'focus', 'accessibility', 'clarity', 'horizon']
	},
	{
		id: 'ten-minute-log-cap',
		term: '10-Minute Log Cap & Timer',
		category: 'studio-ux',
		aliases: ['10-minute log', 'log timer', 'log cap', 'anti-theatre', 'logging timer'],
		summary: 'A hard countdown timer that cuts off logging after 10 minutes to prevent productivity theatre.',
		plainDefinition:
			'A dedicated countdown clock in Step 6 (Log) that limits post-practice journaling to exactly 10 minutes.',
		whatItDoes:
			'Counts down from 10:00. Once the timer reaches zero, the logging interface locks or sounds a chime indicating that writing must cease.',
		howItHelps:
			'Stops "logging theatre"—the pernicious tendency to spend an hour crafting poetic reflections about making things instead of actually making things. It forces logs to be concise, structural, and bulleted.',
		studioTouchpoint: 'Daily Practice Step 6 (`TenMinuteLogTimer.svelte`) and `/logs` page.',
		relatedTermIds: ['log-decay-sentinel', 'todays-practice-loop', 'hemingway-stop'],
		tags: ['timer', 'log', 'cap', 'productivity-theatre', 'guardrail']
	},
	{
		id: 'log-decay-sentinel',
		term: 'Log Decay Sentinel',
		category: 'studio-ux',
		aliases: ['log decay', 'decay', 'hollow logging', 'sentinel', 'rote logging'],
		summary: 'An automated diagnostic checking for repetitive, perfunctory, or ceremonial compliance in practice logs.',
		plainDefinition:
			'A quality check that monitors your recent log entries for signs of ritualized compliance—such as repeating the same phrases ("good session", "learned a lot", "standard reps") without noting specific defects or surprises.',
		whatItDoes:
			'Alerts you when logs have ceased to carry genuine thinking and recommends rotating fields or changing log prompts.',
		howItHelps:
			'Maintains log integrity over weeks and months, ensuring your journal serves as an authentic external brain rather than a mindless chore.',
		studioTouchpoint: 'Failure Triage Modal (Failure Mode 4) and Studio Logbook (`/logs`).',
		relatedTermIds: ['ten-minute-log-cap', 'failure-triage-modal'],
		tags: ['decay', 'quality', 'audit', 'journal', 'integrity']
	},
	{
		id: 'reference-drawer',
		term: 'Reference Drawer (Cmd+K)',
		category: 'studio-ux',
		aliases: ['reference drawer', 'drawer', 'cmd+k', 'ctrl+k', 'reference index', 'appendices lookup'],
		summary: 'The just-in-time command palette providing instant access to Appendices A through O and core readings.',
		plainDefinition:
			'A quick-access drawer summoned via hotkey (`⌘K` or `Ctrl+K`) that indexes every field protocol, template, rubric, and reading in the course.',
		whatItDoes:
			'Offers instant fuzzy search over Appendices A–O and allows 1-click reading or protocol copying without navigating away from your active workbench.',
		howItHelps:
			'Upholds Rule 1 of the studio: "Today\'s Practice Loop First, Reference Manual Hidden Until Needed." You consult theory only at the moment of operational need.',
		studioTouchpoint: 'Press `⌘K` or click the "Ref" button in the top bar.',
		relatedTermIds: ['todays-practice-loop', 'appendices-a-o'],
		tags: ['drawer', 'cmd-k', 'lookup', 'protocols', 'hotkey']
	},
	{
		id: 'failure-triage-modal',
		term: 'Failure Triage Modal ("I\'m Stuck")',
		category: 'studio-ux',
		aliases: ["i'm stuck", 'failure modal', 'failure triage', 'stuck', 'failure recovery', 'four-way triage'],
		summary: 'A 4-way diagnostic emergency wizard to recover from Output, Habit, Motivational, or Log Decay failure.',
		plainDefinition:
			'An emergency diagnostic modal for when practice breaks down. It breaks failure into four distinct types rather than treating being stuck as a mysterious personal flaw.',
		whatItDoes:
			'Guides you through targeted triage: (1) Output Failure (work doesn\'t work), (2) Habit Failure (schedule broke), (3) Motivational Failure (emotional exhaustion), or (4) Log Decay (journaling became ritual).',
		howItHelps:
			'Gives you an immediate, non-judgmental protocol to regain momentum within 5 minutes without spiraling or quitting the course.',
		studioTouchpoint: 'Top bar "I\'m Stuck" button (`FailureTriageModal.svelte`).',
		relatedTermIds: ['hemingway-stop', 'principled-abandonment', 'log-decay-sentinel'],
		tags: ['stuck', 'failure', 'recovery', 'triage', 'emergency']
	},
	{
		id: 'hemingway-stop',
		term: 'Hemingway Stop Gate',
		category: 'studio-ux',
		aliases: ['hemingway', 'hemingway stop', 'stop gate', 'closing hook', 'stopping rule'],
		summary: 'The deliberate rule of stopping work when you know the exact first 5-minute action for tomorrow.',
		plainDefinition:
			'Named after Ernest Hemingway\'s practice of always stopping writing when he still knew what was going to happen next. In the studio, you never work until total exhaustion.',
		whatItDoes:
			'Forces you to define tomorrow\'s exact opening 5-minute task (e.g., "Open M2, load anchor #4, draw 3 masses") before you are allowed to declare the day finished.',
		howItHelps:
			'Eliminates morning startup friction. When you sit down tomorrow, you don\'t face a blank screen; you execute an already-decided 5-minute task and glide immediately into deep work.',
		studioTouchpoint: 'Top bar "Stop Gate" button and Daily Practice Step 8 closing hook.',
		relatedTermIds: ['todays-practice-loop', 'principled-abandonment'],
		tags: ['hemingway', 'stop', 'momentum', 'daily', 'habit']
	},
	{
		id: 'principled-abandonment',
		term: 'Principled Abandonment',
		category: 'studio-ux',
		aliases: ['abandonment', 'abandon project', 'principled drop', 'kill project'],
		summary: 'A structured protocol to discard a project when standing, tension, or viability fails, distinct from lazy quitting.',
		plainDefinition:
			'A formal off-ramp procedure to terminate a project that has proven to lack genuine tension, where positionality standing is absent, or where constraints cannot be resolved.',
		whatItDoes:
			'Requires you to document the exact reason for abandonment (e.g., "Positional refusal: lack standing", "Hypothesis disproven: no productive tension") and log what was learned.',
		howItHelps:
			'Removes the shame of stopping while protecting you from sunk-cost fallacy. It differentiates conscious creative triage from undisciplined drift.',
		studioTouchpoint: 'Hemingway Stop Modal → "Principled Abandonment" pathway.',
		relatedTermIds: ['hemingway-stop', 'positionality-compass', '5-mode-refusal'],
		tags: ['abandonment', 'triage', 'sunk-cost', 'discipline']
	},
	{
		id: 'two-axis-quadrant',
		term: 'Two-Axis Assessment Matrix',
		category: 'studio-ux',
		aliases: ['two axis', 'quadrant', '2x2 matrix', 'outcome quality', 'decision quality', 'assessment matrix'],
		summary: 'A 2×2 grid evaluating Outcome Quality against Decision Quality: Mastery, Learning in Progress, Lucky / Unstable, and Failure.',
		plainDefinition:
			'An assessment matrix that cross-examines what you made (Outcome Quality) with how thoughtfully you decided (Decision Quality).',
		whatItDoes:
			'Places work into one of four quadrants: 1. **Mastery** (High Outcome, High Decision), 2. **Learning in Progress** (Low Outcome, High Decision), 3. **Lucky / Unstable** (High Outcome, Low Decision), or 4. **Failure** (Low Outcome, Low Decision).',
		howItHelps:
			'Exposes "Lucky Hits"—when a generative AI model accidentally produces something beautiful despite a sloppy prompt. You learn that unrepeatable flukes do not equal competence.',
		studioTouchpoint: 'Studio Assessment Tab (`/app?tab=assessment`) & Project Evaluations.',
		relatedTermIds: ['twelve-competencies', 'calibration-tracking', 'scaffolding-removal'],
		tags: ['matrix', 'quadrant', 'assessment', 'decision-quality', 'mastery']
	},
	{
		id: 'twelve-competencies',
		term: '12-Competency Progress Radar',
		category: 'studio-ux',
		aliases: ['competencies', 'competency radar', 'radar', '12 competencies', 'baseline radar'],
		summary: 'A visual radar tracking mastery from Not Yet (1) to Transferable (4) across the 12 core faculties of machine direction.',
		plainDefinition:
			'A visual circular radar displaying your proficiency across: Problem-Finding, Positionality, Observation, Premise, Specification, Diagnosis, Curation, Systems, Prediction, Direction, Authorship, and Transfer.',
		whatItDoes:
			'Visualizes your current developmental silhouette and immediately highlights your primary bottleneck competency.',
		howItHelps:
			'Ensures balanced development. Most creators over-index on raw generation (Systems) while lagging behind on Problem-Finding, Diagnosis, or Prediction.',
		studioTouchpoint: 'M0 Baseline Hub and Studio Assessment Tab (`/app?tab=assessment`).',
		relatedTermIds: ['two-axis-quadrant', 'scaffolding-removal', 'm0-practice-contract'],
		tags: ['radar', 'competencies', 'assessment', 'progress', 'baseline']
	},
	{
		id: 'stone-paper-themes',
		term: 'Stone & Paper Visual Themes',
		category: 'studio-ux',
		aliases: ['stone', 'paper', 'themes', 'dark mode', 'light mode', 'kepano palette', 'theme toggle'],
		summary: 'Dual WCAG AAA high-contrast palettes: Stone (volcanic slate with amber glow) and Paper (carbon ink on archival paper).',
		plainDefinition:
			'The custom visual design system of Directing the Machine, inspired by Steph Ango\'s (Kepano) minimalist aesthetics.',
		whatItDoes:
			'Dynamically adjusts background, text contrast, borders, and accent tones across the entire app via CSS tokens.',
		howItHelps:
			'Prevents visual fatigue during multi-hour creative sessions. Paper mode avoids blinding white glare while Stone mode avoids muddy, low-contrast grays.',
		studioTouchpoint: '1-click toggle button in Home & Studio navigation bars, or press "P" to configure.',
		relatedTermIds: ['learner-preferences'],
		tags: ['theme', 'stone', 'paper', 'contrast', 'design-system', 'dark-mode']
	},

	// ==========================================
	// 4. CORE CONCEPTS & THESES
	// ==========================================
	{
		id: 'three-mastery-layers',
		term: 'The 3 Mastery Layers',
		category: 'concepts',
		aliases: ['mastery layers', 'layers', 'layer 1', 'layer 2', 'layer 3', 'capability', 'independence', 'agency'],
		summary: 'The overarching developmental progression: Layer 1 (Capability), Layer 2 (Independence), and Layer 3 (Agency).',
		plainDefinition:
			'The pedagogical backbone of the curriculum: **Layer 1: Capability** (Weeks 1–6, guided practice with full scaffolds), **Layer 2: Independence** (Weeks 7–12, scaffolds removed, self-directed transfer), and **Layer 3: Agency** (Months 4–9, unassigned blank-sheet production).',
		whatItDoes:
			'Governs what assistance the studio provides and signals when you are ready to graduate from exercise-following to autonomous direction.',
		howItHelps:
			'Prevents perpetual student syndrome—becoming dependent on a course, teacher, or prompt library to tell you what to make.',
		studioTouchpoint: 'Displayed prominently in the top bar header ("Layer 1/2/3" badge).',
		relatedTermIds: ['scaffolding-removal', 'blank-sheet-capstone', 'transfer-tests'],
		tags: ['mastery', 'layers', 'pedagogy', 'curriculum', 'growth']
	},
	{
		id: 'scaffolding-removal',
		term: 'Scaffolding Removal Engine',
		category: 'concepts',
		aliases: ['scaffolding', 'scaffolding removal', 'fading', 'scaffolding engine', 'ladder removal'],
		summary: 'The automatic system that hides diagnostic ladders, templates, and guided prompts as you advance through the parts.',
		plainDefinition:
			'A programmatic state machine that progressively removes learning aids: in Part II, diagnostic ladders are hidden by default; in Part III, templates are removed; in Part IV, exercise prompts vanish.',
		whatItDoes:
			'Forces you to reconstruct the frameworks in your own mind and sketchbook rather than leaning on UI crutches.',
		howItHelps:
			'Ensures that by the time you leave the studio, your skills are fully portable and can be executed inside any tool or without any software at all.',
		studioTouchpoint: 'Configured dynamically in `practiceStore.scaffolding` based on `activePart`.',
		relatedTermIds: ['three-mastery-layers', 'transfer-tests', 'blank-sheet-capstone'],
		tags: ['scaffolding', 'fading', 'independence', 'engine', 'portability']
	},
	{
		id: 'judgment-gap',
		term: 'The Judgment Gap',
		category: 'concepts',
		aliases: ['judgment gap', 'taste gap', 'the gap', 'recognizing vs making', 'causal gap'],
		summary: 'The critical difference between recognizing an excellent output and possessing the causal knowledge to direct the machine toward it.',
		plainDefinition:
			'The condition where a creator has developed good taste (they know what looks good or bad) but lacks the structural vocabulary and pipeline understanding to tell the tool how to fix it.',
		whatItDoes:
			'Identifies why beginners resort to frantic re-rolling: they know the output isn\'t right, but because they cannot diagnose the cause, they gamble on random seeds.',
		howItHelps:
			'Points directly to what you must train: causal diagnosis, constraint specification, and variable control.',
		studioTouchpoint: 'Curriculum Part I (Module 1: The Judgment Gap).',
		relatedTermIds: ['slot-machine-output', 'diagnostic-ladder', 'five-theses'],
		tags: ['judgment', 'taste', 'gap', 'direction', 'theory']
	},
	{
		id: 'slot-machine-output',
		term: 'Slot-Machine Output vs. Calibrated Direction',
		category: 'concepts',
		aliases: ['slot machine', 'prompt gambling', 'rerolling', 'calibrated direction', 'anti-slot-machine'],
		summary: 'Contrasting amateur prompt re-rolling with deliberate, constraint-driven machine direction.',
		plainDefinition:
			'Slot-machine output is the behavior of typing vague prompt keywords, clicking "Generate", disliking the result, and clicking "Generate" again in hopes of a lucky roll. Calibrated direction is identifying the exact missing constraint, tuning the pipeline, and predicting the outcome before execution.',
		whatItDoes:
			'Serves as the philosophical warning sign of prompt dependency.',
		howItHelps:
			'Frees you from the dopamine loop of passive generation, transforming you from a consumer of software outputs into an authentic creative director.',
		studioTouchpoint: 'Homepage Contrast Matrix (`/#contrast`) and Module 1 readings.',
		relatedTermIds: ['judgment-gap', 'five-theses', 'calibration-tracking'],
		tags: ['slot-machine', 'prompting', 'direction', 'calibration']
	},
	{
		id: 'five-theses',
		term: 'The 5 Theses of Authorship',
		category: 'concepts',
		aliases: ['5 theses', 'theses', 'theses of authorship', 'five theses', 'doctrine'],
		summary: 'The core doctrine: 1. Execution cost collapsed; 2. Taste is causal infrastructure; 3. Anti-slop requires structural specification; 4. Directing requires standing; 5. Portability over tool fluency.',
		plainDefinition:
			'The foundational manifesto of Directing the Machine that reframes creative work in the era of generative intelligence.',
		whatItDoes:
			'Establishes the philosophical rationale behind every rule, timer, and drill in the studio.',
		howItHelps:
			'Anchors your career in durable human faculties (problem-finding, taste, standing) that will not be automated away by the next model release.',
		studioTouchpoint: 'Homepage Theses Section (`/#theses`) and `index.md`.',
		relatedTermIds: ['judgment-gap', 'positionality-compass', 'taste-formula'],
		tags: ['theses', 'philosophy', 'manifesto', 'authorship', 'doctrine']
	},
	{
		id: 'taste-formula',
		term: '5-Part Taste Formula',
		category: 'concepts',
		aliases: ['taste formula', 'taste parts', 'five part taste', 'taste infrastructure'],
		summary: 'Preference + Criteria + Reference Class + Mechanism + Purpose.',
		plainDefinition:
			'A rigorous decomposition that turns vague subjective taste into defensible infrastructure: **Preference** (what you like) + **Criteria** (what properties you judge) + **Reference Class** (what comparable works you evaluate against) + **Mechanism** (what structural cause produces the effect) + **Purpose** (what function the piece serves).',
		whatItDoes:
			'Forces you to justify every aesthetic reaction with concrete mechanisms rather than claiming "it\'s just my style."',
		howItHelps:
			'Allows you to defend your creative decisions to clients, collaborators, and yourself with indisputable logic.',
		studioTouchpoint: 'M5 Taste Curation Arena (Taste Formula tab) & Appendix E.',
		relatedTermIds: ['human-anchor-rule', 'anchor-library', 'm5-taste-curation'],
		tags: ['taste', 'formula', 'curation', 'criteria', 'infrastructure']
	},
	{
		id: 'human-anchor-rule',
		term: '40% Human Anchor Rule',
		category: 'concepts',
		aliases: ['40% rule', 'human anchor', 'human anchor rule', 'anchor rule', '40% human'],
		summary: 'The rule requiring that at least 40% of accepted reference anchors originate from human-created works.',
		plainDefinition:
			'A structural safeguard in your anchor library: for every 10 reference pieces you save, at least 4 must be created by human hands under human physical constraints.',
		whatItDoes:
			'Prevents model-collapse and aesthetic incest—training your taste solely on synthetic images or synthetic prose that share the same latent-space defaults.',
		howItHelps:
			'Injects genuine historical craft, idiosyncratic human choices, and physical real-world observation into your generative workflows.',
		studioTouchpoint: 'M5 Taste Curation Arena (Human Anchor Tracker) and Appendix E.',
		relatedTermIds: ['taste-formula', 'anchor-library', 'm5-taste-curation'],
		tags: ['human', 'anchor', 'taste', 'curation', 'guardrail']
	},
	{
		id: 'anchor-library',
		term: 'Anchor Library & Demotion Protocol',
		category: 'concepts',
		aliases: ['anchor library', 'anchors', 'demotion', 'demotion is progress', 'anchor protocol'],
		summary: 'The external memory of decisions worth remembering, where items are actively demoted as taste evolves.',
		plainDefinition:
			'Not a mood board or Pinterest collection. It is a curated archive of specific creative decisions—both successes and failures—accompanied by causal notes.',
		whatItDoes:
			'Enforces regular audits where previously loved pieces are "demoted" when you realize their appeal was merely novel or that their criteria were poorly formulated.',
		howItHelps:
			'Proves that your taste is actively maturing. In the words of Appendix E: "Demotion is progress."',
		studioTouchpoint: 'M5 Studio and Project 4 (Calibrate Taste).',
		relatedTermIds: ['human-anchor-rule', 'taste-formula', 'm5-taste-curation'],
		tags: ['anchors', 'library', 'demotion', 'taste', 'protocol'],
		externalDocLink: { label: 'Appendix E: Anchor Library Protocol', url: '/app?tab=manual&appendix=app-e' }
	},
	{
		id: 'reverse-direction',
		term: 'Reverse Direction Challenge',
		category: 'concepts',
		aliases: ['reverse direction', 'reverse challenge', 'flaw into feature', 'turning flaws'],
		summary: 'A drill that takes an unwanted machine artifact or glitch and constructs a premise where it becomes a deliberate asset.',
		plainDefinition:
			'A mental flexibility exercise where you take an output you initially rejected (e.g., an awkward extra finger, a bizarre prose hallucination) and invent a fictional, theatrical, or technical world where that exact defect is necessary.',
		whatItDoes:
			'Expands your aesthetic palette and frees you from rigid, conventional notions of "clean" output.',
		howItHelps:
			'Teaches you to recognize when an accidental machine deviation is actually more interesting than your original, predictable intention.',
		studioTouchpoint: 'M5 Taste Curation Arena (Reverse Direction tab) and Transfer Test 6.',
		relatedTermIds: ['taste-formula', 'm5-taste-curation', 'transfer-tests'],
		tags: ['reverse', 'challenge', 'glitch', 'invention', 'flexibility']
	},
	{
		id: 'positionality-compass',
		term: 'Positionality Compass',
		category: 'concepts',
		aliases: ['positionality', 'standing', 'compass', 'from with for about over', 'prepositional stance'],
		summary: 'The 5 prepositional stances (From, With, For, About, Over) used to verify ethical standing before taking on a problem.',
		plainDefinition:
			'A diagnostic framework situating your relationship to a creative subject: **From** (lived personal experience), **With** (equitable collaboration), **For** (direct service to an audience), **About** (external study), or **Over** (extractive exploitation).',
		whatItDoes:
			'Checks whether you have authentic standing to pursue a story or image, or whether you are engaging in voyeuristic aesthetic extraction.',
		howItHelps:
			'Protects you from hollow, offensive, or hypocritical projects. It empowers you to confidently refuse problems that are not yours to tell.',
		studioTouchpoint: 'M1 Problem-Finding & Positionality Lab (Positionality Compass tab).',
		relatedTermIds: ['problem-funnel', 'standing-check', '5-mode-refusal'],
		tags: ['positionality', 'standing', 'ethics', 'compass', 'refusal']
	},
	{
		id: 'standing-check',
		term: 'Standing Check & Justification',
		category: 'concepts',
		aliases: ['standing check', 'standing', 'standing justification', 'standing audit'],
		summary: 'The concrete 2-sentence written defense proving your legitimate right and accountability to direct a piece of work.',
		plainDefinition:
			'A mandatory filter in problem formulation where you write: (1) what connection gives you standing, and (2) what obligations you accept. If standing is absent, you must refuse the problem.',
		whatItDoes:
			'Acts as a gatekeeper in your problem log, preventing you from generating superficial commentary on topics you have no stake in.',
		howItHelps:
			'Gives your work weight, authenticity, and defensibility under harsh critique.',
		studioTouchpoint: 'M1 Studio and Problem-Finding Log entries.',
		relatedTermIds: ['positionality-compass', '5-mode-refusal', 'problem-funnel'],
		tags: ['standing', 'check', 'defense', 'justification']
	},
	{
		id: 'problem-funnel',
		term: '5-in-30 Problem Funnel',
		category: 'concepts',
		aliases: ['problem funnel', '5-in-30', 'funnel', 'problem finding', 'five in thirty'],
		summary: 'A rapid problem-finding drill generating 5 candidate tensions within 30 minutes from unassigned observation.',
		plainDefinition:
			'A timed protocol: 3 minutes of passive observation, followed by isolating friction points and formulating 5 candidate problems as tensions with real stakes, finally defending 1 to pursue.',
		whatItDoes:
			'Develops the upstream faculty of problem-finding so you never sit around waiting for clients or prompts to tell you what to make.',
		howItHelps:
			'Solves the "empty notebook" crisis. You realize that rich, fascinating creative problems exist everywhere in daily reality if you know how to look.',
		studioTouchpoint: 'M1 Studio (6-Step Problem Funnel) and Appendix I drills.',
		relatedTermIds: ['tension-vs-topic', 'positionality-compass', 'm1-problem-position'],
		tags: ['funnel', 'problem-finding', 'tensions', 'drill', '30-minutes']
	},
	{
		id: 'tension-vs-topic',
		term: 'Tension vs. Topic',
		category: 'concepts',
		aliases: ['tension vs topic', 'tension', 'topic', 'genuine tension', 'friction'],
		summary: 'The distinction between a passive subject area ("urban loneliness") and an active collision between two forces with stakes.',
		plainDefinition:
			'A **topic** is inert subject matter (e.g. "artificial intelligence in education"). A **tension** is two opposing, valid forces in collision (e.g. "the demand for standardized evaluation vs. the desire for non-linear exploratory thought").',
		whatItDoes:
			'Filters your problem candidates. If a proposal does not have two forces in tension with measurable stakes, it is rejected as a mere topic.',
		howItHelps:
			'Guarantees that your projects have intrinsic energy and narrative drive before you generate a single asset.',
		studioTouchpoint: 'M1 Problem Lab Step 4 and Premise formulations.',
		relatedTermIds: ['problem-funnel', 'seven-layer-brief', 'm1-problem-position'],
		tags: ['tension', 'topic', 'friction', 'stakes', 'problem-finding']
	},
	{
		id: 'seven-layer-brief',
		term: '7-Layer Creative Brief',
		category: 'concepts',
		aliases: ['7-layer brief', 'seven layer brief', 'brief architecture', 'creative brief', 'brief layers'],
		summary: 'A complete directorial specification: Premise, Intention, Constraints, References, Acceptance Criteria, Rejection Conditions, and Risks.',
		plainDefinition:
			'The gold standard specification document replacing amateur prompts: 1. Premise, 2. Intention, 3. Constraints, 4. References, 5. Acceptance Criteria, 6. Rejection Conditions, and 7. Risks & Unknowns.',
		whatItDoes:
			'Specifies exactly what constitutes success and failure before generation begins, closing loopholes that models typically exploit.',
		howItHelps:
			'Enables you to delegate work to AI or human teams with zero ambiguity. You know instantly whether an output is acceptable or grounds for rejection.',
		studioTouchpoint: 'M3 Premise & Brief Lab (7-Layer Builder) & Project 2.',
		relatedTermIds: ['constraint-tri-view', 'provenance-stamp', 'm3-premise-brief'],
		tags: ['brief', 'specification', '7-layer', 'contracts', 'architecture']
	},
	{
		id: 'constraint-tri-view',
		term: '3/6/10 Constraint Tri-View',
		category: 'concepts',
		aliases: ['constraint tri-view', 'tri-view', '3 6 10', 'constraint elasticity', 'constraints'],
		summary: 'A stress-test testing brief elasticity across 3 constraints (minimal), 6 constraints (standard), and 10 constraints (hard).',
		plainDefinition:
			'A testing workbench in M3 where you formulate your brief under three distinct constraint loads to observe how much pressure your core premise can handle.',
		whatItDoes:
			'Demonstrates whether your premise is fragile (breaks under heavy constraints) or resilient (grows more distinct under strict limits).',
		howItHelps:
			'Prepares you for real-world client production where budgets, legal constraints, and technical limitations are constantly shifting.',
		studioTouchpoint: 'M3 Studio (Constraint Matrix tab).',
		relatedTermIds: ['seven-layer-brief', 'm3-premise-brief'],
		tags: ['constraints', 'stress-test', 'tri-view', 'elasticity']
	},
	{
		id: 'provenance-stamp',
		term: 'Provenance Record & Human Contribution Stamp',
		category: 'concepts',
		aliases: ['provenance', 'human contribution', 'provenance stamp', 'data provenance', 'what the human did'],
		summary: 'The rigorous audit record tracking what the human decided, constructed, transformed, and refused.',
		plainDefinition:
			'A metadata record documenting not merely where files came from, but specifically: **What did the human actually decide, transform, construct, reject, and contribute?**',
		whatItDoes:
			'Separates human authorial intent from raw generative compute, creating an immutable audit trail for intellectual property and ethical disclosure.',
		howItHelps:
			'Protects your professional reputation, proves your copyrightable contribution, and satisfies client disclosure requirements.',
		studioTouchpoint: 'M3 Studio (Provenance Stamp Generator) and Appendix L.',
		relatedTermIds: ['pipeline-as-ip', 'five-mode-refusal', 'm3-premise-brief'],
		tags: ['provenance', 'ethics', 'authorship', 'human-contribution', 'ip'],
		externalDocLink: { label: 'Appendix L: Operational Templates', url: '/app?tab=manual&appendix=app-l' }
	},
	{
		id: 'calibration-tracking',
		term: 'Brier Score & Probability Calibration',
		category: 'concepts',
		aliases: ['brier', 'brier score', 'calibration', 'probability calibration', 'prediction confidence', 'brier math'],
		summary: 'The mean squared error measuring how accurately your stated confidence percentages match actual outcomes.',
		plainDefinition:
			'A mathematical scoring formula: $\\text{Brier} = \\frac{1}{N}\\sum(f_t - o_t)^2$, where $f_t$ is your forecasted probability (0.0 to 1.0) and $o_t$ is the binary outcome (1 for pass, 0 for fail). Lower is better (0.0 = perfect calibration).',
		whatItDoes:
			'Tracks whether you are chronically overconfident (predicting 90% certainty on things that fail) or underconfident (predicting 20% on things that succeed).',
		howItHelps:
			'Calibrates your internal causal model of software tools and prompts. You stop guessing and learn the true reliability limits of your systems.',
		studioTouchpoint: 'M4 Pipeline Calibration Lab and Calibration Log entries.',
		relatedTermIds: ['taste-narrowness-index', 'm4-pipeline-calibration'],
		tags: ['brier', 'calibration', 'math', 'probability', 'prediction']
	},
	{
		id: 'taste-narrowness-index',
		term: 'Taste-Narrowness Index',
		category: 'concepts',
		aliases: ['taste narrowness', 'narrowness', 'entropy index', 'domain diversity', 'taste drift'],
		summary: 'A mathematical entropy metric warning you when your practice is retreating into comfortable, risk-averse creative ruts.',
		plainDefinition:
			'An entropy calculation over the domains, tools, and subject matters in your recent logs. If you repeatedly work in the same genre or aesthetic style, the index warns of narrowness.',
		whatItDoes:
			'Flashes a warning when your work stops surprising you or testing new creative territory.',
		howItHelps:
			'Prevents creative stagnation. It encourages you to take risks in unfamiliar media (transfer) before your style becomes obsolete.',
		studioTouchpoint: 'M4 Studio Telemetry and Studio Logbook analytics.',
		relatedTermIds: ['calibration-tracking', 'transfer-tests'],
		tags: ['narrowness', 'entropy', 'diversity', 'risk', 'audit']
	},
	{
		id: 'non-instrumental-attention',
		term: 'Non-Instrumental Attention',
		category: 'concepts',
		aliases: ['non-instrumental', 'attention', 'pure attention', 'looking without goal', 'walk without destination'],
		summary: 'The practice of sustaining deep attention on the world without immediately converting it into a project deliverable.',
		plainDefinition:
			'Protected time spent observing, walking, looking, or listening with zero intention of making a piece of art, generating a prompt, or writing a post.',
		whatItDoes:
			'Refills your internal well of real-world perception with uncommodified sensations, shadows, conversations, and textures.',
		howItHelps:
			'Cures "creative extraction syndrome"—where every book you read or walk you take is ruined by searching for content. It preserves your ability to be surprised.',
		studioTouchpoint: 'Daily Practice Step 8 (Play & Attention) and 1-line Attention Log.',
		relatedTermIds: ['play-drills', 'todays-practice-loop', 'm0-practice-contract'],
		tags: ['attention', 'perception', 'mindfulness', 'observation', 'play']
	},
	{
		id: 'play-drills',
		term: 'Play Drills',
		category: 'concepts',
		aliases: ['play', 'play drills', 'nonsense writing', 'bad drawing', 'wrong tool'],
		summary: 'Making things with deliberately zero evaluative purpose (bad drawing, nonsense writing, wrong tool) to encounter the unexpected.',
		plainDefinition:
			'Low-stakes micro-sessions where you purposely make something stupid, broken, or pointless: using a 3D CAD program to write poetry, or drawing with your non-dominant hand.',
		whatItDoes:
			'Shuts down the internal critic and disables all diagnostic ladders and briefs for 20 minutes.',
		howItHelps:
			'Maintains joy, curiosity, and psychological resilience. It reminds you that making is fundamentally a human adventure, not merely an optimization problem.',
		studioTouchpoint: 'Daily Practice Step 8 and Play Log entries.',
		relatedTermIds: ['non-instrumental-attention', 'todays-practice-loop'],
		tags: ['play', 'fun', 'nonsense', 'experimentation', 'joy']
	},
	{
		id: 'blank-sheet-capstone',
		term: 'Blank-Sheet Capstone',
		category: 'concepts',
		aliases: ['blank sheet', 'capstone', 'project 6', 'unassigned project', '14-step capstone'],
		summary: 'The 14-step unassisted creation sequence starting from zero prompt, zero assignment, and zero provided scaffolding.',
		plainDefinition:
			'The ultimate test of Layer 3 (Agency): you enter an empty studio with no brief, no rubric, no assignment, and 90 minutes to find a problem, justify standing, and build.',
		whatItDoes:
			'Forces you to direct the entire creative lifecycle from raw reality to final artifact.',
		howItHelps:
			'Proves you are a true machine director. You will never again need a prompt pack, an instructor, or an employer to jumpstart your creative engine.',
		studioTouchpoint: 'M7 Agency & Blank Sheet Lab and Project 6 / Project 12.',
		relatedTermIds: ['three-mastery-layers', 'how-i-decided-essay', 'm7-agency-blank-sheet'],
		tags: ['capstone', 'blank-sheet', 'agency', 'project-6', 'independent']
	},
	{
		id: 'how-i-decided-essay',
		term: '"How I Decided What to Make" Essay',
		category: 'concepts',
		aliases: ['how i decided', 'decided essay', 'capstone essay', 'authorial essay'],
		summary: 'The 1,500-word written defense accompanying your capstone explaining how you discovered the problem and verified standing.',
		plainDefinition:
			'A rigorous retrospective essay that articulates: why this problem mattered, what standing you had, what you refused, and what principles guided your direction.',
		whatItDoes:
			'Provides the intellectual provenance of your final masterpiece, proving that the work was directed with conscious intent rather than generated by chance.',
		howItHelps:
			'Serves as the cornerstone of your professional portfolio, demonstrating executive creative maturity to clients, galleries, or institutions.',
		studioTouchpoint: 'M7 Studio Capstone requirements and Project 6/12 deliverables.',
		relatedTermIds: ['blank-sheet-capstone', 'positionality-compass', 'm7-agency-blank-sheet'],
		tags: ['essay', 'defense', 'capstone', 'authorship', 'portfolio']
	},
	{
		id: 'pipeline-as-ip',
		term: 'Pipeline-as-IP',
		category: 'concepts',
		aliases: ['pipeline ip', 'pipeline as ip', 'intellectual property', 'system as asset'],
		summary: 'Treating the directorial brief, variable map, and causal system as the true intellectual asset rather than disposable raw outputs.',
		plainDefinition:
			'The commercial concept that individual generated images or paragraphs have zero marginal production cost, making the repeatable **causal decision pipeline** your true proprietary value.',
		whatItDoes:
			'Reframes how you negotiate client contracts, pricing, and copyright: you license the system and directorial methodology, not just the pixels.',
		howItHelps:
			'Allows creative practitioners to command high fees in an era when raw content generation has been commoditized to zero.',
		studioTouchpoint: 'Curriculum Part V (Module 13: Professional Practice Begins) and Appendix M.',
		relatedTermIds: ['provenance-stamp', 'five-mode-refusal'],
		tags: ['ip', 'contracts', 'pipeline', 'business', 'pricing'],
		externalDocLink: { label: 'Appendix M: Professional Practice Reference', url: '/app?tab=manual&appendix=app-m' }
	},
	{
		id: '1-rep-standard',
		term: '1-Rep Standard (70–80% Difficulty Rule)',
		category: 'concepts',
		aliases: ['1 rep', 'rep standard', 'deliberate practice standard', '70-80%', 'learning zone'],
		summary: 'Discrete 2-to-10 minute micro-skill drills operating at the 70–80% success zone to maximize neural plasticity.',
		plainDefinition:
			'The deliberate practice formula for every rep in the course: target skill, rep duration (2–10m), strict pass/fail criterion, and feedback loop.',
		whatItDoes:
			'Calibrates task difficulty so you succeed roughly 75% of the time. If you pass 100%, the drill escalates; if you fail repeatedly, it simplifies.',
		howItHelps:
			'Avoids both boredom (too easy) and demoralizing frustration (too hard), keeping you in the optimal zone of accelerated skill acquisition.',
		studioTouchpoint: 'Drill Runner modal, Studio Drills, and Appendix I.',
		relatedTermIds: ['todays-practice-loop', 'lint-check'],
		tags: ['drills', 'reps', 'difficulty', 'learning-zone', 'deliberate-practice']
	},

	// ==========================================
	// 5. STUDIO MODALITIES (M0–M7)
	// ==========================================
	{
		id: 'm0-practice-contract',
		term: 'M0: Practice Contract & Baseline Hub',
		category: 'modalities',
		aliases: ['m0', 'modality 0', 'practice contract', 'baseline hub', 'contract hub'],
		summary: 'The onboarding studio for baseline 1–4 competency scoring, intensity path selection, and attention/play timers.',
		plainDefinition:
			'The foundational modality where you evaluate your starting baseline across 12 competencies, commit to an intensity pace, and log your initial practice contract.',
		whatItDoes:
			'Establishes your developmental benchmark before you touch any generative tools, identifying your weakest bottleneck faculties.',
		howItHelps:
			'Provides an objective baseline against which future growth, scaffolding removal, and portfolio mastery can be measured.',
		studioTouchpoint: 'Studio Labs Tab (`/app?tab=labs&lab=m0`) and Week 0.',
		relatedTermIds: ['twelve-competencies', 'three-mastery-layers'],
		tags: ['m0', 'baseline', 'contract', 'onboarding', 'modality']
	},
	{
		id: 'm1-problem-position',
		term: 'M1: Problem-Finding & Positionality Lab',
		category: 'modalities',
		aliases: ['m1', 'modality 1', 'problem lab', 'problem position lab', 'positionality lab'],
		summary: 'The workspace for the 6-step problem funnel, positionality compass audits, and unassigned problem-finding.',
		plainDefinition:
			'The studio environment dedicated to finding meaningful problems from reality and verifying your standing to pursue them.',
		whatItDoes:
			'Provides interactive funnels, standing check auditors, and 60-minute unassigned timers to develop raw problem-finding independence.',
		howItHelps:
			'Transforms you from someone who asks AI "give me ideas for a project" into an author who observes reality and uncovers urgent questions.',
		studioTouchpoint: 'Studio Labs Tab (`/app?tab=labs&lab=m1`) and Weeks 1–2.',
		relatedTermIds: ['problem-funnel', 'positionality-compass', 'tension-vs-topic'],
		tags: ['m1', 'problem-finding', 'positionality', 'standing', 'modality']
	},
	{
		id: 'm2-diagnostic-vision',
		term: 'M2: Diagnostic Vision & Observation Lab',
		category: 'modalities',
		aliases: ['m2', 'modality 2', 'diagnostic vision', 'diagnostic lab', 'observation studio'],
		summary: 'The analytical lab featuring zero-adjective linters, 6-question decision audits, diagnostic ladders, and massing canvases.',
		plainDefinition:
			'The core observational engine of Directing the Machine. It is where you dissect text and images with surgical, objective precision.',
		whatItDoes:
			'Houses the Zero-Adjective Regex Linter, the Semantic AI Linter, the 7-rung Diagnostic Ladder Auditor, and the HTML5 Massing Canvas.',
		howItHelps:
			'Trains your eyes and mind to perceive structural anatomy rather than vibes, enabling you to identify exactly why an output failed in seconds.',
		studioTouchpoint: 'Studio Labs Tab (`/app?tab=labs&lab=m2`) and Weeks 1–2 / ongoing.',
		relatedTermIds: ['diagnostic-ladder', 'zero-adjective-linter', 'massing-canvas', 'surgical-patches'],
		tags: ['m2', 'observation', 'linter', 'ladder', 'massing', 'modality']
	},
	{
		id: 'm3-premise-brief',
		term: 'M3: Premise Forge & 7-Layer Brief Lab',
		category: 'modalities',
		aliases: ['m3', 'modality 3', 'premise lab', 'brief lab', 'premise brief lab'],
		summary: 'The specification lab with a 3-premise forge with rejection logic, 7-layer brief builder, and provenance stamp generator.',
		plainDefinition:
			'The engineering studio for formulation. You forge central premises with genuine friction, construct 7-layer briefs, and test constraint elasticity.',
		whatItDoes:
			'Converts loose artistic intentions into checkable, bulletproof specifications with explicit acceptance criteria and rejection conditions.',
		howItHelps:
			'Eliminates the ambiguity that causes AI models to produce generic, predictable, cliché outputs.',
		studioTouchpoint: 'Studio Labs Tab (`/app?tab=labs&lab=m3`) and Weeks 3–4.',
		relatedTermIds: ['seven-layer-brief', 'constraint-tri-view', 'provenance-stamp'],
		tags: ['m3', 'premise', 'brief', 'specification', 'provenance', 'modality']
	},
	{
		id: 'm4-pipeline-calibration',
		term: 'M4: Pipeline & Calibration Lab',
		category: 'modalities',
		aliases: ['m4', 'modality 4', 'pipeline lab', 'calibration lab', 'pipeline calibration'],
		summary: 'The systems lab with 9-layer pipeline mappers, pre-run confidence locks, Brier score telemetry, and ergonomic screen HUDs.',
		plainDefinition:
			'The laboratory for systems thinking and scientific probability. You map variable workflows, lock in forecasts before generating, and calculate Brier accuracy.',
		whatItDoes:
			'Tracks causal relationships across conditioning nodes, seeds, weights, and parameters while monitoring screen fatigue with a 45-minute timer.',
		howItHelps:
			'Turns generation into a calibrated science rather than an addictive guessing game.',
		studioTouchpoint: 'Studio Labs Tab (`/app?tab=labs&lab=m4`) and Weeks 5–6.',
		relatedTermIds: ['calibration-tracking', 'taste-narrowness-index'],
		tags: ['m4', 'pipeline', 'calibration', 'brier', 'variables', 'modality']
	},
	{
		id: 'm5-taste-curation',
		term: 'M5: Taste & Blind Curation Arena',
		category: 'modalities',
		aliases: ['m5', 'modality 5', 'taste arena', 'curation arena', 'taste curation'],
		summary: 'The taste training arena featuring blind provenance rankers, 5-part taste formula builders, and reverse direction challenges.',
		plainDefinition:
			'The arena where aesthetic taste is tested under blind, unbiased conditions. You evaluate artifacts without knowing whether they were made by humans or AI.',
		whatItDoes:
			'Tracks your 40% human anchor ratio, facilitates anchor demotions, and challenges you to turn machine defects into deliberate structural triumphs.',
		howItHelps:
			'Builds authentic aesthetic confidence. Your taste ceases to be a reflex of hype or prestige and becomes a proven, defensible judgment engine.',
		studioTouchpoint: 'Studio Labs Tab (`/app?tab=labs&lab=m5`) and Weeks 7–8.',
		relatedTermIds: ['taste-formula', 'human-anchor-rule', 'anchor-library', 'reverse-direction'],
		tags: ['m5', 'taste', 'curation', 'blind-ranking', 'anchors', 'modality']
	},
	{
		id: 'm6-direction-collab',
		term: 'M6: Direction & Collaboration Studio',
		category: 'modalities',
		aliases: ['m6', 'modality 6', 'direction lab', 'collab studio', 'direction collab'],
		summary: 'The directorial workspace featuring stakeholder critique triage, 5-mode refusal composers, and 10s silence tolerance timers.',
		plainDefinition:
			'The studio for human collaboration, client management, and directorial authority under constraint.',
		whatItDoes:
			'Simulates conflicting stakeholder feedback, forces you to categorize critique into Apply/Adapt/Alternative/Push Back/Re-Brief, and crafts formal refusal letters.',
		howItHelps:
			'Teaches you how to hold creative boundaries without being defensive, and how to scaffold others without doing their thinking for them.',
		studioTouchpoint: 'Studio Labs Tab (`/app?tab=labs&lab=m6`) and Weeks 9–10.',
		relatedTermIds: ['five-mode-refusal', 'critique-triage', 'silence-tolerance'],
		tags: ['m6', 'direction', 'collaboration', 'refusal', 'critique', 'modality']
	},
	{
		id: 'm7-agency-blank-sheet',
		term: 'M7: Agency & Blank Sheet Capstone',
		category: 'modalities',
		aliases: ['m7', 'modality 7', 'agency lab', 'blank sheet lab', 'capstone lab'],
		summary: 'The unassisted capstone workspace with position gap analysis, cross-medium removal testing, and 14-step capstone tracking.',
		plainDefinition:
			'The ultimate studio environment where all scaffolding is gone. You build major independent projects from an empty page.',
		whatItDoes:
			'Tracks the 14-step blank sheet progression, runs cross-medium non-redundancy tests (text vs. visual), and documents the "How I Decided" thesis.',
		howItHelps:
			'Transitions you permanently from a student inside an educational sandbox into a fully autonomous, practicing machine director.',
		studioTouchpoint: 'Studio Labs Tab (`/app?tab=labs&lab=m7`) and Weeks 11–12 / Months 4–9.',
		relatedTermIds: ['blank-sheet-capstone', 'how-i-decided-essay', 'cross-medium-removal'],
		tags: ['m7', 'agency', 'blank-sheet', 'capstone', 'independence', 'modality']
	},

	// ==========================================
	// 6. PROTOCOLS, RUBRICS & REFUSAL
	// ==========================================
	{
		id: 'five-mode-refusal',
		term: '5-Mode Refusal System',
		category: 'protocols',
		aliases: ['refusal', '5-mode refusal', 'five mode refusal', 'ethical refusal', 'positional refusal', 'slop refusal'],
		summary: 'A formal system for saying no: Ethical, Positional, Technical, Intentional, and Slop Refusal.',
		plainDefinition:
			'A taxonomy of legitimate creative refusals: 1. **Ethical Refusal** (violates explicit moral boundaries), 2. **Positional Refusal** (lacks standing), 3. **Technical Refusal** (unachievable under constraints), 4. **Intentional Refusal** (damages the premise or voice), and 5. **Slop Refusal** (fails distinctiveness criteria).',
		whatItDoes:
			'Structures refusal as a rigorous professional act with clear rationale and alternatives rather than personal hostility.',
		howItHelps:
			'Creative direction is defined more by what you refuse than what you accept. This gives you the language to protect project integrity.',
		studioTouchpoint: 'M6 Studio (Refusal Composer tab) & Appendix F.',
		relatedTermIds: ['positionality-compass', 'critique-triage', 'm6-direction-collab'],
		tags: ['refusal', 'ethics', 'boundaries', 'slop', 'professional'],
		externalDocLink: { label: 'Appendix F: Refusal Protocols', url: '/app?tab=manual&appendix=app-f' }
	},
	{
		id: 'critique-triage',
		term: 'Stakeholder Critique Triage',
		category: 'protocols',
		aliases: ['critique triage', 'critique', 'feedback triage', 'apply adapt reject', 're-brief'],
		summary: 'A 5-way decision protocol to categorize external feedback: Apply, Adapt, Alternative, Push Back, or Re-Brief.',
		plainDefinition:
			'A rigorous triage protocol for responding to client or peer feedback: **Apply** (agree and adopt), **Adapt** (address underlying root cause differently), **Alternative** (propose a better trade-off), **Push Back** (defend current choice with brief criteria), or **Re-Brief** (scope fundamentally shifted).',
		whatItDoes:
			'Prevents knee-jerk defensiveness and spineless compliance, ensuring feedback serves the established brief.',
		howItHelps:
			'Transforms chaotic client notes into actionable creative revisions while maintaining directorial leadership.',
		studioTouchpoint: 'M6 Studio (Critique Triage tab) & Appendix J.',
		relatedTermIds: ['five-mode-refusal', 'seven-layer-brief', 'm6-direction-collab'],
		tags: ['critique', 'feedback', 'triage', 'clients', 'revision'],
		externalDocLink: { label: 'Appendix J: Critique & Calibration', url: '/app?tab=manual&appendix=app-j' }
	},
	{
		id: 'silence-tolerance',
		term: 'Silence Tolerance Protocol (10s Rule)',
		category: 'protocols',
		aliases: ['silence tolerance', '10s rule', '10-second silence', 'silence protocol', 'mentorship timer'],
		summary: 'Holding silence for at least 10 seconds during mentorship or collaboration to allow autonomous thought.',
		plainDefinition:
			'A pedagogical directive for creative directors and mentors: when asking a collaborator or student a question, you must hold silence for at least 10 full seconds before speaking.',
		whatItDoes:
			'Prevents you from rushing in with the answer, filling conversational pauses, or robbing the other person of the cognitive struggle required to learn.',
		howItHelps:
			'Builds true independent thinking in others and prevents directorial micromanagement.',
		studioTouchpoint: 'M6 Direction Lab (Mentorship Timer) and Appendix I drills.',
		relatedTermIds: ['transfer-tests', 'm6-direction-collab'],
		tags: ['silence', 'mentorship', 'collaboration', 'teaching', '10-seconds']
	},
	{
		id: 'cross-medium-removal',
		term: 'Cross-Medium Dual Removal Test',
		category: 'protocols',
		aliases: ['dual removal', 'removal test', 'cross medium test', 'non-redundancy'],
		summary: 'A verification test ensuring that text and visual elements in a hybrid project are mutually non-redundant.',
		plainDefinition:
			'A test where you remove the image: does the text still carry the entire piece alone? Then you remove the text: does the image make sense without words? If yes to either, they are redundant.',
		whatItDoes:
			'Guarantees that visual and textual mediums depend on each other synergistically rather than merely restating each other.',
		howItHelps:
			'Creates true multimedia synthesis—where the image shows what words cannot describe, and words articulate what images cannot depict.',
		studioTouchpoint: 'M7 Studio and Project 9 / Project 12.',
		relatedTermIds: ['m7-agency-blank-sheet', 'blank-sheet-capstone'],
		tags: ['synthesis', 'removal-test', 'multimedia', 'hybrid', 'non-redundancy']
	},
	{
		id: 'universal-rubric',
		term: 'Universal Rubric (1–4 Scale)',
		category: 'protocols',
		aliases: ['rubric', 'universal rubric', '1-4 scale', 'scoring scale', 'transferable functional emerging'],
		summary: 'The objective 4-level scale: 1 (Not Yet), 2 (Emerging), 3 (Functional), and 4 (Transferable).',
		plainDefinition:
			'The standardized developmental rubric used across all 12 competencies: **1 — Not Yet** (waits for assignment, relies on clichés), **2 — Emerging** (notices symptoms, slips into evaluation), **3 — Functional** (operates reliably with light prompting), and **4 — Transferable** (independently executes across unfamiliar media).',
		whatItDoes:
			'Eliminates arbitrary percentage grades in favor of observable, demonstrable behaviors.',
		howItHelps:
			'Gives you a clear target for what genuine professional competence looks like in every discipline.',
		studioTouchpoint: 'Appendix C, Competency Modals, and Studio Assessment.',
		relatedTermIds: ['twelve-competencies', 'two-axis-quadrant', 'transfer-tests'],
		tags: ['rubric', 'scoring', '1-4', 'mastery', 'scale'],
		externalDocLink: { label: 'Appendix C: Rubrics & Scoring', url: '/app?tab=manual&appendix=app-c' }
	},
	{
		id: 'transfer-tests',
		term: 'Transfer Tests (Appendix G)',
		category: 'protocols',
		aliases: ['transfer tests', 'transfer', 'appendix g', 'independence test', '17 transfer tests'],
		summary: 'A suite of 17 standardized tests verifying that skills survive when familiar tools, templates, and prompts are stripped.',
		plainDefinition:
			'High-leverage challenge scenarios (New Medium, New Tool, Adversarial Critique, Blank Sheet, Tool-Switch, Calibration, Positionality) that test conceptual portability.',
		whatItDoes:
			'Exposes whether you merely have application fluency (knowing where the buttons are in Midjourney or Claude) or transferable creative judgment that works anywhere.',
		howItHelps:
			'Ensures that when your current AI software updates, changes its pricing, or gets shut down, your creative power remains 100% intact.',
		studioTouchpoint: 'Part-by-Part Transfer Test milestones and Appendix G.',
		relatedTermIds: ['scaffolding-removal', 'blank-sheet-capstone'],
		tags: ['transfer', 'tests', 'independence', 'portability', 'protocols'],
		externalDocLink: { label: 'Appendix G: Transfer Tests', url: '/app?tab=manual&appendix=app-g' }
	},

	// ==========================================
	// 7. BYOK & CLIENT INFERENCE
	// ==========================================
	{
		id: 'byok-inference',
		term: 'Bring Your Own Key (BYOK) Inference',
		category: 'byok-llm',
		aliases: ['byok', 'bring your own key', 'api key', 'inference', 'openrouter', 'openai', 'gemini', 'anthropic'],
		summary: 'Direct client-to-API inference running 100% in your browser with zero telemetry, zero databases, and zero server storage.',
		plainDefinition:
			'The architecture of Directing the Machine where all AI generation, semantic audits, and diagnostic critique execute directly from your browser via `fetch()` using your private API keys.',
		whatItDoes:
			'Connects you to OpenRouter, OpenAI, Google Gemini, Anthropic, or local Ollama endpoints without transmitting your keys or drafts to any intermediate server.',
		howItHelps:
			'Guarantees complete client confidentiality, zero subscription markups, zero tracking, and uninterrupted offline/local-first practice.',
		studioTouchpoint: 'Studio Settings (`P` / `S` hotkey) and top bar sliders icon.',
		relatedTermIds: ['reasoning-monologue', 'semantic-linter', 'prompt-registry'],
		tags: ['byok', 'api-key', 'inference', 'security', 'privacy', 'client-side']
	},
	{
		id: 'reasoning-monologue',
		term: 'Reasoning Monologue Drawer (<think> tags)',
		category: 'byok-llm',
		aliases: ['reasoning monologue', 'think tags', 'thought drawer', 'deep reasoning', 'r1', 'nemotron', 'thinking'],
		summary: 'The collapsible drawer in AI critique cards that displays the internal reasoning chain of models like DeepSeek R1 and Nemotron.',
		plainDefinition:
			'An inspection drawer that automatically intercepts `<think>...</think>` tags from advanced reasoning models and displays their step-by-step logic in a collapsible container.',
		whatItDoes:
			'Separates the model\'s internal deliberations from its final directorial critique, preventing thought chains from polluting output fields.',
		howItHelps:
			'Allows you to inspect how the AI reasoned through your creative brief, verifying whether it understood the structural constraints or made unwarranted assumptions.',
		studioTouchpoint: 'LlmCritiqueCard component throughout M2, M1, and Studio Labs.',
		relatedTermIds: ['byok-inference', 'semantic-linter'],
		tags: ['reasoning', 'think', 'deepseek', 'nemotron', 'monologue']
	},
	{
		id: 'prompt-registry',
		term: 'Course Prompt Registry & Touchpoints',
		category: 'byok-llm',
		aliases: ['prompt registry', 'touchpoints', 'system prompts', 'anti-slop prompts'],
		summary: 'The centralized repository of 23 carefully engineered system prompts enforcing zero-adjective discipline across all studio labs.',
		plainDefinition:
			'A type-safe registry in `src/lib/engine/prompt-registry.ts` defining strict system personas (Diagnostic Ladder Purist, Semantic Linter, Refusal Coach, Taste Interrogator).',
		whatItDoes:
			'Configures model parameters (temperature, max tokens, surgical patch instructions) to prevent generative models from outputting sycophantic, polite praise.',
		howItHelps:
			'Guarantees that AI critiques act as tough, discerning creative directors rather than cheerleaders.',
		studioTouchpoint: 'All `LlmTriggerButton` components across M0–M7.',
		relatedTermIds: ['byok-inference', 'semantic-linter', 'surgical-patches'],
		tags: ['registry', 'prompts', 'system-prompts', 'anti-slop', 'engine']
	},
	{
		id: 'learner-preferences',
		term: 'Learner Preferences & Accessibility Presets',
		category: 'studio-ux',
		aliases: ['preferences', 'learner preferences', 'accessibility', 'archetypes', 'dyslexia font', 'opendyslexic'],
		summary: 'Customizable typographic, motion, audio, and visual settings including 1-click ADHD and Dyslexia presets.',
		plainDefinition:
			'A persistent user preferences engine supporting OpenDyslexic and Lexend fonts, variable leading, reduced motion, Web Audio chimes, and theme selections.',
		whatItDoes:
			'Stores your exact interface comfort settings in client-side `localStorage` across studio sessions.',
		howItHelps:
			'Adapts the studio to your neurotype, visual comfort, and physical ergonomics so the tool conforms to you rather than forcing you to conform to it.',
		studioTouchpoint: 'Studio Settings (`P` / `S`) → Typography / Theme / Focus tabs.',
		relatedTermIds: ['stone-paper-themes', 'single-task-horizon'],
		tags: ['accessibility', 'preferences', 'dyslexia', 'fonts', 'ergonomics']
	},
	{
		id: 'appendices-a-o',
		term: 'Appendices A through O (Field Protocols)',
		category: 'protocols',
		aliases: ['appendices', 'field manual', 'appendix', 'protocols', 'manual'],
		summary: 'The complete 15-part operational manual covering tools, ladders, rubrics, study drills, templates, contracts, and safety.',
		plainDefinition:
			'The comprehensive operational protocols extracted from the master course documents, bundled into typed data structures for instant search and reading.',
		whatItDoes:
			'Provides definitive guidelines for Tool Discipline (A), Ladders (B), Rubrics (C), Projects (D), Anchors (E), Refusal (F), Transfer (G), Studies (H), Drills (I), Critique (J), Safety & Ethics (K), Templates (L), Professional Practice (M), Exit Practice (N), and Pacing (O).',
		howItHelps:
			'Gives you a lifetime reference manual that can be consulted anytime you face a complex creative, legal, or technical challenge.',
		studioTouchpoint: 'Field Manual Tab (`/app?tab=manual`) and Reference Drawer (`⌘K`).',
		relatedTermIds: ['reference-drawer', 'diagnostic-ladder', 'five-mode-refusal'],
		tags: ['appendices', 'field-manual', 'reference', 'protocols', 'doctrine'],
		externalDocLink: { label: 'Explore Interactive Field Manual', url: '/app?tab=manual' }
	}
];
