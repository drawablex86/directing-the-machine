<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import {
		Users,
		Ban,
		GitFork,
		MessageSquare,
		Volume2,
		VolumeX,
		ShieldCheck,
		CheckCircle2,
		Target,
		Sparkles,
		History,
		AlertTriangle,
		ArrowRight,
		Trash2,
		ShieldAlert
	} from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import { getDrillById } from '$lib/data/drills';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let activeSubTab = $state<'scope' | 'triage' | 'refusal' | 'transmission' | 'drills'>('scope');
	let activeDrillId = $state<'m6-refusal-pressure' | 'm6-feedback-translation'>('m6-refusal-pressure');
	let activeDrill = $derived(getDrillById(activeDrillId));

	let revisionSaved = $state(false);
	let triageSaved = $state(false);
	let refusalSaved = $state(false);

	// Scope & Revision Fork (Module 12/13)
	let currentCycle = $state(1); // max 3 named revision cycles
	let revisionFocus = $state('Cycle 1: Resolve high-contrast focal entry');
	let persistentObstacle = $state('');
	let shouldRebrief = $state(false);

	// LLM State: Scope / Re-Brief Arbiter
	let rebriefCritique = $state<CritiqueResult | null>(null);
	let isCheckingRebrief = $state(false);
	let rebriefError = $state<string | null>(null);

	async function runRebriefArbitration() {
		isCheckingRebrief = true;
		rebriefError = null;
		try {
			const result = await executePrompt('m6-rebrief-arbiter', {
				cycle: currentCycle,
				revisionFocus,
				currentObstacle: persistentObstacle.trim() || 'Persistent misalignment across iterations.'
			});
			rebriefCritique = result;
		} catch (err: any) {
			rebriefError = err?.message || 'Failed to arbitrate revision vs. re-brief.';
		} finally {
			isCheckingRebrief = false;
		}
	}

	let rebriefActions = $derived.by<LlmAction[]>(() => {
		if (!rebriefCritique?.rebriefArbitration) return [];
		const arb = rebriefCritique.rebriefArbitration;
		const actions: LlmAction[] = [];

		if (arb.ruling === 'RE_BRIEF') {
			actions.push({
				label: 'Adopt Re-Brief Ruling (Reset Brief)',
				primary: true,
				variant: 'danger',
				onClick: () => {
					shouldRebrief = true;
				}
			});
		} else {
			actions.push({
				label: 'Continue on Revision Cycle',
				primary: true,
				variant: 'primary',
				onClick: () => {
					shouldRebrief = false;
				}
			});
		}

		if (arb.nextDirectorialAction) {
			actions.push({
				label: 'Adopt Next Directorial Action',
				variant: 'secondary',
				onClick: () => {
					if (arb.nextDirectorialAction) {
						revisionFocus = arb.nextDirectorialAction;
					}
				}
			});
		}

		return actions;
	});

	function commitRevisionDecision() {
		practiceStore.saveDecision({
			project: 'Production Direction & Revision Fork (M6)',
			decision: shouldRebrief
				? `Re-Brief Fork Initiated (After Cycle ${currentCycle})`
				: `Named Revision Cycle ${currentCycle} Lock: ${revisionFocus}`,
			highestUnresolvedLevel: shouldRebrief ? 'Premise & Core Framing' : 'Cycle 1-3 Structural Refinement',
			alternativesRejected: shouldRebrief ? 'Endless cosmetic patching' : 'Premature re-briefing',
			justification: shouldRebrief
				? `Core premise flawed or 3-cycle limit reached. Obstacle: ${persistentObstacle.trim() || 'Fundamental contradiction'}`
				: `Targeted structural revision within current brief parameters. Obstacle: ${persistentObstacle.trim() || 'Focal tuning'}`,
			feedbackIncorporated: `Cycle ${currentCycle}/3 tracked`,
			refusals: shouldRebrief ? 'Refused fourth cosmetic revision' : 'Refused out-of-scope adjustments'
		});
		revisionSaved = true;
		setTimeout(() => (revisionSaved = false), 3000);
	}

	// Stakeholder Critique Translator (Module 12)
	let rawFeedback = $state('Make the logo and the person bigger and more inspiring.');
	let diagnosedUnderlyingNeed = $state('Stakeholder fears lack of emotional presence and brand illegibility.');
	let selectedAction = $state<'apply' | 'adapt' | 'alternative' | 'pushback' | 'rebrief'>('alternative');

	// LLM State: Stakeholder Simulation
	let simCritique = $state<CritiqueResult | null>(null);
	let isGeneratingSim = $state(false);
	let simError = $state<string | null>(null);

	// LLM State: Triage Auditor
	let triageCritique = $state<CritiqueResult | null>(null);
	let isAuditingTriage = $state(false);
	let triageError = $state<string | null>(null);

	async function runStakeholderSimulation() {
		isGeneratingSim = true;
		simError = null;
		try {
			const result = await executePrompt('m6-stakeholder-simulator', {
				projectContext: `Project at cycle ${currentCycle}: "${revisionFocus}". Current stakeholder stage.`,
				generateScenario: true
			});
			simCritique = result;
		} catch (err: any) {
			simError = err?.message || 'Failed to simulate stakeholder critique.';
		} finally {
			isGeneratingSim = false;
		}
	}

	let simActions = $derived.by<LlmAction[]>(() => {
		if (!simCritique?.simulatedStakeholder) return [];
		const sim = simCritique.simulatedStakeholder;
		return [
			{
				label: 'Load Simulated Demand into Triage Form',
				primary: true,
				variant: 'primary',
				onClick: () => {
					rawFeedback = sim.rawFeedback;
					if (sim.hiddenCommercialAnxiety) {
						diagnosedUnderlyingNeed = sim.hiddenCommercialAnxiety;
					}
				}
			}
		];
	});

	async function runTriageAudit() {
		if (!rawFeedback.trim()) return;
		isAuditingTriage = true;
		triageError = null;
		try {
			const result = await executePrompt('m6-stakeholder-simulator', {
				projectContext: `Production Brief at cycle ${currentCycle}`,
				rawFeedback: rawFeedback.trim(),
				userAction: selectedAction,
				diagnosedNeed: diagnosedUnderlyingNeed.trim()
			});
			triageCritique = result;
		} catch (err: any) {
			triageError = err?.message || 'Failed to audit feedback triage.';
		} finally {
			isAuditingTriage = false;
		}
	}

	let triageActions = $derived.by<LlmAction[]>(() => {
		if (!triageCritique?.triageEvaluation) return [];
		const evalData = triageCritique.triageEvaluation;
		const actions: LlmAction[] = [];

		if (evalData.recommendedAction && evalData.recommendedAction !== selectedAction) {
			actions.push({
				label: `Adopt Recommended Action [${evalData.recommendedAction.toUpperCase()}]`,
				primary: true,
				variant: 'primary',
				onClick: () => {
					selectedAction = evalData.recommendedAction;
				}
			});
		}

		if (evalData.hardenedUnderlyingNeed) {
			actions.push({
				label: 'Adopt Hardened Root Need',
				variant: 'secondary',
				onClick: () => {
					if (evalData.hardenedUnderlyingNeed) {
						diagnosedUnderlyingNeed = evalData.hardenedUnderlyingNeed;
					}
				}
			});
		}

		return actions;
	});

	function commitTriageDecision() {
		if (!rawFeedback.trim()) return;
		practiceStore.saveDecision({
			project: 'Stakeholder Feedback Triage (M6)',
			decision: `Action [${selectedAction.toUpperCase()}] on Feedback: "${rawFeedback.trim()}"`,
			highestUnresolvedLevel: 'Directorial Translation of Stakeholder Intent',
			alternativesRejected: 'Literal compliance without diagnosis',
			justification: `Diagnosed Root Need: ${diagnosedUnderlyingNeed.trim()}`,
			feedbackIncorporated: rawFeedback.trim(),
			refusals: selectedAction === 'pushback' ? 'Pushed back against non-convergent surface demand' : 'None'
		});
		triageSaved = true;
		setTimeout(() => (triageSaved = false), 3000);
	}

	// 5-Mode Refusal Composer (Appendix F)
	let refusalMode = $state<'Ethical' | 'Positional' | 'Technical' | 'Intentional' | 'Slop'>('Ethical');
	let refusalTarget = $state('');
	let refusalRationale = $state('');

	// LLM State: Refusal Soundness Auditor
	let refusalCritique = $state<CritiqueResult | null>(null);
	let isAuditingRefusal = $state(false);
	let refusalError = $state<string | null>(null);

	async function runRefusalAudit() {
		if (!refusalTarget.trim() && !refusalRationale.trim()) return;
		isAuditingRefusal = true;
		refusalError = null;
		try {
			const result = await executePrompt('m6-refusal-soundness', {
				mode: refusalMode,
				target: refusalTarget.trim() || 'Unspecified client demand',
				rationale: refusalRationale.trim() || 'No written rationale provided.'
			});
			refusalCritique = result;
		} catch (err: any) {
			refusalError = err?.message || 'Failed to audit refusal letter soundness.';
		} finally {
			isAuditingRefusal = false;
		}
	}

	let refusalActions = $derived.by<LlmAction[]>(() => {
		if (!refusalCritique?.refusalAudit) return [];
		const audit = refusalCritique.refusalAudit;
		const actions: LlmAction[] = [];

		if (audit.sharpenedRationale) {
			actions.push({
				label: 'Adopt Sharpened Refusal Letter',
				primary: true,
				variant: 'primary',
				onClick: () => {
					if (audit.sharpenedRationale) {
						refusalRationale = audit.sharpenedRationale;
					}
				}
			});
		}

		if (audit.recommendedMode && audit.recommendedMode !== refusalMode) {
			actions.push({
				label: `Switch to Recommended Mode [${audit.recommendedMode}]`,
				variant: 'secondary',
				onClick: () => {
					if (audit.recommendedMode) {
						refusalMode = audit.recommendedMode as any;
					}
				}
			});
		}

		return actions;
	});

	function commitRefusalDecision() {
		if (!refusalTarget.trim()) return;
		practiceStore.saveDecision({
			project: '5-Mode Refusal System (M6)',
			decision: `${refusalMode} Refusal: ${refusalTarget.trim()}`,
			highestUnresolvedLevel: 'Professional Authorship Boundaries',
			alternativesRejected: 'Passive acquiescence or silent resentment',
			justification: refusalRationale.trim() || 'Directorial integrity commitment',
			feedbackIncorporated: 'Boundary defense',
			refusals: refusalTarget.trim()
		});
		refusalSaved = true;
		setTimeout(() => (refusalSaved = false), 3000);
	}

	// Decision History Filters
	let revisionDecisions = $derived(
		practiceStore.decisions.filter(
			(d) => d.project.includes('Revision Fork') || d.project.includes('Production Direction')
		)
	);
	let triageDecisions = $derived(
		practiceStore.decisions.filter(
			(d) => d.project.includes('Feedback Triage') || d.project.includes('Stakeholder')
		)
	);
	let refusalDecisions = $derived(
		practiceStore.decisions.filter(
			(d) => d.project.includes('Refusal') || d.project.includes('5-Mode')
		)
	);

	function deleteDecision(id: string) {
		practiceStore.decisions = practiceStore.decisions.filter((d) => d.id !== id);
		practiceStore.saveToStorage();
	}

	// Transmission & Silence Tolerance (Module 19)
	let silenceTimerSeconds = $state(10);
	let silenceRunning = $state(false);
	let silenceInterval: any = null;

	function toggleSilenceTimer() {
		if (silenceRunning) {
			clearInterval(silenceInterval);
			silenceRunning = false;
		} else {
			silenceTimerSeconds = 10;
			silenceRunning = true;
			silenceInterval = setInterval(() => {
				if (silenceTimerSeconds > 0) silenceTimerSeconds -= 1;
				else {
					clearInterval(silenceInterval);
					silenceRunning = false;
				}
			}, 1000);
		}
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M6
				</span>
				<h2 class="text-base font-bold text-white">Production Direction, Collaboration & Refusal Studio</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 12, 13, 14, 19, Appendix F: Revision vs Re-Brief Fork, Refusal Composer, and Mentorship.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => (activeSubTab = 'scope')}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'scope'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				Revision Fork
			</button>
			<button
				type="button"
				onclick={() => (activeSubTab = 'triage')}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'triage'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				Feedback Triage
			</button>
			<button
				type="button"
				onclick={() => (activeSubTab = 'refusal')}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'refusal'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				5-Mode Refusal
			</button>
			<button
				type="button"
				onclick={() => (activeSubTab = 'transmission')}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'transmission'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				Transmission (M19)
			</button>
			<button
				type="button"
				onclick={() => (activeSubTab = 'drills')}
				class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 {activeSubTab === 'drills'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				<Target class="w-3.5 h-3.5" />
				<span>Drills</span>
			</button>
		</div>
	</div>

	<!-- TAB 1: Revision vs. Re-Brief Fork -->
	{#if activeSubTab === 'scope'}
		<div class="space-y-5">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Revision Discipline & Re-Brief Fork (Module 12):</strong>
				A project is allowed maximum <strong>3 named revision cycles</strong>. Each cycle has a specific structural target.
				If the work still fails after 3 cycles, you are solving the wrong problem: execute a formal <strong>Re-Brief</strong>.
			</div>

			<!-- Cycle Selector Cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
				{#each [1, 2, 3] as cycleNum}
					<button
						type="button"
						onclick={() => (currentCycle = cycleNum)}
						class="p-3.5 rounded-xl text-left border transition cursor-pointer {currentCycle === cycleNum
							? 'bg-neutral-950 border-amber-500 shadow-sm'
							: 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'}"
					>
						<div class="flex items-center justify-between">
							<span class="font-bold {currentCycle === cycleNum ? 'text-amber-400' : 'text-neutral-200'}">
								Cycle {cycleNum} of 3
							</span>
							{#if currentCycle === cycleNum}
								<span class="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">Active</span>
							{/if}
						</div>
						<p class="text-[11px] text-neutral-400 mt-1">
							{cycleNum === 1
								? 'Structural focal fix & mass balance'
								: cycleNum === 2
									? 'Value & rhythm tuning'
									: 'Local polish & edge hierarchy'}
						</p>
					</button>
				{/each}
			</div>

			<!-- Revision Focus & Persistent Obstacle -->
			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
				<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
					<span class="font-bold text-neutral-200">Cycle {currentCycle} Revision Focus & Friction</span>
					<LlmTriggerButton
						label="Arbitrate Revision vs. Re-Brief"
						onclick={runRebriefArbitration}
						loading={isCheckingRebrief}
						disabled={!persistentObstacle.trim() && !revisionFocus.trim()}
						title="Arbitrate whether the project needs continued revision or an immediate Re-Brief"
					/>
				</div>

				<div class="space-y-3">
					<div>
						<label for="rev-focus" class="block font-medium text-neutral-300 mb-1">Named Revision Focus:</label>
						<input
							id="rev-focus"
							type="text"
							bind:value={revisionFocus}
							placeholder="e.g. Cycle 1: Resolve high-contrast focal entry"
							class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 font-mono text-xs"
						/>
					</div>
					<div>
						<label for="rev-obstacle" class="block font-medium text-neutral-300 mb-1">
							Persistent Structural Defect or Obstacle (What isn't converging?):
						</label>
						<textarea
							id="rev-obstacle"
							rows="2"
							bind:value={persistentObstacle}
							placeholder="e.g. The background environment completely overwhelms the focal character despite weight prompts. Values remain washed out."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 leading-relaxed font-mono text-xs"
						></textarea>
					</div>
				</div>

				<!-- LLM Critique Card & Action Injection -->
				{#if rebriefCritique || isCheckingRebrief || rebriefError}
					<div class="pt-2">
						<LlmCritiqueCard
							result={rebriefCritique}
							loading={isCheckingRebrief}
							error={rebriefError}
							title="Executive Producer: Revision vs. Re-Brief Arbitration"
							actions={rebriefActions}
							onDismiss={() => (rebriefCritique = null)}
							onRetry={runRebriefArbitration}
						/>

						{#if rebriefCritique?.rebriefArbitration}
							{@const arb = rebriefCritique.rebriefArbitration}
							<div class="mt-2.5 p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-xs">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold {arb.ruling === 'RE_BRIEF'
										? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
										: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}">
										RULING: {arb.ruling}
									</span>
									{#if arb.cycleCeilingStatus}
										<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-medium">
											STATUS: {arb.cycleCeilingStatus}
										</span>
									{/if}
									{#if arb.rootFailureLevel}
										<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
											LEVEL: {arb.rootFailureLevel}
										</span>
									{/if}
								</div>
								{#if arb.rationale}
									<div class="text-neutral-300 leading-relaxed">
										<strong class="text-neutral-100">Executive Rationale:</strong> {arb.rationale}
									</div>
								{/if}
								{#if arb.nextDirectorialAction}
									<div class="text-amber-400 font-mono text-[11px] flex items-start gap-1.5 pt-1 border-t border-neutral-800">
										<ArrowRight class="w-3.5 h-3.5 shrink-0 mt-0.5" />
										<span><strong>Mandated Action:</strong> {arb.nextDirectorialAction}</span>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Re-Brief Trigger & Revision Commit -->
			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
				<div class="space-y-1">
					<div class="font-bold text-neutral-200">Is the core premise flawed?</div>
					<div class="text-neutral-400 text-[11px]">
						If structural problems persist across cycles, do not patch surface rendering. Re-brief.
					</div>
				</div>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => (shouldRebrief = !shouldRebrief)}
						class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer {shouldRebrief
							? 'bg-rose-950 border border-rose-800 text-rose-300'
							: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}"
					>
						{shouldRebrief ? 'Re-Brief Initiated' : 'Trigger Re-Brief'}
					</button>
					<button
						type="button"
						onclick={commitRevisionDecision}
						class="px-3.5 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
					>
						<CheckCircle2 class="w-3.5 h-3.5" />
						<span>Commit Revision Choice</span>
					</button>
				</div>
			</div>

			{#if revisionSaved}
				<div class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
					<CheckCircle2 class="w-4 h-4" />
					Revision choice committed to Decision Log!
				</div>
			{/if}

			<!-- Recent Revision Decisions Table -->
			{#if revisionDecisions.length > 0}
				<div class="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
					<div class="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
						<div class="flex items-center gap-2 font-bold text-neutral-300">
							<History class="w-4 h-4 text-amber-400" />
							<span>Recent Revision & Re-Brief Decisions ({revisionDecisions.length})</span>
						</div>
					</div>

					<div class="space-y-2">
						{#each revisionDecisions.slice(0, 5) as decision (decision.id)}
							<div class="p-3 bg-neutral-900 rounded-xl border border-neutral-800/80 text-xs flex items-start justify-between gap-3">
								<div class="space-y-1">
									<div class="flex items-center gap-2">
										<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
											{decision.date}
										</span>
										<span class="font-bold {decision.decision.includes('Re-Brief') ? 'text-rose-400' : 'text-neutral-200'}">
											{decision.decision}
										</span>
									</div>
									<div class="text-neutral-400 text-[11px] leading-relaxed">
										<strong class="text-neutral-300">Justification:</strong> {decision.justification}
									</div>
									<div class="text-[10px] font-mono text-neutral-500">
										Level: {decision.highestUnresolvedLevel} | Rejected: {decision.alternativesRejected}
									</div>
								</div>
								<button
									type="button"
									onclick={() => deleteDecision(decision.id)}
									class="text-neutral-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
									title="Delete decision entry"
								>
									<Trash2 class="w-3.5 h-3.5" />
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- TAB 2: Stakeholder Critique Triage -->
	{:else if activeSubTab === 'triage'}
		<div class="space-y-5">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Stakeholder Critique Translator (Module 12):</strong>
				Clients and audiences often diagnose symptoms in surface terms (<em>"Make the logo bigger"</em>).
				Translate surface demands into underlying outcomes, then select one of 5 directorial actions:
				<code>Apply | Adapt | Propose Alternative | Push Back | Re-Brief</code>.
			</div>

			<!-- Input & Simulation Controls -->
			<div class="space-y-3 text-xs">
				<div class="flex items-center justify-between">
					<label for="raw-feed" class="font-medium text-neutral-300">Raw Surface Feedback:</label>
					<div class="flex items-center gap-2">
						<LlmTriggerButton
							label="Simulate Realistic Stakeholder Demand"
							onclick={runStakeholderSimulation}
							loading={isGeneratingSim}
							title="Generate challenging, uncalibrated executive/client feedback"
						/>
						<LlmTriggerButton
							label="Audit Feedback Triage"
							onclick={runTriageAudit}
							loading={isAuditingTriage}
							disabled={!rawFeedback.trim()}
							title="Audit your diagnosis of root need and chosen directorial action"
						/>
					</div>
				</div>

				<input
					id="raw-feed"
					type="text"
					bind:value={rawFeedback}
					placeholder="e.g. Make the logo bigger and more inspiring"
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 font-mono text-xs"
				/>

				<!-- Simulated Stakeholder Critique Card -->
				{#if simCritique || isGeneratingSim || simError}
					<div class="pt-1">
						<LlmCritiqueCard
							result={simCritique}
							loading={isGeneratingSim}
							error={simError}
							title="Simulated Executive Feedback Scenario"
							actions={simActions}
							onDismiss={() => (simCritique = null)}
							onRetry={runStakeholderSimulation}
						/>

						{#if simCritique?.simulatedStakeholder}
							{@const sim = simCritique.simulatedStakeholder}
							<div class="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
								<div class="flex items-center gap-2">
									<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
										ROLE: {sim.stakeholderRole}
									</span>
								</div>
								{#if sim.hiddenCommercialAnxiety}
									<div class="text-neutral-300 text-[11px] leading-relaxed">
										<strong class="text-neutral-100">Hidden Commercial Anxiety:</strong> {sim.hiddenCommercialAnxiety}
									</div>
								{/if}
								{#if sim.primaryConflict}
									<div class="text-rose-400 font-mono text-[10px]">
										<strong>Primary Conflict:</strong> {sim.primaryConflict}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}

				<div>
					<label for="under-need" class="block font-medium text-neutral-300 mb-1">
						Inferred Underlying Need (What commercial or psychological fear motivates this demand?):
					</label>
					<input
						id="under-need"
						type="text"
						bind:value={diagnosedUnderlyingNeed}
						placeholder="e.g. Stakeholder fears lack of emotional presence and brand illegibility."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 font-mono text-xs"
					/>
				</div>

				<!-- Triage Evaluation Critique Card -->
				{#if triageCritique || isAuditingTriage || triageError}
					<div class="pt-1">
						<LlmCritiqueCard
							result={triageCritique}
							loading={isAuditingTriage}
							error={triageError}
							title="Chief Directorial Evaluator: Triage Audit"
							actions={triageActions}
							onDismiss={() => (triageCritique = null)}
							onRetry={runTriageAudit}
						/>

						{#if triageCritique?.triageEvaluation}
							{@const evalData = triageCritique.triageEvaluation}
							<div class="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold {evalData.verdict === 'SOUND_TRIAGE'
										? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
										: 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}">
										VERDICT: {evalData.verdict}
									</span>
									<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold uppercase">
										RECOMMENDED ACTION: {evalData.recommendedAction}
									</span>
								</div>
								{#if evalData.hardenedUnderlyingNeed}
									<div class="text-neutral-300 text-[11px] leading-relaxed">
										<strong class="text-neutral-100">Hardened Underlying Need:</strong> {evalData.hardenedUnderlyingNeed}
									</div>
								{/if}
								{#if evalData.directorialResponse}
									<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-amber-300 leading-relaxed">
										<div class="text-[10px] font-bold text-neutral-400 mb-1 uppercase tracking-wider">Suggested Collaborative Response:</div>
										"{evalData.directorialResponse}"
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- 5 Triage Actions -->
			<div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
				{#each [
					{ id: 'apply', label: 'Apply', desc: 'Direct request is valid' },
					{ id: 'adapt', label: 'Adapt', desc: 'Solve underlying need differently' },
					{ id: 'alternative', label: 'Propose Alternative', desc: 'Better solution to same goal' },
					{ id: 'pushback', label: 'Push Back', desc: 'Request harms brief intention' },
					{ id: 'rebrief', label: 'Re-Brief', desc: 'Conflicting premise detected' }
				] as act}
					<button
						type="button"
						onclick={() => (selectedAction = act.id as any)}
						class="p-2.5 rounded-xl border text-left transition cursor-pointer {selectedAction === act.id
							? 'bg-neutral-950 border-amber-500 text-amber-400 font-bold'
							: 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'}"
					>
						<div class="text-xs">{act.label}</div>
						<div class="text-[10px] text-neutral-500 mt-0.5">{act.desc}</div>
					</button>
				{/each}
			</div>

			<div class="flex items-center justify-between pt-2">
				{#if triageSaved}
					<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
						<CheckCircle2 class="w-4 h-4" />
						Feedback triage action committed to Decision Log!
					</span>
				{:else}
					<span></span>
				{/if}
				<button
					type="button"
					onclick={commitTriageDecision}
					class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-2 cursor-pointer"
				>
					<CheckCircle2 class="w-3.5 h-3.5" />
					<span>Commit Action to Decision Log</span>
				</button>
			</div>

			<!-- Recent Triage Decisions Table -->
			{#if triageDecisions.length > 0}
				<div class="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
					<div class="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
						<div class="flex items-center gap-2 font-bold text-neutral-300">
							<History class="w-4 h-4 text-amber-400" />
							<span>Recent Stakeholder Feedback Triage Decisions ({triageDecisions.length})</span>
						</div>
					</div>

					<div class="space-y-2">
						{#each triageDecisions.slice(0, 5) as decision (decision.id)}
							<div class="p-3 bg-neutral-900 rounded-xl border border-neutral-800/80 text-xs flex items-start justify-between gap-3">
								<div class="space-y-1">
									<div class="flex items-center gap-2">
										<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
											{decision.date}
										</span>
										<span class="font-bold text-amber-400 font-mono">
											{decision.decision}
										</span>
									</div>
									<div class="text-neutral-400 text-[11px] leading-relaxed">
										<strong class="text-neutral-300">Root Need:</strong> {decision.justification.replace('Diagnosed Root Need: ', '')}
									</div>
									<div class="text-[10px] font-mono text-neutral-500">
										Feedback: "{decision.feedbackIncorporated}" | Refusal: {decision.refusals}
									</div>
								</div>
								<button
									type="button"
									onclick={() => deleteDecision(decision.id)}
									class="text-neutral-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
									title="Delete decision entry"
								>
									<Trash2 class="w-3.5 h-3.5" />
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- TAB 3: 5-Mode Refusal Composer (Appendix F) -->
	{:else if activeSubTab === 'refusal'}
		<div class="space-y-5">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">5-Mode Refusal System (Appendix F):</strong>
				Authorship is defined as much by what you refuse as what you produce. Refusal is not petulance; it is the active defense of integrity.
			</div>

			<!-- Refusal Modes -->
			<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
				{#each ['Ethical', 'Positional', 'Technical', 'Intentional', 'Slop'] as rMode}
					<button
						type="button"
						onclick={() => (refusalMode = rMode as any)}
						class="p-2.5 rounded-xl border text-center transition cursor-pointer {refusalMode === rMode
							? 'bg-neutral-950 border-rose-500 text-rose-400 font-bold'
							: 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'}"
					>
						<div class="text-xs">{rMode} Refusal</div>
					</button>
				{/each}
			</div>

			<div class="space-y-3 text-xs">
				<div class="flex items-center justify-between">
					<label for="ref-target" class="font-medium text-neutral-300">What is being refused:</label>
					<LlmTriggerButton
						label="Audit Refusal Letter Soundness"
						onclick={runRefusalAudit}
						loading={isAuditingRefusal}
						disabled={!refusalTarget.trim() && !refusalRationale.trim()}
						title="Audit firmness, professionalism, mode alignment, and lack of defensive whining"
					/>
				</div>

				<input
					id="ref-target"
					type="text"
					bind:value={refusalTarget}
					placeholder="e.g. Generating likeness of an identifiable person without consent"
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 font-mono text-xs"
				/>

				<div>
					<label for="ref-rationale" class="block font-medium text-rose-400 mb-1">Defense & Rationale:</label>
					<textarea
						id="ref-rationale"
						rows="3"
						bind:value={refusalRationale}
						placeholder="State explicit professional, ethical, or aesthetic reason for refusal..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 leading-relaxed font-mono text-xs"
					></textarea>
				</div>

				<!-- Refusal Audit Critique Card -->
				{#if refusalCritique || isAuditingRefusal || refusalError}
					<div class="pt-1">
						<LlmCritiqueCard
							result={refusalCritique}
							loading={isAuditingRefusal}
							error={refusalError}
							title="Senior Directorial Counsel: Refusal Letter Audit"
							actions={refusalActions}
							onDismiss={() => (refusalCritique = null)}
							onRetry={runRefusalAudit}
						/>

						{#if refusalCritique?.refusalAudit}
							{@const audit = refusalCritique.refusalAudit}
							<div class="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold {audit.verdict === 'AIRTIGHT'
										? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
										: 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}">
										VERDICT: {audit.verdict}
									</span>
									{#if audit.toneRating}
										<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold">
											TONE: {audit.toneRating}
										</span>
									{/if}
									{#if audit.recommendedMode}
										<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
											RECOMMENDED MODE: {audit.recommendedMode}
										</span>
									{/if}
								</div>
								{#if audit.boundaryPrinciple}
									<div class="text-neutral-300 text-[11px] leading-relaxed">
										<strong class="text-neutral-100">Anchoring Principle:</strong> {audit.boundaryPrinciple}
									</div>
								{/if}
								{#if audit.sharpenedRationale}
									<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-200 leading-relaxed">
										<div class="text-[10px] font-bold text-amber-400 mb-1 uppercase tracking-wider">Sharpened Refusal Draft:</div>
										"{audit.sharpenedRationale}"
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex items-center justify-between pt-2">
				{#if refusalSaved}
					<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
						<CheckCircle2 class="w-4 h-4" />
						Refusal committed to Decision Log!
					</span>
				{:else}
					<span></span>
				{/if}
				<button
					type="button"
					onclick={commitRefusalDecision}
					class="px-4 py-2 rounded-xl text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-2 cursor-pointer"
				>
					<ShieldCheck class="w-3.5 h-3.5" />
					<span>Commit Refusal to Decision Log</span>
				</button>
			</div>

			<!-- Recent Refusal Decisions Table -->
			{#if refusalDecisions.length > 0}
				<div class="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
					<div class="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
						<div class="flex items-center gap-2 font-bold text-neutral-300">
							<History class="w-4 h-4 text-rose-400" />
							<span>Recent 5-Mode Refusal Decisions ({refusalDecisions.length})</span>
						</div>
					</div>

					<div class="space-y-2">
						{#each refusalDecisions.slice(0, 5) as decision (decision.id)}
							<div class="p-3 bg-neutral-900 rounded-xl border border-neutral-800/80 text-xs flex items-start justify-between gap-3">
								<div class="space-y-1">
									<div class="flex items-center gap-2">
										<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
											{decision.date}
										</span>
										<span class="font-bold text-rose-400 font-mono">
											{decision.decision}
										</span>
									</div>
									<div class="text-neutral-400 text-[11px] leading-relaxed">
										<strong class="text-neutral-300">Rationale:</strong> {decision.justification}
									</div>
									<div class="text-[10px] font-mono text-neutral-500">
										Boundary Refused: "{decision.refusals}" | Level: {decision.highestUnresolvedLevel}
									</div>
								</div>
								<button
									type="button"
									onclick={() => deleteDecision(decision.id)}
									class="text-neutral-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
									title="Delete decision entry"
								>
									<Trash2 class="w-3.5 h-3.5" />
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- TAB 4: Transmission & Silence Tolerance (Module 19) -->
	{:else if activeSubTab === 'transmission'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Teaching the Framework & Silence Tolerance (Module 19):</strong>
				Teaching is the ultimate test of portable knowledge. The teacher's cardinal rule is: <em>Scaffold problem-finding without doing the work for them.</em>
				Use the <strong>10-Second Silence Tolerance</strong> rule: withhold answers when a student pauses.
			</div>

			<div class="p-6 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
				<div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
					{#if silenceRunning}
						<VolumeX class="w-5 h-5 animate-pulse" />
					{:else}
						<Volume2 class="w-5 h-5" />
					{/if}
				</div>
				<div>
					<div class="font-bold text-sm text-neutral-200">10-Second Silence Tolerance Timer</div>
					<p class="text-xs text-neutral-400 max-w-sm">Count 10 silent seconds before jumping in to answer or solve for your mentee/collaborator.</p>
					<div class="text-3xl font-mono font-bold text-amber-400 mt-2">
						{silenceTimerSeconds}s
					</div>
				</div>
				<button
					type="button"
					onclick={toggleSilenceTimer}
					class="px-4 py-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition cursor-pointer"
				>
					{silenceRunning ? 'Reset' : 'Start 10s Silence'}
				</button>
			</div>
		</div>

	<!-- TAB 5: Deliberate Practice Drill Reps -->
	{:else if activeSubTab === 'drills'}
		<div class="space-y-4">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
				<div>
					<strong class="text-neutral-200">Module 6 Deliberate Practice Drills:</strong> Refusal under stakeholder pressure and feedback triage.
				</div>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => (activeDrillId = 'm6-refusal-pressure')}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm6-refusal-pressure'
							? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
							: 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Refusal Pressure (12m)
					</button>
					<button
						type="button"
						onclick={() => (activeDrillId = 'm6-feedback-translation')}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm6-feedback-translation'
							? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
							: 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Feedback Translation (10m)
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
