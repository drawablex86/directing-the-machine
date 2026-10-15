<script lang="ts">
	import type { StudioHook } from '$lib/data/blog/posts';
	import { ArrowRight, Compass, Sparkles, Terminal } from '@lucide/svelte';

	interface Props {
		hook: StudioHook;
	}

	let { hook }: Props = $props();
</script>

<div class="my-12 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-neutral-900/60 to-neutral-950 p-6 sm:p-8 shadow-xl relative overflow-hidden group">
	<!-- Background accent flare -->
	<div class="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500"></div>

	<div class="relative z-10 space-y-4">
		<div class="flex items-center gap-2">
			<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
				<Sparkles class="w-3.5 h-3.5" />
				<span>{hook.label}</span>
			</span>
			<span class="text-xs font-mono text-neutral-400">Deliberate Practice Studio</span>
		</div>

		<h3 class="text-xl sm:text-2xl font-serif font-black text-white tracking-tight">
			Translate this essay into active creative muscle.
		</h3>

		<p class="text-sm font-serif text-neutral-300 max-w-2xl leading-relaxed">
			{hook.description}
		</p>

		<div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
			<a
				href={hook.href}
				class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
			>
				<span>Open Studio Workbench</span>
				<ArrowRight class="w-4 h-4" />
			</a>

			<a
				href="/app?tab=curriculum"
				class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold transition cursor-pointer"
			>
				<Compass class="w-3.5 h-3.5 text-amber-400" />
				<span>Explore 18-Week Curriculum</span>
			</a>
		</div>
	</div>
</div>
