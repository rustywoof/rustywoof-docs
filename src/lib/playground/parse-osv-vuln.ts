// src/lib/playground/parse-osv-vuln.ts
import { computeCvssV3Score } from "./cvss-calculator";

export interface OsvVulnRecord {
	readonly id: string;
	readonly summary?: string | undefined;
	readonly published?: string | undefined;
	readonly modified?: string | undefined;
	readonly aliases?: readonly string[] | undefined;
	readonly severity?: ReadonlyArray<{ readonly type: string; readonly score: string }> | undefined;
	readonly database_specific?: Readonly<Record<string, unknown>> | undefined;
	readonly ecosystem_specific?: Readonly<Record<string, unknown>> | undefined;
	readonly affected?:
		| ReadonlyArray<{
				readonly database_specific?: Readonly<Record<string, unknown>> | undefined;
				readonly ecosystem_specific?: Readonly<Record<string, unknown>> | undefined;
				readonly ranges?:
					| ReadonlyArray<{
							readonly events?: ReadonlyArray<{ readonly fixed?: string | undefined }> | undefined;
					  }>
					| undefined;
		  }>
		| undefined;
}

export interface ParsedVulnDetails {
	readonly severityScore: number;
	readonly severityLevel: "critical" | "high" | "medium" | "low";
	readonly severity: string;
	readonly threats: readonly string[];
	readonly published: string;
	readonly fixedVersions: readonly string[];
}

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

/**
 * Formats an ISO date timestamp into a human-readable day month year string.
 */
function formatOsvDate(isoStr?: string): string {
	if (!isoStr) return "15 June 2026";
	const d = new Date(isoStr);
	if (Number.isNaN(d.getTime())) return isoStr;
	const day = String(d.getUTCDate()).padStart(2, "0");
	const month = MONTHS[d.getUTCMonth()];
	const year = d.getUTCFullYear();
	return `${day} ${month} ${year}`;
}

/**
 * Extracts textual severity label from top-level or affected database/ecosystem metadata.
 */
function extractTextSeverity(vuln: OsvVulnRecord): string {
	const candidates = [
		vuln.database_specific?.severity,
		vuln.ecosystem_specific?.severity,
		...(vuln.affected ?? []).flatMap((a) => [
			a.database_specific?.severity,
			a.ecosystem_specific?.severity,
		]),
	];
	for (const item of candidates) {
		if (typeof item === "string" && item.trim()) return item.trim().toUpperCase();
	}
	return "";
}

/**
 * Derives the numeric CVSS score, severity tier, and formatted tag from an OSV record.
 */
function parseCvssSeverity(vuln: OsvVulnRecord): {
	score: number;
	level: "critical" | "high" | "medium" | "low";
	formatted: string;
} {
	let score = 0;
	for (const entry of vuln.severity ?? []) {
		const raw = entry.score.trim();
		const vectorScore = computeCvssV3Score(raw);
		if (vectorScore !== null && vectorScore > score) {
			score = vectorScore;
			continue;
		}
		const directNum = /^\d+(?:\.\d+)?$/.exec(raw);
		if (directNum) {
			score = Math.max(score, Number.parseFloat(directNum[0]));
		}
	}

	const dbSev = extractTextSeverity(vuln);
	if (!score) {
		if (dbSev.includes("CRIT")) score = 9.4;
		else if (dbSev.includes("HIGH")) score = 7.8;
		else if (dbSev.includes("MOD") || dbSev.includes("MED")) score = 6.2;
		else if (dbSev.includes("LOW")) score = 3.2;
		else score = 6.5;
	}

	const level: "critical" | "high" | "medium" | "low" =
		score >= 9.0 ? "critical" : score >= 7.0 ? "high" : score >= 4.0 ? "medium" : "low";
	return { score, level, formatted: `${score.toFixed(1)} (${level.toUpperCase()})` };
}

/**
 * Extracts, deduplicates, and sorts all CVE and GHSA threat identifiers for a vulnerability.
 */
export function parseVulnDetails(vuln: OsvVulnRecord): ParsedVulnDetails {
	const sev = parseCvssSeverity(vuln);
	const rawThreats = [vuln.id, ...(vuln.aliases ?? [])];
	const uniqueThreats = Array.from(new Set(rawThreats)).sort((a, b) => {
		const aIsCve = a.startsWith("CVE-");
		const bIsCve = b.startsWith("CVE-");
		if (aIsCve && !bIsCve) return -1;
		if (!aIsCve && bIsCve) return 1;
		return b.localeCompare(a);
	});
	const fixed = (vuln.affected ?? [])
		.flatMap((a) => (a.ranges ?? []).flatMap((r) => (r.events ?? []).map((e) => e.fixed)))
		.filter((f): f is string => Boolean(f));

	return {
		severityScore: sev.score,
		severityLevel: sev.level,
		severity: sev.formatted,
		threats: uniqueThreats,
		published: formatOsvDate(vuln.published ?? vuln.modified),
		fixedVersions: Array.from(new Set(fixed)),
	};
}
