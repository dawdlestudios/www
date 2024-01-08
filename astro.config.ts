import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

const backend = {
	target: "http://localhost:8008",
	changeOrigin: true,
	cookieDomainRewrite: "dawdle.space",
};

// https://astro.build/config
export default defineConfig({
	integrations: [sitemap(), react()],
	site: "https://dawdle.space",
	compressHTML: true,
	prefetch: true,
	vite: {
		server: {
			proxy: {
				"/api": backend,
			},
		},
	},
});
