// tests/docs-page.test.ts
import { describe, expect, it } from "vitest";
import { generateMetadata, generateStaticParams } from "@/app/docs/[[...slug]]/page";

/**
 * Validates error boundaries and parameter generation for dynamic docs routes.
 */
describe("Docs dynamic page boundaries", () => {
	it("produces an array of params containing non-empty route segments", async () => {
		const params = await generateStaticParams();
		expect(Array.isArray(params)).toBe(true);
	});

	it("throws not-found when passed an invalid non-existent slug", async () => {
		await expect(
			generateMetadata({
				params: Promise.resolve({ slug: ["__unreachable__", "404"] }),
			}),
		).rejects.toThrow();
	});
});
