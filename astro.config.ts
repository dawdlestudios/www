import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	integrations: [sitemap(), react()],
	site: "https://dawdle.space",
	compressHTML: true,
	prefetch: true,
	vite: {
		server: {
			proxy: {
				"/api": {
					target: "http://localhost:8008",
					changeOrigin: true,
				},
			},
		},
	},
});
