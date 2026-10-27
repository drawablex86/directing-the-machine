<script lang="ts">
	import {
		Compass,
		ArrowRight,
		CheckCircle2,
		Sparkles,
		Flame,
		Clock,
		Target,
		ChevronRight,
		BookOpen
	} from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	let {
		onSelectModality,
		onContinueSession
	}: {
		onSelectModality?: (modId: string) => void;
		onContinueSession?: () => void;
	} = $props();

	// Check if user has completed baseline (scores or problems)
	const hasBaselineCompleted = $derived(
		practiceStore.baseline.some((b) => b.score > 2 || b.notes.trim().length > 0) ||
		practiceStore.problems.length > 0
	);

	// Contextual active mission
	const currentMission = $derived.by(() => {
		if (!hasBaselineCompleted) {
			return {
				title: 'Milestone 1: Establish Your Creative Baseline',
				subtitle: 'Calibrate your 12 directorial competencies (Observation, Premise, Direction, Curation)',
				duration: '~5–10 mins',
				actionLabel: 'Take Baseline Diagnostic (M0)',
				targetModality: 'm0',
				tag: 'Current Focus'
			};
		}
		if (practiceStore.activePart === 0 || practiceStore.activeWeek === 1) {
			return {
				title: 'Milestone 2: Diagnostic Observation & Non-Instrumental Sight',
				subtitle: 'Train your eyes to detect exact visual/textual mechanics with the Zero-Adjective Linter',
				duration: '~15 mins',
				actionLabel: 'Launch Observation Lab (M2)',
				targetModality: 'm2',
				tag: 'Week 1 Focus'
			};
		}
		return {
			title: `Week ${practiceStore.activeWeek} Focus: Part ${practiceStore.activePart}`,
			subtitle: 'Deliberate micro-drill and project execution in the 70–80% challenge zone',
			duration: 'In Progress',
			actionLabel: "Continue Today's Practice",
			targetModality: null,
			tag: 'Active Module'
		};
	});

	function handleAction() {
		if (currentMission.targetModality) {
			onSelectModality?.(currentMission.targetModality);
		} else {
			onContinueSession?.();
		}
	}
</script>

<div class="relative overflow-hidden rounded-2xl border p-5 md:p-6 transition-all bg-neutral-900/70 border-neutral-800 shadow-md">
	<!-- Background subtle ambient glow -->
	<div class="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none rounded-full"></div>

	<div class="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
		<div class="space-y-2 max-w-2xl">
			<div class="flex items-center gap-2">
				<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
					<Target class="w-3.5 h-3.5" />
					<span>{currentMission.tag}</span>
				</span>
				<span class="text-xs font-mono text-neutral-400 flex items-center gap-1">
					<Clock class="w-3.5 h-3.5 text-neutral-500" />
					<span>{currentMission.duration}</span>
				</span>
			</div>

			<h2 class="text-base sm:text-lg font-bold text-white tracking-tight">
				{currentMission.title}
			</h2>

			<p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
				{currentMission.subtitle}
			</p>
		</div>

		<div class="shrink-0 flex items-center">
			<button
				type="button"
				onclick={handleAction}
				class="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
			>
				<span>{currentMission.actionLabel}</span>
				<ArrowRight class="w-4 h-4" />
			</button>
		</div>
	</div>
</div>
