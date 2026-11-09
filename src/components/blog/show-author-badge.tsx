// src/components/blog/show-author-badge.tsx
import type { ReactElement } from "react";
import type { BlogAuthor } from "@/lib";
import { ShowAuthorAvatar } from "./show-author-avatar";

interface ShowAuthorBadgeProps {
	readonly author: BlogAuthor;
	readonly date?: string | undefined;
	readonly readTime?: string | undefined;
}

/**
 * Renders the maintainer's avatar, name and GitHub link with comfortable spacing.
 */
export function ShowAuthorBadge({ author, date, readTime }: ShowAuthorBadgeProps): ReactElement {
	return (
		<div className="flex flex-wrap items-center gap-4 text-base text-(--text-secondary)">
			<a
				href={author.githubUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="group/author inline-flex items-center gap-3 rounded-xl pr-2 no-underline transition-colors"
			>
				<ShowAuthorAvatar src={author.avatarUrl} name={author.name} />
				<span className="flex flex-col leading-tight">
					<span className="text-base font-semibold text-(--text-primary) transition-colors group-hover/author:text-(--accent)">
						{author.name}
					</span>
					<span className="text-xs font-medium text-(--text-secondary)">{author.role}</span>
				</span>
			</a>
			{date ? <span>· {date}</span> : null}
			{readTime ? <span>· {readTime}</span> : null}
		</div>
	);
}
