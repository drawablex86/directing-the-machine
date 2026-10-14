<script lang="ts">
	import {
		BookOpen,
		Search,
		Download,
		FileCode,
		ArrowRight,
		ExternalLink,
		Target,
		Play,
		CheckCircle2,
		AlertTriangle,
		ChevronDown,
		ChevronUp,
		Filter
	} from '@lucide/svelte';
	import { generateAppendixLMarkdownTree } from '$lib/engine/archive-exporter';
	import { practiceStore } from '$lib/state/practice.svelte';
	import { appendicesData, getAppendixById, type Appendix } from '$lib/data/appendices';
	import { DRILLS, type Drill } from '$lib/data/drills';
	import AppendixModal from './AppendixModal.svelte';
	import { onMount } from 'svelte';

	let {
		initialAppendixId,
		onSelectModality
	}: {
		initialAppendixId?: string | null;
		onSelectModality?: (modId: string) => void;
	} = $props();

	type ManualTab = 'appendices' | 'drills';
	let activeViewTab = $state<ManualTab>('appendices');
	let selectedCategory = $state<string>('all');
	let filterByCurrentWeek = $state(false);
	let expandedDrillId = $state<string | null>(null);

	let searchQuery = $state('');
	let exportSuccess = $state(false);
	let selectedAppendix = $state<Appendix | null>(null);
	let isModalOpen = $state(false);

	onMount(() => {
		// Handle initial appendix request (via query param e.g. &appendix=app-b or URL hash #app-b)
		const hash = window.location.hash.replace('#', '').trim();
		const targetId = initialAppendixId || hash;
		if (targetId) {
			const clean = targetId.toLowerCase();
			if (clean === 'app-i' || clean === 'appendix-i') {
				activeViewTab = 'drills';
			} else {
				const found = getAppendixById(targetId);
				if (found) {
					openAppendix(found);
				}
			}
		}
	});

	function openAppendix(app: Appendix) {
		selectedAppendix = app;
		isModalOpen = true;
	}

	function closeAppendix() {
		isModalOpen = false;
	}

	function exportAppendixLArchive(format: 'json' | 'markdown') {
		const archive = generateAppendixLMarkdownTree({
			projectName: 'Directing-the-Machine-Studio',
			exportedAt: new Date().toISOString(),
			problems: practiceStore.problems,
			calibrations: practiceStore.calibrations,
			practiceSessions: practiceStore.practiceSessions,
			decisions: practiceStore.decisions,
			briefs: practiceStore.briefs,
			playNotes: practiceStore.playLines.map((p) => p.line),
			nonInstrumentalNotes: practiceStore.nonInstrumentalLines.map((a) => a.line)
		});

		let blob: Blob;
		let filename: string;
		if (format === 'json') {
			blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
			filename = `appendix_l_project_archive_${new Date().toISOString().slice(0, 10)}.json`;
		} else {
			const mdCombined = Object.entries(archive)
				.map(([path, content]) => `<!-- FILE: ${path} -->\n${content}\n\n`)
				.join('---\n\n');
			blob = new Blob([mdCombined], { type: 'text/markdown' });
			filename = `appendix_l_project_archive_${new Date().toISOString().slice(0, 10)}.md`;
		}

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);

		exportSuccess = true;
		setTimeout(() => (exportSuccess = false), 3000);
	}

	let filtered = $derived(
		appendicesData.filter((a) =>
			searchQuery.trim() === ''
				? true
				: a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
					a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	let filteredDrills = $derived(
		DRILLS.filter((d) => {
			if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
			if (filterByCurrentWeek && !d.weeks.includes(practiceStore.activeWeek)) return false;
			if (searchQuery.trim() === '') return true;
			const q = searchQuery.toLowerCase();
			return (
				d.title.toLowerCase().includes(q) ||
				d.targetSkill.toLowerCase().includes(q) ||
				d.category.toLowerCase().includes(q) ||
				d.surface.toLowerCase().includes(q) ||
				d.moduleRef.toLowerCase().includes(q)
			);
		})
	);
</script>

<div class="space-y-6">
	<!-- Field Manual Header -->
	<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
						Appendices A–O
					</span>
					<span class="text-xs text-neutral-400">Field Manual & Operational Protocols</span>
				</div>
				<h2 class="text-xl font-bold text-white tracking-tight">
					Studio Reference Library & Standards
				</h2>
				<p class="text-xs md:text-sm text-neutral-400 max-w-2xl">
					Official specifications, diagnostic ladders, ethical refusal protocols, and Appendix L templates. Click any appendix to read the complete protocol.
				</p>
			</div>

			<!-- Archive Exporter -->
			<div class="flex items-center gap-2">
				{#if exportSuccess}
					<span class="text-xs text-emerald-400 font-bold">Exported!</span>
				{/if}
				<button
					type="button"
					onclick={() => exportAppendixLArchive('json')}
					class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 transition cursor-pointer"
					title="Export studio data as JSON bundle"
				>
					<Download class="w-3.5 h-3.5 text-amber-400" />
					<span>Export JSON</span>
				</button>
				<button
					type="button"
					onclick={() => exportAppendixLArchive('markdown')}
					class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 transition cursor-pointer"
					title="Export studio data formatted as Appendix L markdown"
				>
					<FileCode class="w-3.5 h-3.5 text-amber-400" />
					<span>Export Markdown</span>
				</button>
			</div>
		</div>

		<!-- View Switcher & Search Bar -->
		<div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-neutral-800/80">
			<!-- Tab Switcher -->
			<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs shrink-0">
				<button
					type="button"
					onclick={() => activeViewTab = 'appendices'}
					class="px-3.5 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 cursor-pointer {activeViewTab === 'appendices' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					<BookOpen class="w-3.5 h-3.5" />
					<span>All Appendices (A–O)</span>
				</button>
				<button
					type="button"
					onclick={() => activeViewTab = 'drills'}
					class="px-3.5 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 cursor-pointer {activeViewTab === 'drills' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					<Target class="w-3.5 h-3.5" />
					<span>Interactive Drill Library (App I)</span>
					<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">10 Drills</span>
				</button>
			</div>

			<!-- Search Input -->
			<div class="flex-1 max-w-md">
				<div class="flex items-center gap-2.5 bg-neutral-950 px-3.5 py-2 rounded-xl border border-neutral-800 focus-within:border-amber-500 transition">
					<Search class="w-4 h-4 text-neutral-400 shrink-0" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder={activeViewTab === 'appendices' ? 'Search reference manual, ladders, protocols...' : 'Search drills by skill, modality, category...'}
						class="w-full bg-transparent text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	</div>

	{#if activeViewTab === 'appendices'}
		<!-- Filtered Appendix List -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filtered as app}
				<div
					id={app.id}
					class="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 hover:bg-neutral-900 transition flex flex-col justify-between space-y-3 group"
				>
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-xs font-mono font-bold text-amber-400">
								{app.id.toUpperCase()}
							</span>
							<BookOpen class="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition" />
						</div>
						<h3 class="font-bold text-sm text-white group-hover:text-amber-300 transition">
							{app.title}
						</h3>
						<p class="text-xs text-neutral-400 leading-relaxed">
							{app.summary}
						</p>
					</div>

					<div class="pt-3 border-t border-neutral-800/60 flex items-center justify-between gap-2">
						<div class="flex flex-wrap gap-1.5">
							{#each app.tags.slice(0, 3) as tag}
								<span class="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-neutral-400 border border-neutral-800">
									#{tag}
								</span>
							{/each}
						</div>

						<div class="flex items-center gap-1.5">
							{#if app.id === 'app-i'}
								<button
									type="button"
									onclick={() => activeViewTab = 'drills'}
									class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400 transition flex items-center gap-1 cursor-pointer shrink-0"
									title="Open interactive drill library"
								>
									<Target class="w-3.5 h-3.5" />
									<span>Interactive Drills</span>
								</button>
							{/if}
							<button
								type="button"
								onclick={() => openAppendix(app)}
								class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 transition flex items-center gap-1 cursor-pointer shrink-0"
								title="Read complete {app.title}"
							>
								<span>Read</span>
								<ArrowRight class="w-3.5 h-3.5" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- INTERACTIVE DRILL LIBRARY (APPENDIX I) -->
		<div class="space-y-6">
			<!-- Drill Filter Toolbar -->
			<div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
				<div class="flex flex-wrap items-center gap-1.5">
					<span class="text-xs font-mono text-neutral-400 mr-1 flex items-center gap-1">
						<Filter class="w-3.5 h-3.5 text-amber-400" />
						<span>Category:</span>
					</span>
					{#each ['all', 'observation', 'problem-finding', 'diagnostic', 'visual', 'writing', 'calibration', 'judgment'] as cat}
						<button
							type="button"
							onclick={() => selectedCategory = cat}
							class="px-2.5 py-1 rounded-lg text-xs capitalize transition cursor-pointer {selectedCategory === cat ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'}"
						>
							{cat}
						</button>
					{/each}
				</div>

				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => filterByCurrentWeek = !filterByCurrentWeek}
						class="px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer {filterByCurrentWeek ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'}"
					>
						<span>Week {practiceStore.activeWeek} Drills Only</span>
					</button>
				</div>
			</div>

			<!-- Drill Cards Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
				{#each filteredDrills as drill}
					{@const isExpanded = expandedDrillId === drill.id}
					<div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition space-y-4 shadow-lg flex flex-col justify-between">
						<div class="space-y-3.5">
							<!-- Card Top -->
							<div class="flex items-start justify-between gap-3">
								<div class="space-y-1">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase font-bold">
											{drill.category}
										</span>
										<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
											Studio {drill.modalityId.toUpperCase()}
										</span>
										<span class="text-[10px] font-mono text-neutral-500">
											{drill.moduleRef}
										</span>
									</div>
									<h3 class="text-base font-bold text-white">
										{drill.title}
									</h3>
								</div>

								<div class="text-right shrink-0">
									<span class="text-xs font-mono font-bold text-amber-400 block">
										{drill.repDuration} / rep
									</span>
									<span class="text-[10px] font-mono text-neutral-500 block">
										Target: {drill.repCount} reps
									</span>
								</div>
							</div>

							<!-- Target Skill -->
							<div class="text-xs text-neutral-300 leading-relaxed">
								<strong class="text-neutral-200">Target Skill:</strong> {drill.targetSkill}
							</div>

							<!-- Success Criterion -->
							<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs flex items-start gap-2 text-emerald-300/90">
								<CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
								<div>
									<span class="font-bold text-emerald-400">Success Criterion:</span> {drill.successCriterion}
								</div>
							</div>

							<!-- Toggle Protocol & Difficulty Details -->
							<div class="pt-1 border-t border-neutral-800/60">
								<button
									type="button"
									onclick={() => expandedDrillId = isExpanded ? null : drill.id}
									class="w-full py-1.5 text-xs text-neutral-400 hover:text-amber-400 flex items-center justify-between transition cursor-pointer font-medium"
								>
									<span>{isExpanded ? 'Hide' : 'View'} 5-Step Execution Protocol & Difficulty Scale</span>
									{#if isExpanded}
										<ChevronUp class="w-4 h-4" />
									{:else}
										<ChevronDown class="w-4 h-4" />
									{/if}
								</button>

								{#if isExpanded}
									<div class="mt-3 space-y-3 pt-2 text-xs border-t border-neutral-800/60 animate-in fade-in duration-150">
										<!-- 5-Step Protocol -->
										<div class="space-y-2">
											<div class="text-[11px] font-mono text-amber-400/90 font-bold uppercase">1-Rep Step Sequence</div>
											<div class="space-y-1.5">
												{#each drill.repProtocol as step}
													<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] space-y-0.5">
														<div class="flex items-center justify-between font-mono text-neutral-400 font-bold">
															<span class="text-amber-400">Step {step.step}. {step.label}</span>
															<span class="text-neutral-500 text-[10px]">{step.duration}</span>
														</div>
														<p class="text-neutral-300 leading-relaxed">{step.instruction}</p>
													</div>
												{/each}
											</div>
										</div>

										<!-- Difficulty Tiers -->
										<div class="space-y-1.5 pt-1">
											<div class="text-[11px] font-mono text-neutral-400 font-bold uppercase">Difficulty Escalation</div>
											<div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
												<div class="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
													<span class="font-bold text-emerald-400 block mb-0.5">Warmup</span>
													<span class="text-neutral-400">{drill.difficulty.warmup}</span>
												</div>
												<div class="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
													<span class="font-bold text-blue-400 block mb-0.5">Standard</span>
													<span class="text-neutral-400">{drill.difficulty.standard}</span>
												</div>
												<div class="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
													<span class="font-bold text-amber-400 block mb-0.5">Harder (&gt;80% Pass)</span>
													<span class="text-neutral-400">{drill.difficulty.harder}</span>
												</div>
												<div class="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
													<span class="font-bold text-red-400 block mb-0.5">Hardest</span>
													<span class="text-neutral-400">{drill.difficulty.hardest}</span>
												</div>
											</div>
										</div>

										<!-- Surface Info -->
										<div class="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
											<strong class="text-neutral-300">Surface:</strong> {drill.surface}
										</div>
									</div>
								{/if}
							</div>
						</div>

						<!-- Card Action -->
						<div class="pt-3 border-t border-neutral-800/60 flex items-center justify-between gap-3">
							<span class="text-[11px] font-mono text-neutral-500">
								Active Weeks: {drill.weeks.join(', ')}
							</span>
							<button
								type="button"
								onclick={() => {
									if (onSelectModality) {
										onSelectModality(drill.modalityId);
									} else {
										window.location.href = `/app?tab=labs&lab=${drill.modalityId}`;
									}
								}}
								class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-1.5 transition cursor-pointer shadow"
							>
								<Play class="w-3.5 h-3.5 fill-current" />
								<span>Run in Studio ({drill.modalityId.toUpperCase()})</span>
								<ArrowRight class="w-3.5 h-3.5" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- Full Screen Modal Appendix Reader -->
<AppendixModal
	appendix={selectedAppendix}
	isOpen={isModalOpen}
	onClose={closeAppendix}
	onSelectAppendix={(app) => (selectedAppendix = app)}
/>
