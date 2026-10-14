<script lang="ts">
	import {
		BookOpen,
		Search,
		Download,
		FileCode,
		ShieldCheck,
		ExternalLink,
		Sliders
	} from '@lucide/svelte';
	import { generateAppendixLMarkdownTree } from '$lib/engine/archive-exporter';
	import { practiceStore } from '$lib/state/practice.svelte';

	let searchQuery = $state('');
	let exportSuccess = $state(false);

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
		setTimeout(() => exportSuccess = false, 3000);
	}

	const appendices = [
		{ id: 'app-a', title: 'Appendix A — Tool & Practice Stack', tags: ['tools', 'hardware', 'software', 'backup'], summary: 'Categories persist, tools change. Learn to map new tools into functional categories.' },
		{ id: 'app-b', title: 'Appendix B — Diagnostic Ladders', tags: ['ladders', 'diagnosis', 'hierarchy'], summary: 'Universal, visual, and writing ladders. Rule: Do not optimize a lower level while a higher level remains unresolved.' },
		{ id: 'app-c', title: 'Appendix C — Rubrics', tags: ['rubrics', 'scoring', 'mastery', 'two-axis'], summary: 'Universal and contextual rubrics (1-4 scale) and Outcome vs. Decision Quality quadrants.' },
		{ id: 'app-d', title: 'Appendix D — Project Specifications', tags: ['projects', 'briefs', 'intensive', 'independent'], summary: 'Specs for Projects 1 through 6 (Intensive) and Projects 7 through 12 (Independent).' },
		{ id: 'app-e', title: 'Appendix E — Anchor Library Protocol', tags: ['anchors', 'curation', 'taste', 'memory'], summary: 'Not a mood board. A record of decisions worth remembering (≥40% human anchors).' },
		{ id: 'app-f', title: 'Appendix F — Ethical, Technical & Intentional Refusal', tags: ['refusal', 'ethics', 'slop', 'positionality'], summary: '5-mode refusal system: ethical, positional, technical, intentional, and slop refusal.' },
		{ id: 'app-g', title: 'Appendix G — Transfer Tests', tags: ['transfer', 'independence', 'scaffolding'], summary: 'Exercises that verify if understanding survives when the familiar scaffolding is removed.' },
		{ id: 'app-h', title: 'Appendix H — Study Protocols for Creative Knowledge', tags: ['craft', 'study', 'tacit'], summary: 'Execution-as-knowledge drills: observational studies, close reading, and transcription.' },
		{ id: 'app-i', title: 'Appendix I — Deliberate Practice Protocols', tags: ['deliberate practice', 'micro-skills', 'reps'], summary: 'The 70-80% difficulty rule, micro-skill isolation, and immediate feedback loop.' },
		{ id: 'app-j', title: 'Appendix J — Feedback, Critique & Self-Calibration', tags: ['critique', 'calibration network', 'blind'], summary: 'Blind self-assessment, 9-question critique protocol, and calibration partners.' },
		{ id: 'app-k', title: 'Appendix K — Safety, Ethics, Access & Sustainability', tags: ['ethics', 'sustainability', 'health'], summary: 'Screen hygiene, physical posture, environmental compute costs, and disclosure.' },
		{ id: 'app-l', title: 'Appendix L — Operational Templates', tags: ['templates', 'provenance', 'brief', 'logs'], summary: 'Directory structure, version naming (project_v01_date_status_purpose), and logs.' },
		{ id: 'app-m', title: 'Appendix M — Professional Practice Reference', tags: ['contracts', 'ip', 'pricing', 'clients'], summary: 'Pricing judgment, contract clauses for AI-augmented work, and pipeline-as-IP.' },
		{ id: 'app-n', title: 'Appendix N — Continuing Practice After Exit', tags: ['continuing practice', 'long-term', 'agency'], summary: 'The annual domain transfer, longitudinal motive audit, and lifetime practice.' },
		{ id: 'app-o', title: 'Appendix O — Working Across Intensity Levels', tags: ['intensity', 'pacing', 'workload', 'part-time'], summary: 'Adapting to full-time (12w), extended (24w), distributed (48w), or maintenance (4h/w).' }
	];

	let filtered = $derived(
		appendices.filter((a) =>
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
					Official specifications, diagnostic ladders, ethical refusal protocols, and Appendix L templates.
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
			<div class="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col justify-between space-y-3">
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-xs font-mono font-bold text-amber-400">
							{app.id.toUpperCase()}
						</span>
						<BookOpen class="w-4 h-4 text-neutral-500" />
					</div>
					<h3 class="font-bold text-sm text-white">
						{app.title}
					</h3>
					<p class="text-xs text-neutral-400 leading-relaxed">
						{app.summary}
					</p>
				</div>

				<div class="pt-3 border-t border-neutral-800/60 flex flex-wrap gap-1.5">
					{#each app.tags as tag}
						<span class="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-neutral-400 border border-neutral-800">
							#{tag}
						</span>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
