<script lang="ts">
	import { ArrowRight, Terminal, BookOpen, Compass, ShieldCheck, Heart } from '@lucide/svelte';
</script>

<footer class="bg-neutral-950 text-neutral-400 py-16 sm:py-20 border-t border-neutral-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
		<!-- Top Section: Brand Statement & CTA -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12 border-b border-neutral-900">
			<div class="lg:col-span-7 space-y-4">
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-serif font-black text-amber-500">
						D
					</div>
					<span class="font-serif font-bold text-lg text-white tracking-tight">
						Directing the Machine
					</span>
				</div>
				<p class="text-xs sm:text-sm font-serif text-neutral-400 max-w-xl leading-relaxed">
					A complete meta-curriculum and deliberate practice studio for creative authorship, judgment, and intent in the age of generative intelligence. The execution layer has fallen; sensibility is the only durable moat.
				</p>
			</div>

			<div class="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
				<a
					href="/app"
					class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/10 transition cursor-pointer"
				>
					<span>Open Studio Workbench</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>

				<a
					href="/logs"
					class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono text-xs transition cursor-pointer"
				>
					<Terminal class="w-3.5 h-3.5 text-amber-500" />
					<span>Practice Logs</span>
				</a>
			</div>
		</div>

		<!-- Links Columns -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
			<div class="space-y-3">
				<div class="font-mono uppercase text-neutral-300 font-bold tracking-wider">Curriculum</div>
				<ul class="space-y-2">
					<li><a href="/app?tab=curriculum" class="hover:text-amber-400 transition">Part I: Find & Observe (W1–2)</a></li>
					<li><a href="/app?tab=curriculum" class="hover:text-amber-400 transition">Part II: Formulate (W3–4)</a></li>
					<li><a href="/app?tab=curriculum" class="hover:text-amber-400 transition">Part III: Build & Calibrate (W5–6)</a></li>
					<li><a href="/app?tab=curriculum" class="hover:text-amber-400 transition">Part IV: Taste & Curate (W7–8)</a></li>
					<li><a href="/app?tab=curriculum" class="hover:text-amber-400 transition">Part V: Direct & Refuse (W9–10)</a></li>
					<li><a href="/app?tab=curriculum" class="hover:text-amber-400 transition">Part VI: Authorship (W11–12)</a></li>
				</ul>
			</div>

			<div class="space-y-3">
				<div class="font-mono uppercase text-neutral-300 font-bold tracking-wider">Interactive Labs</div>
				<ul class="space-y-2">
					<li><a href="/app?lab=m0" class="hover:text-amber-400 transition">M0: Baseline & Attention Contract</a></li>
					<li><a href="/app?lab=m1" class="hover:text-amber-400 transition">M1: Problem-Finding & Positionality</a></li>
					<li><a href="/app?lab=m2" class="hover:text-amber-400 transition">M2: Diagnostic Vision & Linter</a></li>
					<li><a href="/app?lab=m3" class="hover:text-amber-400 transition">M3: Premise & 7-Layer Brief</a></li>
					<li><a href="/app?lab=m4" class="hover:text-amber-400 transition">M4: Calibration & Brier Engine</a></li>
					<li><a href="/app?lab=m5" class="hover:text-amber-400 transition">M5: Taste & Blind Curation</a></li>
					<li><a href="/app?lab=m6" class="hover:text-amber-400 transition">M6: Direction & Refusal Studio</a></li>
					<li><a href="/app?lab=m7" class="hover:text-amber-400 transition">M7: Blank-Sheet Capstone</a></li>
				</ul>
			</div>

			<div class="space-y-3">
				<div class="font-mono uppercase text-neutral-300 font-bold tracking-wider">Field Reference</div>
				<ul class="space-y-2">
					<li><a href="/blog" class="text-amber-400 font-medium hover:text-amber-300 transition flex items-center gap-1.5"><BookOpen class="w-3 h-3" /><span>Field Essays & Blog</span></a></li>
					<li><a href="/app?tab=manual" class="hover:text-amber-400 transition">Field Manual (Appendices A–O)</a></li>
					<li><a href="/logs" class="hover:text-amber-400 transition">Unified Studio Logbook</a></li>
					<li><a href="/app?tab=assessment" class="hover:text-amber-400 transition">Decision vs Outcome Matrix</a></li>
					<li><a href="/blog/rss.xml" class="hover:text-amber-400 transition">RSS 2.0 Feed</a></li>
					<li><a href="/sitemap.xml" class="hover:text-amber-400 transition">XML Sitemap</a></li>
				</ul>
			</div>

			<div class="space-y-3">
				<div class="font-mono uppercase text-neutral-300 font-bold tracking-wider">Architecture</div>
				<ul class="space-y-2 text-neutral-400">
					<li class="flex items-center gap-1.5">
						<ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
						<span>100% Local-First Storage</span>
					</li>
					<li>Zero Trackers or Analytics</li>
					<li>Zero Paywalls or Gated Tiers</li>
					<li>Open Access Curriculum</li>
				</ul>
			</div>
		</div>

		<!-- Colophon & Creator Attribution -->
		<div class="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
			<div class="text-neutral-400 font-serif">
				Directing the Machine was conceived, written, engineered, and is <strong class="text-neutral-200 font-medium">built and maintained by Rahul Rajeev</strong>.
			</div>

			<div class="text-neutral-500 font-mono text-[11px]">
				All practice logs and briefs remain the sovereign property of the author.
			</div>
		</div>
	</div>
</footer>
