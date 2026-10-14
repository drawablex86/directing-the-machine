<script lang="ts">
	import TodayLoopHeader from '$lib/components/shell/TodayLoopHeader.svelte';
	import ReferenceDrawer from '$lib/components/shell/ReferenceDrawer.svelte';
	import FailureTriageModal from '$lib/components/shell/FailureTriageModal.svelte';
	import HemingwayStopModal from '$lib/components/shell/HemingwayStopModal.svelte';
	import TwoAxisQuadrant from '$lib/components/assessment/TwoAxisQuadrant.svelte';
	import CompetencyRadar16 from '$lib/components/assessment/CompetencyRadar16.svelte';
	import M0PracticeContractHub from '$lib/components/modalities/M0PracticeContractHub.svelte';
	import M1ProblemPositionLab from '$lib/components/modalities/M1ProblemPositionLab.svelte';
	import M2DiagnosticVision from '$lib/components/modalities/M2DiagnosticVision.svelte';
	import M3PremiseBriefLab from '$lib/components/modalities/M3PremiseBriefLab.svelte';
	import M4PipelineCalibration from '$lib/components/modalities/M4PipelineCalibration.svelte';
	import M5TasteCurationArena from '$lib/components/modalities/M5TasteCurationArena.svelte';
	import M6DirectionCollab from '$lib/components/modalities/M6DirectionCollab.svelte';
	import M7AgencyBlankSheet from '$lib/components/modalities/M7AgencyBlankSheet.svelte';
	import { practiceStore } from '$lib/state/practice.svelte';
	import {
		Compass,
		Target,
		Eye,
		FileText,
		Sliders,
		Sparkles,
		Users,
		Award,
		BookOpen,
		ArrowRight,
		SlidersHorizontal
	} from '@lucide/svelte';

	let isDrawerOpen = $state(false);
	let isFailureModalOpen = $state(false);
	let isStopModalOpen = $state(false);
	let activeModality = $state<'overview' | 'm0' | 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6' | 'm7' | 'assessment'>('overview');

	const modalitiesList = [
		{ id: 'm0', num: 'M0', name: 'Contract, Baseline & Play', icon: Target, part: 'Week 0' },
		{ id: 'm1', num: 'M1', name: 'Problem-Finding & Positionality', icon: Compass, part: 'Part I' },
		{ id: 'm2', num: 'M2', name: 'Diagnostic Vision & Observation', icon: Eye, part: 'Part I' },
		{ id: 'm3', num: 'M3', name: 'Premise Forge & 7-Layer Brief', icon: FileText, part: 'Part II' },
		{ id: 'm4', num: 'M4', name: 'Pipeline & Calibration Lab', icon: Sliders, part: 'Part III' },
		{ id: 'm5', num: 'M5', name: 'Taste & Blind Curation Arena', icon: Sparkles, part: 'Part IV' },
		{ id: 'm6', num: 'M6', name: 'Direction, Collab & Refusal', icon: Users, part: 'Part V' },
		{ id: 'm7', num: 'M7', name: 'Authorship & Blank Sheet', icon: Award, part: 'Part VI / Capstone' }
	];
</script>

