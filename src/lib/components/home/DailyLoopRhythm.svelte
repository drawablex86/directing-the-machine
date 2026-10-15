<script lang="ts">
	import { Clock, BookOpen, Dumbbell, Hammer, Terminal, ArrowRight, ShieldCheck, Flame, AlertCircle } from '@lucide/svelte';

	const steps = [
		{
			number: '01',
			name: 'Read Concept',
			duration: '20–30m',
			icon: BookOpen,
			tagline: 'Absorb the Mental Model',
			description: 'Study one targeted concept module from the 81-module curriculum. Understand why craft shifts from execution to diagnostic judgment.',
			deliverable: '1 key insight annotated in marginalia'
		},
		{
			number: '02',
			name: 'Run Drill',
			duration: '30–45m',
			icon: Dumbbell,
			tagline: 'Isolate the Cognitive Muscle',
			description: 'Execute an isolated deliberate practice drill: 5-second flash massing reconstructions, blind provenance scoring, or 5-mode refusal exercises.',
			deliverable: 'Timed drill scorecard & Brier calibration check'
		},
		{
			number: '03',
			name: 'Make & Diagnose',
			duration: '60–90m',
			icon: Hammer,
			tagline: 'Work on Real Stakes',
			description: 'Push your active Milestone Project forward. Enforce zero-adjective regex audits, pre-register confidence locks, and triage machine outputs.',
			deliverable: 'Production portfolio artifact'
		},
		{
			number: '04',
			name: 'Hemingway Log',
			duration: '10m Hard Cap',
			icon: Terminal,
			tagline: 'Stop Mid-Momentum',
			description: 'Record a timed reflection log. Audit Decision Quality vs Outcome Quality on the 2-Axis Matrix. Stop while the fire is still burning.',
			deliverable: 'Permanent local practice journal entry'
		}
	];
</script>

<section class="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<!-- Section Header -->
	<div class="space-y-4 mb-14 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest font-semibold">
			<Clock class="w-3.5 h-3.5 text-amber-500" />
			<span>The Daily Architecture</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-bold text-neutral-100 tracking-tight">
			The Non-Negotiable Daily Practice Loop
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base leading-relaxed">
			Deliberate practice is not passive video watching. Every day follows a disciplined, time-bounded cadence designed to build instinct without degenerating into productivity theatre.
		</p>
	</div>

	<!-- 4-Step Cards Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each steps as step}
			{@const StepIcon = step.icon}
			<div class="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 hover:border-amber-500/40 transition flex flex-col justify-between space-y-6 group">
				<div class="space-y-4">
					<!-- Step Number & Duration Badge -->
					<div class="flex items-center justify-between pb-3 border-b border-neutral-800/70">
						<span class="font-mono text-xl font-bold text-amber-500">
							{step.number}
						</span>
						<span class="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-300">
							<Clock class="w-3 h-3 text-amber-500" />
							<span>{step.duration}</span>
						</span>
					</div>

					<!-- Icon & Title -->
					<div class="space-y-1">
						<div class="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-500 group-hover:border-amber-500/40 group-hover:scale-105 transition">
							<StepIcon class="w-5 h-5" />
						</div>
						<h3 class="text-lg font-serif font-bold text-neutral-100 pt-2">
							{step.name}
						</h3>
						<div class="text-xs font-mono uppercase text-amber-500 font-semibold tracking-wider">
							{step.tagline}
						</div>
					</div>

					<p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
						{step.description}
					</p>
				</div>

				<!-- Step Deliverable Footer -->
				<div class="pt-3 border-t border-neutral-800/60 text-[11px] font-mono text-neutral-400 flex items-center gap-2">
					<span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
					<span class="truncate">{step.deliverable}</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Productivity Theatre Warning Alert (Direct from Directing the Machine.md) -->
	<div class="mt-8 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start gap-4">
		<div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
			<AlertCircle class="w-5 h-5" />
		</div>
		<div class="space-y-1.5 text-xs sm:text-sm">
			<div class="font-mono uppercase font-bold text-amber-400 tracking-wider">
				Why the 10-Minute Log Cap Is Rigidly Enforced
			</div>
			<p class="text-neutral-300 font-serif leading-relaxed">
				Many practitioners fall into the trap of “productivity theatre”—spending three hours organizing Notion templates, designing elaborate logging dashboards, and never actually making anything. Directing the Machine caps reflection at exactly 10 minutes with a hard stop inspired by Hemingway: <em>always stop while you still know what happens next</em>.
			</p>
		</div>
	</div>
</section>
