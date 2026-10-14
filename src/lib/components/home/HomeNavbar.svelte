<script lang="ts">
	import { ArrowRight, Compass, Sparkles, BookOpen, Terminal, Palette, Sun, Moon, Coffee, Shield } from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

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
		<nav class="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-300">
			<a href="#theses" class="hover:text-amber-400 transition">The 5 Theses</a>
			<a href="#syllabus" class="hover:text-amber-400 transition">18-Week Syllabus</a>
			<a href="#projects" class="hover:text-amber-400 transition">Projects 1–12</a>
			<a href="#diagnostic" class="hover:text-amber-400 transition">Sensibility Test</a>
			<a href="#faq" class="hover:text-amber-400 transition">Dispatches & FAQ</a>
		</nav>

		<!-- CTAs -->
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
				href="/app"
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 transition cursor-pointer"
			>
				<span>Launch Studio App</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</a>
		</div>
	</div>
</header>
