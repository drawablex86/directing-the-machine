<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import {
		Sparkles,
		EyeOff,
		Award,
		RotateCcw,
		CheckCircle,
		ArrowRight,
		Target,
		CheckCircle2,
		History,
		Trash2,
		Plus,
		AlertTriangle,
		ShieldCheck,
		ShieldAlert,
		BookOpen,
		Layers,
		Brain
	} from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import LabFrictionPrimer from '$lib/components/course/LabFrictionPrimer.svelte';
	import ReadingModal from '$lib/components/shell/ReadingModal.svelte';
	import type { CoreReading } from '$lib/data/core-readings';
	import { getDrillById } from '$lib/data/drills';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let activeReadingForModal = $state<CoreReading | null>(null);

	let activeSubTab = $state<'tasteFormula' | 'blindRanker' | 'anchors' | 'reverse' | 'drills'>('tasteFormula');
	let activeDrillId = $state<'blind-ranking' | 'm5-taste-builder' | 'm5-reverse-brief'>('blind-ranking');
	let activeDrill = $derived(getDrillById(activeDrillId));

	let formulaSaved = $state(false);
	let rankingSaved = $state(false);
	let reverseBriefSaved = $state(false);

	// ==========================================
	// TAB 1: 5-Part Taste Formula
	// ==========================================
	let tastePreference = $state('');
	let tasteCriteria = $state('');
	let tasteRefClass = $state('');
	let tasteMechanism = $state('');
	let tastePurpose = $state('');

	function saveTasteFormula() {
		if (!tastePreference.trim() && !tasteCriteria.trim()) return;
		practiceStore.saveDecision({
			project: 'Taste Infrastructure (M5)',
			decision: `Taste Formula: ${tastePreference.trim() || 'Aesthetic Commitment'}`,
			highestUnresolvedLevel: 'Purpose & Criteria Formulation',
			alternativesRejected: 'Judging artifact in isolation without explicit reference class or mechanism',
			justification: `Criteria: ${tasteCriteria} | Ref Class: ${tasteRefClass} | Mechanism: ${tasteMechanism} | Purpose: ${tastePurpose}`,
			feedbackIncorporated: 'Self-calibrated criteria',
			refusals: 'Rejecting default algorithmic homogenisation'
		});
		formulaSaved = true;
		setTimeout(() => (formulaSaved = false), 3000);
	}

	// LLM State: Taste Formula Interrogator
	let formulaCritique = $state<CritiqueResult | null>(null);
	let isCheckingFormula = $state(false);
	let formulaError = $state<string | null>(null);

	async function runTasteFormulaInterrogation() {
		if (!tastePreference.trim() && !tasteCriteria.trim()) return;
		isCheckingFormula = true;
		formulaError = null;
		try {
			const result = await executePrompt('m5-taste-formula-interrogation', {
				preference: tastePreference.trim(),
				criteria: tasteCriteria.trim(),
				referenceClass: tasteRefClass.trim() || 'Unspecified benchmark',
				mechanism: tasteMechanism.trim() || 'No explicit formal mechanism provided',
				purpose: tastePurpose.trim() || 'General exploration'
			});
			formulaCritique = result;
		} catch (err: any) {
			formulaError = err?.message || 'Failed to interrogate taste formula.';
		} finally {
			isCheckingFormula = false;
		}
	}

	let formulaActions = $derived.by<LlmAction[]>(() => {
		if (!formulaCritique?.tasteFormulaAudit) return [];
		const fa = formulaCritique.tasteFormulaAudit;
		const actions: LlmAction[] = [];

		if (fa.sharpenedMechanism && fa.sharpenedMechanism !== tasteMechanism) {
			actions.push({
				label: 'Adopt Sharpened Mechanism',
				primary: true,
				variant: 'primary',
				onClick: () => {
					tasteMechanism = fa.sharpenedMechanism!;
				}
			});
		}

		actions.push({
			label: 'Commit Formula to Decision Log',
			variant: 'secondary',
			onClick: () => {
				saveTasteFormula();
			}
		});

		return actions;
	});

	// ==========================================
	// TAB 2: Blind Ranker State
	// ==========================================
	let provenanceRevealed = $state(false);
	let mockWorks = $state([
		{ id: 1, title: 'Study 01: Low-Key Corridor', actualType: 'Human Reference (Gordon Willis)', rank: 1, userCriteria: 'Values cluster in bottom third, light serves narrative suspense' },
		{ id: 2, title: 'Study 02: Neon Alley Reflection', actualType: 'AI Default Generation (Midjourney v6)', rank: 2, userCriteria: 'Atmospheric but generic centering trope' },
		{ id: 3, title: 'Study 03: Editorial Portrait', actualType: 'Hybrid Direction (Authored ControlNet + Hand Paint)', rank: 3, userCriteria: 'Controlled gaze line with custom cast shadow' },
		{ id: 4, title: 'Study 04: Minimalist Interior', actualType: 'Human Anchor (Vilhelm Hammershøi)', rank: 4, userCriteria: 'Radical stillness through muted color harmony' }
	]);

	function moveRank(index: number, direction: 'up' | 'down') {
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= mockWorks.length) return;
		const temp = mockWorks[index];
		mockWorks[index] = mockWorks[targetIndex];
		mockWorks[targetIndex] = temp;
	}

	function commitBlindRanking() {
		practiceStore.saveDecision({
			project: 'Blind Provenance Arena (M5)',
			decision: `Blind Provenance Ranking: 1st ${mockWorks[0].title}, 2nd ${mockWorks[1].title}`,
			highestUnresolvedLevel: 'Objective Evaluation Prior to Provenance Reveal',
			alternativesRejected: `Subordinate rank candidates: ${mockWorks.slice(2).map((w) => w.title).join(', ')}`,
			justification: mockWorks.map((w, i) => `#${i + 1} ${w.title}: ${w.userCriteria}`).join(' | '),
			feedbackIncorporated: `Actual revealed provenances: ${mockWorks.map((w) => `${w.title} (${w.actualType})`).join(', ')}`,
			refusals: 'Refused evaluation bias from author/tool brand labels'
		});
		rankingSaved = true;
		setTimeout(() => (rankingSaved = false), 3000);
	}

	// ==========================================
	// TAB 3: Dynamic ≥40% Human Anchors & Demotion
	// ==========================================
	interface AnchorItem {
		id: string;
		title: string;
		type: 'Human' | 'Hybrid' | 'AI';
		percentage: number;
	}

	interface DemotedAnchorItem {
		id: string;
		title: string;
		rationale: string;
		date: string;
	}

	let activeAnchors = $state<AnchorItem[]>([
		{ id: '1', title: 'Vilhelm Hammershøi (Interior with Quiet Light)', type: 'Human', percentage: 100 },
		{ id: '2', title: 'Gordon Willis (Godfather shadow values)', type: 'Human', percentage: 100 },
		{ id: '3', title: 'Authored Pipeline V2 (Cast shadow study)', type: 'Hybrid', percentage: 50 },
		{ id: '4', title: 'Midjourney v6 Default Contrast Run', type: 'AI', percentage: 0 }
	]);

	let demotedAnchors = $state<DemotedAnchorItem[]>([
		{
			id: 'd1',
			title: 'Neon City Rainy Silhouette',
			rationale: 'Demoted because the mood was borrowed from model dataset defaults; it substituted atmospheric surface for compositional purpose.',
			date: '2026-10-10'
		}
	]);

	// New Anchor Inputs
	let newAnchorTitle = $state('');
	let newAnchorType = $state<'Human' | 'Hybrid' | 'AI'>('Human');

	// New Demoted Anchor Inputs
	let newDemotedTitle = $state('');
	let newDemotedRationale = $state('');

	// Derived metrics
	let humanAnchorsCount = $derived(activeAnchors.filter((a) => a.type === 'Human').length);
	let totalAnchorsCount = $derived(activeAnchors.length);
	let humanAnchorPercentage = $derived(
		totalAnchorsCount > 0 ? Math.round((humanAnchorsCount / totalAnchorsCount) * 100) : 0
	);
	let isAnchorRatioCompliant = $derived(humanAnchorPercentage >= 40);

	function addAnchor() {
		if (!newAnchorTitle.trim()) return;
		activeAnchors.push({
			id: crypto.randomUUID(),
			title: newAnchorTitle.trim(),
			type: newAnchorType,
			percentage: newAnchorType === 'Human' ? 100 : newAnchorType === 'Hybrid' ? 50 : 0
		});
		newAnchorTitle = '';
	}

	function removeAnchor(id: string) {
		activeAnchors = activeAnchors.filter((a) => a.id !== id);
	}

	function addDemotedAnchor() {
		if (!newDemotedTitle.trim() || !newDemotedRationale.trim()) return;
		demotedAnchors.push({
			id: crypto.randomUUID(),
			title: newDemotedTitle.trim(),
			rationale: newDemotedRationale.trim(),
			date: new Date().toISOString().slice(0, 10)
		});
		newDemotedTitle = '';
		newDemotedRationale = '';
	}

	function removeDemotedAnchor(id: string) {
		demotedAnchors = demotedAnchors.filter((d) => d.id !== id);
	}

	// LLM State: Anchor Sentinel
	let anchorCritique = $state<CritiqueResult | null>(null);
	let isCheckingAnchors = $state(false);
	let anchorError = $state<string | null>(null);

	async function runAnchorAudit() {
		isCheckingAnchors = true;
		anchorError = null;
		try {
			const result = await executePrompt('m5-anchor-audit', {
				totalAnchors: totalAnchorsCount,
				humanAnchors: humanAnchorsCount,
				hybridAnchors: activeAnchors.filter((a) => a.type === 'Hybrid').length,
				aiAnchors: activeAnchors.filter((a) => a.type === 'AI').length,
				humanPercentage: humanAnchorPercentage,
				activeAnchorsList: activeAnchors.map((a) => ({ title: a.title, type: a.type })),
				demotedAnchorsList: demotedAnchors.map((d) => ({ title: d.title, rationale: d.rationale }))
			});
			anchorCritique = result;
		} catch (err: any) {
			anchorError = err?.message || 'Failed to audit anchor library.';
		} finally {
			isCheckingAnchors = false;
		}
	}

	let anchorActions = $derived.by<LlmAction[]>(() => {
		if (!anchorCritique?.anchorAudit) return [];
		const aa = anchorCritique.anchorAudit;
		const actions: LlmAction[] = [];

		if (aa.recommendedHumanAnchor) {
			actions.push({
				label: 'Add Recommended Human Anchor',
				primary: true,
				variant: 'primary',
				onClick: () => {
					if (aa.recommendedHumanAnchor) {
						activeAnchors.push({
							id: crypto.randomUUID(),
							title: aa.recommendedHumanAnchor,
							type: 'Human',
							percentage: 100
						});
					}
				}
			});
		}

		return actions;
	});

	// ==========================================
	// TAB 4: Reverse Direction Challenge
	// ==========================================
	let rejectedArtifact = $state('');
	let observedFlaw = $state('');
	let newBriefWhereFlawIsStrength = $state('');

	function commitReverseBrief() {
		if (!rejectedArtifact.trim() || !newBriefWhereFlawIsStrength.trim()) return;
		practiceStore.saveBrief({
			title: `Reverse Brief: ${rejectedArtifact.trim().slice(0, 40)}`,
			premise: `Inverted Flaw as Core Aesthetic: ${observedFlaw.trim() || 'Generative Artifact'}`,
			intention: newBriefWhereFlawIsStrength.trim(),
			constraints: [
				'Elevate diagnosed generative flaw into the mandatory aesthetic condition',
				'Preserve deliberate tension without falling back into default polished tropes'
			],
			references: [],
			acceptanceCriteria: [
				'Flaw is visually central and clearly structurally motivated',
				'The work cannot be confused with an accidental defect'
			],
			rejectionConditions: [
				'Default smooth cosmetic finish that conceals the inverted feature',
				'Uncalibrated drift away from stated reverse premise'
			],
			risksAndUnknowns: ['Risk of audience perceiving deliberate flaw as unintentional failure'],
			provenance: {
				origin: 'Module 11 Reverse Direction Challenge',
				humanContribution: 'Diagnosed model failure mode and authored inverted aesthetic brief',
				toolContribution: 'Produced artifact containing the uncalibrated generative anomaly',
				licenses: 'Personal study archive'
			}
		});
		reverseBriefSaved = true;
		setTimeout(() => (reverseBriefSaved = false), 3000);
	}

	// LLM State: Reverse Brief Coach
	let reverseCritique = $state<CritiqueResult | null>(null);
	let isCheckingReverse = $state(false);
	let reverseError = $state<string | null>(null);

	async function runReverseBriefCoach() {
		if (!rejectedArtifact.trim() || !newBriefWhereFlawIsStrength.trim()) return;
		isCheckingReverse = true;
		reverseError = null;
		try {
			const result = await executePrompt('m5-reverse-brief-coach', {
				rejectedArtifact: rejectedArtifact.trim(),
				observedFlaw: observedFlaw.trim() || 'Uncalibrated machine artifact/glitch',
				proposedBrief: newBriefWhereFlawIsStrength.trim()
			});
			reverseCritique = result;
		} catch (err: any) {
			reverseError = err?.message || 'Failed to coach reverse brief.';
		} finally {
			isCheckingReverse = false;
		}
	}

	let reverseActions = $derived.by<LlmAction[]>(() => {
		if (!reverseCritique?.reverseBriefAudit) return [];
		const ra = reverseCritique.reverseBriefAudit;
		const actions: LlmAction[] = [];

		if (ra.sharpenedReverseBrief && ra.sharpenedReverseBrief !== newBriefWhereFlawIsStrength) {
			actions.push({
				label: 'Adopt Sharpened Reverse Brief',
				primary: true,
				variant: 'primary',
				onClick: () => {
					newBriefWhereFlawIsStrength = ra.sharpenedReverseBrief!;
				}
			});
		}

		actions.push({
			label: 'Save Reverse Brief to Logbook',
			variant: 'secondary',
			onClick: () => {
				commitReverseBrief();
			}
		});

		return actions;
	});

	// ==========================================
	// Recent M5 Decisions History
	// ==========================================
	let m5Decisions = $derived.by(() => {
		return (practiceStore.decisions || []).filter(
			(d) =>
				d.project.includes('M5') ||
				d.project.includes('Taste') ||
				d.project.includes('Blind Provenance') ||
				d.project.includes('Reverse')
		);
	});

	function deleteDecision(id: string) {
		practiceStore.decisions = practiceStore.decisions.filter((d) => d.id !== id);
		practiceStore.saveToStorage();
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Contextual Material Primer: Ingesting Theory Before Practice -->
	<LabFrictionPrimer
		modalityId="m5"
		primaryReadingCode="Module 10"
		failureMode="Evaluating work based on brand reputation, human vs AI origin bias, or unexamined subjective whim without explicit reference classes."
		directorialDiscipline="Author 5-part taste formulas (Preference + Criteria + Reference Class + Mechanism + Purpose) and rank works blindly to eliminate origin bias."
		benchmarkPass="Articulates the physical mechanism that causes an emotional or aesthetic reaction; maintains ranking criteria regardless of who made the work."
		benchmarkFail="Changes evaluation upon learning whether a piece was AI-generated or human-made."
		onOpenFullReading={(r) => activeReadingForModal = r}
	/>

	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
					Taste Arena
				</span>
				<h2 class="text-base font-bold text-white">Taste Benchmark & Blind Curation Arena</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Construct explicit taste criteria, rank outputs blindly without provenance bias, and reverse-engineer direction.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs flex-wrap">
			<button
				type="button"
				onclick={() => (activeSubTab = 'tasteFormula')}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeSubTab === 'tasteFormula'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				5-Part Taste Formula
			</button>
			<button
				type="button"
				onclick={() => (activeSubTab = 'blindRanker')}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeSubTab === 'blindRanker'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				Blind Comparison
			</button>
			<button
				type="button"
				onclick={() => (activeSubTab = 'anchors')}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeSubTab === 'anchors'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				≥40% Anchors
			</button>
			<button
				type="button"
				onclick={() => (activeSubTab = 'reverse')}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeSubTab === 'reverse'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				Reverse Challenge
			</button>
			<button
				type="button"
				onclick={() => (activeSubTab = 'drills')}
				class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer {activeSubTab === 'drills'
					? 'bg-amber-500 text-neutral-950 font-bold'
					: 'text-neutral-400 hover:text-neutral-200'}"
			>
				<Target class="w-3.5 h-3.5" />
				<span>Drills</span>
			</button>
		</div>
	</div>

	<!-- TAB 1: 5-Part Taste Builder -->
	{#if activeSubTab === 'tasteFormula'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The 5-Part Taste Formula (Module 10):</strong>
				Aesthetic attraction is not project fitness. Taste = <code>Preference + Criteria + Reference Class + Mechanism + Purpose</code>.
				Never judge "Is this good?" in isolation from what the work is intended to accomplish.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
				<div>
					<label for="tf-pref" class="block font-medium text-neutral-300 mb-1">1. Preference (Immediate subjective pull):</label>
					<input
						id="tf-pref"
						type="text"
						bind:value={tastePreference}
						placeholder="I am drawn to this high-contrast frame..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
					/>
				</div>
				<div>
					<label for="tf-crit" class="block font-medium text-neutral-300 mb-1">2. Criteria (What explicit rules apply):</label>
					<input
						id="tf-crit"
						type="text"
						bind:value={tasteCriteria}
						placeholder="Must direct gaze in under 1 second without visual clutter..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
					/>
				</div>
				<div>
					<label for="tf-ref" class="block font-medium text-neutral-300 mb-1">3. Reference Class (Compared against what):</label>
					<input
						id="tf-ref"
						type="text"
						bind:value={tasteRefClass}
						placeholder="Cinematic low-key noir lighting (Gordon Willis)..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
					/>
				</div>
				<div>
					<label for="tf-mech" class="block font-medium text-neutral-300 mb-1">4. Mechanism (Why it works physically):</label>
					<input
						id="tf-mech"
						type="text"
						bind:value={tasteMechanism}
						placeholder="The single sliver of warm key light against 85% deep cool shadow..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
					/>
				</div>
			</div>

			<div class="text-xs">
				<label for="tf-purp" class="block font-medium text-amber-400 mb-1">5. Purpose (Fitness for this specific project):</label>
				<input
					id="tf-purp"
					type="text"
					bind:value={tastePurpose}
					placeholder="Does it serve the tension of psychological concealment?"
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
				/>
			</div>

			<!-- Action Buttons & LLM Trigger -->
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
				<div class="flex items-center gap-2">
					<LlmTriggerButton
						label="Interrogate Taste Formula"
						onclick={runTasteFormulaInterrogation}
						loading={isCheckingFormula}
						disabled={!tastePreference.trim() && !tasteCriteria.trim()}
						title="Dissect taste formula into causal mechanics, reference class validity, and purpose alignment"
					/>
				</div>

				<div class="flex items-center gap-3">
					{#if formulaSaved}
						<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
							<CheckCircle2 class="w-4 h-4" />
							Formula committed to Decision Log!
						</span>
					{/if}
					<button
						type="button"
						onclick={saveTasteFormula}
						class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-2 cursor-pointer"
					>
						<CheckCircle2 class="w-3.5 h-3.5" />
						<span>Commit Formula to Decision Log</span>
					</button>
				</div>
			</div>

			<!-- Critique Result Card & Structured Audit -->
			{#if formulaCritique || isCheckingFormula || formulaError}
				<div class="pt-2">
					<LlmCritiqueCard
						result={formulaCritique}
						loading={isCheckingFormula}
						error={formulaError}
						title="Curatorial Theorist: 5-Part Taste Formula Audit"
						actions={formulaActions}
						onDismiss={() => (formulaCritique = null)}
						onRetry={runTasteFormulaInterrogation}
					/>

					{#if formulaCritique?.tasteFormulaAudit}
						{@const fa = formulaCritique.tasteFormulaAudit}
						<div class="mt-2.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 text-xs">
							<!-- Verdict Badge -->
							<div class="flex items-center justify-between">
								<span
									class="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border {fa.verdict === 'RIGOROUS_APPARATUS'
										? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
										: fa.verdict === 'MISSING_MECHANISM'
										? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
										: 'bg-rose-500/20 text-rose-300 border-rose-500/40'}"
								>
									Verdict: {fa.verdict.replace(/_/g, ' ')}
								</span>
							</div>

							<!-- Mechanism Diagnosis -->
							<div class="space-y-1">
								<strong class="text-neutral-400 font-mono text-[10px] uppercase block">Mechanism Diagnosis:</strong>
								<p class="text-neutral-200 leading-relaxed font-sans">{fa.mechanismDiagnosis}</p>
							</div>

							<!-- Reference Class Fit & Purpose Alignment Grid -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
								{#if fa.referenceClassFit}
									<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
										<strong class="text-amber-400 font-mono text-[10px] uppercase block">Reference Class Fit:</strong>
										<p class="text-neutral-300 leading-relaxed">{fa.referenceClassFit}</p>
									</div>
								{/if}
								{#if fa.purposeAlignment}
									<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
										<strong class="text-emerald-400 font-mono text-[10px] uppercase block">Purpose Alignment:</strong>
										<p class="text-neutral-300 leading-relaxed">{fa.purposeAlignment}</p>
									</div>
								{/if}
							</div>

							<!-- Sharpened Mechanism Proposal -->
							{#if fa.sharpenedMechanism}
								<div class="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
									<strong class="text-amber-400 font-mono text-[10px] uppercase block">Directorial Causal Rewrite:</strong>
									<p class="font-serif italic text-xs leading-relaxed">"{fa.sharpenedMechanism}"</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>

	<!-- TAB 2: Blind Provenance Ranker -->
	{:else if activeSubTab === 'blindRanker'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Blind Provenance Curation Arena (Module 11):</strong>
				Provenance is hidden. Rank the artifacts and commit your written criteria <strong>first</strong>.
				Use the reorder arrows to sort from best to worst, update criteria, and commit before revealing provenance.
			</div>

			<div class="space-y-2">
				{#each mockWorks as work, idx}
					<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
						<div class="space-y-1.5 flex-1 w-full">
							<div class="flex items-center gap-2">
								<span class="font-mono font-bold text-amber-400">#{idx + 1}</span>
								<span class="font-bold text-neutral-200">{work.title}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-[11px] text-neutral-500 shrink-0">Criteria:</span>
								<input
									type="text"
									bind:value={work.userCriteria}
									class="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-[11px] text-neutral-200 focus:outline-none focus:border-amber-500/60"
								/>
							</div>
						</div>

						<div class="flex items-center gap-2 shrink-0">
							<div class="flex items-center gap-1">
								<button
									type="button"
									disabled={idx === 0}
									onclick={() => moveRank(idx, 'up')}
									class="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
									title="Move Up"
								>
									↑
								</button>
								<button
									type="button"
									disabled={idx === mockWorks.length - 1}
									onclick={() => moveRank(idx, 'down')}
									class="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
									title="Move Down"
								>
									↓
								</button>
							</div>

							{#if provenanceRevealed}
								<span class="px-2.5 py-1 rounded-md text-[11px] font-mono bg-neutral-900 border border-neutral-700 text-amber-300">
									{work.actualType}
								</span>
							{:else}
								<span class="px-2.5 py-1 rounded-md text-[11px] font-mono bg-neutral-900 text-neutral-500 flex items-center gap-1">
									<EyeOff class="w-3 h-3" />
									Provenance Hidden
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
				<button
					type="button"
					onclick={() => (provenanceRevealed = !provenanceRevealed)}
					class="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold transition flex items-center justify-center gap-2 cursor-pointer"
				>
					<span>{provenanceRevealed ? 'Hide Provenance Labels' : 'Reveal Provenance (Check Calibration Gap)'}</span>
				</button>

				<div class="flex items-center gap-3">
					{#if rankingSaved}
						<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
							<CheckCircle2 class="w-4 h-4" />
							Ranking committed to Decision Log!
						</span>
					{/if}
					<button
						type="button"
						onclick={commitBlindRanking}
						class="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center justify-center gap-2 cursor-pointer"
					>
						<CheckCircle2 class="w-3.5 h-3.5" />
						<span>Commit Ranking to Decision Log</span>
					</button>
				</div>
			</div>
		</div>

	<!-- TAB 3: ≥40% Human Anchor Rule & Demotion (Dynamic + LLM Sentinel) -->
	{:else if activeSubTab === 'anchors'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The ≥40% Human-Anchor Rule & Demotion Workflow (Appendix E):</strong>
				At least 40% of anchors in any library must be verified human works to prevent model homogenization and dataset collapse.
				As taste matures, actively <strong>demote</strong> 3 early anchors you previously admired and state what you now see.
			</div>

			<!-- Telemetry Bar & Compliance Badge -->
			<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
				<div class="flex items-center gap-3">
					<div class="flex items-center gap-1.5 font-mono">
						{#if isAnchorRatioCompliant}
							<ShieldCheck class="w-4 h-4 text-emerald-400" />
							<span class="font-bold text-emerald-400">{humanAnchorPercentage}% Human Anchors</span>
						{:else}
							<ShieldAlert class="w-4 h-4 text-rose-400" />
							<span class="font-bold text-rose-400">{humanAnchorPercentage}% Human Anchors (Warning: Under 40%)</span>
						{/if}
					</div>
					<span class="text-neutral-600">•</span>
					<span class="text-neutral-400 text-[11px]">
						{humanAnchorsCount} Human / {totalAnchorsCount} Total
					</span>
				</div>

				<div class="flex items-center gap-2">
					<LlmTriggerButton
						label="Audit Anchor Ratio & Demotion"
						onclick={runAnchorAudit}
						loading={isCheckingAnchors}
						title="Audits anchor library ratio and demotion rationales against model dataset collapse"
					/>
				</div>
			</div>

			<!-- Active Anchors Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
				<!-- Active Reference Anchors List -->
				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
					<div class="flex items-center justify-between border-b border-neutral-800/80 pb-2">
						<span class="font-bold text-emerald-400 uppercase text-[11px] font-mono">
							Active Anchors ({activeAnchors.length})
						</span>
						<span class="text-[10px] text-neutral-500 font-mono">Target: ≥40% Human</span>
					</div>

					<!-- Anchor Items -->
					<div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
						{#each activeAnchors as a (a.id)}
							<div class="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-900 border border-neutral-800/80 text-[11px]">
								<span class="text-neutral-200 truncate flex-1" title={a.title}>{a.title}</span>
								<div class="flex items-center gap-2 shrink-0">
									<span
										class="px-1.5 py-0.5 rounded text-[10px] font-mono {a.type === 'Human'
											? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
											: a.type === 'Hybrid'
											? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
											: 'bg-neutral-800 text-neutral-400 border border-neutral-700'}"
									>
										{a.type}
									</span>
									<button
										type="button"
										onclick={() => removeAnchor(a.id)}
										class="text-neutral-500 hover:text-rose-400 transition cursor-pointer p-0.5"
										title="Remove anchor"
									>
										<Trash2 class="w-3 h-3" />
									</button>
								</div>
							</div>
						{/each}
					</div>

					<!-- Add Anchor Form -->
					<div class="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
						<input
							type="text"
							bind:value={newAnchorTitle}
							placeholder="Add new reference anchor (e.g. Gordon Willis)..."
							class="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
						/>
						<select
							bind:value={newAnchorType}
							class="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-neutral-300 font-mono focus:outline-none focus:border-amber-500/60"
						>
							<option value="Human">Human</option>
							<option value="Hybrid">Hybrid</option>
							<option value="AI">AI Default</option>
						</select>
						<button
							type="button"
							onclick={addAnchor}
							disabled={!newAnchorTitle.trim()}
							class="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
							title="Add anchor"
						>
							<Plus class="w-3.5 h-3.5" />
						</button>
					</div>
				</div>

				<!-- Demoted Anchors (Taste Maturation) -->
				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
					<div class="flex items-center justify-between border-b border-neutral-800/80 pb-2">
						<span class="font-bold text-amber-400 uppercase text-[11px] font-mono">
							Demoted Anchors ({demotedAnchors.length})
						</span>
						<span class="text-[10px] text-neutral-500 font-mono">Taste Maturation Record</span>
					</div>

					<!-- Demoted Items -->
					<div class="space-y-2 max-h-56 overflow-y-auto pr-1">
						{#each demotedAnchors as d (d.id)}
							<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 text-[11px] space-y-1">
								<div class="flex items-center justify-between gap-2">
									<strong class="text-neutral-200 truncate">{d.title}</strong>
									<button
										type="button"
										onclick={() => removeDemotedAnchor(d.id)}
										class="text-neutral-500 hover:text-rose-400 transition cursor-pointer p-0.5 shrink-0"
										title="Delete demoted anchor record"
									>
										<Trash2 class="w-3 h-3" />
									</button>
								</div>
								<p class="text-neutral-400 italic font-serif leading-relaxed">"{d.rationale}"</p>
							</div>
						{/each}
					</div>

					<!-- Add Demoted Anchor Form -->
					<div class="space-y-1.5 pt-2 border-t border-neutral-800/80">
						<input
							type="text"
							bind:value={newDemotedTitle}
							placeholder="Anchor to demote (e.g. Neon City Silhouette)..."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
						/>
						<div class="flex items-center gap-2">
							<input
								type="text"
								bind:value={newDemotedRationale}
								placeholder="What do you now see? (e.g. Substituted atmospheric surface for structure)..."
								class="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
							/>
							<button
								type="button"
								onclick={addDemotedAnchor}
								disabled={!newDemotedTitle.trim() || !newDemotedRationale.trim()}
								class="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
							>
								Record Demotion
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Anchor Audit Critique Result -->
			{#if anchorCritique || isCheckingAnchors || anchorError}
				<div class="pt-2">
					<LlmCritiqueCard
						result={anchorCritique}
						loading={isCheckingAnchors}
						error={anchorError}
						title="Curatorial Theorist: Anchor Ratio & Demotion Sentinel"
						actions={anchorActions}
						onDismiss={() => (anchorCritique = null)}
						onRetry={runAnchorAudit}
					/>

					{#if anchorCritique?.anchorAudit}
						{@const aa = anchorCritique.anchorAudit}
						<div class="mt-2.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 text-xs">
							<!-- Ratio Status Badge -->
							<div class="flex items-center justify-between">
								<span
									class="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border {aa.ratioStatus === 'COMPLIANT_HUMAN_HEAVY' || aa.ratioStatus === 'COMPLIANT_BALANCED'
										? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
										: 'bg-rose-500/20 text-rose-300 border-rose-500/40'}"
								>
									Status: {aa.ratioStatus.replace(/_/g, ' ')} ({aa.humanPercentage}% Human)
								</span>
							</div>

							<!-- Maturation Assessment -->
							<div class="space-y-1">
								<strong class="text-neutral-400 font-mono text-[10px] uppercase block">Demotion Maturation Assessment:</strong>
								<p class="text-neutral-200 leading-relaxed font-sans">{aa.maturationAssessment}</p>
							</div>

							<!-- Homogenisation Warning -->
							{#if aa.homogenisationWarning}
								<div class="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/40 text-rose-300 space-y-1 text-[11px]">
									<strong class="text-rose-400 font-mono text-[10px] uppercase block">Dataset Collapse Warning:</strong>
									<p class="leading-relaxed">{aa.homogenisationWarning}</p>
								</div>
							{/if}

							<!-- Recommended Human Master Anchor -->
							{#if aa.recommendedHumanAnchor}
								<div class="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 space-y-1 text-[11px]">
									<strong class="text-emerald-400 font-mono text-[10px] uppercase block">Prescribed Human Benchmark:</strong>
									<p class="font-serif italic text-xs leading-relaxed">"{aa.recommendedHumanAnchor}"</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>

	<!-- TAB 4: Reverse-Direction Challenge -->
	{:else if activeSubTab === 'reverse'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The Reverse-Direction Challenge (Module 11):</strong>
				Take an output that you previously rejected. Author a new premise and brief where its specific "flaws" become purposeful strengths.
				This separates personal taste from directorial range.
			</div>

			<div class="space-y-3 text-xs">
				<div>
					<label for="rev-art" class="block font-medium text-neutral-300 mb-1">Rejected Artifact / Passage:</label>
					<input
						id="rev-art"
						type="text"
						bind:value={rejectedArtifact}
						placeholder="e.g. Overly flat, stiffly staged figures with harsh lighting"
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
					/>
				</div>
				<div>
					<label for="rev-flaw" class="block font-medium text-neutral-300 mb-1">Original Diagnosed Flaw:</label>
					<input
						id="rev-flaw"
						type="text"
						bind:value={observedFlaw}
						placeholder="e.g. Lacks naturalism; feels like an awkward historical diorama"
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
					/>
				</div>
				<div>
					<label for="rev-brief" class="block font-medium text-amber-400 mb-1">New Brief Where This Flaw Is the Primary Strength:</label>
					<textarea
						id="rev-brief"
						rows="3"
						bind:value={newBriefWhereFlawIsStrength}
						placeholder="e.g. A satire of institutional bureaucracy where unnatural stiffness and harsh unyielding lighting represent emotional alienation..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60 font-sans"
					></textarea>
				</div>
			</div>

			<!-- Action Buttons & LLM Trigger -->
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
				<div class="flex items-center gap-2">
					<LlmTriggerButton
						label="Audit Reverse Brief"
						onclick={runReverseBriefCoach}
						loading={isCheckingReverse}
						disabled={!rejectedArtifact.trim() || !newBriefWhereFlawIsStrength.trim()}
						title="Audits whether the flaw is elevated into an indispensable structural expressive virtue"
					/>
				</div>

				<div class="flex items-center gap-3">
					{#if reverseBriefSaved}
						<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
							<CheckCircle2 class="w-4 h-4" />
							Reverse Brief saved to Logbook Briefs!
						</span>
					{/if}
					<button
						type="button"
						onclick={commitReverseBrief}
						class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-2 cursor-pointer"
					>
						<CheckCircle2 class="w-3.5 h-3.5" />
						<span>Save Reverse Brief to Logbook</span>
					</button>
				</div>
			</div>

			<!-- Reverse Brief Critique Card & Callout -->
			{#if reverseCritique || isCheckingReverse || reverseError}
				<div class="pt-2">
					<LlmCritiqueCard
						result={reverseCritique}
						loading={isCheckingReverse}
						error={reverseError}
						title="Aesthetic Inversion Engineer: Reverse Brief Coach"
						actions={reverseActions}
						onDismiss={() => (reverseCritique = null)}
						onRetry={runReverseBriefCoach}
					/>

					{#if reverseCritique?.reverseBriefAudit}
						{@const ra = reverseCritique.reverseBriefAudit}
						<div class="mt-2.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 text-xs">
							<!-- Verdict Badge -->
							<div class="flex items-center justify-between">
								<span
									class="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border {ra.verdict === 'GENUINE_INVERSION'
										? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
										: ra.verdict === 'UNCONSTRAINED_ACCIDENT'
										? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
										: 'bg-rose-500/20 text-rose-300 border-rose-500/40'}"
								>
									Verdict: {ra.verdict.replace(/_/g, ' ')}
								</span>
							</div>

							<!-- Inversion Strength -->
							<div class="space-y-1">
								<strong class="text-neutral-400 font-mono text-[10px] uppercase block">Inversion Strength:</strong>
								<p class="text-neutral-200 leading-relaxed font-sans">{ra.inversionStrength}</p>
							</div>

							<!-- Prescribed Negative Constraints -->
							{#if ra.prescribedConstraints && ra.prescribedConstraints.length > 0}
								<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1.5">
									<strong class="text-amber-400 font-mono text-[10px] uppercase block">Prescribed Negative Constraints (Rejection Conditions):</strong>
									<ul class="space-y-1 text-neutral-300 list-disc list-inside text-[11px]">
										{#each ra.prescribedConstraints as c}
											<li>{c}</li>
										{/each}
									</ul>
								</div>
							{/if}

							<!-- Sharpened Reverse Brief Proposal -->
							{#if ra.sharpenedReverseBrief}
								<div class="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
									<strong class="text-amber-400 font-mono text-[10px] uppercase block">Authored Reverse Brief:</strong>
									<p class="font-serif italic text-xs leading-relaxed">"{ra.sharpenedReverseBrief}"</p>
								</div>
							{/if}

							<!-- Acceptance Criterion -->
							{#if ra.acceptanceCriterion}
								<div class="text-[11px] text-emerald-400 font-mono pt-1 border-t border-neutral-800">
									<strong>Binary Acceptance Criterion:</strong> {ra.acceptanceCriterion}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>

	<!-- TAB 5: Deliberate Practice Drill Reps -->
	{:else if activeSubTab === 'drills'}
		<div class="space-y-4">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
				<div>
					<strong class="text-neutral-200">Module 5 Deliberate Practice Drills:</strong> Blind curation, 5-part taste formulation, and reverse direction.
				</div>
				<div class="flex items-center gap-2 flex-wrap">
					<button
						type="button"
						onclick={() => (activeDrillId = 'blind-ranking')}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer {activeDrillId === 'blind-ranking'
							? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
							: 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Blind Ranking (15m)
					</button>
					<button
						type="button"
						onclick={() => (activeDrillId = 'm5-taste-builder')}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer {activeDrillId === 'm5-taste-builder'
							? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
							: 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Taste Formula (10m)
					</button>
					<button
						type="button"
						onclick={() => (activeDrillId = 'm5-reverse-brief')}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer {activeDrillId === 'm5-reverse-brief'
							? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
							: 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Reverse Brief (15m)
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

	<!-- Recent M5 Decisions History Table -->
	{#if m5Decisions.length > 0}
		<div class="mt-8 pt-6 border-t border-neutral-800/80 space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<History class="w-4 h-4 text-amber-400" />
					<h3 class="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono">
						Recent Taste & Curation Decisions ({m5Decisions.length})
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
						{#each m5Decisions as d (d.id)}
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

	<!-- Full Text Reading Modal for M5 Ingestion -->
	{#if activeReadingForModal}
		<ReadingModal
			reading={activeReadingForModal}
			isOpen={!!activeReadingForModal}
			onClose={() => activeReadingForModal = null}
			onSelectReading={(r) => activeReadingForModal = r}
		/>
	{/if}
</div>
