import type { ProblemEntry, CalibrationEntry, PracticeSession, DecisionEntry, Brief } from '../schemas/course.schema';
import type { DrillSession } from '../state/practice.svelte';

export interface ProjectArchiveData {
	projectName: string;
	exportedAt: string;
	problems: ProblemEntry[];
	calibrations: CalibrationEntry[];
	practiceSessions: PracticeSession[];
	drillSessions?: DrillSession[];
	decisions: DecisionEntry[];
	briefs: Brief[];
	playNotes: string[];
	nonInstrumentalNotes: string[];
}

/**
 * Formats project data into Appendix L Markdown folder tree structure.
 */
export function generateAppendixLMarkdownTree(data: ProjectArchiveData): Record<string, string> {
	const files: Record<string, string> = {};

	// 00-problem/
	files['00-problem/problem-statement.md'] = `# Problem Statement: ${data.projectName}
Generated: ${data.exportedAt}

${data.problems
	.map(
		(p, idx) => `## Problem Candidate ${idx + 1}: ${p.framedProblem}
- **Source:** ${p.source}
- **Noticed:** ${p.noticed}
- **Mode:** ${p.mode}
- **Stakes:** ${p.stakes}
- **Positionality:** ${p.positionality} (Standing: ${p.hasStanding ? 'Verified' : 'Refused'})
- **Justification:** ${p.standingJustification}
- **Selected:** ${p.selected ? 'YES' : 'NO'}
${p.rejectionReason ? `- **Rejection Reason:** ${p.rejectionReason}` : ''}
`
	)
	.join('\n---\n')}`;

	// 01-premise/
	files['01-premise/brief.md'] = `# 7-Layer Briefs
${data.briefs
	.map(
		(b) => `## ${b.title} (${b.date})
- **Premise:** ${b.premise}
- **Intention:** ${b.intention}
- **Constraints:**
${b.constraints.map((c) => `  - ${c}`).join('\n')}
- **Acceptance Criteria:**
${b.acceptanceCriteria.map((a) => `  - ${a}`).join('\n')}
- **Rejection Conditions:**
${b.rejectionConditions.map((r) => `  - ${r}`).join('\n')}
- **Provenance Stamp:**
  - Origin: ${b.provenance.origin}
  - Human: ${b.provenance.humanContribution}
  - Tool: ${b.provenance.toolContribution}
  - Licenses: ${b.provenance.licenses}
`
	)
	.join('\n---\n')}`;

	// 02-practice/
	files['02-practice/practice-log.md'] = `# Deliberate Practice Log
| Date | Micro-skill | Criterion | Reps | Success | Diff (1-5) | Result |
|---|---|---|---|---|---|---|
${data.practiceSessions
	.map(
		(s) =>
			`| ${s.date} | ${s.microSkill} | ${s.successCriterion} | ${s.repsCompleted} | ${s.successfulReps} | ${s.difficultyLevel} | ${s.resultAfterCorrection} |`
	)
	.join('\n')}`;

	if (data.drillSessions && data.drillSessions.length > 0) {
		files['02-practice/drill-reps.md'] = `# Deliberate Practice Drill Sessions (Reps)
| Date | Drill ID | Pass / Total | Pass Rate | Difficulty Adj | Duration |
|---|---|---|---|---|---|
${data.drillSessions
	.map((d) => {
		const rate = d.totalReps > 0 ? Math.round((d.passedReps / d.totalReps) * 100) : 0;
		return `| ${d.date} | ${d.drillId} | ${d.passedReps}/${d.totalReps} | ${rate}% | ${d.difficultyAdjustment} | ${d.durationMinutes}m |`;
	})
	.join('\n')}`;
	}

	// 03-decisions/
	files['03-decisions/decision-log.md'] = `# Decision Log
${data.decisions
	.map(
		(d) => `### [${d.date}] ${d.decision}
- **Project:** ${d.project}
- **Level:** ${d.highestUnresolvedLevel}
- **Rejected:** ${d.alternativesRejected}
- **Justification:** ${d.justification}
- **Feedback incorporated:** ${d.feedbackIncorporated}
- **Refusals:** ${d.refusals}
`
	)
	.join('\n')}`;

	// 04-calibration/
	files['04-calibration/calibration-log.md'] = `# Calibration Log
| Date | Domain | Variable | Prediction | Conf% | Actual | Match |
|---|---|---|---|---|---|---|
${data.calibrations
	.map(
		(c) =>
			`| ${c.date} | ${c.domain} | ${c.variableChanged} | ${c.prediction} | ${c.confidencePct}% | ${c.actualOutcome} | ${c.matchedExpectation ? 'Yes' : 'No'} |`
	)
	.join('\n')}`;

	// 05-attention/
	files['05-attention/attention-log.md'] = `# Attention & Non-Instrumental Observation Log
*Rule: Pure noticing without prompts, recording, or instrumental utility.*

${data.nonInstrumentalNotes.length > 0
	? data.nonInstrumentalNotes.map((note, idx) => `${idx + 1}. ${note}`).join('\n\n')
	: '_No attention entries recorded yet._'}`;

	// 06-play/
	files['06-play/uninstrumented-play-log.md'] = `# Uninstrumented Play Log
*Rule: 15–20m exploring with no deliverable, no grade, and no metric.*

${data.playNotes.length > 0
	? data.playNotes.map((note, idx) => `${idx + 1}. ${note}`).join('\n\n')
	: '_No play entries recorded yet._'}`;

	return files;
}
