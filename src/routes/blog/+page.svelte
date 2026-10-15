<script lang="ts">
	import HomeNavbar from '$lib/components/home/HomeNavbar.svelte';
	import HomeFooter from '$lib/components/home/HomeFooter.svelte';
	import BlogCard from '$lib/components/blog/BlogCard.svelte';
	import { BLOG_POSTS, type BlogCategory } from '$lib/data/blog/posts';
	import { BookOpen, Sparkles, Compass, Search, ArrowRight, Filter } from '@lucide/svelte';

	let searchQuery = $state('');
	let selectedCategory = $state<string>('All');

	const categories = ['All', 'Direction', 'Taste & Curation', 'Calibration', 'Authorship'];

	const filteredPosts = $derived(
		BLOG_POSTS.filter((post) => {
			const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				post.title.toLowerCase().includes(q) ||
				post.summary.toLowerCase().includes(q) ||
				post.targetKeywords.some((kw) => kw.toLowerCase().includes(q));
			return matchesCategory && matchesSearch;
		})
	);

	const featuredPost = $derived(BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0]);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'name': 'Field Essays — Directing the Machine',
		'description':
			'Critical dispatches and technical guides on creative direction, diagnostic taste, 7-layer briefs, and blank-sheet authorship in the generative AI era. Authored by Rahul Rajeev.',
		'url': 'https://directingthemachine.com/blog',
		'publisher': {
			'@type': 'EducationalOrganization',
			'name': 'Directing the Machine',
			'url': 'https://directingthemachine.com'
		}
	};
</script>

<svelte:head>
	<title>Field Essays & Dispatches — Directing the Machine</title>
	<meta
		name="description"
		content="Authoritative frameworks on creative direction, diagnostic taste, the 40% human anchor rule, and blank-sheet authorship in generative AI. By Rahul Rajeev."
	/>
	<link rel="canonical" href="https://directingthemachine.com/blog" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Field Essays — Directing the Machine" />
	<meta
		property="og:description"
		content="When execution is commoditized, sensibility is the only durable moat. Critical dispatches on directing generative AI with taste and intent."
	/>
	<meta property="og:url" content="https://directingthemachine.com/blog" />
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 antialiased font-sans">
	<HomeNavbar />

	<main id="main-content" class="flex-1 py-12 md:py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
			<!-- Header / Editorial Statement -->
			<div class="max-w-3xl space-y-5">
				<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold">
					<BookOpen class="w-3.5 h-3.5" />
					<span>Field Essays & Critical Dispatches</span>
				</div>

				<h1 class="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
					"The master does not fear the machine’s speed.  
					<span class="block italic text-amber-400 font-serif font-medium mt-1">
						The master fears having nothing singular to ask of it."
					</span>
				</h1>

				<p class="text-base sm:text-lg font-serif text-neutral-300 leading-relaxed">
					Long-form inquiry into creative direction, negative constraints, diagnostic taste, and blank-sheet authorship in an AI-augmented world. Written and curated by <strong class="text-white font-medium">Rahul Rajeev</strong>.
				</p>
			</div>

			<!-- Featured Post Hero Banner -->
			{#if featuredPost && selectedCategory === 'All' && !searchQuery}
				<section class="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-neutral-900/80 to-neutral-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
					<div class="max-w-3xl space-y-4">
						<div class="flex items-center gap-2 text-xs font-mono">
							<span class="px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider">
								Featured Dispatch
							</span>
							<span class="text-neutral-400">•</span>
							<span class="text-neutral-400">{featuredPost.readingTimeMinutes} min read</span>
						</div>

						<h2 class="text-2xl sm:text-4xl font-serif font-black text-white group-hover:text-amber-400 transition tracking-tight leading-snug">
							<a href="/blog/{featuredPost.slug}">
								{featuredPost.title}
							</a>
						</h2>

						<p class="text-sm sm:text-base font-serif text-neutral-300 leading-relaxed">
							{featuredPost.subtitle}
						</p>

						<div class="pt-4 flex flex-wrap items-center gap-4">
							<a
								href="/blog/{featuredPost.slug}"
								class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
							>
								<span>Read Full Essay</span>
								<ArrowRight class="w-4 h-4" />
							</a>

							<a
								href={featuredPost.studioHook.href}
								class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold transition"
							>
								<Sparkles class="w-3.5 h-3.5 text-amber-400" />
								<span>{featuredPost.studioHook.label}</span>
							</a>
						</div>
					</div>
				</section>
			{/if}

			<!-- Filter & Search Bar -->
			<div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-neutral-900">
				<!-- Category Filter Pills -->
				<div class="flex flex-wrap items-center gap-2">
					{#each categories as cat}
						<button
							type="button"
							onclick={() => (selectedCategory = cat)}
							class="px-3.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer {selectedCategory === cat
								? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
								: 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'}"
						>
							{cat}
						</button>
					{/each}
				</div>

				<!-- Search Input -->
				<div class="relative w-full md:w-72">
					<Search class="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search essays, keywords..."
						class="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 focus:border-amber-500 text-xs text-white placeholder-neutral-500 focus:outline-none transition font-sans"
					/>
				</div>
			</div>

			<!-- Posts Grid -->
			{#if filteredPosts.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each filteredPosts as post (post.slug)}
						<BlogCard {post} />
					{/each}
				</div>
			{:else}
				<div class="p-12 text-center rounded-2xl border border-neutral-800/80 bg-neutral-900/20 space-y-3">
					<p class="font-serif text-lg text-neutral-300">No essays match your search criteria.</p>
					<button
						type="button"
						onclick={() => {
							searchQuery = '';
							selectedCategory = 'All';
						}}
						class="text-xs font-mono text-amber-400 hover:underline cursor-pointer"
					>
						Reset filters
					</button>
				</div>
			{/if}

			<!-- Bottom Ogilvy Studio Conversion Block -->
			<section class="mt-16 rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8 sm:p-12 text-center space-y-6">
				<div class="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
					<Compass class="w-6 h-6" />
				</div>

				<h3 class="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
					Ready to practice what you read?
				</h3>

				<p class="text-sm font-serif text-neutral-300 max-w-xl mx-auto leading-relaxed">
					Directing the Machine is not merely an essay publication. It is an 18-week curriculum and 8 deliberate practice studios running entirely in your browser with zero paywalls.
				</p>

				<div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
					<a
						href="/app"
						class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition cursor-pointer"
					>
						<span>Launch Studio Workbench</span>
						<ArrowRight class="w-4 h-4" />
					</a>

					<a
						href="/app?tab=curriculum"
						class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold transition cursor-pointer"
					>
						<span>View 18-Week Syllabus</span>
					</a>
				</div>
			</section>
		</div>
	</main>

	<HomeFooter />
</div>
