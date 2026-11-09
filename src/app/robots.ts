// src/app/robots.ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/**
 * Generates the static robots.txt configuration and sitemap URL.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: "https://rustywoof.dev/sitemap.xml",
	};
}
