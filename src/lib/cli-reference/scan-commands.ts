// src/lib/cli-reference/scan-commands.ts
import { type CommandDef, HELP_FLAG } from "./types";

export const SCAN_COMMANDS: Readonly<Record<string, CommandDef>> = {
	scan: {
		purpose: "Scans a target directory for exposed cryptographic secrets and tokens.",
		synopsis: "woof scan [PATH]",
		flags: [
			{
				name: "[PATH]",
				type: "argument",
				defaultValue: ".",
				description:
					"Recursively searches the specified directory for high-entropy tokens, private keys, and hardcoded credentials.",
			},
			HELP_FLAG,
		],
		exitCodes: {
			0: "Scan completed successfully. Secrets may or may not have been found (use check for strict CI/CD failure).",
			2: "Invalid path provided or insufficient permissions to read the directory.",
		},
		examples: [
			{
				command: "woof scan",
				output: "Scanning .\nFound 2 potential secrets.",
				explanation: "Scans the current directory (default).",
			},
			{
				command: "woof scan ./src",
				output: "Scanning ./src\n✓ Clean. No secrets found.",
				explanation: "Scans only the specified ./src directory.",
			},
			{
				command: "woof scan ../backend",
				output: "Scanning ../backend\n[!] Found 1 AWS Access Key.",
				explanation: "Scans a relative directory outside the current working path.",
			},
		],
		commonMistakes: [
			"Using scan in a CI/CD pipeline and expecting it to fail the build (use woof check instead).",
		],
	},
	check: {
		purpose: "CI/CD mode: Executes a strict scan and returns exit code 1 if violations are found.",
		synopsis: "woof check [PATH]",
		flags: [
			{
				name: "[PATH]",
				type: "argument",
				defaultValue: ".",
				description:
					"Designed for CI/CD pipelines. Runs a strict scan and returns a non-zero exit code (1) to fail the build if any secrets are detected.",
			},
			HELP_FLAG,
		],
		exitCodes: {
			0: "No secrets detected. Safe to proceed.",
			1: "One or more secrets were detected. Build failed.",
			2: "Invalid path or configuration error.",
		},
		examples: [
			{
				command: "woof check",
				output:
					'[INFO] Indexing repository...\n[INFO] Sweep complete. Analyzed 200 files in 6ms.\n{"status":"failure","files_scanned":200,"threats":1}',
				explanation:
					"Fails the CI/CD pipeline because a secret was found in the current directory.",
			},
			{
				command: "woof check ./config",
				output:
					'[INFO] Indexing repository...\n[INFO] Sweep complete. Analyzed 49 files in 56ms.\n{"status":"success","files_scanned":49,"threats":0}',
				explanation: "Passes the pipeline check for the specific directory.",
			},
			{
				command: "woof check /var/www",
				output:
					'[INFO] Indexing repository...\n[INFO] Sweep complete. Analyzed 0 files in 0ms.\n{"status":"failure","files_scanned":0,"threats":2}',
				explanation: "Fails due to read permissions, which also safely stops the pipeline.",
			},
		],
	},
	patrol: {
		purpose: "Executes a full repository sweep (Audit + Scan).",
		synopsis: "woof patrol",
		flags: [HELP_FLAG],
		exitCodes: {
			0: "Sweep complete. No supply chain or secret violations found.",
			1: "Violations discovered during either the audit or the scan phase.",
		},
		examples: [
			{
				command: "woof patrol",
				output:
					"Starting repository sweep...\n[1/2] Audit: Clean\n[2/2] Scan: Clean\n✓ Repository clean.",
				explanation: "Runs both major security checks sequentially.",
			},
			{
				command: "woof patrol",
				output:
					"Starting repository sweep...\n[1/2] Audit: 1 CVE found.\n[2/2] Scan: Clean\n[!] Repository sweep failed.",
				explanation: "Fails the overall sweep if either phase detects a threat.",
			},
			{ command: "woof patrol --help", output: "Usage: woof patrol", explanation: "Shows help." },
		],
	},
};
