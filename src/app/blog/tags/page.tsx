// src/app/blog/tags/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ShowBlogHeaderBanner } from "@/components/blog";
import { ShowActionLink } from "@/components/ui";
import { getTagCounts } from "@/lib";

export const metadata: Metadata = {
	title: "All Tags | Rustywoof Blog",
	description: "Browse Rustywoof blog articles by topic tag.",
};

/**
 * Renders the /blog/tags directory listing all tags and their post counts.
 */
export default function BlogTagsIndexPage(): ReactElement {
	const tags = getTagCounts();

	return (
		<div className="flex w-full flex-col gap-6">
			<ShowBlogHeaderBanner
				backHref="/blog"
				backLabel="Back to Blog"
				title="All Tags"
				subtitle={`${tags.length} tags in total.`}
			/>
			<div className="flex flex-wrap items-center gap-4">
				{tags.map((item) => (
					<div
						key={item.tag}
						className="flex items-center justify-between gap-6 border border-(--border) bg-(--surface-raised) px-4 py-2.5"
					>
						<ShowActionLink href={`/blog/tags/${item.tag}`} className="font-mono text-sm">
							#{item.tag}
						</ShowActionLink>
						<span className="font-mono text-xs text-(--text-secondary)">{item.count}</span>
					</div>
				))}
			</div>
		</div>
	);
}
