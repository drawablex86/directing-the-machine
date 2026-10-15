<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { Users, Ban, GitFork, MessageSquare, Volume2, VolumeX, ShieldCheck, CheckCircle2, Target } from '@lucide/svelte';
	import DrillRunner from '$lib/components/shell/DrillRunner.svelte';
	import { getDrillById } from '$lib/data/drills';

	let activeSubTab = $state<'scope' | 'triage' | 'refusal' | 'transmission' | 'drills'>('scope');
	let activeDrillId = $state<'m6-refusal-pressure' | 'm6-feedback-translation'>('m6-refusal-pressure');
	let activeDrill = $derived(getDrillById(activeDrillId));

	let revisionSaved = $state(false);
	let triageSaved = $state(false);
	let refusalSaved = $state(false);

	// Scope & Revision Fork (Module 12/13)
	let currentCycle = $state(1); // max 3 named revision cycles
	let revisionFocus = $state('Cycle 1: Resolve high-contrast focal entry');
	let shouldRebrief = $state(false);

	function commitRevisionDecision() {
		practiceStore.saveDecision({
			project: 'Production Direction & Revision Fork (M6)',
			decision: shouldRebrief
				? `Re-Brief Fork Initiated (After Cycle ${currentCycle})`
				: `Named Revision Cycle ${currentCycle} Lock: ${revisionFocus}`,
			highestUnresolvedLevel: shouldRebrief ? 'Premise & Core Framing' : 'Cycle 1-3 Structural Refinement',
			alternativesRejected: shouldRebrief ? 'Endless cosmetic patching' : 'Premature re-briefing',
			justification: shouldRebrief
				? 'Core premise flawed or 3-cycle revision limit reached without convergence.'
				: 'Targeted structural revision within current brief parameters.',
			feedbackIncorporated: `Cycle ${currentCycle}/3 tracked`,
			refusals: shouldRebrief ? 'Refused fourth cosmetic revision' : 'Refused out-of-scope adjustments'
		});
		revisionSaved = true;
		setTimeout(() => revisionSaved = false, 3000);
	}

	// Stakeholder Critique Translator
	let rawFeedback = $state('Make the logo and the person bigger and more inspiring.');
	let diagnosedUnderlyingNeed = $state('Stakeholder fears lack of emotional presence and brand illegibility.');
	let selectedAction = $state<'apply' | 'adapt' | 'alternative' | 'pushback' | 'rebrief'>('alternative');

	function commitTriageDecision() {
		if (!rawFeedback.trim()) return;
		practiceStore.saveDecision({
			project: 'Stakeholder Feedback Triage (M6)',
			decision: `Action [${selectedAction.toUpperCase()}] on Feedback: "${rawFeedback.trim()}"`,
			highestUnresolvedLevel: 'Directorial Translation of Stakeholder Intent',
			alternativesRejected: 'Literal compliance without diagnosis',
			justification: `Diagnosed Root Need: ${diagnosedUnderlyingNeed.trim()}`,
			feedbackIncorporated: rawFeedback.trim(),
			refusals: selectedAction === 'pushback' ? 'Pushed back against non-convergent surface demand' : 'None'
		});
		triageSaved = true;
		setTimeout(() => triageSaved = false, 3000);
	}

	// 5-Mode Refusal Composer (Appendix F)
	let refusalMode = $state<'Ethical' | 'Positional' | 'Technical' | 'Intentional' | 'Slop'>('Ethical');
	let refusalTarget = $state('');
	let refusalRationale = $state('');

	function commitRefusalDecision() {
		if (!refusalTarget.trim()) return;
		practiceStore.saveDecision({
			project: '5-Mode Refusal System (M6)',
			decision: `${refusalMode} Refusal: ${refusalTarget.trim()}`,
			highestUnresolvedLevel: 'Professional Authorship Boundaries',
			alternativesRejected: 'Passive acquiescence or silent resentment',
			justification: refusalRationale.trim() || 'Directorial integrity commitment',
			feedbackIncorporated: 'Boundary defense',
			refusals: refusalTarget.trim()
		});
		refusalSaved = true;
		setTimeout(() => refusalSaved = false, 3000);
	}

	// Transmission & Silence Tolerance (Module 19)
	let silenceTimerSeconds = $state(10);
	let silenceRunning = $state(false);
	let silenceInterval: any = null;

	function toggleSilenceTimer() {
		if (silenceRunning) {
			clearInterval(silenceInterval);
			silenceRunning = false;
		} else {
			silenceTimerSeconds = 10;
			silenceRunning = true;
			silenceInterval = setInterval(() => {
				if (silenceTimerSeconds > 0) silenceTimerSeconds -= 1;
				else {
					clearInterval(silenceInterval);
					silenceRunning = false;
				}
			}, 1000);
		}
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M6
				</span>
				<h2 class="text-base font-bold text-white">Production Direction, Collaboration & Refusal Studio</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 12, 13, 14, 19, Appendix F: Revision vs Re-Brief Fork, Refusal Composer, and Mentorship.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeSubTab = 'scope'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'scope' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Revision Fork
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'triage'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'triage' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Feedback Triage
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'refusal'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'refusal' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				5-Mode Refusal
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'transmission'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'transmission' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Transmission (M19)
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

	<!-- TAB 1: Revision vs. Re-Brief Fork -->
	{#if activeSubTab === 'scope'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Revision Discipline & Re-Brief Fork (Module 12):</strong>
				A project is allowed maximum <strong>3 named revision cycles</strong>. Each cycle has a specific structural target.
				If the work still fails after 3 cycles, you are solving the wrong problem: execute a formal <strong>Re-Brief</strong>.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
				{#each [1, 2, 3] as cycleNum}
					<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 {currentCycle === cycleNum ? 'border-amber-500 shadow' : ''}">
						<div class="flex items-center justify-between">
							<span class="font-bold text-neutral-200">Cycle {cycleNum} of 3</span>
							{#if currentCycle === cycleNum}
								<span class="text-[10px] text-amber-400 font-bold uppercase">Active</span>
							{/if}
						</div>
						<p class="text-[11px] text-neutral-400">
							{cycleNum === 1 ? 'Structural focal fix' : cycleNum === 2 ? 'Value & rhythm tuning' : 'Local polish & edge hierarchy'}
						</p>
					</div>
				{/each}
			</div>

			<!-- Re-Brief Trigger & Revision Commit -->
			<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
				<div class="space-y-1">
					<div class="font-bold text-neutral-200">Is the core premise flawed?</div>
					<div class="text-neutral-400 text-[11px]">If structural problems persist across cycles, do not patch surface rendering. Re-brief.</div>
				</div>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => shouldRebrief = !shouldRebrief}
						class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer {shouldRebrief ? 'bg-red-950 border border-red-800 text-red-300' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}"
					>
						{shouldRebrief ? 'Re-Brief Initiated' : 'Trigger Re-Brief'}
					</button>
					<button
						type="button"
						onclick={commitRevisionDecision}
						class="px-3.5 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
					>
						<CheckCircle2 class="w-3.5 h-3.5" />
						<span>Commit Revision Choice</span>
					</button>
				</div>
			</div>
			{#if revisionSaved}
				<div class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
					<CheckCircle2 class="w-4 h-4" />
					Revision choice committed to Decision Log!
				</div>
			{/if}
		</div>

	<!-- TAB 2: Stakeholder Critique Triage -->
	{:else if activeSubTab === 'triage'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Stakeholder Critique Translator (Module 12):</strong>
				Clients and audiences often diagnose symptoms in surface terms (<em>"Make the logo bigger"</em>).
				Translate surface demands into underlying outcomes, then select one of 5 directorial actions:
				<code>Apply | Adapt | Propose Alternative | Push Back | Re-Brief</code>.
			</div>

			<div class="space-y-3 text-xs">
				<div>
					<label for="raw-feed" class="block font-medium text-neutral-300 mb-1">Raw Surface Feedback:</label>
					<input id="raw-feed" type="text" bind:value={rawFeedback} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="under-need" class="block font-medium text-neutral-300 mb-1">Inferred Underlying Need (What are they really feeling?):</label>
					<input id="under-need" type="text" bind:value={diagnosedUnderlyingNeed} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
			</div>

			<div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
				{#each [
					{ id: 'apply', label: 'Apply', desc: 'Direct request is valid' },
					{ id: 'adapt', label: 'Adapt', desc: 'Solve underlying need differently' },
					{ id: 'alternative', label: 'Propose Alternative', desc: 'Better solution to same goal' },
					{ id: 'pushback', label: 'Push Back', desc: 'Request harms brief intention' },
					{ id: 'rebrief', label: 'Re-Brief', desc: 'Conflicting premise detected' }
				] as act}
					<button
						type="button"
						onclick={() => selectedAction = act.id as any}
						class="p-2.5 rounded-xl border text-left transition {selectedAction === act.id ? 'bg-neutral-950 border-amber-500 text-amber-400 font-bold' : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'}"
					>
						<div class="text-xs">{act.label}</div>
						<div class="text-[10px] text-neutral-500 mt-0.5">{act.desc}</div>
					</button>
				{/each}
			</div>

			<div class="flex items-center justify-between pt-2">
				{#if triageSaved}
					<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
						<CheckCircle2 class="w-4 h-4" />
						Feedback triage action committed to Decision Log!
					</span>
				{:else}
					<span></span>
				{/if}
				<button
					type="button"
					onclick={commitTriageDecision}
					class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-2 cursor-pointer"
				>
					<CheckCircle2 class="w-3.5 h-3.5" />
					<span>Commit Action to Decision Log</span>
				</button>
			</div>
		</div>

	<!-- TAB 3: 5-Mode Refusal Composer (Appendix F) -->
	{:else if activeSubTab === 'refusal'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">5-Mode Refusal System (Appendix F):</strong>
				Authorship is defined as much by what you refuse as what you produce. Refusal is not petulance; it is the active defense of integrity.
			</div>

			<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
				{#each ['Ethical', 'Positional', 'Technical', 'Intentional', 'Slop'] as rMode}
					<button
						type="button"
						onclick={() => refusalMode = rMode as any}
						class="p-2.5 rounded-xl border text-center transition {refusalMode === rMode ? 'bg-neutral-950 border-red-500 text-red-400 font-bold' : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'}"
					>
						<div class="text-xs">{rMode} Refusal</div>
					</button>
				{/each}
			</div>

			<div class="space-y-3 text-xs">
				<div>
					<label for="ref-target" class="block font-medium text-neutral-300 mb-1">What is being refused:</label>
					<input id="ref-target" type="text" bind:value={refusalTarget} placeholder="e.g. Generating likeness of an identifiable person without consent" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="ref-rationale" class="block font-medium text-red-400 mb-1">Defense & Rationale:</label>
					<textarea id="ref-rationale" rows="3" bind:value={refusalRationale} placeholder="State explicit professional, ethical, or aesthetic reason for refusal..." class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 leading-relaxed"></textarea>
				</div>
			</div>

			<div class="flex items-center justify-between pt-2">
				{#if refusalSaved}
					<span class="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
						<CheckCircle2 class="w-4 h-4" />
						Refusal committed to Decision Log!
					</span>
				{:else}
					<span></span>
				{/if}
				<button
					type="button"
					onclick={commitRefusalDecision}
					class="px-4 py-2 rounded-xl text-xs bg-red-600 hover:bg-red-500 text-white font-bold transition flex items-center gap-2 cursor-pointer"
				>
					<ShieldCheck class="w-3.5 h-3.5" />
					<span>Commit Refusal to Decision Log</span>
				</button>
			</div>
		</div>

	<!-- TAB 4: Transmission & Silence Tolerance (Module 19) -->
	{:else if activeSubTab === 'transmission'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Teaching the Framework & Silence Tolerance (Module 19):</strong>
				Teaching is the ultimate test of portable knowledge. The teacher's cardinal rule is: <em>Scaffold problem-finding without doing the work for them.</em>
				Use the <strong>10-Second Silence Tolerance</strong> rule: withhold answers when a student pauses.
			</div>

			<div class="p-6 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
				<div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
					{#if silenceRunning}
						<VolumeX class="w-5 h-5 animate-pulse" />
					{:else}
						<Volume2 class="w-5 h-5" />
					{/if}
				</div>
				<div>
					<div class="font-bold text-sm text-neutral-200">10-Second Silence Tolerance Timer</div>
					<p class="text-xs text-neutral-400 max-w-sm">Count 10 silent seconds before jumping in to answer or solve for your mentee/collaborator.</p>
					<div class="text-3xl font-mono font-bold text-amber-400 mt-2">
						{silenceTimerSeconds}s
					</div>
				</div>
				<button
					type="button"
					onclick={toggleSilenceTimer}
					class="px-4 py-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition cursor-pointer"
				>
					{silenceRunning ? 'Reset' : 'Start 10s Silence'}
				</button>
			</div>
		</div>

	<!-- TAB 5: Deliberate Practice Drill Reps -->
	{:else if activeSubTab === 'drills'}
		<div class="space-y-4">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
				<div>
					<strong class="text-neutral-200">Module 6 Deliberate Practice Drills:</strong> Refusal under stakeholder pressure and feedback triage.
				</div>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => activeDrillId = 'm6-refusal-pressure'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm6-refusal-pressure' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Refusal Pressure (12m)
					</button>
					<button
						type="button"
						onclick={() => activeDrillId = 'm6-feedback-translation'}
						class="px-3 py-1.5 rounded-lg border text-xs font-mono transition {activeDrillId === 'm6-feedback-translation' ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
					>
						Feedback Translation (10m)
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
