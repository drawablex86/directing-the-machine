import type { InferenceProviderId } from './inference';

export type PromptTemplateId =
	// M2 Diagnostic Vision
	| 'm2-semantic-linter'
	| 'm2-ladder-auditor'
	// M1 Problem-Finding & Positionality
	| 'm1-problem-stress-test'
	| 'm1-positionality-audit'
	// M3 Premise & 7-Layer Brief
	| 'm3-premise-triangulation'
	| 'm3-brief-redline'
	// M4 Causal Calibration
	| 'm4-pre-run-reality-check'
	| 'm4-narrowness-audit'
	// M5 Taste Infrastructure
	| 'm5-taste-formula-interrogation'
	| 'm5-reverse-brief-coach'
	// M6 Direction, Collaboration & Refusal
	| 'm6-stakeholder-simulator'
	| 'm6-refusal-soundness'
	| 'm6-rebrief-arbiter'
	// M7 Agency & Capstone
	| 'm7-position-gap-mirror'
	| 'm7-removal-test'
	| 'm7-blank-sheet-milestone'
	// Daily Studio Loop & Habits
	| 'daily-reading-friction'
	| 'drill-rep-diagnostic'
	| 'hemingway-action-check'
	// Flagship Projects & Assessment
	| 'project-rubric-audit'
	| 'two-axis-cross-examination'
	// Studio Logbook & Recovery
	| 'log-decay-sentinel'
	| 'appendix-l-synthesis'
	| 'failure-triage-diagnostic';

export type PromptRole = 'interlocutor' | 'auditor' | 'simulator' | 'coach' | 'curator' | 'sentinel';

export interface PromptConfig<TContext = any> {
	id: PromptTemplateId;
	name: string;
	persona: string;
	role: PromptRole;
	tier?: 'fast' | 'reasoning';
	modalityId?: string;
	description: string;
	systemPrompt: string;
	defaultTemperature: number;
	defaultMaxTokens: number;
	formatPrompt: (context: TContext) => string;
}

export interface SurgicalPatch {
	originalSentence: string;
	structuralReplacement: string;
	flaggedWord?: string;
	reason?: string;
}

export interface CritiqueResult {
	id: string;
	timestamp: string;
	promptId: PromptTemplateId;
	persona: string;
	rawText: string;
	thought?: string;
	isTruncated?: boolean;
	model: string;
	provider: InferenceProviderId;
	latencyMs: number;
	usage?: {
		promptTokens?: number;
		completionTokens?: number;
		totalTokens?: number;
	};
	applied?: boolean;
	patches?: SurgicalPatch[];
	recommendedLevel?: number;
}

export interface LlmAction {
	id?: string;
	label: string;
	icon?: any;
	primary?: boolean;
	variant?: 'primary' | 'secondary' | 'danger';
	disabled?: boolean;
	onClick: (result: CritiqueResult) => void | Promise<void>;
}
