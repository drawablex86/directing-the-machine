<script lang="ts">
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
		Clock,
		Lock,
		Unlock,
		ShieldCheck,
		AlertCircle
	} from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	let { onSelectModality }: { onSelectModality: (modId: string) => void } = $props();

	const layers = [
		{
			title: 'Layer 1: Foundations & Diagnostic Observation',
			tagline: 'Learn to see accurately, find non-obvious problems, and build disciplined practice contracts.',
			accentColor: 'text-emerald-400',
			badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
			labs: [
				{
					id: 'm0',
					code: 'Core 0',
					name: 'Baseline Skills Audit & Learning Runway',
					icon: Target,
					time: '15–30m',
					phase: 'Initial Baseline',
					purpose: '12-competency self-audit, free play space, daily observation log, and weekly pace selection.'
				},
				{
					id: 'm1',
					code: 'Core 1',
					name: 'Problem Discovery & Positionality Lab',
					icon: Compass,
					time: '30–60m',
					phase: 'Foundations (Weeks 1–3)',
					purpose: '6-step problem discovery funnel, ethical standing verification, and protected 60-minute unassigned exploration.'
				},
				{
					id: 'm2',
					code: 'Core 2',
					name: 'Observation Precision & Zero-Adjective Linter',
					icon: Eye,
					time: '20–45m',
					phase: 'Foundations (Weeks 1–3)',
					purpose: 'Strict zero-adjective regex linter, 6-question decision audit, 5-rung diagnostic ladder, and massing canvas.'
				}
			]
		},
		{
			title: 'Layer 2: Systems, Briefs & Calibration',
			tagline: 'Formulate testable premises, engineer predictable pipelines, and refine objective taste.',
			accentColor: 'text-blue-400',
			badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
			labs: [
				{
					id: 'm3',
					code: 'Core 3',
					name: 'Creative Brief Builder & Premise Forge',
					icon: FileText,
					time: '30–60m',
					phase: 'Systems (Weeks 4–6)',
					purpose: '3-premise generator with explicit rejection reasons, 7-layer briefs, and 3/6/10 constraint views.'
				},
				{
					id: 'm4',
					code: 'Core 4',
					name: 'Pipeline Mapping & Prediction Calibration',
					icon: Sliders,
					time: '45–90m',
					phase: 'Calibration (Weeks 7–9)',
					purpose: 'Variable pipeline mapping, pre-run confidence score locking, predictive accuracy tracking, and bias detection.'
				},
				{
					id: 'm5',
					code: 'Core 5',
					name: 'Taste Benchmark & Blind Curation Arena',
					icon: Sparkles,
					time: '30–45m',
					phase: 'Taste (Weeks 10–12)',
					purpose: '5-part taste criteria builder, blind comparisons with hidden provenance labels, and human anchor library.'
				}
			]
		},
		{
			title: 'Layer 3: Creative Authorship & Direction',
			tagline: 'Direct collaborators, master the moral art of refusal, and execute blank-sheet capstones.',
			accentColor: 'text-amber-400',
			badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
			labs: [
				{
					id: 'm6',
					code: 'Core 6',
					name: 'Creative Direction, Feedback & Refusal Studio',
					icon: Users,
					time: '30–60m',
					phase: 'Direction (Weeks 13–15)',
					purpose: 'Revision vs re-brief decision fork, stakeholder critique triage, and principled refusal composer.'
				},
				{
					id: 'm7',
					code: 'Core 7',
					name: 'Independent Authorship & Capstone Studio',
					icon: Award,
					time: '60m+',
					phase: 'Months 4–9',
					purpose: 'Stated vs inferred gap audit, cross-medium synthesis tests, and 14-step blank-sheet capstone projects.'
				}
			]
		}
	];
</script>

