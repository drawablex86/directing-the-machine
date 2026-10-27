<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { IntensityPath } from '$lib/schemas/course.schema';
	import {
		Target,
		Clock,
		ArrowRight,
		ArrowLeft,
		Check,
		CheckCircle2,
		Sparkles,
		Eye,
		BookOpen,
		Sliders,
		HelpCircle,
		ShieldCheck
	} from '@lucide/svelte';
	import BaselineCompetencyCard from './BaselineCompetencyCard.svelte';
	import { COMPETENCY_DETAILS } from '$lib/schemas/competency-details';
	import ReadingModal from '$lib/components/shell/ReadingModal.svelte';
	import { getReadingByCode } from '$lib/data/core-readings';

	let {
		onNavigateTab,
		onSelectModality
	}: {
		onNavigateTab?: (tab: 'today' | 'curriculum' | 'labs' | 'assessment' | 'manual') => void;
		onSelectModality?: (modId: string) => void;
	} = $props();

	// 6-Stage Sequential Orientation Runway:
	// 0: Theory & Mindset
	// 1: Baseline Skills Evaluation (12 Competencies)
	// 2: Diagnostic Synthesis (Strengths & Growth Targets)
	// 3: Schedule & Weekly Commitment (Intensity Path)
	// 4: Observation & Free Play Habits (Attention & Play logs)
	// 5: Sign Practice Contract & Enter Week 1
	type FlowStage = 0 | 1 | 2 | 3 | 4 | 5;
	let currentStage = $state<FlowStage>(0);

	// Competency Step Sub-Index inside Stage 1
	let currentCompetencyIndex = $state(0);

	// Free Play & Attention Inputs for Stage 4
	let playText = $state('');
	let attentionText = $state('');
	let playSaved = $state(false);
	let attentionSaved = $state(false);

	// Reading Modal State for Stage 0
	let isReadingModalOpen = $state(false);
	let module0Reading = $derived(getReadingByCode('Module 0'));

	const synthesis = $derived(practiceStore.getBaselineSynthesis());

	const auditedCount = $derived(
		practiceStore.baseline.filter((b) => b.notes.trim().length > 0 || b.score !== 2).length
	);

	const avgScore = $derived(
		(practiceStore.baseline.reduce((sum, b) => sum + b.score, 0) / practiceStore.baseline.length).toFixed(1)
	);

	const currentCompetency = $derived(
		practiceStore.baseline[currentCompetencyIndex] || practiceStore.baseline[0]
	);

	const stages = [
		{ id: 0, label: 'Orientation & Mindset' },
		{ id: 1, label: 'Skills Self-Audit' },
		{ id: 2, label: 'Diagnostic Profile' },
		{ id: 3, label: 'Weekly Schedule' },
		{ id: 4, label: 'Creative Habits' },
		{ id: 5, label: 'Sign Contract' }
	];

	// Pacing Runway Options
	const paths: { id: IntensityPath; title: string; hours: string; weeks: string; desc: string }[] = [
		{ id: 'full-time-12w', title: 'Full-Time Intensive', hours: '18–25h/w', weeks: '12 Weeks', desc: 'Accelerated immersion for practitioners with dedicated daily time.' },
		{ id: 'extended-24w', title: 'Extended Intensive', hours: '12–18h/w', weeks: '24 Weeks', desc: 'Balanced pacing for practitioners balancing client work or commitments.' },
		{ id: 'distributed-48w', title: 'Distributed Practice', hours: '6–10h/w', weeks: '48 Weeks', desc: 'Sustainable pacing for working designers and engineers (~1h/day).' },
		{ id: 'maintenance-4h', title: 'Maintenance Mode', hours: '~4h/w', weeks: 'Self-Paced', desc: 'Preserves baseline skills during heavy work cycles.' }
	];

	function nextCompetency() {
		if (currentCompetencyIndex < practiceStore.baseline.length - 1) {
			currentCompetencyIndex++;
		} else {
			currentStage = 2; // Move to Diagnostic Synthesis
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function prevCompetency() {
		if (currentCompetencyIndex > 0) {
			currentCompetencyIndex--;
		} else {
			currentStage = 0; // Return to Theory
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function savePlay() {
		if (!playText.trim()) return;
		practiceStore.playLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: playText.trim()
		});
		practiceStore.saveToStorage();
		playText = '';
		playSaved = true;
		setTimeout(() => (playSaved = false), 2500);
	}

	function saveAttention() {
		if (!attentionText.trim()) return;
		practiceStore.nonInstrumentalLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: attentionText.trim()
		});
		practiceStore.saveToStorage();
		attentionText = '';
		attentionSaved = true;
		setTimeout(() => (attentionSaved = false), 2500);
	}

	function lockContractAndAdvance() {
		practiceStore.completeBaselineAndStartWeek1();
		if (onNavigateTab) {
			onNavigateTab('today');
		} else if (onSelectModality) {
			onSelectModality('m2');
		}
	}
