<script lang="ts">
	import { CheckCircle2, XCircle, Sparkles, ArrowRight, RefreshCw, Trophy, ShieldCheck, Scale } from '@lucide/svelte';

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
			scenario: 'Directing Visual Architecture',
			context: 'You need an architectural editorial photo of a brutalist concrete pavilion at dusk. Which direction produces an authorial output instead of generic Midjourney stock?',
			optionA: {
				text: '“Cinematic, breathtaking architectural photo of concrete brutalist pavilion, dramatic moody lighting, award-winning, 8k, hyper-detailed.”',
				type: 'adjective',
				feedback: 'Amateur Prompting (Adjective Overload): Triggers model statistical medians. Words like “cinematic” and “breathtaking” offer zero geometric control and generate generic glossy clichés.'
			},
			optionB: {
				text: '“Low eye-level orthographic perspective of 45-degree board-formed concrete massing. Single directional tungsten light source at 15 degrees elevation. High dynamic range shadow depth. Negative constraint: no lens flare, no synthetic fog.”',
				type: 'structural',
				feedback: 'Creative Direction (Structural Intent): Dictates focal planes, massing geometry, lighting elevation in degrees, and explicit negative constraints. Gives the model a rigid boundary while preserving personal voice.'
			},
			explanation: 'Adjectives surrender control to the model’s median training bias. Structural specifications, spatial hierarchies, and negative constraints enforce your intentional authorship.'
		},
		{
			id: 2,
			scenario: 'Evaluating Machine-Written Thought Leadership',
			context: 'A model generates a 1,200-word essay that sounds articulate and polished. How do you triage the output before publication?',
			optionA: {
				text: 'Praise the flow, fix a couple of awkward sentence transitions, and ship it because “it reads smoothly and sounds authoritative.”',
				type: 'adjective',
				feedback: 'Outcome Conflation: Smoothness is not truth. AI excels at syntactic plausibility while making zero real claims, avoiding counter-arguments, and risking zero positionality.'
			},
			optionB: {
				text: 'Run the Diagnostic Ladder: Audit the core thesis. Does it make a claim that could be falsified? Apply the Subtraction Diff: if you delete the adjectives, does an actual argument remain? Refuse publication if standing is absent.',
				type: 'structural',
				feedback: 'Diagnostic Rigor: You separate surface fluency from decision quality. You refuse hollow fluency and demand defensible positionality.'
			},
			explanation: 'The amateur evaluates whether an output “feels right”. The director applies a diagnostic hierarchy: Premise > Argument Structure > Supporting Evidence > Syntactic Tone.'
		},
		{
			id: 3,
			scenario: 'Pipeline Calibration & Predictive Lock',
			context: 'You are running a multi-step image-to-image or reasoning pipeline. How do you determine whether your prompt revisions actually improved anything?',
			optionA: {
				text: 'Hit generate 20 times with varying seeds, select the prettiest render, and assume your latest prompt edit was the reason it looked good.',
				type: 'adjective',
				feedback: 'Hindsight Bias & Lucky Success: You conflate a random lucky seed with decision quality. You learn nothing about how the tool actually behaved.'
			},
			optionB: {
				text: 'Pre-register confidence percentages (e.g. 75% on focal balance, 30% on texture fidelity) BEFORE hitting execute, and track your mathematical Brier calibration score over time.',
				type: 'structural',
				feedback: 'Calibrated Forecasting: By locking your prediction beforehand, you eliminate retrospective rationalization and build true scientific mastery of the system.'
			},
			explanation: 'Mastery is not getting what you like; mastery is knowing beforehand exactly what was going to appear and narrowing your calibration error.'
		},
		{
			id: 4,
			scenario: 'Positionality & Ethical Refusal',
			context: 'A client requests a high-budget synthetic visual campaign depicting the sacred rituals of an indigenous culture with which your team has zero lived relationship.',
			optionA: {
				text: 'Accept the contract immediately and run extensive prompts using ethnically descriptive adjectives to generate stunning visual pastiche.',
				type: 'adjective',
				feedback: 'Extractive Pastiche: A neural network has no lineage or ethical responsibility. Generating pastiche without standing produces hollow cultural exploitation.'
			},
			optionB: {
				text: 'Apply the Standing & Positionality Test: Issue an Ethical Refusal under Mode 4 (Pastiche / Extraction) and redirect the client to indigenous creators or re-brief with sovereign standing.',
				type: 'structural',
				feedback: 'Ethical Direction: You recognize that creative authorship requires standing. The director knows when refusal is the highest form of creative judgment.'
			},
			explanation: 'AI can generate answers to everything, but it can never tell you why you have the standing to speak. Knowing when to refuse is the ultimate hallmark of authorship.'
		}
	];

	let activeIdx = $state(0);
	let answers = $state<Record<number, 'A' | 'B'>>({});
	let quizComplete = $derived(Object.keys(answers).length === questions.length);

	let structuralCount = $derived(
		Object.entries(answers).reduce((count, [qId, choice]) => {
			const q = questions.find(item => item.id === Number(qId));
			if (!q) return count;
			const selectedType = choice === 'A' ? q.optionA.type : q.optionB.type;
			return selectedType === 'structural' ? count + 1 : count;
		}, 0)
	);

	function choose(opt: 'A' | 'B') {
		answers[questions[activeIdx].id] = opt;
	}

	function nextQuestion() {
		if (activeIdx < questions.length - 1) {
			activeIdx += 1;
		}
	}

	function prevQuestion() {
		if (activeIdx > 0) {
			activeIdx -= 1;
		}
	}

	function resetQuiz() {
		answers = {};
		activeIdx = 0;
	}
</script>

