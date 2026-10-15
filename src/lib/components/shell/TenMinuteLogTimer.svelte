<script lang="ts">
	import { Timer, AlertCircle, Play, Pause, RotateCcw } from '@lucide/svelte';

	let { onTimeExpired }: { onTimeExpired?: () => void } = $props();

	let timeLeftSeconds = $state(600); // 10 minutes default
	let isRunning = $state(false);
	let hasExpired = $state(false);

	let minutes = $derived(Math.floor(timeLeftSeconds / 60));
	let seconds = $derived(timeLeftSeconds % 60);

	let timerInterval: any = null;

	function toggleTimer() {
		if (isRunning) {
			clearInterval(timerInterval);
			isRunning = false;
		} else {
			isRunning = true;
			timerInterval = setInterval(() => {
				if (timeLeftSeconds > 0) {
					timeLeftSeconds -= 1;
				} else {
					clearInterval(timerInterval);
					isRunning = false;
					hasExpired = true;
					onTimeExpired?.();
				}
			}, 1000);
		}
	}

	function resetTimer() {
		clearInterval(timerInterval);
		isRunning = false;
		hasExpired = false;
		timeLeftSeconds = 600;
	}
</script>

<div class="flex items-center gap-2 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
	<div class="flex items-center gap-1.5 font-mono font-medium {timeLeftSeconds < 120 ? 'text-amber-400' : 'text-neutral-300'}">
		<Timer class="w-4 h-4 text-neutral-400" />
		<span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
	</div>

	<div class="flex items-center gap-1">
		<button
			type="button"
			onclick={toggleTimer}
			class="p-1 rounded hover:bg-neutral-800 text-neutral-300 transition"
			title={isRunning ? 'Pause' : 'Start 10m log timer'}
		>
			{#if isRunning}
				<Pause class="w-3.5 h-3.5" />
			{:else}
				<Play class="w-3.5 h-3.5" />
			{/if}
		</button>
		<button
			type="button"
			onclick={resetTimer}
			class="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition"
			title="Reset"
		>
			<RotateCcw class="w-3 h-3" />
		</button>
	</div>

	{#if hasExpired}
		<span class="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-bold ml-1 flex items-center gap-1 text-[11px]">
			<AlertCircle class="w-3.5 h-3.5" />
			10m Hard Cap Reached!
		</span>
	{:else}
		<span class="text-neutral-500 text-[11px] hidden sm:inline ml-1">
			(Hard 10m cap to prevent logging theatre)
		</span>
	{/if}
</div>

{#if hasExpired}
	<aside aria-label="Logging time limit alert" class="fixed bottom-6 right-6 max-w-sm p-4 rounded-2xl bg-neutral-900/95 border-2 border-red-500 shadow-2xl z-50 backdrop-blur-md">
		<div class="flex items-start gap-3">
			<AlertCircle class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
			<div class="space-y-1 text-xs">
				<div class="font-bold text-red-300 text-sm">10-Minute Log Cap Reached</div>
				<p class="text-neutral-300 leading-relaxed">
					The document is not the practice. Stop documenting and return to making.
				</p>
				<div class="pt-1 flex items-center justify-between">
					<a
						href="/app"
						class="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[11px] transition inline-block"
					>
						Return to Studio →
					</a>
					<button
						type="button"
						onclick={resetTimer}
						class="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
					>
						Dismiss
					</button>
				</div>
			</div>
		</div>
	</aside>
{/if}
