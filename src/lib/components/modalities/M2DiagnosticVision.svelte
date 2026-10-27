<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { lintObservation } from '$lib/engine/adjective-linter';
	import { Eye, AlertTriangle, CheckCircle, Sliders, ArrowRight, Target, Wand2 } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import LabFrictionPrimer from '$lib/components/course/LabFrictionPrimer.svelte';
	import ReadingModal from '$lib/components/shell/ReadingModal.svelte';
	import type { CoreReading } from '$lib/data/core-readings';
	import { getDrillById } from '$lib/data/drills';
	import { LlmTriggerButton, LlmCritiqueCard } from '$lib/components/llm';
	import { executePrompt, applySurgicalPatches } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let activeReadingForModal = $state<CoreReading | null>(null);

	let activeTool = $state<'drill' | 'linter' | 'ladder' | 'canvas' | 'sixQuestions'>('drill');

	// Drill context — key drills for M2
	const zeroDrill = getDrillById('zero-adjective-linter');
	const ladderDrill = getDrillById('diagnostic-ladder-sequencer');
	const massingDrill = getDrillById('massing-sprint');

	// Active drill for Drill Runner tab
	let activeDrillId = $state<'zero-adjective-linter' | 'diagnostic-ladder-sequencer' | 'massing-sprint'>('zero-adjective-linter');
	let activeDrill = $derived(getDrillById(activeDrillId));

	// Linter text
	let observationText = $state('');
	let lintResult = $derived(lintObservation(observationText));

	// Semantic Linter LLM state
	let linterCritique = $state<CritiqueResult | null>(null);
	let linterLoading = $state(false);
	let linterError = $state<string | null>(null);

	async function runSemanticAudit() {
		if (!observationText.trim()) return;
		linterLoading = true;
		linterError = null;
		try {
			const res = await executePrompt('m2-semantic-linter', {
				text: observationText
			});
			linterCritique = res;
		} catch (err: any) {
			linterError = err.message || 'Semantic audit failed';
		} finally {
			linterLoading = false;
		}
	}

	let linterActions = $derived.by<LlmAction[]>(() => {
		const actions: LlmAction[] = [];
		if (linterCritique?.patches && linterCritique.patches.length > 0) {
			const patchCount = linterCritique.patches.length;
			actions.push({
				id: 'apply-patches',
				label: `Apply Structural Replacements (${patchCount})`,
				primary: true,
				icon: Wand2,
				onClick: () => {
					if (linterCritique?.patches) {
						observationText = applySurgicalPatches(observationText, linterCritique.patches);
					}
				}
			});
		}
		return actions;
	});

	// 6-Question Human Decision Audit
	let apparentIntent = $state('');
	let explicitDecisions = $state('');
	let defaultDecisions = $state('');
	let determiningDecision = $state('');
	let decisionMaker = $state('');
	let nextHumanDecision = $state('');

	// Diagnostic Ladder levels
	const ladderLevels = [
		{ level: 1, name: '1. Purpose / Intent', desc: 'Why does this work exist? Who is it for?' },
		{ level: 2, name: '2. Premise / Claim', desc: 'Is there genuine tension or proposition?' },
		{ level: 3, name: '3. Structure & Composition', desc: 'Massing, focal hierarchy, rhythm, order.' },
		{ level: 4, name: '4. Audience Effect', desc: 'Emotional, cognitive, or physical response.' },
		{ level: 5, name: '5. Construction & Logic', desc: 'Proportion, anatomy, paragraph coherence.' },
		{ level: 6, name: '6. Local Execution', desc: 'Material rendering, sentence clarity.' },
		{ level: 7, name: '7. Surface Polish', desc: 'Texture, finish, decorative flair.' }
	];

	let selectedLevel = $state(3);
	let causingDecision = $state('');
	let proposedTest = $state('');
	let acceptCondition = $state('');
	let showLadderOverride = $state(false);
	let diagnosticSavedNotice = $state(false);

	// Diagnostic Ladder LLM state
	let ladderCritique = $state<CritiqueResult | null>(null);
	let ladderLoading = $state(false);
	let ladderError = $state<string | null>(null);

	async function runLadderAudit() {
		if (!causingDecision.trim() || !proposedTest.trim()) return;
		ladderLoading = true;
		ladderError = null;
		try {
			const res = await executePrompt('m2-ladder-auditor', {
				selectedLevel,
				causingDecision,
				proposedTest
			});
			ladderCritique = res;
		} catch (err: any) {
			ladderError = err.message || 'Ladder audit failed';
		} finally {
			ladderLoading = false;
		}
	}

	let ladderActions = $derived.by<LlmAction[]>(() => {
		const actions: LlmAction[] = [];
		if (ladderCritique?.recommendedLevel && ladderCritique.recommendedLevel !== selectedLevel) {
			const recLvl = ladderCritique.recommendedLevel;
			const targetLvl = ladderLevels.find(l => l.level === recLvl);
			actions.push({
				id: 'promote-ladder-level',
				label: `Promote to Level ${recLvl}${targetLvl ? ` (${targetLvl.name.split('. ')[1]})` : ''}`,
				primary: true,
				icon: Target,
				onClick: () => {
					selectedLevel = recLvl;
				}
			});
		}
		return actions;
	});

	function saveDiagnosticSentence() {
		if (!causingDecision.trim() || !proposedTest.trim()) return;
		const lvlName = ladderLevels.find(l => l.level === selectedLevel)?.name || `Level ${selectedLevel}`;
		practiceStore.saveDecision({
			project: 'Diagnostic Vision (M2)',
			decision: `Highest Unresolved: ${lvlName} — Causing Decision: ${causingDecision.trim()}`,
			highestUnresolvedLevel: lvlName,
			alternativesRejected: 'Optimizing lower-level surface polish while higher structure was unresolved',
			justification: `Test: ${proposedTest.trim()} (Accept if: ${acceptCondition.trim() || 'Focal entry criteria met'})`,
			feedbackIncorporated: 'Canonical Diagnostic Ladder',
			refusals: 'Refused evaluative shortcuts and premature surface fixes'
		});
		diagnosticSavedNotice = true;
		setTimeout(() => diagnosticSavedNotice = false, 3000);
	}

	// Canvas massing state
	let canvasElement: HTMLCanvasElement | null = $state(null);
	let isDrawing = $state(false);
	let color = $state('#f59e0b');

	function startDrawing(e: MouseEvent) {
		if (!canvasElement) return;
		isDrawing = true;
		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;
		ctx.beginPath();
		ctx.moveTo(e.offsetX, e.offsetY);
	}

	function draw(e: MouseEvent) {
		if (!isDrawing || !canvasElement) return;
		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;
		ctx.strokeStyle = color;
		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
	}

	function stopDrawing() {
		isDrawing = false;
	}

	function clearCanvas() {
		if (!canvasElement) return;
		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Contextual Material Primer: Ingesting Theory Before Practice -->
	<LabFrictionPrimer
		modalityId="m2"
		primaryReadingCode="Module 1"
		failureMode="Relying on evaluative shortcuts ('it looks cool', 'cinematic lighting', 'too messy') and fixing surface artifacts while ignoring structural composition and narrative premises."
		directorialDiscipline="Enforce zero-adjective objective descriptions and traverse the Diagnostic Ladder from Level 1 (Premise/Focal Intent) downward before touching rendering polish."
		benchmarkPass="Describes spatial entry vectors, value masses, and specific causing decisions without evaluative adjectives."
		benchmarkFail="Uses adjectives ('beautiful composition', 'bad lighting') without observable physical evidence."
		onOpenFullReading={(r) => activeReadingForModal = r}
	/>

	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
					Observation Studio
				</span>
				<h2 class="text-base font-bold text-white">Diagnostic Vision & Precision Linter</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Filter out subjective buzzwords to write falsifiable visual briefs, diagnose root causes top-down, and balance composition.
			</p>
		</div>

		<!-- Tool Tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs flex-wrap">
			<button
				type="button"
				onclick={() => activeTool = 'drill'}
				class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 {activeTool === 'drill' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				<Target class="w-3 h-3" />
				<span>Practice Drills</span>
			</button>
			<button
				type="button"
				onclick={() => activeTool = 'linter'}
				class="px-3 py-1.5 rounded-lg transition {activeTool === 'linter' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Adjective Linter
			</button>
			<button
				type="button"
				onclick={() => activeTool = 'ladder'}
				class="px-3 py-1.5 rounded-lg transition {activeTool === 'ladder' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Diagnostic Ladder
			</button>
			<button
				type="button"
				onclick={() => activeTool = 'sixQuestions'}
				class="px-3 py-1.5 rounded-lg transition {activeTool === 'sixQuestions' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Decision Audit
			</button>
			<button
				type="button"
				onclick={() => activeTool = 'canvas'}
				class="px-3 py-1.5 rounded-lg transition {activeTool === 'canvas' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Massing Canvas
			</button>
		</div>
	</div>

	<!-- DRILL RUNNER TAB -->
	{#if activeTool === 'drill'}
		<div class="space-y-4">
			<!-- Drill selector -->
			<div class="flex items-center gap-2 text-xs">
				<span class="text-neutral-400">Drill:</span>
				<div class="flex gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
					<button
						type="button"
						onclick={() => activeDrillId = 'zero-adjective-linter'}
						class="px-3 py-1.5 rounded-lg transition {activeDrillId === 'zero-adjective-linter' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
					>
						Zero-Adjective
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'diagnostic-ladder-sequencer'}
						class="px-3 py-1.5 rounded-lg transition {activeDrillId === 'diagnostic-ladder-sequencer' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
					>
						Diagnostic Ladder
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'massing-sprint'}
						class="px-3 py-1.5 rounded-lg transition {activeDrillId === 'massing-sprint' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
					>
						Massing Sprint
					</button>
				</div>
			</div>
			{#if activeDrill}
				<DrillRunner drill={activeDrill} />
			{/if}
		</div>
	{/if}

	<!-- TOOL 1: Zero-Adjective Observation Linter -->
	{#if activeTool === 'linter'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Zero-Adjective Observation Constraint (Module 1):</strong>
				Describe what is present without evaluative adjectives (<em>good, bad, beautiful, ugly, impressive, weak, strong, polished, boring</em>).
				This separates perceptual observation from premature judgment.
			</div>

			<div class="space-y-2">
				<label for="obs-lint" class="block text-xs font-medium text-neutral-300">
					Perceptual Description:
				</label>
				<textarea
					id="obs-lint"
					rows="4"
					bind:value={observationText}
					placeholder="Describe spatial masses, edges, values, sentence rhythms, or omissions without judging them..."
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
				></textarea>

				{#if !lintResult.valid}
					<div class="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300 space-y-1">
						<div class="flex items-center gap-2 font-bold text-red-400">
							<AlertTriangle class="w-4 h-4" />
							<span>Evaluative Shortcut Detected: {lintResult.flaggedWords.join(', ')}</span>
						</div>
						<p class="text-[11px] text-red-400/80">
							Replace subjective praise or condemnation with concrete perceptual mechanics (e.g. contrast, proportion, sentence cadence).
						</p>
					</div>
				{:else if observationText.trim()}
					<div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
						<CheckCircle class="w-4 h-4 text-emerald-400 shrink-0" />
						<span>Clean perceptual observation! Zero evaluative shortcuts detected.</span>
					</div>
				{/if}

				<!-- Semantic AI Audit & In-place Replacements -->
				<div class="space-y-3 pt-3 border-t border-neutral-800">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
						<div class="text-[11px] text-neutral-400 font-mono">
							<span>Word count: {observationText.trim() ? observationText.trim().split(/\s+/).length : 0}</span>
							{#if observationText.trim().split(/\s+/).length > 150}
								<span class="text-amber-400/80 ml-2">• Essay close-reading mode active</span>
							{/if}
						</div>

						<LlmTriggerButton
							label="Run Semantic Audit"
							onclick={runSemanticAudit}
							loading={linterLoading}
							disabled={!observationText.trim()}
							title="Audit for covert evaluative vocabulary and generate structural diffs"
						/>
					</div>

					<LlmCritiqueCard
						result={linterCritique}
						loading={linterLoading}
						error={linterError}
						title="Classical Anatomist (Semantic Zero-Adjective Audit)"
						actions={linterActions}
						onDismiss={() => { linterCritique = null; }}
						onRetry={runSemanticAudit}
					/>
				</div>
			</div>
		</div>

	<!-- TOOL 2: Top-Down Diagnostic Ladder -->
	{:else if activeTool === 'ladder'}
		<div class="space-y-4">
			{#if !practiceStore.scaffolding.ladder}
				<div class="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-center justify-between gap-2">
					<div class="flex items-center gap-2">
						<Sliders class="w-4 h-4 text-amber-400 shrink-0" />
						<span><strong>Layer 2/3 Scaffolding Removed:</strong> The Diagnostic Ladder is hidden by default to test internalised diagnostic vision.</span>
					</div>
					<button
						type="button"
						onclick={() => showLadderOverride = !showLadderOverride}
						class="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-neutral-900 border border-neutral-700 text-amber-400 hover:bg-neutral-800 transition cursor-pointer"
					>
						{showLadderOverride ? 'Hide Ladder (Test Recall)' : 'Peek Ladder (Check Memory)'}
					</button>
				</div>
			{/if}

			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The Diagnostic Rule (Appendix B):</strong>
				Do not optimize a lower level while a higher level remains unresolved.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Ladder levels selection -->
				{#if practiceStore.scaffolding.ladder || showLadderOverride}
					<div class="space-y-1.5 animate-in fade-in duration-150">
						<div class="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
							<span>Select Highest Unresolved Level:</span>
							{#if showLadderOverride}
								<span class="text-[10px] text-amber-400 font-mono">Memory Check Mode</span>
							{/if}
						</div>
						{#each ladderLevels as lvl}
							<button
								type="button"
								onclick={() => selectedLevel = lvl.level}
								class="w-full p-2.5 rounded-xl text-left border transition flex items-center justify-between {selectedLevel === lvl.level ? 'bg-neutral-950 border-amber-500 text-neutral-100' : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'}"
							>
								<div>
									<div class="text-xs font-semibold">{lvl.name}</div>
									<div class="text-[10px] text-neutral-500">{lvl.desc}</div>
								</div>
								{#if selectedLevel === lvl.level}
									<span class="text-xs text-amber-400 font-bold">Selected</span>
								{/if}
							</button>
						{/each}
					</div>
				{:else}
					<!-- Active recall prompt when scaffolding is removed -->
					<div class="p-5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-3 flex flex-col justify-center text-xs">
						<div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold">
							L2
						</div>
						<div class="space-y-1">
							<div class="font-bold text-white text-sm">Autonomous Diagnostic Vision</div>
							<p class="text-neutral-400 leading-relaxed">
								You have progressed past Part I. Rely on your internalized hierarchy: does this artifact fail at <em>Intent</em>, <em>Premise</em>, <em>Composition</em>, <em>Logic</em>, or <em>Execution</em>?
							</p>
						</div>
						<div class="pt-2">
							<button
								type="button"
								onclick={() => showLadderOverride = true}
								class="text-xs text-amber-400 hover:underline font-mono flex items-center gap-1 cursor-pointer"
							>
								<span>Need to verify? Peek reference ladder</span>
								<ArrowRight class="w-3 h-3" />
							</button>
						</div>
					</div>
				{/if}

				<!-- Formulate Diagnostic Sentence -->
				<div class="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
					<h3 class="font-bold text-neutral-200">Canonical Diagnostic Sentence</h3>

					<div>
						<label for="cause-dec" class="block text-neutral-400 mb-1">Decision causing the problem:</label>
						<input
							id="cause-dec"
							type="text"
							bind:value={causingDecision}
							placeholder="e.g. Centered figure with equal negative space on all sides."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
						/>
					</div>

					<div>
						<label for="prop-test" class="block text-neutral-400 mb-1">Smallest meaningful test:</label>
						<input
							id="prop-test"
							type="text"
							bind:value={proposedTest}
							placeholder="e.g. Shift mass to upper-left third and compress right negative space."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
						/>
					</div>

					<div>
						<label for="accept-cond" class="block text-neutral-400 mb-1">Acceptance condition:</label>
						<input
							id="accept-cond"
							type="text"
							bind:value={acceptCondition}
							placeholder="e.g. The eye enters at the focal point and stays for 2s."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
						/>
					</div>

					{#if causingDecision && proposedTest}
						<div class="mt-3 p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-300 italic leading-relaxed">
							"The highest unresolved level is <strong>{ladderLevels.find(l => l.level === selectedLevel)?.name}</strong>.
							The decision causing the problem is <strong>{causingDecision}</strong>.
							I would test <strong>{proposedTest}</strong> next.
							I would accept if <strong>{acceptCondition || '...'}</strong>."
						</div>

						<div class="pt-2 flex items-center justify-between">
							<button
								type="button"
								onclick={saveDiagnosticSentence}
								class="px-3.5 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
							>
								<CheckCircle class="w-3.5 h-3.5" />
								<span>Commit Diagnosis to Decision Log</span>
							</button>

							{#if diagnosticSavedNotice}
								<span class="text-xs text-emerald-400 font-mono animate-in fade-in">
									✓ Committed to Log!
								</span>
							{/if}
						</div>

						<!-- LLM Diagnostic Ladder Auditor -->
						<div class="mt-4 pt-3 border-t border-neutral-800 space-y-3">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
								<span class="text-[11px] text-neutral-400">
									Audit for premature polish or hidden level skip:
								</span>
								<LlmTriggerButton
									label="Enforce Ladder Hierarchy"
									onclick={runLadderAudit}
									loading={ladderLoading}
									disabled={!causingDecision.trim() || !proposedTest.trim()}
									variant="secondary"
									title="Test whether this defect originates at a higher ladder level"
								/>
							</div>

							<LlmCritiqueCard
								result={ladderCritique}
								loading={ladderLoading}
								error={ladderError}
								title="Diagnostic Ladder Purist"
								actions={ladderActions}
								onDismiss={() => { ladderCritique = null; }}
								onRetry={runLadderAudit}
							/>
						</div>
					{/if}
				</div>
			</div>
		</div>

	<!-- TOOL 3: 6-Question Human Decision Audit -->
	{:else if activeTool === 'sixQuestions'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Finding the Human Decision (Module 1):</strong>
				Examine any generated or drafted work. Separate explicit choices from default model inheritance.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
				<div>
					<label for="q1" class="block text-neutral-300 font-medium mb-1">1. What is it apparently trying to do?</label>
					<input id="q1" type="text" bind:value={apparentIntent} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q2" class="block text-neutral-300 font-medium mb-1">2. Which decisions are explicit?</label>
					<input id="q2" type="text" bind:value={explicitDecisions} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q3" class="block text-neutral-300 font-medium mb-1">3. Which decisions appear to be defaults?</label>
					<input id="q3" type="text" bind:value={defaultDecisions} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q4" class="block text-neutral-300 font-medium mb-1">4. Which decision determines success?</label>
					<input id="q4" type="text" bind:value={determiningDecision} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q5" class="block text-neutral-300 font-medium mb-1">5. Who or what made that decision?</label>
					<input id="q5" type="text" bind:value={decisionMaker} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q6" class="block text-neutral-300 font-medium mb-1">6. What must the human director decide next?</label>
					<input id="q6" type="text" bind:value={nextHumanDecision} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
			</div>
		</div>

	<!-- TOOL 4: Massing Canvas (Module V1) -->
	{:else if activeTool === 'canvas'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">5-Second Thumbnail Flash & Massing Overlay (V1):</strong>
				Isolate 3–5 major shapes, focal paths, and directional axes. Thumbnails are decisions about where the major masses sit, not finished drawings.
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-xs text-neutral-400">Palette:</span>
					{#each ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#ffffff'] as c}
						<button
							type="button"
							onclick={() => color = c}
							class="w-5 h-5 rounded-full border border-neutral-700 transition {color === c ? 'scale-125 border-white' : ''}"
							style="background-color: {c}"
							aria-label="Color {c}"
						></button>
					{/each}
				</div>
				<button
					type="button"
					onclick={clearCanvas}
					class="px-3 py-1 rounded-lg text-xs bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
				>
					Clear Canvas
				</button>
			</div>

			<div class="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950 flex justify-center">
				<canvas
					bind:this={canvasElement}
					width="600"
					height="320"
					onmousedown={startDrawing}
					onmousemove={draw}
					onmouseup={stopDrawing}
					onmouseleave={stopDrawing}
					class="cursor-crosshair w-full max-w-[600px] h-[320px] bg-neutral-950"
				></canvas>
			</div>
		</div>
	{/if}

	<!-- Full Text Reading Modal for M2 Ingestion -->
	{#if activeReadingForModal}
		<ReadingModal
			reading={activeReadingForModal}
			isOpen={!!activeReadingForModal}
			onClose={() => activeReadingForModal = null}
			onSelectReading={(r) => activeReadingForModal = r}
		/>
	{/if}
</div>
