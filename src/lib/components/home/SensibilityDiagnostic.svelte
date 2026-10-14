<script lang="ts">
	import { CheckCircle2, XCircle, Sparkles, ArrowRight, RefreshCw } from '@lucide/svelte';

	interface QuizQuestion {
		id: number;
		scenario: string;
		context: string;
		optionA: {
			text: string;
			type: 'adjective' | 'structural';
			feedback: string;
		};
		optionB: {
			text: string;
			type: 'adjective' | 'structural';
			feedback: string;
		};
		explanation: string;
	}

	const questions: QuizQuestion[] = [
		{
			id: 1,
			scenario: 'Directing a Visual Identity Campaign',
			context: 'You need an architectural editorial photo of a concrete pavilion at dusk. Which direction produces an authorial output instead of generic Midjourney stock?',
			optionA: {
				text: '"Cinematic, breathtaking architectural photo of concrete brutalist pavilion, dramatic moody lighting, award-winning, 8k, hyper-detailed."',
				type: 'adjective',
				feedback: 'Amateur Prompting (Adjective Overload): Triggers model statistical averages. "Cinematic" and "breathtaking" add zero geometric control and generate generic glossy clichés.'
			},
			optionB: {
				text: '"Low eye-level orthographic perspective of 45-degree board-formed concrete massing. Natural single directional light source at 15 degrees elevation. High dynamic range shadow depth. Off-center human silhouette on lower third. Negative constraint: no lens flare, no synthetic fog."',
				type: 'structural',
				feedback: 'Creative Direction (Structural Intent): Dictates focal planes, massing geometry, lighting elevation in degrees, and explicit negative constraints. Gives the model a rigid boundary while preserving voice.'
			},
			explanation: 'Adjectives surrender control to the model’s median training bias. Structural specifications, spatial hierarchies, and negative constraints enforce your intentional authorship.'
		},
		{
			id: 2,
			scenario: 'Evaluating Machine-Written Thought Leadership',
			context: 'A model generates a 1,200-word essay that sounds articulate and polished. How do you triage the output before publication?',
			optionA: {
				text: 'Praise the flow, fix a couple of awkward sentence transitions, and ship it because "it reads smoothly and sounds authoritative."',
				type: 'adjective',
				feedback: 'Outcome Conflation: Smoothness is not truth. AI excels at syntactic plausibility while making zero real claims, avoiding all counter-arguments, and risking zero positionality.'
			},
			optionB: {
				text: 'Run the Diagnostic Ladder: Audit the core thesis. Does it make a claim that could be falsified? Apply the Subtraction Diff: if you delete the adjectives, does an actual argument remain? Refuse publication if standing is absent.',
				type: 'structural',
				feedback: 'Diagnostic Rigor: You separate surface fluency from decision quality. You refuse hollow fluency and demand defensible positionality.'
			},
			explanation: 'The amateur evaluates whether an output "feels right". The director applies a diagnostic hierarchy: Premise > Argument Structure > Supporting Evidence > Syntactic Tone.'
		}
	];

	let activeIdx = $state(0);
	let selectedOption = $state<'A' | 'B' | null>(null);

	function choose(opt: 'A' | 'B') {
		selectedOption = opt;
	}

	function nextQuestion() {
		selectedOption = null;
		activeIdx = (activeIdx + 1) % questions.length;
	}
</script>

<section id="diagnostic" class="py-20 md:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<div class="space-y-3 mb-12 text-center sm:text-left">
		<div class="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
			2-Minute Interactive Taste & Calibration Test
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
			Test Your Sensibility: Prompt Monkeying vs. True Direction
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base font-serif">
			Can you spot the difference between lazy adjective-laden prompting and rigorous structural intent? Take this diagnostic sample.
		</p>
	</div>

	<!-- Interactive Exercise Container -->
	<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/90 shadow-2xl space-y-6">
		<div class="flex items-center justify-between pb-4 border-b border-neutral-800">
			<span class="text-xs font-mono uppercase font-bold text-amber-400 tracking-wider">
				Scenario {activeIdx + 1} of {questions.length}: {questions[activeIdx].scenario}
			</span>
			<button
				type="button"
				onclick={nextQuestion}
				class="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
			>
				<RefreshCw class="w-3.5 h-3.5" />
				<span>Switch Scenario</span>
			</button>
		</div>

		<div class="space-y-2">
			<p class="text-sm sm:text-base font-serif text-neutral-200 leading-relaxed">
				{questions[activeIdx].context}
			</p>
			<p class="text-xs font-mono uppercase text-neutral-500">
				Select the instruction or triage action that demonstrates true creative authorship:
			</p>
		</div>

		<!-- Options Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
			<!-- Option A -->
			<button
				type="button"
				onclick={() => choose('A')}
				class="p-5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer {selectedOption === 'A' ? (questions[activeIdx].optionA.type === 'structural' ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200' : 'bg-rose-950/40 border-rose-500/80 text-rose-200') : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'}"
			>
				<div class="space-y-2">
					<div class="font-mono text-xs font-bold text-neutral-400 uppercase">
						Approach A
					</div>
					<p class="text-xs sm:text-sm font-sans leading-relaxed">
						{questions[activeIdx].optionA.text}
					</p>
				</div>

				{#if selectedOption === 'A'}
					<div class="mt-4 pt-3 border-t border-current/20 text-xs font-serif leading-relaxed">
						{questions[activeIdx].optionA.feedback}
					</div>
				{/if}
			</button>

			<!-- Option B -->
			<button
				type="button"
				onclick={() => choose('B')}
				class="p-5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer {selectedOption === 'B' ? (questions[activeIdx].optionB.type === 'structural' ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200' : 'bg-rose-950/40 border-rose-500/80 text-rose-200') : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'}"
			>
				<div class="space-y-2">
					<div class="font-mono text-xs font-bold text-neutral-400 uppercase">
						Approach B
					</div>
					<p class="text-xs sm:text-sm font-sans leading-relaxed">
						{questions[activeIdx].optionB.text}
					</p>
				</div>

				{#if selectedOption === 'B'}
					<div class="mt-4 pt-3 border-t border-current/20 text-xs font-serif leading-relaxed">
						{questions[activeIdx].optionB.feedback}
					</div>
				{/if}
			</button>
		</div>

		<!-- Explanation Banner when selected -->
		{#if selectedOption}
			<div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-serif leading-relaxed flex items-start gap-3">
				<Sparkles class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
				<div>
					<strong class="font-bold text-white">The Core Insight: </strong>
					{questions[activeIdx].explanation}
				</div>
			</div>
		{/if}

		<!-- Studio Link -->
		<div class="flex items-center justify-between pt-2">
			<span class="text-xs text-neutral-500 font-mono">
				Want to run real zero-adjective regex audits on your own briefs?
			</span>
			<a
				href="/app"
				class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
			>
				<span>Open M2 Diagnostic Lab in Studio</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</a>
		</div>
	</div>
</section>
