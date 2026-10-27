<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { ProblemEntry } from '$lib/schemas/course.schema';
	import { Compass, ShieldCheck, ShieldAlert, ArrowRight, CheckCircle2, Clock, Target, Wand2 } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import LabFrictionPrimer from '$lib/components/course/LabFrictionPrimer.svelte';
	import ReadingModal from '$lib/components/shell/ReadingModal.svelte';
	import type { CoreReading } from '$lib/data/core-readings';
	import { getDrillById } from '$lib/data/drills';
	import { LlmTriggerButton, LlmCritiqueCard } from '$lib/components/llm';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let activeReadingForModal = $state<CoreReading | null>(null);

	type ActiveTab = 'drill' | 'funnel';
	let activeTab = $state<ActiveTab>('funnel');

	// Drills available in M1
	let activeDrillId = $state<'five-in-thirty' | 'frame-shift' | 'positionality-check'>('five-in-thirty');
	let activeDrill = $derived(getDrillById(activeDrillId));

	let step = $state<'notice' | 'collect' | 'frame' | 'test' | 'select' | 'justify'>('notice');

	// Candidate Problem state
	let source = $state('');
	let noticed = $state('');
	let framedProblem = $state('');
	let mode = $state<'Solve' | 'Investigate' | 'Reveal' | 'Reframe' | 'Explore' | 'Construct'>('Investigate');
	let stakes = $state('');
	let positionality = $state<'From' | 'With' | 'For' | 'About' | 'Over'>('From');
	let hasStanding = $state(true);
	let standingJustification = $state('');
	let rejectionReason = $state('');
	let unassignedTimer = $state(3600); // 60-minute timer for Unassigned Beginning
	let unassignedRunning = $state(false);
	let unassignedInterval: any = null;

	// Socratic Dialectician Tension Stress-Test LLM state
	let tensionCritique = $state<CritiqueResult | null>(null);
	let tensionLoading = $state(false);
	let tensionError = $state<string | null>(null);

	async function runTensionStressTest() {
		if (!framedProblem.trim() && !noticed.trim()) return;
		tensionLoading = true;
		tensionError = null;
		try {
			const res = await executePrompt('m1-problem-stress-test', {
				noticed: noticed.trim() || 'Unstated observation',
				framedProblem: framedProblem.trim(),
				mode,
				stakes: stakes.trim() || 'Unstated stakes'
			});
			tensionCritique = res;
		} catch (err: any) {
			tensionError = err.message || 'Tension stress-test failed';
		} finally {
			tensionLoading = false;
		}
	}

	let tensionActions = $derived.by<LlmAction[]>(() => {
		const actions: LlmAction[] = [];
		const reframe = tensionCritique?.tensionReframe;
		if (reframe?.proposedFrame) {
			actions.push({
				id: 'apply-tension-reframe',
				label: 'Apply Sharpened Tension Frame',
				primary: true,
				icon: Wand2,
				onClick: () => {
					if (reframe.proposedFrame) {
						framedProblem = reframe.proposedFrame;
					}
					if (reframe.sharpenedStakes && !stakes.trim()) {
						stakes = reframe.sharpenedStakes;
					}
				}
			});
		}
		return actions;
	});

	// Positionality Ethics Examiner LLM state
	let positionCritique = $state<CritiqueResult | null>(null);
	let positionLoading = $state(false);
	let positionError = $state<string | null>(null);

	async function runPositionalityAudit() {
		if (!standingJustification.trim() && !rejectionReason.trim()) return;
		positionLoading = true;
		positionError = null;
		try {
			const res = await executePrompt('m1-positionality-audit', {
				positionality,
				standingJustification: hasStanding ? standingJustification.trim() : rejectionReason.trim(),
				framedProblem: framedProblem.trim() || 'Unframed candidate problem'
			});
			positionCritique = res;
		} catch (err: any) {
			positionError = err.message || 'Positionality standing audit failed';
		} finally {
			positionLoading = false;
		}
	}

	let positionActions = $derived.by<LlmAction[]>(() => {
		const actions: LlmAction[] = [];
		const verdict = positionCritique?.positionVerdict;
		if (!verdict) return actions;

		if (verdict.recommendedPosition && verdict.recommendedPosition !== positionality) {
			const targetPos = verdict.recommendedPosition;
			actions.push({
				id: 'shift-position',
				label: `Shift Position to '${targetPos}'`,
				primary: true,
				icon: Compass,
				onClick: () => {
					positionality = targetPos;
				}
			});
		}

		if (verdict.recommendedStanding === false && hasStanding) {
			actions.push({
				id: 'switch-to-refusal',
				label: 'Switch to Positional Refusal',
				variant: 'danger',
				icon: ShieldAlert,
				onClick: () => {
					hasStanding = false;
					if (verdict.primaryRisk && !rejectionReason.trim()) {
						rejectionReason = `Positional risk: ${verdict.primaryRisk}`;
					}
				}
			});
		} else if (verdict.recommendedStanding === true && !hasStanding) {
			actions.push({
				id: 'confirm-standing',
				label: 'Confirm Standing',
				primary: true,
				icon: ShieldCheck,
				onClick: () => {
					hasStanding = true;
				}
			});
		}

		return actions;
	});

	const positionalityDescriptions = {
		From: 'You are inside the lived experience. (Your own life, domain, or community).',
		With: 'You are in dialogue with those inside. (Collaboration, co-authorship, consent).',
		For: 'You are acting in service. (Commission, advocacy, explicit client brief).',
		About: 'You are observing from outside. (Research, criticism — requires rigorous care).',
		Over: 'Speaking as if you were inside when you are not. (Never appropriate as a default).'
	};

	function toggleUnassignedTimer() {
		if (unassignedRunning) {
			clearInterval(unassignedInterval);
			unassignedRunning = false;
		} else {
			unassignedRunning = true;
			unassignedInterval = setInterval(() => {
				if (unassignedTimer > 0) unassignedTimer -= 1;
				else {
					clearInterval(unassignedInterval);
					unassignedRunning = false;
				}
			}, 1000);
		}
	}

	function saveProblem() {
		if (!framedProblem.trim() || !noticed.trim()) return;

		const newEntry: ProblemEntry = {
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			source: source.trim() || 'Direct observation',
			noticed: noticed.trim(),
			framedProblem: framedProblem.trim(),
			mode,
			stakes: stakes.trim() || 'Aesthetic & cognitive consequence',
			positionality,
			hasStanding,
			standingJustification: standingJustification.trim() || 'Situated observer',
			selected: hasStanding,
			rejectionReason: hasStanding ? undefined : rejectionReason.trim()
		};

		practiceStore.problems.unshift(newEntry);
		practiceStore.saveToStorage();

		// Reset inputs
		noticed = '';
		framedProblem = '';
		stakes = '';
		standingJustification = '';
		rejectionReason = '';
		step = 'notice';
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Contextual Material Primer: Ingesting Theory Before Practice -->
	<LabFrictionPrimer
		modalityId="m1"
		primaryReadingCode="Module 2"
		failureMode="Defaulting to unreflective prompt engineering on given briefs, mistaking a broad topic for a problem, or speaking 'Over' subjects without ethical standing."
		directorialDiscipline="Isolate high-friction observations, test for active tension rather than passive subject matter, and consciously choose a defensible positionality (From, With, For, About) or refuse the project."
		benchmarkPass="Frames a specific tension where two desirable values collide, with stated standing and stakes."
		benchmarkFail="Lists a general theme ('AI and nature') without tension or standing justification."
		onOpenFullReading={(r) => activeReadingForModal = r}
	/>

	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
					Core Studio
				</span>
				<h2 class="text-base font-bold text-white">Problem Discovery & Positionality Lab</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Identify meaningful creative problems from observation, clarify your ethical standing, and stress-test tension.
			</p>
		</div>

		<!-- Header controls: tab switcher + timer -->
		<div class="flex items-center gap-2 flex-wrap">
			<!-- Tab switcher -->
			<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
				<button
					type="button"
					onclick={() => activeTab = 'drill'}
					class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 {activeTab === 'drill' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					<Target class="w-3 h-3" />
					<span>Practice Drills</span>
				</button>
				<button
					type="button"
					onclick={() => activeTab = 'funnel'}
					class="px-3 py-1.5 rounded-lg transition {activeTab === 'funnel' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					Problem Discovery Funnel
				</button>
			</div>

			<!-- 60m Unassigned Beginning Timer -->
			<div class="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs">
				<Clock class="w-3.5 h-3.5 text-amber-400" />
				<span class="font-mono text-neutral-300">
					{Math.floor(unassignedTimer / 60)}:{String(unassignedTimer % 60).padStart(2, '0')}
				</span>
				<button
					type="button"
					onclick={toggleUnassignedTimer}
					class="text-[11px] font-bold text-amber-400 hover:text-amber-300 ml-1"
				>
					{unassignedRunning ? 'Pause' : 'Start 60m Unassigned'}
				</button>
			</div>
		</div>
	</div>

	<!-- DRILL RUNNER TAB -->
	{#if activeTab === 'drill'}
		<div class="space-y-4">
			<div class="flex items-center gap-2 text-xs">
				<span class="text-neutral-400">Drill:</span>
				<div class="flex gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
					<button
						type="button"
						onclick={() => activeDrillId = 'five-in-thirty'}
						class="px-3 py-1.5 rounded-lg transition {activeDrillId === 'five-in-thirty' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
					>
						5-in-30 Funnel
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'frame-shift'}
						class="px-3 py-1.5 rounded-lg transition {activeDrillId === 'frame-shift' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
					>
						Frame Shift
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'positionality-check'}
						class="px-3 py-1.5 rounded-lg transition {activeDrillId === 'positionality-check' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
					>
						Positionality Check
					</button>
				</div>
			</div>
			{#if activeDrill}
				<DrillRunner drill={activeDrill} />
			{/if}
		</div>
	{:else}

	<div class="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 text-xs font-medium">
		{#each ['notice', 'collect', 'frame', 'test', 'select', 'justify'] as s, idx}
			<button
				type="button"
				onclick={() => step = s as any}
				class="py-1.5 rounded-lg capitalize transition text-center {step === s ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				{idx + 1}. {s}
			</button>
		{/each}
	</div>

	<!-- Funnel Stage Content -->
	<div class="space-y-4">
		{#if step === 'notice' || step === 'collect'}
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">1. Notice & Collect:</strong> Something in the world, work, or situation draws attention. Do not immediately judge it. A problem is not a topic, a mood, or a genre—it is a meaningful unresolved condition.
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<label for="p-source" class="block text-xs font-medium text-neutral-300 mb-1">Input Source:</label>
					<input
						id="p-source"
						type="text"
						bind:value={source}
						placeholder="e.g. 30-minute walk through commercial transit hub"
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
				</div>
				<div>
					<label for="p-noticed" class="block text-xs font-medium text-neutral-300 mb-1">What Drew Attention:</label>
					<input
						id="p-noticed"
						type="text"
						bind:value={noticed}
						placeholder="e.g. People holding phones at acute angles to shield screens from reflections."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
				</div>
			</div>
			<button
				type="button"
				onclick={() => step = 'frame'}
				class="px-4 py-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center gap-2 transition"
			>
				<span>Next: Frame the Problem</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</button>

		{:else if step === 'frame' || step === 'test'}
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">2. Frame & Mode:</strong> Articulate as a problem: <em>"What if the unresolved condition is X?"</em> Select the investigative mode.
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<label for="p-frame" class="block text-xs font-medium text-neutral-300 mb-1">Framed Problem Statement:</label>
					<input
						id="p-frame"
						type="text"
						bind:value={framedProblem}
						placeholder="e.g. Physical proximity and psychological concealment increase together."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
				</div>
				<div>
					<label for="p-mode" class="block text-xs font-medium text-neutral-300 mb-1">Mode:</label>
					<select
						id="p-mode"
						bind:value={mode}
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
					>
						<option value="Solve">Solve (Resolve, correct, fix)</option>
						<option value="Investigate">Investigate (Study, discover)</option>
						<option value="Reveal">Reveal (Expose, witness, document)</option>
						<option value="Reframe">Reframe (Recontextualize)</option>
						<option value="Explore">Explore (Follow open inquiry)</option>
						<option value="Construct">Construct (Build a new framework)</option>
					</select>
				</div>
			</div>
			<div>
				<label for="p-stakes" class="block text-xs font-medium text-neutral-300 mb-1">Stakes (Why it matters):</label>
				<input
					id="p-stakes"
					type="text"
					bind:value={stakes}
					placeholder="What breaks or remains invisible if this is not pursued?"
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
				/>
			</div>

			<!-- Socratic Tension Stress-Test Panel -->
			<div class="space-y-3 pt-3 border-t border-neutral-800">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div class="text-[11px] text-neutral-400 font-mono">
						<span>Tension check: {framedProblem.trim() ? 'Ready to stress-test' : 'Enter problem statement'}</span>
					</div>

					<LlmTriggerButton
						label="Stress-Test Problem Tension"
						onclick={runTensionStressTest}
						loading={tensionLoading}
						disabled={!framedProblem.trim() && !noticed.trim()}
						title="Differentiate genuine tension from static topic and sharpen stakes"
					/>
				</div>

				<LlmCritiqueCard
					result={tensionCritique}
					loading={tensionLoading}
					error={tensionError}
					title="Socratic Dialectician (Problem Tension Stress-Test)"
					actions={tensionActions}
					onDismiss={() => { tensionCritique = null; }}
					onRetry={runTensionStressTest}
				/>
			</div>

			<button
				type="button"
				onclick={() => step = 'select'}
				class="px-4 py-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center gap-2 transition cursor-pointer"
			>
				<span>Next: Positionality Compass</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</button>

		{:else if step === 'select' || step === 'justify'}
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">3. Positionality & Standing:</strong> A problem worth pursuing is not automatically a problem <em>yours</em> to pursue. Positionality is not a purity test—it is an honesty compass.
			</div>

			<!-- Positionality Compass -->
			<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
				{#each ['From', 'With', 'For', 'About', 'Over'] as pMode}
					<button
						type="button"
						onclick={() => positionality = pMode as any}
						class="p-2.5 rounded-xl border text-center transition {positionality === pMode ? 'bg-neutral-950 border-amber-500 text-amber-400 font-bold' : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'}"
					>
						<div class="text-xs uppercase">{pMode}</div>
					</button>
				{/each}
			</div>

			<div class="text-xs text-neutral-400 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
				<strong>Mode description:</strong> {positionalityDescriptions[positionality]}
			</div>

			<!-- Standing Check & Refusal -->
			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold text-neutral-200">Do I have standing to pursue this problem?</span>
					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => hasStanding = true}
							class="px-2.5 py-1 rounded text-xs transition {hasStanding ? 'bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold' : 'bg-neutral-900 text-neutral-500'}"
						>
							Yes (Standing Verified)
						</button>
						<button
							type="button"
							onclick={() => hasStanding = false}
							class="px-2.5 py-1 rounded text-xs transition {!hasStanding ? 'bg-red-950 border border-red-700 text-red-300 font-bold' : 'bg-neutral-900 text-neutral-500'}"
						>
							No (Positional Refusal)
						</button>
					</div>
				</div>

				{#if hasStanding}
					<div>
						<label for="standing-just" class="block text-[11px] font-medium text-neutral-400 mb-1">Standing Justification (Why me, why now):</label>
						<input
							id="standing-just"
							type="text"
							bind:value={standingJustification}
							placeholder="State honest relationship to the domain..."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
						/>
					</div>
				{:else}
					<div>
						<label for="rejection-reason" class="block text-[11px] font-medium text-red-400 mb-1">Positional Refusal Rationale:</label>
						<input
							id="rejection-reason"
							type="text"
							bind:value={rejectionReason}
							placeholder="e.g. Would be speaking over or extracting from an experience I do not inhabit."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
						/>
					</div>
				{/if}
			</div>

			<!-- Positionality Standing Audit Panel -->
			<div class="space-y-3 pt-2">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div class="text-[11px] text-neutral-400 font-mono">
						<span>Standing audit: Position '{positionality}' ({hasStanding ? 'Claiming standing' : 'Positional refusal'})</span>
					</div>

					<LlmTriggerButton
						label="Audit Positionality Standing"
						onclick={runPositionalityAudit}
						loading={positionLoading}
						disabled={!standingJustification.trim() && !rejectionReason.trim()}
						variant="secondary"
						title="Audit standing justification against the 5 compass positions"
					/>
				</div>

				<LlmCritiqueCard
					result={positionCritique}
					loading={positionLoading}
					error={positionError}
					title="Positionality Ethics Examiner"
					actions={positionActions}
					onDismiss={() => { positionCritique = null; }}
					onRetry={runPositionalityAudit}
				/>
			</div>

			<button
				type="button"
				onclick={saveProblem}
				disabled={!framedProblem.trim() || !noticed.trim()}
				class="w-full py-2.5 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition flex items-center justify-center gap-2"
			>
				<CheckCircle2 class="w-4 h-4" />
				<span>Save Problem to Problem-Finding Log</span>
			</button>
		{/if}
	</div>

	<!-- Recent Problem Candidates -->
	{#if practiceStore.problems.length > 0}
		<div class="mt-6 pt-4 border-t border-neutral-800 space-y-3">
			<h4 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
				Logged Problems ({practiceStore.problems.length})
			</h4>
			<div class="space-y-2 max-h-60 overflow-y-auto">
				{#each practiceStore.problems as p}
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1.5">
						<div class="flex items-center justify-between">
							<span class="font-bold text-neutral-200">{p.framedProblem}</span>
							<span class="text-[10px] px-2 py-0.5 rounded font-mono {p.hasStanding ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}">
								{p.positionality} • {p.hasStanding ? 'Selected' : 'Refused'}
							</span>
						</div>
						<div class="text-neutral-400 text-[11px]">
							<strong class="text-neutral-500">Noticed:</strong> {p.noticed}
						</div>
						<div class="text-neutral-400 text-[11px]">
							<strong class="text-neutral-500">Stakes:</strong> {p.stakes}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	{/if}

	<!-- Full Text Reading Modal for M1 Ingestion -->
	{#if activeReadingForModal}
		<ReadingModal
			reading={activeReadingForModal}
			isOpen={!!activeReadingForModal}
			onClose={() => activeReadingForModal = null}
			onSelectReading={(r) => activeReadingForModal = r}
		/>
	{/if}
</div>
