<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { Quadrant } from '$lib/schemas/course.schema';
	import { Sparkles, Award, Check } from '@lucide/svelte';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let outcomeScore = $state(3);
	let decisionScore = $state(3);
	let reflectionNotes = $state('');
	let critique = $state<CritiqueResult | null>(null);
	let isCheckingCrossExam = $state(false);
	let savedNotice = $state(false);

	let currentQuadrant = $derived<Quadrant>(
		practiceStore.classifyQuadrant(outcomeScore, decisionScore)
	);

	async function runCrossExam() {
		if (isCheckingCrossExam) return;
		isCheckingCrossExam = true;
		try {
			const res = await executePrompt('two-axis-cross-examination', {
				projectName: 'Directing the Machine Studio Assessment',
				outcomeScore,
				decisionScore,
				reflectionNotes,
				projectContext: `Classified as ${currentQuadrant}`
			});
			critique = res;
		} catch (err) {
			console.error('Failed to run two-axis cross examination:', err);
		} finally {
			isCheckingCrossExam = false;
		}
	}

	const quadrants = [
		{
			id: 'learning-in-progress',
			name: 'Learning in Progress',
			outcome: 'Weak Outcome',
			decision: 'Strong Reasoning',
			desc: 'Process is sound; execution or craft lags. Normal in early phases. Identify lagging sub-skill.',
			border: 'border-blue-500/40',
			bg: 'bg-blue-950/20',
			text: 'text-blue-400'
		},
		{
			id: 'mastery',
			name: 'Mastery (Target State)',
			outcome: 'Strong Outcome',
			decision: 'Strong Reasoning',
			desc: 'Sound decision process combined with strong artifact quality. Reliable, reproducible authorship.',
			border: 'border-emerald-500/40',
			bg: 'bg-emerald-950/20',
			text: 'text-emerald-400'
		},
		{
			id: 'failure',
			name: 'Failure',
			outcome: 'Weak Outcome',
			decision: 'Weak Reasoning',
			desc: 'Neither process nor outcome succeeds. The clearest signal to inspect problem-finding or specification.',
			border: 'border-red-500/40',
			bg: 'bg-red-950/20',
			text: 'text-red-400'
		},
		{
			id: 'lucky-unstable',
			name: 'Lucky / Unstable Success',
			outcome: 'Strong Outcome',
			decision: 'Weak Reasoning',
			desc: 'Artifact succeeds but cannot be reliably reproduced. Beware borrowed competence or model defaults.',
			border: 'border-amber-500/40',
			bg: 'bg-amber-950/20',
			text: 'text-amber-400'
		}
	];

	const crossExamActions: LlmAction[] = [
		{
			label: 'Adopt Recommended Scores',
			primary: true,
			onClick: (result) => {
				if (result.twoAxisCrossExam) {
					outcomeScore = result.twoAxisCrossExam.recommendedOutcomeScore;
					decisionScore = result.twoAxisCrossExam.recommendedDecisionScore;
				}
			}
		},
		{
			label: 'Save Cross-Examination to Decision Log',
			variant: 'secondary',
			onClick: (result) => {
				if (result.twoAxisCrossExam) {
					practiceStore.saveDecision({
						project: 'Two-Axis Assessment Matrix',
						decision: `Two-Axis Calibrated: ${result.twoAxisCrossExam.diagnosedQuadrant.toUpperCase()} (${result.twoAxisCrossExam.recommendedOutcomeScore}/4 Outcome, ${result.twoAxisCrossExam.recommendedDecisionScore}/4 Decision)`,
						highestUnresolvedLevel: 'Level 3 (Structure)',
						alternativesRejected: `Unexamined self-grading (${result.twoAxisCrossExam.congruenceVerdict})`,
						justification: `${result.twoAxisCrossExam.socraticChallenge} Prescription: ${result.twoAxisCrossExam.directorialPrescription}`,
						feedbackIncorporated: 'Two-Axis Socratic Cross-Examination',
						refusals: 'None'
					});
					savedNotice = true;
					setTimeout(() => (savedNotice = false), 3000);
				}
			}
		}
	];
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<div>
		<h2 class="text-base font-bold text-white">Outcome Quality vs. Decision Quality (Two-Axis Matrix)</h2>
		<p class="text-xs text-neutral-400 mt-1">
			Prevents Rationalisation (excusing weak work) and Anti-Intellectualism (unstable lucky hits).
		</p>
	</div>

	<!-- Interactive sliders -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
		<div>
			<div class="flex items-center justify-between text-neutral-300 mb-1">
				<span>Outcome Quality (Artifact Fitness):</span>
				<span class="font-mono font-bold {outcomeScore >= 3 ? 'text-emerald-400' : 'text-neutral-400'}">
					{outcomeScore} / 4 ({outcomeScore >= 3 ? 'Strong' : 'Weak'})
				</span>
			</div>
			<input type="range" min="1" max="4" step="1" bind:value={outcomeScore} class="w-full accent-amber-500" />
		</div>
		<div>
			<div class="flex items-center justify-between text-neutral-300 mb-1">
				<span>Decision Quality (Reasoning Loop):</span>
				<span class="font-mono font-bold {decisionScore >= 3 ? 'text-emerald-400' : 'text-neutral-400'}">
					{decisionScore} / 4 ({decisionScore >= 3 ? 'Strong' : 'Weak'})
				</span>
			</div>
			<input type="range" min="1" max="4" step="1" bind:value={decisionScore} class="w-full accent-amber-500" />
		</div>
	</div>

	<!-- 2x2 Matrix Display -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
		{#each quadrants as q}
			<div class="p-4 rounded-xl border transition {q.border} {q.bg} {currentQuadrant === q.id ? 'ring-2 ring-amber-500 shadow-lg' : 'opacity-70'}">
				<div class="flex items-center justify-between">
					<span class="font-bold {q.text}">{q.name}</span>
					{#if currentQuadrant === q.id}
						<span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold">
							Classified
						</span>
					{/if}
				</div>
				<div class="text-[10px] text-neutral-400 font-mono mt-1">
					{q.decision} • {q.outcome}
				</div>
				<p class="text-[11px] text-neutral-300 mt-2 leading-relaxed">
					{q.desc}
				</p>
			</div>
		{/each}
	</div>

	<!-- Socratic Epistemic Cross-Examiner Section -->
	<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4 text-xs">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div>
				<div class="flex items-center gap-2">
					<Sparkles class="w-4 h-4 text-amber-400" />
					<span class="font-bold text-white uppercase tracking-wider text-[11px]">Socratic Epistemic Cross-Examiner</span>
				</div>
				<p class="text-[11px] text-neutral-400 mt-0.5">
					Cross-examine your self-grading to eliminate rationalisation and lucky hit complacency.
				</p>
			</div>
			<LlmTriggerButton
				label="Cross-Examine Position"
				onclick={runCrossExam}
				loading={isCheckingCrossExam}
				title="Cross-examine self-assessed Outcome and Decision scores on the Two-Axis Matrix"
			/>
		</div>

		<div>
			<label for="two-axis-notes" class="block text-[11px] font-medium text-neutral-300 mb-1">
				Self-Appraisal Reasoning & Evidence Notes:
			</label>
			<textarea
				id="two-axis-notes"
				rows="2"
				bind:value={reflectionNotes}
				placeholder="Why did you select these scores? What physical proof demonstrates your decision quality?..."
				class="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 font-sans"
			></textarea>
		</div>

		{#if savedNotice}
			<div class="p-2.5 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2 font-mono">
				<Check class="w-4 h-4 text-emerald-400" />
				<span>Cross-examination insight recorded into Studio Decision Log!</span>
			</div>
		{/if}

		{#if critique?.twoAxisCrossExam}
			{@const exam = critique.twoAxisCrossExam}
			<div class="p-3.5 rounded-lg bg-neutral-900 border border-blue-500/30 space-y-3">
				<div class="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
					<div class="flex items-center gap-2">
						<span
							class="text-xs font-mono font-bold px-2 py-0.5 rounded border {exam.congruenceVerdict === 'HONEST_CONGRUENT'
								? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
								: exam.congruenceVerdict === 'SUSPECTED_RATIONALISATION'
									? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
									: exam.congruenceVerdict === 'SUSPECTED_LUCKY_HIT'
										? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
										: 'bg-blue-500/10 text-blue-400 border-blue-500/30'}"
						>
							{exam.congruenceVerdict}
						</span>
						<span class="text-neutral-400 font-mono text-[11px]">
							Diagnosed: <strong class="capitalize text-white">{exam.diagnosedQuadrant.replace('-', ' ')}</strong>
						</span>
					</div>

					<div class="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
						Recommended: <span class="text-amber-400 font-bold">{exam.recommendedOutcomeScore}/4</span> Outcome • <span class="text-amber-400 font-bold">{exam.recommendedDecisionScore}/4</span> Decision
					</div>
				</div>

				<div class="p-2.5 rounded bg-blue-950/20 border border-blue-900/40 text-neutral-200 font-serif italic text-xs leading-relaxed">
					"{exam.socraticChallenge}"
				</div>

				<div class="text-[11px] text-neutral-300">
					<strong class="text-neutral-500 uppercase tracking-wider text-[10px]">Prescription:</strong> {exam.directorialPrescription}
				</div>
			</div>
		{/if}

		{#if critique}
			<LlmCritiqueCard
				result={critique}
				onDismiss={() => (critique = null)}
				actions={crossExamActions}
			/>
		{/if}
	</div>
</div>
