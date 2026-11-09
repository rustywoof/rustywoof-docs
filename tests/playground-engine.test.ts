// tests/playground-engine.test.ts
import { describe, expect, it } from "vitest";
import {
	buildSniffGraphLines,
	executeOsvAudit,
	parseLockfileSnippet,
} from "@/lib/playground-engine";

describe("playground-engine boundary and failure states", () => {
	it("returns an empty array when given malformed JSON or empty lockfile text", () => {
		expect(parseLockfileSnippet("")).toEqual([]);
		expect(parseLockfileSnippet("   ")).toEqual([]);
		expect(parseLockfileSnippet("{ malformed json ")).toEqual([]);
	});

	it("ignores Cargo.lock [[package]] blocks that are missing name or version fields", () => {
		const brokenCargo = '[[package]]\nname = "incomplete-crate"\n';
		expect(parseLockfileSnippet(brokenCargo)).toEqual([]);
	});

	it("returns an empty findings list when executeOsvAudit receives zero packages", async () => {
		const res = await executeOsvAudit([]);
		expect(res).toEqual([]);
	});

	it("emits a danger diagnostic line when buildSniffGraphLines queries a non-existent package", () => {
		const lines = buildSniffGraphLines(
			'{"dependencies": {"lodash": "4.17.21"}}',
			"nonexistent-pkg",
		);
		expect(lines.some((l) => l.tone === "danger")).toBe(true);
	});
});
