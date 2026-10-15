<script lang="ts">
	import { FORBIDDEN_EVALUATIVE_ADJECTIVES } from '$lib/engine/adjective-linter';
	import { ShieldAlert, Sparkles, CheckCircle2, ArrowRight, RotateCcw, AlertTriangle, Eye } from '@lucide/svelte';

	// Extended list including prompt-bro clichés mentioned in the course
	const PROMPT_CLICHE_ADJECTIVES = [
		...FORBIDDEN_EVALUATIVE_ADJECTIVES,
		'cinematic',
		'breathtaking',
		'hyper-realistic',
		'photorealistic',
		'visceral',
		'evocative',
		'punchy',
		'vibrant',
		'epic',
		'award-winning',
		'dramatic'
	];

	interface SamplePrompt {
		label: string;
		type: 'amateur' | 'mixed' | 'master';
		text: string;
		description: string;
	}

	const samples: SamplePrompt[] = [
		{
			label: 'Amateur Prompt (Adjective Overload)',
			type: 'amateur',
			text: 'Generate a stunning and cinematic architectural photo of a gorgeous brutalist concrete pavilion with dramatic moody lighting, hyper-realistic textures, award-winning composition, and a breathtaking aesthetic.',
			description: 'Dozens of emotive adjectives that trigger model statistical medians, yielding generic glossy stock visuals.'
		},
		{
			label: 'Mixed Draft (Unconscious Bias)',
			type: 'mixed',
			text: 'A modern concrete structure with sleek massing and impressive shadow depth. The lighting should feel amazing and not boring or generic.',
			description: 'Touches on massing, but leans on evaluative shortcuts ("sleek", "impressive", "amazing", "boring", "generic").'
		},
		{
			label: 'Director Brief (Structural Intent)',
			type: 'master',
			text: 'Low eye-level orthographic perspective of 45-degree board-formed concrete massing. Single directional tungsten light source at 15-degree elevation. Deep shadow falloff on lower third. Negative constraint: no lens flare, no volumetric fog, no synthetic gloss.',
			description: 'Zero evaluative adjectives. Every term specifies geometry, light elevation in degrees, spatial thirds, or explicit exclusions.'
		}
	];

	let userText = $state<string>(samples[0].text);

	let lintResults = $derived.by(() => {
		if (!userText.trim()) {
			return { flagged: [], density: 0, clean: true, wordsCount: 0 };
		}

		const words = userText.trim().split(/\s+/);
		const flaggedSet = new Set<string>();
		const regex = new RegExp(`\\b(${PROMPT_CLICHE_ADJECTIVES.join('|')})\\b`, 'gi');

		let match: RegExpExecArray | null;
		while ((match = regex.exec(userText)) !== null) {
			flaggedSet.add(match[0].toLowerCase());
		}

		const flagged = Array.from(flaggedSet);
		const density = Math.min(100, Math.round((flagged.length / Math.max(1, words.length)) * 100));

		return {
			flagged,
			density,
			clean: flagged.length === 0,
			wordsCount: words.length
		};
	});

	function applySample(s: SamplePrompt) {
		userText = s.text;
	}

	function resetToSample() {
		userText = samples[2].text;
	}
</script>

