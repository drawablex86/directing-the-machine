<script lang="ts">
	import {
		X,
		Copy,
		Check,
		ChevronLeft,
		ChevronRight,
		BookOpen,
		ArrowRight,
		Layers,
		Compass,
		Clock,
		Sparkles,
		CheckCircle2,
		Circle,
		Maximize2,
		Minimize2,
		Type,
		ListOrdered,
		SlidersHorizontal,
		Share2,
		Send,
		ExternalLink
	} from '@lucide/svelte';
	import confetti from 'canvas-confetti';
	import type { CoreReading } from '$lib/data/core-readings';
	import { CORE_READINGS } from '$lib/data/core-readings';
	import { renderMarkdownReading, type TocItem } from '$lib/engine/markdown-renderer';
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
	let scrollProgress = $state(0);
	let activeSectionId = $state<string | null>(null);

	// Reader typography & appearance preferences
	let readerFont = $state<'sans' | 'serif' | 'mono' | 'dyslexic'>('sans');
	let readerSize = $state<'sm' | 'base' | 'lg' | 'xl'>('base');
	let readerWidth = $state<'compact' | 'comfortable' | 'full'>('comfortable');
	let readerTheme = $state<'dark' | 'light'>('dark');

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
			// Trigger a joyful confetti burst
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
		if (!reading) return;
		const currentIndex = CORE_READINGS.findIndex((r) => r.code === reading.code);
		if (currentIndex > 0) {
			onSelectReading(CORE_READINGS[currentIndex - 1]);
		} else {
			onSelectReading(CORE_READINGS[CORE_READINGS.length - 1]);
		}
		if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
	}

	function goToNext() {
		if (!reading) return;
		const currentIndex = CORE_READINGS.findIndex((r) => r.code === reading.code);
		if (currentIndex < CORE_READINGS.length - 1) {
			onSelectReading(CORE_READINGS[currentIndex + 1]);
		} else {
			onSelectReading(CORE_READINGS[0]);
		}
		if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!isOpen) return;
		if (e.key === 'Escape' && !showAppearanceControls) {
			onClose();
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

	// Color theme CSS mapping (Stone & Paper)
	let themeContainerClass = $derived.by(() => {
		switch (readerTheme) {
			case 'light':
				return 'theme-light bg-[#fbf9f5] text-[#1f1e1c] border-[#ded7cb]';
			default:
				return 'theme-dark bg-[#1e1d1b] text-[#edeae3] border-[#2e2c29]';
		}
	});

	let themeHeaderClass = $derived.by(() => {
		switch (readerTheme) {
			case 'light':
				return 'bg-[#f4f0e8] border-[#ded7cb] text-[#1f1e1c]';
			default:
				return 'bg-[#161615] border-[#2e2c29] text-[#edeae3]';
		}
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen && reading && parsedReading}
	<div
		class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center {isFullscreen ? 'p-0' : 'p-2 md:p-5'}"
		role="dialog"
		aria-modal="true"
		aria-labelledby="reading-title"
		tabindex="-1"
	>
		<div
			class="{themeContainerClass} border rounded-3xl w-full {isFullscreen ? 'h-screen rounded-none border-0' : 'max-w-6xl max-h-[94vh] rounded-3xl'} flex flex-col shadow-2xl overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95"
		>
			<!-- Ambient Top Reading Scroll Progress Bar -->
			<div class="h-1 bg-neutral-800/50 w-full overflow-hidden shrink-0 relative z-30">
				<div
					class="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-75"
					style="width: {scrollProgress}%;"
				></div>
			</div>

			<!-- Top Editorial Toolbar -->
			<div class="{themeHeaderClass} px-4 py-3 md:px-6 md:py-3.5 border-b flex items-center justify-between gap-3 shrink-0 relative z-20">
				<!-- Title & Metadata -->
				<div class="flex items-center gap-3 overflow-hidden min-w-0">
					<span class="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs shrink-0">
						{reading.code}
					</span>

					<div class="truncate">
						<div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 truncate">
							<span>Layer {reading.layer}: {reading.layerName}</span>
							<span>•</span>
							<span>Part {reading.partNumber}</span>
							<span class="hidden sm:inline">•</span>
							<span class="hidden sm:inline text-amber-400/90">⏱ {parsedReading.readingTimeMinutes} min read ({parsedReading.wordCount.toLocaleString()} words)</span>
						</div>
						<h2 id="reading-title" class="text-sm md:text-base font-bold truncate">
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
						class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer {isCompleted ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'}"
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
						onclick={() => showOutline = !showOutline}
						class="p-2 rounded-xl text-xs font-semibold transition cursor-pointer {showOutline ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'}"
						title="{showOutline ? 'Hide' : 'Show'} Table of Contents"
					>
						<ListOrdered class="w-4 h-4" />
					</button>

					<!-- Reader Display Preferences Button -->
					<div class="relative">
						<button
							type="button"
							onclick={() => showAppearanceControls = !showAppearanceControls}
							class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
							title="Customize Reader Typography & Themes"
						>
							<SlidersHorizontal class="w-4 h-4" />
						</button>

						<!-- Appearance Dropdown Menu -->
						{#if showAppearanceControls}
							<div class="absolute right-0 top-11 z-50 w-72 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4 text-xs text-neutral-200 animate-in fade-in zoom-in-95">
								<div class="flex items-center justify-between pb-2 border-b border-neutral-800 font-bold text-amber-400">
									<span>Reader Preferences</span>
									<button type="button" onclick={() => showAppearanceControls = false} class="text-neutral-500 hover:text-white cursor-pointer">
										<X class="w-4 h-4" />
									</button>
								</div>

								<!-- Font Selector -->
								<div class="space-y-1.5">
									<div class="text-[10px] font-mono uppercase text-neutral-400">Typeface</div>
									<div class="grid grid-cols-2 gap-1.5">
										{#each [
											{ id: 'sans', name: 'Clean Sans' },
											{ id: 'serif', name: 'Editorial Serif' },
											{ id: 'mono', name: 'Technical Mono' },
											{ id: 'dyslexic', name: 'Dyslexia Friendly' }
										] as f}
											<button
												type="button"
												onclick={() => readerFont = f.id as any}
												class="p-1.5 rounded-lg border text-center transition cursor-pointer {readerFont === f.id ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white'}"
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
												onclick={() => readerSize = s.id as any}
												class="p-1.5 rounded-lg border transition cursor-pointer {readerSize === s.id ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-300'}"
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
												onclick={() => readerWidth = w.id as any}
												class="p-1.5 rounded-lg border transition cursor-pointer {readerWidth === w.id ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-300'}"
											>
												{w.label}
											</button>
										{/each}
									</div>
								</div>

								<!-- Theme Switcher -->
								<div class="space-y-1.5">
									<div class="text-[10px] font-mono uppercase text-neutral-400">Color Surface</div>
									<div class="grid grid-cols-2 gap-1.5 text-center">
										{#each [
											{ id: 'dark', label: 'Stone (Dark)' },
											{ id: 'light', label: 'Paper (Light)' }
										] as t}
											<button
												type="button"
												onclick={() => readerTheme = t.id as any}
												class="p-1.5 rounded-lg border text-xs transition cursor-pointer {readerTheme === t.id ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-300'}"
											>
												{t.label}
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
						class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
						title="Copy entire module markdown"
					>
						{#if copied}
							<Check class="w-4 h-4 text-emerald-400" />
						{:else}
							<Copy class="w-4 h-4 text-amber-400" />
						{/if}
					</button>

					<!-- Fullscreen Toggle Button -->
					<button
						type="button"
						onclick={() => isFullscreen = !isFullscreen}
						class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer hidden md:flex"
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
						class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer ml-1"
						title="Close (ESC)"
					>
						<X class="w-5 h-5" />
					</button>
				</div>
			</div>

			<!-- Main 2-Column Body: Table of Contents + Reading Canvas -->
			<div class="flex-1 flex overflow-hidden relative">
				<!-- Collapsible Table of Contents Sidebar -->
				{#if showOutline && parsedReading.toc.length > 0}
					<aside class="w-64 lg:w-72 border-r border-neutral-800/80 bg-neutral-950/60 p-4 overflow-y-auto reader-scrollbar shrink-0 hidden md:flex flex-col justify-between animate-in fade-in duration-150">
						<div class="space-y-3">
							<div class="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold pb-2 border-b border-neutral-800/80">
								<span>Table of Contents</span>
								<span class="text-amber-400">{parsedReading.toc.length} sections</span>
							</div>

							<nav class="space-y-1">
								{#each parsedReading.toc as item}
									{@const isActive = activeSectionId === item.id}
									<button
										type="button"
										onclick={() => scrollToSection(item.id)}
										class="w-full text-left py-1.5 px-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer {item.level === 3 ? 'pl-5 text-xs' : item.level === 4 ? 'pl-8 text-[11px]' : 'text-xs font-semibold'} {isActive ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'}"
									>
										{#if isActive}
											<span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
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
							<div class="pt-4 border-t border-neutral-800/80">
								<button
									type="button"
									onclick={() => {
										onClose();
										onSelectModality(reading.targetModalityId);
									}}
									class="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
								>
									<span>Open Studio ({reading.targetModalityId.toUpperCase()})</span>
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
					class="flex-1 overflow-y-auto reader-scrollbar p-6 md:p-10 selection:bg-amber-500 selection:text-neutral-950 relative scroll-smooth"
				>
					<div class="mx-auto {widthClass} space-y-8 {fontClass} {sizeClass}">
						<!-- Core Mental Model Hero Ribbon -->
						<div class="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 border border-amber-500/30 shadow-xl space-y-4">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
								<div class="flex items-center gap-2">
									<Sparkles class="w-4 h-4 text-amber-400" />
									<span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
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
										<span>Launch Studio {reading.targetModalityId.toUpperCase()}</span>
										<ArrowRight class="w-3.5 h-3.5" />
									</button>
								{/if}
							</div>

							<blockquote class="text-sm md:text-base font-serif italic text-neutral-100 leading-relaxed border-l-2 border-amber-500 pl-4">
								"{reading.keyMentalModel}"
							</blockquote>

							<div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800/80 text-xs text-neutral-400">
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
						<div class="my-10 p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-5">
							<div class="flex items-center justify-between border-b border-neutral-800 pb-4">
								<div class="flex items-center gap-3">
									<div class="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
										<BookOpen class="w-5 h-5" />
									</div>
									<div>
										<h3 class="text-sm md:text-base font-bold text-white">Finished Reading {reading.code}?</h3>
										<p class="text-xs text-neutral-400">Cement the mental model into your studio practice.</p>
									</div>
								</div>

								<button
									type="button"
									onclick={toggleReadingStatus}
									class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer {isCompleted ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow' : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow'}"
								>
									{#if isCompleted}
										<CheckCircle2 class="w-4 h-4" />
										<span>Module Completed!</span>
									{:else}
										<Circle class="w-4 h-4" />
										<span>Sign Off & Complete Module</span>
									{/if}
								</button>
							</div>

							<!-- 1-Line Reflection Hook -->
							<div class="space-y-2">
								<label for="reading-reflection" class="block text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
									Studio Application Hook: What one directorial decision or refusal will you test today?
								</label>
								<div class="flex items-center gap-2">
									<input
										id="reading-reflection"
										type="text"
										bind:value={reflectionInput}
										placeholder="e.g. In today's visual rep, I will audit the 3 major value masses before evaluating lighting details..."
										class="flex-1 bg-neutral-900 border border-neutral-800 px-3.5 py-2.5 rounded-xl text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition"
										onkeydown={(e) => { if (e.key === 'Enter') saveReflection(); }}
									/>
									<button
										type="button"
										onclick={saveReflection}
										class="px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-1.5 cursor-pointer shrink-0"
									>
										<Send class="w-3.5 h-3.5 text-amber-400" />
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

						<!-- Next / Previous Module Navigation Cards -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
							<button
								type="button"
								onclick={goToPrev}
								class="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/40 transition text-left space-y-1 cursor-pointer group"
							>
								<div class="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 group-hover:text-amber-400 transition">
									<ChevronLeft class="w-3.5 h-3.5" />
									<span>Previous Module</span>
								</div>
								<div class="font-bold text-xs md:text-sm text-neutral-200 group-hover:text-white truncate">
									Cycle Backward (←)
								</div>
							</button>

							<button
								type="button"
								onclick={goToNext}
								class="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/40 transition text-right space-y-1 cursor-pointer group"
							>
								<div class="flex items-center justify-end gap-1.5 text-[11px] font-mono text-neutral-500 group-hover:text-amber-400 transition">
									<span>Next Module</span>
									<ChevronRight class="w-3.5 h-3.5" />
								</div>
								<div class="font-bold text-xs md:text-sm text-neutral-200 group-hover:text-white truncate">
									Cycle Forward (→)
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Footer Quick Module Switcher Ribbon -->
			<div class="{themeHeaderClass} px-4 py-2.5 border-t flex items-center justify-between text-xs text-neutral-500 shrink-0">
				<div class="flex items-center gap-1 overflow-x-auto py-0.5">
					<span class="text-[10px] font-mono uppercase text-neutral-500 mr-1 hidden sm:inline">Jump:</span>
					{#each CORE_READINGS as mod}
						{@const isModDone = practiceStore.isReadingCompleted(mod.code)}
						<button
							type="button"
							onclick={() => {
								onSelectReading(mod);
								if (scrollContainerRef) scrollContainerRef.scrollTop = 0;
							}}
							class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer {mod.code === reading.code ? 'bg-amber-500 text-neutral-950 shadow' : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800'}"
							title="{mod.code} — {mod.title}"
						>
							{#if isModDone}
								<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
							{/if}
							<span>{mod.code}</span>
						</button>
					{/each}
				</div>

				<div class="text-[11px] text-neutral-400 hidden lg:block shrink-0 pl-3">
					<kbd class="px-1 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-[10px]">←</kbd> <kbd class="px-1 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-[10px]">→</kbd> cycle • <kbd class="px-1 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-[10px]">ESC</kbd> exit
				</div>
			</div>
		</div>
	</div>
{/if}
