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

	import ProjectWorkspace from './ProjectWorkspace.svelte';

	let {
		project,
		onClose,
		onLaunchModality
	}: {
		project: ProjectSpec;
		onClose: () => void;
		onLaunchModality: (modId: string) => void;
	} = $props();

	let activeModalTab = $state<'workspace' | 'spec'>('workspace');
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

		<!-- Tabs -->
		<div class="px-6 py-2.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center gap-2 text-xs">
			<button
				type="button"
				onclick={() => activeModalTab = 'workspace'}
				class="px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer {activeModalTab === 'workspace' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}"
			>
				Live Workspace & Checklist
			</button>
			<button
				type="button"
				onclick={() => activeModalTab = 'spec'}
				class="px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer {activeModalTab === 'spec' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}"
			>
				Full Specification & Rubrics
			</button>
		</div>

		<!-- Body -->
		<div class="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-neutral-300">
			{#if activeModalTab === 'workspace'}
				<ProjectWorkspace {project} {onLaunchModality} />
			{:else}
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
			{/if}
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
