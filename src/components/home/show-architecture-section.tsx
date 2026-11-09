// src/components/home/show-architecture-section.tsx
import type { ReactElement } from "react";
import { FEATURES } from "./features-data";

/**
 * Renders the feature grid at a size that matches the rest of the page.
 */
export function ShowArchitectureSection(): ReactElement {
	return (
		<section className="flex flex-col gap-10 py-8">
			<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
				{FEATURES.map((feature) => (
					<article key={feature.id} className="flex flex-col gap-3">
						<div className="flex items-center gap-2.5">
							<h3 className="m-0 text-xl sm:text-2xl font-semibold tracking-tight text-(--text-primary)">
								{feature.title}
							</h3>
						</div>
						<p className="m-0 text-base sm:text-lg leading-relaxed text-(--text-secondary)">
							{feature.desc}
						</p>
					</article>
				))}
			</div>
		</section>
	);
}
