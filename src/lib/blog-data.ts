// src/lib/blog-data.ts
export interface BlogAuthor {
	readonly name: string;
	readonly role: string;
	readonly githubHandle: string;
	readonly githubUrl: string;
	readonly avatarUrl: string;
}

export interface BlogPostMeta {
	readonly slug: string;
	readonly title: string;
	readonly description: string;
	readonly date: string;
	readonly readTime: string;
	readonly tags: readonly string[];
	readonly coverImage: string;
	readonly coverAlt: string;
	readonly coverCredit?: string;
	readonly author: BlogAuthor;
}

export const MAINTAINER: BlogAuthor = {
	name: "Ian Ramy",
	role: "Maintainer",
	githubHandle: "ianramy",
	githubUrl: "https://github.com/ianramy",
	avatarUrl: "https://github.com/ianramy.png",
};

export const BLOG_TAGS = ["release", "feature", "rust", "announcement"] as const;

export const BLOG_POSTS: readonly BlogPostMeta[] = [
	{
		slug: "rustywoof-devs-best-friend",
		title: "Rustywoof: Dev's Best Friend",
		description:
			"Why we built a single local tool in Rust to catch leaked keys and check lockfiles against OSV without sending your code to the cloud.",
		date: "9 Nov 2026",
		readTime: "8 min read",
		tags: ["release", "feature", "rust", "announcement"],
		coverImage:
			"https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1600&q=85",
		coverAlt: "Happy dog smiling warmly at its owner outdoors",
		coverCredit: "Photo via Unsplash",
		author: MAINTAINER,
	},
];

/**
 * Normalizes a raw blog topic tag into a trimmed lowercase slug.
 */
export function normalizeTagSlug(rawTag: string): string {
	return rawTag.trim().toLowerCase();
}

/**
 * Filters the list of blog posts to those matching the given tag slug.
 */
export function filterPostsByTag(tag: string): readonly BlogPostMeta[] {
	const target = normalizeTagSlug(tag);
	if (!target) return [];
	return BLOG_POSTS.filter((post) =>
		post.tags.some((postTag) => normalizeTagSlug(postTag) === target),
	);
}

/**
 * Calculates post frequencies across all registered blog tags.
 */
export function getTagCounts(): ReadonlyArray<{ readonly tag: string; readonly count: number }> {
	const counts = new Map<string, number>();
	for (const tag of BLOG_TAGS) {
		const clean = normalizeTagSlug(tag);
		if (clean) counts.set(clean, 0);
	}
	for (const post of BLOG_POSTS) {
		for (const rawTag of post.tags) {
			const clean = normalizeTagSlug(rawTag);
			if (!clean) continue;
			counts.set(clean, (counts.get(clean) ?? 0) + 1);
		}
	}
	return Array.from(counts.entries()).map(([tag, count]) => ({ tag, count }));
}
