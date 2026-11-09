// tests/service-worker.test.ts
import { describe, expect, it } from "vitest";

/**
 * Determines the service worker caching strategy for a given request URL and destination.
 */
function getCacheStrategy(url: string, destination: string): string {
	if (url.includes("/_next/static/") || url.endsWith(".woff2") || url.endsWith(".wasm")) {
		return "cache-first";
	}
	if (
		url.includes("/_pagefind/") ||
		destination === "document" ||
		url.endsWith(".html") ||
		url.endsWith(".txt")
	) {
		return "stale-while-revalidate";
	}
	return "network-only";
}

describe("Service Worker Routing Logic", () => {
	it("routes static assets to cache-first", () => {
		expect(getCacheStrategy("https://host/_next/static/css/main.css", "style")).toBe("cache-first");
		expect(getCacheStrategy("https://host/font.woff2", "font")).toBe("cache-first");
		expect(getCacheStrategy("https://host/core.wasm", "script")).toBe("cache-first");
	});

	it("routes documents and search index to stale-while-revalidate", () => {
		expect(getCacheStrategy("https://host/docs/cli/scan", "document")).toBe(
			"stale-while-revalidate",
		);
		expect(getCacheStrategy("https://host/_pagefind/pagefind.js", "script")).toBe(
			"stale-while-revalidate",
		);
	});

	it("routes unknown or dynamic requests to network-only", () => {
		expect(getCacheStrategy("https://host/api/telemetry", "fetch")).toBe("network-only");
	});
});
