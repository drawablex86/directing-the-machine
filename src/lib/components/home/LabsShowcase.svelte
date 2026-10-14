<script lang="ts">
	import {
		Shield,
		Target,
		Eye,
		FileText,
		Sliders,
		Sparkles,
		GitPullRequest,
		PenTool,
		ArrowRight
	} from '@lucide/svelte';

	const modalities = [
		{
			id: 'm0',
			code: 'M0',
			name: 'Deliberate Contract & Baseline Hub',
			icon: Shield,
			focus: 'Honest self-assessment across 12 competencies, non-instrumental attention contract, and play timers.'
		},
		{
			id: 'm1',
			code: 'M1',
			name: 'Problem-Finding & Positionality Lab',
			icon: Target,
			focus: '6-stage problem funnel, standing check (why you, why this), and 60-minute unassigned exploration.'
		},
		{
			id: 'm2',
			code: 'M2',
			name: 'Diagnostic Vision & Observation',
			icon: Eye,
			focus: 'Top-down diagnostic ladders, zero-adjective regex linter, and 5-second flash memory massing studies.'
		},
		{
			id: 'm3',
			code: 'M3',
			name: 'Premise Forge & 7-Layer Brief Lab',
			icon: FileText,
			focus: '3-premise forge with rejection logic, 7-layer structural brief builder, and cryptographic provenance stamps.'
		},
		{
			id: 'm4',
			code: 'M4',
			name: 'Pipeline & Calibration Lab',
			icon: Sliders,
			focus: '9-layer pipeline mapping, pre-run confidence locks, Brier score telemetry, and narrowness alerts.'
		},
		{
			id: 'm5',
			code: 'M5',
			name: 'Taste & Blind Curation Arena',
			icon: Sparkles,
			focus: '5-part taste formula, blind provenance ranker with hidden labels, and ≥40% human anchor enforcement.'
		},
		{
			id: 'm6',
			code: 'M6',
			name: 'Direction, Collab & Refusal Studio',
			icon: GitPullRequest,
			focus: 'Revision vs re-brief fork, stakeholder critique triage, 5-mode ethical refusal composer, and silence tolerance.'
		},
		{
			id: 'm7',
			code: 'M7',
			name: 'Authorship & Blank-Sheet Capstone',
			icon: PenTool,
			focus: 'Full scaffolding removal, written vs inferred position gap analyzer, and 14-step unassisted capstone.'
		}
	];
</script>

<section class="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<div class="space-y-3 mb-14 text-center sm:text-left">
		<div class="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
			The 8 Specialized Practice Modalities
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
			Eight Deliberate Studios Built to Train Judgment, Not Prompt Speed.
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base font-serif">
			Every lab targets a specific cognitive breakdown point where human operators typically surrender intent to machine defaults.
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each modalities as mod}
			<a
				href="/app?lab={mod.id}"
				class="group p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-amber-500/50 hover:bg-neutral-900/70 transition flex flex-col justify-between space-y-4"
			>
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="font-mono text-xs font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
							{mod.code}
						</span>
						<svelte:component this={mod.icon} class="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition" />
					</div>

					<h3 class="text-base font-serif font-bold text-white group-hover:text-amber-400 transition">
						{mod.name}
					</h3>

					<p class="text-xs text-neutral-400 font-sans leading-relaxed">
						{mod.focus}
					</p>
				</div>

				<div class="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-500 group-hover:text-amber-400">
					<span>Launch Studio</span>
					<ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
				</div>
			</a>
		{/each}
	</div>
</section>
