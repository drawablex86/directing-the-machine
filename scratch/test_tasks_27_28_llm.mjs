import assert from 'node:assert';

function parseProjectRubricAudit(text) {
	if (!text) return undefined;
	const blockMatch = text.match(/\[PROJECT_RUBRIC_AUDIT\]([\s\S]*?)(\[\/PROJECT_RUBRIC_AUDIT\]|$)/i);
	const target = blockMatch ? blockMatch[1] : text;

	const verdictMatch = target.match(/VERDICT:\s*(DISTINCTION_PASS|SOLID_PASS|REVISE_DEFECTS|REJECT_EVASION)/i);
	const scoreMatch = target.match(/OVERALL_SCORE:\s*(\d+)/i);
	const criteriaBlockMatch = target.match(/CRITERIA_ASSESSMENTS:([\s\S]*?)(?=FLAGGED_BLIND_SPOTS:|SHARPENED_GUIDANCE:|NEXT_DIRECTORIAL_MOVE:|$)/i);
	const blindSpotsMatch = target.match(/FLAGGED_BLIND_SPOTS:([\s\S]*?)(?=SHARPENED_GUIDANCE:|NEXT_DIRECTORIAL_MOVE:|$)/i);
	const guidanceMatch = target.match(/SHARPENED_GUIDANCE:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const moveMatch = target.match(/NEXT_DIRECTORIAL_MOVE:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);

	if (!verdictMatch && !guidanceMatch && !criteriaBlockMatch) {
		return undefined;
	}

	const criteriaAssessments = [];
	if (criteriaBlockMatch) {
		const lines = criteriaBlockMatch[1].split('\n');
		for (const line of lines) {
			const m = line.match(/[-*•]?\s*Criterion:\s*([^|]+?)\s*\|\s*Rating:\s*(MEETS|PARTIAL|DEFICIENT)\s*\|\s*Feedback:\s*(.+)/i);
			if (m) {
				criteriaAssessments.push({
					criterion: m[1].trim(),
					rating: m[2].trim().toUpperCase(),
					feedback: m[3].trim()
				});
			}
		}
	}

	let flaggedBlindSpots = [];
	if (blindSpotsMatch) {
		flaggedBlindSpots = blindSpotsMatch[1]
			.split('\n')
			.map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
			.filter((l) => l.length > 0);
	}

	const rawScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 75;

	return {
		verdict: verdictMatch ? verdictMatch[1].toUpperCase() : 'REVISE_DEFECTS',
		overallScore: isNaN(rawScore) ? 75 : rawScore,
		criteriaAssessments,
		flaggedBlindSpots,
		sharpenedGuidance: guidanceMatch ? guidanceMatch[1].trim() : 'Deliverable guidance not extracted.',
		nextDirectorialMove: moveMatch ? moveMatch[1].trim() : 'Review project specifications and address flagged defects.'
	};
}

function parseTwoAxisCrossExam(text) {
	if (!text) return undefined;
	const blockMatch = text.match(/\[TWO_AXIS_AUDIT\]([\s\S]*?)(\[\/TWO_AXIS_AUDIT\]|$)/i);
	const target = blockMatch ? blockMatch[1] : text;

	const quadMatch = target.match(/DIAGNOSED_QUADRANT:\s*(mastery|learning-in-progress|lucky-unstable|failure)/i);
	const congMatch = target.match(/CONGRUENCE_VERDICT:\s*(HONEST_CONGRUENT|SUSPECTED_RATIONALISATION|SUSPECTED_LUCKY_HIT|IMPOSTOR_HESITATION)/i);
	const outMatch = target.match(/RECOMMENDED_OUTCOME:\s*(\d)/i);
	const decMatch = target.match(/RECOMMENDED_DECISION:\s*(\d)/i);
	const challengeMatch = target.match(/SOCRATIC_CHALLENGE:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const prescMatch = target.match(/DIRECTORIAL_PRESCRIPTION:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);

	if (!congMatch && !challengeMatch && !quadMatch) {
		return undefined;
	}

	const rawOut = outMatch ? parseInt(outMatch[1], 10) : 3;
	const rawDec = decMatch ? parseInt(decMatch[1], 10) : 3;

	return {
		diagnosedQuadrant: quadMatch ? quadMatch[1].toLowerCase() : 'learning-in-progress',
		congruenceVerdict: congMatch ? congMatch[1].toUpperCase() : 'HONEST_CONGRUENT',
		recommendedOutcomeScore: isNaN(rawOut) ? 3 : Math.max(1, Math.min(4, rawOut)),
		recommendedDecisionScore: isNaN(rawDec) ? 3 : Math.max(1, Math.min(4, rawDec)),
		socraticChallenge: challengeMatch ? challengeMatch[1].trim() : 'Interrogate whether your decisions were causal or coincidental.',
		directorialPrescription: prescMatch ? prescMatch[1].trim() : 'Calibrate your decision loop against tangible deliverables.'
	};
}

function parseLogDecayAudit(text) {
	if (!text) return undefined;
	const blockMatch = text.match(/\[LOG_DECAY_AUDIT\]([\s\S]*?)(\[\/LOG_DECAY_AUDIT\]|$)/i);
	const target = blockMatch ? blockMatch[1] : text;

	const statusMatch = target.match(/STATUS:\s*(PRISTINE_RIGOR|EARLY_SLIPPAGE|SYSTEMIC_THEATRE)/i);
	const scoreMatch = target.match(/SCORE:\s*(\d+)/i);
	const symptomsMatch = target.match(/SYMPTOMS:([\s\S]*?)(?=INTERVENTION:|SHARPENED_SAMPLE:|$)/i);
	const intervMatch = target.match(/INTERVENTION:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const sampleMatch = target.match(/SHARPENED_SAMPLE:\s*["“']?([\s\S]*?)["”']?(?=\n\s*\[\/LOG_DECAY_AUDIT\]|$)/i);

	if (!statusMatch && !intervMatch && !sampleMatch) {
		return undefined;
	}

	let symptomsDetected = [];
	if (symptomsMatch) {
		symptomsDetected = symptomsMatch[1]
			.split('\n')
			.map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
			.filter((l) => l.length > 0);
	}

	const rawScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 7;

	return {
		decayStatus: statusMatch ? statusMatch[1].toUpperCase() : 'EARLY_SLIPPAGE',
		decayScore: isNaN(rawScore) ? 7 : Math.max(1, Math.min(10, rawScore)),
		symptomsDetected,
		prescribedIntervention: intervMatch ? intervMatch[1].trim() : 'Enforce a 10-minute timer and 1-sentence limit per entry.',
		sharpenedSampleEntry: sampleMatch ? sampleMatch[1].trim() : undefined
	};
}

function parseAppendixLSynthesis(text) {
	if (!text) return undefined;
	const blockMatch = text.match(/\[APPENDIX_L_SYNTHESIS\]([\s\S]*?)(\[\/APPENDIX_L_SYNTHESIS\]|$)/i);
	const target = blockMatch ? blockMatch[1] : text;

	const titleMatch = target.match(/TITLE:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const narrMatch = target.match(/EVOLUTION_NARRATIVE:\s*["“']?([\s\S]*?)["”']?(?=\n\s*MAJOR_BREAKTHROUGHS:|$)/i);
	const breaksMatch = target.match(/MAJOR_BREAKTHROUGHS:([\s\S]*?)(?=PERSISTENT_BLIND_SPOTS:|REFUSAL_CHRONICLE:|MARKDOWN_EXPORT:|$)/i);
	const spotsMatch = target.match(/PERSISTENT_BLIND_SPOTS:([\s\S]*?)(?=REFUSAL_CHRONICLE:|MARKDOWN_EXPORT:|$)/i);
	const refusalMatch = target.match(/REFUSAL_CHRONICLE:\s*["“']?([\s\S]*?)["”']?(?=\n\s*MARKDOWN_EXPORT:|$)/i);
	const mdMatch = target.match(/MARKDOWN_EXPORT:\s*([\s\S]*?)(?=\[\/APPENDIX_L_SYNTHESIS\]|$)/i);

	if (!titleMatch && !narrMatch && !mdMatch) {
		return undefined;
	}

	let majorBreakthroughs = [];
	if (breaksMatch) {
		majorBreakthroughs = breaksMatch[1]
			.split('\n')
			.map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
			.filter((l) => l.length > 0);
	}

	let persistentBlindSpots = [];
	if (spotsMatch) {
		persistentBlindSpots = spotsMatch[1]
			.split('\n')
			.map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
			.filter((l) => l.length > 0);
	}

	return {
		title: titleMatch ? titleMatch[1].trim() : 'Directorial Retrospective & Evolution Monograph',
		evolutionNarrative: narrMatch ? narrMatch[1].trim() : 'Directorial evolution narrative synthesized from studio logs.',
		majorBreakthroughs,
		persistentBlindSpots,
		refusalChronicleSummary: refusalMatch ? refusalMatch[1].trim() : 'Refusal boundaries and non-negotiables developed throughout practice.',
		appendixLMarkdownExport: mdMatch ? mdMatch[1].trim() : (narrMatch ? narrMatch[1].trim() : text)
	};
}

function parseFailureTriageDiagnostic(text) {
	if (!text) return undefined;
	const blockMatch = text.match(/\[FAILURE_TRIAGE\]([\s\S]*?)(\[\/FAILURE_TRIAGE\]|$)/i);
	const target = blockMatch ? blockMatch[1] : text;

	const modeMatch = target.match(/PRIMARY_MODE:\s*(output|habit|motivational|decay)/i);
	const dynamicMatch = target.match(/UNDERLYING_DYNAMIC:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const protoMatch = target.match(/PRESCRIBED_PROTOCOL:([\s\S]*?)(?=IMMEDIATE_NEXT_MOVE:|$)/i);
	const moveMatch = target.match(/IMMEDIATE_NEXT_MOVE:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);

	if (!modeMatch && !dynamicMatch && !moveMatch) {
		return undefined;
	}

	let prescribedProtocol = [];
	if (protoMatch) {
		prescribedProtocol = protoMatch[1]
			.split('\n')
			.map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
			.filter((l) => l.length > 0);
	}

	return {
		primaryMode: modeMatch ? modeMatch[1].toLowerCase() : 'output',
		underlyingDynamic: dynamicMatch ? dynamicMatch[1].trim() : 'Symptom pattern suggests friction in studio execution.',
		prescribedProtocol,
		immediateNextMove: moveMatch ? moveMatch[1].trim() : 'Open Top-Down Diagnostic Ladder and review intent.'
	};
}

console.log('Testing Tasks 27 & 28 LLM Parsers...');

// 1. Test parseProjectRubricAudit
{
	const sample = `
[PROJECT_RUBRIC_AUDIT]
VERDICT: REVISE_DEFECTS
OVERALL_SCORE: 68
CRITERIA_ASSESSMENTS:
- Criterion: Negative Rejections | Rating: DEFICIENT | Feedback: Failed to document what was explicitly excluded from the composition.
- Criterion: Formal Contrast | Rating: MEETS | Feedback: Spatial balance and value hierarchy function cleanly.
- Criterion: Provenance Audit | Rating: PARTIAL | Feedback: Model parameters recorded but human anchor lineage is vague.
FLAGGED_BLIND_SPOTS:
- The lighting choices default to Midjourney v6 warm-amber volumetric haze.
- Lack of negative prompt constraints regarding surface texture.
SHARPENED_GUIDANCE: Re-brief the lighting layer. Replace evocative adjectives with physical lux and shadow angles.
NEXT_DIRECTORIAL_MOVE: Formulate 3 explicit negative rejection conditions in Layer 6 of the brief.
[/PROJECT_RUBRIC_AUDIT]
`;

	const res = parseProjectRubricAudit(sample);
	assert.ok(res, 'Project rubric audit should be parsed');
	assert.strictEqual(res.verdict, 'REVISE_DEFECTS');
	assert.strictEqual(res.overallScore, 68);
	assert.strictEqual(res.criteriaAssessments.length, 3);
	assert.strictEqual(res.criteriaAssessments[0].criterion, 'Negative Rejections');
	assert.strictEqual(res.criteriaAssessments[0].rating, 'DEFICIENT');
	assert.strictEqual(res.criteriaAssessments[1].rating, 'MEETS');
	assert.strictEqual(res.flaggedBlindSpots.length, 2);
	assert.strictEqual(res.flaggedBlindSpots[0], 'The lighting choices default to Midjourney v6 warm-amber volumetric haze.');
	assert.ok(res.sharpenedGuidance.includes('Re-brief the lighting layer'));
	assert.ok(res.nextDirectorialMove.includes('Formulate 3 explicit negative rejection conditions'));
	console.log('✓ parseProjectRubricAudit passed');
}

// 2. Test parseTwoAxisCrossExam
{
	const sample = `
[TWO_AXIS_AUDIT]
DIAGNOSED_QUADRANT: lucky-unstable
CONGRUENCE_VERDICT: SUSPECTED_LUCKY_HIT
RECOMMENDED_OUTCOME: 3
RECOMMENDED_DECISION: 2
SOCRATIC_CHALLENGE: You generated 40 variations and picked the one that looked cinematic, but what was your hypothesis before running generation?
DIRECTORIAL_PRESCRIPTION: Lock a pre-run causal prediction before hitting generate. If you cannot predict the failure mode, it is a lottery ticket, not direction.
[/TWO_AXIS_AUDIT]
`;

	const res = parseTwoAxisCrossExam(sample);
	assert.ok(res, 'Two-axis cross exam should be parsed');
	assert.strictEqual(res.diagnosedQuadrant, 'lucky-unstable');
	assert.strictEqual(res.congruenceVerdict, 'SUSPECTED_LUCKY_HIT');
	assert.strictEqual(res.recommendedOutcomeScore, 3);
	assert.strictEqual(res.recommendedDecisionScore, 2);
	assert.ok(res.socraticChallenge.includes('You generated 40 variations'));
	assert.ok(res.directorialPrescription.includes('Lock a pre-run causal prediction'));
	console.log('✓ parseTwoAxisCrossExam passed');
}

// 3. Test parseLogDecayAudit
{
	const sample = `
[LOG_DECAY_AUDIT]
STATUS: EARLY_SLIPPAGE
SCORE: 6
SYMPTOMS:
- "Adjusted prompt for better atmosphere" repeated across 4 calibration entries.
- Stated confidence fixed at 75% for 6 consecutive trials with no variance.
INTERVENTION: Enforce a strict 1-sentence limit and require specifying the physical variable changed instead of emotional atmosphere.
SHARPENED_SAMPLE: "Shifted key-to-fill ratio from 4:1 to 8:1 by attenuating the bounce plane; predicted deep shadow crush on the actor's cheek."
[/LOG_DECAY_AUDIT]
`;

	const res = parseLogDecayAudit(sample);
	assert.ok(res, 'Log decay audit should be parsed');
	assert.strictEqual(res.decayStatus, 'EARLY_SLIPPAGE');
	assert.strictEqual(res.decayScore, 6);
	assert.strictEqual(res.symptomsDetected.length, 2);
	assert.ok(res.symptomsDetected[0].includes('Adjusted prompt for better atmosphere'));
	assert.ok(res.prescribedIntervention.includes('1-sentence limit'));
	assert.ok(res.sharpenedSampleEntry.includes('Shifted key-to-fill ratio'));
	console.log('✓ parseLogDecayAudit passed');
}

// 4. Test parseAppendixLSynthesis
{
	const sample = `
[APPENDIX_L_SYNTHESIS]
TITLE: Directorial Evolution Monograph: From Prompting to Specification
EVOLUTION_NARRATIVE: The practitioner began in Month 1 relying on adjectival descriptions ('moody', 'hyper-detailed'). Over 12 weeks, their practice transformed into precise spatial, lighting, and semantic boundary setting.
MAJOR_BREAKTHROUGHS:
- Abandonment of aesthetic adjectives in favor of concrete physics and optical setups.
- Consistent Brier score calibration improvement from 0.42 to 0.16.
PERSISTENT_BLIND_SPOTS:
- Tendency to accept the first acceptable composition in Phase 2 rather than pushing through 3 rival premises.
REFUSAL_CHRONICLE: Successfully executed 5 ethical and technical refusals, declining uncredited synthetic training sets and generic stock aesthetics.
MARKDOWN_EXPORT:
# Directorial Monograph
## 1. Executive Trajectory
The practitioner demonstrated clear progression from prompt operator to creative director...
[/APPENDIX_L_SYNTHESIS]
`;

	const res = parseAppendixLSynthesis(sample);
	assert.ok(res, 'Appendix L synthesis should be parsed');
	assert.strictEqual(res.title, 'Directorial Evolution Monograph: From Prompting to Specification');
	assert.ok(res.evolutionNarrative.includes('The practitioner began in Month 1'));
	assert.strictEqual(res.majorBreakthroughs.length, 2);
	assert.strictEqual(res.persistentBlindSpots.length, 1);
	assert.ok(res.refusalChronicleSummary.includes('Successfully executed 5 ethical and technical refusals'));
	assert.ok(res.appendixLMarkdownExport.includes('# Directorial Monograph'));
	console.log('✓ parseAppendixLSynthesis passed');
}

// 5. Test parseFailureTriageDiagnostic
{
	const sample = `
[FAILURE_TRIAGE]
PRIMARY_MODE: motivational
UNDERLYING_DYNAMIC: The learner has accumulated excessive deliverable pressure and substituted external client desires for intrinsic curiosity, leading to borrowed ambition.
PRESCRIBED_PROTOCOL:
- Initiate an immediate 7-day generation pause.
- Protect 60 minutes daily for non-instrumental attention with no deliverables.
- Review Positionality Compass standing to reconnect with core personal stakes.
IMMEDIATE_NEXT_MOVE: Close the generation tool and spend 15 minutes observing natural light reflections on your desk.
[/FAILURE_TRIAGE]
`;

	const res = parseFailureTriageDiagnostic(sample);
	assert.ok(res, 'Failure triage diagnostic should be parsed');
	assert.strictEqual(res.primaryMode, 'motivational');
	assert.ok(res.underlyingDynamic.includes('borrowed ambition'));
	assert.strictEqual(res.prescribedProtocol.length, 3);
	assert.ok(res.immediateNextMove.includes('Close the generation tool'));
	console.log('✓ parseFailureTriageDiagnostic passed');
}

console.log('All 5 parser test suites passed successfully!');
