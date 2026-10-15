<script lang="ts">
	import { BLOG_POSTS } from '$lib/data/blog/posts';
	import BlogCard from '$lib/components/blog/BlogCard.svelte';
	import { BookOpen, ArrowRight, Sparkles } from '@lucide/svelte';

	const latestPosts = BLOG_POSTS.slice(0, 3);
</script>

<section id="essays" class="py-20 md:py-28 bg-neutral-950 border-t border-neutral-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
		<!-- Section Header -->
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-900 pb-8">
			<div class="max-w-2xl space-y-3">
				<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold">
					<BookOpen class="w-3.5 h-3.5" />
					<span>Field Essays & Critical Dispatches</span>
				</div>

				<h2 class="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight">
					Beyond Prompting: The Theoretical Spine
				</h2>

				<p class="text-sm sm:text-base font-serif text-neutral-400 leading-relaxed">
					Long-form frameworks on the death of prompt tricks, the mathematics of aesthetic homogenization, negative constraints, and blank-sheet authorship.
				</p>
			</div>

			<a
				href="/blog"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold transition self-start md:self-auto cursor-pointer"
			>
				<span>View All Dispatches</span>
				<ArrowRight class="w-3.5 h-3.5 text-amber-400" />
			</a>
		</div>

		<!-- Posts Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each latestPosts as post (post.slug)}
				<BlogCard {post} />
			{/each}
		</div>
	</div>
</section>
