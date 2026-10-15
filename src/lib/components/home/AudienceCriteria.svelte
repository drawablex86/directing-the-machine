<script lang="ts">
	import { CheckCircle2, XCircle, ShieldAlert, ArrowRight, Compass, Sparkles } from '@lucide/svelte';

	const forYou = [
		{
			title: 'Designers & Creative Directors',
			description: 'Tired of generic Midjourney sheen. You want diagnostic vocabulary to explain exactly why an output fails structurally in terms of focal hierarchy, massing, and lighting geometry.'
		},
		{
			title: 'Writers, Essayists & Researchers',
			description: 'Alienated by syntactic fluency that conceals the complete absence of a falsifiable thesis. You demand subtraction diffs, standing audits, and unassisted blank sheets.'
		},
		{
			title: 'Engineers & Creative Technologists',
			description: 'Building generative pipelines who understand that pre-registering probability distributions (Brier calibration) is the only defense against outcome bias.'
		},
		{
			title: 'Disciplined Independent Practitioners',
			description: 'Ready to dedicate 8–10 hours/week (self-paced distributed path) or 20–25 hours/week (intensive path) to build a production portfolio of 12 real milestone projects.'
		}
	];

	const notForYou = [
		{
			title: 'Prompt-Bro Shortcut Hunters',
			description: 'If you are looking for “Top 50 secret prompts to go viral” or copy-paste swipe files, you will hate this course. Prompting is treated here as a solved commodity.'
		},
		{
			title: 'Passive Video Watchers',
			description: 'There are no passive 10-minute video modules to consume while doing laundry. Every lesson requires active observation drills, written briefs, or code execution.'
		},
		{
			title: 'Those Seeking to Outsource Thinking',
			description: 'If your goal is to let neural networks decide what is worth saying, you will fail the Positionality and Standing gates at Week 1 and Month 6.'
		},
		{
			title: 'Those Who Cannot Face a Blank Sheet',
			description: 'By Week 11, all scaffolding, templates, and pre-filled fields are permanently removed. If you cannot author without a prompt crutch, you will struggle.'
		}
	];
</script>

<section class="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<!-- Section Header -->
	<div class="space-y-4 mb-14 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest font-semibold">
			<ShieldAlert class="w-3.5 h-3.5 text-amber-500" />
			<span>Honest Qualification</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
			Who Directing the Machine Is For—And Who Should Turn Back
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base font-serif leading-relaxed">
			We respect your time too much to pretend this curriculum is for everyone. It was designed from the ground up for practitioners with existing discipline who want to direct tools rather than be directed by them.
		</p>
	</div>

	<!-- 2-Column Split Matrix -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
		<!-- Column 1: Who This Is For -->
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900/30 border border-emerald-500/30 flex flex-col justify-between space-y-6">
			<div class="space-y-6">
				<div class="flex items-center gap-2.5 pb-4 border-b border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
					<CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
					<span>This Curriculum Is Built For You If:</span>
				</div>

				<div class="space-y-5">
					{#each forYou as item}
						<div class="space-y-1">
							<h3 class="text-base font-serif font-bold text-white flex items-center gap-2">
								<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
								<span>{item.title}</span>
							</h3>
							<p class="text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed pl-3.5">
								{item.description}
							</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="pt-4 border-t border-neutral-800">
				<a
					href="/app?tab=today"
					class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition cursor-pointer"
				>
					<span>I Meet the Criteria — Enter Practice Studio</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>
		</div>

		<!-- Column 2: Who Should Turn Back -->
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900/30 border border-rose-500/30 flex flex-col justify-between space-y-6">
			<div class="space-y-6">
				<div class="flex items-center gap-2.5 pb-4 border-b border-rose-500/20 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
					<XCircle class="w-4 h-4 text-rose-400 shrink-0" />
					<span>You Should Look Elsewhere If:</span>
				</div>

				<div class="space-y-5">
					{#each notForYou as item}
						<div class="space-y-1">
							<h3 class="text-base font-serif font-bold text-neutral-200 flex items-center gap-2">
								<span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
								<span>{item.title}</span>
							</h3>
							<p class="text-xs sm:text-sm text-neutral-400 font-serif leading-relaxed pl-3.5">
								{item.description}
							</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="pt-4 border-t border-neutral-800">
				<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-400 text-center">
					High standards protect your focus. We encourage choosing a program that fits your goals.
				</div>
			</div>
		</div>
	</div>
</section>
