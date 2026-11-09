// src/lib/playground-engine.ts
import type { TerminalLine } from "@/components";
import {
	type AuditFinding,
	executeOsvAudit,
	type ParsedPackage,
	parseLockfileSnippet,
} from "./playground";

export type PlaygroundMode = "scan" | "audit" | "sniff";
export type { AuditFinding, ParsedPackage };
export { executeOsvAudit, parseLockfileSnippet };

/**
 * Builds terminal dependency tree lines for the given lockfile snippet and package filter.
 */
export function buildSniffGraphLines(input: string, targetFilter: string): readonly TerminalLine[] {
	const packages = parseLockfileSnippet(input);
	if (packages.length === 0)
		return [{ id: "s-err", text: "[ERROR] Unable to parse lockfile.", tone: "danger" }];
	const filter = targetFilter.trim().toLowerCase();
	const matched = filter ? packages.filter((p) => p.name.toLowerCase().includes(filter)) : packages;

	if (matched.length === 0)
		return [
			{ id: "s-cmd", text: `$ woof sniff ${filter}`, tone: "accent" },
			{ id: "s-none", text: "Package not found.", tone: "danger" },
		];

	const lines: TerminalLine[] = [
		{ id: "s-cmd", text: `$ woof sniff ${filter || "."}`, tone: "accent" },
		{
			id: "s-meta",
			text: `[INFO] Resolved ${packages.length} total package(s) in graph.`,
			tone: "muted",
		},
	];
	matched.forEach((pkg, idx) => {
		const branch = idx === matched.length - 1 ? "└─┬" : "├─┬";
		lines.push({
			id: `s-pkg-${idx}`,
			text: `${branch} ${pkg.name}@${pkg.version} (${pkg.ecosystem})`,
			tone: "accent",
		});
	});
	return lines;
}
