<script lang="ts">
	import {
		X,
		Search,
		BookOpen,
		ArrowRight,
		Layers,
		CheckCircle2,
		Copy,
		ExternalLink,
		Compass,
		HelpCircle,
		Sparkles,
		Tag,
		Hash,
		ArrowLeft,
		Sliders,
		Terminal,
		Check
	} from '@lucide/svelte';
	import {
		HELP_KNOWLEDGE_BASE,
		HELP_CATEGORIES,
		type HelpEntry,
		type HelpCategory
	} from '$lib/data/help-knowledge-base';
	import { searchHelpEntries, findHelpEntry } from '$lib/engine/help-search';
	import { practiceStore } from '$lib/state/practice.svelte';

	let {
		isOpen = false,
		onClose
	}: {
		isOpen: boolean;
		onClose: () => void;
	} = $props();

	let searchQuery = $state('');
	let activeCategory = $state<HelpCategory | 'all'>('all');
	let selectedTermId = $state<string>(HELP_KNOWLEDGE_BASE[0].id);
	let copiedLink = $state(false);
	let searchInputEl = $state<HTMLInputElement | null>(null);

	// Synchronize when practiceStore updates activeHelpTermId or helpSearchQuery
	$effect(() => {
		if (isOpen) {
			if (practiceStore.activeHelpTermId) {
				const entry = findHelpEntry(HELP_KNOWLEDGE_BASE, practiceStore.activeHelpTermId);
				if (entry) {
					selectedTermId = entry.id;
					activeCategory = 'all';
				}
			}
			if (practiceStore.helpSearchQuery) {
				searchQuery = practiceStore.helpSearchQuery;
			}
			// Focus search input on open
			setTimeout(() => {
				searchInputEl?.focus();
			}, 50);
		}
	});

	// Filtered results via loose multi-token search engine
	let filteredEntries = $derived(
		searchHelpEntries(HELP_KNOWLEDGE_BASE, {
			query: searchQuery,
			category: activeCategory
		})
	);

	// Currently inspected term
	let activeEntry = $derived(
		filteredEntries.find((e) => e.id === selectedTermId) ||
		HELP_KNOWLEDGE_BASE.find((e) => e.id === selectedTermId) ||
		filteredEntries[0] ||
		HELP_KNOWLEDGE_BASE[0]
	);

	function selectTerm(id: string) {
		selectedTermId = id;
		practiceStore.activeHelpTermId = id;
	}

	function clearSearch() {
		searchQuery = '';
		practiceStore.helpSearchQuery = '';
		searchInputEl?.focus();
	}

	function handleCategoryClick(catId: HelpCategory | 'all') {
		activeCategory = catId;
	}

	function copyTermLink(termId: string) {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		url.searchParams.set('help', termId);
		navigator.clipboard.writeText(url.toString()).then(() => {
			copiedLink = true;
			setTimeout(() => {
				copiedLink = false;
			}, 2000);
		});
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		} else if (e.key === 'ArrowDown') {
			// Navigate down in filtered list
			const idx = filteredEntries.findIndex((e) => e.id === selectedTermId);
			if (idx >= 0 && idx < filteredEntries.length - 1) {
				e.preventDefault();
				selectTerm(filteredEntries[idx + 1].id);
			}
		} else if (e.key === 'ArrowUp') {
			// Navigate up in filtered list
			const idx = filteredEntries.findIndex((e) => e.id === selectedTermId);
			if (idx > 0) {
				e.preventDefault();
				selectTerm(filteredEntries[idx - 1].id);
			}
		}
	}
</script>

