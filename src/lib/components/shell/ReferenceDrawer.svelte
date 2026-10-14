<script lang="ts">
	import { X, Search, BookOpen, ExternalLink } from '@lucide/svelte';

	let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

	let searchQuery = $state('');

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

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
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
					class="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition"
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
						<div class="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 transition">
							<div class="flex items-start justify-between gap-2">
								<h3 class="font-semibold text-sm text-neutral-200 flex items-center gap-2">
									<BookOpen class="w-4 h-4 text-amber-400 shrink-0" />
									{item.title}
								</h3>
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
				<span>Showing {filtered.length} appendices & protocols</span>
				<span>Press <kbd class="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px]">ESC</kbd> to close</span>
			</div>
		</div>
	</div>
{/if}
