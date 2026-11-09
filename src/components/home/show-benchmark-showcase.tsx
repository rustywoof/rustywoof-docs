// src/components/home/show-benchmark-showcase.tsx
import type { ReactElement } from "react";
import { ShowTerminalWindow } from "@/components/ui";
import { RenderFeatureRow } from "./render-feature-row";

/**
 * Renders the memory-mapped throughput benchmark showcase.
 */
export function ShowBenchmarkShowcase(): ReactElement {
	return (
		<RenderFeatureRow
			reverse
			eyebrow="Speed · memory-mapped files"
			title="238.51 MiB/s across 21,000 files."
			description="If a pre-commit hook takes ten seconds, people bypass it. Rustywoof maps files directly from disk into memory and splits the work across all CPU cores, scanning a 577 MiB repository in 2.42 seconds."
			detail="Fast enough to run on every git commit without slowing down your workflow, and light enough to run on small CI containers."
			cta={{ label: "Read the concepts", href: "/docs/concepts" }}
		>
			<ShowTerminalWindow
				icon="rust"
				label="Benchmark"
				title="woof check . --json"
				lines={[
					{
						id: "b1",
						text: "[INFO] Sweep complete. Analyzed 21,341 files in 2.42s.",
						tone: "muted",
					},
					{
						id: "b2",
						text: '{"status":"failure","files_scanned":21341,"threats":1}',
						tone: "danger",
					},
				]}
			/>
		</RenderFeatureRow>
	);
}
