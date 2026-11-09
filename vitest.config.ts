// vitest.config.ts
import path from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

/**
 * Transforms MDX and JSON collection queries into valid module stubs for Node test execution.
 */
function createContentTestPlugin(): Plugin {
	return {
		name: "vitest-content-loader",
		transform(_code, id) {
			if (id.includes(".mdx")) {
				return {
					code: "export default function MDXContent() { return null; }; export const frontmatter = {};",
					map: null,
				};
			}
			if (id.includes(".json?collection=")) {
				return {
					code: "export default {};",
					map: null,
				};
			}
			return null;
		},
	};
}

export default defineConfig({
	plugins: [createContentTestPlugin()],
	test: {
		environment: "node",
		reporters: ["verbose"],
		include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
	},
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
			".source": path.resolve(import.meta.dirname, "./.source"),
		},
	},
});
