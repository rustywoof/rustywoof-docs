// src/components/home/features-data.ts

export const FEATURES = [
	{
		id: "speed",
		title: "Memory-Mapped Throughput",
		desc: "Traverses thousands files at multi-MiB/s speeds using zero-copy memory mapping and multi-core worker pools.",
	},
	{
		id: "multi",
		title: "Multi-Ecosystem Lockfiles",
		desc: "Audits and traces dependency trees natively across Rust (Cargo), TypeScript/Node (npm/pnpm/bun), and Python (PyPI/uv).",
	},
	{
		id: "sniff",
		title: "Deep Dependency Graph Sniffing",
		desc: "Walks lockfile graphs via woof sniff <package> to expose the exact transitive chain that introduced a vulnerable package.",
	},
	{
		id: "ci",
		title: "Strict CI/CD Gatekeeping",
		desc: "woof check executes in milliseconds and emits structured JSON with exit code 1 to halt compromised builds.",
	},
	{
		id: "hook",
		title: "Git Pre-Commit Hooks",
		desc: "woof hook install intercepts hardcoded tokens and private keys before git commit ever records them.",
	},
	{
		id: "privacy",
		title: "Redacted & Privacy-First",
		desc: "Secrets are automatically masked in terminal diagnostics, and OSV queries never transmit source code or file paths.",
	},
] as const;
