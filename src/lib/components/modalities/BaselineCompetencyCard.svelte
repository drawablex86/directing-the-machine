<script lang="ts">
	import type { BaselineCompetency } from '$lib/schemas/course.schema';
	import { COMPETENCY_DETAILS, type CompetencyDetail } from '$lib/schemas/competency-details';
	import {
		ChevronDown,
		HelpCircle,
		AlertCircle,
		CheckCircle2,
		Sparkles,
		Clock,
		Target,
		Layers
	} from '@lucide/svelte';

	let {
		item,
		onUpdate,
		isStepMode = false
	}: {
		item: BaselineCompetency;
		onUpdate: () => void;
		isStepMode?: boolean;
	} = $props();

	let userExpanded = $state<boolean | null>(null);
	let isExpanded = $derived(userExpanded !== null ? userExpanded : isStepMode);


	const details: CompetencyDetail = $derived(
		COMPETENCY_DETAILS[item.id] || {
			id: item.id,
			name: item.name,
			layer: 1,
			layerName: 'Foundation',
			whatItIs: item.exercise,
			whyItMatters: 'Critical skill in the creative direction framework.',
			exerciseTitle: item.exercise,
			timeEstimate: '20m',
			exerciseSteps: ['Perform the exercise as described', 'Reflect on friction points', 'Score honestly'],
			rubric: {
				1: 'Not Yet: Waits for instructions or defaults to machine consensus.',
				2: 'Emerging: Understands the principle but execution is inconsistent.',
				3: 'Functional: Performs reliably with standard problems.',
				4: 'Transferable: Deep mastery that transfers to unfamiliar domains.'
			},
			diagnosticPrompt: 'How reliably can you execute this without assistance?',
			exampleNote: 'Score: 2. Need more deliberate practice reps.'
		}
	);

	const scoreLabels: Record<number, { label: string; color: string; border: string; bg: string }> = {
		1: { label: '1 · Not Yet', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-950/20' },
		2: { label: '2 · Emerging', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' },
		3: { label: '3 · Functional', color: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-950/20' },
		4: { label: '4 · Transferable', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/20' }
	};
</script>

<div class="rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700/80 transition shadow-sm overflow-hidden flex flex-col justify-between">
	<!-- Card Main Header & Quick Scoring Bar -->
	<div class="p-5 space-y-3.5">
		<!-- Badges and Title -->
		<div class="flex items-start justify-between gap-3">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase tracking-wider {details.layer === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : details.layer === 2 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
						Layer {details.layer} · {details.layerName}
					</span>
					<span class="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
						<Clock class="w-3 h-3" />
						{details.timeEstimate}
					</span>
				</div>
				<h3 class="text-base font-bold text-white tracking-tight">
					{details.name}
				</h3>
			</div>

			<!-- Active Score Pill Badge -->
			<div class="px-2.5 py-1 rounded-xl text-xs font-mono font-bold border {scoreLabels[item.score]?.bg || 'bg-neutral-900'} {scoreLabels[item.score]?.border || 'border-neutral-800'} {scoreLabels[item.score]?.color || 'text-neutral-400'} shrink-0">
				{scoreLabels[item.score]?.label || `Score ${item.score}`}
			</div>
		</div>

		<!-- Concept Essence / What It Is -->
		<p class="text-xs text-neutral-300 leading-relaxed">
			{details.whatItIs}
		</p>

		<!-- Exercise Callout Box -->
		<div class="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80 space-y-1.5">
			<div class="flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
				<Target class="w-3.5 h-3.5 text-amber-400 shrink-0" />
				<span>Diagnostic Exercise:</span>
			</div>
			<div class="text-xs text-amber-400/90 font-medium">
				{details.exerciseTitle}
			</div>
			<p class="text-[11px] text-neutral-400 leading-relaxed">
				{details.whyItMatters}
			</p>
		</div>

		<!-- Interactive 1–4 Score Selector with Live Semantic Meaning -->
		<div class="space-y-2 pt-1">
			<div class="flex items-center justify-between text-xs">
				<span class="text-neutral-400 font-medium">Your Honest Assessment:</span>
				<span class="text-[11px] text-neutral-500">Scale from Appendix C</span>
			</div>

			<div class="grid grid-cols-4 gap-1.5">
				{#each [1, 2, 3, 4] as scoreVal}
					<button
						type="button"
						onclick={() => { item.score = scoreVal; onUpdate(); }}
						class="py-2 px-1 rounded-xl text-xs font-mono font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer {item.score === scoreVal ? 'bg-amber-500 text-neutral-950 shadow-md scale-[1.02]' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-800'}"
					>
						<span class="text-sm">{scoreVal}</span>
						<span class="text-[9px] font-sans font-semibold uppercase tracking-tight {item.score === scoreVal ? 'text-neutral-950' : 'text-neutral-500'}">
							{scoreVal === 1 ? 'Not Yet' : scoreVal === 2 ? 'Emerging' : scoreVal === 3 ? 'Functional' : 'Transfer'}
						</span>
					</button>
				{/each}
			</div>

			<!-- Live preview of the active score definition -->
			<div class="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[11px] leading-relaxed text-neutral-300">
				<strong class="text-amber-400 font-mono">Level {item.score} definition:</strong> {details.rubric[item.score as 1 | 2 | 3 | 4]}
			</div>
		</div>

		<!-- Diagnostic Note Input -->
		<div class="space-y-1 pt-1">
			<label for="notes-{item.id}" class="text-[11px] text-neutral-400 font-medium flex items-center justify-between">
				<span>Diagnostic Gap Notes (Where do you hesitate or default?):</span>
			</label>
			<input
				id="notes-{item.id}"
				type="text"
				bind:value={item.notes}
				onblur={onUpdate}
				placeholder="e.g. {details.exampleNote.slice(18)}"
				class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
			/>
		</div>
	</div>

	<!-- Expandable Detailed Guide & Rubric Drawer -->
	<div class="border-t border-neutral-800 bg-neutral-900/40">
		<button
			type="button"
			onclick={() => userExpanded = !isExpanded}
			class="w-full px-5 py-2.5 flex items-center justify-between text-xs text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
		>

			<span class="font-medium flex items-center gap-1.5">
				<HelpCircle class="w-3.5 h-3.5 text-amber-400" />
				{isExpanded ? 'Hide Step-by-Step Exercise & Complete Rubric' : 'How to Test Yourself · Step-by-Step Exercise & Rubrics'}
			</span>
			<ChevronDown class="w-3.5 h-3.5 transform transition {isExpanded ? 'rotate-180' : ''}" />
		</button>

		{#if isExpanded}
			<div class="p-5 pt-2 border-t border-neutral-800/60 space-y-4 bg-neutral-950/70 text-xs">
				<!-- Step by step instructions -->
				<div class="space-y-2">
					<div class="font-bold text-neutral-200 flex items-center gap-1.5">
						<span>3-Step Micro-Drill Protocol ({details.timeEstimate})</span>
					</div>
					<ol class="space-y-1.5 text-neutral-400 list-decimal list-inside leading-relaxed">
						{#each details.exerciseSteps as step}
							<li class="pl-1"><span class="text-neutral-300">{step}</span></li>
						{/each}
					</ol>
				</div>

				<!-- All 4 rubric levels side-by-side -->
				<div class="space-y-2">
					<div class="font-bold text-neutral-200">
						Full Universal Rubric (Appendix C):
					</div>
					<div class="space-y-1.5">
						<div class="p-2 rounded-lg border text-[11px] leading-relaxed {item.score === 4 ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400'}">
							<strong class="font-mono text-emerald-400">4 — Transferable:</strong> {details.rubric[4]}
						</div>
						<div class="p-2 rounded-lg border text-[11px] leading-relaxed {item.score === 3 ? 'bg-blue-950/30 border-blue-500/50 text-blue-200' : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400'}">
							<strong class="font-mono text-blue-400">3 — Functional:</strong> {details.rubric[3]}
						</div>
						<div class="p-2 rounded-lg border text-[11px] leading-relaxed {item.score === 2 ? 'bg-amber-950/30 border-amber-500/50 text-amber-200' : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400'}">
							<strong class="font-mono text-amber-400">2 — Emerging:</strong> {details.rubric[2]}
						</div>
						<div class="p-2 rounded-lg border text-[11px] leading-relaxed {item.score === 1 ? 'bg-red-950/30 border-red-500/50 text-red-200' : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400'}">
							<strong class="font-mono text-red-400">1 — Not Yet:</strong> {details.rubric[1]}
						</div>
					</div>
				</div>

				<!-- Tangible Example of Honest Note -->
				<div class="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1">
					<span class="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Example of an Honest Baseline Note:</span>
					<p class="text-[11px] text-neutral-300 italic leading-relaxed">
						"{details.exampleNote}"
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
