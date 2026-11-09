// src/components/playground/format-audit-box.ts
import type { TerminalLine } from "@/components";
import type { AuditFinding } from "@/lib";
import { formatThreatRows } from "./format-threat-rows";

const TOP = "┌─────────────────┬────────────────────────────────────────────────────────────┐";
const SEP = "├─────────────────┼────────────────────────────────────────────────────────────┤";
const BOT = "└─────────────────┴────────────────────────────────────────────────────────────┘";
const MAX_VAL = 58;

function pad(val: string, len: number): string {
	return val.length >= len ? val.slice(0, len) : `${val}${" ".repeat(len - val.length)}`;
}

function makeRow(label: string, val: string): string {
	return `│ ${pad(label, 15)} │ ${pad(val, MAX_VAL)} │`;
}

/**
 * Appends the 80-column ASCII box table for a single vulnerable dependency.
 */
export function formatAuditCard(finding: AuditFinding, index: number): TerminalLine[] {
	const lines: TerminalLine[] = [];
	const p = `cd-${index}`;
	lines.push({ id: `${p}-top`, text: TOP, tone: "muted" });
	lines.push({ id: `${p}-pkg`, text: makeRow("Package", finding.pkg), tone: "danger" });
	lines.push({ id: `${p}-s1`, text: SEP, tone: "muted" });
	lines.push({ id: `${p}-ver`, text: makeRow("Version", finding.version) });
	lines.push({ id: `${p}-s2`, text: SEP, tone: "muted" });
	lines.push({ id: `${p}-eco`, text: makeRow("Ecosystem", finding.ecosystem) });
	lines.push({ id: `${p}-s3`, text: SEP, tone: "muted" });
	lines.push({ id: `${p}-sev`, text: makeRow("Severity", finding.severity), tone: "danger" });
	lines.push({ id: `${p}-s4`, text: SEP, tone: "muted" });
	formatThreatRows(finding.threats).forEach((row, rIdx) => {
		lines.push({ id: `${p}-thr-${rIdx}`, text: row, tone: "danger" });
	});
	lines.push({ id: `${p}-s5`, text: SEP, tone: "muted" });
	lines.push({ id: `${p}-pub`, text: makeRow("Published", finding.published) });
	lines.push({ id: `${p}-s6`, text: SEP, tone: "muted" });
	const status =
		finding.fixedVersions.length > 0
			? `Upgrade available (${finding.fixedVersions.slice(0, 3).join(", ")})`
			: "Upgrade available (latest)";
	lines.push({ id: `${p}-sta`, text: makeRow("Status", status), tone: "success" });
	lines.push({ id: `${p}-bot`, text: BOT, tone: "muted" });
	lines.push({ id: `${p}-blank1`, text: "" });
	lines.push({
		id: `${p}-osv`,
		text: `Learn more at:  https://osv.dev/vulnerability/${finding.primaryThreat}`,
		tone: "accent",
	});
	lines.push({ id: `${p}-blank2`, text: "" });
	lines.push({ id: `${p}-blank3`, text: "" });
	lines.push({
		id: `${p}-help1`,
		text: "help: Upgrading may break peer dependencies or parent requirements.",
		tone: "muted",
	});
	lines.push({ id: `${p}-help2`, text: "Analyze dependency paths first.", tone: "muted" });
	lines.push({ id: `${p}-sniff`, text: `Command: woof sniff ${finding.pkg}`, tone: "accent" });
	lines.push({ id: `${p}-blank4`, text: "" });
	lines.push({ id: `${p}-fix-hdr`, text: "Apply the fixed version:", tone: "muted" });
	const targetVer = finding.fixedVersions[0] ?? finding.fixedIn ?? "latest";
	lines.push({
		id: `${p}-remediate`,
		text: `Command: woof remediate ${finding.pkg} ${targetVer}`,
		tone: "success",
	});
	lines.push({ id: `${p}-blank5`, text: "" });
	return lines;
}