<div class="space-y-8 animate-in fade-in duration-150">
	<!-- Header with Khan Academy Mastery Gating Status & Educator Bypass Toggle -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<h2 class="text-xl font-bold text-white tracking-tight">Studio Modalities & Deliberate Labs</h2>
				{#if practiceStore.bypassMasteryLocks}
					<span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
						Preview Mode (All Labs Unlocked)
					</span>
				{/if}
			</div>
			<p class="text-xs md:text-sm text-neutral-400">
				Disciplined studios mapped across the 3 layers of deliberate practice. Sequential release ensures deep foundational mastery before complex capstones.
			</p>
		</div>

		<!-- Master Lock Toggle (For advanced users/educators) -->
		<button
			type="button"
			onclick={() => practiceStore.toggleBypassMasteryLocks()}
			class="px-3 py-1.5 rounded-xl text-xs font-mono border transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer {practiceStore.bypassMasteryLocks ? 'bg-purple-950/40 border-purple-500/50 text-purple-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
			title="Toggle mastery lock enforcement for educators and advanced practitioners"
		>
			{#if practiceStore.bypassMasteryLocks}
				<Unlock class="w-3.5 h-3.5 text-purple-400" />
				<span>Enforce Locks</span>
			{:else}
				<Lock class="w-3.5 h-3.5 text-neutral-400" />
				<span>Preview All (Bypass Locks)</span>
			{/if}
		</button>
	</div>

	{#each layers as layer}
		<div class="space-y-3">
			<div class="border-b border-neutral-800/80 pb-2">
				<h3 class="text-sm md:text-base font-bold text-neutral-200">
					{layer.title}
				</h3>
				<p class="text-xs text-neutral-400 mt-0.5">
					{layer.tagline}
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each layer.labs as lab}
					{@const isUnlocked = practiceStore.isModalityUnlocked(lab.id)}
					{@const unlockRequirement = practiceStore.getModalityUnlockRequirement(lab.id)}

					<div
						class="p-5 rounded-2xl border transition flex flex-col justify-between text-left group shadow-sm {isUnlocked ? 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/90' : 'bg-neutral-950/40 border-neutral-800/50 opacity-75'}"
					>
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<div class="w-10 h-10 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center {isUnlocked ? 'text-amber-400 group-hover:scale-105' : 'text-neutral-500'} transition">
									<lab.icon class="w-5 h-5" />
								</div>
								<div class="flex items-center gap-2">
									{#if !isUnlocked}
										<span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
											<Lock class="w-3 h-3 text-amber-400" />
											<span>Locked</span>
										</span>
									{:else}
										<span class="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
											<Clock class="w-3 h-3 text-neutral-500" />
											{lab.time}
										</span>
									{/if}
									<span class="font-mono text-xs font-bold {isUnlocked ? 'text-neutral-300' : 'text-neutral-500'}">
										{lab.code}
									</span>
								</div>
							</div>

							<div>
								<h4 class="font-bold text-sm {isUnlocked ? 'text-neutral-100 group-hover:text-white' : 'text-neutral-300'} transition">
									{lab.name}
								</h4>
								<span class="text-[11px] font-medium text-neutral-400 inline-block mt-0.5">
									{lab.phase}
								</span>
								<p class="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
									{lab.purpose}
								</p>
							</div>
						</div>

						<div class="mt-4 pt-3 border-t border-neutral-800/80">
							{#if isUnlocked}
								<button
									type="button"
									onclick={() => onSelectModality(lab.id)}
									class="w-full flex items-center justify-between text-xs text-neutral-400 group-hover:text-amber-400 transition cursor-pointer font-medium"
								>
									<span>Enter Lab Studio</span>
									<ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
								</button>
							{:else}
								<div class="flex items-center justify-between text-xs text-neutral-500">
									<span class="text-[11px] italic text-neutral-400">
										{unlockRequirement}
									</span>
									<button
										type="button"
										onclick={() => onSelectModality(lab.id)}
										class="text-[10px] font-mono text-amber-500/70 hover:text-amber-400 underline cursor-pointer"
										title="Preview this locked lab anyway"
									>
										Preview
									</button>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
