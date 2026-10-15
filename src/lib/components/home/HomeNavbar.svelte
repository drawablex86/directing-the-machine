<script lang="ts">
	import {
		ArrowRight,
		Compass,
		Sparkles,
		BookOpen,
		Terminal,
		Palette,
		Sun,
		Moon,
		Coffee,
		Shield,
		Menu,
		X,
		ChevronDown,
		Cpu,
		Layers,
		CheckCircle2,
		GraduationCap,
		HelpCircle,
		ScanEye,
		Zap
	} from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';

	let mobileMenuOpen = $state(false);
	let curriculumDropdownOpen = $state(false);
	let themeDropdownOpen = $state(false);

	const themes = [
		{ id: 'dark', label: 'Stone', icon: Moon, desc: 'Volcanic slate & amber glow' },
		{ id: 'light', label: 'Paper', icon: Sun, desc: 'Archival paper & carbon ink' }
	] as const;

	function setTheme(themeId: (typeof themes)[number]['id']) {
		practiceStore.setTheme(themeId);
		themeDropdownOpen = false;
	}

	function toggleTheme() {
		practiceStore.toggleTheme();
	}

	const currentThemeInfo = $derived(
		themes.find((t) => t.id === practiceStore.learnerPreferences.theme) || themes[0]
	);

	function closeAllDropdowns() {
		curriculumDropdownOpen = false;
		themeDropdownOpen = false;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleWindowClick(e: MouseEvent) {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		if (!target.closest('.dropdown-container')) {
			closeAllDropdowns();
		}
	}
</script>

<svelte:window
	onclick={handleWindowClick}
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			closeAllDropdowns();
			closeMobileMenu();
		}
	}}
/>

