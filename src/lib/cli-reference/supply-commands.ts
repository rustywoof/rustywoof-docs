// src/lib/cli-reference/supply-commands.ts
import { type CommandDef, HELP_FLAG } from "./types";

export const SUPPLY_COMMANDS: Readonly<Record<string, CommandDef>> = {
	audit: {
		purpose: "Audits project lockfiles against the OSV threat intelligence feed.",
		synopsis: "woof audit [OPTIONS]",
		flags: [
			{ name: "--dev", type: "boolean", description: "Audit only development dependencies" },
			{ name: "--prod", type: "boolean", description: "Audit only production dependencies" },
			{
				name: "--audit-level <AUDIT_LEVEL>",
				type: "string",
				description:
					"Filter vulnerabilities by severity level. Useful for setting minimum thresholds in automated checks.",
			},
			{
				name: "-i, --interactive",
				type: "boolean",
				description: "Interactive mode for manual review and selection of advisories to fix",
			},
			{ name: "-h, --help", type: "boolean", description: "Print help (see a summary with '-h')" },
		],
		exitCodes: {
			0: "Scan completed successfully with no vulnerabilities meeting the specified audit level.",
			1: "Vulnerabilities were detected that met or exceeded the threshold.",
			2: "Configuration error, missing lockfile, or network failure preventing the OSV query.",
		},
		examples: [
			{
				command: "woof audit",
				output:
					"[INFO] Extracted 412 dependencies.\n✓ Audit complete. Zero vulnerabilities detected.",
				explanation: "Audits all dependencies in the local lockfile against the OSV database.",
			},
			{
				command: "woof audit --prod --audit-level high",
				output: "[!] 1 High severity vulnerability found in production dependencies.",
				explanation:
					"Filters the audit to only production dependencies and sets the failure threshold to high.",
			},
			{
				command: "woof audit --interactive",
				output: "? 2 vulnerabilities found. Select advisories to attempt auto-remediation:",
				explanation:
					"Launches the interactive wizard allowing you to manually review and fix vulnerable dependencies.",
			},
		],
		edgeCases: [
			"If the project lacks a lockfile (e.g., package-lock.json, Cargo.lock), the command will fail as it cannot resolve exact dependency tree versions.",
			"In air-gapped CI/CD environments, the OSV database query will timeout unless a local threat intelligence cache is provided.",
		],
		commonMistakes: [
			"Passing both --dev and --prod simultaneously.",
			"Expecting woof audit to scan source code for exposed keys (use woof scan for secrets; audit is strictly for supply chain vulnerabilities).",
		],
	},
	remediate: {
		purpose: "Attempts automatic remediation of compromised packages.",
		synopsis: "woof remediate <PACKAGE> <VERSION>",
		flags: [
			{ name: "<PACKAGE>", type: "argument", description: "The package name to remediate." },
			{ name: "<VERSION>", type: "argument", description: "The secure version to target." },
			HELP_FLAG,
		],
		exitCodes: {
			0: "Package successfully updated and lockfile regenerated.",
			1: "Remediation failed due to breaking version constraints or network errors.",
		},
		examples: [
			{
				command: "woof remediate lodash 4.17.21",
				output: "Updating lodash to 4.17.21...\n✓ Remediation successful.",
				explanation: "Forces an update of a vulnerable package to a known safe version.",
			},
			{
				command: "woof remediate requests 2.31.0",
				output: "Updating requests...\n[!] Dependency conflict prevented remediation.",
				explanation: "Fails when the target version conflicts with other packages in the tree.",
			},
		],
	},
	sniff: {
		purpose: "Analyzes the dependency graph to trace paths leading to a specific package.",
		synopsis: "woof sniff [PACKAGE]",
		flags: [
			{
				name: "[PACKAGE]",
				type: "argument",
				description:
					"Maps out how a specific dependency was included in your project by walking the lockfile graph.",
			},
			HELP_FLAG,
		],
		exitCodes: {
			0: "Trace completed and paths found.",
			1: "Package not found in the dependency graph.",
		},
		examples: [
			{
				command: "woof sniff package-name",
				output: "package-name@0.x.x\n└── project-name@0.x.x",
				explanation: "Shows the transitive inclusion path of a specific package.",
			},
			{
				command: "woof sniff unknown-pkg",
				output: "Package 'unknown-pkg' not found in tree.",
				explanation: "Handles non-existent queries gracefully.",
			},
		],
	},
};
