// src/components/show-home-content.tsx
import type { ReactElement } from "react";
import {
	ShowArchitectureSection,
	ShowBenchmarkShowcase,
	ShowConfigShowcase,
	ShowCtaSection,
	ShowHeroSection,
	ShowPrivacyShowcase,
	ShowScanShowcase,
	ShowSupplyChainShowcase,
} from "./home";

/**
 * Renders the full-width homepage with the shared page gutter.
 */
export function ShowHomeContent(): ReactElement {
	return (
		<div className="rw-gutter flex w-full max-w-none flex-col gap-20 py-12 sm:gap-28 sm:py-20 lg:gap-36 lg:py-24 pb-28 sm:pb-36">
			<ShowHeroSection />
			<p className="m-0 max-w-6xl text-xl sm:text-3xl lg:text-5xl font-normal leading-[1.35] tracking-tight text-(--text-secondary)">
				Rustywoof is a local{" "}
				<strong className="font-semibold text-(--accent)">secret scanner</strong> and{" "}
				<strong className="font-semibold text-(--accent)">dependency auditor</strong> for
				developers. It scans your files for leaked keys at multi-MiB/s, checks your{" "}
				<strong className="font-semibold text-(--accent)">lockfiles</strong> against OSV, and runs
				your git hooks and CI checks from{" "}
				<strong className="font-semibold text-(--accent)">one binary</strong>.
			</p>
			<ShowScanShowcase />
			<ShowBenchmarkShowcase />
			<ShowSupplyChainShowcase />
			<ShowPrivacyShowcase />
			<ShowConfigShowcase />
			<ShowArchitectureSection />
			<ShowCtaSection />
		</div>
	);
}
