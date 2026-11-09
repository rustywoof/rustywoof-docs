// tests/blog-data.test.ts
import { describe, expect, it } from "vitest";
import { filterPostsByTag, normalizeTagSlug } from "@/lib/blog-data";

describe("blog-data tag filtering boundary conditions", () => {
	it("normalizes whitespace-only tag strings to empty string and returns zero posts", () => {
		expect(normalizeTagSlug("   \t\n ")).toBe("");
		expect(filterPostsByTag("")).toEqual([]);
		expect(filterPostsByTag("   ")).toEqual([]);
	});

	it("returns an empty array when querying an unknown or prototype-property tag", () => {
		expect(filterPostsByTag("__proto__")).toEqual([]);
		expect(filterPostsByTag("nonexistent-tag-999")).toEqual([]);
	});
});
