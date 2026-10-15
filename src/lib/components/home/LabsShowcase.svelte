<script lang="ts">
	import {
		Shield,
		Target,
		Eye,
		FileText,
		Sliders,
		Sparkles,
		GitPullRequest,
		PenTool,
		ArrowRight,
		CheckCircle2,
		AlertTriangle,
		Cpu
	} from '@lucide/svelte';

	interface ModalitySpec {
		id: string;
		code: string;
		name: string;
		icon: any;
		focus: string;
		trap: string;
		engine: string;
		deliverable: string;
	}

	const modalities: ModalitySpec[] = [
		{
			id: 'm0',
			code: 'M0',
			name: 'Deliberate Contract & Baseline Hub',
			icon: Shield,
			focus: 'Honest self-assessment across 12 core competencies, non-instrumental attention contracts, and play timers.',
			trap: 'Jumping into execution without measuring initial capability or defining an explicit ethical boundary.',
			engine: '12-Competency Radar Engine & 60-Minute Non-Instrumental Play Timer',
			deliverable: 'Signed Practice Contract & Baseline Radar Score'
		},
		{
			id: 'm1',
			code: 'M1',
			name: 'Problem-Finding & Positionality Lab',
			icon: Target,
			focus: '6-stage problem funnel, standing check (why you, why this, why now), and 60-minute unassigned exploration.',
			trap: 'Outsourcing problem selection to neural networks, generating answers to problems nobody cares about.',
			engine: '6-Stage Funnel & 5-Question Positionality Audit',
			deliverable: 'Defended Problem Dossier with Verified Standing'
		},
		{
			id: 'm2',
			code: 'M2',
			name: 'Diagnostic Vision & Observation',
			icon: Eye,
			focus: 'Top-down diagnostic ladders, zero-adjective regex linter, and 5-second flash memory massing studies.',
			trap: 'Evaluating outputs using vague emotional adjectives like "cinematic" and "punchy" rather than structural geometry.',
			engine: 'Zero-Adjective Word Boundary Regex Linter & Diagnostic Ladder Trees',
			deliverable: '15 Structural Diagnoses & 6 Massing Studies'
		},
		{
			id: 'm3',
			code: 'M3',
			name: 'Premise Forge & 7-Layer Brief Lab',
			icon: FileText,
			focus: '3-premise forge with rejection logic, 7-layer structural brief builder, and cryptographic provenance stamps.',
			trap: 'Starting with a single unexamined idea and writing sprawling, unconstrained instructions.',
			engine: '7-Layer Brief Builder & SHA-256 Provenance Hash Stamper',
			deliverable: 'Rigorous 7-Layer Brief with Negative Boundaries'
		},
		{
			id: 'm4',
			code: 'M4',
			name: 'Pipeline & Calibration Lab',
			icon: Sliders,
			focus: '9-layer pipeline mapping, pre-run confidence locks, Brier score telemetry, and narrowness alerts.',
			trap: 'Hindsight bias: assuming you knew the model was going to do what it did after seeing the output.',
			engine: 'Pre-Run Probability Locks & Mathematical Brier Score Engine',
			deliverable: 'Brier Calibration Log & Pipeline Dependency Graph'
		},
		{
			id: 'm5',
			code: 'M5',
			name: 'Taste & Blind Curation Arena',
			icon: Sparkles,
			focus: '5-part taste formula, blind provenance ranker with hidden labels, and $\\ge 40\\%$ human anchor enforcement.',
			trap: 'Aesthetic drift: unconsciously lowering standards to match the median quality of synthetic outputs.',
			engine: 'Double-Blind Provenance Shuffler & 5-Part Taste Formula Matrix',
			deliverable: 'Curated Anchor Set with Explicit Exclusion Criteria'
		},
		{
			id: 'm6',
			code: 'M6',
			name: 'Direction, Collab & Refusal Studio',
			icon: GitPullRequest,
			focus: 'Revision vs re-brief fork, stakeholder critique triage, 5-mode ethical refusal composer, and silence tolerance.',
			trap: 'Endlessly tweaking broken outputs instead of executing a re-brief or issuing an ethical refusal.',
			engine: '5-Mode Ethical Refusal Engine & Stakeholder Triage Matrix',
			deliverable: 'Refusal Protocol & Defended Critique Archive'
		},
		{
			id: 'm7',
			code: 'M7',
			name: 'Authorship & Blank-Sheet Capstone',
			icon: PenTool,
			focus: 'Full scaffolding removal, written vs inferred position gap analyzer, and 14-step unassisted capstone.',
			trap: 'Becoming permanently addicted to templates and unable to author without automated assistance.',
			engine: 'Progressive Scaffolding Removal & Positionality Gap Analyzer',
			deliverable: 'Independent Capstone Artifact & Authorship Defense'
		}
	];

	let selectedModalityId = $state<string>('m2');
	let activeMod = $derived(modalities.find(m => m.id === selectedModalityId) || modalities[2]);
