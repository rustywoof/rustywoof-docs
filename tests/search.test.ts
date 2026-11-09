// tests/search.test.ts
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/search/route";

/**
 * Validates search endpoint edge cases and boundary inputs.
 */
describe("Search route edge-case validation", () => {
	it("returns a 200 response when query parameter is missing", async () => {
		const request = new Request("https://localhost/api/search");
		const response = await GET(request);
		expect(response.status).toBe(200);
	});

	it("returns a 200 response on empty query string", async () => {
		const request = new Request("https://localhost/api/search?query=");
		const response = await GET(request);
		expect(response.status).toBe(200);
	});

	it("handles special characters and URI encoded components safely", async () => {
		const request = new Request("https://localhost/api/search?query=%20%2F%24%5E%26%2A%28%29");
		const response = await GET(request);
		expect(response.status).toBe(200);
	});
});