<header
	class="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80 transition-all duration-300"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
		<!-- Brand & Ogilvy Monogram -->
		<a
			href="/"
			class="flex items-center gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg py-1 px-1 -ml-1 transition"
			aria-label="Directing the Machine — Home"
		>
			<div
				class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800/90 flex items-center justify-center font-serif font-black text-amber-500 shadow-sm shadow-amber-500/5 group-hover:border-amber-500/50 group-hover:scale-105 group-hover:shadow-amber-500/20 transition-all duration-200"
			>
				D
			</div>
			<div class="flex flex-col">
				<span class="font-serif font-bold text-sm tracking-tight text-white group-hover:text-amber-400 transition-colors">
					Directing the Machine
				</span>
				<span class="text-[9.5px] uppercase font-mono tracking-widest text-neutral-400 group-hover:text-neutral-300 transition-colors">
					Creative Authorship in the AI Era
				</span>
			</div>
		</a>

		<!-- Desktop Navigation Links -->
		<nav class="hidden lg:flex items-center gap-1.5 text-xs font-medium text-neutral-300" aria-label="Main Navigation">
			<!-- Field Essays dispatch -->
			<a
				href="/blog"
				class="px-3 py-1.5 rounded-lg text-amber-400 font-semibold hover:text-amber-300 hover:bg-neutral-900/60 transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
			>
				<BookOpen class="w-3.5 h-3.5" />
				<span>Field Essays</span>
			</a>

			<!-- Curriculum & Studios Mega Dropdown -->
			<div class="relative dropdown-container">
				<button
					type="button"
					onclick={() => (curriculumDropdownOpen = !curriculumDropdownOpen)}
					aria-expanded={curriculumDropdownOpen}
					aria-haspopup="true"
					class="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-900/70 transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 {curriculumDropdownOpen ? 'bg-neutral-900 text-white shadow-inner' : ''}"
				>
					<span>Framework & Studios</span>
					<ChevronDown
						class="w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 {curriculumDropdownOpen ? 'rotate-180 text-amber-400' : ''}"
					/>
				</button>

				{#if curriculumDropdownOpen}
					<div
						class="absolute left-0 mt-1 w-96 p-3 rounded-2xl bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
					>
						<div class="grid grid-cols-2 gap-2">
							<!-- Column 1: Philosophy & Theses -->
							<div class="space-y-1">
								<div class="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800/60 mb-1">
									Sensibility & Theory
								</div>
								<a
									href="/#contrast"
									onclick={closeAllDropdowns}
									class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-white transition group"
								>
									<Zap class="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
									<div class="flex flex-col">
										<span class="text-xs font-semibold">Prompt vs. Direct</span>
										<span class="text-[11px] text-neutral-400 line-clamp-1">Beyond slot-machine output</span>
									</div>
								</a>
								<a
									href="/#theses"
									onclick={closeAllDropdowns}
									class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-white transition group"
								>
									<Compass class="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
									<div class="flex flex-col">
										<span class="text-xs font-semibold">The 5 Theses</span>
										<span class="text-[11px] text-neutral-400 line-clamp-1">Core doctrine of intent</span>
									</div>
								</a>
								<a
									href="/#diagnostic"
									onclick={closeAllDropdowns}
									class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-white transition group"
								>
									<ScanEye class="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
									<div class="flex flex-col">
										<span class="text-xs font-semibold">Diagnostic Test</span>
										<span class="text-[11px] text-neutral-400 line-clamp-1">Sensibility baseline audit</span>
									</div>
								</a>
							</div>

							<!-- Column 2: Applied Curriculum & Labs -->
							<div class="space-y-1">
								<div class="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800/60 mb-1">
									Curriculum & Craft
								</div>
								<a
									href="/#studios"
									onclick={closeAllDropdowns}
									class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-white transition group"
								>
									<Layers class="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
									<div class="flex flex-col">
										<span class="text-xs font-semibold">8 Studio Modalities</span>
										<span class="text-[11px] text-neutral-400 line-clamp-1">M0–M7 Deliberate practice</span>
									</div>
								</a>
								<a
									href="/#syllabus"
									onclick={closeAllDropdowns}
									class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-white transition group"
								>
									<GraduationCap class="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
									<div class="flex flex-col">
										<span class="text-xs font-semibold">Syllabus & Projects</span>
										<span class="text-[11px] text-neutral-400 line-clamp-1">18-week roadmaps & briefs</span>
									</div>
								</a>
								<a
									href="/#linter"
									onclick={closeAllDropdowns}
									class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-white transition group"
								>
									<Cpu class="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
									<div class="flex flex-col">
										<span class="text-xs font-semibold">Live Linter</span>
										<span class="text-[11px] text-neutral-400 line-clamp-1">Zero-adjective brief validator</span>
									</div>
								</a>
							</div>
						</div>

						<!-- Dropdown footer banner -->
						<div class="mt-2 pt-2 border-t border-neutral-800/70 flex items-center justify-between px-2 text-[11px]">
							<span class="text-neutral-400">Ready to train?</span>
							<a
								href="/app?tab=today"
								onclick={closeAllDropdowns}
								class="text-amber-400 font-semibold hover:text-amber-300 inline-flex items-center gap-1 transition"
							>
								<span>Launch Workbench</span>
								<ArrowRight class="w-3 h-3" />
							</a>
						</div>
					</div>
				{/if}
			</div>

			<!-- Direct Quick Anchors -->
			<a
				href="/#syllabus"
				class="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-900/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
			>
				Syllabus
			</a>
			<a
				href="/#diagnostic"
				class="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-900/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
			>
				Diagnostic
			</a>
			<a
				href="/#faq"
				class="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-900/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
			>
				FAQ
			</a>
			<!-- Help Encyclopedia Modal Trigger -->
			<button
				type="button"
				onclick={() => practiceStore.openHelp()}
				class="px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900/70 transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
				title="Course & Studio Help Encyclopedia (Press ? or H)"
			>
				<HelpCircle class="w-3.5 h-3.5 text-amber-400" />
				<span>Help</span>
			</button>
		</nav>

		<!-- Right Side CTAs & Utilities -->
		<div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
			<!-- 1-Click Stone / Paper Theme Toggle -->
			<button
				type="button"
				onclick={toggleTheme}
				aria-label="Toggle visual theme (Current: {practiceStore.learnerPreferences.theme === 'dark' ? 'Stone' : 'Paper'})"
				title="Toggle theme: {practiceStore.learnerPreferences.theme === 'dark' ? 'Switch to Paper (Light)' : 'Switch to Stone (Dark)'}"
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
			>
				{#if practiceStore.learnerPreferences.theme === 'dark'}
					<Moon class="w-3.5 h-3.5 text-amber-400" />
					<span class="hidden sm:inline text-[11px] font-medium">Stone</span>
				{:else}
					<Sun class="w-3.5 h-3.5 text-amber-500" />
					<span class="hidden sm:inline text-[11px] font-medium">Paper</span>
				{/if}
			</button>

			<!-- Logbook Button -->
			<a
				href="/logs"
				class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
			>
				<Terminal class="w-3.5 h-3.5 text-neutral-400" />
				<span>Logbook</span>
			</a>

			<!-- Studio App CTA Button with Amber Accent -->
			<a
				href="/app?tab=today"
				class="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 shadow-md shadow-amber-500/15 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
			>
				<span>Studio App</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</a>

			<!-- Mobile menu toggle button -->
			<button
				type="button"
				onclick={() => { mobileMenuOpen = !mobileMenuOpen; }}
				class="lg:hidden p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
				aria-label="Toggle navigation menu"
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<X class="w-4 h-4 text-amber-400" />
				{:else}
					<Menu class="w-4 h-4" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Drawer with Categorized Sections & Polish -->
	{#if mobileMenuOpen}
		<div
			class="lg:hidden border-t border-neutral-800/80 bg-neutral-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-3 duration-200"
		>
			<!-- Primary Featured Item -->
			<a
				href="/blog"
				onclick={closeMobileMenu}
				class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold transition flex items-center justify-between"
			>
				<div class="flex items-center gap-2.5">
					<BookOpen class="w-4 h-4 text-amber-400" />
					<span class="text-sm">Field Essays & Dispatches</span>
				</div>
				<ArrowRight class="w-4 h-4 text-amber-400" />
			</a>

			<!-- Theory & Doctrine Section -->
			<div class="space-y-1">
				<div class="px-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
					Theory & Diagnosis
				</div>
				<div class="grid grid-cols-1 gap-1">
					<a
						href="/#contrast"
						onclick={closeMobileMenu}
						class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 hover:text-white transition text-xs"
					>
						<Zap class="w-3.5 h-3.5 text-amber-400" />
						<span>Prompt vs. Direct Matrix</span>
					</a>
					<a
						href="/#theses"
						onclick={closeMobileMenu}
						class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 hover:text-white transition text-xs"
					>
						<Compass class="w-3.5 h-3.5 text-amber-400" />
						<span>The 5 Theses of Authorship</span>
					</a>
					<a
						href="/#diagnostic"
						onclick={closeMobileMenu}
						class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 hover:text-white transition text-xs"
					>
						<ScanEye class="w-3.5 h-3.5 text-amber-400" />
						<span>Sensibility Diagnostic Test</span>
					</a>
				</div>
			</div>

			<!-- Applied Practice & Studios Section -->
			<div class="space-y-1">
				<div class="px-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
					Curriculum & Labs
				</div>
				<div class="grid grid-cols-1 gap-1">
					<a
						href="/#studios"
						onclick={closeMobileMenu}
						class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 hover:text-white transition text-xs"
					>
						<Layers class="w-3.5 h-3.5 text-amber-400" />
						<span>8 Studio Modalities (M0–M7)</span>
					</a>
					<a
						href="/#syllabus"
						onclick={closeMobileMenu}
						class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 hover:text-white transition text-xs"
					>
						<GraduationCap class="w-3.5 h-3.5 text-amber-400" />
						<span>18-Week Syllabus & Projects</span>
					</a>
					<a
						href="/#linter"
						onclick={closeMobileMenu}
						class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 hover:text-white transition text-xs"
					>
						<Cpu class="w-3.5 h-3.5 text-amber-400" />
						<span>Live Zero-Adjective Linter</span>
					</a>
					<a
						href="/#faq"
						onclick={closeMobileMenu}
						class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 hover:text-white transition text-xs"
					>
						<HelpCircle class="w-3.5 h-3.5 text-amber-400" />
						<span>Frequently Answered Questions</span>
					</a>
					<button
						type="button"
						onclick={() => { closeMobileMenu(); practiceStore.openHelp(); }}
						class="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-900 hover:text-white transition text-xs cursor-pointer w-full text-left"
					>
						<span class="flex items-center gap-2.5">
							<HelpCircle class="w-3.5 h-3.5 text-amber-400" />
							<span>Help & Concept Encyclopedia</span>
						</span>
						<span class="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">? / H</span>
					</button>
				</div>
			</div>

			<!-- Mobile Utility Links: Logbook & Palette Quick Buttons -->
			<div class="pt-2 border-t border-neutral-800/80 flex flex-col gap-2">
				<a
					href="/logs"
					onclick={closeMobileMenu}
					class="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition text-xs font-mono"
				>
					<span class="flex items-center gap-2">
						<Terminal class="w-3.5 h-3.5 text-amber-400" />
						<span>Studio Deliberate Logbook</span>
					</span>
					<ArrowRight class="w-3 h-3 text-neutral-400" />
				</a>

				<!-- Quick theme switch pills for mobile -->
				<div class="px-1 pt-1">
					<div class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-1.5">
						Select Visual Theme
					</div>
					<div class="grid grid-cols-2 gap-2">
						{#each themes as t}
							<button
								type="button"
								onclick={() => { setTheme(t.id); closeMobileMenu(); }}
								class="px-3 py-2 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition {practiceStore.learnerPreferences.theme === t.id ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}"
							>
								<t.icon class="w-3.5 h-3.5" />
								<span>{t.label}</span>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</header>
