const isBrowser = typeof window !== 'undefined';
import type {
	IntensityPath,
	MasteryLayer,
	Quadrant,
	BaselineCompetency,
	CalibrationEntry,
	ProblemEntry,
	PracticeSession,
	DecisionEntry,
	Brief
} from '../schemas/course.schema';
import { analyzeCalibration } from '../engine/calibration-math';

const STORAGE_KEY = 'dtm_practice_store_v1';

export interface ScaffoldingState {
	exercise: boolean;
	ladder: boolean;
	template: boolean;
	category: boolean;
	situation: boolean;
}

export interface LearnerPreferences {
	fontFamily: 'sans' | 'dyslexic' | 'mono';
	fontSize: 'sm' | 'base' | 'lg' | 'xl';
	theme: 'dark' | 'light' | 'sepia' | 'midnight' | 'high-contrast';
	reducedMotion: boolean;
	focusMode: boolean; // Single-Task Horizon (ADHD / focus mode)
	plainLanguageHelp: boolean;
	soundEnabled: boolean;
	lineSpacing: 'normal' | 'relaxed' | 'loose';
}

export class PracticeEngine {
	// Learner Adaptability & Inclusivity Preferences
	learnerPreferences = $state<LearnerPreferences>({
		fontFamily: 'sans',
		fontSize: 'base',
		theme: 'dark',
		reducedMotion: false,
		focusMode: false,
		plainLanguageHelp: false,
		soundEnabled: false,
		lineSpacing: 'normal'
	});

	// Pacing & Onboarding (Appendix O)
	intensityPath = $state<IntensityPath>('full-time-12w');
	showDeepening = $state<boolean>(false);
	activePart = $state<number>(0); // 0 = Week 0, 1..6 = Parts I-VI, 7..12 = Months 4-9
	activeWeek = $state<number>(1); // 0 to 18
	activeDay = $state<number>(1); // 1 (Mon) to 7 (Sun)
	currentStepIndex = $state<number>(0); // 0..7 within today's daily 8-step routine

	// Guided Learning Pipeline State
	completedTaskIds = $state<string[]>([]);
	tomorrowFirstAction = $state<string>('');
	passedMasteryGates = $state<number[]>([]); // part numbers passed e.g. [0, 1, 2]

	contextualCompetencies = $state({
		collaboration: false,
		transmission: false,
		publicProcess: false,
		professionalPractice: true
	});

	// Baseline Diagnostic Scores (1–4)
	baseline = $state<BaselineCompetency[]>([
		{ id: 'prob', name: 'Problem-Finding', exercise: 'Identify 3 problems from 30m observation', score: 2, notes: '' },
		{ id: 'pos', name: 'Positionality', exercise: 'State standing to pursue one problem', score: 2, notes: '' },
		{ id: 'obs', name: 'Observation', exercise: 'Describe work with zero evaluative adjectives', score: 2, notes: '' },
		{ id: 'prem', name: 'Premise', exercise: 'Generate 3 premises with tension from 1 observation', score: 2, notes: '' },
		{ id: 'spec', name: 'Specification', exercise: 'Write 1-page checkable brief', score: 2, notes: '' },
		{ id: 'diag', name: 'Diagnosis', exercise: 'Diagnose highest unresolved problem', score: 2, notes: '' },
		{ id: 'cur', name: 'Curation', exercise: 'Rank 5 works using explicit criteria', score: 2, notes: '' },
		{ id: 'sys', name: 'Systems', exercise: 'Document repeatable workflow & variables', score: 2, notes: '' },
		{ id: 'pred', name: 'Prediction', exercise: 'Predict variable change with confidence %', score: 2, notes: '' },
		{ id: 'dir', name: 'Direction', exercise: 'Make & defend consequential decision', score: 2, notes: '' },
		{ id: 'auth', name: 'Authorship', exercise: 'State what you repeatedly pursue and refuse', score: 2, notes: '' },
		{ id: 'trans', name: 'Transfer', exercise: 'Apply skill to an unfamiliar medium', score: 1, notes: '' }
	]);

