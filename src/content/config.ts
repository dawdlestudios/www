import { z, defineCollection } from "astro:content";

const wikiCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		draft: z.boolean().optional(),
	}),
});

export const collections = {
	wiki: wikiCollection,
};