<svelte:window onkeydown={(e) => { if (isOpen && e.key === 'Escape') onClose(); }} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="help-modal-title"
		tabindex="-1"
		onkeydown={handleKeyDown}
	>
		<!-- Modal Window Box -->
		<div
			class="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
		>
			<!-- Top Header -->
			<div class="px-5 py-4 border-b border-neutral-800 bg-neutral-950/90 flex items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<div
						class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0"
					>
						<HelpCircle class="w-5 h-5" />
					</div>
					<div>
						<div class="flex items-center gap-2">
							<h2 id="help-modal-title" class="text-base sm:text-lg font-bold text-white tracking-tight">
								Course & Studio Encyclopedia
							</h2>
							<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400 border border-neutral-700">
								{HELP_KNOWLEDGE_BASE.length} Terms
							</span>
						</div>
						<p class="text-xs text-neutral-400 line-clamp-1">
							Plain definitions, operational explanations, and directorial mechanics for all concepts, ladders, and checks.
						</p>
					</div>
				</div>

				<button
					type="button"
					onclick={onClose}
					class="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
					aria-label="Close encyclopedia"
					title="Close (Esc)"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Search & Category Filter Toolbar -->
			<div class="px-5 py-3 border-b border-neutral-800 bg-neutral-900/60 space-y-2.5">
				<!-- Search Bar with Instant Clear -->
				<div class="relative flex items-center">
					<Search class="w-4 h-4 text-neutral-500 absolute left-3.5 pointer-events-none" />
					<input
						bind:this={searchInputEl}
						type="text"
						bind:value={searchQuery}
						placeholder="Search terms, concepts, ladders, lint checks (e.g. 'ladder', 'lint check', 'hemingway', 'brier', 'adhd')..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-20 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition font-sans"
					/>
					<div class="absolute right-3 flex items-center gap-1.5">
						{#if searchQuery}
							<button
								type="button"
								onclick={clearSearch}
								class="text-neutral-400 hover:text-white p-1 rounded transition text-xs font-mono"
								title="Clear search"
							>
								✕
							</button>
						{/if}
						<span class="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
							{filteredEntries.length} found
						</span>
					</div>
				</div>

				<!-- Category Tabs Horizontal Strip -->
				<div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
					<button
						type="button"
						onclick={() => handleCategoryClick('all')}
						class="px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer {activeCategory === 'all'
							? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
							: 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80 hover:bg-neutral-800'}"
					>
						All Categories ({HELP_KNOWLEDGE_BASE.length})
					</button>
					{#each HELP_CATEGORIES as cat}
						{@const catCount = HELP_KNOWLEDGE_BASE.filter((e) => e.category === cat.id).length}
						<button
							type="button"
							onclick={() => handleCategoryClick(cat.id)}
							class="px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 {activeCategory === cat.id
								? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
								: 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80 hover:bg-neutral-800'}"
						>
							<span>{cat.shortName}</span>
							<span class="text-[10px] opacity-75 font-mono">({catCount})</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Main Split-Pane Layout -->
			<div class="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-[350px]">
				<!-- Left Master Column: Filtered Terms List (4 of 12 cols on desktop) -->
				<div class="lg:col-span-5 border-r border-neutral-800 bg-neutral-950/40 overflow-y-auto max-h-[55vh] lg:max-h-[62vh] p-2 space-y-1">
					{#if filteredEntries.length === 0}
						<div class="text-center py-16 px-4 space-y-2">
							<p class="text-sm font-semibold text-neutral-300">No definitions found</p>
							<p class="text-xs text-neutral-500 max-w-xs mx-auto">
								No matches for "{searchQuery}". Try a loose search for keywords like "ladder", "lint", "brief", or "curation".
							</p>
							<button
								type="button"
								onclick={clearSearch}
								class="mt-2 px-3 py-1.5 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-amber-400 hover:bg-neutral-800 transition"
							>
								Clear Search Filter
							</button>
						</div>
					{:else}
						{#each filteredEntries as entry}
							{@const isSelected = entry.id === activeEntry?.id}
							{@const catMeta = HELP_CATEGORIES.find((c) => c.id === entry.category)}
							<button
								type="button"
								onclick={() => selectTerm(entry.id)}
								class="w-full text-left p-3 rounded-2xl transition cursor-pointer border {isSelected
									? 'bg-neutral-850/90 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
									: 'bg-neutral-950/40 hover:bg-neutral-900/60 border-neutral-800/60 text-neutral-300'}"
							>
								<div class="flex items-center justify-between gap-2 mb-1">
									<span class="text-xs font-bold {isSelected ? 'text-amber-400' : 'text-neutral-200'}">
										{entry.term}
									</span>
									<span class="text-[9.5px] font-mono px-2 py-0.5 rounded-full border {catMeta?.color || 'text-neutral-400 border-neutral-800'}">
										{catMeta?.shortName || entry.category}
									</span>
								</div>
								<p class="text-[11.5px] text-neutral-400 line-clamp-2 leading-relaxed">
									{entry.summary}
								</p>
							</button>
						{/each}
					{/if}
				</div>

				<!-- Right Inspector Column: Selected Term Detailed View (7 of 12 cols on desktop) -->
				<div class="lg:col-span-7 overflow-y-auto max-h-[55vh] lg:max-h-[62vh] p-5 sm:p-6 space-y-6 bg-neutral-900/40">
					{#if activeEntry}
						{@const catMeta = HELP_CATEGORIES.find((c) => c.id === activeEntry.category)}

						<!-- Term Title Bar -->
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<h3 class="text-lg sm:text-xl font-serif font-black text-white tracking-tight">
										{activeEntry.term}
									</h3>
									<span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border {catMeta?.color}">
										{catMeta?.name}
									</span>
								</div>
								<p class="text-xs text-neutral-400 font-mono">
									Keywords: {activeEntry.aliases.join(', ')}
								</p>
							</div>

							<!-- Action Buttons -->
							<div class="flex items-center gap-2 shrink-0">
								<button
									type="button"
									onclick={() => copyTermLink(activeEntry.id)}
									class="px-2.5 py-1.5 rounded-xl text-xs bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
									title="Copy deep-link to this definition"
								>
									{#if copiedLink}
										<Check class="w-3.5 h-3.5 text-emerald-400" />
										<span class="text-emerald-400 font-medium">Copied!</span>
									{:else}
										<Copy class="w-3.5 h-3.5 text-neutral-400" />
										<span>Share</span>
									{/if}
								</button>

								{#if activeEntry.externalDocLink}
									<a
										href={activeEntry.externalDocLink.url}
										onclick={onClose}
										class="px-3 py-1.5 rounded-xl text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-semibold transition flex items-center gap-1.5"
									>
										<span>{activeEntry.externalDocLink.label}</span>
										<ArrowRight class="w-3 h-3" />
									</a>
								{/if}
							</div>
						</div>

						<!-- Core Breakdown Card: 3 Questions -->
						<div class="space-y-4">
							<!-- 1. What is it? -->
							<div class="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5">
								<div class="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
									<BookOpen class="w-3.5 h-3.5" />
									<span>What is it? (Plain Definition)</span>
								</div>
								<p class="text-sm text-neutral-200 leading-relaxed font-sans">
									{activeEntry.plainDefinition}
								</p>
							</div>

							<!-- 2. What does it do? -->
							<div class="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5">
								<div class="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
									<Sliders class="w-3.5 h-3.5" />
									<span>What does it do? (Operational Mechanics)</span>
								</div>
								<p class="text-sm text-neutral-200 leading-relaxed font-sans">
									{activeEntry.whatItDoes}
								</p>
							</div>

							<!-- 3. How does it help? -->
							<div class="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5">
								<div class="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
									<CheckCircle2 class="w-3.5 h-3.5" />
									<span>How does it help? (Directorial Value)</span>
								</div>
								<p class="text-sm text-neutral-200 leading-relaxed font-sans">
									{activeEntry.howItHelps}
								</p>
							</div>
						</div>

						<!-- Concrete Illustrative Example (if present) -->
						{#if activeEntry.example}
							<div class="p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2.5">
								<div class="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
									<Sparkles class="w-3.5 h-3.5" />
									<span>Practical Studio Example</span>
								</div>
								<p class="text-xs text-neutral-400 italic">
									Context: {activeEntry.example.context}
								</p>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
									{#if activeEntry.example.beforeOrWrong}
										<div class="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-red-200 space-y-1">
											<span class="text-[10px] uppercase font-mono font-bold text-red-400">Symptom / Flawed Attempt:</span>
											<p class="font-mono text-[11px]">{activeEntry.example.beforeOrWrong}</p>
										</div>
									{/if}
									{#if activeEntry.example.afterOrRight}
										<div class="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-200 space-y-1">
											<span class="text-[10px] uppercase font-mono font-bold text-emerald-400">Directorial Intervention:</span>
											<p class="font-mono text-[11px]">{activeEntry.example.afterOrRight}</p>
										</div>
									{/if}
								</div>
								<p class="text-xs text-neutral-400 font-sans pt-1">
									{activeEntry.example.explanation}
								</p>
							</div>
						{/if}

						<!-- Studio Touchpoint -->
						<div class="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/60 text-xs">
							<Compass class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
							<div>
								<span class="font-mono text-neutral-400 uppercase tracking-wider text-[10px] font-semibold block">
									Where in the Studio to find it
								</span>
								<span class="text-neutral-200 font-medium">
									{activeEntry.studioTouchpoint}
								</span>
							</div>
						</div>

						<!-- Related Concepts Cross-Links -->
						{#if activeEntry.relatedTermIds.length > 0}
							<div class="space-y-2 pt-2 border-t border-neutral-800/80">
								<span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
									Related Terms & Concepts
								</span>
								<div class="flex flex-wrap gap-1.5">
									{#each activeEntry.relatedTermIds as relId}
										{@const relEntry = HELP_KNOWLEDGE_BASE.find((e) => e.id === relId)}
										{#if relEntry}
											<button
												type="button"
												onclick={() => selectTerm(relEntry.id)}
												class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 hover:border-amber-500/40 transition cursor-pointer"
											>
												<Hash class="w-3 h-3 text-neutral-500" />
												<span>{relEntry.term}</span>
											</button>
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					{/if}
				</div>
			</div>

			<!-- Footer Bar with Quick Tips -->
			<div class="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
				<div class="flex items-center gap-2">
					<span>Tip: Press <kbd class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-neutral-300">?</kbd> or <kbd class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-neutral-300">H</kbd> anywhere on the site to reopen.</span>
				</div>
				<div class="flex items-center gap-3">
					<span>Use <kbd class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-neutral-300">↑</kbd> <kbd class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-neutral-300">↓</kbd> to cycle terms.</span>
					<button
						type="button"
						onclick={onClose}
						class="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition cursor-pointer"
					>
						Done
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
