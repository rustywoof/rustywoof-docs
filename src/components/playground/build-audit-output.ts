// src/components/playground/build-audit-output.ts
import type { TerminalLine } from "@/components";
import type { AuditFinding, ParsedPackage } from "@/lib";
import { formatAuditCard } from "./format-audit-box";

const SPINNER_FRAMES = ["◡", "◝", "◠", "◞", "◜"];

/**
 * Counts unique ecosystems represented across the extracted dependencies list.
 */
function countEcosystems(pkgs: readonly ParsedPackage[]): number {
	const set = new Set(pkgs.map((p) => p.ecosystem));
	return set.size === 0 ? 1 : set.size;
}

/**
 * Appends summary diagnostic metrics and exit status for detected vulnerabilities.
 */
function appendAuditSummary(lines: TerminalLine[], findings: readonly AuditFinding[]): void {
	let crit = 0;
	let high = 0;
	let med = 0;
	let low = 0;
	for (const f of findings) {
		if (f.severityLevel === "critical") crit += 1;
		else if (f.severityLevel === "high") high += 1;
		else if (f.severityLevel === "medium") med += 1;
		else low += 1;
	}
	lines.push({ id: "au-sum-blank", text: "" });
	lines.push({
		id: "au-sum-count",
		text: `${findings.length} vulnerabilities found`,
		tone: "danger",
	});
	lines.push({
		id: "au-sum-sev",
		text: `Severity: ${crit} critical, ${high} high, ${med} medium, ${low} low`,
		tone: "muted",
	});
	lines.push({
		id: "au-sum-done",
		text: "✗ Audit completed in 38.77s. Vulnerabilities detected — see report above.",
		tone: "danger",
	});
}

/**
 * Formats lockfile OSV audit results into authentic Rustywoof terminal output lines.
 */
export function buildAuditOutput(
	pkgs: readonly ParsedPackage[],
	findings: readonly AuditFinding[],
): readonly TerminalLine[] {
	const ecosystemsCount = countEcosystems(pkgs);
	const lines: TerminalLine[] = [
		{ id: "au-cmd", text: " woof audit", tone: "accent" },
		{ id: "au-init", text: "[INFO] Initiating multi-ecosystem lockfile audit...", tone: "muted" },
		{
			id: "au-ext",
			text: `[INFO] Extracted ${pkgs.length} dependencies across ${ecosystemsCount} ecosystems.`,
			tone: "muted",
		},
	];

	if (findings.length > 0) {
		findings.forEach((finding, idx) => {
			const frame = SPINNER_FRAMES[idx % SPINNER_FRAMES.length] ?? "◡";
			lines.push({
				id: `au-spin-${idx}`,
				text: `${frame} Cross-referencing CVEs: querying OSV for ${pkgs.length} packages`,
				tone: "accent",
			});
			const cardLines = formatAuditCard(finding, idx);
			lines.push(...cardLines);
		});
		appendAuditSummary(lines, findings);
	} else {
		lines.push({
			id: "au-spin-clean",
			text: `◡ Cross-referencing CVEs: querying OSV for ${pkgs.length} packages`,
			tone: "accent",
		});
		lines.push({
			id: "au-clean",
			text: `[OK] Sweep complete. Zero supply chain vulnerabilities detected across ${pkgs.length} packages.`,
			tone: "success",
		});
	}

	return lines;
}
