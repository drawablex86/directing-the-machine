<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { lintObservation } from '$lib/engine/adjective-linter';
	import { Eye, AlertTriangle, CheckCircle, Sliders, ArrowRight } from '@lucide/svelte';

	let activeTool = $state<'linter' | 'ladder' | 'canvas' | 'sixQuestions'>('linter');

	// Linter text
	let observationText = $state('');
	let lintResult = $derived(lintObservation(observationText));

	// 6-Question Human Decision Audit
	let apparentIntent = $state('');
	let explicitDecisions = $state('');
	let defaultDecisions = $state('');
	let determiningDecision = $state('');
	let decisionMaker = $state('');
	let nextHumanDecision = $state('');

	// Diagnostic Ladder levels
	const ladderLevels = [
		{ level: 1, name: '1. Purpose / Intent', desc: 'Why does this work exist? Who is it for?' },
		{ level: 2, name: '2. Premise / Claim', desc: 'Is there genuine tension or proposition?' },
		{ level: 3, name: '3. Structure & Composition', desc: 'Massing, focal hierarchy, rhythm, order.' },
		{ level: 4, name: '4. Audience Effect', desc: 'Emotional, cognitive, or physical response.' },
		{ level: 5, name: '5. Construction & Logic', desc: 'Proportion, anatomy, paragraph coherence.' },
		{ level: 6, name: '6. Local Execution', desc: 'Material rendering, sentence clarity.' },
		{ level: 7, name: '7. Surface Polish', desc: 'Texture, finish, decorative flair.' }
	];

	let selectedLevel = $state(3);
	let causingDecision = $state('');
	let proposedTest = $state('');
	let acceptCondition = $state('');

	// Canvas massing state
	let canvasElement: HTMLCanvasElement | null = $state(null);
	let isDrawing = $state(false);
	let color = $state('#f59e0b');

	function startDrawing(e: MouseEvent) {
		if (!canvasElement) return;
		isDrawing = true;
		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;
		ctx.beginPath();
		ctx.moveTo(e.offsetX, e.offsetY);
	}

	function draw(e: MouseEvent) {
		if (!isDrawing || !canvasElement) return;
		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;
		ctx.strokeStyle = color;
		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
	}

	function stopDrawing() {
		isDrawing = false;
	}

	function clearCanvas() {
		if (!canvasElement) return;
		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M2
				</span>
				<h2 class="text-base font-bold text-white">Diagnostic Vision & Observation Studio</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 1, 4, V1, W1: Zero-Adjective Linter, Diagnostic Ladder, and Massing Canvas.
			</p>
		</div>

		<!-- Tool Tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeTool = 'linter'}
				class="px-3 py-1.5 rounded-lg transition {activeTool === 'linter' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Adjective Linter
			</button>
			<button
				type="button"
				onclick={() => activeTool = 'ladder'}
				class="px-3 py-1.5 rounded-lg transition {activeTool === 'ladder' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Diagnostic Ladder
			</button>
			<button
				type="button"
				onclick={() => activeTool = 'sixQuestions'}
				class="px-3 py-1.5 rounded-lg transition {activeTool === 'sixQuestions' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Decision Audit
			</button>
			<button
				type="button"
				onclick={() => activeTool = 'canvas'}
				class="px-3 py-1.5 rounded-lg transition {activeTool === 'canvas' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Massing Canvas
			</button>
		</div>
	</div>

	<!-- TOOL 1: Zero-Adjective Observation Linter -->
	{#if activeTool === 'linter'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Zero-Adjective Observation Constraint (Module 1):</strong>
				Describe what is present without evaluative adjectives (<em>good, bad, beautiful, ugly, impressive, weak, strong, polished, boring</em>).
				This separates perceptual observation from premature judgment.
			</div>

			<div class="space-y-2">
				<label for="obs-lint" class="block text-xs font-medium text-neutral-300">
					Perceptual Description:
				</label>
				<textarea
					id="obs-lint"
					rows="4"
					bind:value={observationText}
					placeholder="Describe spatial masses, edges, values, sentence rhythms, or omissions without judging them..."
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
				></textarea>

				{#if !lintResult.valid}
					<div class="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300 space-y-1">
						<div class="flex items-center gap-2 font-bold text-red-400">
							<AlertTriangle class="w-4 h-4" />
							<span>Evaluative Shortcut Detected: {lintResult.flaggedWords.join(', ')}</span>
						</div>
						<p class="text-[11px] text-red-400/80">
							Replace subjective praise or condemnation with concrete perceptual mechanics (e.g. contrast, proportion, sentence cadence).
						</p>
					</div>
				{:else if observationText.trim()}
					<div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
						<CheckCircle class="w-4 h-4 text-emerald-400 shrink-0" />
						<span>Clean perceptual observation! Zero evaluative shortcuts detected.</span>
					</div>
				{/if}
			</div>
		</div>

	<!-- TOOL 2: Top-Down Diagnostic Ladder -->
	{:else if activeTool === 'ladder'}
		<div class="space-y-4">
			{#if !practiceStore.scaffolding.ladder}
				<div class="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-center gap-2">
					<Sliders class="w-4 h-4 text-amber-400 shrink-0" />
					<span>Scaffolding Removal Active: In Part II+, the explicit Diagnostic Ladder is hidden by default to test internalised diagnostic hierarchy.</span>
				</div>
			{/if}

			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">The Diagnostic Rule (Appendix B):</strong>
				Do not optimize a lower level while a higher level remains unresolved.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Ladder levels selection -->
				<div class="space-y-1.5">
					<div class="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Select Highest Unresolved Level:</div>
					{#each ladderLevels as lvl}
						<button
							type="button"
							onclick={() => selectedLevel = lvl.level}
							class="w-full p-2.5 rounded-xl text-left border transition flex items-center justify-between {selectedLevel === lvl.level ? 'bg-neutral-950 border-amber-500 text-neutral-100' : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'}"
						>
							<div>
								<div class="text-xs font-semibold">{lvl.name}</div>
								<div class="text-[10px] text-neutral-500">{lvl.desc}</div>
							</div>
							{#if selectedLevel === lvl.level}
								<span class="text-xs text-amber-400 font-bold">Selected</span>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Formulate Diagnostic Sentence -->
				<div class="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
					<h3 class="font-bold text-neutral-200">Canonical Diagnostic Sentence</h3>

					<div>
						<label for="cause-dec" class="block text-neutral-400 mb-1">Decision causing the problem:</label>
						<input
							id="cause-dec"
							type="text"
							bind:value={causingDecision}
							placeholder="e.g. Centered figure with equal negative space on all sides."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
						/>
					</div>

					<div>
						<label for="prop-test" class="block text-neutral-400 mb-1">Smallest meaningful test:</label>
						<input
							id="prop-test"
							type="text"
							bind:value={proposedTest}
							placeholder="e.g. Shift mass to upper-left third and compress right negative space."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
						/>
					</div>

					<div>
						<label for="accept-cond" class="block text-neutral-400 mb-1">Acceptance condition:</label>
						<input
							id="accept-cond"
							type="text"
							bind:value={acceptCondition}
							placeholder="e.g. The eye enters at the focal point and stays for 2s."
							class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
						/>
					</div>

					{#if causingDecision && proposedTest}
						<div class="mt-3 p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-300 italic">
							"The highest unresolved level is <strong>{ladderLevels.find(l => l.level === selectedLevel)?.name}</strong>.
							The decision causing the problem is <strong>{causingDecision}</strong>.
							I would test <strong>{proposedTest}</strong> next.
							I would accept if <strong>{acceptCondition || '...'}</strong>."
						</div>
					{/if}
				</div>
			</div>
		</div>

	<!-- TOOL 3: 6-Question Human Decision Audit -->
	{:else if activeTool === 'sixQuestions'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Finding the Human Decision (Module 1):</strong>
				Examine any generated or drafted work. Separate explicit choices from default model inheritance.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
				<div>
					<label for="q1" class="block text-neutral-300 font-medium mb-1">1. What is it apparently trying to do?</label>
					<input id="q1" type="text" bind:value={apparentIntent} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q2" class="block text-neutral-300 font-medium mb-1">2. Which decisions are explicit?</label>
					<input id="q2" type="text" bind:value={explicitDecisions} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q3" class="block text-neutral-300 font-medium mb-1">3. Which decisions appear to be defaults?</label>
					<input id="q3" type="text" bind:value={defaultDecisions} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q4" class="block text-neutral-300 font-medium mb-1">4. Which decision determines success?</label>
					<input id="q4" type="text" bind:value={determiningDecision} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q5" class="block text-neutral-300 font-medium mb-1">5. Who or what made that decision?</label>
					<input id="q5" type="text" bind:value={decisionMaker} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
				<div>
					<label for="q6" class="block text-neutral-300 font-medium mb-1">6. What must the human director decide next?</label>
					<input id="q6" type="text" bind:value={nextHumanDecision} class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100" />
				</div>
			</div>
		</div>

	<!-- TOOL 4: Massing Canvas (Module V1) -->
	{:else if activeTool === 'canvas'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">5-Second Thumbnail Flash & Massing Overlay (V1):</strong>
				Isolate 3–5 major shapes, focal paths, and directional axes. Thumbnails are decisions about where the major masses sit, not finished drawings.
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-xs text-neutral-400">Palette:</span>
					{#each ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#ffffff'] as c}
						<button
							type="button"
							onclick={() => color = c}
							class="w-5 h-5 rounded-full border border-neutral-700 transition {color === c ? 'scale-125 border-white' : ''}"
							style="background-color: {c}"
							aria-label="Color {c}"
						></button>
					{/each}
				</div>
				<button
					type="button"
					onclick={clearCanvas}
					class="px-3 py-1 rounded-lg text-xs bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
				>
					Clear Canvas
				</button>
			</div>

			<div class="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950 flex justify-center">
				<canvas
					bind:this={canvasElement}
					width="600"
					height="320"
					onmousedown={startDrawing}
					onmousemove={draw}
					onmouseup={stopDrawing}
					onmouseleave={stopDrawing}
					class="cursor-crosshair w-full max-w-[600px] h-[320px] bg-neutral-950"
				></canvas>
			</div>
		</div>
	{/if}
</div>
