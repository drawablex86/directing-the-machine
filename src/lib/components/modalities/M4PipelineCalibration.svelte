<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { CalibrationEntry } from '$lib/schemas/course.schema';
	import { Sliders, AlertTriangle, CheckCircle, Clock, ShieldCheck, HeartPulse, Target } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import { getDrillById } from '$lib/data/drills';

	let activeSubTab = $state<'pipeline' | 'calibration' | 'ergonomics' | 'drills'>('pipeline');
	let activeDrillId = $state<'predict-then-run' | 'm4-causal-ablation'>('predict-then-run');
	let activeDrill = $derived(getDrillById(activeDrillId));

	// Pre-run calibration inputs
	let calDomain = $state<'pipeline' | 'curation' | 'writing' | 'visual' | 'audience' | 'direction' | 'problem'>('pipeline');
	let calVar = $state('');
	let calPrediction = $state('');
	let calConfidence = $state(75);
	let calActual = $state('');
	let calMatched = $state(true);
	let calSurprising = $state(false);
	let calRevision = $state('');

	// Ergonomics timer
	let breakTimerSeconds = $state(2700); // 45m drawing / screen break
	let timerActive = $state(false);
	let intervalId: any = null;

	function toggleErgoTimer() {
		if (timerActive) {
			clearInterval(intervalId);
			timerActive = false;
		} else {
			timerActive = true;
			intervalId = setInterval(() => {
				if (breakTimerSeconds > 0) breakTimerSeconds -= 1;
				else {
					clearInterval(intervalId);
					timerActive = false;
				}
			}, 1000);
		}
	}

	function commitCalibration() {
		if (!calVar.trim() || !calPrediction.trim() || !calActual.trim()) return;

		const entry: CalibrationEntry = {
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			domain: calDomain,
			variableChanged: calVar.trim(),
			prediction: calPrediction.trim(),
			confidencePct: calConfidence,
			actualOutcome: calActual.trim(),
			matchedExpectation: calMatched,
			wasSurprising: calSurprising,
			modelRevision: calRevision.trim() || 'Internal mental model updated.'
		};

		practiceStore.calibrations.unshift(entry);
		practiceStore.saveToStorage();

		calVar = '';
		calPrediction = '';
		calActual = '';
		calRevision = '';
	}

	const telemetry = $derived(practiceStore.calibrationTelemetry);
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M4
				</span>
				<h2 class="text-base font-bold text-white">Causal Pipeline & Calibration-vs-Range Lab</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 8, 9, V3, W3: Pre-Run Confidence Lock, Brier Score, and Taste-Narrowness Detector.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeSubTab = 'pipeline'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'pipeline' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Pipeline Mapping
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'calibration'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'calibration' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Calibration & Range
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'ergonomics'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'ergonomics' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Ergonomic HUD
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

	<!-- TAB 1: 9-Layer Pipeline Mapper -->
	{#if activeSubTab === 'pipeline'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The Causal Pipeline (Module 8):</strong>
				A pipeline is not a bag of tricks. It is a hypothesis about causality. Every node, prompt, tool, or edit must answer:
				<em>What variable am I trying to control, and why?</em>
			</div>

			<!-- Pipeline 9 layers visual grid -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
				{#each [
					{ num: 1, name: '1. Brief Specification', role: 'Input intention & constraints' },
					{ num: 2, name: '2. Input Preparation', role: 'Structural skeletons & thumbnails' },
					{ num: 3, name: '3. Generation / Drafting', role: 'First pass material creation' },
					{ num: 4, name: '4. Structural Conditioning', role: 'ControlNet / Prose outline' },
					{ num: 5, name: '5. Identity & Voice', role: 'Consistent character / register' },
					{ num: 6, name: '6. Curation & Selection', role: 'Comparative criteria filter' },
					{ num: 7, name: '7. Revision & Touchup', role: 'Manual craft interventions' },
					{ num: 8, name: '8. Verification', role: 'Checking against acceptance criteria' },
					{ num: 9, name: '9. Final Production', role: 'Delivery & Rights/Provenance' }
				] as layer}
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1">
						<div class="font-bold text-amber-400 text-[11px]">{layer.name}</div>
						<div class="text-[10px] text-neutral-400">{layer.role}</div>
					</div>
				{/each}
			</div>

			<!-- Version Naming Convention -->
			<div class="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-2">
				<div class="font-semibold text-neutral-200">Status-Aware Version Naming (Appendix L):</div>
				<code class="text-amber-400 font-mono text-[11px] block bg-neutral-900 p-2 rounded-lg">
					project-name_v01_YYYY-MM-DD_status_purpose
				</code>
				<div class="text-[11px] text-neutral-400">
					Status values: <span class="text-neutral-300">draft</span> (exploratory), <span class="text-neutral-300">review</span> (submitted for critique), <span class="text-neutral-300">approved</span> (moving to production), <span class="text-neutral-300">final</span> (delivered).
				</div>
			</div>
		</div>

	<!-- TAB 2: Calibration & Taste-Narrowness Detector -->
	{:else if activeSubTab === 'calibration'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Pre-Run Prediction & Calibration (Module 9):</strong>
				The question is not: <em>"Was I right?"</em> It is: <em>"Was I as right as I expected to be?"</em>
				Commit a written prediction with a confidence percentage <strong>before</strong> running the test.
			</div>

			<!-- Telemetry Dashboard -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Entries</div>
					<div class="text-lg font-mono font-bold text-neutral-100">{telemetry.total}</div>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Hit Rate</div>
					<div class="text-lg font-mono font-bold text-amber-400">{telemetry.hitRate}%</div>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Brier Error</div>
					<div class="text-lg font-mono font-bold text-neutral-300">{telemetry.brierScore}</div>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
					<div class="text-[10px] text-neutral-500 uppercase tracking-wider">Surprise Rate</div>
					<div class="text-lg font-mono font-bold text-emerald-400">{telemetry.surpriseRate}%</div>
				</div>
			</div>

			<!-- Narrowness Alert if detected -->
			{#if telemetry.narrownessWarning}
				<div class="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2.5">
					<AlertTriangle class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
					<div>
						<strong class="font-bold">Taste-Narrowness Alert (Module 9):</strong>
						<p class="text-[11px] text-amber-200 mt-0.5 leading-relaxed">
							{telemetry.narrownessReason}
						</p>
					</div>
				</div>
			{/if}

			<!-- Commit New Prediction Form -->
			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
				<div class="font-bold text-neutral-200">Commit Pre-Run Prediction:</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label for="cal-dom" class="block text-neutral-400 mb-1">Domain:</label>
						<select id="cal-dom" bind:value={calDomain} class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200">
							<option value="pipeline">Pipeline variable</option>
							<option value="curation">Curation / Taste</option>
							<option value="visual">Visual composition</option>
							<option value="writing">Writing voice & rhythm</option>
							<option value="audience">Audience perception</option>
							<option value="direction">Direction / Client</option>
							<option value="problem">Problem selection</option>
						</select>
					</div>
					<div>
						<label for="cal-var" class="block text-neutral-400 mb-1">Variable being changed or tested:</label>
						<input id="cal-var" type="text" bind:value={calVar} placeholder="e.g. Inverting value contrast in background" class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200" />
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
					<div class="sm:col-span-2">
						<label for="cal-pred" class="block text-neutral-400 mb-1">Pre-run prediction (What will happen?):</label>
						<input id="cal-pred" type="text" bind:value={calPrediction} placeholder="e.g. Eye will enter at secondary doorway instead of main figure" class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200" />
					</div>
					<div>
						<div class="flex items-center justify-between text-neutral-400 mb-1">
							<span>Confidence:</span>
							<span class="font-mono font-bold text-amber-400">{calConfidence}%</span>
						</div>
						<input type="range" min="0" max="100" step="5" bind:value={calConfidence} class="w-full accent-amber-500" />
					</div>
				</div>

				<!-- Post-run actuals -->
				<div class="pt-2 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label for="cal-act" class="block text-neutral-400 mb-1">Actual outcome after test:</label>
						<input id="cal-act" type="text" bind:value={calActual} placeholder="What actually happened..." class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200" />
					</div>
					<div>
						<label for="cal-rev" class="block text-neutral-400 mb-1">Mental model revision (What changed in your understanding?):</label>
						<input id="cal-rev" type="text" bind:value={calRevision} placeholder="e.g. Edge sharpness dominates over value mass for entry" class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200" />
					</div>
				</div>

				<div class="flex items-center gap-4 pt-1">
					<label class="flex items-center gap-2 cursor-pointer text-neutral-300">
						<input type="checkbox" bind:checked={calMatched} class="rounded accent-amber-500" />
						<span>Matched expectation</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer text-neutral-300">
						<input type="checkbox" bind:checked={calSurprising} class="rounded accent-amber-500" />
						<span>Was surprising (breaks habitual safe zone)</span>
					</label>
				</div>

				<button
					type="button"
					onclick={commitCalibration}
					disabled={!calVar.trim() || !calPrediction.trim() || !calActual.trim()}
					class="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition"
				>
					Lock Calibration Record
				</button>
			</div>
		</div>

	<!-- TAB 3: Ergonomics & Physical Sustainability (Appendix K) -->
	{:else if activeSubTab === 'ergonomics'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Physical Sustainability (Appendix K):</strong>
				Craft hours can damage tendons, wrists, and eyes if neglected. A sustainable practitioner monitors physical health as part of craft discipline.
			</div>

			<div class="p-6 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
				<HeartPulse class="w-8 h-8 text-rose-500" />
				<div>
					<div class="font-bold text-sm text-neutral-200">45-Minute Posture & 20-20-20 Eye Break Timer</div>
					<div class="text-2xl font-mono font-bold text-amber-400 mt-1">
						{Math.floor(breakTimerSeconds / 60)}:{String(breakTimerSeconds % 60).padStart(2, '0')}
					</div>
				</div>
				<button
					type="button"
					onclick={toggleErgoTimer}
					class="px-4 py-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition"
				>
					{timerActive ? 'Pause Timer' : 'Start Break Timer'}
				</button>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
					<span class="font-bold text-neutral-300">20-20-20 Rule</span>
					<p class="text-[11px] text-neutral-400">Every 20 minutes, look at something 20 feet away for 20 seconds to reset ciliary eye muscles.</p>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
					<span class="font-bold text-neutral-300">Wrist & Grip</span>
					<p class="text-[11px] text-neutral-400">Release stylus or keyboard death-grip. Draw from the shoulder and elbow, not only fingers.</p>
				</div>
				<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
					<span class="font-bold text-neutral-300">Hydration & Walk</span>
					<p class="text-[11px] text-neutral-400">Stand up and walk for 3 minutes before beginning any new rendering or drafting cycle.</p>
				</div>
			</div>
		</div>

	<!-- TAB 4: Deliberate Practice Drill Reps -->
	{:else if activeSubTab === 'drills'}
		<div class="space-y-4">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
				<div>
					<strong class="text-neutral-200">Module 4 Deliberate Practice Drills:</strong> Causal isolation, variable prediction locks, and ablation testing.
				</div>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => activeDrillId = 'predict-then-run'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'predict-then-run' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Predict-Then-Run (10m)
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'm4-causal-ablation'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm4-causal-ablation' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Causal Ablation (12m)
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