</script>

<div class="max-w-4xl mx-auto w-full space-y-6">
	<!-- Stage Indicator Stepper -->
	<div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md">
		<div class="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
			<div class="flex items-center gap-2">
				<span class="px-2 py-0.5 rounded-full font-mono text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
					Orientation Runway
				</span>
				<span class="font-bold text-white">Foundation Setup</span>
			</div>
			<span class="text-neutral-400 font-mono text-[11px]">
				Step {currentStage + 1} of {stages.length}: <span class="text-amber-400 font-semibold">{stages[currentStage].label}</span>
			</span>
		</div>

		<!-- Stepper Pills -->
		<div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-3">
			{#each stages as s}
				<button
					type="button"
					onclick={() => (currentStage = s.id as FlowStage)}
					class="py-1.5 px-1 rounded-lg text-center text-[11px] font-mono transition cursor-pointer {currentStage === s.id ? 'bg-amber-500 text-neutral-950 font-bold shadow' : s.id < currentStage ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-950 text-neutral-500 border border-neutral-800/80 hover:text-neutral-300'}"
				>
					<span class="truncate block">{s.label}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- STAGE 0: Theory & Mindset -->
	{#if currentStage === 0}
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
			<div class="space-y-2">
				<span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
					Foundation Mindset
				</span>
				<h2 class="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
					How Deliberate Practice Works in Generative Work
				</h2>
				<p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
					Before generating thousands of synthetic variations, creative directors isolate specific perceptual mechanisms. This foundation establishes why and how this studio operates.
				</p>
			</div>

			<!-- Core Mental Model Card -->
			<div class="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
				<div class="flex items-center justify-between border-b border-neutral-800/80 pb-3">
					<div class="flex items-center gap-2 text-xs font-bold text-amber-400">
						<Sparkles class="w-4 h-4" />
						<span>The 70–80% Challenge Principle</span>
					</div>
					{#if module0Reading}
						<button
							type="button"
							onclick={() => (isReadingModalOpen = true)}
							class="text-xs font-mono text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
						>
							<BookOpen class="w-3.5 h-3.5" />
							<span>Read Core Text (Module 0)</span>
						</button>
					{/if}
				</div>

				<div class="space-y-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
					<p>
						<strong>Mere Production</strong> feels productive because outputs appear instantly. But effortless generation builds no permanent taste or editorial stamina.
					</p>
					<p class="text-neutral-400">
						<strong>Deliberate Practice</strong> isolates narrow micro-skills in your 70–80% difficulty zone: describing visual hierarchy with zero emotional adjectives, predicting prompt shifts before generating, and establishing explicit criteria for refusal.
					</p>
				</div>
			</div>

			<div class="flex items-center justify-between pt-2">
				<div class="text-xs text-neutral-500 font-mono">
					Next: 12-Skill Baseline Evaluation
				</div>
				<button
					type="button"
					onclick={() => (currentStage = 1)}
					class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
				>
					<span>Begin Skills Evaluation</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>
		</div>

	<!-- STAGE 1: The 12-Competency Baseline Evaluation -->
	{:else if currentStage === 1}
		<div class="space-y-4">
			<!-- Explanation Banner: What are you being asked? -->
			<div class="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Target class="w-4 h-4 text-amber-400" />
						<span class="font-bold text-white text-sm">
							Skill {currentCompetencyIndex + 1} of 12: <span class="text-amber-400">{currentCompetency.name}</span>
						</span>
					</div>
					<div class="flex items-center gap-3 font-mono text-xs text-neutral-400">
						<span>Evaluated: <strong class="text-white">{auditedCount}/12</strong></span>
						<span>•</span>
						<span>Average: <strong class="text-white">{avgScore} / 4.0</strong></span>
					</div>
				</div>
				<p class="text-xs text-neutral-300 leading-relaxed">
					This self-evaluation establishes your starting profile so future drills can target your real bottlenecks. Rate your day-to-day reflex from <strong>1 (Novice)</strong> to <strong>4 (Mastered)</strong>. There is no penalty for low ratings.
				</p>
			</div>

			<!-- Stepper Progress Dots -->
			<div class="grid grid-cols-12 gap-1.5">
				{#each practiceStore.baseline as comp, idx}
					{@const isAudited = comp.notes.trim().length > 0 || comp.score !== 2}
					<button
						type="button"
						onclick={() => (currentCompetencyIndex = idx)}
						class="h-2 rounded-full transition cursor-pointer {idx === currentCompetencyIndex ? 'bg-amber-500 ring-2 ring-amber-500/40' : isAudited ? 'bg-emerald-500/80' : 'bg-neutral-800'}"
						title="{comp.name} (Rating: {comp.score}/4)"
					></button>
				{/each}
			</div>

			<!-- Active Competency Card -->
			<div class="w-full">
				<BaselineCompetencyCard
					item={currentCompetency}
					onUpdate={() => practiceStore.saveToStorage()}
					isStepMode={true}
				/>
			</div>

			<!-- Navigation Controls -->
			<div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
				<button
					type="button"
					onclick={prevCompetency}
					class="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-800 hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer"
				>
					<ArrowLeft class="w-3.5 h-3.5" />
					<span>Previous</span>
				</button>

				{#if currentCompetencyIndex < 11}
					<button
						type="button"
						onclick={nextCompetency}
						class="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
					>
						<span>Next Skill ({currentCompetencyIndex + 2} of 12)</span>
						<ArrowRight class="w-4 h-4" />
					</button>
				{:else}
					<button
						type="button"
						onclick={() => (currentStage = 2)}
						class="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
					>
						<Check class="w-3.5 h-3.5" />
						<span>View Diagnostic Summary →</span>
					</button>
				{/if}
			</div>
		</div>

	<!-- STAGE 2: Diagnostic Summary -->
	{:else if currentStage === 2}
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
			<div class="space-y-1">
				<span class="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
					Diagnostic Summary
				</span>
				<h2 class="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
					Your Baseline Creative Profile
				</h2>
				<p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
					Based on your self-evaluation, here is your primary growth bottleneck and strengths breakdown across the three mastery layers.
				</p>
			</div>

			<!-- Score Overview Grid -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
					<span class="text-[10px] text-neutral-500 uppercase">Overall Average</span>
					<div class="text-lg font-bold text-white mt-1">{synthesis.avgScore} <span class="text-xs text-neutral-500">/ 4.0</span></div>
				</div>
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
					<span class="text-[10px] text-emerald-400 uppercase">Layer 1: Foundations</span>
					<div class="text-lg font-bold text-emerald-300 mt-1">{synthesis.avgLayer1} <span class="text-xs text-neutral-500">/ 4.0</span></div>
				</div>
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
					<span class="text-[10px] text-blue-400 uppercase">Layer 2: Systems</span>
					<div class="text-lg font-bold text-blue-300 mt-1">{synthesis.avgLayer2} <span class="text-xs text-neutral-500">/ 4.0</span></div>
				</div>
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
					<span class="text-[10px] text-amber-400 uppercase">Layer 3: Direction</span>
					<div class="text-lg font-bold text-amber-300 mt-1">{synthesis.avgLayer3} <span class="text-xs text-neutral-500">/ 4.0</span></div>
				</div>
			</div>

			<!-- Primary Growth Target Card -->
			<div class="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
				<div class="flex items-center justify-between pb-2 border-b border-neutral-800">
					<span class="text-xs font-mono font-bold text-amber-400 uppercase">Primary Growth Focus</span>
					<span class="text-xs font-mono bg-amber-950/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
						Rating: {synthesis.primaryBottleneck.score}/4
					</span>
				</div>
				<div class="font-bold text-base text-white">
					{synthesis.primaryBottleneck.name}
				</div>
				<p class="text-xs text-neutral-300 leading-relaxed">
					{synthesis.primaryBottleneck.exercise}
				</p>
			</div>

			<!-- Navigation -->
			<div class="flex items-center justify-between pt-2">
				<button
					type="button"
					onclick={() => (currentStage = 1)}
					class="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
				>
					<ArrowLeft class="w-3.5 h-3.5" />
					<span>Adjust Ratings</span>
				</button>
				<button
					type="button"
					onclick={() => (currentStage = 3)}
					class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
				>
					<span>Select Weekly Schedule</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>
		</div>

	<!-- STAGE 3: Schedule & Weekly Commitment -->
	{:else if currentStage === 3}
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
			<div class="space-y-1">
				<span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
					Weekly Rhythm
				</span>
				<h2 class="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
					Select Your Weekly Time Commitment
				</h2>
				<p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
					Burnout happens when arbitrary course timelines clash with real work commitments. Select the weekly commitment that aligns with your life. You can adjust this anytime in your preferences.
				</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{#each paths as path}
					<button
						type="button"
						onclick={() => {
							practiceStore.intensityPath = path.id;
							practiceStore.saveToStorage();
						}}
						class="p-5 rounded-2xl text-left border transition relative flex flex-col justify-between cursor-pointer {practiceStore.intensityPath === path.id ? 'bg-neutral-950 border-amber-500 shadow-xl shadow-amber-500/10' : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700'}"
					>
						{#if practiceStore.intensityPath === path.id}
							<div class="absolute top-4 right-4 text-amber-400">
								<CheckCircle2 class="w-4 h-4" />
							</div>
						{/if}
						<div class="space-y-1">
							<h3 class="font-bold text-sm text-neutral-100">{path.title}</h3>
							<div class="text-xs font-mono text-amber-400 font-semibold">{path.hours}</div>
							<p class="text-xs text-neutral-400 pt-2 leading-relaxed">{path.desc}</p>
						</div>
					</button>
				{/each}
			</div>

			<!-- Navigation -->
			<div class="flex items-center justify-between pt-2">
				<button
					type="button"
					onclick={() => (currentStage = 2)}
					class="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
				>
					<ArrowLeft class="w-3.5 h-3.5" />
					<span>Back</span>
				</button>
				<button
					type="button"
					onclick={() => (currentStage = 4)}
					class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
				>
					<span>Setup Daily Habits</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>
		</div>

	<!-- STAGE 4: Observation & Play Habits -->
	{:else if currentStage === 4}
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
			<div class="space-y-1">
				<span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
					Creative Habits
				</span>
				<h2 class="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
					Set Up Observation & Free Play Habits
				</h2>
				<p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
					Two foundational daily counterweights: noticing the physical world without turning everything into a client project, and playing without grading or evaluation.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Free Play Card -->
				<div class="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
					<div class="flex items-center gap-2 text-xs font-bold text-amber-400">
						<Sparkles class="w-4 h-4" />
						<span>1. Free Play Space</span>
					</div>
					<p class="text-xs text-neutral-400 leading-relaxed">
						Making with no brief, no rubric, and no audience. Prevents creative rigidity. Log one sentence on what you enjoyed exploring.
					</p>
					<div class="space-y-2 pt-1">
						<input
							type="text"
							maxlength="140"
							bind:value={playText}
							placeholder="e.g. Mixing fluid gradients without a client brief."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
						/>
						<button
							type="button"
							onclick={savePlay}
							disabled={!playText.trim()}
							class="w-full py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-40 transition cursor-pointer"
						>
							Save Free Play Log
						</button>
						{#if playSaved}
							<div class="text-[11px] text-emerald-400 font-mono text-center">Saved to your local studio log!</div>
						{/if}
					</div>
				</div>

				<!-- Daily Observation Card -->
				<div class="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
					<div class="flex items-center gap-2 text-xs font-bold text-amber-400">
						<Eye class="w-4 h-4" />
						<span>2. Daily Observation</span>
					</div>
					<p class="text-xs text-neutral-400 leading-relaxed">
						Noticing physical traits without immediately instrumenting them. Log one line: What did you encounter today that you were not looking for?
					</p>
					<div class="space-y-2 pt-1">
						<input
							type="text"
							maxlength="140"
							bind:value={attentionText}
							placeholder="e.g. Low afternoon sun casting cast-iron railing patterns."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
						/>
						<button
							type="button"
							onclick={saveAttention}
							disabled={!attentionText.trim()}
							class="w-full py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-40 transition cursor-pointer"
						>
							Save Observation Log
						</button>
						{#if attentionSaved}
							<div class="text-[11px] text-emerald-400 font-mono text-center">Saved to your local studio log!</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<div class="flex items-center justify-between pt-2">
				<button
					type="button"
					onclick={() => (currentStage = 3)}
					class="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
				>
					<ArrowLeft class="w-3.5 h-3.5" />
					<span>Back</span>
				</button>
				<button
					type="button"
					onclick={() => (currentStage = 5)}
					class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
				>
					<span>Review & Sign Practice Contract</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>
		</div>

	<!-- STAGE 5: Sign Practice Contract & Launch Week 1 -->
	{:else if currentStage === 5}
		<div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border-2 border-amber-500/40 space-y-6 shadow-2xl">
			<div class="space-y-2">
				<span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
					Practice Commitment
				</span>
				<h2 class="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
					Lock Foundation & Enter Active Practice
				</h2>
				<p class="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
					You have completed the orientation runway: evaluated your 12 skills, established your schedule ({paths.find(p => p.id === practiceStore.intensityPath)?.hours}), and set your creative counterweights.
				</p>
			</div>

			<!-- Summary Capsule -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs font-mono">
				<div>
					<span class="text-neutral-500 text-[10px] uppercase">Primary Growth Focus</span>
					<div class="font-bold text-amber-400 mt-0.5 truncate">{synthesis.primaryBottleneck.name}</div>
				</div>
				<div>
					<span class="text-neutral-500 text-[10px] uppercase">Weekly Commitment</span>
					<div class="font-bold text-white mt-0.5">{paths.find(p => p.id === practiceStore.intensityPath)?.hours}</div>
				</div>
				<div>
					<span class="text-neutral-500 text-[10px] uppercase">Upcoming Studio</span>
					<div class="font-bold text-emerald-400 mt-0.5">Week 1: Observation Studio</div>
				</div>
			</div>

			<div class="pt-4 flex flex-col sm:flex-row items-center gap-3">
				<button
					type="button"
					onclick={lockContractAndAdvance}
					class="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition cursor-pointer"
				>
					<CheckCircle2 class="w-4 h-4" />
					<span>Lock Contract & Start Week 1 Practice</span>
					<ArrowRight class="w-4 h-4" />
				</button>
				<button
					type="button"
					onclick={() => (currentStage = 1)}
					class="text-xs text-neutral-400 hover:text-white transition px-4 py-2 cursor-pointer"
				>
					Review Skill Ratings
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- Reading Modal for Module 0 Theory -->
{#if module0Reading}
	<ReadingModal
		reading={module0Reading}
		isOpen={isReadingModalOpen}
		onClose={() => (isReadingModalOpen = false)}
		onSelectReading={() => {}}
	/>
{/if}
