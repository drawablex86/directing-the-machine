<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import {
		Flame,
		Compass,
		BookOpen,
		ShieldAlert,
		PauseCircle,
		ChevronRight,
		ChevronDown,
		SlidersHorizontal,
		Keyboard,
		Brain,
		Sliders,
		Palette
	} from '@lucide/svelte';

	let { onOpenDrawer, onOpenFailure, onOpenStop, onOpenPreferences, onOpenShortcuts }: {
		onOpenDrawer?: () => void;
		onOpenFailure?: () => void;
		onOpenStop?: () => void;
		onOpenPreferences?: () => void;
		onOpenShortcuts?: () => void;
	} = $props();

	let showFullLoop = $state(false);

	function cycleTheme() {
		const current = practiceStore.learnerPreferences.theme;
		const order: Array<typeof current> = ['dark', 'light', 'sepia', 'midnight', 'high-contrast'];
		const nextIndex = (order.indexOf(current) + 1) % order.length;
		practiceStore.learnerPreferences.theme = order[nextIndex];
		practiceStore.saveToStorage();
	}

	const loopSteps = [
		{ name: 'Read', time: '20m' },
		{ name: 'Practise', time: '60m' },
		{ name: 'Study', time: '60m' },
		{ name: 'Make', time: '2h' },
		{ name: 'Diagnose', time: '30m' },
		{ name: 'Log', time: '10m' },
		{ name: 'Transfer', time: '30m' },
		{ name: 'Play', time: '30m' }
	];

	const intensityLabels = {
		'full-time-12w': 'Full-Time (12w)',
		'extended-24w': 'Extended (24w)',
		'distributed-48w': 'Distributed (48w)',
		'maintenance-4h': 'Maintenance (4h/w)'
	};
</script>