<div class="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
	<TodayLoopHeader
		onOpenDrawer={() => isDrawerOpen = true}
		onOpenFailure={() => isFailureModalOpen = true}
		onOpenStop={() => isStopModalOpen = true}
	/>

	<main class="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
		<!-- Studio Navigation Bar -->
		<div class="flex items-center justify-between gap-2 overflow-x-auto bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeModality = 'overview'}
				class="px-3 py-1.5 rounded-xl font-bold transition {activeModality === 'overview' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Overview
			</button>

			<div class="h-4 w-px bg-neutral-800 mx-1"></div>

			{#each modalitiesList as mod}
				<button
					type="button"
					onclick={() => activeModality = mod.id as any}
					class="px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap {activeModality === mod.id ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					<mod.icon class="w-3.5 h-3.5" />
					<span>{mod.num}</span>
				</button>
			{/each}

			<div class="h-4 w-px bg-neutral-800 mx-1"></div>

			<button
				type="button"
				onclick={() => activeModality = 'assessment'}
				class="px-3 py-1.5 rounded-xl font-bold transition {activeModality === 'assessment' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Assessment
			</button>

			<a
				href="/logs"
				class="px-3 py-1.5 rounded-xl font-bold bg-neutral-800 text-amber-400 hover:bg-neutral-700 transition ml-auto"
			>
				Logbook
			</a>
		</div>

		<!-- MODALITY VIEWS -->
		{#if activeModality === 'overview'}
			<!-- Hero with Scaffolding Progress -->
			<section class="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">Today's Studio</span>
						<span class="text-neutral-600">•</span>
						<span class="text-xs text-neutral-400">Step {practiceStore.currentStepIndex + 1} of 8</span>
					</div>
					<h1 class="text-xl md:text-2xl font-bold tracking-tight text-white">
						Directing the Machine: Interactive Studio Engine
					</h1>
					<p class="text-xs md:text-sm text-neutral-400 max-w-2xl leading-relaxed">
						Progressive Scaffolding Removal & 10-Minute Log Caps. Select any studio modality above to practice.
					</p>
				</div>

				<!-- Progression Control -->
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-2 shrink-0">
					<div class="flex items-center justify-between gap-4">
						<span class="font-bold text-neutral-200">Current Phase:</span>
						<select
							bind:value={practiceStore.activePart}
							onchange={() => practiceStore.saveToStorage()}
							class="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono"
						>
							<option value={0}>Week 0 (Baseline)</option>
							<option value={1}>Part I (Find & Observe)</option>
							<option value={2}>Part II (Formulate)</option>
							<option value={3}>Part III (Build)</option>
							<option value={4}>Part IV (Calibrate)</option>
							<option value={5}>Part V (Direct)</option>
							<option value={6}>Part VI (Author & Transfer)</option>
							<option value={7}>Month 4 (External Brief)</option>
							<option value={8}>Month 5 (Category)</option>
							<option value={9}>Month 6 (Theme)</option>
							<option value={10}>Month 7 (Real-world Problem)</option>
							<option value={11}>Month 8 (Self-Originated)</option>
							<option value={12}>Month 9 (Blank-Sheet Capstone)</option>
						</select>
					</div>

					<div class="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800">
						Scaffolding: Ladder: <strong class="{practiceStore.scaffolding.ladder ? 'text-amber-400' : 'text-neutral-600'}">{practiceStore.scaffolding.ladder ? 'On' : 'Off'}</strong> •
						Template: <strong class="{practiceStore.scaffolding.template ? 'text-amber-400' : 'text-neutral-600'}">{practiceStore.scaffolding.template ? 'On' : 'Off'}</strong> •
						Exercise: <strong class="{practiceStore.scaffolding.exercise ? 'text-amber-400' : 'text-neutral-600'}">{practiceStore.scaffolding.exercise ? 'On' : 'Off'}</strong>
					</div>
				</div>
			</section>

			<!-- Quick Grid of 8 Modalities -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each modalitiesList as mod}
					<button
						type="button"
						onclick={() => activeModality = mod.id as any}
						class="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 transition flex flex-col justify-between text-left group"
					>
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<div class="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 group-hover:border-amber-500/40 transition">
									<mod.icon class="w-4 h-4" />
								</div>
								<span class="font-mono text-xs font-bold text-neutral-500 group-hover:text-amber-400 transition">
									{mod.num}
								</span>
							</div>
							<div>
								<h3 class="font-bold text-sm text-neutral-200 group-hover:text-white transition">
									{mod.name}
								</h3>
								<div class="text-[10px] text-amber-400/80 mt-0.5 font-medium">
									{mod.part}
								</div>
							</div>
						</div>
						<div class="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 group-hover:text-neutral-300 transition">
							<span>Enter studio</span>
							<ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
						</div>
					</button>
				{/each}
			</div>

			<!-- Assessment Widgets preview -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<TwoAxisQuadrant />
				<CompetencyRadar16 />
			</div>

		{:else if activeModality === 'm0'}
			<M0PracticeContractHub />
		{:else if activeModality === 'm1'}
			<M1ProblemPositionLab />
		{:else if activeModality === 'm2'}
			<M2DiagnosticVision />
		{:else if activeModality === 'm3'}
			<M3PremiseBriefLab />
		{:else if activeModality === 'm4'}
			<M4PipelineCalibration />
		{:else if activeModality === 'm5'}
			<M5TasteCurationArena />
		{:else if activeModality === 'm6'}
			<M6DirectionCollab />
		{:else if activeModality === 'm7'}
			<M7AgencyBlankSheet />
		{:else if activeModality === 'assessment'}
			<div class="space-y-6">
				<TwoAxisQuadrant />
				<CompetencyRadar16 />
			</div>
		{/if}
	</main>

	<!-- Modals -->
	<ReferenceDrawer isOpen={isDrawerOpen} onClose={() => isDrawerOpen = false} />
	<FailureTriageModal isOpen={isFailureModalOpen} onClose={() => isFailureModalOpen = false} />
	<HemingwayStopModal isOpen={isStopModalOpen} onClose={() => isStopModalOpen = false} />
</div>
