<script lang="ts">
	import {
		X,
		Copy,
		Check,
		ChevronLeft,
		ChevronRight,
		BookOpen,
		ArrowRight,
		CheckCircle2,
		Circle,
		Maximize2,
		Minimize2,
		ListOrdered,
		SlidersHorizontal,
		Send,
		Search,
		BookmarkCheck,
		Sun,
		Moon
	} from '@lucide/svelte';
	import confetti from 'canvas-confetti';
	import type { CoreReading } from '$lib/data/core-readings';
	import { CORE_READINGS } from '$lib/data/core-readings';
	import { renderMarkdownReading } from '$lib/engine/markdown-renderer';
	import { practiceStore } from '$lib/state/practice.svelte';
	import { soundSystem } from '$lib/engine/sound-system';

	let {
		reading,
		isOpen,
		onClose,
		onSelectReading,
		onSelectModality
	}: {
		reading: CoreReading | null;
		isOpen: boolean;
		onClose: () => void;
		onSelectReading: (r: CoreReading) => void;
		onSelectModality?: (modId: string) => void;
	} = $props();

	// Local UI states
	let copied = $state(false);
	let isFullscreen = $state(false);
	let showOutline = $state(true);
	let showAppearanceControls = $state(false);
	let showChapterMenu = $state(false);
	let scrollProgress = $state(0);
	let activeSectionId = $state<string | null>(null);

	// Reader typography & appearance preferences
	let readerFont = $state<'sans' | 'serif' | 'mono' | 'dyslexic'>('serif');
	let readerSize = $state<'sm' | 'base' | 'lg' | 'xl'>('base');
	let readerWidth = $state<'compact' | 'comfortable' | 'full'>('comfortable');

	// Synced Theme: Follow website theme by default, with one-click toggle
	let isDarkMode = $derived(practiceStore.learnerPreferences.theme === 'dark');

	// Reflection hook input
	let reflectionInput = $state('');
	let reflectionSaved = $state(false);

	let scrollContainerRef: HTMLDivElement | null = $state(null);

	// Parse markdown into rich AST HTML and Table of Contents
	let parsedReading = $derived.by(() => {
		if (!reading) return null;
		return renderMarkdownReading(reading.content);
	});

	let isCompleted = $derived.by(() => {
		if (!reading) return false;
		return practiceStore.isReadingCompleted(reading.code);
	});

	let currentIndex = $derived.by(() => {
		if (!reading) return 0;
		return CORE_READINGS.findIndex((r) => r.code === reading.code);
	});

	let prevReading = $derived.by(() => {
		if (currentIndex <= 0) return null;
		return CORE_READINGS[currentIndex - 1];
	});

	let nextReading = $derived.by(() => {
		if (currentIndex >= CORE_READINGS.length - 1) return null;
		return CORE_READINGS[currentIndex + 1];
	});

	function handleScroll() {
		if (!scrollContainerRef) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef;
		const maxScroll = scrollHeight - clientHeight;
		scrollProgress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)) : 0;

		// Track active heading
		if (parsedReading?.toc && parsedReading.toc.length > 0) {
			const headings = parsedReading.toc
				.map((item) => {
					const el = scrollContainerRef?.querySelector(`#${item.id}`);
					return el ? { id: item.id, top: el.getBoundingClientRect().top } : null;
				})
				.filter(Boolean);

			// Find heading closest to top but above middle
			const current = headings.reverse().find((h) => h && h.top <= 200);
			if (current) {
				activeSectionId = current.id;
			} else if (headings.length > 0 && headings[0]) {
				activeSectionId = headings[headings.length - 1]?.id || null;
			}
		}
	}

	function scrollToSection(id: string) {
		if (!scrollContainerRef) return;
		const el = scrollContainerRef.querySelector(`#${id}`);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			activeSectionId = id;
		}
	}

	function toggleReadingStatus() {
		if (!reading) return;
		const nowCompleted = practiceStore.toggleReadingCompleted(reading.code);
		if (nowCompleted) {
			soundSystem.playCompletion(practiceStore.learnerPreferences.soundEnabled);
			try {
				confetti({
					particleCount: 40,
					spread: 60,
					origin: { y: 0.7 },
					colors: ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6']
				});
			} catch (_) {}
		}
	}

	function toggleTheme() {
		practiceStore.toggleTheme();
	}

	function copyFullContent() {
		if (!reading) return;
		const fullText = `# ${reading.code} — ${reading.title}\n\n${reading.content}`;
		navigator.clipboard.writeText(fullText);
		copied = true;
		setTimeout(() => (copied = false), 2500);
	}

	function saveReflection() {
		if (!reading || !reflectionInput.trim()) return;
		practiceStore.playLines.unshift({
			id: crypto.randomUUID(),
			date: new Date().toISOString().slice(0, 10),
			line: `[${reading.code} Reflection] ${reflectionInput.trim()}`
		});
		practiceStore.saveToStorage();
		reflectionInput = '';
		reflectionSaved = true;
		setTimeout(() => (reflectionSaved = false), 2500);
	}

	function goToPrev() {
		if (prevReading) {
			onSelectReading(prevReading);
			if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
		}
	}

	function goToNext() {
		if (nextReading) {
			onSelectReading(nextReading);
			if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!isOpen) return;
		if (e.key === 'Escape') {
			if (showAppearanceControls) {
				showAppearanceControls = false;
			} else if (showChapterMenu) {
				showChapterMenu = false;
			} else {
				onClose();
			}
		} else if (e.key === 'ArrowLeft' && !e.target?.toString().includes('Input')) {
			goToPrev();
		} else if (e.key === 'ArrowRight' && !e.target?.toString().includes('Input')) {
			goToNext();
		} else if ((e.key === 'f' || e.key === 'F') && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			isFullscreen = !isFullscreen;
		}
	}

	// Font family CSS mapping
	let fontClass = $derived.by(() => {
		switch (readerFont) {
			case 'serif':
				return 'reader-font-serif';
			case 'mono':
				return 'reader-font-mono';
			case 'dyslexic':
				return 'reader-font-dyslexic';
			default:
				return 'reader-font-sans';
		}
	});

	// Font size CSS mapping
	let sizeClass = $derived.by(() => {
		switch (readerSize) {
			case 'sm':
				return 'text-xs md:text-sm';
			case 'lg':
				return 'text-base md:text-lg';
			case 'xl':
				return 'text-lg md:text-xl';
			default:
				return 'text-sm md:text-base';
		}
	});

	// Column width CSS mapping
	let widthClass = $derived.by(() => {
		switch (readerWidth) {
			case 'compact':
				return 'max-w-2xl';
			case 'full':
				return 'max-w-none';
			default:
				return 'max-w-4xl';
		}
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen && reading && parsedReading}
	<div
		class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center {isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'}"
		role="dialog"
		aria-modal="true"
		aria-labelledby="reading-title"
		tabindex="-1"
	>
		<!-- Modal Window Box (Stone & Paper Theme-bound) -->
		<div
			class="{isDarkMode ? 'theme-dark' : 'theme-light'} bg-neutral-950 text-neutral-100 border border-neutral-800 w-full {isFullscreen ? 'h-screen rounded-none border-0' : 'max-w-6xl max-h-[94vh] rounded-3xl'} flex flex-col shadow-2xl overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95"
		>
			<!-- Ambient Top Reading Scroll Progress Bar -->
			<div class="h-1 bg-neutral-900 w-full overflow-hidden shrink-0 relative z-30">
				<div
					class="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-100"
					style="width: {scrollProgress}%;"
				></div>
			</div>

			<!-- Top Editorial Header & Signifiers -->
			<header class="bg-neutral-900 border-b border-neutral-800 px-4 py-3 md:px-6 md:py-3.5 flex items-center justify-between gap-3 shrink-0 relative z-20">
				<!-- Title & Context Breadcrumb -->
				<div class="flex items-center gap-3 overflow-hidden min-w-0">
					<span class="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono font-bold text-xs shrink-0">
						{reading.code}
					</span>

					<div class="truncate">
						<div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 truncate">
							<span>Layer {reading.layer}: {reading.layerName}</span>
							<span>•</span>
							<span>Part {reading.partNumber}</span>
							<span class="hidden sm:inline">•</span>
							<span class="hidden sm:inline text-amber-500">⏱ {parsedReading.readingTimeMinutes} min read</span>
						</div>
						<h2 id="reading-title" class="text-sm md:text-base font-bold text-neutral-100 truncate">
							{reading.title}
						</h2>
					</div>
				</div>

				<!-- Action Controls Toolbar -->
				<div class="flex items-center gap-1.5 shrink-0">
					<!-- Mark as Read / Completed Button -->
					<button
						type="button"
						onclick={toggleReadingStatus}
						class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer {isCompleted ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow' : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'}"
						title={isCompleted ? 'Mark as unread' : 'Mark module reading as complete'}
					>
						{#if isCompleted}
							<CheckCircle2 class="w-4 h-4 text-white" />
							<span class="hidden sm:inline">Completed</span>
						{:else}
							<Circle class="w-4 h-4 text-neutral-400" />
							<span class="hidden sm:inline">Mark as Read</span>
						{/if}
					</button>

					<!-- Toggle Outline / TOC Button -->
					<button
						type="button"
						onclick={() => (showOutline = !showOutline)}
						class="p-2 rounded-xl text-xs font-semibold transition cursor-pointer {showOutline ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'}"
						title="{showOutline ? 'Hide' : 'Show'} Table of Contents"
					>
						<ListOrdered class="w-4 h-4" />
					</button>

					<!-- Light / Dark Mode Toggle (Unified with App) -->
					<button
						type="button"
						onclick={toggleTheme}
						class="p-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition cursor-pointer"
						title="Switch Theme: Currently {isDarkMode ? 'Stone (Dark)' : 'Paper (Light)'}"
					>
						{#if isDarkMode}
							<Sun class="w-4 h-4 text-amber-400" />
						{:else}
							<Moon class="w-4 h-4 text-neutral-700" />
						{/if}
					</button>

					<!-- Reader Display Preferences Button -->
					<div class="relative">
						<button
							type="button"
							onclick={() => (showAppearanceControls = !showAppearanceControls)}
							class="p-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition cursor-pointer {showAppearanceControls ? 'border-amber-500 text-amber-400' : ''}"
							title="Customize Reader Typography & Width"
						>
							<SlidersHorizontal class="w-4 h-4" />
						</button>

						<!-- Appearance Dropdown Menu -->
						{#if showAppearanceControls}
							<div class="absolute right-0 top-11 z-50 w-72 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4 text-xs text-neutral-200 animate-in fade-in zoom-in-95">
								<div class="flex items-center justify-between pb-2 border-b border-neutral-800 font-bold text-amber-500">
									<span>Typography & Layout</span>
									<button type="button" onclick={() => (showAppearanceControls = false)} class="text-neutral-400 hover:text-neutral-100 cursor-pointer">
										<X class="w-4 h-4" />
									</button>
								</div>

								<!-- Font Selector -->
								<div class="space-y-1.5">
									<div class="text-[10px] font-mono uppercase text-neutral-400">Typeface</div>
									<div class="grid grid-cols-2 gap-1.5">
										{#each [
											{ id: 'serif', name: 'Editorial Serif' },
											{ id: 'sans', name: 'Clean Sans' },
											{ id: 'mono', name: 'Technical Mono' },
											{ id: 'dyslexic', name: 'Dyslexia Friendly' }
										] as f}
											<button
												type="button"
												onclick={() => (readerFont = f.id as any)}
												class="p-1.5 rounded-lg border text-center transition cursor-pointer {readerFont === f.id ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-neutral-100'}"
											>
												{f.name}
											</button>
										{/each}
									</div>
								</div>

								<!-- Size Selector -->
								<div class="space-y-1.5">
									<div class="text-[10px] font-mono uppercase text-neutral-400">Font Size</div>
									<div class="grid grid-cols-4 gap-1.5 font-mono text-center">
										{#each [
											{ id: 'sm', label: 'Small' },
											{ id: 'base', label: 'Medium' },
											{ id: 'lg', label: 'Large' },
											{ id: 'xl', label: 'XL' }
										] as s}
											<button
												type="button"
												onclick={() => (readerSize = s.id as any)}
												class="p-1.5 rounded-lg border transition cursor-pointer {readerSize === s.id ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-neutral-100'}"
											>
												{s.label}
											</button>
										{/each}
									</div>
								</div>

								<!-- Column Width -->
								<div class="space-y-1.5">
									<div class="text-[10px] font-mono uppercase text-neutral-400">Reading Width</div>
									<div class="grid grid-cols-3 gap-1.5 text-center">
										{#each [
											{ id: 'compact', label: 'Compact' },
											{ id: 'comfortable', label: 'Standard' },
											{ id: 'full', label: 'Full Width' }
										] as w}
											<button
												type="button"
												onclick={() => (readerWidth = w.id as any)}
												class="p-1.5 rounded-lg border transition cursor-pointer {readerWidth === w.id ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-neutral-100'}"
											>
												{w.label}
											</button>
										{/each}
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Copy Full Module Text Button -->
					<button
						type="button"
						onclick={copyFullContent}
						class="p-2 rounded-xl bg-neutral-855 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition cursor-pointer"
						title="Copy entire module markdown"
					>
						{#if copied}
							<Check class="w-4 h-4 text-emerald-400" />
						{:else}
							<Copy class="w-4 h-4 text-amber-500" />
						{/if}
					</button>

					<!-- Fullscreen Toggle Button -->
					<button
						type="button"
						onclick={() => (isFullscreen = !isFullscreen)}
						class="p-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition cursor-pointer hidden md:flex"
						title="{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Cmd+F)'}"
					>
						{#if isFullscreen}
							<Minimize2 class="w-4 h-4" />
						{:else}
							<Maximize2 class="w-4 h-4" />
						{/if}
					</button>

					<!-- Close Button -->
					<button
						type="button"
						onclick={onClose}
						class="p-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 border border-neutral-800 transition cursor-pointer ml-1"
						title="Close (ESC)"
					>
						<X class="w-5 h-5" />
					</button>
				</div>
			</header>

			<!-- Main 2-Column Body: Table of Contents + Reading Canvas -->
			<div class="flex-1 flex overflow-hidden relative">
				<!-- Collapsible Table of Contents Sidebar -->
				{#if showOutline && parsedReading.toc.length > 0}
					<aside class="w-64 lg:w-72 border-r border-neutral-800 bg-neutral-900/60 p-4 overflow-y-auto reader-scrollbar shrink-0 hidden md:flex flex-col justify-between animate-in fade-in duration-150">
						<div class="space-y-3">
							<div class="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold pb-2 border-b border-neutral-800">
								<span>Table of Contents</span>
								<span class="text-amber-500 font-normal">{parsedReading.toc.length} sections</span>
							</div>

							<nav class="space-y-1">
								{#each parsedReading.toc as item}
									{@const isActive = activeSectionId === item.id}
									<button
										type="button"
										onclick={() => scrollToSection(item.id)}
										class="w-full text-left py-1.5 px-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer {item.level === 3 ? 'pl-5 text-xs' : item.level === 4 ? 'pl-8 text-[11px]' : 'text-xs font-semibold'} {isActive ? 'bg-amber-500/10 text-amber-500 font-bold border border-amber-500/30' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850/60'}"
									>
										{#if isActive}
											<span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
										{:else}
											<span class="w-1.5 h-1.5 rounded-full bg-neutral-700 shrink-0"></span>
										{/if}
										<span class="truncate">{item.title}</span>
									</button>
								{/each}
							</nav>
						</div>

						<!-- Sidebar Footer: Studio Direct Shortcut -->
						{#if onSelectModality}
							<div class="pt-4 border-t border-neutral-800">
								<button
									type="button"
									onclick={() => {
										onClose();
										onSelectModality(reading.targetModalityId);
									}}
									class="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
								>
									<span>Launch Studio Practice</span>
									<ArrowRight class="w-3.5 h-3.5" />
								</button>
							</div>
						{/if}
					</aside>
				{/if}

				<!-- Scrollable Reader Viewport -->
				<div
					bind:this={scrollContainerRef}
					onscroll={handleScroll}
					class="flex-1 overflow-y-auto reader-scrollbar p-6 md:p-10 selection:bg-amber-500 selection:text-neutral-950 relative scroll-smooth bg-neutral-950"
				>
					<div class="mx-auto {widthClass} space-y-8 {fontClass} {sizeClass}">
						<!-- Core Mental Model Hero Ribbon -->
						<div class="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-lg space-y-4">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
								<div class="flex items-center gap-2">
									<BookmarkCheck class="w-4 h-4 text-amber-500" />
									<span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
										Governing Mental Model
									</span>
								</div>

								{#if onSelectModality}
									<button
										type="button"
										onclick={() => {
											onClose();
											onSelectModality(reading.targetModalityId);
										}}
										class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-1.5 transition cursor-pointer shadow shrink-0"
									>
										<span>Open Modality Studio</span>
										<ArrowRight class="w-3.5 h-3.5" />
									</button>
								{/if}
							</div>

							<blockquote class="text-sm md:text-base font-serif italic text-neutral-100 leading-relaxed border-l-2 border-amber-500 pl-4">
								"{reading.keyMentalModel}"
							</blockquote>

							<div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
								<p class="font-sans line-clamp-2 max-w-xl">
									{reading.summary}
								</p>
								<div class="flex flex-wrap gap-1.5 shrink-0">
									{#each reading.tags.slice(0, 4) as tag}
										<span class="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400">
											#{tag}
										</span>
									{/each}
								</div>
							</div>
						</div>

						<!-- Formatted Markdown Content -->
						<article class="reader-prose space-y-4">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html parsedReading.html}
						</article>

						<!-- End of Reading Reflection & Action Card -->
						<div class="my-10 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-5">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
								<div class="flex items-center gap-3">
									<div class="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
										<BookOpen class="w-5 h-5" />
									</div>
									<div>
										<h3 class="text-sm md:text-base font-bold text-neutral-100">Finished Reading {reading.code}?</h3>
										<p class="text-xs text-neutral-400">Lock the mental model into your studio practice record.</p>
									</div>
								</div>

								<div class="flex items-center gap-2">
									{#if onSelectModality}
										<button
											type="button"
											onclick={() => {
												onClose();
												onSelectModality(reading.targetModalityId);
											}}
											class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow flex items-center gap-1.5 transition cursor-pointer"
										>
											<span>Enter Studio Lab</span>
											<ArrowRight class="w-3.5 h-3.5" />
										</button>
									{/if}

									<button
										type="button"
										onclick={toggleReadingStatus}
										class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 {isCompleted ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'}"
									>
										{#if isCompleted}
											<CheckCircle2 class="w-4 h-4" />
											<span>Module Completed!</span>
										{:else}
											<Circle class="w-4 h-4" />
											<span>Sign Off & Complete</span>
										{/if}
									</button>
								</div>
							</div>

							<!-- 1-Line Reflection Hook -->
							<div class="space-y-2">
								<label for="reading-reflection" class="block text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
									Studio Application Hook: What one directorial decision or refusal will you test today?
								</label>
								<div class="flex items-center gap-2">
									<input
										id="reading-reflection"
										type="text"
										bind:value={reflectionInput}
										placeholder="e.g. In today's session, I will audit the 3 major value masses before evaluating lighting details..."
										class="flex-1 bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded-xl text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition"
										onkeydown={(e) => {
											if (e.key === 'Enter') saveReflection();
										}}
									/>
									<button
										type="button"
										onclick={saveReflection}
										class="px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 transition flex items-center gap-1.5 cursor-pointer shrink-0"
									>
										<Send class="w-3.5 h-3.5 text-amber-500" />
										<span>Save Hook</span>
									</button>
								</div>
								{#if reflectionSaved}
									<p class="text-[11px] text-emerald-400 font-bold">
										✓ Reflection saved to your studio practice record!
									</p>
								{/if}
							</div>
						</div>

						<!-- Next / Previous Chapter Navigation Cards (Ergonomic Pager) -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
							{#if prevReading}
								<button
									type="button"
									onclick={goToPrev}
									class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition text-left space-y-1 cursor-pointer group"
								>
									<div class="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 group-hover:text-amber-500 transition">
										<ChevronLeft class="w-3.5 h-3.5" />
										<span>Previous Chapter</span>
									</div>
									<div class="font-bold text-xs md:text-sm text-neutral-200 group-hover:text-neutral-100 truncate">
										{prevReading.code} — {prevReading.title}
									</div>
								</button>
							{:else}
								<div class="p-4 rounded-2xl bg-neutral-900/30 border border-neutral-800/40 text-neutral-500 text-xs italic flex items-center">
									Start of Course Curriculum
								</div>
							{/if}

							{#if nextReading}
								<button
									type="button"
									onclick={goToNext}
									class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition text-right space-y-1 cursor-pointer group"
								>
									<div class="flex items-center justify-end gap-1.5 text-[11px] font-mono text-neutral-400 group-hover:text-amber-500 transition">
										<span>Next Chapter</span>
										<ChevronRight class="w-3.5 h-3.5" />
									</div>
									<div class="font-bold text-xs md:text-sm text-neutral-200 group-hover:text-neutral-100 truncate">
										{nextReading.code} — {nextReading.title}
									</div>
								</button>
							{:else}
								<div class="p-4 rounded-2xl bg-neutral-900/30 border border-neutral-800/40 text-neutral-500 text-xs italic flex items-center justify-end">
									End of Course Curriculum
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Footer Ergonomic Chapter Pager (Replaces cluttered 15-pill bar) -->
			<footer class="bg-neutral-900 px-4 py-2.5 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0 relative">
				<!-- Left: Previous Chapter Button -->
				<button
					type="button"
					onclick={goToPrev}
					disabled={!prevReading}
					class="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
				>
					<ChevronLeft class="w-3.5 h-3.5" />
					<span class="hidden sm:inline">Previous</span>
				</button>

				<!-- Center: Chapter Selector Dropdown / Current Index -->
				<div class="relative">
					<button
						type="button"
						onclick={() => (showChapterMenu = !showChapterMenu)}
						class="px-3.5 py-1.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-mono text-xs flex items-center gap-2 transition cursor-pointer"
					>
						<span class="text-amber-500 font-bold">{reading.code}</span>
						<span class="text-neutral-400">({currentIndex + 1} of {CORE_READINGS.length})</span>
						<span class="text-[10px] text-neutral-400">▾</span>
					</button>

					<!-- Chapter Menu Popover -->
					{#if showChapterMenu}
						<div class="absolute bottom-11 left-1/2 -translate-x-1/2 z-50 w-80 max-h-72 overflow-y-auto reader-scrollbar p-2 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-1 animate-in fade-in zoom-in-95">
							<div class="px-3 py-1.5 text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 flex items-center justify-between">
								<span>Course Readings</span>
								<span class="text-amber-500">{CORE_READINGS.length} Chapters</span>
							</div>
							{#each CORE_READINGS as item, idx}
								{@const done = practiceStore.isReadingCompleted(item.code)}
								<button
									type="button"
									onclick={() => {
										onSelectReading(item);
										showChapterMenu = false;
										if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
									}}
									class="w-full text-left p-2 rounded-xl transition flex items-center justify-between text-xs cursor-pointer {item.code === reading.code ? 'bg-amber-500/10 text-amber-500 font-bold border border-amber-500/30' : 'text-neutral-300 hover:bg-neutral-850 hover:text-neutral-100'}"
								>
									<div class="flex items-center gap-2 truncate pr-2">
										<span class="font-mono text-[10px] text-neutral-400 shrink-0">{idx + 1}.</span>
										<span class="truncate">{item.code}: {item.title}</span>
									</div>
									{#if done}
										<CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
									{/if}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Right: Next Chapter Button & Hotkey helper -->
				<div class="flex items-center gap-2">
					<div class="text-[11px] text-neutral-400 hidden lg:block shrink-0 pr-1">
						<kbd class="px-1 py-0.5 bg-neutral-950 rounded border border-neutral-800 text-[10px]">←</kbd>
						<kbd class="px-1 py-0.5 bg-neutral-950 rounded border border-neutral-800 text-[10px]">→</kbd>
						navigate
					</div>

					<button
						type="button"
						onclick={goToNext}
						disabled={!nextReading}
						class="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
					>
						<span class="hidden sm:inline">Next</span>
						<ChevronRight class="w-3.5 h-3.5" />
					</button>
				</div>
			</footer>
		</div>
	</div>
{/if}