</script>

<section id="studios" class="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<!-- Section Header -->
	<div class="space-y-4 mb-14 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono uppercase tracking-widest font-semibold">
			<Cpu class="w-3.5 h-3.5 text-amber-500" />
			<span>The Specialized Workbench</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-bold text-neutral-100 tracking-tight">
			Eight Deliberate Studios Built to Train Judgment, Not Speed
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base leading-relaxed">
			Every lab targets a specific cognitive breakdown point where human operators typically surrender intent to machine defaults. Select any studio to inspect its underlying engine.
		</p>
	</div>

	<!-- Modalities Quick Grid Picker -->
	<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-8">
		{#each modalities as mod}
			{@const ModIcon = mod.icon}
			<button
				type="button"
				onclick={() => { selectedModalityId = mod.id; }}
				class="p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col items-center justify-center text-center gap-2 {selectedModalityId === mod.id ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-lg shadow-amber-500/10' : 'bg-neutral-900/50 border-neutral-800/80 text-neutral-400 hover:text-white hover:border-neutral-700'}"
			>
				<ModIcon class="w-5 h-5 {selectedModalityId === mod.id ? 'text-neutral-950' : 'text-amber-500'}" />
				<div>
					<div class="text-[10px] font-mono uppercase tracking-wider font-bold">{mod.code}</div>
					<div class="text-[11px] font-sans font-medium leading-tight truncate w-16 sm:w-20">{mod.name.split(' ')[0]}</div>
				</div>
			</button>
		{/each}
	</div>

	<!-- Active Modality Detailed Inspector Card -->
	{#if activeMod}
		{@const ActiveIcon = activeMod.icon}
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/90 shadow-2xl space-y-6">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
						<ActiveIcon class="w-6 h-6" />
					</div>
					<div>
						<div class="flex items-center gap-2">
							<span class="text-xs font-mono uppercase font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
								Modality {activeMod.code}
							</span>
							<span class="text-xs font-mono text-neutral-400">Core Studio Workbench</span>
						</div>
						<h3 class="text-xl sm:text-2xl font-serif font-bold text-neutral-100 mt-1">
							{activeMod.name}
						</h3>
				</div>
			</div>

			<a
				href="/app?lab={activeMod.id}"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-md shadow-amber-500/10 transition cursor-pointer"
			>
				<span>Launch {activeMod.code} Studio</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</a>
		</div>

		<!-- 3-Column Deep Breakdown -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
			<!-- Col 1: Cognitive Trap Solved -->
			<div class="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
				<div class="flex items-center gap-1.5 text-rose-400 font-mono uppercase font-bold text-[11px] tracking-wider">
					<AlertTriangle class="w-3.5 h-3.5" />
					<span>Cognitive Trap Solved</span>
				</div>
				<p class="text-neutral-300 leading-relaxed">
					{activeMod.trap}
				</p>
			</div>

			<!-- Col 2: Embedded Engine -->
			<div class="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
				<div class="flex items-center gap-1.5 text-amber-500 font-mono uppercase font-bold text-[11px] tracking-wider">
					<Cpu class="w-3.5 h-3.5" />
					<span>Mathematical / Structural Engine</span>
				</div>
				<p class="text-neutral-300 leading-relaxed">
					{activeMod.engine}
				</p>
			</div>

			<!-- Col 3: Student Milestone Artifact -->
			<div class="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
				<div class="flex items-center gap-1.5 text-emerald-400 font-mono uppercase font-bold text-[11px] tracking-wider">
					<CheckCircle2 class="w-3.5 h-3.5" />
					<span>Production Artifact Required</span>
				</div>
				<p class="text-neutral-300 leading-relaxed">
					{activeMod.deliverable}
				</p>
			</div>
		</div>

		<!-- Focus statement -->
		<div class="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800 text-xs text-neutral-400 font-mono leading-relaxed">
			<strong class="text-neutral-300">Curriculum Scope: </strong>{activeMod.focus}
		</div>
	</div>
	{/if}
</section>
