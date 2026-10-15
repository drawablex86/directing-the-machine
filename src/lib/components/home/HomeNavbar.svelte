<script lang="ts">
	import { ArrowRight, Compass, Sparkles, BookOpen, Terminal, Palette, Sun, Moon, Coffee, Shield, Menu, X, Eye } from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	let mobileMenuOpen = $state(false);

	const themes = [
		{ id: 'dark', label: 'Obsidian', icon: Moon },
		{ id: 'light', label: 'Light', icon: Sun },
		{ id: 'sepia', label: 'Sepia', icon: Coffee },
		{ id: 'midnight', label: 'Midnight', icon: Compass },
		{ id: 'high-contrast', label: 'AAA', icon: Shield }
	] as const;

	function cycleTheme() {
		const current = practiceStore.learnerPreferences.theme;
		const order: Array<typeof current> = ['dark', 'light', 'sepia', 'midnight', 'high-contrast'];
		const nextIndex = (order.indexOf(current) + 1) % order.length;
		practiceStore.learnerPreferences.theme = order[nextIndex];
		practiceStore.saveToStorage();
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header class="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 transition">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
		<!-- Brand & Ogilvy Monogram -->
		<a href="/" class="flex items-center gap-3 group">
			<div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-serif font-black text-amber-500 group-hover:border-amber-500/50 transition">
				D
			</div>
			<div class="flex flex-col">
				<span class="font-serif font-bold text-sm tracking-tight text-white group-hover:text-amber-400 transition">
					Directing the Machine
				</span>
				<span class="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
					Creative Authorship in the AI Era
				</span>
			</div>
		</a>

		<!-- Navigation Links -->
		<nav class="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-300">
			<a href="/blog" class="text-amber-400 font-semibold transition hover:text-amber-300 flex items-center gap-1.5">
				<BookOpen class="w-3.5 h-3.5" />
				<span>Field Essays</span>
			</a>
			<a href="/#contrast" class="hover:text-amber-400 transition">Prompt vs. Direct</a>
			<a href="/#linter" class="hover:text-amber-400 transition">Live Linter</a>
			<a href="/#theses" class="hover:text-amber-400 transition">The 5 Theses</a>
			<a href="/#studios" class="hover:text-amber-400 transition">8 Studios</a>
			<a href="/#syllabus" class="hover:text-amber-400 transition">Syllabus & Projects</a>
			<a href="/#diagnostic" class="hover:text-amber-400 transition">Diagnostic Test</a>
			<a href="/#faq" class="hover:text-amber-400 transition">FAQ</a>
		</nav>

		<!-- Right Side CTAs -->
		<div class="flex items-center gap-2.5">
			<!-- Accessible Theme Quick Switcher Pill -->
			<button
				type="button"
				onclick={cycleTheme}
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer"
				aria-label="Cycle visual colorway palette (currently {practiceStore.learnerPreferences.theme})"
				title="Cycle Color Palette: {practiceStore.learnerPreferences.theme.toUpperCase()}"
			>
				<Palette class="w-3.5 h-3.5 text-amber-400" />
				<span class="capitalize hidden sm:inline">{practiceStore.learnerPreferences.theme}</span>
			</button>

			<a
				href="/logs"
				class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition"
			>
				<Terminal class="w-3.5 h-3.5" />
				<span>Logbook</span>
			</a>

			<a
				href="/app?tab=today"
				class="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 transition cursor-pointer"
			>
				<span>Studio App</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</a>

			<!-- Mobile menu toggle -->
			<button
				type="button"
				onclick={() => { mobileMenuOpen = !mobileMenuOpen; }}
				class="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition"
				aria-label="Toggle navigation menu"
			>
				{#if mobileMenuOpen}
					<X class="w-4 h-4 text-amber-400" />
				{:else}
					<Menu class="w-4 h-4" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Drawer -->
	{#if mobileMenuOpen}
		<div class="lg:hidden px-4 pt-3 pb-6 border-t border-neutral-800 bg-neutral-950/95 space-y-3">
			<nav class="flex flex-col space-y-2 text-sm font-medium text-neutral-300">
				<a href="/blog" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 font-bold transition flex items-center gap-2">
					<BookOpen class="w-4 h-4" />
					<span>Field Essays & Dispatches</span>
				</a>
				<a href="/#contrast" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400 transition">Prompt vs. Direct</a>
				<a href="/#linter" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400 transition">Live Zero-Adjective Linter</a>
				<a href="/#theses" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400 transition">The 5 Theses</a>
				<a href="/#studios" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400 transition">8 Studio Modalities</a>
				<a href="/#syllabus" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400 transition">18-Week Syllabus & Projects</a>
				<a href="/#diagnostic" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400 transition">Sensibility Diagnostic Test</a>
				<a href="/#faq" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg hover:bg-neutral-900 hover:text-amber-400 transition">Dispatches & FAQ</a>
				<a href="/logs" onclick={closeMobileMenu} class="px-3 py-2 rounded-lg hover:bg-neutral-900 text-amber-400 transition font-mono text-xs">Open Studio Logbook</a>
			</nav>
		</div>
	{/if}
</header>
