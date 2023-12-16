import { z, defineCollection } from "astro:content";

const wikiCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
	}),
});

export const collections = {
	wiki: wikiCollection,
};