	// Core Logs (Enforces 10m cap in UI)
	problems = $state<ProblemEntry[]>([]);
	calibrations = $state<CalibrationEntry[]>([]);
	practiceSessions = $state<PracticeSession[]>([]);
	decisions = $state<DecisionEntry[]>([]);
	briefs = $state<Brief[]>([]);

	// 1-Line Protected Logs
	nonInstrumentalLines = $state<{ id: string; date: string; line: string }[]>([]);
	playLines = $state<{ id: string; date: string; line: string }[]>([]);

	// Scaffolding Removal Derived State (Layers 1 -> 2 -> 3)
	scaffolding = $derived.by<ScaffoldingState>(() => {
		if (this.activePart <= 1) {
			return { exercise: true, ladder: true, template: true, category: true, situation: true };
		}
		if (this.activePart === 2) {
			// Part II: Diagnostic Ladder removed
			return { exercise: true, ladder: false, template: true, category: true, situation: true };
		}
		if (this.activePart === 3) {
			// Part III: Brief template removed
			return { exercise: true, ladder: false, template: false, category: true, situation: true };
		}
		if (this.activePart === 4) {
			// Part IV: Exercise removed
			return { exercise: false, ladder: false, template: false, category: true, situation: true };
		}
		if (this.activePart === 5) {
			// Part V: Category removed
			return { exercise: false, ladder: false, template: false, category: false, situation: true };
		}
		// Part VI & Months 4–9: Everything removed down to Blank Sheet Canvas
		return { exercise: false, ladder: false, template: false, category: false, situation: false };
	});

	// Current Mastery Layer Target
	masteryLayer = $derived.by<MasteryLayer>(() => {
		if (this.activePart <= 3) return 1;
		if (this.activePart <= 5) return 2;
		return 3;
	});

	// Calibration Telemetry & Narrowness Detector
	calibrationTelemetry = $derived.by(() => {
		return analyzeCalibration(this.calibrations);
	});

	// Automated Log Decay Detector (Failure Type 4)
	logDecayAlerts = $derived.by(() => {
		const alerts: string[] = [];

		// Check repetitive calibration confidence
		const recentCal = this.calibrations.slice(-4);
		if (recentCal.length >= 4 && new Set(recentCal.map((c) => c.confidencePct)).size === 1) {
			alerts.push(
				'Calibration Log Decay: Your last 4 predictions used the exact same confidence score. Avoid habitual default numbers.'
			);
		}

		// Check repetitive problem stakes
		const recentProbs = this.problems.slice(-3);
		if (recentProbs.length >= 3 && new Set(recentProbs.map((p) => p.stakes.trim().toLowerCase())).size === 1) {
			alerts.push(
				'Problem-Finding Log Decay: "Stakes" field is repeating verbatim. Force concrete human or formal stakes.'
			);
		}

		// Check practice reps
		const recentPractice = this.practiceSessions.slice(-4);
		if (recentPractice.length >= 4 && new Set(recentPractice.map((p) => p.microSkill.trim())).size === 1) {
			alerts.push(
				'Practice Drill Stagnation: The same micro-skill was drilled 4 sessions in a row. Interleave or adjust difficulty.'
			);
		}

		return alerts;
	});

	constructor() {
		if (isBrowser) {
			this.loadFromStorage();
		}
	}

	// Two-Axis Assessment Matrix Classifier
	classifyQuadrant(outcomeScore: number, decisionScore: number): Quadrant {
		const strongOutcome = outcomeScore >= 3;
		const strongDecision = decisionScore >= 3;
		if (strongOutcome && strongDecision) return 'mastery';
		if (!strongOutcome && strongDecision) return 'learning-in-progress';
		if (strongOutcome && !strongDecision) return 'lucky-unstable';
		return 'failure';
	}

	// Pipeline Operations
	toggleTask(taskId: string) {
		if (this.completedTaskIds.includes(taskId)) {
			this.completedTaskIds = this.completedTaskIds.filter((id) => id !== taskId);
		} else {
			this.completedTaskIds.push(taskId);
		}
		this.saveToStorage();
	}

