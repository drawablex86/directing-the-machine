<script lang="ts">
	import type { ProjectSpec } from '$lib/data/projects';
	import { practiceStore } from '$lib/state/practice.svelte';
	import {
		X,
		CheckCircle2,
		Circle,
		ArrowRight,
		Layers,
		Calendar,
		Clock,
		Sparkles,
		ShieldCheck,
		Scale
	} from '@lucide/svelte';

	let {
		project,
		onClose,
		onLaunchModality
	}: {
		project: ProjectSpec;
		onClose: () => void;
		onLaunchModality: (modId: string) => void;
	} = $props();

	// Evaluation states
	let outcomeQuality = $state<number>(3);
	let decisionQuality = $state<number>(3);
	let reflectionNotes = $state<string>('');
	let submittedEvaluation = $state<boolean>(false);

	function submitEvaluation() {
		practiceStore.evaluateProjectSession({
			projectId: project.id,
			projectName: project.title,
			outcomeQuality,
			decisionQuality,
			intention: project.goal,
			reflectionNotes: reflectionNotes.trim() || 'Project milestone evaluated against rubrics.'
		});
		submittedEvaluation = true;
		setTimeout(() => {
			submittedEvaluation = false;
		}, 3000);
	}
</script>

<div class="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
	<div class="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in duration-200">
		<!-- Header -->
		<div class="p-6 border-b border-neutral-800 flex items-start justify-between gap-4 bg-neutral-950/60">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
						Project {project.number} · {project.track}
					</span>
					<span class="text-xs font-mono text-neutral-400">{project.phaseOrMonth}</span>
				</div>
				<h2 class="text-xl md:text-2xl font-bold text-white tracking-tight">
					{project.title}
				</h2>
				<div class="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pt-1">
					<span class="flex items-center gap-1">
						<Clock class="w-3.5 h-3.5 text-neutral-500" />
						{project.duration} ({project.estimatedWorkload})
					</span>
					<span>•</span>
					<span class="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
						{project.type}
					</span>
					<span>•</span>
					<span class="text-neutral-400">Prereq: {project.prerequisites}</span>
				</div>
			</div>

			<button
				type="button"
				onclick={onClose}
				class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition cursor-pointer"
			>
				<X class="w-5 h-5" />
			</button>
		</div>

		<!-- Body -->
		<div class="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-neutral-300">
			<!-- Goal -->
			<div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
				<h3 class="text-xs font-bold uppercase tracking-wider text-amber-400">Directorial Goal</h3>
				<p class="text-neutral-200 leading-relaxed text-xs md:text-sm">
					{project.goal}
				</p>
			</div>

			<!-- Brief -->
			<div class="space-y-2">
				<h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">Project Brief & Constraints</h3>
				<p class="text-neutral-300 leading-relaxed text-xs md:text-sm bg-neutral-950 p-4 rounded-xl border border-neutral-800">
					{project.brief}
				</p>
			</div>

			<!-- Deliverables Table -->
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">Required Deliverables</h3>
					<span class="text-xs font-mono text-neutral-500">{project.deliverables.length} Items</span>
				</div>
				<div class="border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800/80 bg-neutral-950/40">
					{#each project.deliverables as deliv, i}
						<div class="p-3.5 flex items-start gap-3 hover:bg-neutral-800/30 transition">
							<span class="text-xs font-mono font-bold text-amber-400 mt-0.5">0{i + 1}</span>
							<div class="space-y-0.5 flex-1">
								<div class="font-semibold text-neutral-200 text-xs md:text-sm">{deliv.name}</div>
								<p class="text-xs text-neutral-400 leading-normal">{deliv.specification}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Evaluation Rubric -->
			<div class="space-y-3">
				<h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">Evaluation Rubric</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
					{#each project.evaluationRubric as rub}
						<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1 text-xs">
							<span class="font-bold font-mono text-amber-400">{rub.level}</span>
							<p class="text-neutral-400 leading-normal">{rub.criteria}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Evaluation & Two-Axis Logging Loop -->
			<div class="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Scale class="w-4 h-4 text-amber-400" />
						<h3 class="font-bold text-xs uppercase tracking-wider text-neutral-200">
							Evaluate Milestone in Two-Axis Quadrant
						</h3>
					</div>
					{#if submittedEvaluation}
						<span class="text-emerald-400 text-xs font-bold flex items-center gap-1">
							<CheckCircle2 class="w-3.5 h-3.5" />
							Logged into Assessment Matrix!
						</span>
					{/if}
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
					<div class="space-y-1.5">
						<div class="flex justify-between text-neutral-400">
							<span>Outcome Quality (Artifact Fitness)</span>
							<span class="font-mono text-amber-400 font-bold">{outcomeQuality}/4</span>
						</div>
						<input
							type="range"
							min="1"
							max="4"
							step="1"
							bind:value={outcomeQuality}
							class="w-full accent-amber-500 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] text-neutral-600 font-mono">
							<span>1: Weak</span>
							<span>2: Flawed</span>
							<span>3: Strong</span>
							<span>4: Exceptional</span>
						</div>
					</div>

					<div class="space-y-1.5">
						<div class="flex justify-between text-neutral-400">
							<span>Decision Quality (Sound Process)</span>
							<span class="font-mono text-amber-400 font-bold">{decisionQuality}/4</span>
						</div>
						<input
							type="range"
							min="1"
							max="4"
							step="1"
							bind:value={decisionQuality}
							class="w-full accent-amber-500 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] text-neutral-600 font-mono">
							<span>1: Accidental</span>
							<span>2: Inconsistent</span>
							<span>3: Rigorous</span>
							<span>4: Masterful</span>
						</div>
					</div>
				</div>

				<div class="space-y-1.5">
					<label for="evaluation-reflection" class="text-xs text-neutral-400">Reflection & Diagnostic Causal Notes</label>
					<input
						id="evaluation-reflection"
						type="text"
						bind:value={reflectionNotes}
						placeholder="What specific causal decision determined whether this milestone succeeded?"
						class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
				</div>

				<button
					type="button"
					onclick={submitEvaluation}
					class="w-full py-2.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition cursor-pointer"
				>
					Log Milestone to Two-Axis Assessment
				</button>
			</div>
		</div>

		<!-- Footer -->
		<div class="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3">
			<button
				type="button"
				onclick={onClose}
				class="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
			>
				Close Dossier
			</button>

			<button
				type="button"
				onclick={() => {
					onClose();
					onLaunchModality(project.primaryModalityId);
				}}
				class="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-2 shadow-lg transition cursor-pointer"
			>
				<span>Launch Primary Studio Lab ({project.primaryModalityId.toUpperCase()})</span>
				<ArrowRight class="w-4 h-4" />
			</button>
		</div>
	</div>
</div>
