<script lang="ts">
	import { ALL_PROJECTS, type ProjectSpec } from '$lib/data/projects';
	import {
		Compass,
		ArrowRight,
		CheckCircle2,
		Layers,
		Calendar,
		Clock,
		Flame,
		Sparkles,
		Eye,
		FolderGit2,
		ShieldCheck,
		BookOpen
	} from '@lucide/svelte';

	type ViewMode = 'projects' | 'syllabus';
	let viewMode = $state<ViewMode>('projects');

	let activePhase = $state<number>(1);
	let selectedProject = $state<ProjectSpec>(ALL_PROJECTS[0]);

	const phases = [
		{ id: 1, name: 'Part I: Find & Observe', weeks: 'Weeks 1–2', projectId: 'p1', hours: '20–25 hrs/wk', desc: 'Neutral observation, top-down diagnostic ladders, visual massing, and zero-adjective discipline.', readingModules: 'Modules 01–13 (Diagnostic Ladders, Massing Studies, Subtraction Diffs)' },
		{ id: 2, name: 'Part II: Formulate', weeks: 'Weeks 3–4', projectId: 'p2', hours: '20–25 hrs/wk', desc: 'Premise forge, 7-layer briefs, negative constraints, and cryptographic provenance stamping.', readingModules: 'Modules 14–26 (Positionality Checks, 7-Layer Structural Briefs, Negative Constraints)' },
		{ id: 3, name: 'Part III: Build & Calibrate', weeks: 'Weeks 5–6', projectId: 'p3', hours: '20–25 hrs/wk', desc: '9-layer pipeline mapping, pre-run confidence locks, and Brier score calibration telemetry.', readingModules: 'Modules 27–39 (Pipeline Graphs, Mathematical Brier Scoring, Calibration Narrowness)' },
		{ id: 4, name: 'Part IV: Taste & Curate', weeks: 'Weeks 7–8', projectId: 'p4', hours: '20–25 hrs/wk', desc: '5-part taste formula, double-blind provenance curation, and the 40% human anchor benchmark.', readingModules: 'Modules 40–52 (Blind Shuffling, 5-Part Taste Formula, Aesthetic Drift Shielding)' },
		{ id: 5, name: 'Part V: Direct, Critique & Refuse', weeks: 'Weeks 9–10', projectId: 'p5', hours: '20–25 hrs/wk', desc: 'Revision vs re-brief forks, stakeholder critique triage, and the 5-mode ethical refusal engine.', readingModules: 'Modules 53–65 (Re-Brief Protocols, Stakeholder Triage, 5 Refusal Modes)' },
		{ id: 6, name: 'Part VI: Authorship & Blank Sheet', weeks: 'Weeks 11–12', projectId: 'p6', hours: '20–25 hrs/wk', desc: 'Scaffolding removal, unassisted Blank-Sheet synthesis capstone, and defense essay.', readingModules: 'Modules 66–78 (Scaffolding Removal, Blank-Sheet Synthesis, Defense Protocols)' },
		{ id: 7, name: 'Independent Practice', weeks: 'Months 4–9', projectId: 'p7', hours: '8–15 hrs/wk', desc: 'Real-world stakes: Visual Campaigns, Writing Voice Guides, Hybrid Essays, and Capstone.', readingModules: 'Modules 79–81 (Long-Term Studio Cadence, Professional Contracts, Portfolio Gateways)' }
	];

	function selectPhase(phaseId: number) {
		activePhase = phaseId;
		const phase = phases.find(p => p.id === phaseId);
		if (phase) {
			const prj = ALL_PROJECTS.find(p => p.id === phase.projectId);
			if (prj) selectedProject = prj;
		}
	}
</script>

