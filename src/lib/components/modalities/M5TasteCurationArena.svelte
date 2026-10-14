<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { Sparkles, EyeOff, Award, RotateCcw, CheckCircle, ArrowRight } from '@lucide/svelte';

	let activeSubTab = $state<'tasteFormula' | 'blindRanker' | 'anchors' | 'reverse'>('tasteFormula');

	// 5-Part Taste Formula
	let tastePreference = $state('');
	let tasteCriteria = $state('');
	let tasteRefClass = $state('');
	let tasteMechanism = $state('');
	let tastePurpose = $state('');

	// Blind Ranker state
	let provenanceRevealed = $state(false);
	const mockWorks = $state([
		{ id: 1, title: 'Study 01: Low-Key Corridor', actualType: 'Human Reference (Gordon Willis)', rank: 1, userCriteria: 'Values cluster in bottom third, light serves narrative suspense' },
		{ id: 2, title: 'Study 02: Neon Alley Reflection', actualType: 'AI Default Generation (Midjourney v6)', rank: 2, userCriteria: 'Atmospheric but generic centering trope' },
		{ id: 3, title: 'Study 03: Editorial Portrait', actualType: 'Hybrid Direction (Authored ControlNet + Hand Paint)', rank: 3, userCriteria: 'Controlled gaze line with custom cast shadow' },
		{ id: 4, title: 'Study 04: Minimalist Interior', actualType: 'Human Anchor (Vilhelm Hammershøi)', rank: 4, userCriteria: 'Radical stillness through muted color harmony' }
	]);

	// Reverse Direction Challenge
	let rejectedArtifact = $state('');
	let observedFlaw = $state('');
	let newBriefWhereFlawIsStrength = $state('');
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
		</div>

	<!-- TAB 2: Blind Provenance Ranker -->
	{:else if activeSubTab === 'blindRanker'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Blind Provenance Curation Arena (Module 11):</strong>
				Provenance is hidden. Rank the artifacts and commit your written criteria <strong>first</strong>.
				Only then reveal whether the work was human handcraft, model default, or hybrid authored direction.
			</div>

			<div class="space-y-2">
				{#each mockWorks as work, idx}
					<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="font-mono font-bold text-amber-400">#{idx + 1}</span>
								<span class="font-bold text-neutral-200">{work.title}</span>
							</div>
							<div class="text-[11px] text-neutral-400 italic">
								Criteria: "{work.userCriteria}"
							</div>
						</div>

						<div class="flex items-center gap-2 self-end sm:self-auto">
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

			<button
				type="button"
				onclick={() => provenanceRevealed = !provenanceRevealed}
				class="w-full py-2.5 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center justify-center gap-2"
			>
				<span>{provenanceRevealed ? 'Hide Provenance Labels' : 'Reveal Provenance (Check Calibration Gap)'}</span>
			</button>
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
		</div>
	{/if}
</div>