<section id="linter" class="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80">
	<!-- Section Header -->
	<div class="space-y-4 mb-12 text-center sm:text-left">
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono uppercase tracking-widest font-semibold">
			<Eye class="w-3.5 h-3.5 text-amber-500" />
			<span>Interactive Studio Tool Preview</span>
		</div>
		<h2 class="text-2xl sm:text-4xl font-serif font-bold text-neutral-100 tracking-tight">
			Try the Zero-Adjective Discipline Live
		</h2>
		<p class="text-neutral-400 max-w-3xl text-sm sm:text-base leading-relaxed">
			When you ask an AI model for “beauty” or “cinematic drama,” you surrender control to training medians. True direction describes geometry, elevation, massing, and negative exclusions. Test any brief below.
		</p>
	</div>

	<!-- Interactive Linter Workbench -->
	<div class="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/90 shadow-2xl space-y-6">
		<!-- Preset Switchers -->
		<div class="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-neutral-800">
			<span class="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">
				Load Example Brief:
			</span>

			<div class="flex items-center gap-2 flex-wrap">
				{#each samples as s}
					<button
						type="button"
						onclick={() => applySample(s)}
						class="px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer border {userText === s.text ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold' : 'bg-neutral-950/70 text-neutral-400 hover:text-white border-neutral-800'}"
					>
						{s.label.split(' ')[0]}
					</button>
				{/each}
			</div>
		</div>

		<!-- Input Area -->
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs font-mono text-neutral-400">
				<span>Type or paste your own prompt / brief:</span>
				<span>{lintResults.wordsCount} words</span>
			</div>

			<textarea
				bind:value={userText}
				rows="4"
				placeholder="Type a creative prompt or instruction here..."
				class="w-full p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono text-xs sm:text-sm leading-relaxed resize-y transition"
			></textarea>
		</div>

		<!-- Real-time Diagnostic Meter -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
			<!-- Metric 1: Clean Status -->
			<div class="p-4 rounded-2xl bg-neutral-950 border {lintResults.clean ? 'border-emerald-500/50 text-emerald-400' : 'border-rose-500/50 text-rose-400'} flex items-center gap-3">
				{#if lintResults.clean}
					<CheckCircle2 class="w-6 h-6 shrink-0" />
					<div>
						<div class="text-xs font-mono uppercase tracking-wider font-bold">Zero-Adjective Certified</div>
						<div class="text-[11px] text-neutral-400 font-sans mt-0.5">Structural & geometric intent</div>
					</div>
				{:else}
					<AlertTriangle class="w-6 h-6 shrink-0" />
					<div>
						<div class="text-xs font-mono uppercase tracking-wider font-bold">Adjective Bias Detected</div>
						<div class="text-[11px] text-neutral-400 font-sans mt-0.5">{lintResults.flagged.length} evaluative shortcut{lintResults.flagged.length === 1 ? '' : 's'}</div>
					</div>
				{/if}
			</div>

			<!-- Metric 2: Adjective Density -->
			<div class="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1.5">
				<div class="flex items-center justify-between text-xs font-mono">
					<span class="text-neutral-400 uppercase tracking-wider">Adjective Density</span>
					<span class="font-bold {lintResults.density > 0 ? 'text-amber-400' : 'text-emerald-400'}">{lintResults.density}%</span>
				</div>
				<div class="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
					<div
						class="h-full transition-all duration-300 {lintResults.density > 0 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-emerald-500'}"
						style="width: {lintResults.density}%"
					></div>
				</div>
				<div class="text-[10px] text-neutral-500 font-mono text-right">0% = Pure Structure</div>
			</div>

			<!-- Metric 3: Flagged Words Pills -->
			<div class="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between">
				<div class="text-xs font-mono uppercase text-neutral-400 tracking-wider">
					Flagged Shortcuts:
				</div>
				<div class="flex items-center gap-1.5 flex-wrap mt-1">
					{#if lintResults.flagged.length === 0}
						<span class="text-xs font-mono text-emerald-400">None! Pure structural direction.</span>
					{:else}
						{#each lintResults.flagged as word}
							<span class="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-mono">
								{word}
							</span>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Explanatory Insight Box -->
		<div class="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-start gap-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
			<Sparkles class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
			<div>
				{#if lintResults.clean}
					<strong class="text-emerald-400 font-sans font-bold">Why this works: </strong>
					By stripping vague adjectives, you force the machine to act on concrete parameters (orthographic projection, tungsten light elevation in degrees, spatial third weighting). The resulting work carries authorial distinction instead of statistical cliché.
				{:else}
					<strong class="text-amber-400 font-sans font-bold">How to rewrite: </strong>
					Replace emotive adjectives with explicit spatial constraints, material textures, camera angles, color temperatures, or negative exclusions. Don't ask for "breathtaking lighting"; specify "single 15° directional tungsten key with 80% shadow falloff".
				{/if}
			</div>
		</div>

		<!-- Footer Link to Studio -->
		<div class="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-neutral-800/80">
			<span class="text-xs text-neutral-500 font-mono">
				This engine is built natively into Lab M2 (Diagnostic Vision) and Lab M3 (Premise Forge).
			</span>
			<a
				href="/app?lab=m2"
				class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
			>
				<span>Open Full Diagnostic Lab in Studio</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</a>
		</div>
	</div>
</section>
