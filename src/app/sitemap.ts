// src/app/sitemap.ts

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/**
 * Builds the static XML sitemap entries for all documentation and blog pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://rustywoof.dev";
	const routes = [
		"",
		"/docs",
		"/docs/cli",
		"/docs/cli/scan",
		"/docs/cli/check",
		"/docs/cli/hook",
		"/docs/cli/init",
		"/docs/cli/audit",
		"/docs/cli/remediate",
		"/docs/cli/sniff",
		"/docs/cli/patrol",
		"/docs/cli/cache",
		"/docs/cli/generate",
		"/docs/cli/version",
		"/docs/cli/update",
		"/docs/components",
		"/docs/concepts",
		"/docs/concepts/perimeter-defense",
		"/docs/concepts/secret-scanning",
		"/docs/concepts/supply-chain",
		"/docs/configuration",
		"/docs/configuration/custom-rules",
		"/docs/configuration/woof-toml",
		"/docs/installation",
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
	}));

	return routes;
}
