<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { Flame, Compass, BookOpen, Layers, ShieldAlert, PauseCircle, ChevronRight, Sliders } from '@lucide/svelte';

	let { onOpenDrawer, onOpenFailure, onOpenStop }: {
		onOpenDrawer?: () => void;
		onOpenFailure?: () => void;
		onOpenStop?: () => void;
	} = $props();

	const loopSteps = [
		{ name: 'Read', time: '20m', desc: 'Core concept' },
		{ name: 'Practise', time: '60m', desc: 'Deliberate micro-drill' },
		{ name: 'Study', time: '60m', desc: 'Craft study / close reading' },
		{ name: 'Make', time: '2h', desc: 'Project application' },
		{ name: 'Diagnose', time: '30m', desc: 'Diagnose against brief' },
		{ name: 'Log', time: '10m', desc: '10m hard-capped log' },
		{ name: 'Transfer', time: '30m', desc: 'Remove 1 scaffold' },
		{ name: 'Play', time: '30m', desc: 'Unstructured making' }
	];

	const intensityLabels = {
		'full-time-12w': 'Full-Time (18–25h/w · 12w)',
		'extended-24w': 'Extended (12–18h/w · 24w)',
		'distributed-48w': 'Distributed (6–10h/w · 48w)',
		'maintenance-4h': 'Maintenance (4h/w)'
	};
</script>

<header class="border-b border-neutral-800 bg-neutral-900/70 backdrop-blur sticky top-0 z-40 px-4 py-3">
	<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
		<!-- Left: Title & Intensity / Scaffolding Badge -->
		<div class="flex items-center gap-3">
			<a href="/" class="flex items-center gap-2 group">
				<div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
					<Compass class="w-5 h-5" />
				</div>
				<div>
					<div class="font-bold tracking-tight text-white flex items-center gap-2 text-sm md:text-base">
						Directing the Machine
						<span class="text-xs px-2 py-0.5 rounded-full font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
							Layer {practiceStore.masteryLayer}: {practiceStore.masteryLayer === 1 ? 'Capability' : practiceStore.masteryLayer === 2 ? 'Independence' : 'Agency'}
						</span>
					</div>
					<div class="text-xs text-neutral-400 flex items-center gap-1.5">
						<span>{intensityLabels[practiceStore.intensityPath]}</span>
						<span>•</span>
						<span class="text-amber-400/90">
							{practiceStore.activePart === 0 ? 'Week 0 Baseline' : practiceStore.activePart <= 6 ? `Part ${practiceStore.activePart}` : `Month ${practiceStore.activePart - 3}`}
						</span>
					</div>
				</div>
			</a>
		</div>

		<!-- Center: Today's Practice Loop sequence -->
		<div class="hidden lg:flex items-center gap-1 bg-neutral-950/60 p-1 rounded-xl border border-neutral-800/80">
			{#each loopSteps as step, i}
				<button
					type="button"
					onclick={() => { practiceStore.currentStepIndex = i; practiceStore.saveToStorage(); }}
					class="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition {practiceStore.currentStepIndex === i ? 'bg-amber-500 text-neutral-950 font-semibold shadow' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					<span>{step.name}</span>
					<span class="opacity-60 text-[10px]">{step.time}</span>
				</button>
				{#if i < loopSteps.length - 1}
					<ChevronRight class="w-3 h-3 text-neutral-700" />
				{/if}
			{/each}
		</div>

		<!-- Right: Quick actions (Cmd+K drawer, Failure Triage, Hemingway stop) -->
		<div class="flex items-center gap-2 self-end md:self-auto">
			<button
				type="button"
				onclick={onOpenFailure}
				class="px-2.5 py-1.5 rounded-lg text-xs bg-red-950/40 border border-red-800/40 text-red-300 hover:bg-red-900/40 flex items-center gap-1.5 transition"
				title="Diagnose failure mode (Output, Habit, Motivation, Log Decay)"
			>
				<ShieldAlert class="w-3.5 h-3.5 text-red-400" />
				<span>I'm Stuck</span>
			</button>

			<button
				type="button"
				onclick={onOpenStop}
				class="px-2.5 py-1.5 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition"
				title="Hemingway Stop / Declare Done / Abandon"
			>
				<PauseCircle class="w-3.5 h-3.5 text-amber-400" />
				<span>Stop Gate</span>
			</button>

			<button
				type="button"
				onclick={onOpenDrawer}
				class="px-2.5 py-1.5 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition"
				title="Just-In-Time Reference (Appendices A-O)"
			>
				<BookOpen class="w-3.5 h-3.5 text-neutral-400" />
				<span class="hidden sm:inline">Reference</span>
				<kbd class="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] text-neutral-400">⌘K</kbd>
			</button>
		</div>
	</div>

	<!-- Log Decay banner if detected -->
	{#if practiceStore.logDecayAlerts.length > 0}
		<div class="max-w-7xl mx-auto mt-2 p-2 bg-amber-950/40 border border-amber-800/40 rounded-lg text-xs text-amber-300 flex items-center gap-2">
			<Flame class="w-4 h-4 text-amber-400 shrink-0" />
			<div class="flex-1">
				<span class="font-semibold">Log Decay Alert:</span> {practiceStore.logDecayAlerts[0]}
			</div>
		</div>
	{/if}
</header>
