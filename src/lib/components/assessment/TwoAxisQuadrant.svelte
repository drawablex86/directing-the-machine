<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { Quadrant } from '$lib/schemas/course.schema';

	let outcomeScore = $state(3);
	let decisionScore = $state(3);

	let currentQuadrant = $derived<Quadrant>(
		practiceStore.classifyQuadrant(outcomeScore, decisionScore)
	);

	const quadrants = [
		{
			id: 'learning-in-progress',
			name: 'Learning in Progress',
			outcome: 'Weak Outcome',
			decision: 'Strong Reasoning',
			desc: 'Process is sound; execution or craft lags. Normal in early phases. Identify lagging sub-skill.',
			border: 'border-blue-500/40',
			bg: 'bg-blue-950/20',
			text: 'text-blue-400'
		},
		{
			id: 'mastery',
			name: 'Mastery (Target State)',
			outcome: 'Strong Outcome',
			decision: 'Strong Reasoning',
			desc: 'Sound decision process combined with strong artifact quality. Reliable, reproducible authorship.',
			border: 'border-emerald-500/40',
			bg: 'bg-emerald-950/20',
			text: 'text-emerald-400'
		},
		{
			id: 'failure',
			name: 'Failure',
			outcome: 'Weak Outcome',
			decision: 'Weak Reasoning',
			desc: 'Neither process nor outcome succeeds. The clearest signal to inspect problem-finding or specification.',
			border: 'border-red-500/40',
			bg: 'bg-red-950/20',
			text: 'text-red-400'
		},
		{
			id: 'lucky-unstable',
			name: 'Lucky / Unstable Success',
			outcome: 'Strong Outcome',
			decision: 'Weak Reasoning',
			desc: 'Artifact succeeds but cannot be reliably reproduced. Beware borrowed competence or model defaults.',
			border: 'border-amber-500/40',
			bg: 'bg-amber-950/20',
			text: 'text-amber-400'
		}
	];
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<div>
		<h2 class="text-base font-bold text-white">Outcome Quality vs. Decision Quality (Two-Axis Matrix)</h2>
		<p class="text-xs text-neutral-400 mt-1">
			Prevents Rationalisation (excusing weak work) and Anti-Intellectualism (unstable lucky hits).
		</p>
	</div>

	<!-- Interactive sliders -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
		<div>
			<div class="flex items-center justify-between text-neutral-300 mb-1">
				<span>Outcome Quality (Artifact Fitness):</span>
				<span class="font-mono font-bold {outcomeScore >= 3 ? 'text-emerald-400' : 'text-neutral-400'}">
					{outcomeScore} / 4 ({outcomeScore >= 3 ? 'Strong' : 'Weak'})
				</span>
			</div>
			<input type="range" min="1" max="4" step="1" bind:value={outcomeScore} class="w-full accent-amber-500" />
		</div>
		<div>
			<div class="flex items-center justify-between text-neutral-300 mb-1">
				<span>Decision Quality (Reasoning Loop):</span>
				<span class="font-mono font-bold {decisionScore >= 3 ? 'text-emerald-400' : 'text-neutral-400'}">
					{decisionScore} / 4 ({decisionScore >= 3 ? 'Strong' : 'Weak'})
				</span>
			</div>
			<input type="range" min="1" max="4" step="1" bind:value={decisionScore} class="w-full accent-amber-500" />
		</div>
	</div>

	<!-- 2x2 Matrix Display -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
		{#each quadrants as q}
			<div class="p-4 rounded-xl border transition {q.border} {q.bg} {currentQuadrant === q.id ? 'ring-2 ring-amber-500 shadow-lg' : 'opacity-70'}">
				<div class="flex items-center justify-between">
					<span class="font-bold {q.text}">{q.name}</span>
					{#if currentQuadrant === q.id}
						<span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold">
							Classified
						</span>
					{/if}
				</div>
				<div class="text-[10px] text-neutral-400 font-mono mt-1">
					{q.decision} • {q.outcome}
				</div>
				<p class="text-[11px] text-neutral-300 mt-2 leading-relaxed">
					{q.desc}
				</p>
			</div>
		{/each}
	</div>
</div>
