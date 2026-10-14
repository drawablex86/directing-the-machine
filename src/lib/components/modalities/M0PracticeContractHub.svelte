<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { IntensityPath } from '$lib/schemas/course.schema';
	import { Target, Shield, Clock, Award, CheckCircle, CheckCircle2, RotateCcw, Sparkles, Eye, Filter, BarChart3, ArrowLeft, ArrowRight, Check, ListChecks, LayoutGrid, HelpCircle } from '@lucide/svelte';
	import BaselineCompetencyCard from './BaselineCompetencyCard.svelte';
	import { COMPETENCY_DETAILS } from '$lib/schemas/competency-details';

	let activeSubTab = $state<'baseline' | 'intensity' | 'play' | 'attention'>('baseline');
	let baselineViewMode = $state<'step' | 'grid'>('step');
	let currentStepIndex = $state(0);
	let baselineLayerFilter = $state<number | 'all'>('all');

	let filteredBaseline = $derived(
		baselineLayerFilter === 'all'
			? practiceStore.baseline
			: practiceStore.baseline.filter((item) => {
					const detail = COMPETENCY_DETAILS[item.id];
					return detail && detail.layer === baselineLayerFilter;
				})
	);

	let auditedCount = $derived(
		practiceStore.baseline.filter((b) => b.notes.trim().length > 0 || b.score !== 2).length
	);

	let avgScore = $derived(
		(practiceStore.baseline.reduce((sum, b) => sum + b.score, 0) / practiceStore.baseline.length).toFixed(1)
	);

	let currentCompetency = $derived(practiceStore.baseline[currentStepIndex] || practiceStore.baseline[0]);
	let currentDetail = $derived(COMPETENCY_DETAILS[currentCompetency.id]);

	function nextStep() {
		if (currentStepIndex < practiceStore.baseline.length - 1) {
			currentStepIndex += 1;
		}
	}

	function prevStep() {
		if (currentStepIndex > 0) {
			currentStepIndex -= 1;
		}
	}

	function goToStep(index: number) {
		currentStepIndex = index;
		baselineViewMode = 'step';
	}


	// Intensity options from Appendix O
	const paths: { id: IntensityPath; title: string; hours: string; weeks: string; desc: string }[] = [
		{ id: 'full-time-12w', title: 'Full-Time Intensive', hours: '18–25h/w (up to 35h)', weeks: '12 Weeks', desc: 'Accelerated immersion. Requires dedicated study without full-time employment.' },
		{ id: 'extended-24w', title: 'Extended Intensive', hours: '12–18h/w', weeks: '24 Weeks', desc: 'Balanced pacing for practitioners balancing part-time work or commitments.' },
		{ id: 'distributed-48w', title: 'Distributed Practice', hours: '6–10h/w', weeks: '48 Weeks', desc: 'Sustainable year-long mastery for practitioners with full-time careers.' },
		{ id: 'maintenance-4h', title: 'Maintenance Mode', hours: '~4h/w', weeks: 'Flexible', desc: 'Preserves reliable capacity when life or client work peaks. Pauses mastery gates.' }
	];

	// Non-instrumental & play inputs
	let playText = $state('');
	let attentionText = $state('');
	let playLogged = $state(false);
	let attentionLogged = $state(false);

	function logPlay() {
		if (!playText.trim()) return;
		practiceStore.playLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: playText.trim()
		});
		practiceStore.saveToStorage();
		playText = '';
		playLogged = true;
		setTimeout(() => playLogged = false, 2000);
	}

	function logAttention() {
		if (!attentionText.trim()) return;
		practiceStore.nonInstrumentalLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: attentionText.trim()
		});
		practiceStore.saveToStorage();
		attentionText = '';
		attentionLogged = true;
		setTimeout(() => attentionLogged = false, 2000);
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M0
				</span>
				<h2 class="text-base font-bold text-white">Deliberate Practice, Play & Contract Studio</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 0, Week 0 Baseline Diagnostic, Appendix I, and Appendix O Pacing.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeSubTab = 'baseline'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'baseline' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Baseline (1–4)
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'intensity'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'intensity' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Intensity Path
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'play'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'play' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Play Practice
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'attention'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'attention' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Attention
			</button>
		</div>
	</div>

	<!-- TAB 1: Baseline Diagnostic Radar (12 competencies) -->
	{#if activeSubTab === 'baseline'}
		<div class="space-y-6">
			<!-- Purpose & Orientation Banner -->
			<div class="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3 shadow-sm">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
					<div>
						<h3 class="text-sm font-bold text-white flex items-center gap-2">
							<Target class="w-4 h-4 text-amber-400" />
							<span>The Week 0 Baseline Diagnostic Map</span>
						</h3>
						<p class="text-xs text-neutral-400 mt-0.5">
							This is not a test or a grade. It is an honest diagnostic mirror to identify your reflexive defaults and blind spots before training.
						</p>
					</div>

					<div class="flex items-center gap-3 shrink-0">
						<div class="px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs flex items-center gap-1.5 font-mono">
							<span class="text-neutral-500">Audited:</span>
							<span class="font-bold text-amber-400">{auditedCount}/12</span>
						</div>
						<div class="px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs flex items-center gap-1.5 font-mono">
							<span class="text-neutral-500">Avg Score:</span>
							<span class="font-bold text-white">{avgScore} / 4.0</span>
						</div>
					</div>
				</div>

				<!-- Scoring Legend -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
					<div class="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
						<span class="w-5 h-5 rounded-md bg-red-950/60 text-red-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">1</span>
						<span class="text-neutral-300"><strong>Not Yet</strong> · Waits or defaults</span>
					</div>
					<div class="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
						<span class="w-5 h-5 rounded-md bg-amber-950/60 text-amber-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">2</span>
						<span class="text-neutral-300"><strong>Emerging</strong> · Theory over reflex</span>
					</div>
					<div class="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
						<span class="w-5 h-5 rounded-md bg-blue-950/60 text-blue-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">3</span>
						<span class="text-neutral-300"><strong>Functional</strong> · Operates reliably</span>
					</div>
					<div class="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
						<span class="w-5 h-5 rounded-md bg-emerald-950/60 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">4</span>
						<span class="text-neutral-300"><strong>Transferable</strong> · Autonomous</span>
					</div>
				</div>
			</div>

			<!-- View Mode & Navigation Controls -->
			<div class="flex items-center justify-between gap-3 flex-wrap border-b border-neutral-800 pb-3">
				<!-- Stepper Tabs / View Mode Switcher -->
				<div class="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
					<button
						type="button"
						onclick={() => baselineViewMode = 'step'}
						class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition {baselineViewMode === 'step' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
					>
						<ListChecks class="w-3.5 h-3.5" />
						<span>Step-by-Step Diagnostic</span>
					</button>
					<button
						type="button"
						onclick={() => baselineViewMode = 'grid'}
						class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition {baselineViewMode === 'grid' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
					>
						<LayoutGrid class="w-3.5 h-3.5" />
						<span>Overview & Review Grid</span>
					</button>
				</div>

				<div class="flex items-center gap-2 text-xs">
					<div class="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 text-[11px] flex items-center gap-1.5">
						<HelpCircle class="w-3.5 h-3.5 text-amber-400" />
						<span>Evaluated in Week 0 & re-audited at Phase Gates (Weeks 4, 8, 12)</span>
					</div>
				</div>
			</div>

			<!-- MODE 1: STEP-BY-STEP DIAGNOSTIC WIZARD (One competency at a time) -->
			{#if baselineViewMode === 'step'}
				<div class="space-y-5">
					<!-- Step Progress Bar & Quick Jump Navigation -->
					<div class="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
						<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
							<div class="flex items-center gap-2">
								<span class="font-mono font-bold text-amber-400">Step {currentStepIndex + 1} of 12</span>
								<span class="text-neutral-500">•</span>
								<span class="text-neutral-300 font-semibold">{currentDetail?.name}</span>
								<span class="text-[10px] font-mono px-2 py-0.5 rounded {currentDetail?.layer === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : currentDetail?.layer === 2 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
									Layer {currentDetail?.layer}: {currentDetail?.layerName}
								</span>
							</div>

							<div class="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
								<span>{auditedCount} of 12 Audited</span>
							</div>
						</div>

						<!-- Visual Step Indicator Pills -->
						<div class="grid grid-cols-12 gap-1.5">
							{#each practiceStore.baseline as comp, idx}
								{@const isAudited = comp.notes.trim().length > 0 || comp.score !== 2}
								{@const isCurrent = idx === currentStepIndex}
								<button
									type="button"
									onclick={() => goToStep(idx)}
									title="{idx + 1}. {comp.name} (Score: {comp.score})"
									class="h-2 rounded-full transition cursor-pointer relative group {isCurrent ? 'bg-amber-500 ring-2 ring-amber-500/40' : isAudited ? 'bg-emerald-500/70 hover:bg-emerald-400' : 'bg-neutral-800 hover:bg-neutral-700'}"
								>
									<span class="sr-only">Step {idx + 1}: {comp.name}</span>
								</button>
							{/each}
						</div>

						<!-- Mastery Layer Grouping Labels -->
						<div class="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1">
							<span class="text-emerald-400/80">Foundations (1–4)</span>
							<span class="text-blue-400/80">Systems & Calibration (5–9)</span>
							<span class="text-amber-400/80">Agency & Direction (10–12)</span>
						</div>
					</div>

					<!-- Active Competency Card in Guided Mode -->
					<div class="w-full">
						<BaselineCompetencyCard
							item={currentCompetency}
							onUpdate={() => practiceStore.saveToStorage()}
							isStepMode={true}
						/>
					</div>

					<!-- Step Navigation Toolbar -->
					<div class="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
						<button
							type="button"
							onclick={prevStep}
							disabled={currentStepIndex === 0}
							class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-neutral-800 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-900 text-neutral-300"
						>
							<ArrowLeft class="w-3.5 h-3.5" />
							<span>Previous Competency</span>
						</button>

						<div class="flex items-center gap-2">
							{#if currentStepIndex < 11}
								<button
									type="button"
									onclick={nextStep}
									class="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 transition cursor-pointer shadow-md"
								>
									<span>Next Competency</span>
									<ArrowRight class="w-3.5 h-3.5" />
								</button>
							{:else}
								<button
									type="button"
									onclick={() => baselineViewMode = 'grid'}
									class="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition cursor-pointer shadow-md"
								>
									<Check class="w-3.5 h-3.5" />
									<span>Finish & Review 12-Map Summary</span>
								</button>
							{/if}
						</div>
					</div>
				</div>

			<!-- MODE 2: OVERVIEW & REVIEW GRID (All 12 cards side-by-side) -->
			{:else}
				<div class="space-y-6">
					<!-- Filter Bar by Mastery Layer -->
					<div class="flex items-center justify-between gap-3 flex-wrap">
						<div class="flex items-center gap-1.5 text-xs">
							<span class="text-neutral-500 font-medium flex items-center gap-1 mr-1">
								<Filter class="w-3.5 h-3.5" />
								Filter:
							</span>
							<button
								type="button"
								onclick={() => baselineLayerFilter = 'all'}
								class="px-3 py-1.5 rounded-xl font-medium transition cursor-pointer {baselineLayerFilter === 'all' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'}"
							>
								All 12 Competencies
							</button>
							<button
								type="button"
								onclick={() => baselineLayerFilter = 1}
								class="px-3 py-1.5 rounded-xl font-medium transition cursor-pointer {baselineLayerFilter === 1 ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'}"
							>
								Layer 1: Foundations (4)
							</button>
							<button
								type="button"
								onclick={() => baselineLayerFilter = 2}
								class="px-3 py-1.5 rounded-xl font-medium transition cursor-pointer {baselineLayerFilter === 2 ? 'bg-blue-500 text-neutral-950 font-bold' : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'}"
							>
								Layer 2: Systems & Calibration (5)
							</button>
							<button
								type="button"
								onclick={() => baselineLayerFilter = 3}
								class="px-3 py-1.5 rounded-xl font-medium transition cursor-pointer {baselineLayerFilter === 3 ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'}"
							>
								Layer 3: Agency & Direction (3)
							</button>
						</div>

						<button
							type="button"
							onclick={() => baselineViewMode = 'step'}
							class="text-xs text-amber-400 hover:text-amber-300 font-medium transition"
						>
							← Return to Step-by-Step View
						</button>
					</div>

					<!-- Cards Grid -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each filteredBaseline as item}
							<BaselineCompetencyCard
								item={item}
								onUpdate={() => practiceStore.saveToStorage()}
								isStepMode={false}
							/>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- TAB 2: Intensity Path Selector (Appendix O) -->
	{:else if activeSubTab === 'intensity'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Adaptive Pacing (Appendix O):</strong> Burnout is not a character flaw; it is an intensity mismatch. Choose an intensity compatible with your work and life. You can switch at any time without resetting progress.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each paths as path}
					<button
						type="button"
						onclick={() => { practiceStore.intensityPath = path.id; practiceStore.saveToStorage(); }}
						class="p-4 rounded-xl text-left border transition relative flex flex-col justify-between {practiceStore.intensityPath === path.id ? 'bg-neutral-950 border-amber-500 shadow-lg' : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700'}"
					>
						{#if practiceStore.intensityPath === path.id}
							<div class="absolute top-3 right-3 text-amber-400">
								<CheckCircle2 class="w-4 h-4" />
							</div>
						{/if}
						<div>
							<h3 class="font-bold text-sm text-neutral-100">{path.title}</h3>
							<div class="flex items-center gap-2 mt-1 text-xs font-mono text-amber-400">
								<span>{path.hours}</span>
								<span>•</span>
								<span>{path.weeks}</span>
							</div>
							<p class="text-xs text-neutral-400 mt-2 leading-relaxed">
								{path.desc}
							</p>
						</div>
						<div class="mt-4 pt-3 border-t border-neutral-800/80 text-[11px] font-medium {practiceStore.intensityPath === path.id ? 'text-amber-400' : 'text-neutral-500'}">
							{practiceStore.intensityPath === path.id ? 'Active Intensity Mode' : 'Select Mode'}
						</div>
					</button>
				{/each}
			</div>
		</div>

	<!-- TAB 3: Protected Play Practice -->
	{:else if activeSubTab === 'play'}
		<div class="space-y-4">
			<div class="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-2">
				<div class="flex items-center gap-2 text-amber-400 font-semibold">
					<Sparkles class="w-4 h-4" />
					<span>Play Practice: Unstructured Making for Its Own Sake</span>
				</div>
				<p class="leading-relaxed">
					Play has: <strong>no brief, no deliverable, no diagnosis, no criteria, and no audience</strong>. It prevents structural rigidity.
					After play, log exactly one sentence: <em>What did I enjoy?</em> No analysis allowed.
				</p>
			</div>

			<div class="space-y-2">
				<label for="play-enjoy" class="block text-xs font-medium text-neutral-300">
					What did I enjoy? (Single 140-char unanalyzed line)
				</label>
				<div class="flex gap-2">
					<input
						id="play-enjoy"
						type="text"
						maxlength="140"
						bind:value={playText}
						placeholder="e.g. Drawing fast ink shapes without checking proportion or intent."
						class="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
					<button
						type="button"
						onclick={logPlay}
						disabled={!playText.trim()}
						class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition"
					>
						Record Play
					</button>
				</div>
				{#if playLogged}
					<span class="text-xs text-emerald-400">Recorded to Play log!</span>
				{/if}
			</div>

			<!-- Recent Play log -->
			{#if practiceStore.playLines.length > 0}
				<div class="mt-4 space-y-2">
					<h4 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Play History ({practiceStore.playLines.length})</h4>
					<div class="space-y-1.5 max-h-48 overflow-y-auto">
						{#each practiceStore.playLines as entry}
							<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs flex items-center justify-between gap-3">
								<span class="text-neutral-200 italic">"{entry.line}"</span>
								<span class="text-[10px] font-mono text-neutral-500 shrink-0">{entry.date}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- TAB 4: Non-Instrumental Attention -->
	{:else if activeSubTab === 'attention'}
		<div class="space-y-4">
			<div class="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-2">
				<div class="flex items-center gap-2 text-amber-400 font-semibold">
					<Eye class="w-4 h-4" />
					<span>Non-Instrumental Attention (Module 3)</span>
				</div>
				<p class="leading-relaxed">
					Observation with no output requirement. If every perception is immediately converted into a project, you lose access to the material you could not search for.
					Log one sentence: <em>What did I encounter that I was not looking for?</em>
				</p>
			</div>

			<div class="space-y-2">
				<label for="attention-line" class="block text-xs font-medium text-neutral-300">
					What did I encounter that I was not looking for? (Single line)
				</label>
				<div class="flex gap-2">
					<input
						id="attention-line"
						type="text"
						maxlength="140"
						bind:value={attentionText}
						placeholder="e.g. The sound of water dripping inside an electrical conduit at dusk."
						class="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
					<button
						type="button"
						onclick={logAttention}
						disabled={!attentionText.trim()}
						class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition"
					>
						Record Attention
					</button>
				</div>
				{#if attentionLogged}
					<span class="text-xs text-emerald-400">Recorded to Attention log!</span>
				{/if}
			</div>

			<!-- Recent Attention log -->
			{#if practiceStore.nonInstrumentalLines.length > 0}
				<div class="mt-4 space-y-2">
					<h4 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Attention Entries ({practiceStore.nonInstrumentalLines.length})</h4>
					<div class="space-y-1.5 max-h-48 overflow-y-auto">
						{#each practiceStore.nonInstrumentalLines as entry}
							<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs flex items-center justify-between gap-3">
								<span class="text-neutral-200">"{entry.line}"</span>
								<span class="text-[10px] font-mono text-neutral-500 shrink-0">{entry.date}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
