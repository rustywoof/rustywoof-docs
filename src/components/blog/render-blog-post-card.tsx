// src/components/blog/render-blog-post-card.tsx
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { ShowActionLink } from "@/components/ui";
import type { BlogPostMeta } from "@/lib";
import { ShowAuthorBadge } from "./show-author-badge";

interface RenderBlogPostCardProps {
	readonly post: BlogPostMeta;
}

/**
 * Renders the cover image link for a blog post card.
 */
function RenderBlogCoverThumb({ post }: { readonly post: BlogPostMeta }): ReactElement {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className="relative block aspect-16/10 w-full overflow-hidden rounded-xl border border-(--border) bg-(--surface) lg:col-span-5"
		>
			<Image
				src={post.coverImage}
				alt={post.coverAlt}
				fill
				sizes="(max-width: 1024px) 100vw, 42vw"
				className="object-cover transition-transform duration-500 group-hover:scale-105"
			/>
		</Link>
	);
}

/**
 * Renders an article card with cover photo, tags, author metadata, and action link.
 */
export function RenderBlogPostCard({ post }: RenderBlogPostCardProps): ReactElement {
	return (
		<article className="rw-card-hover group grid w-full grid-cols-1 items-center gap-8 overflow-hidden rounded-2xl border border-(--border) bg-(--surface-raised) p-6 sm:p-10 lg:grid-cols-12 lg:gap-12">
			<div className="flex min-w-0 flex-col justify-between gap-6 lg:col-span-7">
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-2.5">
						{post.tags.map((tag) => (
							<ShowActionLink key={tag} href={`/blog/tags/${tag}`} size="sm" className="uppercase">
								#{tag}
							</ShowActionLink>
						))}
					</div>
					<h2 className="m-0 text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
						<Link
							href={`/blog/${post.slug}`}
							className="text-(--text-primary) no-underline transition-colors group-hover:text-(--accent)"
						>
							{post.title}
						</Link>
					</h2>
					<p className="m-0 text-lg sm:text-xl leading-relaxed text-(--text-secondary)">
						{post.description}
					</p>
				</div>
				<div className="flex flex-wrap items-center justify-between gap-6 border-t border-(--border) pt-6">
					<ShowAuthorBadge author={post.author} date={post.date} readTime={post.readTime} />
					<ShowActionLink href={`/blog/${post.slug}`} variant="primary">
						Read article
					</ShowActionLink>
				</div>
			</div>
			<RenderBlogCoverThumb post={post} />
		</article>
	);
}
