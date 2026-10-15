<script lang="ts">
	import { SITE_CONFIG } from '$lib/config/site';

	interface Props {
		title?: string;
		description?: string;
		canonical?: string;
		author?: string;
	}

	let {
		title = 'Directing the Machine — A Course in Creative Authorship for the AI-Augmented World',
		description = 'In a world where execution is automated by AI, develop your sensibility, diagnostic taste, and intent. An 18-week curriculum, 12 projects, and 8 deliberate practice studios. Conceived, built, and maintained by Rahul Rajeev.',
		canonical = SITE_CONFIG.url,
		author = SITE_CONFIG.author.name
	}: Props = $props();

	let structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'EducationalOrganization',
				'@id': `${SITE_CONFIG.url}/#organization`,
				'name': 'Directing the Machine',
				'url': SITE_CONFIG.url,
				'founder': {
					'@type': 'Person',
					'name': author,
					'url': SITE_CONFIG.author.url
				},
				'description': 'A curriculum and deliberate practice studio for creative authorship, judgment, and intent in the age of generative AI.'
			},
			{
				'@type': 'Course',
				'@id': `${SITE_CONFIG.url}/#course`,
				'name': 'Directing the Machine: Creative Authorship for the AI Era',
				'description': description,
				'provider': {
					'@id': `${SITE_CONFIG.url}/#organization`
				},
				'creator': {
					'@type': 'Person',
					'name': author
				},
				'inLanguage': 'en',
				'isAccessibleForFree': true,
				'hasCourseInstance': {
					'@type': 'CourseInstance',
					'courseMode': 'online',
					'courseWorkload': 'PT20H'
				},
				'syllabusSections': [
					{
						'@type': 'Syllabus',
						'name': 'Part I: Find & Observe (Weeks 1–2)',
						'description': 'Diagnostic vision, neutral observation without adjectives, 15 diagnoses, positionality check.'
					},
					{
						'@type': 'Syllabus',
						'name': 'Part II: Formulate (Weeks 3–4)',
						'description': 'Premise forge, the 7-layer brief, negative constraints, provenance stamping.'
					},
					{
						'@type': 'Syllabus',
						'name': 'Part III: Build & Calibrate (Weeks 5–6)',
						'description': '9-layer pipeline mapping, pre-run confidence locks, Brier score calibration.'
					},
					{
						'@type': 'Syllabus',
						'name': 'Part IV: Taste & Curate (Weeks 7–8)',
						'description': '5-part taste formula, blind provenance curation, 40% human anchor rule.'
					},
					{
						'@type': 'Syllabus',
						'name': 'Part V: Direct, Critique & Refuse (Weeks 9–10)',
						'description': 'Revision vs re-brief forks, stakeholder triage, ethical refusal composition.'
					},
					{
						'@type': 'Syllabus',
						'name': 'Part VI: Authorship & The Blank Sheet (Weeks 11–12)',
						'description': 'Scaffolding removal, unassisted Blank-Sheet synthesis capstone.'
					}
				]
			},
			{
				'@type': 'FAQPage',
				'@id': `${SITE_CONFIG.url}/#faq`,
				'mainEntity': [
					{
						'@type': 'Question',
						'name': 'Is Directing the Machine another prompt engineering course?',
						'acceptedAnswer': {
							'@type': 'Answer',
							'text': 'No. Prompt engineering treats AI as an execution trick. Directing the Machine treats AI as a production commodity, shifting focus upstream to where value actually resides: problem-finding, diagnostic taste, structural constraints, and moral authorship.'
						}
					},
					{
						'@type': 'Question',
						'name': 'Why is developing sensibility and intent more important than execution now?',
						'acceptedAnswer': {
							'@type': 'Answer',
							'text': 'Because generative AI has reduced the marginal cost of execution layers (rendering, prose drafting, boilerplate) to near zero. When anyone can generate infinite plausible variations in seconds, the bottleneck is knowing what is worth making, diagnosing structural failure, and having the discipline to throw mediocre outputs away.'
						}
					},
					{
						'@type': 'Question',
						'name': 'Who built and maintains Directing the Machine?',
						'acceptedAnswer': {
							'@type': 'Answer',
							'text': 'Directing the Machine was conceived, designed, built, and is maintained by Rahul Rajeev as an open-access, local-first meta-curriculum for disciplined creative practitioners.'
						}
					},
					{
						'@type': 'Question',
						'name': 'Is the course and studio app free?',
						'acceptedAnswer': {
							'@type': 'Answer',
							'text': 'Yes, 100% free and open. All 8 modality studios, 12 projects, rubrics, and diagnostic engines run entirely in your browser with zero paywalls, zero cloud tracking, and complete local data privacy.'
						}
					}
				]
			}
		]
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={canonical} />

	<!-- OpenGraph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content="Directing the Machine" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />

	<!-- JSON-LD Structured Data for Deep SEO -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>
