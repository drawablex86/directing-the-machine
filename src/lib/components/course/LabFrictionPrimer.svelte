<script lang="ts">
	import {
		BookOpen,
		Sparkles,
		AlertTriangle,
		CheckCircle2,
		Circle,
		ChevronDown,
		ChevronUp,
		ArrowRight,
		ExternalLink,
		BookMarked,
		Flame
	} from '@lucide/svelte';
	import { getReadingByCode, getReadingsByModality, type CoreReading } from '$lib/data/core-readings';
	import { practiceStore } from '$lib/state/practice.svelte';

	let {
		modalityId,
		primaryReadingCode,
		failureMode,
		directorialDiscipline,
		benchmarkPass,
		benchmarkFail,
		onOpenFullReading,
		onOpenAppendix
	}: {
		modalityId: string;
		primaryReadingCode?: string;
		failureMode: string;
		directorialDiscipline: string;
		benchmarkPass?: string;
		benchmarkFail?: string;
		onOpenFullReading?: (reading: CoreReading) => void;
		onOpenAppendix?: (appendixId: string) => void;
	} = $props();

	let isExpanded = $state(true);

	let reading = $derived.by<CoreReading | undefined>(() => {
		if (primaryReadingCode) {
			const found = getReadingByCode(primaryReadingCode);
			if (found) return found;
		}
		const allForModality = getReadingsByModality(modalityId);
		return allForModality[0];
	});

	let isCompleted = $derived(
		reading ? practiceStore.isReadingCompleted(reading.code) : false
	);

	function toggleReading() {
		if (reading) {
			practiceStore.toggleReadingCompleted(reading.code);
		}
	}
</script>

<div class="rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-lg overflow-hidden transition-all duration-200">
	<!-- Header Bar: Reading Identification & Accordion Toggle -->
	<div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 bg-neutral-950/40">
		<div class="flex items-center gap-2.5 flex-wrap">
			<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/25">
				<Flame class="w-3.5 h-3.5 text-amber-400" />
				Friction Primer · Theory Grounding
			</span>

			{#if reading}
				<span class="text-neutral-500 text-xs hidden sm:inline">•</span>
				<span class="text-xs font-mono font-bold text-neutral-300">
					{reading.code}: {reading.title}
				</span>

				{#if isCompleted}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
						<CheckCircle2 class="w-3 h-3" />
						<span>Concept Ingested</span>
					</span>
				{/if}
			{/if}
		</div>

		<div class="flex items-center gap-2 self-end sm:self-auto">
			{#if reading && onOpenFullReading}
				<button
					type="button"
					onclick={() => reading && onOpenFullReading(reading)}
					class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition cursor-pointer"
				>
					<BookOpen class="w-3.5 h-3.5" />
					<span>Full Reading</span>
				</button>
			{/if}

			{#if reading}
				<button
					type="button"
					onclick={toggleReading}
					title="Mark reading concept as digested"
					class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer {isCompleted ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/40' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'}"
				>
					{#if isCompleted}
						<CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
						<span>Marked</span>
					{:else}
						<Circle class="w-3.5 h-3.5 text-neutral-400" />
						<span>Mark Read</span>
					{/if}
				</button>
			{/if}

			<button
				type="button"
				onclick={() => isExpanded = !isExpanded}
				class="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
				aria-label={isExpanded ? 'Collapse primer' : 'Expand primer'}
			>
				{#if isExpanded}
					<ChevronUp class="w-4 h-4" />
				{:else}
					<ChevronDown class="w-4 h-4" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Primer Body: Decisive Contrast & Failure Diagnostic -->
	{#if isExpanded}
		<div class="p-4 sm:p-5 space-y-4 animate-in fade-in duration-150">
			<!-- Decisive Mental Model Quote -->
			{#if reading?.keyMentalModel}
				<blockquote class="text-xs sm:text-sm font-serif italic text-neutral-200 border-l-2 border-amber-500 pl-3.5 py-0.5 leading-relaxed bg-amber-500/5 rounded-r-xl p-2.5">
					"{reading.keyMentalModel}"
				</blockquote>
			{/if}

			<!-- Decisive Contrast Matrix: The Default Trap vs The Directorial Discipline -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
				<!-- Default Reflexive Trap (Why Mere Generation Fails) -->
				<div class="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
					<div class="flex items-center gap-1.5 text-rose-400 font-mono font-bold uppercase text-[10px] tracking-wider">
						<AlertTriangle class="w-3.5 h-3.5 text-rose-400 shrink-0" />
						<span>The Default Reflex / Failure Trap</span>
					</div>
					<p class="text-neutral-300 font-sans leading-relaxed">
						{failureMode}
					</p>
				</div>

				<!-- The Directorial Discipline (Why This Lab Exists) -->
				<div class="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
					<div class="flex items-center gap-1.5 text-emerald-400 font-mono font-bold uppercase text-[10px] tracking-wider">
						<Sparkles class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
						<span>The Directorial Discipline to Train</span>
					</div>
					<p class="text-neutral-300 font-sans leading-relaxed">
						{directorialDiscipline}
					</p>
				</div>
			</div>

			<!-- Optional Benchmark Pass vs Fail -->
			{#if benchmarkPass && benchmarkFail}
				<div class="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-2 text-xs">
					<div class="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider">
						Diagnostic Benchmark: Observable Criterion
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
						<div class="text-emerald-400/90 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30">
							<strong class="text-emerald-300 font-bold">PASS:</strong> {benchmarkPass}
						</div>
						<div class="text-rose-400/90 bg-rose-950/20 p-2 rounded-lg border border-rose-900/30">
							<strong class="text-rose-300 font-bold">FAIL:</strong> {benchmarkFail}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
