export interface DailyTask {
	id: string;
	stepId: 'read' | 'practise' | 'study' | 'make' | 'diagnose' | 'log' | 'transfer' | 'play';
	title: string;
	time: string;
	description: string;
	targetModalityId: string; // 'm0' .. 'm7' or 'logs'
	actionPrompt: string;
	referenceSection?: string;
}

export interface DayPlan {
	dayNumber: number; // 1 to 7 (Mon to Sun)
	dayName: string;
	focus: string;
	assignedReading: {
		moduleCode: string;
		title: string;
		keyMentalModel: string;
		referenceDoc: string;
	};
	tasks: DailyTask[];
}

export interface WeekPlan {
	weekNumber: number; // 0 to 18 (0: Week 0, 1-12: Parts I-VI, 13-18: Months 4-9)
	title: string;
	partNumber: number; // 0 to 12
	phaseName: string;
	masteryLayer: 1 | 2 | 3;
	layerName: string;
	governingQuestion: string;
	scaffolding: {
		supplied: string[];
		removed: string[];
	};
	activeProjectId: string; // 'p1' .. 'p12'
	weeklyDeliverables: string[];
	masteryGateCriteria: string[];
	days: DayPlan[];
}

// Generate the 7 standard daily tasks customized for a specific day's assignment
function makeDayTasks(params: {
	weekNum: number;
	dayNum: number;
	readTitle: string;
	readModule: string;
	drillTitle: string;
	drillDesc: string;
	studyTitle: string;
	studyDesc: string;
	projectMilestone: string;
	diagDesc: string;
	transferDesc: string;
	projectId: string;
	primaryModId: string;
}): DailyTask[] {
	const { weekNum, dayNum, readTitle, readModule, drillTitle, drillDesc, studyTitle, studyDesc, projectMilestone, diagDesc, transferDesc, projectId, primaryModId } = params;
	const prefix = `w${weekNum}_d${dayNum}`;

	return [
		{
			id: `${prefix}_read`,
			stepId: 'read',
			title: `Read ${readModule}: ${readTitle}`,
			time: '20–30m',
			description: 'Read the assigned core concept. Do not read ahead into other modules.',
			targetModalityId: primaryModId,
			actionPrompt: `Study the core concepts of ${readModule}. Distinguish understanding from mere familiarity.`
		},
		{
			id: `${prefix}_practise`,
			stepId: 'practise',
			title: `Drill: ${drillTitle}`,
			time: '60–90m',
			description: drillDesc,
			targetModalityId: primaryModId,
			actionPrompt: 'Isolate this specific micro-skill. Aim for the 70–80% success zone (failing 2–3 reps out of 10).'
		},
		{
			id: `${prefix}_study`,
			stepId: 'study',
			title: `Craft Study: ${studyTitle}`,
			time: '60m',
			description: studyDesc,
			targetModalityId: primaryModId,
			actionPrompt: 'Execution as knowledge. Trace mechanisms rather than copying surface style.'
		},
		{
			id: `${prefix}_make`,
			stepId: 'make',
			title: `Project Application: ${projectMilestone}`,
			time: '2–3h',
			description: `Work directly on your active milestone for Project ${projectId.toUpperCase()}.`,
			targetModalityId: primaryModId,
			actionPrompt: 'Execute against the brief. Maintain provenance and record human vs. model decisions.'
		},
		{
			id: `${prefix}_diagnose`,
			stepId: 'diagnose',
			title: 'Top-Down Diagnosis',
			time: '30m',
			description: diagDesc,
			targetModalityId: 'm2',
			actionPrompt: 'Audit the output. Rule: Do not optimize a lower level while a higher level remains broken.'
		},
		{
			id: `${prefix}_log`,
			stepId: 'log',
			title: 'Hard-Capped Studio Log',
			time: '10–15m',
			description: '10-minute maximum countdown: Problem-Finding, Calibration, or Decision Log.',
			targetModalityId: 'logs',
			actionPrompt: 'Capture decisions and predictions quickly. The document is not the practice.'
		},
		{
			id: `${prefix}_transfer`,
			stepId: 'transfer',
			title: 'Transfer / Synthesis Rep',
			time: '30–60m',
			description: transferDesc,
			targetModalityId: primaryModId,
			actionPrompt: 'Apply this understanding to an unfamiliar context or medium with scaffolding removed.'
		},
		{
			id: `${prefix}_play`,
			stepId: 'play',
			title: 'Unstructured Play Practice',
			time: '30m',
			description: 'Make something for no reason at all. Evaluation and rubrics are forbidden.',
			targetModalityId: 'm0',
			actionPrompt: 'Engage curiosity without instrumental intent. End with 1 sentence: "What did I enjoy?"'
		}
	];
}

