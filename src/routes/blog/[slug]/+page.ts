import { error } from '@sveltejs/kit';
import { BLOG_POSTS } from '$lib/data/blog/posts';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return BLOG_POSTS.map((post) => ({ slug: post.slug }));
};

export const load: PageLoad = ({ params }) => {
	const post = BLOG_POSTS.find((p) => p.slug === params.slug);
	if (!post) {
		error(404, `Essay not found: ${params.slug}`);
	}
	return { post };
};
