<script lang="ts">
	import { ArrowLeft, ArrowRight, Palette, Compass, Sun, Moon, Coffee, Shield } from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	interface Props {
		title: string;
	}

	let { title }: Props = $props();

	let scrollProgress = $state(0);

	function updateScroll() {
		if (typeof window === 'undefined') return;
		const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
		const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		scrollProgress = height > 0 ? (winScroll / height) * 100 : 0;
	}

	function cycleTheme() {
		const current = practiceStore.learnerPreferences.theme;
		const order: Array<typeof current> = ['dark', 'light', 'sepia', 'midnight', 'high-contrast'];
		const nextIndex = (order.indexOf(current) + 1) % order.length;
		practiceStore.learnerPreferences.theme = order[nextIndex];
		practiceStore.saveToStorage();
	}
</script>

<svelte:window onscroll={updateScroll} />

<header class="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition">
	<!-- Top Thin Reading Progress Bar -->
	<div
		class="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-75"
		style="width: {scrollProgress}%;"
	></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
		<!-- Left: Back to Field Essays -->
		<div class="flex items-center gap-3">
			<a
				href="/blog"
				class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition"
			>
				<ArrowLeft class="w-3.5 h-3.5" />
				<span class="hidden sm:inline">All Field Essays</span>
				<span class="sm:hidden">Essays</span>
			</a>

			<div class="hidden lg:block h-4 w-px bg-neutral-800"></div>

			<span class="hidden lg:inline text-xs font-serif text-neutral-400 truncate max-w-md">
				{title}
			</span>
		</div>

		<!-- Right: Controls & Studio Launch -->
		<div class="flex items-center gap-2.5">
			<!-- Theme Quick Switcher -->
			<button
				type="button"
				onclick={cycleTheme}
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer"
				aria-label="Cycle visual palette"
				title="Cycle Color Palette: {practiceStore.learnerPreferences.theme.toUpperCase()}"
			>
				<Palette class="w-3.5 h-3.5 text-amber-400" />
				<span class="capitalize hidden sm:inline">{practiceStore.learnerPreferences.theme}</span>
			</button>

			<a
				href="/app"
				class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/10 transition cursor-pointer"
			>
				<span>Open Studio</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</a>
		</div>
	</div>
</header>