<section id="diagnostic" class="py-20 md:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<!-- Section Header -->
	<div class="space-y-4 mb-12 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest font-semibold">
			<Scale class="w-3.5 h-3.5 text-amber-500" />
			<span>2-Minute Interactive Taste & Calibration Test</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
			Test Your Sensibility: Prompt Monkeying vs. True Direction
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base font-serif leading-relaxed">
			Can you spot the difference between lazy adjective-laden prompting and rigorous structural intent? Take this 4-part diagnostic.
		</p>
	</div>

	<!-- Interactive Exercise Container -->
	<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/90 shadow-2xl space-y-6">
		{#if quizComplete}
			<!-- Quiz Complete Scorecard -->
			<div class="text-center py-6 space-y-6">
				<div class="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
					<Trophy class="w-8 h-8" />
				</div>

				<div class="space-y-2">
					<span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
						Diagnostic Evaluation Complete
					</span>
					<h3 class="text-2xl sm:text-3xl font-serif font-bold text-white">
						Your Sensibility Score: {structuralCount} / {questions.length} Structural Intent
					</h3>
					<p class="text-sm font-serif text-neutral-300 max-w-xl mx-auto leading-relaxed">
						{#if structuralCount === 4}
							Master Director Instincts — You naturally distinguish between lazy adjectives, retrospective rationalization, and structural authorship. You are primed for Week 1 Studio.
						{:else if structuralCount >= 2}
							Developing Sensibility — You have strong creative instincts, but occasionally conflate surface polish with structural intent. Directing the Machine will give you the mathematical tools (Brier scores) and regex linters to eliminate accidental outcomes.
						{:else}
							Prompt-Dependent — You are heavily reliant on model medians and adjectives. Directing the Machine will rewire how you communicate with generative intelligence from the ground up.
						{/if}
					</p>
				</div>

				<div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
					<a
						href="/app?tab=assessment"
						class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
					>
						<span>Begin Week 0 Baseline Assessment in Studio</span>
						<ArrowRight class="w-4 h-4" />
					</a>

					<button
						type="button"
						onclick={resetQuiz}
						class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono transition cursor-pointer"
					>
						<RefreshCw class="w-3.5 h-3.5" />
						<span>Retake Test</span>
					</button>
				</div>
			</div>
		{:else}
			<!-- Question Progress Bar -->
			<div class="flex items-center justify-between pb-4 border-b border-neutral-800">
				<span class="text-xs font-mono uppercase font-bold text-amber-400 tracking-wider">
					Scenario {activeIdx + 1} of {questions.length}: {questions[activeIdx].scenario}
				</span>

				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={prevQuestion}
						disabled={activeIdx === 0}
						class="text-xs text-neutral-400 hover:text-white disabled:opacity-40 transition cursor-pointer font-mono"
					>
						← Prev
					</button>
					<span class="text-neutral-600 font-mono text-xs">/</span>
					<button
						type="button"
						onclick={nextQuestion}
						disabled={activeIdx === questions.length - 1}
						class="text-xs text-neutral-400 hover:text-white disabled:opacity-40 transition cursor-pointer font-mono"
					>
						Next →
					</button>
				</div>
			</div>

			<!-- Question Context -->
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
					class="p-5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer {answers[questions[activeIdx].id] === 'A' ? (questions[activeIdx].optionA.type === 'structural' ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200' : 'bg-rose-950/40 border-rose-500/80 text-rose-200') : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'}"
				>
					<div class="space-y-2">
						<div class="font-mono text-xs font-bold text-neutral-400 uppercase">
							Approach A
						</div>
						<p class="text-xs sm:text-sm font-sans leading-relaxed">
							{questions[activeIdx].optionA.text}
						</p>
					</div>

					{#if answers[questions[activeIdx].id] === 'A'}
						<div class="mt-4 pt-3 border-t border-current/20 text-xs font-serif leading-relaxed">
							{questions[activeIdx].optionA.feedback}
						</div>
					{/if}
				</button>

				<!-- Option B -->
				<button
					type="button"
					onclick={() => choose('B')}
					class="p-5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer {answers[questions[activeIdx].id] === 'B' ? (questions[activeIdx].optionB.type === 'structural' ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200' : 'bg-rose-950/40 border-rose-500/80 text-rose-200') : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'}"
				>
					<div class="space-y-2">
						<div class="font-mono text-xs font-bold text-neutral-400 uppercase">
							Approach B
						</div>
						<p class="text-xs sm:text-sm font-sans leading-relaxed">
							{questions[activeIdx].optionB.text}
						</p>
					</div>

					{#if answers[questions[activeIdx].id] === 'B'}
						<div class="mt-4 pt-3 border-t border-current/20 text-xs font-serif leading-relaxed">
							{questions[activeIdx].optionB.feedback}
						</div>
					{/if}
				</button>
			</div>

			<!-- Explanation Banner when selected -->
			{#if answers[questions[activeIdx].id]}
				<div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-serif leading-relaxed flex items-start justify-between gap-3">
					<div class="flex items-start gap-3">
						<Sparkles class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
						<div>
							<strong class="font-bold text-white">The Core Insight: </strong>
							{questions[activeIdx].explanation}
						</div>
					</div>

					{#if activeIdx < questions.length - 1}
						<button
							type="button"
							onclick={nextQuestion}
							class="shrink-0 px-3 py-1 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold transition font-mono"
						>
							Next Question →
						</button>
					{/if}
				</div>
			{/if}

			<!-- Studio Link -->
			<div class="flex items-center justify-between pt-2">
				<span class="text-xs text-neutral-500 font-mono">
					Answer all {questions.length} scenarios to calculate your complete director calibration rating.
				</span>
				<a
					href="/app?tab=assessment"
					class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
				>
					<span>Open Full Assessment in Studio</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>
		{/if}
	</div>
</section>
