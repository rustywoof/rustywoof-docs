// src/lib/playground/offline-advisories.ts
export interface OfflineAdvisory {
	readonly id: string;
	readonly summary: string;
	readonly fixedIn: string;
	readonly severity: string;
	readonly severityScore: number;
	readonly severityLevel: "critical" | "high" | "medium" | "low";
	readonly threats: readonly string[];
	readonly published: string;
	readonly fixedVersions: readonly string[];
}

export const OFFLINE_ADVISORIES: Readonly<Record<string, OfflineAdvisory>> = {
	"lodash@4.17.15": {
		id: "CVE-2021-23337",
		summary: "Prototype Pollution in lodash",
		fixedIn: "4.17.21",
		severity: "7.4 (HIGH)",
		severityScore: 7.4,
		severityLevel: "high",
		threats: ["CVE-2021-23337", "CVE-2020-8203", "GHSA-p6mc-m468-83gw"],
		published: "15 February 2021",
		fixedVersions: ["4.17.21"],
	},
	"axios@1.5.0": {
		id: "CVE-2023-45857",
		summary: "CSRF token exposure in axios",
		fixedIn: "1.6.0",
		severity: "6.5 (MEDIUM)",
		severityScore: 6.5,
		severityLevel: "medium",
		threats: ["CVE-2023-45857", "GHSA-wf5p-g6vw-rhxx"],
		published: "24 October 2023",
		fixedVersions: ["1.6.0"],
	},
	"hyper@0.14.10": {
		id: "RUSTSEC-2021-0079",
		summary: "Integer overflow in HTTP chunked transfer-encoding parser",
		fixedIn: "0.14.12",
		severity: "7.5 (HIGH)",
		severityScore: 7.5,
		severityLevel: "high",
		threats: ["CVE-2021-32714", "RUSTSEC-2021-0079"],
		published: "07 July 2021",
		fixedVersions: ["0.14.12"],
	},
	"requests@2.25.0": {
		id: "CVE-2023-32681",
		summary: "Unintended leak of Proxy-Authorization header in requests",
		fixedIn: "2.31.0",
		severity: "6.1 (MEDIUM)",
		severityScore: 6.1,
		severityLevel: "medium",
		threats: ["CVE-2023-32681", "PYSEC-2023-74"],
		published: "22 May 2023",
		fixedVersions: ["2.31.0"],
	},
	"django@4.2.1": {
		id: "CVE-2023-36053",
		summary: "Potential ReDoS in EmailValidator and URLValidator",
		fixedIn: "4.2.3",
		severity: "7.5 (HIGH)",
		severityScore: 7.5,
		severityLevel: "high",
		threats: ["CVE-2023-36053", "GHSA-r3xc-prgr-mg9p"],
		published: "03 July 2023",
		fixedVersions: ["4.2.3"],
	},
	"urllib3@1.26.4": {
		id: "CVE-2023-43804",
		summary: "Cookie request header isn't stripped during cross-origin redirects",
		fixedIn: "1.26.18",
		severity: "8.8 (HIGH)",
		severityScore: 8.8,
		severityLevel: "high",
		threats: ["CVE-2023-43804", "GHSA-v845-jxx5-vc9f"],
		published: "02 October 2023",
		fixedVersions: ["1.26.18", "2.0.6"],
	},
};
