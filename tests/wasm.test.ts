// tests/wasm.test.ts
import { describe, expect, it } from "vitest";
import { executeScan } from "@/lib/scan-secrets/execute-scan";

describe("WASM Scanner Bridge", () => {
	it("detects a mocked secret in plain text", async () => {
		const input = `const token = "api_prod_abcdef1234567890abcdef1234567890";`;
		const config = { customRules: [{ name: "Prod Token", pattern: "api_prod_[a-f0-9]{32}" }] };
		const result = await executeScan(input, config);

		expect(result).toBeDefined();
		expect(result.length).toBe(1);
		expect(result[0]?.ruleName).toBe("Prod Token");
		expect(result[0]?.isEntropyValid).toBe(true);
	});

	it("returns an empty array for safe text", async () => {
		const input = `const greeting = "Hello, world!";`;
		const result = await executeScan(input);

		expect(result).toBeDefined();
		expect(result.length).toBe(0);
	});
});
