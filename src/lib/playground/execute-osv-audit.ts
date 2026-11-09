// src/lib/playground/execute-osv-audit.ts
import { OFFLINE_ADVISORIES } from "./offline-advisories";
import type { ParsedPackage } from "./parse-lockfile";
import { type OsvVulnRecord, parseVulnDetails } from "./parse-osv-vuln";

export interface AuditFinding {
	readonly pkg: string;
	readonly version: string;
	readonly ecosystem: string;
	readonly severity: string;
	readonly severityScore: number;
	readonly severityLevel: "critical" | "high" | "medium" | "low";
	readonly threats: readonly string[];
	readonly published: string;
	readonly fixedVersions: readonly string[];
	readonly primaryThreat: string;
	readonly id: string;
	readonly fixedIn: string;
	readonly summary: string;
}

interface OsvBatchResponse {
	readonly results?:
		| ReadonlyArray<{ readonly vulns?: readonly OsvVulnRecord[] | undefined }>
		| undefined;
}

/**
 * Merges offline deterministic mock advisories for parsed packages.
 */
function collectOfflineFindings(
	packages: readonly ParsedPackage[],
	map: Map<string, AuditFinding>,
): void {
	for (const pkg of packages) {
		const key = `${pkg.name.toLowerCase()}@${pkg.version}`;
		const hit = OFFLINE_ADVISORIES[key] ?? OFFLINE_ADVISORIES[`${pkg.name}@${pkg.version}`];
		if (!hit) continue;
		map.set(key, {
			pkg: pkg.name,
			version: pkg.version,
			ecosystem: pkg.ecosystem,
			severity: hit.severity,
			severityScore: hit.severityScore,
			severityLevel: hit.severityLevel,
			threats: hit.threats,
			published: hit.published,
			fixedVersions: hit.fixedVersions,
			primaryThreat: hit.threats[0] ?? hit.id,
			id: hit.id,
			fixedIn: hit.fixedIn,
			summary: hit.summary,
		});
	}
}

/**
 * Hydrates full OSV vulnerability records for stub IDs returned by /v1/querybatch.
 */
async function hydrateVulnRecords(
	stubs: readonly OsvVulnRecord[],
): Promise<readonly OsvVulnRecord[]> {
	const hydrated = await Promise.all(
		stubs.slice(0, 8).map(async (stub) => {
			if (stub.severity && stub.severity.length > 0) return stub;
			try {
				const res = await fetch(`https://api.osv.dev/v1/vulns/${encodeURIComponent(stub.id)}`);
				if (res.ok) return (await res.json()) as OsvVulnRecord;
			} catch {
				// Why: Network fallback retains stub if individual vuln hydration fails.
			}
			return stub;
		}),
	);
	return hydrated;
}

/**
 * Consolidates multiple OSV vulnerabilities for a package into a single advisory card.
 */
function mergeVulnsForPackage(
	pkg: ParsedPackage,
	vulns: readonly OsvVulnRecord[],
	map: Map<string, AuditFinding>,
): void {
	if (vulns.length === 0) return;
	const details = vulns.map(parseVulnDetails);
	const threats = Array.from(new Set(details.flatMap((d) => d.threats)));
	const fixedVersions = Array.from(new Set(details.flatMap((d) => d.fixedVersions)));
	const maxSev = details.reduce(
		(prev, curr) => (curr.severityScore > prev.severityScore ? curr : prev),
		details[0] ?? {
			severityScore: 6.5,
			severityLevel: "medium" as const,
			severity: "6.5 (MEDIUM)",
			threats: [],
			published: "15 June 2026",
			fixedVersions: [],
		},
	);
	const primaryThreat =
		threats.find((t) => t.startsWith("CVE-")) ?? threats[0] ?? vulns[0]?.id ?? "";
	const key = `${pkg.name.toLowerCase()}@${pkg.version}`;
	map.set(key, {
		pkg: pkg.name,
		version: pkg.version,
		ecosystem: pkg.ecosystem,
		severity: maxSev.severity,
		severityScore: maxSev.severityScore,
		severityLevel: maxSev.severityLevel,
		threats,
		published: maxSev.published,
		fixedVersions,
		primaryThreat,
		id: primaryThreat,
		fixedIn: fixedVersions[0] ?? "latest",
		summary: vulns[0]?.summary ?? "Known supply chain vulnerability reported in OSV",
	});
}

/**
 * Audits parsed packages against OSV offline cache and live api.osv.dev batch query.
 */
export async function executeOsvAudit(packages: readonly ParsedPackage[]): Promise<AuditFinding[]> {
	if (packages.length === 0) return [];
	const map = new Map<string, AuditFinding>();
	collectOfflineFindings(packages, map);
	const isTestEnv =
		typeof process !== "undefined" &&
		(process.env as unknown as { NODE_ENV?: string }).NODE_ENV === "test";

	if (!isTestEnv && typeof fetch === "function") {
		try {
			const batch = packages.slice(0, 80);
			const res = await fetch("https://api.osv.dev/v1/querybatch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					queries: batch.map((p) => ({
						version: p.version,
						package: { name: p.name, ecosystem: p.ecosystem },
					})),
				}),
			});
			if (res.ok) {
				const data = (await res.json()) as OsvBatchResponse;
				const tasks = (data.results ?? []).map(async (entry, idx) => {
					const pkg = batch[idx];
					if (pkg && entry.vulns && entry.vulns.length > 0) {
						const fullVulns = await hydrateVulnRecords(entry.vulns);
						mergeVulnsForPackage(pkg, fullVulns, map);
					}
				});
				await Promise.all(tasks);
			}
		} catch {
			// Why: Offline or network-blocked clients rely seamlessly on deterministic local advisories.
		}
	}
	return Array.from(map.values()).sort((a, b) => b.severityScore - a.severityScore);
}
