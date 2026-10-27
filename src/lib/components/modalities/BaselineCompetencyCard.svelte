<script lang="ts">
	import type { BaselineCompetency } from '$lib/schemas/course.schema';
	import { COMPETENCY_DETAILS, type CompetencyDetail } from '$lib/schemas/competency-details';
	import {
		ChevronDown,
		HelpCircle,
		CheckCircle2,
		Sparkles,
		Clock,
		Target,
		ArrowRight,
		Info
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

	// Plain-English clear rubrics and labels according to Don Norman / IID standard
	const scoreLevels: {
		level: 1 | 2 | 3 | 4;
		title: string;
		subtitle: string;
		tag: string;
		bgActive: string;
		borderActive: string;
		textActive: string;
		colorDot: string;
	}[] = [
		{
			level: 1,
			title: 'Level 1: Novice',
			subtitle: 'Relying on automatic defaults or guesswork',
			tag: 'Defaults / Guesswork',
			bgActive: 'bg-rose-950/30 border-rose-500/60 text-rose-200',
			borderActive: 'border-rose-500/40',
			textActive: 'text-rose-400',
			colorDot: 'bg-rose-400'
		},
		{
			level: 2,
			title: 'Level 2: Developing',
			subtitle: 'Know the theory, but execution is inconsistent',
			tag: 'Theory Known, Inconsistent',
			bgActive: 'bg-amber-950/30 border-amber-500/60 text-amber-200',
			borderActive: 'border-amber-500/40',
			textActive: 'text-amber-400',
			colorDot: 'bg-amber-400'
		},
		{
			level: 3,
			title: 'Level 3: Independent',
			subtitle: 'Execute reliably under standard constraints',
			tag: 'Reliable & Defensible',
			bgActive: 'bg-blue-950/30 border-blue-500/60 text-blue-200',
			borderActive: 'border-blue-500/40',
			textActive: 'text-blue-400',
			colorDot: 'bg-blue-400'
		},
		{
			level: 4,
			title: 'Level 4: Mastered',
			subtitle: 'Transfers across tools, media, and zero scaffolding',
			tag: 'Tool-Independent Mastery',
			bgActive: 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200',
			borderActive: 'border-emerald-500/40',
			textActive: 'text-emerald-400',
			colorDot: 'bg-emerald-400'
		}
	];

	let activeScoreObj = $derived(scoreLevels.find((s) => s.level === item.score) || scoreLevels[1]);
</script>

<div class="rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden flex flex-col justify-between transition">
	<div class="p-5 sm:p-7 space-y-5">
		<!-- Section 1: Clear Concept Header & Plain-English Purpose -->
		<div class="space-y-2">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div class="flex items-center gap-2">
					<span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider {details.layer === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : details.layer === 2 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}">
						Layer {details.layer} · {details.layerName}
					</span>
					<span class="text-xs text-neutral-400 font-mono flex items-center gap-1">
						<Clock class="w-3.5 h-3.5" />
						{details.timeEstimate} benchmark
					</span>
				</div>

				<!-- Current Rating Badge -->
				<div class="px-3 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 {activeScoreObj.bgActive}">
					<span class="w-2 h-2 rounded-full {activeScoreObj.colorDot}"></span>
					<span>Current Rating: {activeScoreObj.title}</span>
				</div>
			</div>

			<h3 class="text-xl sm:text-2xl font-serif font-bold text-neutral-100 tracking-tight">
				{details.name}
			</h3>

			<!-- Plain-Language Definition: What are you being asked? -->
			<p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
				{details.whatItIs}
			</p>
		</div>

		<!-- Section 2: Concrete Calibration Test (Why this matters & how you test it) -->
		<div class="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-3">
			<div class="flex items-center justify-between text-xs border-b border-neutral-800 pb-2">
				<span class="font-bold text-amber-400 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
					<Target class="w-3.5 h-3.5" />
					Concrete Calibration Test
				</span>
				<span class="text-neutral-500 text-[11px]">Gauge your true capacity</span>
			</div>

			<div>
				<h4 class="text-sm font-semibold text-white">
					{details.exerciseTitle}
				</h4>
				<p class="text-xs text-neutral-400 pt-1 leading-relaxed">
					{details.whyItMatters}
				</p>
			</div>

			<!-- Guided question to ask yourself right now -->
			<div class="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 text-xs text-neutral-300 flex items-start gap-2.5">
				<Info class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
				<div class="space-y-0.5">
					<span class="font-bold text-amber-400">Ask yourself:</span>
					<p class="italic">"{details.diagnosticPrompt}"</p>
				</div>
			</div>
		</div>

		<!-- Section 3: Interactive 4-Level Selector with Plain-English Rubrics -->
		<div class="space-y-2.5">
			<div class="flex items-center justify-between text-xs">
				<label for="rating-group" class="font-bold text-neutral-200">
					Select the description that best reflects your current day-to-day reflex:
				</label>
				<span class="text-xs text-neutral-500 font-mono">1 (Lowest) to 4 (Highest)</span>
			</div>

			<div id="rating-group" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
				{#each scoreLevels as sl}
					{@const isSelected = item.score === sl.level}
					<button
						type="button"
						onclick={() => {
							item.score = sl.level;
							onUpdate();
						}}
						class="p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer {isSelected ? 'bg-amber-500/10 border-amber-500 text-neutral-100 shadow-md ring-1 ring-amber-500/30' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'}"
					>
						<div class="flex items-center justify-between w-full">
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 {isSelected ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'}">
									{sl.level}
								</span>
								<span class="font-bold text-xs {isSelected ? 'text-white' : 'text-neutral-300'}">
									{sl.title}
								</span>
							</div>

							{#if isSelected}
								<CheckCircle2 class="w-4 h-4 text-amber-400 shrink-0" />
							{/if}
						</div>

						<p class="text-[11px] leading-relaxed pt-1 {isSelected ? 'text-neutral-200' : 'text-neutral-500'}">
							{details.rubric[sl.level]}
						</p>
					</button>
				{/each}
			</div>
		</div>

		<!-- Section 4: Self-Diagnosis Notes -->
		<div class="space-y-1.5 pt-1">
			<label for="notes-{item.id}" class="text-xs font-semibold text-neutral-300 flex items-center justify-between">
				<span>Where do you usually hesitate or default when executing this?</span>
				<span class="text-[11px] text-neutral-500 font-normal">Optional personal note</span>
			</label>
			<input
				id="notes-{item.id}"
				type="text"
				bind:value={item.notes}
				onblur={onUpdate}
				placeholder="e.g. {details.exampleNote.slice(18)}"
				class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
			/>
		</div>
	</div>

	<!-- Collapsible Step-by-Step Exercise Protocol Drawer -->
	<div class="border-t border-neutral-800 bg-neutral-950/80">
		<button
			type="button"
			onclick={() => (userExpanded = !isExpanded)}
			class="w-full px-5 py-3 flex items-center justify-between text-xs text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
		>
			<span class="font-semibold flex items-center gap-1.5">
				<HelpCircle class="w-3.5 h-3.5 text-amber-400" />
				{isExpanded ? 'Hide Step-by-Step Micro-Drill' : 'Show How to Run This Micro-Drill in 3 Steps'}
			</span>
			<ChevronDown class="w-4 h-4 transform transition {isExpanded ? 'rotate-180' : ''}" />
		</button>

		{#if isExpanded}
			<div class="p-5 pt-1 border-t border-neutral-800/60 space-y-4 bg-neutral-950 text-xs">
				<div class="space-y-2">
					<div class="font-bold text-neutral-200">
						3-Step Micro-Drill Protocol ({details.timeEstimate})
					</div>
					<ol class="space-y-1.5 text-neutral-400 list-decimal list-inside leading-relaxed">
						{#each details.exerciseSteps as step}
							<li class="pl-1"><span class="text-neutral-300">{step}</span></li>
						{/each}
					</ol>
				</div>

				<div class="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
					<span class="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Example of an Honest Reflection:</span>
					<p class="text-[11px] text-neutral-300 italic leading-relaxed">
						"{details.exampleNote}"
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
