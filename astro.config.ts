import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const proxy = {
	"/api": {
		target: "http://localhost:8008",
		changeOrigin: true,
		cookieDomainRewrite: "dawdle.space",
		ws: true,
	},
};

// https://astro.build/config
export default defineConfig({
	integrations: [sitemap(), react()],
	site: "https://dawdle.space",
	compressHTML: true,
	prefetch: true,
	vite: {
		ssr: { noExternal: ["monaco-editor"] },
		server: { proxy },
		preview: { proxy },
		css: { transformer: "lightningcss" },
	},
});
