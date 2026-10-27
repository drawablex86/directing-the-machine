<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import {
		Compass,
		BookOpen,
		ShieldAlert,
		PauseCircle,
		ChevronDown,
		Sliders,
		Palette,
		HelpCircle,
		Keyboard,
		Brain,
		ChevronRight,
		Wrench,
		Sparkles
	} from '@lucide/svelte';

	let {
		onOpenDrawer,
		onOpenFailure,
		onOpenStop,
		onOpenPreferences,
		onOpenShortcuts
	}: {
		onOpenDrawer?: () => void;
		onOpenFailure?: () => void;
		onOpenStop?: () => void;
		onOpenPreferences?: () => void;
		onOpenShortcuts?: () => void;
	} = $props();

	let showToolsMenu = $state(false);
	let showStepDetails = $state(false);

	function toggleTheme() {
		practiceStore.toggleTheme();
	}

	const loopSteps = [
		{ name: 'Read', time: '20m', desc: 'Core concept & mental models' },
		{ name: 'Practise', time: '60m', desc: 'Micro-drill in 70–80% challenge zone' },
		{ name: 'Study', time: '60m', desc: 'Decomposition & craft study' },
		{ name: 'Make', time: '2h', desc: 'Project application against brief' },
		{ name: 'Diagnose', time: '30m', desc: 'Top-down diagnosis' },
		{ name: 'Log', time: '10m', desc: 'Hard-capped reflective studio log' },
		{ name: 'Transfer', time: '30m', desc: 'Unassisted transfer rep' },
		{ name: 'Play', time: '30m', desc: 'Play for its own sake' }
	];

	function closeAllDropdowns() {
		showToolsMenu = false;
	}

	function handleWindowClick(e: MouseEvent) {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		if (!target.closest('.tools-menu-container')) {
			showToolsMenu = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<header class="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5 transition-all">
	<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
		<!-- Left: Identity & Uncluttered Pacing Signifier -->
		<div class="flex items-center gap-3">
			<a href="/" class="flex items-center gap-2.5 group">
				<div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
					<Compass class="w-4 h-4" />
				</div>
				<div>
					<div class="font-bold tracking-tight text-white flex items-center gap-2 text-sm">
						Directing the Machine
						<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800">
							Layer {practiceStore.masteryLayer}: {practiceStore.masteryLayer === 1 ? 'Capability' : practiceStore.masteryLayer === 2 ? 'Independence' : 'Agency'}
						</span>
					</div>
					<div class="text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
						{#if practiceStore.pacingMode === 'session'}
							<span class="text-amber-400 font-semibold">
								Session {practiceStore.activeDay}
							</span>
							<span>•</span>
							<span>Week {practiceStore.activeWeek}</span>
						{:else}
							<span class="text-amber-400 font-semibold">
								Week {practiceStore.activeWeek} · Day {practiceStore.activeDay}
							</span>
						{/if}
						<span>•</span>
						<span class="text-neutral-400">
							{practiceStore.activePart === 0 ? 'Baseline' : `Part ${practiceStore.activePart}`}
						</span>
					</div>
				</div>
			</a>
		</div>

		<!-- Center: Singular Step Progress Indicator (Uncluttered) -->
		<div class="hidden md:flex items-center gap-2">
			<div class="flex items-center gap-2 bg-neutral-900/90 px-3.5 py-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-300 shadow-sm">
				<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
				<span class="font-semibold text-neutral-200">
					Step {practiceStore.currentStepIndex + 1}/8:
				</span>
				<span class="text-amber-400 font-medium">
					{loopSteps[practiceStore.currentStepIndex].name}
				</span>
				<span class="text-neutral-500 text-[11px]">
					({loopSteps[practiceStore.currentStepIndex].time})
				</span>
				<button
					type="button"
					onclick={() => (showStepDetails = !showStepDetails)}
					class="ml-1 text-neutral-400 hover:text-white transition p-0.5 rounded cursor-pointer"
					title="Toggle step track breakdown"
				>
					<ChevronDown class="w-3.5 h-3.5 transform transition {showStepDetails ? 'rotate-180 text-amber-400' : ''}" />
				</button>
			</div>
		</div>

		<!-- Right: Clean Utility Bar with Unified Tools Menu -->
		<div class="flex items-center gap-2 self-end md:self-auto">
			<!-- Theme Toggle Pill -->
			<button
				type="button"
				onclick={toggleTheme}
				class="px-2.5 py-1.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
				title="Toggle visual theme (Stone / Paper)"
				aria-label="Toggle visual theme"
			>
				<Palette class="w-3.5 h-3.5 text-amber-400" />
				<span class="capitalize hidden lg:inline text-[11px] font-mono">
					{practiceStore.learnerPreferences.theme === 'dark' ? 'Stone' : 'Paper'}
				</span>
			</button>

			<!-- Quick Studio Settings / BYOK -->
			<button
				type="button"
				onclick={onOpenPreferences}
				class="p-2 rounded-xl text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-300 hover:text-amber-400 transition relative cursor-pointer"
				title="Studio Settings & BYOK Inference (P)"
				aria-label="Open Studio Settings"
			>
				<Sliders class="w-3.5 h-3.5 text-neutral-400 hover:text-amber-400" />
				{#if practiceStore.hasActiveApiKey()}
					<span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-neutral-950" title="Active AI Key Configured"></span>
				{/if}
			</button>

			<!-- Quick Help Encyclopedia -->
			<button
				type="button"
				onclick={() => practiceStore.openHelp()}
				class="px-2.5 py-1.5 rounded-xl text-xs bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-semibold flex items-center gap-1.5 transition cursor-pointer"
				title="Course & Studio Help Encyclopedia (? / H)"
				aria-label="Open Help Encyclopedia"
			>
				<HelpCircle class="w-3.5 h-3.5 text-amber-400" />
				<span class="hidden sm:inline">Help</span>
			</button>

			<!-- Unified Studio Tools & Assistance Dropdown (Eliminates 5 cluttered top-level buttons) -->
			<div class="relative tools-menu-container">
				<button
					type="button"
					onclick={() => (showToolsMenu = !showToolsMenu)}
					class="px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-200 flex items-center gap-1.5 transition cursor-pointer {showToolsMenu ? 'border-amber-500/50 bg-neutral-850' : ''}"
					aria-expanded={showToolsMenu}
					aria-haspopup="true"
				>
					<Wrench class="w-3.5 h-3.5 text-amber-400" />
					<span class="hidden sm:inline">Studio Tools</span>
					<ChevronDown class="w-3 h-3 text-neutral-400 transition {showToolsMenu ? 'rotate-180 text-amber-400' : ''}" />
				</button>

				{#if showToolsMenu}
					<div class="absolute right-0 mt-1.5 w-64 p-2 rounded-2xl bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
						<div class="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-850 mb-1">
							Focus & Guidance Tools
						</div>

						<!-- Focus Horizon (ADHD Single-Task Mode) -->
						<button
							type="button"
							onclick={() => {
								practiceStore.learnerPreferences.focusMode = !practiceStore.learnerPreferences.focusMode;
								practiceStore.saveToStorage();
								showToolsMenu = false;
							}}
							class="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-neutral-900 text-neutral-300 hover:text-white transition cursor-pointer text-left"
						>
							<div class="flex items-center gap-2">
								<Brain class="w-4 h-4 {practiceStore.learnerPreferences.focusMode ? 'text-amber-400' : 'text-neutral-500'}" />
								<div>
									<div class="font-medium">Single-Task Horizon</div>
									<div class="text-[10px] text-neutral-400">Hide extraneous tabs & noise</div>
								</div>
							</div>
							<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
								{practiceStore.learnerPreferences.focusMode ? 'ON' : 'OFF'}
							</span>
						</button>

						<!-- Hemingway Stop Gate -->
						<button
							type="button"
							onclick={() => {
								onOpenStop?.();
								showToolsMenu = false;
							}}
							class="w-full flex items-center gap-2 p-2 rounded-xl text-xs hover:bg-neutral-900 text-neutral-300 hover:text-white transition cursor-pointer text-left"
						>
							<PauseCircle class="w-4 h-4 text-amber-400 shrink-0" />
							<div>
								<div class="font-medium">Stop Gate / Hemingway Pause</div>
								<div class="text-[10px] text-neutral-400">Save progress & declare session done</div>
							</div>
						</button>

						<!-- Failure Triage / I'm Stuck -->
						<button
							type="button"
							onclick={() => {
								onOpenFailure?.();
								showToolsMenu = false;
							}}
							class="w-full flex items-center gap-2 p-2 rounded-xl text-xs hover:bg-neutral-900 text-neutral-300 hover:text-red-300 transition cursor-pointer text-left"
						>
							<ShieldAlert class="w-4 h-4 text-red-400 shrink-0" />
							<div>
								<div class="font-medium text-red-300">Failure Triage (I'm Stuck)</div>
								<div class="text-[10px] text-neutral-400">Diagnose output, habit, or log decay</div>
							</div>
						</button>

						<!-- JIT Reference Drawer -->
						<button
							type="button"
							onclick={() => {
								onOpenDrawer?.();
								showToolsMenu = false;
							}}
							class="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-neutral-900 text-neutral-300 hover:text-white transition cursor-pointer text-left"
						>
							<div class="flex items-center gap-2">
								<BookOpen class="w-4 h-4 text-neutral-400 shrink-0" />
								<div>
									<div class="font-medium">Field Reference Drawer</div>
									<div class="text-[10px] text-neutral-400">Appendices A–Q quick lookup</div>
								</div>
							</div>
							<kbd class="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">⌘K</kbd>
						</button>

						<!-- Keyboard Shortcuts -->
						<button
							type="button"
							onclick={() => {
								onOpenShortcuts?.();
								showToolsMenu = false;
							}}
							class="w-full flex items-center gap-2 p-2 rounded-xl text-xs hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200 transition cursor-pointer text-left"
						>
							<Keyboard class="w-4 h-4 text-neutral-500 shrink-0" />
							<div>
								<div class="font-medium">Keyboard Shortcuts</div>
								<div class="text-[10px] text-neutral-400">Studio hotkeys & navigation</div>
							</div>
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Expandable full step track breakdown -->
	{#if showStepDetails}
		<div class="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-1 overflow-x-auto pb-1 text-xs">
			{#each loopSteps as step, i}
				<button
					type="button"
					onclick={() => {
						practiceStore.currentStepIndex = i;
						practiceStore.saveToStorage();
					}}
					class="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer {practiceStore.currentStepIndex === i ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-neutral-200'}"
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
