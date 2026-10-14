<script lang="ts">
	import {
		X,
		Copy,
		Check,
		ChevronLeft,
		ChevronRight,
		BookOpen,
		ExternalLink,
		FileText
	} from '@lucide/svelte';
	import type { Appendix } from '$lib/data/appendices';
	import { appendicesData } from '$lib/data/appendices';

	let {
		appendix,
		isOpen,
		onClose,
		onSelectAppendix
	}: {
		appendix: Appendix | null;
		isOpen: boolean;
		onClose: () => void;
		onSelectAppendix: (app: Appendix) => void;
	} = $props();

	let copied = $state(false);

	function copyFullContent() {
		if (!appendix) return;
		const fullText = `# ${appendix.title}\n\n${appendix.content}`;
		navigator.clipboard.writeText(fullText);
		copied = true;
		setTimeout(() => (copied = false), 2500);
	}

	function goToPrev() {
		if (!appendix) return;
		const currentIndex = appendicesData.findIndex((a) => a.id === appendix.id);
		if (currentIndex > 0) {
			onSelectAppendix(appendicesData[currentIndex - 1]);
		} else {
			onSelectAppendix(appendicesData[appendicesData.length - 1]);
		}
	}

	function goToNext() {
		if (!appendix) return;
		const currentIndex = appendicesData.findIndex((a) => a.id === appendix.id);
		if (currentIndex < appendicesData.length - 1) {
			onSelectAppendix(appendicesData[currentIndex + 1]);
		} else {
			onSelectAppendix(appendicesData[0]);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!isOpen) return;
		if (e.key === 'Escape') {
			onClose();
		} else if (e.key === 'ArrowLeft') {
			goToPrev();
		} else if (e.key === 'ArrowRight') {
			goToNext();
		}
	}

	// Lightweight, safe markdown formatter for local studio display
	function formatMarkdown(content: string): string {
		if (!content) return '';

		// 1. Strip TOC links
		let text = content.replace(/\[\[#Table of Contents\|↑ Back to TOC\]\]/g, '');

		// 2. Obsidian internal links [[#Target|Label]] -> highlight label
		text = text.replace(/\[\[#[^\]|]+\|([^\]]+)\]\]/g, '<span class="text-amber-400 font-semibold">$1</span>');
		text = text.replace(/\[\[#([^\]]+)\]\]/g, '<span class="text-amber-400 font-semibold">$1</span>');

		// 3. Fenced code blocks
		text = text.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gm, (_match, _lang, code) => {
			const escaped = code
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
			return `<pre class="my-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed"><code>${escaped}</code></pre>`;
		});

		// 4. GitHub style blockquote alerts: > [!NOTE], > [!TIP], > [!WARNING], > [!EXAMPLE]
		text = text.replace(
			/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|EXAMPLE)\]\s*([^\n]*)\n((?:>[^\n]*\n?)*)/gi,
			(_m, type, title, body) => {
				const alertType = type.toLowerCase();
				const borderCol =
					alertType === 'warning' || alertType === 'caution'
						? 'border-red-500/40 bg-red-950/20 text-red-200'
						: alertType === 'tip'
						? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
						: alertType === 'example'
						? 'border-sky-500/40 bg-sky-950/20 text-sky-200'
						: 'border-amber-500/40 bg-amber-950/20 text-amber-200';

				const cleanedBody = body
					.replace(/^>\s?/gm, '')
					.split('\n\n')
					.map((p: string) => `<p class="mt-1">${p.trim()}</p>`)
					.join('');

				const headerTitle = title.trim() || type.toUpperCase();

				return `<div class="my-4 p-4 rounded-xl border ${borderCol} space-y-1">
					<div class="font-bold text-xs uppercase tracking-wider">${headerTitle}</div>
					<div class="text-xs leading-relaxed opacity-90">${cleanedBody}</div>
				</div>`;
			}
		);

		// 5. Standard blockquotes
		text = text.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-2 border-amber-500/60 pl-3.5 my-3 text-neutral-300 italic text-xs leading-relaxed">$1</blockquote>');

		// 6. Markdown Tables
		text = text.replace(
			/((?:\|[^\n]+\|\r?\n)+)/g,
			(tableBlock) => {
				const lines = tableBlock.trim().split('\n').filter((l) => l.trim().length > 0);
				if (lines.length < 2) return tableBlock;

				const headerCells = lines[0]
					.split('|')
					.slice(1, -1)
					.map((c) => `<th class="p-2.5 text-left font-bold text-xs text-amber-400 bg-neutral-950 border-b border-neutral-800">${c.trim()}</th>`)
					.join('');

				// skip line 1 (the separator |---|---|)
				const bodyRows = lines.slice(2).map((row) => {
					const cells = row
						.split('|')
						.slice(1, -1)
						.map((c) => `<td class="p-2.5 text-xs text-neutral-300 border-b border-neutral-900">${c.trim()}</td>`)
						.join('');
					return `<tr class="hover:bg-neutral-900/40">${cells}</tr>`;
				}).join('');

				return `<div class="my-4 overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/60">
					<table class="w-full text-left border-collapse">
						<thead><tr>${headerCells}</tr></thead>
						<tbody>${bodyRows}</tbody>
					</table>
				</div>`;
			}
		);

		// 7. Headings
		text = text.replace(/^#### (.*$)/gim, '<h5 class="text-xs font-bold text-neutral-300 uppercase tracking-wider mt-5 mb-2">$1</h5>');
		text = text.replace(/^### (.*$)/gim, '<h4 class="text-sm font-bold text-neutral-100 mt-6 mb-2 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>$1</h4>');
		text = text.replace(/^## (.*$)/gim, '<h3 class="text-base font-bold text-amber-400 mt-8 mb-3 border-b border-neutral-800/80 pb-1.5">$1</h3>');

		// 8. Bold, Italics, Code
		text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-100 font-semibold">$1</strong>');
		text = text.replace(/\*(.*?)\*/g, '<em class="text-neutral-300 italic">$1</em>');
		text = text.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-neutral-950 text-amber-300 font-mono text-[11px] border border-neutral-800">$1</code>');

		// 9. Bullet lists
		text = text.replace(/^- (.*$)/gim, '<li class="text-xs text-neutral-300 leading-relaxed ml-4 list-disc">$1</li>');

		// 10. Horizontal rules
		text = text.replace(/^---$/gm, '<hr class="my-6 border-neutral-800/80" />');

		// 11. Paragraph line breaks
		const paragraphs = text
			.split(/\n\s*\n/)
			.map((chunk) => {
				const trimmed = chunk.trim();
				if (!trimmed) return '';
				// Don't wrap if already starting with block tags
				if (
					trimmed.startsWith('<h') ||
					trimmed.startsWith('<div') ||
					trimmed.startsWith('<pre') ||
					trimmed.startsWith('<blockquote') ||
					trimmed.startsWith('<li') ||
					trimmed.startsWith('<hr')
				) {
					return trimmed;
				}
				return `<p class="text-xs md:text-sm text-neutral-300 leading-relaxed mb-3">${trimmed}</p>`;
			})
			.join('\n');

		return paragraphs;
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen && appendix}
	<div
		class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="appendix-title"
		tabindex="-1"
	>
		<div class="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
			<!-- Top Action Bar -->
			<div class="p-4 md:px-6 md:py-4 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between gap-3 shrink-0">
				<div class="flex items-center gap-3 overflow-hidden">
					<div class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-sm shrink-0">
						{appendix.letter}
					</div>
					<div class="truncate">
						<span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Field Manual Reference</span>
						<h2 id="appendix-title" class="text-sm md:text-base font-bold text-white truncate">
							{appendix.title}
						</h2>
					</div>
				</div>

				<!-- Navigation and Action Buttons -->
				<div class="flex items-center gap-1.5 shrink-0">
					<!-- Prev / Next Appendix Buttons -->
					<div class="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5 mr-1">
						<button
							type="button"
							onclick={goToPrev}
							class="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition cursor-pointer"
							title="Previous Appendix (←)"
						>
							<ChevronLeft class="w-4 h-4" />
						</button>
						<button
							type="button"
							onclick={goToNext}
							class="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition cursor-pointer"
							title="Next Appendix (→)"
						>
							<ChevronRight class="w-4 h-4" />
						</button>
					</div>

					<!-- Copy Full Template / Protocol -->
					<button
						type="button"
						onclick={copyFullContent}
						class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition cursor-pointer"
						title="Copy entire Appendix text & templates to clipboard"
					>
						{#if copied}
							<Check class="w-3.5 h-3.5 text-emerald-400" />
							<span class="text-emerald-400 font-bold">Copied!</span>
						{:else}
							<Copy class="w-3.5 h-3.5 text-amber-400" />
							<span class="hidden sm:inline">Copy Text</span>
						{/if}
					</button>

					<!-- Close Dialog -->
					<button
						type="button"
						onclick={onClose}
						class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer ml-1"
						title="Close (ESC)"
					>
						<X class="w-5 h-5" />
					</button>
				</div>
			</div>

			<!-- Meta Summary & Tags Ribbon -->
			<div class="px-6 py-3 bg-neutral-950/40 border-b border-neutral-800/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
				<p class="text-xs text-neutral-400 italic">
					{appendix.summary}
				</p>
				<div class="flex flex-wrap gap-1.5">
					{#each appendix.tags as tag}
						<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
							#{tag}
						</span>
					{/each}
				</div>
			</div>

			<!-- Scrollable Document Reader Body -->
			<div class="p-6 md:p-8 overflow-y-auto space-y-4 flex-1 font-sans selection:bg-amber-500 selection:text-neutral-950 text-neutral-200">
				<!-- Formatted Content -->
				<div class="appendix-prose">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html formatMarkdown(appendix.content)}
				</div>
			</div>

			<!-- Footer Quick Appendix Switcher -->
			<div class="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 shrink-0">
				<div class="flex items-center gap-1 overflow-x-auto py-1">
					<span class="text-[10px] font-mono uppercase text-neutral-600 mr-1 hidden sm:inline">Jump:</span>
					{#each appendicesData as app}
						<button
							type="button"
							onclick={() => onSelectAppendix(app)}
							class="w-6 h-6 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center cursor-pointer {app.id === appendix.id ? 'bg-amber-500 text-neutral-950 shadow' : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'}"
							title="{app.title}"
						>
							{app.letter}
						</button>
					{/each}
				</div>

				<div class="text-[11px] text-neutral-400 hidden md:block">
					Use <kbd class="px-1 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-[10px]">←</kbd> <kbd class="px-1 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-[10px]">→</kbd> to cycle • <kbd class="px-1 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-[10px]">ESC</kbd> to exit
				</div>
			</div>
		</div>
	</div>
{/if}
