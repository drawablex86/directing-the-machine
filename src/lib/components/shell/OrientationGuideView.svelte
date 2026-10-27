<script lang="ts">
	import {
		Compass,
		ArrowRight,
		CheckCircle2,
		Sparkles,
		Eye,
		Layers,
		BookOpen,
		ShieldCheck,
		Lock,
		ChevronRight,
		ArrowLeft,
		HelpCircle,
		Terminal,
		Flame,
		Volume2
	} from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	let { onBeginFirstMission }: { onBeginFirstMission: () => void } = $props();

	// Step-based guided walkthrough (0: Welcome/Model, 1: Studio Anatomy, 2: Jargon Decoder, 3: First Mission)
	let currentStep = $state<number>(0);

	const steps = [
		{ id: 'mental-model', label: '1. The Mental Model' },
		{ id: 'anatomy', label: '2. Studio Anatomy' },
		{ id: 'decoder', label: '3. Jargon Decoded' },
		{ id: 'mission', label: '4. Your First Mission' }
	];

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			completeAndLaunch();
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function completeAndLaunch() {
		practiceStore.completeOrientation();
		onBeginFirstMission();
	}

	function skipDirectly() {
		practiceStore.completeOrientation();
		onBeginFirstMission();
	}
</script>

<div class="max-w-4xl mx-auto w-full py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
	<!-- Top Bar: Progress Indicator & Skip Action -->
	<div class="flex items-center justify-between border-b border-neutral-800/80 pb-4">
		<div class="flex items-center gap-2">
			<div class="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
				<Compass class="w-4 h-4" />
			</div>
			<div>
				<div class="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
					Studio Orientation Guide
				</div>
				<div class="text-xs text-neutral-400">
					Step {currentStep + 1} of {steps.length} · {steps[currentStep].label}
				</div>
			</div>
		</div>

		<button
			type="button"
			onclick={skipDirectly}
			class="text-xs font-medium text-neutral-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800 cursor-pointer"
		>
			Skip to Studio Workbench →
		</button>
	</div>

	<!-- Step Progress Stepper Dots -->
	<div class="grid grid-cols-4 gap-2">
		{#each steps as s, idx}
			<button
				type="button"
				onclick={() => (currentStep = idx)}
				class="h-1.5 rounded-full transition-all cursor-pointer {idx === currentStep ? 'bg-amber-500 shadow-sm shadow-amber-500/50' : idx < currentStep ? 'bg-amber-500/40' : 'bg-neutral-800'}"
				title="Jump to {s.label}"
			></button>
		{/each}
	</div>

	<!-- Step 0: The Conceptual Model -->
	{#if currentStep === 0}
		<div class="space-y-6">
			<div class="space-y-3">
				<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
					<Sparkles class="w-3.5 h-3.5" />
					<span>Norman Interaction Principle: Conceptual Model</span>
				</div>
				<h1 class="text-2xl sm:text-3xl font-serif font-bold text-neutral-100 tracking-tight leading-snug">
					Stop Gambler Prompting.
					<span class="block italic text-amber-500 font-serif font-medium mt-1">
						Start Deliberate Creative Authorship.
					</span>
				</h1>
				<p class="text-sm sm:text-base text-neutral-300 leading-relaxed">
					Most people use AI like a slot machine: pull the lever with vague words, hope for a lucky jackpot, and repeat 50 times. That is exhausting and results in identical, generic outputs.
				</p>
			</div>

			<!-- Contrast Cards (Before vs After) -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
					<div class="flex items-center gap-2 text-red-400 text-xs font-bold font-mono uppercase tracking-wider">
						<span class="w-2 h-2 rounded-full bg-red-400"></span>
						<span>The Ephemeral Prompt Habit</span>
					</div>
					<ul class="text-xs sm:text-sm text-neutral-400 space-y-2.5">
						<li class="flex items-start gap-2">
							<span class="text-red-400 font-bold shrink-0">✕</span>
							<span>Using subjective buzzwords (<em>"stunning, hyper-realistic, photorealistic, cinematic"</em>).</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-red-400 font-bold shrink-0">✕</span>
							<span>Reacting passively to whatever the machine renders.</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-red-400 font-bold shrink-0">✕</span>
							<span>Hoarding secret prompt strings that break whenever models update.</span>
						</li>
					</ul>
				</div>

				<div class="p-5 rounded-2xl bg-neutral-900/80 border border-amber-500/30 space-y-3 shadow-lg shadow-amber-500/5">
					<div class="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-wider">
						<span class="w-2 h-2 rounded-full bg-amber-400"></span>
						<span>The Directing Philosophy</span>
					</div>
					<ul class="text-xs sm:text-sm text-neutral-200 space-y-2.5">
						<li class="flex items-start gap-2">
							<span class="text-amber-400 font-bold shrink-0">✓</span>
							<span><strong>Diagnostic observation:</strong> Stating physical attributes (lighting angle, ratio, focal length).</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-amber-400 font-bold shrink-0">✓</span>
							<span><strong>7-layer constraints:</strong> Directing the system with negative boundaries and premise.</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-amber-400 font-bold shrink-0">✓</span>
							<span><strong>Predictive calibration:</strong> Calling outputs in advance rather than being surprised.</span>
						</li>
					</ul>
				</div>
			</div>

			<div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed flex items-start gap-3">
				<ShieldCheck class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
				<div>
					<strong>Designed for Human Schedules:</strong> This curriculum does not demand you show up every consecutive calendar day. It saves 100% locally in your browser. You can practice in 15-minute sessions whenever your schedule permits.
				</div>
			</div>
		</div>

	<!-- Step 1: Studio Anatomy -->
	{:else if currentStep === 1}
		<div class="space-y-6">
			<div class="space-y-3">
				<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
					<Layers class="w-3.5 h-3.5" />
					<span>How the Studio Works</span>
				</div>
				<h2 class="text-2xl sm:text-3xl font-serif font-bold text-neutral-100 tracking-tight leading-snug">
					The 4-Part Learning Loop
				</h2>
				<p class="text-sm sm:text-base text-neutral-300 leading-relaxed">
					Every module follows the same logical rhythm. You don't have to guess what button to press or what to do next.
				</p>
			</div>

			<!-- 4 Pillars Flowchart / Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
					<div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/20">
						1
					</div>
					<div class="font-bold text-neutral-100 text-sm">Read the Core Mental Model</div>
					<div class="text-xs text-neutral-400 leading-relaxed">
						Short, focused theoretical distinction (e.g. <em>"Deliberate Practice vs. Mere Production"</em>). 5–10 minutes of active reading.
					</div>
				</div>

				<div class="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
					<div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/20">
						2
					</div>
					<div class="font-bold text-neutral-100 text-sm">Perform the Micro-Drill</div>
					<div class="text-xs text-neutral-400 leading-relaxed">
						An interactive exercise operating in the 70–80% difficulty zone (e.g. running your prompt through the Zero-Adjective Linter).
					</div>
				</div>

				<div class="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
					<div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/20">
						3
					</div>
					<div class="font-bold text-neutral-100 text-sm">Apply in Active Project</div>
					<div class="text-xs text-neutral-400 leading-relaxed">
						Apply what you just tested toward your real creative portfolio project with your own choice of LLM or image engine.
					</div>
				</div>

				<div class="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
					<div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/20">
						4
					</div>
					<div class="font-bold text-neutral-100 text-sm">10-Minute Reflective Log</div>
					<div class="text-xs text-neutral-400 leading-relaxed">
						A hard-capped 10-minute timer to capture decision audits without endless journaling burnout.
					</div>
				</div>
			</div>

			<div class="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-3">
				<Lock class="w-4 h-4 text-amber-400 shrink-0" />
				<span><strong>Khan Academy Progressive Release:</strong> Modules unlock in sequence. You won't be distracted by advanced Month 6 projects until you've mastered the fundamentals.</span>
			</div>
		</div>

	<!-- Step 2: Jargon Decoder -->
	{:else if currentStep === 2}
		<div class="space-y-6">
			<div class="space-y-3">
				<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
					<HelpCircle class="w-3.5 h-3.5" />
					<span>Demystifying Terminology</span>
				</div>
				<h2 class="text-2xl sm:text-3xl font-serif font-bold text-neutral-100 tracking-tight leading-snug">
					Course Jargon Decoded
				</h2>
				<p class="text-sm sm:text-base text-neutral-300 leading-relaxed">
					This curriculum uses specialized vocabulary to describe mechanical differences. Here is what they actually mean in plain English:
				</p>
			</div>

			<!-- Jargon Glossary Cards -->
			<div class="space-y-3">
				<div class="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold font-mono text-amber-400">M0: Practice Contract & Baseline Hub</span>
						<span class="text-[10px] uppercase font-mono text-neutral-500">Starting Point</span>
					</div>
					<p class="text-xs text-neutral-300">
						A 5-minute initial self-audit across 12 creative skills. It helps the system calibrate your zone of proximal development without judgment.
					</p>
				</div>

				<div class="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold font-mono text-amber-400">Zero-Adjective Observation Linter</span>
						<span class="text-[10px] uppercase font-mono text-neutral-500">M2 Studio Tool</span>
					</div>
					<p class="text-xs text-neutral-300">
						A tool that flags emotional buzzwords like <em>"breathtaking"</em> or <em>"masterpiece"</em> and forces you to state verifiable physical properties (contrast, palette, rhythm).
					</p>
				</div>

				<div class="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold font-mono text-amber-400">Brier Score & Calibration</span>
						<span class="text-[10px] uppercase font-mono text-neutral-500">M4 Measurement</span>
					</div>
					<p class="text-xs text-neutral-300">
						A mathematical measurement of how well your predictions match actual outcomes. When you adjust a parameter, can you predict what the AI will produce?
					</p>
				</div>

				<div class="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold font-mono text-amber-400">Hemingway Stop Gate</span>
						<span class="text-[10px] uppercase font-mono text-neutral-500">Session Boundary</span>
					</div>
					<p class="text-xs text-neutral-300">
						Ernest Hemingway's golden rule: stop working when you still know what happens next. It prevents creative exhaustion and makes starting tomorrow effortless.
					</p>
				</div>
			</div>
		</div>

	<!-- Step 3: Your First Mission -->
	{:else if currentStep === 3}
		<div class="space-y-6">
			<div class="space-y-3">
				<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
					<CheckCircle2 class="w-3.5 h-3.5" />
					<span>Ready to Begin</span>
				</div>
				<h2 class="text-2xl sm:text-3xl font-serif font-bold text-neutral-100 tracking-tight leading-snug">
					Milestone 1: The Baseline Diagnostic
				</h2>
				<p class="text-sm sm:text-base text-neutral-300 leading-relaxed">
					You understand the philosophy, the studio anatomy, and the terminology. You are ready to establish your baseline starting point.
				</p>
			</div>

			<!-- Mission Briefing Card -->
			<div class="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/20 border border-amber-500/30 space-y-4 shadow-xl">
				<div class="flex items-center justify-between pb-3 border-b border-neutral-800">
					<div class="flex items-center gap-2">
						<div class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
						<span class="font-bold text-neutral-100 text-sm">Action Mission: M0 Hub</span>
					</div>
					<span class="text-xs font-mono text-amber-400">Est. Time: ~5–10 mins</span>
				</div>

				<div class="space-y-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
					<p>
						In this first exercise, you will assess yourself across 12 directorial competencies (Observation, Premise, Direction, Curation, etc.) on a simple 1–4 scale.
					</p>
					<p class="text-neutral-400">
						Completing this unlocks <strong>M1 (Problem Lab)</strong> and <strong>M2 (Diagnostic Vision)</strong>, generating your customized Competency Radar.
					</p>
				</div>

				<div class="pt-2">
					<button
						type="button"
						onclick={completeAndLaunch}
						class="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
					>
						<span>Enter M0: Baseline Diagnostic</span>
						<ArrowRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Navigation Bar -->
	<div class="flex items-center justify-between pt-4 border-t border-neutral-800/80">
		<button
			type="button"
			onclick={prevStep}
			disabled={currentStep === 0}
			class="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
		>
			<ArrowLeft class="w-3.5 h-3.5" />
			<span>Previous</span>
		</button>

		<div class="text-xs font-mono text-neutral-500">
			{currentStep + 1} / {steps.length}
		</div>

		{#if currentStep < steps.length - 1}
			<button
				type="button"
				onclick={nextStep}
				class="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition flex items-center gap-1.5 cursor-pointer"
			>
				<span>Next Step</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</button>
		{:else}
			<button
				type="button"
				onclick={completeAndLaunch}
				class="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
			>
				<span>Launch Baseline</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</button>
		{/if}
	</div>
</div>
