<script lang="ts">
	import TodayLoopHeader from '$lib/components/shell/TodayLoopHeader.svelte';
	import ReferenceDrawer from '$lib/components/shell/ReferenceDrawer.svelte';
	import FailureTriageModal from '$lib/components/shell/FailureTriageModal.svelte';
	import HemingwayStopModal from '$lib/components/shell/HemingwayStopModal.svelte';
	import WelcomeBanner from '$lib/components/shell/WelcomeBanner.svelte';
	import DailyPracticeView from '$lib/components/shell/DailyPracticeView.svelte';
	import LabDirectory from '$lib/components/shell/LabDirectory.svelte';
	import FieldManualView from '$lib/components/shell/FieldManualView.svelte';
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
	import CourseSyllabusView from '$lib/components/course/CourseSyllabusView.svelte';
	import { practiceStore } from '$lib/state/practice.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		Calendar,
		Layers,
		Activity,
		BookOpen,
		ArrowLeft,
		ChevronRight,
		SlidersHorizontal,
		MapPin,
		Compass,
		Home
	} from '@lucide/svelte';

	let isDrawerOpen = $state(false);
	let isFailureModalOpen = $state(false);
	let isStopModalOpen = $state(false);

	// Navigation: Primary views or specific active lab
	type ViewMode = 'today' | 'curriculum' | 'labs' | 'assessment' | 'manual' | 'lab-session';
	let activeTab = $state<ViewMode>('today');
	let activeLabId = $state<string | null>(null);

	onMount(() => {
		const searchParams = page.url.searchParams;
		const tab = searchParams.get('tab');
		const lab = searchParams.get('lab');
		if (lab) {
			openLab(lab);
		} else if (tab === 'curriculum' || tab === 'labs' || tab === 'assessment' || tab === 'manual' || tab === 'today') {
			activeTab = tab;
		}
	});

	function openLab(modId: string) {
		activeLabId = modId;
		activeTab = 'lab-session';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function exitLab() {
		activeLabId = null;
		activeTab = 'labs';
	}

	const labNames: Record<string, string> = {
		m0: 'M0: Deliberate Contract & Baseline Hub',
		m1: 'M1: Problem-Finding & Positionality Lab',
		m2: 'M2: Diagnostic Vision & Observation',
		m3: 'M3: Premise Forge & 7-Layer Brief Lab',
		m4: 'M4: Pipeline & Calibration Lab',
		m5: 'M5: Taste & Blind Curation Arena',
		m6: 'M6: Direction, Collab & Refusal Studio',
		m7: 'M7: Authorship & Blank-Sheet Capstone'
	};
</script>

<svelte:head>
	<title>Directing the Machine — Studio Workbench</title>
	<meta name="description" content="Interactive 8-modality deliberate practice workbench, daily curriculum roadmap, and evaluation loops." />
</svelte:head>

<div class="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
	<TodayLoopHeader
		onOpenDrawer={() => isDrawerOpen = true}
		onOpenFailure={() => isFailureModalOpen = true}
		onOpenStop={() => isStopModalOpen = true}
	/>

	<main class="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
		<!-- Top Bar Back to Marketing Homepage -->
		<div class="flex items-center justify-between text-xs text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-4 py-2.5 rounded-2xl">
			<div class="flex items-center gap-2">
				<a href="/" class="flex items-center gap-1.5 text-neutral-300 hover:text-amber-400 font-medium transition">
					<Home class="w-3.5 h-3.5" />
					<span>Homepage</span>
				</a>
				<span class="text-neutral-600">/</span>
				<span class="text-neutral-100 font-semibold font-mono">Interactive Studio</span>
			</div>
			<div class="text-[11px] text-neutral-500 hidden sm:inline">
				Local-First • 100% Client-Side Storage
			</div>
		</div>

		<!-- Onboarding Banner (dismissible) -->
		<WelcomeBanner onSelectModality={openLab} />

		<!-- Primary Studio Navigation Tabs -->
		{#if activeTab !== 'lab-session'}
			<div class="flex items-center justify-between border-b border-neutral-800 pb-2">
				<nav class="flex items-center gap-1.5 overflow-x-auto text-xs md:text-sm">
					<button
						type="button"
						onclick={() => activeTab = 'today'}
						class="px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer {activeTab === 'today' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
					>
						<Calendar class="w-4 h-4" />
						<span>Today's Practice</span>
					</button>

					<button
						type="button"
						onclick={() => activeTab = 'curriculum'}
						class="px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer {activeTab === 'curriculum' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
					>
						<Compass class="w-4 h-4" />
						<span>Curriculum & Projects</span>
					</button>

					<button
						type="button"
						onclick={() => activeTab = 'labs'}
						class="px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer {activeTab === 'labs' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
					>
						<Layers class="w-4 h-4" />
						<span>Studios & Labs</span>
					</button>

					<button
						type="button"
						onclick={() => activeTab = 'assessment'}
						class="px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer {activeTab === 'assessment' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
					>
						<Activity class="w-4 h-4" />
						<span>Progress & Radar</span>
					</button>

					<button
						type="button"
						onclick={() => activeTab = 'manual'}
						class="px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer {activeTab === 'manual' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
					>
						<BookOpen class="w-4 h-4" />
						<span>Field Manual</span>
					</button>
				</nav>

				<a
					href="/logs"
					class="px-3 py-1.5 rounded-xl font-semibold text-xs bg-neutral-900 border border-neutral-800 text-amber-400 hover:bg-neutral-800 transition flex items-center gap-1.5"
				>
					<span>Open Logbook</span>
					<ChevronRight class="w-3.5 h-3.5" />
				</a>
			</div>
		{:else}
			<!-- Breadcrumb back navigation when inside a specific lab -->
			<div class="flex items-center justify-between border-b border-neutral-800 pb-3">
				<button
					type="button"
					onclick={exitLab}
					class="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl transition cursor-pointer"
				>
					<ArrowLeft class="w-3.5 h-3.5" />
					<span>Back to Studios & Labs</span>
				</button>

				<span class="text-xs font-mono font-bold text-amber-400">
					{labNames[activeLabId || ''] || 'Active Lab'}
				</span>
			</div>
		{/if}

		<!-- VIEW ROUTING -->
		{#if activeTab === 'today'}
			<DailyPracticeView onSelectModality={openLab} />
		{:else if activeTab === 'curriculum'}
			<CourseSyllabusView onLaunchModality={openLab} />
		{:else if activeTab === 'labs'}
			<LabDirectory onSelectModality={openLab} />
		{:else if activeTab === 'assessment'}
			<div class="space-y-6">
				<div class="space-y-1">
					<h2 class="text-xl font-bold text-white tracking-tight">Evaluations & Growth Signals</h2>
					<p class="text-xs md:text-sm text-neutral-400">
						Track your movement toward reliable creative authorship and monitor decision quality.
					</p>
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<TwoAxisQuadrant />
					<CompetencyRadar16 />
				</div>
			</div>
		{:else if activeTab === 'manual'}
			<FieldManualView />
		{:else if activeTab === 'lab-session'}
			{#if activeLabId === 'm0'}
				<M0PracticeContractHub />
			{:else if activeLabId === 'm1'}
				<M1ProblemPositionLab />
			{:else if activeLabId === 'm2'}
				<M2DiagnosticVision />
			{:else if activeLabId === 'm3'}
				<M3PremiseBriefLab />
			{:else if activeLabId === 'm4'}
				<M4PipelineCalibration />
			{:else if activeLabId === 'm5'}
				<M5TasteCurationArena />
			{:else if activeLabId === 'm6'}
				<M6DirectionCollab />
			{:else if activeLabId === 'm7'}
				<M7AgencyBlankSheet />
			{/if}
		{/if}
	</main>

	<!-- Global Modals -->
	<ReferenceDrawer isOpen={isDrawerOpen} onClose={() => isDrawerOpen = false} />
	<FailureTriageModal isOpen={isFailureModalOpen} onClose={() => isFailureModalOpen = false} />
	<HemingwayStopModal isOpen={isStopModalOpen} onClose={() => isStopModalOpen = false} />
</div>
