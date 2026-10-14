<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';

	const competencies = [
		{ id: 'prob', name: 'Problem-Finding' },
		{ id: 'pos', name: 'Positionality' },
		{ id: 'obs', name: 'Observation' },
		{ id: 'prem', name: 'Premise' },
		{ id: 'spec', name: 'Specification' },
		{ id: 'diag', name: 'Diagnosis' },
		{ id: 'cur', name: 'Curation' },
		{ id: 'sys', name: 'Systems' },
		{ id: 'pred', name: 'Prediction' },
		{ id: 'dir', name: 'Direction' },
		{ id: 'auth', name: 'Authorship' },
		{ id: 'trans', name: 'Transfer' }
	];
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-sm font-bold text-white">12-Competency Diagnostic Radar</h3>
			<p class="text-xs text-neutral-400">Baseline score vs current progression (1–4 scale)</p>
		</div>
		<span class="text-xs font-mono text-amber-400">Target: 3+ (Functional / Transferable)</span>
	</div>

	<!-- Competencies progress bars -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
		{#each practiceStore.baseline as comp}
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
				<div class="flex items-center justify-between">
					<span class="font-medium text-neutral-300">{comp.name}</span>
					<span class="font-mono font-bold {comp.score >= 3 ? 'text-emerald-400' : 'text-amber-400'}">
						{comp.score} / 4
					</span>
				</div>
				<div class="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
					<div
						class="h-full transition-all duration-300 {comp.score >= 3 ? 'bg-emerald-500' : 'bg-amber-500'}"
						style="width: {(comp.score / 4) * 100}%"
					></div>
				</div>
			</div>
		{/each}
	</div>
</div>
