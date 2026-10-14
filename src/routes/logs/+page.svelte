<script lang="ts">
	import TodayLoopHeader from '$lib/components/shell/TodayLoopHeader.svelte';
	import TenMinuteLogTimer from '$lib/components/shell/TenMinuteLogTimer.svelte';
	import ReferenceDrawer from '$lib/components/shell/ReferenceDrawer.svelte';
	import FailureTriageModal from '$lib/components/shell/FailureTriageModal.svelte';
	import HemingwayStopModal from '$lib/components/shell/HemingwayStopModal.svelte';
	import { practiceStore } from '$lib/state/practice.svelte';
	import { generateAppendixLMarkdownTree } from '$lib/engine/archive-exporter';
	import { Download, Flame, FileText, CheckCircle2 } from '@lucide/svelte';

	let isDrawerOpen = $state(false);
	let isFailureModalOpen = $state(false);
	let isStopModalOpen = $state(false);
	let activeLogTab = $state<'problems' | 'calibrations' | 'decisions' | 'attention' | 'play'>('problems');
	let exportSuccess = $state(false);

	function exportAppendixLArchive() {
		const archive = generateAppendixLMarkdownTree({
			projectName: 'Directing-the-Machine-Studio',
			exportedAt: new Date().toISOString(),
			problems: practiceStore.problems,
			calibrations: practiceStore.calibrations,
			practiceSessions: practiceStore.practiceSessions,
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
		setTimeout(() => exportSuccess = false, 3000);
	}
</script>

<div class="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
	<TodayLoopHeader
		onOpenDrawer={() => isDrawerOpen = true}
		onOpenFailure={() => isFailureModalOpen = true}
		onOpenStop={() => isStopModalOpen = true}
	/>

	<main id="main-content" class="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
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
					Problem-Finding Log, Decision Log, Calibration Log, Attention, and Play history.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<TenMinuteLogTimer />

				<button
					type="button"
					onclick={exportAppendixLArchive}
					class="px-3.5 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-2"
				>
					<Download class="w-3.5 h-3.5" />
					<span>Export Appendix L (.json/.md)</span>
				</button>
			</div>
		</div>

		{#if exportSuccess}
			<div class="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
				<CheckCircle2 class="w-4 h-4 text-emerald-400" />
				<span>Successfully exported Appendix L directory structure (00-problem through 04-calibration)!</span>
			</div>
		{/if}

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
	</main>

	<!-- Modals -->
	<ReferenceDrawer isOpen={isDrawerOpen} onClose={() => isDrawerOpen = false} />
	<FailureTriageModal isOpen={isFailureModalOpen} onClose={() => isFailureModalOpen = false} />
	<HemingwayStopModal isOpen={isStopModalOpen} onClose={() => isStopModalOpen = false} />
</div>
