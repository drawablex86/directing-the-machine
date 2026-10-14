<script lang="ts">
	import { X, Search, BookOpen, ArrowRight, Layers, FileText } from '@lucide/svelte';
	import { appendicesData, type Appendix } from '$lib/data/appendices';
	import { CORE_READINGS, type CoreReading } from '$lib/data/core-readings';
	import AppendixModal from './AppendixModal.svelte';
	import ReadingModal from './ReadingModal.svelte';

	let { isOpen, onClose, onSelectModality }: {
		isOpen: boolean;
		onClose: () => void;
		onSelectModality?: (modId: string) => void;
	} = $props();

	let searchQuery = $state('');
	let selectedAppendix = $state<Appendix | null>(null);
	let selectedReading = $state<CoreReading | null>(null);
	let isAppendixModalOpen = $state(false);
	let isReadingModalOpen = $state(false);

	let filteredAppendices = $derived(
		appendicesData.filter((a) =>
			searchQuery.trim() === ''
				? true
				: a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
					a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	let filteredReadings = $derived(
		CORE_READINGS.filter((r) =>
			searchQuery.trim() === ''
				? true
				: r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
					r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
					r.keyMentalModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
					r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	function openAppendix(app: Appendix) {
		selectedAppendix = app;
		isAppendixModalOpen = true;
	}

	function openReading(r: CoreReading) {
		selectedReading = r;
		isReadingModalOpen = true;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && !isAppendixModalOpen && !isReadingModalOpen) onClose();
	}
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); if (isOpen) onClose(); else onClose(); } }} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-16 md:pt-24"
		role="dialog"
		tabindex="-1"
		onkeydown={handleKeyDown}
	>
		<div class="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
			<!-- Header & Search -->
			<div class="p-4 border-b border-neutral-800 flex items-center justify-between gap-3">
				<div class="flex items-center gap-2.5 flex-1 bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800">
					<Search class="w-4 h-4 text-neutral-400 shrink-0" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search reference manual, ladders, protocols (e.g. refusal, ladders, pricing)..."
						class="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
					/>
				</div>
				<button
					type="button"
					onclick={onClose}
					class="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
					title="Close Reference Drawer"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- List -->
			<div class="p-4 overflow-y-auto space-y-4 flex-1">
				{#if filteredReadings.length === 0 && filteredAppendices.length === 0}
					<div class="text-center py-12 text-neutral-500 text-sm">
						No curriculum modules or protocols matching "{searchQuery}"
					</div>
				{:else}
					<!-- Core Curriculum Modules Section -->
					{#if filteredReadings.length > 0}
						<div class="space-y-2">
							<div class="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-1">
								Core Curriculum Theory & Modules ({filteredReadings.length})
							</div>
							<div class="space-y-2">
								{#each filteredReadings as r}
									<div
										role="button"
										tabindex="0"
										onclick={() => openReading(r)}
										onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openReading(r); }}
										class="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-amber-500/50 hover:bg-neutral-950 transition cursor-pointer group text-left"
									>
										<div class="flex items-start justify-between gap-2">
											<div class="flex items-center gap-2">
												<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold shrink-0">
													{r.code}
												</span>
												<h3 class="font-semibold text-sm text-neutral-200 group-hover:text-amber-300 transition">
													{r.title}
												</h3>
											</div>
											<span class="text-xs text-neutral-500 group-hover:text-amber-400 flex items-center gap-0.5 shrink-0 transition">
												<span>Read Theory</span>
												<ArrowRight class="w-3.5 h-3.5" />
											</span>
										</div>
										<p class="text-xs text-neutral-400 mt-1.5 leading-relaxed font-serif line-clamp-2">
											{r.summary}
										</p>
										<div class="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-900 text-[11px]">
											<span class="text-neutral-500 font-mono">
												Layer {r.layer}: {r.layerName}
											</span>
											<span class="text-amber-400/80 font-mono text-[10px]">
												Studio: {r.targetModalityId.toUpperCase()}
											</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Field Manual Appendices Section -->
					{#if filteredAppendices.length > 0}
						<div class="space-y-2 pt-2">
							<div class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold px-1">
								Field Manual Appendices & Operational Protocols ({filteredAppendices.length})
							</div>
							<div class="space-y-2">
								{#each filteredAppendices as item}
									<div
										role="button"
										tabindex="0"
										onclick={() => openAppendix(item)}
										onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openAppendix(item); }}
										class="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80 hover:border-amber-500/50 hover:bg-neutral-950 transition cursor-pointer group text-left"
									>
										<div class="flex items-start justify-between gap-2">
											<h3 class="font-semibold text-sm text-neutral-200 flex items-center gap-2 group-hover:text-amber-300 transition">
												<BookOpen class="w-4 h-4 text-amber-400 shrink-0" />
												<span>{item.title}</span>
											</h3>
											<span class="text-xs text-neutral-500 group-hover:text-amber-400 flex items-center gap-0.5 shrink-0 transition">
												<span>Read</span>
												<ArrowRight class="w-3.5 h-3.5" />
											</span>
										</div>
										<p class="text-xs text-neutral-400 mt-1 leading-relaxed">
											{item.summary}
										</p>
										<div class="flex flex-wrap gap-1.5 mt-2.5">
											{#each item.tags as tag}
												<span class="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700/50">
													#{tag}
												</span>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				{/if}
			</div>

			<!-- Footer -->
			<div class="p-3 bg-neutral-950/80 border-t border-neutral-800 text-xs text-neutral-500 flex items-center justify-between">
				<span>{filteredReadings.length + filteredAppendices.length} documents indexed (Click to read)</span>
				<span>Press <kbd class="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px]">ESC</kbd> to close</span>
			</div>
		</div>
	</div>
{/if}

<!-- Appendix Full Reader Dialog -->
<AppendixModal
	appendix={selectedAppendix}
	isOpen={isAppendixModalOpen}
	onClose={() => isAppendixModalOpen = false}
	onSelectAppendix={(app) => selectedAppendix = app}
/>

<!-- Core Reading Full Reader Dialog -->
<ReadingModal
	reading={selectedReading}
	isOpen={isReadingModalOpen}
	onClose={() => isReadingModalOpen = false}
	onSelectReading={(r) => selectedReading = r}
	onSelectModality={onSelectModality}
/>
