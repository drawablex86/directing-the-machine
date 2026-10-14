<script lang="ts">
	import { Sparkles, ArrowRight, BookOpen, Compass, CheckCircle2, X } from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	let { onSelectModality }: { onSelectModality?: (modId: string) => void } = $props();

	let isDismissed = $state(false);

	const isFirstTime = $derived(
		practiceStore.practiceSessions.length === 0 &&
		practiceStore.problems.length === 0 &&
		practiceStore.calibrations.length === 0
	);
</script>

{#if !isDismissed}
	<div class="relative overflow-hidden rounded-2xl border p-5 md:p-6 shadow-md transition-colors bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/20 border-neutral-800 welcome-banner-card">
		<!-- Close / Dismiss button -->
		<button
			type="button"
			onclick={() => isDismissed = true}
			class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100 transition p-1 rounded-lg"
			aria-label="Dismiss guide"
			title="Dismiss orientation guide"
		>
			<X class="w-4 h-4" />
		</button>

		<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pr-8">
			<div class="space-y-2 max-w-2xl">
				<div class="flex items-center gap-2">
					<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
						<Compass class="w-3.5 h-3.5" />
						Orientation Guide
					</span>
					<span class="text-xs text-neutral-400">Directing the Machine Studio</span>
				</div>

				<h2 class="text-lg md:text-xl font-bold text-white tracking-tight">
					From Prompt Trial-and-Error to Deliberate Creative Authorship
				</h2>

				<p class="text-xs md:text-sm text-neutral-300 leading-relaxed">
					This studio is a structured training engine designed to develop your taste, diagnostic observation, and editorial agency with AI systems. Rather than reacting to machine outputs, you establish intentional briefs, calibrate decision predictions, and progressively remove scaffolds.
				</p>

				<div class="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
					<div class="flex items-center gap-1.5">
						<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
						<span><strong>Layer 1:</strong> Observation & Craft</span>
					</div>
					<div class="flex items-center gap-1.5">
						<span class="w-2 h-2 rounded-full bg-blue-400"></span>
						<span><strong>Layer 2:</strong> Systems & Calibration</span>
					</div>
					<div class="flex items-center gap-1.5">
						<span class="w-2 h-2 rounded-full bg-amber-400"></span>
						<span><strong>Layer 3:</strong> Direction & Capstone</span>
					</div>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
				<button
					type="button"
					onclick={() => onSelectModality?.('m0')}
					class="px-4 py-2.5 rounded-xl font-semibold text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 shadow transition cursor-pointer"
				>
					<span>Take Baseline Diagnostic (M0)</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</button>
				<button
					type="button"
					onclick={() => isDismissed = true}
					class="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 transition text-center cursor-pointer welcome-banner-secondary-btn"
				>
					I know the workflow, take me to Today's Practice
				</button>
			</div>
		</div>
	</div>
{/if}
