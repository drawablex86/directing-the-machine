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

export class PracticeEngine {
	// Pacing & Onboarding (Appendix O)
	intensityPath = $state<IntensityPath>('full-time-12w');
	showDeepening = $state<boolean>(false);
	activePart = $state<number>(0); // 0 = Week 0, 1..6 = Parts I-VI, 7..12 = Months 4-9
	currentStepIndex = $state<number>(0); // Weekly practice loop step

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

	saveToStorage() {
		if (!isBrowser) return;
		try {
			const payload = {
				intensityPath: this.intensityPath,
				showDeepening: this.showDeepening,
				activePart: this.activePart,
				currentStepIndex: this.currentStepIndex,
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
			if (data.intensityPath) this.intensityPath = data.intensityPath;
			if (typeof data.showDeepening === 'boolean') this.showDeepening = data.showDeepening;
			if (typeof data.activePart === 'number') this.activePart = data.activePart;
			if (typeof data.currentStepIndex === 'number') this.currentStepIndex = data.currentStepIndex;
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
