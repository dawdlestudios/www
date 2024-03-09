import { defineCollection, z } from "astro:content";

const wikiCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		draft: z.boolean().optional(),
	}),
});

const guideCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		draft: z.boolean().optional(),
	}),
});

export const collections = {
	wiki: wikiCollection,
	guide: guideCollection,
};
