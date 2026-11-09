// src/components/build-toml-explorer.tsx
"use client";

import { type ReactElement, useState } from "react";
import { type CodeLine, ShowActionButton, ShowCodeWindow } from "@/components/ui";

interface TomlSection {
	readonly id: string;
	readonly title: string;
	readonly summary: string;
	readonly badge: string;
	readonly lines: readonly CodeLine[];
}

const TOML_SECTIONS: readonly TomlSection[] = [
	{
		id: "core",
		title: "[core] — Engine & Threading Defaults",
		summary: "Configures file discovery rules, parallel thread pools, and directory exclusions.",
		badge: "woof init",
		lines: [
			{ line: 1, text: "[core]" },
			{ line: 2, text: 'excludes = ["node_modules/", "target/", ".git/"]' },
			{ line: 3, text: "threads = 0 # 0 = auto-detect cores" },
			{ line: 4, text: "respect_gitignore = true" },
		],
	},
	{
		id: "scanner",
		title: "[scanner] — Shannon Entropy Thresholds",
		summary: "Tunes token-matching sensitivity and sets the maximum file size for scanning.",
		badge: "woof scan",
		lines: [
			{ line: 1, text: "[scanner]" },
			{ line: 2, text: "# Entropy threshold: 3.0 = Lenient | 4.5 = Balanced | 5.0 = Strict" },
			{ line: 3, text: "entropy_threshold = 4.5" },
			{ line: 4, text: "max_file_size_mb = 15" },
		],
	},
	{
		id: "suppressions",
		title: "[ignore-paths] — False-Positive Whitelist",
		summary: "Whitelists mock test credentials and cryptographic fixture files.",
		badge: "woof check",
		lines: [
			{ line: 1, text: "[ignore-paths]" },
			{ line: 2, text: "secrets = [" },
			{ line: 3, text: '  "AKIAIOSFODNN7EXAMPLE",' },
			{ line: 4, text: '  "eyJhbGciOiJIUzI1NiJ9.test.mock"' },
			{ line: 5, text: "]" },
			{ line: 6, text: "files = [" },
			{ line: 7, text: '  "tests/fixtures/mock_data.json",' },
			{ line: 8, text: '  "src/crypto/constants.rs"' },
			{ line: 9, text: "]" },
		],
	},
	{
		id: "audit",
		title: "[audit] — Supply Chain Severity Thresholds",
		summary: "Configures minimum CI failure severity and disputed CVE ignore lists.",
		badge: "woof audit",
		lines: [
			{ line: 1, text: "[audit]" },
			{ line: 2, text: 'fail_on = "high" # low | medium | high | critical' },
			{ line: 3, text: "ignore_cves = [" },
			{ line: 4, text: '  "CVE-2023-12345",' },
			{ line: 5, text: '  "GHSA-x213-abc1"' },
			{ line: 6, text: "]" },
		],
	},
];

/**
 * Renders an interactive configuration explorer alongside a CodeWindow.
 */
export function BuildTomlExplorer(): ReactElement | null {
	const [activeId, setActiveId] = useState<string>("core");
	const current = TOML_SECTIONS.find((s) => s.id === activeId) ?? TOML_SECTIONS[0];
	if (!current) return null;

	return (
		<div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
			<div
				className="flex flex-col divide-y divide-(--rw-code-border) rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) p-4 shadow-(--rw-window-shadow)"
				role="tablist"
			>
				{TOML_SECTIONS.map((section) => (
					<div key={section.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
						<div>
							<ShowActionButton
								id={`toml:${section.id}`}
								role="tab"
								active={section.id === current.id}
								onClick={() => setActiveId(section.id)}
							>
								{section.title}
							</ShowActionButton>
						</div>
						<span className="px-3 text-xs text-(--text-secondary)">{section.summary}</span>
					</div>
				))}
			</div>
			<ShowCodeWindow filename=".woof.toml" badge={current.badge} lines={current.lines} />
		</div>
	);
}
