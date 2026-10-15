<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { CalibrationEntry } from '$lib/schemas/course.schema';
	import { Sliders, AlertTriangle, CheckCircle, Clock, ShieldCheck, HeartPulse, Target, Sparkles, Trash2, Compass, Check, ArrowRight, ShieldAlert, History } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import { getDrillById } from '$lib/data/drills';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let activeSubTab = $state<'pipeline' | 'calibration' | 'ergonomics' | 'drills'>('pipeline');
	let activeDrillId = $state<'predict-then-run' | 'm4-causal-ablation'>('predict-then-run');
	let activeDrill = $derived(getDrillById(activeDrillId));

	// Pre-run calibration inputs
	let calDomain = $state<'pipeline' | 'curation' | 'writing' | 'visual' | 'audience' | 'direction' | 'problem'>('pipeline');
	let calVar = $state('');
	let calPrediction = $state('');
	let calConfidence = $state(75);
	let calActual = $state('');
	let calMatched = $state(true);
	let calSurprising = $state(false);
	let calRevision = $state('');

	// LLM State
	let preRunCritique = $state<CritiqueResult | null>(null);
	let isCheckingPreRun = $state(false);
	let preRunError = $state<string | null>(null);

	let postRunCritique = $state<CritiqueResult | null>(null);
	let isCheckingPostRun = $state(false);
	let postRunError = $state<string | null>(null);

	let narrownessCritique = $state<CritiqueResult | null>(null);
	let isCheckingNarrowness = $state(false);
	let narrownessError = $state<string | null>(null);

	// Ergonomics timer
	let breakTimerSeconds = $state(2700); // 45m drawing / screen break
	let timerActive = $state(false);
	let intervalId: any = null;

	function toggleErgoTimer() {
		if (timerActive) {
			clearInterval(intervalId);
			timerActive = false;
		} else {
			timerActive = true;
			intervalId = setInterval(() => {
				if (breakTimerSeconds > 0) breakTimerSeconds -= 1;
				else {
					clearInterval(intervalId);
					timerActive = false;
				}
			}, 1000);
		}
	}

	function commitCalibration() {
		if (!calVar.trim() || !calPrediction.trim() || !calActual.trim()) return;

		const entry: CalibrationEntry = {
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			domain: calDomain,
			variableChanged: calVar.trim(),
			prediction: calPrediction.trim(),
			confidencePct: calConfidence,
			actualOutcome: calActual.trim(),
			matchedExpectation: calMatched,
			wasSurprising: calSurprising,
			modelRevision: calRevision.trim() || 'Internal mental model updated.'
		};

		practiceStore.calibrations.unshift(entry);
		practiceStore.saveToStorage();

		calVar = '';
		calPrediction = '';
		calActual = '';
		calRevision = '';
		preRunCritique = null;
		postRunCritique = null;
	}

	function deleteCalibration(id: string) {
		practiceStore.calibrations = practiceStore.calibrations.filter((c) => c.id !== id);
		practiceStore.saveToStorage();
	}

	async function runPreRunCheck() {
		if (!calVar.trim() || !calPrediction.trim()) return;
		isCheckingPreRun = true;
		preRunError = null;
		try {
			preRunCritique = await executePrompt('m4-pre-run-reality-check', {
				domain: calDomain,
				variableChanged: calVar.trim(),
				prediction: calPrediction.trim(),
				confidencePct: calConfidence
			});
		} catch (err: any) {
			console.error('Pre-run reality check failed:', err);
			preRunError = err.message || 'Reality check failed.';
		} finally {
			isCheckingPreRun = false;
		}
	}

	async function runPostRunAnalysis() {
		if (!calActual.trim()) return;
		isCheckingPostRun = true;
		postRunError = null;
		try {
			postRunCritique = await executePrompt('m4-post-run-divergence', {
				domain: calDomain,
				variableChanged: calVar.trim(),
				prediction: calPrediction.trim(),
				confidencePct: calConfidence,
				actualOutcome: calActual.trim(),
				matchedExpectation: calMatched,
				wasSurprising: calSurprising,
				modelRevision: calRevision.trim()
			});
		} catch (err: any) {
			console.error('Post-run divergence analysis failed:', err);
			postRunError = err.message || 'Post-run analysis failed.';
		} finally {
			isCheckingPostRun = false;
		}
	}

	async function runNarrownessAudit() {
		isCheckingNarrowness = true;
		narrownessError = null;
		try {
			const domainCounts: Record<string, number> = {};
			for (const c of practiceStore.calibrations) {
				domainCounts[c.domain] = (domainCounts[c.domain] || 0) + 1;
			}
			const recentCalibrations = practiceStore.calibrations.slice(0, 6).map((c) => ({
				domain: c.domain,
				variable: c.variableChanged,
				prediction: c.prediction,
				confidence: c.confidencePct,
				matched: c.matchedExpectation,
				surprising: c.wasSurprising
			}));
			const recentVariables = practiceStore.calibrations.slice(0, 8).map((c) => c.variableChanged);

			narrownessCritique = await executePrompt('m4-narrowness-audit', {
				brierScore: telemetry.brierScore,
				totalEntries: telemetry.total,
				hitRate: telemetry.hitRate,
				surpriseRate: telemetry.surpriseRate,
				domainDiversity: telemetry.domainDiversity,
				domainCounts,
				recentCalibrations,
				recentVariables
			});
		} catch (err: any) {
			console.error('Narrowness audit failed:', err);
			narrownessError = err.message || 'Narrowness audit failed.';
		} finally {
			isCheckingNarrowness = false;
		}
	}

	const preRunActions = $derived.by<LlmAction[]>(() => {
		if (!preRunCritique?.calibrationCheck) return [];
		const actions: LlmAction[] = [];
		const check = preRunCritique.calibrationCheck;
		if (check.recommendedConfidence !== undefined && check.recommendedConfidence !== calConfidence) {
			actions.push({
				label: `Adopt Calibrated Confidence (${check.recommendedConfidence}%)`,
				primary: true,
				variant: 'primary',
				onClick: () => {
					calConfidence = check.recommendedConfidence;
				}
			});
		}
		if (check.sharpenedPrediction) {
			actions.push({
				label: 'Adopt Sharpened Falsifiable Prediction',
				variant: 'secondary',
				onClick: () => {
					calPrediction = check.sharpenedPrediction!;
				}
			});
		}
		return actions;
	});

	const postRunActions = $derived.by<LlmAction[]>(() => {
		if (!postRunCritique?.postRunDivergence) return [];
		const actions: LlmAction[] = [];
		const post = postRunCritique.postRunDivergence;
		if (post.sharpenedModelRevision) {
			actions.push({
				label: 'Adopt Sharpened Mental Model Revision',
				primary: true,
				variant: 'primary',
				onClick: () => {
					calRevision = post.sharpenedModelRevision!;
				}
			});
		}
		return actions;
	});

	const narrownessActions = $derived.by<LlmAction[]>(() => {
		if (!narrownessCritique?.narrownessAudit) return [];
		const actions: LlmAction[] = [];
		const audit = narrownessCritique.narrownessAudit;
		if (audit.prescribedVariable) {
			actions.push({
				label: 'Load Prescribed Boundary-Pushing Experiment',
				primary: true,
				variant: 'primary',
				onClick: () => {
					if (audit.prescribedDomain) calDomain = audit.prescribedDomain as any;
					if (audit.prescribedVariable) calVar = audit.prescribedVariable;
					if (audit.prescribedHypothesis) calPrediction = audit.prescribedHypothesis;
					calConfidence = audit.prescribedConfidence ?? 40;
					calActual = '';
					calRevision = '';
					const el = document.getElementById('commit-prediction-form');
					if (el) el.scrollIntoView({ behavior: 'smooth' });
				}
			});
		}
		return actions;
	});

	const telemetry = $derived(practiceStore.calibrationTelemetry);
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M4
				</span>
				<h2 class="text-base font-bold text-white">Causal Pipeline & Calibration-vs-Range Lab</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 8, 9, V3, W3: Pre-Run Confidence Lock, Brier Score, and Taste-Narrowness Detector.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeSubTab = 'pipeline'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'pipeline' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Pipeline Mapping
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'calibration'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'calibration' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Calibration & Range
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'ergonomics'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'ergonomics' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Ergonomic HUD
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

	<!-- TAB 1: 9-Layer Pipeline Mapper -->
	{#if activeSubTab === 'pipeline'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The Causal Pipeline (Module 8):</strong>
				A pipeline is not a bag of tricks. It is a hypothesis about causality. Every node, prompt, tool, or edit must answer:
				<em>What variable am I trying to control, and why?</em>
			</div>

			<!-- Pipeline 9 layers visual grid -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
				{#each [
					{ num: 1, name: '1. Brief Specification', role: 'Input intention & constraints' },
					{ num: 2, name: '2. Input Preparation', role: 'Structural skeletons & thumbnails' },
					{ num: 3, name: '3. Generation / Drafting', role: 'First pass material creation' },
					{ num: 4, name: '4. Structural Conditioning', role: 'ControlNet / Prose outline' },
					{ num: 5, name: '5. Identity & Voice', role: 'Consistent character / register' },
					{ num: 6, name: '6. Curation & Selection', role: 'Comparative criteria filter' },
					{ num: 7, name: '7. Revision & Touchup', role: 'Manual craft interventions' },
					{ num: 8, name: '8. Verification', role: 'Checking against acceptance criteria' },
					{ num: 9, name: '9. Final Production', role: 'Delivery & Rights/Provenance' }
				] as layer}
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1">
						<div class="font-bold text-amber-400 text-[11px]">{layer.name}</div>
						<div class="text-[10px] text-neutral-400">{layer.role}</div>
					</div>
				{/each}
			</div>

			<!-- Version Naming Convention -->
			<div class="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-2">
				<div class="font-semibold text-neutral-200">Status-Aware Version Naming (Appendix L):</div>
				<code class="text-amber-400 font-mono text-[11px] block bg-neutral-900 p-2 rounded-lg">
					project-name_v01_YYYY-MM-DD_status_purpose
				</code>
				<div class="text-[11px] text-neutral-400">
					Status values: <span class="text-neutral-300">draft</span> (exploratory), <span class="text-neutral-300">review</span> (submitted for critique), <span class="text-neutral-300">approved</span> (moving to production), <span class="text-neutral-300">final</span> (delivered).
				</div>
			</div>
		</div>

	<!-- TAB 2: Calibration & Taste-Narrowness Detector -->
	{:else if activeSubTab === 'calibration'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Pre-Run Prediction & Calibration (Module 9):</strong>
				The question is not: <em>"Was I right?"</em> It is: <em>"Was I as right as I expected to be?"</em>
				Commit a written prediction with an honest confidence percentage <strong>before</strong> running the test.
			</div>

			<!-- Telemetry Dashboard -->
			<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Entries</div>
					<div class="text-lg font-mono font-bold text-neutral-100">{telemetry.total}</div>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Hit Rate</div>
					<div class="text-lg font-mono font-bold text-amber-400">{telemetry.hitRate}%</div>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Brier Error</div>
					<div class="text-lg font-mono font-bold text-neutral-300">{telemetry.brierScore}</div>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Surprise Rate</div>
					<div class="text-lg font-mono font-bold text-emerald-400">{telemetry.surpriseRate}%</div>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center col-span-2 sm:col-span-1">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Domains</div>
					<div class="text-lg font-mono font-bold text-neutral-200">{telemetry.domainDiversity}/7</div>
				</div>
			</div>

			<!-- Taste-Narrowness & Domain Diversity Sentinel Card -->
			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div class="flex items-center gap-2">
						<Compass class="w-4 h-4 text-amber-400 shrink-0" />
						<span class="text-xs font-bold text-neutral-200">Taste-Narrowness & Domain Diversity Sentinel</span>
						<span class="text-[10px] font-mono text-neutral-500">(Module 9)</span>
					</div>
					<LlmTriggerButton
						label="Audit Taste Narrowness & Domain Diversity"
						onclick={runNarrownessAudit}
						loading={isCheckingNarrowness}
						title="Expose safe-zone camping and prescribe high-variance frontier shock"
					/>
				</div>

				{#if telemetry.narrownessWarning}
					<div class="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2.5">
						<AlertTriangle class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
						<div>
							<strong class="font-bold">Algorithmic Warning:</strong>
							<p class="text-[11px] text-amber-200 mt-0.5 leading-relaxed">
								{telemetry.narrownessReason}
							</p>
						</div>
					</div>
				{/if}

				{#if narrownessCritique}
					<LlmCritiqueCard
						result={narrownessCritique}
						loading={isCheckingNarrowness}
						error={narrownessError}
						title="Bayesian Epistemologist: Taste Narrowness Audit"
						actions={narrownessActions}
						onDismiss={() => { narrownessCritique = null; }}
						onRetry={runNarrownessAudit}
					/>

					{#if narrownessCritique.narrownessAudit}
						{@const audit = narrownessCritique.narrownessAudit}
						<div class="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
							<div class="flex items-center gap-2 flex-wrap">
								<span class="text-[11px] text-neutral-400 font-mono">Diversity Rating:</span>
								<span class="text-xs font-mono font-bold px-2 py-0.5 rounded border {
									audit.diversityRating === 'HIGH_RANGE'
										? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
										: audit.diversityRating === 'MODERATE'
										? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
										: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
								}">
									{audit.diversityRating}
								</span>
							</div>

							{#if audit.comfortZoneObservation}
								<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
									<div class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Comfort Zone Observation:</div>
									<p class="text-neutral-200 leading-relaxed text-[11px]">{audit.comfortZoneObservation}</p>
								</div>
							{/if}

							{#if audit.prescribedVariable}
								<div class="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
									<div class="flex items-center justify-between">
										<span class="text-[10px] font-mono uppercase font-bold text-amber-400">Prescribed Shock Experiment</span>
										{#if audit.prescribedDomain}
											<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-700 uppercase">
												{audit.prescribedDomain}
											</span>
										{/if}
									</div>
									<div class="text-[11px] text-neutral-200">
										<strong class="text-neutral-400">Variable:</strong> {audit.prescribedVariable}
									</div>
									{#if audit.prescribedHypothesis}
										<div class="text-[11px] text-neutral-200">
											<strong class="text-neutral-400">Hypothesis:</strong> "{audit.prescribedHypothesis}"
										</div>
									{/if}
									<div class="text-[10px] font-mono text-amber-400/90">
										Target Confidence: {audit.prescribedConfidence ?? 40}% (High risk of surprise)
									</div>
								</div>
							{/if}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Commit New Prediction Form -->
			<div id="commit-prediction-form" class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4 text-xs scroll-mt-6">
				<div class="flex items-center justify-between border-b border-neutral-800/80 pb-2">
					<div class="font-bold text-neutral-200">Commit Pre-Run Prediction:</div>
					<span class="text-[10px] font-mono text-neutral-500">Step 1: Hypothesize before running</span>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label for="cal-dom" class="block text-neutral-400 mb-1">Domain:</label>
						<select id="cal-dom" bind:value={calDomain} class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200">
							<option value="pipeline">Pipeline variable</option>
							<option value="curation">Curation / Taste</option>
							<option value="visual">Visual composition</option>
							<option value="writing">Writing voice & rhythm</option>
							<option value="audience">Audience perception</option>
							<option value="direction">Direction / Client</option>
							<option value="problem">Problem selection</option>
						</select>
					</div>
					<div>
						<label for="cal-var" class="block text-neutral-400 mb-1">Variable being changed or tested:</label>
						<input id="cal-var" type="text" bind:value={calVar} placeholder="e.g. Inverting value contrast in background" class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200" />
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
					<div class="sm:col-span-2">
						<label for="cal-pred" class="block text-neutral-400 mb-1">Pre-run prediction (What will happen?):</label>
						<input id="cal-pred" type="text" bind:value={calPrediction} placeholder="e.g. Eye will enter at secondary doorway instead of main figure" class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200" />
					</div>
					<div>
						<div class="flex items-center justify-between text-neutral-400 mb-1">
							<span>Confidence:</span>
							<span class="font-mono font-bold text-amber-400">{calConfidence}%</span>
						</div>
						<input type="range" min="0" max="100" step="5" bind:value={calConfidence} class="w-full accent-amber-500" />
					</div>
				</div>

				<!-- Pre-Run LLM Trigger -->
				<div class="flex items-center justify-between pt-1 border-t border-neutral-800/60">
					<span class="text-[11px] text-neutral-500">Audit your confidence probability against pipeline volatility:</span>
					<LlmTriggerButton
						label="Reality-Check Pre-Run Calibration"
						onclick={runPreRunCheck}
						loading={isCheckingPreRun}
						disabled={!calVar.trim() || !calPrediction.trim()}
						title="Audit stated confidence percentage against generative model volatility"
					/>
				</div>

				{#if preRunCritique}
					<LlmCritiqueCard
						result={preRunCritique}
						loading={isCheckingPreRun}
						error={preRunError}
						title="Superforecaster: Pre-Run Reality Check"
						actions={preRunActions}
						onDismiss={() => { preRunCritique = null; }}
						onRetry={runPreRunCheck}
					/>

					{#if preRunCritique.calibrationCheck}
						{@const check = preRunCritique.calibrationCheck}
						<div class="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
							<div class="flex items-center gap-3 flex-wrap">
								<span class="text-[11px] text-neutral-400 font-mono">Verdict:</span>
								<span class="text-xs font-mono font-bold px-2 py-0.5 rounded border {
									check.verdict === 'WELL_CALIBRATED'
										? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
										: check.verdict === 'OVERCONFIDENT'
										? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
										: check.verdict === 'UNDERCONFIDENT'
										? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
										: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
								}">
									{check.verdict}
								</span>
								<div class="text-[11px] font-mono text-neutral-300">
									Stated: <span class="text-amber-400">{calConfidence}%</span> → Recommended: <span class="text-emerald-400 font-bold">{check.recommendedConfidence}%</span>
								</div>
							</div>

							{#if check.latentRisk}
								<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
									<div class="text-[10px] font-mono uppercase tracking-wider text-rose-400">Latent Confounder / Risk:</div>
									<p class="text-neutral-200 leading-relaxed text-[11px]">{check.latentRisk}</p>
								</div>
							{/if}

							{#if check.falsificationCriterion}
								<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
									<div class="text-[10px] font-mono uppercase tracking-wider text-amber-400">Binary Falsification Criterion:</div>
									<p class="text-neutral-200 leading-relaxed text-[11px]">{check.falsificationCriterion}</p>
								</div>
							{/if}

							{#if check.sharpenedPrediction}
								<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
									<div class="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Sharpened Falsifiable Prediction:</div>
									<p class="text-neutral-200 leading-relaxed text-[11px]">"{check.sharpenedPrediction}"</p>
								</div>
							{/if}
						</div>
					{/if}
				{/if}

				<!-- Post-run actuals -->
				<div class="pt-3 border-t border-neutral-800 space-y-3">
					<div class="flex items-center justify-between">
						<span class="font-bold text-neutral-200">Post-Run Observation & Model Revision:</span>
						<span class="text-[10px] font-mono text-neutral-500">Step 2: Compare & update mental model</span>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<label for="cal-act" class="block text-neutral-400 mb-1">Actual outcome after test:</label>
							<input id="cal-act" type="text" bind:value={calActual} placeholder="What actually happened..." class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200" />
						</div>
						<div>
							<label for="cal-rev" class="block text-neutral-400 mb-1">Mental model revision (What changed in your understanding?):</label>
							<input id="cal-rev" type="text" bind:value={calRevision} placeholder="e.g. Edge sharpness dominates over value mass for entry" class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200" />
						</div>
					</div>

					<!-- Post-Run LLM Trigger -->
					<div class="flex items-center justify-between pt-1">
						<span class="text-[11px] text-neutral-500">Extract the causal mechanism and eliminate shallow excuses:</span>
						<LlmTriggerButton
							label="Analyze Post-Run Divergence & Update Mental Model"
							onclick={runPostRunAnalysis}
							loading={isCheckingPostRun}
							disabled={!calActual.trim()}
							title="Isolate root causal mechanism and eliminate shallow excuses"
						/>
					</div>

					{#if postRunCritique}
						<LlmCritiqueCard
							result={postRunCritique}
							loading={isCheckingPostRun}
							error={postRunError}
							title="Post-Mortem Diagnostician: Causal Mechanism Analysis"
							actions={postRunActions}
							onDismiss={() => { postRunCritique = null; }}
							onRetry={runPostRunAnalysis}
						/>

						{#if postRunCritique.postRunDivergence}
							{@const post = postRunCritique.postRunDivergence}
							<div class="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="text-[11px] text-neutral-400 font-mono">Learning Verdict:</span>
									<span class="text-xs font-mono font-bold px-2 py-0.5 rounded border {
										post.verdict === 'GENUINE_LEARNING'
											? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
											: post.verdict === 'SHALLOW_RATIONALISATION'
											? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
											: post.verdict === 'TAUTOLOGY_UNTESTED'
											? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
											: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
									}">
										{post.verdict}
									</span>
								</div>

								{#if post.diagnosedCausalMechanism}
									<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
										<div class="text-[10px] font-mono uppercase tracking-wider text-amber-400">Diagnosed Causal Mechanism:</div>
										<p class="text-neutral-200 leading-relaxed text-[11px]">{post.diagnosedCausalMechanism}</p>
									</div>
								{/if}

								{#if post.sharpenedModelRevision}
									<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
										<div class="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Sharpened Mental Model Rule:</div>
										<p class="text-neutral-200 leading-relaxed text-[11px]">"{post.sharpenedModelRevision}"</p>
									</div>
								{/if}

								{#if post.nextProbe}
									<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
										<div class="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Next Recommended Probe:</div>
										<p class="text-neutral-300 leading-relaxed text-[11px]">{post.nextProbe}</p>
									</div>
								{/if}
							</div>
						{/if}
					{/if}
				</div>

				<div class="flex items-center gap-4 pt-1 border-t border-neutral-800/80">
					<label class="flex items-center gap-2 cursor-pointer text-neutral-300">
						<input type="checkbox" bind:checked={calMatched} class="rounded accent-amber-500" />
						<span>Matched expectation</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer text-neutral-300">
						<input type="checkbox" bind:checked={calSurprising} class="rounded accent-amber-500" />
						<span>Was surprising (breaks habitual safe zone)</span>
					</label>
				</div>

				<button
					type="button"
					onclick={commitCalibration}
					disabled={!calVar.trim() || !calPrediction.trim() || !calActual.trim()}
					class="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition flex items-center justify-center gap-2"
				>
					<CheckCircle class="w-4 h-4" />
					<span>Lock Calibration Record</span>
				</button>
			</div>

			<!-- Recent Calibration Records List (History) -->
			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
				<div class="flex items-center justify-between border-b border-neutral-800 pb-2.5">
					<div class="flex items-center gap-2">
						<History class="w-4 h-4 text-amber-400" />
						<span class="font-bold text-neutral-200">Recent Calibration Records</span>
						<span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
							{practiceStore.calibrations.length} total
						</span>
					</div>
					{#if practiceStore.calibrations.length > 0}
						<span class="text-[10px] text-neutral-500">Showing last 5 locked records</span>
					{/if}
				</div>

				{#if practiceStore.calibrations.length === 0}
					<div class="p-6 text-center text-neutral-500 space-y-1">
						<p>No calibration records locked yet.</p>
						<p class="text-[11px] text-neutral-600">Run the Superforecaster check above or trigger a Taste Narrowness audit to start calibrating your predictive model.</p>
					</div>
				{:else}
					<div class="space-y-2.5">
						{#each practiceStore.calibrations.slice(0, 5) as entry (entry.id)}
							<div class="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition space-y-2">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-amber-400 border border-amber-500/20 font-bold uppercase">
											{entry.domain}
										</span>
										<span class="font-semibold text-neutral-200">{entry.variableChanged}</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="text-[11px] font-mono text-neutral-400">{entry.date}</span>
										<button
											type="button"
											onclick={() => deleteCalibration(entry.id)}
											class="p-1 text-neutral-500 hover:text-rose-400 transition"
											title="Delete calibration entry"
										>
											<Trash2 class="w-3.5 h-3.5" />
										</button>
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
									<div class="text-neutral-400">
										<span class="text-neutral-500">Pred:</span> "{entry.prediction}"
										<span class="font-mono text-amber-400 font-bold">({entry.confidencePct}%)</span>
									</div>
									<div class="text-neutral-400">
										<span class="text-neutral-500">Actual:</span> "{entry.actualOutcome}"
									</div>
								</div>

								<div class="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800/50 text-[10px]">
									<div class="flex items-center gap-2">
										<span class="px-1.5 py-0.5 rounded {entry.matchedExpectation ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">
											{entry.matchedExpectation ? '✓ Matched' : '✗ Missed'}
										</span>
										{#if entry.wasSurprising}
											<span class="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
												★ Surprising
											</span>
										{/if}
									</div>
									{#if entry.modelRevision}
										<div class="text-neutral-400 truncate max-w-[280px] sm:max-w-[420px]" title={entry.modelRevision}>
											<span class="text-neutral-500">Revision:</span> {entry.modelRevision}
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

	<!-- TAB 3: Ergonomics & Physical Sustainability (Appendix K) -->
	{:else if activeSubTab === 'ergonomics'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Physical Sustainability (Appendix K):</strong>
				Craft hours can damage tendons, wrists, and eyes if neglected. A sustainable practitioner monitors physical health as part of craft discipline.
			</div>

			<div class="p-6 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
				<HeartPulse class="w-8 h-8 text-rose-500" />
				<div>
					<div class="font-bold text-sm text-neutral-200">45-Minute Posture & 20-20-20 Eye Break Timer</div>
					<div class="text-2xl font-mono font-bold text-amber-400 mt-1">
						{Math.floor(breakTimerSeconds / 60)}:{String(breakTimerSeconds % 60).padStart(2, '0')}
					</div>
				</div>
				<button
					type="button"
					onclick={toggleErgoTimer}
					class="px-4 py-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition"
				>
					{timerActive ? 'Pause Timer' : 'Start Break Timer'}
				</button>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
					<span class="font-bold text-neutral-300">20-20-20 Rule</span>
					<p class="text-[11px] text-neutral-400">Every 20 minutes, look at something 20 feet away for 20 seconds to reset ciliary eye muscles.</p>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
					<span class="font-bold text-neutral-300">Wrist & Grip</span>
					<p class="text-[11px] text-neutral-400">Release stylus or keyboard death-grip. Draw from the shoulder and elbow, not only fingers.</p>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
					<span class="font-bold text-neutral-300">Hydration & Walk</span>
					<p class="text-[11px] text-neutral-400">Stand up and walk for 3 minutes before beginning any new rendering or drafting cycle.</p>
				</div>
			</div>
		</div>

	<!-- TAB 4: Deliberate Practice Drill Reps -->
	{:else if activeSubTab === 'drills'}
		<div class="space-y-4">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
				<div>
					<strong class="text-neutral-200">Module 4 Deliberate Practice Drills:</strong> Causal isolation, variable prediction locks, and ablation testing.
				</div>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => activeDrillId = 'predict-then-run'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'predict-then-run' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Predict-Then-Run (10m)
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'm4-causal-ablation'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm4-causal-ablation' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Causal Ablation (12m)
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
