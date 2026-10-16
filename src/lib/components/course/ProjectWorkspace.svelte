<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { ProjectSpec } from '$lib/data/projects';
	import type { ProjectStatus } from '$lib/schemas/course.schema';
	import {
		CheckCircle2,
		Circle,
		Layers,
		ArrowRight,
		ExternalLink,
		Sparkles,
		Clock,
		Target,
		Award,
		Sliders,
		Link as LinkIcon,
		FileCheck,
		AlertCircle,
		AlertTriangle,
		Trash2,
		Check,
		HelpCircle
	} from '@lucide/svelte';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let {
		project,
		onLaunchModality
	}: {
		project: ProjectSpec;
		onLaunchModality?: (modId: string) => void;
	} = $props();

	let progress = $derived(practiceStore.getProjectProgress(project.id));

	let totalDeliverables = $derived(project.deliverables.length);
	let completedDeliverablesCount = $derived(
		project.deliverables.filter((d) => progress.completedDeliverableNames.includes(d.name)).length
	);
	let percentComplete = $derived(
		totalDeliverables > 0 ? Math.round((completedDeliverablesCount / totalDeliverables) * 100) : 0
	);

	// Two-Axis evaluation local inputs
	let outcomeScore = $state(3);
	let decisionScore = $state(3);
	let evalNotes = $state('');
	let evalSavedNotice = $state(false);

	let artifactUrl = $state('');
	let urlSavedNotice = $state(false);

	// LLM states & loading indicators
	let rubricCritique = $state<CritiqueResult | null>(null);
	let twoAxisCritique = $state<CritiqueResult | null>(null);
	let isCheckingRubric = $state(false);
	let isCheckingTwoAxis = $state(false);
	let rubricSavedNotice = $state(false);
	let twoAxisSavedNotice = $state(false);

	$effect(() => {
		outcomeScore = progress.twoAxisEvaluation?.outcomeScore ?? 3;
		decisionScore = progress.twoAxisEvaluation?.decisionScore ?? 3;
		evalNotes = progress.twoAxisEvaluation?.notes ?? '';
		artifactUrl = progress.repositoryOrArtifactUrl ?? '';
	});

	let classifiedQuadrant = $derived(
		practiceStore.classifyQuadrant(outcomeScore, decisionScore)
	);

	const quadrantMeta = {
		mastery: { name: 'Mastery', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
		'learning-in-progress': { name: 'Learning in Progress', color: 'text-blue-400 bg-blue-950/40 border-blue-800' },
		'lucky-unstable': { name: 'Lucky / Unstable', color: 'text-amber-400 bg-amber-950/40 border-amber-800' },
		failure: { name: 'Failure', color: 'text-red-400 bg-red-950/40 border-red-800' }
	};

	const statusOptions: { id: ProjectStatus; label: string; color: string }[] = [
		{ id: 'not-started', label: 'Not Started', color: 'text-neutral-400 border-neutral-700 bg-neutral-900' },
		{ id: 'in-progress', label: 'In Progress', color: 'text-amber-400 border-amber-500/50 bg-amber-500/10 font-bold' },
		{ id: 'under-critique', label: 'Under Critique', color: 'text-purple-400 border-purple-500/50 bg-purple-500/10 font-bold' },
		{ id: 'completed', label: 'Approved Final', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 font-bold' },
		{ id: 'abandoned', label: 'Principled Abandonment', color: 'text-red-400 border-red-500/50 bg-red-500/10' }
	];

	function saveEvaluation() {
		practiceStore.saveProjectEvaluation(project.id, outcomeScore, decisionScore, evalNotes);
		evalSavedNotice = true;
		setTimeout(() => (evalSavedNotice = false), 3000);
	}

	function saveArtifactUrl() {
		practiceStore.setProjectArtifactUrl(project.id, artifactUrl.trim());
		urlSavedNotice = true;
		setTimeout(() => (urlSavedNotice = false), 2500);
	}

	// Filtered decisions for this project
	let projectDecisions = $derived(
		practiceStore.decisions.filter(
			(d) =>
				d.project.toLowerCase().includes(project.id.toLowerCase()) ||
				d.project.toLowerCase().includes(`p${project.number}`) ||
				d.project.toLowerCase().includes(`project ${project.number}`)
		)
	);

	function deleteDecision(id: string) {
		practiceStore.decisions = practiceStore.decisions.filter((d) => d.id !== id);
		practiceStore.saveToStorage();
	}

	async function runRubricAudit() {
		if (isCheckingRubric) return;
		isCheckingRubric = true;
		try {
			const result = await executePrompt('project-rubric-audit', {
				projectNumber: project.number,
				projectTitle: project.title,
				phaseOrMonth: project.phaseOrMonth,
				goal: project.goal,
				deliverables: project.deliverables,
				rubric: project.evaluationRubric.map((r) => ({
					criterion: r.level,
					weight: 1,
					targetOutcome: r.criteria
				})),
				artifactUrl,
				notes: evalNotes,
				completedDeliverableNames: progress.completedDeliverableNames
			});
			rubricCritique = result;
		} catch (err) {
			console.error('Failed to run rubric audit:', err);
		} finally {
			isCheckingRubric = false;
		}
	}

	async function runTwoAxisCrossExam() {
		if (isCheckingTwoAxis) return;
		isCheckingTwoAxis = true;
		try {
			const result = await executePrompt('two-axis-cross-examination', {
				projectName: `Project ${project.number}: ${project.title}`,
				outcomeScore,
				decisionScore,
				reflectionNotes: evalNotes,
				projectContext: project.goal,
				recentDecisions: projectDecisions.map((d) => `${d.decision} (Justification: ${d.justification})`)
			});
			twoAxisCritique = result;
		} catch (err) {
			console.error('Failed to run two-axis cross examination:', err);
		} finally {
			isCheckingTwoAxis = false;
		}
	}

	// 1-Click actions for Project Rubric Critique
	const rubricActions: LlmAction[] = [
		{
			label: 'Append Guidance to Evaluation Notes',
			primary: true,
			onClick: (result) => {
				if (result.projectRubricAudit?.sharpenedGuidance) {
					const addition = `[Rubric Guidance (${result.projectRubricAudit.verdict})]: ${result.projectRubricAudit.sharpenedGuidance}`;
					evalNotes = evalNotes ? `${evalNotes}\n\n${addition}` : addition;
					saveEvaluation();
				}
			}
		},
		{
			label: 'Record Audit to Studio Decision Log',
			variant: 'secondary',
			onClick: (result) => {
				if (result.projectRubricAudit) {
					practiceStore.saveDecision({
						project: `P${project.number}: ${project.title}`,
						decision: `Project Rubric Audit: ${result.projectRubricAudit.verdict} (${result.projectRubricAudit.overallScore}/100)`,
						highestUnresolvedLevel: 'Level 1 (Intent)',
						alternativesRejected: 'Proceeding with unexamined deliverable gaps or missing negative constraints',
						justification: `${result.projectRubricAudit.sharpenedGuidance} Next move: ${result.projectRubricAudit.nextDirectorialMove}`,
						feedbackIncorporated: 'Studio Jury Master Rubric Audit',
						refusals: 'None'
					});
					rubricSavedNotice = true;
					setTimeout(() => (rubricSavedNotice = false), 3000);
				}
			}
		}
	];

	// 1-Click actions for Two-Axis Cross-Examination
	const twoAxisActions: LlmAction[] = [
		{
			label: 'Adopt Calibrated Quadrant Scores',
			primary: true,
			onClick: (result) => {
				if (result.twoAxisCrossExam) {
					outcomeScore = result.twoAxisCrossExam.recommendedOutcomeScore;
					decisionScore = result.twoAxisCrossExam.recommendedDecisionScore;
					saveEvaluation();
				}
			}
		},
		{
			label: 'Record Cross-Examination to Decision Log',
			variant: 'secondary',
			onClick: (result) => {
				if (result.twoAxisCrossExam) {
					practiceStore.saveDecision({
						project: `P${project.number}: ${project.title}`,
						decision: `Two-Axis Calibrated: ${result.twoAxisCrossExam.diagnosedQuadrant.toUpperCase()} (${result.twoAxisCrossExam.recommendedOutcomeScore}/4 Outcome, ${result.twoAxisCrossExam.recommendedDecisionScore}/4 Decision)`,
						highestUnresolvedLevel: 'Level 3 (Structure)',
						alternativesRejected: `Self-assessed bias (${result.twoAxisCrossExam.congruenceVerdict})`,
						justification: `${result.twoAxisCrossExam.socraticChallenge} Prescription: ${result.twoAxisCrossExam.directorialPrescription}`,
						feedbackIncorporated: 'Two-Axis Socratic Cross-Examination',
						refusals: 'None'
					});
					twoAxisSavedNotice = true;
					setTimeout(() => (twoAxisSavedNotice = false), 3000);
				}
			}
		}
	];
</script>

<div class="space-y-6">
	<!-- Project Hero Banner -->
	<div class="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
			<div class="space-y-1">
				<div class="flex items-center gap-2 flex-wrap">
					<span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
						Project {project.number}
					</span>
					<span class="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
						{project.type} Track
					</span>
					<span class="text-xs text-neutral-500">•</span>
					<span class="text-xs font-mono text-neutral-400">{project.phaseOrMonth}</span>
				</div>
				<h2 class="text-xl md:text-2xl font-bold text-white tracking-tight">
					{project.title}
				</h2>
			</div>

			<!-- Status Selector -->
			<div class="flex items-center gap-1.5 flex-wrap">
				{#each statusOptions as opt}
					<button
						type="button"
						onclick={() => practiceStore.setProjectStatus(project.id, opt.id)}
						class="px-2.5 py-1 rounded-xl text-xs border transition cursor-pointer {progress.status === opt.id ? opt.color + ' shadow' : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'}"
					>
						{opt.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Goal & Primary Studio Launch -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
			<div class="md:col-span-2 space-y-2">
				<div class="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Primary Project Goal</div>
				<p class="text-neutral-300 leading-relaxed font-serif text-sm">
					{project.goal}
				</p>
			</div>

			<div class="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 flex flex-col justify-between">
				<div class="space-y-1">
					<div class="text-[11px] font-mono uppercase text-neutral-400">Primary Studio Workbench</div>
					<div class="font-mono text-amber-400 font-bold">Studio {project.primaryModalityId.toUpperCase()}</div>
					<div class="text-[11px] text-neutral-500">{project.duration} • {project.estimatedWorkload}</div>
				</div>
				{#if onLaunchModality}
					<button
						type="button"
						onclick={() => onLaunchModality(project.primaryModalityId)}
						class="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
					>
						<span>Open Studio {project.primaryModalityId.toUpperCase()}</span>
						<ArrowRight class="w-3.5 h-3.5" />
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Deliverables Checklist & Progress -->
	<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
			<div>
				<div class="flex items-center gap-2">
					<FileCheck class="w-4 h-4 text-amber-400" />
					<h3 class="text-base font-bold text-white">Project Deliverables Checklist</h3>
				</div>
				<p class="text-xs text-neutral-400 mt-0.5">
					Track required tangible artifacts against project specification.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<span class="text-xs font-mono font-bold text-amber-400">
					{completedDeliverablesCount} / {totalDeliverables} Completed ({percentComplete}%)
				</span>
				<div class="w-24 h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
					<div
						class="h-full bg-amber-500 transition-all duration-300"
						style="width: {percentComplete}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Deliverables List -->
		<div class="space-y-2.5">
			{#each project.deliverables as deliv}
				{@const isDone = progress.completedDeliverableNames.includes(deliv.name)}
				<div
					class="p-3.5 rounded-xl border transition flex items-start justify-between gap-3 {isDone ? 'bg-emerald-950/20 border-emerald-900/40 text-neutral-200' : 'bg-neutral-950 border-neutral-800/80 text-neutral-300'}"
				>
					<button
						type="button"
						onclick={() => practiceStore.toggleProjectDeliverable(project.id, deliv.name)}
						class="flex items-start gap-3 text-left flex-1 cursor-pointer group"
					>
						<span class="mt-0.5 shrink-0">
							{#if isDone}
								<CheckCircle2 class="w-4 h-4 text-emerald-400" />
							{:else}
								<Circle class="w-4 h-4 text-neutral-600 group-hover:text-amber-400 transition" />
							{/if}
						</span>
						<div class="space-y-0.5">
							<div class="text-xs font-bold {isDone ? 'text-white line-through opacity-85' : 'text-neutral-100'}">
								{deliv.name}
							</div>
							<p class="text-[11px] text-neutral-400 leading-relaxed">
								{deliv.specification}
							</p>
						</div>
					</button>

					<span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded shrink-0 {isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-900 text-neutral-500'}">
						{isDone ? 'Done' : 'Pending'}
					</span>
				</div>
			{/each}
		</div>

		<!-- Artifact / Repository Link Entry -->
		<div class="pt-2 border-t border-neutral-800 space-y-2">
			<label for="artifact-url" class="block text-xs font-medium text-neutral-300">
				Artifact URL / Deliverables Repository (GitHub, Figma, ComfyUI flow, or Live site):
			</label>
			<div class="flex gap-2">
				<div class="relative flex-1">
					<LinkIcon class="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
					<input
						id="artifact-url"
						type="url"
						bind:value={artifactUrl}
						placeholder="https://github.com/... or https://figma.com/..."
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
					/>
				</div>
				<button
					type="button"
					onclick={saveArtifactUrl}
					class="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition cursor-pointer"
				>
					Save Link
				</button>
			</div>
			{#if urlSavedNotice}
				<div class="text-[11px] text-emerald-400 font-mono">
					✓ Artifact link persisted to project dossier!
				</div>
			{/if}
		</div>

		<!-- AI Deliverable Rubric Auditor Trigger & Output -->
		<div class="pt-4 border-t border-neutral-800 space-y-4">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<div class="flex items-center gap-2">
						<Sparkles class="w-4 h-4 text-amber-400" />
						<span class="text-xs font-bold text-white uppercase tracking-wider">Studio Jury Rubric Auditor</span>
					</div>
					<p class="text-[11px] text-neutral-400 mt-0.5">
						Evaluates your completed deliverables, links, and reflection against Project {project.number} rubrics.
					</p>
				</div>
				<LlmTriggerButton
					label="Audit Submission Against Rubric"
					onclick={runRubricAudit}
					loading={isCheckingRubric}
					disabled={!evalNotes.trim() && !artifactUrl.trim()}
					title="Audit completed project deliverables and diagnostic notes against project rubrics"
				/>
			</div>

			{#if rubricSavedNotice}
				<div class="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-mono">
					<Check class="w-4 h-4 text-emerald-400" />
					<span>Project rubric audit saved to Studio Decision Log!</span>
				</div>
			{/if}

			{#if rubricCritique?.projectRubricAudit}
				{@const audit = rubricCritique.projectRubricAudit}
				<div class="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-4">
					<div class="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
						<div class="flex items-center gap-2">
							<span
								class="text-xs font-mono font-bold px-2.5 py-0.5 rounded border {audit.verdict === 'DISTINCTION_PASS'
									? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
									: audit.verdict === 'SOLID_PASS'
										? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
										: audit.verdict === 'REVISE_DEFECTS'
											? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
											: 'bg-rose-500/10 text-rose-400 border-rose-500/30'}"
							>
								{audit.verdict}
							</span>
							<span class="text-xs font-mono text-neutral-400">
								Score: <strong class="text-amber-400">{audit.overallScore}</strong>/100
							</span>
						</div>
						<span class="text-[11px] font-mono text-neutral-500">
							{audit.criteriaAssessments.length} Rubric Criteria Audited
						</span>
					</div>

					<!-- Criteria assessments breakdown -->
					{#if audit.criteriaAssessments.length > 0}
						<div class="space-y-2">
							<div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
								Criteria Breakdown:
							</div>
							<div class="grid grid-cols-1 gap-2">
								{#each audit.criteriaAssessments as crit}
									<div class="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1 text-xs">
										<div class="flex items-center justify-between gap-2">
											<span class="font-bold text-neutral-200">{crit.criterion}</span>
											<span
												class="text-[10px] font-mono px-2 py-0.5 rounded border {crit.rating === 'MEETS'
													? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
													: crit.rating === 'PARTIAL'
														? 'bg-amber-950/60 text-amber-400 border-amber-800'
														: 'bg-rose-950/60 text-rose-400 border-rose-800'}"
											>
												{crit.rating}
											</span>
										</div>
										<p class="text-[11px] text-neutral-400 leading-relaxed">
											{crit.feedback}
										</p>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Blind spots -->
					{#if audit.flaggedBlindSpots.length > 0}
						<div class="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-1.5">
							<div class="flex items-center gap-1.5 text-xs font-bold text-rose-400">
								<AlertCircle class="w-3.5 h-3.5 shrink-0" />
								<span>Flagged Deliverable Blind Spots & Evasions:</span>
							</div>
							<ul class="text-[11px] text-rose-200/90 list-disc list-inside space-y-0.5">
								{#each audit.flaggedBlindSpots as spot}
									<li>{spot}</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Sharpened guidance -->
					<div class="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 space-y-1">
						<div class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
							Directorial Elevation Guidance:
						</div>
						<p class="text-xs text-neutral-200 leading-relaxed font-serif">
							{audit.sharpenedGuidance}
						</p>
					</div>

					<!-- Next directorial move -->
					<div class="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs flex items-center justify-between gap-3">
						<div class="flex items-center gap-2 text-neutral-300">
							<Target class="w-3.5 h-3.5 text-amber-400 shrink-0" />
							<span><strong>Next Action:</strong> {audit.nextDirectorialMove}</span>
						</div>
					</div>
				</div>
			{/if}

			{#if rubricCritique}
				<LlmCritiqueCard
					result={rubricCritique}
					onDismiss={() => (rubricCritique = null)}
					actions={rubricActions}
				/>
			{/if}
		</div>
	</div>

	<!-- Two-Axis Project Evaluation Section -->
	<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
			<div>
				<div class="flex items-center gap-2">
					<Award class="w-4 h-4 text-amber-400" />
					<h3 class="text-base font-bold text-white">Project Assessment: Two-Axis Quadrant</h3>
				</div>
				<p class="text-xs text-neutral-400 mt-0.5">
					Prevent rationalisation and unstable lucky hits. Grade outcome fitness against decision reasoning.
				</p>
			</div>

			<div class="flex items-center gap-2">
				<span class="text-xs text-neutral-400">Classified State:</span>
				<span class="px-2.5 py-1 rounded-xl text-xs font-bold border {quadrantMeta[classifiedQuadrant].color}">
					{quadrantMeta[classifiedQuadrant].name}
				</span>
			</div>
		</div>

		<!-- Sliders -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
			<div class="space-y-1.5">
				<div class="flex items-center justify-between text-neutral-300">
					<span>Outcome Quality (Artifact Fitness):</span>
					<span class="font-mono font-bold {outcomeScore >= 3 ? 'text-emerald-400' : 'text-neutral-400'}">
						{outcomeScore} / 4 ({outcomeScore >= 3 ? 'Strong' : 'Weak'})
					</span>
				</div>
				<input type="range" min="1" max="4" step="1" bind:value={outcomeScore} class="w-full accent-amber-500 cursor-pointer" />
				<p class="text-[11px] text-neutral-500">Does the deliverable meet acceptance criteria independently?</p>
			</div>

			<div class="space-y-1.5">
				<div class="flex items-center justify-between text-neutral-300">
					<span>Decision Quality (Process & Reasoning):</span>
					<span class="font-mono font-bold {decisionScore >= 3 ? 'text-emerald-400' : 'text-neutral-400'}">
						{decisionScore} / 4 ({decisionScore >= 3 ? 'Strong' : 'Weak'})
					</span>
				</div>
				<input type="range" min="1" max="4" step="1" bind:value={decisionScore} class="w-full accent-amber-500 cursor-pointer" />
				<p class="text-[11px] text-neutral-500">Were choices causal, explicit, and backed by rejection logic?</p>
			</div>
		</div>

		<!-- Reflection notes & Save -->
		<div class="space-y-3">
			<div>
				<label for="eval-notes" class="block text-xs font-medium text-neutral-300 mb-1">
					Diagnostic Evaluation Notes (What worked? What broke?):
				</label>
				<textarea
					id="eval-notes"
					rows="3"
					bind:value={evalNotes}
					placeholder="State why you assigned these scores. Avoid evaluative adjectives. Focus on causal decisions..."
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
				></textarea>
			</div>

			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
				<div class="flex items-center gap-3">
					<button
						type="button"
						onclick={saveEvaluation}
						class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition flex items-center gap-2 cursor-pointer shadow"
					>
						<Award class="w-3.5 h-3.5" />
						<span>Commit Project Evaluation</span>
					</button>

					{#if evalSavedNotice}
						<span class="text-xs text-emerald-400 font-mono animate-in fade-in">
							✓ Evaluation saved to Project Record!
						</span>
					{:else if progress.twoAxisEvaluation}
						<span class="text-[11px] text-neutral-500 font-mono">
							Last graded: {progress.twoAxisEvaluation.date} ({progress.twoAxisEvaluation.outcomeScore}/4 Outcome, {progress.twoAxisEvaluation.decisionScore}/4 Decision)
						</span>
					{/if}
				</div>

				<!-- AI Cross-Examiner Trigger -->
				<LlmTriggerButton
					label="Cross-Examine Scores & Reasoning"
					onclick={runTwoAxisCrossExam}
					loading={isCheckingTwoAxis}
					title="Cross-examine self-assessed Outcome and Decision scores on the Two-Axis Matrix"
				/>
			</div>

			{#if twoAxisSavedNotice}
				<div class="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-mono">
					<Check class="w-4 h-4 text-emerald-400" />
					<span>Two-Axis cross-examination saved to Studio Decision Log!</span>
				</div>
			{/if}

			{#if twoAxisCritique?.twoAxisCrossExam}
				{@const exam = twoAxisCritique.twoAxisCrossExam}
				<div class="p-4 rounded-xl bg-neutral-950 border border-blue-500/30 space-y-3">
					<div class="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
						<div class="flex items-center gap-2">
							<span
								class="text-xs font-mono font-bold px-2.5 py-0.5 rounded border {exam.congruenceVerdict === 'HONEST_CONGRUENT'
									? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
									: exam.congruenceVerdict === 'SUSPECTED_RATIONALISATION'
										? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
										: exam.congruenceVerdict === 'SUSPECTED_LUCKY_HIT'
											? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
											: 'bg-blue-500/10 text-blue-400 border-blue-500/30'}"
							>
								{exam.congruenceVerdict}
							</span>
							<span class="text-xs text-neutral-400 font-mono">
								Diagnosed: <strong class="capitalize text-white">{exam.diagnosedQuadrant.replace('-', ' ')}</strong>
							</span>
						</div>

						<div class="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
							Recommended: <span class="text-amber-400 font-bold">{exam.recommendedOutcomeScore}/4</span> Outcome • <span class="text-amber-400 font-bold">{exam.recommendedDecisionScore}/4</span> Decision
						</div>
					</div>

					<!-- Socratic Challenge Probe -->
					<div class="p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 space-y-1">
						<div class="text-[11px] font-bold uppercase tracking-wider text-blue-400">
							Socratic Epistemic Challenge:
						</div>
						<p class="text-xs text-neutral-200 leading-relaxed font-serif italic">
							"{exam.socraticChallenge}"
						</p>
					</div>

					<!-- Directorial Prescription -->
					<div class="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
						<div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
							Directorial Prescription:
						</div>
						<p class="text-xs text-neutral-300 leading-relaxed">
							{exam.directorialPrescription}
						</p>
					</div>
				</div>
			{/if}

			{#if twoAxisCritique}
				<LlmCritiqueCard
					result={twoAxisCritique}
					onDismiss={() => (twoAxisCritique = null)}
					actions={twoAxisActions}
				/>
			{/if}
		</div>
	</div>

	<!-- Recent Project Decisions History Table -->
	<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
		<div class="flex items-center justify-between border-b border-neutral-800 pb-3">
			<div class="flex items-center gap-2">
				<Layers class="w-4 h-4 text-amber-400" />
				<h3 class="text-sm font-bold text-white">Project {project.number} Decision Logbook</h3>
			</div>
			<span class="text-xs font-mono text-neutral-400">
				{projectDecisions.length} Decisions Recorded
			</span>
		</div>

		{#if projectDecisions.length === 0}
			<div class="text-center py-6 text-xs text-neutral-500 font-mono">
				No recorded decisions for Project {project.number} yet. Use the Rubric Auditor or Two-Axis Cross-Examiner to commit directorial commitments.
			</div>
		{:else}
			<div class="space-y-2">
				{#each projectDecisions as decision}
					<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2 text-xs">
						<div class="flex items-start justify-between gap-3">
							<div class="space-y-1">
								<div class="font-bold text-neutral-200 text-sm">
									{decision.decision}
								</div>
								<div class="text-[10px] font-mono text-neutral-500">
									{decision.date} • {decision.project}
								</div>
							</div>
							<button
								type="button"
								onclick={() => deleteDecision(decision.id)}
								class="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-rose-400 transition cursor-pointer shrink-0"
								title="Delete decision"
							>
								<Trash2 class="w-3.5 h-3.5" />
							</button>
						</div>

						<div class="space-y-1 pt-1 border-t border-neutral-900">
							{#if decision.alternativesRejected}
								<div class="text-neutral-400">
									<strong class="text-neutral-500">Alternatives Rejected:</strong> {decision.alternativesRejected}
								</div>
							{/if}
							{#if decision.justification}
								<div class="text-neutral-300">
									<strong class="text-neutral-500">Justification:</strong> {decision.justification}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
