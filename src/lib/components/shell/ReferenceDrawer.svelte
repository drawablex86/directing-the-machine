<script lang="ts">
	import { X, Search, BookOpen, ArrowRight } from '@lucide/svelte';
	import { appendicesData, type Appendix } from '$lib/data/appendices';
	import AppendixModal from './AppendixModal.svelte';

	let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

	let searchQuery = $state('');
	let selectedAppendix = $state<Appendix | null>(null);
	let isModalOpen = $state(false);

	let filtered = $derived(
		appendicesData.filter((a) =>
			searchQuery.trim() === ''
				? true
				: a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
					a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	function openAppendix(app: Appendix) {
		selectedAppendix = app;
		isModalOpen = true;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && !isModalOpen) onClose();
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
			<div class="p-4 overflow-y-auto space-y-3 flex-1">
				{#if filtered.length === 0}
					<div class="text-center py-12 text-neutral-500 text-sm">
						No protocols matching "{searchQuery}"
					</div>
				{:else}
					{#each filtered as item}
						<div
							role="button"
							tabindex="0"
							onclick={() => openAppendix(item)}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openAppendix(item); }}
							class="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-amber-500/50 hover:bg-neutral-950 transition cursor-pointer group text-left"
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
				{/if}
			</div>

			<!-- Footer -->
			<div class="p-3 bg-neutral-950/80 border-t border-neutral-800 text-xs text-neutral-500 flex items-center justify-between">
				<span>Showing {filtered.length} appendices & protocols (click to read full text)</span>
				<span>Press <kbd class="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px]">ESC</kbd> to close</span>
			</div>
		</div>
	</div>
{/if}

<!-- Appendix Full Reader Dialog -->
<AppendixModal
	appendix={selectedAppendix}
	isOpen={isModalOpen}
	onClose={() => isModalOpen = false}
	onSelectAppendix={(app) => selectedAppendix = app}
/>
