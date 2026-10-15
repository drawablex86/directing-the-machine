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
	Brief,
	ProjectProgress,
	ProjectStatus,
	TwoAxisEvaluation
} from '../schemas/course.schema';
import { analyzeCalibration } from '../engine/calibration-math';
import type {
	ByokSettings,
	InferenceProviderId,
	ProviderConfig,
	ModelOption
} from '../types/inference';

export const DEFAULT_BYOK_SETTINGS: ByokSettings = {
	activeProvider: 'openrouter',
	providers: {
		openrouter: {
			apiKey: '',
			baseUrl: 'https://openrouter.ai/api/v1',
			selectedModel: 'anthropic/claude-3.5-sonnet',
			availableModels: [
				{ id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
				{ id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet' },
				{ id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
				{ id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
				{ id: 'openai/gpt-4o', name: 'GPT-4o' },
				{ id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' },
				{ id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' }
			]
		},
		openai: {
			apiKey: '',
			baseUrl: 'https://api.openai.com/v1',
			selectedModel: 'gpt-4o',
			availableModels: [
				{ id: 'gpt-4o', name: 'GPT-4o' },
				{ id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
				{ id: 'o3-mini', name: 'o3-mini' },
				{ id: 'o1', name: 'o1' }
			]
		},
		google: {
			apiKey: '',
			baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
			selectedModel: 'gemini-2.5-flash',
			availableModels: [
				{ id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
				{ id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
				{ id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' }
			]
		},
		anthropic: {
			apiKey: '',
			baseUrl: 'https://api.anthropic.com/v1',
			selectedModel: 'claude-3-7-sonnet-20250219',
			availableModels: [
				{ id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
				{ id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
				{ id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
				{ id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' }
			]
		},
		custom: {
			apiKey: '',
			baseUrl: 'http://localhost:11434/v1',
			selectedModel: 'llama3.2',
			availableModels: [
				{ id: 'llama3.2', name: 'Llama 3.2' },
				{ id: 'llama3.3:70b', name: 'Llama 3.3 70B' },
				{ id: 'mistral', name: 'Mistral' },
				{ id: 'deepseek-r1', name: 'DeepSeek R1' }
			]
		}
	}
};

// Drill session tracking — one entry per completed 60–90m drill block
export interface DrillSession {
	id: string;
	date: string;
	drillId: string;         // e.g. 'zero-adjective-linter'
	drillTitle: string;
	weekNum: number;
	dayNum: number;
	totalReps: number;
	passedReps: number;
	successRate: number;     // 0.0–1.0
	discoveryNote: string;   // "What did I discover about the mechanism?"
	difficultyAdjustment: 'increased' | 'maintained' | 'reduced' | 'none';
	durationMinutes: number;
	reps?: RepResult[];
}

// Individual rep result within a drill session
export interface RepResult {
	repNumber: number;
	passed: boolean;
	failNote: string;        // brief note on what broke
}

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
	theme: 'dark' | 'light';
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

	// BYOK Inference Engine Configuration (Local-First)
	byokSettings = $state<ByokSettings>(JSON.parse(JSON.stringify(DEFAULT_BYOK_SETTINGS)));

	// Pacing & Onboarding (Appendix O)
	intensityPath = $state<IntensityPath>('full-time-12w');
	showDeepening = $state<boolean>(false);
	activePart = $state<number>(0); // 0 = Week 0, 1..6 = Parts I-VI, 7..12 = Months 4-9
	activeWeek = $state<number>(1); // 0 to 18
	activeDay = $state<number>(1); // 1 (Mon) to 7 (Sun)
	currentStepIndex = $state<number>(0); // 0..7 within today's daily 8-step routine

	// Guided Learning Pipeline State
	completedTaskIds = $state<string[]>([]);
	completedReadingCodes = $state<string[]>([]);
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
	drillSessions = $state<DrillSession[]>([]); // NEW: rep-level drill tracking
	decisions = $state<DecisionEntry[]>([]);
	briefs = $state<Brief[]>([]);
	projectProgress = $state<Record<string, ProjectProgress>>({});

	// 1-Line Protected Logs
	nonInstrumentalLines = $state<{ id: string; date: string; line: string }[]>([]);
	playLines = $state<{ id: string; date: string; line: string }[]>([]);

	// Universal Help Modal & Knowledge Base State
	isHelpModalOpen = $state<boolean>(false);
	activeHelpTermId = $state<string | null>(null);
	helpSearchQuery = $state<string>('');
	selectedHelpCategory = $state<string>('all');

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

	// Theme Management
	setTheme(theme: 'dark' | 'light') {
		this.learnerPreferences.theme = theme;
		if (isBrowser) {
			document.documentElement.classList.remove('theme-dark', 'theme-light');
			document.documentElement.classList.add(`theme-${theme}`);
			document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
		}
		this.saveToStorage();
	}

	toggleTheme() {
		this.setTheme(this.learnerPreferences.theme === 'dark' ? 'light' : 'dark');
	}

	// BYOK Inference Helpers
	setByokProvider(provider: InferenceProviderId) {
		this.byokSettings.activeProvider = provider;
		this.saveToStorage();
	}

	updateByokConfig(provider: InferenceProviderId, patch: Partial<ProviderConfig>) {
		if (!this.byokSettings.providers[provider]) return;
		this.byokSettings.providers[provider] = {
			...this.byokSettings.providers[provider],
			...patch
		};
		this.saveToStorage();
	}

	clearByokKey(provider: InferenceProviderId) {
		if (!this.byokSettings.providers[provider]) return;
		this.byokSettings.providers[provider].apiKey = '';
		this.saveToStorage();
	}

	hasActiveApiKey(): boolean {
		const active = this.byokSettings.activeProvider;
		if (active === 'custom') return true;
		return Boolean(this.byokSettings.providers[active]?.apiKey?.trim());
	}

	// Universal Help Modal Operations
	openHelp(termIdOrQuery?: string, category?: string) {
		if (termIdOrQuery) {
			// If it matches a known slug or short id, focus on that term
			this.activeHelpTermId = termIdOrQuery;
			this.helpSearchQuery = '';
		}
		if (category) {
			this.selectedHelpCategory = category;
		}
		this.isHelpModalOpen = true;
	}

	searchHelp(query: string) {
		this.helpSearchQuery = query;
		this.activeHelpTermId = null;
		this.isHelpModalOpen = true;
	}

	closeHelp() {
		this.isHelpModalOpen = false;
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

	toggleReadingCompleted(code: string): boolean {
		if (!code) return false;
		const clean = code.trim().toLowerCase();
		const idx = this.completedReadingCodes.findIndex((c) => c.toLowerCase() === clean);
		let isNowComplete = false;
		if (idx >= 0) {
			this.completedReadingCodes.splice(idx, 1);
			isNowComplete = false;
		} else {
			this.completedReadingCodes.push(code.trim());
			isNowComplete = true;
		}
		this.saveToStorage();
		return isNowComplete;
	}

	isReadingCompleted(code: string): boolean {
		if (!code) return false;
		const clean = code.trim().toLowerCase();
		return this.completedReadingCodes.some((c) => c.toLowerCase() === clean);
	}

	// Save a completed drill session (from Drill Runner UI)
	saveDrillSession(session: Omit<DrillSession, 'id' | 'date'>) {
		const newSession: DrillSession = {
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			...session
		};
		this.drillSessions.unshift(newSession);
		this.saveToStorage();
		return newSession;
	}

	// Get recent drill sessions for a specific drill (for progress context)
	getRecentDrillSessions(drillId: string, limit = 5): DrillSession[] {
		return this.drillSessions
			.filter(s => s.drillId === drillId)
			.slice(0, limit);
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

	saveBrief(briefData: Omit<Brief, 'id' | 'date'>): Brief {
		const newBrief: Brief = {
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			...briefData
		};
		this.briefs.unshift(newBrief);
		this.saveToStorage();
		return newBrief;
	}

	saveDecision(decisionData: Omit<DecisionEntry, 'id' | 'date'>): DecisionEntry {
		const newDecision: DecisionEntry = {
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			...decisionData
		};
		this.decisions.unshift(newDecision);
		this.saveToStorage();
		return newDecision;
	}

	getProjectProgress(projectId: string): ProjectProgress {
		if (!this.projectProgress[projectId]) {
			this.projectProgress[projectId] = {
				projectId,
				status: 'not-started',
				completedDeliverableNames: [],
				lastUpdated: new Date().toISOString().slice(0, 10)
			};
		}
		return this.projectProgress[projectId];
	}

	toggleProjectDeliverable(projectId: string, deliverableName: string) {
		const prog = this.getProjectProgress(projectId);
		if (prog.completedDeliverableNames.includes(deliverableName)) {
			prog.completedDeliverableNames = prog.completedDeliverableNames.filter((d) => d !== deliverableName);
		} else {
			prog.completedDeliverableNames.push(deliverableName);
			if (prog.status === 'not-started') {
				prog.status = 'in-progress';
			}
		}
		prog.lastUpdated = new Date().toISOString().slice(0, 10);
		this.saveToStorage();
	}

	setProjectStatus(projectId: string, status: ProjectStatus) {
		const prog = this.getProjectProgress(projectId);
		prog.status = status;
		prog.lastUpdated = new Date().toISOString().slice(0, 10);
		this.saveToStorage();
	}

	saveProjectEvaluation(projectId: string, outcomeScore: number, decisionScore: number, notes: string) {
		const prog = this.getProjectProgress(projectId);
		const quadrant = this.classifyQuadrant(outcomeScore, decisionScore);
		prog.twoAxisEvaluation = {
			outcomeScore,
			decisionScore,
			quadrant,
			date: new Date().toISOString().slice(0, 10),
			notes
		};
		prog.lastUpdated = new Date().toISOString().slice(0, 10);
		this.saveToStorage();
	}

	setProjectArtifactUrl(projectId: string, url: string) {
		const prog = this.getProjectProgress(projectId);
		prog.repositoryOrArtifactUrl = url;
		prog.lastUpdated = new Date().toISOString().slice(0, 10);
		this.saveToStorage();
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

	// BYOK Status Helpers
	get isByokConfigured(): boolean {
		const active = this.byokSettings.activeProvider;
		const config = this.byokSettings.providers[active];
		if (!config) return false;
		if (active === 'custom') return true;
		return Boolean(config.apiKey && config.apiKey.trim().length > 0);
	}

	get activeModelName(): string {
		const active = this.byokSettings.activeProvider;
		const config = this.byokSettings.providers[active];
		return config?.selectedModel || 'Default Model';
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
				completedReadingCodes: this.completedReadingCodes,
				tomorrowFirstAction: this.tomorrowFirstAction,
				passedMasteryGates: this.passedMasteryGates,
				contextualCompetencies: this.contextualCompetencies,
				baseline: this.baseline,
				problems: this.problems,
				calibrations: this.calibrations,
				practiceSessions: this.practiceSessions,
				drillSessions: this.drillSessions,
				decisions: this.decisions,
				briefs: this.briefs,
				projectProgress: this.projectProgress,
				nonInstrumentalLines: this.nonInstrumentalLines,
				playLines: this.playLines,
				byokSettings: this.byokSettings
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
				const theme = data.learnerPreferences.theme === 'light' || data.learnerPreferences.theme === 'sepia' ? 'light' : 'dark';
				this.learnerPreferences = { ...this.learnerPreferences, ...data.learnerPreferences, theme };
				if (isBrowser) {
					document.documentElement.classList.remove('theme-dark', 'theme-light');
					document.documentElement.classList.add(`theme-${theme}`);
					document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
				}
			}
			if (data.byokSettings && typeof data.byokSettings === 'object') {
				const activeProvider = data.byokSettings.activeProvider || 'openrouter';
				const providers = { ...JSON.parse(JSON.stringify(DEFAULT_BYOK_SETTINGS.providers)) };
				if (data.byokSettings.providers && typeof data.byokSettings.providers === 'object') {
					for (const p of Object.keys(providers) as InferenceProviderId[]) {
						if (data.byokSettings.providers[p]) {
							providers[p] = {
								...providers[p],
								...data.byokSettings.providers[p]
							};
						}
					}
				}
				this.byokSettings = { activeProvider, providers };
			}
			if (data.intensityPath) this.intensityPath = data.intensityPath;
			if (typeof data.showDeepening === 'boolean') this.showDeepening = data.showDeepening;
			if (typeof data.activePart === 'number') this.activePart = data.activePart;
			if (typeof data.activeWeek === 'number') this.activeWeek = data.activeWeek;
			if (typeof data.activeDay === 'number') this.activeDay = data.activeDay;
			if (typeof data.currentStepIndex === 'number') this.currentStepIndex = data.currentStepIndex;
			if (Array.isArray(data.completedTaskIds)) this.completedTaskIds = data.completedTaskIds;
			if (Array.isArray(data.completedReadingCodes)) this.completedReadingCodes = data.completedReadingCodes;
			if (typeof data.tomorrowFirstAction === 'string') this.tomorrowFirstAction = data.tomorrowFirstAction;
			if (Array.isArray(data.passedMasteryGates)) this.passedMasteryGates = data.passedMasteryGates;
			if (data.contextualCompetencies) this.contextualCompetencies = data.contextualCompetencies;
			if (data.baseline) this.baseline = data.baseline;
			if (data.problems) this.problems = data.problems;
			if (data.calibrations) this.calibrations = data.calibrations;
			if (data.practiceSessions) this.practiceSessions = data.practiceSessions;
			if (data.drillSessions) this.drillSessions = data.drillSessions;
			if (data.decisions) this.decisions = data.decisions;
			if (data.briefs) this.briefs = data.briefs;
			if (data.projectProgress && typeof data.projectProgress === 'object') this.projectProgress = data.projectProgress;
			if (data.nonInstrumentalLines) this.nonInstrumentalLines = data.nonInstrumentalLines;
			if (data.playLines) this.playLines = data.playLines;
		} catch (e) {
			console.error('Failed to load from localStorage', e);
		}
	}
}

export const practiceStore = new PracticeEngine();