<header class="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
	<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
		<!-- Left: Identity & Current Phase badge -->
		<div class="flex items-center gap-3">
			<a href="/" class="flex items-center gap-2.5 group">
				<div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
					<Compass class="w-4 h-4" />
				</div>
				<div>
					<div class="font-bold tracking-tight text-white flex items-center gap-2 text-sm">
						Directing the Machine
						<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
							Layer {practiceStore.masteryLayer}: {practiceStore.masteryLayer === 1 ? 'Capability' : practiceStore.masteryLayer === 2 ? 'Independence' : 'Agency'}
						</span>
					</div>
					<div class="text-[11px] text-neutral-400 flex items-center gap-1.5">
						<span>{intensityLabels[practiceStore.intensityPath]}</span>
						<span>•</span>
						<span class="text-amber-400 font-semibold font-mono">
							Week {practiceStore.activeWeek} · Day {practiceStore.activeDay}
						</span>
						<span>•</span>
						<span class="text-neutral-400 font-medium">
							{practiceStore.activePart === 0 ? 'Baseline' : practiceStore.activePart <= 6 ? `Part ${practiceStore.activePart}` : `Month ${practiceStore.activePart - 3}`}
						</span>
					</div>
				</div>
			</a>
		</div>

		<!-- Center: Step Indicator with Expandable Stepper -->
		<div class="hidden md:flex items-center gap-2">
			<div class="flex items-center gap-1.5 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-300">
				<span class="text-neutral-500 font-mono text-[11px]">Today:</span>
				<span class="font-bold text-amber-400">Step {practiceStore.currentStepIndex + 1}/8</span>
				<span class="text-neutral-400">({loopSteps[practiceStore.currentStepIndex].name} · {loopSteps[practiceStore.currentStepIndex].time})</span>
				<button
					type="button"
					onclick={() => showFullLoop = !showFullLoop}
					class="ml-1 text-neutral-400 hover:text-white transition p-0.5 rounded"
					title="Toggle full routine breakdown"
				>
					<ChevronDown class="w-3.5 h-3.5 transform transition {showFullLoop ? 'rotate-180' : ''}" />
				</button>
			</div>
		</div>

		<!-- Right: Quick actions -->
		<div class="flex items-center gap-1.5 self-end md:self-auto">
			<!-- Single-Task Horizon (ADHD Focus) Quick Switcher -->
			<button
				type="button"
				onclick={() => {
					practiceStore.learnerPreferences.focusMode = !practiceStore.learnerPreferences.focusMode;
					practiceStore.saveToStorage();
				}}
				class="px-2.5 py-1.5 rounded-xl text-xs border transition flex items-center gap-1.5 {practiceStore.learnerPreferences.focusMode ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'}"
				title="Toggle Single-Task Horizon (Focus Mode)"
			>
				<Brain class="w-3.5 h-3.5 {practiceStore.learnerPreferences.focusMode ? 'text-amber-400' : 'text-neutral-500'}" />
				<span class="hidden sm:inline">Focus Horizon</span>
			</button>

			<button
				type="button"
				onclick={onOpenFailure}
				class="px-2.5 py-1.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-300 hover:border-red-900/60 flex items-center gap-1.5 transition"
				title="Diagnose failure mode (Output, Habit, Motivation, Log Decay)"
			>
				<ShieldAlert class="w-3.5 h-3.5 text-neutral-500 hover:text-red-400" />
				<span class="hidden sm:inline">I'm Stuck</span>
			</button>

			<button
				type="button"
				onclick={onOpenStop}
				class="px-2.5 py-1.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 flex items-center gap-1.5 transition"
				title="Hemingway Stop / Declare Done / Abandon"
			>
				<PauseCircle class="w-3.5 h-3.5 text-amber-400" />
				<span>Stop Gate</span>
			</button>

			<button
				type="button"
				onclick={onOpenDrawer}
				class="px-2.5 py-1.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 flex items-center gap-1.5 transition"
				title="Just-In-Time Reference (Appendices A-O)"
			>
				<BookOpen class="w-3.5 h-3.5 text-neutral-400" />
				<span class="hidden sm:inline">Ref</span>
				<kbd class="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">⌘K</kbd>
			</button>

			<!-- Quick Theme Switcher Pill -->
			<button
				type="button"
				onclick={cycleTheme}
				class="px-2.5 py-1.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
				title="Cycle Color Palette: {practiceStore.learnerPreferences.theme.toUpperCase()}"
				aria-label="Cycle visual palette (currently {practiceStore.learnerPreferences.theme})"
			>
				<Palette class="w-3.5 h-3.5 text-amber-400" />
				<span class="capitalize hidden lg:inline text-[11px] font-mono">{practiceStore.learnerPreferences.theme}</span>
			</button>

			<!-- Preferences & Inclusivity Dialog Trigger -->
			<button
				type="button"
				onclick={onOpenPreferences}
				class="p-1.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition"
				title="Learner Preferences & Accessibility (Fonts, Themes, Focus)"
				aria-label="Open Learner Preferences"
			>
				<Sliders class="w-4 h-4 text-neutral-400 hover:text-amber-400" />
			</button>

			<!-- Keyboard Shortcuts Trigger -->
			<button
				type="button"
				onclick={onOpenShortcuts}
				class="p-1.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 transition hidden sm:flex items-center justify-center"
				title="Keyboard Navigation Shortcuts (?)"
				aria-label="Open Keyboard Shortcuts"
			>
				<Keyboard class="w-4 h-4" />
			</button>
		</div>
	</div>

	<!-- Expandable full step track -->
	{#if showFullLoop}
		<div class="max-w-7xl mx-auto mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between gap-1 overflow-x-auto pb-1 text-xs">
			{#each loopSteps as step, i}
				<button
					type="button"
					onclick={() => { practiceStore.currentStepIndex = i; practiceStore.saveToStorage(); }}
					class="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition whitespace-nowrap {practiceStore.currentStepIndex === i ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					<span class="font-mono text-[10px] opacity-60">0{i + 1}</span>
					<span>{step.name}</span>
					<span class="opacity-60 text-[10px]">({step.time})</span>
				</button>
				{#if i < loopSteps.length - 1}
					<ChevronRight class="w-3 h-3 text-neutral-700 shrink-0" />
				{/if}
			{/each}
		</div>
	{/if}
</header>
