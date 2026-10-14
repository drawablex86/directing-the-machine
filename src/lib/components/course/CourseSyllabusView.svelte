<script lang="ts">
	import { COURSE_WEEKS } from '$lib/data/curriculum';
	import { ALL_PROJECTS, type ProjectSpec } from '$lib/data/projects';
	import { practiceStore } from '$lib/state/practice.svelte';
	import ProjectBriefModal from './ProjectBriefModal.svelte';
	import {
		BookOpen,
		Calendar,
		Layers,
		CheckCircle2,
		Circle,
		ArrowRight,
		Clock,
		Flame,
		Sparkles,
		ShieldCheck,
		Filter,
		Compass,
		ExternalLink
	} from '@lucide/svelte';

	let { onLaunchModality }: { onLaunchModality: (modId: string) => void } = $props();

	let selectedProject = $state<ProjectSpec | null>(null);
	let filterLayer = $state<number | 'all'>('all');
	let filterTrack = $state<'all' | 'Intensive' | 'Independent'>('all');

	// Active week detail
	let activeWeekData = $derived(
		COURSE_WEEKS.find((w) => w.weekNumber === practiceStore.activeWeek) || COURSE_WEEKS[1]
	);

	let filteredProjects = $derived(
		ALL_PROJECTS.filter((p) => {
			if (filterTrack !== 'all' && p.track !== filterTrack) return false;
			return true;
		})
	);

	function selectWeek(weekNum: number) {
		practiceStore.activeWeek = weekNum;
		// Auto-sync part progression
		const week = COURSE_WEEKS.find((w) => w.weekNumber === weekNum);
		if (week) {
			practiceStore.activePart = week.partNumber;
		}
		practiceStore.saveToStorage();
	}

	function openProject(projectId: string) {
		const proj = ALL_PROJECTS.find((p) => p.id === projectId);
		if (proj) selectedProject = proj;
	}
</script>

