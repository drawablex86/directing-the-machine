<script lang="ts">
	import { Sparkles, Terminal, Sliders, ShieldAlert, Scale, CheckCircle2, XCircle, ArrowRight } from '@lucide/svelte';

	interface ComparisonItem {
		id: string;
		category: string;
		amateur: {
			title: string;
			example: string;
			mindset: string;
			consequence: string;
		};
		director: {
			title: string;
			example: string;
			mindset: string;
			advantage: string;
		};
	}

	const comparisons: ComparisonItem[] = [
		{
			id: 'language',
			category: 'Approach to Language & Prompts',
			amateur: {
				title: 'Adjective Salad & Emotive Shorthand',
				example: '“Cinematic, breathtaking, ultra-realistic, moody lighting, 8k, award-winning composition.”',
				mindset: 'Treats words as emotional incantations hoping the neural network guesses the intended feeling.',
				consequence: 'Triggers model training medians, resulting in generic visual cliché and uniform stock polish.'
			},
			director: {
				title: 'Structural Constraints & Massing',
				example: '“Low eye-level orthographic angle, 45° concrete massing, tungsten point light at 15° elevation. Negative: no synthetic bloom.”',
				mindset: 'Enforces rigid geometric limits, focal hierarchies, light temperatures, and negative exclusions.',
				advantage: 'Narrows model variance to an exact structural boundary, leaving zero room for accidental mediocrity.'
			}
		},
		{
			id: 'calibration',
			category: 'Calibration, Prediction & Probability',
			amateur: {
				title: 'Infinite Rerolls & Lucky Hits',
				example: 'Generates 50 variations in Midjourney or ChatGPT, picks the one that looks neat, and rationalizes intent post-hoc.',
				mindset: 'Conflates outcome quality with decision quality. Believes a lucky render equals creative skill.',
				consequence: 'Cognitive atrophy. The operator never learns why a generation succeeded or how to replicate it reliably.'
			},
			director: {
				title: 'Pre-Run Locks & Brier Calibration',
				example: 'Pre-registers confidence percentages (e.g. 80% on focal composition, 40% on texture) before hitting execute.',
				mindset: 'Strictly decouples decision quality from machine outcome. Tracks mathematical Brier calibration scores.',
				advantage: 'Systematic predictability. Eliminates hindsight bias and exposes whether you actually understand the tool pipeline.'
			}
		},
		{
			id: 'curation',
			category: 'Taste, Selection & Curation',
			amateur: {
				title: 'Passive Consumption of Median Bias',
				example: 'Reviews outputs with subjective gut feelings: “I like this one, it feels punchy and modern.”',
				mindset: 'Outsources discernment to whichever image has the highest synthetic sheen and saturation.',
				consequence: 'Produces derivative work indistinguishable from the rest of the algorithmic internet.'
			},
			director: {
				title: 'Blind Provenance & 40% Human Anchors',
				example: 'Curates outputs blind without knowing which was AI-generated vs human-made, enforcing $\\ge 40\%$ human baseline anchors.',
				mindset: 'Applies an explicit 5-part taste formula (Structural integrity, specificity, resonance, restraint, friction).',
				advantage: 'Shields aesthetic standards from synthetic fatigue and prevents subconscious compromise.'
			}
		},
		{
			id: 'critique',
			category: 'Critique, Feedback & Refusal',
			amateur: {
				title: 'Micro-Tinkering & Endless Tweaking',
				example: 'Spends 3 hours tweaking adjectives and parameter sliders when the foundational premise is fundamentally broken.',
				mindset: 'Assumes every machine generation is redeemable with just one more prompt adjustment.',
				consequence: 'Sunken cost fallacy and exhaustion polishing ideas that should have been killed at minute one.'
			},
			director: {
				title: 'Diagnostic Ladders & Ethical Refusal',
				example: 'Applies the Top-Down Diagnostic Ladder. If the structural premise fails, forks to a re-brief or exercises ethical refusal.',
				mindset: 'Commands 5 distinct refusal modes: Scope, Provenance, Harm, Pastiche, and Intellectual Standing.',
				advantage: 'Preserves authorial energy and kills dead-end directions in 60 seconds with objective vocabulary.'
			}
		},
		{
			id: 'authorship',
			category: 'Authorship, Standing & The Blank Sheet',
			amateur: {
				title: 'Dependent Prompt-Monkeying',
				example: 'Completely paralysed when handed an empty canvas without an AI autocomplete or prompt generator.',
				mindset: 'Needs the machine to supply ideas, structure, voice, and purpose.',
				consequence: 'Replaceable by any other user running the same model with the same trending templates.'
			},
			director: {
				title: 'Sovereign Authorial Standing',
				example: 'Passes the Blank-Sheet Capstone: develops an entire visual or written thesis unassisted before touching any AI tool.',
				mindset: 'Demands clear positionality: “Why me, why this, why now?” Uses machines purely as obedient execution multipliers.',
				advantage: 'Irreplaceable creative moat. The machine amplifies personal voice instead of overwriting it.'
			}
		}
	];

	let activeIdx = $state<number>(0);
