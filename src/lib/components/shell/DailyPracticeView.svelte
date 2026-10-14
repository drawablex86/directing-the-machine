<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { COURSE_WEEKS } from '$lib/data/curriculum';
	import { ALL_PROJECTS } from '$lib/data/projects';
	import { soundSystem } from '$lib/engine/sound-system';
	import {
		Play,
		ChevronRight,
		Clock,
		Flame,
		CheckCircle2,
		Circle,
		ArrowRight,
		Sparkles,
		Eye,
		Layers,
		Compass,
		BookOpen,
		Calendar,
		Moon,
		Scale,
		AlertCircle,
		Brain,
		HelpCircle,
		BookMarked,
		ExternalLink
	} from '@lucide/svelte';
	import { getReadingByCode, type CoreReading } from '$lib/data/core-readings';
	import { getAppendixById } from '$lib/data/appendices';
	import ReadingModal from './ReadingModal.svelte';
	import ProjectBriefModal from '../course/ProjectBriefModal.svelte';

	let { onSelectModality }: { onSelectModality: (modId: string) => void } = $props();

	let isProjectModalOpen = $state(false);

	// Active week and day models
	let currentWeekData = $derived(
		COURSE_WEEKS.find((w) => w.weekNumber === practiceStore.activeWeek) || COURSE_WEEKS[1]
	);

	let currentDayData = $derived(
		currentWeekData.days.find((d) => d.dayNumber === practiceStore.activeDay) || currentWeekData.days[0]
	);

	let currentProject = $derived(
		ALL_PROJECTS.find((p) => p.id === currentWeekData.activeProjectId) || ALL_PROJECTS[0]
	);

	// The current 8-step routine
	const loopSteps = [
		{ id: 'read', name: 'Read', time: '20–30m', desc: 'Study core concept & mental models' },
		{ id: 'practise', name: 'Practise', time: '60–90m', desc: 'Deliberate micro-drill in 70–80% zone' },
		{ id: 'study', name: 'Study', time: '60m', desc: 'Craft study, decomposition, or close reading' },
		{ id: 'make', name: 'Make', time: '2–3h', desc: 'Active project application against brief' },
		{ id: 'diagnose', name: 'Diagnose', time: '30m', desc: 'Top-down diagnosis; zero evaluative shortcuts' },
		{ id: 'log', name: 'Log', time: '10–15m', desc: 'Hard-capped reflective studio log' },
		{ id: 'transfer', name: 'Transfer', time: '30–60m', desc: 'Unassisted transfer rep with scaffold removed' },
		{ id: 'play', name: 'Play', time: '30m', desc: 'Unstructured play for its own sake' }
	];

	let currentStep = $derived(loopSteps[practiceStore.currentStepIndex] || loopSteps[0]);

	// Corresponding specific task from the active day's plan
	let activeTask = $derived(
		currentDayData.tasks.find((t) => t.stepId === currentStep.id) || currentDayData.tasks[0]
	);

	let isActiveTaskDone = $derived(practiceStore.isTaskCompleted(activeTask.id));

	// Daily completion metrics
	let completedCount = $derived(
		currentDayData.tasks.filter((t) => practiceStore.isTaskCompleted(t.id)).length
	);

	// Quick 1-line inputs
	let quickPlay = $state('');
	let quickAttention = $state('');
	let tomorrowInput = $state('');
	let savedPlayNotice = $state(false);
	let savedAttentionNotice = $state(false);
	let savedTomorrowNotice = $state(false);

	let selectedReading = $state<CoreReading | null>(null);
	let isReadingModalOpen = $state(false);

	let currentAssignedCoreReading = $derived(
		getReadingByCode(currentDayData.assignedReading.moduleCode)
	);

	function openCurrentReading() {
		const reading = currentAssignedCoreReading;
		if (reading) {
			selectedReading = reading;
			isReadingModalOpen = true;
		}
	}

	function savePlay() {
		if (!quickPlay.trim()) return;
		practiceStore.playLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: quickPlay.trim()
		});
		practiceStore.saveToStorage();
		quickPlay = '';
		savedPlayNotice = true;
		setTimeout(() => savedPlayNotice = false, 2000);
	}

	function saveAttention() {
		if (!quickAttention.trim()) return;
		practiceStore.nonInstrumentalLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: quickAttention.trim()
		});
		practiceStore.saveToStorage();
		quickAttention = '';
		savedAttentionNotice = true;
		setTimeout(() => savedAttentionNotice = false, 2000);
	}

	function saveTomorrowAction() {
		if (!tomorrowInput.trim()) return;
		practiceStore.setTomorrowAction(tomorrowInput.trim());
		tomorrowInput = '';
		savedTomorrowNotice = true;
		setTimeout(() => savedTomorrowNotice = false, 2500);
	}

	function toggleTaskWithSound(taskId: string) {
		const isNowCompleting = !practiceStore.isTaskCompleted(taskId);
		practiceStore.toggleTask(taskId);
		if (isNowCompleting) {
			soundSystem.playCompletion(practiceStore.learnerPreferences.soundEnabled);
		}
	}

	function advanceToNextStep() {
		practiceStore.currentStepIndex = (practiceStore.currentStepIndex + 1) % loopSteps.length;
		practiceStore.saveToStorage();
	}
