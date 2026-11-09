// tests/source.test.ts
import { describe, expect, it } from "vitest";
import { docsSource } from "@/lib/source";

/**
 * Validates edge case and boundary handling for docs page lookups.
 */
describe("docsSource boundaries", () => {
	it("returns undefined when page slug does not exist", () => {
		const page = docsSource.getPage(["nonexistent", "deep", "path"]);
		expect(page).toBeUndefined();
	});

	it("resolves the root index page when slug is empty array", () => {
		const page = docsSource.getPage([]);
		expect(page).toBeDefined();
		expect(page?.url).toBe("/docs");
	});

	it("handles hostile or encoded path segments gracefully", () => {
		expect(() => {
			docsSource.getPage(["..", "%2e%2e", "<script>"]);
		}).not.toThrow();
	});
});