</script>

<section id="contrast" class="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<!-- Section Header -->
	<div class="space-y-4 mb-14 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono uppercase tracking-widest font-semibold">
			<Scale class="w-3.5 h-3.5 text-amber-500" />
			<span>The Paradigm Shift</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-bold text-neutral-100 tracking-tight">
			Prompt Engineering vs. Creative Direction
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base leading-relaxed">
			Prompting is an ephemeral trick that loses value with every model release. Creative direction is a durable discipline grounded in diagnostic perception, structural constraints, and moral standing.
		</p>
	</div>

	<!-- Interactive Dimension Switcher (Mobile Tabs / Desktop Selector) -->
	<div class="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin mb-8">
		{#each comparisons as comp, idx}
			<button
				type="button"
				onclick={() => { activeIdx = idx; }}
				class="shrink-0 px-4 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer border flex items-center gap-2 {activeIdx === idx ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-md shadow-amber-500/10' : 'bg-neutral-900/60 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'}"
			>
				<span class="font-mono text-[11px] opacity-80">0{idx + 1}.</span>
				<span>{comp.category}</span>
			</button>
		{/each}
	</div>

	<!-- Active Comparison Split Cards -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
		<!-- Left: The Amateur Prompt Monkey -->
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-950/80 border border-rose-500/30 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
			<div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl pointer-events-none rounded-full"></div>

			<div class="space-y-4 relative z-10">
				<div class="flex items-center justify-between pb-3 border-b border-rose-500/20">
					<div class="inline-flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
						<XCircle class="w-4 h-4 text-rose-400" />
						<span>The Amateur: Prompt Engineering</span>
					</div>
					<span class="text-[11px] font-mono text-neutral-500 uppercase">Frictionless Mediocrity</span>
				</div>

				<div>
					<h3 class="text-xl font-semibold text-neutral-100 tracking-tight">
						{comparisons[activeIdx].amateur.title}
					</h3>
					<p class="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
						{comparisons[activeIdx].amateur.mindset}
					</p>
				</div>

				<!-- Code/Prompt Example -->
				<div class="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800/80 font-mono text-xs text-rose-300 leading-relaxed space-y-1">
					<div class="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Typical Prompt:</div>
					<div class="italic">"{comparisons[activeIdx].amateur.example}"</div>
				</div>
			</div>

			<!-- Breakdown / Failure Mode -->
			<div class="pt-4 border-t border-neutral-900 space-y-1 relative z-10">
				<div class="text-[11px] font-mono uppercase text-rose-400 font-bold tracking-wider">
					The Failure Mode:
				</div>
				<p class="text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed">
					{comparisons[activeIdx].amateur.consequence}
				</p>
			</div>
		</div>

		<!-- Right: The Sovereign Creative Director -->
		<div class="p-6 sm:p-8 rounded-3xl bg-neutral-950/80 border border-emerald-500/40 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-emerald-500/20">
			<div class="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full"></div>

			<div class="space-y-4 relative z-10">
				<div class="flex items-center justify-between pb-3 border-b border-emerald-500/20">
					<div class="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
						<CheckCircle2 class="w-4 h-4 text-emerald-400" />
						<span>The Master: Creative Direction</span>
					</div>
					<span class="text-[11px] font-mono text-emerald-400/80 uppercase font-bold">Durable Authorship</span>
				</div>

				<div>
					<h3 class="text-xl font-semibold text-neutral-100 tracking-tight">
						{comparisons[activeIdx].director.title}
					</h3>
					<p class="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
						{comparisons[activeIdx].director.mindset}
					</p>
				</div>

				<!-- Code/Brief Example -->
				<div class="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800/80 font-mono text-xs text-emerald-300 leading-relaxed space-y-1">
					<div class="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Structural Direction:</div>
					<div>{comparisons[activeIdx].director.example}</div>
				</div>
			</div>

			<!-- Breakdown / Advantage -->
			<div class="pt-4 border-t border-neutral-900 space-y-1 relative z-10">
				<div class="text-[11px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
					The Creative Advantage:
				</div>
				<p class="text-xs sm:text-sm text-neutral-200 leading-relaxed">
					{comparisons[activeIdx].director.advantage}
				</p>
			</div>
		</div>
	</div>

	<!-- Bottom Summary Strip -->
	<div class="mt-8 p-4 sm:p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<div class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></div>
			<p class="text-xs sm:text-sm text-neutral-300">
				Want to systematically replace prompt hacking with structural direction in your own work?
			</p>
		</div>
		<a
			href="/app?tab=today"
			class="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 shrink-0 transition"
		>
			<span>Start Day 1 Practice in Studio</span>
			<ArrowRight class="w-3.5 h-3.5" />
		</a>
	</div>
</section>
