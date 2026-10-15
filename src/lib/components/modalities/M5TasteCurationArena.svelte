<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { Sparkles, EyeOff, Award, RotateCcw, CheckCircle, ArrowRight, Target, CheckCircle2 } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import { getDrillById } from '$lib/data/drills';

	let activeSubTab = $state<'tasteFormula' | 'blindRanker' | 'anchors' | 'reverse' | 'drills'>('tasteFormula');
	let activeDrillId = $state<'blind-ranking' | 'm5-taste-builder' | 'm5-reverse-brief'>('blind-ranking');
	let activeDrill = $derived(getDrillById(activeDrillId));

	let formulaSaved = $state(false);
	let rankingSaved = $state(false);
	let reverseBriefSaved = $state(false);

	// 5-Part Taste Formula
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
		setTimeout(() => formulaSaved = false, 3000);
	}

	// Blind Ranker state
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
			alternativesRejected: `Subordinate rank candidates: ${mockWorks.slice(2).map(w => w.title).join(', ')}`,
			justification: mockWorks.map((w, i) => `#${i + 1} ${w.title}: ${w.userCriteria}`).join(' | '),
			feedbackIncorporated: `Actual revealed provenances: ${mockWorks.map((w) => `${w.title} (${w.actualType})`).join(', ')}`,
			refusals: 'Refused evaluation bias from author/tool brand labels'
		});
		rankingSaved = true;
		setTimeout(() => rankingSaved = false, 3000);
	}

	// Reverse Direction Challenge
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
		setTimeout(() => reverseBriefSaved = false, 3000);
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M5
				</span>
				<h2 class="text-base font-bold text-white">Taste Infrastructure & Blind Curation Arena</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 10, V4, W4, 11: 5-Part Taste Builder, Blind Provenance Ranker, and Reverse-Direction Challenge.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeSubTab = 'tasteFormula'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'tasteFormula' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				5-Part Taste
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'blindRanker'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'blindRanker' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Blind Ranker
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'anchors'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'anchors' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				≥40% Anchors
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'reverse'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'reverse' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Reverse Challenge
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
					<input id="tf-pref" type="text" bind:value={tastePreference} placeholder="I am drawn to this high-contrast frame..." class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="tf-crit" class="block font-medium text-neutral-300 mb-1">2. Criteria (What explicit rules apply):</label>
					<input id="tf-crit" type="text" bind:value={tasteCriteria} placeholder="Must direct gaze in under 1 second without visual clutter..." class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="tf-ref" class="block font-medium text-neutral-300 mb-1">3. Reference Class (Compared against what):</label>
					<input id="tf-ref" type="text" bind:value={tasteRefClass} placeholder="Cinematic low-key noir lighting (Gordon Willis)..." class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="tf-mech" class="block font-medium text-neutral-300 mb-1">4. Mechanism (Why it works physically):</label>
					<input id="tf-mech" type="text" bind:value={tasteMechanism} placeholder="The single sliver of warm key light against 85% deep cool shadow..." class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
			</div>

			<div class="text-xs">
				<label for="tf-purp" class="block font-medium text-amber-400 mb-1">5. Purpose (Fitness for this specific project):</label>
				<input id="tf-purp" type="text" bind:value={tastePurpose} placeholder="Does it serve the tension of psychological concealment?" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
			</div>

			<div class="flex items-center justify-between pt-2">
				{#if formulaSaved}
					<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
						<CheckCircle2 class="w-4 h-4" />
						Formula committed to Decision Log!
					</span>
				{:else}
					<span></span>
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
									class="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-[11px] text-neutral-200"
								/>
							</div>
						</div>

						<div class="flex items-center gap-2 shrink-0">
							<div class="flex items-center gap-1">
								<button
									type="button"
									disabled={idx === 0}
									onclick={() => moveRank(idx, 'up')}
									class="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
									title="Move Up"
								>
									↑
								</button>
								<button
									type="button"
									disabled={idx === mockWorks.length - 1}
									onclick={() => moveRank(idx, 'down')}
									class="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
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
					onclick={() => provenanceRevealed = !provenanceRevealed}
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

	<!-- TAB 3: ≥40% Human Anchor Rule & Demotion -->
	{:else if activeSubTab === 'anchors'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The ≥40% Human-Anchor Rule & Demotion Workflow (Appendix E):</strong>
				At least 40% of anchors in any library must be verified human works to prevent model homogenization.
				As taste matures, actively <strong>demote</strong> 3 early anchors you previously admired and state what you now see.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
					<div class="font-bold text-emerald-400 uppercase text-[11px]">Active Anchors (≥40% Human)</div>
					<ul class="space-y-1.5 text-neutral-300">
						<li class="flex items-center justify-between">
							<span>Vilhelm Hammershøi (Interior with Quiet Light)</span>
							<span class="text-[10px] text-emerald-400 font-mono">Human (100%)</span>
						</li>
						<li class="flex items-center justify-between">
							<span>Gordon Willis (Godfather shadow values)</span>
							<span class="text-[10px] text-emerald-400 font-mono">Human (100%)</span>
						</li>
						<li class="flex items-center justify-between">
							<span>Authored Pipeline V2 (Cast shadow study)</span>
							<span class="text-[10px] text-amber-400 font-mono">Hybrid (50%)</span>
						</li>
					</ul>
				</div>

				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
					<div class="font-bold text-amber-400 uppercase text-[11px]">Demoted Anchors (Taste Maturation)</div>
					<div class="text-[11px] text-neutral-400 space-y-1">
						<strong class="text-neutral-300">Demoted:</strong> Neon City Rainy Silhouette.
						<p class="text-neutral-500 italic">"Demoted because the mood was borrowed from model dataset defaults; it substituted atmospheric surface for compositional purpose."</p>
					</div>
				</div>
			</div>
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
					<input id="rev-art" type="text" bind:value={rejectedArtifact} placeholder="e.g. Overly flat, stiffly staged figures with harsh lighting" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="rev-flaw" class="block font-medium text-neutral-300 mb-1">Original Diagnosed Flaw:</label>
					<input id="rev-flaw" type="text" bind:value={observedFlaw} placeholder="e.g. Lacks naturalism; feels like an awkward historical diorama" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="rev-brief" class="block font-medium text-amber-400 mb-1">New Brief Where This Flaw Is the Primary Strength:</label>
					<textarea id="rev-brief" rows="3" bind:value={newBriefWhereFlawIsStrength} placeholder="e.g. A satire of institutional bureaucracy where unnatural stiffness and harsh unyielding lighting represent emotional alienation..." class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed"></textarea>
				</div>
			</div>

			<div class="flex items-center justify-between pt-2">
				{#if reverseBriefSaved}
					<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
						<CheckCircle2 class="w-4 h-4" />
						Reverse Brief saved to Logbook Briefs!
					</span>
				{:else}
					<span></span>
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
						onclick={() => activeDrillId = 'blind-ranking'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'blind-ranking' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Blind Ranking (15m)
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'm5-taste-builder'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm5-taste-builder' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Taste Formula (10m)
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'm5-reverse-brief'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm5-reverse-brief' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
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
</div>
