import { BLOG_POSTS } from '$lib/data/blog/posts';
import { SITE_CONFIG } from '$lib/config/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const siteUrl = SITE_CONFIG.url;

	const itemsXml = BLOG_POSTS.map((post) => {
		const pubDate = new Date(post.publishedAt).toUTCString();
		const link = `${siteUrl}/blog/${post.slug}`;
		return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
      <category>${post.category}</category>
      <author>rahulrajeev1975@gmail.com (Rahul Rajeev)</author>
    </item>`;
	}).join('\n');

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Directing the Machine — Field Essays</title>
    <link>${siteUrl}/blog</link>
    <description>Critical dispatches on creative direction, diagnostic taste, the 40% human anchor rule, and blank-sheet authorship in the generative AI era. Conceived, written, and engineered by Rahul Rajeev.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

	return new Response(rss.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
