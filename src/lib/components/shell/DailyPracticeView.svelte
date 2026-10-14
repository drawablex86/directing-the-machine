<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import {
		Play,
		ChevronRight,
		Clock,
		Flame,
		CheckCircle2,
		ArrowRight,
		Sparkles,
		Eye,
		Layers,
		Compass
	} from '@lucide/svelte';

	let { onSelectModality }: { onSelectModality: (modId: string) => void } = $props();

	const loopSteps = [
		{ id: 'read', name: 'Read', time: '20m', desc: 'Study core concept & mental models', targetMod: 'm0' },
		{ id: 'practise', name: 'Practise', time: '60m', desc: 'Deliberate micro-drill with immediate feedback', targetMod: 'm2' },
		{ id: 'study', name: 'Study', time: '60m', desc: 'Craft study, close reading, or transcription', targetMod: 'm5' },
		{ id: 'make', name: 'Make', time: '2h', desc: 'Project execution against specification', targetMod: 'm3' },
		{ id: 'diagnose', name: 'Diagnose', time: '30m', desc: 'Audit output using top-down ladder', targetMod: 'm2' },
		{ id: 'log', name: 'Log', time: '10m', desc: 'Hard-capped 10-minute reflective log', targetMod: 'logs' },
		{ id: 'transfer', name: 'Transfer', time: '30m', desc: 'Practice with 1 scaffold removed', targetMod: 'm7' },
		{ id: 'play', name: 'Play', time: '30m', desc: 'Unstructured, curiosity-driven exploration', targetMod: 'm0' }
	];

	let currentStep = $derived(loopSteps[practiceStore.currentStepIndex] || loopSteps[0]);

	// Quick 1-line inputs for today's practice
	let quickPlay = $state('');
	let quickAttention = $state('');
	let savedPlayNotice = $state(false);
	let savedAttentionNotice = $state(false);

	function savePlay() {
		if (!quickPlay.trim()) return;
		practiceStore.playLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: quickPlay.trim()
		});
		practiceStore.saveToStorage();
		quickPlay = '';
		savedPlayNotice = true;
		setTimeout(() => savedPlayNotice = false, 2000);
	}

	function saveAttention() {
		if (!quickAttention.trim()) return;
		practiceStore.nonInstrumentalLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: quickAttention.trim()
		});
		practiceStore.saveToStorage();
		quickAttention = '';
		savedAttentionNotice = true;
		setTimeout(() => savedAttentionNotice = false, 2000);
	}
</script>

