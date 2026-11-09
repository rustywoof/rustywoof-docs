// src/components/home/show-config-showcase.tsx
import type { ReactElement } from "react";
import { type CodeLine, ShowCodeWindow } from "@/components/ui";
import { RenderFeatureRow } from "./render-feature-row";

const TOML_LINES: readonly CodeLine[] = [
	{ line: 1, text: "[core]" },
	{ line: 2, text: 'excludes = ["node_modules/", "target/", ".venv/"]' },
	{ line: 3, text: "threads = 0 # auto-detect CPU cores" },
	{ line: 4, text: "" },
	{ line: 5, text: "[scanner]" },
	{ line: 6, text: "entropy_threshold = 4.5" },
	{ line: 7, text: "max_file_size_mb = 15" },
	{ line: 8, text: "" },
	{ line: 9, text: "[audit]" },
	{ line: 10, text: 'fail_on = "high"' },
	{ line: 11, text: "" },
	{ line: 12, text: "[[rules]]" },
	{ line: 13, text: 'id = "corp-internal-api-key"' },
	{ line: 14, text: 'prefix = "acme_live_"' },
	{ line: 15, text: 'pattern = "^acme_live_[a-zA-Z0-9]{32}$"' },
];

/**
 * Renders the .woof.toml configuration showcase without repetitive headers.
 */
export function ShowConfigShowcase(): ReactElement {
	return (
		<RenderFeatureRow
			eyebrow="Configuration · .woof.toml"
			title="One config file shared across laptops and CI."
			description="Rustywoof runs out of the box without configuration. When you need to ignore test fixtures, adjust entropy sensitivity, or add rules for internal company tokens, run woof init to generate a .woof.toml file at the root of your repo."
			detail="Committing .woof.toml keeps pre-commit hooks and CI checks on the exact same rules."
			cta={{ label: "Configuration guide", href: "/docs/configuration" }}
		>
			<ShowCodeWindow filename=".woof.toml" badge="woof init" lines={TOML_LINES} />
		</RenderFeatureRow>
	);
}
