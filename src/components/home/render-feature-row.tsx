// src/components/home/render-feature-row.tsx
import type { ReactElement, ReactNode } from "react";
import { ShowActionLink } from "@/components/ui";

interface RenderFeatureRowProps {
	readonly eyebrow?: string | undefined;
	readonly title: string;
	readonly description: string;
	readonly detail?: string | undefined;
	readonly cta?: { readonly label: string; readonly href: string } | undefined;
	readonly reverse?: boolean | undefined;
	readonly children: ReactNode;
}

/**
 * Renders a two-column feature row scaled to match the hero.
 */
export function RenderFeatureRow({
	eyebrow,
	title,
	description,
	detail,
	cta,
	reverse = false,
	children,
}: RenderFeatureRowProps): ReactElement {
	const leftOrder = reverse ? "lg:order-2" : "";
	const rightOrder = reverse ? "lg:order-1" : "";

	return (
		<section className="rw-animate-in grid w-full grid-cols-1 items-start gap-10 py-6 sm:gap-12 sm:py-8 lg:grid-cols-12 lg:gap-16">
			<div
				className={`flex min-w-0 flex-col items-start gap-5 sm:gap-6 lg:sticky lg:top-28 lg:col-span-5 ${leftOrder}`}
			>
				{eyebrow ? (
					<span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest text-(--accent)">
						{eyebrow}
					</span>
				) : null}
				<h2 className="m-0 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-(--text-primary)">
					{title}
				</h2>
				<p className="m-0 text-base sm:text-xl leading-relaxed text-(--text-secondary)">
					{description}
				</p>
				{detail ? (
					<p className="m-0 border-l-2 border-(--accent) pl-4 text-base sm:text-lg leading-relaxed text-(--text-primary)">
						{detail}
					</p>
				) : null}
				{cta ? <ShowActionLink href={cta.href}>{cta.label}</ShowActionLink> : null}
			</div>
			<div className={`flex min-w-0 flex-col gap-6 lg:col-span-7 ${rightOrder}`}>{children}</div>
		</section>
	);
}
