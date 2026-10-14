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
		<span class="text-amber-400 font-medium ml-1 flex items-center gap-1">
			<AlertCircle class="w-3.5 h-3.5" />
			Time cap reached! The document is not the practice. Go make something.
		</span>
	{:else}
		<span class="text-neutral-500 text-[11px] hidden sm:inline ml-1">
			(Hard 10m cap to prevent logging theatre)
		</span>
	{/if}
</div>
