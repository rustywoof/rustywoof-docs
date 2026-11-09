// src/components/home/scan-samples.ts
import type { CodeLine } from "@/components/ui";

interface ScanSample {
	readonly id: string;
	readonly label: string;
	readonly icon: string;
	readonly filename: string;
	readonly rule: string;
	readonly lines: readonly CodeLine[];
	readonly terminal: readonly {
		readonly id: string;
		readonly text: string;
		readonly tone?: "danger" | "success" | "accent" | "muted";
	}[];
}

const PROGRESS_LINE = "Scanning ├── [████████████] 100% | 577.58 MiB @ 238.51 MiB/s | 21,341 files";
const SWEEP_LINE = "[INFO] Sweep complete. Analyzed 21,341 files in 2.42s.";
const FAIL_LINE = "[CRITICAL] Secret scan failed! Found 1 exposed secret.";

export const SCAN_SAMPLES: readonly ScanSample[] = [
	{
		id: "ts",
		label: "TypeScript",
		icon: "ts",
		filename: "src/auth.ts",
		rule: "GitHub Personal Access Token",
		lines: [
			{ line: 1, text: 'import { createClient } from "./client";' },
			{ line: 2, text: "" },
			{ line: 3, text: "// Hardcoded token committed by mistake" },
			{
				line: 4,
				text: 'export const GITHUB_PAT = "ghp_0th1sI54n3X4MPL3F0rAg1th4BPAt0k3nK3y";',
				danger: true,
			},
			{ line: 5, text: "export const api = createClient({ token: GITHUB_PAT });" },
		],
		terminal: [
			{ id: "t1", text: "[INFO] Indexing repository...", tone: "muted" },
			{ id: "t2", text: PROGRESS_LINE, tone: "accent" },
			{ id: "t3", text: SWEEP_LINE, tone: "muted" },
			{ id: "t4", text: FAIL_LINE, tone: "danger" },
			{
				id: "t5",
				text: "× [CRITICAL] Secret Detected: GitHub Personal Access Token",
				tone: "danger",
			},
			{ id: "t6", text: "╭─[./src/auth.ts:4:27]" },
			{ id: "t7", text: "4 │ export const GITHUB_PAT = ****************************************;" },
			{ id: "t8", text: "·                           ╰── Exposure found here", tone: "danger" },
			{ id: "t9", text: "╰────" },
		],
	},
	{
		id: "rust",
		label: "Rust",
		icon: "rust",
		filename: "src/config.rs",
		rule: "AWS Access Key",
		lines: [
			{ line: 1, text: "pub struct AwsConfig {" },
			{ line: 2, text: "    pub region: &'static str," },
			{ line: 3, text: "    pub access_key: &'static str," },
			{ line: 4, text: "}" },
			{ line: 5, text: 'pub const DEFAULT_KEY: &str = "AKIAIOSFODNN7EXAMPLE";', danger: true },
		],
		terminal: [
			{ id: "r1", text: "[INFO] Indexing repository...", tone: "muted" },
			{ id: "r2", text: PROGRESS_LINE, tone: "accent" },
			{ id: "r3", text: SWEEP_LINE, tone: "muted" },
			{ id: "r4", text: FAIL_LINE, tone: "danger" },
			{ id: "r5", text: "× [CRITICAL] Secret Detected: AWS Access Key", tone: "danger" },
			{ id: "r6", text: "╭─[./src/config.rs:5:31]" },
			{ id: "r7", text: "5 │ pub const DEFAULT_KEY: &str = ********************;" },
			{ id: "r8", text: "·                               ╰── Exposure found here", tone: "danger" },
			{ id: "r9", text: "╰────" },
		],
	},
	{
		id: "python",
		label: "Python",
		icon: "python",
		filename: "settings.py",
		rule: "Google Cloud API Key",
		lines: [
			{ line: 1, text: "import os" },
			{ line: 2, text: "" },
			{ line: 3, text: "DEBUG = False" },
			{ line: 4, text: 'GCP_KEY = "AIzaSyDaGmWKa4JsXZ-HjGw7xH_example_key0"', danger: true },
			{ line: 5, text: 'ALLOWED_HOSTS = ["api.internal.local"]' },
		],
		terminal: [
			{ id: "p1", text: "[INFO] Indexing repository...", tone: "muted" },
			{ id: "p2", text: PROGRESS_LINE, tone: "accent" },
			{ id: "p3", text: SWEEP_LINE, tone: "muted" },
			{ id: "p4", text: FAIL_LINE, tone: "danger" },
			{ id: "p5", text: "× [CRITICAL] Secret Detected: Google Cloud API Key", tone: "danger" },
			{ id: "p6", text: "╭─[./settings.py:4:11]" },
			{ id: "p7", text: "4 │ GCP_KEY = ***************************************" },
			{ id: "p8", text: "·           ╰── Exposure found here", tone: "danger" },
			{ id: "p9", text: "╰────" },
		],
	},
];
