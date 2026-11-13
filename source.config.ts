// source.config.ts
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";

export const docs = defineDocs({
	dir: "src/app/docs",
	docs: {
		schema: frontmatterSchema.extend({
			title: z.string().optional().default(""),
			description: z.string().optional().default(""),
			preview: z.string().optional(),
			index: z.boolean().default(false),
		}),
	},
});

export default defineConfig({
	// fills page.data.lastModified from git history
	plugins: [lastModified()],
});
