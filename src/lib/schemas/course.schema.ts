import { z } from 'zod';

// Intensity Paths from Appendix O
export const IntensityPathSchema = z.enum([
	'full-time-12w',
	'extended-24w',
	'distributed-48w',
	'maintenance-4h'
]);
export type IntensityPath = z.infer<typeof IntensityPathSchema>;

// Mastery Layers (1: Capability, 2: Independence, 3: Agency)
export const MasteryLayerSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type MasteryLayer = z.infer<typeof MasteryLayerSchema>;

// Two-Axis Assessment Quadrants
export const QuadrantSchema = z.enum([
	'mastery',
	'learning-in-progress',
	'lucky-unstable',
	'failure'
]);
export type Quadrant = z.infer<typeof QuadrantSchema>;

// 12 Baseline Competencies
export const BaselineCompetencySchema = z.object({
	id: z.string(),
	name: z.string(),
	exercise: z.string(),
	score: z.number().min(1).max(4),
	notes: z.string()
});
export type BaselineCompetency = z.infer<typeof BaselineCompetencySchema>;

// Calibration Entry (Module 9)
export const CalibrationEntrySchema = z.object({
	id: z.string(),
	date: z.string(),
	domain: z.enum(['pipeline', 'curation', 'writing', 'visual', 'audience', 'direction', 'problem']),
	variableChanged: stringSchema('Variable'),
	prediction: stringSchema('Prediction'),
	confidencePct: z.number().min(0).max(100),
	actualOutcome: stringSchema('Actual outcome'),
	matchedExpectation: z.boolean(),
	wasSurprising: z.boolean(),
	modelRevision: stringSchema('Model revision')
});
export type CalibrationEntry = z.infer<typeof CalibrationEntrySchema>;

// Problem-Finding Entry (Module 2)
export const ProblemEntrySchema = z.object({
	id: z.string(),
	date: z.string(),
	source: z.string(),
	noticed: stringSchema('Noticed'),
	framedProblem: stringSchema('Framed problem'),
	mode: z.enum(['Solve', 'Investigate', 'Reveal', 'Reframe', 'Explore', 'Construct']),
	stakes: stringSchema('Stakes'),
	positionality: z.enum(['From', 'With', 'For', 'About', 'Over']),
	hasStanding: z.boolean(),
	standingJustification: stringSchema('Standing justification'),
	selected: z.boolean(),
	rejectionReason: z.string().optional()
});
export type ProblemEntry = z.infer<typeof ProblemEntrySchema>;

// Practice Log Entry (Module 0)
export const PracticeSessionSchema = z.object({
	id: z.string(),
	date: z.string(),
	microSkill: z.string(),
	successCriterion: z.string(),
	repsCompleted: z.number().min(1),
	successfulReps: z.number().min(0),
	difficultyLevel: z.number().min(1).max(5),
	errorsObserved: z.string(),
	correctionApplied: z.string(),
	resultAfterCorrection: z.string(),
	nextSessionFocus: z.string()
});
export type PracticeSession = z.infer<typeof PracticeSessionSchema>;

// Decision Log Entry (Universal)
export const DecisionEntrySchema = z.object({
	id: z.string(),
	date: z.string(),
	project: z.string(),
	decision: z.string(),
	highestUnresolvedLevel: z.string(),
	alternativesRejected: z.string(),
	justification: z.string(),
	feedbackIncorporated: z.string(),
	refusals: z.string()
});
export type DecisionEntry = z.infer<typeof DecisionEntrySchema>;

// 7-Layer Brief Architecture (Module 6)
export const BriefSchema = z.object({
	id: z.string(),
	date: z.string(),
	title: z.string(),
	premise: z.string(),
	intention: z.string(),
	constraints: z.array(z.string()),
	references: z.array(
		z.object({
			name: z.string(),
			borrowedPrinciple: z.string(),
			scale: z.string(),
			whatBreaksIfRemoved: z.string(),
			whatNotToCopy: z.string()
		})
	),
	acceptanceCriteria: z.array(z.string()),
	rejectionConditions: z.array(z.string()),
	risksAndUnknowns: z.array(z.string()),
	provenance: z.object({
		origin: z.string(),
		humanContribution: z.string(),
		toolContribution: z.string(),
		licenses: z.string()
	})
});
export type Brief = z.infer<typeof BriefSchema>;

// Project Progress & Deliverables Lifecycle
export const ProjectStatusSchema = z.enum([
	'not-started',
	'in-progress',
	'under-critique',
	'completed',
	'abandoned'
]);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const TwoAxisEvaluationSchema = z.object({
	outcomeScore: z.number().min(1).max(4),
	decisionScore: z.number().min(1).max(4),
	quadrant: QuadrantSchema,
	date: z.string(),
	notes: z.string()
});
export type TwoAxisEvaluation = z.infer<typeof TwoAxisEvaluationSchema>;

export const ProjectProgressSchema = z.object({
	projectId: z.string(),
	status: ProjectStatusSchema,
	completedDeliverableNames: z.array(z.string()),
	twoAxisEvaluation: TwoAxisEvaluationSchema.optional(),
	repositoryOrArtifactUrl: z.string().optional(),
	notes: z.string().optional(),
	lastUpdated: z.string()
});
export type ProjectProgress = z.infer<typeof ProjectProgressSchema>;

function stringSchema(fieldName: string) {
	return z.string().min(1, `${fieldName} cannot be empty`);
}
