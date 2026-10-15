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
		ExternalLink,
		Target,
		Send,
		RotateCcw,
		AlertTriangle,
		ChevronDown,
		ChevronUp
	} from '@lucide/svelte';
	import { getReadingByCode, type CoreReading } from '$lib/data/core-readings';
	import { getAppendixById } from '$lib/data/appendices';
	import { DRILLS, getDrillsByModality, type Drill } from '$lib/data/drills';
	import ReadingModal from './ReadingModal.svelte';
	import ProjectBriefModal from '../course/ProjectBriefModal.svelte';
	import DrillRunner from './DrillRunner.svelte';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let { onSelectModality }: { onSelectModality: (modId: string) => void } = $props();

	let isProjectModalOpen = $state(false);
	let isDrillRunnerOpen = $state(false);

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

	let auditedBaselineCount = $derived(
		practiceStore.baseline.filter((b) => b.notes.trim().length > 0 || b.score !== 2).length
	);

	// Matched drill for deliberate practice step
	let matchedDrill = $derived.by<Drill | undefined>(() => {
		if (currentStep.id !== 'practise') return undefined;
		const titleLower = activeTask.title.toLowerCase();
		const descLower = (activeTask.description || '').toLowerCase();
		for (const d of DRILLS) {
			if (titleLower.includes(d.title.toLowerCase()) || titleLower.includes(d.id)) return d;
			if (descLower.includes(d.title.toLowerCase()) || descLower.includes(d.id)) return d;
		}
		const modalityDrills = getDrillsByModality(activeTask.targetModalityId);
		const weekDrill = modalityDrills.find(d => d.weeks.includes(practiceStore.activeWeek));
		if (weekDrill) return weekDrill;
		if (modalityDrills.length > 0) return modalityDrills[0];
		return DRILLS[0];
	});

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

	let isTodayReadingDone = $derived.by(() => {
		if (!currentAssignedCoreReading) return false;
		return practiceStore.isReadingCompleted(currentAssignedCoreReading.code);
	});

	$effect(() => {
		// When today's reading is completed, automatically mark Step 1 ("read") task as done
		if (isTodayReadingDone) {
			const readTask = currentDayData.tasks.find((t) => t.stepId === 'read');
			if (readTask && !practiceStore.isTaskCompleted(readTask.id)) {
				practiceStore.toggleTask(readTask.id);
			}
		}
	});

	// LLM State: Socratic Reading Comprehension Check
	let readingCritique = $state<CritiqueResult | null>(null);
	let isCheckingReading = $state(false);
	let readingError = $state<string | null>(null);
	let studentReadingAnswer = $state('');
	let activeSocraticDilemma = $state('');
	let isEditingReadingAnswer = $state(true);
	let isSocraticPanelOpen = $state(true);

	let defaultSocraticDilemma = $derived.by(() => {
		const km = currentDayData.assignedReading.keyMentalModel;
		return `Given that "${km}", how will you apply this mechanical distinction in today's studio session? What default generation or unearned habit will you actively refuse?`;
	});

	let currentSocraticDilemma = $derived.by(() => {
		return (
			activeSocraticDilemma ||
			readingCritique?.readingFriction?.socraticDilemma ||
			readingCritique?.readingFriction?.frictionQuestion1 ||
			defaultSocraticDilemma
		);
	});

	$effect(() => {
		// Reset day-scoped reading inputs when active day or week changes
		const _day = practiceStore.activeDay;
		const _week = practiceStore.activeWeek;
		studentReadingAnswer = '';
		activeSocraticDilemma = '';
		readingCritique = null;
		readingError = null;
		isEditingReadingAnswer = true;
	});

	async function generateSocraticProbe() {
		isCheckingReading = true;
		readingError = null;
		try {
			const result = await executePrompt('daily-reading-friction', {
				readingTitle: currentDayData.assignedReading.title,
				readingCode: currentDayData.assignedReading.moduleCode,
				keyMentalModel: currentDayData.assignedReading.keyMentalModel,
				keyThesis: currentAssignedCoreReading?.summary || currentDayData.assignedReading.keyMentalModel
			});
			readingCritique = result;
			if (result.readingFriction?.socraticDilemma) {
				activeSocraticDilemma = result.readingFriction.socraticDilemma;
			} else if (result.readingFriction?.frictionQuestion1) {
				activeSocraticDilemma = result.readingFriction.frictionQuestion1;
			}
			isEditingReadingAnswer = true;
		} catch (err: any) {
			readingError = err?.message || 'Failed to generate Socratic probe.';
		} finally {
			isCheckingReading = false;
		}
	}

	async function submitReadingAnswer() {
		if (!studentReadingAnswer.trim()) return;
		isCheckingReading = true;
		readingError = null;
		try {
			const result = await executePrompt('daily-reading-friction', {
				readingTitle: currentDayData.assignedReading.title,
				readingCode: currentDayData.assignedReading.moduleCode,
				keyMentalModel: currentDayData.assignedReading.keyMentalModel,
				keyThesis: currentAssignedCoreReading?.summary || currentDayData.assignedReading.keyMentalModel,
				socraticDilemma: currentSocraticDilemma,
				studentAnswer: studentReadingAnswer.trim()
			});
			readingCritique = result;
			isEditingReadingAnswer = false;

			// If comprehended, automatically mark Step 1 (Read) as completed!
			if (result.readingEvaluation?.verdict === 'COMPREHENDED') {
				const readTask = currentDayData.tasks.find((t) => t.stepId === 'read');
				if (readTask && !practiceStore.isTaskCompleted(readTask.id)) {
					toggleTaskWithSound(readTask.id);
				}
				if (currentAssignedCoreReading && !practiceStore.isReadingCompleted(currentAssignedCoreReading.code)) {
					practiceStore.toggleReadingCompleted(currentAssignedCoreReading.code);
				}
			}
		} catch (err: any) {
			readingError = err?.message || 'Failed to evaluate reading comprehension.';
		} finally {
			isCheckingReading = false;
		}
	}

	async function runReadingCheck() {
		if (studentReadingAnswer.trim()) {
			await submitReadingAnswer();
		} else {
			await generateSocraticProbe();
		}
	}

	function proceedToStep2() {
		practiceStore.currentStepIndex = 1;
		practiceStore.saveToStorage();
		if (typeof document !== 'undefined') {
			const hero = document.getElementById('step-focus-hero');
			if (hero) hero.scrollIntoView({ behavior: 'smooth' });
		}
	}

	let readingActions = $derived.by<LlmAction[]>(() => {
		const actions: LlmAction[] = [];

		const readTask = currentDayData.tasks.find((t) => t.stepId === 'read');
		if (readTask && !practiceStore.isTaskCompleted(readTask.id)) {
			actions.push({
				label: 'Mark Step 1 (Read) Completed',
				primary: true,
				variant: 'primary',
				onClick: () => {
					toggleTaskWithSound(readTask.id);
				}
			});
		}

		if (currentAssignedCoreReading && !practiceStore.isReadingCompleted(currentAssignedCoreReading.code)) {
			actions.push({
				label: 'Mark Core Reading Completed',
				variant: 'secondary',
				onClick: () => {
					if (currentAssignedCoreReading) {
						practiceStore.toggleReadingCompleted(currentAssignedCoreReading.code);
					}
				}
			});
		}

		if (isTodayReadingDone || readingCritique?.readingEvaluation?.verdict === 'COMPREHENDED') {
			actions.push({
				label: 'Proceed to Step 2: Micro-Drill →',
				primary: true,
				variant: 'primary',
				onClick: () => {
					proceedToStep2();
				}
			});
		}

		return actions;
	});

	// LLM State: Hemingway Stop 5-Minute Action Check
	let hemingwayCritique = $state<CritiqueResult | null>(null);
	let isCheckingHemingway = $state(false);
	let hemingwayError = $state<string | null>(null);

	async function runHemingwayCheck() {
		if (!tomorrowInput.trim()) return;
		isCheckingHemingway = true;
		hemingwayError = null;
		try {
			const result = await executePrompt('hemingway-action-check', {
				actionText: tomorrowInput.trim(),
				contextProject: `P${currentProject.number}: ${currentProject.title}`
			});
			hemingwayCritique = result;
		} catch (err: any) {
			hemingwayError = err?.message || 'Failed to validate Hemingway action.';
		} finally {
			isCheckingHemingway = false;
		}
	}

	let hemingwayActions = $derived.by<LlmAction[]>(() => {
		if (!hemingwayCritique?.hemingwayAudit) return [];
		const ha = hemingwayCritique.hemingwayAudit;
		const actions: LlmAction[] = [];

		if (ha.decomposedAction && ha.decomposedAction !== tomorrowInput) {
			actions.push({
				label: 'Adopt Decomposed 5-Min Action',
				primary: true,
				variant: 'primary',
				onClick: () => {
					tomorrowInput = ha.decomposedAction;
				}
			});
		}

		return actions;
	});

	// LLM State: Non-Instrumental Attention Purity Check
	let attentionCritique = $state<CritiqueResult | null>(null);
	let isCheckingAttention = $state(false);
	let attentionError = $state<string | null>(null);

	async function runAttentionPurityCheck() {
		const text = quickAttention.trim() || quickPlay.trim();
		if (!text) return;
		isCheckingAttention = true;
		attentionError = null;
		try {
			const result = await executePrompt('daily-attention-purity', {
				observationText: text,
				isPlay: !quickAttention.trim() && Boolean(quickPlay.trim())
			});
			attentionCritique = result;
		} catch (err: any) {
			attentionError = err?.message || 'Failed to audit attention purity.';
		} finally {
			isCheckingAttention = false;
		}
	}

	let attentionActions = $derived.by<LlmAction[]>(() => {
		if (!attentionCritique?.attentionPurity) return [];
		const ap = attentionCritique.attentionPurity;
		const actions: LlmAction[] = [];

		if (ap.purifiedObservation) {
			actions.push({
				label: 'Adopt Purified Observation',
				primary: true,
				variant: 'primary',
				onClick: () => {
					if (quickAttention.trim()) {
						quickAttention = ap.purifiedObservation!;
					} else {
						quickPlay = ap.purifiedObservation!;
					}
				}
			});
		}

		return actions;
	});

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

	<!-- First-Run Onboarding Banner (if baseline is un-audited) -->
	{#if auditedBaselineCount < 6}
		<div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
			<div class="flex items-center gap-3">
				<Target class="w-5 h-5 text-amber-400 shrink-0" />
				<div>
					<div class="font-bold text-amber-300">Welcome to Directing the Machine · Week 0 Orientation</div>
					<p class="text-neutral-300 text-[11px] mt-0.5">
						Begin your training by auditing your 12-competency baseline mirror and signing your Deliberate Practice Contract.
					</p>
				</div>
			</div>
			<button
				type="button"
				onclick={() => onSelectModality('m0')}
				class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
			>
				<span>Start Baseline Diagnostic (M0)</span>
				<ArrowRight class="w-3.5 h-3.5" />
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
				<div class="flex items-center gap-2 flex-wrap">
					<h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
						<BookOpen class="w-5 h-5 text-amber-400" />
						{#if currentAssignedCoreReading}
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

					{#if isTodayReadingDone}
						<span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1">
							<CheckCircle2 class="w-3.5 h-3.5" />
							<span>Completed</span>
						</span>
					{/if}
				</div>
			</div>

			<!-- Quick Day Switcher and Reading Trigger -->
			<div class="flex items-center gap-2 flex-wrap">
				<button
					type="button"
					onclick={() => (isSocraticPanelOpen = !isSocraticPanelOpen)}
					class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer {isTodayReadingDone || readingCritique?.readingEvaluation?.verdict === 'COMPREHENDED'
						? 'bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900/50'
						: 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'}"
					title="Toggle Socratic Reading Comprehension Check"
				>
					<Brain class="w-3.5 h-3.5 text-amber-400" />
					<span>{isTodayReadingDone || readingCritique?.readingEvaluation?.verdict === 'COMPREHENDED' ? 'Socratic Check: Verified ✓' : 'Socratic Concept Check'}</span>
				</button>
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

		<!-- Socratic Reading Comprehension Check Workbench -->
		<div class="mt-4 pt-4 border-t border-neutral-800/80 space-y-4">
			<!-- Section Header Bar with Toggle & Dilemma Generator -->
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
				<div class="flex items-center gap-2">
					<div class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
						<Brain class="w-4 h-4" />
					</div>
					<div>
						<div class="text-xs font-bold text-white flex items-center gap-2">
							<span>Socratic Concept Comprehension Check</span>
							{#if readingCritique?.readingEvaluation?.verdict === 'COMPREHENDED'}
								<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
									Verified ✓
								</span>
							{:else if isTodayReadingDone}
								<span class="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-mono">
									Reading Done
								</span>
							{/if}
						</div>
						<div class="text-[11px] text-neutral-400">
							Prove mechanical understanding of today's distinction before advancing to practice drills.
						</div>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={generateSocraticProbe}
						disabled={isCheckingReading}
						class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer disabled:opacity-50"
						title="Generate a custom AI dilemma testing this mental model"
					>
						{#if isCheckingReading && !studentReadingAnswer.trim()}
							<Clock class="w-3.5 h-3.5 animate-spin text-amber-400" />
							<span>Formulating Dilemma...</span>
						{:else}
							<Sparkles class="w-3.5 h-3.5 text-amber-400" />
							<span>Generate AI Dilemma</span>
						{/if}
					</button>

					<button
						type="button"
						onclick={() => (isSocraticPanelOpen = !isSocraticPanelOpen)}
						class="p-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
						aria-label={isSocraticPanelOpen ? 'Collapse Socratic Panel' : 'Expand Socratic Panel'}
					>
						{#if isSocraticPanelOpen}
							<ChevronUp class="w-3.5 h-3.5" />
						{:else}
							<ChevronDown class="w-3.5 h-3.5" />
						{/if}
					</button>
				</div>
			</div>

			{#if isSocraticPanelOpen}
				<div class="space-y-3.5 animate-in fade-in duration-150">
					<!-- Stage 1: The Socratic Dilemma Probe -->
					<div class="p-3.5 rounded-xl bg-neutral-950 border border-amber-500/20 space-y-2 text-xs">
						<div class="flex items-center justify-between text-[11px] font-mono uppercase text-amber-400 font-bold">
							<span class="flex items-center gap-1.5">
								<HelpCircle class="w-3.5 h-3.5" />
								Today's Socratic Challenge Probe:
							</span>
							{#if readingCritique?.readingFriction?.diagnosticTrap}
								<span class="text-[10px] text-rose-400/90 font-normal lowercase tracking-normal">
									trap: {readingCritique.readingFriction.diagnosticTrap}
								</span>
							{/if}
						</div>
						<p class="text-neutral-200 text-xs sm:text-[13px] leading-relaxed italic font-serif pl-2 border-l-2 border-amber-500/50">
							"{currentSocraticDilemma}"
						</p>
					</div>

					<!-- Stage 2: Student Response & Directorial Defense -->
					{#if !readingCritique?.readingEvaluation || isEditingReadingAnswer}
						<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
							<div class="flex items-center justify-between">
								<label for="student-reading-answer" class="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
									<Target class="w-3.5 h-3.5 text-amber-400" />
									<span>Your Directorial Synthesis & Defense:</span>
								</label>
								<span class="text-[11px] font-mono text-neutral-500">
									{studentReadingAnswer.length} chars
								</span>
							</div>

							<p class="text-[11px] text-neutral-400 leading-normal">
								In 1–2 sentences, articulate how you will apply this distinction today. What specific default habit or lazy prompt shortcut will you actively refuse?
							</p>

							<textarea
								id="student-reading-answer"
								bind:value={studentReadingAnswer}
								rows={3}
								placeholder="e.g. In today's session, I will refuse to accept the model's default balanced lighting. I will enforce a high-contrast binary shadow boundary and reject any generation that attempts to soften the edges."
								class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition resize-y font-sans leading-relaxed"
							></textarea>

							<div class="flex items-center justify-between pt-1 flex-wrap gap-2">
								<div class="text-[11px] text-neutral-500 font-mono">
									Passing standard: explicit refusal + concrete structural decision.
								</div>

								<button
									type="button"
									disabled={!studentReadingAnswer.trim() || isCheckingReading}
									onclick={submitReadingAnswer}
									class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition disabled:opacity-50 disabled:cursor-not-allowed shadow cursor-pointer font-sans"
								>
									{#if isCheckingReading && studentReadingAnswer.trim()}
										<Clock class="w-3.5 h-3.5 animate-spin" />
										<span>Auditing Comprehension...</span>
									{:else}
										<Send class="w-3.5 h-3.5" />
										<span>Submit for Socratic Evaluation</span>
									{/if}
								</button>
							</div>
						</div>
					{/if}

					<!-- Error State -->
					{#if readingError}
						<div class="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center justify-between gap-2">
							<div class="flex items-center gap-2">
								<AlertCircle class="w-4 h-4 text-rose-400 shrink-0" />
								<span>{readingError}</span>
							</div>
							<button
								type="button"
								onclick={runReadingCheck}
								class="text-xs font-mono text-rose-200 underline hover:text-white"
							>
								Retry
							</button>
						</div>
					{/if}

					<!-- Stage 3: Evaluated Socratic Result -->
					{#if readingCritique?.readingEvaluation}
						{@const ev = readingCritique.readingEvaluation}
						<div
							class="p-4 rounded-xl border space-y-3.5 shadow-lg {ev.verdict === 'COMPREHENDED'
								? 'bg-emerald-950/20 border-emerald-500/40'
								: ev.verdict === 'SUPERFICIAL_SUMMARY'
								? 'bg-amber-950/20 border-amber-500/40'
								: 'bg-rose-950/20 border-rose-500/40'}"
						>
							<!-- Verdict Header -->
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5 {ev.verdict === 'COMPREHENDED' ? 'border-emerald-900/40' : ev.verdict === 'SUPERFICIAL_SUMMARY' ? 'border-amber-900/40' : 'border-rose-900/40'}">
								<div class="flex items-center gap-2">
									{#if ev.verdict === 'COMPREHENDED'}
										<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
											<CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
											COMPREHENSION CERTIFIED
										</span>
									{:else if ev.verdict === 'SUPERFICIAL_SUMMARY'}
										<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
											<AlertTriangle class="w-3.5 h-3.5 text-amber-400" />
											SUPERFICIAL SUMMARY — MECHANISM MISSING
										</span>
									{:else}
										<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
											<AlertCircle class="w-3.5 h-3.5 text-rose-400" />
											DISTINCTION INVERTED OR MISUNDERSTOOD
										</span>
									{/if}
								</div>

								{#if !isEditingReadingAnswer}
									<button
										type="button"
										onclick={() => (isEditingReadingAnswer = true)}
										class="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
									>
										<RotateCcw class="w-3 h-3" />
										<span>Edit / Refine Answer</span>
									</button>
								{/if}
							</div>

							<!-- Student's Evaluated Defense -->
							{#if !isEditingReadingAnswer && studentReadingAnswer}
								<div class="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-xs space-y-1">
									<div class="text-[10px] uppercase font-mono text-neutral-400">Your Submitted Directorial Defense:</div>
									<p class="text-neutral-200 font-mono text-[11px] italic">"{studentReadingAnswer}"</p>
								</div>
							{/if}

							<!-- Socratic Seminar Leader Diagnostic Feedback -->
							<div class="space-y-1">
								<div class="text-[10px] uppercase font-mono text-neutral-400 font-bold">
									Seminar Leader Diagnostic Feedback:
								</div>
								<p class="text-xs text-neutral-200 leading-relaxed font-sans">
									{ev.feedback}
								</p>
							</div>

							<!-- Directorial Rule of Thumb -->
							{#if ev.directorialRuleOfThumb}
								<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
									<strong class="text-amber-400 font-mono text-[10px] uppercase block mb-0.5">Directorial Rule of Thumb for Today:</strong>
									<span class="text-neutral-300 font-serif italic text-xs">"{ev.directorialRuleOfThumb}"</span>
								</div>
							{/if}

							<!-- Counter-Probe if needed -->
							{#if ev.counterProbe}
								<div class="p-2.5 rounded-lg bg-neutral-900 border border-rose-900/40 text-xs space-y-1">
									<strong class="text-rose-400 font-mono text-[10px] uppercase block">Counter-Challenge:</strong>
									<p class="text-neutral-300 italic">"{ev.counterProbe}"</p>
								</div>
							{/if}

							<!-- Clear Progression Action Banner -->
							{#if ev.verdict === 'COMPREHENDED' || isTodayReadingDone}
								<div class="pt-3 border-t border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
									<div class="space-y-0.5">
										<div class="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
											<CheckCircle2 class="w-4 h-4 text-emerald-400" />
											<span>Step 1 (Read) Certified! Ready for Deliberate Practice.</span>
										</div>
										<p class="text-[11px] text-neutral-300">
											Advance to Step 2 to calibrate difficulty in the 70–80% learning zone.
										</p>
									</div>

									<button
										type="button"
										onclick={proceedToStep2}
										class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
									>
										<span>Proceed to Step 2: Micro-Drill (15 min)</span>
										<ArrowRight class="w-4 h-4" />
									</button>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Optional Prose Critique Card from AI (if commentary returned) -->
					{#if readingCritique && !readingCritique.readingEvaluation && readingCritique.rawText}
						<LlmCritiqueCard
							result={readingCritique}
							loading={isCheckingReading}
							error={readingError}
							title="Socratic Seminar Leader: Reading Comprehension Check"
							actions={readingActions}
							onDismiss={() => (readingCritique = null)}
							onRetry={runReadingCheck}
						/>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Step-by-Step Task Pipeline: Focus Hero -->
	<div id="step-focus-hero" class="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl space-y-6">
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
					{#if isTodayReadingDone || readingCritique?.readingEvaluation?.verdict === 'COMPREHENDED'}
						<button
							type="button"
							onclick={proceedToStep2}
							class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
						>
							<span>Proceed to Step 2: Micro-Drill</span>
							<ArrowRight class="w-4 h-4" />
						</button>
					{/if}
					{#if currentAssignedCoreReading}
						<button
							type="button"
							onclick={openCurrentReading}
							class="px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 shadow transition cursor-pointer"
						>
							<BookOpen class="w-4 h-4" />
							<span>{isTodayReadingDone ? 'Review Reading' : 'Start Reading'} ({currentDayData.assignedReading.moduleCode})</span>
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
					{#if matchedDrill}
						<button
							type="button"
							onclick={() => isDrillRunnerOpen = !isDrillRunnerOpen}
							class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow transition cursor-pointer"
						>
							<Play class="w-4 h-4 fill-current" />
							<span>{isDrillRunnerOpen ? 'Hide In-Place Drill Runner' : 'Run Drill In-Place (Timer & Reps)'}</span>
						</button>
					{/if}
					<button
						type="button"
						onclick={() => onSelectModality(activeTask.targetModalityId)}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 shadow transition cursor-pointer"
					>
						<span>Studio ({activeTask.targetModalityId.toUpperCase()})</span>
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

		<!-- DELIBERATE DRILL EXPLAINER PANEL (PRACTISE STEP) -->
		{#if currentStep.id === 'practise'}
			<div class="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-5 space-y-4 shadow-lg shadow-black/20">
				<!-- Header -->
				<div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-800/40 gap-2">
					<div class="flex items-center gap-2.5">
						<div class="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
							<Target class="w-4 h-4" />
						</div>
						<div>
							<div class="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
								Practise Directive • Deliberate Micro-Drill
							</div>
							<div class="text-base font-bold text-white">
								{matchedDrill ? matchedDrill.title : activeTask.title}
							</div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-xs font-mono px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-300 font-bold">
							🎯 Target: {matchedDrill?.repCount || '5–10'} Reps • 70–80% Zone
						</span>
					</div>
				</div>

				<!-- Interactive In-Place Drill Runner -->
				{#if isDrillRunnerOpen && matchedDrill}
					<div class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
						<div class="flex items-center justify-between border-b border-neutral-800/80 pb-2">
							<span class="text-xs font-bold text-amber-400">Live Drill Runner: {matchedDrill.title}</span>
							<button
								type="button"
								onclick={() => isDrillRunnerOpen = false}
								class="text-[11px] text-neutral-500 hover:text-white cursor-pointer"
							>
								Close Runner
							</button>
						</div>
						<DrillRunner
							drill={matchedDrill}
							onComplete={() => {
								if (!isActiveTaskDone) {
									toggleTaskWithSound(activeTask.id);
								}
								isDrillRunnerOpen = false;
							}}
						/>
					</div>
				{/if}

				<!-- What you're training -->
				<div class="space-y-1">
					<div class="text-[11px] font-mono uppercase tracking-wider text-amber-400/80 font-bold">
						What You're Training
					</div>
					<p class="text-xs md:text-sm text-neutral-200 leading-relaxed">
						{matchedDrill?.targetSkill || activeTask.objective}
					</p>
				</div>

				<!-- What 1 Rep Looks Like -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<div class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
							What 1 Rep Looks Like ({matchedDrill?.repDuration || '5–8 min per rep'})
						</div>
						<span class="text-[10px] font-mono text-neutral-500">Run 1 rep, self-grade PASS/FAIL, adjust constraint</span>
					</div>
					{#if matchedDrill}
						<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
							{#each matchedDrill.repProtocol as protoStep}
								<div class="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs space-y-1.5 flex flex-col justify-between">
									<div class="flex items-center justify-between font-mono text-[10px] text-amber-400 font-bold">
										<span>Step {protoStep.step}</span>
										<span class="text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded">{protoStep.duration}</span>
									</div>
									<div>
										<div class="font-bold text-neutral-200 text-xs mb-1">{protoStep.label}</div>
										<p class="text-neutral-400 text-[11px] leading-relaxed">{protoStep.instruction}</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
							<div class="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-1">
								<div class="font-bold text-amber-400">1. Attempt Under Constraint</div>
								<p class="text-neutral-300 text-[11px]">Execute the micro-action with timer on. Do not seek perfection.</p>
							</div>
							<div class="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-1">
								<div class="font-bold text-amber-400">2. Compare to Benchmark</div>
								<p class="text-neutral-300 text-[11px]">Evaluate against binary criterion. Did you pass or fail?</p>
							</div>
							<div class="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-1">
								<div class="font-bold text-amber-400">3. Adjust & Repeat</div>
								<p class="text-neutral-300 text-[11px]">Calibrate difficulty. Tighten or reduce scope immediately.</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Where to do it + Difficulty Regulation -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
					<!-- Where to do it -->
					<div class="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
						<div class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center justify-between">
							<span>Where to Practice</span>
							<span class="text-[10px] text-amber-400 font-normal">Studio {activeTask.targetModalityId.toUpperCase()}</span>
						</div>
						<p class="text-xs text-neutral-300 leading-relaxed">
							{matchedDrill?.surface || 'Launch the workbench in the Modality Studio or use your physical sketchbook.'}
						</p>
						<button
							type="button"
							onclick={() => onSelectModality(activeTask.targetModalityId)}
							class="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 transition cursor-pointer shadow"
						>
							<Play class="w-3.5 h-3.5 fill-current" />
							<span>Launch Drill Runner in Studio ({activeTask.targetModalityId.toUpperCase()})</span>
							<ArrowRight class="w-3.5 h-3.5" />
						</button>
					</div>

					<!-- Difficulty Calibration -->
					<div class="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
						<div class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
							Difficulty Regulation (Stay in the 70–80% Zone)
						</div>
						<div class="space-y-2 text-xs">
							<div class="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-[11px] space-y-0.5">
								<div class="font-bold text-emerald-400">Succeeding 10/10? (Too Easy)</div>
								<div class="text-neutral-300">{matchedDrill?.difficulty.harder || 'Tighten constraints, cut time limit in half, or pick an unfamiliar domain.'}</div>
							</div>
							<div class="p-2 rounded-lg bg-red-950/30 border border-red-900/40 text-[11px] space-y-0.5">
								<div class="font-bold text-red-400">Failing &gt;4/10? (Too Hard)</div>
								<div class="text-neutral-300">{matchedDrill?.difficulty.warmup || 'Drop to warmup level: simpler subject, fewer constraints, or longer timer.'}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Worked Pass vs Fail Reference (if available) -->
				{#if matchedDrill}
					<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-2">
						<div class="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
							Benchmark Rep Reference: What Passes vs What Fails
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
							<div class="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 space-y-1">
								<span class="font-bold text-emerald-400 flex items-center gap-1">
									<CheckCircle2 class="w-3 h-3" /> PASS Example:
								</span>
								<p class="text-neutral-300 italic">"{matchedDrill.examplePass}"</p>
							</div>
							<div class="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 space-y-1">
								<span class="font-bold text-red-400 flex items-center gap-1">
									<AlertCircle class="w-3 h-3" /> FAIL Example:
								</span>
								<p class="text-neutral-400 italic">"{matchedDrill.exampleFail}"</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}

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
				<div class="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-1.5">
					<div class="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] font-mono uppercase tracking-wide">
						<CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
						<span>Done Condition (Success Criterion)</span>
					</div>
					<p class="text-emerald-200/90 text-xs leading-relaxed font-medium">
						{activeTask.successCriterion}
					</p>
				</div>

				<!-- Common Failure Trap -->
				<div class="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-xs space-y-1.5">
					<div class="flex items-center gap-1.5 font-bold text-red-400 text-[11px] font-mono uppercase tracking-wide">
						<AlertCircle class="w-3.5 h-3.5 shrink-0" />
						<span>Pitfall / Trap to Avoid</span>
					</div>
					<p class="text-red-200/90 text-xs leading-relaxed font-medium">
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
				<div class="flex items-center justify-between">
					<label for="tomorrow-action-input" class="text-xs text-neutral-300 font-medium">
						Tomorrow's first 5-minute opening action:
					</label>
					<LlmTriggerButton
						label="Validate 5-Min Action"
						onclick={runHemingwayCheck}
						loading={isCheckingHemingway}
						disabled={!tomorrowInput.trim()}
						title="Audit whether this action is atomic, concrete, and doable in <= 5 minutes"
					/>
				</div>
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

			{#if hemingwayCritique || isCheckingHemingway || hemingwayError}
				<div class="pt-2">
					<LlmCritiqueCard
						result={hemingwayCritique}
						loading={isCheckingHemingway}
						error={hemingwayError}
						title="Anti-Procrastination Architect: Hemingway Stop Validation"
						actions={hemingwayActions}
						onDismiss={() => (hemingwayCritique = null)}
						onRetry={runHemingwayCheck}
					/>

					{#if hemingwayCritique?.hemingwayAudit}
						{@const ha = hemingwayCritique.hemingwayAudit}
						<div class="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
							<div class="flex items-center justify-between">
								<span class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded {ha.verdict === 'ATOMIC' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}">
									Verdict: {ha.verdict}
								</span>
								<span class="font-mono text-neutral-400 text-[11px]">
									Est. Duration: <strong class="text-amber-400">{ha.estimatedMinutes} min</strong>
								</span>
							</div>

							{#if ha.decomposedAction}
								<div class="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
									<div class="text-[10px] font-mono text-neutral-400 uppercase">Atomic 5-Minute Alternative:</div>
									<div class="text-neutral-200 mt-0.5 font-medium">{ha.decomposedAction}</div>
								</div>
							{/if}

							{#if ha.obstacleWarning}
								<div class="text-[11px] text-amber-300/90 leading-tight">
									<strong class="text-amber-400 font-mono text-[10px] uppercase">Obstacle Warning:</strong> {ha.obstacleWarning}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Daily Attention & Play Quick Journal -->
			<div class="pt-2 border-t border-neutral-800 space-y-3">
				<div class="flex items-center justify-between">
					<div class="text-[11px] font-semibold text-neutral-400">Protected Daily 1-Sentence Logs:</div>
					<LlmTriggerButton
						label="Audit Attention Purity"
						onclick={runAttentionPurityCheck}
						loading={isCheckingAttention}
						disabled={!quickAttention.trim() && !quickPlay.trim()}
						title="Audit whether attention observation is genuinely non-instrumental or utility-contaminated"
					/>
				</div>
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

				{#if attentionCritique || isCheckingAttention || attentionError}
					<div class="pt-2">
						<LlmCritiqueCard
							result={attentionCritique}
							loading={isCheckingAttention}
							error={attentionError}
							title="Attention Sentinel: Non-Instrumental Purity Audit"
							actions={attentionActions}
							onDismiss={() => (attentionCritique = null)}
							onRetry={runAttentionPurityCheck}
						/>

						{#if attentionCritique?.attentionPurity}
							{@const ap = attentionCritique.attentionPurity}
							<div class="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
								<div class="flex items-center justify-between">
									<span class="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded {ap.verdict === 'PURE_NON_INSTRUMENTAL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
										Purity: {ap.verdict}
									</span>
								</div>

								{#if ap.contaminationAnalysis}
									<div class="text-[11px] text-neutral-300 leading-relaxed">
										<strong class="text-amber-400 font-mono text-[10px] uppercase">Analysis:</strong> {ap.contaminationAnalysis}
									</div>
								{/if}

								{#if ap.purifiedObservation}
									<div class="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
										<div class="text-[10px] font-mono text-neutral-400 uppercase">Purified Sensory Observation:</div>
										<div class="text-neutral-200 mt-0.5 italic">{ap.purifiedObservation}</div>
									</div>
								{/if}

								{#if ap.prescribedAttentiveMove}
									<div class="text-[11px] text-emerald-300/90 font-mono pt-1 border-t border-neutral-800">
										<strong class="text-emerald-400">Prescribed Move:</strong> {ap.prescribedAttentiveMove}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
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
