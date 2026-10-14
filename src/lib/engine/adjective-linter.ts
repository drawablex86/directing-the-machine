/**
 * Zero-Adjective Observation Linter (Module 1 / Module 4)
 * Flags evaluative shortcuts that substitute for precise perceptual observation.
 */

export const FORBIDDEN_EVALUATIVE_ADJECTIVES = [
	'good',
	'bad',
	'beautiful',
	'ugly',
	'impressive',
	'weak',
	'strong',
	'polished',
	'boring',
	'amazing',
	'terrible',
	'gorgeous',
	'generic',
	'mediocre',
	'masterful',
	'stunning',
	'awful',
	'nice',
	'poor',
	'clunky',
	'sleek'
];

export interface LintResult {
	valid: boolean;
	flaggedWords: string[];
	highlightedText: string;
}

export function lintObservation(text: string): LintResult {
	if (!text.trim()) {
		return { valid: true, flaggedWords: [], highlightedText: '' };
	}

	const flagged = new Set<string>();
	const regexPattern = new RegExp(`\\b(${FORBIDDEN_EVALUATIVE_ADJECTIVES.join('|')})\\b`, 'gi');

	const highlighted = text.replace(regexPattern, (match) => {
		flagged.add(match.toLowerCase());
		return `⚠️[${match}]`;
	});

	return {
		valid: flagged.size === 0,
		flaggedWords: Array.from(flagged),
		highlightedText: highlighted
	};
}
