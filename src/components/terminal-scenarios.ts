// src/components/terminal-scenarios.ts
export interface TerminalFrame {
	readonly id?: string;
	readonly text: string;
	readonly delay?: number;
}

export interface TerminalLine {
	readonly id: string;
	readonly text: string;
	readonly tone?: "danger" | "success" | "accent" | "muted";
}

export interface Scenario {
	readonly id: string;
	readonly label: string;
	readonly icon: string;
	readonly command: string;
	readonly lines: readonly TerminalLine[];
}

export const SCENARIOS: readonly Scenario[] = [
	{
		id: "patrol",
		label: "woof patrol",
		icon: "rust",
		command: "woof patrol",
		lines: [
			{ id: "p1", text: "[INFO] Starting auditor for full repository sweep...", tone: "muted" },
			{ id: "p2", text: "[ ] 1/2 Auditing supply chain dependencies..." },
			{ id: "p3", text: "[INFO] Extracted 190 dependencies across 3 ecosystems.", tone: "muted" },
			{ id: "p5", text: "Cross-referencing CVEs: querying OSV for 190 packages", tone: "accent" },
			{ id: "p6", text: "[OK] 1/2 Supply chain audit passed.", tone: "success" },
			{ id: "p7", text: "[ ] 2/2 Scanning files for exposed secrets..." },
			{ id: "p10", text: "[CRITICAL] Found 1 exposed secret.", tone: "danger" },
			{ id: "p16", text: "[FAIL] 2/2 Secret scan failed.", tone: "danger" },
		],
	},
	{
		id: "audit",
		label: "woof audit",
		icon: "pnpm",
		command: "woof audit",
		lines: [
			{ id: "a1", text: "[INFO] Initiating multi-ecosystem lockfile audit...", tone: "muted" },
			{ id: "a2", text: "[INFO] Extracted 190 dependencies across 3 ecosystems.", tone: "muted" },
			{ id: "a3", text: "Cross-referencing CVEs: querying OSV for 190 packages", tone: "accent" },
			{
				id: "a4",
				text: "Audit complete in 1.74s. Zero supply chain vulnerabilities detected.",
				tone: "success",
			},
		],
	},
];