<div class="space-y-6">
	<!-- Hero: Current Step & Immediate Action -->
	<div class="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl space-y-6">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
						Today's Daily Practice
					</span>
					<span class="text-neutral-600">•</span>
					<span class="text-xs text-neutral-400">Step {practiceStore.currentStepIndex + 1} of 8</span>
				</div>
				<h2 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
					<span>{currentStep.name}</span>
					<span class="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
						{currentStep.time}
					</span>
				</h2>
				<p class="text-xs md:text-sm text-neutral-400 max-w-xl">
					{currentStep.desc}
				</p>
			</div>

			<!-- Quick Primary Action Button -->
			<div class="flex items-center gap-3">
				{#if currentStep.targetMod === 'logs'}
					<a
						href="/logs"
						class="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition"
					>
						<span>Open Studio Logbook</span>
						<ArrowRight class="w-4 h-4" />
					</a>
				{:else}
					<button
						type="button"
						onclick={() => onSelectModality(currentStep.targetMod)}
						class="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition"
					>
						<span>Launch Studio Lab</span>
						<ArrowRight class="w-4 h-4" />
					</button>
				{/if}

				<button
					type="button"
					onclick={() => {
						practiceStore.currentStepIndex = (practiceStore.currentStepIndex + 1) % loopSteps.length;
						practiceStore.saveToStorage();
					}}
					class="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
					title="Advance to next step in today's loop"
				>
					Next Step →
				</button>
			</div>
		</div>

		<!-- Step Sequence Navigator -->
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs text-neutral-400">
				<span class="font-medium text-neutral-300">Daily 8-Step Practice Routine</span>
				<span class="font-mono text-[11px]">Click any step to set your current focus</span>
			</div>

			<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
				{#each loopSteps as step, i}
					<button
						type="button"
						onclick={() => {
							practiceStore.currentStepIndex = i;
							practiceStore.saveToStorage();
						}}
						class="p-2.5 rounded-xl border text-left transition flex flex-col justify-between {practiceStore.currentStepIndex === i ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm' : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'}"
					>
						<div class="flex items-center justify-between text-[11px] font-mono">
							<span class="font-bold {practiceStore.currentStepIndex === i ? 'text-amber-400' : 'text-neutral-500'}">
								0{i + 1}
							</span>
							<span class="text-[10px] opacity-75">{step.time}</span>
						</div>
						<div class="font-semibold text-xs mt-1 truncate">
							{step.name}
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Two Column Layout: Current Phase & Daily Non-Instrumental Routine -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Phase & Scaffolding Controls -->
		<div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Compass class="w-4 h-4 text-amber-400" />
					<h3 class="font-bold text-sm text-neutral-100">Curriculum Progression</h3>
				</div>
				<span class="text-xs font-mono text-neutral-400">
					Layer {practiceStore.masteryLayer}: {practiceStore.masteryLayer === 1 ? 'Capability' : practiceStore.masteryLayer === 2 ? 'Independence' : 'Agency'}
				</span>
			</div>

			<div class="space-y-1.5">
				<label for="active-curriculum-phase" class="text-xs text-neutral-400">Active Curriculum Phase</label>
				<select
					id="active-curriculum-phase"
					bind:value={practiceStore.activePart}
					onchange={() => practiceStore.saveToStorage()}
					class="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500"
				>
					<option value={0}>Week 0 — Baseline & Practice Contract</option>
					<option value={1}>Part I — Problem-Finding & Observation</option>
					<option value={2}>Part II — Premise & Specification (Ladder removed)</option>
					<option value={3}>Part III — Pipeline & Calibration (Template removed)</option>
					<option value={4}>Part IV — Taste & Curation (Exercises removed)</option>
					<option value={5}>Part V — Direction, Collaboration & Refusal</option>
					<option value={6}>Part VI — Authorship & Transfer</option>
					<option value={7}>Month 4 — Project 7: Visual Campaign</option>
					<option value={8}>Month 5 — Project 8: Writing Voice Guide</option>
					<option value={9}>Month 6 — Project 9: Hybrid Visual Essay</option>
					<option value={10}>Month 7 — Project 10: Character Design System</option>
					<option value={11}>Month 8 — Project 11: Editorial Series</option>
					<option value={12}>Month 9 — Project 12: Blank-Sheet Capstone</option>
				</select>
			</div>

			<!-- Scaffolding Badges -->
			<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
				<div class="text-[11px] font-semibold text-neutral-300">Active Scaffolds in Current Phase:</div>
				<div class="flex flex-wrap gap-2 text-xs">
					<span class="px-2 py-0.5 rounded border {practiceStore.scaffolding.ladder ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-600 line-through'}">
						Diagnostic Ladder
					</span>
					<span class="px-2 py-0.5 rounded border {practiceStore.scaffolding.template ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-600 line-through'}">
						Brief Template
					</span>
					<span class="px-2 py-0.5 rounded border {practiceStore.scaffolding.exercise ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-600 line-through'}">
						Guided Exercises
					</span>
				</div>
				<p class="text-[10px] text-neutral-500 leading-tight">
					As you progress, crutches are intentionally stripped away to develop autonomous creative judgment.
				</p>
			</div>
		</div>

		<!-- Daily Attention & Play Quick Journal -->
		<div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Sparkles class="w-4 h-4 text-amber-400" />
					<h3 class="font-bold text-sm text-neutral-100">Daily Attention & Play Check</h3>
				</div>
				<span class="text-[11px] text-neutral-400">1 Sentence Each</span>
			</div>

			<!-- Non-Instrumental Attention Input -->
			<div class="space-y-1.5">
				<div class="flex items-center justify-between text-xs">
					<span class="text-neutral-300 font-medium">Non-Instrumental Observation</span>
					{#if savedAttentionNotice}
						<span class="text-emerald-400 text-[11px] font-bold">Saved!</span>
					{/if}
				</div>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={quickAttention}
						onkeydown={(e) => { if (e.key === 'Enter') saveAttention(); }}
						placeholder="What did you observe today without intending to use it?"
						class="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
					<button
						type="button"
						onclick={saveAttention}
						class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
					>
						Log
					</button>
				</div>
			</div>

			<!-- Unstructured Play Input -->
			<div class="space-y-1.5">
				<div class="flex items-center justify-between text-xs">
					<span class="text-neutral-300 font-medium">Unstructured Play</span>
					{#if savedPlayNotice}
						<span class="text-emerald-400 text-[11px] font-bold">Saved!</span>
					{/if}
				</div>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={quickPlay}
						onkeydown={(e) => { if (e.key === 'Enter') savePlay(); }}
						placeholder="What curious experiment did you try purely for joy?"
						class="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
					<button
						type="button"
						onclick={savePlay}
						class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
					>
						Log
					</button>
				</div>
			</div>

			<p class="text-[10px] text-neutral-500 leading-tight">
				Protects against hollow instrumentalism and model fatigue. Complete history viewable in M0.
			</p>
		</div>
	</div>
</div>
