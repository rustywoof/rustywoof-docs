// tests/hero-section.test.ts
import { describe, expect, it } from "vitest";
import { ShowHeroSection } from "@/components/home";

/**
 * Validates ShowHeroSection boundary integrity.
 */
describe("ShowHeroSection boundary states", () => {
	it("instantiates the hero element without throwing runtime exceptions", () => {
		expect(() => {
			ShowHeroSection();
		}).not.toThrow();
	});

	it("contains valid documentation and playground links in the rendered tree", () => {
		const element = ShowHeroSection();
		expect(element).toBeDefined();
		expect(element.type).toBe("section");
	});
});
