export interface CompetencyDetail {
	id: string;
	name: string;
	layer: 1 | 2 | 3;
	layerName: string;
	whatItIs: string;
	whyItMatters: string;
	exerciseTitle: string;
	timeEstimate: string;
	exerciseSteps: string[];
	rubric: {
		1: string;
		2: string;
		3: string;
		4: string;
	};
	diagnosticPrompt: string;
	exampleNote: string;
}

export const COMPETENCY_DETAILS: Record<string, CompetencyDetail> = {
	prob: {
		id: 'prob',
		name: 'Problem-Finding',
		layer: 1,
		layerName: 'Observation & Craft',
		whatItIs: 'The ability to discover, isolate, and formulate non-obvious creative problems from unstructured real-world observation.',
		whyItMatters: 'Without problem-finding, practitioners passively wait for prompts or client briefs, defaulting to cliché aesthetic solutions for unexamined questions.',
		exerciseTitle: '30-Minute Observation to 3 Framed Problems',
		timeEstimate: '30m',
		exerciseSteps: [
			'Spend 20 minutes observing an environment, passage, or interface without searching for an answer.',
			'Identify 3 distinct frictions, tensions, or unaddressed questions worth pursuing.',
			'Frame each as a specific proposition: "How might X achieve Y despite Z?" rather than a generic topic.'
		],
		rubric: {
			1: 'Waits for problems to be assigned or copies generic trending prompts.',
			2: 'Notices broad subject topics (e.g. "loneliness in cities") rather than specific tensions with stakes.',
			3: 'Finds workable, bounded problems with clear friction and some prompting.',
			4: 'Independently discovers meaningful problems, articulates high stakes, and rigorously justifies selection.'
		},
		diagnosticPrompt: 'Did you frame actionable problems with genuine tension, or did you just write down broad topics?',
		exampleNote: 'Score: 2 (Emerging). I generated topics instead of problems ("urban architecture" vs "how glass facades conceal commercial turnover"). I need to practice locating specific points of friction.'
	},
	pos: {
		id: 'pos',
		name: 'Positionality & Standing',
		layer: 1,
		layerName: 'Observation & Craft',
		whatItIs: 'The clarity of knowing your relationship to a problem: whether you speak from, with, for, about, or over a subject.',
		whyItMatters: 'Prevents intellectual voyeurism, exploitative storytelling, and pursuing problems where you lack the contextual standing or lived accountability to direct authentically.',
		exerciseTitle: 'Positionality Audit & Standing Justification',
		timeEstimate: '15m',
		exerciseSteps: [
			'Take one problem candidate from your observation.',
			'State your prepositional stance: are you working *From* (lived experience), *With* (collaboration), *For* (service), *About* (study), or *Over* (extraction)?',
			'Write a 2-sentence defense of your standing. If standing is weak or extractive, practice active refusal.'
		],
		rubric: {
			1: 'Ignores positionality completely; assumes entitlement to generate work on any topic without accountability.',
			2: 'Rarely considers standing; treats positionality as a post-hoc disclaimer rather than a directorial filter.',
			3: 'Usually situates self honestly; understands when personal knowledge is adequate or when collaboration is required.',
			4: 'Situates self with rigorous honesty; proactively refuses problems where standing is absent or extractive.'
		},
		diagnosticPrompt: 'Do you have legitimate standing to speak on this problem, or should you refuse it?',
		exampleNote: 'Score: 2 (Emerging). I found myself writing a brief "about" a community I have no ties to. I recognized the extractive stance and need to practice principled refusal.'
	},
	obs: {
		id: 'obs',
		name: 'Observation & Diagnostic Vision',
		layer: 1,
		layerName: 'Observation & Craft',
		whatItIs: 'Describing visual or textual artifacts with precise, neutral, structural accuracy without evaluative adjectives.',
		whyItMatters: 'Vague adjectives ("cinematic", "stunning", "poetic", "hyper-realistic") mask lack of perception. If you cannot describe what is physically there, you cannot direct changes.',
		exerciseTitle: 'Zero-Adjective Structural Description',
		timeEstimate: '20m',
		exerciseSteps: [
			'Select an image, layout, or 200-word prose excerpt.',
			'Write a 5-sentence description using ZERO evaluative adjectives (no "beautiful", "messy", "bold", "dark", "interesting").',
			'Describe purely: spatial massing, geometry, contrast ratios, focal point coordinates, cadence, and syntax.'
		],
		rubric: {
			1: 'Relies entirely on vibes and buzzwords ("cinematic", "dreamy", "bad vibes"); misses structural reality.',
			2: 'Notices obvious surface features (colors, subjects) but repeatedly slips into evaluative language.',
			3: 'Describes structural anatomy (hierarchy, proportions, tonal values) with minimal affective leakage.',
			4: 'Instantly breaks down complex works into checkable mechanical and formal systems with complete neutral precision.'
		},
		diagnosticPrompt: 'Can you describe the artifact strictly by its formal mechanics without relying on subjective adjectives?',
		exampleNote: 'Score: 2 (Emerging). I wrote "the lighting is mysterious". Rewritten objectively: "light source is 15 degrees off-axis behind subject, leaving the facial plane in 2-stop shadow."'
	},
	prem: {
		id: 'prem',
		name: 'Premise Forge',
		layer: 1,
		layerName: 'Observation & Craft',
		whatItIs: 'Formulating a falsifiable central proposition that introduces productive tension between two contrasting elements.',
		whyItMatters: 'AI models love average harmony. A weak premise yields bland consensus outputs; a strong premise with structural tension forces the system into original aesthetic territory.',
		exerciseTitle: '3-Premise Forge with Rejection Rationale',
		timeEstimate: '25m',
		exerciseSteps: [
			'Take a single neutral observation.',
			'Forge 3 distinct premises, each containing an inherent dialectic tension (e.g. "Bureaucracy expressed as ritual liturgy").',
			'Explicitly reject 2 premises with technical reasons and advance the single most generative one.'
		],
		rubric: {
			1: 'Waits for prompts; cannot distinguish a subject topic from an authored premise.',
			2: 'Generates premises that are simple slogans or moral platitudes without structural tension.',
			3: 'Generates usable premises with authentic tension; can justify why one is chosen over another.',
			4: 'Consistently forges daring, non-obvious propositions that unlock unexpected model behaviors and coherent series.'
		},
		diagnosticPrompt: 'Does your premise contain two opposing forces that cannot be resolved with cliché model defaults?',
		exampleNote: 'Score: 2 (Emerging). "A story about grief" is not a premise. "A grieving botanist systematically cataloging invasive weeds in a spouse’s abandoned greenhouse" is a premise.'
	},
	spec: {
		id: 'spec',
		name: 'Specification & Briefing',
		layer: 2,
		layerName: 'Independence & Systems',
		whatItIs: 'Translating creative intent into a 1-page checkable contract with clear constraints, acceptance criteria, and rejection conditions.',
		whyItMatters: 'Prevents prompt slot-machine spinning. Without explicit rejection criteria, you accept the first pleasant accident the model outputs.',
		exerciseTitle: '1-Page Checkable Brief with Rejection Rules',
		timeEstimate: '30m',
		exerciseSteps: [
			'Write a 7-layer brief for your chosen premise.',
			'Define at least 3 non-negotiable constraints (palette, syntax, aspect ratio, camera focal length).',
			'Write 3 explicit Rejection Conditions ("Any output containing X will be rejected immediately without review").'
		],
		rubric: {
			1: 'No useful brief; types stream-of-consciousness prompts hoping for lucky accidents.',
			2: 'Brief is either overly vague ("make it look premium") or micromanaged to the point of killing generative discovery.',
			3: 'Brief is operational, checkable, and leaves room for generative exploration within rigid boundaries.',
			4: 'Writes elegant, testable contracts that anyone or any system could execute and self-verify without your presence.'
		},
		diagnosticPrompt: 'Could an external partner inspect the resulting artifact and tell definitively if it passed or failed your brief?',
		exampleNote: 'Score: 2 (Emerging). My criteria were subjective ("feels authentic"). Updated to checkable rules ("must feature exactly 2 interacting focal points with background depth of field ≤ f/2.8").'
	},
	diag: {
		id: 'diag',
		name: 'Diagnostic Ladder',
		layer: 2,
		layerName: 'Independence & Systems',
		whatItIs: 'Diagnosing the highest unresolved level in a flawed work (Intent → Structure → Logic → Execution).',
		whyItMatters: 'Guards against bikeshedding: tweaking textures, lighting, or word choices (execution) when the underlying composition or premise (intent/structure) is fundamentally broken.',
		exerciseTitle: 'Top-Down Diagnostic Audit',
		timeEstimate: '20m',
		exerciseSteps: [
			'Take an output that feels unsatisfactory or incomplete.',
			'Climb the Top-Down Diagnostic Ladder: Level 1 (Premise), Level 2 (Structure/Massing), Level 3 (Logic), Level 4 (Execution/Finish).',
			'State: "The highest unresolved level is ____. The decision causing it is ____. The single fix is ____."'
		],
		rubric: {
			1: 'Surface tweaks only (swapping prompt adjectives or color filters) while core composition remains broken.',
			2: 'Often diagnoses local symptoms rather than root structural causes; optimizes details prematurely.',
			3: 'Correctly identifies whether a failure is structural, logical, or stylistic in most attempts.',
			4: 'Effortlessly identifies the root decision causing system failure; never wastes time polishing a broken foundation.'
		},
		diagnosticPrompt: 'Are you trying to fix lighting or polish when the core composition or idea is fundamentally flawed?',
		exampleNote: 'Score: 2 (Emerging). I spent an hour rerolling seeds to fix skin texture when the true problem was that the character silhouette had zero readability against the background.'
	},
	cur: {
		id: 'cur',
		name: 'Taste & Blind Curation',
		layer: 2,
		layerName: 'Independence & Systems',
		whatItIs: 'Evaluating and ranking outputs using explicit, defensible criteria rather than instinctual preference or halo effects.',
		whyItMatters: 'Protects against AI intoxication. When systems produce infinite seductive options, uncalibrated taste surrenders to easy novelty.',
		exerciseTitle: 'Blind 5-Item Ranking with Explicit Rubric',
		timeEstimate: '25m',
		exerciseSteps: [
			'Gather 5 artifacts (mix of human masters and AI generations).',
			'Strip provenance labels (blind review).',
			'Rank them 1 to 5 against 3 pre-stated criteria (e.g. structural restraint, internal consistency, lack of cliché).'
		],
		rubric: {
			1: 'No criteria; judgment is pure unexamined mood, reactive liking, or brand/model worship.',
			2: 'Personal preference dominates; struggles to explain why an aesthetically pleasing image fails the brief.',
			3: 'Uses explicit criteria, reference anchors, and structural analysis to defend curation decisions.',
			4: 'Maintains an uncompromising, calibrated anchor library; effortlessly detects borrowed aesthetics and model consensus.'
		},
		diagnosticPrompt: 'Can you defend your top choice purely by referencing formal criteria and the stated brief?',
		exampleNote: 'Score: 3 (Functional). I was able to rank 5 candidate layouts against typographic rhythm and reject the flashiest one because it broke visual reading order.'
	},
	sys: {
		id: 'sys',
		name: 'Pipeline & Systems Thinking',
		layer: 2,
		layerName: 'Independence & Systems',
		whatItIs: 'Understanding your generative tools as a multi-stage pipeline of discrete, modifiable variables and dependencies.',
		whyItMatters: 'Moves you from a consumer pushing a black-box button to an engineer who can isolate failure points and design custom workflows.',
		exerciseTitle: '9-Layer Workflow Decomposition',
		timeEstimate: '25m',
		exerciseSteps: [
			'Take a process you regularly execute (e.g. concept art, copywriting, editorial layout).',
			'Map the discrete stages: Input data → Semantic framing → First-pass generation → Structural audit → Refinement → Assembly.',
			'Identify the single most fragile failure point where quality is currently lost.'
		],
		rubric: {
			1: 'Copies workflows blindly from tutorials; regards the tool as magic black box.',
			2: 'Can operate software but cannot explain why specific nodes, prompts, or settings affect downstream results.',
			3: 'Understands pipeline dependencies, isolatable variables, and predictable failure points.',
			4: 'Designs robust, repeatable systems; invents bespoke workflows that compound authorial control.'
		},
		diagnosticPrompt: 'If your tool changed its base model tomorrow, could you recreate your workflow from first principles?',
		exampleNote: 'Score: 2 (Emerging). I know which buttons I click in ComfyUI, but if an upscaler node fails, I don’t understand the latent math well enough to debug without starting over.'
	},
	pred: {
		id: 'pred',
		name: 'Calibration & Prediction',
		layer: 2,
		layerName: 'Independence & Systems',
		whatItIs: 'Anticipating the exact effect of modifying a variable before executing it, quantified with calibrated confidence percentages.',
		whyItMatters: 'Eliminates aimless trial-and-error. Brier calibration forces mental models into mathematical reality, rapidly training intuition.',
		exerciseTitle: 'Pre-Run Prediction Lock with Confidence %',
		timeEstimate: '20m',
		exerciseSteps: [
			'Before changing a prompt parameter, cfg scale, camera angle, or line break, write down your prediction.',
			'Assign a confidence level (e.g. "I am 80% confident this will increase focal depth without adding secondary characters").',
			'Run the operation, record actual outcome, and note calibration error direction.'
		],
		rubric: {
			1: 'Cannot anticipate outcomes; changes settings randomly and checks what happened.',
			2: 'Sometimes anticipates results, but suffers from extreme overconfidence or vague predictions.',
			3: 'Usually anticipates outcomes accurately with calibrated confidence across familiar tools.',
			4: 'Maintains exceptionally tight Brier scores (<0.15); accurately predicts non-linear edge cases across unfamiliar systems.'
		},
		diagnosticPrompt: 'Are you predicting outcomes before you hit enter, or rationalizing whatever appears on screen?',
		exampleNote: 'Score: 1 (Not Yet). I thought increasing guidance would sharpen edges (90% confident); it completely oversaturated the color palette. My mental model was inverted.'
	},
	dir: {
		id: 'dir',
		name: 'Direction & Refusal',
		layer: 3,
		layerName: 'Agency & Authorship',
		whatItIs: 'Making consequential, defensible editorial decisions under pressure, including active refusal of inadequate work or unethical requests.',
		whyItMatters: 'Creative direction is not saying yes to suggestions; it is the discipline of what you refuse, prune, and hold sacred against deadline friction.',
		exerciseTitle: 'The Consequential Decision & Refusal Rep',
		timeEstimate: '20m',
		exerciseSteps: [
			'Take an active creative project under time pressure.',
			'Make one consequential decision that cuts 30% of extraneous material or refuses an easy model shortcut.',
			'Categorize your refusal using the 5-mode framework: Ethical, Positional, Technical, Intentional, or Slop Refusal.'
		],
		rubric: {
			1: 'Avoids making decisions; seeks endless validation or accepts model defaults out of fatigue.',
			2: 'Makes decisions but seeks excessive reassurance; struggles to say "no" to mediocre client or machine suggestions.',
			3: 'Makes and defends consequential decisions with reference to the core premise and boundary constraints.',
			4: 'Effortlessly executes principled refusal; redirects teams and systems with unwavering clarity and surgical restraint.'
		},
		diagnosticPrompt: 'What did you actively reject or delete from this project, and why?',
		exampleNote: 'Score: 2 (Emerging). I accepted an AI-generated background because it looked complex, even though it diluted the emotional focus of the central figure. I failed to execute intentional refusal.'
	},
	auth: {
		id: 'auth',
		name: 'Authorship & Stated Position',
		layer: 3,
		layerName: 'Agency & Authorship',
		whatItIs: 'Articulating and defending a consistent personal aesthetic stance: knowing what you repeatedly pursue and what you refuse.',
		whyItMatters: 'Guards against becoming a generic prompt operator whose portfolio has no recognizable artistic gravity, worldview, or voice.',
		exerciseTitle: 'Written vs Inferred Position Audit',
		timeEstimate: '30m',
		exerciseSteps: [
			'Write a 3-sentence Personal Artistic Position statement: What recurring obsessions do you pursue? What techniques or tropes do you refuse?',
			'Review your last 10 created pieces.',
			'Check for alignment: Is your stated position actually visible in the artifacts, or is it only verbal aspiration?'
		],
		rubric: {
			1: 'No distinct position; style swings wildly based on whatever tool, LoRA, or preset was released this week.',
			2: 'Position is mostly verbal theory; the work itself looks like standard generic AI outputs.',
			3: 'Position is clearly articulated and partially demonstrated across a coherent body of work.',
			4: 'Unmistakable authorial voice; recurring conceptual commitments and deliberate refusals are evident in every piece.'
		},
		diagnosticPrompt: 'If your name was stripped from your work, would an expert recognize it as distinctly authored by you?',
		exampleNote: 'Score: 2 (Emerging). My stated position claims minimalism and restraint, but 8 out of 10 of my recent generations were hyper-detailed maximalist renders. Huge gap between theory and reflex.'
	},
	trans: {
		id: 'trans',
		name: 'Transfer & Scaffolding Removal',
		layer: 3,
		layerName: 'Agency & Authorship',
		whatItIs: 'The ability to apply your directorial judgment and creative framework to an unfamiliar medium when all familiar crutches are stripped away.',
		whyItMatters: 'The ultimate test of true understanding. If your skills only work inside one specific software UI with preset templates, you do not possess creative direction; you possess software familiarity.',
		exerciseTitle: 'Cross-Medium Synthesis Test',
		timeEstimate: '30m',
		exerciseSteps: [
			'Take a core directing concept mastered in your primary medium (e.g. Visual Hierarchy in UI or 3D).',
			'Translate and apply it to a completely unfamiliar medium (e.g. 100-word prose cadence or soundscape arrangement).',
			'Remove all scaffolding (no templates, no cheat sheets, no guided exercises).'
		],
		rubric: {
			1: 'Cannot transfer skills; paralyzed the moment familiar software buttons or prompt templates are removed.',
			2: 'Can only apply principles in rehearsed, familiar contexts; becomes disoriented in a new medium.',
			3: 'Applies core principles to unfamiliar media with light prompting or structured reflection.',
			4: 'Fluidly transfers deep architectural principles across visual, spatial, textual, and acoustic disciplines with zero scaffolding.'
		},
		diagnosticPrompt: 'Can your creative judgment survive when your favorite software, template, or prompt library is taken away?',
		exampleNote: 'Score: 1 (Not Yet). I tried translating my visual rhythm principles into audio pacing and had no idea how to structure the attack and decay without a visual timeline. Total dependency on UI cues.'
	}
};
