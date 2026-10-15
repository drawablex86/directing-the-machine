<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	let { children }: { children?: Snippet } = $props();

	let themeClass = $derived(`theme-${practiceStore.learnerPreferences.theme}`);
	let fontClass = $derived(`font-mode-${practiceStore.learnerPreferences.fontFamily}`);
	let sizeClass = $derived(`size-${practiceStore.learnerPreferences.fontSize}`);
	let spacingClass = $derived(`spacing-${practiceStore.learnerPreferences.lineSpacing}`);
	let motionClass = $derived(practiceStore.learnerPreferences.reducedMotion ? 'reduce-motion' : '');

	$effect(() => {
		if (typeof document !== 'undefined') {
			const theme = practiceStore.learnerPreferences.theme;
			document.documentElement.classList.remove('theme-dark', 'theme-light');
			document.documentElement.classList.add(`theme-${theme}`);
			document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<title>Directing the Machine — Studio</title>
	<meta name="color-scheme" content={practiceStore.learnerPreferences.theme === 'light' ? 'light' : 'dark'} />
</svelte:head>

<a href="#main-content" class="skip-to-content focus:outline-none">
	Skip to main studio content
</a>

<div class="min-h-screen bg-neutral-950 text-neutral-100 antialiased transition-colors duration-200 {themeClass} {fontClass} {sizeClass} {spacingClass} {motionClass}">
	{@render children?.()}
</div>
