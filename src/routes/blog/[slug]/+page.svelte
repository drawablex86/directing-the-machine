<script lang="ts">
	import type { PageData } from './$types';
	import BlogHeader from '$lib/components/blog/BlogHeader.svelte';
	import BlogStudioCallout from '$lib/components/blog/BlogStudioCallout.svelte';
	import HomeFooter from '$lib/components/home/HomeFooter.svelte';
	import { renderMarkdownReading } from '$lib/engine/markdown-renderer';
	import { BLOG_POSTS } from '$lib/data/blog/posts';
	import { Clock, Calendar, ArrowRight, Share2, BookOpen, Sparkles, Terminal, ChevronRight } from '@lucide/svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const post = $derived(data.post);
	const rendered = $derived(renderMarkdownReading(post.content));

	const relatedPosts = $derived(
		BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)
	);

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BlogPosting',
				'@id': `https://directingthemachine.com/blog/${post.slug}#article`,
				'headline': post.title,
				'description': post.summary,
				'datePublished': post.publishedAt,
				'dateModified': post.updatedAt || post.publishedAt,
				'inLanguage': 'en',
				'mainEntityOfPage': `https://directingthemachine.com/blog/${post.slug}`,
				'author': {
					'@type': 'Person',
					'name': post.author.name,
					'url': post.author.url,
					'jobTitle': post.author.title
				},
				'publisher': {
					'@type': 'EducationalOrganization',
					'name': 'Directing the Machine',
					'url': 'https://directingthemachine.com'
				},
				'keywords': post.targetKeywords.join(', '),
				'articleSection': post.category
			},
			{
				'@type': 'BreadcrumbList',
				'@id': `https://directingthemachine.com/blog/${post.slug}#breadcrumbs`,
				'itemListElement': [
					{
						'@type': 'ListItem',
						'position': 1,
						'name': 'Home',
						'item': 'https://directingthemachine.com'
					},
					{
						'@type': 'ListItem',
						'position': 2,
						'name': 'Field Essays',
						'item': 'https://directingthemachine.com/blog'
					},
					{
						'@type': 'ListItem',
						'position': 3,
						'name': post.title,
						'item': `https://directingthemachine.com/blog/${post.slug}`
					}
				]
			}
		]
	});
</script>

