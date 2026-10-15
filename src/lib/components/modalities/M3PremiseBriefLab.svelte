<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { Brief } from '$lib/schemas/course.schema';
	import { FileText, Sliders, ShieldCheck, CheckCircle2, ArrowRight, Target, Sparkles, Wand2, AlertTriangle, Plus } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import { getDrillById } from '$lib/data/drills';
	import { LlmTriggerButton, LlmCritiqueCard } from '$lib/components/llm';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let activeTab = $state<'drill' | 'premise' | 'brief' | 'constraints' | 'provenance'>('brief');
	let briefSavedNotice = $state(false);
	let freeformMode = $state(false);
	let freeformBriefText = $state('');

	// Active drill for M3
	let activeDrillId = $state<'sentence-surgery' | 'compression'>('sentence-surgery');
	let activeDrill = $derived(getDrillById(activeDrillId));

	// Premise Matrix state
	let candidate1 = $state('');
	let candidate2 = $state('');
	let candidate3 = $state('');
	let selectedPremise = $state(1);
	let rejectionReason1 = $state('');
	let rejectionReason2 = $state('');
	let rejectionReason3 = $state('');

	// 7-Layer Brief Builder state
	let briefTitle = $state('');
	let briefPremise = $state('');
	let briefIntention = $state('');
	let constraintsList = $state(['Single figure', 'Limited palette (2 hues)', 'High contrast focal entry']);
	let acceptanceList = $state(['Figure occupies <15% of frame', 'Brightest region away from center']);
	let rejectionConditionsList = $state(['Symmetrical framing', 'Generic atmospheric haze without structural function']);
	let newConstraint = $state('');
	let newAcceptance = $state('');
	let newRejectionCondition = $state('');

	// Provenance Stamp (Module 7)
	let provOrigin = $state('Noticed during transit walk in commercial center');
	let provHuman = $state('Chose the tension between public exposure and concealment. Authored 3 premises and 7-layer brief.');
	let provTool = $state('Generated 4 compositional drafts based on human structural sketch.');
	let provLicenses = $state('Personal reference; permissive tool terms.');

	function addConstraint() {
		if (newConstraint.trim()) {
			constraintsList.push(newConstraint.trim());
			newConstraint = '';
		}
	}

	function addAcceptance() {
		if (newAcceptance.trim()) {
			acceptanceList.push(newAcceptance.trim());
			newAcceptance = '';
		}
	}

	function addRejectionCondition() {
		if (newRejectionCondition.trim()) {
			rejectionConditionsList.push(newRejectionCondition.trim());
			newRejectionCondition = '';
		}
	}

	// Premise Triangulation LLM state
	let premiseCritique = $state<CritiqueResult | null>(null);
	let premiseLoading = $state(false);
	let premiseError = $state<string | null>(null);

	async function runPremiseTriangulation() {
		if (!candidate1.trim() && !candidate2.trim() && !candidate3.trim()) return;
		premiseLoading = true;
		premiseError = null;
		try {
			const res = await executePrompt('m3-premise-triangulation', {
				selected: selectedPremise,
				candidates: [candidate1.trim(), candidate2.trim(), candidate3.trim()],
				rejectionReasons: [rejectionReason1.trim(), rejectionReason2.trim(), rejectionReason3.trim()]
			});
			premiseCritique = res;
		} catch (err: any) {
			premiseError = err.message || 'Premise triangulation failed';
		} finally {
			premiseLoading = false;
		}
	}

	let premiseActions = $derived.by<LlmAction[]>(() => {
		const actions: LlmAction[] = [];
		const tri = premiseCritique?.premiseTriangulation;
		if (!tri) return actions;

		if (tri.recommendedPremise) {
			const recIdx = tri.recommendedPremise;
			const candidateMap = [candidate1, candidate2, candidate3];
			const chosenText = candidateMap[recIdx - 1];
			actions.push({
				id: 'adopt-recommended-premise',
				label: `Adopt Recommended Premise (Candidate ${recIdx})`,
				primary: true,
				icon: Target,
				onClick: () => {
					selectedPremise = recIdx;
					if (chosenText?.trim()) {
						briefPremise = chosenText.trim();
					}
				}
			});
		}

		if (tri.sharpenedPremises && (tri.sharpenedPremises.premise1 || tri.sharpenedPremises.premise2 || tri.sharpenedPremises.premise3)) {
			actions.push({
				id: 'apply-sharpened-trio',
				label: 'Apply Sharpened Premise Trio',
				variant: 'secondary',
				icon: Wand2,
				onClick: () => {
					if (tri.sharpenedPremises?.premise1) candidate1 = tri.sharpenedPremises.premise1;
					if (tri.sharpenedPremises?.premise2) candidate2 = tri.sharpenedPremises.premise2;
					if (tri.sharpenedPremises?.premise3) candidate3 = tri.sharpenedPremises.premise3;
					const updatedMap = [candidate1, candidate2, candidate3];
					if (updatedMap[selectedPremise - 1]?.trim()) {
						briefPremise = updatedMap[selectedPremise - 1].trim();
					}
				}
			});
		}

		return actions;
	});

	// 7-Layer Brief Redline LLM state
	let briefCritique = $state<CritiqueResult | null>(null);
	let briefLoading = $state(false);
	let briefError = $state<string | null>(null);

	async function runBriefRedline() {
		briefLoading = true;
		briefError = null;
		try {
			const res = await executePrompt('m3-brief-redline', {
				title: briefTitle.trim() || 'Untitled Creative Project',
				premise: briefPremise.trim() || (candidate1 || candidate2 || candidate3 || 'Unstated premise'),
				intention: freeformMode ? freeformBriefText.slice(0, 300) : (briefIntention.trim() || 'Unstated intention'),
				constraints: freeformMode ? [freeformBriefText] : constraintsList,
				acceptanceCriteria: acceptanceList,
				rejectionConditions: rejectionConditionsList
			});
			briefCritique = res;
		} catch (err: any) {
			briefError = err.message || 'Brief redline audit failed';
		} finally {
			briefLoading = false;
		}
	}

	let briefActions = $derived.by<LlmAction[]>(() => {
		const actions: LlmAction[] = [];
		const redline = briefCritique?.briefRedline;
		if (!redline) return actions;

		if (redline.suggestedConstraints?.length || redline.suggestedNegativeRejections?.length) {
			actions.push({
				id: 'inject-hardened-items',
				label: `Inject Hardened Constraints & Rejections (${(redline.suggestedConstraints?.length || 0) + (redline.suggestedNegativeRejections?.length || 0)})`,
				primary: true,
				icon: Wand2,
				onClick: () => {
					if (freeformMode) {
						let additions = '\n\n### Hardened Specifications (From Editorial Redline)\n';
						if (redline.suggestedConstraints?.length) {
							additions += '\n#### Injected Operational Constraints:\n' + redline.suggestedConstraints.map(c => `- ${c}`).join('\n');
						}
						if (redline.suggestedNegativeRejections?.length) {
							additions += '\n#### Injected Negative Rejection Conditions:\n' + redline.suggestedNegativeRejections.map(r => `- ${r}`).join('\n');
						}
						freeformBriefText += additions;
					} else {
						if (redline.suggestedConstraints?.length) {
							for (const c of redline.suggestedConstraints) {
								if (!constraintsList.includes(c)) {
									constraintsList.push(c);
								}
							}
						}
						if (redline.suggestedNegativeRejections?.length) {
							for (const r of redline.suggestedNegativeRejections) {
								if (!rejectionConditionsList.includes(r)) {
									rejectionConditionsList.push(r);
								}
							}
						}
					}
				}
			});
		}

		if (redline.hardenedIntention && !freeformMode) {
			actions.push({
				id: 'adopt-hardened-intention',
				label: 'Adopt Hardened Intention',
				variant: 'secondary',
				icon: ShieldCheck,
				onClick: () => {
					if (redline.hardenedIntention) {
						briefIntention = redline.hardenedIntention;
					}
				}
			});
		}

		return actions;
	});

	function saveBrief() {
		if (freeformMode) {
			if (!briefTitle.trim() || !freeformBriefText.trim()) return;
			practiceStore.saveBrief({
				title: briefTitle.trim(),
				premise: briefPremise.trim() || 'Freeform authoring',
				intention: 'Authored under Layer 2 Scaffolding Removal',
				constraints: [freeformBriefText.slice(0, 100) + '...'],
				references: [],
				acceptanceCriteria: ['Satisfies authored freeform specification'],
				rejectionConditions: ['Violates authored freeform specification'],
				risksAndUnknowns: [],
				provenance: {
					origin: provOrigin,
					humanContribution: freeformBriefText,
					toolContribution: provTool,
					licenses: provLicenses
				}
			});
			briefSavedNotice = true;
			setTimeout(() => briefSavedNotice = false, 3000);
			return;
		}

		if (!briefTitle.trim() || !briefPremise.trim()) return;

		practiceStore.saveBrief({
			title: briefTitle.trim(),
			premise: briefPremise.trim(),
			intention: briefIntention.trim() || 'Create tension between figure presence and spatial isolation.',
			constraints: constraintsList,
			references: [
				{
					name: 'Whistler Nocturne',
					borrowedPrinciple: 'Narrow mid-tone range with small structural high-contrast focal',
					scale: 'Global composition',
					whatBreaksIfRemoved: 'Focal hierarchy dissolves into uniform atmosphere',
					whatNotToCopy: 'Period styling and subject matter'
				}
			],
			acceptanceCriteria: acceptanceList,
			rejectionConditions: rejectionConditionsList,
			risksAndUnknowns: ['Risk of figure appearing static if contrast is too centered'],
			provenance: {
				origin: provOrigin,
				humanContribution: provHuman,
				toolContribution: provTool,
				licenses: provLicenses
			}
		});

		briefSavedNotice = true;
		setTimeout(() => briefSavedNotice = false, 3000);
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M3
				</span>
				<h2 class="text-base font-bold text-white">Premise Forge, Brief Architect & Provenance Ledger</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 5, 6, V2, W2, Module 7: Premise Viability, Constraint Tri-View, and Provenance Stamp.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs flex-wrap">
			<button
				type="button"
				onclick={() => activeTab = 'drill'}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeTab === 'drill' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				<span class="flex items-center gap-1.5">
					<Target class="w-3.5 h-3.5" />
					<span>Drills</span>
				</span>
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'premise'}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeTab === 'premise' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Premise Forge
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'brief'}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeTab === 'brief' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				7-Layer Brief
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'constraints'}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeTab === 'constraints' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Constraints (3/6/10)
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'provenance'}
				class="px-3 py-1.5 rounded-lg transition cursor-pointer {activeTab === 'provenance' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Provenance Stamp
			</button>
		</div>
	</div>

	<!-- TAB 0: Drill Runner -->
	{#if activeTab === 'drill'}
		<div class="space-y-4">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs">
				<span class="text-neutral-400 font-medium">Select M3 Micro-Drill:</span>
				<div class="flex items-center gap-1.5 flex-wrap">
					<button
						type="button"
						onclick={() => activeDrillId = 'sentence-surgery'}
						class="px-2.5 py-1 rounded-lg font-mono transition cursor-pointer {activeDrillId === 'sentence-surgery' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}"
					>
						Sentence Surgery
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'compression'}
						class="px-2.5 py-1 rounded-lg font-mono transition cursor-pointer {activeDrillId === 'compression' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}"
					>
						Writing Compression
					</button>
				</div>
			</div>
			{#if activeDrill}
				<DrillRunner drill={activeDrill} />
			{/if}
		</div>

	<!-- TAB 1: Premise Forge & Rejection Matrix -->
	{:else if activeTab === 'premise'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The Premise Forge (Module 5):</strong>
				A topic (<em>"Loneliness in cities"</em>) is not a premise. A premise is a proposition with tension (<em>"Physical proximity and psychological isolation increase together"</em>).
				You must generate 3 premises and commit explicit rejection logic for the unselected ones.
			</div>

			<div class="space-y-3">
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-neutral-200">Candidate Premise 1</span>
						<button
							type="button"
							onclick={() => selectedPremise = 1}
							class="text-xs px-2.5 py-1 rounded-md transition {selectedPremise === 1 ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-900 text-neutral-400'}"
						>
							{selectedPremise === 1 ? 'Selected' : 'Select'}
						</button>
					</div>
					<input
						type="text"
						bind:value={candidate1}
						placeholder="Proposition with tension..."
						class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100"
					/>
					{#if selectedPremise !== 1}
						<input
							type="text"
							bind:value={rejectionReason1}
							placeholder="Rejection reason: What did this premise lack?"
							class="w-full bg-neutral-900/50 border border-neutral-800/60 rounded-lg px-2.5 py-1 text-[11px] text-neutral-400"
						/>
					{/if}
				</div>

				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-neutral-200">Candidate Premise 2</span>
						<button
							type="button"
							onclick={() => selectedPremise = 2}
							class="text-xs px-2.5 py-1 rounded-md transition cursor-pointer {selectedPremise === 2 ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-900 text-neutral-400'}"
						>
							{selectedPremise === 2 ? 'Selected' : 'Select'}
						</button>
					</div>
					<input
						type="text"
						bind:value={candidate2}
						placeholder="Proposition with tension..."
						class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100"
					/>
					{#if selectedPremise !== 2}
						<input
							type="text"
							bind:value={rejectionReason2}
							placeholder="Rejection reason: What did this premise lack?"
							class="w-full bg-neutral-900/50 border border-neutral-800/60 rounded-lg px-2.5 py-1 text-[11px] text-neutral-400"
						/>
					{/if}
				</div>

				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-neutral-200">Candidate Premise 3</span>
						<button
							type="button"
							onclick={() => selectedPremise = 3}
							class="text-xs px-2.5 py-1 rounded-md transition cursor-pointer {selectedPremise === 3 ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-900 text-neutral-400'}"
						>
							{selectedPremise === 3 ? 'Selected' : 'Select'}
						</button>
					</div>
					<input
						type="text"
						bind:value={candidate3}
						placeholder="Proposition with tension..."
						class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100"
					/>
					{#if selectedPremise !== 3}
						<input
							type="text"
							bind:value={rejectionReason3}
							placeholder="Rejection reason: What did this premise lack?"
							class="w-full bg-neutral-900/50 border border-neutral-800/60 rounded-lg px-2.5 py-1 text-[11px] text-neutral-400"
						/>
					{/if}
				</div>

				<!-- Premise Triangulation LLM Panel -->
				<div class="space-y-3 pt-3 border-t border-neutral-800">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
						<div class="text-[11px] text-neutral-400 font-mono">
							<span>Triangulation: {candidate1 || candidate2 || candidate3 ? 'Ready to evaluate 3 rivals' : 'Enter 3 candidate premises'}</span>
						</div>

						<LlmTriggerButton
							label="Triangulate 3 Rivals & Rejection Logic"
							onclick={runPremiseTriangulation}
							loading={premiseLoading}
							disabled={!candidate1.trim() && !candidate2.trim() && !candidate3.trim()}
							title="Audit divergence, validate rejection soundness, and sharpen propositions"
						/>
					</div>

					<LlmCritiqueCard
						result={premiseCritique}
						loading={premiseLoading}
						error={premiseError}
						title="Dialectical Dramaturg (Premise Triangulation)"
						actions={premiseActions}
						onDismiss={() => { premiseCritique = null; }}
						onRetry={runPremiseTriangulation}
					/>
				</div>
			</div>
		</div>

	<!-- TAB 2: 7-Layer Brief Architect -->
	{:else if activeTab === 'brief'}
		<div class="space-y-4">
			{#if !practiceStore.scaffolding.template}
				<div class="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-center justify-between gap-2">
					<div class="flex items-center gap-2">
						<Sliders class="w-4 h-4 text-amber-400 shrink-0" />
						<span><strong>Layer 1 Scaffolding Removed:</strong> In Part III+, rigid brief forms are removed to test your unassisted specification skill.</span>
					</div>
					<button
						type="button"
						onclick={() => freeformMode = !freeformMode}
						class="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-neutral-900 border border-neutral-700 text-amber-400 hover:bg-neutral-800 transition cursor-pointer"
					>
						{freeformMode ? 'Guided Form Mode' : 'Blank Brief Composer'}
					</button>
				</div>
			{/if}

			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The 7-Layer Brief Stack (Module 6):</strong>
				Brief first, generation second. Every brief defines: Premise, Intention, Constraints, References, Acceptance Criteria, Rejection Conditions, and Risks.
			</div>

			{#if freeformMode}
				<!-- Freeform Composer when scaffolding removed -->
				<div class="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
					<div class="flex items-center justify-between">
						<span class="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Unassisted Markdown Brief Composer</span>
						<span class="text-neutral-500 font-mono text-[10px]">Author from first principles</span>
					</div>

					<div>
						<label for="fb-title" class="block font-medium text-neutral-300 mb-1">Project Title:</label>
						<input id="fb-title" type="text" bind:value={briefTitle} placeholder="e.g. Urban Exposure Series" class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
					</div>

					<div>
						<label for="fb-premise" class="block font-medium text-neutral-300 mb-1">Core Premise & Tension:</label>
						<input id="fb-premise" type="text" bind:value={briefPremise} placeholder="e.g. Intimacy under public surveillance" class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
					</div>

					<div>
						<label for="fb-content" class="block font-medium text-neutral-300 mb-1">Full 7-Layer Markdown Specification:</label>
						<textarea
							id="fb-content"
							rows="10"
							bind:value={freeformBriefText}
							placeholder="## 1. Intention&#10;...&#10;&#10;## 2. Constraints&#10;- Negative constraint: ...&#10;- Format: ...&#10;&#10;## 3. References & Mechanisms&#10;...&#10;&#10;## 4. Acceptance Criteria&#10;- [ ] ...&#10;&#10;## 5. Rejection Conditions&#10;- ...&#10;&#10;## 6. Risks & Unknowns&#10;..."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-100 font-mono text-xs leading-relaxed"
						></textarea>
					</div>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
					<div>
						<label for="b-title" class="block font-medium text-neutral-300 mb-1">Project Title:</label>
						<input id="b-title" type="text" bind:value={briefTitle} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
					</div>
					<div>
						<label for="b-premise" class="block font-medium text-neutral-300 mb-1">1. Premise:</label>
						<input id="b-premise" type="text" bind:value={briefPremise} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
					</div>
				</div>

				<div class="space-y-2">
					<label for="b-intent" class="block text-xs font-medium text-neutral-300">2. Intention (What the work causes):</label>
					<input id="b-intent" type="text" bind:value={briefIntention} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100" />
				</div>

				<!-- Constraints list -->
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
					<div class="font-bold text-neutral-200">3. Constraints ({constraintsList.length}):</div>
					<div class="flex flex-wrap gap-1.5">
						{#each constraintsList as c, i}
							<span class="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
								{c}
								<button type="button" onclick={() => constraintsList.splice(i, 1)} class="text-neutral-500 hover:text-red-400">×</button>
							</span>
						{/each}
					</div>
					<div class="flex gap-2 pt-1">
						<input
							type="text"
							bind:value={newConstraint}
							placeholder="Add specific constraint..."
							class="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200"
						/>
						<button type="button" onclick={addConstraint} class="px-3 py-1 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer">
							Add
						</button>
					</div>
				</div>

				<!-- Acceptance criteria list -->
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
					<div class="font-bold text-neutral-200">5. Checkable Acceptance Criteria ({acceptanceList.length}):</div>
					<div class="flex flex-wrap gap-1.5">
						{#each acceptanceList as a, i}
							<span class="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
								{a}
								<button type="button" onclick={() => acceptanceList.splice(i, 1)} class="text-neutral-500 hover:text-red-400">×</button>
							</span>
						{/each}
					</div>
					<div class="flex gap-2 pt-1">
						<input
							type="text"
							bind:value={newAcceptance}
							placeholder="Add checkable criterion (e.g. figure occupies <15% of frame)..."
							class="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200"
						/>
						<button type="button" onclick={addAcceptance} class="px-3 py-1 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer">
							Add
						</button>
					</div>
				</div>

				<!-- Rejection conditions list (Negative constraints) -->
				<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
					<div class="font-bold text-neutral-200">6. Negative Rejection Conditions ({rejectionConditionsList.length}):</div>
					<div class="flex flex-wrap gap-1.5">
						{#each rejectionConditionsList as r, i}
							<span class="px-2 py-0.5 rounded bg-red-950/40 border border-red-800/60 text-red-300 flex items-center gap-1.5">
								{r}
								<button type="button" onclick={() => rejectionConditionsList.splice(i, 1)} class="text-neutral-500 hover:text-red-400">×</button>
							</span>
						{/each}
					</div>
					<div class="flex gap-2 pt-1">
						<input
							type="text"
							bind:value={newRejectionCondition}
							placeholder="Add disqualifying condition (e.g. symmetrical framing, decorative haze)..."
							class="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200"
						/>
						<button type="button" onclick={addRejectionCondition} class="px-3 py-1 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer">
							Add
						</button>
					</div>
				</div>
			{/if}

			<!-- 7-Layer Creative Brief Redliner LLM Panel -->
			<div class="space-y-3 pt-3 border-t border-neutral-800">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div class="text-[11px] text-neutral-400 font-mono">
						<span>Specification check: {briefTitle.trim() || freeformBriefText.trim() ? 'Ready to redline' : 'Enter brief details'}</span>
					</div>

					<LlmTriggerButton
						label="Redline 7-Layer Creative Brief"
						onclick={runBriefRedline}
						loading={briefLoading}
						disabled={freeformMode ? !freeformBriefText.trim() : (!briefTitle.trim() && !briefPremise.trim())}
						title="Redline decorative adjectives, test binary acceptance criteria, and harden constraints"
					/>
				</div>

				<LlmCritiqueCard
					result={briefCritique}
					loading={briefLoading}
					error={briefError}
					title="Chief Specification Inquisitor (7-Layer Brief Redline)"
					actions={briefActions}
					onDismiss={() => { briefCritique = null; }}
					onRetry={runBriefRedline}
				/>
			</div>

			<div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
				<button
					type="button"
					onclick={saveBrief}
					disabled={freeformMode ? (!briefTitle.trim() || !freeformBriefText.trim()) : (!briefTitle.trim() || !briefPremise.trim())}
					class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow"
				>
					<CheckCircle2 class="w-4 h-4" />
					<span>Save Brief & Commit Provenance</span>
				</button>

				{#if briefSavedNotice}
					<span class="text-xs text-emerald-400 font-mono animate-in fade-in">
						✓ Brief & Provenance Saved to Ledger!
					</span>
				{/if}
			</div>
		</div>

	<!-- TAB 3: Constraint Density Tri-View -->
	{:else if activeTab === 'constraints'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Constraint Density Experiment (Module 6):</strong>
				Compare three versions of the brief: Open (3 constraints), Directed (6 constraints), and Severe (10 constraints). Feel where defaults end and overdetermination begins.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
					<span class="font-bold text-amber-400 text-[11px] uppercase tracking-wider">Open (3 Constraints)</span>
					<ul class="space-y-1 list-disc list-inside text-neutral-400 text-[11px]">
						<li>One figure</li>
						<li>Interior setting</li>
						<li>Natural light only</li>
					</ul>
					<p class="text-[10px] text-neutral-500 pt-2 border-t border-neutral-800">
						High risk of model default tropes. Leaves most decisions unmade.
					</p>
				</div>

				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-700 shadow-md space-y-2">
					<span class="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">Directed (6 Constraints)</span>
					<ul class="space-y-1 list-disc list-inside text-neutral-300 text-[11px]">
						<li>One figure in middle third</li>
						<li>Interior interrupted action</li>
						<li>Natural light from single high source</li>
						<li>No direct eye contact with viewer</li>
						<li>Frame slightly too tight for comfort</li>
						<li>Palette limited to two hues</li>
					</ul>
					<p class="text-[10px] text-neutral-400 pt-2 border-t border-neutral-800">
						Sweet spot: forces specific choices without paralyzing execution.
					</p>
				</div>

				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
					<span class="font-bold text-neutral-400 text-[11px] uppercase tracking-wider">Severe (10 Constraints)</span>
					<ul class="space-y-1 list-disc list-inside text-neutral-400 text-[11px]">
						<li>All 6 directed constraints +</li>
						<li>Hands must be visible and engaged</li>
						<li>Implied second presence out of frame</li>
						<li>Brightest value is not on the figure</li>
						<li>Zero cast shadows touching frame edge</li>
					</ul>
					<p class="text-[10px] text-neutral-500 pt-2 border-t border-neutral-800">
						Forces unexpected solutions, but risks becoming an arbitrary puzzle.
					</p>
				</div>
			</div>
		</div>

	<!-- TAB 4: Provenance Stamp (Module 7) -->
	{:else if activeTab === 'provenance'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Birth-of-Project Provenance Stamp (Module 7):</strong>
				Record human contribution at the moment decisions are made, not retroactively. Answers: <em>What did the human actually decide, transform, and refuse?</em>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
				<div>
					<label for="prov-orig" class="block font-medium text-neutral-300 mb-1">Premise Origin:</label>
					<input id="prov-orig" type="text" bind:value={provOrigin} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="prov-tool" class="block font-medium text-neutral-300 mb-1">Tool Contribution:</label>
					<input id="prov-tool" type="text" bind:value={provTool} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
			</div>

			<div class="space-y-1 text-xs">
				<label for="prov-human" class="block font-medium text-amber-400">Human Contribution (Most Important Field):</label>
				<textarea
					id="prov-human"
					rows="3"
					bind:value={provHuman}
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed"
				></textarea>
			</div>
		</div>
	{/if}
</div>
