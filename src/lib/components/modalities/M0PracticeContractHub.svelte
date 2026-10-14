<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import type { IntensityPath } from '$lib/schemas/course.schema';
	import { Target, Shield, Clock, Award, CheckCircle, CheckCircle2, RotateCcw, Sparkles, Eye } from '@lucide/svelte';

	let activeSubTab = $state<'baseline' | 'intensity' | 'play' | 'attention'>('baseline');

	// Intensity options from Appendix O
	const paths: { id: IntensityPath; title: string; hours: string; weeks: string; desc: string }[] = [
		{ id: 'full-time-12w', title: 'Full-Time Intensive', hours: '18–25h/w (up to 35h)', weeks: '12 Weeks', desc: 'Accelerated immersion. Requires dedicated study without full-time employment.' },
		{ id: 'extended-24w', title: 'Extended Intensive', hours: '12–18h/w', weeks: '24 Weeks', desc: 'Balanced pacing for practitioners balancing part-time work or commitments.' },
		{ id: 'distributed-48w', title: 'Distributed Practice', hours: '6–10h/w', weeks: '48 Weeks', desc: 'Sustainable year-long mastery for practitioners with full-time careers.' },
		{ id: 'maintenance-4h', title: 'Maintenance Mode', hours: '~4h/w', weeks: 'Flexible', desc: 'Preserves reliable capacity when life or client work peaks. Pauses mastery gates.' }
	];

	// Non-instrumental & play inputs
	let playText = $state('');
	let attentionText = $state('');
	let playLogged = $state(false);
	let attentionLogged = $state(false);

	function logPlay() {
		if (!playText.trim()) return;
		practiceStore.playLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: playText.trim()
		});
		practiceStore.saveToStorage();
		playText = '';
		playLogged = true;
		setTimeout(() => playLogged = false, 2000);
	}

	function logAttention() {
		if (!attentionText.trim()) return;
		practiceStore.nonInstrumentalLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: attentionText.trim()
		});
		practiceStore.saveToStorage();
		attentionText = '';
		attentionLogged = true;
		setTimeout(() => attentionLogged = false, 2000);
	}
</script>

