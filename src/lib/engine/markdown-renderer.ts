// High-fidelity Markdown and Pedagogical Reader Engine for Directing the Machine

export interface TocItem {
	id: string;
	title: string;
	level: 2 | 3 | 4;
}

export interface RenderedReading {
	html: string;
	toc: TocItem[];
	wordCount: number;
	readingTimeMinutes: number;
}

// Generates a clean URL slug for anchor navigation
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/<[^>]*>/g, '') // remove HTML tags if any
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

// Lucide icon SVG markup for self-contained, fast rendering inside HTML blocks
const alertIcons: Record<string, string> = {
	important: `<svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
	tip: `<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
	warning: `<svg class="w-4 h-4 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
	caution: `<svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`,
	example: `<svg class="w-4 h-4 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`,
	note: `<svg class="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
	rule: `<svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`
};

const copyIconSvg = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`;

export function renderMarkdownReading(rawMarkdown: string): RenderedReading {
	if (!rawMarkdown) {
		return { html: '', toc: [], wordCount: 0, readingTimeMinutes: 1 };
	}

	// 1. Calculate word count and reading time
	const plainWords = rawMarkdown
		.replace(/[#*`>~_-]/g, ' ')
		.replace(/\[\[.*?\]\]/g, ' ')
		.replace(/\[.*?\]\(.*?\)/g, ' ')
		.trim()
		.split(/\s+/)
		.filter((w) => w.length > 0);
	const wordCount = plainWords.length;
	const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

	let text = rawMarkdown;

	// 2. Strip redundant Obsidian TOC links
	text = text.replace(/\[\[#Table of Contents\|↑ Back to TOC\]\]/g, '');

	const toc: TocItem[] = [];
	const slugCounts: Record<string, number> = {};

	// Helper to generate a unique slug
	function makeUniqueSlug(title: string): string {
		let slug = slugify(title);
		if (!slug) slug = 'section';
		if (slugCounts[slug] !== undefined) {
			slugCounts[slug]++;
			return `${slug}-${slugCounts[slug]}`;
		} else {
			slugCounts[slug] = 0;
			return slug;
		}
	}

	// 3. Extract Fenced Code Blocks first into placeholders so they aren't mangled
	const codeBlocks: string[] = [];
	text = text.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gm, (_match, lang, code) => {
		const placeholder = `<!--CODE_BLOCK_${codeBlocks.length}-->`;
		const escaped = code
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		const langBadge = (lang || 'code').toUpperCase();

		const blockHtml = `
		<div class="code-block-container my-5 rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-lg group">
			<div class="px-4 py-2 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between text-[11px] font-mono">
				<span class="text-amber-400 font-bold uppercase tracking-wider">${langBadge}</span>
				<button
					type="button"
					onclick="navigator.clipboard.writeText(this.closest('.code-block-container').querySelector('code').innerText); const orig = this.innerHTML; this.innerHTML = '<span class=\\'text-emerald-400 font-bold\\'>Copied!</span>'; setTimeout(() => this.innerHTML = orig, 2000);"
					class="p-1 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer text-[10px]"
					title="Copy code to clipboard"
				>
					${copyIconSvg}
					<span>Copy</span>
				</button>
			</div>
			<pre class="p-4 overflow-x-auto text-neutral-200 font-mono text-xs leading-relaxed selection:bg-amber-500 selection:text-neutral-950"><code>${escaped}</code></pre>
		</div>`;
		codeBlocks.push(blockHtml);
		return placeholder;
	});

	// 4. Extract Tables into placeholders
	const tableBlocks: string[] = [];
	text = text.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (rawTable) => {
		const lines = rawTable.trim().split('\n').filter((l) => l.trim().length > 0);
		if (lines.length < 2) return rawTable;

		const placeholder = `<!--TABLE_BLOCK_${tableBlocks.length}-->`;

		// Header row
		const headerCells = lines[0]
			.split('|')
			.slice(1, -1)
			.map((c) => `<th class="p-3 text-left font-bold text-xs uppercase tracking-wider text-amber-400 bg-neutral-900/90 border-b border-neutral-800">${c.trim()}</th>`)
			.join('');

		// Data rows (skip index 1 separator)
		const bodyRows = lines
			.slice(2)
			.map((row) => {
				const cells = row
					.split('|')
					.slice(1, -1)
					.map((c) => `<td class="p-3 text-xs text-neutral-300 border-b border-neutral-800/60 font-sans leading-relaxed">${c.trim()}</td>`)
					.join('');
				return `<tr class="hover:bg-neutral-900/50 transition">${cells}</tr>`;
			})
			.join('');

		const tableHtml = `
		<div class="my-6 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950/80 shadow-md">
			<table class="w-full text-left border-collapse">
				<thead><tr>${headerCells}</tr></thead>
				<tbody class="divide-y divide-neutral-800/40">${bodyRows}</tbody>
			</table>
		</div>`;
		tableBlocks.push(tableHtml);
		return placeholder;
	});

	// 5. GitHub Alert / Callout Blocks
	// Format: > [!TYPE] Header\n> body lines
	text = text.replace(
		/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|EXAMPLE|RULE)\]\s*([^\n]*)\n((?:>[^\n]*\n?)*)/gi,
		(_m, type, title, body) => {
			const alertType = type.toLowerCase();
			const icon = alertIcons[alertType] || alertIcons.note;

			let themeClass = 'border-neutral-700 bg-neutral-900/40 text-neutral-200';
			let badgeClass = 'text-neutral-400 bg-neutral-800/60 border-neutral-700';

			if (alertType === 'important' || alertType === 'rule') {
				themeClass = 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 to-neutral-950 text-neutral-100 shadow-amber-950/10 shadow-lg';
				badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
			} else if (alertType === 'tip') {
				themeClass = 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 to-neutral-950 text-neutral-100';
				badgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
			} else if (alertType === 'warning') {
				themeClass = 'border-orange-500/40 bg-gradient-to-br from-orange-950/20 to-neutral-950 text-neutral-100';
				badgeClass = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
			} else if (alertType === 'caution') {
				themeClass = 'border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-neutral-950 text-neutral-100';
				badgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
			} else if (alertType === 'example') {
				themeClass = 'border-sky-500/40 bg-gradient-to-br from-sky-950/20 to-neutral-950 text-neutral-100';
				badgeClass = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
			}

			const cleanedBody = body
				.replace(/^>\s?/gm, '')
				.split(/\n\s*\n/)
				.map((p: string) => p.trim())
				.filter(Boolean)
				.map((p: string) => `<p class="mt-2 text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">${p}</p>`)
				.join('');

			const headerTitle = title.trim() || type.toUpperCase();

			return `
			<div class="my-5 p-4 md:p-5 rounded-2xl border ${themeClass} space-y-2">
				<div class="flex items-center gap-2">
					${icon}
					<span class="text-[11px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-lg border ${badgeClass}">
						${headerTitle}
					</span>
				</div>
				<div class="callout-body pl-6 space-y-2 text-xs md:text-sm">
					${cleanedBody}
				</div>
			</div>`;
		}
	);

	// 6. Standard Single-line Blockquotes
	text = text.replace(
		/^>\s+(.+)$/gm,
		'<blockquote class="border-l-2 border-amber-500/80 bg-neutral-950/60 rounded-r-xl pl-4 py-3 my-4 text-neutral-300 italic text-xs md:text-sm leading-relaxed">$1</blockquote>'
	);

	// 7. Headings with Slug Anchors & TOC collection
	text = text.replace(/^#### (.*$)/gim, (_match, title) => {
		const cleanTitle = title.trim();
		const slug = makeUniqueSlug(cleanTitle);
		toc.push({ id: slug, title: cleanTitle, level: 4 });
		return `<h4 id="${slug}" class="scroll-mt-24 text-xs font-mono font-bold text-amber-400/90 uppercase tracking-wider mt-6 mb-2 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>${cleanTitle}</h4>`;
	});

	text = text.replace(/^### (.*$)/gim, (_match, title) => {
		const cleanTitle = title.trim();
		const slug = makeUniqueSlug(cleanTitle);
		toc.push({ id: slug, title: cleanTitle, level: 3 });
		return `<h3 id="${slug}" class="scroll-mt-24 text-base md:text-lg font-bold text-neutral-100 mt-8 mb-3 flex items-center gap-2.5 pb-1 border-b border-neutral-800/40"><span class="w-2 h-2 rounded-full bg-amber-400"></span>${cleanTitle}</h3>`;
	});

	text = text.replace(/^## (.*$)/gim, (_match, title) => {
		const cleanTitle = title.trim();
		const slug = makeUniqueSlug(cleanTitle);
		toc.push({ id: slug, title: cleanTitle, level: 2 });
		return `<h2 id="${slug}" class="scroll-mt-24 text-lg md:text-xl font-black text-amber-400 mt-10 mb-4 pb-2 border-b border-neutral-800 flex items-center justify-between"><span>${cleanTitle}</span><a href="#${slug}" class="text-neutral-600 hover:text-amber-400 text-xs font-mono font-normal transition" title="Direct link to section">#</a></h2>`;
	});

	// Top level H1 (if inside content)
	text = text.replace(/^# (.*$)/gim, (_match, title) => {
		const cleanTitle = title.trim();
		const slug = makeUniqueSlug(cleanTitle);
		return `<h1 id="${slug}" class="scroll-mt-24 text-xl md:text-2xl font-black text-white mt-8 mb-4">${cleanTitle}</h1>`;
	});

	// 8. Ordered Lists (group consecutive items in <ol>)
	text = text.replace(/((?:^\d+\.\s+[^\n]+\r?\n?)+)/gm, (listChunk) => {
		const items = listChunk
			.trim()
			.split(/\n(?=\d+\.\s+)/)
			.map((item) => {
				const itemContent = item.replace(/^\d+\.\s+/, '').trim();
				return `<li class="text-xs md:text-sm text-neutral-300 leading-relaxed pl-2 font-sans">${itemContent}</li>`;
			})
			.join('');
		return `<ol class="my-4 space-y-2 list-decimal list-outside ml-6 font-mono text-amber-400 marker:font-bold marker:text-amber-400">${items}</ol>`;
	});

	// 9. Unordered Lists (group consecutive items in <ul>)
	text = text.replace(/((?:^-\s+[^\n]+\r?\n?)+)/gm, (listChunk) => {
		const items = listChunk
			.trim()
			.split(/\n(?=-\s+)/)
			.map((item) => {
				const itemContent = item.replace(/^-\s+/, '').trim();
				return `<li class="text-xs md:text-sm text-neutral-300 leading-relaxed pl-1.5 font-sans">${itemContent}</li>`;
			})
			.join('');
		return `<ul class="my-4 space-y-2 list-disc list-outside ml-5 text-neutral-400 marker:text-amber-400/80">${items}</ul>`;
	});

	// 10. Inline formatting (bold, italic, code, kbd, links)
	// Bold: **text**
	text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-neutral-100">$1</strong>');
	// Italic: *text* (avoid matching code or anchors)
	text = text.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em class="italic text-neutral-200 font-serif">$1</em>');
	// Inline Code: `code`
	text = text.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-neutral-950 text-amber-300 font-mono text-[11px] border border-neutral-800/80">$1</code>');
	// Keyboard shortcut: <kbd>key</kbd>
	text = text.replace(/<kbd>(.*?)<\/kbd>/gi, '<kbd class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-[10px] text-neutral-300 font-bold">$1</kbd>');

	// 11. Obsidian internal wiki links: [[#Target|Label]] & [[#Target]]
	text = text.replace(/\[\[#([^\]|]+)\|([^\]]+)\]\]/g, (_m, target, label) => {
		const slug = slugify(target);
		return `<a href="#${slug}" class="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 decoration-amber-500/40 hover:decoration-amber-300 transition">${label}</a>`;
	});
	text = text.replace(/\[\[#([^\]]+)\]\]/g, (_m, target) => {
		const slug = slugify(target);
		return `<a href="#${slug}" class="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 decoration-amber-500/40 hover:decoration-amber-300 transition">${target}</a>`;
	});

	// Standard Markdown links: [Label](url)
	text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:text-amber-300 underline underline-offset-2 decoration-amber-500/40 hover:decoration-amber-300 transition inline-flex items-center gap-1">$1<svg class="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>');

	// 12. Horizontal Rules
	text = text.replace(
		/^---$/gm,
		'<div class="my-8 flex items-center justify-center gap-3"><div class="h-px bg-neutral-800/80 flex-1"></div><div class="w-1.5 h-1.5 rounded-full bg-amber-500/60"></div><div class="h-px bg-neutral-800/80 flex-1"></div></div>'
	);

	// 13. Reinsert placeholders for Code Blocks and Tables
	codeBlocks.forEach((block, idx) => {
		text = text.replace(`<!--CODE_BLOCK_${idx}-->`, block);
	});

	tableBlocks.forEach((table, idx) => {
		text = text.replace(`<!--TABLE_BLOCK_${idx}-->`, table);
	});

	// 14. Paragraph normalization
	const finalHtml = text
		.split(/\n\s*\n/)
		.map((chunk) => {
			const trimmed = chunk.trim();
			if (!trimmed) return '';
			if (
				trimmed.startsWith('<h') ||
				trimmed.startsWith('<div') ||
				trimmed.startsWith('<pre') ||
				trimmed.startsWith('<blockquote') ||
				trimmed.startsWith('<ol') ||
				trimmed.startsWith('<ul') ||
				trimmed.startsWith('<li') ||
				trimmed.startsWith('<table')
			) {
				return trimmed;
			}
			return `<p class="text-xs md:text-sm text-neutral-300 leading-relaxed mb-4 font-sans">${trimmed}</p>`;
		})
		.join('\n');

	return {
		html: finalHtml,
		toc,
		wordCount,
		readingTimeMinutes
	};
}
