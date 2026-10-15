<script lang="ts">
	import { ChevronDown, HelpCircle, ArrowRight, ShieldCheck, Sparkles } from '@lucide/svelte';

	let openIndex = $state<number | null>(0);

	function toggleFaq(idx: number) {
		openIndex = openIndex === idx ? null : idx;
	}

	const faqs = [
		{
			q: 'Is this just another course on prompt engineering?',
			a: 'Emphatically no. Prompt engineering treats AI as an execution trick—tweaking adjectives, syntax hacks, and negative tags to get a shiny output. Directing the Machine treats AI execution as a solved commodity. This curriculum focuses entirely upstream on what cannot be automated: diagnostic perception, structural constraints, positionality, taste curation, ethical refusal, and sovereign authorship.'
		},
		{
			q: 'Why should I develop sensibility when models keep getting smarter every 6 months?',
			a: 'Because the smarter models get, the more uniform and median their default outputs become. When anyone can produce a 95th-percentile output with zero effort, the market value of that output drops to zero. The only remaining premium is sensibility—the ability to find non-obvious problems, enforce rigorous personal constraints, identify subtle structural flaws, and inject authentic moral standing.'
		},
		{
			q: 'Do I need paid AI subscriptions, GPU clusters, or API keys to use this?',
			a: 'No. The in-browser studios (Zero-Adjective Linters, Brier Calibration Math, 7-Layer Brief Builder, Blind Provenance Arena, 2-Axis Matrix) run 100% locally in your browser with zero external API dependencies. When executing production assignments, you can use whatever free or paid tools you already prefer (ChatGPT, Claude, Midjourney, Stable Diffusion, or local models).'
		},
		{
			q: 'Who is this curriculum designed for?',
			a: 'Creative directors, senior designers, writers, artists, software engineers, and researchers who find themselves using generative AI tools but feel alienated by the loss of craft, agency, and rigorous critical judgment. It is intended for practitioners with existing discipline who want to direct tools rather than be directed by them.'
		},
		{
			q: 'What is the required time commitment?',
			a: 'The intensive track is designed for 18–25 hours per week over 12 weeks, followed by 6 months of independent project practice. However, practitioners with full-time careers can adopt the deliberate practice rhythm outlined in Appendix O (8–10 hours per week) using our self-paced studio and logbook timers.'
		},
		{
			q: 'How does the 10-minute Hemingway stop prevent productivity theatre?',
			a: 'Many self-directed learners spend weeks designing Notion boards and endless logging systems rather than actually drawing, writing, or coding. Our software caps your post-session logging at exactly 10 minutes with an audible bell and forced closure. Following Ernest Hemingway’s core rule—always stop while you still know what happens next—you preserve creative momentum for tomorrow’s session.'
		},
		{
			q: 'How does the software handle my data and privacy?',
			a: 'Directing the Machine is 100% local-first. All your logs, problem funnels, diagnostic evaluations, brief drafts, and Brier calibration scores are stored exclusively in your browser’s LocalStorage. There are no tracking scripts, no third-party analytics, and no accounts. You can export your complete workspace anytime as clean Markdown and JSON files via Appendix L.'
		},
		{
			q: 'Who built and maintains Directing the Machine?',
			a: 'Directing the Machine was conceived, written, engineered, and is maintained by Rahul Rajeev as an open-access meta-curriculum and practical toolset for creative authorship.'
		}
	];
</script>

<section id="faq" class="py-20 md:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<div class="space-y-4 mb-12 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest font-semibold">
			<HelpCircle class="w-3.5 h-3.5 text-amber-500" />
			<span>Dispatches, Inquiries & Clarifications</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
			Frequently Addressed Questions & Objections
		</h2>
		<p class="text-neutral-400 text-sm sm:text-base font-serif leading-relaxed">
			Everything you need to know about the pedagogical rationale, technical privacy, and curriculum philosophy.
		</p>
	</div>

	<!-- Accordion List -->
	<div class="space-y-3">
		{#each faqs as item, idx}
			<div class="rounded-2xl border border-neutral-800/80 bg-neutral-900/30 overflow-hidden transition hover:border-neutral-700">
				<button
					type="button"
					onclick={() => toggleFaq(idx)}
					class="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
				>
					<span class="text-sm sm:text-base font-serif font-bold text-white">
						{item.q}
					</span>
					<div class="text-neutral-500 transition-transform duration-200 shrink-0 {openIndex === idx ? 'rotate-180 text-amber-400' : ''}">
						<ChevronDown class="w-4 h-4" />
					</div>
				</button>

				{#if openIndex === idx}
					<div class="px-5 pb-5 pt-1 border-t border-neutral-800/60 text-xs sm:text-sm font-sans text-neutral-300 leading-relaxed">
						{item.a}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