	isTaskCompleted(taskId: string): boolean {
		return this.completedTaskIds.includes(taskId);
	}

	setTomorrowAction(action: string) {
		this.tomorrowFirstAction = action;
		this.saveToStorage();
	}

	passMasteryGate(partNumber: number) {
		if (!this.passedMasteryGates.includes(partNumber)) {
			this.passedMasteryGates.push(partNumber);
			this.saveToStorage();
		}
	}

	// Baseline Diagnostic Synthesis & Continuity Analysis
	getBaselineSynthesis() {
		const total = this.baseline.length;
		const sum = this.baseline.reduce((acc, b) => acc + b.score, 0);
		const avgScore = total > 0 ? Number((sum / total).toFixed(1)) : 0;
		const auditedCount = this.baseline.filter((b) => b.notes.trim().length > 0 || b.score !== 2).length;

		// Group by Layer
		// Layer 1: prob, pos, obs, prem (Foundations & Observation)
		// Layer 2: spec, diag, cur, sys, pred (Systems & Calibration)
		// Layer 3: dir, auth, trans (Agency & Direction)
		const layer1Ids = ['prob', 'pos', 'obs', 'prem'];
		const layer2Ids = ['spec', 'diag', 'cur', 'sys', 'pred'];
		const layer3Ids = ['dir', 'auth', 'trans'];

		const layer1Items = this.baseline.filter((b) => layer1Ids.includes(b.id));
		const layer2Items = this.baseline.filter((b) => layer2Ids.includes(b.id));
		const layer3Items = this.baseline.filter((b) => layer3Ids.includes(b.id));

		const avgLayer1 = layer1Items.length > 0
			? Number((layer1Items.reduce((acc, b) => acc + b.score, 0) / layer1Items.length).toFixed(1))
			: 0;
		const avgLayer2 = layer2Items.length > 0
			? Number((layer2Items.reduce((acc, b) => acc + b.score, 0) / layer2Items.length).toFixed(1))
			: 0;
		const avgLayer3 = layer3Items.length > 0
			? Number((layer3Items.reduce((acc, b) => acc + b.score, 0) / layer3Items.length).toFixed(1))
			: 0;

		// Vulnerabilities (Scores 1 & 2) and Strengths (Scores 3 & 4)
		const vulnerabilities = [...this.baseline]
			.filter((b) => b.score <= 2)
			.sort((a, b) => a.score - b.score);

		const strengths = [...this.baseline]
			.filter((b) => b.score >= 3)
			.sort((a, b) => b.score - a.score);

		// Primary bottleneck: lowest scored competency in Layer 1 or overall
		const primaryBottleneck = vulnerabilities[0] || this.baseline[0];

		// Readiness assessment summary
		let readinessLevel: 'emerging' | 'developing' | 'grounded' = 'emerging';
		if (avgScore >= 3.0 && avgLayer1 >= 2.8) {
			readinessLevel = 'grounded';
		} else if (avgScore >= 2.2) {
			readinessLevel = 'developing';
		}

		return {
			avgScore,
			auditedCount,
			total,
			avgLayer1,
			avgLayer2,
			avgLayer3,
			vulnerabilities,
			strengths,
			primaryBottleneck,
			readinessLevel,
			isBaselineLocked: this.passedMasteryGates.includes(0)
		};
	}

	// Lock Baseline & Continuity Bridge to Week 1
	completeBaselineAndStartWeek1() {
		this.passMasteryGate(0); // Mark Week 0 baseline passed
		this.activeWeek = 1;
		this.activePart = 1;
		this.currentStepIndex = 0; // Read step for Monday

		// If no opening hook is set, generate an intentional one from their biggest diagnostic gap
		const synthesis = this.getBaselineSynthesis();
		if (!this.tomorrowFirstAction.trim()) {
			this.tomorrowFirstAction = `Part I Day 1 Focus: Address ${synthesis.primaryBottleneck.name} (Baseline: ${synthesis.primaryBottleneck.score}/4) with the Zero-Adjective Observation Linter in M2.`;
		}
		this.saveToStorage();
	}

