import type { HelpEntry, HelpCategory } from '../data/help-knowledge-base';

export interface SearchOptions {
	query: string;
	category?: HelpCategory | 'all';
}

/**
 * Normalizes input text by lowercasing, trimming, and collapsing whitespace.
 */
function normalize(str: string): string {
	return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Performs loose, multi-token, case-insensitive search across help entries.
 * Evaluates term titles, aliases, definitions, operational descriptions,
 * pedagogical benefits, categories, tags, and studio touchpoints.
 */
export function searchHelpEntries(
	entries: HelpEntry[],
	options: SearchOptions
): HelpEntry[] {
	const rawQuery = options.query || '';
	const normalizedQuery = normalize(rawQuery);
	const categoryFilter = options.category || 'all';

	// 1. Filter by category first if specified
	let candidates = entries;
	if (categoryFilter !== 'all') {
		candidates = candidates.filter((e) => e.category === categoryFilter);
	}

	// 2. If query is empty, return all matching category candidates
	if (!normalizedQuery) {
		return candidates;
	}

	// 3. Extract search tokens (ignoring punctuation)
	const tokens = normalizedQuery
		.split(' ')
		.map((t) => t.replace(/[^a-z0-9_-]/g, ''))
		.filter((t) => t.length > 0);

	if (tokens.length === 0) {
		return candidates;
	}

	// 4. Score each candidate
	const scored = candidates
		.map((entry) => {
			let score = 0;
			const termNorm = normalize(entry.term);
			const summaryNorm = normalize(entry.summary);
			const defNorm = normalize(entry.plainDefinition);
			const doesNorm = normalize(entry.whatItDoes);
			const helpsNorm = normalize(entry.howItHelps);
			const touchpointNorm = normalize(entry.studioTouchpoint);
			const categoryNorm = normalize(entry.category);
			const aliasesNorm = entry.aliases.map(normalize);
			const tagsNorm = entry.tags.map(normalize);

			// Exact full query matches (highest priority)
			if (termNorm === normalizedQuery) {
				score += 500;
			} else if (termNorm.startsWith(normalizedQuery)) {
				score += 250;
			} else if (termNorm.includes(normalizedQuery)) {
				score += 150;
			}

			// Alias exact or substring matches
			for (const alias of aliasesNorm) {
				if (alias === normalizedQuery) {
					score += 300;
				} else if (alias.startsWith(normalizedQuery)) {
					score += 180;
				} else if (alias.includes(normalizedQuery)) {
					score += 120;
				}
			}

			// Category match
			if (categoryNorm.includes(normalizedQuery)) {
				score += 60;
			}

			// Individual token evaluation
			let allTokensPresent = true;

			for (const token of tokens) {
				let tokenFound = false;

				if (termNorm.includes(token)) {
					score += 40;
					tokenFound = true;
				}

				for (const alias of aliasesNorm) {
					if (alias.includes(token)) {
						score += 35;
						tokenFound = true;
					}
				}

				for (const tag of tagsNorm) {
					if (tag.includes(token)) {
						score += 25;
						tokenFound = true;
					}
				}

				if (summaryNorm.includes(token)) {
					score += 15;
					tokenFound = true;
				}

				if (defNorm.includes(token)) {
					score += 12;
					tokenFound = true;
				}

				if (doesNorm.includes(token)) {
					score += 10;
					tokenFound = true;
				}

				if (helpsNorm.includes(token)) {
					score += 10;
					tokenFound = true;
				}

				if (touchpointNorm.includes(token)) {
					score += 8;
					tokenFound = true;
				}

				if (!tokenFound) {
					allTokensPresent = false;
				}
			}

			// Bonus if every individual token was located somewhere in the entry
			if (allTokensPresent && tokens.length > 1) {
				score += 70;
			}

			return { entry, score };
		})
		.filter((item) => item.score > 0);

	// 5. Sort descending by score
	scored.sort((a, b) => b.score - a.score);

	return scored.map((item) => item.entry);
}

/**
 * Finds a specific entry by slug ID or alias.
 */
export function findHelpEntry(
	entries: HelpEntry[],
	idOrAlias: string
): HelpEntry | undefined {
	const target = normalize(idOrAlias);
	return entries.find(
		(e) =>
			e.id === target ||
			normalize(e.term) === target ||
			e.aliases.some((a) => normalize(a) === target)
	);
}
