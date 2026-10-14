<script lang="ts">
	import {
		BookOpen,
		Search,
		Download,
		FileCode,
		ArrowRight,
		ExternalLink
	} from '@lucide/svelte';
	import { generateAppendixLMarkdownTree } from '$lib/engine/archive-exporter';
	import { practiceStore } from '$lib/state/practice.svelte';
	import { appendicesData, getAppendixById, type Appendix } from '$lib/data/appendices';
	import AppendixModal from './AppendixModal.svelte';
	import { onMount } from 'svelte';

	let { initialAppendixId }: { initialAppendixId?: string | null } = $props();

	let searchQuery = $state('');
	let exportSuccess = $state(false);
	let selectedAppendix = $state<Appendix | null>(null);
	let isModalOpen = $state(false);

	onMount(() => {
		// Handle initial appendix request (via query param e.g. &appendix=app-b or URL hash #app-b)
		const hash = window.location.hash.replace('#', '').trim();
		const targetId = initialAppendixId || hash;
		if (targetId) {
			const found = getAppendixById(targetId);
			if (found) {
				openAppendix(found);
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

		<!-- Search Input -->
		<div class="pt-2">
			<div class="flex items-center gap-2.5 bg-neutral-950 px-3.5 py-2.5 rounded-xl border border-neutral-700 focus-within:border-amber-500 transition">
				<Search class="w-4 h-4 text-neutral-400 shrink-0" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search reference manual, ladders, protocols (e.g. refusal, ladders, pricing, rubrics)..."
					class="w-full bg-transparent text-xs md:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
				/>
			</div>
		</div>
	</div>

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
		{/each}
	</div>
</div>

<!-- Full Screen Modal Appendix Reader -->
<AppendixModal
	appendix={selectedAppendix}
	isOpen={isModalOpen}
	onClose={closeAppendix}
	onSelectAppendix={(app) => (selectedAppendix = app)}
/>