<section id="syllabus" class="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<!-- Section Header -->
	<div class="space-y-4 mb-10 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest font-semibold">
			<Compass class="w-3.5 h-3.5 text-amber-500" />
			<span>The Complete Curriculum Arc</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
			A Real Curriculum Has Verifiable Deliverables, Not Just Video Lectures.
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base font-serif leading-relaxed">
			Every week is structured around non-negotiable daily loops: 20m mental model reading, deliberate drills, neutral diagnosis, 10-minute reflection logs, and concrete project milestones.
		</p>
	</div>

	<!-- Mode Switcher: 12 Projects vs 18-Week Syllabus -->
	<div class="flex items-center justify-center sm:justify-start gap-2 mb-8 pb-4 border-b border-neutral-800/80">
		<button
			type="button"
			onclick={() => { viewMode = 'projects'; }}
			class="px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border {viewMode === 'projects' ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10' : 'bg-neutral-900/60 text-neutral-400 hover:text-white border-neutral-800'}"
		>
			<span>12 Milestone Projects View</span>
		</button>

		<button
			type="button"
			onclick={() => { viewMode = 'syllabus'; }}
			class="px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border {viewMode === 'syllabus' ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10' : 'bg-neutral-900/60 text-neutral-400 hover:text-white border-neutral-800'}"
		>
			<span>18-Week Syllabus Progression</span>
		</button>
	</div>

	{#if viewMode === 'syllabus'}
		<!-- Full 18-Week Syllabus Progression Table/Cards -->
		<div class="space-y-4">
			{#each phases as p}
				<div class="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition space-y-4">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/70">
						<div class="flex items-center gap-3">
							<span class="font-mono text-sm font-bold text-amber-500 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
								{p.weeks}
							</span>
							<h3 class="text-lg font-serif font-bold text-white">
								{p.name}
							</h3>
						</div>
						<div class="text-xs font-mono text-neutral-400">
							Workload: {p.hours}
						</div>
					</div>

					<p class="text-sm font-serif text-neutral-300 leading-relaxed">
						{p.desc}
					</p>

					<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs font-mono text-neutral-400">
						<div class="flex items-center gap-2">
							<BookOpen class="w-3.5 h-3.5 text-amber-500 shrink-0" />
							<span>{p.readingModules}</span>
						</div>
						<a
							href="/app?tab=curriculum"
							class="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition"
						>
							<span>Explore Weeks in Studio</span>
							<ArrowRight class="w-3 h-3" />
						</a>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- 12 Milestone Projects View -->
		<!-- Interactive Phase Tabs -->
		<div class="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin">
			{#each phases as phase}
				<button
					type="button"
					onclick={() => selectPhase(phase.id)}
					class="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-start gap-0.5 cursor-pointer border {activePhase === phase.id ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10' : 'bg-neutral-900/60 text-neutral-400 hover:text-white border-neutral-800'}"
				>
					<span class="text-[10px] uppercase font-mono tracking-wider opacity-80">{phase.weeks}</span>
					<span class="text-xs sm:text-sm">{phase.name}</span>
				</button>
			{/each}
		</div>

		<!-- Active Phase Showcase & Project Dossier -->
		<div class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
			<!-- Left: Phase Details & Daily Loop -->
			<div class="lg:col-span-5 p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-6">
				<div>
					<span class="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
						Phase {activePhase} Overview
					</span>
					<h3 class="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
						{phases[activePhase - 1]?.name}
					</h3>
					<p class="text-xs sm:text-sm text-neutral-400 font-mono mt-1">
						Time Horizon: {phases[activePhase - 1]?.weeks} • {phases[activePhase - 1]?.hours}
					</p>
				</div>

				<p class="text-sm font-serif text-neutral-300 leading-relaxed">
					{phases[activePhase - 1]?.desc}
				</p>

				<!-- Daily Loop Breakdown -->
				<div class="space-y-3 pt-4 border-t border-neutral-800">
					<div class="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
						The Non-Negotiable Daily Loop:
					</div>
					<ul class="text-xs font-sans text-neutral-300 space-y-2">
						<li class="flex items-center gap-2">
							<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
							<span><strong>01. Read (20–30m):</strong> Assigned module & mental model</span>
						</li>
						<li class="flex items-center gap-2">
							<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
							<span><strong>02. Drill (30–45m):</strong> Deliberate practice exercise</span>
						</li>
						<li class="flex items-center gap-2">
							<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
							<span><strong>03. Make & Diagnose (60–90m):</strong> Project milestone with zero-adjective audit</span>
						</li>
						<li class="flex items-center gap-2">
							<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
							<span><strong>04. Log (10m):</strong> Timed Hemingway reflection stop</span>
						</li>
					</ul>
				</div>

				<!-- Direct Studio Action -->
				<div class="pt-4 border-t border-neutral-800">
					<a
						href="/app?tab=curriculum"
						class="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
					>
						<span>Open Full Syllabus in Studio Workbench</span>
						<ArrowRight class="w-3.5 h-3.5" />
					</a>
				</div>
			</div>

			<!-- Right: Active Project Dossier -->
			<div id="projects" class="lg:col-span-7 p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-6">
				<div class="flex items-start justify-between gap-4">
					<div>
						<div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono uppercase tracking-wide">
							<span>Project {selectedProject.number}</span>
							<span>•</span>
							<span>{selectedProject.type} Track</span>
						</div>
						<h3 class="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
							{selectedProject.title}
						</h3>
						<p class="text-xs text-neutral-400 font-mono mt-1">
							Workload: {selectedProject.estimatedWorkload} • Duration: {selectedProject.duration}
						</p>
					</div>

					<a
						href="/app"
						class="shrink-0 px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
					>
						<span>Launch Lab</span>
						<ArrowRight class="w-3.5 h-3.5" />
					</a>
				</div>

				<!-- Goal & Brief -->
				<div class="space-y-2">
					<div class="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
						Goal & Scope
					</div>
					<p class="text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed">
						{selectedProject.goal}
					</p>
				</div>

				<!-- Deliverables List -->
				<div class="space-y-3 pt-3 border-t border-neutral-800">
					<div class="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
						Concrete Deliverables Required for Mastery Gate
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
						{#each selectedProject.deliverables as d}
							<div class="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/70 space-y-1">
								<div class="text-xs font-semibold text-white flex items-center gap-1.5">
									<CheckCircle2 class="w-3.5 h-3.5 text-amber-500 shrink-0" />
									<span>{d.name}</span>
								</div>
								<div class="text-[11px] text-neutral-400 leading-normal pl-5">
									{d.specification}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Rubric Preview -->
				<div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1.5">
					<div class="font-mono uppercase text-amber-400 font-bold tracking-wider text-[11px]">
						{selectedProject.evaluationRubric[0]?.level || 'Mastery Rubric'}
					</div>
					<p class="text-neutral-300 font-serif leading-relaxed">
						{selectedProject.evaluationRubric[0]?.criteria}
					</p>
				</div>
			</div>
		</div>

		<!-- 12-Project Grid Quick Picker -->
		<div class="mt-12 pt-8 border-t border-neutral-800">
			<div class="text-xs font-mono uppercase text-neutral-500 tracking-wider mb-4">
				Jump Directly to Any of the 12 Milestone Projects:
			</div>
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
				{#each ALL_PROJECTS as prj}
					<button
						type="button"
						onclick={() => { selectedProject = prj; }}
						class="p-2.5 rounded-xl border text-left transition cursor-pointer {selectedProject.id === prj.id ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-neutral-900/40 border-neutral-800/70 text-neutral-400 hover:text-white hover:border-neutral-700'}"
					>
						<div class="text-[10px] font-mono uppercase font-bold text-neutral-500">
							Project {prj.number}
						</div>
						<div class="text-xs font-serif font-bold text-white truncate mt-0.5">
							{prj.title}
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</section>
