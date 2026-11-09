// src/components/home/show-scan-showcase.tsx
"use client";

import { type ReactElement, useState } from "react";
import { ShowCliTabBar, ShowCodeWindow, ShowCopyButton, ShowTerminalWindow } from "@/components/ui";
import { SCAN_SAMPLES } from "./home-data";
import { RenderFeatureRow } from "./render-feature-row";

/**
 * Renders the secret scanning showcase with language tabs and redacted terminal output.
 */
export function ShowScanShowcase(): ReactElement | null {
	const [activeId, setActiveId] = useState<string>("ts");
	const sample = SCAN_SAMPLES.find((s) => s.id === activeId) ?? SCAN_SAMPLES[0];
	if (!sample) return null;
	const sampleCode = sample.lines.map((l) => l.text).join("\n");

	return (
		<RenderFeatureRow
			eyebrow="Secret scanning · woof scan & check"
			title="Catch leaked keys before you push."
			description="Instead of running dozens of slow regular expressions over every line, Rustywoof looks for known token prefixes first, checks the matching slice with a linear-time regex, and measures character randomness so dummy strings do not trigger false alarms."
			detail="Every secret found in your files is masked with asterisks in the terminal output, and woof check returns exit code 1 so your CI build stops immediately."
			cta={{ label: "How scanning works", href: "/docs/concepts/secret-scanning" }}
		>
			<div className="flex flex-col overflow-hidden rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) shadow-(--rw-window-shadow)">
				<ShowCliTabBar
					items={SCAN_SAMPLES}
					activeId={sample.id}
					onSelect={setActiveId}
					rightAction={<ShowCopyButton text={sampleCode} />}
				/>
				<div key={sample.id} className="rw-animate-in">
					<ShowCodeWindow
						filename={sample.filename}
						icon={sample.icon}
						lines={sample.lines}
						hideHeader
					/>
				</div>
			</div>
			<ShowTerminalWindow
				key={sample.id}
				icon={sample.icon}
				label="Scan"
				title={`woof scan ${sample.filename}`}
				lines={sample.terminal}
			/>
		</RenderFeatureRow>
	);
}
