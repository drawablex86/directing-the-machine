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
	| 'm4-post-run-divergence'
	| 'm4-narrowness-audit'
	// M5 Taste Infrastructure
	| 'm5-taste-formula-interrogation'
	| 'm5-reverse-brief-coach'
	| 'm5-anchor-audit'
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
	| 'daily-attention-purity'
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

export interface TensionReframe {
	isGenuineTension: boolean;
	proposedFrame?: string;
	sharpenedStakes?: string;
	frictionQuestion?: string;
}

export interface PositionVerdict {
	verdict: 'SOUND' | 'RISKY' | 'UNFOUNDED' | 'REFUSAL_RECOMMENDED';
	recommendedPosition?: 'From' | 'With' | 'For' | 'About' | 'Over';
	recommendedStanding?: boolean;
	primaryRisk?: string;
}

export interface PremiseTriangulation {
	recommendedPremise: number;
	divergenceRating: 'HIGH' | 'MEDIUM' | 'LOW_COLLAPSED';
	rejectionSoundness: 'SOUND' | 'ARBITRARY' | 'UNEXAMINED';
	sharpenedPremises?: {
		premise1?: string;
		premise2?: string;
		premise3?: string;
	};
	riskAnalysis?: string;
}

export interface BriefRedline {
	verdict: 'OPERATIONAL' | 'LOOPHOLED' | 'AMBIGUOUS' | 'DEFICIENT';
	hardenedIntention?: string;
	suggestedConstraints?: string[];
	suggestedNegativeRejections?: string[];
	flaggedWeaknesses?: string[];
}

export interface CalibrationCheck {
	verdict: 'OVERCONFIDENT' | 'UNDERCONFIDENT' | 'WELL_CALIBRATED' | 'UNFALSIFIABLE';
	recommendedConfidence: number;
	latentRisk?: string;
	falsificationCriterion?: string;
	sharpenedPrediction?: string;
}

export interface PostRunDivergence {
	verdict: 'GENUINE_LEARNING' | 'SHALLOW_RATIONALISATION' | 'TAUTOLOGY_UNTESTED' | 'UNEXPLAINED_SURPRISE';
	diagnosedCausalMechanism?: string;
	sharpenedModelRevision?: string;
	nextProbe?: string;
}

export interface NarrownessAudit {
	diversityRating: 'HIGH_RANGE' | 'MODERATE' | 'COMFORT_ZONE_LOCKED';
	comfortZoneObservation?: string;
	prescribedDomain?: 'pipeline' | 'curation' | 'visual' | 'writing' | 'audience' | 'direction' | 'problem';
	prescribedVariable?: string;
	prescribedHypothesis?: string;
	prescribedConfidence?: number;
}

export interface SimulatedStakeholder {
	stakeholderRole: string;
	rawFeedback: string;
	hiddenCommercialAnxiety?: string;
	primaryConflict?: string;
}

export interface TriageEvaluation {
	verdict: 'SOUND_TRIAGE' | 'MISDIAGNOSED_ROOT_NEED' | 'DANGEROUS_COMPLIANCE' | 'PREMATURE_DEFENSIVENESS';
	recommendedAction: 'apply' | 'adapt' | 'alternative' | 'pushback' | 'rebrief';
	hardenedUnderlyingNeed?: string;
	directorialResponse?: string;
}

export interface TasteFormulaAudit {
	verdict: 'RIGOROUS_APPARATUS' | 'MISSING_MECHANISM' | 'FALSE_EQUIVALENCE' | 'COSMETIC_PREFERENCE';
	mechanismDiagnosis: string;
	referenceClassFit?: string;
	sharpenedMechanism?: string;
	purposeAlignment?: string;
}

export interface ReverseBriefAudit {
	verdict: 'GENUINE_INVERSION' | 'COSMETIC_EXCUSE' | 'UNCONSTRAINED_ACCIDENT';
	inversionStrength: string;
	prescribedConstraints?: string[];
	sharpenedReverseBrief?: string;
	acceptanceCriterion?: string;
}

export interface AnchorAudit {
	ratioStatus: 'COMPLIANT_HUMAN_HEAVY' | 'COMPLIANT_BALANCED' | 'COLLAPSE_RISK_AI_DOMINATED';
	humanPercentage: number;
	maturationAssessment: string;
	homogenisationWarning?: string;
	recommendedHumanAnchor?: string;
}

