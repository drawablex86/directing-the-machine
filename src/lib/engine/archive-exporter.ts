import type { ProblemEntry, CalibrationEntry, PracticeSession, DecisionEntry, Brief } from '../schemas/course.schema';

export interface ProjectArchiveData {
	projectName: string;
	exportedAt: string;
	problems: ProblemEntry[];
	calibrations: CalibrationEntry[];
	practiceSessions: PracticeSession[];
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

	// 03-decisions/
	files['03-decisions/decision-log.md'] = `# Decision Log
${data.decisions
	.map(
		(d) => `### [${d.date}] ${d.decision}
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
| Date | Domain | Variable | Prediction | Conf% | Actual | Error Dir |
|---|---|---|---|---|---|---|
${data.calibrations
	.map(
		(c) =>
			`| ${c.date} | ${c.domain} | ${c.variableChanged} | ${c.prediction} | ${c.confidencePct}% | ${c.actualOutcome} | ${c.matchedExpectation ? 'Correct' : 'Missed'} |`
	)
	.join('\n')}`;

	return files;
}
