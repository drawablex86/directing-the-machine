<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { Award, Compass, Eye, Sliders, CheckCircle2, ArrowRight, Target, Trash2 } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import LabFrictionPrimer from '$lib/components/course/LabFrictionPrimer.svelte';
	import ReadingModal from '$lib/components/shell/ReadingModal.svelte';
	import type { CoreReading } from '$lib/data/core-readings';
	import { getDrillById } from '$lib/data/drills';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';

	let activeReadingForModal = $state<CoreReading | null>(null);

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

	// LLM State: Position Gap Mirror
	let gapCritique = $state<CritiqueResult | null>(null);
	let isCheckingGap = $state(false);
	let gapError = $state<string | null>(null);

	async function runGapMirror() {
		if (!writtenPosition.trim() || !inferredPosition.trim()) return;
		isCheckingGap = true;
		gapError = null;
		try {
			const result = await executePrompt('m7-position-gap-mirror', {
				writtenPosition: writtenPosition.trim(),
				inferredPosition: inferredPosition.trim()
			});
			gapCritique = result;
		} catch (err: any) {
			gapError = err?.message || 'Failed to analyze position gap.';
		} finally {
			isCheckingGap = false;
		}
	}

	let gapActions = $derived.by<LlmAction[]>(() => {
		if (!gapCritique?.positionGap) return [];
		const pg = gapCritique.positionGap;
		const actions: LlmAction[] = [];

		if (pg.emergentAuthenticPosition) {
			actions.push({
				label: 'Adopt Emergent Authentic Position',
				primary: true,
				variant: 'primary',
				onClick: () => {
					writtenPosition = pg.emergentAuthenticPosition!;
				}
			});
		} else if (pg.recommendedStatement) {
			actions.push({
				label: 'Adopt Recommended Statement',
				primary: true,
				variant: 'primary',
				onClick: () => {
					writtenPosition = pg.recommendedStatement!;
				}
			});
		}

		actions.push({
			label: 'Commit Gap Diagnosis to Decision Log',
			variant: 'secondary',
			onClick: () => {
				commitGapDecision();
			}
		});

		return actions;
	});

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

	// LLM State: Cross-Medium Synthesis Removal Test
	let removalCritique = $state<CritiqueResult | null>(null);
	let isCheckingRemoval = $state(false);
	let removalError = $state<string | null>(null);

	async function runRemovalAudit() {
		if (!visualRole.trim() || !textRole.trim() || !thirdThing.trim()) return;
		isCheckingRemoval = true;
		removalError = null;
		try {
			const result = await executePrompt('m7-removal-test', {
				visualRole: visualRole.trim(),
				textRole: textRole.trim(),
				thirdThing: thirdThing.trim(),
				removeVisualImpact: removeVisualResult.trim(),
				removeTextImpact: removeTextResult.trim()
			});
			removalCritique = result;
		} catch (err: any) {
			removalError = err?.message || 'Failed to run removal test.';
		} finally {
			isCheckingRemoval = false;
		}
	}

	let removalActions = $derived.by<LlmAction[]>(() => {
		if (!removalCritique?.removalTest) return [];
		const rt = removalCritique.removalTest;
		const actions: LlmAction[] = [];

		if (rt.sharpenedThirdThing && rt.sharpenedThirdThing !== thirdThing) {
			actions.push({
				label: 'Adopt Sharpened Synthesis ("Third Thing")',
				primary: true,
				variant: 'primary',
				onClick: () => {
					thirdThing = rt.sharpenedThirdThing!;
				}
			});
		}

		if (rt.recommendedCounterWeight) {
			actions.push({
				label: 'Append Counter-Weight to Text Role',
				variant: 'secondary',
				onClick: () => {
					textRole = `${textRole.trim()} [Directorial Adjustment: ${rt.recommendedCounterWeight}]`;
				}
			});
		}

		actions.push({
			label: 'Commit Removal Test to Log',
			variant: 'secondary',
			onClick: () => {
				commitSynthesisDecision();
			}
		});

		return actions;
	});

	// 14-Step Blank-Sheet Capstone (Module 16 & Months 8–9)
	let capstoneStep = $state(1);
	let capstoneTitle = $state('The Unassigned Beginning');
	let howIDecidedEssay = $state('');

	// Capstone Step Artifacts / Deliverables for Steps 1–13
	let stepNotes = $state<Record<number, string>>({
		1: 'Encountered an empty municipal rail maintenance yard at dawn with rusted switch tracks and high overhead sodium lights.',
		2: 'Observed cold grease congealed on the manual switch lever for 30 minutes without photographing or framing.',
		3: 'Candidate problems: (1) Administrative speed vs physical safety; (2) Obsolete manual infrastructure maintaining high-speed digital networks; (3) Solitary night maintenance versus commuter anonymity.',
		4: 'Position: Standing from direct physical observation ("From/With"); refused speculative fiction extrapolation.',
		5: 'Selected Problem: The friction between manual industrial maintenance and frictionless commuter digital mobility.',
		6: 'Premise with tension: The safety of modern autonomous high-speed transit depends entirely on unseen physical workers operating obsolete mechanical tools.',
		7: 'Brief: Produce 1 image and 1 paragraph where neither describes the other; failure criteria: zero nostalgic sepia, zero generic cyberpunk neon.',
		8: 'Pipeline: Raw photographic reference -> desaturated value scale -> architectural linework overlay -> stark bureaucratic text typography.',
		9: 'Confidence %: 75% confident that desaturating all neon will prevent nostalgic sci-fi readings.',
		10: 'Draft 1 completed under constraints.',
		11: 'Top-down diagnosis: The value rhythm works, but the text is slightly too descriptive of the switch lever.',
		12: 'Revision 2: Replaced descriptive text with actual timestamped track-switching maintenance log codes.',
		13: 'Live defense: Defended decision to use unedited transit log codes rather than narrative captions.'
	});

	let currentStepWork = $derived(capstoneStep === 14 ? howIDecidedEssay : (stepNotes[capstoneStep] || ''));

	function commitCapstoneProgress() {
		practiceStore.saveDecision({
			project: 'Project 4: Blank-Sheet Capstone (M7)',
			decision: `Capstone Step ${capstoneStep} Lock: ${blankSheetSteps[capstoneStep - 1]}`,
			highestUnresolvedLevel: `Step ${capstoneStep} of 14 Blank-Sheet Milestones`,
			alternativesRejected: 'Relying on pre-configured course prompts or templates',
			justification: capstoneStep === 14 ? (howIDecidedEssay.slice(0, 140) || 'Reconstruction Essay submitted.') : `Artifact: "${(stepNotes[capstoneStep] || '').slice(0, 140)}"`,
			feedbackIncorporated: 'Directorial self-determination',
			refusals: 'Refused prompt-engineer hand-holding'
		});
		capstoneSaved = true;
		setTimeout(() => capstoneSaved = false, 3000);
	}

	// LLM State: Capstone Milestone Mentor
	let capstoneCritique = $state<CritiqueResult | null>(null);
	let isCheckingCapstone = $state(false);
	let capstoneError = $state<string | null>(null);

	async function runCapstoneAudit() {
		const work = currentStepWork.trim();
		if (!work) return;
		isCheckingCapstone = true;
		capstoneError = null;
		try {
			const result = await executePrompt('m7-blank-sheet-milestone', {
				stepNumber: capstoneStep,
				stepTitle: blankSheetSteps[capstoneStep - 1],
				studentWork: work
			});
			capstoneCritique = result;
		} catch (err: any) {
			capstoneError = err?.message || 'Failed to audit milestone independence.';
		} finally {
			isCheckingCapstone = false;
		}
	}

	let capstoneActions = $derived.by<LlmAction[]>(() => {
		if (!capstoneCritique?.capstoneMilestone) return [];
		const cm = capstoneCritique.capstoneMilestone;
		const actions: LlmAction[] = [];

		if (cm.verdict === 'RIGOROUS_PASS' && capstoneStep < 14) {
			actions.push({
				label: 'Commit & Advance to Next Milestone',
				primary: true,
				variant: 'primary',
				onClick: () => {
					commitCapstoneProgress();
					capstoneStep = Math.min(14, capstoneStep + 1);
					capstoneCritique = null;
				}
			});
		} else {
			actions.push({
				label: 'Commit Step to Decision Log',
				variant: 'secondary',
				onClick: () => {
					commitCapstoneProgress();
				}
			});
		}

		return actions;
	});

	// Recent Decisions in M7
	let m7Decisions = $derived(
		practiceStore.decisions.filter(
			(d) =>
				d.project.includes('(M7)') ||
				d.project.includes('Blank-Sheet Capstone') ||
				d.project.includes('Position Gap') ||
				d.project.includes('Cross-Medium Synthesis')
		)
	);

	function deleteDecision(id: string) {
		practiceStore.decisions = practiceStore.decisions.filter((d) => d.id !== id);
		practiceStore.saveToStorage();
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
	<!-- Contextual Material Primer: Ingesting Theory Before Practice -->
	<LabFrictionPrimer
		modalityId="m7"
		primaryReadingCode="The Course Goal"
		failureMode="Depending on assignments, prompts, or external mentors to tell you what to make, or claiming an artistic position that is nowhere visible in your unassisted work."
		directorialDiscipline="Total agency from a blank sheet: originate problems, test for positional congruence between claim and artifact, and take full public responsibility for what you make."
		benchmarkPass="Initiates and delivers work without a prompt; passes the removal test in cross-medium synthesis; demonstrates position congruence."
		benchmarkFail="Freezes when no prompt is given; shows wide gap between claimed values and actual visual/written work."
		onOpenFullReading={(r) => activeReadingForModal = r}
	/>

	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					Capstone Studio
				</span>
				<h2 class="text-base font-bold text-white">Independent Authorship & Blank-Sheet Capstone</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Audit alignment between stated and inferred artistic positions, verify unassisted transfer, and author original capstones.
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
				Position Alignment Audit
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
					<div class="flex items-center gap-2">
						<span class="font-mono text-amber-400 text-xs">Step {capstoneStep} / 14</span>
						<LlmTriggerButton
							label="Audit Milestone Independence"
							onclick={runCapstoneAudit}
							loading={isCheckingCapstone}
							disabled={!currentStepWork.trim()}
							title="Audit whether this milestone was authored with rigorous independence or accepted course defaults"
						/>
					</div>
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
					<div class="space-y-2">
						<label for="step-notes-{capstoneStep}" class="block font-medium text-neutral-300">
							Milestone Artifact / Directorial Notes for Step {capstoneStep}:
						</label>
						<p class="text-[11px] text-neutral-400">
							Document the physical evidence, chosen criteria, or deliberate decision for this milestone. No external templates supplied.
						</p>
						<textarea
							id="step-notes-{capstoneStep}"
							rows="4"
							bind:value={stepNotes[capstoneStep]}
							placeholder="Describe your concrete choices, rejected alternatives, and physical evidence for step {capstoneStep}..."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed font-mono text-xs"
						></textarea>
					</div>
				{/if}

				<!-- Critique Card & Callout -->
				{#if capstoneCritique || isCheckingCapstone || capstoneError}
					<div class="pt-1">
						<LlmCritiqueCard
							result={capstoneCritique}
							loading={isCheckingCapstone}
							error={capstoneError}
							title="Master of the Blank Sheet: Autonomy Audit"
							actions={capstoneActions}
							onDismiss={() => (capstoneCritique = null)}
							onRetry={runCapstoneAudit}
						/>

						{#if capstoneCritique?.capstoneMilestone}
							{@const cm = capstoneCritique.capstoneMilestone}
							<div class="mt-2.5 p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
								<div class="flex items-center justify-between">
									<span class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded {cm.verdict === 'RIGOROUS_PASS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : cm.verdict === 'SCAFFOLDING_RELAPSE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
										Milestone Verdict: {cm.verdict.replace(/_/g, ' ')}
									</span>
								</div>

								{#if cm.directorialAutonomyAudit}
									<div class="text-[11px] text-neutral-300 leading-relaxed">
										<strong class="text-neutral-200 font-mono text-[10px] uppercase">Autonomy Audit:</strong> {cm.directorialAutonomyAudit}
									</div>
								{/if}

								{#if cm.criticalInquiry}
									<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
										<div class="text-[10px] font-mono text-amber-400 uppercase font-bold">Crucial Defense Inquiry:</div>
										<p class="text-neutral-200 italic leading-relaxed">"{cm.criticalInquiry}"</p>
									</div>
								{/if}

								{#if cm.nextDirectorialMove}
									<div class="text-[11px] text-emerald-300/90 font-mono pt-1 border-t border-neutral-800">
										<strong class="text-emerald-400">Next Action:</strong> {cm.nextDirectorialMove}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}

				<div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
					{#if capstoneStep < 14}
						<button
							type="button"
							onclick={() => {
								capstoneStep = Math.min(14, capstoneStep + 1);
								capstoneCritique = null;
							}}
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
					<div class="flex items-center justify-between">
						<label for="pos-inferred" class="block font-medium text-amber-400">Inferred Position from Untitled Works:</label>
						<LlmTriggerButton
							label="Mirror Position Gap"
							onclick={runGapMirror}
							loading={isCheckingGap}
							disabled={!writtenPosition.trim() || !inferredPosition.trim()}
							title="Audit the delta between claimed artist statements and visible artifact commitments"
						/>
					</div>
					<textarea
						id="pos-inferred"
						rows="4"
						bind:value={inferredPosition}
						placeholder="What commitments are actually visible in the physical artifacts?"
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed font-mono text-xs"
					></textarea>
				</div>
			</div>

			<!-- Position Gap Critique Card & Callout -->
			{#if gapCritique || isCheckingGap || gapError}
				<div class="pt-1">
					<LlmCritiqueCard
						result={gapCritique}
						loading={isCheckingGap}
						error={gapError}
						title="Monograph Essayist & Visual Critic: Position Gap Mirror"
						actions={gapActions}
						onDismiss={() => (gapCritique = null)}
						onRetry={runGapMirror}
					/>

					{#if gapCritique?.positionGap}
						{@const pg = gapCritique.positionGap}
						<div class="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
							<div class="flex items-center justify-between">
								<span class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded {pg.alignmentLevel === 'CONGRUENT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : pg.alignmentLevel === 'DIAMETRIC_CONTRADICTION' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
									Alignment: {pg.alignmentLevel.replace(/_/g, ' ')}
								</span>
							</div>

							{#if pg.dissonanceDiagnosis}
								<div class="text-[11px] text-neutral-300 leading-relaxed">
									<strong class="text-neutral-200 font-mono text-[10px] uppercase">Dissonance Diagnosis:</strong> {pg.dissonanceDiagnosis}
								</div>
							{/if}

							{#if pg.borrowedAmbition}
								<div class="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/30 space-y-1">
									<div class="text-[10px] font-mono text-rose-400 uppercase font-bold">Borrowed Ambition Unmasked:</div>
									<p class="text-rose-200 leading-relaxed">{pg.borrowedAmbition}</p>
								</div>
							{/if}

							{#if pg.emergentAuthenticPosition}
								<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
									<div class="text-[10px] font-mono text-emerald-400 uppercase font-bold">Emergent Authentic Position (In Work):</div>
									<p class="text-neutral-200 font-medium leading-relaxed">{pg.emergentAuthenticPosition}</p>
								</div>
							{/if}

							{#if pg.recommendedStatement}
								<div class="text-[11px] text-amber-300/90 font-mono pt-1 border-t border-neutral-800">
									<strong class="text-amber-400">Grounded Statement Proposal:</strong> {pg.recommendedStatement}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

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

			<div class="flex items-center justify-between">
				<div class="text-xs text-neutral-400 font-semibold">Dual-Removal Medium Properties:</div>
				<LlmTriggerButton
					label="Test Multimodal Co-Dependence"
					onclick={runRemovalAudit}
					loading={isCheckingRemoval}
					disabled={!visualRole.trim() || !textRole.trim() || !thirdThing.trim()}
					title="Test whether removing either medium causes the primary tension to collapse"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
				<div>
					<label for="v-role" class="block font-medium text-neutral-300 mb-1">What the Image Does:</label>
					<textarea id="v-role" rows="2" bind:value={visualRole} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-100 font-mono text-xs"></textarea>
				</div>
				<div>
					<label for="t-role" class="block font-medium text-neutral-300 mb-1">What the Text Does:</label>
					<textarea id="t-role" rows="2" bind:value={textRole} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-100 font-mono text-xs"></textarea>
				</div>
				<div>
					<label for="third-role" class="block font-medium text-amber-400 mb-1">The "Third Thing" (Synthesis):</label>
					<textarea id="third-role" rows="2" bind:value={thirdThing} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-100 font-mono text-xs"></textarea>
				</div>
			</div>

			<!-- Removal Critique Card & Callout -->
			{#if removalCritique || isCheckingRemoval || removalError}
				<div class="pt-1">
					<LlmCritiqueCard
						result={removalCritique}
						loading={isCheckingRemoval}
						error={removalError}
						title="Multimodal Dramaturg: Dual-Removal Audit"
						actions={removalActions}
						onDismiss={() => (removalCritique = null)}
						onRetry={runRemovalAudit}
					/>

					{#if removalCritique?.removalTest}
						{@const rt = removalCritique.removalTest}
						<div class="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
							<div class="flex items-center justify-between">
								<span class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded {rt.synthesisVerdict === 'GENUINE_SYNTHESIS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}">
									Verdict: {rt.synthesisVerdict.replace(/_/g, ' ')}
								</span>
							</div>

							{#if rt.coDependenceAnalysis}
								<div class="text-[11px] text-neutral-300 leading-relaxed">
									<strong class="text-neutral-200 font-mono text-[10px] uppercase">Co-Dependence Analysis:</strong> {rt.coDependenceAnalysis}
								</div>
							{/if}

							{#if rt.sharpenedThirdThing}
								<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
									<div class="text-[10px] font-mono text-amber-400 uppercase font-bold">Sharpened Emergent "Third Thing":</div>
									<p class="text-neutral-200 font-medium leading-relaxed">{rt.sharpenedThirdThing}</p>
								</div>
							{/if}

							{#if rt.recommendedCounterWeight}
								<div class="text-[11px] text-emerald-300/90 font-mono pt-1 border-t border-neutral-800">
									<strong class="text-emerald-400">Recommended Counter-Weight:</strong> {rt.recommendedCounterWeight}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

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

	<!-- Recent M7 Agency Decisions History -->
	{#if m7Decisions.length > 0}
		<div class="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Award class="w-4 h-4 text-amber-400" />
					<h3 class="font-bold text-xs text-neutral-200 uppercase tracking-wider font-mono">
						Recent M7 Agency Decisions ({m7Decisions.length})
					</h3>
				</div>
				<span class="text-[11px] text-neutral-500 font-mono">Logged to practiceStore</span>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-xs border-collapse">
					<thead>
						<tr class="border-b border-neutral-800 text-[11px] font-mono text-neutral-400">
							<th class="py-2 px-3 font-semibold">Date</th>
							<th class="py-2 px-3 font-semibold">Project & Scope</th>
							<th class="py-2 px-3 font-semibold">Decision / Resolution</th>
							<th class="py-2 px-3 font-semibold">Refusals</th>
							<th class="py-2 px-3 text-right font-semibold">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-900">
						{#each m7Decisions as d (d.id)}
							<tr class="hover:bg-neutral-900/50 transition">
								<td class="py-2.5 px-3 font-mono text-neutral-400 whitespace-nowrap text-[11px]">{d.date}</td>
								<td class="py-2.5 px-3 font-medium text-neutral-200 whitespace-nowrap text-[11px]">
									<span class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">
										{d.project}
									</span>
								</td>
								<td class="py-2.5 px-3 text-neutral-300 max-w-xs md:max-w-md truncate" title={d.decision}>
									{d.decision}
								</td>
								<td class="py-2.5 px-3 text-rose-300/80 max-w-xs truncate text-[11px]" title={d.refusals}>
									{d.refusals || '—'}
								</td>
								<td class="py-2.5 px-3 text-right whitespace-nowrap">
									<button
										type="button"
										onclick={() => deleteDecision(d.id)}
										class="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 transition cursor-pointer"
										title="Delete entry from log"
									>
										<Trash2 class="w-3.5 h-3.5" />
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Full Text Reading Modal for M7 Ingestion -->
	{#if activeReadingForModal}
		<ReadingModal
			reading={activeReadingForModal}
			isOpen={!!activeReadingForModal}
			onClose={() => activeReadingForModal = null}
			onSelectReading={(r) => activeReadingForModal = r}
		/>
	{/if}
</div>