	// Two-Axis Evaluation Helper
	evaluateProjectSession(params: {
		projectId: string;
		projectName: string;
		outcomeQuality: number;
		decisionQuality: number;
		intention: string;
		reflectionNotes: string;
	}) {
		const session: PracticeSession = {
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			microSkill: `${params.projectName} (${params.projectId})`,
			successCriterion: params.intention,
			repsCompleted: 10,
			successfulReps: Math.round((params.outcomeQuality / 4) * 10),
			difficultyLevel: Math.min(5, Math.max(1, params.decisionQuality)),
			errorsObserved: params.outcomeQuality < 3 ? 'Outcome below mastery threshold' : 'None critical',
			correctionApplied: params.reflectionNotes,
			resultAfterCorrection: params.outcomeQuality >= 3 ? 'Criterion satisfied' : 'Further iteration required',
			nextSessionFocus: this.tomorrowFirstAction || 'Continue next project milestone'
		};
		this.practiceSessions.unshift(session);
		this.saveToStorage();
	}

	// Dynamic Persistence (localStorage)
	saveToStorage() {
		if (!isBrowser) return;
		try {
			const payload = {
				learnerPreferences: this.learnerPreferences,
				intensityPath: this.intensityPath,
				showDeepening: this.showDeepening,
				activePart: this.activePart,
				activeWeek: this.activeWeek,
				activeDay: this.activeDay,
				currentStepIndex: this.currentStepIndex,
				completedTaskIds: this.completedTaskIds,
				tomorrowFirstAction: this.tomorrowFirstAction,
				passedMasteryGates: this.passedMasteryGates,
				contextualCompetencies: this.contextualCompetencies,
				baseline: this.baseline,
				problems: this.problems,
				calibrations: this.calibrations,
				practiceSessions: this.practiceSessions,
				decisions: this.decisions,
				briefs: this.briefs,
				nonInstrumentalLines: this.nonInstrumentalLines,
				playLines: this.playLines
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch (e) {
			console.error('Failed to save to localStorage', e);
		}
	}

	loadFromStorage() {
		if (!isBrowser) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const data = JSON.parse(raw);
			if (data.learnerPreferences) {
				this.learnerPreferences = { ...this.learnerPreferences, ...data.learnerPreferences };
			}
			if (data.intensityPath) this.intensityPath = data.intensityPath;
			if (typeof data.showDeepening === 'boolean') this.showDeepening = data.showDeepening;
			if (typeof data.activePart === 'number') this.activePart = data.activePart;
			if (typeof data.activeWeek === 'number') this.activeWeek = data.activeWeek;
			if (typeof data.activeDay === 'number') this.activeDay = data.activeDay;
			if (typeof data.currentStepIndex === 'number') this.currentStepIndex = data.currentStepIndex;
			if (Array.isArray(data.completedTaskIds)) this.completedTaskIds = data.completedTaskIds;
			if (typeof data.tomorrowFirstAction === 'string') this.tomorrowFirstAction = data.tomorrowFirstAction;
			if (Array.isArray(data.passedMasteryGates)) this.passedMasteryGates = data.passedMasteryGates;
			if (data.contextualCompetencies) this.contextualCompetencies = data.contextualCompetencies;
			if (data.baseline) this.baseline = data.baseline;
			if (data.problems) this.problems = data.problems;
			if (data.calibrations) this.calibrations = data.calibrations;
			if (data.practiceSessions) this.practiceSessions = data.practiceSessions;
			if (data.decisions) this.decisions = data.decisions;
			if (data.briefs) this.briefs = data.briefs;
			if (data.nonInstrumentalLines) this.nonInstrumentalLines = data.nonInstrumentalLines;
			if (data.playLines) this.playLines = data.playLines;
		} catch (e) {
			console.error('Failed to load from localStorage', e);
		}
	}
}

export const practiceStore = new PracticeEngine();
