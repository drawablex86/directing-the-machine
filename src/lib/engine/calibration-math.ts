import type { CalibrationEntry } from '../schemas/course.schema';

/**
 * Calculates Brier calibration score (0 = perfect calibration, 1 = total error)
 * Brier = (1/N) * sum((forecast - actual)^2)
 */
export function calculateBrierScore(entries: CalibrationEntry[]): number {
	if (entries.length === 0) return 0;

	const sumSquaredErrors = entries.reduce((acc, curr) => {
		const forecast = curr.confidencePct / 100;
		const actual = curr.matchedExpectation ? 1 : 0;
		return acc + Math.pow(forecast - actual, 2);
	}, 0);

	return Number((sumSquaredErrors / entries.length).toFixed(3));
}

export interface CalibrationTelemetry {
	total: number;
	avgConfidence: number;
	hitRate: number;
	brierScore: number;
	surpriseRate: number;
	domainDiversity: number;
	narrownessWarning: boolean;
	narrownessReason?: string;
}

/**
 * Detects whether high calibration accuracy is merely masking Taste Narrowness
 * (repeating safe, predictable variables in a single domain).
 */
export function analyzeCalibration(entries: CalibrationEntry[]): CalibrationTelemetry {
	if (entries.length === 0) {
		return {
			total: 0,
			avgConfidence: 0,
			hitRate: 0,
			brierScore: 0,
			surpriseRate: 0,
			domainDiversity: 0,
			narrownessWarning: false
		};
	}

	const total = entries.length;
	const avgConfidence = Math.round(
		entries.reduce((acc, curr) => acc + curr.confidencePct, 0) / total
	);
	const hits = entries.filter((e) => e.matchedExpectation).length;
	const hitRate = Math.round((hits / total) * 100);
	const surprises = entries.filter((e) => e.wasSurprising).length;
	const surpriseRate = Math.round((surprises / total) * 100);

	const recent = entries.slice(-6);
	const domainsUsed = new Set(recent.map((e) => e.domain)).size;
	const brier = calculateBrierScore(entries);

	let narrownessWarning = false;
	let narrownessReason = '';

	if (total >= 4 && hitRate >= 80 && surpriseRate < 20) {
		narrownessWarning = true;
		narrownessReason =
			'High predictability with under 20% surprise. You may only be attempting what you already know how to predict. Introduce deliberately unfamiliar variables.';
	} else if (total >= 4 && domainsUsed <= 1) {
		narrownessWarning = true;
		narrownessReason =
			'Domain clustering: Last predictions were confined to a single domain. Interleave across visual, writing, audience, and pipeline domains.';
	}

	return {
		total,
		avgConfidence,
		hitRate,
		brierScore: brier,
		surpriseRate,
		domainDiversity: domainsUsed,
		narrownessWarning,
		narrownessReason
	};
}
