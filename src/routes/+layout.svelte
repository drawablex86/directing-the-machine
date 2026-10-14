<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<title>Directing the Machine — Studio</title>
</svelte:head>

<div class="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">
	{@render children?.()}
</div>
