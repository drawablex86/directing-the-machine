<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { Brief } from '$lib/schemas/course.schema';
	import { FileText, Sliders, ShieldCheck, CheckCircle2, ArrowRight } from '@lucide/svelte';

	let activeTab = $state<'premise' | 'brief' | 'constraints' | 'provenance'>('premise');

	// Premise Matrix state
	let candidate1 = $state('');
	let candidate2 = $state('');
	let candidate3 = $state('');
	let selectedPremise = $state(1);
	let rejectionReason1 = $state('');
	let rejectionReason2 = $state('');

	// 7-Layer Brief Builder state
	let briefTitle = $state('');
	let briefPremise = $state('');
	let briefIntention = $state('');
	let constraintsList = $state(['Single figure', 'Limited palette (2 hues)', 'High contrast focal entry']);
	let acceptanceList = $state(['Figure occupies <15% of frame', 'Brightest region away from center']);
	let rejectionConditionsList = $state(['Symmetrical framing', 'Generic atmospheric haze without structural function']);
	let newConstraint = $state('');
	let newAcceptance = $state('');

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

	function saveBrief() {
		if (!briefTitle.trim() || !briefPremise.trim()) return;

		const newBrief: Brief = {
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
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
		};

		practiceStore.briefs.unshift(newBrief);
		practiceStore.saveToStorage();
		briefTitle = '';
		briefPremise = '';
		briefIntention = '';
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
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeTab = 'premise'}
				class="px-3 py-1.5 rounded-lg transition {activeTab === 'premise' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Premise Forge
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'brief'}
				class="px-3 py-1.5 rounded-lg transition {activeTab === 'brief' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				7-Layer Brief
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'constraints'}
				class="px-3 py-1.5 rounded-lg transition {activeTab === 'constraints' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Constraints (3/6/10)
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'provenance'}
				class="px-3 py-1.5 rounded-lg transition {activeTab === 'provenance' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Provenance Stamp
			</button>
		</div>
	</div>

	<!-- TAB 1: Premise Forge & Rejection Matrix -->
	{#if activeTab === 'premise'}
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
							class="text-xs px-2.5 py-1 rounded-md transition {selectedPremise === 2 ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-900 text-neutral-400'}"
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
			</div>
		</div>

	<!-- TAB 2: 7-Layer Brief Architect -->
	{:else if activeTab === 'brief'}
		<div class="space-y-4">
			{#if !practiceStore.scaffolding.template}
				<div class="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs text-amber-300">
					Scaffolding Removal Active: In Part III+, pre-structured brief forms are removed to test your ability to author briefs from first principles.
				</div>
			{/if}

			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The 7-Layer Brief Stack (Module 6):</strong>
				Brief first, generation second. Every brief defines: Premise, Intention, Constraints, References, Acceptance Criteria, Rejection Conditions, and Risks.
			</div>

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
					<button type="button" onclick={addConstraint} class="px-3 py-1 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200">
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
					<button type="button" onclick={addAcceptance} class="px-3 py-1 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200">
						Add
					</button>
				</div>
			</div>

			<button
				type="button"
				onclick={saveBrief}
				disabled={!briefTitle.trim() || !briefPremise.trim()}
				class="w-full py-2.5 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition flex items-center justify-center gap-2"
			>
				<CheckCircle2 class="w-4 h-4" />
				<span>Save Brief & Commit Provenance</span>
			</button>
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
