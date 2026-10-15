import { BLOG_POSTS } from '$lib/data/blog/posts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const siteUrl = 'https://directingthemachine.com';
	const now = new Date().toISOString().split('T')[0];

	const staticPages = [
		{ path: '', changefreq: 'weekly', priority: '1.0', lastmod: now },
		{ path: '/app', changefreq: 'daily', priority: '0.9', lastmod: now },
		{ path: '/logs', changefreq: 'weekly', priority: '0.7', lastmod: now },
		{ path: '/blog', changefreq: 'daily', priority: '0.8', lastmod: now }
	];

	const postPages = BLOG_POSTS.map((post) => ({
		path: `/blog/${post.slug}`,
		changefreq: 'monthly',
		priority: '0.8',
		lastmod: post.updatedAt || post.publishedAt
	}));

	const allUrls = [...staticPages, ...postPages];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
	.map(
		(u) => `  <url>
    <loc>${siteUrl}${u.path}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
