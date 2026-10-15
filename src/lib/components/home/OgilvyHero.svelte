<script lang="ts">
	import { ArrowRight, Compass, ShieldCheck, Flame, Cpu, Eye, CheckCircle2, Sparkles, Terminal, Clock } from '@lucide/svelte';
</script>

<section class="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-neutral-800/80">
	<!-- Subtle ambient warm glow illumination -->
	<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[140px] pointer-events-none rounded-full"></div>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
		<!-- Product Identification Eyebrow -->
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-400 text-xs font-mono uppercase tracking-widest font-semibold shadow-inner">
			<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
			<span>Open-Access Curriculum & Deliberate Practice Studio</span>
		</div>

		<!-- Ogilvy Headline (Arresting, Specific, High-Intellect) -->
		<h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-[1.12] sm:leading-[1.14] max-w-5xl mx-auto">
			When Any Machine Can Render a Masterpiece in Three Seconds,
			<span class="block mt-2 italic text-amber-400 font-serif font-medium">
				The Only Thing That Matters Is Knowing What to Ask For—and When to Throw It Away.
			</span>
		</h1>

		<!-- Unmistakable Plain-English Definition & Core Pitch -->
		<div class="max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-neutral-300 font-serif leading-relaxed text-justify sm:text-center">
			<p class="font-medium text-amber-200/90 text-sm sm:text-base font-sans">
				A comprehensive 9-month curriculum and in-browser workbench designed to transition creative practitioners from prompt-dependent operators to sovereign creative directors.
			</p>
			<p class="text-neutral-400 font-serif text-sm sm:text-base leading-relaxed">
				Generative AI has driven execution cost to zero, flooding the world with frictionless mediocrity. The true bottleneck has moved upstream—to diagnostic vision, non-instrumental attention, 7-layer structural constraints, predictive calibration, and the moral courage of refusal.
			</p>
		</div>

		<!-- Action CTAs -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
			<a
				href="/app?tab=today"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
			>
				<span>Enter Practice Studio (Free)</span>
				<ArrowRight class="w-4 h-4" />
			</a>

			<a
				href="#syllabus"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm sm:text-base transition cursor-pointer"
			>
				<Compass class="w-4 h-4 text-amber-400" />
				<span>Examine 18-Week Syllabus</span>
			</a>

			<a
				href="#diagnostic"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/80 text-neutral-300 hover:text-white font-mono text-xs sm:text-sm transition cursor-pointer"
			>
				<Eye class="w-3.5 h-3.5 text-amber-500" />
				<span>Take 2-Min Taste Test</span>
			</a>
		</div>

		<!-- Hero Visual Proof Card: Studio Interface Teaser -->
		<div class="pt-6 max-w-4xl mx-auto text-left">
			<div class="rounded-3xl border border-neutral-800/90 bg-neutral-900/50 p-4 sm:p-6 shadow-2xl backdrop-blur-sm space-y-4">
				<div class="flex items-center justify-between pb-3 border-b border-neutral-800">
					<div class="flex items-center gap-2 text-xs font-mono">
						<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
						<span class="text-white font-bold">Studio Active</span>
						<span class="text-neutral-500">•</span>
						<span class="text-neutral-400">Day 1: Part I (Find & Observe)</span>
					</div>
					<div class="flex items-center gap-2 text-xs font-mono text-neutral-400">
						<Clock class="w-3.5 h-3.5 text-amber-500" />
						<span>10m Logbook Timer Ready</span>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div class="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
						<div class="text-[10px] font-mono uppercase text-amber-500 font-bold">Today's Reading</div>
						<div class="text-xs font-serif font-bold text-white truncate">Module 01: The Diagnostic Ladder</div>
						<div class="text-[11px] text-neutral-400">Top-down visual & textual hierarchies</div>
					</div>

					<div class="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
						<div class="text-[10px] font-mono uppercase text-amber-500 font-bold">Active Drill</div>
						<div class="text-xs font-serif font-bold text-white truncate">5-Second Flash Massing</div>
						<div class="text-[11px] text-neutral-400">Reconstruct focal planes without adjectives</div>
					</div>

					<div class="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
						<div class="text-[10px] font-mono uppercase text-amber-500 font-bold">Studio Engine</div>
						<div class="text-xs font-serif font-bold text-white truncate">Zero-Adjective Regex Linter</div>
						<div class="text-[11px] text-emerald-400 font-mono font-medium">Active • 0% Adjective Bias</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Trust & Pedigree Metrics Strip -->
		<div class="pt-8 border-t border-neutral-900 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
			<div class="p-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
				<div class="text-xs font-mono uppercase text-neutral-500 font-semibold">Exhaustive Curriculum</div>
				<div class="text-base sm:text-xl font-serif font-black text-white mt-0.5">81 Modules</div>
				<div class="text-[11px] text-neutral-400 font-sans">Parts I–VI + 6 Mo Independent</div>
			</div>

			<div class="p-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
				<div class="text-xs font-mono uppercase text-neutral-500 font-semibold">Proof of Work</div>
				<div class="text-base sm:text-xl font-serif font-black text-white mt-0.5">12 Major Projects</div>
				<div class="text-[11px] text-neutral-400 font-sans">Diagnostic portfolios & capstone</div>
			</div>

			<div class="p-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
				<div class="text-xs font-mono uppercase text-neutral-500 font-semibold">In-Browser Studios</div>
				<div class="text-base sm:text-xl font-serif font-black text-white mt-0.5">8 Modality Labs</div>
				<div class="text-[11px] text-neutral-400 font-sans">Regex linters & Brier calibration</div>
			</div>

			<div class="p-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
				<div class="text-xs font-mono uppercase text-neutral-500 font-semibold">Sovereign Privacy</div>
				<div class="text-base sm:text-xl font-serif font-black text-white mt-0.5">100% Local-First</div>
				<div class="text-[11px] text-neutral-400 font-sans">Zero telemetry • No logins needed</div>
			</div>
		</div>
	</div>
</section>
