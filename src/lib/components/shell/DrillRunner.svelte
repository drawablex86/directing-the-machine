<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { Drill } from '$lib/data/drills';
	import {
		Target,
		CheckCircle2,
		XCircle,
		ChevronRight,
		Timer,
		TrendingUp,
		TrendingDown,
		Minus,
		BookOpen,
		AlertTriangle,
		Sparkles,
		ArrowRight,
		RotateCcw,
		Info
	} from '@lucide/svelte';

	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';

	let { drill, onComplete }: { drill: Drill; onComplete?: () => void } = $props();

	// Session state
	type SessionPhase = 'briefing' | 'rep-card' | 'running' | 'complete';
	let phase = $state<SessionPhase>('briefing');
	let reps = $state<{ passed: boolean; failNote: string }[]>([]);
	let currentRepNote = $state('');
	let sessionStartTime = $state<number>(0);
	let discoveryNote = $state('');
	let difficultyAdjustment = $state<'increased' | 'maintained' | 'reduced' | 'none'>('none');
	let showProtocolStep = $state(0); // which protocol step we're highlighting
	let expandedFailures = $state(false);
	let repInputText = $state(''); // for linter-integrated drills

	// LLM State: Deliberate Practice Drill Coach & Rep Failure Diagnostic
	let drillCritique = $state<CritiqueResult | null>(null);
	let isCheckingDrill = $state(false);
	let drillError = $state<string | null>(null);

	async function runDrillDiagnostic() {
		isCheckingDrill = true;
		drillError = null;
		try {
			const failedReps = reps.filter(r => !r.passed);
			const recentFailures = failedReps.map(r => r.failNote).filter(Boolean).join('; ');
			const result = await executePrompt('drill-rep-diagnostic', {
				drillTitle: drill.title,
				drillTargetSkill: drill.targetSkill,
				repOutcome: currentRepNote.trim() || (failedReps.length > 0 ? 'Multiple rep failures' : 'Struggling with rep criteria'),
				failureNote: currentRepNote.trim() || recentFailures || 'Rep failed success criteria',
				repProtocolStep: currentProtocolStep ? `${currentProtocolStep.step}. ${currentProtocolStep.label} - ${currentProtocolStep.instruction}` : '',
				currentSuccessRate: totalReps > 0 ? `${Math.round(successRate * 100)}%` : '0%'
			});
			drillCritique = result;
		} catch (err: any) {
			drillError = err?.message || 'Failed to diagnose drill rep.';
		} finally {
			isCheckingDrill = false;
		}
	}

	let drillActions = $derived.by<LlmAction[]>(() => {
		if (!drillCritique?.drillDiagnostic) return [];
		const dd = drillCritique.drillDiagnostic;
		const actions: LlmAction[] = [];

		if (dd.microAdjustment) {
			actions.push({
				label: 'Append Adjustment to Discovery Note',
				primary: true,
				variant: 'primary',
				onClick: () => {
					if (discoveryNote.trim()) {
						discoveryNote = `${discoveryNote.trim()}\n• [Coach Adjustment]: ${dd.microAdjustment}`;
					} else {
						discoveryNote = `• [Coach Adjustment]: ${dd.microAdjustment}`;
					}
				}
			});
		}

		if (dd.zoneRecommendation) {
			actions.push({
				label: `Adopt Zone: ${dd.zoneRecommendation.replace(/_/g, ' ')}`,
				variant: 'secondary',
				onClick: () => {
					if (dd.zoneRecommendation.includes('WARMUP') || dd.zoneRecommendation.includes('REDUCE') || dd.zoneRecommendation.includes('EASE')) {
						difficultyAdjustment = 'reduced';
					} else if (dd.zoneRecommendation.includes('HARDER') || dd.zoneRecommendation.includes('PUSH') || dd.zoneRecommendation.includes('INCREASE')) {
						difficultyAdjustment = 'increased';
					} else {
						difficultyAdjustment = 'maintained';
					}
				}
			});
		}

		return actions;
	});

	// Recent sessions for context
	let recentSessions = $derived(practiceStore.getRecentDrillSessions(drill.id));
	let currentProtocolStep = $derived(drill.repProtocol[showProtocolStep]);

	// Derived metrics
	let passedCount = $derived(reps.filter(r => r.passed).length);
	let totalReps = $derived(reps.length);
	let successRate = $derived(totalReps > 0 ? passedCount / totalReps : 0);
	let zoneStatus = $derived(() => {
		if (totalReps < 3) return 'warming-up';
		if (successRate >= 0.85) return 'too-easy';
		if (successRate < 0.5) return 'too-hard';
		return 'in-zone';
	});
	let sessionDuration = $derived(
		sessionStartTime > 0 ? Math.round((Date.now() - sessionStartTime) / 60000) : 0
	);

	function startSession() {
		sessionStartTime = Date.now();
		reps = [];
		phase = 'rep-card';
	}

	function markRep(passed: boolean) {
		reps.push({ passed, failNote: currentRepNote.trim() });
		currentRepNote = '';
		// Auto-advance protocol step cycling
		showProtocolStep = (showProtocolStep + 1) % drill.repProtocol.length;
	}

	function undoLastRep() {
		reps = reps.slice(0, -1);
	}

	function completeSession() {
		if (totalReps === 0) return;

		// Set difficulty adjustment based on zone
		if (zoneStatus() === 'too-easy') difficultyAdjustment = 'increased';
		else if (zoneStatus() === 'too-hard') difficultyAdjustment = 'reduced';
		else difficultyAdjustment = 'maintained';

		practiceStore.saveDrillSession({
			drillId: drill.id,
			drillTitle: drill.title,
			weekNum: practiceStore.activeWeek,
			dayNum: practiceStore.activeDay,
			totalReps,
			passedReps: passedCount,
			successRate,
			discoveryNote: discoveryNote.trim(),
			difficultyAdjustment,
			durationMinutes: sessionDuration
		});

		phase = 'complete';
		if (onComplete) onComplete();
	}

	function resetSession() {
		phase = 'briefing';
		reps = [];
		currentRepNote = '';
		discoveryNote = '';
		difficultyAdjustment = 'none';
		showProtocolStep = 0;
		sessionStartTime = 0;
	}

	const zoneColors = {
		'warming-up': 'text-neutral-400',
		'in-zone': 'text-emerald-400',
		'too-easy': 'text-amber-400',
		'too-hard': 'text-red-400'
	};

	let zoneMessages = $derived<Record<string, string>>({
		'warming-up': `Keep going — minimum 5 reps before zone feedback`,
		'in-zone': `✓ In the 70–80% learning zone — maintain this difficulty`,
		'too-easy': `Success rate ${Math.round(successRate * 100)}% — tighten the constraint immediately`,
		'too-hard': `Success rate ${Math.round(successRate * 100)}% — reduce scope or remove one constraint`
	});
