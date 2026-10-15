<script lang="ts">
	import {
		X,
		Copy,
		Check,
		ChevronLeft,
		ChevronRight,
		BookOpen,
		ExternalLink,
		FileText,
		ListOrdered,
		Maximize2,
		Minimize2,
		Clock
	} from '@lucide/svelte';
	import type { Appendix } from '$lib/data/appendices';
	import { appendicesData } from '$lib/data/appendices';
	import { renderMarkdownReading } from '$lib/engine/markdown-renderer';

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
	let isFullscreen = $state(false);
	let showOutline = $state(true);
	let scrollProgress = $state(0);
	let activeSectionId = $state<string | null>(null);

	let scrollContainerRef: HTMLDivElement | null = $state(null);

	let parsedAppendix = $derived.by(() => {
		if (!appendix) return null;
		return renderMarkdownReading(appendix.content);
	});

	function handleScroll() {
		if (!scrollContainerRef) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef;
		const maxScroll = scrollHeight - clientHeight;
		scrollProgress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)) : 0;

		// Track active heading
		if (parsedAppendix?.toc && parsedAppendix.toc.length > 0) {
			const headings = parsedAppendix.toc
				.map((item) => {
					const el = scrollContainerRef?.querySelector(`#${item.id}`);
					return el ? { id: item.id, top: el.getBoundingClientRect().top } : null;
				})
				.filter(Boolean);

			const current = headings.reverse().find((h) => h && h.top <= 200);
			if (current) {
				activeSectionId = current.id;
			}
		}
	}

	function scrollToSection(id: string) {
		if (!scrollContainerRef) return;
		const el = scrollContainerRef.querySelector(`#${id}`);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			activeSectionId = id;
		}
	}

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
		if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
	}

	function goToNext() {
		if (!appendix) return;
		const currentIndex = appendicesData.findIndex((a) => a.id === appendix.id);
		if (currentIndex < appendicesData.length - 1) {
			onSelectAppendix(appendicesData[currentIndex + 1]);
		} else {
			onSelectAppendix(appendicesData[0]);
		}
		if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
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
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen && appendix && parsedAppendix}
	<div
		class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center {isFullscreen ? 'p-0' : 'p-2 md:p-5'}"
		role="dialog"
		aria-modal="true"
		aria-labelledby="appendix-title"
		tabindex="-1"
	>
		<div
			class="bg-neutral-900 border border-neutral-800 {isFullscreen ? 'h-screen rounded-none border-0' : 'rounded-3xl max-w-6xl max-h-[94vh]'} w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-150 animate-in fade-in zoom-in-95"
		>
			<!-- Ambient Top Reading Scroll Progress Bar -->
			<div class="h-1 bg-neutral-800/50 w-full overflow-hidden shrink-0 relative z-30">
				<div
					class="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-75"
					style="width: {scrollProgress}%;"
				></div>
			</div>

			<!-- Top Action Bar -->
			<div class="px-4 py-3 md:px-6 md:py-3.5 border-b border-neutral-800 bg-neutral-950/90 flex items-center justify-between gap-3 shrink-0">
				<div class="flex items-center gap-3 overflow-hidden min-w-0">
					<div class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-sm shrink-0">
						{appendix.letter}
					</div>
					<div class="truncate">
						<div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 truncate">
							<span>Field Manual Protocol</span>
							<span>•</span>
							<span>Appendix {appendix.letter}</span>
							<span class="hidden sm:inline">•</span>
							<span class="hidden sm:inline text-amber-400/90">⏱ {parsedAppendix.readingTimeMinutes} min read ({parsedAppendix.wordCount.toLocaleString()} words)</span>
						</div>
						<h2 id="appendix-title" class="text-sm md:text-base font-bold text-white truncate">
							{appendix.title}
						</h2>
					</div>
				</div>

				<!-- Navigation and Action Buttons -->
				<div class="flex items-center gap-1.5 shrink-0">
					<!-- Toggle Outline / TOC Button -->
					<button
						type="button"
						onclick={() => showOutline = !showOutline}
						class="p-2 rounded-xl text-xs font-semibold transition cursor-pointer {showOutline ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'}"
						title="{showOutline ? 'Hide' : 'Show'} Table of Contents"
					>
						<ListOrdered class="w-4 h-4" />
					</button>

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

					<!-- Fullscreen Toggle Button -->
					<button
						type="button"
						onclick={() => isFullscreen = !isFullscreen}
						class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer hidden md:flex"
						title="{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}"
					>
						{#if isFullscreen}
							<Minimize2 class="w-4 h-4" />
						{:else}
							<Maximize2 class="w-4 h-4" />
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

			<!-- Main 2-Column Body -->
			<div class="flex-1 flex overflow-hidden relative">
				<!-- Collapsible Table of Contents Sidebar -->
				{#if showOutline && parsedAppendix.toc.length > 0}
					<aside class="w-64 lg:w-72 border-r border-neutral-800/80 bg-neutral-950/60 p-4 overflow-y-auto reader-scrollbar shrink-0 hidden md:block animate-in fade-in duration-150">
						<div class="space-y-3">
							<div class="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold pb-2 border-b border-neutral-800/80">
								<span>Table of Contents</span>
								<span class="text-amber-400">{parsedAppendix.toc.length} sections</span>
							</div>

							<nav class="space-y-1">
								{#each parsedAppendix.toc as item}
									{@const isActive = activeSectionId === item.id}
									<button
										type="button"
										onclick={() => scrollToSection(item.id)}
										class="w-full text-left py-1.5 px-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer {item.level === 3 ? 'pl-5 text-xs' : item.level === 4 ? 'pl-8 text-[11px]' : 'text-xs font-semibold'} {isActive ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'}"
									>
										{#if isActive}
											<span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
										{:else}
											<span class="w-1.5 h-1.5 rounded-full bg-neutral-700 shrink-0"></span>
										{/if}
										<span class="truncate">{item.title}</span>
									</button>
								{/each}
							</nav>
						</div>
					</aside>
				{/if}

				<!-- Scrollable Document Reader Body -->
				<div
					bind:this={scrollContainerRef}
					onscroll={handleScroll}
					class="flex-1 overflow-y-auto reader-scrollbar p-6 md:p-10 font-sans selection:bg-amber-500 selection:text-neutral-950 text-neutral-200 relative scroll-smooth"
				>
					<div class="mx-auto max-w-4xl space-y-6">
						<!-- Summary Ribbon -->
						<div class="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
							<p class="text-xs md:text-sm text-neutral-300 leading-relaxed italic">
								{appendix.summary}
							</p>
							<div class="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-900">
								{#each appendix.tags as tag}
									<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
										#{tag}
									</span>
								{/each}
							</div>
						</div>

						<!-- Formatted Content -->
						<article class="reader-prose space-y-4">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html parsedAppendix.html}
						</article>
					</div>
				</div>
			</div>

			<!-- Footer Quick Appendix Switcher -->
			<div class="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 shrink-0">
				<div class="flex items-center gap-1 overflow-x-auto py-1">
					<span class="text-[10px] font-mono uppercase text-neutral-600 mr-1 hidden sm:inline">Jump:</span>
					{#each appendicesData as app}
						<button
							type="button"
							onclick={() => {
								onSelectAppendix(app);
								if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
							}}
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
