<script lang="ts">
	import { X, PauseCircle, CheckCircle, Ban, ArrowRight } from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

	let tab = $state<'stop' | 'done' | 'abandon'>('stop');
	let tomorrowAction = $state('');
	let abandonReason = $state('');
	let feedbackMessage = $state('');

	function recordHemingwayStop() {
		if (!tomorrowAction.trim()) return;
		practiceStore.decisions.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			project: 'Daily Session',
			decision: `Hemingway Stop: Stopped while next step was known. Tomorrow's 5-minute action: ${tomorrowAction}`,
			highestUnresolvedLevel: 'Session Discipline',
			alternativesRejected: 'Pushed through fatigue / endless wandering revision',
			justification: 'Hemingway rule: stop while you still know what happens next so you have a place to begin.',
			feedbackIncorporated: 'Self-regulation',
			refusals: 'Refused to work past mental clarity'
		});
		practiceStore.saveToStorage();
		feedbackMessage = 'Session successfully closed! See you tomorrow.';
		setTimeout(() => {
			feedbackMessage = '';
			tomorrowAction = '';
			onClose();
		}, 1500);
	}

	function recordAbandonment() {
		if (!abandonReason.trim()) return;
		practiceStore.decisions.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			project: 'Current Project',
			decision: `Principled Abandonment: ${abandonReason}`,
			highestUnresolvedLevel: 'Premise / Problem Selection',
			alternativesRejected: 'Sunken cost completion / forcing an ungenerative project',
			justification: 'The premise no longer holds attention or was not worth pursuing. Abandonment is an authored decision, not failure.',
			feedbackIncorporated: 'Diagnostic truth',
			refusals: 'Refused to continue making only because it was started'
		});
		practiceStore.saveToStorage();
		feedbackMessage = 'Principled abandonment recorded as an active decision.';
		setTimeout(() => {
			feedbackMessage = '';
			abandonReason = '';
			onClose();
		}, 1500);
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
		role="dialog"
		tabindex="-1"
		onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
	>
		<div class="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
			<!-- Header -->
			<div class="p-4 border-b border-neutral-800 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
						<PauseCircle class="w-5 h-5" />
					</div>
					<div>
						<h2 class="font-bold text-sm text-neutral-100">When to Stop, Finish, or Abandon</h2>
						<p class="text-xs text-neutral-400">Section "When to Stop" protocols</p>
					</div>
				</div>
				<button
					type="button"
					onclick={onClose}
					class="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Tab buttons -->
			<div class="grid grid-cols-3 gap-1 p-2 bg-neutral-950 border-b border-neutral-800">
				<button
					type="button"
					onclick={() => tab = 'stop'}
					class="py-1.5 text-xs font-medium rounded-lg transition {tab === 'stop' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					Stop for the Day
				</button>
				<button
					type="button"
					onclick={() => tab = 'done'}
					class="py-1.5 text-xs font-medium rounded-lg transition {tab === 'done' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					Declare Work Done
				</button>
				<button
					type="button"
					onclick={() => tab = 'abandon'}
					class="py-1.5 text-xs font-medium rounded-lg transition {tab === 'abandon' ? 'bg-neutral-800 text-red-400' : 'text-neutral-400 hover:text-neutral-200'}"
				>
					Abandon Project
				</button>
			</div>

			<!-- Tab contents -->
			<div class="p-5 space-y-4">
				{#if feedbackMessage}
					<div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
						<CheckCircle class="w-4 h-4 shrink-0 text-emerald-400" />
						<span>{feedbackMessage}</span>
					</div>
				{:else if tab === 'stop'}
					<div class="space-y-3">
						<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
							<strong class="text-neutral-200">The Hemingway Rule:</strong> Stop while you still know what happens next. Do not stop when you are lost; stop when the next step is crystal clear.
						</div>
						<div>
							<label for="tomorrow-action" class="block text-xs font-medium text-neutral-300 mb-1.5">
								Tomorrow's First 5-Minute Action:
							</label>
							<input
								id="tomorrow-action"
								type="text"
								bind:value={tomorrowAction}
								placeholder="e.g. Draw 3 value variations of the left doorway"
								class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
							/>
						</div>
						<button
							type="button"
							onclick={recordHemingwayStop}
							disabled={!tomorrowAction.trim()}
							class="w-full py-2.5 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold transition flex items-center justify-center gap-2"
						>
							<span>Commit Stop & Close Studio</span>
							<ArrowRight class="w-3.5 h-3.5" />
						</button>
					</div>
				{:else if tab === 'done'}
					<div class="space-y-3 text-xs text-neutral-300">
						<p class="text-neutral-400 leading-relaxed">
							A work is done when:
						</p>
						<ul class="space-y-1.5 list-disc list-inside text-neutral-400">
							<li>It satisfies its acceptance criteria.</li>
							<li>Further revision would not meaningfully improve it.</li>
							<li>You can defend it without explaining what it was <em>trying</em> to do.</li>
							<li>You can look at it without wanting to fix surface polish.</li>
						</ul>
						<div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400">
							Verify criteria in your brief and tag the version as <code class="text-amber-400 font-mono text-[11px]">_approved_final</code>.
						</div>
					</div>
				{:else if tab === 'abandon'}
					<div class="space-y-3">
						<div class="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
							<strong class="text-neutral-200">Abandonment is not failure:</strong> Some of the best work comes from abandoning the wrong project early. It is an active decision.
						</div>
						<div>
							<label for="abandon-reason" class="block text-xs font-medium text-neutral-300 mb-1.5">
								Why is this project being abandoned?
							</label>
							<select
								id="abandon-reason"
								bind:value={abandonReason}
								class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
							>
								<option value="">Select reason...</option>
								<option value="Premise no longer holds genuine attention">Premise no longer holds genuine attention</option>
								<option value="Problem was not worth pursuing upon reflection">Problem was not worth pursuing upon reflection</option>
								<option value="Re-briefed twice with no structural resolution">Re-briefed twice with no structural resolution</option>
								<option value="Work is not teaching anything new">Work is not teaching anything new</option>
								<option value="Realized I was making it only because I started it">Realized I was making it only because I started it</option>
							</select>
						</div>
						<button
							type="button"
							onclick={recordAbandonment}
							disabled={!abandonReason}
							class="w-full py-2.5 rounded-xl text-xs bg-red-950/80 hover:bg-red-900 border border-red-800/60 disabled:opacity-50 text-red-200 font-bold transition"
						>
							Record Principled Abandonment
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
