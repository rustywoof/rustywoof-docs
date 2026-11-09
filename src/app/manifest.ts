// src/app/manifest.ts

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/**
 * Builds the Progressive Web App manifest for offline documentation viewing.
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Rustywoof Documentation",
		short_name: "Rustywoof",
		description: "Local secret scanner and OSV lockfile auditor written in Rust.",
		start_url: "/",
		display: "standalone",
		background_color: "#f2f2f2",
		theme_color: "#bc6500",
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-512.png",
				sizes: "500x500",
				type: "image/png",
				purpose: "any",
			},
		],
	};
}
