// src/lib/command-sections.ts
import type { CLI_REFERENCE } from "./cli-reference";

export type CommandDef = (typeof CLI_REFERENCE)[string];

export interface CommandSection {
	readonly id: string;
	readonly title: string;
}

/**
 * Single source of truth for the headings a command page renders, used by both the
 * page body and the right-hand table of contents.
 */
export function commandSections(cmd: CommandDef): readonly CommandSection[] {
	const sections: CommandSection[] = [
		{ id: "purpose", title: "Purpose" },
		{ id: "synopsis", title: "Synopsis" },
		{ id: "flags", title: "Flags" },
	];
	if (cmd.edgeCases && cmd.edgeCases.length > 0) {
		sections.push({ id: "edge-cases", title: "Edge Cases" });
	}
	if (cmd.commonMistakes && cmd.commonMistakes.length > 0) {
		sections.push({ id: "common-mistakes", title: "Common Mistakes" });
	}
	sections.push({ id: "exit-codes", title: "Exit Codes" });
	sections.push({ id: "examples", title: "Examples" });
	return sections;
}

/**
 * Serialises a command definition to Markdown for "Copy Markdown" and /llms.mdx.
 */
export function commandToMarkdown(title: string, cmd: CommandDef): string {
	const out: string[] = [`# ${title}`, "", "## Purpose", "", cmd.purpose, ""];
	out.push("## Synopsis", "", "```bash", cmd.synopsis, "```", "");
	out.push("## Flags", "", "| Flag | Type | Description |", "| --- | --- | --- |");
	for (const f of cmd.flags) {
		const def = f.defaultValue ? ` (default: \`${f.defaultValue}\`)` : "";
		out.push(`| \`${f.name}\` | ${f.type} | ${f.description}${def} |`);
	}
	out.push("");
	if (cmd.edgeCases?.length)
		out.push("## Edge Cases", "", ...cmd.edgeCases.map((e) => `- ${e}`), "");
	if (cmd.commonMistakes?.length) {
		out.push("## Common Mistakes", "", ...cmd.commonMistakes.map((e) => `- ${e}`), "");
	}
	out.push("## Exit Codes", "");
	for (const [code, meaning] of Object.entries(cmd.exitCodes))
		out.push(`- \`${code}\`: ${meaning}`);
	out.push("", "## Examples", "");
	for (const ex of cmd.examples) {
		out.push("```console", `$ ${ex.command}`, ex.output, "```", "", ex.explanation, "");
	}
	return out.join("\n");
}
