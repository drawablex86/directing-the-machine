export interface ProjectSpec {
	id: string; // 'p1' .. 'p12'
	number: number;
	title: string;
	track: 'Intensive' | 'Independent';
	type: 'Visual' | 'Writing' | 'Hybrid';
	phaseOrMonth: string;
	duration: string;
	estimatedWorkload: string;
	prerequisites: string;
	primaryModalityId: string; // 'm0' .. 'm7'
	goal: string;
	brief: string;
	deliverables: {
		name: string;
		specification: string;
	}[];
	evaluationRubric: {
		level: string;
		criteria: string;
	}[];
}

export const ALL_PROJECTS: ProjectSpec[] = [
	{
		id: 'p1',
		number: 1,
		title: 'Problem-Finding, Observation & Diagnosis Portfolio',
		track: 'Intensive',
		type: 'Hybrid',
		phaseOrMonth: 'Weeks 1–2 (Part I: Find & Observe)',
		duration: '2 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Week 0 Baseline & Practice Contract',
		primaryModalityId: 'm2',
		goal: 'Build the foundational faculty of noticing without prompt cues, separating neutral observation from evaluative adjectives, and identifying the highest-level diagnostic problems across visual and written media.',
		brief: 'Build a rigorous diagnostic portfolio. Conduct 15 structured diagnoses (8 visual, 7 textual) using the top-down diagnostic ladder. Run 6 visual perception massing studies, 3 close-reading analyses, establish your first anchor set (accepted and rejected examples), and carry forward at least 1 defended problem with a positionality check.',
		deliverables: [
			{ name: '15 Written Diagnoses', specification: '8 visual, 7 textual using top-down diagnostic ladder with zero evaluative adjectives' },
			{ name: '6 Visual Perception Studies', specification: '5-second flash memory reconstructions tracing masses, focal hierarchy, and directional flow' },
			{ name: '3 Close-Reading Analyses', specification: 'Annotations tagging [TURN], [OMISSION], and neutral-prose subtraction diffs' },
			{ name: 'Personal Diagnostic Ladders', specification: 'Constructed personal visual and writing diagnostic hierarchies' },
			{ name: 'First Anchor Set', specification: 'Accepted and rejected reference anchors with explicit criteria (>=40% human)' },
			{ name: 'Defended Problem with Standing', specification: '1 selected problem from 4+ problem-finding entries with Positionality check' },
			{ name: 'Part I Transfer Test', specification: 'Unfamiliar-medium diagnosis with all ladders and scaffolds hidden' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Diagnoses consistently locate highest-level problems; zero evaluative shortcuts; positionality honestly refused or defended.' },
			{ level: 'Level 3 (Competent)', criteria: 'Diagnoses separate observation from evaluation; identifies structural problems; valid problem carried forward.' },
			{ level: 'Level 2 (Developing)', criteria: 'Occasional evaluative adjectives slip in; diagnoses focus heavily on surface polish rather than structure.' },
			{ level: 'Level 1 (Novice)', criteria: 'Conflates preference with diagnosis; relies on model defaults to define the problem.' }
		]
	},
	{
		id: 'p2',
		number: 2,
		title: 'Premise & Brief Lab',
		track: 'Intensive',
		type: 'Hybrid',
		phaseOrMonth: 'Weeks 3–4 (Part II: Formulate)',
		duration: '2 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Part I Mastery Gate passed',
		primaryModalityId: 'm3',
		goal: 'Master the progression from problem to premise to checkable specification before generating. Enforce craft-first manual generation gates and birth-of-project provenance.',
		brief: 'Generate 6 premise records with explicit rejection logic for competing alternatives. Draft 6 fully specified 7-layer briefs. Produce 12–18 rapid thumbnails and 4 writing structural outlines without AI before generating iterations. Maintain provenance stamps on human vs. machine contributions.',
		deliverables: [
			{ name: '6 Premise Records', specification: 'Each with tension, commitments, and 1-sentence rejection logic for 2 discarded premises' },
			{ name: '6 Fully Specified Briefs', specification: '7-layer stack: Premise, Intention, Constraints, References, Acceptance, Rejection, Risks' },
			{ name: '12–18 Visual Thumbnails', specification: 'Rapid 2-minute mass and value studies completed manually prior to generation' },
			{ name: '4 Writing Structural Outlines', specification: 'Unassisted structural skeletons written before model drafting' },
			{ name: '2 Iterations Per Brief', specification: 'Generated/drafted outputs diagnosed strictly against the initial brief' },
			{ name: '6 Provenance Records', specification: 'Birth-of-project stamp tracking human intent, tool contributions, and license rights' },
			{ name: 'Part II Transfer Test', specification: 'Write a brief for an unfamiliar medium under severe (10-rule) constraint density' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Premises have sharp genuine tension; briefs have checkable acceptance criteria; human decisions clearly isolated from tool output.' },
			{ level: 'Level 3 (Competent)', criteria: 'Premise distinct from subject; brief constrains without overdetermining; manual gates honored.' },
			{ level: 'Level 2 (Developing)', criteria: 'Brief contains vague mood requests; manual sketches appear perfunctory or skipped.' },
			{ level: 'Level 1 (Novice)', criteria: 'Relies on prompt recipes; brief is written post-hoc to justify accidental outputs.' }
		]
	},
	{
		id: 'p3',
		number: 3,
		title: 'Build a Working System',
		track: 'Intensive',
		type: 'Hybrid',
		phaseOrMonth: 'Weeks 5–6 (Part III: Build)',
		duration: '2 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Part II Mastery Gate passed',
		primaryModalityId: 'm4',
		goal: 'Turn creative intent into controllable causal pipeline architectures. Calibrate variable sensitivity and document failure boundaries.',
		brief: 'Build 2 documented pipeline systems (1 visual node graph, 1 writing prompt chain). Map all causal variables and known failure points. Produce 12 controlled visual variations and 8 controlled writing variations, logging pre-run confidence predictions and Brier telemetry scores.',
		deliverables: [
			{ name: '2 Documented Pipelines', specification: 'One visual (ComfyUI/nodal) and one writing pipeline with every stage explained as a causal decision' },
			{ name: 'Variable & Failure Maps', specification: 'Documented sensitivity thresholds, failure modes, and error recovery steps' },
			{ name: '12 Controlled Visual Variations', specification: 'Ablation studies modifying single parameters while holding the rest constant' },
			{ name: '8 Controlled Writing Variations', specification: 'Systematic alterations of voice mechanisms and structural pacing' },
			{ name: 'Calibration Log (5+ entries)', specification: 'Pre-run confidence predictions (0-100%) compared against actual results with Brier scoring' },
			{ name: 'Tool & Data Policy Record', specification: 'Explicit privacy, licensing, and compute cost audit for the tools used' },
			{ name: 'Part III Transfer Test', specification: 'Re-engineer one pipeline stage in an entirely different software tool without quality loss' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Pipelines demonstrate reliable causal control; Brier calibration accuracy <0.20 without taste narrowness.' },
			{ level: 'Level 3 (Competent)', criteria: 'Clear variable maps; reproducible results; predictions acknowledge genuine uncertainties.' },
			{ level: 'Level 2 (Developing)', criteria: 'Pipeline acts as an unpredictable black box; predictions reflect guessing rather than causal understanding.' },
			{ level: 'Level 1 (Novice)', criteria: 'Slot-machine prompting; cannot explain why an output broke or how to reproduce it.' }
		]
	},
	{
		id: 'p4',
		number: 4,
		title: 'Calibrate Taste',
		track: 'Intensive',
		type: 'Hybrid',
		phaseOrMonth: 'Weeks 7–8 (Part IV: Calibrate)',
		duration: '2 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Part III Mastery Gate passed',
		primaryModalityId: 'm5',
		goal: 'Transform subjective preference into verifiable taste infrastructure. Prevent aesthetic drift and algorithmic homogenization.',
		brief: 'Curate 2 anchor libraries of 15+ works each (>=40% human-created). Execute 20 comparative judgments using the 5-part taste formula. Formulate 2 explicit slop criteria, conduct 3 justified anchor demotions, and pass the 20-item blind provenance ranker.',
		deliverables: [
			{ name: '2 Anchor Libraries (15+ each)', specification: 'Curated records across visual and writing domains with >=40% human anchors' },
			{ name: '20 Comparative Judgments', specification: 'Preference + Criteria + Reference Class + Mechanism + Purpose logged for each pair' },
			{ name: '2 Slop Criteria Definitions', specification: 'Precise criteria defining plausible-looking but conceptually hollow work' },
			{ name: '3 Justified Anchor Demotions', specification: 'Explanations for why previously accepted anchors were demoted as taste matured' },
			{ name: 'Blind Provenance Ranking Test', specification: 'Rank 20 untitled/unattributed items with labels hidden and compare against true provenance' },
			{ name: 'Reverse-Direction Test', specification: 'Take a rejected output and author a brief where its specific flaws become deliberate strengths' },
			{ name: 'Taste-Range Audit', specification: 'Verify anchor breadth across styles and genres to confirm absence of taste narrowness' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Taste judgments demonstrate deep tacit criteria; blind rankings match committed values; demotions show real growth.' },
			{ level: 'Level 3 (Competent)', criteria: 'Clear criteria tied to purpose; maintains >=40% human anchors; identifies slop reliably.' },
			{ level: 'Level 2 (Developing)', criteria: 'Criteria rely on buzzwords; struggles to articulate why an anchor is demoted; susceptible to surface sheen.' },
			{ level: 'Level 1 (Novice)', criteria: 'Equates popularity or high fidelity with quality; cannot explain why an artifact works.' }
		]
	},
	{
		id: 'p5',
		number: 5,
		title: 'Directed Production',
		track: 'Intensive',
		type: 'Hybrid',
		phaseOrMonth: 'Weeks 9–10 (Part V: Direct)',
		duration: '2 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Part IV Mastery Gate passed',
		primaryModalityId: 'm6',
		goal: 'Exercise directorial judgment under real or simulated external stakeholder pressure, enforcing revision discipline and principled refusal.',
		brief: 'Execute 1 visual project and 1 writing project for an external or simulated stakeholder. Triage stakeholder critique through the 5 actions (Apply, Adapt, Propose Alternative, Push Back, Re-Brief). Enforce a maximum of 3 named revision cycles, write 2 defenses, and draft 2 explicit refusals.',
		deliverables: [
			{ name: '1 Complete Visual Project', specification: 'Full campaign key asset produced to client brief within 3 revision cycles' },
			{ name: '1 Complete Writing Project', specification: 'Full editorial or messaging document delivered to specification' },
			{ name: '2 Stakeholder Critique Logs', specification: 'Surface feedback translated into inferred root problems with chosen actions' },
			{ name: '2 Consequential Defenses', specification: 'Written rationales defending directorial decisions against stakeholder preference' },
			{ name: '2 Explicit Refusals', specification: 'Using the 5 refusal modes (Ethical, Positional, Technical, Intentional, Slop)' },
			{ name: '1 Formal Re-Brief Record', specification: 'Documenting when solving the wrong problem required stopping and resetting the brief' },
			{ name: 'Part V Transfer Test', specification: 'Direct a collaboration drill with strict decision rights separation' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Maintains authorial integrity under stakeholder pushback; executes principled refusals cleanly; never exceeds 3 revision cycles.' },
			{ level: 'Level 3 (Competent)', criteria: 'Translates vague feedback to root problems; defends choices with structural arguments; re-briefs when appropriate.' },
			{ level: 'Level 2 (Developing)', criteria: 'Vacillates between defensive resistance and passive capitulation; gets trapped in endless micro-tweaks.' },
			{ level: 'Level 1 (Novice)', criteria: 'Surrenders editorial direction to the client or machine without argument.' }
		]
	},
	{
		id: 'p6',
		number: 6,
		title: 'Authorship, Synthesis & Blank Sheet',
		track: 'Intensive',
		type: 'Hybrid',
		phaseOrMonth: 'Weeks 11–12 (Part VI: Author & Transfer)',
		duration: '2 weeks',
		estimatedWorkload: '25–30 hrs/week',
		prerequisites: 'Part V Mastery Gate passed',
		primaryModalityId: 'm7',
		goal: 'Synthesize visual and writing faculties into an autonomous authorial stance. Prove readiness for unassisted independent practice.',
		brief: 'Formalize both Private and Public Authorial Position statements. Assemble 5–8 case studies for visual and writing portfolios. Deliver 1 cross-medium synthesis piece (image + text where neither can be removed), 1 public process essay, and complete the 14-Step Blank-Sheet Capstone from unassigned conditions.',
		deliverables: [
			{ name: 'Private & Public Authorial Positions', specification: 'Explicit declaration of what you repeatedly pursue and refuse, and what you owe an audience' },
			{ name: 'Visual Portfolio (5–8 Cases)', specification: 'Documented case studies showing problem, premise, brief, pipeline, diagnosis, and outcome' },
			{ name: 'Writing Portfolio (5–8 Cases)', specification: 'Case studies demonstrating structural voice control and editorial direction' },
			{ name: '1 Cross-Medium Synthesis Work', specification: 'Work where removing either visual or textual component causes the argument to collapse' },
			{ name: '1 Public Process Document', specification: 'Transparent publication of process, rejections, failures, and provenance' },
			{ name: 'Blank-Sheet Capstone', specification: '14-step project originated from real-world observation with all app scaffolds removed' },
			{ name: '"How I Decided What to Make" Essay', specification: '2-page reflective essay defending the origin of your blank-sheet project' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Demonstrates unmistakable individual voice; authorial position matches blinded work; completes blank-sheet project autonomously.' },
			{ level: 'Level 3 (Competent)', criteria: 'Sound portfolios; synthesis is cohesive; positions are clear and defensible.' },
			{ level: 'Level 2 (Developing)', criteria: 'Work still reflects aesthetic trends of underlying models; portfolio lacks unified intention.' },
			{ level: 'Level 1 (Novice)', criteria: 'Cannot originate projects without external briefs; relies on templates for identity.' }
		]
	},
	{
		id: 'p7',
		number: 7,
		title: 'Visual Campaign (Directed Execution)',
		track: 'Independent',
		type: 'Visual',
		phaseOrMonth: 'Month 4',
		duration: '4 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'All Intensive Phases (Weeks 1–12)',
		primaryModalityId: 'm4',
		goal: 'Produce a comprehensive visual campaign from an external brief, demonstrating that your pipeline and diagnostic vision withstand client constraints.',
		brief: 'Direct a campaign concept and key visual for a product, service, or social initiative. Scaffold supplied: an external brief (or commitment to a fixed external spec). Your responsibility: pipeline design, 10 first-round outputs diagnosed, 10 revised outputs with 1 accepted and 3 rejected with justification, 20-entry decision log, and a 1-page written defense.',
		deliverables: [
			{ name: 'Working Brief', specification: 'Intention, constraints, references, acceptance criteria, rejection conditions, and risk assessment' },
			{ name: 'Documented Visual Pipeline', specification: 'Node graph or tool chain with every step documented as a directorial decision' },
			{ name: 'First Output Set (10 items)', specification: '10 generated variants, each diagnosed against the working brief' },
			{ name: 'Second Output Set (10 items)', specification: '10 revised variants with 1 accepted and 3 formally rejected with rationale' },
			{ name: 'Decision Log (20+ entries)', specification: 'Naming the decision, diagnostic level, alternatives considered, and result' },
			{ name: 'Written Defense (1 page)', specification: 'Defending the final key visual across composition, value, and thematic intent' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Campaign communicates intention instantly; pipeline is robust and reproducible; defense withstands critique.' },
			{ level: 'Level 3 (Competent)', criteria: 'Meets client specification; clear diagnostic path; 3 revision limit respected.' },
			{ level: 'Level 2 (Developing)', criteria: 'Output is aesthetically pleasing but misses the core brief intent; patchy decision log.' },
			{ level: 'Level 1 (Novice)', criteria: 'Deviates from external brief to chase model hallucinations; lacks control.' }
		]
	},
	{
		id: 'p8',
		number: 8,
		title: 'Writing Voice Guide (Brief Ownership)',
		track: 'Independent',
		type: 'Writing',
		phaseOrMonth: 'Month 5',
		duration: '4 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Project 7 completed',
		primaryModalityId: 'm3',
		goal: 'Define and enforce an original writing voice guide for a publication or brand, supplying the brief yourself from a broad project category.',
		brief: 'Select a broad category (e.g. investigative journalism, technical documentation, literary non-fiction). Scaffold supplied: category only. Your responsibility: define audience, premise, voice mechanisms, and acceptance rules. Deliver an 8–12 page Voice Guide with 5 exemplar pieces, positive and negative voice examples, and a 20-entry decision log.',
		deliverables: [
			{ name: 'Voice Specification Guide', specification: '8–12 pages documenting the 9 voice mechanisms, sentence rhythm, and qualification thresholds' },
			{ name: '5 Exemplar Pieces', specification: 'Written texts illustrating the voice in varied contexts (narrative, explanatory, polemic)' },
			{ name: 'Positive & Negative Anchors', specification: 'Side-by-side comparisons showing authentic voice vs. synthetic voice mimicry' },
			{ name: 'Prompt & Workflow Protocol', specification: 'The editorial pipeline used to keep generation within the defined voice constraints' },
			{ name: 'Decision Log (20+ entries)', specification: 'Tracking editorial choices, cuts, and tonal adjustments' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Voice is distinct, consistent, and resilient across all 5 exemplars; rules are mechanistic, not mood-based.' },
			{ level: 'Level 3 (Competent)', criteria: 'Clear voice guide; examples align with rules; negative examples clearly diagnosed.' },
			{ level: 'Level 2 (Developing)', criteria: 'Voice defaults to standard AI corporate enthusiasm; rules rely on vague adjectives.' },
			{ level: 'Level 1 (Novice)', criteria: 'Inconsistent tone across pieces; unable to explain why a paragraph fails the voice standard.' }
		]
	},
	{
		id: 'p9',
		number: 9,
		title: 'Hybrid Visual Essay (Premise Ownership)',
		track: 'Independent',
		type: 'Hybrid',
		phaseOrMonth: 'Month 6',
		duration: '4 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Project 8 completed',
		primaryModalityId: 'm7',
		goal: 'Create an original hybrid essay where visual and written media are inseparable, originating the premise from a broad theme.',
		brief: 'Select a broad theme (e.g. "displacement", "memory of landscapes", "surveillance as comfort"). Scaffold supplied: theme only. Your responsibility: discover a compelling premise with tension. Deliver an 8–12 page/screen visual essay (1,500–2,500 words + 8–12 images) that passes the Cross-Medium Synthesis Removal Test (removing either medium collapses the work).',
		deliverables: [
			{ name: 'Premise Formulation Record', specification: '3 competing premises generated from the theme with explicit rejection logic' },
			{ name: 'Finished Hybrid Essay', specification: '1,500–2,500 words integrated with 8–12 original visual assets' },
			{ name: 'Synthesis Removal Test Report', specification: 'Formal demonstration that image and text rely on each other structurally' },
			{ name: 'Integrated Provenance Ledger', specification: 'Complete record of human and tool contributions for all text and image assets' },
			{ name: 'Decision Log (25+ entries)', specification: 'Documenting pacing, spatial layout, and editorial revisions' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Deep structural interdependence between image and text; compelling, non-trivial premise; unforgettable rhythm.' },
			{ level: 'Level 3 (Competent)', criteria: 'Passes removal test; clear tension; images do more than illustrate text.' },
			{ level: 'Level 2 (Developing)', criteria: 'Images act as mere decorative bookends to a standard written essay.' },
			{ level: 'Level 1 (Novice)', criteria: 'Topic instead of premise; visual and text seem generated by unrelated prompts.' }
		]
	},
	{
		id: 'p10',
		number: 10,
		title: 'Character Design System (Problem Discovery)',
		track: 'Independent',
		type: 'Visual',
		phaseOrMonth: 'Month 7',
		duration: '4 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Project 9 completed',
		primaryModalityId: 'm1',
		goal: 'Diagnose the real problem behind a stated stakeholder need in a complex visual domain and engineer a character consistency system.',
		brief: 'Engage with a real or simulated client seeking character assets for narrative/game media. Scaffold supplied: stakeholder situation with a misleading surface request. Your responsibility: diagnose the true underlying problem, re-brief the client, and build a character design system with persistent identity across 15+ varied emotional, lighting, and action states.',
		deliverables: [
			{ name: 'Diagnostic Re-Brief Document', specification: 'Reframing the client\'s surface request into the true structural problem' },
			{ name: 'Character Model Sheet & Turnaround', specification: 'Orthographic views, facial expression matrix, and costume anatomy' },
			{ name: '15 Contextual Character Outputs', specification: 'Character situated across 15 varied dramatic environments maintaining strict identity' },
			{ name: 'Identity Drift Audit', specification: 'Quantitative measurement of facial/costume consistency across seed changes' },
			{ name: 'Directorial Decision Log (25+ entries)', specification: 'Documenting prompt adaptations, ControlNet/LoRA interventions, and manual paint-overs' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Flawless character identity across extreme angles/lighting; exceptional client re-briefing.' },
			{ level: 'Level 3 (Competent)', criteria: 'Strong facial consistency; recognizable silhouette; successful problem diagnosis.' },
			{ level: 'Level 2 (Developing)', criteria: 'Face drifts across scenes; relies on identical poses to maintain consistency.' },
			{ level: 'Level 1 (Novice)', criteria: 'Different person in every shot; accepted surface brief without diagnosis.' }
		]
	},
	{
		id: 'p11',
		number: 11,
		title: 'Editorial Series (Self-Originated Practice)',
		track: 'Independent',
		type: 'Writing',
		phaseOrMonth: 'Month 8',
		duration: '4 weeks',
		estimatedWorkload: '20–25 hrs/week',
		prerequisites: 'Project 10 completed',
		primaryModalityId: 'm6',
		goal: 'Run an entire editorial cycle with zero scaffolding supplied, sustaining voice and inquiry across multiple interconnected installments.',
		brief: 'Scaffold supplied: None. You wake up with a blank page. Notice a problem in the world, formulate a premise, write the brief, and produce a 3-part investigative or analytical essay series (1,200–1,800 words each). Conduct external peer calibration reviews without accepting unexamined changes.',
		deliverables: [
			{ name: 'Unassigned Problem Record', specification: 'Originating the inquiry from unstructured observation using the 60m Unassigned Beginning' },
			{ name: 'Series Brief & Arc Architecture', specification: 'Cohesive premise, through-line, and distinct intention for each installment' },
			{ name: '3 Polished Editorial Essays', specification: '3 connected pieces demonstrating sustained voice, rigorous argument, and precision' },
			{ name: 'External Calibration Audit', specification: 'Feedback records from 2+ outside readers evaluated through Apply/Adapt/Reject' },
			{ name: 'Decision Log (30+ entries)', specification: 'Comprehensive trail of conceptual, structural, and line edits' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Original, consequential inquiry; impeccable structural pacing; demonstrates mature self-direction.' },
			{ level: 'Level 3 (Competent)', criteria: 'Coherent 3-part series; clear voice; sound response to external critique.' },
			{ level: 'Level 2 (Developing)', criteria: 'Series fragments into repetitive restatements of a single point; voice flags by Part 3.' },
			{ level: 'Level 1 (Novice)', criteria: 'Clichéd internet-summary style; relies on external cues to choose a subject.' }
		]
	},
	{
		id: 'p12',
		number: 12,
		title: 'Capstone: Integrated Creative Package (Blank-Sheet Capstone)',
		track: 'Independent',
		type: 'Hybrid',
		phaseOrMonth: 'Month 9',
		duration: '4 weeks',
		estimatedWorkload: '30–35 hrs/week',
		prerequisites: 'All prior projects (P1–P11)',
		primaryModalityId: 'm7',
		goal: 'Demonstrate total creative agency and complete mastery of the curriculum as an integrated practice from real-world conditions only.',
		brief: 'Produce a complete creative package (visual + textual + pipeline) for a major publication, client, or self-directed movement. Scaffold supplied: None. Originate the problem, premise, brief, pipeline, execution, curation, and defense. Includes the comprehensive "How I Decided What to Make" essay and exit readiness verification.',
		deliverables: [
			{ name: 'Master Strategic Brief', specification: 'Unified intention, constraints, references, and acceptance criteria for visual and text components' },
			{ name: 'Integrated Package Deliverables', specification: 'Visual key assets, campaign suite, and full editorial/copy package delivered at commercial caliber' },
			{ name: 'Dual Production Pipelines', specification: 'Documented visual nodal graph and writing prompt/editorial workflow' },
			{ name: 'Complete Decision Ledger (40+ entries)', specification: 'Every consequential decision mapped with alternatives, levels, and outcomes' },
			{ name: '10-Piece Blind Position Audit', specification: 'Testing whether inferred commitments match your public authorial position' },
			{ name: '"How I Decided What to Make" Capstone Essay', specification: 'A transparent, honest retrospective documenting how you found the problem and maintained agency' }
		],
		evaluationRubric: [
			{ level: 'Level 4 (Mastery)', criteria: 'Demonstrates complete creative authorship in an AI-augmented world; work is singular, defensible, and reproducible.' },
			{ level: 'Level 3 (Competent)', criteria: 'High professional finish; clear authorial intent; sound decision trails.' },
			{ level: 'Level 2 (Developing)', criteria: 'Strong craft execution but derivative positioning; relies on safe conventions.' },
			{ level: 'Level 1 (Novice)', criteria: 'Cannot demonstrate why choices were made without referencing prompt recipes.' }
		]
	}
];
