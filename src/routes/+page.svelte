<script lang="ts">
	import TodayLoopHeader from '$lib/components/shell/TodayLoopHeader.svelte';
	import ReferenceDrawer from '$lib/components/shell/ReferenceDrawer.svelte';
	import FailureTriageModal from '$lib/components/shell/FailureTriageModal.svelte';
	import HemingwayStopModal from '$lib/components/shell/HemingwayStopModal.svelte';
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
		ArrowRight,
		CheckCircle2,
		ShieldAlert
	} from '@lucide/svelte';

	let isDrawerOpen = $state(false);
	let isFailureModalOpen = $state(false);
	let isStopModalOpen = $state(false);

	const modalities = [
		{ id: 'm0', num: 'M0', name: 'Deliberate Practice, Play & Contract', route: '#m0', desc: 'Week 0 Baseline 1–4 radar, runway calculator, intensity pacing, and play timers.', icon: Target, part: 'Onboarding / Week 0' },
		{ id: 'm1', num: 'M1', name: 'Problem-Finding & Positionality Lab', route: '#m1', desc: '6-step Problem Funnel, Positionality Compass (From/With/For/About/Over), and 60m Unassigned Beginning.', icon: Compass, part: 'Part I & Recurring' },
		{ id: 'm2', num: 'M2', name: 'Diagnostic Vision & Observation Studio', route: '#m2', desc: 'Zero-Adjective Linter, 6-Question Human Decision Audit, Top-Down Ladder, and Massing Canvas.', icon: Eye, part: 'Part I (Wks 1–2)' },
		{ id: 'm3', num: 'M3', name: 'Premise Forge, Brief Architect & Provenance', route: '#m3', desc: '3-Premise Rejection Matrix, 3/6/10 Constraint Density Tri-View, Craft-First Gate, and Provenance Ledger.', icon: FileText, part: 'Part II (Wks 3–4)' },
		{ id: 'm4', num: 'M4', name: 'Causal Pipeline & Calibration Lab', route: '#m4', desc: 'Pre-Run Confidence %, Brier Score, Taste-Narrowness detector, and Ergonomic screen HUD.', icon: Sliders, part: 'Part III (Wks 5–6)' },
		{ id: 'm5', num: 'M5', name: 'Taste Infrastructure & Blind Curation Arena', route: '#m5', desc: '5-Part Taste formula, 20-output blind provenance ranker, anchor demotion, and reverse-brief challenge.', icon: Sparkles, part: 'Part IV (Wks 7–8)' },
		{ id: 'm6', num: 'M6', name: 'Production Direction & Collaboration', route: '#m6', desc: 'Revision (max 3) vs Re-Brief Fork, Stakeholder Critique triage, Decision Rights, and 5-Mode Refusal.', icon: Users, part: 'Part V (Wks 9–10)' },
		{ id: 'm7', num: 'M7', name: 'Authorship Gap & Blank-Sheet Capstone', route: '#m7', desc: '10-Piece Blind Position Gap analyzer, Cross-medium removal test, and 14-step Blank-Sheet workspace.', icon: Award, part: 'Part VI & Months 4–9' }
	];
</script>

<div class="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
	<TodayLoopHeader
		onOpenDrawer={() => isDrawerOpen = true}
		onOpenFailure={() => isFailureModalOpen = true}
		onOpenStop={() => isStopModalOpen = true}
	/>

	<main class="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
		<!-- Studio Hero & Progressive Status -->
		<section class="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">Today's Studio</span>
					<span class="text-neutral-600">•</span>
					<span class="text-xs text-neutral-400">Step {practiceStore.currentStepIndex + 1} of 8</span>
				</div>
				<h1 class="text-xl md:text-2xl font-bold tracking-tight text-white">
					Authorship Over Prompting: Studio Modalities
				</h1>
				<p class="text-xs md:text-sm text-neutral-400 max-w-2xl leading-relaxed">
					Practice is not production. The UI enforces progressive scaffolding removal across all 12 weeks and 6 months of Independent Practice.
				</p>
			</div>

			<!-- Scaffolding Status Indicator -->
			<div class="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs space-y-1.5 shrink-0 min-w-[200px]">
				<div class="font-semibold text-neutral-300 text-[11px] uppercase tracking-wider">Active Scaffolds</div>
				<div class="flex items-center justify-between text-neutral-400">
					<span>Diagnostic Ladder:</span>
					<span class="{practiceStore.scaffolding.ladder ? 'text-amber-400' : 'text-neutral-600 font-mono'}">
						{practiceStore.scaffolding.ladder ? 'Supplied' : 'Removed'}
					</span>
				</div>
				<div class="flex items-center justify-between text-neutral-400">
					<span>Brief Template:</span>
					<span class="{practiceStore.scaffolding.template ? 'text-amber-400' : 'text-neutral-600 font-mono'}">
						{practiceStore.scaffolding.template ? 'Supplied' : 'Removed'}
					</span>
				</div>
				<div class="flex items-center justify-between text-neutral-400">
					<span>Pre-written Exercise:</span>
					<span class="{practiceStore.scaffolding.exercise ? 'text-amber-400' : 'text-neutral-600 font-mono'}">
						{practiceStore.scaffolding.exercise ? 'Supplied' : 'Removed'}
					</span>
				</div>
			</div>
		</section>

		<!-- Modalities Grid (M0 - M7) -->
		<section class="space-y-3">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold tracking-wide text-neutral-300 uppercase">
					Interactive Studio Workspaces (M0 — M7)
				</h2>
				<span class="text-xs text-neutral-500">8 Specialized Engines</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each modalities as mod}
					<a
						href={mod.route}
						class="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 transition flex flex-col justify-between group"
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
								<p class="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-3">
									{mod.desc}
								</p>
							</div>
						</div>

						<div class="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 group-hover:text-neutral-300 transition">
							<span>Launch studio</span>
							<ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
						</div>
					</a>
				{/each}
			</div>
		</section>
	</main>

	<!-- Modals -->
	<ReferenceDrawer isOpen={isDrawerOpen} onClose={() => isDrawerOpen = false} />
	<FailureTriageModal isOpen={isFailureModalOpen} onClose={() => isFailureModalOpen = false} />
	<HemingwayStopModal isOpen={isStopModalOpen} onClose={() => isStopModalOpen = false} />
</div>