<div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
					M0
				</span>
				<h2 class="text-base font-bold text-white">Deliberate Practice, Play & Contract Studio</h2>
			</div>
			<p class="text-xs text-neutral-400 mt-1">
				Module 0, Week 0 Baseline Diagnostic, Appendix I, and Appendix O Pacing.
			</p>
		</div>

		<!-- Sub-tabs -->
		<div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
			<button
				type="button"
				onclick={() => activeSubTab = 'baseline'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'baseline' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Baseline (1–4)
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'intensity'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'intensity' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Intensity Path
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'play'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'play' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Play Practice
			</button>
			<button
				type="button"
				onclick={() => activeSubTab = 'attention'}
				class="px-3 py-1.5 rounded-lg transition {activeSubTab === 'attention' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'}"
			>
				Attention
			</button>
		</div>
	</div>

	<!-- TAB 1: Baseline Diagnostic Radar (12 competencies) -->
	{#if activeSubTab === 'baseline'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400">
				<strong class="text-neutral-200">The Baseline Diagnostic (Week 0):</strong> The baseline is not an exam; it is a diagnostic map. Score yourself honestly on the 1–4 scale: <span class="text-amber-400 font-semibold">1 (Not Yet)</span>, <span class="text-neutral-300">2 (Emerging)</span>, <span class="text-neutral-200">3 (Functional)</span>, <span class="text-emerald-400">4 (Transferable)</span>.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
				{#each practiceStore.baseline as item, idx}
					<div class="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
						<div class="flex items-center justify-between">
							<span class="font-bold text-xs text-neutral-200">{item.name}</span>
							<div class="flex items-center gap-1">
								{#each [1, 2, 3, 4] as scoreVal}
									<button
										type="button"
										onclick={() => { item.score = scoreVal; practiceStore.saveToStorage(); }}
										class="w-6 h-6 rounded-md text-xs font-mono font-bold transition {item.score === scoreVal ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'}"
									>
										{scoreVal}
									</button>
								{/each}
							</div>
						</div>
						<div class="text-[11px] text-neutral-400">
							{item.exercise}
						</div>
						<input
							type="text"
							bind:value={item.notes}
							onblur={() => practiceStore.saveToStorage()}
							placeholder="Diagnostic notes on gap..."
							class="w-full bg-neutral-900 border border-neutral-800/80 rounded-lg px-2.5 py-1 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
						/>
					</div>
				{/each}
			</div>
		</div>

	<!-- TAB 2: Intensity Path Selector (Appendix O) -->
	{:else if activeSubTab === 'intensity'}
		<div class="space-y-4">
			<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
				<strong class="text-neutral-200">Adaptive Pacing (Appendix O):</strong> Burnout is not a character flaw; it is an intensity mismatch. Choose an intensity compatible with your work and life. You can switch at any time without resetting progress.
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each paths as path}
					<button
						type="button"
						onclick={() => { practiceStore.intensityPath = path.id; practiceStore.saveToStorage(); }}
						class="p-4 rounded-xl text-left border transition relative flex flex-col justify-between {practiceStore.intensityPath === path.id ? 'bg-neutral-950 border-amber-500 shadow-lg' : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700'}"
					>
						{#if practiceStore.intensityPath === path.id}
							<div class="absolute top-3 right-3 text-amber-400">
								<CheckCircle2 class="w-4 h-4" />
							</div>
						{/if}
						<div>
							<h3 class="font-bold text-sm text-neutral-100">{path.title}</h3>
							<div class="flex items-center gap-2 mt-1 text-xs font-mono text-amber-400">
								<span>{path.hours}</span>
								<span>•</span>
								<span>{path.weeks}</span>
							</div>
							<p class="text-xs text-neutral-400 mt-2 leading-relaxed">
								{path.desc}
							</p>
						</div>
						<div class="mt-4 pt-3 border-t border-neutral-800/80 text-[11px] font-medium {practiceStore.intensityPath === path.id ? 'text-amber-400' : 'text-neutral-500'}">
							{practiceStore.intensityPath === path.id ? 'Active Intensity Mode' : 'Select Mode'}
						</div>
					</button>
				{/each}
			</div>
		</div>

	<!-- TAB 3: Protected Play Practice -->
	{:else if activeSubTab === 'play'}
		<div class="space-y-4">
			<div class="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-2">
				<div class="flex items-center gap-2 text-amber-400 font-semibold">
					<Sparkles class="w-4 h-4" />
					<span>Play Practice: Unstructured Making for Its Own Sake</span>
				</div>
				<p class="leading-relaxed">
					Play has: <strong>no brief, no deliverable, no diagnosis, no criteria, and no audience</strong>. It prevents structural rigidity.
					After play, log exactly one sentence: <em>What did I enjoy?</em> No analysis allowed.
				</p>
			</div>

			<div class="space-y-2">
				<label for="play-enjoy" class="block text-xs font-medium text-neutral-300">
					What did I enjoy? (Single 140-char unanalyzed line)
				</label>
				<div class="flex gap-2">
					<input
						id="play-enjoy"
						type="text"
						maxlength="140"
						bind:value={playText}
						placeholder="e.g. Drawing fast ink shapes without checking proportion or intent."
						class="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
					<button
						type="button"
						onclick={logPlay}
						disabled={!playText.trim()}
						class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition"
					>
						Record Play
					</button>
				</div>
				{#if playLogged}
					<span class="text-xs text-emerald-400">Recorded to Play log!</span>
				{/if}
			</div>

			<!-- Recent Play log -->
			{#if practiceStore.playLines.length > 0}
				<div class="mt-4 space-y-2">
					<h4 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Play History ({practiceStore.playLines.length})</h4>
					<div class="space-y-1.5 max-h-48 overflow-y-auto">
						{#each practiceStore.playLines as entry}
							<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs flex items-center justify-between gap-3">
								<span class="text-neutral-200 italic">"{entry.line}"</span>
								<span class="text-[10px] font-mono text-neutral-500 shrink-0">{entry.date}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- TAB 4: Non-Instrumental Attention -->
	{:else if activeSubTab === 'attention'}
		<div class="space-y-4">
			<div class="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-2">
				<div class="flex items-center gap-2 text-amber-400 font-semibold">
					<Eye class="w-4 h-4" />
					<span>Non-Instrumental Attention (Module 3)</span>
				</div>
				<p class="leading-relaxed">
					Observation with no output requirement. If every perception is immediately converted into a project, you lose access to the material you could not search for.
					Log one sentence: <em>What did I encounter that I was not looking for?</em>
				</p>
			</div>

			<div class="space-y-2">
				<label for="attention-line" class="block text-xs font-medium text-neutral-300">
					What did I encounter that I was not looking for? (Single line)
				</label>
				<div class="flex gap-2">
					<input
						id="attention-line"
						type="text"
						maxlength="140"
						bind:value={attentionText}
						placeholder="e.g. The sound of water dripping inside an electrical conduit at dusk."
						class="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
					/>
					<button
						type="button"
						onclick={logAttention}
						disabled={!attentionText.trim()}
						class="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition"
					>
						Record Attention
					</button>
				</div>
				{#if attentionLogged}
					<span class="text-xs text-emerald-400">Recorded to Attention log!</span>
				{/if}
			</div>

			<!-- Recent Attention log -->
			{#if practiceStore.nonInstrumentalLines.length > 0}
				<div class="mt-4 space-y-2">
					<h4 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Attention Entries ({practiceStore.nonInstrumentalLines.length})</h4>
					<div class="space-y-1.5 max-h-48 overflow-y-auto">
						{#each practiceStore.nonInstrumentalLines as entry}
							<div class="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs flex items-center justify-between gap-3">
								<span class="text-neutral-200">"{entry.line}"</span>
								<span class="text-[10px] font-mono text-neutral-500 shrink-0">{entry.date}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
