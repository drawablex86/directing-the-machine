<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { Award, Compass, Eye, Sliders, CheckCircle2, ArrowRight, Target } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import { getDrillById } from '$lib/data/drills';

	let activeSubTab = $state<'blanksheet' | 'gap' | 'synthesis' | 'drills'>('blanksheet');
	let activeDrillId = $state<'m7-position-gap' | 'm7-removal-test'>('m7-position-gap');
	let activeDrill = $derived(getDrillById(activeDrillId));

	let capstoneSaved = $state(false);
	let gapSaved = $state(false);
	let synthesisSaved = $state(false);

	// Position Gap Analyzer (Module 15)
	let writtenPosition = $state('I make work investigating how technological acceleration isolates the observer.');
	let inferredPosition = $state('');

	function commitGapDecision() {
		if (!inferredPosition.trim()) return;
		practiceStore.saveDecision({
			project: 'Position Gap Analyzer (M7)',
			decision: 'Position Gap Diagnosis: Claimed vs Inferred Standing',
			highestUnresolvedLevel: 'Congruence between Intent and Visible Output',
			alternativesRejected: 'Assuming claimed artist statement matches audience perception',
			justification: `Claimed: "${writtenPosition.trim()}" | Inferred: "${inferredPosition.trim()}"`,
			feedbackIncorporated: 'Blind peer or mirror observation audit',
			refusals: 'Refused borrowed ambition and stylistic posturing'
		});
		gapSaved = true;
		setTimeout(() => gapSaved = false, 3000);
	}

	// Cross-Medium Synthesis Removal Test (Module 17)
	let visualRole = $state('Establishes oppressive spatial confinement through extreme top-heavy shadow.');
	let textRole = $state('Provides terse, neutral bureaucratic report of transit delays.');
	let thirdThing = $state('The tension between spatial dread and administrative banality.');
	let removeVisualResult = $state('Argument collapses into mundane transit schedule commentary.');
	let removeTextResult = $state('Argument collapses into generic noir horror trope.');

	function commitSynthesisDecision() {
		if (!thirdThing.trim()) return;
		practiceStore.saveDecision({
			project: 'Cross-Medium Synthesis (M7)',
			decision: `Cross-Medium Synthesis: ${thirdThing.trim()}`,
			highestUnresolvedLevel: 'Non-Redundant Medium Co-Dependence',
			alternativesRejected: 'Using text to merely illustrate image, or image to ornament text',
			justification: `Visual: "${visualRole.trim()}" | Text: "${textRole.trim()}" | Removal Impact: [Without Visual: ${removeVisualResult.trim()}] [Without Text: ${removeTextResult.trim()}]`,
			feedbackIncorporated: 'Dual-removal test validation',
			refusals: 'Refused decorative redundancy'
		});
		synthesisSaved = true;
		setTimeout(() => synthesisSaved = false, 3000);
	}

	// 14-Step Blank-Sheet Capstone (Module 16 & Months 8–9)
	let capstoneStep = $state(1);
	let capstoneTitle = $state('The Unassigned Beginning');
	let howIDecidedEssay = $state('');

	function commitCapstoneProgress() {
		practiceStore.saveDecision({
			project: 'Project 4: Blank-Sheet Capstone (M7)',
			decision: `Capstone Step ${capstoneStep} Lock: ${blankSheetSteps[capstoneStep - 1]}`,
			highestUnresolvedLevel: `Step ${capstoneStep} of 14 Blank-Sheet Milestones`,
			alternativesRejected: 'Relying on pre-configured course prompts or templates',
			justification: capstoneStep === 14 ? (howIDecidedEssay.slice(0, 140) || 'Reconstruction Essay submitted.') : `Completed step ${capstoneStep} of 14-step unassisted blank-sheet workflow.`,
			feedbackIncorporated: 'Directorial self-determination',
			refusals: 'Refused prompt-engineer hand-holding'
		});
		capstoneSaved = true;
		setTimeout(() => capstoneSaved = false, 3000);
	}

	const blankSheetSteps = [
		'1. Encounter unassigned situation',
		'2. 30m non-instrumental observation',
		'3. Locate 3 candidate problems',
		'4. Positionality check & standing',
		'5. Select 1 problem & justify',
		'6. Generate 3 premises with tension',
		'7. Write self-authored brief (no template)',
		'8. Build & map causal pipeline',
		'9. Lock pre-run prediction with conf %',
		'10. Generate initial drafts',
		'11. Top-down diagnosis against brief',
		'12. Max 3 revisions or re-brief fork',
		'13. Deliver & live defense on camera',
		'14. Write "How I Decided What to Make"'
	];
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M7
				</span>
				<h2 class="text-base font-bold text-white">Position Gap, Synthesis & Blank-Sheet Capstone</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 15, 16, 17, 18, V6, W6: Position Gap Analyzer, Cross-Medium Removal Test, and 14-Step Blank Sheet.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeSubTab = 'blanksheet'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'blanksheet' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Blank-Sheet Capstone
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'gap'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'gap' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Position Gap
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'synthesis'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'synthesis' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Synthesis Removal
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'drills'}
				class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 {activeSubTab === 'drills' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				<Target class="w-3.5 h-3.5" />
				<span>Drills</span>
			</button>
		</div>
	</div>

	<!-- TAB 1: 14-Step Blank-Sheet Capstone -->
	{#if activeSubTab === 'blanksheet'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The Blank-Sheet Capstone (Layer 3: Agency):</strong>
				Zero scaffolding. Nobody gave you a brief, a theme, a deadline, or an exercise.
				Can you encounter an ambiguous situation, determine what matters, formulate a position, build a process, judge the results, and defend the work?
			</div>

			<!-- 14 Steps Progress Grid -->
			<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-[10px]">
				{#each blankSheetSteps as stp, idx}
					<button
						type="button"
						onclick={() => capstoneStep = idx + 1}
						class="p-2 rounded-lg border text-left transition {capstoneStep === idx + 1 ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow' : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'}"
					>
						{stp}
					</button>
				{/each}
			</div>

			<!-- Active step workspace -->
			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
				<div class="flex items-center justify-between">
					<span class="font-bold text-neutral-200">{blankSheetSteps[capstoneStep - 1]}</span>
					<span class="font-mono text-amber-400 text-xs">Step {capstoneStep} / 14</span>
				</div>

				{#if capstoneStep === 14}
					<div class="space-y-2">
						<label for="how-decided" class="block font-medium text-amber-400">
							Final Deliverable: "How I Decided What to Make" Reconstruction Essay
						</label>
						<p class="text-[11px] text-neutral-400">
							Reconstruct the project from observation to delivery. Prove that you authored the problem itself, not only the solution.
						</p>
						<textarea
							id="how-decided"
							rows="6"
							bind:value={howIDecidedEssay}
							placeholder="I did not begin with a problem. I began with a situation: ..."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed font-serif"
						></textarea>
					</div>
				{:else}
					<p class="text-neutral-400 leading-relaxed">
						Execute step {capstoneStep} independently using your internalized methods. No external templates or ladders supplied.
					</p>
				{/if}

				<div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
					{#if capstoneStep < 14}
						<button
							type="button"
							onclick={() => capstoneStep = Math.min(14, capstoneStep + 1)}
							class="w-full sm:w-auto px-4 py-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
						>
							<span>Proceed to Next Step</span>
							<ArrowRight class="w-3.5 h-3.5" />
						</button>
					{:else}
						<div></div>
					{/if}

					<div class="flex items-center gap-3">
						{#if capstoneSaved}
							<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
								<CheckCircle2 class="w-4 h-4" />
								Step progress committed to Decision Log!
							</span>
						{/if}
						<button
							type="button"
							onclick={commitCapstoneProgress}
							class="w-full sm:w-auto px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center justify-center gap-2 cursor-pointer"
						>
							<CheckCircle2 class="w-3.5 h-3.5" />
							<span>Commit Step Progress to Log</span>
						</button>
					</div>
				</div>
			</div>
		</div>

	<!-- TAB 2: Position Gap Analyzer (Module 15) -->
	{:else if activeSubTab === 'gap'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The Position Gap Analyzer (Module 15):</strong>
				Authorship is a pattern of repeated commitments visible in the work, not an artist statement you write.
				Compare your <strong>Written Position</strong> against the <strong>Inferred Position</strong> that a peer (or you, blind) detects from 10 untitled works.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
				<div class="space-y-2">
					<label for="pos-written" class="block font-medium text-neutral-300">Written / Claimed Position:</label>
					<textarea
						id="pos-written"
						rows="4"
						bind:value={writtenPosition}
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed"
					></textarea>
				</div>
				<div class="space-y-2">
					<label for="pos-inferred" class="block font-medium text-amber-400">Inferred Position from Untitled Works:</label>
					<textarea
						id="pos-inferred"
						rows="4"
						bind:value={inferredPosition}
						placeholder="What commitments are actually visible in the physical artifacts?"
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed"
					></textarea>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400">
				<div>
					<strong>The Gap is Diagnostic:</strong> If the written position claims a focus on human vulnerability, but the inferred position sees slick futuristic geometry, the gap reveals borrowed ambition or execution drift.
				</div>
				<div class="flex items-center gap-3 shrink-0">
					{#if gapSaved}
						<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
							<CheckCircle2 class="w-4 h-4" />
							Committed!
						</span>
					{/if}
					<button
						type="button"
						onclick={commitGapDecision}
						class="px-3.5 py-1.5 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
					>
						<CheckCircle2 class="w-3.5 h-3.5" />
						<span>Commit Gap Analysis</span>
					</button>
				</div>
			</div>
		</div>

	<!-- TAB 3: Cross-Medium Synthesis Removal Test (Module 17) -->
	{:else if activeSubTab === 'synthesis'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Cross-Medium Synthesis Removal Test (Module 17):</strong>
				Synthesizing visual and text into one authored object requires that neither is merely an illustration of the other.
				Define the "Third Thing" neither can do alone. Then test: <em>Does removing either medium collapse the argument?</em>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
				<div>
					<label for="v-role" class="block font-medium text-neutral-300 mb-1">What the Image Does:</label>
					<textarea id="v-role" rows="2" bind:value={visualRole} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-100"></textarea>
				</div>
				<div>
					<label for="t-role" class="block font-medium text-neutral-300 mb-1">What the Text Does:</label>
					<textarea id="t-role" rows="2" bind:value={textRole} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-100"></textarea>
				</div>
				<div>
					<label for="third-role" class="block font-medium text-amber-400 mb-1">The "Third Thing" (Synthesis):</label>
					<textarea id="third-role" rows="2" bind:value={thirdThing} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-100"></textarea>
				</div>
			</div>

			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
				<div class="font-bold text-neutral-200">The Removal Test:</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300">
					<div class="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
						<span class="font-semibold text-rose-400">If Image is Removed:</span>
						<p class="text-[11px] text-neutral-400">{removeVisualResult}</p>
					</div>
					<div class="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
						<span class="font-semibold text-rose-400">If Text is Removed:</span>
						<p class="text-[11px] text-neutral-400">{removeTextResult}</p>
					</div>
				</div>

				<div class="flex items-center justify-between pt-2">
					{#if synthesisSaved}
						<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
							<CheckCircle2 class="w-4 h-4" />
							Removal test committed to Decision Log!
						</span>
					{:else}
						<span></span>
					{/if}
					<button
						type="button"
						onclick={commitSynthesisDecision}
						class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-2 cursor-pointer"
					>
						<CheckCircle2 class="w-3.5 h-3.5" />
						<span>Commit Removal Test to Log</span>
					</button>
				</div>
			</div>
		</div>

	<!-- TAB 4: Deliberate Practice Drill Reps -->
	{:else if activeSubTab === 'drills'}
		<div class="space-y-4">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
				<div>
					<strong class="text-neutral-200">Module 7 Deliberate Practice Drills:</strong> Position gap diagnosis and cross-medium synthesis removal tests.
				</div>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => activeDrillId = 'm7-position-gap'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm7-position-gap' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Position Gap (15m)
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'm7-removal-test'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm7-removal-test' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Synthesis Removal (10m)
					</button>
				</div>
			</div>

			{#if activeDrill}
				<DrillRunner
					drill={activeDrill}
					onComplete={() => {}}
				/>
			{/if}
		</div>
	{/if}
</div>