</script>

<div class="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
	<!-- Header bar -->
	<div class="flex items-center justify-between px-5 py-3 bg-neutral-950 border-b border-neutral-800">
		<div class="flex items-center gap-2">
			<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
				DRILL RUNNER
			</span>
			<span class="text-sm font-bold text-white">{drill.title}</span>
			<span class="text-[11px] font-mono text-neutral-500">{drill.moduleRef}</span>
		</div>
		{#if phase !== 'briefing'}
			<button
				type="button"
				onclick={resetSession}
				class="text-xs text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition cursor-pointer"
			>
				<RotateCcw class="w-3 h-3" />
				<span>Reset</span>
			</button>
		{/if}
	</div>

	<div class="p-5 space-y-5">

		<!-- ────────────────────────────────────────
		     PHASE 1: BRIEFING
		     ──────────────────────────────────────── -->
		{#if phase === 'briefing'}
			<div class="space-y-4">
				<!-- What you're training -->
				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
					<div class="flex items-start gap-2.5">
						<Target class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
						<div class="space-y-1">
							<div class="text-xs font-bold text-amber-400">What You're Training</div>
							<p class="text-sm text-neutral-200 leading-relaxed">{drill.targetSkill}</p>
						</div>
					</div>

					<div class="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800">
						<div class="text-center">
							<div class="text-[10px] font-mono text-neutral-500 uppercase">Rep Duration</div>
							<div class="text-xs font-bold text-white mt-0.5">{drill.repDuration}</div>
						</div>
						<div class="text-center">
							<div class="text-[10px] font-mono text-neutral-500 uppercase">Rep Count</div>
							<div class="text-xs font-bold text-white mt-0.5">{drill.repCount}</div>
						</div>
						<div class="text-center">
							<div class="text-[10px] font-mono text-neutral-500 uppercase">Pass Criterion</div>
							<div class="text-xs font-bold text-white mt-0.5">Binary ✓/✗</div>
						</div>
					</div>
				</div>

				<!-- What 1 rep looks like -->
				<div class="space-y-2">
					<div class="flex items-center gap-2 text-xs font-bold text-neutral-300">
						<BookOpen class="w-3.5 h-3.5 text-amber-400" />
						<span>What 1 Rep Looks Like (5-Step Protocol)</span>
					</div>
					<div class="space-y-1.5">
						{#each drill.repProtocol as step}
							<div class="flex gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
								<span class="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
									{step.step}
								</span>
								<div class="space-y-0.5 min-w-0">
									<div class="font-semibold text-neutral-200">{step.label}
										<span class="font-mono font-normal text-neutral-500 ml-1">({step.duration})</span>
									</div>
									<p class="text-neutral-400 leading-relaxed">{step.instruction}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Success criterion -->
				<div class="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-2.5 text-xs">
					<CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
					<div>
						<span class="font-bold text-emerald-300">PASS condition: </span>
						<span class="text-neutral-300">{drill.successCriterion}</span>
					</div>
				</div>

				<!-- Where to practice -->
				<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2 text-xs">
					<Info class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
					<div>
						<span class="font-semibold text-neutral-300">Surface: </span>
						<span class="text-neutral-400">{drill.surface}</span>
					</div>
				</div>

				<!-- Difficulty options -->
				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
					<div class="text-xs font-bold text-neutral-300">Today's Difficulty Level</div>
					<div class="grid grid-cols-1 gap-1.5 text-xs">
						{#each [
							{ key: 'warmup', label: 'Warm-Up', desc: drill.difficulty.warmup, color: 'text-blue-400' },
							{ key: 'standard', label: 'Standard', desc: drill.difficulty.standard, color: 'text-emerald-400' },
							{ key: 'harder', label: 'Harder', desc: drill.difficulty.harder, color: 'text-amber-400' },
							{ key: 'hardest', label: 'Hardest', desc: drill.difficulty.hardest, color: 'text-red-400' }
						] as opt}
							<div class="flex gap-2 p-2 rounded-lg bg-neutral-900 border border-neutral-800">
								<span class="font-bold {opt.color} shrink-0 w-14">{opt.label}</span>
								<span class="text-neutral-400">{opt.desc}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Common failures -->
				<button
					type="button"
					onclick={() => expandedFailures = !expandedFailures}
					class="w-full text-left p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-center justify-between text-xs cursor-pointer hover:bg-amber-950/30 transition"
				>
					<div class="flex items-center gap-2 text-amber-300 font-semibold">
						<AlertTriangle class="w-3.5 h-3.5" />
						<span>Common Failure Modes (read before starting)</span>
					</div>
					<ChevronRight class="w-3.5 h-3.5 text-amber-400 transition-transform {expandedFailures ? 'rotate-90' : ''}" />
				</button>
				{#if expandedFailures}
					<div class="space-y-1.5">
						{#each drill.commonFailures as failure}
							<div class="flex gap-2 p-2.5 rounded-lg bg-amber-950/10 border border-amber-800/20 text-xs text-neutral-400">
								<span class="text-amber-500 shrink-0">⚠</span>
								<span>{failure}</span>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Example -->
				<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
					<div class="font-bold text-neutral-300">Worked Example</div>
					<div>
						<span class="text-neutral-500 font-mono">Input: </span>
						<span class="text-neutral-300 italic">"{drill.exampleInput}"</span>
					</div>
					<div class="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
						<span class="text-emerald-400 font-bold">PASS: </span>
						<span class="text-neutral-300">{drill.examplePass}</span>
					</div>
					<div class="p-2.5 rounded-lg bg-red-950/20 border border-red-800/30">
						<span class="text-red-400 font-bold">FAIL: </span>
						<span class="text-neutral-300">{drill.exampleFail}</span>
					</div>
				</div>

				<!-- Recent history -->
				{#if recentSessions.length > 0}
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
						<div class="font-semibold text-neutral-400">Your Recent Sessions ({recentSessions.length} logged)</div>
						<div class="space-y-1">
							{#each recentSessions.slice(0, 3) as s}
								<div class="flex items-center justify-between text-[11px]">
									<span class="text-neutral-500 font-mono">{s.date}</span>
									<span class="font-mono">
										<span class="text-emerald-400">{s.passedReps}</span>
										<span class="text-neutral-600">/{s.totalReps} reps</span>
										<span class="ml-1.5 px-1.5 py-0.5 rounded font-bold text-[10px] {Math.round(s.successRate * 100) >= 70 && Math.round(s.successRate * 100) <= 85 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'}">
											{Math.round(s.successRate * 100)}%
										</span>
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<button
					type="button"
					onclick={startSession}
					class="w-full py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
				>
					<Target class="w-4 h-4" />
					<span>Begin Drill Session</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>

		<!-- ────────────────────────────────────────
		     PHASE 2: REP CARD + RUNNING
		     ──────────────────────────────────────── -->
		{:else if phase === 'rep-card' || phase === 'running'}
			<div class="space-y-4">
				<!-- Rep counter + zone status -->
				<div class="grid grid-cols-3 gap-3">
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
						<div class="text-[10px] font-mono text-neutral-500 uppercase">Reps Done</div>
						<div class="text-2xl font-bold text-white font-mono mt-0.5">{totalReps}</div>
					</div>
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
						<div class="text-[10px] font-mono text-neutral-500 uppercase">Passed</div>
						<div class="text-2xl font-bold text-emerald-400 font-mono mt-0.5">{passedCount}</div>
					</div>
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
						<div class="text-[10px] font-mono text-neutral-500 uppercase">Rate</div>
						<div class="text-2xl font-bold font-mono mt-0.5 {totalReps >= 3 ? (successRate >= 0.85 ? 'text-amber-400' : successRate < 0.5 ? 'text-red-400' : 'text-emerald-400') : 'text-neutral-400'}">
							{totalReps > 0 ? Math.round(successRate * 100) : '—'}%
						</div>
					</div>
				</div>

				<!-- Zone feedback -->
				<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs {totalReps >= 3 ? (zoneStatus() === 'in-zone' ? 'border-emerald-800/50 bg-emerald-950/20' : zoneStatus() === 'too-easy' ? 'border-amber-800/50 bg-amber-950/20' : zoneStatus() === 'too-hard' ? 'border-red-800/50 bg-red-950/20' : '') : ''}">
					<div class="flex items-center gap-2 {zoneColors[zoneStatus()]}">
						{#if zoneStatus() === 'too-easy'}
							<TrendingUp class="w-3.5 h-3.5" />
						{:else if zoneStatus() === 'too-hard'}
							<TrendingDown class="w-3.5 h-3.5" />
						{:else}
							<Minus class="w-3.5 h-3.5" />
						{/if}
						<span class="font-semibold">{zoneMessages[zoneStatus()]}</span>
					</div>
				</div>

				<!-- Rep grid -->
				{#if reps.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each reps as rep, i}
							<div
								class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border {rep.passed ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400' : 'bg-red-950/40 border-red-800/50 text-red-400'}"
								title="Rep {i+1}: {rep.passed ? 'PASS' : 'FAIL'}{rep.failNote ? ' — ' + rep.failNote : ''}"
							>
								{rep.passed ? '✓' : '✗'}
							</div>
						{/each}
						{#if reps.length > 0}
							<button
								type="button"
								onclick={undoLastRep}
								class="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-neutral-600 border border-neutral-800 hover:border-neutral-700 hover:text-neutral-400 transition cursor-pointer"
								title="Undo last rep"
							>
								↩
							</button>
						{/if}
					</div>
				{/if}

				<!-- Current protocol step highlight -->
				{#if currentProtocolStep}
					<div class="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
						<div class="text-[11px] font-mono text-amber-400/80 uppercase">Current Protocol Step</div>
						<div class="space-y-1">
							<div class="text-sm font-bold text-amber-300">{currentProtocolStep.step}. {currentProtocolStep.label}
								<span class="font-mono font-normal text-amber-400/60 text-xs">({currentProtocolStep.duration})</span>
							</div>
							<p class="text-xs text-neutral-300 leading-relaxed">{currentProtocolStep.instruction}</p>
						</div>
						<div class="flex gap-1 mt-2">
							{#each drill.repProtocol as _, idx}
								<button
									type="button"
									aria-label="Protocol step {idx + 1}"
									onclick={() => showProtocolStep = idx}
									class="h-1 flex-1 rounded-full transition cursor-pointer {showProtocolStep === idx ? 'bg-amber-400' : 'bg-neutral-700 hover:bg-neutral-600'}"
								></button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Fail note input (optional) -->
				<div class="space-y-1.5">
					<div class="flex items-center justify-between">
						<label for="fail-note" class="text-xs text-neutral-400">
							Optional: If this rep fails, note what broke (1–5 words):
						</label>
						<LlmTriggerButton
							label="Diagnose Rep & Calibrate"
							onclick={runDrillDiagnostic}
							loading={isCheckingDrill}
							disabled={!currentRepNote.trim() && reps.filter(r => !r.passed).length === 0}
							title="Analyze failure mechanism and get micro-adjustments for the 70–80% learning zone"
						/>
					</div>
					<input
						id="fail-note"
						type="text"
						bind:value={currentRepNote}
						placeholder="e.g. used 'striking', drew detail not mass..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
				</div>

				{#if drillCritique || isCheckingDrill || drillError}
					<div class="pt-1">
						<LlmCritiqueCard
							result={drillCritique}
							loading={isCheckingDrill}
							error={drillError}
							title="Master Drill Coach: Rep Diagnostic & Calibration"
							actions={drillActions}
							onDismiss={() => (drillCritique = null)}
							onRetry={runDrillDiagnostic}
						/>

						{#if drillCritique?.drillDiagnostic}
							{@const dd = drillCritique.drillDiagnostic}
							<div class="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
								<div class="flex flex-wrap items-center justify-between gap-1.5">
									<span class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
										Failure Type: {dd.failureType}
									</span>
									<span class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
										Zone Rec: {dd.zoneRecommendation}
									</span>
								</div>

								{#if dd.mechanismDiagnosis}
									<div class="text-[11px] text-neutral-300 leading-relaxed">
										<strong class="text-neutral-200 font-mono text-[10px] uppercase">Root Mechanism:</strong> {dd.mechanismDiagnosis}
									</div>
								{/if}

								{#if dd.microAdjustment}
									<div class="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
										<div class="text-[10px] font-mono text-emerald-400 uppercase font-bold">Targeted Micro-Adjustment:</div>
										<div class="text-neutral-200 mt-0.5 font-medium">{dd.microAdjustment}</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}

				<!-- Mark rep buttons -->
				<div class="grid grid-cols-2 gap-3">
					<button
						type="button"
						onclick={() => markRep(true)}
						class="py-3.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition shadow cursor-pointer"
					>
						<CheckCircle2 class="w-5 h-5" />
						<span>PASS</span>
					</button>
					<button
						type="button"
						onclick={() => markRep(false)}
						class="py-3.5 rounded-xl text-sm font-bold bg-red-900 hover:bg-red-800 text-red-200 flex items-center justify-center gap-2 transition cursor-pointer border border-red-800"
					>
						<XCircle class="w-5 h-5" />
						<span>FAIL</span>
					</button>
				</div>

				<!-- Minimum reps gate -->
				{#if totalReps >= 5}
					<div class="pt-2 border-t border-neutral-800 space-y-3">
						<div class="space-y-1.5">
							<label for="discovery" class="text-xs font-semibold text-neutral-300">
								Discovery Note — "What did I learn about the mechanism?"
							</label>
							<textarea
								id="discovery"
								rows="2"
								bind:value={discoveryNote}
								placeholder="e.g. The linter catches 'striking' but misses 'vast' — which is also evaluative. Need to self-check implied scale adjectives..."
								class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
							></textarea>
						</div>
						<button
							type="button"
							onclick={completeSession}
							class="w-full py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
						>
							<Sparkles class="w-4 h-4" />
							<span>Complete Session & Save ({totalReps} reps, {passedCount} passed)</span>
						</button>
					</div>
				{:else}
					<p class="text-center text-xs text-neutral-500">
						{5 - totalReps} more rep{5 - totalReps !== 1 ? 's' : ''} before you can complete the session
					</p>
				{/if}
			</div>

		<!-- ────────────────────────────────────────
		     PHASE 3: COMPLETE
		     ──────────────────────────────────────── -->
		{:else if phase === 'complete'}
			<div class="space-y-4 text-center">
				<div class="flex flex-col items-center gap-3 py-4">
					<div class="w-14 h-14 rounded-full bg-emerald-950/40 border-2 border-emerald-600 flex items-center justify-center">
						<CheckCircle2 class="w-8 h-8 text-emerald-400" />
					</div>
					<div>
						<h3 class="text-lg font-bold text-white">Session Complete</h3>
						<p class="text-sm text-neutral-400 mt-1">{drill.title}</p>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3 text-left">
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
						<div class="text-[10px] font-mono text-neutral-500 uppercase">Total Reps</div>
						<div class="text-xl font-bold text-white font-mono">{totalReps}</div>
					</div>
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
						<div class="text-[10px] font-mono text-neutral-500 uppercase">Success Rate</div>
						<div class="text-xl font-bold font-mono {successRate >= 0.7 && successRate <= 0.85 ? 'text-emerald-400' : 'text-amber-400'}">{Math.round(successRate * 100)}%</div>
					</div>
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
						<div class="text-[10px] font-mono text-neutral-500 uppercase">Duration</div>
						<div class="text-xl font-bold text-white font-mono">{sessionDuration}m</div>
					</div>
				</div>

				<!-- Zone verdict -->
				<div class="p-3.5 rounded-xl text-sm font-medium text-left {successRate >= 0.7 && successRate <= 0.85 ? 'bg-emerald-950/30 border border-emerald-800/40 text-emerald-300' : successRate > 0.85 ? 'bg-amber-950/30 border border-amber-800/40 text-amber-300' : 'bg-red-950/30 border border-red-800/40 text-red-300'}">
					{#if successRate > 0.85}
						⬆ Next session: increase difficulty — {drill.difficulty.harder}
					{:else if successRate < 0.5}
						⬇ Next session: reduce scope — {drill.difficulty.warmup}
					{:else}
						✓ In the learning zone — maintain this difficulty level
					{/if}
				</div>

				{#if discoveryNote}
					<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
						<div class="text-[11px] font-mono text-neutral-500 uppercase mb-1.5">Mechanism Discovery</div>
						<p class="text-xs text-neutral-300 italic">"{discoveryNote}"</p>
					</div>
				{/if}

				<div class="flex gap-3">
					<button
						type="button"
						onclick={resetSession}
						class="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition cursor-pointer"
					>
						Run Another Session
					</button>
					<button
						type="button"
						onclick={onComplete}
						class="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition cursor-pointer"
					>
						Mark Practise Step Done →
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
