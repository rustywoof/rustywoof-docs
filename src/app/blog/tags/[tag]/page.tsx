// src/app/blog/tags/[tag]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { RenderBlogPostCard, ShowBlogHeaderBanner } from "@/components/blog";
import { BLOG_TAGS, filterPostsByTag, normalizeTagSlug } from "@/lib";

interface TagPageProps {
	readonly params: Promise<{ readonly tag: string }>;
}

/**
 * Generates static tag routes for all configured blog tags.
 */
export function generateStaticParams(): Array<{ tag: string }> {
	return BLOG_TAGS.map((tag) => ({ tag }));
}

/**
 * Generates metadata for an individual blog tag archive page.
 */
export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
	const { tag } = await props.params;
	const clean = normalizeTagSlug(tag);
	return {
		title: `#${clean} | Rustywoof Blog`,
		description: `Articles tagged with ${clean} on the Rustywoof Blog.`,
	};
}

/**
 * Renders all blog articles matching a specific tag while linking articles to /blog/[slug].
 */
export default async function BlogTagDetailPage(props: TagPageProps): Promise<ReactElement> {
	const { tag } = await props.params;
	const clean = normalizeTagSlug(tag);
	const posts = filterPostsByTag(clean);
	if (!clean || posts.length === 0) notFound();

	const displayTitle = clean.charAt(0).toUpperCase() + clean.slice(1);

	return (
		<div className="flex w-full flex-col gap-10">
			<ShowBlogHeaderBanner
				backHref="/blog/tags"
				backLabel="All Tags"
				title={`#${displayTitle}`}
				subtitle={`${posts.length} matching ${posts.length === 1 ? "article" : "articles"}.`}
			/>
			<div className="flex flex-col gap-10">
				{posts.map((post) => (
					<RenderBlogPostCard key={post.slug} post={post} />
				))}
			</div>
		</div>
	);
}
