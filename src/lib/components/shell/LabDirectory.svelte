<script lang="ts">
	import {
		Compass,
		Target,
		Eye,
		FileText,
		Sliders,
		Sparkles,
		Users,
		Award,
		ArrowRight,
		Clock
	} from '@lucide/svelte';

	let { onSelectModality }: { onSelectModality: (modId: string) => void } = $props();

	const layers = [
		{
			title: 'Layer 1: Capability & Observation',
			tagline: 'See accurately, find problems, and build disciplined practice contracts.',
			accentColor: 'text-emerald-400',
			badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
			labs: [
				{
					id: 'm0',
					code: 'M0',
					name: 'Deliberate Contract & Baseline Hub',
					icon: Target,
					time: '15–30m',
					phase: 'Week 0 Baseline',
					purpose: '12-competency radar self-audit, play log, non-instrumental attention, and Appendix O pacing selection.'
				},
				{
					id: 'm1',
					code: 'M1',
					name: 'Problem-Finding & Positionality Lab',
					icon: Compass,
					time: '30–60m',
					phase: 'Part I',
					purpose: '6-step problem funnel, personal standing verification, and protected 60-minute unassigned exploration.'
				},
				{
					id: 'm2',
					code: 'M2',
					name: 'Diagnostic Vision & Observation',
					icon: Eye,
					time: '20–45m',
					phase: 'Part I',
					purpose: 'Strict zero-adjective regex linter, 6-question decision audit, diagnostic ladder, and massing canvas.'
				}
			]
		},
		{
			title: 'Layer 2: Independence & Systems',
			tagline: 'Formulate hypotheses, engineer predictable pipelines, and refine objective taste.',
			accentColor: 'text-blue-400',
			badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
			labs: [
				{
					id: 'm3',
					code: 'M3',
					name: 'Premise Forge & 7-Layer Brief Lab',
					icon: FileText,
					time: '30–60m',
					phase: 'Part II',
					purpose: '3-premise generator with explicit rejection reasons, 7-layer briefs, and 3/6/10 constraint views.'
				},
				{
					id: 'm4',
					code: 'M4',
					name: 'Pipeline & Calibration Lab',
					icon: Sliders,
					time: '45–90m',
					phase: 'Part III',
					purpose: '9-layer pipeline mapping, pre-run confidence score locking, Brier telemetry, and taste-narrowness warnings.'
				},
				{
					id: 'm5',
					code: 'M5',
					name: 'Taste & Blind Curation Arena',
					icon: Sparkles,
					time: '30–45m',
					phase: 'Part IV',
					purpose: '5-part taste formula, blind provenance ranking with hidden labels, and ≥40% human anchor library.'
				}
			]
		},
		{
			title: 'Layer 3: Agency & Authorship',
			tagline: 'Direct collaborators, master the art of refusal, and execute blank-sheet capstones.',
			accentColor: 'text-amber-400',
			badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
			labs: [
				{
					id: 'm6',
					code: 'M6',
					name: 'Direction, Collab & Refusal Studio',
					icon: Users,
					time: '30–60m',
					phase: 'Part V',
					purpose: 'Revision vs re-brief decision fork, stakeholder critique triage, and 5-mode refusal composer.'
				},
				{
					id: 'm7',
					code: 'M7',
					name: 'Authorship & Blank-Sheet Capstone',
					icon: Award,
					time: '60m+',
					phase: 'Part VI & Months 4–9',
					purpose: 'Stated vs inferred gap audit, cross-medium synthesis tests, and 14-step blank-sheet capstone projects.'
				}
			]
		}
	];
</script>

<div class="space-y-8">
	<div class="space-y-1">
		<h2 class="text-xl font-bold text-white tracking-tight">Studio Modalities & Deliberate Labs</h2>
		<p class="text-xs md:text-sm text-neutral-400">
			Organized across the three evolutionary layers of creative direction. Choose a lab to isolate a specific micro-drill.
		</p>
	</div>

	{#each layers as layer}
		<div class="space-y-3">
			<div class="flex items-baseline justify-between border-b border-neutral-800 pb-2">
				<div>
					<h3 class="text-sm md:text-base font-bold text-neutral-200">
						{layer.title}
					</h3>
					<p class="text-xs text-neutral-400 mt-0.5">
						{layer.tagline}
					</p>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each layer.labs as lab}
					<button
						type="button"
						onclick={() => onSelectModality(lab.id)}
						class="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 transition flex flex-col justify-between text-left group shadow-sm hover:shadow-md cursor-pointer"
					>
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<div class="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 group-hover:border-amber-500/50 group-hover:scale-105 transition">
									<lab.icon class="w-5 h-5" />
								</div>
								<div class="flex items-center gap-2">
									<span class="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
										<Clock class="w-3 h-3 text-neutral-500" />
										{lab.time}
									</span>
									<span class="font-mono text-xs font-bold text-neutral-400 group-hover:text-amber-400 transition">
										{lab.code}
									</span>
								</div>
							</div>

							<div>
								<h4 class="font-bold text-sm text-neutral-100 group-hover:text-white transition">
									{lab.name}
								</h4>
								<span class="text-[11px] font-semibold text-amber-400/90 inline-block mt-0.5">
									{lab.phase}
								</span>
								<p class="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
									{lab.purpose}
								</p>
							</div>
						</div>

						<div class="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 group-hover:text-amber-400 transition">
							<span class="font-medium">Enter Lab</span>
							<ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>
