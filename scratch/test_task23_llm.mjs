import assert from 'node:assert';

function parseTasteFormulaAudit(text) {
	if (!text) return undefined;
	const blockMatch = text.match(/\[TASTE_FORMULA_AUDIT\]([\s\S]*?)(\[\/TASTE_FORMULA_AUDIT\]|$)/i);
	const target = blockMatch ? blockMatch[1] : text;

	const verdictMatch = target.match(/VERDICT:\s*(RIGOROUS_APPARATUS|MISSING_MECHANISM|FALSE_EQUIVALENCE|COSMETIC_PREFERENCE)/i);
	const diagMatch = target.match(/MECHANISM_DIAGNOSIS:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const refMatch = target.match(/REFERENCE_CLASS_FIT:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const sharpMatch = target.match(/SHARPENED_MECHANISM:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const purpMatch = target.match(/PURPOSE_ALIGNMENT:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);

	if (!verdictMatch && !diagMatch && !sharpMatch) {
		return undefined;
	}

	return {
		verdict: verdictMatch ? verdictMatch[1].toUpperCase() : 'MISSING_MECHANISM',
		mechanismDiagnosis: diagMatch ? diagMatch[1].trim() : 'Mechanism diagnosis not extracted.',
		referenceClassFit: refMatch ? refMatch[1].trim() : undefined,
		sharpenedMechanism: sharpMatch ? sharpMatch[1].trim() : undefined,
		purposeAlignment: purpMatch ? purpMatch[1].trim() : undefined
	};
}

function parseReverseBriefAudit(text) {
	if (!text) return undefined;
	const blockMatch = text.match(/\[REVERSE_BRIEF_AUDIT\]([\s\S]*?)(\[\/REVERSE_BRIEF_AUDIT\]|$)/i);
	const target = blockMatch ? blockMatch[1] : text;

	const verdictMatch = target.match(/VERDICT:\s*(GENUINE_INVERSION|COSMETIC_EXCUSE|UNCONSTRAINED_ACCIDENT)/i);
	const strengthMatch = target.match(/INVERSION_STRENGTH:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const constrMatch = target.match(/PRESCRIBED_CONSTRAINTS:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const briefMatch = target.match(/SHARPENED_REVERSE_BRIEF:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const critMatch = target.match(/ACCEPTANCE_CRITERION:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);

	if (!verdictMatch && !strengthMatch && !briefMatch) {
		return undefined;
	}

	let prescribedConstraints = undefined;
	if (constrMatch) {
		const raw = constrMatch[1].trim();
		prescribedConstraints = raw
			.split(/\n|;|\d+\.\s+/)
			.map((c) => c.replace(/^[-•*]\s*/, '').trim())
			.filter((c) => c.length > 0);
	}

	return {
		verdict: verdictMatch ? verdictMatch[1].toUpperCase() : 'COSMETIC_EXCUSE',
		inversionStrength: strengthMatch ? strengthMatch[1].trim() : 'Inversion strength not extracted.',
		prescribedConstraints,
		sharpenedReverseBrief: briefMatch ? briefMatch[1].trim() : undefined,
		acceptanceCriterion: critMatch ? critMatch[1].trim() : undefined
	};
}

function parseAnchorAudit(text) {
	if (!text) return undefined;
	const blockMatch = text.match(/\[ANCHOR_AUDIT\]([\s\S]*?)(\[\/ANCHOR_AUDIT\]|$)/i);
	const target = blockMatch ? blockMatch[1] : text;

	const ratioMatch = target.match(/RATIO_STATUS:\s*(COMPLIANT_HUMAN_HEAVY|COMPLIANT_BALANCED|COLLAPSE_RISK_AI_DOMINATED)/i);
	const pctMatch = target.match(/HUMAN_PERCENTAGE:\s*(\d+)/i);
	const maturMatch = target.match(/MATURATION_ASSESSMENT:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const warnMatch = target.match(/HOMOGENISATION_WARNING:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);
	const recMatch = target.match(/RECOMMENDED_HUMAN_ANCHOR:\s*["“']?([\s\S]*?)["”']?(?=\n\s*[A-Z0-9_]+:|$)/i);

	if (!ratioMatch && !maturMatch && !recMatch) {
		return undefined;
	}

	const rawPct = pctMatch ? parseInt(pctMatch[1], 10) : 50;

	return {
		ratioStatus: ratioMatch ? ratioMatch[1].toUpperCase() : 'COMPLIANT_BALANCED',
		humanPercentage: isNaN(rawPct) ? 50 : rawPct,
		maturationAssessment: maturMatch ? maturMatch[1].trim() : 'Maturation assessment not extracted.',
		homogenisationWarning: warnMatch ? warnMatch[1].trim() : undefined,
		recommendedHumanAnchor: recMatch ? recMatch[1].trim() : undefined
	};
}

console.log('--- Testing M5 LLM Parsers ---');

// 1. Test parseTasteFormulaAudit
const mockTasteFormulaOutput = `
Here is my curatorial interrogation:
The practitioner has identified a visceral preference for high-contrast lighting, but relied entirely on decorative adjectives without isolating the optical mechanism.

[TASTE_FORMULA_AUDIT]
VERDICT: MISSING_MECHANISM
MECHANISM_DIAGNOSIS: "Relied on vague adjectives like 'moody' and 'striking' rather than specifying value distribution or light ratio."
REFERENCE_CLASS_FIT: "Gordon Willis 1970s low-key cinematography is an appropriate benchmark."
SHARPENED_MECHANISM: "15% warm key light restricted to 45-degree rake angle piercing 85% low-key cool shadow with zero ambient fill."
PURPOSE_ALIGNMENT: "Directly reinforces the psychological theme of paranoia and concealment."
[/TASTE_FORMULA_AUDIT]
`;

const formulaResult = parseTasteFormulaAudit(mockTasteFormulaOutput);
assert.ok(formulaResult, 'Taste formula result should not be undefined');
assert.strictEqual(formulaResult.verdict, 'MISSING_MECHANISM');
assert.ok(formulaResult.mechanismDiagnosis.includes('vague adjectives'));
assert.ok(formulaResult.sharpenedMechanism.includes('15% warm key light'));
assert.ok(formulaResult.referenceClassFit.includes('Gordon Willis'));
assert.ok(formulaResult.purposeAlignment.includes('psychological theme'));
console.log('✅ parseTasteFormulaAudit passed!');

// 2. Test parseReverseBriefAudit
const mockReverseBriefOutput = `
Aesthetic Inversion Analysis:
The director is taking an uncalibrated limb anatomy hallucination and attempting to author a brief.

[REVERSE_BRIEF_AUDIT]
VERDICT: GENUINE_INVERSION
INVERSION_STRENGTH: "The distorted multiplicity of limbs is essential to representing corporate overwhelm and bureaucracy."
PRESCRIBED_CONSTRAINTS: 1. Disallow any anatomical correction in inpainting; 2. Require all background elements to maintain hyper-orderly spreadsheet grid alignment
SHARPENED_REVERSE_BRIEF: "A Kafkaesque office portrait where the subject possesses 5 indistinct hands typing simultaneously into bureaucratic ledgers, while ambient office furniture remains mathematically rigid and austere."
ACCEPTANCE_CRITERION: "The extra limbs emerge seamlessly from tailored wool suit sleeves rather than floating disconnected in space."
[/REVERSE_BRIEF_AUDIT]
`;

const reverseResult = parseReverseBriefAudit(mockReverseBriefOutput);
assert.ok(reverseResult, 'Reverse brief result should not be undefined');
assert.strictEqual(reverseResult.verdict, 'GENUINE_INVERSION');
assert.ok(reverseResult.inversionStrength.includes('distorted multiplicity'));
assert.ok(reverseResult.sharpenedReverseBrief.includes('Kafkaesque office portrait'));
assert.ok(reverseResult.acceptanceCriterion.includes('tailored wool suit sleeves'));
assert.ok(Array.isArray(reverseResult.prescribedConstraints) && reverseResult.prescribedConstraints.length >= 2);
console.log('✅ parseReverseBriefAudit passed!');

// 3. Test parseAnchorAudit
const mockAnchorOutput = `
Anchor Library Sentinel Review:
The library has drifted into dangerous homogenisation territory with 75% AI generation.

[ANCHOR_AUDIT]
RATIO_STATUS: COLLAPSE_RISK_AI_DOMINATED
HUMAN_PERCENTAGE: 25
MATURATION_ASSESSMENT: "Demotion of early neon rain study was pedagogically sound because it isolated borrowed Midjourney dataset defaults."
HOMOGENISATION_WARNING: "Severe risk of algorithmic feedback loop; prompt iterations will reproduce generic center-weighted lighting."
RECOMMENDED_HUMAN_ANCHOR: "Vilhelm Hammershøi (Dust Motes Dancing in Sunbeams) for radical stillness and muted grey-brown value control."
[/ANCHOR_AUDIT]
`;

const anchorResult = parseAnchorAudit(mockAnchorOutput);
assert.ok(anchorResult, 'Anchor result should not be undefined');
assert.strictEqual(anchorResult.ratioStatus, 'COLLAPSE_RISK_AI_DOMINATED');
assert.strictEqual(anchorResult.humanPercentage, 25);
assert.ok(anchorResult.maturationAssessment.includes('neon rain study'));
assert.ok(anchorResult.homogenisationWarning.includes('algorithmic feedback loop'));
assert.ok(anchorResult.recommendedHumanAnchor.includes('Vilhelm Hammershøi'));
console.log('✅ parseAnchorAudit passed!');

console.log('--- All M5 parser tests passed successfully! ---');