export interface RefusalAudit {
	verdict: 'AIRTIGHT' | 'DEFENSIVE_WHINING' | 'MISMATCHED_MODE' | 'WEAK_COMPLIANCE';
	recommendedMode?: 'Ethical' | 'Positional' | 'Technical' | 'Intentional' | 'Slop';
	toneRating?: 'PROFESSIONAL_FIRM' | 'OVERLY_APOLOGETIC' | 'COMBATIVE' | 'PASSIVE_AGGRESSIVE';
	sharpenedRationale?: string;
	boundaryPrinciple?: string;
}

export interface RebriefArbitration {
	ruling: 'REVISE' | 'RE_BRIEF';
	cycleCeilingStatus?: 'UNDER_CAP' | 'AT_CAP_REVISE_ALLOWED' | 'HARD_STOP_REBRIEF_MANDATORY';
	rootFailureLevel?: 'PREMISE_FRAME' | 'CORE_STRUCTURE' | 'SURFACE_POLISH' | 'VALUE_RHYTHM';
	rationale?: string;
	nextDirectorialAction?: string;
}

export interface ReadingFriction {
	coreDistinction: string;
	socraticDilemma?: string;
	frictionQuestion1: string;
	frictionQuestion2?: string;
	diagnosticTrap?: string;
	suggestedSynthesis?: string;
}

export interface ReadingEvaluation {
	verdict: 'COMPREHENDED' | 'SUPERFICIAL_SUMMARY' | 'MISUNDERSTOOD_DISTINCTION';
	feedback: string;
	directorialRuleOfThumb: string;
	counterProbe?: string;
}

export interface DrillDiagnostic {
	failureType: 'PERCEPTUAL' | 'PROCEDURAL' | 'CONSTRAINT_TOO_HIGH' | 'UNKNOWN';
	mechanismDiagnosis: string;
	microAdjustment: string;
	zoneRecommendation: 'MAINTAIN' | 'TIGHTEN_CONSTRAINT' | 'EASE_CONSTRAINT';
}

export interface HemingwayAudit {
	verdict: 'ATOMIC' | 'DISGUISED_PROJECT' | 'VAGUE_INTENTION';
	estimatedMinutes: number;
	decomposedAction: string;
	obstacleWarning?: string;
}

export interface AttentionPurity {
	verdict: 'PURE_NON_INSTRUMENTAL' | 'COVERT_INSTRUMENTAL_UTILITY' | 'VAGUE_ABSTRACTION';
	contaminationAnalysis?: string;
	purifiedObservation?: string;
	prescribedAttentiveMove?: string;
}

export interface PositionGapMirrorResult {
	alignmentLevel: 'CONGRUENT' | 'ASPIRATIONAL_DRIFT' | 'DIAMETRIC_CONTRADICTION';
	dissonanceDiagnosis: string;
	borrowedAmbition?: string;
	emergentAuthenticPosition?: string;
	recommendedStatement?: string;
}

export interface RemovalTestResult {
	synthesisVerdict: 'GENUINE_SYNTHESIS' | 'TEXT_REDUNDANT' | 'IMAGE_ILLUSTRATIVE' | 'SEPARATE_OBJECTS';
	coDependenceAnalysis: string;
	sharpenedThirdThing?: string;
	recommendedCounterWeight?: string;
}

export interface CapstoneMilestoneResult {
	verdict: 'RIGOROUS_PASS' | 'NEEDS_REVISION' | 'SCAFFOLDING_RELAPSE';
	directorialAutonomyAudit: string;
	criticalInquiry: string;
	nextDirectorialMove: string;
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
	tensionReframe?: TensionReframe;
	positionVerdict?: PositionVerdict;
	premiseTriangulation?: PremiseTriangulation;
	briefRedline?: BriefRedline;
	calibrationCheck?: CalibrationCheck;
	postRunDivergence?: PostRunDivergence;
	narrownessAudit?: NarrownessAudit;
	simulatedStakeholder?: SimulatedStakeholder;
	triageEvaluation?: TriageEvaluation;
	refusalAudit?: RefusalAudit;
	rebriefArbitration?: RebriefArbitration;
	readingFriction?: ReadingFriction;
	readingEvaluation?: ReadingEvaluation;
	drillDiagnostic?: DrillDiagnostic;
	hemingwayAudit?: HemingwayAudit;
	attentionPurity?: AttentionPurity;
	positionGap?: PositionGapMirrorResult;
	removalTest?: RemovalTestResult;
	capstoneMilestone?: CapstoneMilestoneResult;
	tasteFormulaAudit?: TasteFormulaAudit;
	reverseBriefAudit?: ReverseBriefAudit;
	anchorAudit?: AnchorAudit;
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