<svelte:head>
	<title>{post.title} — Directing the Machine</title>
	<meta name="description" content={post.summary} />
	<meta name="author" content={post.author.name} />
	<link rel="canonical" href="https://directingthemachine.com/blog/{post.slug}" />
	<meta name="robots" content="index, follow" />

	<!-- OpenGraph -->
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{post.title} — Directing the Machine" />
	<meta property="og:description" content={post.summary} />
	<meta property="og:url" content="https://directingthemachine.com/blog/{post.slug}" />
	<meta property="og:site_name" content="Directing the Machine" />
	<meta property="article:published_time" content={post.publishedAt} />
	<meta property="article:author" content={post.author.name} />
	<meta property="article:section" content={post.category} />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{post.title} — Directing the Machine" />
	<meta name="twitter:description" content={post.summary} />

	<!-- JSON-LD Structured Data for Deep SEO & Google Rich Snippets -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 antialiased font-sans">
	<BlogHeader title={post.title} />

	<main id="main-content" class="flex-1 py-10 md:py-16">
		<article class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Breadcrumb Navigation -->
			<nav class="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-8 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
				<a href="/" class="hover:text-amber-400 transition">Home</a>
				<ChevronRight class="w-3.5 h-3.5 text-neutral-600 shrink-0" />
				<a href="/blog" class="hover:text-amber-400 transition">Field Essays</a>
				<ChevronRight class="w-3.5 h-3.5 text-neutral-600 shrink-0" />
				<span class="text-neutral-300 truncate max-w-xs">{post.title}</span>
			</nav>

			<!-- Header Matter -->
			<header class="max-w-3xl space-y-6 pb-10 border-b border-neutral-900">
				<!-- Category & Read Time -->
				<div class="flex flex-wrap items-center gap-3 text-xs font-mono">
					<span class="px-2.5 py-1 rounded-md border text-amber-400 bg-amber-500/10 border-amber-500/30 font-semibold uppercase tracking-wider">
						{post.category}
					</span>

					<div class="flex items-center gap-1.5 text-neutral-400">
						<Clock class="w-3.5 h-3.5 text-neutral-500" />
						<span>{rendered.readingTimeMinutes} min read ({rendered.wordCount} words)</span>
					</div>

					<span class="text-neutral-600">•</span>

					<div class="flex items-center gap-1.5 text-neutral-400">
						<Calendar class="w-3.5 h-3.5 text-neutral-500" />
						<time datetime={post.publishedAt}>{post.publishedAt}</time>
					</div>
				</div>

				<!-- Main Headline -->
				<h1 class="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight leading-tight">
					{post.title}
				</h1>

				<!-- Subtitle / Stance -->
				<p class="text-base sm:text-xl font-serif text-neutral-300 leading-relaxed italic">
					"{post.subtitle}"
				</p>

				<!-- Author Byline -->
				<div class="pt-4 flex items-center justify-between border-t border-neutral-900/80">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-serif font-black text-amber-500 text-base">
							R
						</div>
						<div>
							<div class="text-sm font-serif font-bold text-white">
								{post.author.name}
							</div>
							<div class="text-xs font-mono text-neutral-400">
								{post.author.title}
							</div>
						</div>
					</div>

					<!-- Direct Studio Jump Link -->
					<a
						href={post.studioHook.href}
						class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition"
					>
						<Sparkles class="w-3.5 h-3.5" />
						<span>{post.studioHook.label}</span>
					</a>
				</div>
			</header>

			<!-- Article Grid: Main Prose + Sticky TOC Sidebar -->
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
				<!-- Left Prose Column -->
				<div class="lg:col-span-8 space-y-8">
					<!-- Rendered Markdown Body -->
					<div class="prose prose-invert max-w-none font-serif text-neutral-200 text-base sm:text-lg leading-relaxed selection:bg-amber-500 selection:text-neutral-950">
						{@html rendered.html}
					</div>

					<!-- Contextual Studio Lab Callout -->
					<BlogStudioCallout hook={post.studioHook} />

					<!-- Author Biographical Box / Attribution Colophon -->
					<section class="p-6 sm:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
						<div class="flex items-center gap-3">
							<div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-serif font-black text-amber-500 text-lg">
								RR
							</div>
							<div>
								<h3 class="font-serif font-bold text-base text-white">
									About Rahul Rajeev
								</h3>
								<p class="text-xs font-mono text-neutral-400">
									Conceived, designed, built, and maintains Directing the Machine.
								</p>
							</div>
						</div>

						<p class="text-sm font-serif text-neutral-300 leading-relaxed">
							Directing the Machine is an open-access meta-curriculum and deliberate practice environment created to restore diagnostic vision, taste, and moral authorship in an era of automated synthesis. Everything is 100% free, local-first, and private.
						</p>

						<div class="pt-2 flex flex-wrap gap-3">
							<a
								href="/app?tab=today"
								class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition shadow-md shadow-amber-500/10"
							>
								<span>Start Today's Studio Practice</span>
								<ArrowRight class="w-3.5 h-3.5" />
							</a>
							<a
								href="/app?tab=curriculum"
								class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold transition"
							>
								<span>Full 18-Week Syllabus</span>
							</a>
						</div>
					</section>

					<!-- Related Articles -->
					{#if relatedPosts.length > 0}
						<div class="pt-10 border-t border-neutral-900 space-y-6">
							<h3 class="text-xl font-serif font-bold text-white tracking-tight">
								Continue Reading Field Essays
							</h3>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{#each relatedPosts as rel}
									<a
										href="/blog/{rel.slug}"
										class="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900/70 hover:border-amber-500/30 transition group flex flex-col justify-between"
									>
										<div class="space-y-2">
											<span class="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
												{rel.category}
											</span>
											<h4 class="font-serif font-bold text-sm text-neutral-200 group-hover:text-amber-400 transition leading-snug">
												{rel.title}
											</h4>
										</div>

										<div class="pt-4 flex items-center justify-between text-[11px] font-mono text-neutral-400">
											<span>{rel.readingTimeMinutes} min read</span>
											<span class="text-amber-400 group-hover:translate-x-1 transition-transform">Read →</span>
										</div>
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<!-- Right Sticky Sidebar: Table of Contents & Quick Links -->
				<aside class="hidden lg:block lg:col-span-4">
					<div class="sticky top-20 space-y-6">
						<!-- Table of Contents Card -->
						{#if rendered.toc.length > 0}
							<div class="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 space-y-4 shadow-lg">
								<div class="flex items-center gap-2 text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
									<BookOpen class="w-3.5 h-3.5 text-amber-400" />
									<span>Table of Contents</span>
								</div>

								<nav class="space-y-2 text-xs font-serif">
									{#each rendered.toc as item}
										<a
											href="#{item.id}"
											class="block text-neutral-400 hover:text-amber-400 transition py-0.5 leading-snug {item.level === 3 ? 'pl-3 text-xs text-neutral-400' : 'font-medium text-neutral-300'}"
										>
											{item.title}
										</a>
									{/each}
								</nav>
							</div>
						{/if}

						<!-- Quick Target Keywords Cloud -->
						<div class="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/20 space-y-3">
							<div class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
								Target Search Intents
							</div>
							<div class="flex flex-wrap gap-1.5">
								{#each post.targetKeywords as kw}
									<span class="px-2.5 py-1 rounded-lg text-[11px] font-mono text-neutral-300 bg-neutral-900 border border-neutral-800">
										{kw}
									</span>
								{/each}
							</div>
						</div>

						<!-- Studio Lab Shortcut Pill Card -->
						<div class="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
							<div class="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
								<Terminal class="w-3.5 h-3.5" />
								<span>Interactive Studio</span>
							</div>
							<p class="text-xs font-serif text-neutral-300 leading-relaxed">
								{post.studioHook.description}
							</p>
							<a
								href={post.studioHook.href}
								class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
							>
								<span>Launch {post.studioHook.label}</span>
								<ArrowRight class="w-3.5 h-3.5" />
							</a>
						</div>
					</div>
				</aside>
			</div>
		</article>
	</main>

	<HomeFooter />
</div>
