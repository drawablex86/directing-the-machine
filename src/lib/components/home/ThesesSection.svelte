<script lang="ts">
	import { Eye, ShieldAlert, Sparkles, Scale, BookOpen, ChevronRight, ArrowRight } from '@lucide/svelte';

	let openTheses = $state<Record<number, boolean>>({
		0: true,
		1: false,
		2: false,
		3: false,
		4: false
	});

	function toggleThesis(idx: number) {
		openTheses[idx] = !openTheses[idx];
	}

	const theses = [
		{
			number: '01',
			title: 'Execution-as-Production vs. Execution-as-Knowledge',
			tagline: 'Why craft still matters, even when hands never touch the clay.',
			moduleLink: 'Module 02: Execution-as-Knowledge',
			lead: 'AI utopianism claims craft is dead. AI denialism claims only tedious handwork is noble. Both are fundamentally confused.',
			body: 'When execution is automated, the purpose of knowing craft shifts. You do not study typography, compositional massing, or syntactic rhythm so that you can out-render a neural network. You study them so that you possess the diagnostic vocabulary required to judge what the machine hands you. If you cannot name the structural flaw in an image or a paragraph, you are not directing the machine—you are simply approving its accidents.',
			quote: '“He who cannot articulate why an output fails is condemned to accept whatever the model prefers.”'
		},
		{
			number: '02',
			title: 'The Zero-Adjective Discipline',
			tagline: 'Vague direction yields homogenised slop; negative constraints yield style.',
			moduleLink: 'Module 04: The Zero-Adjective Discipline',
			lead: 'The amateur instructs the machine with adjectives: “Make it cinematic, visceral, evocative, punchy, hyper-realistic.”',
			body: 'Adjectives are lazy emotional shorthand. To an AI model, they trigger statistical averages—the very definition of visual and textual cliché. True direction speaks in nouns, spatial relationships, tonal values, rhythmic pauses, and explicit negative constraints. In our diagnostic studio, we run strict zero-adjective regex linters on your briefs. When you force yourself to describe structure rather than desired mood, voice emerges.',
			quote: '“If you ask for beauty, you get stock photography. If you specify 15% shadows and an off-axis light source at eye level, you get vision.”'
		},
		{
			number: '03',
			title: 'Outcome Quality vs. Decision Quality',
			tagline: 'The seductive trap of “Lucky Success” and why it ruins creative longevity.',
			moduleLink: 'Module 08: The Two-Axis Matrix',
			lead: 'A bad prompt can produce a dazzling image. A rigorous, brilliant brief can produce a mutated failure.',
			body: 'Most creative practitioners collapse outcome and decision into a single dimension. In the AI era, this is lethal. If you prompt carelessly and the model gets lucky, you reinforce sloppy thinking. In our Two-Axis Matrix, we strictly decouple the two. We celebrate high decision quality even when the output fails (Learning in Progress), and we ruthlessly interrogate lucky outputs generated without deliberate intent (Lucky Unstable).',
			quote: '“Mastery is not getting what you like; mastery is knowing beforehand exactly what was going to appear.”'
		},
		{
			number: '04',
			title: 'The Standing & Positionality Test',
			tagline: 'AI can generate answers to everything. It can never tell you why you should care.',
			moduleLink: 'Module 14: The Standing Check',
			lead: 'In a frictionless medium, the first and most urgent question is not “How can I make this?”, but “Do I have standing to make this?”',
			body: 'A model has no body, no lineage, no lived consequence, and no ethical vulnerability. If you outsource problem-selection to a machine, you end up answering questions nobody asked, solving phantom problems, or generating hollow cultural pastiche. Creative authorship demands positionality: what is your relationship to this material? Why this, why you, and why now? Without standing, you are merely an operator filling the void with noise.',
			quote: '“A question is not exploration until it risks something of the person asking it.”'
		},
		{
			number: '05',
			title: 'The Scaffolding Decay Principle',
			tagline: 'If you never face a blank sheet alone, you will never know who you are.',
			moduleLink: 'Module 27: The Blank-Sheet Test',
			lead: 'Every template is a crutch that conceals the absence of your own sensibility.',
			body: 'The Directing the Machine curriculum supplies intense scaffolding at Week 0—ladders, 7-layer forms, confidence matrices, diagnostic checklists. But unlike commercial software designed to keep you permanently hooked on templates, our engine enforces progressive scaffolding removal. By Week 11, the templates are hidden. You are placed in front of an empty canvas with zero prompts, zero pre-filled fields, and a ticking clock. Can you direct then?',
			quote: '“The measure of an ed-tech system is how quickly it makes itself obsolete to the student.”'
		}
	];
</script>

<section id="theses" class="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<!-- Section Header -->
	<div class="space-y-4 mb-14 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono uppercase tracking-widest font-semibold">
			<BookOpen class="w-3.5 h-3.5 text-amber-500" />
			<span>Foundational Epistemology</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-bold text-neutral-100 tracking-tight">
			The Five Theses of Creative Authorship
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base leading-relaxed">
			Why prompting is an ephemeral commodity, and why the human director must master diagnostic vision, negative constraints, and moral standing.
		</p>
	</div>

	<!-- Theses Cards -->
	<div class="space-y-4">
		{#each theses as thesis, idx}
			<div class="border border-neutral-800/80 rounded-2xl bg-neutral-900/30 overflow-hidden transition-all hover:border-neutral-700">
				<!-- Header Button -->
				<button
					type="button"
					onclick={() => toggleThesis(idx)}
					class="w-full p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
				>
					<div class="flex items-start gap-4">
						<span class="font-mono text-amber-500 font-bold text-lg sm:text-xl">
							{thesis.number}
						</span>
						<div class="space-y-1">
							<div class="flex items-center gap-2 flex-wrap">
								<h3 class="text-lg sm:text-xl font-serif font-bold text-neutral-100 tracking-tight">
									{thesis.title}
								</h3>
								<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500">
									{thesis.moduleLink}
								</span>
							</div>
							<p class="text-xs sm:text-sm text-neutral-400">
								{thesis.tagline}
							</p>
						</div>
					</div>

					<div class="text-neutral-500 transition-transform duration-200 mt-1 {openTheses[idx] ? 'rotate-90 text-amber-500' : ''}">
						<ChevronRight class="w-5 h-5" />
					</div>
				</button>

				<!-- Expanded Content -->
				{#if openTheses[idx]}
					<div class="px-6 pb-6 pt-2 border-t border-neutral-800/60 space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
						<p class="font-medium text-amber-500/90 italic font-serif">
							{thesis.lead}
						</p>
						<p class="text-neutral-300 text-justify sm:text-left text-sm sm:text-base leading-relaxed">
							{thesis.body}
						</p>
						<blockquote class="p-4 rounded-xl bg-neutral-950 border-l-2 border-amber-500 text-neutral-200 italic font-serif text-sm">
							{thesis.quote}
						</blockquote>

						<div class="pt-2 flex items-center justify-end">
							<a
								href="/app?tab=curriculum"
								class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 hover:text-amber-400 transition"
							>
								<span>Read Full Module in Studio</span>
								<ArrowRight class="w-3.5 h-3.5" />
							</a>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
