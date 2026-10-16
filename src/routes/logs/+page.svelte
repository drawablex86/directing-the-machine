<script lang="ts">
	import TodayLoopHeader from '$lib/components/shell/TodayLoopHeader.svelte';
	import TenMinuteLogTimer from '$lib/components/shell/TenMinuteLogTimer.svelte';
	import ReferenceDrawer from '$lib/components/shell/ReferenceDrawer.svelte';
	import FailureTriageModal from '$lib/components/shell/FailureTriageModal.svelte';
	import HemingwayStopModal from '$lib/components/shell/HemingwayStopModal.svelte';
	import { practiceStore } from '$lib/state/practice.svelte';
	import { generateAppendixLMarkdownTree } from '$lib/engine/archive-exporter';
	import { Download, Flame, FileText, CheckCircle2, ArrowLeft, AlertTriangle, Target, Layers, FileCheck, Sparkles, BookOpen, FileDown, Check } from '@lucide/svelte';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let isDrawerOpen = $state(false);
	let isFailureModalOpen = $state(false);
	let isStopModalOpen = $state(false);
	let activeLogTab = $state<'problems' | 'calibrations' | 'decisions' | 'briefs' | 'drills' | 'attention' | 'play'>('problems');
	let exportSuccess = $state(false);

	// Log Decay Sentinel state
	let logDecayCritique = $state<CritiqueResult | null>(null);
	let isCheckingDecay = $state(false);
	let decaySavedNotice = $state(false);

	// Appendix L Synthesizer state
	let synthesisCritique = $state<CritiqueResult | null>(null);
	let isSynthesizing = $state(false);
	let synthesisSavedNotice = $state(false);

	function exportAppendixLArchive() {
		const archive = generateAppendixLMarkdownTree({
			projectName: 'Directing-the-Machine-Studio',
			exportedAt: new Date().toISOString(),
			problems: practiceStore.problems,
			calibrations: practiceStore.calibrations,
			practiceSessions: practiceStore.practiceSessions,
			drillSessions: practiceStore.drillSessions,
			decisions: practiceStore.decisions,
			briefs: practiceStore.briefs,
			playNotes: practiceStore.playLines.map((p) => p.line),
			nonInstrumentalNotes: practiceStore.nonInstrumentalLines.map((a) => a.line)
		});

		const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `appendix_l_project_archive_${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);

		exportSuccess = true;
		setTimeout(() => (exportSuccess = false), 3000);
	}

	function downloadMonographMarkdown(filename: string, content: string) {
		const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function runLogDecayAudit() {
		if (isCheckingDecay) return;
		isCheckingDecay = true;
		try {
			const res = await executePrompt('log-decay-sentinel', {
				logType: activeLogTab,
				entries:
					activeLogTab === 'problems'
						? practiceStore.problems.slice(0, 10).map((p) => p.framedProblem)
						: activeLogTab === 'calibrations'
							? practiceStore.calibrations.slice(0, 10).map((c) => `${c.variableChanged}: ${c.confidencePct}% -> ${c.prediction}`)
							: activeLogTab === 'decisions'
								? practiceStore.decisions.slice(0, 10).map((d) => d.decision)
								: practiceStore.playLines.slice(0, 10).map((p) => p.line),
				recentProblems: practiceStore.problems.slice(0, 5).map((p) => p.framedProblem),
				recentCalibrations: practiceStore.calibrations.slice(0, 5).map((c) => `${c.variableChanged} (${c.confidencePct}%): ${c.prediction}`),
				recentDecisions: practiceStore.decisions.slice(0, 5).map((d) => d.decision),
				recentBriefs: practiceStore.briefs.slice(0, 5).map((b) => b.title)
			});
			logDecayCritique = res;
		} catch (err) {
			console.error('Failed to run log decay audit:', err);
		} finally {
			isCheckingDecay = false;
		}
	}

	async function runAppendixLSynthesis() {
		if (isSynthesizing) return;
		isSynthesizing = true;
		try {
			const res = await executePrompt('appendix-l-synthesis', {
				problemCount: practiceStore.problems.length,
				decisionCount: practiceStore.decisions.length,
				calibrationCount: practiceStore.calibrations.length,
				briefCount: practiceStore.briefs.length,
				sampleProblems: practiceStore.problems.slice(0, 6).map((p) => `"${p.framedProblem}" (${p.mode})`),
				sampleDecisions: practiceStore.decisions.slice(0, 8).map((d) => `Decision: "${d.decision}" | Rejected: "${d.alternativesRejected}" | Justification: "${d.justification}"`),
				sampleCalibrations: practiceStore.calibrations.slice(0, 6).map((c) => `Var: ${c.variableChanged} | Conf: ${c.confidencePct}% | Model Rev: "${c.modelRevision}"`),
				sampleBriefs: practiceStore.briefs.slice(0, 5).map((b) => `Title: "${b.title}" | Intention: "${b.intention}"`)
			});
			synthesisCritique = res;
		} catch (err) {
			console.error('Failed to run Appendix L synthesis:', err);
		} finally {
			isSynthesizing = false;
		}
	}

	const decayActions: LlmAction[] = [
		{
			label: 'Adopt Sharpened Sample to Decision Log',
			primary: true,
			onClick: (result) => {
				if (result.logDecayAudit?.sharpenedSampleEntry) {
					practiceStore.saveDecision({
						project: 'Studio Logbook Anti-Decay',
						decision: `Adopted Sharpened Log Standard: ${result.logDecayAudit.sharpenedSampleEntry.slice(0, 80)}...`,
						highestUnresolvedLevel: 'Level 1 (Intent)',
						alternativesRejected: 'Continuing with repetitive logging theatre or uniform confidence ratings',
						justification: `Anti-Decay Intervention: ${result.logDecayAudit.prescribedIntervention}`,
						feedbackIncorporated: 'Log Decay Sentinel Audit',
						refusals: 'Logging Theatre'
					});
					decaySavedNotice = true;
					setTimeout(() => (decaySavedNotice = false), 3000);
				}
			}
		},
		{
			label: 'Save Anti-Decay Audit to Decision Log',
			variant: 'secondary',
			onClick: (result) => {
				if (result.logDecayAudit) {
					practiceStore.saveDecision({
						project: 'Studio Logbook Anti-Decay',
						decision: `Log Rigor Audit: ${result.logDecayAudit.decayStatus} (Score ${result.logDecayAudit.decayScore}/10)`,
						highestUnresolvedLevel: 'Level 2 (Diagnostic)',
						alternativesRejected: 'Passive checkbox compliance',
						justification: `Prescription: ${result.logDecayAudit.prescribedIntervention} Symptoms: ${result.logDecayAudit.symptomsDetected.join('; ')}`,
						feedbackIncorporated: 'Log Decay Sentinel Audit',
						refusals: 'None'
					});
					decaySavedNotice = true;
					setTimeout(() => (decaySavedNotice = false), 3000);
				}
			}
		}
	];

	const synthesisActions: LlmAction[] = [
		{
			label: 'Download Directorial Monograph (.md)',
			primary: true,
			onClick: (result) => {
				if (result.appendixLSynthesis?.appendixLMarkdownExport) {
					downloadMonographMarkdown(
						`appendix_l_directorial_monograph_${new Date().toISOString().slice(0, 10)}.md`,
						result.appendixLSynthesis.appendixLMarkdownExport
					);
				}
			}
		},
		{
			label: 'Save Retrospective Summary to Decision Log',
			variant: 'secondary',
			onClick: (result) => {
				if (result.appendixLSynthesis) {
					practiceStore.saveDecision({
						project: 'Appendix L Portfolio Monograph',
						decision: `Synthesized Directorial Evolution: "${result.appendixLSynthesis.title}"`,
						highestUnresolvedLevel: 'Level 1 (Intent)',
						alternativesRejected: 'Leaving studio logs fragmented and unexamined across separate files',
						justification: `Breakthroughs: ${result.appendixLSynthesis.majorBreakthroughs.join('; ')} | Blind Spots: ${result.appendixLSynthesis.persistentBlindSpots.join('; ')}`,
						feedbackIncorporated: 'Master Archivist Appendix L Synthesis',
						refusals: result.appendixLSynthesis.refusalChronicleSummary
					});
					synthesisSavedNotice = true;
					setTimeout(() => (synthesisSavedNotice = false), 3000);
				}
			}
		}
	];
</script>

<div class="flex flex-col min-h-screen">
	<TodayLoopHeader
		onOpenDrawer={() => isDrawerOpen = true}
		onOpenFailure={() => isFailureModalOpen = true}
		onOpenStop={() => isStopModalOpen = true}
	/>

	<main id="main-content" class="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
		<!-- Top Navigation Link -->
		<div>
			<a
				href="/app"
				class="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
			>
				<ArrowLeft class="w-3.5 h-3.5" />
				<span>← Return to Studio Workbench</span>
			</a>
		</div>

		<!-- Automated Log Decay Warning Banner (Appendix M, Failure Mode 4) -->
		{#if practiceStore.logDecayAlerts.length > 0}
			<div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-2">
				<div class="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
					<AlertTriangle class="w-4 h-4 shrink-0" />
					<span>Automated Log Decay Warning (Appendix M Failure Mode 4)</span>
				</div>
				<ul class="text-xs text-amber-200/90 space-y-1 list-disc list-inside">
					{#each practiceStore.logDecayAlerts as alert}
						<li>{alert}</li>
					{/each}
				</ul>
				<p class="text-[11px] text-amber-400/80 italic pt-1">
					"The document is not the practice. If log entries repeat verbatim, you are performing recording theatre rather than noticing."
				</p>
			</div>
		{/if}

		<!-- Logbook Header with 10-Minute Hard Cap -->
		<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-xl font-bold text-white">Unified Studio Logbook</h1>
					<span class="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
						10m Capped
					</span>
				</div>
				<p class="text-xs text-neutral-400 mt-1">
					Problem-Finding Log, Decision Log, Calibration Log, Briefs, Deliberate Practice Reps, Attention, and Play history.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<TenMinuteLogTimer />

				<button
					type="button"
					onclick={exportAppendixLArchive}
					class="px-3.5 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-2 cursor-pointer"
				>
					<Download class="w-3.5 h-3.5" />
					<span>Export Appendix L (.json/.md)</span>
				</button>
			</div>
		</div>

		{#if exportSuccess}
			<div class="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
				<CheckCircle2 class="w-4 h-4 text-emerald-400" />
				<span>Successfully exported Appendix L directory structure (00-problem through 06-play)!</span>
			</div>
		{/if}

		<!-- Studio Logbook Anti-Decay Intelligence Sentinel -->
		<div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
				<div>
					<div class="flex items-center gap-2">
						<Sparkles class="w-4 h-4 text-amber-400" />
						<h2 class="text-sm font-bold text-white uppercase tracking-wider">Log Decay & Theatre Sentinel</h2>
					</div>
					<p class="text-[11px] text-neutral-400 mt-0.5">
						Scans across problems, calibrations, and decisions for rote phrases, flatline confidence, and pseudo-refusals (Appendix M).
					</p>
				</div>
				<LlmTriggerButton
					label="Audit Logbook for Decay"
					onclick={runLogDecayAudit}
					loading={isCheckingDecay}
					title="Audits studio records for rote repetition, default confidence ratings, and pseudo-refusals"
				/>
			</div>

			{#if decaySavedNotice}
				<div class="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-mono">
					<Check class="w-4 h-4 text-emerald-400" />
					<span>Anti-Decay audit commitment saved to Studio Decision Log!</span>
				</div>
			{/if}

			{#if logDecayCritique?.logDecayAudit}
				{@const decay = logDecayCritique.logDecayAudit}
				<div class="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-4">
					<div class="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
						<div class="flex items-center gap-2">
							<span
								class="text-xs font-mono font-bold px-2.5 py-0.5 rounded border {decay.decayStatus === 'PRISTINE_RIGOR'
									? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
									: decay.decayStatus === 'EARLY_SLIPPAGE'
										? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
										: 'bg-rose-500/10 text-rose-400 border-rose-500/30'}"
							>
								{decay.decayStatus}
							</span>
							<span class="text-xs font-mono text-neutral-400">
								Rigor Score: <strong class="text-amber-400">{decay.decayScore}</strong>/10
							</span>
						</div>
						<span class="text-[11px] font-mono text-neutral-500">
							{decay.decayScore >= 8 ? 'High Observational Acuity' : decay.decayScore >= 5 ? 'Emerging Habit Slippage' : 'Logging Theatre Detected'}
						</span>
					</div>

					{#if decay.symptomsDetected.length > 0}
						<div class="space-y-1.5 p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
							<div class="flex items-center gap-1.5 text-xs font-bold text-rose-400">
								<AlertTriangle class="w-3.5 h-3.5 shrink-0" />
								<span>Detected Decay Symptoms & Rote Patterns:</span>
							</div>
							<ul class="text-[11px] text-rose-200/90 list-disc list-inside space-y-0.5">
								{#each decay.symptomsDetected as sym}
									<li>{sym}</li>
								{/each}
							</ul>
						</div>
					{/if}

					<div class="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
						<div class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
							Prescribed Anti-Decay Intervention:
						</div>
						<p class="text-xs text-neutral-200 leading-relaxed">
							{decay.prescribedIntervention}
						</p>
					</div>

					{#if decay.sharpenedSampleEntry}
						<div class="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
							<div class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
								Exemplary Directorial Standard (Zero-Adjective Rewrite):
							</div>
							<p class="text-xs text-neutral-100 font-serif italic leading-relaxed">
								"{decay.sharpenedSampleEntry}"
							</p>
						</div>
					{/if}
				</div>
			{/if}

			{#if logDecayCritique}
				<LlmCritiqueCard
					result={logDecayCritique}
					onDismiss={() => (logDecayCritique = null)}
					actions={decayActions}
				/>
			{/if}
		</div>

		<!-- Log tabs -->
		<div class="flex items-center gap-1 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800 text-xs overflow-x-auto">
			<button
				type="button"
				onclick={() => activeLogTab = 'problems'}
				class="px-3 py-1.5 rounded-lg whitespace-nowrap transition {activeLogTab === 'problems' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Problems ({practiceStore.problems.length})
			</button>
			<button
				type="button"
				onclick={() => activeLogTab = 'calibrations'}
				class="px-3 py-1.5 rounded-lg whitespace-nowrap transition {activeLogTab === 'calibrations' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Calibrations ({practiceStore.calibrations.length})
			</button>
			<button
				type="button"
				onclick={() => activeLogTab = 'decisions'}
				class="px-3 py-1.5 rounded-lg whitespace-nowrap transition {activeLogTab === 'decisions' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Decisions ({practiceStore.decisions.length})
			</button>
			<button
				type="button"
				onclick={() => activeLogTab = 'briefs'}
				class="px-3 py-1.5 rounded-lg whitespace-nowrap transition {activeLogTab === 'briefs' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Briefs ({practiceStore.briefs.length})
			</button>
			<button
				type="button"
				onclick={() => activeLogTab = 'drills'}
				class="px-3 py-1.5 rounded-lg whitespace-nowrap transition {activeLogTab === 'drills' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Drill Reps ({practiceStore.drillSessions.length})
			</button>
			<button
				type="button"
				onclick={() => activeLogTab = 'attention'}
				class="px-3 py-1.5 rounded-lg whitespace-nowrap transition {activeLogTab === 'attention' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Attention ({practiceStore.nonInstrumentalLines.length})
			</button>
			<button
				type="button"
				onclick={() => activeLogTab = 'play'}
				class="px-3 py-1.5 rounded-lg whitespace-nowrap transition {activeLogTab === 'play' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Play ({practiceStore.playLines.length})
			</button>
		</div>

		<!-- Log Content Display -->
		<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs">
			{#if activeLogTab === 'problems'}
				{#if practiceStore.problems.length === 0}
					<div class="text-neutral-500 py-8 text-center">No problem entries logged yet. Visit M1 to find problems.</div>
				{:else}
					<div class="space-y-2.5">
						{#each practiceStore.problems as p}
							<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1.5">
								<div class="flex items-center justify-between">
									<span class="font-bold text-neutral-200 text-sm">{p.framedProblem}</span>
									<span class="font-mono text-[10px] text-neutral-500">{p.date} • {p.mode}</span>
								</div>
								<div class="text-neutral-400">
									<strong class="text-neutral-500">Noticed:</strong> {p.noticed}
								</div>
								<div class="text-neutral-400">
									<strong class="text-neutral-500">Positionality:</strong> {p.positionality} ({p.hasStanding ? 'Standing Verified' : 'Refused'})
								</div>
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeLogTab === 'calibrations'}
				{#if practiceStore.calibrations.length === 0}
					<div class="text-neutral-500 py-8 text-center">No calibrations logged yet. Visit M4 to lock pre-run predictions.</div>
				{:else}
					<div class="space-y-2.5">
						{#each practiceStore.calibrations as c}
							<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1.5">
								<div class="flex items-center justify-between">
									<span class="font-bold text-neutral-200 text-sm">{c.variableChanged}</span>
									<span class="font-mono text-[11px] {c.matchedExpectation ? 'text-emerald-400' : 'text-amber-400'}">
										{c.confidencePct}% Conf • {c.matchedExpectation ? 'Matched' : 'Missed'}
									</span>
								</div>
								<div class="text-neutral-400">
									<strong class="text-neutral-500">Prediction:</strong> {c.prediction}
								</div>
								<div class="text-neutral-400">
									<strong class="text-neutral-500">Actual:</strong> {c.actualOutcome}
								</div>
								<div class="text-neutral-400 text-[11px] italic">
									<strong class="text-neutral-500">Mental Model Revision:</strong> {c.modelRevision}
								</div>
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeLogTab === 'decisions'}
				{#if practiceStore.decisions.length === 0}
					<div class="text-neutral-500 py-8 text-center">No consequential decisions logged yet.</div>
				{:else}
					<div class="space-y-2.5">
						{#each practiceStore.decisions as d}
							<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1.5">
								<div class="flex items-center justify-between">
									<span class="font-bold text-neutral-200 text-sm">{d.decision}</span>
									<span class="font-mono text-[10px] text-neutral-500">{d.date} • {d.project}</span>
								</div>
								<div class="text-neutral-400">
									<strong class="text-neutral-500">Alternatives Rejected:</strong> {d.alternativesRejected}
								</div>
								<div class="text-neutral-400">
									<strong class="text-neutral-500">Justification:</strong> {d.justification}
								</div>
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeLogTab === 'briefs'}
				{#if practiceStore.briefs.length === 0}
					<div class="text-neutral-500 py-8 text-center">No briefs authored yet. Visit M3 to construct 7-layer briefs.</div>
				{:else}
					<div class="space-y-4">
						{#each practiceStore.briefs as b}
							<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
								<div class="flex items-center justify-between border-b border-neutral-800/80 pb-2">
									<div>
										<h3 class="font-bold text-neutral-100 text-sm">{b.title}</h3>
										<p class="text-neutral-400 text-xs mt-0.5"><strong class="text-neutral-500">Premise:</strong> {b.premise}</p>
									</div>
									<span class="font-mono text-[10px] text-neutral-500">{b.date}</span>
								</div>

								<div class="text-neutral-300">
									<strong class="text-neutral-500">Intention:</strong> {b.intention}
								</div>

								{#if b.constraints.length > 0}
									<div class="space-y-1">
										<strong class="text-neutral-500 uppercase text-[10px] tracking-wider">Constraints:</strong>
										<ul class="list-disc list-inside text-neutral-400 space-y-0.5">
											{#each b.constraints as c}
												<li>{c}</li>
											{/each}
										</ul>
									</div>
								{/if}

								{#if b.acceptanceCriteria.length > 0}
									<div class="space-y-1">
										<strong class="text-neutral-500 uppercase text-[10px] tracking-wider">Acceptance Criteria:</strong>
										<ul class="list-disc list-inside text-neutral-400 space-y-0.5">
											{#each b.acceptanceCriteria as a}
												<li>{a}</li>
											{/each}
										</ul>
									</div>
								{/if}

								{#if b.provenance}
									<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
										<div class="font-bold text-neutral-300">Provenance Stamp:</div>
										<div><span class="text-neutral-500">Origin:</span> {b.provenance.origin}</div>
										<div><span class="text-neutral-500">Human:</span> {b.provenance.humanContribution}</div>
										<div><span class="text-neutral-500">Tool:</span> {b.provenance.toolContribution}</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeLogTab === 'drills'}
				{#if practiceStore.drillSessions.length === 0}
					<div class="text-neutral-500 py-8 text-center">No deliberate practice drill reps logged yet. Open any Studio Lab (M0–M7) and complete drill reps.</div>
				{:else}
					<div class="space-y-3">
						{#each practiceStore.drillSessions as ds}
							{@const passRate = ds.totalReps > 0 ? Math.round((ds.passedReps / ds.totalReps) * 100) : 0}
							<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<span class="font-bold text-neutral-200 text-sm font-mono">{ds.drillId}</span>
										<span class="px-2 py-0.5 rounded text-[10px] font-mono {passRate >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
											{ds.passedReps}/{ds.totalReps} passed ({passRate}%)
										</span>
									</div>
									<div class="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
										<span>{ds.durationMinutes}m duration</span>
										<span>•</span>
										<span>{ds.date}</span>
									</div>
								</div>

								<div class="flex items-center gap-4 text-[11px] text-neutral-400">
									<div>
										<strong class="text-neutral-500">Difficulty Adjustment:</strong>
										<span class="capitalize text-neutral-300">{ds.difficultyAdjustment}</span>
									</div>
								</div>

								{#if ds.reps && ds.reps.length > 0}
									<div class="flex items-center gap-1.5 flex-wrap pt-1">
										{#each ds.reps as r}
											<span
												class="px-2 py-0.5 rounded text-[10px] font-mono border {r.passed ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' : 'bg-rose-950/60 border-rose-800 text-rose-400'}"
												title={r.failNote ? `Rep ${r.repNumber}: ${r.failNote}` : `Rep ${r.repNumber}: Passed`}
											>
												R{r.repNumber}: {r.passed ? '✓' : '✗'}
											</span>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeLogTab === 'attention'}
				{#if practiceStore.nonInstrumentalLines.length === 0}
					<div class="text-neutral-500 py-8 text-center">No non-instrumental attention lines logged yet. Visit M0.</div>
				{:else}
					<div class="space-y-2">
						{#each practiceStore.nonInstrumentalLines as a}
							<div class="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
								<span class="text-neutral-200">"{a.line}"</span>
								<span class="font-mono text-[10px] text-neutral-500 shrink-0">{a.date}</span>
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeLogTab === 'play'}
				{#if practiceStore.playLines.length === 0}
					<div class="text-neutral-500 py-8 text-center">No play lines logged yet. Visit M0.</div>
				{:else}
					<div class="space-y-2">
						{#each practiceStore.playLines as pl}
							<div class="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
								<span class="text-neutral-200 italic">"{pl.line}"</span>
								<span class="font-mono text-[10px] text-neutral-500 shrink-0">{pl.date}</span>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>

		<!-- Appendix L Directorial Portfolio Synthesizer Section -->
		<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5 text-xs">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
				<div>
					<div class="flex items-center gap-2">
						<BookOpen class="w-4 h-4 text-amber-400" />
						<h2 class="text-base font-bold text-white">Appendix L Directorial Portfolio Synthesizer</h2>
					</div>
					<p class="text-xs text-neutral-400 mt-0.5">
						Synthesize your entire studio trajectory into an executive Directorial Evolution Monograph for portfolio publication.
					</p>
				</div>
				<LlmTriggerButton
					label="Synthesize Directorial Monograph"
					onclick={runAppendixLSynthesis}
					loading={isSynthesizing}
					title="Generates a cohesive directorial evolution narrative from all historical studio logs"
				/>
			</div>

			{#if synthesisSavedNotice}
				<div class="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-mono">
					<Check class="w-4 h-4 text-emerald-400" />
					<span>Directorial Monograph synthesis recorded into Studio Decision Log!</span>
				</div>
			{/if}

			{#if synthesisCritique?.appendixLSynthesis}
				{@const synth = synthesisCritique.appendixLSynthesis}
				<div class="p-5 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-4">
					<div class="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
						<div class="space-y-0.5">
							<span class="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">Appendix L Retrospective</span>
							<h3 class="text-base font-bold text-white tracking-tight">{synth.title}</h3>
						</div>
						<button
							type="button"
							onclick={() => downloadMonographMarkdown(`appendix_l_directorial_monograph_${new Date().toISOString().slice(0, 10)}.md`, synth.appendixLMarkdownExport)}
							class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
						>
							<FileDown class="w-3.5 h-3.5" />
							<span>Download Monograph (.md)</span>
						</button>
					</div>

					<div class="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
						<div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Directorial Evolution Trajectory</div>
						<p class="text-xs text-neutral-200 font-serif leading-relaxed">
							{synth.evolutionNarrative}
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						{#if synth.majorBreakthroughs.length > 0}
							<div class="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
								<div class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Key Directorial Breakthroughs:</div>
								<ul class="text-[11px] text-emerald-200/90 list-disc list-inside space-y-1">
									{#each synth.majorBreakthroughs as b}
										<li>{b}</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if synth.persistentBlindSpots.length > 0}
							<div class="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/40 space-y-1.5">
								<div class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Persistent Growth Edges:</div>
								<ul class="text-[11px] text-amber-200/90 list-disc list-inside space-y-1">
									{#each synth.persistentBlindSpots as spot}
										<li>{spot}</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>

					<div class="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
						<div class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">The Chronicle of Refusal</div>
						<p class="text-xs text-neutral-300 leading-relaxed font-serif">
							{synth.refusalChronicleSummary}
						</p>
					</div>
				</div>
			{/if}

			{#if synthesisCritique}
				<LlmCritiqueCard
					result={synthesisCritique}
					onDismiss={() => (synthesisCritique = null)}
					actions={synthesisActions}
				/>
			{/if}
		</div>
	</main>

	<!-- Modals -->
	<ReferenceDrawer isOpen={isDrawerOpen} onClose={() => isDrawerOpen = false} />
	<FailureTriageModal isOpen={isFailureModalOpen} onClose={() => isFailureModalOpen = false} />
	<HemingwayStopModal isOpen={isStopModalOpen} onClose={() => isStopModalOpen = false} />
</div>