<div class="space-y-8 animate-in fade-in duration-200">
	<!-- Hero / Course Architecture Header -->
	<div class="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl relative overflow-hidden">
		<div class="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
			<div class="space-y-1.5">
				<div class="flex items-center gap-2">
					<span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
						Master Curriculum
					</span>
					<span class="text-neutral-500">•</span>
					<span class="text-xs font-mono text-neutral-400">12 Weeks Intensive + 6 Months Independent</span>
				</div>
				<h1 class="text-2xl md:text-3xl font-black text-white tracking-tight">
					Directing the Machine — Course Map
				</h1>
				<p class="text-xs md:text-sm text-neutral-400 max-w-2xl leading-relaxed">
					A progressive scaffolding-removal engine for creative authorship in an AI-augmented world. From baseline deliberate practice to autonomous agency.
				</p>
			</div>

			<!-- Current Scaffolding & Layer Indicator -->
			<div class="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-4">
				<div class="space-y-0.5">
					<div class="text-[11px] font-mono uppercase text-neutral-500">Current Mastery Layer</div>
					<div class="text-sm font-bold text-amber-400">
						Layer {practiceStore.masteryLayer}: {practiceStore.masteryLayer === 1 ? 'Capability' : practiceStore.masteryLayer === 2 ? 'Independence' : 'Agency'}
					</div>
					<div class="text-[10px] text-neutral-400">
						Week {practiceStore.activeWeek} Active · Day {practiceStore.activeDay}
					</div>
				</div>
			</div>
		</div>

		<!-- 3-Tier Layer Roadmap Timeline -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
			<div class="p-4 rounded-2xl border transition {practiceStore.masteryLayer === 1 ? 'bg-amber-500/10 border-amber-500/40 text-neutral-100' : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400'}">
				<div class="flex items-center justify-between text-xs font-mono mb-1">
					<span class="font-bold text-amber-400">Layer 1: Capability</span>
					<span>Weeks 0–6</span>
				</div>
				<div class="font-bold text-sm text-white">Parts I–III: Find, Formulate, Build</div>
				<p class="text-xs text-neutral-400 mt-1">
					Establishes 12 deliberate competencies. Scaffolding is gradually stripped (Diagnostic Ladder, then Brief Template).
				</p>
			</div>

			<div class="p-4 rounded-2xl border transition {practiceStore.masteryLayer === 2 ? 'bg-amber-500/10 border-amber-500/40 text-neutral-100' : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400'}">
				<div class="flex items-center justify-between text-xs font-mono mb-1">
					<span class="font-bold text-amber-400">Layer 2: Independence</span>
					<span>Weeks 7–12</span>
				</div>
				<div class="font-bold text-sm text-white">Parts IV–VI: Calibrate, Direct, Author</div>
				<p class="text-xs text-neutral-400 mt-1">
					Taste as infrastructure, 3-cycle revision discipline, principled refusal, and the 14-Step Blank-Sheet Capstone.
				</p>
			</div>

			<div class="p-4 rounded-2xl border transition {practiceStore.masteryLayer === 3 ? 'bg-amber-500/10 border-amber-500/40 text-neutral-100' : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400'}">
				<div class="flex items-center justify-between text-xs font-mono mb-1">
					<span class="font-bold text-amber-400">Layer 3: Agency</span>
					<span>Months 4–9</span>
				</div>
				<div class="font-bold text-sm text-white">Independent Practice: Projects 7–12</div>
				<p class="text-xs text-neutral-400 mt-1">
					Progressive reduction from external client brief down to total self-originated inquiry and the final Blank-Sheet Capstone.
				</p>
			</div>
		</div>
	</div>

	<!-- Week Selector Bar -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h2 class="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
				<Calendar class="w-4 h-4 text-amber-400" />
				<span>Curriculum Progression Bar (Weeks 0–12 & Months 4–9)</span>
			</h2>
			<span class="text-xs font-mono text-neutral-500">Click to switch active week</span>
		</div>

		<div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
			{#each COURSE_WEEKS.slice(0, 13) as week}
				<button
					type="button"
					onclick={() => selectWeek(week.weekNumber)}
					class="p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer {practiceStore.activeWeek === week.weekNumber ? 'bg-amber-500 border-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-500/10' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'}"
				>
					<div class="flex items-center justify-between text-[11px] font-mono">
						<span>Wk {week.weekNumber}</span>
						{#if practiceStore.passedMasteryGates.includes(week.partNumber)}
							<CheckCircle2 class="w-3 h-3 {practiceStore.activeWeek === week.weekNumber ? 'text-neutral-950' : 'text-emerald-400'}" />
						{/if}
					</div>
					<div class="text-xs font-bold truncate mt-1">
						{week.weekNumber === 0 ? 'Baseline' : `Part ${week.partNumber}`}
					</div>
					<div class="text-[10px] opacity-75 truncate mt-0.5">
						P{week.activeProjectId.replace('p', '')}
					</div>
				</button>
			{/each}
		</div>

		<!-- Months 4–9 Selector -->
		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
			{#each COURSE_WEEKS.slice(13) as month}
				<button
					type="button"
					onclick={() => selectWeek(month.weekNumber)}
					class="p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer {practiceStore.activeWeek === month.weekNumber ? 'bg-amber-500 border-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-500/10' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'}"
				>
					<div class="flex items-center justify-between text-[11px] font-mono">
						<span>M{month.partNumber - 3}</span>
						<span class="text-[9px] uppercase px-1.5 py-0.2 rounded bg-neutral-800/80 {practiceStore.activeWeek === month.weekNumber ? 'text-neutral-950 bg-amber-400' : 'text-neutral-300'}">Project {month.activeProjectId.replace('p', '')}</span>
					</div>
					<div class="text-xs font-bold truncate mt-1">
						{month.title.split('—')[1]?.trim() || month.title}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Active Week Detail & Daily Action Plan -->
	<div class="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
						Active Focus: {activeWeekData.title}
					</span>
					<span class="text-xs font-mono text-neutral-400">· {activeWeekData.phaseName}</span>
				</div>
				<h3 class="text-lg md:text-xl font-bold text-white tracking-tight">
					Governing Question: "{activeWeekData.governingQuestion}"
				</h3>
			</div>

			<!-- Linked Project Button -->
			<div class="flex items-center gap-3">
				<button
					type="button"
					onclick={() => openProject(activeWeekData.activeProjectId)}
					class="px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/30 flex items-center gap-2 transition cursor-pointer"
				>
					<Layers class="w-4 h-4" />
					<span>Open Project {activeWeekData.activeProjectId.replace('p', '')} Dossier</span>
				</button>
			</div>
		</div>

		<!-- Daily Breakdown Tabs for Active Week -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div class="text-xs font-bold uppercase tracking-wider text-neutral-300">
					Weekly 7-Day Action Plan
				</div>
				<div class="flex items-center gap-1 overflow-x-auto text-xs">
					{#each activeWeekData.days as day}
						<button
							type="button"
							onclick={() => practiceStore.activeDay = day.dayNumber}
							class="px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer {practiceStore.activeDay === day.dayNumber ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}"
						>
							{day.dayName.slice(0, 3)}
						</button>
					{/each}
				</div>
			</div>

			<!-- Selected Day Tasks -->
			{#each activeWeekData.days as day}
				{#if practiceStore.activeDay === day.dayNumber}
					<div class="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-5 animate-in fade-in duration-150">
						<!-- Day Header & Assigned Reading -->
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
							<div class="space-y-0.5">
								<div class="text-xs font-bold text-white flex items-center gap-2">
									<span>{day.dayName} Focus:</span>
									<span class="text-amber-400">{day.focus}</span>
								</div>
								<div class="text-xs text-neutral-400">
									Assigned Reading:
									{#if day.assignedReading.moduleCode.toLowerCase().includes('appendix')}
										<a
											href="/app?tab=manual&appendix={day.assignedReading.moduleCode.toLowerCase().replace(' ', '-')}"
											class="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 decoration-amber-500/40 hover:decoration-amber-300 transition"
											title="Read {day.assignedReading.moduleCode} in Field Manual"
										>
											{day.assignedReading.moduleCode} — {day.assignedReading.title}
										</a>
									{:else}
										<span class="text-neutral-200 font-semibold">{day.assignedReading.moduleCode} — {day.assignedReading.title}</span>
									{/if}
								</div>
							</div>

							<div class="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 max-w-sm">
								<span class="font-semibold text-amber-400">Mental Model:</span> {day.assignedReading.keyMentalModel}
							</div>
						</div>

						<!-- Day Tasks Pipeline Checklist -->
						<div class="space-y-2">
							<div class="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
								Today's Step-by-Step Task Pipeline:
							</div>
							<div class="divide-y divide-neutral-900 rounded-xl border border-neutral-800/60 overflow-hidden bg-neutral-900/40">
								{#each day.tasks as task}
									{@const isDone = practiceStore.isTaskCompleted(task.id)}
									<div class="p-3.5 flex items-start justify-between gap-4 hover:bg-neutral-800/20 transition {isDone ? 'opacity-70 bg-neutral-950/40' : ''}">
										<div class="flex items-start gap-3">
											<button
												type="button"
												onclick={() => practiceStore.toggleTask(task.id)}
												class="mt-0.5 text-neutral-500 hover:text-amber-400 transition cursor-pointer"
												title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
											>
												{#if isDone}
													<CheckCircle2 class="w-5 h-5 text-emerald-400" />
												{:else}
													<Circle class="w-5 h-5 text-neutral-600 hover:text-neutral-300" />
												{/if}
											</button>

											<div class="space-y-0.5">
												<div class="flex items-center gap-2">
													<span class="text-xs font-bold {isDone ? 'line-through text-neutral-500' : 'text-neutral-200'}">
														{task.title}
													</span>
													<span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
														{task.time}
													</span>
												</div>
												<p class="text-xs text-neutral-400 leading-normal">
													{task.description}
												</p>
											</div>
										</div>

										<!-- Launch Modality Action -->
										{#if task.targetModalityId === 'logs'}
											<a
												href="/logs"
												class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 shrink-0 transition"
											>
												Open Log
											</a>
										{:else}
											<button
												type="button"
												onclick={() => onLaunchModality(task.targetModalityId)}
												class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 shrink-0 transition cursor-pointer"
											>
												Launch {task.targetModalityId.toUpperCase()}
											</button>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Weekly Deliverables & Mastery Gate Section -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
			<!-- Deliverables checklist -->
			<div class="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
				<h4 class="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
					<CheckCircle2 class="w-4 h-4 text-amber-400" />
					<span>Week {activeWeekData.weekNumber} Required Deliverables</span>
				</h4>
				<ul class="space-y-1.5 text-xs text-neutral-400 divide-y divide-neutral-900">
					{#each activeWeekData.weeklyDeliverables as deliv}
						<li class="pt-1.5 flex items-start gap-2">
							<span class="text-amber-400 font-bold">•</span>
							<span>{deliv}</span>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Mastery Gate checklist -->
			<div class="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
				<div class="flex items-center justify-between">
					<h4 class="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
						<ShieldCheck class="w-4 h-4 text-emerald-400" />
						<span>Phase Mastery Gate Standards</span>
					</h4>
					{#if practiceStore.passedMasteryGates.includes(activeWeekData.partNumber)}
						<span class="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
							Gate Passed!
						</span>
					{/if}
				</div>
				<ul class="space-y-1.5 text-xs text-neutral-400 divide-y divide-neutral-900">
					{#each activeWeekData.masteryGateCriteria as gate}
						<li class="pt-1.5 flex items-start gap-2">
							<span class="text-emerald-400 font-bold">•</span>
							<span>{gate}</span>
						</li>
					{/each}
				</ul>
				{#if !practiceStore.passedMasteryGates.includes(activeWeekData.partNumber)}
					<button
						type="button"
						onclick={() => practiceStore.passMasteryGate(activeWeekData.partNumber)}
						class="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-emerald-600 hover:text-white text-neutral-300 border border-neutral-700 transition cursor-pointer"
					>
						Verify & Sign Off Phase Mastery Gate
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Projects 1–12 Master Grid -->
	<div class="space-y-4">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div class="space-y-0.5">
				<h2 class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
					<Layers class="w-5 h-5 text-amber-400" />
					<span>The 12 Core Projects</span>
				</h2>
				<p class="text-xs text-neutral-400">
					Every project maps to a dedicated curriculum phase, deliverable quota, and evaluation rubric.
				</p>
			</div>

			<!-- Filter Toggles -->
			<div class="flex items-center gap-2 text-xs">
				<button
					type="button"
					onclick={() => filterTrack = 'all'}
					class="px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer {filterTrack === 'all' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-neutral-400 hover:text-white'}"
				>
					All (12)
				</button>
				<button
					type="button"
					onclick={() => filterTrack = 'Intensive'}
					class="px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer {filterTrack === 'Intensive' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-neutral-400 hover:text-white'}"
				>
					Intensive (P1–P6)
				</button>
				<button
					type="button"
					onclick={() => filterTrack = 'Independent'}
					class="px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer {filterTrack === 'Independent' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-neutral-400 hover:text-white'}"
				>
					Independent (P7–P12)
				</button>
			</div>
		</div>

		<!-- Projects Cards Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredProjects as proj}
				<div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between space-y-4 shadow-lg group">
					<div class="space-y-2">
						<div class="flex items-center justify-between text-xs">
							<span class="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
								Project {proj.number}
							</span>
							<span class="text-neutral-500 text-[11px] font-mono">{proj.phaseOrMonth}</span>
						</div>
						<h3 class="font-bold text-sm text-neutral-100 group-hover:text-amber-400 transition leading-snug">
							{proj.title}
						</h3>
						<p class="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
							{proj.goal}
						</p>
					</div>

					<div class="space-y-3 pt-2 border-t border-neutral-800/80 text-xs">
						<div class="flex items-center justify-between text-[11px] text-neutral-500">
							<span>Type: <strong class="text-neutral-300 font-medium">{proj.type}</strong></span>
							<span>Studio: <strong class="text-amber-400 font-mono">{proj.primaryModalityId.toUpperCase()}</strong></span>
						</div>

						<div class="flex items-center gap-2">
							<button
								type="button"
								onclick={() => selectedProject = proj}
								class="flex-1 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition cursor-pointer"
							>
								View Dossier
							</button>

							<button
								type="button"
								onclick={() => onLaunchModality(proj.primaryModalityId)}
								class="p-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition cursor-pointer"
								title="Launch Studio Lab"
							>
								<ArrowRight class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Project Brief Modal -->
{#if selectedProject}
	<ProjectBriefModal
		project={selectedProject}
		onClose={() => selectedProject = null}
		{onLaunchModality}
	/>
{/if}
