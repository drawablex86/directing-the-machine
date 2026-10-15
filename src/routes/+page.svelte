<script lang="ts">
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import HomeNavbar from '$lib/components/home/HomeNavbar.svelte';
	import OgilvyHero from '$lib/components/home/OgilvyHero.svelte';
	import PromptVsDirectionMatrix from '$lib/components/home/PromptVsDirectionMatrix.svelte';
	import LiveLinterDemo from '$lib/components/home/LiveLinterDemo.svelte';
	import ThesesSection from '$lib/components/home/ThesesSection.svelte';
	import LabsShowcase from '$lib/components/home/LabsShowcase.svelte';
	import CurriculumProjectsExplorer from '$lib/components/home/CurriculumProjectsExplorer.svelte';
	import DailyLoopRhythm from '$lib/components/home/DailyLoopRhythm.svelte';
	import AudienceCriteria from '$lib/components/home/AudienceCriteria.svelte';
	import SensibilityDiagnostic from '$lib/components/home/SensibilityDiagnostic.svelte';
	import FieldEssaysSection from '$lib/components/home/FieldEssaysSection.svelte';
	import FaqSection from '$lib/components/home/FaqSection.svelte';
	import HomeFooter from '$lib/components/home/HomeFooter.svelte';
	import { ArrowRight, Sparkles, Terminal, Compass } from '@lucide/svelte';
</script>

<SeoHead />

<div class="flex flex-col min-h-screen">
	<HomeNavbar />

	<main id="main-content" class="flex-1">
		<!-- Movement 1: The Inciting Dilemma & Clear Product Definition -->
		<OgilvyHero />

		<!-- Movement 2: The Core Paradigm Shift (Prompt Engineering vs Creative Direction) -->
		<PromptVsDirectionMatrix />

		<!-- Movement 3: The Live Workbench (Interactive Zero-Adjective Linter Teaser) -->
		<LiveLinterDemo />

		<!-- Movement 4: Foundational Epistemology (The 5 Theses of Authorship) -->
		<ThesesSection />

		<!-- Movement 5A: The 8 Deliberate Studios (Interactive Modality Inspector) -->
		<LabsShowcase />

		<!-- Movement 5B: The 18-Week Apprenticeship Spine & 12 Project Dossiers -->
		<CurriculumProjectsExplorer />

		<!-- Movement 6A: The Daily Ritual (4-Step Loop & 10m Hemingway Hard Cap) -->
		<DailyLoopRhythm />

		<!-- Movement 6B: Honest Qualification (Who This Is For vs Who Should Turn Back) -->
		<AudienceCriteria />

		<!-- Movement 7A: 2-Minute Interactive Taste & Calibration Test -->
		<SensibilityDiagnostic />

		<!-- Movement 7B: Field Essays & Critical Dispatches (SEO Discovery Spine) -->
		<FieldEssaysSection />

		<!-- Movement 8: Long-Form Ogilvy Editorial Close -->
		<section class="py-20 md:py-28 bg-neutral-900/30 border-y border-neutral-800/80">
			<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
				<div class="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
					<Sparkles class="w-6 h-6" />
				</div>

				<h2 class="text-2xl sm:text-4xl font-serif font-bold text-neutral-100 tracking-tight leading-snug">
					“The master does not fear the machine’s speed.
					<span class="block italic text-amber-500 font-serif font-medium mt-1">
						The master fears having nothing singular to ask of it.”
					</span>
				</h2>

				<p class="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
					Stop consuming ephemeral prompt swipe files. Begin deliberate training in non-instrumental attention, diagnostic ladders, blind curation, mathematical calibration, and blank-sheet authorship today.
				</p>

				<div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
					<a
						href="/app?tab=today"
						class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer"
					>
						<span>Begin Day 1 Practice in Studio</span>
						<ArrowRight class="w-4 h-4" />
					</a>

					<a
						href="/app?tab=curriculum"
						class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-semibold transition cursor-pointer"
					>
						<Compass class="w-4 h-4 text-amber-400" />
						<span>View Full 18-Week Syllabus</span>
					</a>
				</div>
			</div>
		</section>

		<!-- Frequently Answered Questions & Clarifications -->
		<FaqSection />
	</main>

	<!-- Site Colophon with 'Built and maintained by Rahul Rajeev' -->
	<HomeFooter />
</div>
