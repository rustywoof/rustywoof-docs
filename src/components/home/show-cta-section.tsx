// src/components/home/show-cta-section.tsx
import type { ReactElement } from "react";
import { ShowActionLink } from "@/components/ui";

/**
 * Renders the closing call to action with pill buttons.
 */
export function ShowCtaSection(): ReactElement {
	return (
		<section className="flex flex-col items-start gap-6 pt-4 sm:items-center sm:text-center">
			<h2 className="m-0 text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-(--text-primary)">
				Keep secrets and vulnerable packages{" "}
				<span className="text-(--accent)">out of your repo.</span>
			</h2>
			<p className="m-0 max-w-2xl text-lg sm:text-xl text-(--text-secondary)">
				Install in seconds, scan in milliseconds, and block leaks before they are committed.
			</p>
			<div className="flex flex-wrap items-center gap-3 pt-2">
				<ShowActionLink href="/docs/installation" variant="primary">
					Install Rustywoof
				</ShowActionLink>
				<ShowActionLink href="https://github.com/ianramy/rustywoof" external>
					View on GitHub
				</ShowActionLink>
			</div>
		</section>
	);
}
