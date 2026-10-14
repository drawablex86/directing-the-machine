<script lang="ts">
	import { ArrowRight, Compass, ShieldCheck, Flame, Cpu, Eye, CheckCircle2 } from '@lucide/svelte';
</script>

<section class="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-neutral-800/80">
	<!-- Subtle ambient illumination -->
	<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full"></div>

	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
		<!-- Ogilvy Eyebrow -->
		<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-mono uppercase tracking-widest">
			<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
			<span>A Practicum in Intent & Sensitivity for the Post-Execution Era</span>
		</div>

		<!-- Ogilvy Headline (Arresting, Specific, High-Intellect) -->
		<h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-[1.12] sm:leading-[1.15]">
			When Any Machine Can Render a Masterpiece in Three Seconds,
			<span class="block mt-2 italic text-amber-400/90 font-serif font-medium">
				The Only Thing That Matters Is Knowing What to Ask For—and When to Throw It Away.
			</span>
		</h1>

		<!-- Ogilvy Body Copy: Authoritative, Factual, Direct -->
		<div class="max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-neutral-300 font-serif leading-relaxed text-justify sm:text-center">
			<p>
				The tech industry promised that generative intelligence would turn everyone into an art director. Instead, it flooded the internet with frictionless mediocrity: derivative prose, uncanny synthetic imagery, and homogenised answers polished to an immaculate sheen.
			</p>
			<p class="text-neutral-400 font-sans text-sm sm:text-base">
				The fatal mistake was believing execution was the bottleneck. <strong class="text-white font-semibold">Execution has fallen to zero marginal cost.</strong> The true bottleneck has moved upstream—to problem-finding, non-instrumental attention, diagnostic taste, the courage of refusal, and ethical authorship.
			</p>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
			<a
				href="/app"
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
				<span>Examine 18-Week Curriculum</span>
			</a>
		</div>

		<!-- Trust & Pedigree Strip -->
		<div class="pt-10 border-t border-neutral-900 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
			<div class="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
				<div class="text-xs font-mono uppercase text-neutral-500">Curriculum Spine</div>
				<div class="text-base sm:text-lg font-serif font-bold text-white mt-0.5">18 Weeks</div>
				<div class="text-[11px] text-neutral-400">Parts I–VI + 6 Mo Independent</div>
			</div>

			<div class="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
				<div class="text-xs font-mono uppercase text-neutral-500">Proof of Work</div>
				<div class="text-base sm:text-lg font-serif font-bold text-white mt-0.5">12 Milestone Projects</div>
				<div class="text-[11px] text-neutral-400">Portfolios, Briefs & Capstones</div>
			</div>

			<div class="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
				<div class="text-xs font-mono uppercase text-neutral-500">Interactive Labs</div>
				<div class="text-base sm:text-lg font-serif font-bold text-white mt-0.5">8 Studio Modalities</div>
				<div class="text-[11px] text-neutral-400">Zero-adjective & Brier engines</div>
			</div>

			<div class="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
				<div class="text-xs font-mono uppercase text-neutral-500">Privacy & Freedom</div>
				<div class="text-base sm:text-lg font-serif font-bold text-white mt-0.5">100% Local-First</div>
				<div class="text-[11px] text-neutral-400">Zero telemetry • No logins</div>
			</div>
		</div>
	</div>
</section>
