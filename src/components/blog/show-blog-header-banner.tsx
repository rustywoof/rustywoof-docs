// src/components/blog/show-blog-header-banner.tsx
import type { ReactElement } from "react";
import { ShowActionLink } from "@/components/ui";

interface ShowBlogHeaderBannerProps {
	readonly backHref?: string | undefined;
	readonly backLabel?: string | undefined;
	readonly title: string;
	readonly subtitle: string;
	readonly rightAction?: { readonly href: string; readonly label: string } | undefined;
}

/**
 * Renders the header box for /blog, /blog/tags and /blog/tags/[tag].
 */
export function ShowBlogHeaderBanner({
	backHref,
	backLabel,
	title,
	subtitle,
	rightAction,
}: ShowBlogHeaderBannerProps): ReactElement {
	return (
		<header className="flex flex-col gap-4 rounded-2xl border border-(--border) bg-(--surface-raised) p-5 sm:p-10">
			{backHref && backLabel ? (
				<div>
					<ShowActionLink href={backHref}>{backLabel}</ShowActionLink>
				</div>
			) : null}
			<div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6">
				<h1 className="m-0 text-3xl sm:text-5xl font-bold tracking-tight text-(--text-primary)">
					{title}
				</h1>
				{rightAction ? (
					<ShowActionLink href={rightAction.href}>{rightAction.label}</ShowActionLink>
				) : null}
			</div>
			<p className="m-0 max-w-3xl text-base sm:text-xl leading-relaxed text-(--text-secondary)">
				{subtitle}
			</p>
		</header>
	);
}