export const COURSE_WEEKS: WeekPlan[] = [
	{
		weekNumber: 0,
		title: 'Week 0 — Baseline & Practice Contract',
		partNumber: 0,
		phaseName: 'Foundation & Baseline',
		masteryLayer: 1,
		layerName: 'Capability',
		governingQuestion: 'Where do I honestly stand today, and what commitment will sustain my practice?',
		scaffolding: {
			supplied: ['12-Competency Diagnostic Rubrics', 'Intensity Calculator', 'Ethics Template'],
			removed: []
		},
		activeProjectId: 'p1',
		weeklyDeliverables: [
			'12-Competency Baseline Self-Assessment (scored 1–4)',
			'Selected Intensity Path & Runway Plan (Appendix O)',
			'Signed Ethics & AI Contextual Disclosure Agreement',
			'Calibration Network Roster (5 contact roles)'
		],
		masteryGateCriteria: [
			'Honest baseline self-score without inflation',
			'Realistic weekly hours allocated based on actual schedule',
			'Clear commitment to deliberate practice over passive consumption'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Orientation & Module 0',
				assignedReading: {
					moduleCode: 'Module 0',
					title: 'How to Practice This Course',
					keyMentalModel: 'Deliberate Practice vs. Mere Production (70–80% Difficulty Zone)',
					referenceDoc: 'Directing the Machine.md #Module 0'
				},
				tasks: makeDayTasks({
					weekNum: 0,
					dayNum: 1,
					readTitle: 'How to Practice This Course',
					readModule: 'Module 0',
					drillTitle: '70–80% Drill Design',
					drillDesc: 'Design one micro-drill isolating a sub-skill where you fail 2–3 reps out of 10.',
					studyTitle: 'Appendix I Protocol Review',
					studyDesc: 'Review deliberate practice protocols and feedback sources.',
					projectMilestone: 'Baseline Diagnostic Part 1 (Competencies 1–4)',
					diagDesc: 'Assess self-honesty in score allocation.',
					transferDesc: 'Explain the difference between practicing and producing to a peer.',
					projectId: 'p1',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Baseline Diagnostic Completion',
				assignedReading: {
					moduleCode: 'Week 0',
					title: 'The 12 Baseline Competencies',
					keyMentalModel: 'The map of creative authorship across observation, formulation, and agency',
					referenceDoc: 'Directing the Machine.md #Week 0'
				},
				tasks: makeDayTasks({
					weekNum: 0,
					dayNum: 2,
					readTitle: 'The 12 Baseline Competencies',
					readModule: 'Week 0',
					drillTitle: 'Competencies 5–8 Micro-Tests',
					drillDesc: 'Run brief writing and curation micro-tests to score baseline accurately.',
					studyTitle: 'Appendix C Rubrics Scale',
					studyDesc: 'Study the Level 1 to 4 descriptors in Appendix C.',
					projectMilestone: 'Complete 12 Baseline Radar Scores',
					diagDesc: 'Verify no score is inflated by theoretical knowledge.',
					transferDesc: 'Compare your weakest competency against your strongest.',
					projectId: 'p1',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Tool & Access Audit',
				assignedReading: {
					moduleCode: 'Appendix A',
					title: 'Tool & Practice Stack',
					keyMentalModel: 'Categories persist, tools change. Map tools into functional categories.',
					referenceDoc: 'Directing the Machine.md #Appendix A'
				},
				tasks: makeDayTasks({
					weekNum: 0,
					dayNum: 3,
					readTitle: 'Tool & Practice Stack',
					readModule: 'Appendix A',
					drillTitle: 'Pipeline Tool Benchmark',
					drillDesc: 'Audit local GPU, cloud APIs, text models, and backup workflows.',
					studyTitle: 'Local File & Archive Setup',
					studyDesc: 'Create the Appendix L folder hierarchy for project records.',
					projectMilestone: 'Sign Tool & Sustainability Plan',
					diagDesc: 'Confirm local fallback if API keys or accounts get rate-limited.',
					transferDesc: 'Test one task on an alternate secondary tool.',
					projectId: 'p1',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Income & Intensity Path',
				assignedReading: {
					moduleCode: 'Appendix O',
					title: 'Working Across Intensity Levels',
					keyMentalModel: 'Preserve the scaffolding sequence, adapt the calendar.',
					referenceDoc: 'Directing the Machine.md #Appendix O'
				},
				tasks: makeDayTasks({
					weekNum: 0,
					dayNum: 4,
					readTitle: 'Working Across Intensity Levels',
					readModule: 'Appendix O',
					drillTitle: 'Calendar Time-Blocking',
					drillDesc: 'Block non-negotiable studio practice sessions for the next 4 weeks.',
					studyTitle: 'Failure Protocol Review',
					studyDesc: 'Read Habit Failure protocols to know how to respond to missed days.',
					projectMilestone: 'Lock Intensity Path (12w / 24w / 48w)',
					diagDesc: 'Audit whether your weekly hour target is realistic or wishful thinking.',
					transferDesc: 'Identify what activities must be sacrificed to protect practice.',
					projectId: 'p1',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Ethics, Disclosure & Calibration Network',
				assignedReading: {
					moduleCode: 'Week 0 & App J',
					title: 'Ethics, Disclosure & Calibration Partners',
					keyMentalModel: 'External calibration replaces the absent professor.',
					referenceDoc: 'Directing the Machine.md #Week 0'
				},
				tasks: makeDayTasks({
					weekNum: 0,
					dayNum: 5,
					readTitle: 'Ethics & Calibration Network',
					readModule: 'Week 0',
					drillTitle: 'Sign Disclosure Contract',
					drillDesc: 'Sign ethics guidelines on training data, copyright, and client transparency.',
					studyTitle: 'Calibration Roster Setup',
					studyDesc: 'Map 5 individuals or peer groups to the 5 critique roles.',
					projectMilestone: 'Week 0 Sign-Off & Verification',
					diagDesc: 'Ensure at least 2 calibration roles are outside your immediate echo chamber.',
					transferDesc: 'Simulate explaining your disclosure policy to a skeptical client.',
					projectId: 'p1',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Protected Attention & Play Session',
				assignedReading: {
					moduleCode: 'Module 3',
					title: 'Non-Instrumental Attention',
					keyMentalModel: 'Perceptions not immediately monetized or converted to output preserve serendipity.',
					referenceDoc: 'Directing the Machine.md #Module 3'
				},
				tasks: makeDayTasks({
					weekNum: 0,
					dayNum: 6,
					readTitle: 'Non-Instrumental Attention',
					readModule: 'Module 3',
					drillTitle: '60-Minute Walk without Destination',
					drillDesc: 'Take a 60m walk without phone, music, or destination. Sustain pure attention.',
					studyTitle: 'Tacit Experience vs. Information',
					studyDesc: 'Notice how the brain seeks to turn every sight into a project idea, and resist it.',
					projectMilestone: 'Log 1 Non-Instrumental Line & 1 Play Line',
					diagDesc: 'Verify input contains zero evaluative or analytical tags.',
					transferDesc: 'Draw or photograph one observed texture without intention to use it.',
					projectId: 'p1',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Weekly Review & Week 1 Prep',
				assignedReading: {
					moduleCode: 'Part I Intro',
					title: 'Find & Observe Overview',
					keyMentalModel: 'Before directing a machine, learn to notice without the machine directing you.',
					referenceDoc: 'Directing the Machine.md #Part I'
				},
				tasks: makeDayTasks({
					weekNum: 0,
					dayNum: 7,
					readTitle: 'Find & Observe Overview',
					readModule: 'Part I',
					drillTitle: 'Log Review & Clean-Up',
					drillDesc: 'Review baseline contract and verify readiness for Week 1.',
					studyTitle: 'Diagnostic Ladder Preview',
					studyDesc: 'Inspect the 5 universal diagnostic ladder levels.',
					projectMilestone: 'Week 0 Complete -> Advance to Week 1',
					diagDesc: 'Check that all Week 0 contracts and baseline scores are committed.',
					transferDesc: 'State in one sentence what capability you aim to build in Part I.',
					projectId: 'p1',
					primaryModId: 'm0'
				})
			}
		]
	},
	{
		weekNumber: 1,
		title: 'Week 1 — The Judgment Gap & Observation',
		partNumber: 1,
		phaseName: 'Part I: Find & Observe',
		masteryLayer: 1,
		layerName: 'Capability',
		governingQuestion: 'What is actually happening here, and how do I describe it without evaluative shortcuts?',
		scaffolding: {
			supplied: ['Exercise', 'Diagnostic Ladder', 'Templates', 'References'],
			removed: []
		},
		activeProjectId: 'p1',
		weeklyDeliverables: [
			'8 Written Diagnoses (4 visual, 4 textual) with zero evaluative adjectives',
			'3 Visual Perception Massing Studies (5-second flash)',
			'2 Close-Reading Annotations ([TURN], [OMISSION])',
			'2 Problem-Finding entries with Positionality checks'
		],
		masteryGateCriteria: [
			'Observation strictly distinguished from evaluation',
			'Zero evaluative adjectives in diagnostic statements',
			'Accurate identification of highest unresolved problem rung'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'The Judgment Gap & Zero-Adjective Rule',
				assignedReading: {
					moduleCode: 'Module 1',
					title: 'The Judgment Gap & Reciprocal Principle',
					keyMentalModel: 'A question is not exploration until it changes what you do.',
					referenceDoc: 'Directing the Machine.md #Module 1'
				},
				tasks: makeDayTasks({
					weekNum: 1,
					dayNum: 1,
					readTitle: 'The Judgment Gap',
					readModule: 'Module 1',
					drillTitle: 'Zero-Adjective Observation Linter',
					drillDesc: 'Write 3 observation paragraphs describing a generated artifact with all evaluative words blocked.',
					studyTitle: '6-Question Decision Audit',
					studyDesc: 'Separate human intention from model defaults on 2 sample images.',
					projectMilestone: 'Project 1: Diagnoses 1 & 2 (Visual)',
					diagDesc: 'Audit whether "strong", "weak", or "good" appeared in your reasoning.',
					transferDesc: 'Perform zero-adjective description on an architectural facade or street sign.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Problem-Finding & Positionality',
				assignedReading: {
					moduleCode: 'Module 2',
					title: 'Problem-Finding & Positionality Compass',
					keyMentalModel: 'Problem-solving works on given problems; problem-finding decides what warrants attention.',
					referenceDoc: 'Directing the Machine.md #Module 2'
				},
				tasks: makeDayTasks({
					weekNum: 1,
					dayNum: 2,
					readTitle: 'Problem-Finding & Positionality',
					readModule: 'Module 2',
					drillTitle: '5-in-30 Problem Funnel',
					drillDesc: 'Notice 5 real-world frictions in 30 minutes. Frame each with tension and stakes.',
					studyTitle: 'Positionality Check (From/With/For/About/Over)',
					studyDesc: 'Evaluate your standing to pursue each of the 5 problems. Refuse at least 1.',
					projectMilestone: 'Project 1: Problem Log Entries 1 & 2',
					diagDesc: 'Verify selected problem has concrete friction rather than a generic theme.',
					transferDesc: 'Reframe a technical software bug as an authorial or communicative problem.',
					projectId: 'p1',
					primaryModId: 'm1'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Diagnostic Vision & The 5 Levels',
				assignedReading: {
					moduleCode: 'Module 4',
					title: 'Diagnostic Vision & Top-Down Ladder',
					keyMentalModel: 'Intent -> Structure -> Perceptual Effect -> Construction -> Surface.',
					referenceDoc: 'Directing the Machine.md #Module 4'
				},
				tasks: makeDayTasks({
					weekNum: 1,
					dayNum: 3,
					readTitle: 'Diagnostic Vision',
					readModule: 'Module 4',
					drillTitle: '7-Step Diagnostic Sequencer',
					drillDesc: 'Identify the highest unresolved rung before touching any lower-level execution details.',
					studyTitle: 'Diagnostic Ladder Hierarchy',
					studyDesc: 'Examine why fixing lighting when composition is broken produces glossy slop.',
					projectMilestone: 'Project 1: Diagnoses 3 & 4 (Textual)',
					diagDesc: 'Ensure highest unresolved level is named in the canonical sentence form.',
					transferDesc: 'Apply the 5-rung diagnostic ladder to a musical track or podcast snippet.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Visual Observation & Massing Canvas',
				assignedReading: {
					moduleCode: 'Module V1',
					title: 'Visual Observation & Diagnosis',
					keyMentalModel: 'Visual hierarchy: Major Masses -> Focal Path -> Value Structure -> Directional Axes.',
					referenceDoc: 'Directing the Machine.md #Module V1'
				},
				tasks: makeDayTasks({
					weekNum: 1,
					dayNum: 4,
					readTitle: 'Visual Observation & Diagnosis',
					readModule: 'Module V1',
					drillTitle: '5-Second Flash & Memory Reconstruction',
					drillDesc: 'Flash reference for 5,000ms, blank screen, sketch 3 major masses from memory.',
					studyTitle: 'Master Decomposition (App H)',
					studyDesc: 'Reduce a classical painting to 3 distinct value groupings (light, mid, dark).',
					projectMilestone: 'Project 1: Perception Studies 1 & 2',
					diagDesc: 'Compare memory sketch against master image. Note what structural forces were missed.',
					transferDesc: 'Trace masses on a crowded photograph without drawing contours.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Writing Observation & Close-Reading',
				assignedReading: {
					moduleCode: 'Module W1',
					title: 'Writing Observation & Diagnosis',
					keyMentalModel: 'Voice is not surface adjectives; voice is structural tension and omission.',
					referenceDoc: 'Directing the Machine.md #Module W1'
				},
				tasks: makeDayTasks({
					weekNum: 1,
					dayNum: 5,
					readTitle: 'Writing Observation & Diagnosis',
					readModule: 'Module W1',
					drillTitle: 'Neutral-Prose Subtraction Diff',
					drillDesc: 'Rewrite an authoritative paragraph into flat neutral prose. Highlight what disappeared.',
					studyTitle: 'Close-Reading Annotation',
					studyDesc: 'Annotate a passage with tags [TURN], [OMISSION], and [RHYTHM SHIFT].',
					projectMilestone: 'Project 1: Close-Reading Analysis 1',
					diagDesc: 'Verify that the claim was isolated from its rhetorical delivery.',
					transferDesc: 'Apply close-reading to an instruction manual or legal disclaimer.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Transfer Drill & Play',
				assignedReading: {
					moduleCode: 'Appendix G',
					title: 'Transfer Tests Protocol',
					keyMentalModel: 'Transfer proves understanding has separated from the training example.',
					referenceDoc: 'Directing the Machine.md #Appendix G'
				},
				tasks: makeDayTasks({
					weekNum: 1,
					dayNum: 6,
					readTitle: 'Transfer Tests Protocol',
					readModule: 'Appendix G',
					drillTitle: 'Unfamiliar Medium Transfer Test',
					drillDesc: 'Diagnose an unfamiliar creative medium with diagnostic ladders hidden.',
					studyTitle: 'Protected Play Session (30m)',
					studyDesc: 'Play with materials or tools without goals or outputs. Protect enjoyment.',
					projectMilestone: 'Project 1: Transfer Rep 1',
					diagDesc: 'Record whether you reached for external rubrics or used internal judgment.',
					transferDesc: 'Capture 1 unanalyzed non-instrumental observation line.',
					projectId: 'p1',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Weekly Evaluation & Log Audit',
				assignedReading: {
					moduleCode: 'Appendix J',
					title: 'Self-Critique & Two-Axis Matrix',
					keyMentalModel: 'Plot every output: Outcome Quality x Decision Quality. Expose lucky hits.',
					referenceDoc: 'Directing the Machine.md #Appendix J'
				},
				tasks: makeDayTasks({
					weekNum: 1,
					dayNum: 7,
					readTitle: 'Self-Critique & Two-Axis Matrix',
					readModule: 'Appendix J',
					drillTitle: 'Weekly 2x2 Quadrant Audit',
					drillDesc: 'Plot Week 1 diagnoses on the Two-Axis Matrix (Mastery, Learning, Lucky, Failure).',
					studyTitle: 'Standing Inquiry Entry 1',
					studyDesc: 'Reflect: What defaults am I still mistaking for authored decisions?',
					projectMilestone: 'Week 1 Deliverables Check & Sign-off',
					diagDesc: 'Check Brier score and audit for repetitive adjectives in logs.',
					transferDesc: 'Set tomorrow\'s 5-minute opening action via Hemingway Stop.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			}
		]
	},
	{
		weekNumber: 2,
		title: 'Week 2 — Diagnostic Deepening & Project 1 Portfolio',
		partNumber: 1,
		phaseName: 'Part I: Find & Observe',
		masteryLayer: 1,
		layerName: 'Capability',
		governingQuestion: 'Can I complete a full diagnostic portfolio and carry forward one defended problem with standing?',
		scaffolding: {
			supplied: ['Exercise', 'Diagnostic Ladder', 'Templates', 'References'],
			removed: []
		},
		activeProjectId: 'p1',
		weeklyDeliverables: [
			'Complete Project 1 Portfolio: 15 Diagnoses (8 visual, 7 textual)',
			'6 Visual Perception Studies completed',
			'3 Close-Reading Analyses completed',
			'Personal Diagnostic Ladders documented',
			'First Anchor Set (accepted and rejected >=40% human)',
			'Part I Mastery Gate Review'
		],
		masteryGateCriteria: [
			'Can distinguish observation from evaluation in all cases',
			'Can locate highest-level problem and name responsible decision',
			'Can locate an unassigned problem and run positionality check',
			'Ready for Diagnostic Ladder to be removed in Part II'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Personal Diagnostic Ladder Synthesis',
				assignedReading: {
					moduleCode: 'Appendix B',
					title: 'Diagnostic Ladders & Hierarchy',
					keyMentalModel: 'Constructing your personal hierarchy for rapid top-down triage.',
					referenceDoc: 'Directing the Machine.md #Appendix B'
				},
				tasks: makeDayTasks({
					weekNum: 2,
					dayNum: 1,
					readTitle: 'Diagnostic Ladders',
					readModule: 'Appendix B',
					drillTitle: 'Personal Ladder Mapping',
					drillDesc: 'Synthesize your own 5-rung visual and writing ladders with concrete test questions.',
					studyTitle: 'Ladder Inversion Test',
					studyDesc: 'Prove why solving a lower level cannot fix a higher level failure.',
					projectMilestone: 'Project 1: Diagnoses 5–8 (Visual & Text)',
					diagDesc: 'Audit whether ladder levels are respected in order.',
					transferDesc: 'Map your ladder to a code architecture or physical product design problem.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Perception Studies & Value Hierarchies',
				assignedReading: {
					moduleCode: 'Appendix H',
					title: 'Study Protocols 1 & 3: Master Decomposition',
					keyMentalModel: 'Composition extraction: ignore subject identity, isolate directional flow.',
					referenceDoc: 'Directing the Machine.md #Appendix H'
				},
				tasks: makeDayTasks({
					weekNum: 2,
					dayNum: 2,
					readTitle: 'Master Decomposition',
					readModule: 'Appendix H',
					drillTitle: 'Composition Extraction',
					drillDesc: 'Trace the directional contrast hierarchy of a master image and rebuild it with unrelated objects.',
					studyTitle: 'Perception Studies 3 & 4',
					studyDesc: 'Perform two 5-second thumbnail flashes on high-complexity scenes.',
					projectMilestone: 'Project 1: Perception Studies 3 & 4',
					diagDesc: 'Check if focal hierarchy guides the eye to the intended subject within 200ms.',
					transferDesc: 'Apply composition extraction to a mobile UI dashboard layout.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Close-Reading Analyses & Synthesizing Text',
				assignedReading: {
					moduleCode: 'Module W1',
					title: 'Writing Ladder & Rhythm Audit',
					keyMentalModel: 'Sentence length variance creates narrative propulsion; uniformity induces trance.',
					referenceDoc: 'Directing the Machine.md #Module W1'
				},
				tasks: makeDayTasks({
					weekNum: 2,
					dayNum: 3,
					readTitle: 'Writing Ladder & Rhythm',
					readModule: 'Module W1',
					drillTitle: 'Rhythm Distribution Charting',
					drillDesc: 'Plot word counts of 15 consecutive sentences from a text anchor. Identify monotony vs. dynamic cadence.',
					studyTitle: 'Close-Reading Analyses 2 & 3',
					studyDesc: 'Conduct close reading on 2 contrasting essays, tagging omission and stance.',
					projectMilestone: 'Project 1: Close-Readings 2 & 3',
					diagDesc: 'Ensure grammatical correctness is not mistaken for stylistic authority.',
					transferDesc: 'Analyze the rhythm and pacing of a speech or podcast introduction.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'First Anchor Set & Anchor Library Protocol',
				assignedReading: {
					moduleCode: 'Appendix E',
					title: 'Anchor Library Protocol',
					keyMentalModel: 'An anchor library is not a mood board. It is a record of decisions worth remembering.',
					referenceDoc: 'Directing the Machine.md #Appendix E'
				},
				tasks: makeDayTasks({
					weekNum: 2,
					dayNum: 4,
					readTitle: 'Anchor Library Protocol',
					readModule: 'Appendix E',
					drillTitle: 'Human Anchor Curation (>=40%)',
					drillDesc: 'Assemble 10 anchor records with explicit criteria, ensuring at least 4 are human-created.',
					studyTitle: 'Accepted vs. Rejected Boundary',
					studyDesc: 'Pair each accepted anchor with a structurally similar rejected artifact.',
					projectMilestone: 'Project 1: First Anchor Set Compiled',
					diagDesc: 'Confirm every anchor has an explicit mechanism and purpose recorded.',
					transferDesc: 'Add one anchor from a historical period prior to digital reproduction.',
					projectId: 'p1',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Problem-Finding Selection & Positionality Defense',
				assignedReading: {
					moduleCode: 'Module 2',
					title: 'Positionality Defense & Standing',
					keyMentalModel: 'Can I say: "This is mine — I found it, I chose it, I can defend it"?',
					referenceDoc: 'Directing the Machine.md #Module 2'
				},
				tasks: makeDayTasks({
					weekNum: 2,
					dayNum: 5,
					readTitle: 'Positionality Defense',
					readModule: 'Module 2',
					drillTitle: 'Selected Problem Defense',
					drillDesc: 'Select 1 problem from your 4 entries to carry forward into Part II. Defend your standing in 1 page.',
					studyTitle: 'Rejection Log Review',
					studyDesc: 'Formulate explicit 1-sentence rejection rationales for the discarded problem candidates.',
					projectMilestone: 'Project 1: Defended Problem Locked',
					diagDesc: 'Audit whether the problem requires your specific position or could be solved by anyone.',
					transferDesc: 'Simulate presenting your selected problem to a critical stakeholder.',
					projectId: 'p1',
					primaryModId: 'm1'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Project 1 Assembly & Final Diagnoses',
				assignedReading: {
					moduleCode: 'Part I Deliverables',
					title: 'Project 1 Verification Checklist',
					keyMentalModel: 'Quality over quantity. 15 well-diagnosed items beats 30 perfunctory ones.',
					referenceDoc: 'Directing the Machine.md #Part I — Deliverables'
				},
				tasks: makeDayTasks({
					weekNum: 2,
					dayNum: 6,
					readTitle: 'Project 1 Verification',
					readModule: 'Part I',
					drillTitle: 'Diagnoses 9–15 Completion',
					drillDesc: 'Complete remaining diagnostic entries to reach full quota of 15 (8 visual, 7 textual).',
					studyTitle: 'Perception Studies 5 & 6',
					studyDesc: 'Execute final 2 flash perception studies.',
					projectMilestone: 'Project 1: Full Portfolio Assembly',
					diagDesc: 'Audit entire portfolio for adjective slips and surface-level rationalizations.',
					transferDesc: 'Perform 30m play session with zero diagnostic notes.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Part I Mastery Gate Review & Scaffolding Removal',
				assignedReading: {
					moduleCode: 'Part I Mastery Gate',
					title: 'Gate Assessment & Transition to Part II',
					keyMentalModel: 'Demonstrating capability so the Diagnostic Ladder can be removed in Part II.',
					referenceDoc: 'Directing the Machine.md #Part I Mastery Gate'
				},
				tasks: makeDayTasks({
					weekNum: 2,
					dayNum: 7,
					readTitle: 'Part I Mastery Gate',
					readModule: 'Part I',
					drillTitle: 'Mastery Gate Self-Audit',
					drillDesc: 'Audit yourself against the 9 Part I mastery criteria. Confirm readiness.',
					studyTitle: 'Part II Preview: Premise & Specification',
					studyDesc: 'Prepare for Part II where the Diagnostic Ladder is hidden by default.',
					projectMilestone: 'Sign Off Project 1 & Part I Mastery Gate',
					diagDesc: 'Verify all 15 diagnoses, 6 perception studies, and problem statement are logged.',
					transferDesc: 'Set tomorrow\'s 5-minute opening action via Hemingway Stop.',
					projectId: 'p1',
					primaryModId: 'm2'
				})
			}
		]
	},
	{
		weekNumber: 3,
		title: 'Week 3 — Premise Forge & Brief Architecture',
		partNumber: 2,
		phaseName: 'Part II: Formulate',
		masteryLayer: 1,
		layerName: 'Capability',
		governingQuestion: 'What is worth making, and how do I specify it without over-determining or defaulting?',
		scaffolding: {
			supplied: ['Exercise', '7-Layer Brief Template', 'References'],
			removed: ['Diagnostic Ladder (hidden by default)']
		},
		activeProjectId: 'p2',
		weeklyDeliverables: [
			'3 Premise Records with explicit rejection logic',
			'3 Fully Specified 7-Layer Briefs',
			'6–9 Manual Visual Thumbnails (2-minute rapid mass studies)',
			'2 Writing Structural Skeletons without AI'
		],
		masteryGateCriteria: [
			'Premise distinct from mere subject or topic',
			'Checkable acceptance criteria replace mood requests',
			'Craft-first manual gates completed before generation'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Premise & Intent (The 4 Viability Tests)',
				assignedReading: {
					moduleCode: 'Module 5',
					title: 'Premise & Intent',
					keyMentalModel: 'Observation -> Question -> Tension -> Premise -> Intention.',
					referenceDoc: 'Directing the Machine.md #Module 5'
				},
				tasks: makeDayTasks({
					weekNum: 3,
					dayNum: 1,
					readTitle: 'Premise & Intent',
					readModule: 'Module 5',
					drillTitle: 'The Premise Forge',
					drillDesc: 'Generate 3 premises from your selected Part I problem. Apply the 4 viability tests (Specificity, Tension, Generativity, Commitment).',
					studyTitle: 'Premise Rejection Logic',
					studyDesc: 'Write 1-sentence rejection logic for the 2 discarded premises.',
					projectMilestone: 'Project 2: Premise Records 1 & 2',
					diagDesc: 'Audit whether premise has an inherent contradiction or is merely a statement of fact.',
					transferDesc: 'Extract the premise from a landmark novel or classic film.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: '7-Layer Brief Architecture & Constraint Density',
				assignedReading: {
					moduleCode: 'Module 6',
					title: 'Brief Architecture & Constraint Tri-View',
					keyMentalModel: 'Brief first, generation second. Open (3) vs. Directed (6) vs. Severe (10) constraints.',
					referenceDoc: 'Directing the Machine.md #Module 6'
				},
				tasks: makeDayTasks({
					weekNum: 3,
					dayNum: 2,
					readTitle: 'Brief Architecture',
					readModule: 'Module 6',
					drillTitle: 'Constraint Density Tri-View',
					drillDesc: 'Write the same brief under 3 constraints, 6 constraints, and 10 constraints. Feel the boundary.',
					studyTitle: 'Checkable Acceptance Criteria',
					studyDesc: 'Replace vague mood requests ("make it emotional") with checkable physical thresholds.',
					projectMilestone: 'Project 2: Brief 1 (7-Layer Stack)',
					diagDesc: 'Verify brief contains explicit rejection conditions (what would make an output unacceptable).',
					transferDesc: 'Write a 7-layer brief for a 30-second audio track.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Visual Specification & The 2-Minute Thumbnail Gate',
				assignedReading: {
					moduleCode: 'Module V2',
					title: 'Visual Specification & Manual Gates',
					keyMentalModel: 'Never unlock image generation until 6 rapid thumbnails and 3 value schemes are logged.',
					referenceDoc: 'Directing the Machine.md #Module V2'
				},
				tasks: makeDayTasks({
					weekNum: 3,
					dayNum: 3,
					readTitle: 'Visual Specification',
					readModule: 'Module V2',
					drillTitle: '2-Minute Thumbnail Gate',
					drillDesc: 'Produce 6 rapid manual thumbnails (max 120 seconds each) exploring focal points and camera placement.',
					studyTitle: 'Value Scheme Triad',
					studyDesc: 'Generate 3 value schemes (High Key, Low Key, High Contrast) for your chosen thumbnail.',
					projectMilestone: 'Project 2: Thumbnails 1–6 Logged',
					diagDesc: 'Verify thumbnails are mass/value decisions, not slow detailed illustrations.',
					transferDesc: 'Thumbnail a visual sequence from a written scene description.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Writing Specification & The 9-Mechanism Voice Dials',
				assignedReading: {
					moduleCode: 'Module W2',
					title: 'Writing Specification & Structural Skeletons',
					keyMentalModel: 'Replace mood adjectives with 9 observable voice mechanisms before drafting.',
					referenceDoc: 'Directing the Machine.md #Module W2'
				},
				tasks: makeDayTasks({
					weekNum: 3,
					dayNum: 4,
					readTitle: 'Writing Specification',
					readModule: 'Module W2',
					drillTitle: 'Unassisted Structural Skeleton Gate',
					drillDesc: 'Write a crude structural skeleton without AI, establishing section turns and argumentative arcs.',
					studyTitle: '9-Mechanism Voice Dial Config',
					studyDesc: 'Configure the 9 dials: sentence length, directness, abstraction, metaphor sustainability, and reader stance.',
					projectMilestone: 'Project 2: Structural Outline 1',
					diagDesc: 'Ensure outline has explicit transitions rather than a bulleted list of topics.',
					transferDesc: 'Convert a corporate whitepaper structure into an investigative narrative skeleton.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Provenance Begins & Licensing Rigor',
				assignedReading: {
					moduleCode: 'Module 7',
					title: 'Provenance Begins',
					keyMentalModel: 'Birth-of-project stamp: human decisions, tool contributions, and license rights logged at origin.',
					referenceDoc: 'Directing the Machine.md #Module 7'
				},
				tasks: makeDayTasks({
					weekNum: 3,
					dayNum: 5,
					readTitle: 'Provenance Begins',
					readModule: 'Module 7',
					drillTitle: 'Provenance Ledger Stamp',
					drillDesc: 'Attach a birth-of-project provenance stamp to Briefs 1 and 2, isolating human contributions.',
					studyTitle: 'Dataset & Reference Audit',
					studyDesc: 'Verify commercial rights and licensing terms of reference assets.',
					projectMilestone: 'Project 2: Provenance Records 1 & 2',
					diagDesc: 'Ensure prompt engineering is not claimed as conceptual authorship.',
					transferDesc: 'Audit an existing open-source project\'s provenance trail.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Brief Iteration & Transfer Test',
				assignedReading: {
					moduleCode: 'Appendix G',
					title: 'Transfer Under Severe Constraints',
					keyMentalModel: 'Severe constraints stimulate creative problem-solving; loose constraints encourage defaults.',
					referenceDoc: 'Directing the Machine.md #Appendix G'
				},
				tasks: makeDayTasks({
					weekNum: 3,
					dayNum: 6,
					readTitle: 'Severe Constraint Transfer',
					readModule: 'Appendix G',
					drillTitle: 'Severe 10-Constraint Brief',
					drillDesc: 'Draft a brief with 10 strict prohibitions (e.g. no adjectives, no centered subjects, no natural lighting).',
					studyTitle: 'Protected Play Session (30m)',
					studyDesc: 'Engage in unstructured visual or textual play with zero briefs or acceptance tests.',
					projectMilestone: 'Project 2: Brief 2 Completed',
					diagDesc: 'Examine if severe constraints produced an unexpected, innovative direction.',
					transferDesc: 'Log 1 non-instrumental attention sentence.',
					projectId: 'p2',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Weekly Progress Review & Two-Axis Audit',
				assignedReading: {
					moduleCode: 'Appendix J',
					title: 'Reviewing Specification Rigor',
					keyMentalModel: 'Did the brief predict the failure modes, or did it leave the door open to slop?',
					referenceDoc: 'Directing the Machine.md #Appendix J'
				},
				tasks: makeDayTasks({
					weekNum: 3,
					dayNum: 7,
					readTitle: 'Reviewing Specification Rigor',
					readModule: 'Appendix J',
					drillTitle: 'Two-Axis Matrix Plotting',
					drillDesc: 'Plot Week 3 brief outcomes on the 2x2 matrix.',
					studyTitle: 'Mid-Part II Retrospective',
					studyDesc: 'Check progress toward Project 2 full deliverable quota.',
					projectMilestone: 'Week 3 Sign-Off & Project 2 Progress Check',
					diagDesc: 'Verify thumbnail gate was respected for all visual briefs.',
					transferDesc: 'Set tomorrow\'s 5-minute opening action via Hemingway Stop.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			}
		]
	},
	{
		weekNumber: 4,
		title: 'Week 4 — Project 2 Completion & Part II Mastery Gate',
		partNumber: 2,
		phaseName: 'Part II: Formulate',
		masteryLayer: 1,
		layerName: 'Capability',
		governingQuestion: 'Can I complete 6 briefs and 18 thumbnails and defend what makes a premise genuinely mine?',
		scaffolding: {
			supplied: ['Exercise', '7-Layer Brief Template', 'References'],
			removed: ['Diagnostic Ladder']
		},
		activeProjectId: 'p2',
		weeklyDeliverables: [
			'Project 2 Complete: 6 Premise Records with rejection logic',
			'6 Fully Specified Briefs',
			'12–18 Visual Thumbnails / Value Studies',
			'4 Writing Structural Outlines',
			'6 Provenance Records',
			'1 Selected Premise carried into Part III'
		],
		masteryGateCriteria: [
			'Gate Question passed: "This is mine — I found it, I chose it, I can defend it"',
			'Specification constrains decisions without over-determining them',
			'Ready for Brief Template to be removed in Part III'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Premises 4–6 & Rejection Logic',
				assignedReading: {
					moduleCode: 'Module 5',
					title: 'Premise Defense & Authorship',
					keyMentalModel: 'A premise is a commitment to a perspective with real consequences.',
					referenceDoc: 'Directing the Machine.md #Module 5'
				},
				tasks: makeDayTasks({
					weekNum: 4,
					dayNum: 1,
					readTitle: 'Premise Defense',
					readModule: 'Module 5',
					drillTitle: 'Premises 4–6 Formulation',
					drillDesc: 'Formulate final 3 premises, documenting rejected candidates with reasons.',
					studyTitle: 'Commitment Audit',
					studyDesc: 'Verify each premise requires specific choices and eliminates generic options.',
					projectMilestone: 'Project 2: Premise Records 4–6',
					diagDesc: 'Audit whether premises fall into topical cliché.',
					transferDesc: 'State the counter-premise to each of your selections.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Briefs 3–5 & Value Studies',
				assignedReading: {
					moduleCode: 'Module 6',
					title: 'Briefs 3–5 Architecture',
					keyMentalModel: 'Acceptance criteria must be binary checkable by a stranger.',
					referenceDoc: 'Directing the Machine.md #Module 6'
				},
				tasks: makeDayTasks({
					weekNum: 4,
					dayNum: 2,
					readTitle: 'Briefs Architecture',
					readModule: 'Module 6',
					drillTitle: 'Complete Briefs 3–5',
					drillDesc: 'Write 3 complete briefs using the 7-layer stack.',
					studyTitle: 'Thumbnails 7–12',
					studyDesc: 'Execute 6 manual thumbnails under 2-minute timer.',
					projectMilestone: 'Project 2: Briefs 3–5 + Thumbnails 7–12',
					diagDesc: 'Ensure no brief uses vague mood descriptors in its acceptance criteria.',
					transferDesc: 'Have a peer read your brief and state what it would look like.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Writing Structural Skeletons 2–4',
				assignedReading: {
					moduleCode: 'Module W2',
					title: 'Structural Pacing & Argument Arcs',
					keyMentalModel: 'Every paragraph must either advance the argument or change the stakes.',
					referenceDoc: 'Directing the Machine.md #Module W2'
				},
				tasks: makeDayTasks({
					weekNum: 4,
					dayNum: 3,
					readTitle: 'Structural Pacing',
					readModule: 'Module W2',
					drillTitle: 'Draft Outlines 2–4',
					drillDesc: 'Draft 3 remaining unassisted structural skeletons.',
					studyTitle: 'Voice Mechanism Dial Alignment',
					studyDesc: 'Tune the 9 mechanisms for each piece to ensure voice consistency.',
					projectMilestone: 'Project 2: Outlines 2–4 Completed',
					diagDesc: 'Audit where model defaults might try to smooth out necessary discord.',
					transferDesc: 'Structure an argumentative essay as a dramatic narrative.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Final Brief 6 & Provenance Records',
				assignedReading: {
					moduleCode: 'Module 7',
					title: 'Provenance Stamp Sign-off',
					keyMentalModel: 'Transparency is not an apology; it is the ledger of human judgment.',
					referenceDoc: 'Directing the Machine.md #Module 7'
				},
				tasks: makeDayTasks({
					weekNum: 4,
					dayNum: 4,
					readTitle: 'Provenance Stamp Sign-off',
					readModule: 'Module 7',
					drillTitle: 'Final Brief 6 & Provenance Records',
					drillDesc: 'Draft Brief 6 and finalize all 6 birth-of-project provenance stamps.',
					studyTitle: 'Thumbnails 13–18',
					studyDesc: 'Complete final set of manual visual thumbnails.',
					projectMilestone: 'Project 2: All 6 Briefs & Provenance Records Done',
					diagDesc: 'Confirm that human decisions outnumber tool defaults in provenance.',
					transferDesc: 'Audit a generated output against Brief 6 acceptance rules.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Selecting The Premise for Part III',
				assignedReading: {
					moduleCode: 'Part II Mastery Gate',
					title: 'The Gate Question',
					keyMentalModel: 'Can you look at the premise and say honestly: "This is mine — I found it, I chose it, I can defend it"?',
					referenceDoc: 'Directing the Machine.md #Part II Mastery Gate'
				},
				tasks: makeDayTasks({
					weekNum: 4,
					dayNum: 5,
					readTitle: 'The Gate Question',
					readModule: 'Part II',
					drillTitle: 'Premise Selection & Defense',
					drillDesc: 'Select the 1 premise from your 6 that you will turn into a working system in Part III.',
					studyTitle: 'Pipeline Readiness Audit',
					studyDesc: 'Analyze what causal pipeline components this premise will require.',
					projectMilestone: 'Project 2: Carry-Forward Premise Locked',
					diagDesc: 'If you answer "I\'m not sure" to the Gate Question, refine the premise now.',
					transferDesc: 'Explain why the other 5 premises were not selected for production.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Project 2 Verification & Play Session',
				assignedReading: {
					moduleCode: 'Appendix D',
					title: 'Project 2 Deliverables Audit',
					keyMentalModel: 'Verify all 6 premises, 6 briefs, 12-18 thumbnails, and provenance stamps.',
					referenceDoc: 'Directing the Machine.md #Appendix D'
				},
				tasks: makeDayTasks({
					weekNum: 4,
					dayNum: 6,
					readTitle: 'Project 2 Deliverables Audit',
					readModule: 'Appendix D',
					drillTitle: 'Deliverables Sign-Off',
					drillDesc: 'Confirm all items for Project 2 are logged and properly formatted.',
					studyTitle: 'Protected Play Session (30m)',
					studyDesc: 'Pure unstructured play. No briefs, no prompts, no goals.',
					projectMilestone: 'Project 2 Dossier Signed Off',
					diagDesc: 'Ensure no steps were skipped in the thumbnail or outline gates.',
					transferDesc: 'Capture 1 non-instrumental attention observation.',
					projectId: 'p2',
					primaryModId: 'm0'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Part II Mastery Gate & Scaffolding Removal',
				assignedReading: {
					moduleCode: 'Part II Mastery Gate',
					title: 'Removing the Brief Template',
					keyMentalModel: 'In Part III, the Brief Template is removed. You must compose briefs from memory.',
					referenceDoc: 'Directing the Machine.md #Part II Mastery Gate'
				},
				tasks: makeDayTasks({
					weekNum: 4,
					dayNum: 7,
					readTitle: 'Removing the Brief Template',
					readModule: 'Part II',
					drillTitle: 'Blank Brief Composer Drill',
					drillDesc: 'Reconstruct the 7-layer brief from memory without looking at the template.',
					studyTitle: 'Part III Preview: Pipelines & Brier Calibration',
					studyDesc: 'Preview Module 8 & 9 (Pipeline Thinking & Prediction).',
					projectMilestone: 'Part II Gate Passed -> Advance to Part III',
					diagDesc: 'Verify scaffolding store updates: ladder: false, template: false.',
					transferDesc: 'Set tomorrow\'s 5-minute opening action via Hemingway Stop.',
					projectId: 'p2',
					primaryModId: 'm3'
				})
			}
		]
	},
	{
		weekNumber: 5,
		title: 'Week 5 — Pipeline Thinking & Prediction Calibration',
		partNumber: 3,
		phaseName: 'Part III: Build',
		masteryLayer: 1,
		layerName: 'Capability',
		governingQuestion: 'How do I turn creative intent into a controllable causal pipeline?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p3',
		weeklyDeliverables: [
			'1 Visual Pipeline System mapped',
			'1 Writing Prompt Chain mapped',
			'5 Calibration Log entries with pre-run confidence %',
			'4 Controlled variations'
		],
		masteryGateCriteria: [
			'Pipeline is causal, not a black box',
			'Pre-run confidence logged before generating',
			'Brier telemetry tracking active'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Week 5 — Pipeline Thinking & Prediction Calibration',
				assignedReading: {
					moduleCode: 'Module 8',
					title: 'Pipeline Thinking',
					keyMentalModel: 'A pipeline is a causal model, not a bag of tricks.',
					referenceDoc: 'Directing the Machine.md #Module 8'
				},
				tasks: makeDayTasks({
					weekNum: 5,
					dayNum: 1,
					readTitle: 'Pipeline Thinking',
					readModule: 'Module 8',
					drillTitle: 'Pipeline Thinking Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 5 — Pipeline Thinking & Prediction Calibration.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 5 — Pipeline Thinking & Prediction Calibration · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Week 5 — Pipeline Thinking & Prediction Calibration',
				assignedReading: {
					moduleCode: 'Module 8',
					title: 'Pipeline Thinking',
					keyMentalModel: 'A pipeline is a causal model, not a bag of tricks.',
					referenceDoc: 'Directing the Machine.md #Module 8'
				},
				tasks: makeDayTasks({
					weekNum: 5,
					dayNum: 2,
					readTitle: 'Pipeline Thinking',
					readModule: 'Module 8',
					drillTitle: 'Pipeline Thinking Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 5 — Pipeline Thinking & Prediction Calibration.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 5 — Pipeline Thinking & Prediction Calibration · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Week 5 — Pipeline Thinking & Prediction Calibration',
				assignedReading: {
					moduleCode: 'Module 8',
					title: 'Pipeline Thinking',
					keyMentalModel: 'A pipeline is a causal model, not a bag of tricks.',
					referenceDoc: 'Directing the Machine.md #Module 8'
				},
				tasks: makeDayTasks({
					weekNum: 5,
					dayNum: 3,
					readTitle: 'Pipeline Thinking',
					readModule: 'Module 8',
					drillTitle: 'Pipeline Thinking Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 5 — Pipeline Thinking & Prediction Calibration.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 5 — Pipeline Thinking & Prediction Calibration · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Week 5 — Pipeline Thinking & Prediction Calibration',
				assignedReading: {
					moduleCode: 'Module 8',
					title: 'Pipeline Thinking',
					keyMentalModel: 'A pipeline is a causal model, not a bag of tricks.',
					referenceDoc: 'Directing the Machine.md #Module 8'
				},
				tasks: makeDayTasks({
					weekNum: 5,
					dayNum: 4,
					readTitle: 'Pipeline Thinking',
					readModule: 'Module 8',
					drillTitle: 'Pipeline Thinking Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 5 — Pipeline Thinking & Prediction Calibration.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 5 — Pipeline Thinking & Prediction Calibration · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Week 5 — Pipeline Thinking & Prediction Calibration',
				assignedReading: {
					moduleCode: 'Module 8',
					title: 'Pipeline Thinking',
					keyMentalModel: 'A pipeline is a causal model, not a bag of tricks.',
					referenceDoc: 'Directing the Machine.md #Module 8'
				},
				tasks: makeDayTasks({
					weekNum: 5,
					dayNum: 5,
					readTitle: 'Pipeline Thinking',
					readModule: 'Module 8',
					drillTitle: 'Pipeline Thinking Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 5 — Pipeline Thinking & Prediction Calibration.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 5 — Pipeline Thinking & Prediction Calibration · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Week 5 — Pipeline Thinking & Prediction Calibration',
				assignedReading: {
					moduleCode: 'Module 8',
					title: 'Pipeline Thinking',
					keyMentalModel: 'A pipeline is a causal model, not a bag of tricks.',
					referenceDoc: 'Directing the Machine.md #Module 8'
				},
				tasks: makeDayTasks({
					weekNum: 5,
					dayNum: 6,
					readTitle: 'Pipeline Thinking',
					readModule: 'Module 8',
					drillTitle: 'Pipeline Thinking Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 5 — Pipeline Thinking & Prediction Calibration.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 5 — Pipeline Thinking & Prediction Calibration · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Week 5 — Pipeline Thinking & Prediction Calibration',
				assignedReading: {
					moduleCode: 'Module 8',
					title: 'Pipeline Thinking',
					keyMentalModel: 'A pipeline is a causal model, not a bag of tricks.',
					referenceDoc: 'Directing the Machine.md #Module 8'
				},
				tasks: makeDayTasks({
					weekNum: 5,
					dayNum: 7,
					readTitle: 'Pipeline Thinking',
					readModule: 'Module 8',
					drillTitle: 'Pipeline Thinking Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 5 — Pipeline Thinking & Prediction Calibration.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 5 — Pipeline Thinking & Prediction Calibration · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			}
		]
	},
	{
		weekNumber: 6,
		title: 'Week 6 — Controlled Systems & Part III Mastery Gate',
		partNumber: 3,
		phaseName: 'Part III: Build',
		masteryLayer: 1,
		layerName: 'Capability',
		governingQuestion: 'Can I complete full causal systems and achieve calibrated predictions?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p3',
		weeklyDeliverables: [
			'Complete Project 3: 2 Working Systems (visual & writing)',
			'12 Controlled Visual Variations',
			'8 Controlled Writing Variations',
			'10 Calibration Log entries'
		],
		masteryGateCriteria: [
			'Pipelines demonstrate reliable causal control',
			'Calibration telemetry tracks within calibrated bounds',
			'Ready for Guided Exercises to be removed in Part IV'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Week 6 — Controlled Systems & Part III Mastery Gate',
				assignedReading: {
					moduleCode: 'Module 9',
					title: 'Prediction & Calibration',
					keyMentalModel: 'The question is: Was I as right as I expected to be?',
					referenceDoc: 'Directing the Machine.md #Module 9'
				},
				tasks: makeDayTasks({
					weekNum: 6,
					dayNum: 1,
					readTitle: 'Prediction & Calibration',
					readModule: 'Module 9',
					drillTitle: 'Prediction & Calibration Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 6 — Controlled Systems & Part III Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 6 — Controlled Systems & Part III Mastery Gate · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Week 6 — Controlled Systems & Part III Mastery Gate',
				assignedReading: {
					moduleCode: 'Module 9',
					title: 'Prediction & Calibration',
					keyMentalModel: 'The question is: Was I as right as I expected to be?',
					referenceDoc: 'Directing the Machine.md #Module 9'
				},
				tasks: makeDayTasks({
					weekNum: 6,
					dayNum: 2,
					readTitle: 'Prediction & Calibration',
					readModule: 'Module 9',
					drillTitle: 'Prediction & Calibration Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 6 — Controlled Systems & Part III Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 6 — Controlled Systems & Part III Mastery Gate · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Week 6 — Controlled Systems & Part III Mastery Gate',
				assignedReading: {
					moduleCode: 'Module 9',
					title: 'Prediction & Calibration',
					keyMentalModel: 'The question is: Was I as right as I expected to be?',
					referenceDoc: 'Directing the Machine.md #Module 9'
				},
				tasks: makeDayTasks({
					weekNum: 6,
					dayNum: 3,
					readTitle: 'Prediction & Calibration',
					readModule: 'Module 9',
					drillTitle: 'Prediction & Calibration Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 6 — Controlled Systems & Part III Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 6 — Controlled Systems & Part III Mastery Gate · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Week 6 — Controlled Systems & Part III Mastery Gate',
				assignedReading: {
					moduleCode: 'Module 9',
					title: 'Prediction & Calibration',
					keyMentalModel: 'The question is: Was I as right as I expected to be?',
					referenceDoc: 'Directing the Machine.md #Module 9'
				},
				tasks: makeDayTasks({
					weekNum: 6,
					dayNum: 4,
					readTitle: 'Prediction & Calibration',
					readModule: 'Module 9',
					drillTitle: 'Prediction & Calibration Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 6 — Controlled Systems & Part III Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 6 — Controlled Systems & Part III Mastery Gate · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Week 6 — Controlled Systems & Part III Mastery Gate',
				assignedReading: {
					moduleCode: 'Module 9',
					title: 'Prediction & Calibration',
					keyMentalModel: 'The question is: Was I as right as I expected to be?',
					referenceDoc: 'Directing the Machine.md #Module 9'
				},
				tasks: makeDayTasks({
					weekNum: 6,
					dayNum: 5,
					readTitle: 'Prediction & Calibration',
					readModule: 'Module 9',
					drillTitle: 'Prediction & Calibration Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 6 — Controlled Systems & Part III Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 6 — Controlled Systems & Part III Mastery Gate · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Week 6 — Controlled Systems & Part III Mastery Gate',
				assignedReading: {
					moduleCode: 'Module 9',
					title: 'Prediction & Calibration',
					keyMentalModel: 'The question is: Was I as right as I expected to be?',
					referenceDoc: 'Directing the Machine.md #Module 9'
				},
				tasks: makeDayTasks({
					weekNum: 6,
					dayNum: 6,
					readTitle: 'Prediction & Calibration',
					readModule: 'Module 9',
					drillTitle: 'Prediction & Calibration Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 6 — Controlled Systems & Part III Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 6 — Controlled Systems & Part III Mastery Gate · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Week 6 — Controlled Systems & Part III Mastery Gate',
				assignedReading: {
					moduleCode: 'Module 9',
					title: 'Prediction & Calibration',
					keyMentalModel: 'The question is: Was I as right as I expected to be?',
					referenceDoc: 'Directing the Machine.md #Module 9'
				},
				tasks: makeDayTasks({
					weekNum: 6,
					dayNum: 7,
					readTitle: 'Prediction & Calibration',
					readModule: 'Module 9',
					drillTitle: 'Prediction & Calibration Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 6 — Controlled Systems & Part III Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 6 — Controlled Systems & Part III Mastery Gate · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p3',
					primaryModId: 'm4'
				})
			}
		]
	},
	{
		weekNumber: 7,
		title: 'Week 7 — Taste as Infrastructure & Blind Curation',
		partNumber: 4,
		phaseName: 'Part IV: Calibrate',
		masteryLayer: 2,
		layerName: 'Independence',
		governingQuestion: 'How do I transform subjective preference into explicit, defensible taste?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p4',
		weeklyDeliverables: [
			'1 Anchor Library (15+ anchors with >=40% human)',
			'10 Comparative Judgments logged',
			'1 Slop Criterion defined',
			'1 Blind-ranking test passed'
		],
		masteryGateCriteria: [
			'Taste judgments use 5-part formula',
			'Maintains >=40% human anchors',
			'Blind ranking matches stated criteria'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Week 7 — Taste as Infrastructure & Blind Curation',
				assignedReading: {
					moduleCode: 'Module 10',
					title: 'Taste as Infrastructure',
					keyMentalModel: 'Taste is explicit criteria tied to purpose (5-part formula).',
					referenceDoc: 'Directing the Machine.md #Module 10'
				},
				tasks: makeDayTasks({
					weekNum: 7,
					dayNum: 1,
					readTitle: 'Taste as Infrastructure',
					readModule: 'Module 10',
					drillTitle: 'Taste as Infrastructure Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 7 — Taste as Infrastructure & Blind Curation.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 7 — Taste as Infrastructure & Blind Curation · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Week 7 — Taste as Infrastructure & Blind Curation',
				assignedReading: {
					moduleCode: 'Module 10',
					title: 'Taste as Infrastructure',
					keyMentalModel: 'Taste is explicit criteria tied to purpose (5-part formula).',
					referenceDoc: 'Directing the Machine.md #Module 10'
				},
				tasks: makeDayTasks({
					weekNum: 7,
					dayNum: 2,
					readTitle: 'Taste as Infrastructure',
					readModule: 'Module 10',
					drillTitle: 'Taste as Infrastructure Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 7 — Taste as Infrastructure & Blind Curation.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 7 — Taste as Infrastructure & Blind Curation · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Week 7 — Taste as Infrastructure & Blind Curation',
				assignedReading: {
					moduleCode: 'Module 10',
					title: 'Taste as Infrastructure',
					keyMentalModel: 'Taste is explicit criteria tied to purpose (5-part formula).',
					referenceDoc: 'Directing the Machine.md #Module 10'
				},
				tasks: makeDayTasks({
					weekNum: 7,
					dayNum: 3,
					readTitle: 'Taste as Infrastructure',
					readModule: 'Module 10',
					drillTitle: 'Taste as Infrastructure Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 7 — Taste as Infrastructure & Blind Curation.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 7 — Taste as Infrastructure & Blind Curation · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Week 7 — Taste as Infrastructure & Blind Curation',
				assignedReading: {
					moduleCode: 'Module 10',
					title: 'Taste as Infrastructure',
					keyMentalModel: 'Taste is explicit criteria tied to purpose (5-part formula).',
					referenceDoc: 'Directing the Machine.md #Module 10'
				},
				tasks: makeDayTasks({
					weekNum: 7,
					dayNum: 4,
					readTitle: 'Taste as Infrastructure',
					readModule: 'Module 10',
					drillTitle: 'Taste as Infrastructure Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 7 — Taste as Infrastructure & Blind Curation.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 7 — Taste as Infrastructure & Blind Curation · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Week 7 — Taste as Infrastructure & Blind Curation',
				assignedReading: {
					moduleCode: 'Module 10',
					title: 'Taste as Infrastructure',
					keyMentalModel: 'Taste is explicit criteria tied to purpose (5-part formula).',
					referenceDoc: 'Directing the Machine.md #Module 10'
				},
				tasks: makeDayTasks({
					weekNum: 7,
					dayNum: 5,
					readTitle: 'Taste as Infrastructure',
					readModule: 'Module 10',
					drillTitle: 'Taste as Infrastructure Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 7 — Taste as Infrastructure & Blind Curation.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 7 — Taste as Infrastructure & Blind Curation · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Week 7 — Taste as Infrastructure & Blind Curation',
				assignedReading: {
					moduleCode: 'Module 10',
					title: 'Taste as Infrastructure',
					keyMentalModel: 'Taste is explicit criteria tied to purpose (5-part formula).',
					referenceDoc: 'Directing the Machine.md #Module 10'
				},
				tasks: makeDayTasks({
					weekNum: 7,
					dayNum: 6,
					readTitle: 'Taste as Infrastructure',
					readModule: 'Module 10',
					drillTitle: 'Taste as Infrastructure Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 7 — Taste as Infrastructure & Blind Curation.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 7 — Taste as Infrastructure & Blind Curation · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Week 7 — Taste as Infrastructure & Blind Curation',
				assignedReading: {
					moduleCode: 'Module 10',
					title: 'Taste as Infrastructure',
					keyMentalModel: 'Taste is explicit criteria tied to purpose (5-part formula).',
					referenceDoc: 'Directing the Machine.md #Module 10'
				},
				tasks: makeDayTasks({
					weekNum: 7,
					dayNum: 7,
					readTitle: 'Taste as Infrastructure',
					readModule: 'Module 10',
					drillTitle: 'Taste as Infrastructure Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 7 — Taste as Infrastructure & Blind Curation.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 7 — Taste as Infrastructure & Blind Curation · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			}
		]
	},
	{
		weekNumber: 8,
		title: 'Week 8 — Anchor Demotions & Part IV Mastery Gate',
		partNumber: 4,
		phaseName: 'Part IV: Calibrate',
		masteryLayer: 2,
		layerName: 'Independence',
		governingQuestion: 'Can I justify anchor demotions, curate 2 complete libraries, and prove taste independence?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p4',
		weeklyDeliverables: [
			'Complete Project 4: 2 Anchor Libraries (15+ each, >=40% human)',
			'20 Comparative Judgments logged',
			'2 Slop Criteria defined',
			'3 Justified Demotions'
		],
		masteryGateCriteria: [
			'Demotions show genuine criteria evolution',
			'Can defend criteria without appealing to authority',
			'Ready for Category scaffolding to be removed in Part V'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Week 8 — Anchor Demotions & Part IV Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix E',
					title: 'Anchor Demotion & Range Audit',
					keyMentalModel: 'Demotion is progress. A library that stops surprising you has stopped calibrating you.',
					referenceDoc: 'Directing the Machine.md #Appendix E'
				},
				tasks: makeDayTasks({
					weekNum: 8,
					dayNum: 1,
					readTitle: 'Anchor Demotion & Range Audit',
					readModule: 'Appendix E',
					drillTitle: 'Anchor Demotion & Range Audit Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 8 — Anchor Demotions & Part IV Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 8 — Anchor Demotions & Part IV Mastery Gate · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Week 8 — Anchor Demotions & Part IV Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix E',
					title: 'Anchor Demotion & Range Audit',
					keyMentalModel: 'Demotion is progress. A library that stops surprising you has stopped calibrating you.',
					referenceDoc: 'Directing the Machine.md #Appendix E'
				},
				tasks: makeDayTasks({
					weekNum: 8,
					dayNum: 2,
					readTitle: 'Anchor Demotion & Range Audit',
					readModule: 'Appendix E',
					drillTitle: 'Anchor Demotion & Range Audit Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 8 — Anchor Demotions & Part IV Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 8 — Anchor Demotions & Part IV Mastery Gate · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Week 8 — Anchor Demotions & Part IV Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix E',
					title: 'Anchor Demotion & Range Audit',
					keyMentalModel: 'Demotion is progress. A library that stops surprising you has stopped calibrating you.',
					referenceDoc: 'Directing the Machine.md #Appendix E'
				},
				tasks: makeDayTasks({
					weekNum: 8,
					dayNum: 3,
					readTitle: 'Anchor Demotion & Range Audit',
					readModule: 'Appendix E',
					drillTitle: 'Anchor Demotion & Range Audit Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 8 — Anchor Demotions & Part IV Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 8 — Anchor Demotions & Part IV Mastery Gate · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Week 8 — Anchor Demotions & Part IV Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix E',
					title: 'Anchor Demotion & Range Audit',
					keyMentalModel: 'Demotion is progress. A library that stops surprising you has stopped calibrating you.',
					referenceDoc: 'Directing the Machine.md #Appendix E'
				},
				tasks: makeDayTasks({
					weekNum: 8,
					dayNum: 4,
					readTitle: 'Anchor Demotion & Range Audit',
					readModule: 'Appendix E',
					drillTitle: 'Anchor Demotion & Range Audit Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 8 — Anchor Demotions & Part IV Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 8 — Anchor Demotions & Part IV Mastery Gate · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Week 8 — Anchor Demotions & Part IV Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix E',
					title: 'Anchor Demotion & Range Audit',
					keyMentalModel: 'Demotion is progress. A library that stops surprising you has stopped calibrating you.',
					referenceDoc: 'Directing the Machine.md #Appendix E'
				},
				tasks: makeDayTasks({
					weekNum: 8,
					dayNum: 5,
					readTitle: 'Anchor Demotion & Range Audit',
					readModule: 'Appendix E',
					drillTitle: 'Anchor Demotion & Range Audit Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 8 — Anchor Demotions & Part IV Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 8 — Anchor Demotions & Part IV Mastery Gate · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Week 8 — Anchor Demotions & Part IV Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix E',
					title: 'Anchor Demotion & Range Audit',
					keyMentalModel: 'Demotion is progress. A library that stops surprising you has stopped calibrating you.',
					referenceDoc: 'Directing the Machine.md #Appendix E'
				},
				tasks: makeDayTasks({
					weekNum: 8,
					dayNum: 6,
					readTitle: 'Anchor Demotion & Range Audit',
					readModule: 'Appendix E',
					drillTitle: 'Anchor Demotion & Range Audit Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 8 — Anchor Demotions & Part IV Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 8 — Anchor Demotions & Part IV Mastery Gate · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Week 8 — Anchor Demotions & Part IV Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix E',
					title: 'Anchor Demotion & Range Audit',
					keyMentalModel: 'Demotion is progress. A library that stops surprising you has stopped calibrating you.',
					referenceDoc: 'Directing the Machine.md #Appendix E'
				},
				tasks: makeDayTasks({
					weekNum: 8,
					dayNum: 7,
					readTitle: 'Anchor Demotion & Range Audit',
					readModule: 'Appendix E',
					drillTitle: 'Anchor Demotion & Range Audit Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 8 — Anchor Demotions & Part IV Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 8 — Anchor Demotions & Part IV Mastery Gate · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p4',
					primaryModId: 'm5'
				})
			}
		]
	},
	{
		weekNumber: 9,
		title: 'Week 9 — Production Direction & Stakeholder Critique',
		partNumber: 5,
		phaseName: 'Part V: Direct',
		masteryLayer: 2,
		layerName: 'Independence',
		governingQuestion: 'How do I maintain directorial authority when working with external stakeholders?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p5',
		weeklyDeliverables: [
			'1 Visual project started under client constraints',
			'1 Stakeholder Critique triage logged',
			'Max 3 revision cycles enforced',
			'1 Written Defense drafted'
		],
		masteryGateCriteria: [
			'Translates surface critique into inferred root problems',
			'Enforces maximum 3 revision cycles',
			'Defends choices using structural arguments'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Week 9 — Production Direction & Stakeholder Critique',
				assignedReading: {
					moduleCode: 'Module 12',
					title: 'Production Direction',
					keyMentalModel: 'Direction introduces stakes. Enforce maximum 3 named revision cycles.',
					referenceDoc: 'Directing the Machine.md #Module 12'
				},
				tasks: makeDayTasks({
					weekNum: 9,
					dayNum: 1,
					readTitle: 'Production Direction',
					readModule: 'Module 12',
					drillTitle: 'Production Direction Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 9 — Production Direction & Stakeholder Critique.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 9 — Production Direction & Stakeholder Critique · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Week 9 — Production Direction & Stakeholder Critique',
				assignedReading: {
					moduleCode: 'Module 12',
					title: 'Production Direction',
					keyMentalModel: 'Direction introduces stakes. Enforce maximum 3 named revision cycles.',
					referenceDoc: 'Directing the Machine.md #Module 12'
				},
				tasks: makeDayTasks({
					weekNum: 9,
					dayNum: 2,
					readTitle: 'Production Direction',
					readModule: 'Module 12',
					drillTitle: 'Production Direction Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 9 — Production Direction & Stakeholder Critique.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 9 — Production Direction & Stakeholder Critique · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Week 9 — Production Direction & Stakeholder Critique',
				assignedReading: {
					moduleCode: 'Module 12',
					title: 'Production Direction',
					keyMentalModel: 'Direction introduces stakes. Enforce maximum 3 named revision cycles.',
					referenceDoc: 'Directing the Machine.md #Module 12'
				},
				tasks: makeDayTasks({
					weekNum: 9,
					dayNum: 3,
					readTitle: 'Production Direction',
					readModule: 'Module 12',
					drillTitle: 'Production Direction Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 9 — Production Direction & Stakeholder Critique.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 9 — Production Direction & Stakeholder Critique · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Week 9 — Production Direction & Stakeholder Critique',
				assignedReading: {
					moduleCode: 'Module 12',
					title: 'Production Direction',
					keyMentalModel: 'Direction introduces stakes. Enforce maximum 3 named revision cycles.',
					referenceDoc: 'Directing the Machine.md #Module 12'
				},
				tasks: makeDayTasks({
					weekNum: 9,
					dayNum: 4,
					readTitle: 'Production Direction',
					readModule: 'Module 12',
					drillTitle: 'Production Direction Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 9 — Production Direction & Stakeholder Critique.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 9 — Production Direction & Stakeholder Critique · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Week 9 — Production Direction & Stakeholder Critique',
				assignedReading: {
					moduleCode: 'Module 12',
					title: 'Production Direction',
					keyMentalModel: 'Direction introduces stakes. Enforce maximum 3 named revision cycles.',
					referenceDoc: 'Directing the Machine.md #Module 12'
				},
				tasks: makeDayTasks({
					weekNum: 9,
					dayNum: 5,
					readTitle: 'Production Direction',
					readModule: 'Module 12',
					drillTitle: 'Production Direction Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 9 — Production Direction & Stakeholder Critique.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 9 — Production Direction & Stakeholder Critique · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Week 9 — Production Direction & Stakeholder Critique',
				assignedReading: {
					moduleCode: 'Module 12',
					title: 'Production Direction',
					keyMentalModel: 'Direction introduces stakes. Enforce maximum 3 named revision cycles.',
					referenceDoc: 'Directing the Machine.md #Module 12'
				},
				tasks: makeDayTasks({
					weekNum: 9,
					dayNum: 6,
					readTitle: 'Production Direction',
					readModule: 'Module 12',
					drillTitle: 'Production Direction Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 9 — Production Direction & Stakeholder Critique.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 9 — Production Direction & Stakeholder Critique · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Week 9 — Production Direction & Stakeholder Critique',
				assignedReading: {
					moduleCode: 'Module 12',
					title: 'Production Direction',
					keyMentalModel: 'Direction introduces stakes. Enforce maximum 3 named revision cycles.',
					referenceDoc: 'Directing the Machine.md #Module 12'
				},
				tasks: makeDayTasks({
					weekNum: 9,
					dayNum: 7,
					readTitle: 'Production Direction',
					readModule: 'Module 12',
					drillTitle: 'Production Direction Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 9 — Production Direction & Stakeholder Critique.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 9 — Production Direction & Stakeholder Critique · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			}
		]
	},
	{
		weekNumber: 10,
		title: 'Week 10 — Principled Refusal & Part V Mastery Gate',
		partNumber: 5,
		phaseName: 'Part V: Direct',
		masteryLayer: 2,
		layerName: 'Independence',
		governingQuestion: 'Can I deliver 2 complete client projects within 3 revisions, execute 2 refusals, and defend my authority?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p5',
		weeklyDeliverables: [
			'Complete Project 5: 1 Visual + 1 Writing project delivered',
			'2 Stakeholder Critique logs',
			'2 Consequential Defenses',
			'2 Explicit Refusals',
			'1 Re-Brief Record'
		],
		masteryGateCriteria: [
			'Maintains authorial integrity under external pushback',
			'Executes principled refusal cleanly',
			'Ready for Situation removal down to Blank Sheet in Part VI'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Week 10 — Principled Refusal & Part V Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix F',
					title: 'The 5 Modes of Refusal',
					keyMentalModel: 'Ethical, Positional, Technical, Intentional, and Slop Refusal.',
					referenceDoc: 'Directing the Machine.md #Appendix F'
				},
				tasks: makeDayTasks({
					weekNum: 10,
					dayNum: 1,
					readTitle: 'The 5 Modes of Refusal',
					readModule: 'Appendix F',
					drillTitle: 'The 5 Modes of Refusal Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 10 — Principled Refusal & Part V Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 10 — Principled Refusal & Part V Mastery Gate · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Week 10 — Principled Refusal & Part V Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix F',
					title: 'The 5 Modes of Refusal',
					keyMentalModel: 'Ethical, Positional, Technical, Intentional, and Slop Refusal.',
					referenceDoc: 'Directing the Machine.md #Appendix F'
				},
				tasks: makeDayTasks({
					weekNum: 10,
					dayNum: 2,
					readTitle: 'The 5 Modes of Refusal',
					readModule: 'Appendix F',
					drillTitle: 'The 5 Modes of Refusal Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 10 — Principled Refusal & Part V Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 10 — Principled Refusal & Part V Mastery Gate · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Week 10 — Principled Refusal & Part V Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix F',
					title: 'The 5 Modes of Refusal',
					keyMentalModel: 'Ethical, Positional, Technical, Intentional, and Slop Refusal.',
					referenceDoc: 'Directing the Machine.md #Appendix F'
				},
				tasks: makeDayTasks({
					weekNum: 10,
					dayNum: 3,
					readTitle: 'The 5 Modes of Refusal',
					readModule: 'Appendix F',
					drillTitle: 'The 5 Modes of Refusal Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 10 — Principled Refusal & Part V Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 10 — Principled Refusal & Part V Mastery Gate · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Week 10 — Principled Refusal & Part V Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix F',
					title: 'The 5 Modes of Refusal',
					keyMentalModel: 'Ethical, Positional, Technical, Intentional, and Slop Refusal.',
					referenceDoc: 'Directing the Machine.md #Appendix F'
				},
				tasks: makeDayTasks({
					weekNum: 10,
					dayNum: 4,
					readTitle: 'The 5 Modes of Refusal',
					readModule: 'Appendix F',
					drillTitle: 'The 5 Modes of Refusal Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 10 — Principled Refusal & Part V Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 10 — Principled Refusal & Part V Mastery Gate · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Week 10 — Principled Refusal & Part V Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix F',
					title: 'The 5 Modes of Refusal',
					keyMentalModel: 'Ethical, Positional, Technical, Intentional, and Slop Refusal.',
					referenceDoc: 'Directing the Machine.md #Appendix F'
				},
				tasks: makeDayTasks({
					weekNum: 10,
					dayNum: 5,
					readTitle: 'The 5 Modes of Refusal',
					readModule: 'Appendix F',
					drillTitle: 'The 5 Modes of Refusal Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 10 — Principled Refusal & Part V Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 10 — Principled Refusal & Part V Mastery Gate · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Week 10 — Principled Refusal & Part V Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix F',
					title: 'The 5 Modes of Refusal',
					keyMentalModel: 'Ethical, Positional, Technical, Intentional, and Slop Refusal.',
					referenceDoc: 'Directing the Machine.md #Appendix F'
				},
				tasks: makeDayTasks({
					weekNum: 10,
					dayNum: 6,
					readTitle: 'The 5 Modes of Refusal',
					readModule: 'Appendix F',
					drillTitle: 'The 5 Modes of Refusal Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 10 — Principled Refusal & Part V Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 10 — Principled Refusal & Part V Mastery Gate · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Week 10 — Principled Refusal & Part V Mastery Gate',
				assignedReading: {
					moduleCode: 'Appendix F',
					title: 'The 5 Modes of Refusal',
					keyMentalModel: 'Ethical, Positional, Technical, Intentional, and Slop Refusal.',
					referenceDoc: 'Directing the Machine.md #Appendix F'
				},
				tasks: makeDayTasks({
					weekNum: 10,
					dayNum: 7,
					readTitle: 'The 5 Modes of Refusal',
					readModule: 'Appendix F',
					drillTitle: 'The 5 Modes of Refusal Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 10 — Principled Refusal & Part V Mastery Gate.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 10 — Principled Refusal & Part V Mastery Gate · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p5',
					primaryModId: 'm6'
				})
			}
		]
	},
	{
		weekNumber: 11,
		title: 'Week 11 — Authorship as Position & Synthesis',
		partNumber: 6,
		phaseName: 'Part VI: Author & Transfer',
		masteryLayer: 2,
		layerName: 'Independence',
		governingQuestion: 'What do I repeatedly pursue and refuse when nobody tells me what to make?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p6',
		weeklyDeliverables: [
			'Written Private Authorial Position',
			'Written Public Authorial Position',
			'1 Cross-Medium Synthesis Work started',
			'Visual & Writing Portfolio Case Studies started'
		],
		masteryGateCriteria: [
			'Clear distinction between private commitments and public stance',
			'Cross-medium synthesis passes removal test',
			'Self-directed problem origin without external cues'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Week 11 — Authorship as Position & Synthesis',
				assignedReading: {
					moduleCode: 'Module 15',
					title: 'Authorship as Position',
					keyMentalModel: 'Authorship is not a style; authorship is a consistent position.',
					referenceDoc: 'Directing the Machine.md #Module 15'
				},
				tasks: makeDayTasks({
					weekNum: 11,
					dayNum: 1,
					readTitle: 'Authorship as Position',
					readModule: 'Module 15',
					drillTitle: 'Authorship as Position Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 11 — Authorship as Position & Synthesis.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 11 — Authorship as Position & Synthesis · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Week 11 — Authorship as Position & Synthesis',
				assignedReading: {
					moduleCode: 'Module 15',
					title: 'Authorship as Position',
					keyMentalModel: 'Authorship is not a style; authorship is a consistent position.',
					referenceDoc: 'Directing the Machine.md #Module 15'
				},
				tasks: makeDayTasks({
					weekNum: 11,
					dayNum: 2,
					readTitle: 'Authorship as Position',
					readModule: 'Module 15',
					drillTitle: 'Authorship as Position Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 11 — Authorship as Position & Synthesis.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 11 — Authorship as Position & Synthesis · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Week 11 — Authorship as Position & Synthesis',
				assignedReading: {
					moduleCode: 'Module 15',
					title: 'Authorship as Position',
					keyMentalModel: 'Authorship is not a style; authorship is a consistent position.',
					referenceDoc: 'Directing the Machine.md #Module 15'
				},
				tasks: makeDayTasks({
					weekNum: 11,
					dayNum: 3,
					readTitle: 'Authorship as Position',
					readModule: 'Module 15',
					drillTitle: 'Authorship as Position Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 11 — Authorship as Position & Synthesis.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 11 — Authorship as Position & Synthesis · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Week 11 — Authorship as Position & Synthesis',
				assignedReading: {
					moduleCode: 'Module 15',
					title: 'Authorship as Position',
					keyMentalModel: 'Authorship is not a style; authorship is a consistent position.',
					referenceDoc: 'Directing the Machine.md #Module 15'
				},
				tasks: makeDayTasks({
					weekNum: 11,
					dayNum: 4,
					readTitle: 'Authorship as Position',
					readModule: 'Module 15',
					drillTitle: 'Authorship as Position Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 11 — Authorship as Position & Synthesis.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 11 — Authorship as Position & Synthesis · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Week 11 — Authorship as Position & Synthesis',
				assignedReading: {
					moduleCode: 'Module 15',
					title: 'Authorship as Position',
					keyMentalModel: 'Authorship is not a style; authorship is a consistent position.',
					referenceDoc: 'Directing the Machine.md #Module 15'
				},
				tasks: makeDayTasks({
					weekNum: 11,
					dayNum: 5,
					readTitle: 'Authorship as Position',
					readModule: 'Module 15',
					drillTitle: 'Authorship as Position Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 11 — Authorship as Position & Synthesis.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 11 — Authorship as Position & Synthesis · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Week 11 — Authorship as Position & Synthesis',
				assignedReading: {
					moduleCode: 'Module 15',
					title: 'Authorship as Position',
					keyMentalModel: 'Authorship is not a style; authorship is a consistent position.',
					referenceDoc: 'Directing the Machine.md #Module 15'
				},
				tasks: makeDayTasks({
					weekNum: 11,
					dayNum: 6,
					readTitle: 'Authorship as Position',
					readModule: 'Module 15',
					drillTitle: 'Authorship as Position Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 11 — Authorship as Position & Synthesis.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 11 — Authorship as Position & Synthesis · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Week 11 — Authorship as Position & Synthesis',
				assignedReading: {
					moduleCode: 'Module 15',
					title: 'Authorship as Position',
					keyMentalModel: 'Authorship is not a style; authorship is a consistent position.',
					referenceDoc: 'Directing the Machine.md #Module 15'
				},
				tasks: makeDayTasks({
					weekNum: 11,
					dayNum: 7,
					readTitle: 'Authorship as Position',
					readModule: 'Module 15',
					drillTitle: 'Authorship as Position Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 11 — Authorship as Position & Synthesis.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 11 — Authorship as Position & Synthesis · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			}
		]
	},
	{
		weekNumber: 12,
		title: 'Week 12 — The Blank-Sheet Capstone & Exit Readiness',
		partNumber: 6,
		phaseName: 'Part VI: Author & Transfer',
		masteryLayer: 2,
		layerName: 'Independence',
		governingQuestion: 'Can I originate a complete project from real-world conditions only, with all scaffolds removed?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p6',
		weeklyDeliverables: [
			'Complete Project 6: Full Portfolios (Visual & Writing 5-8 cases)',
			'1 Cross-Medium Synthesis Work delivered',
			'1 Public Process piece published',
			'The 14-Step Blank-Sheet Capstone completed',
			'How I Decided What to Make Capstone Essay'
		],
		masteryGateCriteria: [
			'Blank-Sheet Capstone originated from unassigned conditions',
			'Demonstrates total independence from app templates',
			'Ready for Independent Practice (Months 4–9)'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Week 12 — The Blank-Sheet Capstone & Exit Readiness',
				assignedReading: {
					moduleCode: 'Module 16',
					title: 'The Blank-Sheet Capstone',
					keyMentalModel: 'Originate everything from real-world conditions only.',
					referenceDoc: 'Directing the Machine.md #Module 16'
				},
				tasks: makeDayTasks({
					weekNum: 12,
					dayNum: 1,
					readTitle: 'The Blank-Sheet Capstone',
					readModule: 'Module 16',
					drillTitle: 'The Blank-Sheet Capstone Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 12 — The Blank-Sheet Capstone & Exit Readiness.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 12 — The Blank-Sheet Capstone & Exit Readiness · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Week 12 — The Blank-Sheet Capstone & Exit Readiness',
				assignedReading: {
					moduleCode: 'Module 16',
					title: 'The Blank-Sheet Capstone',
					keyMentalModel: 'Originate everything from real-world conditions only.',
					referenceDoc: 'Directing the Machine.md #Module 16'
				},
				tasks: makeDayTasks({
					weekNum: 12,
					dayNum: 2,
					readTitle: 'The Blank-Sheet Capstone',
					readModule: 'Module 16',
					drillTitle: 'The Blank-Sheet Capstone Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 12 — The Blank-Sheet Capstone & Exit Readiness.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 12 — The Blank-Sheet Capstone & Exit Readiness · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Week 12 — The Blank-Sheet Capstone & Exit Readiness',
				assignedReading: {
					moduleCode: 'Module 16',
					title: 'The Blank-Sheet Capstone',
					keyMentalModel: 'Originate everything from real-world conditions only.',
					referenceDoc: 'Directing the Machine.md #Module 16'
				},
				tasks: makeDayTasks({
					weekNum: 12,
					dayNum: 3,
					readTitle: 'The Blank-Sheet Capstone',
					readModule: 'Module 16',
					drillTitle: 'The Blank-Sheet Capstone Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 12 — The Blank-Sheet Capstone & Exit Readiness.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 12 — The Blank-Sheet Capstone & Exit Readiness · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Week 12 — The Blank-Sheet Capstone & Exit Readiness',
				assignedReading: {
					moduleCode: 'Module 16',
					title: 'The Blank-Sheet Capstone',
					keyMentalModel: 'Originate everything from real-world conditions only.',
					referenceDoc: 'Directing the Machine.md #Module 16'
				},
				tasks: makeDayTasks({
					weekNum: 12,
					dayNum: 4,
					readTitle: 'The Blank-Sheet Capstone',
					readModule: 'Module 16',
					drillTitle: 'The Blank-Sheet Capstone Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 12 — The Blank-Sheet Capstone & Exit Readiness.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 12 — The Blank-Sheet Capstone & Exit Readiness · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Week 12 — The Blank-Sheet Capstone & Exit Readiness',
				assignedReading: {
					moduleCode: 'Module 16',
					title: 'The Blank-Sheet Capstone',
					keyMentalModel: 'Originate everything from real-world conditions only.',
					referenceDoc: 'Directing the Machine.md #Module 16'
				},
				tasks: makeDayTasks({
					weekNum: 12,
					dayNum: 5,
					readTitle: 'The Blank-Sheet Capstone',
					readModule: 'Module 16',
					drillTitle: 'The Blank-Sheet Capstone Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 12 — The Blank-Sheet Capstone & Exit Readiness.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 12 — The Blank-Sheet Capstone & Exit Readiness · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Week 12 — The Blank-Sheet Capstone & Exit Readiness',
				assignedReading: {
					moduleCode: 'Module 16',
					title: 'The Blank-Sheet Capstone',
					keyMentalModel: 'Originate everything from real-world conditions only.',
					referenceDoc: 'Directing the Machine.md #Module 16'
				},
				tasks: makeDayTasks({
					weekNum: 12,
					dayNum: 6,
					readTitle: 'The Blank-Sheet Capstone',
					readModule: 'Module 16',
					drillTitle: 'The Blank-Sheet Capstone Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 12 — The Blank-Sheet Capstone & Exit Readiness.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 12 — The Blank-Sheet Capstone & Exit Readiness · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Week 12 — The Blank-Sheet Capstone & Exit Readiness',
				assignedReading: {
					moduleCode: 'Module 16',
					title: 'The Blank-Sheet Capstone',
					keyMentalModel: 'Originate everything from real-world conditions only.',
					referenceDoc: 'Directing the Machine.md #Module 16'
				},
				tasks: makeDayTasks({
					weekNum: 12,
					dayNum: 7,
					readTitle: 'The Blank-Sheet Capstone',
					readModule: 'Module 16',
					drillTitle: 'The Blank-Sheet Capstone Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Week 12 — The Blank-Sheet Capstone & Exit Readiness.',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Week 12 — The Blank-Sheet Capstone & Exit Readiness · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p6',
					primaryModId: 'm7'
				})
			}
		]
	},
	{
		weekNumber: 13,
		title: 'Month 4 — Project 7: Visual Campaign (Directed Execution)',
		partNumber: 7,
		phaseName: 'Month 4',
		masteryLayer: 3,
		layerName: 'Agency',
		governingQuestion: 'Can I direct a full visual campaign concept from an external brief under commercial conditions?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p7',
		weeklyDeliverables: [
			'Working brief with acceptance & rejection criteria',
			'ComfyUI nodal graph fully documented',
			'10 first-set outputs diagnosed',
			'10 revised outputs (1 accepted, 3 rejected justified)',
			'20-entry Decision Log',
			'1-page Written Defense'
		],
		masteryGateCriteria: [
			'Campaign communicates intention instantly',
			'Pipeline is causal and reproducible',
			'Defense withstands external critique'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Month 4 — Project 7: Visual Campaign (Directed Execution)',
				assignedReading: {
					moduleCode: 'Project 7 Spec',
					title: 'Visual Campaign (Directed Execution)',
					keyMentalModel: 'An external brief is the constraint. Your job is to direct within it.',
					referenceDoc: 'Directing the Machine.md #Project 7 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 13,
					dayNum: 1,
					readTitle: 'Visual Campaign (Directed Execution)',
					readModule: 'Project 7 Spec',
					drillTitle: 'Visual Campaign (Directed Execution) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 4 — Project 7: Visual Campaign (Directed Execution).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 4 — Project 7: Visual Campaign (Directed Execution) · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p7',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Month 4 — Project 7: Visual Campaign (Directed Execution)',
				assignedReading: {
					moduleCode: 'Project 7 Spec',
					title: 'Visual Campaign (Directed Execution)',
					keyMentalModel: 'An external brief is the constraint. Your job is to direct within it.',
					referenceDoc: 'Directing the Machine.md #Project 7 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 13,
					dayNum: 2,
					readTitle: 'Visual Campaign (Directed Execution)',
					readModule: 'Project 7 Spec',
					drillTitle: 'Visual Campaign (Directed Execution) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 4 — Project 7: Visual Campaign (Directed Execution).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 4 — Project 7: Visual Campaign (Directed Execution) · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p7',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Month 4 — Project 7: Visual Campaign (Directed Execution)',
				assignedReading: {
					moduleCode: 'Project 7 Spec',
					title: 'Visual Campaign (Directed Execution)',
					keyMentalModel: 'An external brief is the constraint. Your job is to direct within it.',
					referenceDoc: 'Directing the Machine.md #Project 7 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 13,
					dayNum: 3,
					readTitle: 'Visual Campaign (Directed Execution)',
					readModule: 'Project 7 Spec',
					drillTitle: 'Visual Campaign (Directed Execution) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 4 — Project 7: Visual Campaign (Directed Execution).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 4 — Project 7: Visual Campaign (Directed Execution) · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p7',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Month 4 — Project 7: Visual Campaign (Directed Execution)',
				assignedReading: {
					moduleCode: 'Project 7 Spec',
					title: 'Visual Campaign (Directed Execution)',
					keyMentalModel: 'An external brief is the constraint. Your job is to direct within it.',
					referenceDoc: 'Directing the Machine.md #Project 7 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 13,
					dayNum: 4,
					readTitle: 'Visual Campaign (Directed Execution)',
					readModule: 'Project 7 Spec',
					drillTitle: 'Visual Campaign (Directed Execution) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 4 — Project 7: Visual Campaign (Directed Execution).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 4 — Project 7: Visual Campaign (Directed Execution) · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p7',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Month 4 — Project 7: Visual Campaign (Directed Execution)',
				assignedReading: {
					moduleCode: 'Project 7 Spec',
					title: 'Visual Campaign (Directed Execution)',
					keyMentalModel: 'An external brief is the constraint. Your job is to direct within it.',
					referenceDoc: 'Directing the Machine.md #Project 7 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 13,
					dayNum: 5,
					readTitle: 'Visual Campaign (Directed Execution)',
					readModule: 'Project 7 Spec',
					drillTitle: 'Visual Campaign (Directed Execution) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 4 — Project 7: Visual Campaign (Directed Execution).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 4 — Project 7: Visual Campaign (Directed Execution) · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p7',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Month 4 — Project 7: Visual Campaign (Directed Execution)',
				assignedReading: {
					moduleCode: 'Project 7 Spec',
					title: 'Visual Campaign (Directed Execution)',
					keyMentalModel: 'An external brief is the constraint. Your job is to direct within it.',
					referenceDoc: 'Directing the Machine.md #Project 7 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 13,
					dayNum: 6,
					readTitle: 'Visual Campaign (Directed Execution)',
					readModule: 'Project 7 Spec',
					drillTitle: 'Visual Campaign (Directed Execution) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 4 — Project 7: Visual Campaign (Directed Execution).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 4 — Project 7: Visual Campaign (Directed Execution) · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p7',
					primaryModId: 'm4'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Month 4 — Project 7: Visual Campaign (Directed Execution)',
				assignedReading: {
					moduleCode: 'Project 7 Spec',
					title: 'Visual Campaign (Directed Execution)',
					keyMentalModel: 'An external brief is the constraint. Your job is to direct within it.',
					referenceDoc: 'Directing the Machine.md #Project 7 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 13,
					dayNum: 7,
					readTitle: 'Visual Campaign (Directed Execution)',
					readModule: 'Project 7 Spec',
					drillTitle: 'Visual Campaign (Directed Execution) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 4 — Project 7: Visual Campaign (Directed Execution).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 4 — Project 7: Visual Campaign (Directed Execution) · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p7',
					primaryModId: 'm4'
				})
			}
		]
	},
	{
		weekNumber: 14,
		title: 'Month 5 — Project 8: Writing Voice Guide (Brief Ownership)',
		partNumber: 8,
		phaseName: 'Month 5',
		masteryLayer: 3,
		layerName: 'Agency',
		governingQuestion: 'Can I supply the brief myself from a broad category and enforce an original writing voice guide?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p8',
		weeklyDeliverables: [
			'8–12 page Writing Voice Guide',
			'5 Exemplar pieces in the defined voice',
			'Positive & Negative anchor comparisons',
			'Editorial prompt & workflow protocol',
			'20-entry Decision Log'
		],
		masteryGateCriteria: [
			'Voice is distinct, consistent, and resilient across all 5 exemplars',
			'Rules are mechanistic (9 dials), not mood-based',
			'Decision log documents ruthless cuts and edits'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Month 5 — Project 8: Writing Voice Guide (Brief Ownership)',
				assignedReading: {
					moduleCode: 'Project 8 Spec',
					title: 'Writing Voice Guide (Brief Ownership)',
					keyMentalModel: 'Supplied: Broad Category only. Define audience, premise, and voice rules.',
					referenceDoc: 'Directing the Machine.md #Project 8 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 14,
					dayNum: 1,
					readTitle: 'Writing Voice Guide (Brief Ownership)',
					readModule: 'Project 8 Spec',
					drillTitle: 'Writing Voice Guide (Brief Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 5 — Project 8: Writing Voice Guide (Brief Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 5 — Project 8: Writing Voice Guide (Brief Ownership) · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p8',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Month 5 — Project 8: Writing Voice Guide (Brief Ownership)',
				assignedReading: {
					moduleCode: 'Project 8 Spec',
					title: 'Writing Voice Guide (Brief Ownership)',
					keyMentalModel: 'Supplied: Broad Category only. Define audience, premise, and voice rules.',
					referenceDoc: 'Directing the Machine.md #Project 8 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 14,
					dayNum: 2,
					readTitle: 'Writing Voice Guide (Brief Ownership)',
					readModule: 'Project 8 Spec',
					drillTitle: 'Writing Voice Guide (Brief Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 5 — Project 8: Writing Voice Guide (Brief Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 5 — Project 8: Writing Voice Guide (Brief Ownership) · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p8',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Month 5 — Project 8: Writing Voice Guide (Brief Ownership)',
				assignedReading: {
					moduleCode: 'Project 8 Spec',
					title: 'Writing Voice Guide (Brief Ownership)',
					keyMentalModel: 'Supplied: Broad Category only. Define audience, premise, and voice rules.',
					referenceDoc: 'Directing the Machine.md #Project 8 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 14,
					dayNum: 3,
					readTitle: 'Writing Voice Guide (Brief Ownership)',
					readModule: 'Project 8 Spec',
					drillTitle: 'Writing Voice Guide (Brief Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 5 — Project 8: Writing Voice Guide (Brief Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 5 — Project 8: Writing Voice Guide (Brief Ownership) · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p8',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Month 5 — Project 8: Writing Voice Guide (Brief Ownership)',
				assignedReading: {
					moduleCode: 'Project 8 Spec',
					title: 'Writing Voice Guide (Brief Ownership)',
					keyMentalModel: 'Supplied: Broad Category only. Define audience, premise, and voice rules.',
					referenceDoc: 'Directing the Machine.md #Project 8 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 14,
					dayNum: 4,
					readTitle: 'Writing Voice Guide (Brief Ownership)',
					readModule: 'Project 8 Spec',
					drillTitle: 'Writing Voice Guide (Brief Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 5 — Project 8: Writing Voice Guide (Brief Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 5 — Project 8: Writing Voice Guide (Brief Ownership) · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p8',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Month 5 — Project 8: Writing Voice Guide (Brief Ownership)',
				assignedReading: {
					moduleCode: 'Project 8 Spec',
					title: 'Writing Voice Guide (Brief Ownership)',
					keyMentalModel: 'Supplied: Broad Category only. Define audience, premise, and voice rules.',
					referenceDoc: 'Directing the Machine.md #Project 8 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 14,
					dayNum: 5,
					readTitle: 'Writing Voice Guide (Brief Ownership)',
					readModule: 'Project 8 Spec',
					drillTitle: 'Writing Voice Guide (Brief Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 5 — Project 8: Writing Voice Guide (Brief Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 5 — Project 8: Writing Voice Guide (Brief Ownership) · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p8',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Month 5 — Project 8: Writing Voice Guide (Brief Ownership)',
				assignedReading: {
					moduleCode: 'Project 8 Spec',
					title: 'Writing Voice Guide (Brief Ownership)',
					keyMentalModel: 'Supplied: Broad Category only. Define audience, premise, and voice rules.',
					referenceDoc: 'Directing the Machine.md #Project 8 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 14,
					dayNum: 6,
					readTitle: 'Writing Voice Guide (Brief Ownership)',
					readModule: 'Project 8 Spec',
					drillTitle: 'Writing Voice Guide (Brief Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 5 — Project 8: Writing Voice Guide (Brief Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 5 — Project 8: Writing Voice Guide (Brief Ownership) · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p8',
					primaryModId: 'm3'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Month 5 — Project 8: Writing Voice Guide (Brief Ownership)',
				assignedReading: {
					moduleCode: 'Project 8 Spec',
					title: 'Writing Voice Guide (Brief Ownership)',
					keyMentalModel: 'Supplied: Broad Category only. Define audience, premise, and voice rules.',
					referenceDoc: 'Directing the Machine.md #Project 8 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 14,
					dayNum: 7,
					readTitle: 'Writing Voice Guide (Brief Ownership)',
					readModule: 'Project 8 Spec',
					drillTitle: 'Writing Voice Guide (Brief Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 5 — Project 8: Writing Voice Guide (Brief Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 5 — Project 8: Writing Voice Guide (Brief Ownership) · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p8',
					primaryModId: 'm3'
				})
			}
		]
	},
	{
		weekNumber: 15,
		title: 'Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership)',
		partNumber: 9,
		phaseName: 'Month 6',
		masteryLayer: 3,
		layerName: 'Agency',
		governingQuestion: 'Can I originate a compelling premise from a broad theme and synthesize image and text?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p9',
		weeklyDeliverables: [
			'Premise formulation record with rejection logic',
			'Finished Hybrid Essay (1,500–2,500 words + 8–12 images)',
			'Synthesis Removal Test report',
			'Integrated Provenance Ledger',
			'25-entry Decision Log'
		],
		masteryGateCriteria: [
			'Deep structural interdependence between image and text',
			'Passes Cross-Medium Synthesis Removal Test',
			'Compelling premise with genuine philosophical or formal tension'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership)',
				assignedReading: {
					moduleCode: 'Project 9 Spec',
					title: 'Hybrid Visual Essay (Premise Ownership)',
					keyMentalModel: 'Supplied: Broad Theme only. Determine what is actually worth exploring.',
					referenceDoc: 'Directing the Machine.md #Project 9 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 15,
					dayNum: 1,
					readTitle: 'Hybrid Visual Essay (Premise Ownership)',
					readModule: 'Project 9 Spec',
					drillTitle: 'Hybrid Visual Essay (Premise Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership) · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p9',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership)',
				assignedReading: {
					moduleCode: 'Project 9 Spec',
					title: 'Hybrid Visual Essay (Premise Ownership)',
					keyMentalModel: 'Supplied: Broad Theme only. Determine what is actually worth exploring.',
					referenceDoc: 'Directing the Machine.md #Project 9 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 15,
					dayNum: 2,
					readTitle: 'Hybrid Visual Essay (Premise Ownership)',
					readModule: 'Project 9 Spec',
					drillTitle: 'Hybrid Visual Essay (Premise Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership) · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p9',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership)',
				assignedReading: {
					moduleCode: 'Project 9 Spec',
					title: 'Hybrid Visual Essay (Premise Ownership)',
					keyMentalModel: 'Supplied: Broad Theme only. Determine what is actually worth exploring.',
					referenceDoc: 'Directing the Machine.md #Project 9 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 15,
					dayNum: 3,
					readTitle: 'Hybrid Visual Essay (Premise Ownership)',
					readModule: 'Project 9 Spec',
					drillTitle: 'Hybrid Visual Essay (Premise Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership) · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p9',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership)',
				assignedReading: {
					moduleCode: 'Project 9 Spec',
					title: 'Hybrid Visual Essay (Premise Ownership)',
					keyMentalModel: 'Supplied: Broad Theme only. Determine what is actually worth exploring.',
					referenceDoc: 'Directing the Machine.md #Project 9 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 15,
					dayNum: 4,
					readTitle: 'Hybrid Visual Essay (Premise Ownership)',
					readModule: 'Project 9 Spec',
					drillTitle: 'Hybrid Visual Essay (Premise Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership) · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p9',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership)',
				assignedReading: {
					moduleCode: 'Project 9 Spec',
					title: 'Hybrid Visual Essay (Premise Ownership)',
					keyMentalModel: 'Supplied: Broad Theme only. Determine what is actually worth exploring.',
					referenceDoc: 'Directing the Machine.md #Project 9 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 15,
					dayNum: 5,
					readTitle: 'Hybrid Visual Essay (Premise Ownership)',
					readModule: 'Project 9 Spec',
					drillTitle: 'Hybrid Visual Essay (Premise Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership) · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p9',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership)',
				assignedReading: {
					moduleCode: 'Project 9 Spec',
					title: 'Hybrid Visual Essay (Premise Ownership)',
					keyMentalModel: 'Supplied: Broad Theme only. Determine what is actually worth exploring.',
					referenceDoc: 'Directing the Machine.md #Project 9 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 15,
					dayNum: 6,
					readTitle: 'Hybrid Visual Essay (Premise Ownership)',
					readModule: 'Project 9 Spec',
					drillTitle: 'Hybrid Visual Essay (Premise Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership) · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p9',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership)',
				assignedReading: {
					moduleCode: 'Project 9 Spec',
					title: 'Hybrid Visual Essay (Premise Ownership)',
					keyMentalModel: 'Supplied: Broad Theme only. Determine what is actually worth exploring.',
					referenceDoc: 'Directing the Machine.md #Project 9 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 15,
					dayNum: 7,
					readTitle: 'Hybrid Visual Essay (Premise Ownership)',
					readModule: 'Project 9 Spec',
					drillTitle: 'Hybrid Visual Essay (Premise Ownership) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 6 — Project 9: Hybrid Visual Essay (Premise Ownership) · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p9',
					primaryModId: 'm7'
				})
			}
		]
	},
	{
		weekNumber: 16,
		title: 'Month 7 — Project 10: Character Design System (Problem Discovery)',
		partNumber: 10,
		phaseName: 'Month 7',
		masteryLayer: 3,
		layerName: 'Agency',
		governingQuestion: 'Can I diagnose the true problem behind a misleading client request and engineer consistency?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p10',
		weeklyDeliverables: [
			'Diagnostic Re-Brief document reframing stated problem',
			'Character Model Sheet & Turnaround (orthographic views, expression matrix)',
			'15 Contextual Character Outputs across dramatic scenes',
			'Identity Drift Audit',
			'25-entry Directorial Decision Log'
		],
		masteryGateCriteria: [
			'Flawless character facial and costume consistency across extreme angles',
			'Diagnosed root problem before designing anything',
			'Decision log documents precise ControlNet/LoRA/manual interventions'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Month 7 — Project 10: Character Design System (Problem Discovery)',
				assignedReading: {
					moduleCode: 'Project 10 Spec',
					title: 'Character Design System (Problem Discovery)',
					keyMentalModel: 'Clients say it looks outdated when the real problem is positioning.',
					referenceDoc: 'Directing the Machine.md #Project 10 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 16,
					dayNum: 1,
					readTitle: 'Character Design System (Problem Discovery)',
					readModule: 'Project 10 Spec',
					drillTitle: 'Character Design System (Problem Discovery) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 7 — Project 10: Character Design System (Problem Discovery).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 7 — Project 10: Character Design System (Problem Discovery) · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p10',
					primaryModId: 'm1'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Month 7 — Project 10: Character Design System (Problem Discovery)',
				assignedReading: {
					moduleCode: 'Project 10 Spec',
					title: 'Character Design System (Problem Discovery)',
					keyMentalModel: 'Clients say it looks outdated when the real problem is positioning.',
					referenceDoc: 'Directing the Machine.md #Project 10 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 16,
					dayNum: 2,
					readTitle: 'Character Design System (Problem Discovery)',
					readModule: 'Project 10 Spec',
					drillTitle: 'Character Design System (Problem Discovery) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 7 — Project 10: Character Design System (Problem Discovery).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 7 — Project 10: Character Design System (Problem Discovery) · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p10',
					primaryModId: 'm1'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Month 7 — Project 10: Character Design System (Problem Discovery)',
				assignedReading: {
					moduleCode: 'Project 10 Spec',
					title: 'Character Design System (Problem Discovery)',
					keyMentalModel: 'Clients say it looks outdated when the real problem is positioning.',
					referenceDoc: 'Directing the Machine.md #Project 10 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 16,
					dayNum: 3,
					readTitle: 'Character Design System (Problem Discovery)',
					readModule: 'Project 10 Spec',
					drillTitle: 'Character Design System (Problem Discovery) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 7 — Project 10: Character Design System (Problem Discovery).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 7 — Project 10: Character Design System (Problem Discovery) · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p10',
					primaryModId: 'm1'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Month 7 — Project 10: Character Design System (Problem Discovery)',
				assignedReading: {
					moduleCode: 'Project 10 Spec',
					title: 'Character Design System (Problem Discovery)',
					keyMentalModel: 'Clients say it looks outdated when the real problem is positioning.',
					referenceDoc: 'Directing the Machine.md #Project 10 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 16,
					dayNum: 4,
					readTitle: 'Character Design System (Problem Discovery)',
					readModule: 'Project 10 Spec',
					drillTitle: 'Character Design System (Problem Discovery) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 7 — Project 10: Character Design System (Problem Discovery).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 7 — Project 10: Character Design System (Problem Discovery) · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p10',
					primaryModId: 'm1'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Month 7 — Project 10: Character Design System (Problem Discovery)',
				assignedReading: {
					moduleCode: 'Project 10 Spec',
					title: 'Character Design System (Problem Discovery)',
					keyMentalModel: 'Clients say it looks outdated when the real problem is positioning.',
					referenceDoc: 'Directing the Machine.md #Project 10 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 16,
					dayNum: 5,
					readTitle: 'Character Design System (Problem Discovery)',
					readModule: 'Project 10 Spec',
					drillTitle: 'Character Design System (Problem Discovery) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 7 — Project 10: Character Design System (Problem Discovery).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 7 — Project 10: Character Design System (Problem Discovery) · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p10',
					primaryModId: 'm1'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Month 7 — Project 10: Character Design System (Problem Discovery)',
				assignedReading: {
					moduleCode: 'Project 10 Spec',
					title: 'Character Design System (Problem Discovery)',
					keyMentalModel: 'Clients say it looks outdated when the real problem is positioning.',
					referenceDoc: 'Directing the Machine.md #Project 10 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 16,
					dayNum: 6,
					readTitle: 'Character Design System (Problem Discovery)',
					readModule: 'Project 10 Spec',
					drillTitle: 'Character Design System (Problem Discovery) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 7 — Project 10: Character Design System (Problem Discovery).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 7 — Project 10: Character Design System (Problem Discovery) · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p10',
					primaryModId: 'm1'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Month 7 — Project 10: Character Design System (Problem Discovery)',
				assignedReading: {
					moduleCode: 'Project 10 Spec',
					title: 'Character Design System (Problem Discovery)',
					keyMentalModel: 'Clients say it looks outdated when the real problem is positioning.',
					referenceDoc: 'Directing the Machine.md #Project 10 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 16,
					dayNum: 7,
					readTitle: 'Character Design System (Problem Discovery)',
					readModule: 'Project 10 Spec',
					drillTitle: 'Character Design System (Problem Discovery) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 7 — Project 10: Character Design System (Problem Discovery).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 7 — Project 10: Character Design System (Problem Discovery) · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p10',
					primaryModId: 'm1'
				})
			}
		]
	},
	{
		weekNumber: 17,
		title: 'Month 8 — Project 11: Editorial Series (Self-Originated Practice)',
		partNumber: 11,
		phaseName: 'Month 8',
		masteryLayer: 3,
		layerName: 'Agency',
		governingQuestion: 'Can I originate, execute, and sustain a 3-part investigative essay series with zero scaffolding?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p11',
		weeklyDeliverables: [
			'Unassigned Problem Record from unstructured observation',
			'Series Brief & Arc Architecture (3 interconnected essays)',
			'3 Polished Editorial Essays (1,200–1,800 words each)',
			'External Calibration Audit with 2+ outside readers',
			'30-entry Decision Log'
		],
		masteryGateCriteria: [
			'Original, consequential inquiry with genuine stakes',
			'Impeccable structural pacing across all 3 installments',
			'Demonstrates mature self-direction without external prompts'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Month 8 — Project 11: Editorial Series (Self-Originated Practice)',
				assignedReading: {
					moduleCode: 'Project 11 Spec',
					title: 'Editorial Series (Self-Originated Practice)',
					keyMentalModel: 'You wake up. There is no brief, no theme, no category. You originate it all.',
					referenceDoc: 'Directing the Machine.md #Project 11 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 17,
					dayNum: 1,
					readTitle: 'Editorial Series (Self-Originated Practice)',
					readModule: 'Project 11 Spec',
					drillTitle: 'Editorial Series (Self-Originated Practice) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 8 — Project 11: Editorial Series (Self-Originated Practice).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 8 — Project 11: Editorial Series (Self-Originated Practice) · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p11',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Month 8 — Project 11: Editorial Series (Self-Originated Practice)',
				assignedReading: {
					moduleCode: 'Project 11 Spec',
					title: 'Editorial Series (Self-Originated Practice)',
					keyMentalModel: 'You wake up. There is no brief, no theme, no category. You originate it all.',
					referenceDoc: 'Directing the Machine.md #Project 11 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 17,
					dayNum: 2,
					readTitle: 'Editorial Series (Self-Originated Practice)',
					readModule: 'Project 11 Spec',
					drillTitle: 'Editorial Series (Self-Originated Practice) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 8 — Project 11: Editorial Series (Self-Originated Practice).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 8 — Project 11: Editorial Series (Self-Originated Practice) · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p11',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Month 8 — Project 11: Editorial Series (Self-Originated Practice)',
				assignedReading: {
					moduleCode: 'Project 11 Spec',
					title: 'Editorial Series (Self-Originated Practice)',
					keyMentalModel: 'You wake up. There is no brief, no theme, no category. You originate it all.',
					referenceDoc: 'Directing the Machine.md #Project 11 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 17,
					dayNum: 3,
					readTitle: 'Editorial Series (Self-Originated Practice)',
					readModule: 'Project 11 Spec',
					drillTitle: 'Editorial Series (Self-Originated Practice) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 8 — Project 11: Editorial Series (Self-Originated Practice).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 8 — Project 11: Editorial Series (Self-Originated Practice) · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p11',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Month 8 — Project 11: Editorial Series (Self-Originated Practice)',
				assignedReading: {
					moduleCode: 'Project 11 Spec',
					title: 'Editorial Series (Self-Originated Practice)',
					keyMentalModel: 'You wake up. There is no brief, no theme, no category. You originate it all.',
					referenceDoc: 'Directing the Machine.md #Project 11 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 17,
					dayNum: 4,
					readTitle: 'Editorial Series (Self-Originated Practice)',
					readModule: 'Project 11 Spec',
					drillTitle: 'Editorial Series (Self-Originated Practice) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 8 — Project 11: Editorial Series (Self-Originated Practice).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 8 — Project 11: Editorial Series (Self-Originated Practice) · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p11',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Month 8 — Project 11: Editorial Series (Self-Originated Practice)',
				assignedReading: {
					moduleCode: 'Project 11 Spec',
					title: 'Editorial Series (Self-Originated Practice)',
					keyMentalModel: 'You wake up. There is no brief, no theme, no category. You originate it all.',
					referenceDoc: 'Directing the Machine.md #Project 11 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 17,
					dayNum: 5,
					readTitle: 'Editorial Series (Self-Originated Practice)',
					readModule: 'Project 11 Spec',
					drillTitle: 'Editorial Series (Self-Originated Practice) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 8 — Project 11: Editorial Series (Self-Originated Practice).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 8 — Project 11: Editorial Series (Self-Originated Practice) · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p11',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Month 8 — Project 11: Editorial Series (Self-Originated Practice)',
				assignedReading: {
					moduleCode: 'Project 11 Spec',
					title: 'Editorial Series (Self-Originated Practice)',
					keyMentalModel: 'You wake up. There is no brief, no theme, no category. You originate it all.',
					referenceDoc: 'Directing the Machine.md #Project 11 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 17,
					dayNum: 6,
					readTitle: 'Editorial Series (Self-Originated Practice)',
					readModule: 'Project 11 Spec',
					drillTitle: 'Editorial Series (Self-Originated Practice) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 8 — Project 11: Editorial Series (Self-Originated Practice).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 8 — Project 11: Editorial Series (Self-Originated Practice) · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p11',
					primaryModId: 'm6'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Month 8 — Project 11: Editorial Series (Self-Originated Practice)',
				assignedReading: {
					moduleCode: 'Project 11 Spec',
					title: 'Editorial Series (Self-Originated Practice)',
					keyMentalModel: 'You wake up. There is no brief, no theme, no category. You originate it all.',
					referenceDoc: 'Directing the Machine.md #Project 11 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 17,
					dayNum: 7,
					readTitle: 'Editorial Series (Self-Originated Practice)',
					readModule: 'Project 11 Spec',
					drillTitle: 'Editorial Series (Self-Originated Practice) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 8 — Project 11: Editorial Series (Self-Originated Practice).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 8 — Project 11: Editorial Series (Self-Originated Practice) · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p11',
					primaryModId: 'm6'
				})
			}
		]
	},
	{
		weekNumber: 18,
		title: 'Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone)',
		partNumber: 12,
		phaseName: 'Month 9',
		masteryLayer: 3,
		layerName: 'Agency',
		governingQuestion: 'Can I originate a complete integrated creative package from real-world conditions only?',
		scaffolding: {
			supplied: ['Practical conditions only'],
			removed: ['All app scaffolds removed']
		},
		activeProjectId: 'p12',
		weeklyDeliverables: [
			'Master Strategic Brief for visual and textual package',
			'Integrated Creative Package delivered (Key visual + Campaign suite + Editorial/script)',
			'Dual Production Pipelines documented',
			'40-entry Consequential Decision Ledger',
			'10-Piece Blind Position Audit',
			'How I Decided What to Make Capstone Retrospective Essay',
			'Course Exit Verification'
		],
		masteryGateCriteria: [
			'Total creative agency proven from real-world conditions only',
			'Singular authorial position uniting visual and written craft',
			'Work is defensible, reproducible, and commercially or culturally consequential'
		],
		days: [
			{
				dayNumber: 1,
				dayName: 'Monday',
				focus: 'Monday Session · Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone)',
				assignedReading: {
					moduleCode: 'Project 12 Spec',
					title: 'Integrated Creative Package (Blank-Sheet Capstone)',
					keyMentalModel: 'Originate the entire project from real-world conditions only — including the problem.',
					referenceDoc: 'Directing the Machine.md #Project 12 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 18,
					dayNum: 1,
					readTitle: 'Integrated Creative Package (Blank-Sheet Capstone)',
					readModule: 'Project 12 Spec',
					drillTitle: 'Integrated Creative Package (Blank-Sheet Capstone) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone) · Day 1 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p12',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 2,
				dayName: 'Tuesday',
				focus: 'Tuesday Session · Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone)',
				assignedReading: {
					moduleCode: 'Project 12 Spec',
					title: 'Integrated Creative Package (Blank-Sheet Capstone)',
					keyMentalModel: 'Originate the entire project from real-world conditions only — including the problem.',
					referenceDoc: 'Directing the Machine.md #Project 12 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 18,
					dayNum: 2,
					readTitle: 'Integrated Creative Package (Blank-Sheet Capstone)',
					readModule: 'Project 12 Spec',
					drillTitle: 'Integrated Creative Package (Blank-Sheet Capstone) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone) · Day 2 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p12',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 3,
				dayName: 'Wednesday',
				focus: 'Wednesday Session · Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone)',
				assignedReading: {
					moduleCode: 'Project 12 Spec',
					title: 'Integrated Creative Package (Blank-Sheet Capstone)',
					keyMentalModel: 'Originate the entire project from real-world conditions only — including the problem.',
					referenceDoc: 'Directing the Machine.md #Project 12 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 18,
					dayNum: 3,
					readTitle: 'Integrated Creative Package (Blank-Sheet Capstone)',
					readModule: 'Project 12 Spec',
					drillTitle: 'Integrated Creative Package (Blank-Sheet Capstone) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone) · Day 3 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p12',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 4,
				dayName: 'Thursday',
				focus: 'Thursday Session · Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone)',
				assignedReading: {
					moduleCode: 'Project 12 Spec',
					title: 'Integrated Creative Package (Blank-Sheet Capstone)',
					keyMentalModel: 'Originate the entire project from real-world conditions only — including the problem.',
					referenceDoc: 'Directing the Machine.md #Project 12 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 18,
					dayNum: 4,
					readTitle: 'Integrated Creative Package (Blank-Sheet Capstone)',
					readModule: 'Project 12 Spec',
					drillTitle: 'Integrated Creative Package (Blank-Sheet Capstone) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone) · Day 4 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p12',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 5,
				dayName: 'Friday',
				focus: 'Friday Session · Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone)',
				assignedReading: {
					moduleCode: 'Project 12 Spec',
					title: 'Integrated Creative Package (Blank-Sheet Capstone)',
					keyMentalModel: 'Originate the entire project from real-world conditions only — including the problem.',
					referenceDoc: 'Directing the Machine.md #Project 12 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 18,
					dayNum: 5,
					readTitle: 'Integrated Creative Package (Blank-Sheet Capstone)',
					readModule: 'Project 12 Spec',
					drillTitle: 'Integrated Creative Package (Blank-Sheet Capstone) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone) · Day 5 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p12',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 6,
				dayName: 'Saturday',
				focus: 'Saturday Session · Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone)',
				assignedReading: {
					moduleCode: 'Project 12 Spec',
					title: 'Integrated Creative Package (Blank-Sheet Capstone)',
					keyMentalModel: 'Originate the entire project from real-world conditions only — including the problem.',
					referenceDoc: 'Directing the Machine.md #Project 12 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 18,
					dayNum: 6,
					readTitle: 'Integrated Creative Package (Blank-Sheet Capstone)',
					readModule: 'Project 12 Spec',
					drillTitle: 'Integrated Creative Package (Blank-Sheet Capstone) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone) · Day 6 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p12',
					primaryModId: 'm7'
				})
			},
			{
				dayNumber: 7,
				dayName: 'Sunday',
				focus: 'Sunday Session · Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone)',
				assignedReading: {
					moduleCode: 'Project 12 Spec',
					title: 'Integrated Creative Package (Blank-Sheet Capstone)',
					keyMentalModel: 'Originate the entire project from real-world conditions only — including the problem.',
					referenceDoc: 'Directing the Machine.md #Project 12 Spec'
				},
				tasks: makeDayTasks({
					weekNum: 18,
					dayNum: 7,
					readTitle: 'Integrated Creative Package (Blank-Sheet Capstone)',
					readModule: 'Project 12 Spec',
					drillTitle: 'Integrated Creative Package (Blank-Sheet Capstone) Focus Drill',
					drillDesc: 'Deliberate micro-drill isolating core skill for Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone).',
					studyTitle: 'Craft Analysis & Decomposition',
					studyDesc: 'Perform craft analysis or close-reading connected to milestone.',
					projectMilestone: 'Month 9 — Project 12: Integrated Creative Package (Blank-Sheet Capstone) · Day 7 Execution',
					diagDesc: 'Top-down audit against binary acceptance criteria.',
					transferDesc: 'Unassisted transfer rep applying learning to unfamiliar context.',
					projectId: 'p12',
					primaryModId: 'm7'
				})
			}
		]
	}
];
