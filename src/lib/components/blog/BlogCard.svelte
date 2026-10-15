<script lang="ts">
	import type { BlogPost } from '$lib/data/blog/posts';
	import { ArrowRight, Clock, Calendar, Sparkles, Terminal } from '@lucide/svelte';

	interface Props {
		post: BlogPost;
	}

	let { post }: Props = $props();

	const categoryColors: Record<BlogPost['category'], string> = {
		'Direction': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
		'Taste & Curation': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
		'Calibration': 'text-sky-400 bg-sky-500/10 border-sky-500/30',
		'Authorship': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
	};
</script>

<article class="group relative rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-amber-500/40 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-amber-500/5">
	<div class="space-y-4">
		<!-- Metadata row: Category, Reading Time, Date -->
		<div class="flex flex-wrap items-center gap-3 text-xs font-mono">
			<span class="px-2.5 py-1 rounded-md border font-semibold {categoryColors[post.category]}">
				{post.category}
			</span>

			<div class="flex items-center gap-1.5 text-neutral-400">
				<Clock class="w-3.5 h-3.5 text-neutral-500" />
				<span>{post.readingTimeMinutes} min read</span>
			</div>

			<span class="text-neutral-600">•</span>

			<div class="flex items-center gap-1.5 text-neutral-400">
				<Calendar class="w-3.5 h-3.5 text-neutral-500" />
				<time datetime={post.publishedAt}>{post.publishedAt}</time>
			</div>
		</div>

		<!-- Title & Subtitle -->
		<div class="space-y-2">
			<h2 class="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-400 transition tracking-tight leading-snug">
				<a href="/blog/{post.slug}" class="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-sm">
					{post.title}
				</a>
			</h2>
			<p class="text-sm font-serif text-neutral-300 line-clamp-3 leading-relaxed">
				{post.summary}
			</p>
		</div>

		<!-- Keyword Tags -->
		<div class="flex flex-wrap gap-1.5 pt-1">
			{#each post.targetKeywords.slice(0, 3) as kw}
				<span class="px-2 py-0.5 rounded text-[11px] font-mono text-neutral-400 bg-neutral-800/60 border border-neutral-700/50">
					#{kw}
				</span>
			{/each}
		</div>
	</div>

	<!-- Footer Action -->
	<div class="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs">
		<div class="flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
			<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
			<span>By {post.author.name}</span>
		</div>

		<a
			href="/blog/{post.slug}"
			class="inline-flex items-center gap-1.5 font-bold text-amber-400 group-hover:text-amber-300 transition cursor-pointer"
		>
			<span>Read Dispatch</span>
			<ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
		</a>
	</div>
</article>
