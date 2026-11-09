// src/components/home/show-supply-chain-showcase.tsx
import type { ReactElement } from "react";
import type { TerminalLine } from "@/components";
import { ShowTerminalWindow } from "@/components/ui";
import { RenderFeatureRow } from "./render-feature-row";

const SNIFF_TRACE: readonly TerminalLine[] = [
	{ id: "d1", text: "$ woof sniff django", tone: "accent" },
	{ id: "d2", text: "Dependency trace for django:", tone: "muted" },
	{ id: "d3", text: "django@6.1.1", tone: "accent" },
	{ id: "d4", text: "├── code@0.1.0 (devDependencies)" },
	{ id: "d5", text: "├── server@0.1.0 (dependencies)" },
	{ id: "d10", text: "Found 1 version of django", tone: "success" },
];

const AUDIT_FLOW: readonly TerminalLine[] = [
	{ id: "f1", text: "$ woof audit --prod --audit-level high", tone: "accent" },
	{ id: "f2", text: "[INFO] Extracted 190 dependencies across 3 ecosystems.", tone: "muted" },
	{ id: "f4", text: "✓ Audit complete in 1.74s. Zero vulnerabilities detected.", tone: "success" },
	{ id: "f5", text: "\u00A0" },
	{ id: "f6", text: "$ woof remediate lodash 4.17.21", tone: "accent" },
	{ id: "f8", text: "✓ Remediation successful.", tone: "success" },
];

/**
 * Renders the supply-chain lockfile audit and dependency graph tracing showcase.
 */
export function ShowSupplyChainShowcase(): ReactElement {
	return (
		<RenderFeatureRow
			eyebrow="Dependency auditing · audit · sniff · remediate"
			title="Find vulnerable packages and see what pulled them in."
			description="Rustywoof reads exact package versions from Cargo.lock, package-lock.json, pnpm-lock.yaml, yarn.lock, uv.lock, and poetry.lock, then checks them against the OSV advisory database."
			detail="When a sub-dependency is flagged, run woof sniff to see the exact parent package that brought it into your project, and woof remediate to bump it to a patched version."
			cta={{ label: "Supply chain guide", href: "/docs/concepts/supply-chain" }}
		>
			<ShowTerminalWindow
				icon="pnpm"
				label="Audit"
				title="Lockfile audit & remediation"
				lines={AUDIT_FLOW}
			/>
			<ShowTerminalWindow
				icon="uv"
				label="Trace"
				title="Dependency graph walker"
				lines={SNIFF_TRACE}
			/>
		</RenderFeatureRow>
	);
}
