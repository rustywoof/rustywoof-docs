// tests/command-ref.test.ts
import { describe, expect, it } from "vitest";
import { ShowCommandRef } from "@/components";
import { CLI_REFERENCE, commandSections, commandToMarkdown } from "@/lib";
import { getProps } from "./test-utils";

/**
 * Validates ShowCommandRef and commandSections boundary validation.
 */
describe("ShowCommandRef and commandSections boundary validation", () => {
	it("renders a danger fallback container when given an empty or unregistered command name", () => {
		const emptyEl = ShowCommandRef({ name: "" });
		const emptyProps = getProps(emptyEl);
		expect(String(emptyProps.className)).toContain("border-(--danger)");

		const unknownEl = ShowCommandRef({ name: "__unknown_command__" });
		const unknownProps = getProps(unknownEl);
		expect(String(unknownProps.children)).toContain("__unknown_command__");
	});

	it("excludes raw backtick characters from all CLI_REFERENCE exit code descriptions", () => {
		for (const [cmdName, def] of Object.entries(CLI_REFERENCE)) {
			for (const [code, meaning] of Object.entries(def.exitCodes)) {
				expect(meaning, `${cmdName} exit code ${code} contains raw backticks`).not.toContain("`");
			}
		}
	});

	it("omits optional edge-cases and common-mistakes sections when undefined or empty", () => {
		const versionDef = CLI_REFERENCE.version;
		expect(versionDef).toBeDefined();
		if (!versionDef) return;
		const sections = commandSections(versionDef);
		const ids = sections.map((s) => s.id);
		expect(ids).toEqual(["purpose", "synopsis", "flags", "exit-codes", "examples"]);
	});

	it("serializes command definitions to markdown with synopsis, flags table, and console examples", () => {
		const scanDef = CLI_REFERENCE.scan;
		expect(scanDef).toBeDefined();
		if (!scanDef) return;
		const md = commandToMarkdown("woof scan", scanDef);
		expect(md).toContain("# woof scan");
		expect(md).toContain("## Synopsis");
		expect(md).toContain("| `[PATH]` | argument |");
		expect(md).toContain("```console\n$ woof scan");
	});
});