</script>

<div class="space-y-6 animate-in fade-in duration-150">
	<!-- Tomorrow's Action Banner (If set from previous day's Hemingway Stop) -->
	{#if practiceStore.tomorrowFirstAction}
		<div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
			<div class="flex items-center gap-2.5">
				<Flame class="w-4 h-4 text-amber-400 shrink-0" />
				<div>
					<span class="font-bold text-amber-400">Opening Action Hook:</span>
					<span class="text-neutral-200 ml-1">{practiceStore.tomorrowFirstAction}</span>
				</div>
			</div>
			<button
				type="button"
				onclick={() => practiceStore.setTomorrowAction('')}
				class="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
			>
				Dismiss
			</button>
		</div>
	{/if}

	<!-- Day Begins Card: Assigned Module & Concept -->
	<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
			<div class="space-y-1">
				<div class="flex items-center gap-2 text-xs font-mono">
					<span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
						Week {practiceStore.activeWeek} · {currentDayData.dayName}
					</span>
					<span class="text-neutral-500">•</span>
					<span class="text-neutral-400">Assigned Reading & Concept</span>
				</div>
				<h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
					<BookOpen class="w-5 h-5 text-amber-400" />
					{#if currentDayData.assignedReading.moduleCode.toLowerCase().includes('appendix')}
						<a
							href="/app?tab=manual&appendix={currentDayData.assignedReading.moduleCode.toLowerCase().replace(' ', '-')}"
							class="text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-500/40 hover:decoration-amber-300 transition"
							title="Read {currentDayData.assignedReading.moduleCode} in Field Manual"
						>
							{currentDayData.assignedReading.moduleCode} — {currentDayData.assignedReading.title}
						</a>
					{:else if currentAssignedCoreReading}
						<button
							type="button"
							onclick={openCurrentReading}
							class="text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-500/40 hover:decoration-amber-300 transition text-left cursor-pointer flex items-center gap-2 group"
							title="Open full text & theory for {currentDayData.assignedReading.moduleCode}"
						>
							<span>{currentDayData.assignedReading.moduleCode} — {currentDayData.assignedReading.title}</span>
							<span class="text-xs font-mono font-normal px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-neutral-950 transition">
								Read Theory →
							</span>
						</button>
					{:else}
						<span>{currentDayData.assignedReading.moduleCode} — {currentDayData.assignedReading.title}</span>
					{/if}
				</h2>
			</div>

			<!-- Quick Day Switcher -->
			<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
				{#each currentWeekData.days as d}
					<button
						type="button"
						onclick={() => {
							practiceStore.activeDay = d.dayNumber;
							practiceStore.saveToStorage();
						}}
						class="px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer {practiceStore.activeDay === d.dayNumber ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}"
					>
						{d.dayName.slice(0, 3)}
					</button>
				{/each}
			</div>
		</div>

		<!-- Mental Model Callout & Context -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
			<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1 md:col-span-2 flex flex-col justify-between">
				<div class="space-y-1">
					<div class="font-bold text-amber-400 flex items-center justify-between">
						<span class="flex items-center gap-1.5">
							<Sparkles class="w-3.5 h-3.5" />
							Key Mental Model for Today:
						</span>
						{#if currentAssignedCoreReading}
							<button
								type="button"
								onclick={openCurrentReading}
								class="text-[11px] text-amber-400/90 hover:text-amber-300 underline font-mono cursor-pointer flex items-center gap-1"
							>
								<span>Read Full Explanation</span>
								<ArrowRight class="w-3 h-3" />
							</button>
						{/if}
					</div>
					<p class="text-neutral-300 leading-relaxed font-serif">
						{currentDayData.assignedReading.keyMentalModel}
					</p>
				</div>
			</div>

			<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1">
				<div class="font-bold text-neutral-400">Active Project:</div>
				<div class="font-semibold text-white truncate">
					P{currentProject.number}: {currentProject.title}
				</div>
				<div class="text-[11px] text-neutral-500">
					Studio: <span class="text-amber-400 font-mono">{currentProject.primaryModalityId.toUpperCase()}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Step-by-Step Task Pipeline: Focus Hero -->
	<div class="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl space-y-6">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
						Current Action in Today's Loop
					</span>
					<span class="text-neutral-600">•</span>
					<span class="text-xs text-neutral-400">Step {practiceStore.currentStepIndex + 1} of 8</span>
					<span class="text-neutral-600">•</span>
					<span class="text-xs font-mono text-emerald-400">{completedCount}/8 Completed</span>
				</div>
				<h2 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
					<span>{activeTask.title}</span>
					<span class="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
						{activeTask.time}
					</span>
				</h2>
				<p class="text-xs md:text-sm text-neutral-300 max-w-xl leading-relaxed">
					{activeTask.actionPrompt}
				</p>
			</div>

			<!-- Action Buttons: Mark Complete & Move Ahead -->
			<div class="flex flex-wrap items-center gap-2.5">
				<!-- Toggle Task Done Button -->
				<button
					type="button"
					onclick={() => toggleTaskWithSound(activeTask.id)}
					class="px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer {isActiveTaskDone ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'}"
				>
					{#if isActiveTaskDone}
						<CheckCircle2 class="w-4 h-4" />
						<span>Task Completed!</span>
					{:else}
						<Circle class="w-4 h-4" />
						<span>Mark Completed</span>
					{/if}
				</button>

				<!-- Context-Specific Primary Action Buttons -->
				{#if currentStep.id === 'read'}
					{#if currentDayData.assignedReading.moduleCode.toLowerCase().includes('appendix')}
						<a
							href="/app?tab=manual&appendix={currentDayData.assignedReading.moduleCode.toLowerCase().replace(' ', '-')}"
							class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
						>
							<BookOpen class="w-4 h-4" />
							<span>Read {currentDayData.assignedReading.moduleCode}</span>
							<ArrowRight class="w-4 h-4" />
						</a>
					{:else if currentAssignedCoreReading}
						<button
							type="button"
							onclick={openCurrentReading}
							class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
						>
							<BookOpen class="w-4 h-4" />
							<span>Open Assigned Reading ({currentDayData.assignedReading.moduleCode})</span>
							<ArrowRight class="w-4 h-4" />
						</button>
					{/if}
					<button
						type="button"
						onclick={() => onSelectModality(activeTask.targetModalityId)}
						class="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 flex items-center gap-1.5 transition cursor-pointer"
						title="Open isolation studio workbench"
					>
						<span>Studio ({activeTask.targetModalityId.toUpperCase()})</span>
					</button>

				{:else if currentStep.id === 'practise'}
					<button
						type="button"
						onclick={() => onSelectModality(activeTask.targetModalityId)}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<Play class="w-4 h-4 fill-current" />
						<span>Launch Micro-Drill in Studio ({activeTask.targetModalityId.toUpperCase()})</span>
						<ArrowRight class="w-4 h-4" />
					</button>
					<a
						href="/app?tab=manual&appendix=appendix-i"
						class="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 flex items-center gap-1.5 transition"
					>
						<BookMarked class="w-4 h-4 text-amber-400" />
						<span>Drill Library (App I)</span>
					</a>

				{:else if currentStep.id === 'study'}
					<button
						type="button"
						onclick={() => onSelectModality(activeTask.targetModalityId)}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<Eye class="w-4 h-4" />
						<span>Deconstruct Exemplar in Studio</span>
						<ArrowRight class="w-4 h-4" />
					</button>
					<a
						href="/app?tab=manual&appendix=appendix-h"
						class="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 flex items-center gap-1.5 transition"
					>
						<BookMarked class="w-4 h-4 text-amber-400" />
						<span>Craft Protocol (App H)</span>
					</a>

				{:else if currentStep.id === 'make'}
					<button
						type="button"
						onclick={() => isProjectModalOpen = true}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<Layers class="w-4 h-4" />
						<span>View Project {currentProject.number} Brief & Rubrics</span>
						<ArrowRight class="w-4 h-4" />
					</button>
					<button
						type="button"
						onclick={() => onSelectModality(activeTask.targetModalityId)}
						class="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 flex items-center gap-1.5 transition cursor-pointer"
					>
						<span>Studio ({activeTask.targetModalityId.toUpperCase()})</span>
					</button>

				{:else if currentStep.id === 'diagnose'}
					<button
						type="button"
						onclick={() => onSelectModality('m2')}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<Scale class="w-4 h-4" />
						<span>Open Diagnostic Ladder (M2)</span>
						<ArrowRight class="w-4 h-4" />
					</button>

				{:else if currentStep.id === 'log' || activeTask.targetModalityId === 'logs'}
					<a
						href="/logs"
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<Clock class="w-4 h-4" />
						<span>Start 10m Studio Logbook</span>
						<ArrowRight class="w-4 h-4" />
					</a>

				{:else if currentStep.id === 'transfer'}
					<button
						type="button"
						onclick={() => onSelectModality(activeTask.targetModalityId)}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<Compass class="w-4 h-4" />
						<span>Execute Transfer Rep (No Scaffolding)</span>
						<ArrowRight class="w-4 h-4" />
					</button>

				{:else if currentStep.id === 'play'}
					<button
						type="button"
						onclick={() => onSelectModality('m0')}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<Sparkles class="w-4 h-4" />
						<span>Protected Play Session (No Rubrics)</span>
						<ArrowRight class="w-4 h-4" />
					</button>
				{:else}
					<button
						type="button"
						onclick={() => onSelectModality(activeTask.targetModalityId)}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<span>Launch Studio ({activeTask.targetModalityId.toUpperCase()})</span>
						<ArrowRight class="w-4 h-4" />
					</button>
				{/if}

				<!-- Advance Next Step Button -->
				<button
					type="button"
					onclick={advanceToNextStep}
					class="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition cursor-pointer"
					title="Advance to next step in today's loop"
				>
					Next Step →
				</button>
			</div>
		</div>

		<!-- Step Directive Execution Protocol Card -->
		<div class="rounded-xl bg-neutral-950/70 border border-neutral-800/80 p-4 space-y-4">
			<div class="flex items-center justify-between border-b border-neutral-800/60 pb-3">
				<div class="flex items-center gap-2 text-xs font-semibold text-neutral-300">
					<Brain class="w-4 h-4 text-amber-400" />
					<span>Execution Protocol & Directive</span>
				</div>
				{#if activeTask.protocolRef}
					<span class="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/60">
						Ref: {activeTask.protocolRef}
					</span>
				{/if}
			</div>

			<!-- Core Objective -->
			<div class="space-y-1">
				<div class="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-bold">
					Core Objective
				</div>
				<p class="text-xs md:text-sm text-neutral-200 leading-relaxed font-sans">
					{activeTask.objective}
				</p>
			</div>

			<!-- 3-Step Timed Action Sequence -->
			{#if activeTask.executionSteps && activeTask.executionSteps.length > 0}
				<div class="space-y-2">
					<div class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
						Step-by-Step Execution Plan ({activeTask.time})
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
						{#each activeTask.executionSteps as stepInstruction, idx}
							<div class="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
								<div class="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-400">
									<span class="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
										{idx + 1}
									</span>
									<span>Phase {idx + 1}</span>
								</div>
								<p class="text-neutral-300 leading-relaxed text-[11px]">
									{stepInstruction}
								</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Bottom Criteria & Failure Trap Badges -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
				<!-- How to know you are done -->
				<div class="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-1">
					<div class="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] font-mono uppercase tracking-wide">
						<CheckCircle2 class="w-3.5 h-3.5" />
						<span>Done Condition (Success Criterion)</span>
					</div>
					<p class="text-emerald-200/90 text-[11px] leading-relaxed">
						{activeTask.successCriterion}
					</p>
				</div>

				<!-- Common Failure Trap -->
				<div class="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-xs space-y-1">
					<div class="flex items-center gap-1.5 font-bold text-red-400 text-[11px] font-mono uppercase tracking-wide">
						<AlertCircle class="w-3.5 h-3.5" />
						<span>Pitfall / Trap to Avoid</span>
					</div>
					<p class="text-red-200/90 text-[11px] leading-relaxed">
						{activeTask.failureTrap}
					</p>
				</div>
			</div>
		</div>

		<!-- Plain Language Scaffolding Tip (If Plain Language Preference Enabled) -->
		{#if practiceStore.learnerPreferences.plainLanguageHelp}
			<div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-start gap-2.5">
				<HelpCircle class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
				<div class="space-y-1">
					<div class="font-bold text-amber-300">Plain Language Guide: What are you doing right now?</div>
					<p class="text-neutral-300 leading-relaxed">
						You are currently doing <strong>{activeTask.title}</strong> ({loopSteps[practiceStore.currentStepIndex].name}). This step develops concrete machine directing taste. Focus only on this single task before moving forward.
					</p>
				</div>
			</div>
		{/if}

		<!-- Step Sequence Navigator with Checkmarks (or Single-Task Horizon message) -->
		{#if !practiceStore.learnerPreferences.focusMode}
			<div class="space-y-2">
				<div class="flex items-center justify-between text-xs text-neutral-400">
					<span class="font-medium text-neutral-300">Daily 8-Step Routine Sequence</span>
					<span class="font-mono text-[11px]">Click any step to set your focus</span>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
					{#each loopSteps as step, i}
						{@const taskForStep = currentDayData.tasks.find((t) => t.stepId === step.id)}
						{@const done = taskForStep ? practiceStore.isTaskCompleted(taskForStep.id) : false}
						<button
							type="button"
							onclick={() => {
								practiceStore.currentStepIndex = i;
								practiceStore.saveToStorage();
							}}
							class="p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer {practiceStore.currentStepIndex === i ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm' : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'}"
						>
							<div class="flex items-center justify-between text-[11px] font-mono">
								<span class="font-bold {practiceStore.currentStepIndex === i ? 'text-amber-400' : 'text-neutral-500'}">
									0{i + 1}
								</span>
								{#if done}
									<CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
								{:else}
									<span class="text-[10px] opacity-75">{step.time}</span>
								{/if}
							</div>
							<div class="font-semibold text-xs mt-1 truncate">
								{step.name}
							</div>
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<div class="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
				<div class="flex items-center gap-2 text-neutral-300">
					<Brain class="w-4 h-4 text-amber-400" />
					<span><strong>Single-Task Horizon Active:</strong> Surrounding steps are hidden to minimize cognitive distraction.</span>
				</div>
				<button
					type="button"
					onclick={() => {
						practiceStore.learnerPreferences.focusMode = false;
						practiceStore.saveToStorage();
					}}
					class="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
				>
					Show all 8 steps
				</button>
			</div>
		{/if}
	</div>

	<!-- Two Column Layout: Scaffolding Status & Hemingway Stop -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Phase Progression & Scaffolding Controls -->
		<div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Compass class="w-4 h-4 text-amber-400" />
					<h3 class="font-bold text-sm text-neutral-100">Curriculum Progression</h3>
				</div>
				<span class="text-xs font-mono text-neutral-400">
					Layer {practiceStore.masteryLayer}: {practiceStore.masteryLayer === 1 ? 'Capability' : practiceStore.masteryLayer === 2 ? 'Independence' : 'Agency'}
				</span>
			</div>

			<div class="space-y-1.5">
				<label for="active-week-select" class="text-xs text-neutral-400">Active Curriculum Week</label>
				<select
					id="active-week-select"
					bind:value={practiceStore.activeWeek}
					onchange={() => {
						const w = COURSE_WEEKS.find((wk) => wk.weekNumber === practiceStore.activeWeek);
						if (w) practiceStore.activePart = w.partNumber;
						practiceStore.saveToStorage();
					}}
					class="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
				>
					{#each COURSE_WEEKS as wk}
						<option value={wk.weekNumber}>
							{wk.title}
						</option>
					{/each}
				</select>
			</div>

			<!-- Scaffolding Badges -->
			<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
				<div class="text-[11px] font-semibold text-neutral-300">Active Scaffolds in Current Phase:</div>
				<div class="flex flex-wrap gap-2 text-xs">
					<span class="px-2 py-0.5 rounded border {practiceStore.scaffolding.ladder ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-600 line-through'}">
						Diagnostic Ladder
					</span>
					<span class="px-2 py-0.5 rounded border {practiceStore.scaffolding.template ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-600 line-through'}">
						Brief Template
					</span>
					<span class="px-2 py-0.5 rounded border {practiceStore.scaffolding.exercise ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-600 line-through'}">
						Guided Exercises
					</span>
				</div>
				<p class="text-[10px] text-neutral-500 leading-tight">
					As you progress, crutches are intentionally stripped away to develop autonomous creative judgment.
				</p>
			</div>
		</div>

		<!-- Day Ends: Hemingway Stop & Tomorrow's 5-Minute Hook -->
		<div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Moon class="w-4 h-4 text-amber-400" />
					<h3 class="font-bold text-sm text-neutral-100">Day Ends: Hemingway Stop</h3>
				</div>
				{#if savedTomorrowNotice}
					<span class="text-emerald-400 text-xs font-bold flex items-center gap-1">
						<CheckCircle2 class="w-3.5 h-3.5" />
						Hook Locked!
					</span>
				{/if}
			</div>

			<p class="text-xs text-neutral-400 leading-relaxed">
				Always stop for the day while you still know the very next step. Never empty the tank completely.
			</p>

			<div class="space-y-2">
				<label for="tomorrow-action-input" class="text-xs text-neutral-300 font-medium">
					Tomorrow's first 5-minute opening action:
				</label>
				<div class="flex gap-2">
					<input
						id="tomorrow-action-input"
						type="text"
						bind:value={tomorrowInput}
						onkeydown={(e) => { if (e.key === 'Enter') saveTomorrowAction(); }}
						placeholder="e.g. Write premise rejection logic for brief #2..."
						class="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
					<button
						type="button"
						onclick={saveTomorrowAction}
						class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition cursor-pointer"
					>
						Lock & Finish Day
					</button>
				</div>
			</div>

			<!-- Daily Attention & Play Quick Journal -->
			<div class="pt-2 border-t border-neutral-800 space-y-3">
				<div class="text-[11px] font-semibold text-neutral-400">Protected Daily 1-Sentence Logs:</div>
				<div class="space-y-2 text-xs">
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={quickAttention}
							onkeydown={(e) => { if (e.key === 'Enter') saveAttention(); }}
							placeholder="Non-Instrumental: What did you encounter without intending to use it?"
							class="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
						/>
						<button
							type="button"
							onclick={saveAttention}
							class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
						>
							Log
						</button>
					</div>

					<div class="flex gap-2">
						<input
							type="text"
							bind:value={quickPlay}
							onkeydown={(e) => { if (e.key === 'Enter') savePlay(); }}
							placeholder="Play Practice: What did you enjoy making today for no reason?"
							class="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
						/>
						<button
							type="button"
							onclick={savePlay}
							class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
						>
							Log
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Integrated Core Reading Reader Modal -->
	<ReadingModal
		reading={selectedReading}
		isOpen={isReadingModalOpen}
		onClose={() => isReadingModalOpen = false}
		onSelectReading={(r) => selectedReading = r}
		onSelectModality={onSelectModality}
	/>

	<!-- Integrated Project Brief & Deliverables Modal -->
	{#if isProjectModalOpen}
		<ProjectBriefModal
			project={currentProject}
			onClose={() => isProjectModalOpen = false}
			onLaunchModality={(modId) => {
				isProjectModalOpen = false;
				onSelectModality(modId);
			}}
		/>
	{/if}
</div>
