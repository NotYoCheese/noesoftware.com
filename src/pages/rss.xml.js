import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const caseStudies = await getCollection('caseStudies');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: caseStudies.map((study) => ({
			...study.data,
			link: `/case-studies/${study.id}/`,
		})),
	});
}
