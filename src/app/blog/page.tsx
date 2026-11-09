// src/app/blog/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { RenderBlogPostCard, ShowBlogHeaderBanner } from "@/components/blog";
import { ShowActionLink } from "@/components/ui";
import { BLOG_POSTS, getTagCounts } from "@/lib";

export const metadata: Metadata = {
	title: "Blog | Rustywoof",
	description: "Announcements, architecture deep-dives, and supply chain threat intelligence.",
};

/**
 * Renders the full-width blog index with Unsplash cover photography and spacious pill tags.
 */
export default function BlogIndexPage(): ReactElement {
	const tags = getTagCounts();

	return (
		<div className="flex w-full flex-col gap-10">
			<ShowBlogHeaderBanner
				title="Rustywoof Blog"
				subtitle="Engineering dispatches, release notes, and local supply-chain audit updates."
				rightAction={{ href: "/blog/tags", label: "Browse all tags" }}
			/>
			<div className="flex flex-wrap items-center gap-3 border-b border-(--border) pb-6">
				<span className="mr-2 font-mono text-sm uppercase tracking-wider text-(--text-secondary)">
					Filter by tag
				</span>
				{tags.map((item) => (
					<ShowActionLink key={item.tag} href={`/blog/tags/${item.tag}`} size="sm">
						#{item.tag} ({item.count})
					</ShowActionLink>
				))}
			</div>
			<div className="flex flex-col gap-10">
				{BLOG_POSTS.map((post) => (
					<RenderBlogPostCard key={post.slug} post={post} />
				))}
			</div>
		</div>
	);
}
