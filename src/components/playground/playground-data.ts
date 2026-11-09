// src/components/playground/playground-data.ts
import type { PlaygroundMode } from "@/lib";

export const CORE_RULES = [
	{ name: "AWS Access Key", pattern: "AKIA[0-9A-Z]{16}" },
	{ name: "GitHub PAT", pattern: "gh[pusor]_[A-Za-z0-9_]{36}" },
];

export interface AuditPreset {
	readonly id: string;
	readonly label: string;
	readonly icon: string;
	readonly text: string;
}

export const AUDIT_PRESETS: readonly AuditPreset[] = [
	{
		id: "cargo",
		label: "Cargo.lock",
		icon: "rust",
		text: [
			"[[package]]",
			'name = "hyper"',
			'version = "0.14.10"',
			'source = "registry+https://github.com/rust-lang/crates.io-index"',
			"",
			"[[package]]",
			'name = "tokio"',
			'version = "1.38.0"',
		].join("\n"),
	},
	{
		id: "npm",
		label: "package.json",
		icon: "npm",
		text: JSON.stringify(
			{
				name: "acme-checkout-service",
				version: "1.0.0",
				dependencies: { lodash: "4.17.15", axios: "1.5.0", zod: "3.23.8" },
			},
			null,
			2,
		),
	},
	{
		id: "python",
		label: "requirements.txt / uv.lock",
		icon: "python",
		text: [
			"# Python Lockfile / Requirements",
			"requests==2.25.0",
			"django==4.2.1",
			"urllib3==1.26.4",
			"pydantic==2.8.2",
		].join("\n"),
	},
];

export const SAMPLES: Readonly<
	Record<PlaygroundMode, { label: string; icon?: string; text: string }>
> = {
	scan: { label: "src/auth.ts", icon: "ts", text: 'const AWS_KEY = "AKIAIOSFODNN7EXAMPLE";\n' },
	audit: {
		label: AUDIT_PRESETS[0]?.label ?? "Cargo.lock",
		icon: "rust",
		text: AUDIT_PRESETS[0]?.text ?? "",
	},
	sniff: {
		label: "package.json",
		icon: "npm",
		text: '{\n  "dependencies": {\n    "lodash": "4.17.15",\n    "axios": "1.5.0"\n  }\n}',
	},
};

export const MODES: ReadonlyArray<{
	id: PlaygroundMode;
	label: string;
	icon: string;
	cmd: string;
}> = [
	{ id: "scan", label: "Secret Scan", icon: "ts", cmd: "woof scan" },
	{ id: "audit", label: "Supply Chain Audit", icon: "rust", cmd: "woof audit" },
	{ id: "sniff", label: "Dependency Graph", icon: "pnpm", cmd: "woof sniff" },
];

/**
 * Resolves the appropriate ecosystem brand icon for a given lockfile or source filename.
 */
export function detectEcosystemIcon(filename: string): string {
	const lower = filename.toLowerCase();
	if (lower.endsWith(".toml")) return "toml";
	if (lower.includes("cargo") || lower.endsWith(".rs")) return "rust";
	if (lower.includes("pnpm")) return "pnpm";
	if (lower.includes("yarn")) return "yarn";
	if (lower.includes("package")) return "npm";
	if (lower.includes("uv.lock")) return "uv";
	if (lower.includes("requirements") || lower.includes("poetry.lock") || lower.endsWith(".py")) {
		return "python";
	}
	return "ts";
}
